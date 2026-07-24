import { createNeonAuth } from '@neondatabase/auth/next/server';

// Next.js Edge/Serverless runtimes can strip out next.config.ts envs inside node_modules.
// We must inject these BEFORE createNeonAuth initializes the better-auth instance.
const vercelUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
if (vercelUrl && !process.env.BETTER_AUTH_URL) {
  process.env.BETTER_AUTH_URL = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
}
if (!process.env.BETTER_AUTH_TRUSTED_ORIGINS) {
  process.env.BETTER_AUTH_TRUSTED_ORIGINS = 'https://vw-ashen.vercel.app,https://vw-hyl1toegu-wwwksingh144-9864s-projects.vercel.app,http://localhost:3000';
}

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'https://fallback.neon.build',
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET || 'fallback-secret-for-build-time-only-32-chars' },
});
