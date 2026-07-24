import { createNeonAuth } from '@neondatabase/auth/next/server';

// Dynamically populate Better Auth's trusted origins using Vercel environment variables
// This prevents 403 CSRF origin mismatch errors when deploying to Vercel preview/alias domains.
const vercelUrls = [
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` : '',
  process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '',
  process.env.NEXT_PUBLIC_SITE_URL || '',
  'https://vw-ashen.vercel.app',
  'https://vw-hyl1toegu-wwwksingh144-9864s-projects.vercel.app'
].filter(Boolean);

if (vercelUrls.length > 0) {
  process.env.BETTER_AUTH_TRUSTED_ORIGINS = [
    process.env.BETTER_AUTH_TRUSTED_ORIGINS,
    ...vercelUrls
  ].filter(Boolean).join(',');
}

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'https://fallback.neon.build',
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET || 'fallback-secret-for-build-time-only-32-chars' },
});
