# Graph Report - .  (2026-07-23)

## Corpus Check
- 93 files · ~113,936 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 206 nodes · 231 edges · 27 communities (14 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Unknown
- UI Components & Sections
- React & Dependencies
- DevDependencies & Types
- Project Planning & Docs
- TS Compiler Options
- App Layout & Navigation
- TS File References
- Package Manifest
- Animation & Scroll Arch
- CMS & DB Architecture
- Agent Instructions
- Accessibility Standards
- ESLint Config
- Next.js Config
- PostCSS Config
- ISR Architecture
- App Router Architecture
- Color System
- Animation Easing
- Typography Scale
- Performance Budget
- Target Audience
- Readme
- Naming Conventions

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `include` - 7 edges
3. `RevealOnScroll()` - 6 edges
4. `getProjects()` - 5 edges
5. `scripts` - 5 edges
6. `Product Requirements Document` - 5 edges
7. `Globe, Wing & Eagle Eye Metaphor` - 5 edges
8. `Technical Architecture Document` - 5 edges
9. `ProjectForm()` - 4 edges
10. `db` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Design System Document` --semantically_similar_to--> `Design Token CSS Variable Architecture`  [INFERRED] [semantically similar]
  Design.md → Architecture.md
- `Project Phases Document` --cites--> `Product Requirements Document`  [EXTRACTED]
  Phases.md → PRD.md
- `Signature Logo Reveal Sequence` --implements--> `Globe, Wing & Eagle Eye Metaphor`  [EXTRACTED]
  Design.md → PRD.md
- `Custom Aperture Precision Cursor` --implements--> `Eagle Eye Symbol (Precision & Insight)`  [INFERRED]
  Design.md → PRD.md
- `Editorial Over Promotional Philosophy` --implements--> `See What Others Miss Positioning`  [INFERRED]
  Design.md → PRD.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Logo Metaphor Triad** — prd_globe_symbol, prd_wing_symbol, prd_eagle_eye_symbol [EXTRACTED 1.00]
- **Scroll & Motion Control Architecture** — architecture_lenis_scroll, architecture_framer_motion, architecture_gsap_animation, architecture_lenis_single_scroll_truth [EXTRACTED 1.00]
- **Custom CMS & Backend Stack** — idea_cms_architecture_pivot, idea_neon_sql_drizzle, idea_vercel_blob_storage, works_admin_portal [EXTRACTED 1.00]

## Communities (27 total, 13 thin omitted)

### Community 0 - "Unknown"
Cohesion: 0.12
Nodes (12): getInsights(), createProject(), getProjects(), updateProject(), uploadImage(), AdminDashboard(), ProjectsPage(), ProjectForm() (+4 more)

### Community 1 - "UI Components & Sections"
Cohesion: 0.13
Nodes (11): AnimatedLogoProps, RevealOnScroll(), RevealOnScrollProps, AboutVision(), Hero(), Insights, Services, projects (+3 more)

### Community 2 - "React & Dependencies"
Cohesion: 0.09
Nodes (23): clsx, drizzle-orm, framer-motion, lucide-react, @neondatabase/serverless, next, dependencies, clsx (+15 more)

### Community 3 - "DevDependencies & Types"
Cohesion: 0.10
Nodes (21): dotenv, drizzle-kit, eslint, eslint-config-next, devDependencies, dotenv, drizzle-kit, eslint (+13 more)

### Community 4 - "Project Planning & Docs"
Cohesion: 0.11
Nodes (20): Technical Architecture Document, Design Token CSS Variable Architecture, Vision Wing Technical Stack, Custom Aperture Precision Cursor, Design System Document, Editorial Over Promotional Philosophy, Signature Logo Reveal Sequence, Thought Process & Ideas Log Document (+12 more)

### Community 5 - "TS Compiler Options"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 6 - "App Layout & Navigation"
Cohesion: 0.15
Nodes (7): dmSans, leagueSpartan, metadata, Footer(), SmoothScrollProvider(), lenis, lenis

### Community 7 - "TS File References"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 8 - "Package Manifest"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 9 - "Animation & Scroll Arch"
Cohesion: 0.40
Nodes (5): Framer Motion Animation System, GSAP Path Drawing System, Lenis Smooth Scroll Engine, Lenis Single Source of Scroll Truth Pattern, RevealOnScroll Entrance Wrapper

### Community 10 - "CMS & DB Architecture"
Cohesion: 0.40
Nodes (5): Sanity.io Headless CMS Strategy, Sanity to Custom Admin Portal Pivot, Neon SQL & Drizzle ORM Stack, Vercel Blob Storage Solution, Custom Admin Portal Implementation

### Community 11 - "Agent Instructions"
Cohesion: 0.67
Nodes (3): AGENTS.md Document, Next.js Agent Rules & Deprecation Guidance, CLAUDE.md Document

## Knowledge Gaps
- **83 isolated node(s):** `leagueSpartan`, `dmSans`, `metadata`, `AnimatedLogoProps`, `RevealOnScrollProps` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `React & Dependencies` to `Package Manifest`, `App Layout & Navigation`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `lenis` connect `App Layout & Navigation` to `React & Dependencies`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **What connects `leagueSpartan`, `dmSans`, `metadata` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Unknown` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._
- **Should `UI Components & Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._
- **Should `React & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `DevDependencies & Types` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._