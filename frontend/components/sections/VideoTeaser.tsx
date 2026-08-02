"use client";

// Reading this as: Homepage teaser section for our HD Video Tours & Architectural cinema showcase, with high contrast dark-mode styling and kinematic preview cards.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Film, Sparkles, X } from "lucide-react";
import { Link } from "@/components/ui/Link";
import Button from "@/components/ui/Button";

/* ── Inline teaser card: plays video in-place, no navigation ── */
function TeaserInlineCard({
  coverSrc,
  alt,
  duration,
  title,
  subtitle,
  videoUrl,
  className = "",
}: {
  coverSrc: string;
  alt: string;
  duration: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  className?: string;
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
    <div
      className={`group block relative rounded-2xl overflow-hidden bg-navy-900 border border-navy-800 shadow-2xl transition-all duration-300 ${className}`}
    >
      {playing ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={coverSrc}
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
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-navy-950/80 backdrop-blur-md text-warm-50 hover:bg-red-600 transition-colors"
            aria-label="Close video"
            data-interactive
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="cursor-pointer w-full h-full" onClick={handlePlay} data-interactive>
          <img
            src={coverSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-navy-950/80 backdrop-blur-md text-bronze-400 font-mono text-[10px] font-bold">
            {duration}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-warm-50/90 text-navy-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-warm-50">
            <h3 className="font-bold text-base tracking-tight font-display">{title}</h3>
            <span className="text-xs font-mono text-navy-300 block mt-0.5">{subtitle}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoTeaser() {
  return (
    <section className="bg-navy-950 text-warm-50 py-20 md:py-28 px-5 md:px-10 xl:px-20 overflow-hidden relative border-y border-navy-800">
      <div className="absolute top-1/2 left-[80%] -translate-y-1/2 w-[500px] h-[500px] bg-radial-gradient from-bronze-500/15 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Typography & CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 w-fit text-xs font-mono text-bronze-400 font-bold tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>HD CAMPAIGN PRODUCTION</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-warm-50 leading-[1.05]">
            Experience Brand Growth in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze-400 via-amber-300 to-warm-50">
              Lossless High Definition.
            </span>
          </h2>

          <p className="text-lg text-navy-200 max-w-xl font-normal leading-relaxed">
            Immerse buyers and stakeholders in cinematic commercial campaigns, viral performance ads, and launch films—powered by our cloud-native video pipeline.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/videos" className="w-full sm:w-auto inline-block min-h-[44px] rounded-xl focus-visible:ring-2 focus-visible:ring-bronze-400 outline-none" data-interactive>
              <Button variant="primary" className="w-full sm:w-auto justify-center shadow-2xl group min-h-[44px]" data-interactive>
                <span>Launch Video Exhibition</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/admin/videos" className="w-full sm:w-auto inline-block min-h-[44px] rounded-xl focus-visible:ring-2 focus-visible:ring-bronze-400 outline-none" data-interactive>
              <Button variant="secondary" className="w-full sm:w-auto justify-center bg-navy-900 text-warm-50 border-navy-700 hover:bg-navy-800 min-h-[44px]" data-interactive>
                <span>Pipeline Console</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Preview Stack — inline video playback */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TeaserInlineCard
            coverSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
            alt="Omnichannel Campaign"
            duration="02:45 HD"
            title="Omnichannel Growth Campaign"
            subtitle="Brand Launch Campaign · NOV 2024"
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            className="aspect-[4/3] sm:aspect-[3/4] transform sm:translate-y-6 hover:-translate-y-1"
          />

          <TeaserInlineCard
            coverSrc="https://images.unsplash.com/photo-1517976487452-572718781df9?auto=format&fit=crop&w=800&q=80"
            alt="Performance Ad Series"
            duration="03:12 HD"
            title="Performance Ad Series"
            subtitle="Social Ad Campaign · OCT 2024"
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            className="aspect-[4/3] sm:aspect-[3/4] transform sm:-translate-y-6 hover:-translate-y-8"
          />
        </div>

      </div>
    </section>
  );
}
