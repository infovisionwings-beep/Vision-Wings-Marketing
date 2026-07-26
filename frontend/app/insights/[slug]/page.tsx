import { getInsightBySlug } from "@/app/actions/insights";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import Button from "@/components/ui/Button";
import { ArrowLeft, Calendar, BookOpen, Share2, Bookmark, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface Article {
  title: string;
  category: string;
  date: string;
  content: string;
  coverImage?: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  readTime: string;
}

const fallbackContentMap: Record<string, Article> = {
  "brand-architecture": {
    title: "The New Rules of Brand Architecture in an AI Era",
    category: "Strategy & Architecture",
    date: "Oct 12, 2024",
    readTime: "6 min read",
    author: "Amélie Laurent",
    authorRole: "Partner, Brand Architecture",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
    content: `<p>Many organizations build brand architecture organically as they launch new products or divisions. In an AI-saturated ecosystem where generative content is produced at zero marginal cost, traditional house-of-brands models are collapsing under the weight of visual and verbal noise.</p>
<p>When every competitor can generate synthetic marketing copy and brand assets in seconds, customer attention defaults to monolithic brand equity. A customer must grasp the structural connection between your offerings in less than three seconds. Unified naming conventions, consistent typographic layouts, and common visual design systems build institutional authority and price elasticity.</p>

<h3 id="strategic-framework">1. Focus on Architectural Clarity</h3>
<p>We consistently observe that high-growth enterprises who streamline their sibling sub-brands under a single, unmistakable visual identity see up to 40% higher organic conversion rates. This is not merely an aesthetic preference; it is a fundamental reduction in cognitive friction for executive buyers.</p>
<p>When you force a prospective buyer to decipher the relationship between three differently-branded software suites owned by the same parent company, you introduce doubt. Doubt is the enemy of enterprise sales velocity.</p>

<h3 id="cameras-and-tools">2. Asymmetry as a Strategic Feature</h3>
<p>Do not stretch a secondary product's branding to match your primary flagship icon. Allow your core hero offering to carry the visual and reputational weight, while sibling systems occupy clear, subordinate supporting columns.</p>
<p>In digital design craft, this translates to asymmetric grid layouts where primary value propositions dominate the viewport, and technical specifications sit in calm, structured sidebars that reward deliberate exploration.</p>

<h3 id="advice-for-founders">3. Advice for Scaling Founders</h3>
<p>If you are scaling past $10M ARR, audit your brand architecture immediately. Strip away redundant slogans, kill orphan logos, and consolidate your narrative around your core differentiator. In a world of infinite noise, clarity is the ultimate luxury.</p>`
  },
  "conversion-design": {
    title: "Designing for Conversion Without Sacrificing Luxury Prestige",
    category: "Design Craft",
    date: "Sep 28, 2024",
    readTime: "7 min read",
    author: "Mia di Silva",
    authorRole: "Creative Director",
    authorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
    content: `<p>Many performance marketers mistakenly believe conversion design requires flashing red buttons, intrusive popups, and aggressive, countdown-driven countdown styling. At Vision Wings, we believe the exact opposite.</p>
<p>True high-conversion design is built on visual credibility, restraint, and deliberate typographic rhythm. When a page has ample spacing—48px to 96px on desktop—interactive modules read as distinct structural milestones rather than high-pressure traps.</p>
<h3 id="strategic-framework">1. The Psychology of Clean Spacing</h3>
<p>When an executive evaluates a six-figure consulting engagement or luxury real estate acquisition, their subconscious sensitivity to layout clutter is heightened. Every unnecessary border, conflicting accent color, and generic stock photo signals lower institutional competence.</p>
<h3 id="advice-for-founders">2. Restrained Color Palettes</h3>
<p>By restricting warm bronze accents strictly to high-intent interactive triggers (such as primary buttons and active tab indicators), the eye is naturally drawn to the call to action without feeling coerced. This is the synthesis of art gallery elegance and cockpit data efficiency.</p>`
  }
};

export default async function InsightDetailPage({ params }: { params: { slug: string } }) {
  let article: Article | null = null;

  try {
    const dbInsight = await getInsightBySlug(params.slug);
    if (dbInsight) {
      article = {
        title: dbInsight.title,
        category: dbInsight.category || "Strategic Perspective",
        date: dbInsight.publishedAt 
          ? format(new Date(dbInsight.publishedAt), "MMM d, yyyy") 
          : (dbInsight.createdAt ? format(new Date(dbInsight.createdAt), "MMM d, yyyy") : format(new Date(), "MMM d, yyyy")),
        content: dbInsight.content || "",
        coverImage: dbInsight.coverImage || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
        author: (dbInsight as any).authorName || "Amélie Laurent",
        authorRole: (dbInsight as any).authorRole || "Partner, Brand Architecture",
        authorAvatar: (dbInsight as any).authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        readTime: `${Math.max(3, Math.ceil((dbInsight.content?.length || 1500) / 500))} min read`
      };
    } else if (fallbackContentMap[params.slug]) {
      article = fallbackContentMap[params.slug];
    } else {
      // Generic fallback for any other slug
      article = {
        ...fallbackContentMap["brand-architecture"],
        title: params.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
      };
    }
  } catch (err) {
    console.error("Failed to load insight details:", err);
  }

  if (!article) {
    return notFound();
  }

  // Format content: ensure paragraphs have tags if it's plain text
  let formattedHtml = article.content;
  if (!formattedHtml.trim().startsWith("<")) {
    formattedHtml = formattedHtml
      .split("\n\n")
      .map(p => `<p>${p.trim()}</p>`)
      .join("");
  }

  return (
    <main className="min-h-screen bg-warm-50 pt-32 pb-28 px-5 md:px-10 xl:px-20 text-navy-950">
      
      {/* Editorial Drop Cap Styling & Typography Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .editorial-prose > p:first-of-type::first-letter {
          float: left;
          font-size: 4.8rem;
          line-height: 0.82;
          font-family: var(--font-display), serif;
          font-weight: 800;
          margin-right: 0.85rem;
          margin-bottom: 0.1rem;
          color: #0F172A;
        }
        .editorial-prose p {
          margin-bottom: 1.75rem;
          line-height: 1.8;
          font-size: 1.125rem;
          color: #1E293B;
        }
        .editorial-prose h3 {
          font-family: var(--font-display), serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #0F172A;
          margin-top: 2.75rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .editorial-prose blockquote {
          border-left: 4px solid #B87333;
          padding-left: 1.5rem;
          font-style: italic;
          color: #0F172A;
          font-size: 1.35rem;
          margin: 2.5rem 0;
        }
      `}} />

      <div className="max-w-[1280px] mx-auto space-y-12">
        
        {/* Top Back Link */}
        <Link href="/insights" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-navy-600 hover:text-bronze-600 transition-colors py-2" data-interactive>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Thinking &amp; Perspectives</span>
        </Link>

        {/* 2-Column Asymmetric Reading Grid - Exact to Reference 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Article Body (Left Column, 8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Editorial Title & Category */}
            <div className="space-y-6 border-b border-navy-200 pb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-bronze-600 uppercase tracking-widest">
                <span className="px-3 py-1 rounded bg-bronze-50 border border-bronze-200">{article.category}</span>
                <span>·</span>
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display text-navy-950 tracking-tight leading-[1.05]">
                {article.title}
              </h1>
            </div>

            {/* Feature Photo with Circular Contributor Avatar Bubbles (Inspired by Reference 1) */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-navy-900 border border-navy-200/80 shadow-xl">
              <img 
                src={article.coverImage || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"} 
                alt={article.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />

              {/* Floating Contributor Avatars (Signature feature from Reference 1) */}
              <div className="absolute top-6 left-12 w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-lg transform -rotate-6 hover:scale-110 transition-transform hidden sm:block" title="Amélie Laurent · Lead Strategy">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Contributor" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-10 right-16 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg transform rotate-12 hover:scale-110 transition-transform hidden sm:block" title="Oliva Nacelle · Research">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" alt="Contributor" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-12 left-20 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg transform rotate-6 hover:scale-110 transition-transform hidden sm:block" title="Mia di Silva · Art Direction">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="Contributor" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-8 right-28 w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg transform -rotate-12 hover:scale-110 transition-transform hidden sm:block" title="Julian Vance · Engineering">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Contributor" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Rich Text Editorial Body with Drop Cap */}
            <article 
              className="editorial-prose max-w-none pt-2 font-normal"
              dangerouslySetInnerHTML={{ __html: formattedHtml }}
            />

            {/* Signature Serif Italic Pull Quote (Exact to Reference 1) */}
            <div className="my-14 p-8 sm:p-12 rounded-3xl bg-warm-100/80 border border-navy-200/60 space-y-6">
              <p className="text-2xl sm:text-3xl font-serif italic text-navy-950 font-normal leading-snug tracking-tight">
                &ldquo;In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear.&rdquo;
              </p>
              
              <div className="flex items-center gap-3.5 pt-2">
                <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full object-cover border border-navy-200" />
                <div>
                  <h4 className="text-sm font-bold text-navy-950 font-display">{article.author}</h4>
                  <span className="text-xs font-mono text-navy-500">{article.authorRole}</span>
                </div>
              </div>
            </div>

            {/* Share & Bookmark Footer Strip */}
            <div className="pt-8 border-t border-navy-200 flex flex-wrap items-center justify-between gap-4 text-sm text-navy-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-bronze-600" />
                <span className="font-mono text-xs">Verified by Vision Wings Editorial Board</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-navy-200 hover:border-navy-400 font-semibold text-xs transition-colors" data-interactive>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Essay</span>
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-navy-200 hover:border-navy-400 font-semibold text-xs transition-colors" data-interactive>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

          </div>

          {/* Sticky Right Sidebar (Right Column, 4 Columns) - Exact to Reference 1 */}
          <aside className="lg:col-span-4 sticky top-32 space-y-10 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-navy-200/80 pt-10 lg:pt-0">
            
            {/* Table of Contents / Section Index */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-navy-400">
                Table of contents
              </h4>
              <nav className="flex flex-col space-y-3 text-sm font-semibold text-navy-800">
                <a href="#" className="hover:text-bronze-600 transition-colors">Introduction</a>
                <a href="#strategic-framework" className="hover:text-bronze-600 transition-colors">1. Architectural Clarity</a>
                <a href="#cameras-and-tools" className="hover:text-bronze-600 transition-colors">2. Asymmetry as a Feature</a>
                <a href="#advice-for-founders" className="hover:text-bronze-600 transition-colors">3. Advice for Founders</a>
                <a href="#whats-next" className="text-navy-500 hover:text-bronze-600 transition-colors">What&apos;s next?</a>
              </nav>
            </div>

            <hr className="border-navy-200/60" />

            {/* Written By */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-navy-400">
                Written by
              </h4>
              <div className="flex items-center gap-3.5">
                <img src={article.authorAvatar} alt={article.author} className="w-12 h-12 rounded-full object-cover border border-navy-200 shadow-sm" />
                <div>
                  <h5 className="text-sm font-bold font-display text-navy-950">{article.author}</h5>
                  <p className="text-xs font-mono text-navy-500">{article.authorRole}</p>
                </div>
              </div>
            </div>

            <hr className="border-navy-200/60" />

            {/* Contributors */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-navy-400">
                Contributors
              </h4>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Oliva Nacelle" className="w-10 h-10 rounded-full object-cover border border-navy-200" />
                  <div>
                    <h6 className="text-sm font-bold text-navy-900">Oliva Nacelle</h6>
                    <span className="text-xs font-mono text-navy-500">Content, Strategy+Curiosity</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" alt="Mia di Silva" className="w-10 h-10 rounded-full object-cover border border-navy-200" />
                  <div>
                    <h6 className="text-sm font-bold text-navy-900">Mia di Silva</h6>
                    <span className="text-xs font-mono text-navy-500">Art Direction, Design Engineering</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-navy-200/60" />

            {/* Subscribe Box */}
            <div className="p-6 rounded-2xl bg-white border border-navy-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold font-display text-navy-950">
                Subscribe to our newsletter
              </h4>
              <p className="text-xs text-navy-500 leading-relaxed font-normal">
                Receive senior strategic viewpoints on brand architecture and digital craft in your inbox every Tuesday.
              </p>
              <div className="space-y-2.5 pt-1">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-warm-50/50 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:border-bronze-500 focus:bg-white transition-all"
                />
                <Button className="w-full justify-center bg-navy-950 text-warm-50 hover:bg-navy-900 py-2.5 rounded-xl text-sm font-bold shadow-md">
                  Subscribe
                </Button>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}
