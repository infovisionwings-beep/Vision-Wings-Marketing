"use server";

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getCompletedVideos() {
  try {
    return await db
      .select()
      .from(videos)
      .where(eq(videos.status, "completed"))
      .orderBy(desc(videos.createdAt));
  } catch (err) {
    console.error("Failed to fetch completed videos from Neon DB:", err);
    return [];
  }
}
