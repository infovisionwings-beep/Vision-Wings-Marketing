# Vision Wing — Product Requirements Document (PRD)

| | |
|---|---|
| **Project** | Vision Wing — Premium Marketing Agency Website |
| **Document** | Product Requirements Document |
| **Version** | 1.0 |
| **Status** | Draft for Stakeholder Sign-off |
| **Last Updated** | July 23, 2026 |
| **Owner** | Product / Brand Strategy |

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals](#2-goals)
3. [Objectives](#3-objectives)
4. [Target Audience](#4-target-audience)
5. [Brand Positioning](#5-brand-positioning)
6. [Business Goals](#6-business-goals)
7. [Features](#7-features)
8. [User Personas](#8-user-personas)
9. [User Stories](#9-user-stories)
10. [Functional Requirements](#10-functional-requirements)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [SEO Requirements](#12-seo-requirements)
13. [Accessibility](#13-accessibility)
14. [Performance Goals](#14-performance-goals)
15. [Animations](#15-animations)
16. [Success Metrics](#16-success-metrics)
17. [Future Roadmap](#17-future-roadmap)
18. [Acceptance Criteria](#18-acceptance-criteria)

---

## 1. Project Overview

Vision Wing is a marketing agency, brand strategy studio, and business consultancy. Its website is the agency's single most important sales asset: for a premium services business, the site is often the first — and sometimes only — proof point a prospect sees before a call is booked. It has to do in silence what the best account director would do in a room: demonstrate taste, precision, and judgment before a single word of copy is read.

This is **not** a template SaaS marketing site. It is an editorial, scroll-driven brand experience that mirrors the quality of work Vision Wing promises to produce for its clients. The website itself is the agency's best case study.

The three-part logo — **Globe, Wing, Eagle Eye** — is not decorative. It is the organizing metaphor for the entire site:

| Symbol | Meaning | Where it shows up on the site |
|---|---|---|
| **Globe** | Global opportunity, limitless vision | Language around scale/reach in Hero, Vision, and Services copy; the outer stroke in the logo reveal animation |
| **Wing** | Growth, momentum, progress | Scroll-driven motion, the Process timeline, page-transition direction (things move *upward and forward*) |
| **Eagle Eye** | Precision, insight, strategic thinking | The custom cursor (an aperture that tightens on interactive elements), sharp typographic hierarchy, restrained visual noise |

Every section of this PRD assumes the build team will keep referring back to this table — it is the throughline that keeps 12 sections and 4 planning documents from drifting into generic agency-site territory.

## 2. Goals

**Primary goal:** Convert qualified visitors (founders, marketing leads, business owners actively evaluating agencies) into discovery-call bookings, without ever feeling like a "book a demo" SaaS funnel.

**Supporting goals:**

- Establish Vision Wing as a premium, senior-level partner — not a freelancer collective or a volume-based agency.
- Make the agency's thinking (strategy, process, POV) as visible as its visual output.
- Give the sales team a site they can send cold, with zero verbal context, and have it land the pitch on its own.
- Build a foundation (design system + architecture) that scales to new case studies, insights articles, and services without a redesign.

## 3. Objectives

Objectives are written to be measurable at 90 days post-launch.

| Objective | Metric | Target |
|---|---|---|
| Increase qualified inbound inquiries | Contact form submissions marked "qualified" by sales | +40% vs. pre-launch baseline |
| Improve on-site engagement depth | Avg. scroll depth per session | ≥ 75% of page height |
| Reduce bounce on paid/organic landing | Bounce rate | < 45% |
| Establish thought-leadership footprint | Organic sessions to Insights section | 1,000+/month by month 3 |
| Maintain premium technical quality bar | Lighthouse Performance (mobile) | ≥ 90 |
| Ship without accessibility debt | WCAG 2.1 AA audit | Zero critical/serious violations |

## 4. Target Audience

Vision Wing sells senior strategic and creative work, not commodity execution. The audience is deliberately narrower than "anyone who needs a website":

- **Founders and CEOs** of Series A–C startups and growth-stage SMBs who have outgrown their founding brand identity.
- **Marketing Directors / CMOs** at mid-market companies (50–500 employees) evaluating a rebrand, website relaunch, or growth-marketing partner.
- **Business owners** in traditional industries seeking to modernize their brand and digital presence without losing credibility with existing customers.
- **Referral-driven prospects** — people arriving with a warm introduction, who are validating a recommendation rather than discovering Vision Wing cold.

What this audience is *not*: bargain-hunters comparing hourly rates, or DIY founders looking for a Squarespace-tier solution. Copy, pricing signals (or intentional absence of pricing), and CTA language should filter for this throughout.

## 5. Brand Positioning

**Positioning statement:**

> For growth-stage businesses who feel invisible in a crowded market, Vision Wing is the strategic brand and growth partner that sees the opportunities competitors miss — because unlike execution-only agencies or generalist freelancers, Vision Wing pairs consulting-grade strategic rigor with the design craft of a boutique studio.

**Competitive frame (how the site should differentiate visually and verbally):**

| Competitor archetype | How they present | How Vision Wing differs |
|---|---|---|
| Volume production agencies | Portfolio-grid heavy, generic "our services" language | Narrative-first; portfolio is curated (Featured Projects, not "all work") |
| Freelancer/collective marketplaces | Personality-led, informal tone | Institutional confidence; senior tone throughout, no first-person founder cult of personality |
| Big-4/consulting-style firms | Text-dense, jargon-heavy, corporate | Editorial and visual, minimal jargon, large typography over dense paragraphs |
| Generic "AI-templated" agency sites | Gradient blobs, floating glassmorphic cards, stock imagery | Flat, precise, restrained motion; explicitly prohibited: glassmorphism, neumorphism, gradient blobs (see [Design.md § Do & Don't](./Design.md#do--dont)) |

Brand voice: confident, precise, understated. Short declarative sentences. No exclamation points. No "unlock," "supercharge," "revolutionize." The hero line **"SEE WHAT OTHERS MISS"** is the register for the entire site — every headline should sound like it could sit next to that line.

## 6. Business Goals

- Generate a consistent pipeline of qualified discovery calls without paid lead-gen dependency.
- Support premium pricing positioning — the site should never need to justify its prices because it never states them defensively.
- Reduce sales cycle friction by pre-answering objections in FAQ and Process sections, so discovery calls start at "when do we start" rather than "what do you actually do."
- Create a reusable content system (Insights, Featured Projects) so marketing can publish proof of expertise without engineering involvement post-launch.

## 7. Features

| Feature | Description | Priority |
|---|---|---|
| Scroll-driven storytelling homepage | Single-page narrative flow through all core sections with scroll-triggered reveals | Must-have |
| Animated logo reveal (Globe → Wing → Eye) | Line-drawing entrance animation used in Hero and as a loading motif | Must-have |
| Custom cursor / precision interaction | Aperture-style cursor that reacts to hoverable elements | Must-have |
| Sticky, state-changing navigation | Transparent-over-hero, solid-on-scroll nav bar | Must-have |
| Featured Projects (case studies) | CMS-driven case study entries with detail pages | Must-have |
| Insights (editorial blog) | CMS-driven long-form articles, used for SEO and authority | Must-have |
| Testimonials | Rotating/curated client quotes, tied to named case studies where possible | Must-have |
| Contact & discovery-call form | Low-friction form with qualification fields, spam-protected | Must-have |
| FAQ accordion | Objection-handling content, structured for SEO (FAQPage schema) | Must-have |
| Process visualization | Discover → Strategy → Design → Launch → Scale, shown as an interactive/animated sequence | Must-have |
| Dark-on-scroll footer | Navy-toned footer distinct from the warm body of the page | Should-have |
| Reduced-motion mode | Full functional parity with all animation removed/simplified | Must-have (accessibility requirement) |
| Multi-language support | Roadmap only — see [§17 Future Roadmap](#17-future-roadmap) | Won't-have (v1) |

## 8. User Personas

### Persona 1 — "The Scaling Founder"

- **Who:** Founder/CEO, 32–45, Series A–B SaaS or DTC brand, 15–80 employees.
- **Context:** Original brand was built cheaply pre-PMF. Now raising a new round or entering a new market and the brand doesn't match the ambition.
- **Goals:** Find a partner who can move fast but won't produce something generic; wants to feel like a "grown-up company" to investors and enterprise customers.
- **Frustrations:** Has been burned by agencies that over-promise strategy and under-deliver design, or vice versa.
- **What the site must do for them:** Prove strategic *and* craft competence in the first 10 seconds (Hero + About), then let Featured Projects close the deal.

### Persona 2 — "The Rebrand-Ready CMO"

- **Who:** Marketing Director/CMO, 35–50, mid-market company (50–500 employees), reports to a CEO or board.
- **Context:** Owns the decision but needs to justify it internally. Comparing 3–5 agencies.
- **Goals:** Needs a defensible process (Process section), evidence of results (case studies with outcomes, not just visuals), and reassurance this won't become a 12-month scope-creep project.
- **Frustrations:** Generic agency decks that all look the same; vague "trust us" language with no methodology.
- **What the site must do for them:** Give them screenshots/quotes/data they can put in an internal deck. Phases and Process content should map cleanly to a timeline they can present upward.

### Persona 3 — "The Modernizing Owner"

- **Who:** Owner/operator, 40–60, established traditional-industry business (professional services, manufacturing, healthcare-adjacent), 10–150 employees.
- **Context:** Business is healthy but the brand looks 10–15 years old. Losing deals to newer competitors who "just look more credible."
- **Goals:** Modern, credible presence without losing the trust equity of an established business; wants plain-English explanations, not jargon.
- **Frustrations:** Intimidated by agencies that talk in marketing-speak; worried about being sold something they don't need.
- **What the site must do for them:** FAQ and Process sections need to demystify the engagement in plain language. Testimonials from relatable, non-flashy industries matter more here than logos.

## 9. User Stories

Organized by epic, in standard "As a / I want / so that" format.

**Epic: First Impression**
- As a first-time visitor, I want the hero to immediately communicate what Vision Wing does and for whom, so I can decide within seconds whether to keep reading.
- As a visitor on a slow connection, I want the page to remain usable and readable even before animations/assets finish loading, so I'm not blocked from the content.

**Epic: Evaluation**
- As a CMO comparing agencies, I want to see specific outcomes tied to real case studies, so I can assess credibility beyond visual polish.
- As a founder, I want to understand the agency's process before I talk to sales, so I know what I'm committing to.
- As a skeptical prospect, I want an FAQ that addresses pricing, timelines, and scope honestly, so I don't need a call just to get basic information.

**Epic: Conversion**
- As a ready-to-buy visitor, I want a single obvious way to start a conversation, so I don't have to hunt for a contact method.
- As a visitor filling out the contact form, I want to know my submission was received, so I'm confident it didn't disappear into a void.
- As a visitor not ready to commit, I want a lower-commitment secondary action ("Explore Our Vision"), so I'm not forced into a binary choice.

**Epic: Trust & Authority**
- As a prospect doing due diligence, I want to read the agency's actual point of view (Insights), so I can judge their thinking, not just their visuals.
- As a visitor, I want to see testimonials attributed to real, specific people/companies, so social proof feels credible rather than generic.

**Epic: Accessibility & Inclusion**
- As a keyboard-only user, I want to navigate every interactive element (nav, accordion, form, cursor-dependent hovers) without a mouse, so I'm not excluded from any content or action.
- As a user with vestibular sensitivity, I want to turn off non-essential motion, so scroll-triggered and parallax effects don't cause discomfort.
- As a screen reader user, I want section landmarks and meaningful link/button labels, so I can navigate the story structure non-visually.

## 10. Functional Requirements

| ID | Requirement | Section(s) |
|---|---|---|
| FR-01 | Navigation is fixed/sticky, transparent over the hero, and transitions to a solid background after a defined scroll threshold | Navigation |
| FR-02 | Navigation collapses to a mobile menu below the tablet breakpoint, fully keyboard- and screen-reader-operable | Navigation |
| FR-03 | Hero renders the animated logo (line-draw: Globe → Wing → Eye) on first load, once per session | Hero |
| FR-04 | Hero contains a primary CTA ("Let's Build Together") linking to Contact, and a secondary CTA ("Explore Our Vision") linking/scrolling to Our Vision | Hero |
| FR-05 | Custom cursor interaction is present on pointer/mouse devices only; falls back to default cursor on touch devices | Hero, global |
| FR-06 | Featured Projects renders from CMS entries; each project links to a detail view with case-study content | Featured Projects |
| FR-07 | Testimonials are CMS-driven and support optional linkage to a specific Featured Project | Testimonials |
| FR-08 | Insights renders CMS-driven articles with list + detail views, publish date, and reading time | Insights |
| FR-09 | FAQ renders as an accordion; only one item expanded at a time on mobile (configurable on desktop); each item is independently linkable (deep-linkable anchor) | FAQ |
| FR-10 | Contact form captures: name, email, company, project type (select), budget range (select), message; validates required fields client- and server-side | Contact |
| FR-11 | Contact form submission triggers a transactional confirmation to the user and a notification to the internal sales inbox | Contact |
| FR-12 | Contact form is protected against automated spam submissions without a visually intrusive CAPTCHA badge | Contact |
| FR-13 | Process section visualizes the five stages (Discover, Strategy, Design, Launch, Scale) with scroll-linked progression | Process |
| FR-14 | All scroll-triggered and parallax animations respect `prefers-reduced-motion` and degrade to simple fades/no motion | Global |
| FR-15 | 404 and form-error states are designed and implemented, not left as framework defaults | Global |

## 11. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | See [§14 Performance Goals](#14-performance-goals) for specific budgets |
| **Browser support** | Latest 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari and Chrome Android current major versions |
| **Device support** | Responsive from 375px to 2560px+ viewport width; tested on real iOS and Android devices, not emulators only |
| **Uptime** | 99.9% (inherited from Vercel's platform SLA on production tier) |
| **Maintainability** | Any team member with Next.js + Tailwind familiarity can ship a content-only change without touching animation logic |
| **Content editing** | Non-technical marketing staff can publish an Insights article or Featured Project without developer involvement |
| **Internationalization readiness** | Copy and layout should not hardcode assumptions that block future i18n (see roadmap), even though multi-language is out of scope for v1 |
| **Data privacy** | Contact form data handled per applicable data protection requirements (e.g., clear privacy notice, no third-party resale of submitted data) |

## 12. SEO Requirements

- **Metadata:** Unique, hand-written `<title>` and meta description per route (home, each Insights article, each Featured Project, static pages). No templated auto-generated descriptions.
- **Structured data:** `Organization` schema sitewide; `Article` schema on Insights posts; `FAQPage` schema on the FAQ section; `BreadcrumbList` on nested detail pages.
- **URL structure:** Clean, human-readable slugs (`/insights/[slug]`, `/work/[slug]`) — no CMS-generated IDs in URLs.
- **Sitemap & robots:** Auto-generated `sitemap.xml` and `robots.txt`, regenerated on content publish.
- **Open Graph / Twitter Cards:** Unique OG image per Insights article and Featured Project (auto-generated from a template if a custom image isn't supplied).
- **Core Web Vitals:** Treated as an SEO requirement, not just a performance one — see §14.
- **Internal linking:** Featured Projects link to related Insights articles and vice versa where relevant; FAQ items link out to deeper Insights content where applicable.
- **Heading hierarchy:** Single `<h1>` per page; section headings follow logical `h2`/`h3` nesting (this also serves the Accessibility requirements below).

## 13. Accessibility

Target conformance: **WCAG 2.1 Level AA**, audited before launch (see [Phases.md — Phase 10: Testing](./Phases.md#phase-10--testing)).

- All color/text combinations meet AA contrast minimums (4.5:1 normal text, 3:1 large text/UI components). Note: **Bronze (#B87333) on Warm Background does not meet the 4.5:1 threshold for body text** (~3.6:1) — it is restricted to large headings, icons, borders, and non-text UI accents. Full detail in [Design.md § Color System](./Design.md#color-system).
- All interactive elements (nav links, accordion triggers, form fields, custom cursor targets) are reachable and operable via keyboard alone, with a visible focus indicator at all times — the custom cursor is a visual enhancement, never a required input method.
- All animations, including the logo reveal, scroll parallax, and cursor effects, respect `prefers-reduced-motion: reduce` and provide a static or minimal-motion equivalent that carries the same information.
- Semantic HTML landmarks (`<nav>`, `<main>`, `<footer>`, headings) are used so screen reader users can navigate the one-page narrative structure without relying on visual scroll position.
- Form fields have associated `<label>` elements (not placeholder-only labeling), and errors are announced programmatically (`aria-live` or `aria-describedby`), not communicated by color alone.
- Images (including any illustrative Globe/Wing/Eye graphics) have meaningful `alt` text or are marked decorative (`alt=""`) where purely ornamental.

## 14. Performance Goals

| Metric | Target | Context |
|---|---|---|
| Lighthouse Performance (Mobile) | ≥ 90 | Measured on throttled 4G / mid-tier device profile |
| Lighthouse Performance (Desktop) | ≥ 95 | |
| Largest Contentful Paint (LCP) | < 2.5s | |
| Interaction to Next Paint (INP) | < 200ms | Critical given cursor/hover interaction density |
| Cumulative Layout Shift (CLS) | < 0.1 | Animations must reserve layout space, never introduce shift |
| Total JS transferred (initial route) | < 250KB gzipped (target) | Budget explicitly accounts for Framer Motion + Lenis; GSAP loaded only if/where used, via dynamic import |
| Animation frame rate | 60fps sustained | On mid-tier mobile hardware, not just high-end desktop |

## 15. Animations

Motion in Vision Wing is not decoration — it encodes the Wing (momentum/progress) meaning of the logo. Every animation must be justifiable against that principle, not added because "sites like this usually move."

- **Signature moment:** The logo reveal draws in sequence — Globe outline first (context/world), Wing stroke sweeping across second (momentum), Eagle Eye detail resolving and sharpening last (precision/focus). This ~1.6s sequence is the site's single most distinctive animated moment and should not be diluted by competing motion elsewhere on first load.
- **Scroll storytelling:** Section transitions use restrained fade/rise reveals (content enters from ~24px below its resting position, opacity 0→1) — never full-screen slide transitions or aggressive parallax that could induce motion discomfort.
- **Cursor interaction:** A small ring/aperture cursor tightens and adds a subtle rotation when hovering interactive elements, reinforcing "precision." This is supplementary, not required for any action.
- **Micro-interactions:** Button hovers, link underline draws, and accordion expand/collapse use fast (150–250ms) transitions; nothing in the interface should feel like it's waiting on an animation to become usable.
- **Reduced motion:** Every animation listed above has a defined reduced-motion fallback (see [Design.md § Motion Guidelines](./Design.md#motion-guidelines)). This is a launch blocker, not a nice-to-have.
- **Full technical specification:** durations, easings, and triggers are defined in [Design.md § Animation Timing](./Design.md#animation-timing) and [Architecture.md § Animation Architecture](./Architecture.md#animation-architecture).

## 16. Success Metrics

| Metric | Baseline (pre-launch) | 90-Day Target |
|---|---|---|
| Qualified contact form submissions / month | [To be measured post-launch] | +40% vs. baseline |
| Avg. session duration | [To be measured] | +25% |
| Scroll depth (avg. % of page viewed) | [To be measured] | ≥ 75% |
| Organic traffic to Insights | ~0 (new section) | 1,000+ sessions/month by month 3 |
| Discovery-call-to-proposal conversion | [Sales-owned metric] | Directionally improve as site pre-qualifies better |
| Lighthouse Performance (mobile) | N/A | ≥ 90 sustained post-launch |
| WCAG AA violations (critical/serious) | N/A | 0 |

## 17. Future Roadmap

Explicitly out of scope for v1, documented so the architecture doesn't foreclose them:

- **Multi-language support** — copy and routing structure should avoid hardcoded English-only assumptions where reasonably cheap to do so.
- **Client portal** — a gated area for active clients to view project status; would reuse the CMS and auth patterns established in Architecture.md.
- **Interactive case study filtering** — filter Featured Projects by industry/service once the volume of case studies justifies it (recommended threshold: 12+ published projects).
- **Newsletter / gated content** — an email capture tied to Insights, once publishing cadence is established.
- **Dark mode** — see [Design.md § Dark Mode Strategy](./Design.md#dark-mode-strategy) for the proposed "Inverted Editorial" approach if this becomes a priority.
- **Video/motion case studies** — richer media within Featured Projects detail pages.

## 18. Acceptance Criteria

Launch readiness checklist — all items must be checked before Phase 11 (Deployment) proceeds:

- [ ] All 12 sections (Hero → Footer) implemented and content-complete, no lorem ipsum in production
- [ ] Navigation transparent-to-solid transition verified on all breakpoints
- [ ] Logo reveal animation plays correctly once per session and has a reduced-motion equivalent
- [ ] Custom cursor degrades gracefully on touch devices (no phantom cursor elements)
- [ ] Featured Projects and Insights are fully CMS-driven; a non-developer can publish a new entry end-to-end
- [ ] Contact form submits successfully, sends confirmation + internal notification, and is spam-protected
- [ ] FAQ items are deep-linkable and marked up with `FAQPage` schema
- [ ] All Functional Requirements (§10) verified against live build
- [ ] Lighthouse Performance ≥ 90 mobile / ≥ 95 desktop on the production build
- [ ] WCAG 2.1 AA audit passed with zero critical/serious issues (automated + manual screen reader pass)
- [ ] All color/text pairings verified against the contrast rules in Design.md
- [ ] `prefers-reduced-motion` verified across every animated element listed in §15
- [ ] Sitemap, robots.txt, and structured data validated (Google Rich Results Test)
- [ ] Cross-browser QA complete (Chrome, Safari, Firefox, Edge + iOS/Android real devices)
- [ ] Stakeholder UAT sign-off obtained

---

*Related documents: [Architecture.md](./Architecture.md) · [Phases.md](./Phases.md) · [Design.md](./Design.md)*
