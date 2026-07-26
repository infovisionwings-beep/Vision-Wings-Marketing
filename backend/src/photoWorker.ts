import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { execFile } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { db } from './db';
import { photos } from './db/schema';
import { eq } from 'drizzle-orm';
import { StorageService } from './storage';
import { config } from './config';
import { PhotoJobData } from './queue';
import { PipelineLogger } from './logger';

const execFileAsync = util.promisify(execFile);

// Helper to fetch file from Blob URL and save to local disk
async function downloadFile(url: string, destPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download input image from ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(destPath, buffer);
}

// Process single photo job
async function processPhotoJob(job: Job<PhotoJobData>): Promise<void> {
  const { photoId, userId, inputUrl, originalFileName, originalMimeType } = job.data;
  console.log(`[PhotoWorker] Started processing photo job: ${photoId} (User: ${userId})`);

  // 1. Update DB status to processing
  await db
    .update(photos)
    .set({ status: 'processing', errorMessage: null })
    .where(eq(photos.id, photoId));

  await PipelineLogger.log(photoId, 'WORKER', 'Job picked up by image transcoding worker engine.');

  const tempDir = StorageService.createTempDir(`photo_${photoId}`);
  const ext = path.extname(originalFileName) || '.jpg';
  const inputFilePath = path.join(tempDir, `input${ext}`);
  const webpOutputPath = path.join(tempDir, 'output.webp');
  const thumbnailPath = path.join(tempDir, 'thumbnail.webp');

  try {
    // 2. Download original file from Vercel Blob
    console.log(`[PhotoWorker ${photoId}] Downloading original photo...`);
    await PipelineLogger.log(photoId, 'WORKER', 'Downloading original image from Vercel Blob CDN...');
    await downloadFile(inputUrl, inputFilePath);

    // 3. Inspect image dimensions
    let width = 0;
    let height = 0;
    try {
      const meta = await sharp(inputFilePath, { animated: originalMimeType === 'image/gif' }).metadata();
      width = meta.width || 0;
      height = meta.pageHeight || meta.height || 0;
      console.log(`[PhotoWorker ${photoId}] Image dimensions: ${width}x${height}`);
      await PipelineLogger.log(photoId, 'WORKER', `Inspected resolution: ${width}x${height}px (${originalMimeType}).`);
    } catch (err: any) {
      console.warn(`[PhotoWorker ${photoId}] Could not inspect dimensions via sharp:`, err.message);
      await PipelineLogger.log(photoId, 'WORKER', 'Inspecting image dimensions...');
    }

    // 4. Transcode based on MIME type
    if (originalMimeType === 'image/gif' || ext.toLowerCase() === '.gif') {
      console.log(`[PhotoWorker ${photoId}] Transcoding GIF to Animated WebP via FFmpeg...`);
      await PipelineLogger.log(photoId, 'WORKER', 'Transcoding animated GIF to Animated WebP via FFmpeg (-lossless 0 -qscale 75)...');
      await execFileAsync('ffmpeg', [
        '-y',
        '-i', inputFilePath,
        ...config.photo.gifToWebpParams,
        webpOutputPath,
      ]);

      console.log(`[PhotoWorker ${photoId}] Extracting thumbnail frame from GIF...`);
      await PipelineLogger.log(photoId, 'WORKER', 'Generating 400px thumbnail frame from animated GIF...');
      await execFileAsync('ffmpeg', [
        '-y',
        '-i', inputFilePath,
        '-vframes', '1',
        '-vf', 'scale=400:-1',
        thumbnailPath,
      ]);
    } else {
      console.log(`[PhotoWorker ${photoId}] Transcoding static image to WebP via Sharp...`);
      await PipelineLogger.log(photoId, 'WORKER', 'Transcoding static image to high-efficiency WebP (quality: 82) via Sharp...');
      await sharp(inputFilePath)
        .webp({ quality: 82, effort: 4 })
        .toFile(webpOutputPath);

      console.log(`[PhotoWorker ${photoId}] Generating 400px thumbnail via Sharp...`);
      await PipelineLogger.log(photoId, 'WORKER', 'Generating 400px thumbnail rendition via Sharp...');
      await sharp(inputFilePath)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(thumbnailPath);
    }

    // 5. Verify output files exist and are non-empty
    const webpStat = await fs.promises.stat(webpOutputPath);
    const thumbStat = await fs.promises.stat(thumbnailPath);

    if (webpStat.size === 0 || thumbStat.size === 0) {
      throw new Error('Transcoded WebP output files or thumbnail are empty (0 bytes).');
    }

    // 6. Upload outputs to Vercel Blob storage
    console.log(`[PhotoWorker ${photoId}] Uploading WebP renditions to Vercel Blob...`);
    await PipelineLogger.log(photoId, 'WORKER', 'Uploading transcoded WebP renditions to Vercel Blob CDN...');
    const webpBuffer = await fs.promises.readFile(webpOutputPath);
    const thumbBuffer = await fs.promises.readFile(thumbnailPath);

    const webpUrl = await StorageService.uploadBlob(
      `photos/${userId}/${photoId}/output.webp`,
      webpBuffer,
      'image/webp'
    );

    const thumbnailUrl = await StorageService.uploadBlob(
      `photos/${userId}/${photoId}/thumbnail.webp`,
      thumbBuffer,
      'image/webp'
    );

    // 7. Update DB: completed
    await db
      .update(photos)
      .set({
        status: 'completed',
        webpPath: webpUrl,
        thumbnailPath: thumbnailUrl,
        width,
        height,
        processedAt: new Date(),
      })
      .where(eq(photos.id, photoId));

    await PipelineLogger.log(photoId, 'SUCCESS', '🎉 Image transcoding completed successfully! WebP renditions ready on CDN.');
    console.log(`[PhotoWorker ${photoId}] Successfully processed photo! WebP: ${webpUrl}`);
  } catch (error: any) {
    console.error(`[PhotoWorker ${photoId}] Processing failed:`, error.message);
    await PipelineLogger.log(photoId, 'ERROR', `❌ Processing failed: ${error.message || 'Unknown error'}`);

    await db
      .update(photos)
      .set({
        status: 'failed',
        errorMessage: error.message || 'Processing failed — please try another image file',
      })
      .where(eq(photos.id, photoId));

    throw error;
  } finally {
    // 8. Clean up temporary local directory
    StorageService.removeTempDir(tempDir);
  }
}

// Initialize BullMQ Worker
let redisConnection: Redis;
try {
  redisConnection = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    tls: config.redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  });

  redisConnection.on('error', (err) => {
    console.error('[BullMQ PhotoWorker] Redis connection error:', err.message);
  });

  redisConnection.on('ready', () => {
    console.log('[BullMQ PhotoWorker] Redis connection ready!');
  });
} catch (err) {
  console.error('Redis photoWorker connection failed:', err);
}

export const photoWorker = new Worker<PhotoJobData>(
  'photo-processing-queue',
  async (job) => {
    await processPhotoJob(job);
  },
  {
    connection: redisConnection!,
    concurrency: 5,
  }
);

photoWorker.on('completed', (job) => {
  console.log(`[PhotoWorker] Job ${job.id} completed!`);
});

photoWorker.on('failed', (job, err) => {
  console.error(`[PhotoWorker] Job ${job?.id} failed with error:`, err.message);
});

console.log('[PhotoWorker] Photo Processing Worker is active and listening for jobs...');
