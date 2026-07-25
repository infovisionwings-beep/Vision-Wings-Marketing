"use client";

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";

const insights = [
  {
    id: "brand-architecture",
    title: "The New Rules of Brand Architecture",
    category: "Strategy",
    date: "Oct 12, 2024"
  },
  {
    id: "conversion-design",
    title: "Designing for Conversion Without Sacrificing Brand",
    category: "Design",
    date: "Sep 28, 2024"
  },
  {
    id: "market-positioning",
    title: "Why Most B2B Positioning Fails",
    category: "Insights",
    date: "Sep 15, 2024"
  }
];

export default function Insights() {
  return (
    <section id="insights" className="py-16 md:py-24 lg:py-32 px-5 md:px-10 xl:px-20 bg-warm-100">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <RevealOnScroll>
            <div className="flex flex-col gap-4">
              <span className="text-h4 text-bronze-900">INSIGHTS</span>
              <h2 className="text-h2 text-navy-950">
                Thinking & Perspectives
              </h2>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="w-full md:w-auto flex justify-start md:justify-end">
              <Button variant="secondary" data-interactive className="w-full md:w-auto">Read All Insights</Button>
            </div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {insights.map((insight, index) => (
            <RevealOnScroll key={insight.id} delay={index * 0.1}>
              <Link 
                href={`#`} 
                className="group block bg-warm-50 border border-navy-100 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-shadow duration-300 p-6 md:p-8" 
                data-interactive
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="text-caption text-bronze-900">{insight.category}</span>
                  <div className="p-2 bg-warm-100 rounded-full group-hover:bg-bronze-900 group-hover:text-warm-50 transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-h3 text-navy-950 mb-4">{insight.title}</h3>
                <p className="text-caption text-navy-500">{insight.date}</p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
