'use server'

import { cookies } from 'next/headers';
import { getBackendUrl } from '@/lib/utils/backendUrl';

export async function getAdminMedia(type: 'photos' | 'videos') {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return { error: 'Unauthorized' };
    
    const response = await fetch(`${getBackendUrl()}/api/admin/media/${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });
    
    const rawText = await response.text();
    let data: any = [];
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error(`Non-JSON response from getAdminMedia (${type}):`, rawText);
      return { error: 'Backend returned invalid response' };
    }

    if (!response.ok) return { error: data.error || 'Failed to fetch media' };
    return { success: true, data };
  } catch (error: any) {
    console.error('getAdminMedia error:', error);
    return { error: `Unexpected error: ${error.message}` };
  }
}

export async function updateMedia(type: 'photos' | 'videos', id: string, data: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    
    if (!token) return { error: 'Unauthorized' };

    const response = await fetch(`${getBackendUrl()}/api/admin/media/${type}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

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
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}

export async function softDeleteMedia(type: 'photos' | 'videos', id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    
    if (!token) return { error: 'Unauthorized' };

    const response = await fetch(`${getBackendUrl()}/api/admin/media/${type}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

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
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}
