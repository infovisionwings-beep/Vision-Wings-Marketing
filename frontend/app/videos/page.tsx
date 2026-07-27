import { getCompletedVideos } from "@/app/actions/videos";
import VideoShowcaseGrid from "@/components/sections/VideoShowcaseGrid";

export const metadata = {
  title: "HD Video Campaigns & Ads - Vision Wings",
  description: "Cinematic video production, high-conversion commercial campaigns, and viral social ads engineered for brand dominance and market acceleration.",
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
