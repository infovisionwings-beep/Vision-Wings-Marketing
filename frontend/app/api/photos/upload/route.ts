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
        // The client picks the pathname but we sign it — reject anything outside
        // photos/<userId>/<uuid>/, or originals land loose in the blob store root.
        if (!/^photos\/[\w-]+\/[0-9a-f-]{36}\/original\.[a-z0-9]+$/i.test(pathname)) {
          throw new Error(`Rejected upload path "${pathname}" — must be photos/<userId>/<uuid>/original.<ext>`);
        }
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({
            userId: 'admin',
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Vercel Blob client direct photo upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Blob photo handleUpload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload token for photo' },
      { status: 400 }
    );
  }
}
