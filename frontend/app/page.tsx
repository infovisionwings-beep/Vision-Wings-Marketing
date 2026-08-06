import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import AboutVision from "@/components/sections/AboutVision";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Work from "@/components/sections/Work";
import FeaturedVideosSection from "@/components/sections/FeaturedVideosSection";
import Insights from "@/components/sections/Insights";
import Contact from "@/components/sections/Contact";
import { getCompletedVideos } from "@/app/actions/videos";
import { getPublishedPhotos } from "@/app/actions/photos";
import { getSettings } from "@/app/actions/settings";
import { getCampaigns } from "@/app/actions/campaigns";
import { getClientLogos } from "@/app/actions/clientLogos";
import { getProjects } from "@/app/actions/projects";
import { getInsightSummaries } from "@/app/actions/insights";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function DynamicHomepageContent() {
  let dbVideos: any[] = [];
  let dbPhotos: any[] = [];
  let settings: any = {};
  let heroCampaigns: any[] = [];
  let showcaseCampaigns: any[] = [];
  let archiveCampaigns: any[] = [];
  let logos: any[] = [];
  let dbProjects: any[] = [];
  let dbInsights: any[] = [];

  try {
    const [vData, pData, sData, campaignData, logoData, projData, insightData] = await Promise.all([
      getCompletedVideos().catch(() => []),
      getPublishedPhotos().catch(() => []),
      getSettings().catch(() => ({})),
      // One query for all three sections instead of three round trips to a
      // serverless database that each returned two rows.
      getCampaigns().catch(() => []),
      getClientLogos().catch(() => []),
      getProjects().catch(() => []),
      // Fetched here rather than from an effect inside <Insights>, so the
      // section renders on the server and the article bodies never travel.
      getInsightSummaries().catch(() => []),
    ]);

    dbVideos = vData || [];
    dbPhotos = pData || [];
    settings = sData || {};
    const allCampaigns = campaignData || [];
    heroCampaigns = allCampaigns.filter((c: any) => c.section === "hero");
    showcaseCampaigns = allCampaigns.filter((c: any) => c.section === "showcases");
    archiveCampaigns = allCampaigns.filter((c: any) => c.section === "archive");
    logos = logoData || [];
    dbProjects = projData || [];
    dbInsights = insightData || [];
  } catch (err) {
    console.error("Failed to fetch CMS data for homepage:", err);
  }

  return (
    <>
      <Hero campaign={heroCampaigns[0]} settings={settings} />
      <AboutVision settings={settings} logos={logos} />
      <Services settings={settings} />
      <Projects projects={dbProjects} settings={settings} />
      <Work dbProjects={dbProjects} dbCampaigns={archiveCampaigns} dbPhotos={dbPhotos} settings={settings} />
      <FeaturedVideosSection dbVideos={dbVideos} settings={settings} dbCampaigns={showcaseCampaigns} />
      <Insights settings={settings} dbInsights={dbInsights} />
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

