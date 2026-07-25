"use client";

// Reading this as: Core capabilities and offerings section for a high-end branding agency, using interactive tabs and bento detail panels with restrained typography and clear information hierarchy.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 4

import { useState } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { 
  Sparkles, 
  Code, 
  TrendingUp, 
  PenTool, 
  Video, 
  Camera, 
  Megaphone, 
  Check,
  ChevronRight,
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";

const serviceCategories = [
  {
    id: "branding",
    title: "Branding",
    icon: Sparkles,
    description: "Building premium brand identities that command authority and leave a lasting impression in the market.",
    items: [
      "Logo Design",
      "Brand Identity & Visual System",
      "Comprehensive Brand Guidelines",
      "Business Card & Stationery Design",
      "Letterhead & Corporate Templates",
      "Packaging Design",
      "Brand Strategy & Positioning",
      "Naming & Voice Definition",
      "Custom Color Palette Selection",
      "Typography System Rules"
    ],
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "Brand Guidelines"]
  },
  {
    id: "websites",
    title: "Website Development",
    icon: Code,
    description: "High-performance digital experiences and custom web applications engineered for speed, responsiveness, and conversion.",
    items: [
      "Custom React & Next.js Websites",
      "WordPress CMS Implementations",
      "High-Converting Landing Pages",
      "E-commerce Storefronts",
      "Premium Portfolios & Showcases",
      "Corporate & Business Websites",
      "Custom Booking Systems",
      "Responsive & Mobile-First Design",
      "On-page SEO & Structured Schema",
      "API Integrations & Payment Gateways"
    ],
    tools: ["Next.js", "React", "WordPress", "Tailwind CSS", "Vercel"]
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    icon: TrendingUp,
    description: "Data-driven performance campaigns, search optimization, and automated marketing funnels to scale qualified lead generation.",
    items: [
      "Social Media Management",
      "Facebook & Instagram Ads Management",
      "Google Ads (Search, Display, Shopping)",
      "Search Engine Optimization (SEO)",
      "Local SEO & Google Business Profile",
      "Email Marketing Campaigns & Flows",
      "WhatsApp Marketing Automation",
      "Lead Generation Systems",
      "Advanced Web & Conversion Analytics",
      "Remarketing & Audience Retargeting",
      "YouTube & LinkedIn B2B Marketing"
    ],
    tools: ["Meta Ads Manager", "Google Ads", "Google Analytics", "Mailchimp"]
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    icon: PenTool,
    description: "Stunning marketing collateral and editorial design systems that elevate your offline and online presence.",
    items: [
      "Social Media Posts & Creatives",
      "Posters, Flyers & Brochures",
      "Sales Catalogues & Pitch Decks",
      "Banners & Exhibition Standees",
      "Outdoor Hoardings & Billboard Ads",
      "Menu Cards & Print Ephemera",
      "Certificates & Award Layouts",
      "Corporate Presentations",
      "Data-Dense Infographics"
    ],
    tools: ["Figma", "Adobe Photoshop", "Illustrator", "Indesign", "Canva"]
  },
  {
    id: "video-services",
    title: "Video Services",
    icon: Video,
    description: "Cinematic post-production, motion graphics, and engaging vertical content optimized for social platforms and corporate presentations.",
    items: [
      "Professional Video Editing",
      "Motion Graphics & Title Animations",
      "Instagram Reels & TikTok Content",
      "YouTube Video Editing",
      "Corporate Overview Videos",
      "High-Impact Commercial Ads",
      "Product Demonstration Videos",
      "Explainer Videos & Walkthroughs"
    ],
    tools: ["Premiere Pro", "After Effects", "Davinci Resolve"]
  },
  {
    id: "photography",
    title: "Photography",
    icon: Camera,
    description: "High-end product, corporate portraiture, and event photography captured using professional-grade gear.",
    items: [
      "Product Photography & E-comm Shoots",
      "Corporate Headshots & Team Portraits",
      "Event Coverage & Brand Activations",
      "Food & Restaurant Menu Photography",
      "Real Estate & Architectural Shoots",
      "Fashion & Editorial Model Shoots",
      "Drone / Aerial Photography",
      "Professional Retouching & Post-processing"
    ],
    tools: ["Sony/Canon Bodies", "Studio Lighting", "Adobe Lightroom"]
  },
  {
    id: "traditional-marketing",
    title: "Traditional Marketing",
    icon: Megaphone,
    description: "Tangible brand placements, outdoor activations, and print media designed to capture localized attention and build offline credibility.",
    items: [
      "Outdoor Billboard Ads & Banners",
      "Print Advertisements (Newspapers & Magazines)",
      "Pamphlets & Direct Mail Flyers",
      "Radio Ad Placement & Production",
      "Physical Brand Activation Events",
      "Exhibition & Trade Show Support"
    ],
    tools: ["Print Production", "Media Buying", "Event Management"]
  }
];

const industries = [
  "Retail", "Healthcare", "Education", "Restaurants", "Real Estate", 
  "Startups", "Corporate", "Manufacturing", "Jewellery", "Fashion", "Automobile"
];

const strengths = [
  { title: "Fast Turnaround", desc: "Rapid execution cycles without sacrificing premium visual and structural quality." },
  { title: "Transparent Pricing", desc: "No hidden line items or surprise fees. What we scope is exactly what you pay." },
  { title: "Custom Solutions", desc: "We design and build from scratch. No cookie-cutter templates or generic grids." },
  { title: "Experienced Team", desc: "Partner directly with senior strategists and creatives. No junior hand-offs." },
  { title: "Dedicated Support", desc: "Direct communication channels for seamless project management and updates." },
  { title: "In-House Design", desc: "100% of our creative and code output is produced by our core internal studio team." },
  { title: "End-to-End Execution", desc: "From blank-canvas brand strategy to production code deployment." }
];

export default function Services() {
  const [activeTab, setActiveTab] = useState("branding");
  const currentCategory = serviceCategories.find((cat) => cat.id === activeTab) || serviceCategories[0];
  const IconComponent = currentCategory.icon;

  return (
    <section id="strategy" className="py-16 md:py-24 lg:py-32 px-5 md:px-10 xl:px-20 bg-navy-950 text-warm-50">
      <div className="max-w-[1280px] mx-auto space-y-16 md:space-y-24 lg:space-y-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-navy-700 pb-12">
          <RevealOnScroll>
            <span className="text-h4 text-bronze-500 block mb-3 md:mb-4">WHAT WE ACTUALLY DO</span>
            <h2 className="text-h2 text-warm-50 max-w-2xl">
              Concentrated expertise. Absolute transparency.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="text-body text-navy-300 max-w-sm">
              We focus only on services we execute at a master level. No outsourced bulk templates, just high-craft strategy, code, and creative production.
            </p>
          </RevealOnScroll>
        </div>

        {/* Tabbed Interactive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Tab Navigation */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-4 lg:pb-0 border-b border-navy-900 lg:border-none scrollbar-none">
            {serviceCategories.map((cat, index) => {
              const CatIcon = cat.icon;
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-all font-medium text-sm lg:text-base border cursor-pointer ${
                    isActive
                      ? "bg-bronze-500 border-bronze-500 text-warm-50 shadow-md font-semibold"
                      : "bg-navy-900 border-navy-900 text-navy-300 hover:text-warm-50 hover:bg-navy-900/60"
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${cat.id}`}
                  id={`tab-${cat.id}`}
                >
                  <CatIcon className="w-5 h-5 flex-shrink-0" />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div 
            className="lg:col-span-8 bg-navy-900 rounded-2xl p-6 md:p-10 lg:p-12 border border-navy-700 space-y-8"
            id={`panel-${currentCategory.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${currentCategory.id}`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-navy-700 pb-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bronze-900/40 text-bronze-300 border border-bronze-700/30 text-xs font-semibold">
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{currentCategory.title} Capabilities</span>
                </div>
                <h3 className="text-h3 text-warm-50 font-bold">{currentCategory.title}</h3>
                <p className="text-body text-navy-300 max-w-xl">{currentCategory.description}</p>
              </div>
            </div>

            {/* Deliverables List */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-warm-50 mb-3">Inclusions & Deliverables</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentCategory.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-body-sm text-warm-100">
                    <Check className="w-4 h-4 text-bronze-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools/Platforms */}
            <div className="pt-6 border-t border-navy-700">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-semibold text-navy-300 uppercase tracking-wider mr-2">Key Tools:</span>
                {currentCategory.tools.map((tool, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-md bg-navy-950 text-navy-100 text-xs font-mono border border-navy-700/60"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="space-y-10 pt-12 border-t border-navy-700/60">
          <div>
            <h3 className="text-h2 text-warm-50">Our Operational Strengths</h3>
            <p className="text-body text-navy-300 max-w-xl mt-2">
              Ambitious brands choose us because we replace account director pitches with senior execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strengths.map((s, idx) => (
              <div 
                key={idx}
                className="bg-navy-900/40 border border-navy-900 rounded-xl p-6 hover:border-bronze-500/30 transition-all duration-300 space-y-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-bronze-900/30 text-bronze-400 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-warm-50">{s.title}</h4>
                <p className="text-xs leading-relaxed text-navy-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Industries Served */}
        <div className="space-y-8 pt-12 border-t border-navy-700/60">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-h3 text-warm-50 font-bold">Proven Experience Across Sectors</h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {industries.map((ind, idx) => (
              <span 
                key={idx}
                className="px-4.5 py-2.5 rounded-full bg-navy-900 text-warm-100 text-sm font-medium border border-navy-700 hover:border-bronze-500 transition-colors"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
