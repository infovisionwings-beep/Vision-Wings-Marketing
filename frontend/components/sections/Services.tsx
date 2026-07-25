"use client";

// Reading this as: Core capabilities section for an elite branding & growth agency, structured as an asymmetric 5-cell Bento Grid with rich background diversity, tactile hover states, and zero redundant eyebrow labels.
// DESIGN_VARIANCE: 9
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 4

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Image from "next/image";
import { 
  Sparkles, 
  Code, 
  TrendingUp, 
  PenTool, 
  Video, 
  Check, 
  ArrowUpRight 
} from "lucide-react";

const capabilities = [
  {
    id: "strategy",
    title: "Brand Strategy & Identity",
    desc: "We define the psychological bedrock of your business, positioning you so far ahead of competitors that price becomes irrelevant.",
    deliverables: ["Market Positioning & Audit", "Brand Voice & Tone", "Visual Identity & Systems", "Messaging Architecture"],
    tools: ["Figma", "Strategy Frameworks", "Customer Research"],
    icon: Sparkles,
    gridClass: "col-span-12 lg:col-span-7 bg-navy-950 text-warm-50 border border-navy-800",
    isDark: true,
    hasImage: false,
  },
  {
    id: "design",
    title: "Digital Experience & Web Design",
    desc: "High-converting, visually stunning web surfaces engineered to captivate executive buyers and consumer audiences alike.",
    deliverables: ["UI/UX System Design", "Interactive Prototypes", "Design Tokens", "Design Systems"],
    tools: ["Figma", "Radix UI", "Tailwind CSS"],
    icon: PenTool,
    gridClass: "col-span-12 lg:col-span-5 bg-warm-50 text-navy-950 border border-navy-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]",
    isDark: false,
    hasImage: false,
  },
  {
    id: "development",
    title: "Full-Stack Development",
    desc: "Resilient, blazing-fast web applications built on modern serverless architectures with uncompromised SEO and accessibility.",
    deliverables: ["Next.js App Router", "Full-Stack Web Apps", "Performance Optimization", "Database Architecture"],
    tools: ["Next.js 15", "TypeScript", "PostgreSQL / Neon", "Vercel"],
    icon: Code,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-4 bg-navy-900 text-warm-100 border border-navy-800",
    isDark: true,
    hasImage: false,
  },
  {
    id: "video",
    title: "Video & Creative Production",
    desc: "Cinematic motion graphics and visual storytelling that turn complex value propositions into instant visceral understanding.",
    deliverables: ["Product Walkthroughs", "Brand Anthems", "Motion Design", "3D Visualizations"],
    tools: ["After Effects", "Cinema 4D", "Premiere Pro", "DaVinci"],
    icon: Video,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-4 bg-navy-950 text-warm-50 border border-navy-800 relative overflow-hidden group",
    isDark: true,
    hasImage: true,
    imageSeed: "vw-video-production",
  },
  {
    id: "marketing",
    title: "Growth & Performance Marketing",
    desc: "Data-driven distribution ecosystems engineered to lower customer acquisition costs and build compounding organic authority.",
    deliverables: ["Conversion Rate Optimization", "Technical SEO Audits", "Paid Campaign Strategy", "Analytics & Attribution"],
    tools: ["GA4 / PostHog", "A/B Testing", "HubSpot", "SEO Engines"],
    icon: TrendingUp,
    gridClass: "col-span-12 lg:col-span-4 bg-gradient-to-br from-warm-100 to-warm-200/80 text-navy-950 border border-bronze-500/20",
    isDark: false,
    hasImage: false,
  },
];

const strengths = [
  {
    title: "Zero Junior Delegation",
    desc: "You never get sold by a senior partner only to have your brand handed off to interns. Senior practitioners execute 100% of your work."
  },
  {
    title: "Speed Without Slop",
    desc: "We leverage modern design engineering and AI-assisted workflows to ship in weeks what traditional agencies take 6 months to debate."
  },
  {
    title: "Total Architectural Transparency",
    desc: "No proprietary black-box code or vendor lock-in. We build on open, industry-standard modern stacks that your internal team can easily inherit."
  }
];

const industries = [
  "B2B SaaS & DevTools",
  "Fintech & Digital Banking",
  "High-Growth E-Commerce",
  "AI & Machine Learning Platforms",
  "Venture Capital & Private Equity",
  "Executive Consulting & Advisory"
];

export default function Services() {
  return (
    <section id="strategy" className="py-20 md:py-32 lg:py-40 px-5 md:px-10 xl:px-20 bg-warm-100 text-navy-950">
      <div className="max-w-[1280px] mx-auto space-y-20 md:space-y-32">
        
        {/* Section Header (With our single allowed eyebrow per Rule 4.7) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-navy-200 pb-10">
          <RevealOnScroll className="max-w-2xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-bronze-600 block mb-3">
              WHAT WE ACTUALLY DO
            </span>
            <h2 className="text-display sm:text-h1 font-bold text-navy-950 tracking-tight">
              Concentrated expertise. Absolute craft.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="max-w-md">
            <p className="text-body text-navy-700 leading-relaxed">
              We focus strictly on five disciplines where we execute at a master level. No outsourced bulk templates—just strategic depth and high-craft execution.
            </p>
          </RevealOnScroll>
        </div>

        {/* 5-Cell Asymmetric Bento Grid (Rule 4.7: Exactly 5 cells for 5 items, Background Diversity) */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {capabilities.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <RevealOnScroll 
                key={item.id} 
                delay={idx * 0.08}
                className={`${item.gridClass} rounded-2xl p-8 md:p-10 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                {/* Background image for video card */}
                {item.hasImage && (
                  <>
                    <Image
                      src={`https://picsum.photos/seed/${item.imageSeed}/800/800`}
                      alt={item.title}
                      fill
                      className="object-cover opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent pointer-events-none" />
                  </>
                )}

                {/* Top of Card */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.isDark ? "bg-navy-800 text-bronze-400" : "bg-navy-950 text-warm-50"}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${item.isDark ? "bg-navy-800/80 text-navy-300" : "bg-warm-200/80 text-navy-700"}`}>
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-h3 font-bold mb-3">{item.title}</h3>
                    <p className={`text-body-sm leading-relaxed ${item.isDark ? "text-navy-300" : "text-navy-700"}`}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-current/10">
                    <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${item.isDark ? "text-bronze-400" : "text-bronze-700"}`}>
                      Key Deliverables
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs">
                          <Check className={`w-3.5 h-3.5 flex-shrink-0 ${item.isDark ? "text-bronze-400" : "text-bronze-600"}`} />
                          <span className={item.isDark ? "text-warm-100" : "text-navy-800"}>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom of Card: Tech/Tool Tokens */}
                <div className="relative z-10 pt-6 mt-6 border-t border-current/10 flex flex-wrap gap-2 items-center">
                  <span className={`text-[11px] font-mono font-semibold mr-1 ${item.isDark ? "text-navy-400" : "text-navy-500"}`}>
                    STACK:
                  </span>
                  {item.tools.map((tool, tIdx) => (
                    <span 
                      key={tIdx}
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded ${
                        item.isDark 
                          ? "bg-navy-900/90 text-navy-200 border border-navy-700" 
                          : "bg-warm-200/60 text-navy-800 border border-navy-300/50"
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Why Choose Us (Operational Strengths - Clean 3-Col layout without card containers per Rule 4.4 / 4.7) */}
        <div className="pt-16 border-t border-navy-200 space-y-12">
          <RevealOnScroll className="max-w-xl">
            <h3 className="text-h2 font-bold text-navy-950">How We Operate Differently</h3>
            <p className="text-body text-navy-700 mt-2">
              Why fast-scaling teams choose Vision Wings over legacy agencies and bloated consultancies.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {strengths.map((s, idx) => (
              <RevealOnScroll key={idx} delay={idx * 0.1} className="space-y-3 border-l-2 border-navy-950 pl-6">
                <span className="text-xs font-mono font-semibold text-bronze-600 block">STRENGTH / 0{idx + 1}</span>
                <h4 className="text-h4 font-bold text-navy-950">{s.title}</h4>
                <p className="text-body-sm text-navy-600 leading-relaxed">{s.desc}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Industries Served (Sleek Horizontal Pill Cluster without eyebrows) */}
        <div className="pt-16 border-t border-navy-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <RevealOnScroll className="max-w-sm">
            <h3 className="text-h3 font-bold text-navy-950">Proven Across Sectors</h3>
            <p className="text-body-sm text-navy-600 mt-1">Deep domain experience where complex technology meets discerning users.</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="flex flex-wrap gap-2.5 max-w-2xl justify-start md:justify-end">
            {industries.map((ind, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 rounded-full bg-navy-950 text-warm-50 text-xs sm:text-sm font-medium border border-navy-800 hover:border-bronze-500 transition-colors cursor-default"
              >
                {ind}
              </span>
            ))}
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
}
