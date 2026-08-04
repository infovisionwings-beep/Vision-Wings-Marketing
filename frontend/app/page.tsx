import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import AboutVision from "@/components/sections/AboutVision";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import FeaturedVideosSection from "@/components/sections/FeaturedVideosSection";
import Insights from "@/components/sections/Insights";
import Contact from "@/components/sections/Contact";
import { getCompletedVideos } from "@/app/actions/videos";
import { getPublishedPhotos } from "@/app/actions/photos";
import { getSettings } from "@/app/actions/settings";
import { getCampaigns } from "@/app/actions/campaigns";
import { getClientLogos } from "@/app/actions/clientLogos";
import { pageMetadata } from "@/lib/seo";

// The homepage carried no metadata of its own, so it had no canonical and
// inherited the root layout's static og:url — which is what made every page on
// the site advertise the same social card.
export const metadata = pageMetadata({
  title: "Vision Wings Marketing - Strategic Growth & Marketing Agency",
  description:
    "Vision Wings Marketing is a strategic marketing and growth partner based in Varanasi, elevating growth-stage businesses.",
  path: "",
  absoluteTitle: true,
});

export const revalidate = 60; // 1 minute revalidation for CMS freshness

async function DynamicHomepageContent() {
  let dbVideos: any[] = [];
  let dbPhotos: any[] = [];
  let settings: any = {};
  let heroCampaigns: any[] = [];
  let showcaseCampaigns: any[] = [];
  let archiveCampaigns: any[] = [];
  let logos: any[] = [];

  try {
    const [vData, pData, sData, heroData, showData, archData, logoData] = await Promise.all([
      getCompletedVideos().catch(() => []),
      getPublishedPhotos().catch(() => []),
      getSettings().catch(() => ({})),
      getCampaigns("hero").catch(() => []),
      getCampaigns("showcases").catch(() => []),
      getCampaigns("archive").catch(() => []),
      getClientLogos().catch(() => []),
    ]);

    dbVideos = vData || [];
    dbPhotos = pData || [];
    settings = sData || {};
    heroCampaigns = heroData || [];
    showcaseCampaigns = showData || [];
    archiveCampaigns = archData || [];
    logos = logoData || [];
  } catch (err) {
    console.error("Failed to fetch CMS data for homepage:", err);
  }

  return (
    <>
      <Hero campaign={heroCampaigns[0]} settings={settings} />
      <AboutVision settings={settings} logos={logos} />
      <Services settings={settings} />
      <Work dbCampaigns={archiveCampaigns} dbPhotos={dbPhotos} settings={settings} />
      <FeaturedVideosSection dbVideos={dbVideos} settings={settings} dbCampaigns={showcaseCampaigns} />
      <Insights settings={settings} />
      <Contact settings={settings} />
    </>
  );
}

export default function Home() {
  // The fallback passes no settings on purpose: `content()` falls back to the
  // schema defaults, so the skeleton renders real copy rather than empty headings.
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

