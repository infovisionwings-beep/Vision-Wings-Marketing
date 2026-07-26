import Hero from "@/components/sections/Hero";
import AboutVision from "@/components/sections/AboutVision";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import FeaturedVideosSection from "@/components/sections/FeaturedVideosSection";
import Insights from "@/components/sections/Insights";
import Contact from "@/components/sections/Contact";
import { getCompletedVideos } from "@/app/actions/videos";

export const dynamic = "force-dynamic";

export default async function Home() {
  let dbVideos: any[] = [];
  try {
    dbVideos = await getCompletedVideos();
  } catch (err) {
    console.error("Failed to fetch DB videos for homepage:", err);
  }

  return (
    <>
      <Hero />
      <AboutVision />
      <Services />
      <Work />
      <FeaturedVideosSection dbVideos={dbVideos} />
      <Insights />
      <Contact />
    </>
  );
}
