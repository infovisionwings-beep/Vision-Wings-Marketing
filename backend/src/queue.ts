import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { config } from './config';

export interface VideoJobData {
  videoId: string;
  userId: string;
  inputUrl: string;
  originalFileName: string;
}

const QUEUE_NAME = 'video-processing-queue';

// Parse Redis connection details
let redisConnection: Redis;

try {
  redisConnection = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    tls: config.redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  });

  redisConnection.on('error', (err) => {
    console.error('[BullMQ Queue] Redis connection error:', err.message);
  });

  redisConnection.on('ready', () => {
    console.log('[BullMQ Queue] Redis connection ready!');
  });
} catch (error) {
  console.warn('Failed to initialize Redis connection for BullMQ:', error);
}

export const videoQueue = new Queue<VideoJobData>(QUEUE_NAME, {
  connection: redisConnection!,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export async function enqueueVideoJob(jobData: VideoJobData) {
  try {
    const job = await videoQueue.add('transcode-video', jobData);
    console.log(`Enqueued video job ${job.id} for videoId: ${jobData.videoId}`);
    return job;
  } catch (error) {
    console.error('Failed to enqueue video job:', error);
    throw error;
  }
}

/**
 * Can the conversion pipeline actually accept work right now?
 *
 * When the Upstash quota is exhausted every Redis command is refused, so jobs
 * were accepted, never queued, and the asset sat on "converting" forever with
 * nothing telling the operator why. Asking first lets the upload offer a way
 * through instead of silently stranding the file.
 *
 * A 3s ceiling keeps a hanging connection from blocking the request: an
 * unreachable queue is treated exactly like a refused one.
 */
export async function isQueueAvailable(): Promise<boolean> {
  if (!redisConnection) return false;
  try {
    // Deliberately a write, and deliberately not PING or EXISTS. Over an
    // exhausted Upstash quota those both still succeed — PING is unmetered and
    // reads stay permitted — while writes are refused. Probing with either
    // reported a healthy queue while every enqueue was being rejected. Adding a
    // job is a write, so only a write predicts it. The key expires on its own so
    // the probe leaves nothing behind.
    await Promise.race([
      redisConnection.set('conversion-probe', '1', 'EX', 30),
      new Promise((_, reject) => setTimeout(() => reject(new Error('redis probe timed out')), 3000)),
    ]);
    return true;
  } catch (err) {
    console.warn('[queue] conversion pipeline unavailable:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface PhotoJobData {
  photoId: string;
  userId: string;
  inputUrl: string;
  originalFileName: string;
  originalMimeType: string;
}

const PHOTO_QUEUE_NAME = 'photo-processing-queue';

export const photoQueue = new Queue<PhotoJobData>(PHOTO_QUEUE_NAME, {
  connection: redisConnection!,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export async function enqueuePhotoJob(jobData: PhotoJobData) {
  try {
    const job = await photoQueue.add('transcode-photo', jobData);
    console.log(`Enqueued photo job ${job.id} for photoId: ${jobData.photoId}`);
    return job;
  } catch (error) {
    console.error('Failed to enqueue photo job:', error);
    throw error;
  }
}
