"use client";

import { useReducedMotion } from "framer-motion";

interface Logo {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl?: string | null;
}

function LogoImg({ logo }: { logo: Logo }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.logoUrl}
      alt={logo.name}
      className="h-20 w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 sm:h-24"
      loading="lazy"
    />
  );
  return logo.linkUrl ? (
    <a
      href={logo.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={logo.name}
      className="rounded outline-none focus-visible:ring-2 focus-visible:ring-bronze-500"
    >
      {img}
    </a>
  ) : (
    img
  );
}

export default function LogoMarquee({ logos }: { logos: Logo[] }) {
  const prefersReducedMotion = useReducedMotion();

  // No placeholder companies: showing invented client names would be dishonest
  // content, unlike the text-copy defaults elsewhere that are real fallback
  // copy. Nothing to show yet means the section simply does not render.
  if (!logos || logos.length === 0) return null;

  if (prefersReducedMotion) {
    // A paused mid-scroll strip would clip half its logos, so reduced motion
    // gets its own static layout with each logo rendered exactly once, rather
    // than freezing the doubled scrolling track.
    return (
      <div className="space-y-4">
        <p className="text-center text-xs font-mono font-semibold uppercase tracking-widest text-navy-500 sm:text-left">
          Trusted by ambitious teams
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:justify-start">
          {logos.map((logo) => (
            <li key={logo.id}>
              <LogoImg logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Duplicated so the track can scroll a full 50% and land on an identical
  // frame — that repetition is what makes the loop read as seamless.
  const track = [...logos, ...logos];

  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-mono font-semibold uppercase tracking-widest text-navy-500 sm:text-left">
        Trusted by ambitious teams
      </p>

      <div
        className="group relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <ul className="marquee-track flex w-max items-center">
          {track.map((logo, idx) => (
            <li key={`${logo.id}-${idx}`} className="flex shrink-0 items-center px-6 sm:px-10">
              <LogoImg logo={logo} />
            </li>
          ))}
        </ul>
      </div>

      {/* Scoped here rather than added to globals.css: this animation has
          exactly one caller. Pause-on-hover only needs plain CSS. */}
      <style>{`
        .marquee-track {
          animation: vw-logo-marquee 32s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes vw-logo-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
