import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PipelineLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const videoWithLogs = {
      ...result[0],
      logs: await PipelineLogger.getLogs(id),
    };

    return NextResponse.json(videoWithLogs);
  } catch (error: any) {
    console.error('Failed to fetch video details:', error);
    return NextResponse.json({ error: 'Failed to fetch video details' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = result[0];

    // Clean up Vercel Blobs asynchronously
    const blobsToDelete = [
      video.inputPath,
      video.webmPath,
      video.mp4Path,
      video.thumbnailPath,
    ].filter(Boolean) as string[];

    for (const blobUrl of blobsToDelete) {
      try {
        await del(blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (err) {
        console.warn(`Failed to delete blob ${blobUrl}:`, err);
      }
    }

    // Delete DB record and Redis logs
    await db.delete(videos).where(eq(videos.id, id));
    await PipelineLogger.deleteLogs(id);

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
