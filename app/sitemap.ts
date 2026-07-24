import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://visionwing.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    // Adding placeholder URLs for typical dynamic content or static pages
    {
      url: "https://visionwing.com/admin", // Usually admin routes are excluded, but adding for completeness of structure
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
