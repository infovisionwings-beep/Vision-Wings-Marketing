"use client";

// Reading this as: Portfolio showcase section for an elite design agency, using an Asymmetric Exhibition Gallery layout with cinematic photography, hover physics, and high typographic contrast.
// DESIGN_VARIANCE: 9
// MOTION_INTENSITY: 7
// VISUAL_DENSITY: 3

import { useEffect, useState } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getProjects } from "@/app/actions/projects";

const fallbackProjects = [
  {
    id: 1,
    title: "Lumina Health",
    category: "Brand Architecture & Design System",
    year: "2024",
    slug: "lumina",
    desc: "Reimagining the digital presence for a next-generation genomic healthcare platform.",
    coverImage: "https://picsum.photos/seed/vw-lumina-health/1600/1000",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Aero Dynamics",
    category: "Visual Identity & Motion",
    year: "2023",
    slug: "aero",
    desc: "Precision branding and 3D product visualization for an autonomous drone manufacturer.",
    coverImage: "https://picsum.photos/seed/vw-aero-dynamics/1000/1200",
    isFeatured: false,
  },
  {
    id: 3,
    title: "Vertex Capital",
    category: "Web Experience & Strategy",
    year: "2024",
    slug: "vertex",
    desc: "High-trust digital flagship for a $1.2B venture fund investing in hard tech.",
    coverImage: "https://picsum.photos/seed/vw-vertex-capital/1200/1000",
    isFeatured: false,
  }
];

export default function Work() {
  const [projects, setProjects] = useState<any[]>(fallbackProjects);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjects();
        if (data && data.length > 0) {
          // If DB projects lack images, augment with high-res placeholder photography per Rule 4.8
          const augmented = data.map((p: any, idx: number) => ({
            ...p,
            coverImage: p.coverImage || `https://picsum.photos/seed/vw-project-${p.slug || idx}/1600/1000`,
            isFeatured: idx === 0,
            desc: p.description || p.subtitle || (p.content && p.content.slice(0, 130) + "...") || "Strategic brand elevation and digital flagship design.",
          }));
          setProjects(augmented);
        }
      } catch (err) {
        console.error("Failed to load projects client-side:", err);
      }
    }
    load();
  }, []);

  return (
    <section id="work" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-50 text-navy-950 overflow-hidden">
      <div className="max-w-[1280px] mx-auto space-y-16 md:space-y-24">
        
        {/* Section Header (No eyebrow per Rule 4.7 max 1 eyebrow per 3 sections) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-navy-200 pb-10">
          <RevealOnScroll className="max-w-2xl">
            <h2 className="text-display sm:text-h1 font-bold text-navy-950 tracking-tight leading-[1.05]">
              Selected Works &amp; Commissions.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Link href="/work" className="inline-block min-h-[44px] rounded-full focus-visible:ring-2 focus-visible:ring-bronze-500 outline-none">
              <Button variant="secondary" className="whitespace-nowrap group min-h-[44px]" data-interactive>
                <span>View Full Archive</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </RevealOnScroll>
        </div>

        {/* Exhibition Gallery Grid (Asymmetric Layout: 1 Hero Full-Width Card + 2 Half-Width Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {projects.map((project, index) => {
            const isHero = index === 0 || project.isFeatured;
            const colSpan = isHero ? "md:col-span-12" : "md:col-span-6";
            const aspectClass = isHero ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[4/3] sm:aspect-[16/10]";

            return (
              <RevealOnScroll 
                key={project.id || index} 
                delay={index * 0.1}
                className={`${colSpan} group block`}
              >
                <Link href={`/work/${project.slug || project.id}`} className="block space-y-6 focus-visible:ring-2 focus-visible:ring-bronze-500 rounded-2xl outline-none p-1 -m-1" data-interactive>
                  
                  {/* Image Showcase Container with Tactile Hover Physics */}
                  <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-navy-900 border border-navy-200/60 shadow-md`}>
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes={isHero ? "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1280px" : "(max-width: 768px) 100vw, 50vw"}
                        priority={index === 0}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-navy-950 flex items-center justify-center">
                        <span className="text-display text-navy-800 font-bold select-none tracking-tighter">VW</span>
                      </div>
                    )}
                    
                    {/* Subtle Gradient Overlay & Floating Badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    <div className="absolute top-6 right-6 z-10">
                      <span className="px-3.5 py-1.5 rounded-full bg-navy-950/90 text-warm-50 text-xs font-mono font-semibold backdrop-blur-md border border-warm-50/10">
                        {project.year}
                      </span>
                    </div>

                    {/* Hover Arrow Indicator */}
                    <div className="absolute bottom-6 right-6 z-10 w-12 h-12 rounded-full bg-warm-50 text-navy-950 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Project Metadata & Typography */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-semibold text-bronze-600 uppercase tracking-wider">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-h2 font-bold text-navy-950 group-hover:text-bronze-600 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    {project.desc && isHero && (
                      <p className="text-body text-navy-600 max-w-md sm:text-right leading-relaxed">
                        {project.desc}
                      </p>
                    )}
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
}
