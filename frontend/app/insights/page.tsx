import { getInsights } from "@/app/actions/insights";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight, Plus, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Marketing Insights & Perspectives",
  description: "Senior strategic viewpoints on brand acceleration, growth marketing, performance advertising, and digital conversion.",
  path: "/insights",
});

export const dynamic = "force-dynamic";

const fallbackEssays = [
  {
    id: "feat-1",
    title: "Giving Wings to Your Brand: The New Rules of Performance Marketing",
    category: "Growth Strategy & Ads",
    date: "Oct 12, 2024",
    slug: "brand-architecture",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
    readTime: "6 min read",
    excerpt: "Why traditional ad funnels are failing in an AI-saturated era, and how to build omnichannel marketing campaigns that scale customer acquisition.",
    author: "Amélie Laurent",
    authorRole: "Partner, Growth Strategy",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "feat-2",
    title: "Real talk in a corporate world: Why traditional B2B positioning is dead",
    category: "Market Positioning",
    date: "Sep 28, 2024",
    slug: "market-positioning",
    coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
    excerpt: "Stop selling feature checklists to procurement teams. How to re-anchor executive buyers around business transformation and value.",
    author: "Oliva Nacelle",
    authorRole: "Content & SEO Director",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "feat-3",
    title: "Conversion Rate Engineering: Turning Website Traffic into Predictable Revenue",
    category: "CRO & Funnels",
    date: "Sep 15, 2024",
    slug: "conversion-design",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    readTime: "7 min read",
    excerpt: "The proven frameworks we use to optimize user experience, eliminate friction, and multiply conversion rates without sacrificing brand prestige.",
    author: "Mia di Silva",
    authorRole: "Creative & Performance Lead",
    authorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "feat-4",
    title: "The Psychology of Category Dominance: How Ambitious Brands Win",
    category: "Brand Acceleration",
    date: "Aug 30, 2024",
    slug: "spatial-soul-real-estate",
    coverImage: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
    excerpt: "Why competing on features is a race to the bottom, and how to build brand authority that commands market leadership and outsized pricing.",
    author: "Amélie Laurent",
    authorRole: "Partner, Growth Strategy",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  }
];

export default async function EssaysLandingPage() {
  let list = fallbackEssays;
  try {
    const dbInsights = await getInsights();
    if (dbInsights && dbInsights.length > 0) {
      list = dbInsights.map((item: any, idx: number) => ({
        id: item.id || `db-${idx}`,
        title: item.title || fallbackEssays[idx]?.title || "Strategic Perspective",
        category: item.category || fallbackEssays[idx]?.category || "Growth Strategy & Ads",
        slug: item.slug || item.id || `essay-${idx}`,
        date: item.publishedAt 
          ? format(new Date(item.publishedAt), "MMM d, yyyy") 
          : (item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : format(new Date(), "MMM d, yyyy")),
        coverImage: item.coverImage || fallbackEssays[idx % fallbackEssays.length].coverImage,
        readTime: `${Math.max(3, Math.ceil((item.content?.length || 1500) / 500))} min read`,
        excerpt: item.excerpt || fallbackEssays[idx % fallbackEssays.length].excerpt,
        author: item.authorName || fallbackEssays[idx % fallbackEssays.length].author,
        authorRole: item.authorRole || fallbackEssays[idx % fallbackEssays.length].authorRole,
        authorAvatar: item.authorAvatar || fallbackEssays[idx % fallbackEssays.length].authorAvatar,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch essays list:", err);
  }

  // Ensure we have at least 3 items for our Asymmetric Bento Hero
  while (list.length < 3) {
    list.push(fallbackEssays[list.length % fallbackEssays.length]);
  }

  const [heroEssay, secondEssay, thirdEssay, ...remainingEssays] = list;

  return (
    <div className="min-h-screen bg-warm-50 pt-32 pb-28 px-5 md:px-10 xl:px-20 text-navy-950 overflow-hidden">
      <div className="max-w-[1280px] mx-auto space-y-16 lg:space-y-24">
        
        {/* Editorial Title Banner - Exact to Reference 2: "Best of the week" / "Thinking & Perspectives" with italic emphasis */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-navy-200 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-navy-950 text-warm-50 text-xs font-mono font-bold uppercase tracking-wider">
                Agency Monograph
              </span>
              <span className="text-xs font-mono text-navy-500 uppercase tracking-wider">
                Volume IV · 2025
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold font-display tracking-tight text-navy-950 leading-[0.95]">
              Thinking &amp; <span className="italic font-serif font-normal text-navy-900">Perspectives.</span>
            </h1>
          </div>

          <Link href="#archive" className="group inline-flex items-center gap-2 text-sm font-bold font-display text-navy-900 hover:text-bronze-600 transition-colors pb-2" data-interactive>
            <span>See all essays</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Bento Hero Grid - Inspired by Reference 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Hero Card (Spans 8 columns on large screens) */}
          <div className="lg:col-span-8 flex flex-col">
            <Link 
              href={`/insights/${heroEssay.slug}`}
              className="group block relative w-full h-full min-h-[460px] md:min-h-[560px] rounded-[32px] overflow-hidden bg-navy-900 border border-navy-200/60 shadow-xl"
              data-interactive
            >
              <img 
                src={heroEssay.coverImage} 
                alt={heroEssay.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

              {/* Top Floating Pills */}
              <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center gap-2.5 z-10 pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-navy-950 font-mono text-xs font-bold shadow-md backdrop-blur-md">
                  {heroEssay.date}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-navy-950/80 text-warm-50 font-mono text-xs font-semibold backdrop-blur-md border border-warm-50/20">
                  · {heroEssay.category}
                </span>
              </div>

              {/* Center/Bottom White Pill Title Box Overlay (Signature element from Reference 2) */}
              <div className="absolute bottom-10 left-6 right-20 sm:left-10 sm:right-28 z-10">
                <div className="inline-block bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-navy-100 max-w-xl group-hover:bg-white transition-colors duration-300 transform group-hover:-translate-y-1">
                  <span className="text-xs font-mono font-bold text-bronze-600 uppercase tracking-widest block mb-2">
                    Featured Monograph
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-navy-950 leading-tight tracking-tight">
                    {heroEssay.title}
                  </h2>
                  <p className="text-body-sm text-navy-600 mt-3 line-clamp-2 leading-relaxed font-normal">
                    {heroEssay.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-navy-100">
                    <img src={heroEssay.authorAvatar} alt={heroEssay.author} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-bold text-navy-900">{heroEssay.author}</span>
                    <span className="text-xs font-mono text-navy-400">· {heroEssay.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Right Circular Arrow Button */}
              <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-navy-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-navy-950 group-hover:text-warm-50 transition-all duration-300">
                <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </Link>
          </div>

          {/* Right Stacked Cards (Spans 4 columns) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 flex-col justify-between">
            
            {/* Top Right Card: Sage/Tinted Editorial Announcement Box */}
            <Link 
              href={`/insights/${secondEssay.slug}`}
              className="group block relative rounded-[32px] bg-[#E2E8F0] hover:bg-[#CBD5E1] text-navy-950 p-8 flex flex-col justify-between transition-colors duration-300 min-h-[260px] border border-navy-200 shadow-lg overflow-hidden"
              data-interactive
            >
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-navy-950/10 text-navy-900 font-mono text-[11px] font-bold uppercase tracking-wider">
                  • DISPATCH
                </span>
                <div className="w-9 h-9 rounded-full bg-white text-navy-950 flex items-center justify-center shadow-sm group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <span className="text-xs font-mono text-navy-600 font-semibold">{secondEssay.category}</span>
                <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-navy-950 leading-snug">
                  {secondEssay.title}
                </h3>
              </div>

              <div className="pt-6 mt-4 border-t border-navy-300/40 flex items-center justify-between text-xs font-bold text-navy-900 group-hover:text-bronze-600 transition-colors">
                <span>Read monograph</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Bottom Right Card: Vertical Photo Showcase */}
            <Link 
              href={`/insights/${thirdEssay.slug}`}
              className="group block relative rounded-[32px] overflow-hidden bg-navy-900 min-h-[260px] shadow-lg border border-navy-200/60"
              data-interactive
            >
              <img 
                src={thirdEssay.coverImage} 
                alt={thirdEssay.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

              <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                <span className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-warm-50 text-xs font-mono font-bold backdrop-blur-sm">
                  03
                </span>
                <span className="px-2.5 py-1 rounded bg-navy-950/80 text-warm-50 text-[10px] font-mono font-bold backdrop-blur-md">
                  {thirdEssay.readTime}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-3 text-warm-50">
                <span className="text-xs font-mono text-bronze-400 font-bold uppercase tracking-wider block">
                  {thirdEssay.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display tracking-tight leading-snug group-hover:text-bronze-300 transition-colors">
                  {thirdEssay.title}
                </h3>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-navy-950 text-xs font-bold group-hover:bg-bronze-500 group-hover:text-warm-50 transition-colors shadow-md">
                    <span>See perspective</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>

          </div>

        </div>

        {/* Remaining Archive Grid (Section 2) */}
        <div id="archive" className="pt-12 border-t border-navy-200 space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-mono font-bold text-bronze-600 uppercase tracking-widest block mb-2">
                COMPLETE INDEX
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-navy-950 tracking-tight">
                Published Essays &amp; Monographs.
              </h2>
            </div>
            <span className="text-sm font-mono text-navy-500 hidden sm:block">
              Showing {list.length} perspectives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((item, idx) => (
              <Link 
                key={item.id || idx}
                href={`/insights/${item.slug}`}
                className="group flex flex-col justify-between bg-white border border-navy-200/70 hover:border-bronze-500/50 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all duration-300 p-8 rounded-2xl"
                data-interactive
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono text-navy-500">
                    <span className="px-2.5 py-1 rounded bg-warm-100 text-navy-900 font-bold">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-navy-950 group-hover:text-bronze-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-body-sm text-navy-600 line-clamp-3 leading-relaxed font-normal">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-navy-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={item.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt={item.author || "Author"} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-xs font-semibold text-navy-900">{item.author || "Amélie Laurent"}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-warm-100 group-hover:bg-navy-950 group-hover:text-warm-50 flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
