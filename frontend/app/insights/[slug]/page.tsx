import { getInsightBySlug } from "@/app/actions/insights";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import Button from "@/components/ui/Button";
import { ArrowLeft, ArrowUpRight, Calendar, BookOpen, CheckCircle2, Star, User, Users } from "lucide-react";
import EssayActions from "@/components/essay/EssayActions";
import { isEssaySaved } from "@/app/actions/savedEssays";
import { format } from "date-fns";
import { cache } from "react";
import type { Metadata } from "next";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { localInsightBySlug } from "@/lib/content/localInsights";

export const dynamic = "force-dynamic";

// https://developers.google.com/search/docs/appearance/preferred-sources —
// the tool takes a bare host, so strip the scheme off the canonical site URL.
const PREFERRED_SOURCE_URL = `https://google.com/preferences/source?q=${SITE_URL.replace(/^https?:\/\//, "")}`;

interface Article {
  /** The database row this came from. Absent for the hardcoded fallback
   *  essays below, which have nothing for a bookmark to point at. */
  id?: number;
  title: string;
  category: string;
  date: string;
  content: string;
  coverImage?: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  contributors?: { name: string; role: string; avatar: string }[] | null;
  readTime: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const fallbackContentMap: Record<string, Article> = {
  "brand-architecture": {
    title: "The New Rules of Brand Architecture in an AI Era",
    category: "Strategy & Architecture",
    date: "Oct 12, 2024",
    readTime: "6 min read",
    author: "Amélie Laurent",
    authorRole: "Partner, Growth Strategy",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
    content: `<p>Many organizations build brand architecture organically as they launch new products or divisions. In an AI-saturated ecosystem where generative content is produced at zero marginal cost, traditional house-of-brands models are collapsing under the weight of visual and verbal noise.</p>
<p>When every competitor can generate synthetic marketing copy and brand assets in seconds, customer attention defaults to monolithic brand equity. A customer must grasp the structural connection between your offerings in less than three seconds. Unified naming conventions, consistent typographic layouts, and common visual design systems build institutional authority and price elasticity.</p>

<h2 id="strategic-framework">1. Focus on Architectural Clarity</h2>
<p>We consistently observe that high-growth enterprises who streamline their sibling sub-brands under a single, unmistakable visual identity see up to 40% higher organic conversion rates. This is not merely an aesthetic preference; it is a fundamental reduction in cognitive friction for executive buyers.</p>
<p>When you force a prospective buyer to decipher the relationship between three differently-branded software suites owned by the same parent company, you introduce doubt. Doubt is the enemy of enterprise sales velocity.</p>

<h2 id="cameras-and-tools">2. Asymmetry as a Strategic Feature</h2>
<p>Do not stretch a secondary product's branding to match your primary flagship icon. Allow your core hero offering to carry the visual and reputational weight, while sibling systems occupy clear, subordinate supporting columns.</p>
<p>In digital design craft, this translates to asymmetric grid layouts where primary value propositions dominate the viewport, and technical specifications sit in calm, structured sidebars that reward deliberate exploration.</p>

<h2 id="advice-for-founders">3. Advice for Scaling Founders</h2>
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
<h2 id="psychology-spacing">1. The Psychology of Clean Spacing</h2>
<p>When an executive evaluates a six-figure consulting engagement or enterprise marketing campaign, their subconscious sensitivity to layout clutter is heightened. Every unnecessary border, conflicting accent color, and generic stock photo signals lower institutional competence.</p>
<h2 id="restrained-palettes">2. Restrained Color Palettes</h2>
<p>By restricting warm bronze accents strictly to high-intent interactive triggers (such as primary buttons and active tab indicators), the eye is naturally drawn to the call to action without feeling coerced. This is the synthesis of art gallery elegance and cockpit data efficiency.</p>`
  }
};

/**
 * Parses HTML content, extracts h2/h3 headings, injects slugified IDs if missing,
 * and returns the updated HTML along with a structured Table of Contents array.
 */
function extractHeadingsAndInjectIds(html: string): { htmlWithIds: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const htmlWithIds = html.replace(/<(h[23])([^>]*)>(.*?)<\/h[23]>/gi, (match, tag, attrs, content) => {
    const plainText = content
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&#160;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&mdash;/gi, "—")
      .replace(/&ndash;/gi, "–")
      .replace(/&#(\d+);/g, (_: string, dec: string) => String.fromCharCode(Number(dec)))
      .replace(/&#x([0-9a-f]+);/gi, (_: string, hex: string) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\s+/g, " ")
      .trim();

    if (!plainText) return match;

    let id = "";
    const idMatch = attrs.match(/id="([^"]+)"/i) || attrs.match(/id='([^']+)'/i);
    if (idMatch && idMatch[1]) {
      id = idMatch[1];
    } else {
      id = plainText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      attrs = `${attrs} id="${id}"`;
    }

    const level = tag.toLowerCase() === "h2" ? 2 : 3;
    toc.push({ id, text: plainText, level });
    return `<${tag}${attrs}>${content}</${tag}>`;
  });

  return { htmlWithIds, toc };
}

// Wrapped in React's cache() so generateMetadata and the page component
// share one resolution per request instead of fetching the insight twice.
const resolveArticle = cache(async (slug: string): Promise<Article | null> => {
  try {
    const dbInsight = await getInsightBySlug(slug);
    if (dbInsight) {
      return {
        id: dbInsight.id,
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
        contributors: (dbInsight as any).contributors || null,
        readTime: `${Math.max(3, Math.ceil((dbInsight.content?.length || 1500) / 500))} min read`
      };
    }
    if (fallbackContentMap[slug]) {
      return fallbackContentMap[slug];
    }
    // Articles authored as HTML files at the repo root, used until they are
    // seeded into the database.
    const local = localInsightBySlug[slug];
    if (local) {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const filePath = path.resolve(process.cwd(), "..", local.file);
        if (fs.existsSync(filePath)) {
          const { file, slug: _slug, excerpt, publishedAt, ...meta } = local;
          return { ...meta, content: fs.readFileSync(filePath, "utf-8") };
        }
      } catch (e) {
        console.error(`Failed to read local insight ${slug}:`, e);
      }
    }
    return {
      ...fallbackContentMap["brand-architecture"],
      title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    };
  } catch (err) {
    console.error("Failed to load insight details:", err);
    return null;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await resolveArticle(slug);
  if (!article) return {};

  const plainExcerpt = article.content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return pageMetadata({
    title: article.title,
    description: plainExcerpt,
    path: `/insights/${slug}`,
    image: article.coverImage || undefined,
    type: "article",
  });
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await resolveArticle(slug);

  if (!article) {
    return notFound();
  }

  // Resolved on the server so the bookmark renders in its true state on first
  // paint rather than flipping under the reader a moment later.
  const savedAlready = article.id ? await isEssaySaved(article.id) : false;

  // Format content: normalize non-breaking spaces so words wrap naturally without breaking midway
  let rawHtml = (article.content || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ");
  if (!rawHtml.trim().startsWith("<")) {
    rawHtml = rawHtml
      .split("\n\n")
      .map(p => `<p>${p.trim()}</p>`)
      .join("");
  }

  // Extract headings and inject IDs for automatic Table of Contents linking
  const { htmlWithIds, toc } = extractHeadingsAndInjectIds(rawHtml);

  // Article-level structured data. The site only described the business itself
  // (ProfessionalService on the root layout), so no individual article was
  // eligible for an article rich result. Every value here is taken from the
  // article that is actually rendered below — none of it is asserted blind.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200),
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: new Date(article.date).toISOString(),
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "Vision Wings Marketing",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-svg/Primary%20ICON.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/insights/${slug}`,
    },
    articleSection: article.category,
  };

  return (
    <div className="min-h-screen bg-warm-50 pt-32 pb-28 px-5 md:px-10 xl:px-20 text-navy-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      
      {/* Editorial Drop Cap Styling & Typography Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .editorial-prose {
          max-width: 100%;
          word-break: normal;
          overflow-wrap: break-word;
        }
        .editorial-prose * {
          max-width: 100%;
          word-break: normal;
          overflow-wrap: break-word;
        }
        .editorial-prose > p:first-of-type::first-letter {
          float: left;
          font-size: 4.5rem;
          line-height: 0.82;
          font-family: var(--font-display), serif;
          font-weight: 800;
          margin-right: 0.75rem;
          margin-bottom: 0.1rem;
          color: #0F172A;
        }
        .editorial-prose p, .editorial-prose li {
          margin-bottom: 1.75rem;
          line-height: 1.8;
          font-size: 1.125rem;
          color: #1E293B;
          max-width: 70ch; /* Enforces approximately 65-75 characters per line for optimal reading ergonomics */
        }
        .editorial-prose h2 {
          font-family: var(--font-display), serif;
          font-size: 1.875rem;
          font-weight: 800;
          color: #0F172A;
          margin-top: 3.25rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
          scroll-margin-top: 6rem;
          max-width: 70ch;
        }
        @media (min-width: 640px) {
          .editorial-prose h2 { font-size: 2rem; }
        }
        .editorial-prose h3 {
          font-family: var(--font-display), serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #1E293B;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          scroll-margin-top: 6rem;
          max-width: 70ch;
        }
        @media (min-width: 640px) {
          .editorial-prose h3 { font-size: 1.5rem; }
        }
        .editorial-prose blockquote {
          border-left: 4px solid #B87333;
          padding-left: 1.25rem;
          font-style: italic;
          color: #0F172A;
          font-size: 1.25rem;
          margin: 2.5rem 0;
          max-width: 70ch;
        }
        @media (min-width: 640px) {
          .editorial-prose blockquote {
            padding-left: 1.5rem;
            font-size: 1.35rem;
          }
        }
        .editorial-prose pre {
          max-width: 100%;
          overflow-x: auto;
          background-color: #0F172A;
          color: #F8FAFC;
          padding: 1.25rem;
          border-radius: 1rem;
          margin: 2rem 0;
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
        }
        .editorial-prose table {
          width: 100%;
          margin: 2.5rem 0;
          border-collapse: collapse;
          font-size: 0.95rem;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid #CBD5E1;
          background-color: #FFFFFF;
          box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.06);
          display: table;
        }
        .editorial-prose thead {
          background-color: #0F172A;
        }
        .editorial-prose th {
          background-color: #0F172A;
          color: #F8FAFC;
          font-family: var(--font-display), sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.8rem;
          padding: 1rem 1.25rem;
          text-align: left;
          border-bottom: 2px solid #334155;
        }
        .editorial-prose td {
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid #E2E8F0;
          color: #1E293B;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .editorial-prose tr:nth-child(even) {
          background-color: #F8FAFC;
        }
        .editorial-prose tr:hover {
          background-color: #F1F5F9;
        }
        .editorial-prose caption {
          caption-side: bottom;
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: #64748B;
          font-style: italic;
        }
        .editorial-prose svg {
          max-width: 100%;
          height: auto;
          margin: 2rem auto;
          display: block;
        }
        .editorial-prose iframe, .editorial-prose embed, .editorial-prose object {
          width: 100%;
          min-height: 420px;
          border-radius: 1rem;
          border: 1px solid #CBD5E1;
          margin: 2.5rem 0;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1);
          background-color: #FFFFFF;
        }
        .editorial-prose figure {
          margin: 2.5rem 0;
          width: 100%;
        }
        .editorial-prose figcaption {
          margin-top: 0.75rem;
          text-align: center;
          font-size: 0.85rem;
          color: #64748B;
          font-style: italic;
          font-family: var(--font-mono), monospace;
        }
        .editorial-prose canvas {
          max-width: 100%;
          margin: 2rem auto;
          display: block;
        }
        .editorial-prose img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
        }
      `}} />

      <div className="max-w-[1280px] mx-auto space-y-12">
        
        {/* Top Back Link */}
        <Link href="/insights" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-navy-600 hover:text-bronze-600 transition-colors py-2" data-interactive>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Thinking &amp; Perspectives</span>
        </Link>

        {/* 2-Column Asymmetric Reading Grid */}
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

            {/* Feature Photo with Hover-Only Desktop Overlay & Removed Overlap on Mobile */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-navy-900 border border-navy-200/80 shadow-xl group/hero">
              <img 
                src={article.coverImage || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"} 
                alt={article.title}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover/hero:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent opacity-60 group-hover/hero:opacity-90 transition-opacity duration-300" />

              {/* Desktop Hover Hint Pill (Hidden on Mobile, fades out on desktop hover) */}
              <div className="hidden md:flex items-center gap-2.5 absolute bottom-5 left-5 z-10 px-4 py-2 rounded-full bg-navy-950/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-lg group-hover/hero:opacity-0 transition-opacity duration-300 pointer-events-none">
                <User className="w-3.5 h-3.5 text-bronze-400" />
                <span>Hover image to view Editorial Board &amp; Contributors</span>
              </div>

              {/* Desktop Hover-Only Vertically Aligned Contributor Stack (HIDDEN ON MOBILE to remove overlap) */}
              <div className="hidden md:flex flex-col gap-2.5 absolute bottom-6 left-6 z-20 bg-navy-950/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl max-w-xs opacity-0 translate-y-4 pointer-events-none group-hover/hero:opacity-100 group-hover/hero:translate-y-0 group-hover/hero:pointer-events-auto transition-all duration-300 ease-out">
                <div className="text-[10px] font-mono font-bold text-bronze-400 uppercase tracking-widest px-1 flex items-center justify-between">
                  <span>Editorial Board</span>
                  <span className="text-[9px] text-white/50">(Hover Active)</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 group cursor-default">
                    <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full object-cover border-2 border-bronze-500 shadow-md group-hover:scale-105 transition-transform flex-shrink-0" />
                    <div className="text-left overflow-hidden">
                      <div className="text-xs font-bold text-white truncate font-display">{article.author}</div>
                      <div className="text-[10px] font-mono text-bronze-300 truncate">{article.authorRole} (Lead)</div>
                    </div>
                  </div>
                  {(article.contributors && article.contributors.length > 0 ? article.contributors : [
                    { name: "Oliva Nacelle", role: "Strategy+Curiosity", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
                    { name: "Mia di Silva", role: "Art Direction", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" }
                  ]).map((c, idx) => (
                    <div key={idx} className="flex items-center gap-3 group cursor-default">
                      <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-white/40 shadow-md group-hover:scale-105 transition-transform flex-shrink-0" />
                      <div className="text-left overflow-hidden">
                        <div className="text-xs font-semibold text-warm-100 truncate">{c.name}</div>
                        <div className="text-[10px] font-mono text-navy-300 truncate">{c.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Table of Contents (Visible only on screens below lg, positioned right after header & feature image) */}
            {toc && toc.length > 0 && (
              <div className="lg:hidden my-6 p-5 sm:p-6 rounded-2xl bg-white border border-navy-200 shadow-sm space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-navy-400 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-navy-950 font-display">
                    <BookOpen className="w-4 h-4 text-bronze-600" />
                    <span>Table of Contents</span>
                  </span>
                  <span className="text-[10px] bg-bronze-50 text-bronze-700 px-2 py-0.5 rounded-full font-bold border border-bronze-200">
                    {toc.length} sections
                  </span>
                </h4>
                <nav className="flex flex-col space-y-2 text-sm font-medium text-navy-800 pt-2 border-t border-navy-100">
                  <a href="#" className="hover:text-bronze-600 transition-colors font-bold text-navy-950 py-0.5 flex items-center gap-1.5">
                    <span className="text-bronze-500 font-mono text-xs">↑</span>
                    <span>Introduction / Overview</span>
                  </a>
                  {toc.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={`#${item.id}`} 
                      className={`hover:text-bronze-600 transition-colors leading-snug block py-1 border-l-2 border-transparent hover:border-bronze-500 hover:pl-2 ${
                        item.level === 3 ? "pl-4 text-xs text-navy-600" : "font-semibold text-navy-900"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Rich Text Editorial Body with Automatically Injected Heading IDs */}
            <article 
              className="editorial-prose max-w-none pt-2 font-normal w-full min-w-0"
              dangerouslySetInnerHTML={{ __html: htmlWithIds }}
            />

            {/* Signature Serif Italic Pull Quote */}
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

            {/* Google Preferred Sources opt-in. Google only accepts a domain or
                subdomain here, so every article points at the same site-level
                link rather than its own URL. */}
            <a
              href={PREFERRED_SOURCE_URL}
              target="_blank"
              rel="noopener"
              className="group flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-navy-200 hover:border-bronze-500/60 shadow-sm transition-colors"
              data-interactive
            >
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-bronze-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold font-display text-navy-950">
                    Follow Vision Wings on Google
                  </h4>
                  <p className="text-xs text-navy-500 leading-relaxed mt-1 font-normal">
                    Add us as a preferred source to see our work more often in Top Stories and AI Overviews.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 group-hover:text-bronze-600 transition-colors whitespace-nowrap">
                <span>Add as preferred source</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>

            {/* Share & Bookmark Footer Strip */}
            <div className="pt-8 border-t border-navy-200 flex flex-wrap items-center justify-between gap-4 text-sm text-navy-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-bronze-600" />
                <span className="font-mono text-xs">Verified by Vision Wings Editorial Board</span>
              </div>
              <EssayActions
                insightId={article.id}
                title={article.title}
                initiallySaved={savedAlready}
              />
            </div>

          </div>

          {/* Right Sidebar (Right Column, 4 Columns) - REMOVED STICKY SCROLLING TO PREVENT READING CLUTTER */}
          <aside className="lg:col-span-4 space-y-10 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-navy-200/80 pt-10 lg:pt-0">
            
            {/* Desktop Table of Contents (Hidden on mobile since it's displayed above the article body) */}
            <div className="hidden lg:block space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-navy-400 flex items-center justify-between">
                <span>Table of contents</span>
                <span className="text-[10px] text-bronze-600 font-bold">({toc.length} sections)</span>
              </h4>
              <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-navy-800">
                <a href="#" className="hover:text-bronze-600 transition-colors font-bold text-navy-950">↑ Introduction / Overview</a>
                {toc.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={`#${item.id}`} 
                    className={`hover:text-bronze-600 transition-colors leading-snug block py-0.5 ${
                      item.level === 3 ? "pl-4 text-xs font-normal text-navy-600" : ""
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
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
                {(article.contributors && article.contributors.length > 0 ? article.contributors : [
                  { name: "Oliva Nacelle", role: "Content, Strategy+Curiosity", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" },
                  { name: "Mia di Silva", role: "Art Direction, Design Engineering", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" }
                ]).map((c, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-navy-200 shadow-sm" />
                    <div>
                      <h6 className="text-sm font-bold text-navy-900 font-display">{c.name}</h6>
                      <span className="text-xs font-mono text-navy-500">{c.role}</span>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
