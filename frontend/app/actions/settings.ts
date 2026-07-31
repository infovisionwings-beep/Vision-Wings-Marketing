'use server'

import { cookies } from 'next/headers';
import { getBackendUrl } from '@/lib/utils/backendUrl';
import { requireAdmin } from '@/lib/auth/rbac';

export async function getSettings() {
  try {
    const backendUrl = getBackendUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(`${backendUrl}/api/settings`, {
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timeoutId);
      return {};
    }
    clearTimeout(timeoutId);

    if (!response.ok) return {};
    return await response.json();
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return {};
  }
}

export async function updateSettings(settingsData: Record<string, string>) {
  try {
    await requireAdmin();
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) return { success: false, error: 'Unauthorized: missing admin session token' };

    const backendUrl = getBackendUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(`${backendUrl}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsData),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      return { success: false, error: 'Backend unreachable or timed out' };
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return { success: false, error: errText || 'Failed to update settings' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to update settings:', err);
    return { success: false, error: err?.message || 'Failed to update settings' };
  }
}

