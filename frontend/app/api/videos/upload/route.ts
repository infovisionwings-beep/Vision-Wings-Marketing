import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

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
      onUploadCompleted: async ({ blob }) => {
        console.log('Vercel Blob client direct upload completed:', blob.url);
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
