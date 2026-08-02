"use client";

// Reading this as: Core capabilities section for an elite branding & growth agency, structured as an asymmetric 5-cell Bento Grid with rich background diversity, tactile hover states, and zero redundant eyebrow labels.
// DESIGN_VARIANCE: 9
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 4

import { useState } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Image from "next/image";
import { Sparkles, Code, TrendingUp, PenTool, Video, Check } from "lucide-react";
import { content, contentList } from "@/lib/content";

/**
 * Card copy lives in Site Content → Services. What stays here is presentation
 * only: the icon, the bento span and the surface treatment, which are layout
 * decisions rather than things an editor should have to reason about.
 */
const CARD_STYLES = [
  {
    icon: Sparkles,
    gridClass: "col-span-12 lg:col-span-7 bg-navy-950 text-warm-50 border border-navy-800",
    isDark: true,
    hasImage: false,
  },
  {
    icon: PenTool,
    gridClass: "col-span-12 lg:col-span-5 bg-warm-50 text-navy-950 border border-navy-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]",
    isDark: false,
    hasImage: false,
  },
  {
    icon: TrendingUp,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-4 bg-navy-900 text-warm-100 border border-navy-800",
    isDark: true,
    hasImage: false,
  },
  {
    icon: Video,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-4 bg-navy-950 text-warm-50 border border-navy-800 relative overflow-hidden group",
    isDark: true,
    hasImage: true,
  },
  {
    icon: Code,
    gridClass: "col-span-12 lg:col-span-4 bg-gradient-to-br from-warm-100 to-warm-200/80 text-navy-950 border border-bronze-500/20",
    isDark: false,
    hasImage: false,
  },
] as const;

type CardItem = (typeof CARD_STYLES)[number] & {
  id: string;
  title: string;
  desc: string;
  deliverables: string[];
  tools: string[];
  imageUrl?: string;
};

function ServiceCard({ item, idx }: { item: CardItem; idx: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = item.icon;

  return (
    // No lift on hover: nothing here is clickable on desktop, so the motion
    // promised a target that does not exist. The one real control is the
    // mobile disclosure button, which carries its own state.
    <RevealOnScroll
      delay={idx * 0.08}
      className={`${item.gridClass} rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-sm`}
    >
      {/* Background image for video card. Guarded on the URL, not just on
          hasImage: clearing the image in Site Content would otherwise hand
          next/image an empty src. */}
      {item.hasImage && item.imageUrl && (
        <>
          <Image
            src={item.imageUrl}
            alt=""
            aria-hidden="true"
            fill
            className="object-cover opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent pointer-events-none" />
        </>
      )}

      {/* Top of Card */}
      <div className="relative z-10 space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.isDark ? "bg-navy-800 text-bronze-400" : "bg-navy-950 text-warm-50"}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${item.isDark ? "bg-navy-800/80 text-navy-300" : "bg-warm-200/80 text-navy-700"}`}>
            0{idx + 1}
          </span>
        </div>

        <div>
          <h3 className="text-h3 font-bold mb-2.5 sm:mb-3">{item.title}</h3>
          <p className={`text-body-sm leading-relaxed ${item.isDark ? "text-navy-300" : "text-navy-700"}`}>
            {item.desc}
          </p>
        </div>

        {/* Mobile Disclosure Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden mt-3 pt-3 border-t border-current/10 w-full flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider py-2 min-h-[44px] outline-none focus-visible:ring-2 focus-visible:ring-bronze-500 rounded-lg ${
            item.isDark ? "text-bronze-400 hover:text-bronze-300" : "text-bronze-700 hover:text-bronze-900"
          }`}
          data-interactive
        >
          <span>{isOpen ? "Hide Deliverables & Stack ↑" : "View Key Deliverables & Stack ↓"}</span>
        </button>

        {/* Deliverables Checklist (Hidden on mobile by default, open on desktop) */}
        <div className={`space-y-2.5 pt-4 border-t border-current/10 ${isOpen ? "block" : "hidden"} md:block`}>
          <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${item.isDark ? "text-bronze-400" : "text-bronze-700"}`}>
            Key Deliverables
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.deliverables.map((del, dIdx) => (
              <div key={dIdx} className="flex items-center gap-2 text-xs">
                <Check className={`w-3.5 h-3.5 flex-shrink-0 ${item.isDark ? "text-bronze-400" : "text-bronze-600"}`} />
                <span className={item.isDark ? "text-warm-100" : "text-navy-800"}>{del}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom of Card: Tech/Tool Tokens (Hidden on mobile by default, open on desktop) */}
      <div className={`relative z-10 pt-6 mt-6 border-t border-current/10 flex flex-wrap gap-2 items-center ${isOpen ? "flex" : "hidden"} md:flex`}>
        <span className={`text-[11px] font-mono font-semibold mr-1 ${item.isDark ? "text-navy-400" : "text-navy-500"}`}>
          STACK:
        </span>
        {item.tools.map((tool, tIdx) => (
          <span 
            key={tIdx}
            className={`text-[11px] font-mono px-2.5 py-1 min-h-[28px] inline-flex items-center rounded ${
              item.isDark 
                ? "bg-navy-900/90 text-navy-200 border border-navy-700" 
                : "bg-warm-200/60 text-navy-800 border border-navy-300/50"
            }`}
          >
            {tool}
          </span>
        ))}
      </div>
    </RevealOnScroll>
  );
}

interface ServicesProps {
  settings?: Record<string, string>;
}

export default function Services({ settings }: ServicesProps) {
  const capabilities: CardItem[] = CARD_STYLES.map((style, i) => {
    const n = i + 1;
    return {
      ...style,
      id: `card${n}`,
      title: content(settings, `services.card${n}_title`),
      desc: content(settings, `services.card${n}_desc`),
      deliverables: contentList(settings, `services.card${n}_deliverables`),
      tools: contentList(settings, `services.card${n}_tools`),
      imageUrl: style.hasImage ? content(settings, `services.card${n}_image`) : undefined,
    };
  });

  const strengths = [1, 2, 3].map((n) => ({
    title: content(settings, `services.strength${n}_title`),
    desc: content(settings, `services.strength${n}_desc`),
  }));

  const industries = contentList(settings, "services.industries");

  return (
    // warm-50, not warm-100: this section and AboutVision above it shared one
    // background with no divider, so ~2000px of page read as a single slab.
    <section id="strategy" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-50 text-navy-950">
      <div className="max-w-[1280px] mx-auto space-y-20 md:space-y-32">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-navy-200 pb-10">
          {/* The "MARKETING & BRAND GROWTH" eyebrow is gone: it restated the heading
              it sat above and cost a typographic step. The heading carries itself. */}
          <RevealOnScroll className="max-w-2xl">
            <h2 className="text-h1 font-bold text-navy-950 text-balance">
              {content(settings, "services.heading")}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="max-w-md">
            <p className="text-body text-navy-700 leading-relaxed">
              {content(settings, "services.intro")}
            </p>
          </RevealOnScroll>
        </div>

        {/* 5-Cell Asymmetric Bento Grid (Rule 4.7: Exactly 5 cells for 5 items, Background Diversity) */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {capabilities.map((item, idx) => (
            <ServiceCard key={item.id} item={item} idx={idx} />
          ))}
        </div>

        {/* Why Choose Us (Operational Strengths - Clean 3-Col layout without card containers per Rule 4.4 / 4.7) */}
        <div className="pt-16 border-t border-navy-200 space-y-12">
          <RevealOnScroll className="max-w-xl">
            <h3 className="text-h2 font-bold text-navy-950">{content(settings, "services.strengths_heading")}</h3>
            <p className="text-body text-navy-700 mt-2">
              {content(settings, "services.strengths_intro")}
            </p>
          </RevealOnScroll>

          {/* Titles were text-h4 — a 14px uppercase token, the same size as the
              text-body-sm beneath them, so title and description read as one block.
              text-h3 restores the step. The 2px navy rule is now a hairline: at 2px
              it read as a decorative bar rather than the editorial rules used
              everywhere else in this section. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
            {strengths.map((s, idx) => (
              <RevealOnScroll key={idx} delay={idx * 0.1} className="space-y-3 border-l border-navy-300 pl-6">
                <span className="text-xs font-mono font-semibold text-bronze-600 block">STRENGTH / 0{idx + 1}</span>
                <h4 className="text-h3 font-bold text-navy-950">{s.title}</h4>
                <p className="text-body-sm text-navy-600 leading-relaxed">{s.desc}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Industries Served (Sleek Horizontal Pill Cluster without eyebrows) */}
        <div className="pt-16 border-t border-navy-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <RevealOnScroll className="max-w-sm">
            <h3 className="text-h3 font-bold text-navy-950">{content(settings, "services.industries_heading")}</h3>
            <p className="text-body-sm text-navy-600 mt-1">{content(settings, "services.industries_intro")}</p>
          </RevealOnScroll>
          {/* No hover state on the pills: they are labels, not controls. A border
              that lit up on hover promised a click target that does not exist. */}
          <RevealOnScroll delay={0.1} className="flex flex-wrap gap-2.5 sm:gap-3 max-w-2xl justify-start md:justify-end">
            {industries.map((ind, idx) => (
              <span
                key={idx}
                className="px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-full bg-navy-950 text-warm-50 text-xs sm:text-sm font-medium border border-navy-800"
              >
                {ind}
              </span>
            ))}
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
}
