import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(insights)
      .orderBy(desc(insights.createdAt));

    return NextResponse.json(list);
  } catch (err: any) {
    console.error("Failed to fetch insights in API:", err);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Blogs are the SEO designation's surface; Developer passes any role list.
    const user = await requireAdminApi(["Admin", "SEO"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    const [inserted] = await db
      .insert(insights)
      .values({
        title: data.title,
        slug: data.slug,
        category: data.category,
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

    await logAdminAction(
      "insight.create",
      user.name || user.email || "unknown",
      user.email || "unknown",
      { slug: data.slug, title: data.title }
    );

    revalidatePath("/");
    revalidatePath("/insights");
    revalidatePath("/essays");
    revalidatePath("/admin/insights");

    return NextResponse.json({ success: true, insight: inserted }, { status: 201 });
  } catch (err: any) {
    console.error("Failed to create insight in API:", err);
    return NextResponse.json({ error: err.message || "Failed to create insight" }, { status: 500 });
  }
}
