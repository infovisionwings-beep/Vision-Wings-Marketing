import { Queue } from 'bullmq';
import Redis from 'ioredis';

export interface VideoJobData {
  videoId: string;
  userId: string;
  inputUrl: string;
  originalFileName: string;
}

const QUEUE_NAME = 'video-processing-queue';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redisConnection: Redis | null = null;
try {
  redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  });
} catch (error) {
  console.warn('Failed to initialize Redis connection:', error);
}

export const videoQueue = redisConnection
  ? new Queue<VideoJobData>(QUEUE_NAME, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    })
  : null;

export async function enqueueVideoJob(jobData: VideoJobData) {
  if (!videoQueue) {
    console.warn('videoQueue not available, job pending worker poll');
    return;
  }
  try {
    const job = await videoQueue.add('transcode-video', jobData);
    console.log(`Enqueued video job ${job.id} for videoId: ${jobData.videoId}`);
    return job;
  } catch (error) {
    console.error('Failed to enqueue video job:', error);
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

export const photoQueue = redisConnection
  ? new Queue<PhotoJobData>(PHOTO_QUEUE_NAME, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    })
  : null;

export async function enqueuePhotoJob(jobData: PhotoJobData) {
  if (!photoQueue) {
    console.warn('photoQueue not available, job pending worker poll');
    return;
  }
  try {
    const job = await photoQueue.add('transcode-photo', jobData);
    console.log(`Enqueued photo job ${job.id} for photoId: ${jobData.photoId}`);
    return job;
  } catch (error) {
    console.error('Failed to enqueue photo job:', error);
  }
}
