'use server'

import { auth } from '@/lib/auth/server'
import { getBackendUrl } from '@/lib/utils/backendUrl'
import { db } from '@/lib/db'
import { userProfiles } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'

const API_URL = getBackendUrl();

export async function checkOnboardingStatus() {
  try {
    const { data: sessionData } = await auth.getSession();
    if (!sessionData?.user) {
      return { isAuthenticated: false, hasProfile: false };
    }

    const user = sessionData.user;
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(or(eq(userProfiles.userId, user.id), eq(userProfiles.userId, user.email || "")))
      .limit(1);

    return {
      isAuthenticated: true,
      hasProfile: !!profile,
    };
  } catch (err) {
    return { isAuthenticated: false, hasProfile: false };
  }
}

export async function saveOnboardingProfile(formData: FormData) {
  // 1. Check if user is authenticated
  const { data: sessionData } = await auth.getSession();
  if (!sessionData?.user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  const userId = sessionData.user.id; // or email, but id is safer

  // 2. Extract data from formData
  const type = formData.get('type') as 'individual' | 'company';
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const source = formData.get('source') as string;

  // Address fields
  const country = formData.get('country') as string;
  const state = formData.get('state') as string;
  const city = formData.get('city') as string;
  const pincode = formData.get('pincode') as string;
  const fullAddress = formData.get('fullAddress') as string; // For company
  
  const address = type === 'individual' 
    ? { country, state, city, pincode } 
    : { fullAddress };

  // Company specific fields
  const companyName = formData.get('companyName') as string;
  const employeesCount = formData.get('employeesCount') as string;

  // Interests
  const interestsStr = formData.get('interests') as string;
  let interests: string[] = [];
  try {
    interests = interestsStr ? JSON.parse(interestsStr) : [];
  } catch (e) {
    // Ignore parse error
  }

  const bodyPayload = {
    userId,
    type,
    name,
    phone,
    address,
    companyName: type === 'company' ? companyName : null,
    employeesCount: type === 'company' ? employeesCount : null,
    interests,
    source,
  };

  // 3. Direct DB insert for immediate consistency
  try {
    await db.insert(userProfiles).values(bodyPayload).onConflictDoNothing();
  } catch (dbErr) {
    console.warn("Direct Drizzle insert to user_profiles notice:", dbErr);
  }

  // 4. Save to backend database API
  try {
    await fetch(`${API_URL}/api/user-profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });
  } catch (error: any) {
    console.error("Backend fetch notice (saved via DB direct):", error);
  }

  // 5. Return success so the UI can redirect
  return { success: true };
}
