import { getCompletedVideos } from "@/app/actions/videos";
import { getCampaigns } from "@/app/actions/campaigns";
import VideoShowcaseGrid from "@/components/sections/VideoShowcaseGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "HD Video Campaigns & Ads",
  description: "Cinematic video production, high-conversion commercial campaigns, and viral social ads engineered for brand dominance and market acceleration.",
  path: "/videos",
});

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  let dbVideos: any[] = [];
  let dbCampaigns: any[] = [];
  try {
    const [vData, cData] = await Promise.all([
      getCompletedVideos().catch(() => []),
      getCampaigns().catch(() => []),
    ]);
    dbVideos = vData || [];
    dbCampaigns = cData || [];
  } catch (err) {
    console.error("Failed to load DB videos for showcase page:", err);
  }

  return (
    <div className="min-h-screen bg-warm-50 pt-20">
      <VideoShowcaseGrid dbVideos={dbVideos} dbCampaigns={dbCampaigns} />
    </div>
  );
}
