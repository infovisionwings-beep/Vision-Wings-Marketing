"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";
import { db } from "@/lib/db";
import { clientLogos } from "@/lib/db/schema";
import { eq, ne, asc, desc } from "drizzle-orm";

const serialize = (l: typeof clientLogos.$inferSelect) => ({
  ...l,
  createdAt: l.createdAt?.toISOString() || null,
  updatedAt: l.updatedAt?.toISOString() || null,
});

/** Public: excludes archived logos. Used by the homepage marquee. */
export async function getClientLogos() {
  try {
    const results = await db
      .select()
      .from(clientLogos)
      .where(ne(clientLogos.publishStatus, "archived"))
      .orderBy(asc(clientLogos.displayOrder), desc(clientLogos.createdAt));

    return results.map(serialize);
  } catch (err) {
    console.error("Failed to fetch client logos:", err);
    return [];
  }
}

/** Admin: every logo regardless of status. */
export async function getAdminClientLogos() {
  try {
    await requireAdmin();
    const results = await db
      .select()
      .from(clientLogos)
      .orderBy(asc(clientLogos.displayOrder), desc(clientLogos.createdAt));

    return results.map(serialize);
  } catch (err) {
    console.error("Failed to fetch admin client logos:", err);
    return [];
  }
}

export async function createClientLogo(data: {
  name: string;
  logoUrl: string;
  linkUrl?: string;
  displayOrder?: number;
}) {
  try {
    const user = await requireAdmin();

    if (!data.name?.trim()) return { error: "Company name is required" };
    if (!data.logoUrl?.trim()) return { error: "Choose a logo image" };

    const [inserted] = await db
      .insert(clientLogos)
      .values({
        name: data.name.trim(),
        logoUrl: data.logoUrl,
        linkUrl: data.linkUrl?.trim() || null,
        displayOrder: data.displayOrder ?? 0,
      })
      .returning();

    logAdminAction(
      "client_logo.create",
      user.name || user.email || "unknown",
      user.email ?? "unknown",
      { logoId: inserted.id, name: inserted.name }
    );

    revalidatePath("/");
    revalidatePath("/admin/logos");
    return { success: true, logo: serialize(inserted) };
  } catch (err: any) {
    console.error("Failed to create client logo:", err);
    return { error: err?.message || "Failed to create logo" };
  }
}

export async function updateClientLogo(
  id: string,
  data: { name: string; logoUrl: string; linkUrl?: string; displayOrder?: number }
) {
  try {
    const user = await requireAdmin();

    if (!data.name?.trim()) return { error: "Company name is required" };
    if (!data.logoUrl?.trim()) return { error: "Choose a logo image" };

    const [updated] = await db
      .update(clientLogos)
      .set({
        name: data.name.trim(),
        logoUrl: data.logoUrl,
        linkUrl: data.linkUrl?.trim() || null,
        displayOrder: data.displayOrder ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(clientLogos.id, id))
      .returning();

    if (!updated) return { error: "Logo not found" };

    logAdminAction(
      "client_logo.update",
      user.name || user.email || "unknown",
      user.email ?? "unknown",
      { logoId: id }
    );

    revalidatePath("/");
    revalidatePath("/admin/logos");
    return { success: true, logo: serialize(updated) };
  } catch (err: any) {
    console.error("Failed to update client logo:", err);
    return { error: err?.message || "Failed to update logo" };
  }
}

export async function archiveClientLogo(id: string) {
  try {
    const user = await requireAdmin();

    await db
      .update(clientLogos)
      .set({ publishStatus: "archived", updatedAt: new Date() })
      .where(eq(clientLogos.id, id));

    logAdminAction(
      "client_logo.archive",
      user.name || user.email || "unknown",
      user.email ?? "unknown",
      { logoId: id }
    );

    revalidatePath("/");
    revalidatePath("/admin/logos");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to archive logo" };
  }
}

export async function restoreClientLogo(id: string) {
  try {
    const user = await requireAdmin();

    await db
      .update(clientLogos)
      .set({ publishStatus: "active", updatedAt: new Date() })
      .where(eq(clientLogos.id, id));

    logAdminAction(
      "client_logo.restore",
      user.name || user.email || "unknown",
      user.email ?? "unknown",
      { logoId: id }
    );

    revalidatePath("/");
    revalidatePath("/admin/logos");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to restore logo" };
  }
}

/**
 * Permanent delete. Refuses anything not already archived, matching the
 * archive-before-delete guard used for photos, videos, and projects -- so a logo
 * still live on the homepage marquee cannot be destroyed in one click.
 */
export async function deleteClientLogo(id: string) {
  try {
    const user = await requireAdmin();

    const [existing] = await db.select().from(clientLogos).where(eq(clientLogos.id, id));
    if (!existing) return { error: "Logo not found" };
    if (existing.publishStatus !== "archived") {
      return { error: "Archive this logo before deleting it permanently." };
    }

    await db.delete(clientLogos).where(eq(clientLogos.id, id));

    logAdminAction(
      "client_logo.delete",
      user.name || user.email || "unknown",
      user.email ?? "unknown",
      { logoId: id, name: existing.name }
    );

    revalidatePath("/");
    revalidatePath("/admin/logos");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to delete logo" };
  }
}
