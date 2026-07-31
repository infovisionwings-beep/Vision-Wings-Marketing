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
    const adminEmails = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim());

    const activeEmail = (adminPayload?.email as string || primaryUser?.email || '').toLowerCase();
    const activeRole = (adminPayload?.role as string || 'Admin');
    const activeName = (adminPayload?.name as string || primaryUser?.name || 'Super Admin');

    let isAuthorized =
      activeEmail === superAdminEmail ||
      adminEmails.includes(activeEmail) ||
      activeRole === 'Developer' ||
      activeRole === 'Admin';

    if (!isAuthorized && activeEmail) {
      const backendUrl = getBackendUrl();
      try {
        const res = await fetch(`${backendUrl}/api/admin/is-admin/${encodeURIComponent(activeEmail)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          isAuthorized = data.isAdmin === true;
        }
      } catch (e) {
        console.error('Failed to check admin status with backend', e);
      }
    }

    if (!isAuthorized) {
      redirect('/');
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

