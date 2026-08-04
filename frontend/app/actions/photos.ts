"use server";

import { db } from "@/lib/db";
import { photos } from "@/lib/db/schema";
import { and, eq, ne, asc, desc } from "drizzle-orm";

/**
 * Public photo feed, mirroring getCompletedVideos.
 *
 * `status` is the upload pipeline's state (a half-processed image has no webp
 * rendition to show); `publishStatus` is the admin's editorial decision. Both
 * have to pass, and the star / display-order controls decide the sequence.
 */
export async function getPublishedPhotos() {
  try {
    const results = await db
      .select()
      .from(photos)
      .where(
        and(
          eq(photos.publishStatus, "published"),
          ne(photos.status, "failed")
        )
      )
      .orderBy(desc(photos.isStarred), asc(photos.displayOrder), desc(photos.createdAt));

    // Serialize Dates for Client Component consumption
    return results.map((p) => ({
      ...p,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
      processedAt: p.processedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to fetch published photos from Neon DB:", err);
    return [];
  }
}
