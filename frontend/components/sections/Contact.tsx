"use client";

// Reading this as: Final conversion CTA section for an agency landing page, utilizing bold dark-mode contrast and unified intent labeling.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 lg:py-40 px-5 md:px-10 xl:px-20 bg-navy-950 text-center overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <RevealOnScroll>
          <h2 className="text-display text-warm-50 mb-8 leading-tight">
            Ready to claim your unfair advantage?
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-body-lg text-navy-300 mb-12">
            Let&apos;s discuss how Vision Wings can help clarify your brand, elevate your design, and accelerate your growth.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <div className="w-full flex justify-center">
            <Link href="/contact" className="w-full md:w-auto">
              <Button variant="primary" className="bg-warm-50 text-navy-950 hover:bg-warm-100 active:bg-warm-200 w-full md:w-auto whitespace-nowrap" data-interactive>
                Let&apos;s Build Together
              </Button>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
