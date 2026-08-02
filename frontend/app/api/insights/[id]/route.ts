import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const insightId = Number(id);

    // Blogs are the SEO designation's surface; Developer passes any role list.
    const user = await requireAdminApi(["Admin", "SEO"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    const [updated] = await db
      .update(insights)
      .set({
        title: data.title,
        slug: data.slug,
        category: data.category,
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
      .where(eq(insights.id, insightId))
      .returning();

    await logAdminAction(
      "insight.update",
      user.name || user.email || "unknown",
      user.email || "unknown",
      { insightId }
    );

    revalidatePath("/");
    revalidatePath("/insights");
    revalidatePath("/essays");
    revalidatePath(`/insights/${data.slug}`);
    revalidatePath(`/essays/${data.slug}`);
    revalidatePath("/admin/insights");

    return NextResponse.json({ success: true, insight: updated });
  } catch (err: any) {
    console.error("Failed to update insight in API:", err);
    return NextResponse.json({ error: err.message || "Failed to update insight" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const insightId = Number(id);

    // Blogs are the SEO designation's surface; Developer passes any role list.
    const user = await requireAdminApi(["Admin", "SEO"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .delete(insights)
      .where(eq(insights.id, insightId));

    await logAdminAction(
      "insight.delete",
      user.name || user.email || "unknown",
      user.email || "unknown",
      { insightId }
    );

    revalidatePath("/");
    revalidatePath("/insights");
    revalidatePath("/essays");
    revalidatePath("/admin/insights");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to delete insight in API:", err);
    return NextResponse.json({ error: err.message || "Failed to delete insight" }, { status: 500 });
  }
}
