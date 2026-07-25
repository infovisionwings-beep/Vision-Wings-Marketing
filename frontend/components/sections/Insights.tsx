"use client";

// Reading this as: Thinking and perspectives section for a strategic branding agency, designed as a Minimalist Editorial Wire / Newspaper layout with generous whitespace and high typographic contrast.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import { useEffect, useState } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { getInsights } from "@/app/actions/insights";
import { format } from "date-fns";

const fallbackInsights = [
  {
    id: 1,
    title: "The New Rules of Brand Architecture in an AI-Saturated Era",
    category: "Strategy & Positioning",
    date: "Oct 12, 2024",
    readTime: "5 min read",
    slug: "brand-architecture",
    excerpt: "Why traditional house-of-brands models are collapsing under the weight of generative noise, and how to build monolithic brand equity."
  },
  {
    id: 2,
    title: "Designing for Conversion Without Sacrificing Brand Prestige",
    category: "Design Engineering",
    date: "Sep 28, 2024",
    readTime: "7 min read",
    slug: "conversion-design",
    excerpt: "The false dichotomy between performance marketing tactics and luxury brand building—and the design frameworks that harmonize both."
  },
  {
    id: 3,
    title: "Why Most B2B Tech Positioning Fails to Command Premium Pricing",
    category: "Market Psychology",
    date: "Sep 15, 2024",
    readTime: "4 min read",
    slug: "market-positioning",
    excerpt: "Stop selling feature checklists to procurement teams. How to re-anchor executive buyers around business transformation."
  }
];

export default function Insights() {
  const [insights, setInsights] = useState<any[]>(fallbackInsights);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInsights();
        if (data && data.length > 0) {
          const formatted = data.map((item: any, idx: number) => ({
            id: item.id,
            title: item.title,
            category: item.category || "Strategic Perspective",
            slug: item.slug || item.id,
            date: item.publishedAt ? format(new Date(item.publishedAt), "MMM d, yyyy") : format(new Date(item.createdAt), "MMM d, yyyy"),
            readTime: `${Math.max(3, Math.ceil((item.content?.length || 1500) / 500))} min read`,
            excerpt: item.excerpt || "An in-depth exploration of brand strategy, design systems, and digital growth."
          }));
          setInsights(formatted);
        }
      } catch (err) {
        console.error("Failed to load insights client-side:", err);
      }
    }
    load();
  }, []);

  return (
    <section id="insights" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-100 text-navy-950">
      <div className="max-w-[1280px] mx-auto space-y-16 md:space-y-24">
        
        {/* Section Header (No eyebrow per Rule 4.7 max 1 eyebrow per 3 sections) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-navy-200 pb-10">
          <RevealOnScroll className="max-w-2xl">
            <h2 className="text-display sm:text-h1 font-bold text-navy-950 tracking-tight leading-[1.05]">
              Thinking &amp; Perspectives.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Link href="/insights" className="inline-block">
              <Button variant="secondary" className="whitespace-nowrap group" data-interactive>
                <span>Read All Essays</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </RevealOnScroll>
        </div>

        {/* Minimalist Editorial Wire / Newspaper Rows (Rule 4.9: Long lists need a different UI component than bullets/cards) */}
        <div className="divide-y divide-navy-200/80 border-b border-navy-200/80">
          {insights.map((item, index) => (
            <RevealOnScroll 
              key={item.id || index} 
              delay={index * 0.08}
            >
              <Link 
                href={`/insights/${item.slug}`}
                className="group py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-baseline hover:bg-warm-50/60 -mx-5 px-5 md:-mx-10 md:px-10 rounded-xl transition-colors duration-300"
                data-interactive
              >
                {/* Index & Category */}
                <div className="lg:col-span-3 flex items-baseline gap-4">
                  <span className="text-sm font-mono font-bold text-bronze-600">
                    0{index + 1}
                  </span>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-navy-600">
                    {item.category}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <div className="lg:col-span-7 space-y-2.5">
                  <h3 className="text-h3 sm:text-h2 font-bold text-navy-950 group-hover:text-bronze-600 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-body text-navy-600 leading-relaxed max-w-2xl">
                    {item.excerpt}
                  </p>
                </div>

                {/* Metadata & Arrow */}
                <div className="lg:col-span-2 flex lg:flex-col justify-between lg:items-end gap-2 pt-2 lg:pt-0">
                  <span className="text-xs font-mono text-navy-500">{item.date}</span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-navy-950 group-hover:text-bronze-600 transition-colors">
                    <span>{item.readTime}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
