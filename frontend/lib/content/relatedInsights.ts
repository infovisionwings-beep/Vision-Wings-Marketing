import { getInsightSummaries } from "@/app/actions/insights";
import { localInsights } from "@/lib/content/localInsights";
import { readTimeFromLength } from "@/lib/content/readTime";
import { format } from "date-fns";

export interface RelatedInsight {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  readTime: string;
  date: string;
}

/**
 * Up to `limit` other articles to offer at the end of one.
 *
 * The database rows and the repo's local articles are merged rather than one
 * replacing the other — the /insights landing page swaps the local set out
 * entirely once the database has any row, which would leave this section
 * pulling from a different pool than the page it sits under. Slug is the
 * identity, and the database wins a collision because it is the editable copy.
 *
 * Ordering is same-category first, then everything else, each newest-first. It
 * is a relevance heuristic, not a recommender.
 */
export async function getRelatedInsights(
  currentSlug: string,
  category?: string,
  limit = 3
): Promise<RelatedInsight[]> {
  const bySlug = new Map<string, RelatedInsight & { sortKey: number }>();

  const push = (item: RelatedInsight & { sortKey: number }, overwrite: boolean) => {
    if (!item.slug || item.slug === currentSlug) return;
    if (!overwrite && bySlug.has(item.slug)) return;
    bySlug.set(item.slug, item);
  };

  for (const item of localInsights) {
    push(
      {
        slug: item.slug,
        title: item.title,
        category: item.category,
        excerpt: item.excerpt,
        coverImage: item.coverImage,
        readTime: item.readTime,
        date: item.date,
        sortKey: Date.parse(item.publishedAt) || 0,
      },
      false
    );
  }

  try {
    for (const row of (await getInsightSummaries()) as any[]) {
      // Drafts are not offered as further reading.
      if (row.isPublished === false || row.status === "draft") continue;
      const when = row.publishedAt || row.createdAt;
      push(
        {
          slug: row.slug,
          title: row.title || "Strategic Perspective",
          category: row.category || "Growth Strategy & Ads",
          excerpt: row.excerpt || "",
          coverImage: row.coverImage || undefined,
          readTime: readTimeFromLength(row.contentLength),
          date: when ? format(new Date(when), "MMM d, yyyy") : "",
          sortKey: when ? Date.parse(when) : 0,
        },
        true
      );
    }
  } catch (err) {
    // The section is an extra, not the article. Local articles still show.
    console.error("Failed to load related insights from the database:", err);
  }

  const all = [...bySlug.values()].sort((a, b) => b.sortKey - a.sortKey);
  const sameCategory = category ? all.filter((i) => i.category === category) : [];
  const rest = all.filter((i) => !sameCategory.includes(i));

  return [...sameCategory, ...rest].slice(0, limit).map(({ sortKey, ...item }) => item);
}
