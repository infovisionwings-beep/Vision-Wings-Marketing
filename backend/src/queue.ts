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
