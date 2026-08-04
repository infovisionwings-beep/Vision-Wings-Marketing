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
import { content } from "@/lib/content";
import { getProjects } from "@/app/actions/projects";
import { photoTitle, photoSource, photoYear } from "@/lib/media/present";

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
    quoteText: "Vision Wings transformed our market presence. They took our ambitious product vision and gave it the strategic marketing wings to scale 400% YoY.",
    quoteSubtitle: "CLIENT GROWTH IMPACT"
  },
  {
    id: 1,
    type: "photo",
    title: "Lumina Health Rebranding & Funnel",
    category: "Brand Growth & Performance Ads",
    year: "2024",
    slug: "lumina",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 2,
    type: "photo",
    title: "Aero Dynamics Viral Launch Campaign",
    category: "Video Production & Growth",
    year: "2023",
    slug: "aero",
    imageUrl: "https://images.unsplash.com/photo-1517976487452-572718781df9?auto=format&fit=crop&w=1400&q=85"
  },
  {
    id: 3,
    type: "photo",
    title: "Vertex Capital Authority SEO & Content",
    category: "Content Marketing & SEO",
    year: "2024",
    slug: "vertex",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: "quote-2",
    type: "quote",
    quoteText: "When your business needs more than just leads—when you need category dominance—we give wings to your vision with full-funnel marketing mastery.",
    quoteSubtitle: "THE VISION WINGS PROMISE"
  },
  {
    id: 4,
    type: "photo",
    title: "Aura Neurotech Omnichannel Ads",
    category: "Performance Ads & Funnels",
    year: "2024",
    slug: "aura",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1100&q=85"
  },
  {
    id: 5,
    type: "photo",
    title: "Sovereign Wealth Brand Acceleration",
    category: "Brand Strategy & PR",
    year: "2023",
    slug: "sovereign",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 6,
    type: "photo",
    title: "Kura Sound Global Social Campaign",
    category: "Social Media & Viral Ads",
    year: "2024",
    slug: "kura",
    imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=85"
  }
];

const curatedSupplementalPhotos = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=85",
];

interface WorkProps {
  dbCampaigns?: any[];
  dbPhotos?: any[];
  settings?: Record<string, string>;
}

/**
 * The two quote cards are this section's own editorial voice rather than
 * placeholder imagery, so they survive when real work replaces the demo bricks.
 * They break up what would otherwise be an unbroken wall of images.
 */
function withQuoteCards(bricks: GalleryBrick[]): GalleryBrick[] {
  const merged: GalleryBrick[] = [fallbackBricks[0]];
  bricks.forEach((brick, i) => {
    merged.push(brick);
    if (i === 1 && bricks.length > 2) merged.push(fallbackBricks[4]);
  });
  return merged;
}

export default function Work({ dbCampaigns = [], dbPhotos = [], settings }: WorkProps) {
  const [bricks, setBricks] = useState<GalleryBrick[]>(fallbackBricks);

  useEffect(() => {
    async function load() {
      try {
        // If CMS archive campaigns exist, map them into bricks
        if (dbCampaigns && dbCampaigns.length > 0) {
          const campBricks: GalleryBrick[] = dbCampaigns.map((c: any, idx: number) => {
            // Only render as a text quote if there is a quoteText AND no image uploaded
            if (c.quoteText && !c.coverImage && !c.posterImage) {
              return {
                id: c.id || `quote-${idx}`,
                type: "quote",
                quoteText: c.quoteText,
                quoteSubtitle: c.subtitle || "CLIENT GROWTH IMPACT",
              };
            }
            return {
              id: c.id || `camp-${idx}`,
              type: "photo",
              title: c.title,
              category: c.category || "Brand Archive",
              year: c.year || "2025",
              slug: c.slug,
              imageUrl: c.coverImage || c.posterImage || curatedSupplementalPhotos[idx % curatedSupplementalPhotos.length],
            };
          });

          // Prepend default quote if no quote cards exist in DB
          const hasQuote = campBricks.some((b) => b.type === "quote");
          const merged: GalleryBrick[] = hasQuote ? campBricks : [fallbackBricks[0], ...campBricks];
          setBricks(merged);
          return;
        }

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

          // Real work is never padded out with the placeholder bricks. Mixing
          // stock photography in beside genuine projects is what made the
          // gallery read as demo content even after the archive was filled.
          setBricks(withQuoteCards(dbBricks));
          return;
        }

        // Nothing curated as a campaign or project yet, but the media library
        // may still hold published imagery. Showing the client's own work beats
        // showing stock photography of somebody else's.
        if (dbPhotos && dbPhotos.length > 0) {
          const photoBricks: GalleryBrick[] = dbPhotos.map((p: any, idx: number) => ({
            id: p.id || `photo-${idx}`,
            type: "photo",
            title: photoTitle(p),
            category: p.category || "Brand Archive",
            year: photoYear(p),
            // No slug: a library image has no case study behind it, so the
            // brick links to the archive index rather than a 404.
            imageUrl: photoSource(p),
          }));

          setBricks(withQuoteCards(photoBricks));
        }
      } catch (err) {
        console.error("Failed to load projects for Exhibition Gallery:", err);
      }
    }
    load();
  }, [dbCampaigns, dbPhotos]);

  return (
    <section id="work" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-50 text-navy-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-12 md:space-y-16">
        
        {/* Exhibition Gallery Header. No eyebrow / section number per the
            house rule established in Services and Insights: the heading
            carries itself. */}
        <div className="border-b border-navy-200/80 pb-8">
          <RevealOnScroll className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <h2 className="text-h1 font-bold text-navy-950 text-balance">
              {content(settings, "work.heading")}
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
