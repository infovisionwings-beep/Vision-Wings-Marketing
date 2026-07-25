import { getInsights } from "@/app/actions/insights";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

export const metadata = {
  title: "Insights & Perspectives - Vision Wings",
  description: "Senior strategic and creative viewpoints on brand architecture, growth marketing, and digital design craft.",
};

const fallbackInsights = [
  {
    id: 1,
    title: "The New Rules of Brand Architecture",
    category: "Strategy",
    date: "Oct 12, 2024",
    slug: "brand-architecture"
  },
  {
    id: 2,
    title: "Designing for Conversion Without Sacrificing Brand",
    category: "Design",
    date: "Sep 28, 2024",
    slug: "conversion-design"
  },
  {
    id: 3,
    title: "Why Most B2B Positioning Fails",
    category: "Insights",
    date: "Sep 15, 2024",
    slug: "market-positioning"
  }
];

export default async function InsightsPage() {
  let list = fallbackInsights;
  try {
    const dbInsights = await getInsights();
    if (dbInsights && dbInsights.length > 0) {
      list = dbInsights.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        slug: item.slug,
        date: item.publishedAt 
          ? format(new Date(item.publishedAt), "MMM d, yyyy") 
          : (item.createdAt 
              ? format(new Date(item.createdAt), "MMM d, yyyy") 
              : format(new Date(), "MMM d, yyyy"))
      }));
    }
  } catch (err) {
    console.error("Failed to load insights list:", err);
  }

  return (
    <main className="min-h-screen bg-warm-100 pt-32 pb-24 px-5 md:px-10 xl:px-20">
      <div className="max-w-[1280px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <span className="text-h4 text-bronze-900 block font-semibold">THE THINKING HANDBOOK</span>
          <h1 className="text-display text-navy-950">Insights & Perspective</h1>
          <p className="text-body-lg text-navy-700">
            Plain-English essays on strategy, design, and conversions. We avoid buzzwords and fake claims, focusing instead on structural lessons from the growth coalface.
          </p>
        </div>

        {/* Editorial Index Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((item) => (
            <Link 
              key={item.id}
              href={`/insights/${item.slug}`} 
              className="group block bg-warm-50 border border-navy-100 hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition-all duration-300 p-8 rounded-xl" 
              data-interactive
            >
              <div className="flex justify-between items-start mb-10">
                <span className="text-caption text-bronze-900 font-bold uppercase tracking-wider">{item.category}</span>
                <div className="p-2 bg-warm-100 rounded-full group-hover:bg-bronze-950 group-hover:text-warm-50 transition-colors duration-300">
                  <ArrowUpRight className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-h3 text-navy-950 mb-6 group-hover:text-bronze-500 transition-colors leading-snug">{item.title}</h3>
              <p className="text-caption text-navy-500 font-mono">{item.date}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
