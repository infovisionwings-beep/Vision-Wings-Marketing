"use client";

// Reading this as: Public video showcase / real estate & brand tour gallery for design-conscious buyers and creative directors, with an elite, kinematic editorial language, leaning toward native Tailwind v4 + asymmetric split-screen + scroll-pinned rhythm + Upstash DB-powered live video renditions.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 4

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowRight, Film, Sparkles, Eye, CheckCircle2, ShieldCheck, Maximize2, Clock, Calendar } from "lucide-react";
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
    title: "Penfield Crescent Estate",
    category: "Real Estate Tour",
    date: "NOV 2024",
    duration: "02:45",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "An architectural tour through 12,000 square feet of minimalist concrete and floor-to-ceiling glass in the Pacific Northwest."
  },
  {
    id: "sample-2",
    title: "Sill Road Architectural Villa",
    category: "Interior Cinema",
    date: "OCT 2024",
    duration: "03:12",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Lossless interior lighting study capturing warm bronze finishes, custom joinery, and expansive outdoor living terraces."
  },
  {
    id: "sample-3",
    title: "Bel Air Ridge Sanctuary",
    category: "Aerial Showcase",
    date: "SEP 2024",
    duration: "01:58",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "High-definition drone cinematography tracing infinity pools and cantilevered rooflines at golden hour."
  },
  {
    id: "sample-4",
    title: "The Glass Pavilion",
    category: "Brand Narrative",
    date: "AUG 2024",
    duration: "04:10",
    coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "An intimate exploration of sustainable steel and glass architecture designed for seamless indoor-outdoor immersion."
  },
  {
    id: "sample-5",
    title: "Montauk Coastal Residence",
    category: "Real Estate Tour",
    date: "JUL 2024",
    duration: "02:20",
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Weathered cedar cladding and panoramic oceanfront vistas captured in 4K 60fps dynamic range."
  },
  {
    id: "sample-6",
    title: "Kyoto Modern Loft",
    category: "Architectural Cinema",
    date: "JUN 2024",
    duration: "03:05",
    coverImage: "https://images.unsplash.com/photo-1600573472589-003525b2f729?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Traditional joinery meets industrial steel in this urban restoration project centered around an interior courtyard."
  }
];

interface VideoShowcaseGridProps {
  dbVideos?: any[];
}

export default function VideoShowcaseGrid({ dbVideos = [] }: VideoShowcaseGridProps) {
  // Merge live database transcoded videos with high-definition fallback curation
  const liveAssets: VideoAsset[] = dbVideos.map((v) => ({
    id: v.id,
    title: v.originalFileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    category: "Transcoded Cloud Asset",
    date: v.processedAt ? new Date(v.processedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase() : "LIVE",
    duration: v.durationSeconds ? `${Math.floor(Number(v.durationSeconds) / 60)}:${String(Math.floor(Number(v.durationSeconds) % 60)).padStart(2, "0")}` : "HD 4K",
    coverImage: v.thumbnailPath || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    videoUrl: v.mp4Path || v.webmPath || v.inputPath,
    description: `High-definition media pipeline rendition processed via Upstash BullMQ and Vercel Blob CDN. Original size: ${(Number(v.originalSize) / (1024 * 1024)).toFixed(1)} MB.`,
    isLiveDb: true
  }));

  const allVideos = [...liveAssets, ...fallbackShowcaseVideos];
  const featuredVideo = allVideos[0];
  const samplesGrid = allVideos.slice(1, 4); // Exactly 3 items for Bento Cell Count Rule
  const editorialSeries = allVideos.slice(4, 6); // Exactly 2 items for Zigzag Alternation Cap (max 2 rows)
  const archiveReels = allVideos.slice(0, 6); // For horizontal scroll-snap

  const [activeModalVideo, setActiveModalVideo] = useState<VideoAsset | null>(null);

  return (
    <section className="bg-warm-50 text-navy-950 py-20 md:py-28 px-5 md:px-10 xl:px-20 overflow-hidden font-sans">
      <div className="max-w-[1280px] mx-auto space-y-24 md:space-y-32">
        
        {/* ── SECTION 1: ASYMMETRIC HERO SHOWCASE (50/50 SPLIT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Featured Video Player Thumbnail */}
          <div className="lg:col-span-7">
            <motion.div 
              className="relative rounded-2xl overflow-hidden aspect-video bg-navy-950 shadow-2xl group cursor-pointer border border-navy-800"
              onClick={() => setActiveModalVideo(featuredVideo)}
              whileHover={{ scale: 0.995 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              data-interactive
            >
              <img 
                src={featuredVideo.coverImage} 
                alt={featuredVideo.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent group-hover:from-navy-950/60 transition-colors" />

              {/* Top Metadata Badges */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-navy-950/80 backdrop-blur-md border border-navy-700 text-warm-50 text-xs font-mono font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-bronze-500 animate-pulse" />
                  FEATURED FILM · {featuredVideo.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-bronze-300 text-xs font-mono font-bold">
                  {featuredVideo.duration}
                </span>
              </div>

              {/* Center Play Button Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-warm-50/90 backdrop-blur-md text-navy-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all duration-300">
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                </div>
              </div>

              {/* Bottom Caption Strip */}
              <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-display text-warm-50 tracking-tight">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-xs text-navy-200 line-clamp-1 max-w-lg mt-1 font-normal">
                    {featuredVideo.description}
                  </p>
                </div>
                <span className="text-xs font-mono text-bronze-400 font-semibold tracking-wider">
                  CLICK TO LAUNCH CINEMA
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Typography & Value Prop */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-bronze-600 font-mono text-xs font-bold tracking-widest uppercase">
              <Film className="w-4 h-4" />
              <span>Cinematic Tour Architecture</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-navy-950 tracking-tight leading-[1.08]">
              HIGH DEFINITION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze-600 via-bronze-500 to-amber-600">
                VIDEO TOURS
              </span> <br />
              OF REAL ESTATE
            </h2>

            {/* Subtext strictly under 20 words per taste.md Section 4.7 */}
            <p className="text-lg text-navy-700 font-normal leading-relaxed">
              Cinematic, lossless media pipelines engineered for real estate prestige, brand dominance, and immersive architectural storytelling.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button 
                variant="primary" 
                onClick={() => setActiveModalVideo(featuredVideo)}
                className="justify-center shadow-lg hover:shadow-xl transition-all"
                data-interactive
              >
                <span>Watch Featured Tour</span>
                <Play className="w-4 h-4 ml-2 fill-current" />
              </Button>
              
              <a 
                href="#samples-grid" 
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-navy-200 hover:border-navy-400 text-navy-950 font-semibold text-sm transition-colors"
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
                <span>UPSTASH CDN ACCELERATED</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── SECTION 2: SAMPLES BENTO GRID (EXACTLY 3 CARDS) ── */}
        <div id="samples-grid" className="space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy-200 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-bronze-600 font-bold block mb-1">
                EXHIBITION CURATION
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-display text-navy-950 tracking-tight">
                SAMPLES
              </h3>
            </div>
            <p className="text-sm text-navy-600 max-w-md">
              Hover over any architectural exhibit to reveal interactive playback controls and lossless streaming options.
            </p>
          </div>

          {/* 3-Column Bento Grid adhering to Bento Cell Count Rule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {samplesGrid.map((video, idx) => (
              <motion.div 
                key={video.id}
                className="group flex flex-col space-y-3 cursor-pointer"
                onClick={() => setActiveModalVideo(video)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                data-interactive
              >
                {/* Thumbnail Card with Vibrant Hover Overlay */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-navy-900 border border-navy-200/80 shadow-md group-hover:shadow-xl transition-all duration-300">
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

                  {/* Vibrant Orange / Bronze Banner Overlay on Hover (Inspired by Sample) */}
                  <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-navy-950/40 backdrop-blur-[2px]">
                    <div className="w-11/12 py-3 px-4 rounded-lg bg-gradient-to-r from-bronze-600 to-amber-600 text-warm-50 font-display font-bold text-sm tracking-widest uppercase text-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2.5">
                      <Play className="w-4 h-4 fill-current" />
                      <span>VIEW VIDEO</span>
                    </div>
                  </div>
                </div>

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
            <span className="text-xs font-mono uppercase tracking-widest text-bronze-600 font-bold">
              EDITORIAL FOCUS
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold font-display text-navy-950 tracking-tight">
              Architectural Narratives
            </h3>
            <p className="text-sm text-navy-600">
              Deep-dive cinema exploring light, materials, and space across iconic residential and commercial projects.
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
                  {/* Video Player Column */}
                  <div className={`lg:col-span-7 ${!isEven ? "lg:order-last" : ""}`}>
                    <div 
                      className="relative rounded-2xl overflow-hidden aspect-video bg-navy-950 shadow-xl group cursor-pointer border border-navy-200/80"
                      onClick={() => setActiveModalVideo(video)}
                      data-interactive
                    >
                      <img 
                        src={video.coverImage} 
                        alt={video.title} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                      <div className="absolute inset-0 bg-navy-950/25 group-hover:bg-navy-950/40 transition-colors" />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-warm-50/90 text-navy-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all duration-300">
                          <Play className="w-7 h-7 fill-current ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-warm-50 font-mono text-xs opacity-90 pointer-events-none">
                        <span>{video.category}</span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
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
                      <button 
                        onClick={() => setActiveModalVideo(video)}
                        className="text-bronze-600 hover:text-bronze-700 font-bold flex items-center gap-1.5 group"
                        data-interactive
                      >
                        <span>LAUNCH SCREENING</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
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
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-bronze-400 font-bold block mb-1">
                CONTINUOUS STREAM
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-display text-warm-50 tracking-tight">
                Archival Reels &amp; Shorts
              </h3>
            </div>
            <span className="text-xs font-mono text-navy-300">
              SCROLL HORIZONTALLY OR CLICK TO PLAY
            </span>
          </div>

          {/* Horizontal Scroll-Snap Reel */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none relative z-10 -mx-2 px-2">
            {archiveReels.map((video) => (
              <div 
                key={`reel-${video.id}`}
                onClick={() => setActiveModalVideo(video)}
                className="min-w-[280px] md:min-w-[340px] flex-shrink-0 snap-start group cursor-pointer space-y-3"
                data-interactive
              >
                <div className="relative rounded-xl overflow-hidden aspect-video bg-navy-900 border border-navy-800 group-hover:border-bronze-500/60 transition-all">
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
                <div>
                  <h4 className="text-sm font-bold text-warm-50 group-hover:text-bronze-400 transition-colors truncate">
                    {video.title}
                  </h4>
                  <span className="text-[11px] font-mono text-navy-400 block mt-0.5">
                    {video.category} · {video.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── IMMERSIVE VIDEO LIGHTBOX / MODAL ── */}
      <AnimatePresence>
        {activeModalVideo && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-navy-950/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalVideo(null)}
          >
            <motion.div 
              className="relative w-full max-w-5xl bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Bar */}
              <div className="px-6 py-4 bg-navy-950 border-b border-navy-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-bronze-500/20 border border-bronze-500/40 text-bronze-300 font-mono text-xs font-bold">
                    HD CINEMA PLAYER
                  </span>
                  <h3 className="text-base font-bold text-warm-50 font-display truncate max-w-md">
                    {activeModalVideo.title}
                  </h3>
                </div>

                <button 
                  onClick={() => setActiveModalVideo(null)}
                  className="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-navy-300 hover:text-warm-50 transition-colors"
                  aria-label="Close modal"
                  data-interactive
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Surface */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video 
                  src={activeModalVideo.videoUrl} 
                  poster={activeModalVideo.coverImage}
                  controls 
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Modal Footer Metadata Strip */}
              <div className="p-6 bg-navy-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-navy-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-xs font-mono text-navy-400">
                    <span className="text-bronze-400 font-semibold">{activeModalVideo.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activeModalVideo.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeModalVideo.duration}</span>
                  </div>
                  <p className="text-sm text-navy-200 max-w-2xl font-normal">
                    {activeModalVideo.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <a 
                    href={activeModalVideo.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-700 text-warm-50 text-xs font-mono font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                    data-interactive
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-bronze-400" />
                    <span>OPEN LOSSLESS SOURCE</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
