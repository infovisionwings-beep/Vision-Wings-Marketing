import { getCompletedVideos } from "@/app/actions/videos";
import VideoShowcaseGrid from "@/components/sections/VideoShowcaseGrid";

export const metadata = {
  title: "HD Video Tours & Architecture - Vision Wings",
  description: "Cinematic, lossless media pipelines engineered for real estate prestige, brand dominance, and architectural storytelling.",
};

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  let dbVideos: any[] = [];
  try {
    dbVideos = await getCompletedVideos();
  } catch (err) {
    console.error("Failed to load DB videos for showcase page:", err);
  }

  return (
    <main className="min-h-screen bg-warm-50 pt-20">
      <VideoShowcaseGrid dbVideos={dbVideos} />
    </main>
  );
}
