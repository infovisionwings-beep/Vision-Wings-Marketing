"use client";

// Reading this as: Company introduction and manifesto section for an editorial brand agency, utilizing high-contrast typography, plain-layout data metrics, and architectural visual accents.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Image from "next/image";
import { content } from "@/lib/content";

interface AboutVisionProps {
  settings?: Record<string, string>;
}

export default function AboutVision({ settings }: AboutVisionProps) {
  // Every string here is editable under Site Content → About / Vision.
  const pillars = [1, 2, 3].map((n) => ({
    label: content(settings, `about.pillar${n}_label`),
    title: content(settings, `about.pillar${n}_title`),
    body: content(settings, `about.pillar${n}_body`),
  }));

  const metrics = [1, 2, 3, 4].map((n) => ({
    value: content(settings, `about.metric${n}_value`),
    label: content(settings, `about.metric${n}_label`),
  }));

  const photo = content(settings, "about.photo");

  return (
    <section id="vision" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-100 text-navy-950 overflow-hidden">
      <div className="max-w-[1280px] mx-auto space-y-20 md:space-y-32">

        {/* Top: Editorial Manifesto (Vertical Stack per Rule 4.7 split-header ban) */}
        {/* text-h1, not text-display: the hero owns the largest step. Every section
            heading was set at display size, so nothing read as subordinate to the
            hero and the page had no typographic hierarchy at all. */}
        <RevealOnScroll className="max-w-4xl">
          <h2 className="text-h1 font-bold text-navy-950 mb-8 text-balance">
            {content(settings, "about.heading")}
          </h2>
          <p className="text-body-lg text-navy-700 max-w-[65ch] leading-relaxed">
            {content(settings, "about.body")}
          </p>
        </RevealOnScroll>

        {/* Middle: Asymmetric Visual + Narrative Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Marketing / Strategic Team Photography Backdrop */}
          <RevealOnScroll className="lg:col-span-7 h-[380px] sm:h-[480px] relative rounded-lg overflow-hidden bg-navy-900 shadow-xl">
            {photo && (
              <Image
                src={photo}
                alt={content(settings, "about.photo_alt")}
                fill
                className="object-cover opacity-85 hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={false}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent flex items-end p-8 sm:p-12">
              <p className="text-warm-50 text-h3 sm:text-h2 font-light tracking-tight max-w-md">
                {content(settings, "about.quote")}
              </p>
            </div>
          </RevealOnScroll>

          {/* Core Strategic Pillars */}
          <div className="lg:col-span-5 space-y-8 lg:pl-4">
            {pillars.map((pillar, idx) => (
              <RevealOnScroll
                key={pillar.label || idx}
                delay={(idx + 1) * 0.1}
                className={`group ${idx < pillars.length - 1 ? "border-b border-navy-200 pb-6" : "pb-2"}`}
              >
                <span className="text-xs font-mono font-semibold text-bronze-600 mb-2 block">{pillar.label}</span>
                <h3 className="text-h3 text-navy-950 mb-2 group-hover:text-bronze-600 transition-colors">{pillar.title}</h3>
                <p className="text-body text-navy-600 leading-relaxed">{pillar.body}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Bottom: Plain-Layout Impact Metrics (Rule 4.4: For high density/impact, generic card containers are banned. Data metrics breathe in plain layout) */}
        {/* text-h1 rather than text-display: at 96px a five-character figure like
            "$45M+" is wider than its ~268px column at max width, which is why the
            last one had picked up a whitespace-nowrap band-aid. */}
        <RevealOnScroll className="pt-12 border-t border-navy-200 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, idx) => (
            <div key={metric.label || idx}>
              <span className="text-h1 font-bold text-navy-950 block mb-1">{metric.value}</span>
              <p className="text-body-sm text-navy-600 font-medium">{metric.label}</p>
            </div>
          ))}
        </RevealOnScroll>

      </div>
    </section>
  );
}
