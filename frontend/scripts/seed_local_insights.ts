import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  const { db } = await import("../lib/db");
  const { insights } = await import("../lib/db/schema");
  const { eq } = await import("drizzle-orm");
  const { localInsights } = await import("../lib/content/localInsights");

  for (const item of localInsights) {
    const htmlPath = path.resolve(__dirname, "../..", item.file);
    if (!fs.existsSync(htmlPath)) {
      console.warn(`Skipping ${item.slug}: ${item.file} not found`);
      continue;
    }

    const row = {
      title: item.title,
      category: item.category,
      excerpt: item.excerpt,
      coverImage: item.coverImage,
      content: fs.readFileSync(htmlPath, "utf-8"),
      authorName: item.author,
      authorRole: item.authorRole,
      authorAvatar: item.authorAvatar,
      contributors: item.contributors,
      isPublished: true,
      publishedAt: new Date(item.publishedAt),
    };

    const existing = await db.select().from(insights).where(eq(insights.slug, item.slug));

    if (existing.length > 0) {
      await db
        .update(insights)
        .set({ ...row, updatedAt: new Date() })
        .where(eq(insights.slug, item.slug));
      console.log(`Updated ${item.slug}`);
    } else {
      await db.insert(insights).values({ ...row, slug: item.slug });
      console.log(`Inserted ${item.slug}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
