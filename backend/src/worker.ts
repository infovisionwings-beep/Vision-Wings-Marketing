import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { execFile } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import { db } from './db';
import { videos } from './db/schema';
import { eq } from 'drizzle-orm';
import { StorageService } from './storage';
import { config } from './config';
import { VideoJobData } from './queue';

const execFileAsync = util.promisify(execFile);

// Helper to fetch file from Blob URL and save to local disk
async function downloadFile(url: string, destPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download input file from ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(destPath, buffer);
}

// Extract duration in seconds using ffprobe
async function probeDuration(inputFilePath: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      inputFilePath,
    ]);
    const duration = parseFloat(stdout.trim());
    return isNaN(duration) ? '0' : duration.toFixed(2);
  } catch (err: any) {
    console.warn('ffprobe execution failed, defaulting duration to 0:', err.message);
    return '0';
  }
}

// Process single video job
async function processVideoJob(job: Job<VideoJobData>): Promise<void> {
  const { videoId, userId, inputUrl } = job.data;
  console.log(`[Worker] Started processing video job: ${videoId} (User: ${userId})`);

  // 1. Update DB status to processing
  await db
    .update(videos)
    .set({ status: 'processing', errorMessage: null })
    .where(eq(videos.id, videoId));

  const tempDir = StorageService.createTempDir(videoId);
  const inputFilePath = path.join(tempDir, 'input.mp4');
  const webmOutputPath = path.join(tempDir, 'output.webm');
  const mp4OutputPath = path.join(tempDir, 'output.mp4');
  const thumbnailPath = path.join(tempDir, 'thumbnail.jpg');

  try {
    // 2. Download original file from Vercel Blob
    console.log(`[Worker ${videoId}] Downloading original video...`);
    await downloadFile(inputUrl, inputFilePath);

    // 3. Inspect duration using ffprobe
    const durationSeconds = await probeDuration(inputFilePath);
    console.log(`[Worker ${videoId}] Video duration: ${durationSeconds} seconds`);

    // 4. Transcode to WebM (VP9 - lightweight primary format)
    console.log(`[Worker ${videoId}] Transcoding WebM...`);
    await execFileAsync('ffmpeg', [
      '-y',
      '-i', inputFilePath,
      ...config.video.webmParams,
      webmOutputPath,
    ]);

    // 5. Transcode to MP4 (H.264 - universal fallback format)
    console.log(`[Worker ${videoId}] Transcoding MP4...`);
    await execFileAsync('ffmpeg', [
      '-y',
      '-i', inputFilePath,
      ...config.video.mp4Params,
      mp4OutputPath,
    ]);

    // 6. Generate single poster thumbnail
    console.log(`[Worker ${videoId}] Extracting thumbnail poster image...`);
    await execFileAsync('ffmpeg', [
      '-y',
      '-ss', config.video.thumbnailTime,
      '-i', inputFilePath,
      '-frames:v', '1',
      '-q:v', '2',
      thumbnailPath,
    ]);

    // 7. Verify output files exist and are non-empty
    const webmStat = await fs.promises.stat(webmOutputPath);
    const mp4Stat = await fs.promises.stat(mp4OutputPath);
    const thumbStat = await fs.promises.stat(thumbnailPath);

    if (webmStat.size === 0 || mp4Stat.size === 0 || thumbStat.size === 0) {
      throw new Error('Transcoded output files or thumbnail are empty (0 bytes).');
    }

    // 8. Upload outputs to Vercel Blob storage
    console.log(`[Worker ${videoId}] Uploading output renditions to Vercel Blob...`);
    const webmBuffer = await fs.promises.readFile(webmOutputPath);
    const mp4Buffer = await fs.promises.readFile(mp4OutputPath);
    const thumbBuffer = await fs.promises.readFile(thumbnailPath);

    const webmUrl = await StorageService.uploadBlob(
      `videos/${userId}/${videoId}/output.webm`,
      webmBuffer,
      'video/webm'
    );

    const mp4Url = await StorageService.uploadBlob(
      `videos/${userId}/${videoId}/output.mp4`,
      mp4Buffer,
      'video/mp4'
    );

    const thumbnailUrl = await StorageService.uploadBlob(
      `videos/${userId}/${videoId}/thumbnail.jpg`,
      thumbBuffer,
      'image/jpeg'
    );

    // 9. Update DB: completed
    await db
      .update(videos)
      .set({
        status: 'completed',
        webmPath: webmUrl,
        mp4Path: mp4Url,
        thumbnailPath: thumbnailUrl,
        durationSeconds,
        processedAt: new Date(),
      })
      .where(eq(videos.id, videoId));

    console.log(`[Worker ${videoId}] Successfully processed video! WebM: ${webmUrl}, MP4: ${mp4Url}`);
  } catch (error: any) {
    console.error(`[Worker ${videoId}] Processing failed:`, error.message);

    await db
      .update(videos)
      .set({
        status: 'failed',
        errorMessage: error.message || 'Processing failed — please try another video file',
      })
      .where(eq(videos.id, videoId));

    throw error;
  } finally {
    // 10. Clean up temporary local directory
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
    console.error('[BullMQ Worker] Redis connection error:', err.message);
  });

  redisConnection.on('ready', () => {
    console.log('[BullMQ Worker] Redis connection ready!');
  });
} catch (err) {
  console.error('Redis worker connection failed:', err);
}

export const worker = new Worker<VideoJobData>(
  'video-processing-queue',
  async (job) => {
    await processVideoJob(job);
  },
  {
    connection: redisConnection!,
    concurrency: 2,
  }
);

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error:`, err.message);
});

console.log('[Worker] Video Processing Worker is active and listening for jobs...');
