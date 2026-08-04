import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { db } from '../db';
import { photos } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { StorageService } from '../storage';
import { enqueuePhotoJob } from '../queue';
import { config } from '../config';
import { PipelineLogger } from '../logger';
import * as FileType from 'file-type';

const router = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Multer memory storage configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.photo.maxSizeBytes,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (config.photo.allowedExtensions.includes(ext) || config.photo.allowedMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed formats: ${config.photo.allowedExtensions.join(', ')}`));
    }
  },
});

/**
 * POST /api/photos
 * Create photo record (via direct Vercel Blob URL JSON payload or multipart upload) and enqueue Sharp worker job.
 */
router.post('/', (req: Request, res: Response, next: any) => {
  // If JSON body contains inputUrl (uploaded via Vercel Blob SDK), skip Multer parsing
  if (req.body && req.body.inputUrl) {
    return next();
  }
  upload.single('photo')(req, res, next);
}, async (req: Request, res: Response, next) => {
  try {
    let inputUrl = req.body?.inputUrl;
    let originalFileName = req.body?.originalFileName;
    let originalSize = req.body?.originalSize || 0;
    let originalMimeType = req.body?.originalMimeType || 'image/jpeg';
    const userId = (req.body?.userId as string) || 'admin';
    // Direct-to-blob clients mint the id first so the original already sits in
    // photos/<userId>/<id>/; reuse it so the renditions land in the same folder.
    const photoId = UUID_RE.test(req.body?.id) ? (req.body.id as string) : uuidv4();
    const category = req.body?.category || 'General';
    const heading = req.body?.heading || null;
    const subHeading = req.body?.subHeading || null;
    const description = req.body?.description || null;
    const altText = req.body?.altText || null;
    const tags = req.body?.tags || null;

    if (req.file) {
      const fileTypeResult = await FileType.fromBuffer(req.file.buffer);
      if (!fileTypeResult || !config.photo.allowedMimetypes.includes(fileTypeResult.mime)) {
        return res.status(400).json({ error: 'Invalid file content detected.' });
      }

      originalFileName = req.file.originalname;
      originalMimeType = req.file.mimetype || 'image/jpeg';
      originalSize = req.file.size;
      const ext = path.extname(originalFileName) || '.jpg';
      const blobPath = `photos/${userId}/${photoId}/original${ext}`;

      inputUrl = await StorageService.uploadBlob(
        blobPath,
        req.file.buffer,
        originalMimeType
      );
    }

    if (!inputUrl) {
      return res.status(400).json({ error: 'No image file or blob inputUrl provided' });
    }

    if (!originalFileName) {
      originalFileName = inputUrl.split('/').pop() || 'photo.jpg';
    }

    const publishStatus = req.body?.publishStatus || 'published';

    // Create DB Record
    const [insertedPhoto] = await db
      .insert(photos)
      .values({
        id: photoId,
        userId,
        originalFileName,
        originalSize,
        originalMimeType,
        status: 'uploaded',
        publishStatus,
        inputPath: inputUrl,
        webpPath: inputUrl, // Immediately viewable fallback
        category,
        heading,
        subHeading,
        description,
        altText,
        tags,
      })
      .returning();

    await PipelineLogger.log(
      photoId,
      'API',
      `Received photo record [Category: ${category}] (${(originalSize / (1024 * 1024)).toFixed(2)} MB). Stored original in Vercel Blob CDN.`
    );

    // `skipConversion` is the operator's explicit "use it as-is" choice, made in
    // the upload dialog once it has been told conversion is unavailable. An
    // already-WebP file takes the same path because there is nothing to convert.
    //
    // Serving the original is safe here: webpPath was already set to inputUrl
    // above as an immediately viewable fallback. What was missing was a terminal
    // status, so the asset stayed mid-pipeline forever and never appeared in any
    // published list. Marking it completed is what makes it usable.
    const skipConversion = req.body?.skipConversion === true || req.body?.skipConversion === 'true';

    if (skipConversion) {
      await db
        .update(photos)
        .set({ status: 'completed', processedAt: new Date() })
        .where(eq(photos.id, photoId));

      insertedPhoto.status = 'completed';
      await PipelineLogger.log(
        photoId,
        'SUCCESS',
        'Conversion skipped at the operator\'s request. The uploaded file is served directly from blob storage.'
      );

      return res.status(201).json({ success: true, photo: insertedPhoto, converted: false });
    }

    // Enqueue background processing job
    try {
      await enqueuePhotoJob({
        photoId,
        userId,
        inputUrl,
        originalFileName,
        originalMimeType,
      });

      await PipelineLogger.log(photoId, 'QUEUE', 'Enqueued job to BullMQ image processing queue in Upstash Redis.');

      await db
        .update(photos)
        .set({ status: 'queued' })
        .where(eq(photos.id, photoId));

      insertedPhoto.status = 'queued';

      return res.status(201).json({ success: true, photo: insertedPhoto, queued: true });
    } catch (queueErr) {
      // The queue refused the job, so nothing will ever pick this asset up. It
      // used to be left on "uploaded" — indistinguishable from work in progress,
      // which is how media ended up stuck on "converting" indefinitely. Fall back
      // to serving the original and say so, rather than promising a conversion
      // that cannot happen.
      console.error('Queue dispatch failed; serving the original photo unconverted:', queueErr);
      await PipelineLogger.log(
        photoId,
        'ERROR',
        `Conversion queue unavailable (${queueErr}). Serving the uploaded file directly instead.`
      );

      await db
        .update(photos)
        .set({ status: 'completed', processedAt: new Date() })
        .where(eq(photos.id, photoId));

      insertedPhoto.status = 'completed';

      return res.status(201).json({
        success: true,
        photo: insertedPhoto,
        queued: false,
        converted: false,
        warning: 'Conversion is unavailable, so the original file is being served. Upload a WebP for the smallest file size.',
      });
    }
  } catch (error: any) {
    console.error('Photo upload endpoint error:', error);
    next(error);
  }
});

/**
 * GET /api/photos
 * List all uploaded photos with logs
 */
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const photoList = await db
      .select()
      .from(photos)
      .orderBy(desc(photos.createdAt));
    
    const photosWithLogs = await Promise.all(
      photoList.map(async (p) => ({
        ...p,
        logs: await PipelineLogger.getLogs(p.id),
      }))
    );

    res.json(photosWithLogs);
  } catch (error) {
    console.error('Failed to fetch photos:', error);
    next(error);
  }
});

/**
 * GET /api/photos/:id/status
 * Lightweight polling endpoint for photo status
 */
router.get('/:id/status', async (req: Request, res: Response, next) => {
  try {
    const photoId = String(req.params.id);
    const result = await db
      .select({
        id: photos.id,
        status: photos.status,
        errorMessage: photos.errorMessage,
        width: photos.width,
        height: photos.height,
        processedAt: photos.processedAt,
      })
      .from(photos)
      .where(eq(photos.id, photoId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch photo status:', error);
    next(error);
  }
});

/**
 * GET /api/photos/:id
 * Full metadata for a photo (including WebP URL and thumbnail URL)
 */
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    const photoId = String(req.params.id);
    const result = await db
      .select()
      .from(photos)
      .where(eq(photos.id, photoId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const logs = await PipelineLogger.getLogs(photoId);
    res.json({ ...result[0], logs });
  } catch (error) {
    console.error('Failed to fetch photo metadata:', error);
    next(error);
  }
});

/**
 * DELETE /api/photos/:id
 * Delete photo metadata and associated Vercel Blob assets
 */
router.delete('/:id', async (req: Request, res: Response, next) => {
  try {
    const photoId = String(req.params.id);
    const result = await db
      .select()
      .from(photos)
      .where(eq(photos.id, photoId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const photo = result[0];

    // Clean up Vercel Blobs asynchronously
    if (photo.inputPath) StorageService.deleteBlob(photo.inputPath);
    if (photo.webpPath) StorageService.deleteBlob(photo.webpPath);
    if (photo.thumbnailPath) StorageService.deleteBlob(photo.thumbnailPath);

    // Clean up Redis logs
    PipelineLogger.deleteLogs(photoId);

    // Delete DB record
    await db.delete(photos).where(eq(photos.id, photoId));

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Failed to delete photo:', error);
    next(error);
  }
});

export default router;
