/**
 * Insights authored as standalone HTML files at the repo root rather than in the
 * database. The detail page reads the file when the DB has no row for the slug,
 * and scripts/seed_local_insights.ts pushes the same metadata into the DB.
 *
 * Keep the metadata here only — the article body stays in its HTML file.
 *
 * Author and cover values mirror what is already published, so re-seeding an
 * existing article never replaces a real byline or an uploaded image.
 */

export interface LocalInsight {
  slug: string;
  /** Path relative to the repo root (one level above the Next.js app). */
  file: string;
  title: string;
  category: string;
  /** Display date, also used as the seeded publishedAt. */
  date: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  contributors: { name: string; role: string; avatar: string; email?: string }[];
}

const AUTHOR = {
  name: "Srijan Kumar",
  role: "Founding Partner & Strategy",
  email: "www.srijankumar@gmail.com",
  avatar: "https://mfw6n8pxflgk9vke.public.blob.vercel-storage.com/photos/admin/fefebb42-a7de-4cb7-a1ee-91d411bd4da8/original.png",
};

const BYLINE = {
  author: AUTHOR.name,
  authorRole: AUTHOR.role,
  authorAvatar: AUTHOR.avatar,
  contributors: [AUTHOR],
};

export const localInsights: LocalInsight[] = [
  {
    // Matches the existing database row so the article has one URL, not two.
    // /insights/varanasi-business-promotion redirects here (see next.config.ts).
    slug: "how-to-promote-a-small-business-in-varanasi",
    file: "varanasi-business-promotion.html",
    title: "How to Promote a Small Business in Varanasi: What Works, What Costs, and What to Do First",
    category: "Strategy & Architecture",
    date: "Aug 5, 2026",
    publishedAt: "2026-08-05T07:01:47.083Z",
    readTime: "12 min read",
    excerpt: "A practical guide to the channels that move customers in Varanasi: Google Business Profile, WhatsApp storefronts, Hindi content, short-form craft videos, and seasonal festival planning.",
    coverImage: "https://mfw6n8pxflgk9vke.public.blob.vercel-storage.com/photos/admin/5f507167-6523-48b5-9016-b293d25a9544/original.png",
    ...BYLINE,
  },
  {
    slug: "ai-search-visibility-india",
    file: "ai-search-visibility-india.html",
    title: "AI Search Is Taking Your Clicks: What the Data Shows and What to Do About It",
    category: "AI Search & Discovery",
    date: "Aug 5, 2026",
    publishedAt: "2026-08-05T00:00:00Z",
    readTime: "11 min read",
    excerpt: "Pew tracked 68,879 Google searches and found clicks halve when an AI summary appears. What that means for an Indian business, why there is no AI schema to buy, and what actually gets a page cited.",
    coverImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1600&q=80",
    ...BYLINE,
  },
  {
    slug: "digital-marketing-cost-india",
    file: "digital-marketing-cost-india.html",
    title: "What Digital Marketing Actually Costs a Small Business in India (2026)",
    category: "Budget & Planning",
    date: "Aug 5, 2026",
    publishedAt: "2026-08-05T00:00:00Z",
    readTime: "11 min read",
    excerpt: "Why India's published cost benchmarks disagree by ₹52,793 crore, what MSMEs actually spend, and a twenty-minute method for deriving your own maximum cost per enquiry.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
    ...BYLINE,
  },
];

export const localInsightBySlug = Object.fromEntries(
  localInsights.map((item) => [item.slug, item]),
) as Record<string, LocalInsight | undefined>;
