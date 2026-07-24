import { createAuthClient } from '@neondatabase/auth';

export const authClient = createAuthClient(
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
);
