"use client";

// Reading this as: Editorial perspectives and knowledge-sharing section for a strategic branding agency, using high-contrast minimal list design.
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
    title: "The New Rules of Brand Architecture",
    category: "Strategy",
    date: "Oct 12, 2024",
    slug: "brand-architecture"
  },
  {
    id: 2,
    title: "Designing for Conversion Without Sacrificing Brand",
    category: "Design",
    date: "Sep 28, 2024",
    slug: "conversion-design"
  },
  {
    id: 3,
    title: "Why Most B2B Positioning Fails",
    category: "Insights",
    date: "Sep 15, 2024",
    slug: "market-positioning"
  }
];

export default function Insights() {
  const [insights, setInsights] = useState<any[]>(fallbackInsights);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInsights();
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            slug: item.slug,
            date: item.publishedAt ? format(new Date(item.publishedAt), "MMM d, yyyy") : format(new Date(item.createdAt), "MMM d, yyyy")
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
    <section id="insights" className="py-16 md:py-24 lg:py-32 px-5 md:px-10 xl:px-20 bg-warm-100">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <RevealOnScroll>
            <div className="flex flex-col gap-4">
              <h2 className="text-h2 text-navy-950">
                Thinking & Perspectives
              </h2>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="w-full md:w-auto flex justify-start md:justify-end">
              <Link href="/insights" className="w-full md:w-auto">
                <Button variant="secondary" data-interactive className="w-full md:w-auto cursor-pointer">
                  Read All Insights
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {insights.map((insight, index) => (
            <RevealOnScroll key={insight.id} delay={index * 0.1}>
              <Link 
                href={`/insights/${insight.slug}`} 
                className="group block bg-warm-50 border border-navy-100 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-shadow duration-300 p-6 md:p-8 rounded-xl" 
                data-interactive
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="text-caption text-bronze-900 font-semibold">{insight.category}</span>
                  <div className="p-2 bg-warm-100 rounded-full group-hover:bg-bronze-950 group-hover:text-warm-50 transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-h3 text-navy-950 mb-4">{insight.title}</h3>
                <p className="text-caption text-navy-500 font-mono">{insight.date}</p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
