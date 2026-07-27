"use client";

// Reading this as: Company introduction and manifesto section for an editorial brand agency, utilizing high-contrast typography, plain-layout data metrics, and architectural visual accents.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Image from "next/image";

export default function AboutVision() {
  return (
    <section id="vision" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-100 text-navy-950 overflow-hidden">
      <div className="max-w-[1280px] mx-auto space-y-20 md:space-y-32">
        
        {/* Top: Editorial Manifesto (Vertical Stack per Rule 4.7 split-header ban) */}
        <RevealOnScroll className="max-w-4xl">
          <h2 className="text-display sm:text-h1 font-bold text-navy-950 tracking-tight leading-[1.05] mb-8">
            You built a great business. Now let&apos;s give wings to your vision with high-velocity marketing and brand acceleration.
          </h2>
          <p className="text-body-lg text-navy-700 max-w-[65ch] leading-relaxed">
            Most agencies bury you in account manager layers and generic ad templates. Vision Wings operates as a specialized growth partner—defining your unfair market advantage and executing high-converting marketing campaigns that command industry authority.
          </p>
        </RevealOnScroll>

        {/* Middle: Asymmetric Visual + Narrative Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Marketing / Strategic Team Photography Backdrop */}
          <RevealOnScroll className="lg:col-span-7 h-[380px] sm:h-[480px] relative rounded-lg overflow-hidden bg-navy-900 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85"
              alt="Strategic marketing team driving brand acceleration"
              fill
              className="object-cover opacity-85 hover:scale-105 transition-transform duration-1000 ease-out"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent flex items-end p-8 sm:p-12">
              <p className="text-warm-50 text-h3 sm:text-h2 font-light tracking-tight max-w-md">
                &ldquo;We don&apos;t just run campaigns. We give aerodynamic lift and permanent altitude to your brand vision.&rdquo;
              </p>
            </div>
          </RevealOnScroll>

          {/* Core Strategic Pillars */}
          <div className="lg:col-span-5 space-y-8 lg:pl-4">
            <RevealOnScroll delay={0.1} className="group border-b border-navy-200 pb-6">
              <span className="text-xs font-mono font-semibold text-bronze-600 mb-2 block">01 / STRATEGY FIRST</span>
              <h3 className="text-h3 text-navy-950 mb-2 group-hover:text-bronze-600 transition-colors">Market Positioning &amp; Clarity</h3>
              <p className="text-body text-navy-600 leading-relaxed">
                We analyze buyer psychology and competitive gaps before launching a campaign. Everything we build serves your core growth and revenue objectives.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2} className="group border-b border-navy-200 pb-6">
              <span className="text-xs font-mono font-semibold text-bronze-600 mb-2 block">02 / SENIOR CRAFT</span>
              <h3 className="text-h3 text-navy-950 mb-2 group-hover:text-bronze-600 transition-colors">Omnichannel Execution</h3>
              <p className="text-body text-navy-600 leading-relaxed">
                From high-converting web funnels and viral video commercials to precision paid advertising, your campaigns are executed 100% by senior marketing masters.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3} className="group pb-2">
              <span className="text-xs font-mono font-semibold text-bronze-600 mb-2 block">03 / TANGIBLE ROI</span>
              <h3 className="text-h3 text-navy-950 mb-2 group-hover:text-bronze-600 transition-colors">Predictable Revenue Growth</h3>
              <p className="text-body text-navy-600 leading-relaxed">
                We bridge the gap between captivating creative storytelling and bottom-line performance, turning passive audiences into lifelong brand advocates.
              </p>
            </RevealOnScroll>
          </div>
        </div>

        {/* Bottom: Plain-Layout Impact Metrics (Rule 4.4: For high density/impact, generic card containers are banned. Data metrics breathe in plain layout) */}
        <RevealOnScroll className="pt-12 border-t border-navy-200 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            <span className="text-display font-bold text-navy-950 tracking-tighter block mb-1">$45M+</span>
            <p className="text-body-sm text-navy-600 font-medium">Client Value Created</p>
          </div>
          <div>
            <span className="text-display font-bold text-navy-950 tracking-tighter block mb-1">3.8&times;</span>
            <p className="text-body-sm text-navy-600 font-medium">Average Conversion Lift</p>
          </div>
          <div>
            <span className="text-display font-bold text-navy-950 tracking-tighter block mb-1">100%</span>
            <p className="text-body-sm text-navy-600 font-medium">Senior Practitioner Execution</p>
          </div>
          <div>
            <span className="text-display font-bold text-navy-950 tracking-tighter block mb-1 whitespace-nowrap">&lt;30d</span>
            <p className="text-body-sm text-navy-600 font-medium">Avg Sprint to First Impact</p>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
