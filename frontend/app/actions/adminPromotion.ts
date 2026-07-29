'use server'

import { cookies } from 'next/headers';

const getBackendUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vwapi.onrender.com';

export async function initiatePromotion(name: string, email: string, role: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    
    if (!token) return { error: 'Unauthorized' };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8500); // Vercel times out at 10s on hobby

    const response = await fetch(`${getBackendUrl()}/api/admin/initiate-promotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, role }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    if (!response.ok) return { error: data.error || 'Failed to initiate promotion' };
    return { success: true };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { error: 'Request timed out. The backend server might be waking up. Please try again in 30 seconds.' };
    }
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}

export async function verifyPromotion(email: string, superAdminOtp: string, promotedOtp: string, password: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    
    if (!token) return { error: 'Unauthorized' };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8500);

    const response = await fetch(`${getBackendUrl()}/api/admin/verify-promotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, superAdminOtp, promotedOtp, password }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    if (!response.ok) return { error: data.error || 'Failed to verify promotion' };
    return { success: true };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { error: 'Request timed out. The backend server might be waking up. Please try again in 30 seconds.' };
    }
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}
