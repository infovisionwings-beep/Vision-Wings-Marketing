import { InsightForm } from "@/components/admin/InsightForm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Edit Dispatch Dossier - Admin Portal",
};

export default async function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const insightId = parseInt(id, 10);
  if (isNaN(insightId)) {
    return notFound();
  }

  try {
    const list = await db
      .select()
      .from(insights)
      .where(eq(insights.id, insightId))
      .limit(1);

    const dbInsight = list[0];

    if (!dbInsight) {
      return notFound();
    }

    const formattedInsight = {
      id: dbInsight.id,
      title: dbInsight.title,
      slug: dbInsight.slug,
      category: dbInsight.category || "Strategy & Architecture",
      coverImage: dbInsight.coverImage || null,
      content: dbInsight.content || "",
      authorName: (dbInsight as any).authorName || "Amélie Laurent",
      authorRole: (dbInsight as any).authorRole || "Partner, Brand Architecture",
      authorAvatar: (dbInsight as any).authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      contributors: ((dbInsight as any).contributors || []) as { name: string; role: string; avatar: string; email?: string }[],
      isPublished: dbInsight.isPublished !== undefined ? Boolean(dbInsight.isPublished) : true,
      publishedAt: dbInsight.publishedAt || dbInsight.createdAt || new Date(),
      createdAt: dbInsight.createdAt || new Date(),
    };

    return (
      <div className="py-2">
        <h1 className="text-h2 text-navy-950 font-display font-bold mb-8">Edit Dispatch Dossier</h1>
        <InsightForm insight={formattedInsight} />
      </div>
    );
  } catch (err) {
    console.error("Failed to fetch insight for editing:", err);
    return notFound();
  }
}
