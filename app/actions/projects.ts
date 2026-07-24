"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";

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
  const user = await requireAdmin();
  await db.insert(projects).values(data);
  logAdminAction("project.create", user.id ?? "unknown", user.email ?? "unknown", { slug: data.slug, title: data.title });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: number, data: Partial<typeof projects.$inferInsert>) {
  const user = await requireAdmin();
  await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id));
  logAdminAction("project.update", user.id ?? "unknown", user.email ?? "unknown", { projectId: id });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: number) {
  const user = await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  logAdminAction("project.delete", user.id ?? "unknown", user.email ?? "unknown", { projectId: id });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
