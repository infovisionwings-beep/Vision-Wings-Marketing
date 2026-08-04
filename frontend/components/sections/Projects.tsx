"use client";

// Reading this as: the proof beat of the homepage — named case studies, read as a
// dark exhibition index with a pinned cover plate that follows the reader's cursor
// or keyboard focus. Deliberately not the Work masonry, the Insights wire rows, or
// the Services bento: this is the one section that speaks in single, named projects.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 3

import { useState } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { content } from "@/lib/content";

interface ProjectsProps {
  projects?: any[];
  settings?: Record<string, string>;
}

/** The index is a shortlist, not an archive — /work holds everything. */
const MAX_CASES = 5;

/**
 * Featured first, then newest. `getProjects` already sorts by createdAt desc, so
 * a stable partition is enough and keeps the admin's featured flag meaningful.
 */
function shortlist(projects: any[]): any[] {
  const featured = projects.filter((p) => p?.isFeatured);
  const rest = projects.filter((p) => !p?.isFeatured);
  return [...featured, ...rest].slice(0, MAX_CASES);
}

/** No cover uploaded yet: the monogram plate, same as /work, rather than a gap. */
function Plate({ project, priority }: { project: any; priority: boolean }) {
  if (!project.coverImage) {
    return (
      <div className="w-full h-full bg-navy-900 flex items-center justify-center">
        <span className="text-display font-bold text-warm-50/10 select-none tracking-tighter">VW</span>
      </div>
    );
  }
  return (
    <img
      src={project.coverImage}
      alt={project.title}
      className="w-full h-full object-cover"
      loading={priority ? "eager" : "lazy"}
    />
  );
}

export default function Projects({ projects = [], settings }: ProjectsProps) {
  const cases = shortlist(projects || []);
  const [active, setActive] = useState(0);

  // A homepage proof section with nothing to prove is worse than no section at
  // all, so an empty database renders nothing rather than an apology.
  if (cases.length === 0) return null;

  const current = cases[active] ?? cases[0];

  return (
    <section
      id="projects"
      className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-navy-950 text-warm-50"
    >
      <div className="max-w-[1280px] mx-auto space-y-14 md:space-y-20">

        {/* Heading carries itself — no eyebrow, matching Services, Work and Insights. */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-navy-800 pb-10">
          <RevealOnScroll className="max-w-2xl">
            <h2 className="text-h1 font-bold text-warm-50 text-balance">
              {content(settings, "projects.heading")}
            </h2>
            <p className="text-body text-navy-300 mt-4 max-w-[60ch] leading-relaxed">
              {content(settings, "projects.intro")}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Link
              href={content(settings, "projects.cta_link")}
              className="group inline-flex items-center gap-2 min-h-[44px] px-1 text-xs font-mono font-semibold uppercase tracking-widest text-warm-50 border-b border-bronze-500/60 hover:border-bronze-400 hover:text-bronze-300 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400 focus-visible:ring-offset-4 focus-visible:ring-offset-navy-950 rounded-sm"
              data-interactive
            >
              <span>{content(settings, "projects.cta_text")}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 xl:gap-20">

          {/* The index. Rows drive the plate on hover and on keyboard focus, so the
              preview is never mouse-only. */}
          {/* self-start keeps the closing rule against the last case instead of
              stretching it to the plate's height; centering balances a short index
              (one or two cases) against the tall plate without affecting a full one. */}
          <ul className="lg:col-span-6 self-start lg:self-center divide-y divide-navy-800/90 border-t border-b border-navy-800/90">
            {cases.map((project, index) => {
              const isActive = index === active;
              return (
                <li key={project.id ?? project.slug ?? index}>
                  <RevealOnScroll delay={Math.min(index, 3) * 0.08}>
                    <Link
                      href={project.slug ? `/work/${project.slug}` : "/work"}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className="group block py-8 lg:py-11 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400 focus-visible:ring-offset-4 focus-visible:ring-offset-navy-950 rounded-lg"
                      data-interactive
                    >
                      {/* Below lg there is no pinned plate, so each case carries its own cover. */}
                      <div className="lg:hidden mb-5 aspect-[16/10] rounded-xl overflow-hidden border border-navy-800 bg-navy-900 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)]">
                        <Plate project={project} priority={index === 0} />
                      </div>

                      <div className="flex items-start justify-between gap-5 sm:gap-8">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-3 text-[11px] sm:text-xs font-mono uppercase tracking-widest">
                            <span className="text-bronze-400 font-semibold">{project.year}</span>
                            <span className="text-navy-300 truncate">{project.category}</span>
                          </div>
                          <h3
                            /* text-h2 is a global class that already scales 26 → 32 → 40px,
                               so it carries its own breakpoints — Tailwind cannot generate
                               `sm:` variants of it and silently emits nothing if asked. */
                            className={`text-h2 font-bold tracking-tight leading-[1.1] mt-2.5 text-balance transition-colors duration-300 motion-reduce:transition-none group-hover:text-bronze-300 ${
                              isActive ? "lg:text-bronze-300" : "text-warm-50"
                            }`}
                          >
                            {project.title}
                          </h3>
                        </div>

                        <span className="mt-1 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-navy-700 flex items-center justify-center text-navy-300 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:border-bronze-400 group-hover:text-bronze-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight className="w-5 h-5" />
                        </span>
                      </div>
                    </Link>
                  </RevealOnScroll>
                </li>
              );
            })}
          </ul>

          {/* The pinned plate. One authored moment: covers cross-dissolve and settle
              out of a slight over-scale as the reader moves down the index. */}
          <div className="hidden lg:block lg:col-span-6">
            <div className="sticky top-28 space-y-5">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-navy-800 bg-navy-900 shadow-[0_32px_70px_-30px_rgba(0,0,0,0.85)]">
                {cases.map((project, index) => (
                  <div
                    key={project.id ?? project.slug ?? index}
                    aria-hidden="true"
                    className={`absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      index === active
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-[1.05]"
                    }`}
                  >
                    <Plate project={project} priority={index === 0} />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="flex items-baseline justify-between gap-6 text-xs font-mono uppercase tracking-widest">
                <span className="text-navy-300 truncate">{current.category}</span>
                <span className="text-bronze-400 font-semibold flex-shrink-0">{current.year}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
