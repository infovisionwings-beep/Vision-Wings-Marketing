import { getProjects } from "@/app/actions/projects";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Link } from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Marketing Campaigns & Work",
  description: "A curation of high-velocity marketing campaigns, conversion funnels, and brand acceleration that drive outsized growth.",
};

const curatedSupplementalPhotos = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1517976487452-572718781df9?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1100&q=85",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=85"
];

const fallbackProjects = [
  {
    id: 1,
    title: "Lumina Health Rebranding & Funnel",
    category: "Brand Growth & Performance Ads",
    year: "2024",
    slug: "lumina",
    coverImage: curatedSupplementalPhotos[0]
  },
  {
    id: 2,
    title: "Aero Dynamics Viral Launch Campaign",
    category: "Video Production & Growth",
    year: "2023",
    slug: "aero",
    coverImage: curatedSupplementalPhotos[1]
  },
  {
    id: 3,
    title: "Vertex Capital Authority SEO & Content",
    category: "Content Marketing & SEO",
    year: "2024",
    slug: "vertex",
    coverImage: curatedSupplementalPhotos[2]
  }
];

export default async function WorkPage() {
  let projects: any[] = fallbackProjects;
  try {
    const dbProjects = await getProjects();
    if (dbProjects && dbProjects.length > 0) {
      projects = dbProjects.map((p: any, idx: number) => ({
        ...p,
        coverImage: p.coverImage || curatedSupplementalPhotos[idx % curatedSupplementalPhotos.length]
      }));
    }
  } catch (err) {
    console.error("Failed to load projects for Work list page:", err);
  }

  return (
    <main className="min-h-screen bg-warm-50 pt-32 pb-24 px-5 md:px-10 xl:px-20 text-navy-950">
      <div className="max-w-[1440px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-6 border-b border-navy-200/80 pb-10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono font-bold text-navy-950">004</span>
            <span className="h-4 w-px bg-navy-300" />
            <span className="text-xs font-mono font-semibold text-bronze-600 uppercase tracking-widest">MARKETING CAMPAIGNS</span>
          </div>
          <h1 className="text-display sm:text-h1 font-bold text-navy-950 tracking-tight leading-[1.05]">Campaigns that soar.</h1>
          <p className="text-body-lg text-navy-700 leading-relaxed">
            We give wings to your vision. Explore how we combine data-driven marketing strategy, viral creative campaigns, and high-converting funnels through our exhibition archive.
          </p>
        </div>

        {/* Pinterest Masonry Brick Grid: 2 Columns on Mobile, Natural Aspect Ratios */}
        <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div key={project.id || index} className="break-inside-avoid mb-3 sm:mb-6 md:mb-8 block group space-y-2 sm:space-y-4">
              <Link href={`/work/${project.slug}`} className="block overflow-hidden rounded-xl sm:rounded-2xl border border-navy-200/60 shadow-sm bg-navy-900 relative outline-none focus-visible:ring-2 focus-visible:ring-bronze-500" data-interactive>
                {project.coverImage ? (
                  <img 
                    src={project.coverImage} 
                    alt={project.title} 
                    className="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-navy-950 flex items-center justify-center">
                    <span className="text-display opacity-10 text-warm-50 select-none tracking-tighter">VW</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>

              <div className="space-y-1 sm:space-y-2 px-1">
                <div className="flex justify-between items-center text-[9px] sm:text-xs text-navy-500 font-mono">
                  <span className="uppercase tracking-wider font-semibold text-bronze-700 truncate max-w-[75%]">{project.category}</span>
                  <span className="flex-shrink-0">{project.year}</span>
                </div>
                <Link href={`/work/${project.slug}`} className="block group-hover:text-bronze-600 transition-colors" data-interactive>
                  <h3 className="text-xs sm:text-lg md:text-h3 font-bold text-navy-950 tracking-tight leading-snug line-clamp-2 sm:line-clamp-none">{project.title}</h3>
                </Link>
                <Link href={`/work/${project.slug}`} className="inline-flex items-center gap-1 sm:gap-2 text-navy-900 font-semibold text-[10px] sm:text-xs uppercase tracking-wider hover:text-bronze-600 transition-colors pt-0.5 sm:pt-1 min-h-[28px] sm:min-h-[36px]" data-interactive>
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
