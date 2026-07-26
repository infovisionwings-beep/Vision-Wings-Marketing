import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  databaseUrl: process.env.DATABASE_URL,
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  video: {
    maxSizeBytes: 100 * 1024 * 1024, // 100MB
    allowedMimetypes: ['video/mp4', 'video/quicktime', 'video/webm'],
    allowedExtensions: ['.mp4', '.mov', '.webm'],
    thumbnailTime: '00:00:01.000',
    // WebM (VP9 - lightweight primary format, optimized for high-speed encoding)
    webmParams: [
      '-c:v', 'libvpx-vp9',
      '-deadline', 'realtime',
      '-cpu-used', '4',
      '-row-mt', '1',
      '-threads', '2',
      '-b:v', '1M',
      '-crf', '30',
      '-c:a', 'libopus',
      '-b:a', '128k'
    ],
    // MP4 (H.264 - universal fallback format, optimized for high-speed encoding)
    mp4Params: [
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-threads', '2',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart'
    ]
  }
};
