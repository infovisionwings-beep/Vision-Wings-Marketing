import { getProjectBySlug } from "@/app/actions/projects";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { ArrowLeft, Calendar, Tag, Layers } from "lucide-react";
import Button from "@/components/ui/Button";

interface CaseStudy {
  title: string;
  category: string;
  year: string;
  coverImage: string;
  content: string;
}

const fallbackContentMap: Record<string, CaseStudy> = {
  lumina: {
    title: "Lumina Health",
    category: "Brand Strategy & Digital",
    year: "2023",
    coverImage: "",
    content: "Lumina Health was looking to modernize their patient experience and define their strategic voice. We constructed a comprehensive brand strategy that unified their messaging, designed a clean aesthetic identity, and deployed a high-performance patient scheduling application."
  },
  aero: {
    title: "Aero Dynamics",
    category: "Visual Identity",
    year: "2023",
    coverImage: "",
    content: "Aero Dynamics needed a visual identity that captured precision engineering and scale. We crafted a distinct logo system, brand patterns, and guidelines built on the principles of speed, stability, and aerospace confidence."
  },
  vertex: {
    title: "Vertex Capital",
    category: "Web Experience",
    year: "2024",
    coverImage: "",
    content: "Vertex Capital required a digital home that matched their institutional stature. We developed a conversion-focused web ecosystem with bespoke layout spacing, refined typography, and sub-second load times."
  }
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project: CaseStudy | null = null;

  try {
    const dbProject = await getProjectBySlug(slug);
    if (dbProject) {
      project = {
        title: dbProject.title,
        category: dbProject.category,
        year: dbProject.year,
        coverImage: dbProject.coverImage || "",
        content: dbProject.content || ""
      };
    } else if (fallbackContentMap[slug]) {
      project = fallbackContentMap[slug];
    }
  } catch (err) {
    console.error("Failed to load project details:", err);
  }

  if (!project) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-warm-50 pt-32 pb-24 px-5 md:px-10 xl:px-20">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Back Link */}
        <Link href="/#work" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-bronze-500 transition-colors min-h-[44px]" data-interactive>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-display text-navy-950 tracking-tighter leading-tight">
            {project.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap gap-6 py-4 border-y border-navy-200 text-sm text-navy-600">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-bronze-500" />
              <span className="font-semibold uppercase tracking-wider text-xs">{project.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-bronze-500" />
              <span className="font-mono">{project.year}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-navy-100 aspect-video relative overflow-hidden rounded-xl border border-navy-200 shadow-sm">
          {project.coverImage ? (
            <img 
              src={project.coverImage} 
              alt={project.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/20 to-navy-950/5 flex items-center justify-center">
              <span className="text-display opacity-10 text-navy-950 select-none tracking-tighter">VW</span>
            </div>
          )}
        </div>

        {/* Body Content */}
        <article className="prose prose-navy max-w-none text-body-lg text-navy-800 whitespace-pre-wrap leading-relaxed">
          {project.content}
        </article>

        {/* Call to action */}
        <div className="pt-12 border-t border-navy-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h4 className="text-lg font-bold text-navy-950">Ready to build your next brand chapter?</h4>
            <p className="text-sm text-navy-600 mt-1">Let's craft your unfair strategic advantage together.</p>
          </div>
          <Link href="/contact">
            <Button variant="primary" data-interactive className="w-full sm:w-auto cursor-pointer">
              Book a Call
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}
