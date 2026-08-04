"use server";

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { and, eq, ne, asc, desc } from "drizzle-orm";

/**
 * Public video feed.
 *
 * `status` is the transcode pipeline's state; `publishStatus` is the admin's
 * editorial decision. Non-failed videos with publishStatus='published' are shown.
 */
export async function getCompletedVideos() {
  try {
    const results = await db
      .select()
      .from(videos)
      .where(
        and(
          eq(videos.publishStatus, "published"),
          ne(videos.status, "failed")
        )
      )
      .orderBy(desc(videos.isStarred), asc(videos.displayOrder), desc(videos.createdAt));

    // Serialize Dates for Client Component consumption
    return results.map(v => ({
      ...v,
      createdAt: v.createdAt?.toISOString() || null,
      updatedAt: v.updatedAt?.toISOString() || null,
      processedAt: v.processedAt?.toISOString() || null
    }));
  } catch (err) {
    console.error("Failed to fetch completed videos from Neon DB:", err);
    return [];
  }
}
