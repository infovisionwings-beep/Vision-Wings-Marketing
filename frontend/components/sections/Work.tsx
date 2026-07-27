"use client";

// Reading this as: Exhibition Gallery & Portfolio Showcase using an anti-slop Pinterest-style Masonry Brick layout, inspired by taste-skill guidelines ("Discover our world").
// DESIGN_VARIANCE: 9
// MOTION_INTENSITY: 7
// VISUAL_DENSITY: 4

import { useEffect, useState } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/app/actions/projects";

interface GalleryBrick {
  id: string | number;
  type: "photo" | "quote";
  title?: string;
  category?: string;
  year?: string;
  slug?: string;
  imageUrl?: string;
  quoteText?: string;
  quoteSubtitle?: string;
}

const fallbackBricks: GalleryBrick[] = [
  {
    id: "quote-1",
    type: "quote",
    quoteText: "Electra is a European specialist in fast charging for electric vehicles and scalable digital architecture.",
    quoteSubtitle: "STRATEGIC SPECIALIZATION"
  },
  {
    id: 1,
    type: "photo",
    title: "Lumina Health Systems",
    category: "Brand Architecture",
    year: "2024",
    slug: "lumina",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 2,
    type: "photo",
    title: "Aero Dynamics Flagship",
    category: "Visual Identity & 3D",
    year: "2023",
    slug: "aero",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=85"
  },
  {
    id: 3,
    type: "photo",
    title: "Vertex Venture Capital",
    category: "Web Experience",
    year: "2024",
    slug: "vertex",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "quote-2",
    type: "quote",
    quoteText: "Book your strategic discovery session and deploy world-class digital experiences anywhere you like.",
    quoteSubtitle: "GLOBAL EXECUTION"
  },
  {
    id: 4,
    type: "photo",
    title: "Aura Neurotech UI",
    category: "Digital Product Design",
    year: "2024",
    slug: "aura",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1100&q=85"
  },
  {
    id: 5,
    type: "photo",
    title: "Sovereign Wealth Asset Platform",
    category: "Fintech Experience",
    year: "2023",
    slug: "sovereign",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 6,
    type: "photo",
    title: "Kura Acoustic Systems",
    category: "Industrial & Sound",
    year: "2024",
    slug: "kura",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85"
  }
];

const curatedSupplementalPhotos = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1100&q=85",
];

export default function Work() {
  const [bricks, setBricks] = useState<GalleryBrick[]>(fallbackBricks);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjects();
        if (data && data.length > 0) {
          const dbBricks: GalleryBrick[] = data.map((p: any, idx: number) => ({
            id: p.id || `db-${idx}`,
            type: "photo",
            title: p.title,
            category: p.category,
            year: p.year || "2024",
            slug: p.slug || String(p.id),
            imageUrl: p.coverImage || curatedSupplementalPhotos[idx % curatedSupplementalPhotos.length],
          }));

          const merged: GalleryBrick[] = [];
          merged.push(fallbackBricks[0]);
          
          dbBricks.forEach((b, i) => {
            merged.push(b);
            if (i === 1 && dbBricks.length >= 2) {
              merged.push(fallbackBricks[4]);
            }
          });

          if (merged.length < 6) {
            fallbackBricks.slice(1).forEach((fb) => {
              if (fb.type === "photo" && !merged.some((m) => m.title === fb.title)) {
                merged.push(fb);
              }
            });
          }

          setBricks(merged);
        }
      } catch (err) {
        console.error("Failed to load projects client-side for Exhibition Gallery:", err);
      }
    }
    load();
  }, []);

  return (
    <section id="work" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-50 text-navy-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-12 md:space-y-16">
        
        {/* Exhibition Gallery Header (004 + Discover our world) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-navy-200/80 pb-8">
          <RevealOnScroll className="flex items-baseline gap-4">
            <span className="text-xl md:text-2xl font-mono font-bold text-navy-950 tracking-tight select-none">
              004
            </span>
            <span className="text-xs font-mono font-semibold text-bronze-600 tracking-widest uppercase ml-2">
              Exhibition Gallery &amp; Archive
            </span>
          </RevealOnScroll>
          
          <RevealOnScroll delay={0.1} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 w-full md:w-auto">
            <h2 className="text-display sm:text-h1 font-bold text-navy-950 tracking-tight leading-[1.02]">
              Discover our world
            </h2>
            <Link href="/work" className="inline-block min-h-[44px] rounded-full focus-visible:ring-2 focus-visible:ring-bronze-500 outline-none mb-1">
              <Button variant="secondary" className="whitespace-nowrap group min-h-[44px] shadow-sm" data-interactive>
                <span>Full Archive</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </RevealOnScroll>
        </div>

        {/* Pinterest Masonry Brick Grid: 2 Columns on Mobile, Natural Aspect Ratios */}
        <div className="columns-2 md:columns-3 xl:columns-4 gap-3 sm:gap-6 md:gap-8">
          {bricks.map((brick, index) => {
            if (brick.type === "quote") {
              return (
                <RevealOnScroll
                  key={`quote-${index}`}
                  delay={(index % 4) * 0.08}
                  className="break-inside-avoid mb-3 sm:mb-6 md:mb-8 block"
                >
                  <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 flex flex-col justify-between shadow-sm transition-all duration-500 hover:shadow-md min-h-[160px] sm:min-h-[220px] md:min-h-[260px] ${
                    index === 0 
                      ? "bg-navy-950 text-warm-50 border border-navy-800" 
                      : "bg-warm-100/90 text-navy-950 border border-navy-200/70"
                  }`}>
                    <div className="space-y-2 sm:space-y-4">
                      {brick.quoteSubtitle && (
                        <span className={`text-[9px] sm:text-xs font-mono font-bold tracking-widest uppercase block ${
                          index === 0 ? "text-bronze-400" : "text-bronze-600"
                        }`}>
                          {brick.quoteSubtitle}
                        </span>
                      )}
                      <p className="text-xs sm:text-lg md:text-h3 font-bold tracking-tight leading-[1.35]">
                        &ldquo;{brick.quoteText}&rdquo;
                      </p>
                    </div>
                    <div className="pt-3 sm:pt-6 mt-4 sm:mt-8 border-t border-current/10 flex items-center justify-between">
                      <span className="text-[8px] sm:text-[11px] font-mono tracking-wider opacity-60">VW ARCHIVE</span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-bronze-500 inline-block animate-pulse" />
                    </div>
                  </div>
                </RevealOnScroll>
              );
            }

            return (
              <RevealOnScroll
                key={`photo-${brick.id || index}`}
                delay={(index % 4) * 0.08}
                className="break-inside-avoid mb-3 sm:mb-6 md:mb-8 block group"
              >
                <Link
                  href={brick.slug ? `/work/${brick.slug}` : "/work"}
                  className="block rounded-xl sm:rounded-2xl overflow-hidden bg-navy-900 border border-navy-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative outline-none focus-visible:ring-2 focus-visible:ring-bronze-500"
                  data-interactive
                >
                  {/* Photo rendered with w-full h-auto so any size/aspect-ratio photo fits naturally without cropping */}
                  <img
                    src={brick.imageUrl}
                    alt={brick.title || "Exhibition photography"}
                    className="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Tactile Hover / Tap Overlay - responsive for 2-column mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-6 text-warm-50">
                    <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-1.5">
                      <span className="text-[9px] sm:text-xs font-mono font-semibold text-bronze-400 uppercase tracking-wider truncate max-w-[75%]">
                        {brick.category || "Commission"}
                      </span>
                      {brick.year && (
                        <span className="text-[8px] sm:text-[11px] font-mono bg-warm-50/15 px-1 sm:px-2 py-0.5 rounded text-warm-50 backdrop-blur-sm flex-shrink-0">
                          {brick.year}
                        </span>
                      )}
                    </div>
                    <div className="flex items-end justify-between gap-2 sm:gap-4">
                      <h3 className="text-xs sm:text-lg md:text-h3 font-bold text-warm-50 leading-tight group-hover:text-bronze-300 transition-colors line-clamp-2 sm:line-clamp-none">
                        {brick.title}
                      </h3>
                      <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-warm-50 text-navy-950 flex items-center justify-center flex-shrink-0 translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-lg">
                        <ArrowUpRight className="w-3 h-3 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Subtle Static Badge when not hovering */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 group-hover:opacity-0 transition-opacity duration-300">
                    {brick.year && (
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-navy-950/80 text-warm-50 text-[9px] sm:text-[11px] font-mono font-semibold backdrop-blur-md border border-warm-50/10 shadow-sm">
                        {brick.year}
                      </span>
                    )}
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
}
