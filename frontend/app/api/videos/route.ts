import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { enqueueVideoJob } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const videoList = await db
      .select()
      .from(videos)
      .orderBy(desc(videos.createdAt));
    return NextResponse.json(videoList);
  } catch (error: any) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;
    const userId = (formData.get('userId') as string) || 'admin';

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const allowedExtensions = ['.mp4', '.mov', '.webm'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase() || '.mp4';
    if (!allowedExtensions.includes(ext) && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed formats: .mp4, .mov, .webm' },
        { status: 400 }
      );
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 100MB limit' }, { status: 400 });
    }

    const videoId = uuidv4();
    const blobPath = `videos/${userId}/${videoId}/original${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Vercel Blob
    const blob = await put(blobPath, buffer, {
      access: 'public',
      contentType: file.type || 'video/mp4',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Create DB record
    const [insertedVideo] = await db
      .insert(videos)
      .values({
        id: videoId,
        userId,
        originalFileName: file.name,
        originalSize: file.size,
        status: 'uploaded',
        inputPath: blob.url,
      })
      .returning();

    // Enqueue processing job to Upstash Redis
    try {
      await enqueueVideoJob({
        videoId,
        userId,
        inputUrl: blob.url,
        originalFileName: file.name,
      });
    } catch (err) {
      console.warn('Job dispatch warning:', err);
    }

    return NextResponse.json(
      { success: true, video: insertedVideo },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Video upload endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload video' },
      { status: 500 }
    );
  }
}
