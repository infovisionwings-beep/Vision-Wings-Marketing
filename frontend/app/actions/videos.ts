"use server";

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { and, eq, asc, desc } from "drizzle-orm";

/**
 * Public video feed.
 *
 * `status` is the transcode pipeline's state; `publishStatus` is the admin's
 * editorial decision. Only filtering on the former meant every draft upload was
 * live on the public site and the Publish toggle in the media library changed
 * nothing. Both now have to pass, and the admin's star/order controls decide
 * the sequence.
 */
export async function getCompletedVideos() {
  try {
    const results = await db
      .select()
      .from(videos)
      .where(and(eq(videos.status, "completed"), eq(videos.publishStatus, "published")))
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
