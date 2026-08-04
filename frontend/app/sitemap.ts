import { MetadataRoute } from "next";
import { getInsights } from "@/app/actions/insights";
import { getProjects } from "@/app/actions/projects";
import { SITE_URL } from "@/lib/seo";

// Article and case-study URLs come from the database, so the sitemap has to be
// generated per request rather than frozen at build time.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // `/login`, `/onboarding`, `/admin-login` and `/reset-password` are
  // deliberately absent. They are gated or transactional pages that carry a
  // noindex header, and listing a noindexed URL in a sitemap asks Google to
  // crawl something it is then told to discard.
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/work", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/videos", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/copyright", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/acceptable-use", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // The articles and case studies are the keyword-rich, genuinely indexable
  // pages, and none of them were being advertised to search engines. A failure
  // here must not take the whole sitemap down, so each source degrades to empty.
  const [insights, projects] = await Promise.all([
    getInsights().catch(() => []),
    getProjects().catch(() => []),
  ]);

  const insightEntries: MetadataRoute.Sitemap = insights
    .filter((i: any) => i.slug && i.publishStatus !== "draft" && i.publishStatus !== "archived")
    .map((i: any) => ({
      url: `${SITE_URL}/insights/${i.slug}`,
      // A real per-article timestamp, so lastModified means something instead of
      // every URL sharing one build time.
      lastModified: new Date(i.updatedAt || i.publishedAt || i.createdAt || now),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((p: any) => p.slug)
    .map((p: any) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt || now),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...insightEntries, ...projectEntries];
}
