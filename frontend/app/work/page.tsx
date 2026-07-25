import { getProjects } from "@/app/actions/projects";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Link } from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Work - Vision Wings",
  description: "A curation of brand strategy, visual identities, and digital experiences that drive outsized results.",
};

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

export default async function WorkPage() {
  let projects: any[] = fallbackProjects;
  try {
    const dbProjects = await getProjects();
    if (dbProjects && dbProjects.length > 0) {
      projects = dbProjects;
    }
  } catch (err) {
    console.error("Failed to load projects for Work list page:", err);
  }

  return (
    <main className="min-h-screen bg-warm-50 pt-32 pb-24 px-5 md:px-10 xl:px-20">
      <div className="max-w-[1280px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <span className="text-h4 text-bronze-900 block font-semibold">SELECTED ARCHIVE</span>
          <h1 className="text-display text-navy-950">Featured Case Studies</h1>
          <p className="text-body-lg text-navy-700">
            Every partnership is a commitment to strategic clarity and meticulous execution. Explore how we align brand narrative with commercial goals.
          </p>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project) => (
            <div key={project.id} className="group space-y-6">
              <Link href={`/work/${project.slug}`} className="block overflow-hidden rounded-xl border border-navy-200 shadow-sm bg-navy-100 aspect-video relative" data-interactive>
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
              </Link>

              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-navy-100 pb-2.5 text-xs text-navy-500">
                  <span className="uppercase tracking-widest font-semibold">{project.category}</span>
                  <span className="font-mono">{project.year}</span>
                </div>
                <Link href={`/work/${project.slug}`} className="block group-hover:text-bronze-500 transition-colors" data-interactive>
                  <h3 className="text-h3 text-navy-950">{project.title}</h3>
                </Link>
                <Link href={`/work/${project.slug}`} className="inline-flex items-center gap-2 text-navy-950 font-semibold text-sm hover:text-bronze-500 transition-colors min-h-[44px]" data-interactive>
                  <span>Read Case Study</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
