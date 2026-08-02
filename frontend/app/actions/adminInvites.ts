'use server'

import { cookies } from 'next/headers';
import { auth } from '@/lib/auth/server';
import { getBackendUrl } from '@/lib/utils/backendUrl';

// Render's free tier cold-starts in 30-60s; anything tighter aborts before it wakes.
const BACKEND_TIMEOUT_MS = 45_000;

async function callBackend(
  path: string,
  init: RequestInit & { authenticated?: boolean } = {}
): Promise<{ ok: true; data: any } | { ok: false; error: string }> {
  const { authenticated = true, ...requestInit } = init;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authenticated) {
    const token = (await cookies()).get('admin_session')?.value;
    if (!token) {
      return { ok: false, error: 'Your admin session has expired. Sign in again at /admin-login.' };
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  try {
    const response = await fetch(`${getBackendUrl()}${path}`, {
      ...requestInit,
      headers,
      cache: 'no-store',
      signal: controller.signal,
    });

    const rawText = await response.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      console.error(`Non-JSON response from ${path}:`, rawText.slice(0, 200));
      return { ok: false, error: 'The backend returned an unexpected response.' };
    }

    if (!response.ok) return { ok: false, error: data.error || `Request failed (${response.status})` };
    return { ok: true, data };
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return { ok: false, error: 'The backend did not respond in 45s. It may be waking up — try again shortly.' };
    }
    return { ok: false, error: `Unexpected error: ${error?.message || 'Unknown'}` };
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Super admin sends an invite. The link is emailed; it never comes back through here. */
export async function createInvite(name: string, email: string, role: string) {
  const res = await callBackend('/api/admin/invites', {
    method: 'POST',
    body: JSON.stringify({ name, email, role }),
  });
  return res.ok ? { success: true, invite: res.data.invite } : { error: res.error };
}

export async function listInvites() {
  const res = await callBackend('/api/admin/invites');
  return res.ok ? { success: true, invites: res.data } : { error: res.error, invites: [] };
}

export async function revokeInvite(id: string) {
  const res = await callBackend(`/api/admin/invites/${encodeURIComponent(id)}/revoke`, { method: 'POST' });
  return res.ok ? { success: true } : { error: res.error };
}

/**
 * Resolve an invite for the accept screen and enforce the "must already have a site
 * account" rule. The session is read server-side, so the browser cannot spoof it:
 * the invitee has to be signed in as exactly the invited address.
 */
export async function lookupInvite(token: string) {
  const res = await callBackend(`/api/admin/invites/lookup/${encodeURIComponent(token)}`, {
    authenticated: false,
  });
  if (!res.ok) return { error: res.error };

  let sessionEmail = '';
  try {
    const sessionRes = await auth.getSession();
    sessionEmail = (sessionRes?.data?.user?.email || '').toLowerCase();
  } catch {
    // fall through to the not-signed-in branch
  }

  if (!sessionEmail) {
    return { error: 'NOT_SIGNED_IN', invite: res.data };
  }
  if (sessionEmail !== String(res.data.email).toLowerCase()) {
    return {
      error: `This invite is for ${res.data.email}, but you are signed in as ${sessionEmail}. Sign in with the invited account first.`,
    };
  }

  return { success: true, invite: res.data };
}

/** Invitee sets their own password. Re-checks the session so the rule holds on submit. */
export async function acceptInvite(token: string, password: string) {
  const check = await lookupInvite(token);
  if ('error' in check && check.error) {
    return { error: check.error === 'NOT_SIGNED_IN' ? 'Sign in with the invited account first.' : check.error };
  }

  const res = await callBackend('/api/admin/invites/accept', {
    method: 'POST',
    authenticated: false,
    body: JSON.stringify({ token, password }),
  });
  return res.ok ? { success: true, role: res.data.role } : { error: res.error };
}
