import { getInsightBySlug } from "@/app/actions/insights";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { ArrowLeft, Calendar, Tag, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface Article {
  title: string;
  category: string;
  date: string;
  content: string;
}

const fallbackContentMap: Record<string, Article> = {
  "brand-architecture": {
    title: "The New Rules of Brand Architecture",
    category: "Strategy",
    date: "Oct 12, 2024",
    content: `Brand architecture is the blueprint of how a company organizes its divisions, offerings, and sibling companies under a coherent brand umbrella.

Many organizations build brand architecture organically as they launch new products or divisions. Unfortunately, this creates layout clutter and user confusion.

Rule 1: Focus on Clarity
A customer should grasp the connection between your products in less than 3 seconds. Unified naming conventions, consistent typographic layouts, and common visual design systems build institutional authority.

Rule 2: Asymmetry is a Feature
Don't stretch a secondary product's branding to match your primary icon. Allow your core hero offering to carry the visual weight, while sibling systems occupy clear supporting columns.`
  },
  "conversion-design": {
    title: "Designing for Conversion Without Sacrificing Brand",
    category: "Design",
    date: "Sep 28, 2024",
    content: `Many marketers believe conversion design requires flashing red buttons, intrusive popups, and aggressive styling.

At Vision Wings, we believe the exact opposite. True high-conversion design is built on visual credibility, restraint, and deliberate typographic rhythm.

Rule 1: Clean Spacing Scales
When a page has ample spacing (48px+ on desktop), interactive modules read as distinct structural milestones. The eye naturally scans towards the call to action, removing layout noise.

Rule 2: Restrained Highlights
Bronze (#B87333) should be restricted to focal elements like buttons, active navigation, or small eyebrow tags. Body text should stick to highly readable dark Navy (#0F172A) on a Warm Cream background.`
  },
  "market-positioning": {
    title: "Why Most B2B Positioning Fails",
    category: "Insights",
    date: "Sep 15, 2024",
    content: `Most B2B positioning statements are filled with generic slogans: "World's Best", "No.1 Solution", "Revolutionary Technology".

CMOs and Scaling Founders easily spot this lack of substance. Professional buyers search for consulting-grade strategic clarity.

Rule 1: Never Invent Experience
State your operational strengths plainly. Talk about fast turnaround, transparent scoping, or in-house engineering support, backed by actual outcomes.

Rule 2: Restrain Visual Noise
A clean, editorial digital presentation tells your prospective clients that you focus on precision, taste, and structured methodology.`
  }
};

export default async function InsightDetailPage({ params }: { params: { slug: string } }) {
  let article: Article | null = null;

  try {
    const dbInsight = await getInsightBySlug(params.slug);
    if (dbInsight) {
      article = {
        title: dbInsight.title,
        category: dbInsight.category,
        date: dbInsight.publishedAt 
          ? format(new Date(dbInsight.publishedAt), "MMM d, yyyy") 
          : (dbInsight.createdAt 
              ? format(new Date(dbInsight.createdAt), "MMM d, yyyy") 
              : format(new Date(), "MMM d, yyyy")),
        content: dbInsight.content || ""
      };
    } else if (fallbackContentMap[params.slug]) {
      article = fallbackContentMap[params.slug];
    }
  } catch (err) {
    console.error("Failed to load insight details:", err);
  }

  if (!article) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-warm-50 pt-32 pb-24 px-5 md:px-10 xl:px-20">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Back Link */}
        <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-bronze-500 transition-colors min-h-[44px]" data-interactive>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Insights</span>
        </Link>

        {/* Header */}
        <div className="space-y-6 border-b border-navy-200 pb-8">
          <div className="flex flex-wrap gap-4 items-center text-xs text-bronze-900 font-bold uppercase tracking-wider">
            <span className="px-3 py-1 rounded-full bg-bronze-50 border border-bronze-200">{article.category}</span>
          </div>

          <h1 className="text-display text-navy-950 tracking-tighter leading-tight">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-navy-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-bronze-500" />
              <span className="font-mono">{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-bronze-500" />
              <span>5 min read</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <article className="prose prose-navy max-w-none text-body-lg text-navy-800 whitespace-pre-wrap leading-relaxed">
          {article.content}
        </article>

      </div>
    </main>
  );
}
