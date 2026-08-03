'use server'

import { getBackendUrl } from '@/lib/utils/backendUrl';

const API_URL = getBackendUrl();

export async function submitContactInquiry(formData: FormData) {
  const firstName = ((formData.get('firstName') as string) || '').trim();
  const lastName = ((formData.get('lastName') as string) || '').trim();
  const email = ((formData.get('email') as string) || '').trim();
  const company = ((formData.get('company') as string) || '').trim();
  const message = ((formData.get('message') as string) || '').trim();

  if (!firstName || !lastName || !email || !message) {
    return { error: 'Please fill in your name, email, and message.' };
  }

  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, company: company || null, message }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { error: body?.error || "We couldn't send your inquiry. Please try again or email us directly." };
    }
  } catch (error) {
    console.error('Failed to submit contact inquiry:', error);
    return { error: "We couldn't send your inquiry. Please try again or email us directly." };
  }

  return { success: true };
}
