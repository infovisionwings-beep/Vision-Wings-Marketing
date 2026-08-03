import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.visionwingsmarketing.com";
  const now = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/work", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/videos", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/onboarding", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/login", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/cookies", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/refund-policy", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/disclaimer", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/copyright", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/accessibility", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/acceptable-use", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
