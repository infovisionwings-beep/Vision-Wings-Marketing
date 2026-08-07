import { getProjectBySlug } from "@/app/actions/projects";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { ArrowLeft, Calendar, Tag, Layers } from "lucide-react";
import Button from "@/components/ui/Button";
import { cache } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { toHtml } from "@/lib/content/richText";

export const dynamic = "force-dynamic";

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

// Wrapped in React's cache() so generateMetadata and the page component
// share one resolution per request instead of fetching the project twice.
const resolveProject = cache(async (slug: string): Promise<CaseStudy | null> => {
  try {
    const dbProject = await getProjectBySlug(slug);
    if (dbProject) {
      return {
        title: dbProject.title,
        category: dbProject.category,
        year: dbProject.year,
        coverImage: dbProject.coverImage || "",
        content: dbProject.content || ""
      };
    }
    return fallbackContentMap[slug] || null;
  } catch (err) {
    console.error("Failed to load project details:", err);
    return null;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolveProject(slug);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.content.slice(0, 160),
    path: `/work/${slug}`,
    image: project.coverImage || undefined,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await resolveProject(slug);

  if (!project) {
    return notFound();
  }

  // The field is labelled "Markdown / HTML", but the only non-HTML handling
  // here was wrapping blank-line-separated blocks in <p>. Headings, bold, lists,
  // links and tables all reached the page as literal asterisks and hashes.
  const rawHtml = toHtml(project.content);

  return (
    <div className="min-h-screen bg-warm-50 pt-32 pb-24 px-5 md:px-10 xl:px-20">
      <style dangerouslySetInnerHTML={{ __html: `
        .project-prose img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.15);
        }
        .project-prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        .project-prose video {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
        }
        /* Markdown emits headings, lists, quotes, code and tables, and
           Tailwind's preflight resets all of them to unstyled body text — so
           without these a Markdown overview rendered as one flat grey wall. */
        .project-prose h1, .project-prose h2, .project-prose h3, .project-prose h4 {
          font-family: var(--font-display), serif;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.25;
          margin: 2.5rem 0 1rem;
        }
        .project-prose h1 { font-size: 2rem; }
        .project-prose h2 { font-size: 1.6rem; }
        .project-prose h3 { font-size: 1.3rem; }
        .project-prose h4 { font-size: 1.1rem; }
        .project-prose ul, .project-prose ol {
          margin: 0 0 1.5rem 1.5rem;
          padding-left: 0.5rem;
          line-height: 1.8;
        }
        .project-prose ul { list-style: disc; }
        .project-prose ol { list-style: decimal; }
        .project-prose li { margin-bottom: 0.5rem; }
        .project-prose a {
          color: #8A5A2B;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .project-prose a:hover { color: #0F172A; }
        .project-prose strong { font-weight: 700; color: #0F172A; }
        .project-prose em { font-style: italic; }
        .project-prose blockquote {
          border-left: 3px solid #B87333;
          padding-left: 1.25rem;
          margin: 2rem 0;
          font-style: italic;
          color: #475569;
        }
        .project-prose code {
          font-family: var(--font-mono), monospace;
          font-size: 0.875em;
          background-color: #F1F5F9;
          border: 1px solid #E2E8F0;
          border-radius: 0.375rem;
          padding: 0.125rem 0.375rem;
        }
        .project-prose pre {
          background-color: #0F172A;
          color: #F8FAFC;
          border-radius: 0.75rem;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        .project-prose pre code {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
        }
        .project-prose hr {
          border: 0;
          border-top: 1px solid #CBD5E1;
          margin: 2.5rem 0;
        }
        /* Tables scroll rather than forcing the page sideways on a phone. */
        .project-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.95rem;
          display: block;
          overflow-x: auto;
        }
        .project-prose th, .project-prose td {
          border: 1px solid #CBD5E1;
          padding: 0.625rem 0.875rem;
          text-align: left;
        }
        .project-prose th {
          background-color: #F1F5F9;
          font-weight: 700;
          color: #0F172A;
        }
      `}} />
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Back Link */}
        <Link href="/work" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-bronze-500 transition-colors min-h-[44px]" data-interactive>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Work</span>
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
        <article 
          className="project-prose prose prose-navy max-w-none text-body-lg text-navy-800 leading-relaxed font-sans"
          dangerouslySetInnerHTML={{ __html: rawHtml }}
        />

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
    </div>
  );
}
