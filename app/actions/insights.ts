"use server";

import { db } from "@/db";
import { insights } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";

export async function getInsights() {
  return db.select().from(insights).orderBy(insights.createdAt);
}

export async function getInsightBySlug(slug: string) {
  const result = await db.select().from(insights).where(eq(insights.slug, slug));
  return result[0];
}

export async function createInsight(data: {
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  content: string;
  isPublished?: boolean;
  publishedAt?: Date;
}) {
  const user = await requireAdmin();
  await db.insert(insights).values(data);
  logAdminAction("insight.create", user.id ?? "unknown", user.email ?? "unknown", { slug: data.slug, title: data.title });
  revalidatePath("/");
  revalidatePath("/admin/insights");
}

export async function updateInsight(id: number, data: Partial<typeof insights.$inferInsert>) {
  const user = await requireAdmin();
  await db.update(insights).set({ ...data, updatedAt: new Date() }).where(eq(insights.id, id));
  logAdminAction("insight.update", user.id ?? "unknown", user.email ?? "unknown", { insightId: id });
  revalidatePath("/");
  revalidatePath("/admin/insights");
}

export async function deleteInsight(id: number) {
  const user = await requireAdmin();
  await db.delete(insights).where(eq(insights.id, id));
  logAdminAction("insight.delete", user.id ?? "unknown", user.email ?? "unknown", { insightId: id });
  revalidatePath("/");
  revalidatePath("/admin/insights");
}
