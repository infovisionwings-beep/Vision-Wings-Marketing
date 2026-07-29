'use server'

import { getBackendUrl } from '@/lib/utils/backendUrl';

export async function getSettings() {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/settings`, {
      cache: 'no-store'
    });
    if (!response.ok) return {};
    return await response.json();
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return {};
  }
}
