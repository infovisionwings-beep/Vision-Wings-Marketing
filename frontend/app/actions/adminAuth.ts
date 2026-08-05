'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';
import * as jose from 'jose';
import { getBackendUrl } from '@/lib/utils/backendUrl';

/**
 * Idle timeout, enforced by the browser rather than by client-side JavaScript.
 *
 * The admin JWT lives for 12h and is minted by the backend for non-super-admins,
 * so its expiry is not ours to shorten. This second cookie is: it lapses 15
 * minutes after the last write, and `requireAdmin` refuses a request that has the
 * session cookie without it. A tab left open, a copied cookie, or a client with
 * JavaScript disabled all lose access on the same schedule, because the timeout
 * is the absence of a cookie the browser stopped sending.
 *
 * Not exported: a "use server" module may only export async functions, and a
 * non-function export makes the whole actions module fail to evaluate, so every
 * server action on the importing page returns 500.
 */
const ADMIN_IDLE_TIMEOUT_SECONDS = 15 * 60;

function setAdminActivityCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.set('admin_activity', String(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_IDLE_TIMEOUT_SECONDS,
  });
}

/**
 * Heartbeat from the dashboard. Extends the idle window only for a caller who
 * already holds both cookies — it can restart the clock, never start it.
 */
export async function touchAdminSession(): Promise<{ active: boolean }> {
  const cookieStore = await cookies();
  if (!cookieStore.get('admin_session')?.value) return { active: false };
  if (!cookieStore.get('admin_activity')?.value) return { active: false };

  setAdminActivityCookie(cookieStore);
  return { active: true };
}

export async function loginAdmin(password: string) {
  try {
    const sessionRes = await auth.getSession();
    if (!sessionRes?.data?.user) {
      return { error: 'Not authenticated on main site. Please log in to the main site first.' };
    }

    const email = sessionRes.data.user.email;
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase();
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    let token = '';

    if (email.toLowerCase() === superAdminEmail && password === superAdminPassword) {
      const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-for-admin-session-please-change';
      const secretKey = new TextEncoder().encode(JWT_SECRET);

      token = await new jose.SignJWT({ email, role: 'Developer', name: 'Super Admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('12h')
        .sign(secretKey);
    } else {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to authenticate admin' };
      }
      token = data.token;
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 60 * 60 // 12 hours
    });
    setAdminActivityCookie(cookieStore);

    return { success: true };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return { error: 'An unexpected error occurred while communicating with the server.' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();

  // Overwrite with an already-expired cookie before deleting: `delete` alone
  // omits the attributes the cookie was written with, which leaves it in place
  // in some browsers.
  for (const name of ['admin_session', 'admin_activity']) {
    cookieStore.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    cookieStore.delete(name);
  }

  redirect('/admin-login');
}
