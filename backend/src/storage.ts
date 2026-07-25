import { put, del } from '@vercel/blob';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { config } from './config';

export class StorageService {
  /**
   * Upload a buffer or stream to Vercel Blob
   */
  static async uploadBlob(
    pathname: string,
    body: Buffer | fs.ReadStream,
    contentType: string
  ): Promise<string> {
    const blob = await put(pathname, body, {
      access: 'public',
      contentType,
      token: config.blobToken
    });
    return blob.url;
  }

  /**
   * Delete a blob by its public URL or path
   */
  static async deleteBlob(url: string): Promise<void> {
    if (!url) return;
    try {
      await del(url, { token: config.blobToken });
    } catch (err) {
      console.error(`Failed to delete blob at ${url}:`, err);
    }
  }

  /**
   * Generate a unique temporary directory path for worker operations
   */
  static createTempDir(videoId: string): string {
    const tempDir = path.join(os.tmpdir(), `video_job_${videoId}`);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
  }

  /**
   * Remove a temporary directory and all contents
   */
  static removeTempDir(tempDir: string): void {
    if (fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (err) {
        console.error(`Failed to clean up temp dir ${tempDir}:`, err);
      }
    }
  }
}
