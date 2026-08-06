"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { savedEssays, insights } from "@/lib/db/schema";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { readMinutesFromLength } from "@/lib/content/readTime";

/**
 * The saved_essays table is created on demand, matching how signup_otps is
 * handled in auth.ts — this project has no migration runner, so a table that
 * only this feature touches is made where it is first used.
 */
/**
 * Held for the life of the process. This previously ran on every dashboard load
 * and every save toggle, spending a network round trip to a serverless database
 * — plus a DDL lock check — to re-confirm a table that cannot stop existing.
 * Once per process is enough; a cold start pays it again, which is correct.
 */
let savedEssaysTableReady: Promise<void> | null = null;

function ensureSavedEssaysTable() {
  savedEssaysTableReady ??= db
    .execute(sql`
      CREATE TABLE IF NOT EXISTS saved_essays (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        insight_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (user_id, insight_id)
      );
    `)
    .then(() => undefined)
    .catch((err) => {
      console.error("Failed to ensure saved_essays table:", err);
      // Do not cache a failure — the next call should retry.
      savedEssaysTableReady = null;
    });
  return savedEssaysTableReady;
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
 * Saving is a signed-in action, but reading an essay is not — so this reports
 * "signed out" rather than redirecting, and the button turns into a sign-in
 * prompt that returns the reader to the essay they were on.
 */
export async function toggleSavedEssay(
  insightId: number
): Promise<{ saved: boolean; requiresLogin?: true; error?: string }> {
  const userId = await currentUserId();
  if (!userId) return { saved: false, requiresLogin: true };

  if (!Number.isInteger(insightId) || insightId <= 0) {
    return { saved: false, error: "That essay could not be saved." };
  }

  await ensureSavedEssaysTable();

  try {
    // Only a real, still-published essay can be saved. Without this an id from
    // a crafted request would create a row pointing at nothing, which the
    // dashboard join would then silently drop — a save that appears to work and
    // never shows up.
    const [essay] = await db
      .select({ id: insights.id })
      .from(insights)
      .where(and(eq(insights.id, insightId), ne(insights.status, "archived")))
      .limit(1);

    if (!essay) return { saved: false, error: "That essay is no longer available." };

    const [existing] = await db
      .select({ id: savedEssays.id })
      .from(savedEssays)
      .where(and(eq(savedEssays.userId, userId), eq(savedEssays.insightId, insightId)))
      .limit(1);

    if (existing) {
      await db.delete(savedEssays).where(eq(savedEssays.id, existing.id));
      revalidatePath("/dashboard");
      return { saved: false };
    }

    await db.insert(savedEssays).values({ userId, insightId });
    revalidatePath("/dashboard");
    return { saved: true };
  } catch (err) {
    console.error("Failed to toggle saved essay:", err);
    return { saved: false, error: "Could not save right now. Please try again." };
  }
}

/** Initial state for the save button. Signed-out readers get `false`, not an error. */
export async function isEssaySaved(insightId: number): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId || !Number.isInteger(insightId)) return false;

  try {
    const [row] = await db
      .select({ id: savedEssays.id })
      .from(savedEssays)
      .where(and(eq(savedEssays.userId, userId), eq(savedEssays.insightId, insightId)))
      .limit(1);
    return !!row;
  } catch {
    return false;
  }
}

export interface SavedEssay {
  insightId: number;
  title: string;
  slug: string;
  category: string;
  coverImage: string | null;
  authorName: string | null;
  readMinutes: number;
  savedAt: string | null;
  publishedAt: string | null;
}

/**
 * The reader's library. Joining against `insights` is what makes the saved list
 * follow the admin: archive an essay and it leaves every library at once,
 * without a cleanup job, because the row it pointed at no longer matches.
 */
export async function getSavedEssays(): Promise<SavedEssay[]> {
  const userId = await currentUserId();
  if (!userId) return [];

  await ensureSavedEssaysTable();

  try {
    const rows = await db
      .select({
        insightId: insights.id,
        title: insights.title,
        slug: insights.slug,
        category: insights.category,
        coverImage: insights.coverImage,
        authorName: insights.authorName,
        contentLength: sql<number>`length(regexp_replace(${insights.content}, '<[^>]+>', '', 'g'))`,
        savedAt: savedEssays.createdAt,
        publishedAt: insights.publishedAt,
      })
      .from(savedEssays)
      .innerJoin(insights, eq(insights.id, savedEssays.insightId))
      .where(and(eq(savedEssays.userId, userId), ne(insights.status, "archived")))
      .orderBy(desc(savedEssays.createdAt));

    return rows.map((r) => ({
      insightId: r.insightId,
      title: r.title,
      slug: r.slug,
      category: r.category || "Strategic Perspective",
      coverImage: r.coverImage,
      authorName: r.authorName,
      // Mirrors the estimate the essay page shows, so the two never disagree.
      readMinutes: readMinutesFromLength(r.contentLength),
      savedAt: r.savedAt?.toISOString() ?? null,
      publishedAt: r.publishedAt?.toISOString() ?? null,
    }));
  } catch (err) {
    console.error("Failed to load saved essays:", err);
    return [];
  }
}

/** Remove from the dashboard, where there is no essay id in scope but a slug. */
export async function removeSavedEssay(insightId: number): Promise<{ ok: boolean }> {
  const userId = await currentUserId();
  if (!userId || !Number.isInteger(insightId)) return { ok: false };

  try {
    await db
      .delete(savedEssays)
      .where(and(eq(savedEssays.userId, userId), eq(savedEssays.insightId, insightId)));
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (err) {
    console.error("Failed to remove saved essay:", err);
    return { ok: false };
  }
}
