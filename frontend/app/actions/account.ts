"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

export interface AccountSummary {
  email: string;
  displayName: string;
  memberSince: string | null;
  profile: {
    type: string;
    name: string;
    phone: string | null;
    companyName: string | null;
    employeesCount: string | null;
    interests: string[];
    source: string | null;
    location: string | null;
  } | null;
}

/**
 * The reader's own record. Returns null when signed out so the page can send
 * them to sign in rather than rendering an empty shell.
 *
 * The profile is looked up by user id or email because the two are not written
 * consistently: onboarding stores the Better Auth id, while everything older
 * keys off the email.
 */
export async function getAccountSummary(): Promise<AccountSummary | null> {
  const { data } = await auth.getSession().catch(() => ({ data: null }) as any);
  const user = data?.user;
  if (!user?.email) return null;

  const email = String(user.email).toLowerCase();

  let profileRow: typeof userProfiles.$inferSelect | undefined;
  try {
    [profileRow] = await db
      .select()
      .from(userProfiles)
      .where(or(eq(userProfiles.userId, user.id ?? ""), eq(userProfiles.userId, email)))
      .limit(1);
  } catch (err) {
    console.error("Failed to load user profile:", err);
  }

  const address = (profileRow?.address ?? null) as
    | { country?: string; state?: string; city?: string; pincode?: string; fullAddress?: string }
    | null;

  // Individuals record country/state/city, companies a single free-text
  // address. One line has to read well from either.
  const location =
    address?.fullAddress?.trim() ||
    [address?.city, address?.state, address?.country].filter(Boolean).join(", ") ||
    null;

  return {
    email,
    displayName: profileRow?.name || user.name || email.split("@")[0],
    memberSince: profileRow?.createdAt?.toISOString() ?? null,
    profile: profileRow
      ? {
          type: profileRow.type,
          name: profileRow.name,
          phone: profileRow.phone,
          companyName: profileRow.companyName,
          employeesCount: profileRow.employeesCount,
          interests: Array.isArray(profileRow.interests) ? (profileRow.interests as string[]) : [],
          source: profileRow.source,
          location,
        }
      : null,
  };
}
