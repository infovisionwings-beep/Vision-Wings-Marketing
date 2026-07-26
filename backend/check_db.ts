import dotenv from 'dotenv';
dotenv.config();

import { db } from './src/db';
import { videos } from './src/db/schema';
import { desc } from 'drizzle-orm';
import { PipelineLogger } from './src/logger';

async function check() {
  try {
    const res = await db.select().from(videos).orderBy(desc(videos.createdAt)).limit(5);
    
    const withLogs = await Promise.all(
      res.map(async (v) => ({
        id: v.id,
        fileName: v.originalFileName,
        status: v.status,
        inputPath: v.inputPath,
        errorMessage: v.errorMessage,
        createdAt: v.createdAt,
        logs: await PipelineLogger.getLogs(v.id)
      }))
    );

    console.log(JSON.stringify(withLogs, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error querying DB:', err);
    process.exit(1);
  }
}

check();
