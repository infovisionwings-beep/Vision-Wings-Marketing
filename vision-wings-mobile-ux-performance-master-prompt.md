# Master Prompt — Vision Wings: Mobile UX + LCP/SI Performance

> **How to use this:** copy everything below the divider into Claude Code, Cursor, or whatever coding agent is pointed at the `vw-ashen` repo. It's written as instructions *to* the agent, not to you. Run Part A, B, and C as separate turns if you want smaller, more reviewable diffs — otherwise let it run straight through.

---

## Context

You're working on **Vision Wings**, a Next.js 15 (App Router) + TypeScript + Tailwind CSS + Radix UI site on Vercel (Postgres via Neon), live at `https://vw-ashen.vercel.app/`. It's a premium marketing-agency / brand-strategy site: a large hero headline, five detailed service cards, a stats strip, a portfolio grid, a "Cinematic Tour" video showcase, and an insights/blog section.

**Two goals in parallel — don't trade one for the other:**
1. The mobile experience should feel like a considered, native mobile product, not a squeezed-down desktop layout.
2. Mobile Lighthouse scores land in the "good" range: **LCP ≤ 2.5s** and **Speed Index ≤ 3.4s** (test throttled — Slow 4G, 4x CPU — via PageSpeed Insights or Chrome DevTools mobile emulation).

**Ground rules:**
- Work section by section (A, then B, then C). Build after each meaningful change — don't ship one giant diff.
- Don't rewrite copy, brand voice, or information architecture. This is a UX/performance pass, not a redesign.
- Never delete content just to inflate a score. Fix it structurally (defer, lazy-load, server-render) instead.
- Where a fix needs a real design call rather than a technical one, a default is given below — take it unless told otherwise.

---

## PART A — Mobile UI/UX

### A1. Header & mobile nav
- Hamburger/menu trigger: ≥44×44px hit area, ≥8px clearance from the screen edge.
- Drawer/overlay closes on backdrop tap, swipe-down, and Escape. Lock body scroll while it's open (`overflow: hidden` on `html`/`body`, or `overscroll-behavior: contain`).
- Keep the primary CTA ("Let's Build Together") reachable from the collapsed header — don't bury the one conversion action two taps deep.
- Visible focus states on every nav item, for keyboard and screen-reader users.

### A2. Hero
- `SEE WHAT OTHERS MISS`: fluid type via `clamp()`, e.g. `font-size: clamp(2rem, 8vw, 4.5rem);`. Check 320–390px widths for awkward wraps or orphan words.
- Sub-headline paragraph: cap line length to roughly 40–60 characters at mobile widths.
- CTA pair (`Let's Build Together` / `Explore Our Vision`): stack full-width vertically below ~480px, ≥12px gap, ≥48px tall each, primary visually dominant over secondary.
- Hero image: reserve its box with `aspect-ratio` (or explicit width/height) so nothing shifts while it loads — see Part B for how it's actually served.

### A3. Stats strip ($45M+ / 3.8× / 100% / <30d)
- Reflow to a 2×2 grid on mobile instead of a tall 4-row stack — a punchy proof-strip shouldn't cost a full screen of scroll.
- Alternative: horizontal scroll-snap row if 2×2 feels cramped at your current type scale.
- Check `<30d` doesn't wrap awkwardly after the `<`.

### A4. Service cards (the five numbered "what we do" cards)
This is the densest block on the page — title, description, a 4-item deliverables list, and stack tags, ×5.
- **Default recommendation:** collapse each card to title + description by default, with "Key Deliverables" and stack tags behind an expand/accordion trigger (Radix `Accordion` — already in your stack). Cuts scroll fatigue without permanently hiding anything.
- If you'd rather keep them fully expanded: consistent ~20–24px card padding, clear separation between cards, deliverables with enough line-height to be finger-scannable, stack tags that wrap inside the card without overflowing.
- Card 04 has an inline image — make sure it doesn't blow that card's height out relative to its siblings mid-scroll.

### A5. "How we operate" + sector list
- Three strength cards stack full-width, consistent spacing.
- Sector pills: `flex-wrap` with 8–12px gap — don't let the row overflow without a scroll affordance.

### A6. Work / portfolio grid
- Single column, full-width on mobile.
- The whole card is tappable, not just a small "view project" link.
- Lazy-load every portfolio image except one landing in the first viewport.
- Optional: horizontal scroll-snap row instead of a vertical stack, if you want it to feel more like a curated gallery than a list.

### A7. "Cinematic Tour" video cards
- **Never autoplay video on mobile.** Show a static poster/thumbnail with a play affordance; only load and initialize the player on tap. This protects users' mobile data and — see Part C — is one of the biggest Speed Index wins available on this page.
- Keep duration badges and labels legible over the thumbnail (check contrast/scrim strength).
- Tap target is the whole card, not just the play icon.

### A8. Insights/blog cards
- Comfortable line length on excerpts, full-card tap target, consistent spacing between the three numbered items.

### A9. Footer
- Collapse the three link columns (Expertise / Agency / Connect) into stacked single-column lists, or a simple accordion — dense multi-column footers are a common mobile pain point.
- Link tap targets ≥44px tall with enough vertical spacing to prevent mis-taps.

### A10. Forms (contact, login)
- `type="email"` / `inputmode="email"`, `type="tel"` where relevant, so the correct mobile keyboard appears.
- Input font-size ≥16px — smaller triggers iOS Safari's auto-zoom-on-focus.
- Persistent visible labels, not placeholder-only.
- Generous spacing between fields and buttons.

### A11. Cross-cutting
- No hover-only affordances — anything revealed on `:hover` on desktop needs a tap-triggered or always-visible equivalent on touch.
- Audit for horizontal overflow at 320–375px (fixed widths, negative margins, and unconstrained flex children are the usual culprits).
- Respect `prefers-reduced-motion` for scroll/parallax effects.
- Consider a persistent, thumb-reachable sticky bottom CTA bar ("Let's Build Together") — this is a lead-gen site, and it's a proven mobile conversion pattern. If added, respect the safe area: `padding-bottom: env(safe-area-inset-bottom);`.
- Test at 320px, 375px, 390px, and 412–430px widths.

---

## PART B — LCP (Largest Contentful Paint)

### B1. Confirm the actual LCP element first
Before changing anything, check the DevTools Performance panel or PageSpeed Insights for what Lighthouse is actually flagging as the LCP element. It's probably the hero image — but confirm. If it's the headline text instead, the fix is font-loading (B3), not image work.

### B2. Images
- The hero image currently resolves through `next/image` pointed at a `picsum.photos` placeholder — swap in the final optimized asset before this ships. Every external image origin adds its own DNS + TLS + TTFB cost that a same-origin/Vercel-optimized asset skips entirely.
- Add `priority` to the hero `<Image>` and to anything else in the first viewport — this preloads it and takes it out of lazy-loading.
- Set a real `sizes` attribute matching the image's actual rendered width per breakpoint:
  ```tsx
  <Image src={hero} alt="..." priority sizes="(max-width: 768px) 100vw, 50vw" />
  ```
  The resolved markup currently falls back to Next's largest default width bucket (`w=3840`). Verify in DevTools, on an actual mobile viewport, what's really being downloaded — a loose or missing `sizes` value can let phones pull a retina-desktop-sized candidate.
- Leave every other image on default lazy-loading — don't mark everything `priority`, that just relocates the bottleneck.
- Confirm `next.config` still has AVIF/WebP `formats` enabled (Next's default), and consider dropping `quality` below 75 for large non-hero images.

### B3. Fonts
- Load the display/headline typeface through `next/font/google` or `next/font/local`, not a blocking `<link>`/`@import` — this self-hosts the font and inlines loading metadata into the HTML with no extra blocking request.
- Set `display: 'swap'` so fallback text renders immediately instead of staying invisible during font load.

### B4. Rendering & data
- Keep the hero (and anything above the fold) as a Server Component, so its markup — including the final image URL — is present in the initial HTML rather than waiting on client hydration.
- If anything above the fold reads from Neon/Postgres, make sure that query is fast, and cache it or serve it via ISR (`revalidate`) if the data isn't request-specific. Slow server response time is one of the most common root causes of poor LCP.
- Wrap non-critical, below-the-fold data fetches in their own `Suspense` boundary so they can't block the hero's paint.

### B5. Render-blocking resources
- Audit `<head>` for blocking stylesheets or synchronous scripts missing `defer`/`async`.
- Add `rel="preconnect"` (with `dns-prefetch` as fallback) for any third-party origins still in play — analytics, remaining external image or embed hosts.

---

## PART C — Speed Index (SI)

### C1. Cut main-thread work
- Audit every `"use client"` boundary. On a card-heavy, hover-animated site like this, it's easy to mark a whole grid as client just because one button inside needs `onClick`. Push `"use client"` down to the smallest leaf that actually needs it (the accordion trigger, the menu button, the modal) — everything else stays a Server Component and ships zero JS.
- Run `@next/bundle-analyzer`. Any animation library pulled in for the micro-interactions is a good candidate to dynamically import instead of bundling into the initial load.

### C2. Defer what isn't visible yet
- Video players and modal content (contact form, login, video lightbox) shouldn't initialize until opened:
  ```tsx
  const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false });
  ```
  (Note: `ssr: false` inside `dynamic()` only works from a Client Component in the App Router — if the call site is currently a Server Component, wrap it in a small client wrapper.)
  Given how many "click to open/launch" interactions this page has, this is probably the single biggest Speed Index lever available.

### C3. Third-party scripts
- Load GA4/PostHog via `next/script` with `strategy="afterInteractive"` or `"lazyOnload"` — never as a plain blocking `<script>` in `<head>`.

### C4. Chase down the "LOADING" state
- When this page was pulled for this audit, the rendered output ended with a literal, unresolved `LOADING` string still on screen. Track down whatever component that belongs to (footer widget, stats counter, something client-fetched) and confirm it resolves cleanly in production. An indefinitely lingering loading state directly inflates Speed Index, since SI specifically measures how long the viewport takes to look visually complete.

---

## PART D — Verify

- [ ] Lighthouse mobile (PageSpeed Insights or DevTools, 4x CPU + Slow 4G) shows **LCP ≤ 2.5s** and **SI ≤ 3.4s**
- [ ] CLS stays ≤ 0.1 — layout stability and perceived speed are tightly linked, worth watching even though it's not the headline metric here
- [ ] Re-run Lighthouse after each Part, not just once at the end, so score changes are attributable to specific work
- [ ] Manually walk the page at 320px, 375px, 390px, and 412–430px
- [ ] If `@vercel/speed-insights` isn't wired in yet, add it for real-user data over time, not just synthetic lab runs
