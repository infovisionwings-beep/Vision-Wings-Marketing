/**
 * Every editable region of the homepage, in page order.
 *
 * Each `default` is the copy that was hardcoded in the section component before
 * it became editable, so an untouched install renders exactly as it did.
 */

import { type ContentSection, text, area, image, list } from "./schema";

export const CONTENT_SECTIONS: ContentSection[] = [
  // ── 1. Hero ────────────────────────────────────────────────────────────
  {
    id: "hero",
    label: "Hero",
    description:
      "The first screen. A campaign assigned to the hero slot overrides these values, so leave that unassigned to edit the hero here.",
    blocks: [
      {
        label: "Headline & copy",
        fields: [
          text("hero.title", "Headline", "WE GIVE WINGS TO YOUR VISION"),
          area(
            "hero.description",
            "Supporting paragraph",
            "For ambitious businesses ready to transcend the competition, Vision Wings delivers high-velocity marketing strategies, creative content funnels, and brand acceleration that propel your growth to new heights."
          ),
        ],
      },
      {
        label: "Buttons",
        fields: [
          text("hero.cta_primary_text", "Primary button label", "Launch Your Campaign"),
          text("hero.cta_primary_link", "Primary button link", "/contact"),
          text("hero.cta_secondary_text", "Secondary button label", "Explore Marketing Services"),
          text("hero.cta_secondary_link", "Secondary button link", "#strategy"),
        ],
      },
      {
        label: "Visual",
        fields: [
          image(
            "hero.image",
            "Replace the animated logo",
            "",
            "Leave empty to keep the animated Vision Wings logo."
          ),
          text("hero.image_alt", "Image alt text", "", "Describe the image for screen readers."),
        ],
      },
    ],
  },

  // ── 2. About / Vision ──────────────────────────────────────────────────
  {
    id: "vision",
    label: "About / Vision",
    description: "The manifesto, the photograph, and the three pillars. The logo marquee beneath them is managed at Admin → Client Logos, not here.",
    blocks: [
      {
        label: "Manifesto",
        fields: [
          area(
            "about.heading",
            "Heading",
            "You built a great business. Now let's give wings to your vision with high-velocity marketing and brand acceleration."
          ),
          area(
            "about.body",
            "Paragraph",
            "Most agencies bury you in account manager layers and generic ad templates. Vision Wings operates as a specialized growth partner—defining your unfair market advantage and executing high-converting marketing campaigns that command industry authority."
          ),
        ],
      },
      {
        label: "Photograph & pull quote",
        fields: [
          image(
            "about.photo",
            "Photograph",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85"
          ),
          text("about.photo_alt", "Photo alt text", "Strategic marketing team driving brand acceleration"),
          area(
            "about.quote",
            "Pull quote over the photo",
            "“We don't just run campaigns. We give aerodynamic lift and permanent altitude to your brand vision.”"
          ),
        ],
      },
      {
        label: "Pillar 1",
        fields: [
          text("about.pillar1_label", "Label", "01 / STRATEGY FIRST"),
          text("about.pillar1_title", "Title", "Market Positioning & Clarity"),
          area(
            "about.pillar1_body",
            "Body",
            "We analyze buyer psychology and competitive gaps before launching a campaign. Everything we build serves your core growth and revenue objectives."
          ),
        ],
      },
      {
        label: "Pillar 2",
        fields: [
          text("about.pillar2_label", "Label", "02 / SENIOR CRAFT"),
          text("about.pillar2_title", "Title", "Omnichannel Execution"),
          area(
            "about.pillar2_body",
            "Body",
            "From high-converting web funnels and viral video commercials to precision paid advertising, your campaigns are executed 100% by senior marketing masters."
          ),
        ],
      },
      {
        label: "Pillar 3",
        fields: [
          text("about.pillar3_label", "Label", "03 / TANGIBLE ROI"),
          text("about.pillar3_title", "Title", "Predictable Revenue Growth"),
          area(
            "about.pillar3_body",
            "Body",
            "We bridge the gap between captivating creative storytelling and bottom-line performance, turning passive audiences into lifelong brand advocates."
          ),
        ],
      },
    ],
  },

  // ── 3. Services ────────────────────────────────────────────────────────
  {
    id: "strategy",
    label: "Services",
    description: "Section header, the five capability cards, the three strengths and the sector list.",
    blocks: [
      {
        label: "Header",
        fields: [
          text("services.heading", "Heading", "We give wings to your vision."),
          area(
            "services.intro",
            "Intro paragraph",
            "We focus strictly on five marketing and growth disciplines where we execute at a master level. From high-ROI ad campaigns and conversion funnels to category-defining brand strategy, we give your business the altitude it deserves."
          ),
        ],
      },
      {
        label: "Card 1",
        fields: [
          text("services.card1_title", "Title", "Brand Strategy & Positioning"),
          area(
            "services.card1_desc",
            "Description",
            "We articulate your brand's unique market advantage and build irresistible narratives that make your business the clear industry authority."
          ),
          list(
            "services.card1_deliverables",
            "Deliverables",
            "Market & Competitor Audit\nValue Proposition Architecture\nBrand Storytelling & Voice\nGo-to-Market Strategy"
          ),
          list("services.card1_tools", "Stack tags", "Audience Insights\nPositioning Frameworks\nBrand Systems"),
        ],
      },
      {
        label: "Card 2",
        fields: [
          text("services.card2_title", "Title", "Conversion Web & Campaign Funnels"),
          area(
            "services.card2_desc",
            "Description",
            "High-converting web surfaces, landing pages, and interactive campaigns engineered to captivate executive buyers and multiply customer acquisition."
          ),
          list(
            "services.card2_deliverables",
            "Deliverables",
            "High-Converting Landing Pages\nInteractive Campaign Funnels\nCRO & UX Optimization\nDesign Systems"
          ),
          list("services.card2_tools", "Stack tags", "Figma\nNext.js 15\nRadix UI\nVercel"),
        ],
      },
      {
        label: "Card 3",
        fields: [
          text("services.card3_title", "Title", "Paid Ads & Performance Growth"),
          area(
            "services.card3_desc",
            "Description",
            "Precision-targeted omnichannel ad campaigns engineered to scale customer acquisition with predictable, profitable ROI."
          ),
          list(
            "services.card3_deliverables",
            "Deliverables",
            "Google & LinkedIn Ads Scaling\nPaid Social & Retargeting\nCAC & LTV Optimization\nAd Creative Testing"
          ),
          list("services.card3_tools", "Stack tags", "Google Ads\nMeta Pro\nLinkedIn Campaigns\nHubSpot"),
        ],
      },
      {
        label: "Card 4 (has a background image)",
        fields: [
          text("services.card4_title", "Title", "Viral Video & Commercial Production"),
          area(
            "services.card4_desc",
            "Description",
            "Cinematic commercials, short-form social video, and visual storytelling that ignite brand awareness and command audience attention."
          ),
          image(
            "services.card4_image",
            "Background image",
            "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1000&q=85"
          ),
          list(
            "services.card4_deliverables",
            "Deliverables",
            "Brand Commercials & Anthems\nShort-Form Social Video\nProduct Storytelling\n3D & Motion Design"
          ),
          list("services.card4_tools", "Stack tags", "Premiere Pro\nDaVinci Resolve\nAfter Effects\nCinema 4D"),
        ],
      },
      {
        label: "Card 5",
        fields: [
          text("services.card5_title", "Title", "Organic Authority & SEO Mastery"),
          area(
            "services.card5_desc",
            "Description",
            "Compounding organic growth engines, thought leadership content, and technical SEO that dominate search rankings and generate inbound demand."
          ),
          list(
            "services.card5_deliverables",
            "Deliverables",
            "Technical & Content SEO\nThought Leadership Campaigns\nInbound Demand Generation\nAnalytics & Attribution"
          ),
          list("services.card5_tools", "Stack tags", "GA4 / PostHog\nAhrefs / Semrush\nContent Engines\nHubSpot"),
        ],
      },
      {
        label: "How we operate",
        fields: [
          text("services.strengths_heading", "Heading", "How We Operate Differently"),
          area(
            "services.strengths_intro",
            "Intro",
            "Why fast-scaling teams choose Vision Wings over legacy agencies and bloated consultancies."
          ),
          text("services.strength1_title", "Strength 1 title", "Zero Junior Delegation"),
          area(
            "services.strength1_desc",
            "Strength 1 body",
            "You never get sold by a senior partner only to have your brand handed off to interns. Senior practitioners execute 100% of your work."
          ),
          text("services.strength2_title", "Strength 2 title", "Speed Without Slop"),
          area(
            "services.strength2_desc",
            "Strength 2 body",
            "We leverage modern design engineering and AI-assisted workflows to ship in weeks what traditional agencies take 6 months to debate."
          ),
          text("services.strength3_title", "Strength 3 title", "Total Architectural Transparency"),
          area(
            "services.strength3_desc",
            "Strength 3 body",
            "No proprietary black-box code or vendor lock-in. We build on open, industry-standard modern stacks that your internal team can easily inherit."
          ),
        ],
      },
      {
        label: "Sectors",
        fields: [
          text("services.industries_heading", "Heading", "Proven Across Sectors"),
          area(
            "services.industries_intro",
            "Intro",
            "Deep domain experience where complex technology meets discerning users."
          ),
          list(
            "services.industries",
            "Sector labels",
            "B2B SaaS & DevTools\nFintech & Digital Banking\nHigh-Growth E-Commerce\nAI & Machine Learning Platforms\nVenture Capital & Private Equity\nExecutive Consulting & Advisory"
          ),
        ],
      },
    ],
  },

  // ── 4. Work ────────────────────────────────────────────────────────────
  {
    id: "projects",
    label: "Case Studies",
    description:
      "Header copy for the case-study index. The cases themselves are managed under Projects — featured ones lead, and the section hides itself when there are none.",
    blocks: [
      {
        label: "Header",
        fields: [
          text("projects.heading", "Heading", "Selected case studies."),
          area(
            "projects.intro",
            "Intro paragraph",
            "Each one documented end to end: the brief we were handed, the system we built for it, and what it moved."
          ),
          text("projects.cta_text", "Link label", "All projects"),
          text("projects.cta_link", "Link destination", "/work"),
        ],
      },
    ],
  },

  {
    id: "work",
    label: "Selected Work",
    description:
      "Header copy for the work grid. The entries themselves come from Campaigns assigned to the archive slot.",
    blocks: [
      {
        label: "Header",
        fields: [
          text("work.heading", "Heading", "Campaigns that soar."),
          area(
            "work.intro",
            "Intro paragraph",
            "A selection of brand accelerations, growth campaigns and conversion systems delivered for ambitious teams."
          ),
        ],
      },
    ],
  },

  // ── 5. Featured Videos ─────────────────────────────────────────────────
  {
    id: "featured-videos",
    label: "Featured Videos",
    description:
      "Header copy for the showreel. The videos themselves come from the Media Library and Campaigns assigned to the showcase slot.",
    blocks: [
      {
        label: "Header",
        fields: [
          text("featured_videos_title_line1", "Heading line 1", "Brand Stories in"),
          text("featured_videos_title_line2", "Heading line 2 (highlighted)", "High-Definition Motion."),
          area(
            "featured_videos_description",
            "Intro paragraph",
            "We give wings to your vision through 4K commercial cinematography, high-converting launch films, and viral performance ads."
          ),
        ],
      },
    ],
  },

  // ── 6. Insights ────────────────────────────────────────────────────────
  {
    id: "insights",
    label: "Insights",
    description: "Header copy for the article teasers. The articles themselves are managed under Insights.",
    blocks: [
      {
        label: "Header",
        fields: [
          text("insights.heading", "Heading", "Marketing & Growth Insights."),
          area(
            "insights.intro",
            "Intro paragraph",
            "Field notes on brand strategy, performance marketing and the systems behind durable growth."
          ),
          text("insights.cta_text", "Button label", "Read All Insights"),
          text("insights.cta_link", "Button link", "/insights"),
        ],
      },
    ],
  },

  // ── 7. Contact ─────────────────────────────────────────────────────────
  {
    id: "contact",
    label: "Contact",
    description: "The closing call to action and the contact strip beneath it.",
    blocks: [
      {
        label: "Call to action",
        fields: [
          text("contact.heading", "Heading", "Ready to give wings to your vision?"),
          area(
            "contact.body",
            "Paragraph",
            "Stop competing on incremental tactics. Let's build high-converting marketing funnels, strategic brand authority, and performance campaigns that accelerate your business in a league of its own."
          ),
          text("contact.cta_text", "Button label", "Launch Your Campaign"),
          text("contact.cta_link", "Button link", "/contact"),
        ],
      },
      {
        label: "Contact strip",
        fields: [
          text("contact.email", "Email address", "info.visionwings@gmail.com"),
          text("contact.location", "Location line", "Varanasi, UP · Global Partners"),
        ],
      },
    ],
  },
];
