"use client";

import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function AboutVision() {
  return (
    <section id="vision" className="py-16 md:py-24 lg:py-32 px-5 md:px-10 xl:px-20 bg-warm-100">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Typographic Visual Block (Left Column on Desktop, Top & Full-bleed on Mobile) */}
          <RevealOnScroll className="-mx-5 md:mx-0 h-full">
            <div className="bg-navy-950 h-full min-h-[360px] sm:min-h-[440px] flex items-center justify-center p-8 sm:p-12 xl:p-16">
              <p className="text-display text-warm-50 uppercase text-center tracking-tighter leading-[0.95] select-none">
                CLARITY
                <br />
                FROM
                <br />
                CHAOS
              </p>
            </div>
          </RevealOnScroll>

          {/* Text Content & Pillars (Right Column) */}
          <div className="flex flex-col justify-center">
            <RevealOnScroll>
              <span className="text-h4 text-bronze-900 mb-4 block">OUR VISION</span>
              <h2 className="text-h2 text-navy-950 mb-6">
                Cutting through the static with strategy and precision.
              </h2>
              <p className="text-body-lg text-navy-700 max-w-2xl mb-10">
                The market is noisy. We cut through the static by defining what makes your business fundamentally unique, and amplifying that truth through precision design and growth marketing.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="space-y-8">
                <div className="border-l-[3px] border-bronze-500 pl-6 py-1">
                  <h3 className="text-h3 text-navy-950 mb-2">Strategy First</h3>
                  <p className="text-body text-navy-700">
                    We don't design in a vacuum. Every visual decision is rooted in a deep understanding of your business objectives and audience psychology.
                  </p>
                </div>
                <div className="border-l-[3px] border-bronze-500 pl-6 py-1">
                  <h3 className="text-h3 text-navy-950 mb-2">Impeccable Craft</h3>
                  <p className="text-body text-navy-700">
                    From the smallest typography details to full-scale digital experiences, our work exudes premium quality and relentless attention to detail.
                  </p>
                </div>
                <div className="border-l-[3px] border-bronze-500 pl-6 py-1">
                  <h3 className="text-h3 text-navy-950 mb-2">Measurable Growth</h3>
                  <p className="text-body text-navy-700">
                    Aesthetics alone aren't enough. We build conversion-focused ecosystems that generate tangible ROI and long-term brand equity.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

