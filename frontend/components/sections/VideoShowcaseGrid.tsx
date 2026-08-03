"use client";

// Reading this as: Public video showcase / real estate & brand tour gallery for design-conscious buyers and creative directors, with an elite, kinematic editorial language, leaning toward native Tailwind v4 + asymmetric split-screen + scroll-pinned rhythm + Upstash DB-powered live video renditions.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 4

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, X, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import Button from "@/components/ui/Button";

export interface VideoAsset {
  id: string;
  title: string;
  category: string;
  date: string;
  duration: string;
  coverImage: string;
  videoUrl: string;
  description: string;
  isLiveDb?: boolean;
}

const fallbackShowcaseVideos: VideoAsset[] = [
  {
    id: "sample-1",
    title: "Omnichannel Growth Campaign",
    category: "Brand Launch Campaign",
    date: "NOV 2024",
    duration: "02:45",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "A high-converting omnichannel launch film engineered for rapid market penetration and customer acquisition."
  },
  {
    id: "sample-2",
    title: "Performance Ad Series",
    category: "Social Ad Campaign",
    date: "OCT 2024",
    duration: "03:12",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "High-velocity performance ad creative engineered for outsized ROI and continuous customer conversion."
  },
  {
    id: "sample-3",
    title: "Sovereign Wealth Brand Story",
    category: "Corporate Documentary",
    date: "SEP 2024",
    duration: "01:58",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "Cinematic documentary storytelling and brand positioning for an industry-defining fintech institution."
  },
  {
    id: "sample-4",
    title: "AI Platform Acceleration",
    category: "Product Launch Film",
    date: "AUG 2024",
    duration: "04:10",
    coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "An intimate exploration of next-generation enterprise software designed for seamless developer adoption."
  },
  {
    id: "sample-5",
    title: "Global E-Commerce Expansion",
    category: "Brand Campaign",
    date: "JUL 2024",
    duration: "02:20",
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Global brand positioning and high-impact commercial production captured in 4K 60fps dynamic range."
  },
  {
    id: "sample-6",
    title: "Vanguard Capital Portfolio",
    category: "Executive Series",
    date: "JUN 2024",
    duration: "03:05",
    coverImage: "https://images.unsplash.com/photo-1600573472589-003525b2f729?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Executive advisory and portfolio brand storytelling centered around category leadership and market expansion."
  }
];

interface VideoShowcaseGridProps {
  dbVideos?: any[];
  dbCampaigns?: any[];
}

/* ── Inline Video Card ──
   Replaces thumbnail with <video> on click. No modal, no page navigation. */
function InlineVideoCard({
  video,
  className = "",
  aspectClass = "aspect-video",
  playBtnSize = "w-20 h-20 md:w-24 md:h-24",
  playIconSize = "w-8 h-8 md:w-10 md:h-10",
  showCaption = true,
  showTopBadges = false,
}: {
  video: VideoAsset;
  className?: string;
  aspectClass?: string;
  playBtnSize?: string;
  playIconSize?: string;
  showCaption?: boolean;
  showTopBadges?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const handleStop = useCallback(() => {
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden ${aspectClass} bg-navy-950 shadow-2xl group border border-navy-800 ${className}`}>
      {playing ? (
        /* ── Active Video Player ── */
        <>
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.coverImage}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
            onEnded={handleStop}
          >
            Your browser does not support the video tag.
          </video>
          {/* Close / stop button */}
          <button
            onClick={handleStop}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-navy-950/80 backdrop-blur-md text-warm-50 hover:bg-red-600 transition-colors"
            aria-label="Close video"
            data-interactive
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        /* ── Poster / Thumbnail ── */
        <div className="cursor-pointer w-full h-full" onClick={handlePlay} data-interactive>
          <img
            src={video.coverImage}
            alt={video.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent group-hover:from-navy-950/60 transition-colors" />

          {/* Optional top metadata badges */}
          {showTopBadges && (
            <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-navy-950/80 backdrop-blur-md border border-navy-700 text-warm-50 text-xs font-mono font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bronze-500 animate-pulse" />
                FEATURED FILM · {video.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-bronze-300 text-xs font-mono font-bold">
                {video.duration}
              </span>
            </div>
          )}

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${playBtnSize} rounded-full bg-warm-50/90 backdrop-blur-md text-navy-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all duration-300`}>
              <Play className={`${playIconSize} fill-current ml-1`} />
            </div>
          </div>

          {/* Bottom caption */}
          {showCaption && (
            <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-display text-warm-50 tracking-tight">
                  {video.title}
                </h3>
                <p className="text-xs text-navy-200 line-clamp-1 max-w-lg mt-1 font-normal">
                  {video.description}
                </p>
              </div>
              <span className="text-xs font-mono text-bronze-400 font-semibold tracking-wider">
                CLICK TO PLAY
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Smaller inline card for grid / reels ── */
function InlineVideoCardSmall({
  video,
  aspectClass = "aspect-[16/10]",
}: {
  video: VideoAsset;
  aspectClass?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const handleStop = useCallback(() => {
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div className={`relative rounded-xl overflow-hidden ${aspectClass} bg-navy-900 border border-navy-200/80 shadow-md group-hover:shadow-xl transition-all duration-300`}>
      {playing ? (
        <>
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.coverImage}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
            onEnded={handleStop}
          >
            Your browser does not support the video tag.
          </video>
          <button
            onClick={(e) => { e.stopPropagation(); handleStop(); }}
            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-navy-950/80 backdrop-blur-md text-warm-50 hover:bg-red-600 transition-colors"
            aria-label="Close video"
            data-interactive
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <div className="cursor-pointer w-full h-full" onClick={handlePlay} data-interactive>
          <img
            src={video.coverImage}
            alt={video.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/40 transition-colors" />

          {/* Top Duration Badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-navy-950/80 backdrop-blur-sm text-warm-50 font-mono text-[11px] font-semibold">
            {video.duration}
          </div>

          {/* Vibrant Orange / Bronze Banner Overlay on Hover */}
          <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-navy-950/40 backdrop-blur-[2px]">
            <div className="w-11/12 py-3 px-4 rounded-lg bg-gradient-to-r from-bronze-600 to-amber-600 text-warm-50 font-display font-bold text-sm tracking-widest uppercase text-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2.5">
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY VIDEO</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoShowcaseGrid({ dbVideos = [], dbCampaigns = [] }: VideoShowcaseGridProps) {
  // Map CMS Sample campaigns
  const cmsAssets: VideoAsset[] = dbCampaigns.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category || "CMS Sample Video",
    date: c.year || "2025",
    duration: c.duration || "02:45",
    coverImage: c.coverImage || fallbackShowcaseVideos[0].coverImage,
    videoUrl: c.videoUrl || fallbackShowcaseVideos[0].videoUrl,
    description: c.description || "CMS driven sample video asset.",
  }));

  // Merge live database transcoded videos with high-definition fallback curation
  const liveAssets: VideoAsset[] = dbVideos.map((v) => ({
    id: v.id,
    title: v.originalFileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    category: "Transcoded Cloud Asset",
    date: v.processedAt ? new Date(v.processedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase() : "LIVE",
    duration: v.durationSeconds ? `${Math.floor(Number(v.durationSeconds) / 60)}:${String(Math.floor(Number(v.durationSeconds) % 60)).padStart(2, "0")}` : "HD 4K",
    coverImage: v.thumbnailPath || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    videoUrl: v.webmPath || v.mp4Path || v.inputPath,
    description: `High-definition rendition from our cloud media pipeline. Original size: ${(Number(v.originalSize) / (1024 * 1024)).toFixed(1)} MB.`,
    isLiveDb: true
  }));

  const allVideos = [...cmsAssets, ...liveAssets, ...fallbackShowcaseVideos];
  const featuredVideo = allVideos[0];
  const samplesGrid = allVideos.slice(1, 4); // Exactly 3 items for Bento Cell Count Rule
  const editorialSeries = allVideos.slice(4, 6); // Exactly 2 items for Zigzag Alternation Cap (max 2 rows)
  const archiveReels = allVideos.slice(0, 6); // For horizontal scroll-snap

  return (
    <section className="bg-warm-50 text-navy-950 py-20 md:py-28 px-5 md:px-10 xl:px-20 overflow-hidden font-sans">
      <div className="max-w-[1280px] mx-auto space-y-24 md:space-y-32">
        
        {/* ── SECTION 1: ASYMMETRIC HERO SHOWCASE (50/50 SPLIT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Featured Video — plays inline */}
          <div className="lg:col-span-7">
            <InlineVideoCard
              video={featuredVideo}
              showTopBadges
              showCaption
            />
          </div>

          {/* Right Column: Editorial Typography & Value Prop */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <h2 className="text-h1 font-bold text-navy-950 text-balance leading-[1.08]">
              High Definition <br />
              <span className="text-bronze-600">Video Campaigns</span> <br />
              &amp; Commercial Ads
            </h2>

            {/* Subtext strictly under 20 words per taste.md Section 4.7 */}
            <p className="text-body-lg text-navy-700 leading-relaxed">
              Cinematic video production, high-conversion commercial campaigns, and viral social ads engineered for brand dominance and market acceleration.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#samples-grid"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3.5 rounded-xl border border-navy-200 hover:border-navy-400 text-navy-950 font-semibold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-bronze-500 outline-none"
                data-interactive
              >
                <span>Browse All Samples</span>
              </a>
            </div>

            <div className="pt-4 border-t border-navy-200/60 flex items-center gap-6 text-xs font-mono text-navy-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4K LOSSLESS HLS</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ACCELERATED CLOUD DELIVERY</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── SECTION 2: SAMPLES BENTO GRID (EXACTLY 3 CARDS) ── */}
        <div id="samples-grid" className="space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy-200 pb-5">
            <h3 className="text-h2 font-bold text-navy-950 tracking-tight">
              Samples
            </h3>
            <p className="text-body-sm text-navy-600 max-w-md">
              Click any campaign exhibit to play inline with high-definition streaming.
            </p>
          </div>

          {/* 3-Column Bento Grid adhering to Bento Cell Count Rule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {samplesGrid.map((video) => (
              <motion.div 
                key={video.id}
                className="group flex flex-col space-y-3"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {/* Thumbnail Card — plays inline */}
                <InlineVideoCardSmall video={video} />

                {/* Card Footer Strip */}
                <div className="flex items-center justify-between px-1 text-xs font-medium">
                  <span className="text-navy-950 font-bold group-hover:text-bronze-600 transition-colors truncate pr-2">
                    {video.title}
                  </span>
                  <span className="font-mono text-navy-500 whitespace-nowrap">
                    {video.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: CHECKERBOARD EDITORIAL SERIES (MAX 2 ROWS) ── */}
        <div className="space-y-16 pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-h2 font-bold text-navy-950 tracking-tight">
              Brand Growth Narratives
            </h3>
            <p className="text-body-sm text-navy-600">
              Deep-dive video campaigns exploring value proposition, market positioning, and brand authority across high-growth commercial projects.
            </p>
          </div>

          <div className="space-y-12 md:space-y-20">
            {editorialSeries.map((video, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={video.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Video Player Column — inline */}
                  <div className={`lg:col-span-7 ${!isEven ? "lg:order-last" : ""}`}>
                    <InlineVideoCard
                      video={video}
                      playBtnSize="w-16 h-16"
                      playIconSize="w-7 h-7"
                      showCaption={false}
                    />
                  </div>

                  {/* Editorial Text Column with << and >> directional indicators */}
                  <div className={`lg:col-span-5 space-y-4 ${!isEven ? "lg:order-first" : ""}`}>
                    <div className="flex items-center gap-2 font-mono text-xl md:text-2xl font-black text-bronze-600 tracking-tight">
                      <span>{isEven ? "<<" : ">>"}</span>
                      <span className="text-navy-950">{video.title}</span>
                    </div>

                    <p className="text-base text-navy-700 font-normal leading-relaxed">
                      {video.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-navy-500 border-t border-navy-200/60 pt-4">
                      <span>RELEASED: {video.date}</span>
                      <span className="flex items-center gap-1.5 text-bronze-600">
                        <Clock className="w-3 h-3" />
                        <span>{video.duration}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4: RHYTHM BREAKER (HORIZONTAL ARCHIVE REEL) ── */}
        <div className="bg-navy-950 text-warm-50 rounded-2xl p-8 md:p-12 space-y-8 shadow-2xl relative overflow-hidden border border-navy-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial-gradient from-bronze-500/10 to-transparent rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
            <h3 className="text-h2 font-bold text-warm-50 tracking-tight">
              Campaign Reels &amp; Social Shorts
            </h3>
            <span className="text-xs font-mono text-navy-300">
              SCROLL HORIZONTALLY · CLICK TO PLAY INLINE
            </span>
          </div>

          {/* Horizontal Scroll-Snap Reel */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none relative z-10 -mx-2 px-2">
            {archiveReels.map((video) => (
              <ReelInlineCard key={`reel-${video.id}`} video={video} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── Reel card with inline playback ── */
function ReelInlineCard({ video }: { video: VideoAsset }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const handleStop = useCallback(() => {
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div
      className="min-w-[280px] md:min-w-[340px] flex-shrink-0 snap-start group space-y-3"
    >
      <div className="relative rounded-xl overflow-hidden aspect-video bg-navy-900 border border-navy-800 group-hover:border-bronze-500/60 transition-all">
        {playing ? (
          <>
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.coverImage}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
              onEnded={handleStop}
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={handleStop}
              className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-navy-950/80 backdrop-blur-md text-warm-50 hover:bg-red-600 transition-colors"
              aria-label="Close video"
              data-interactive
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="cursor-pointer w-full h-full" onClick={handlePlay} data-interactive>
            <img
              src={video.coverImage}
              alt={video.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-navy-950/80 text-warm-50 flex items-center justify-center group-hover:bg-bronze-500 transition-colors">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-navy-950/90 text-[10px] font-mono text-bronze-300 font-bold">
              {video.duration}
            </span>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-warm-50 group-hover:text-bronze-400 transition-colors truncate">
          {video.title}
        </h4>
        <span className="text-[11px] font-mono text-navy-400 block mt-0.5">
          {video.category} · {video.date}
        </span>
      </div>
    </div>
  );
}
