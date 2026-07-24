"use server";

import { db } from "@/db";
import { insights } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
  await db.insert(insights).values(data);
  revalidatePath("/");
  revalidatePath("/admin/insights");
}

export async function updateInsight(id: number, data: Partial<typeof insights.$inferInsert>) {
  await db.update(insights).set({ ...data, updatedAt: new Date() }).where(eq(insights.id, id));
  revalidatePath("/");
  revalidatePath("/admin/insights");
}

export async function deleteInsight(id: number) {
  await db.delete(insights).where(eq(insights.id, id));
  revalidatePath("/");
  revalidatePath("/admin/insights");
}
