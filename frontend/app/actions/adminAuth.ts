'use server'

import { cookies } from 'next/headers';
import { auth } from '@/lib/auth/server';
import * as jose from 'jose';
import { getBackendUrl } from '@/lib/utils/backendUrl';

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

    return { success: true };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return { error: 'An unexpected error occurred while communicating with the server.' };
  }
}
