"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

/**
 * Every column except `content` and `contributors`, plus the body's length.
 *
 * Listings only ever needed a title, an excerpt and a read-time estimate, but
 * read-time was derived from `content.length`, so the full article HTML was
 * being transferred to compute one integer. At four articles that is 87 KB per
 * call and it grows with every post published. `length(content)` is computed in
 * Postgres instead, and the body never leaves the database.
 */
const SUMMARY_COLUMNS = {
  id: insights.id,
  title: insights.title,
  slug: insights.slug,
  category: insights.category,
  coverImage: insights.coverImage,
  excerpt: insights.excerpt,
  authorName: insights.authorName,
  authorRole: insights.authorRole,
  authorAvatar: insights.authorAvatar,
  isPublished: insights.isPublished,
  status: insights.status,
  publishedAt: insights.publishedAt,
  createdAt: insights.createdAt,
  updatedAt: insights.updatedAt,
  // Tags stripped before measuring. The raw column length counted markup as
  // prose, which is why a 2,500-word article was advertised as a 53-minute read.
  contentLength: sql<number>`length(regexp_replace(${insights.content}, '<[^>]+>', '', 'g'))`,
};

/**
 * Listing data for the insights index, the homepage section and the sitemap.
 * Use this anywhere the article body is not rendered; use getInsights() only
 * where the body is genuinely needed.
 */
export async function getInsightSummaries() {
  try {
    const results = await db
      .select(SUMMARY_COLUMNS)
      .from(insights)
      .orderBy(desc(insights.createdAt));

    return results.map((i) => ({
      ...i,
      contentLength: Number(i.contentLength) || 0,
      createdAt: i.createdAt?.toISOString() || null,
      updatedAt: i.updatedAt?.toISOString() || null,
      publishedAt: i.publishedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to fetch insight summaries from Neon DB:", err);
    return [];
  }
}

export async function getInsights() {
  try {
    const results = await db
      .select()
      .from(insights)
      .orderBy(desc(insights.createdAt));

    return results.map(i => ({
      ...i,
      createdAt: i.createdAt?.toISOString() || null,
      updatedAt: i.updatedAt?.toISOString() || null,
      publishedAt: i.publishedAt?.toISOString() || null
    }));
  } catch (err) {
    console.error("Failed to fetch insights from Neon DB:", err);
    return [];
  }
}

export async function getInsightBySlug(slug: string) {
  try {
    const list = await db
      .select()
      .from(insights)
      .where(eq(insights.slug, slug))
      .limit(1);
    const i = list[0];
    if (!i) return null;
    return {
      ...i,
      createdAt: i.createdAt?.toISOString() || null,
      updatedAt: i.updatedAt?.toISOString() || null,
      publishedAt: i.publishedAt?.toISOString() || null
    };
  } catch (err) {
    console.error(`Failed to fetch insight by slug (${slug}):`, err);
    return null;
  }
}

export async function createInsight(data: any) {
  const user = await requireAdmin();

  const [inserted] = await db
    .insert(insights)
    .values({
      title: data.title,
      slug: data.slug,
      category: data.category,
      excerpt: data.excerpt,
      coverImage: data.coverImage || "",
      content: data.content || "",
      authorName: data.authorName || "Amélie Laurent",
      authorRole: data.authorRole || "Partner, Brand Architecture",
      authorAvatar: data.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      contributors: data.contributors || null,
      isPublished: data.isPublished ?? false,
      publishedAt: data.isPublished ? new Date() : null,
    })
    .returning();

  logAdminAction(
    "insight.create", 
    user.name || user.email, 
    user.email || "unknown", 
    { slug: data.slug, title: data.title }
  );

  revalidatePath("/");
  revalidatePath("/admin/insights");
  return inserted;
}

export async function updateInsight(id: number, data: any) {
  const user = await requireAdmin();

  const [updated] = await db
    .update(insights)
    .set({
      title: data.title,
      slug: data.slug,
      category: data.category,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      content: data.content,
      authorName: data.authorName,
      authorRole: data.authorRole,
      authorAvatar: data.authorAvatar,
      contributors: data.contributors,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(insights.id, id))
    .returning();

  logAdminAction(
    "insight.update", 
    user.name || user.email, 
    user.email || "unknown", 
    { insightId: id }
  );

  revalidatePath("/");
  revalidatePath("/admin/insights");
  return updated;
}

export async function deleteInsight(id: number) {
  const user = await requireAdmin();

  await db
    .delete(insights)
    .where(eq(insights.id, id));

  logAdminAction(
    "insight.delete", 
    user.name || user.email, 
    user.email || "unknown", 
    { insightId: id }
  );

  revalidatePath("/");
  revalidatePath("/admin/insights");
}
