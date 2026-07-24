"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return db.select().from(projects).orderBy(projects.createdAt);
}

export async function getProjectBySlug(slug: string) {
  const result = await db.select().from(projects).where(eq(projects.slug, slug));
  return result[0];
}

export async function createProject(data: {
  title: string;
  slug: string;
  category: string;
  year: string;
  coverImage?: string;
  content: string;
  isFeatured?: boolean;
}) {
  await db.insert(projects).values(data);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: number, data: Partial<typeof projects.$inferInsert>) {
  await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id));
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
