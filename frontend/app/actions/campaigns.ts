"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";
import { eq, desc, asc, and } from "drizzle-orm";

export async function getCampaigns(section?: string) {
  try {
    const conditions = [eq(campaigns.publishStatus, "published")];
    if (section) {
      conditions.push(eq(campaigns.section, section));
    }

    const results = await db
      .select()
      .from(campaigns)
      .where(and(...conditions))
      // Newest first, ahead of starring. Publishing something and not seeing it
      // on the homepage reads as a broken save, so the most recent campaign now
      // leads its section and the star only breaks ties between older entries.
      // Explicit display order still wins outright when someone has set one.
      .orderBy(
        asc(campaigns.displayOrder),
        desc(campaigns.createdAt),
        desc(campaigns.isStarred),
        desc(campaigns.isFeatured)
      );

    return results.map((c) => ({
      ...c,
      createdAt: c.createdAt?.toISOString() || null,
      updatedAt: c.updatedAt?.toISOString() || null,
      scheduledAt: c.scheduledAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to fetch campaigns from Neon DB:", err);
    return [];
  }
}

export async function getAdminCampaigns() {
  try {
    await requireAdmin();
    const results = await db
      .select()
      .from(campaigns)
      .orderBy(asc(campaigns.displayOrder), desc(campaigns.createdAt));

    return results.map((c) => ({
      ...c,
      createdAt: c.createdAt?.toISOString() || null,
      updatedAt: c.updatedAt?.toISOString() || null,
      scheduledAt: c.scheduledAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to fetch admin campaigns:", err);
    return [];
  }
}

export async function getCampaignById(id: string) {
  try {
    await requireAdmin();
    const list = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    const c = list[0];
    if (!c) return null;
    return {
      ...c,
      createdAt: c.createdAt?.toISOString() || null,
      updatedAt: c.updatedAt?.toISOString() || null,
      scheduledAt: c.scheduledAt?.toISOString() || null,
    };
  } catch (err) {
    console.error(`Failed to fetch campaign by id (${id}):`, err);
    return null;
  }
}

export async function getCampaignBySlug(slug: string) {
  try {
    const list = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.slug, slug), eq(campaigns.publishStatus, "published")))
      .limit(1);

    const c = list[0];
    if (!c) return null;
    return {
      ...c,
      createdAt: c.createdAt?.toISOString() || null,
      updatedAt: c.updatedAt?.toISOString() || null,
      scheduledAt: c.scheduledAt?.toISOString() || null,
    };
  } catch (err) {
    console.error(`Failed to fetch campaign by slug (${slug}):`, err);
    return null;
  }
}

export async function createCampaign(data: any) {
  const user = await requireAdmin();

  const slug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 200) +
      "-" +
      Date.now().toString(36);

  const [inserted] = await db
    .insert(campaigns)
    .values({
      title: data.title,
      slug,
      subtitle: data.subtitle || null,
      description: data.description || null,
      coverImage: data.coverImage || null,
      videoUrl: data.videoUrl || null,
      posterImage: data.posterImage || null,
      client: data.client || null,
      category: data.category || null,
      year: data.year || null,
      duration: data.duration || null,
      quoteText: data.quoteText || null,
      section: data.section || "showcases",
      badges: data.badges || null,
      primaryCtaText: data.primaryCtaText || null,
      primaryCtaLink: data.primaryCtaLink || null,
      secondaryCtaText: data.secondaryCtaText || null,
      secondaryCtaLink: data.secondaryCtaLink || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      publishStatus: data.publishStatus || "draft",
      isFeatured: data.isFeatured ?? false,
      isStarred: data.isStarred ?? false,
      displayOrder: data.displayOrder ?? 0,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      createdBy: user.email ?? "admin",
    })
    .returning();

  logAdminAction("campaign.create", user.name || user.email || "unknown", user.email ?? "unknown", {
    slug,
    title: data.title,
    section: data.section,
  });

  revalidatePath("/");
  revalidatePath("/admin/campaigns");
  return {
    ...inserted,
    createdAt: inserted.createdAt?.toISOString() || null,
    updatedAt: inserted.updatedAt?.toISOString() || null,
    scheduledAt: inserted.scheduledAt?.toISOString() || null,
  };
}

export async function updateCampaign(id: string, data: any) {
  const user = await requireAdmin();

  const [updated] = await db
    .update(campaigns)
    .set({
      title: data.title,
      slug: data.slug,
      subtitle: data.subtitle ?? null,
      description: data.description ?? null,
      coverImage: data.coverImage ?? null,
      videoUrl: data.videoUrl ?? null,
      posterImage: data.posterImage ?? null,
      client: data.client ?? null,
      category: data.category ?? null,
      year: data.year ?? null,
      duration: data.duration ?? null,
      quoteText: data.quoteText ?? null,
      section: data.section,
      badges: data.badges ?? null,
      primaryCtaText: data.primaryCtaText ?? null,
      primaryCtaLink: data.primaryCtaLink ?? null,
      secondaryCtaText: data.secondaryCtaText ?? null,
      secondaryCtaLink: data.secondaryCtaLink ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      publishStatus: data.publishStatus,
      isFeatured: data.isFeatured ?? false,
      isStarred: data.isStarred ?? false,
      displayOrder: data.displayOrder ?? 0,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      updatedAt: new Date(),
    })
    .where(eq(campaigns.id, id))
    .returning();

  logAdminAction("campaign.update", user.name || user.email || "unknown", user.email ?? "unknown", {
    campaignId: id,
    title: data.title,
  });

  revalidatePath("/");
  revalidatePath("/admin/campaigns");
  return {
    ...updated,
    createdAt: updated.createdAt?.toISOString() || null,
    updatedAt: updated.updatedAt?.toISOString() || null,
    scheduledAt: updated.scheduledAt?.toISOString() || null,
  };
}

export async function deleteCampaign(id: string) {
  const user = await requireAdmin();

  // Soft delete: update publishStatus to 'archived'
  await db
    .update(campaigns)
    .set({
      publishStatus: "archived",
      updatedAt: new Date(),
    })
    .where(eq(campaigns.id, id));

  logAdminAction("campaign.soft_delete", user.name || user.email || "unknown", user.email ?? "unknown", {
    campaignId: id,
  });

  revalidatePath("/");
  revalidatePath("/admin/campaigns");
}

export async function reorderCampaigns(orderedIds: string[]) {
  const user = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(campaigns)
        .set({ displayOrder: index, updatedAt: new Date() })
        .where(eq(campaigns.id, id))
    )
  );

  logAdminAction("campaign.reorder", user.name || user.email || "unknown", user.email ?? "unknown", {
    count: orderedIds.length,
  });

  revalidatePath("/");
  revalidatePath("/admin/campaigns");
}
