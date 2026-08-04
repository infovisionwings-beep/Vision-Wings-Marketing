"use client";

// Reading this as: Landing page hero for a premium creative marketing agency, with an editorial design vibe, leaning toward large minimalist display type, restrained scroll triggers, and high-fidelity custom motion components.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import { useReducedMotion } from "framer-motion";
import AnimatedLogo from "@/components/motion/AnimatedLogo";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { content } from "@/lib/content";

interface HeroProps {
  campaign?: any;
  settings?: Record<string, string>;
}

export default function Hero({ campaign, settings }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  // A campaign assigned to the hero slot still wins, so scheduled campaigns keep
  // working; Site Content supplies everything else.
  const title = campaign?.title || content(settings, "hero.title");
  const description = campaign?.description || content(settings, "hero.description");
  const primaryCtaText = campaign?.primaryCtaText || content(settings, "hero.cta_primary_text");
  const primaryCtaLink = campaign?.primaryCtaLink || content(settings, "hero.cta_primary_link");
  const secondaryCtaText = campaign?.secondaryCtaText || content(settings, "hero.cta_secondary_text");
  const secondaryCtaLink = campaign?.secondaryCtaLink || content(settings, "hero.cta_secondary_link");
  // A hero campaign's own image wins over the Site Content setting. Without
  // this, publishing a hero campaign with an image left the old one on screen
  // and the picture had to be changed in a second, unrelated place.
  const heroImage = campaign?.coverImage || content(settings, "hero.image");
  const heroImageAlt = content(settings, "hero.image_alt");

  return (
    <section className="relative min-h-[100dvh] pt-24 pb-16 md:pt-28 flex flex-col justify-center bg-warm-50">
      {/* ── Layered background for depth ──
          Clipping lives on this layer, not the section: the section used to be
          overflow-hidden, which silently cut off hero content on short viewports. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Radial copper glow behind the logo area */}
        <div
          className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #B87333 0%, transparent 70%)" }}
        />

        {/* Top-left subtle navy radial for contrast */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #0F172A 0%, transparent 70%)" }}
        />

        {/* Bottom gradient vignette – fades into the next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(15,23,42,0.04))" }}
        />

        {/* Film-grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      <div className="w-full mx-auto px-5 md:px-10 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center max-w-[1280px] mx-auto">

          {/* The proposition leads on every breakpoint. It used to sit below the
              logo on mobile, and every element was held at opacity:0 until the
              logo animation reported completion — so the headline, the copy and
              both CTAs were invisible for 1.6s, and permanently invisible if that
              callback never fired. The copy now paints with the document; the
              logo is the one authored moment. */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left">
            <h1 className="text-display font-bold text-navy-950 mb-6 text-balance">
              {title}
            </h1>

            <p className="text-body-lg text-navy-700 mb-10 max-w-[52ch] mx-auto lg:mx-0">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto">
              <Link href={primaryCtaLink} className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto min-h-[48px] justify-center whitespace-nowrap shadow-xl" data-interactive>
                  {primaryCtaText}
                </Button>
              </Link>
              <Link href={secondaryCtaLink} className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto min-h-[48px] justify-center whitespace-nowrap shadow-sm" data-interactive>
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center w-full">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={heroImageAlt}
                className="w-full max-w-[380px] rounded-2xl object-cover shadow-xl"
              />
            ) : (
              <AnimatedLogo isReducedMotion={!!prefersReducedMotion} />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
