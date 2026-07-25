import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { enqueueVideoJob } from '@/lib/queue';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
          tokenPayload: JSON.stringify({
            userId: 'admin',
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Vercel Blob client upload completed:', blob.url);
        try {
          const videoId = uuidv4();
          const originalFileName = blob.pathname.split('/').pop() || 'video.mp4';

          const [insertedVideo] = await db
            .insert(videos)
            .values({
              id: videoId,
              userId: 'admin',
              originalFileName,
              originalSize: 0,
              status: 'uploaded',
              inputPath: blob.url,
            })
            .returning();

          await enqueueVideoJob({
            videoId,
            userId: 'admin',
            inputUrl: blob.url,
            originalFileName,
          });

          await db
            .update(videos)
            .set({ status: 'queued' })
            .where(eq(videos.id, videoId));
        } catch (error) {
          console.error('Error in onUploadCompleted callback:', error);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Blob handleUpload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload token' },
      { status: 400 }
    );
  }
}
