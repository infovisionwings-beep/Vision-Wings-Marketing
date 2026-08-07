"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Created on demand, matching saved_essays and signup_otps — this project has
 * no migration runner, so a table only this feature touches is made where it is
 * first used. Held for the life of the process: re-confirming a table that
 * cannot stop existing is a network round trip per call for nothing.
 */
let subscribersTableReady: Promise<void> | null = null;

function ensureSubscribersTable() {
  subscribersTableReady ??= db
    .execute(sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    .then(() => undefined)
    .catch((err) => {
      console.error("Failed to ensure newsletter_subscribers table:", err);
      // Do not cache a failure — the next call should retry.
      subscribersTableReady = null;
    });
  return subscribersTableReady;
}

/** The reader's identity, or null when signed out. Never trusted from the client. */
async function currentUserId(): Promise<string | null> {
  try {
    const { data } = await auth.getSession();
    const email = data?.user?.email;
    return email ? email.toLowerCase() : null;
  } catch {
    return null;
  }
}

/**
 * Subscribing is a signed-in action, but reading an essay is not — so this
 * reports "signed out" rather than redirecting, and the button turns into a
 * sign-in prompt that returns the reader to the essay they were on.
 *
 * The address is never accepted from the caller. The old control was a bare
 * email input wired to nothing; taking that value would have let anyone sign up
 * an address they do not own.
 */
export async function subscribeToNewsletter(): Promise<{
  subscribed: boolean;
  requiresLogin?: true;
  error?: string;
}> {
  const userId = await currentUserId();
  if (!userId) return { subscribed: false, requiresLogin: true };

  await ensureSubscribersTable();

  try {
    // Idempotent: a second click, or two tabs at once, is not an error.
    await db
      .insert(newsletterSubscribers)
      .values({ userId })
      .onConflictDoNothing({ target: newsletterSubscribers.userId });
    revalidatePath("/dashboard");
    return { subscribed: true };
  } catch (err) {
    console.error("Failed to subscribe to the newsletter:", err);
    return { subscribed: false, error: "Could not subscribe right now. Please try again." };
  }
}

/** Unsubscribing is offered on the dashboard, which is where the state is shown. */
export async function unsubscribeFromNewsletter(): Promise<{
  subscribed: boolean;
  error?: string;
}> {
  const userId = await currentUserId();
  if (!userId) return { subscribed: false };

  try {
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.userId, userId));
    revalidatePath("/dashboard");
    return { subscribed: false };
  } catch (err) {
    console.error("Failed to unsubscribe from the newsletter:", err);
    return { subscribed: true, error: "Could not unsubscribe right now. Please try again." };
  }
}

/** Initial state for the button. Signed-out readers get `false`, not an error. */
export async function isSubscribedToNewsletter(): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId) return false;

  await ensureSubscribersTable();

  try {
    const [row] = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.userId, userId))
      .limit(1);
    return !!row;
  } catch (err) {
    console.error("Failed to read newsletter subscription:", err);
    return false;
  }
}
