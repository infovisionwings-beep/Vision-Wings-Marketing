import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  const { db } = await import("../lib/db");
  const { insights } = await import("../lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const htmlPath = path.resolve(__dirname, "../../varanasi-business-promotion.html");
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  const title = "How to Promote a Small Business in Varanasi: What Works, What Costs, and What to Do First";
  const slug = "varanasi-business-promotion";
  const category = "Local Strategy & Growth";
  const coverImage = "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80";

  console.log("Checking if insight exists...");
  const existing = await db.select().from(insights).where(eq(insights.slug, slug));

  if (existing.length > 0) {
    console.log("Updating existing Varanasi promotion insight...");
    await db
      .update(insights)
      .set({
        title,
        category,
        coverImage,
        content: htmlContent,
        authorName: "Amélie Laurent",
        authorRole: "Partner, Growth Strategy",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        contributors: [
          { name: "Mia di Silva", role: "Design Craft & Analytics", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" },
          { name: "Oliva Nacelle", role: "Market Telemetry", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }
        ],
        isPublished: true,
        publishedAt: new Date("2026-08-05T00:00:00Z"),
        updatedAt: new Date(),
      })
      .where(eq(insights.slug, slug));
    console.log("Updated successfully!");
  } else {
    console.log("Creating new Varanasi promotion insight...");
    await db.insert(insights).values({
      title,
      slug,
      category,
      coverImage,
      content: htmlContent,
      authorName: "Amélie Laurent",
      authorRole: "Partner, Growth Strategy",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      contributors: [
        { name: "Mia di Silva", role: "Design Craft & Analytics", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" },
        { name: "Oliva Nacelle", role: "Market Telemetry", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }
      ],
      isPublished: true,
      publishedAt: new Date("2026-08-05T00:00:00Z"),
    });
    console.log("Inserted successfully!");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
