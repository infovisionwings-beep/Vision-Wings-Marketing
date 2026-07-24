import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'https://fallback.neon.build',
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET || 'fallback-secret-for-build-time-only-32-chars' },
});
