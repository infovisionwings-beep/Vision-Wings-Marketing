"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and, ne, isNull, or, desc } from "drizzle-orm";

/** Public: excludes archived projects. Used by the homepage and /work. */
export async function getProjects() {
  try {
    const results = await db
      .select()
      .from(projects)
      .where(or(isNull(projects.publishStatus), ne(projects.publishStatus, "archived")))
      .orderBy(desc(projects.createdAt));

    return results.map(p => ({
      ...p,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null
    }));
  } catch (err) {
    console.error("Failed to fetch projects from Neon DB:", err);
    return [];
  }
}

/** Admin: every project regardless of status, so archived ones can still be
 *  found, restored, or permanently deleted from the list. */
export async function getAdminProjects() {
  try {
    await requireAdmin();
    const results = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));

    return results.map(p => ({
      ...p,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null
    }));
  } catch (err) {
    console.error("Failed to fetch admin projects:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const list = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), or(isNull(projects.publishStatus), ne(projects.publishStatus, "archived"))))
      .limit(1);
    const p = list[0];
    if (!p) return null;
    return {
      ...p,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null
    };
  } catch (err) {
    console.error(`Failed to fetch project by slug (${slug}):`, err);
    return null;
  }
}

export async function createProject(data: any) {
  const user = await requireAdmin();

  const [inserted] = await db
    .insert(projects)
    .values({
      title: data.title,
      slug: data.slug,
      category: data.category,
      year: data.year,
      coverImage: data.coverImage || "",
      content: data.content || "",
      isFeatured: data.isFeatured ?? false,
      publishStatus: "active",
    })
    .returning();

  logAdminAction(
    "project.create",
    user.name || user.email || "unknown",
    user.email ?? "unknown",
    { slug: data.slug, title: data.title }
  );

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return inserted;
}

export async function updateProject(id: number, data: any) {
  const user = await requireAdmin();

  const [updated] = await db
    .update(projects)
    .set({
      title: data.title,
      slug: data.slug,
      category: data.category,
      year: data.year,
      coverImage: data.coverImage,
      content: data.content,
      isFeatured: data.isFeatured,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  logAdminAction(
    "project.update",
    user.name || user.email || "unknown",
    user.email ?? "unknown",
    { projectId: id }
  );

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return updated;
}

/** Soft delete: sets publishStatus to 'archived'. Reversible via restoreProject. */
export async function archiveProject(id: number) {
  const user = await requireAdmin();

  await db
    .update(projects)
    .set({ publishStatus: "archived", updatedAt: new Date() })
    .where(eq(projects.id, id));

  logAdminAction(
    "project.archive",
    user.name || user.email || "unknown",
    user.email ?? "unknown",
    { projectId: id }
  );

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
}

export async function restoreProject(id: number) {
  const user = await requireAdmin();

  await db
    .update(projects)
    .set({ publishStatus: "active", updatedAt: new Date() })
    .where(eq(projects.id, id));

  logAdminAction(
    "project.restore",
    user.name || user.email || "unknown",
    user.email ?? "unknown",
    { projectId: id }
  );

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
}

/**
 * Permanent delete. Refuses anything not already archived, so a live project a
 * page still links to cannot be destroyed in one click with no undo -- this used
 * to be a hard delete with no confirmation step and no UI to reach it at all.
 */
export async function deleteProject(id: number) {
  const user = await requireAdmin();

  const [existing] = await db.select().from(projects).where(eq(projects.id, id));
  if (!existing) return { error: "Project not found" };
  if (existing.publishStatus !== "archived") {
    return { error: "Archive this project before deleting it permanently." };
  }

  await db
    .delete(projects)
    .where(eq(projects.id, id));

  logAdminAction(
    "project.delete",
    user.name || user.email || "unknown",
    user.email ?? "unknown",
    { projectId: id, title: existing.title }
  );

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}
