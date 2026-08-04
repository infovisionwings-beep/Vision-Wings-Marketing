import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { getBackendUrl } from '@/lib/utils/backendUrl';

// Rate limit: 500 admin requests per minute per user
const ADMIN_RATE_LIMIT_MAX = 500;
const ADMIN_RATE_LIMIT_WINDOW_MS = 60_000;

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-for-admin-session-please-change';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminUser {
  email: string;
  role: string;
  name: string;
  originalUser: any;
}

/**
 * Developer-only pages call the backend with the admin_session cookie as a bearer
 * token, so holding the Developer role is not sufficient on its own — without the
 * cookie those calls 401 and the page silently renders empty. Send the user through
 * the secondary login to mint one instead.
 */
export async function requireAdminToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) {
    redirect('/admin-login');
  }

  // The idle cookie lapses 15 minutes after the last heartbeat. Its absence
  // alongside a live session cookie means the session went idle, not that the
  // user was never here — either way the dashboard is closed to them.
  if (!cookieStore.get('admin_activity')?.value) {
    redirect('/admin-login?reason=idle');
  }

  // Presence is not enough. These tokens expire after 12h, and the backend
  // rejects an expired one with 401 exactly as it rejects a missing one — so a
  // stale cookie produced the same silent "Unauthorized" with empty lists that
  // no cookie did, while still satisfying a presence-only check. Verifying here
  // means the session is re-minted instead of the dashboard rendering against a
  // token every backend call is about to refuse.
  try {
    await jose.jwtVerify(token, secretKey);
  } catch {
    redirect('/admin-login');
  }

  return token;
}

/**
 * Route-handler variant of `requireAdmin`. `requireAdmin` signals denial by throwing
 * NEXT_REDIRECT, which is meaningless in a JSON API — callers used to swallow that and
 * continue as a hardcoded `admin@agency.com`, leaving those writes unauthenticated.
 * Returns null on denial so the caller can respond 403.
 */
export async function requireAdminApi(requiredRoles?: string[]): Promise<AdminUser | null> {
  try {
    return await requireAdmin(requiredRoles);
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') {
      return null;
    }
    throw err;
  }
}

/**
 * Resolve an email's role from the backend admin_roles table.
 * Returns null on any failure so callers fail closed.
 */
async function lookupRole(email: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(
      `${getBackendUrl()}/api/admin/is-admin/${encodeURIComponent(email)}`,
      { cache: 'no-store', signal: controller.signal }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.isAdmin) return null;
    // `role` is absent on backends older than this change; treat as the previous default.
    return (data.role as string) || 'Admin';
  } catch (e) {
    console.error('Failed to resolve admin role from backend:', e);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Require that the current request is made by an authenticated admin user.
 * It checks the secondary admin session (JWT cookie) AND/OR the primary web session.
 * 
 * @param requiredRoles - Array of allowed roles (e.g., ['Admin', 'SEO']). 'Developer' always has access.
 */
export async function requireAdmin(requiredRoles?: string[]): Promise<AdminUser> {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_session')?.value;

    let adminPayload: jose.JWTPayload | null = null;

    // A session cookie with no idle cookie beside it is a timed-out session.
    // Treated as no admin session at all rather than falling through to the
    // primary-session branch, which would otherwise re-admit the same user.
    const isIdleExpired = !!adminToken && !cookieStore.get('admin_activity')?.value;
    if (isIdleExpired) {
      redirect('/admin-login?reason=idle');
    }

    // 1. Check secondary admin JWT session cookie first
    if (adminToken) {
      try {
        const { payload } = await jose.jwtVerify(adminToken, secretKey);
        adminPayload = payload;
      } catch (e) {
        console.warn('Invalid or expired admin_session cookie');
      }
    }

    // 2. Check primary Neon Auth session if JWT not present or to get full user object
    let primaryUser: any = null;
    try {
      const sessionRes = await auth.getSession();
      if (sessionRes?.data?.user) {
        primaryUser = sessionRes.data.user;
      }
    } catch (e) {
      // Primary auth server query non-blocking
    }

    // If neither valid admin JWT nor primary user is present, redirect to admin login
    if (!adminPayload && !primaryUser) {
      redirect('/admin-login');
    }

    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase();
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .toLowerCase()
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    const activeEmail = (adminPayload?.email as string || primaryUser?.email || '').toLowerCase();
    const activeName = (adminPayload?.name as string || primaryUser?.name || 'Super Admin');

    // The role is derived from identity and is never defaulted. It used to fall back
    // to 'Admin' whenever the 12h admin_session cookie was absent, which meant
    //   a) the `activeRole === 'Admin'` authorization clause was always true, so any
    //      signed-in site user reached the whole dashboard, and
    //   b) the super admin lost the Developer role the moment the cookie lapsed and
    //      got bounced from /admin/new and /admin/logs back to /admin.
    // Authorization is now simply "did we resolve a role", so both fail closed.
    let activeRole: string | null = null;

    if (activeEmail && activeEmail === superAdminEmail) {
      // Super admin identity comes from the env, so it survives cookie expiry.
      activeRole = 'Developer';
    } else if (adminPayload?.role) {
      activeRole = adminPayload.role as string;
    } else if (activeEmail) {
      activeRole = await lookupRole(activeEmail);
      if (!activeRole && adminEmails.includes(activeEmail)) {
        activeRole = 'Admin'; // static ADMIN_EMAILS allowlist
      }
    }

    if (!activeRole) {
      // No admin role found — redirect to login, not home
      redirect('/admin-login');
    }

    // Role check
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(activeRole) && activeRole !== 'Developer') {
        redirect('/admin');
      }
    }

    // Rate limiting per user key
    const rateLimitKey = `admin:${activeEmail || 'anon'}`;
    const result = checkRateLimit(rateLimitKey, ADMIN_RATE_LIMIT_MAX, ADMIN_RATE_LIMIT_WINDOW_MS);

    if (!result.allowed) {
      console.warn(`Rate limit exceeded for admin: ${activeEmail}`);
      // Do not throw redirect on rate limit hit during RPC server actions; return user object
    }

    return {
      email: activeEmail,
      role: activeRole,
      name: activeName,
      originalUser: primaryUser || { email: activeEmail }
    };
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.error('requireAdmin authentication check failed:', err);
    redirect('/admin-login');
  }
}

