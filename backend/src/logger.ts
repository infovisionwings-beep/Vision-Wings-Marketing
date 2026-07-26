import Redis from 'ioredis';
import { config } from './config';

let redisConnection: Redis;

try {
  redisConnection = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    tls: config.redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  });
} catch (error) {
  console.warn('Failed to initialize Redis for PipelineLogger:', error);
}

export interface LogEntry {
  timestamp: string;
  stage: 'API' | 'QUEUE' | 'WORKER' | 'ERROR' | 'SUCCESS';
  message: string;
}

export class PipelineLogger {
  private static getKey(videoId: string): string {
    return `pipeline_logs:${videoId}`;
  }

  /**
   * Append a log entry to Redis for a specific video job
   */
  static async log(
    videoId: string,
    stage: 'API' | 'QUEUE' | 'WORKER' | 'ERROR' | 'SUCCESS',
    message: string
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stage,
      message,
    };

    console.log(`[${entry.timestamp}] [${stage}] [${videoId}] ${message}`);

    if (!redisConnection) return;

    try {
      const key = this.getKey(videoId);
      await redisConnection.rpush(key, JSON.stringify(entry));
      // Expire logs after 7 days to prevent Redis memory buildup
      await redisConnection.expire(key, 86400 * 7);
    } catch (err) {
      console.error('Failed to write pipeline log to Redis:', err);
    }
  }

  /**
   * Retrieve all log entries for a specific video job
   */
  static async getLogs(videoId: string): Promise<LogEntry[]> {
    if (!redisConnection) return [];

    try {
      const key = this.getKey(videoId);
      const rawLogs = await redisConnection.lrange(key, 0, -1);
      return rawLogs.map((raw) => {
        try {
          return JSON.parse(raw) as LogEntry;
        } catch {
          return {
            timestamp: '--:--:--',
            stage: 'WORKER',
            message: raw,
          };
        }
      });
    } catch (err) {
      console.error(`Failed to get pipeline logs for ${videoId}:`, err);
      return [];
    }
  }

  /**
   * Delete logs for a video when deleted
   */
  static async deleteLogs(videoId: string): Promise<void> {
    if (!redisConnection) return;
    try {
      await redisConnection.del(this.getKey(videoId));
    } catch (err) {
      console.error(`Failed to delete pipeline logs for ${videoId}:`, err);
    }
  }
}
