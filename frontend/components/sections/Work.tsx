"use client";

// Reading this as: Portfolio case study showcase for an editorial agency, featuring large typographic contrast, interactive project cards, and clean visual structure.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import { useEffect, useState } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";
import { getProjects } from "@/app/actions/projects";

const fallbackProjects = [
  {
    id: 1,
    title: "Lumina Health",
    category: "Brand Strategy & Digital",
    year: "2023",
    slug: "lumina",
    coverImage: ""
  },
  {
    id: 2,
    title: "Aero Dynamics",
    category: "Visual Identity",
    year: "2023",
    slug: "aero",
    coverImage: ""
  },
  {
    id: 3,
    title: "Vertex Capital",
    category: "Web Experience",
    year: "2024",
    slug: "vertex",
    coverImage: ""
  }
];

export default function Work() {
  const [projects, setProjects] = useState<any[]>(fallbackProjects);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjects();
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects client-side:", err);
      }
    }
    load();
  }, []);

  return (
    <section id="work" className="py-16 md:py-24 lg:py-32 px-5 md:px-10 xl:px-20 bg-warm-50">
      <div className="max-w-[1280px] mx-auto">
        <RevealOnScroll className="flex flex-col items-start text-left mb-12 md:mb-16 lg:mb-24 max-w-3xl">
          <h2 className="text-h2 text-navy-950 mb-4 md:mb-6">
            Selected Projects
          </h2>
          <p className="text-body-lg text-navy-700">
            A selection of recent partnerships where strategy and design drove outsized business results.
          </p>
        </RevealOnScroll>

        <div className="flex flex-col gap-12 md:gap-16 lg:gap-24">
          {projects.map((project, index) => (
            <RevealOnScroll key={project.id} delay={index * 0.1}>
              <Link href={`/work/${project.slug || project.id}`} className="group block" data-interactive>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-7 bg-navy-100 aspect-video relative overflow-hidden rounded-xl border border-navy-200 shadow-sm">
                    {project.coverImage ? (
                      <img 
                        src={project.coverImage} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out-expo"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/20 to-navy-950/5 flex items-center justify-center">
                        <span className="text-display opacity-10 text-navy-950 select-none tracking-tighter">VW</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-navy-950/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                  </div>
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-3 md:mb-4 border-b border-navy-100 pb-3 md:pb-4">
                      <span className="text-caption text-navy-500 uppercase tracking-widest font-semibold">
                        {project.category}
                      </span>
                      <span className="text-caption text-navy-500 font-mono">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="text-h3 text-navy-950 mb-4 md:mb-6 group-hover:text-bronze-500 transition-colors">
                      {project.title}
                    </h3>
                    <div className="inline-flex items-center gap-2 text-navy-950 font-semibold group-hover:text-bronze-500 transition-colors min-h-[44px]">
                      <span>View Case Study</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.2} className="mt-16 md:mt-20 lg:mt-24 flex justify-center">
          <Link href="/work" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto cursor-pointer" data-interactive>
              View All Projects
            </Button>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
