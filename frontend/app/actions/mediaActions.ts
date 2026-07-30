'use server'

import { cookies } from 'next/headers';
import { getBackendUrl } from '@/lib/utils/backendUrl';

export async function getAdminMedia(type: 'photos' | 'videos') {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return { success: false, error: 'Unauthorized', data: [] };
    
    // Abort after 15s to prevent hanging on cold-start backends
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(`${getBackendUrl()}/api/admin/media/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      const isTimeout = fetchErr?.name === 'AbortError';
      console.warn(`getAdminMedia fetch failed (${type}):`, isTimeout ? 'Request timed out (15s)' : fetchErr?.message);
      return { success: false, error: isTimeout ? 'Backend request timed out. It may be waking up — try again in a moment.' : 'Backend unreachable', data: [] };
    }
    clearTimeout(timeoutId);
    
    const rawText = await response.text();
    let data: any = [];
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error(`Non-JSON response from getAdminMedia (${type}):`, rawText?.slice(0, 200));
      return { success: false, error: 'Backend returned invalid response', data: [] };
    }

    if (!response.ok) return { success: false, error: data.error || 'Failed to fetch media', data: [] };
    return { success: true, data };
  } catch (error: any) {
    // Catch absolutely everything to prevent the server action from throwing
    // (which causes Next.js "unexpected response" errors on the client)
    console.error('getAdminMedia error:', error?.message || error);
    return { success: false, error: `Unexpected error: ${error?.message || 'Unknown'}`, data: [] };
  }
}

export async function updateMedia(type: 'photos' | 'videos', id: string, data: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    
    if (!token) return { error: 'Unauthorized' };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(`${getBackendUrl()}/api/admin/media/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      return { error: fetchErr?.name === 'AbortError' ? 'Request timed out' : 'Backend unreachable' };
    }
    clearTimeout(timeoutId);

    const rawText = await response.text();
    let resData: any = {};
    try {
      resData = JSON.parse(rawText);
    } catch (e) {
      return { error: 'Backend returned invalid response' };
    }

    if (!response.ok) return { error: resData.error || 'Failed to update media' };
    return { success: true, data: resData };
  } catch (error: any) {
    return { error: `An unexpected error occurred: ${error?.message || 'Unknown'}` };
  }
}

export async function softDeleteMedia(type: 'photos' | 'videos', id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    
    if (!token) return { error: 'Unauthorized' };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(`${getBackendUrl()}/api/admin/media/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      return { error: fetchErr?.name === 'AbortError' ? 'Request timed out' : 'Backend unreachable' };
    }
    clearTimeout(timeoutId);

    const rawText = await response.text();
    let resData: any = {};
    try {
      resData = JSON.parse(rawText);
    } catch (e) {
      return { error: 'Backend returned invalid response' };
    }

    if (!response.ok) return { error: resData.error || 'Failed to delete media' };
    return { success: true };
  } catch (error: any) {
    return { error: `An unexpected error occurred: ${error?.message || 'Unknown'}` };
  }
}
