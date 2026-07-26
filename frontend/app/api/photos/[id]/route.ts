import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { db } from '@/lib/db';
import { photos } from '@/lib/db/schema';
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
      .from(photos)
      .where(eq(photos.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const photoWithLogs = {
      ...result[0],
      logs: await PipelineLogger.getLogs(id),
    };

    return NextResponse.json(photoWithLogs);
  } catch (error: any) {
    console.error('Failed to fetch photo details:', error);
    return NextResponse.json({ error: 'Failed to fetch photo details' }, { status: 500 });
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
      .from(photos)
      .where(eq(photos.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const photo = result[0];

    // Clean up Vercel Blobs asynchronously
    const blobsToDelete = [
      photo.inputPath,
      photo.webpPath,
      photo.thumbnailPath,
    ].filter(Boolean) as string[];

    for (const blobUrl of blobsToDelete) {
      try {
        await del(blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (err) {
        console.warn(`Failed to delete blob ${blobUrl}:`, err);
      }
    }

    // Delete DB record and Redis logs
    await db.delete(photos).where(eq(photos.id, id));
    await PipelineLogger.deleteLogs(id);

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
