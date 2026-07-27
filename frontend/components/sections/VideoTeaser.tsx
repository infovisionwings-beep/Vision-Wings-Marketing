"use client";

// Reading this as: Homepage teaser section for our HD Video Tours & Architectural cinema showcase, with high contrast dark-mode styling and kinematic preview cards.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import { motion } from "framer-motion";
import { Play, ArrowRight, Film, Sparkles } from "lucide-react";
import { Link } from "@/components/ui/Link";
import Button from "@/components/ui/Button";

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

        {/* Right Preview Stack */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/videos" className="group block relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/4] bg-navy-900 border border-navy-800 shadow-2xl transform sm:translate-y-6 hover:-translate-y-1 transition-all duration-300" data-interactive>
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
              alt="Omnichannel Campaign" 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-navy-950/80 backdrop-blur-md text-bronze-400 font-mono text-[10px] font-bold">
              02:45 HD
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-warm-50/90 text-navy-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-warm-50">
              <h3 className="font-bold text-base tracking-tight font-display">Omnichannel Growth Campaign</h3>
              <span className="text-xs font-mono text-navy-300 block mt-0.5">Brand Launch Campaign · NOV 2024</span>
            </div>
          </Link>

          <Link href="/videos" className="group block relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/4] bg-navy-900 border border-navy-800 shadow-2xl transform sm:-translate-y-6 hover:-translate-y-8 transition-all duration-300" data-interactive>
            <img 
              src="https://images.unsplash.com/photo-1517976487452-572718781df9?auto=format&fit=crop&w=800&q=80" 
              alt="Performance Ad Series" 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-navy-950/80 backdrop-blur-md text-bronze-400 font-mono text-[10px] font-bold">
              03:12 HD
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-warm-50/90 text-navy-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-bronze-500 group-hover:text-warm-50 transition-all">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-warm-50">
              <h3 className="font-bold text-base tracking-tight font-display">Performance Ad Series</h3>
              <span className="text-xs font-mono text-navy-300 block mt-0.5">Social Ad Campaign · OCT 2024</span>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
