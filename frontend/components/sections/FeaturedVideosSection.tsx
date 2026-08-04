"use client";

// Reading this as: Homepage Featured Videos section for an elite design and real estate branding agency.
// Using an Asymmetric Exhibition Bento Grid with high typographic contrast, warm dark-mode styling, and tactile hover physics.
// Every single interactive element, card, and button opens `/videos` directly per user instructions.
// DESIGN_VARIANCE: 9
// MOTION_INTENSITY: 7
// VISUAL_DENSITY: 3

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight, Play, Sparkles, Video, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { videoTitle, videoDuration, videoPoster, videoYear } from "@/lib/media/present";

interface FeaturedVideosProps {
  dbVideos?: any[];
  settings?: Record<string, string>;
  dbCampaigns?: any[];
}

const fallbackFeaturedVideos = [
  {
    id: "feat-1",
    title: "Lumina Health Brand Launch Film",
    client: "Lumina Systems",
    category: "Brand Campaign & Commercial",
    duration: "03:45",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
    desc: "A high-converting 4K commercial campaign and omnichannel launch film engineered for rapid market penetration.",
    isHero: true,
  },
  {
    id: "feat-2",
    title: "Aero Dynamics Viral Launch",
    client: "Aero Mobility",
    category: "Performance Ad Campaign",
    duration: "02:18",
    year: "2024",
    thumbnail: "https://images.unsplash.com/photo-1517976487452-572718781df9?auto=format&fit=crop&w=1200&q=80",
    desc: "Precision visual storytelling and high-velocity ad creative engineered for outsized customer acquisition.",
    isHero: false,
  },
  {
    id: "feat-3",
    title: "Sovereign Wealth Brand Acceleration",
    client: "Sovereign Partners",
    category: "Corporate Brand Documentary",
    duration: "04:12",
    year: "2024",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    desc: "Dynamic visual storytelling and brand positioning for an industry-defining fintech institution.",
    isHero: false,
  },
];

export default function FeaturedVideosSection({
  dbVideos = [],
  settings = {},
  dbCampaigns = [],
}: FeaturedVideosProps) {
  // 1. First priority: CMS Campaigns created in Admin panel
  let displayVideos: any[] = [];

  if (dbCampaigns && dbCampaigns.length > 0) {
    displayVideos = dbCampaigns.slice(0, 3).map((c, idx) => ({
      id: c.id || `camp-${idx}`,
      title: c.title,
      client: c.client || "Vision Wings Exclusive",
      category: c.category || (idx === 0 ? "Brand Campaign & Commercial" : "Performance Ad Campaign"),
      duration: c.duration || "03:45",
      year: c.year || "2025",
      thumbnail: c.posterImage || c.coverImage || fallbackFeaturedVideos[idx]?.thumbnail || fallbackFeaturedVideos[0].thumbnail,
      desc: c.description || fallbackFeaturedVideos[idx]?.desc || "High-conversion marketing campaign.",
      isHero: idx === 0,
    }));
  } else if (dbVideos && dbVideos.length > 0) {
    displayVideos = dbVideos.slice(0, 3).map((v, idx) => ({
      id: v.id || `db-${idx}`,
      title: videoTitle(v),
      client: v.subHeading || "Vision Wings",
      category: v.category || "Video Campaign",
      duration: videoDuration(v),
      year: videoYear(v),
      thumbnail: v.posterImage || v.coverImage || videoPoster(v) || fallbackFeaturedVideos[idx]?.thumbnail || fallbackFeaturedVideos[0].thumbnail,
      desc: v.description || v.subHeading || "",
      isHero: idx === 0,
    }));
  } else {
    // 3. Nothing published yet: curated placeholders stand in for the section.
    displayVideos = fallbackFeaturedVideos;
  }

  // Real content is never padded out with placeholders — one published video
  // renders as one full-width card rather than sitting beside two stock ones.
  const [heroVideo, ...subVideos] = displayVideos.slice(0, 3);

  return (
    <section 
      id="featured-videos" 
      className="py-24 md:py-36 lg:py-44 px-5 md:px-10 xl:px-20 bg-navy-950 text-warm-50 overflow-hidden border-y border-navy-800 relative"
    >
      {/* Subtle Architectural Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-radial-gradient from-bronze-500/10 via-transparent to-transparent rounded-full pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-radial-gradient from-navy-800/40 via-transparent to-transparent rounded-full pointer-events-none blur-2xl" />

      <div className="max-w-[1280px] mx-auto space-y-16 md:space-y-20 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-navy-800 pb-10">
          <RevealOnScroll className="max-w-2xl space-y-4">
            <h2 className="text-h1 font-bold text-warm-50 text-balance leading-[1.05]">
              {settings.featured_videos_title_line1 || "Brand Stories in"} <br />
              <span className="text-bronze-400">
                {settings.featured_videos_title_line2 || "High-Definition Motion."}
              </span>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <p className="text-body-sm text-navy-300 max-w-xs leading-relaxed hidden xl:block mr-4">
              {settings.featured_videos_description || "We give wings to your vision through 4K commercial cinematography, high-converting launch films, and viral performance ads."}
            </p>
            
            {/* Clicking opens /videos directly per user request */}
            <Link href="/videos" className="inline-block min-h-[44px] rounded-full focus-visible:ring-2 focus-visible:ring-bronze-400 outline-none" data-interactive>
              <Button variant="primary" className="w-full sm:w-auto justify-center whitespace-nowrap shadow-2xl group py-3.5 px-6 min-h-[44px]" data-interactive>
                <Video className="w-4 h-4 mr-2.5 fill-current" />
                <span className="font-bold">Explore Video Exhibition</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </RevealOnScroll>
        </div>

        {/* Asymmetric Exhibition Bento Grid (1 Large Widescreen Hero + 2 Stacked Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Card 1: Widescreen Featured Hero. Takes the full row when it is the
              only published film, rather than leaving a 5-column gap. */}
          <RevealOnScroll className={`${subVideos.length > 0 ? "lg:col-span-7" : "lg:col-span-12"} group block`}>
            <Link href="/videos" className="block space-y-5 focus-visible:ring-2 focus-visible:ring-bronze-400 rounded-2xl outline-none" data-interactive>
              
              {/* Image Container with Cinematic Hover Physics */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-navy-900 border border-navy-800 shadow-2xl">
                <Image
                  src={heroVideo.thumbnail}
                  alt={heroVideo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                
                {/* Multi-tier Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500" />
                
                {/* Top Floating Badges */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-navy-950/90 text-bronze-400 font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-bronze-500/30 shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-bronze-400" />
                    <span>Featured Flagship</span>
                  </span>
                  <span className="px-3 py-1 rounded bg-navy-950/90 text-warm-50 font-mono text-xs font-bold backdrop-blur-md border border-navy-700">
                    {heroVideo.duration} HD
                  </span>
                </div>

                {/* Center Glassmorphic Play Trigger */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-warm-50/95 text-navy-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all duration-300 transform group-hover:-translate-y-1">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>

                {/* Bottom Interactive Prompt Badge */}
                <div className="absolute bottom-5 right-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="px-3.5 py-1.5 rounded-full bg-bronze-500 text-warm-50 text-xs font-bold tracking-wide shadow-xl flex items-center gap-1.5">
                    <span>Click to Launch Exhibition</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Typography & Metadata Strip */}
              <div className="space-y-2 px-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-bronze-400 uppercase tracking-widest">
                    {heroVideo.category}
                  </span>
                  <span className="text-navy-600">·</span>
                  <span className="text-xs font-mono text-navy-400">
                    {heroVideo.client} ({heroVideo.year})
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-warm-50 group-hover:text-bronze-400 transition-colors tracking-tight">
                  {heroVideo.title}
                </h3>
                <p className="text-body-sm text-navy-300 line-clamp-2 max-w-2xl leading-relaxed">
                  {heroVideo.desc}
                </p>
              </div>

            </Link>
          </RevealOnScroll>

          {/* Cards 2 & 3: Vertical Bento Stack (Spans 5 Columns on Large Screens) */}
          {subVideos.length > 0 && (
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            {subVideos.map((vid, idx) => (
              <RevealOnScroll key={vid.id || idx} delay={(idx + 1) * 0.15} className="group block">
                <Link href="/videos" className="block space-y-3 focus-visible:ring-2 focus-visible:ring-bronze-400 rounded-xl outline-none" data-interactive>
                  
                  {/* Image Showcase */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[21/10] rounded-xl overflow-hidden bg-navy-900 border border-navy-800 shadow-xl">
                    <Image
                      src={vid.thumbnail}
                      alt={vid.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    <div className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded bg-navy-950/80 backdrop-blur-md text-warm-50 font-mono text-[11px] font-bold border border-navy-700">
                      {vid.duration} HD
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-warm-50/90 text-navy-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-2.5 py-1 rounded bg-bronze-500 text-warm-50 text-[10px] font-bold uppercase tracking-wider shadow-md">
                        Launch ↗
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1 px-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-bronze-400 uppercase tracking-wider">
                        {vid.category}
                      </span>
                      <span className="text-navy-600">·</span>
                      <span className="text-[11px] font-mono text-navy-400">{vid.year}</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold font-display text-warm-50 group-hover:text-bronze-400 transition-colors tracking-tight leading-snug">
                      {vid.title}
                    </h4>
                  </div>

                </Link>
              </RevealOnScroll>
            ))}
          </div>
          )}

        </div>

        {/* Archival Specs Footer Strip */}
        <RevealOnScroll delay={0.3} className="pt-8 border-t border-navy-800/80 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-mono text-navy-400">
            <span className="flex items-center gap-1.5 text-bronze-400">
              <ShieldCheck className="w-4 h-4 text-bronze-400" />
              <span>LOSSLESS 4K / H.264 PIPELINE</span>
            </span>
            <span>·</span>
            <span>RAPID CLOUD DELIVERY</span>
            <span>·</span>
            <span>CINEMATIC COLOR GRADIENT</span>
          </div>

          <Link href="/videos" className="group inline-flex items-center gap-2 text-sm font-bold font-display text-warm-50 hover:text-bronze-400 transition-colors min-h-[44px]" data-interactive>
            <span>Enter Complete Exhibition Gallery</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-bronze-400" />
          </Link>
        </RevealOnScroll>

      </div>
    </section>
  );
}
