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
