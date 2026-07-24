/**
 * Role-Based Access Control (RBAC) for the admin portal.
 *
 * Provides a single `requireAdmin()` function that:
 * 1. Validates the current Neon Auth session.
 * 2. Checks the user's email against the ADMIN_EMAILS allowlist.
 * 3. Applies rate limiting to prevent brute-force session abuse.
 *
 * Use in Server Components and Server Actions to gate admin access.
 */

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { checkRateLimit } from '@/lib/auth/rate-limit';

// Rate limit: 30 admin requests per minute per user
const ADMIN_RATE_LIMIT_MAX = 30;
const ADMIN_RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Require that the current request is made by an authenticated admin user.
 *
 * @throws Redirects to `/login` if unauthenticated.
 * @throws Error if the user is not in the ADMIN_EMAILS allowlist.
 * @throws Error if the user has exceeded the rate limit.
 * @returns The authenticated user object.
 */
export async function requireAdmin() {
  const sessionRes = await auth.getSession();

  if (!sessionRes.data?.user) {
    redirect('/login');
  }

  const user = sessionRes.data.user;
  const userEmail = (user.email ?? '').toLowerCase();

  // Check ADMIN_EMAILS allowlist
  const adminEmailsRaw = process.env.ADMIN_EMAILS || '';
  const adminEmails = adminEmailsRaw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length > 0 && !adminEmails.includes(userEmail)) {
    throw new Error('Unauthorized: Admin access required.');
  }

  // Rate limiting per user
  const rateLimitKey = `admin:${user.id || userEmail}`;
  const result = checkRateLimit(rateLimitKey, ADMIN_RATE_LIMIT_MAX, ADMIN_RATE_LIMIT_WINDOW_MS);

  if (!result.allowed) {
    throw new Error(
      `Rate limited. Too many requests. Please retry after ${Math.ceil(result.retryAfterMs / 1000)} seconds.`
    );
  }

  return user;
}
