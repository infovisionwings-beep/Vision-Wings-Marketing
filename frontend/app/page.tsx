import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import AboutVision from "@/components/sections/AboutVision";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import FeaturedVideosSection from "@/components/sections/FeaturedVideosSection";
import Insights from "@/components/sections/Insights";
import Contact from "@/components/sections/Contact";
import { getCompletedVideos } from "@/app/actions/videos";
import { getSettings } from "@/app/actions/settings";
import { getCampaigns } from "@/app/actions/campaigns";

export const revalidate = 60; // 1 minute revalidation for CMS freshness

async function DynamicHomepageContent() {
  let dbVideos: any[] = [];
  let settings: any = {};
  let heroCampaigns: any[] = [];
  let showcaseCampaigns: any[] = [];
  let archiveCampaigns: any[] = [];

  try {
    const [vData, sData, heroData, showData, archData] = await Promise.all([
      getCompletedVideos().catch(() => []),
      getSettings().catch(() => ({})),
      getCampaigns("hero").catch(() => []),
      getCampaigns("showcases").catch(() => []),
      getCampaigns("archive").catch(() => []),
    ]);

    dbVideos = vData || [];
    settings = sData || {};
    heroCampaigns = heroData || [];
    showcaseCampaigns = showData || [];
    archiveCampaigns = archData || [];
  } catch (err) {
    console.error("Failed to fetch CMS data for homepage:", err);
  }

  return (
    <>
      <Hero campaign={heroCampaigns[0]} />
      <AboutVision />
      <Services />
      <Work dbCampaigns={archiveCampaigns} />
      <FeaturedVideosSection dbVideos={dbVideos} settings={settings} dbCampaigns={showcaseCampaigns} />
      <Insights />
      <Contact />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <>
        <Hero />
        <AboutVision />
        <Services />
        <Work />
        <FeaturedVideosSection dbVideos={[]} settings={{}} />
        <Insights />
        <Contact />
      </>
    }>
      <DynamicHomepageContent />
    </Suspense>
  );
}

