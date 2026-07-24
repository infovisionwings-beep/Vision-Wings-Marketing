import { createNeonAuth } from '@neondatabase/auth/next/server';

const getBaseUrl = () => {
  if (process.env.NEON_AUTH_BASE_URL) return process.env.NEON_AUTH_BASE_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return 'http://localhost:3000';
};

export const auth = createNeonAuth({
  baseUrl: getBaseUrl(),
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET || 'fallback-secret-for-build-time-only-32-chars' },
});
