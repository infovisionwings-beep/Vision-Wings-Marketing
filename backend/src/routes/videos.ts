import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { db } from '../db';
import { videos } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { StorageService } from '../storage';
import { enqueueVideoJob } from '../queue';
import { config } from '../config';
import { PipelineLogger } from '../logger';
import * as FileType from 'file-type';

const router = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Multer memory storage configuration (holds file in buffer for streaming upload to Vercel Blob)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.video.maxSizeBytes,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (config.video.allowedExtensions.includes(ext) || config.video.allowedMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed formats: ${config.video.allowedExtensions.join(', ')}`));
    }
  },
});

/**
 * POST /api/videos
 * Create video record (via direct Vercel Blob URL JSON payload or multipart upload) and enqueue FFmpeg worker job.
 */
router.post('/', (req: Request, res: Response, next: any) => {
  if (req.body && req.body.inputUrl) {
    return next();
  }
  upload.single('video')(req, res, next);
}, async (req: Request, res: Response, next) => {
  try {
    let inputUrl = req.body?.inputUrl;
    let originalFileName = req.body?.originalFileName;
    let originalSize = req.body?.originalSize || 0;
    const userId = (req.body?.userId as string) || 'admin';
    // Direct-to-blob clients mint the id first so the original already sits in
    // videos/<userId>/<id>/; reuse it so the renditions land in the same folder.
    const videoId = UUID_RE.test(req.body?.id) ? (req.body.id as string) : uuidv4();
    const category = req.body?.category || 'General';
    const heading = req.body?.heading || null;
    const subHeading = req.body?.subHeading || null;
    const description = req.body?.description || null;
    const tags = req.body?.tags || null;

    if (req.file) {
      const fileTypeResult = await FileType.fromBuffer(req.file.buffer);
      if (!fileTypeResult || !config.video.allowedMimetypes.includes(fileTypeResult.mime)) {
        return res.status(400).json({ error: 'Invalid file content detected.' });
      }

      originalFileName = req.file.originalname;
      originalSize = req.file.size;
      const ext = path.extname(originalFileName) || '.mp4';
      const blobPath = `videos/${userId}/${videoId}/original${ext}`;

      inputUrl = await StorageService.uploadBlob(
        blobPath,
        req.file.buffer,
        req.file.mimetype || 'video/mp4'
      );
    }

    if (!inputUrl) {
      return res.status(400).json({ error: 'No video file or blob inputUrl provided' });
    }

    if (!originalFileName) {
      originalFileName = inputUrl.split('/').pop() || 'video.mp4';
    }

    const publishStatus = req.body?.publishStatus || 'published';

    // Create DB Record
    const [insertedVideo] = await db
      .insert(videos)
      .values({
        id: videoId,
        userId,
        originalFileName,
        originalSize,
        status: 'uploaded',
        publishStatus,
        inputPath: inputUrl,
        category,
        heading,
        subHeading,
        description,
        tags,
      })
      .returning();

    await PipelineLogger.log(
      videoId,
      'API',
      `Received video payload [Category: ${category}] (${(originalSize / (1024 * 1024)).toFixed(2)} MB). Stored original file in Vercel Blob CDN.`
    );

    // `skipConversion` is the operator's explicit "use it as-is" choice, made in
    // the upload dialog once it has been told conversion is unavailable. An
    // already-WebM file takes the same path because there is nothing to convert.
    //
    // Playback still works: the player resolves webmPath || mp4Path ||
    // inputPath, and inputPath is always the uploaded file. What was missing was
    // a terminal status — the asset stayed mid-pipeline forever and never
    // appeared in any published list. There is no poster frame without the
    // worker, so the grid falls back to its placeholder image.
    const skipConversion = req.body?.skipConversion === true || req.body?.skipConversion === 'true';

    if (skipConversion) {
      await db
        .update(videos)
        .set({ status: 'completed', processedAt: new Date() })
        .where(eq(videos.id, videoId));

      insertedVideo.status = 'completed';
      await PipelineLogger.log(
        videoId,
        'SUCCESS',
        'Conversion skipped at the operator\'s request. The uploaded file is served directly from blob storage.'
      );

      return res.status(201).json({ success: true, video: insertedVideo, converted: false });
    }

    // Enqueue background processing job
    try {
      await enqueueVideoJob({
        videoId,
        userId,
        inputUrl,
        originalFileName,
      });

      await PipelineLogger.log(videoId, 'QUEUE', 'Enqueued job to BullMQ processing queue in Upstash Redis.');

      await db
        .update(videos)
        .set({ status: 'queued' })
        .where(eq(videos.id, videoId));

      insertedVideo.status = 'queued';

      return res.status(201).json({ success: true, video: insertedVideo, queued: true });
    } catch (queueErr) {
      // The queue refused the job, so nothing will ever pick this asset up. It
      // used to be left on "uploaded" — indistinguishable from work in progress,
      // which is how media ended up stuck on "converting" indefinitely. Fall back
      // to serving the original and say so, rather than promising a conversion
      // that cannot happen.
      console.error('Queue dispatch failed; serving the original video unconverted:', queueErr);
      await PipelineLogger.log(
        videoId,
        'ERROR',
        `Conversion queue unavailable (${queueErr}). Serving the uploaded file directly instead.`
      );

      await db
        .update(videos)
        .set({ status: 'completed', processedAt: new Date() })
        .where(eq(videos.id, videoId));

      insertedVideo.status = 'completed';

      return res.status(201).json({
        success: true,
        video: insertedVideo,
        queued: false,
        converted: false,
        warning: 'Conversion is unavailable, so the original file is being served. Upload a WebM for the smallest file size.',
      });
    }
  } catch (error: any) {
    console.error('Video upload endpoint error:', error);
    next(error);
  }
});

/**
 * GET /api/videos
 * List all uploaded videos
 */
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const videoList = await db
      .select()
      .from(videos)
      .orderBy(desc(videos.createdAt));
    
    const videosWithLogs = await Promise.all(
      videoList.map(async (v) => ({
        ...v,
        logs: await PipelineLogger.getLogs(v.id),
      }))
    );

    res.json(videosWithLogs);
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    next(error);
  }
});

/**
 * GET /api/videos/:id/status
 * Lightweight polling endpoint for video status
 */
router.get('/:id/status', async (req: Request, res: Response, next) => {
  try {
    const videoId = String(req.params.id);
    const result = await db
      .select({
        id: videos.id,
        status: videos.status,
        errorMessage: videos.errorMessage,
        durationSeconds: videos.durationSeconds,
        processedAt: videos.processedAt,
      })
      .from(videos)
      .where(eq(videos.id, videoId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch video status:', error);
    next(error);
  }
});

/**
 * GET /api/videos/:id
 * Full metadata for a video (including WebM URL, MP4 URL, thumbnail URL)
 */
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    const videoId = String(req.params.id);
    const result = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const logs = await PipelineLogger.getLogs(videoId);
    res.json({ ...result[0], logs });
  } catch (error) {
    console.error('Failed to fetch video metadata:', error);
    next(error);
  }
});

/**
 * DELETE /api/videos/:id
 * Delete video metadata and associated Vercel Blob assets
 */
router.delete('/:id', async (req: Request, res: Response, next) => {
  try {
    const videoId = String(req.params.id);
    const result = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = result[0];

    // Clean up Vercel Blobs asynchronously
    if (video.inputPath) StorageService.deleteBlob(video.inputPath);
    if (video.webmPath) StorageService.deleteBlob(video.webmPath);
    if (video.mp4Path) StorageService.deleteBlob(video.mp4Path);
    if (video.thumbnailPath) StorageService.deleteBlob(video.thumbnailPath);

    // Clean up Redis logs
    PipelineLogger.deleteLogs(videoId);

    // Delete DB record
    await db.delete(videos).where(eq(videos.id, videoId));

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Failed to delete video:', error);
    next(error);
  }
});


export default router;
