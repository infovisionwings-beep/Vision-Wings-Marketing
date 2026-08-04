# SEO Audit Report — visionwingsmarketing.com

**Audit Date:** August 4, 2026  
**Site Type:** Marketing Agency (Service-based)  
**Framework:** Next.js (App Router, Turbopack)  
**Hosting:** Vercel  

---

## Executive Summary

**Overall Health: 🟡 Moderate — Strong foundation with critical issues to fix**

Your site has a solid technical base (Next.js on Vercel, HTTPS, structured data, Google Analytics). However, there are several **high-impact SEO issues** that are likely suppressing your organic visibility. The top priorities are:

1. **🔴 www vs non-www domain mismatch** — robots.txt, sitemap, schema, and OG tags all reference `www.visionwingsmarketing.com` while the site is served from `visionwingsmarketing.com`
2. **🔴 Duplicate/generic OG & Twitter meta tags** across all pages
3. **🟠 Missing canonical tags** on all pages
4. **🟠 No OG image** declared anywhere
5. **🟠 Login and onboarding pages in sitemap** (shouldn't be indexed)

> [!CAUTION]
> The www/non-www split is the single most critical issue. Google may see these as two separate sites, splitting link equity and causing indexation confusion.

### Quick Wins Identified
- Add canonical tags to every page
- Fix OG/Twitter meta to be page-specific
- Remove `/login` and `/onboarding` from sitemap
- Add an OG image
- Consolidate www vs non-www

---

## 1. Crawlability & Indexation

### ✅ Robots.txt — Good (minor issue)

```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://www.visionwingsmarketing.com/sitemap.xml
```

| Check | Status | Notes |
|-------|--------|-------|
| Important pages allowed | ✅ | `/admin` and `/api` properly blocked |
| Sitemap referenced | ⚠️ | Points to `www.` subdomain — mismatch with actual domain |

> [!IMPORTANT]
> **Fix:** Change sitemap reference to `https://visionwingsmarketing.com/sitemap.xml` (without `www`) or implement a 301 redirect from one domain variant to the other.

---

### ⚠️ XML Sitemap — Needs Fixes

**URL:** [/sitemap.xml](https://visionwingsmarketing.com/sitemap.xml) — ✅ Accessible  
**Format:** Valid XML  
**URLs listed:** 14 pages  

| Issue | Impact | Details |
|-------|--------|---------|
| 🔴 All URLs use `www.` prefix | **High** | Sitemap lists `https://www.visionwingsmarketing.com/...` but the site serves from `https://visionwingsmarketing.com`. Google may not associate these. |
| 🟠 `/login` in sitemap | **Medium** | Login pages should be noindexed and excluded from sitemap |
| 🟠 `/onboarding` in sitemap | **Medium** | Client onboarding flow — should not be publicly indexed |
| 🟡 All `<lastmod>` identical | **Low** | All set to `2026-08-04T03:32:42.880Z` — Google may eventually ignore `<lastmod>` if it doesn't reflect real changes |
| 🟡 `<changefreq>` and `<priority>` used | **Low** | Google ignores these fields, but they don't cause harm |

**Missing from sitemap:**
- Individual insight article pages (e.g., `/insights/thought-process-ideas-log`)
- Individual work/case study pages (e.g., `/work/lumina`, `/work/aero`, `/work/vertex`)
- `/videos` page is included ✅

> [!WARNING]
> Your case study and blog article pages are **not in the sitemap**. These are your most indexable, keyword-rich content pages and should absolutely be included.

---

### 🔴 Canonicalization — Missing

| Check | Status |
|-------|--------|
| Canonical tags on pages | ❌ **Not found on any page** |
| Self-referencing canonicals | ❌ Missing |
| www vs non-www consistency | ❌ **Conflicting** |

**Evidence:**
- Homepage HTML: No `<link rel="canonical">` found
- Contact page: No canonical
- Work page: No canonical
- Insights page: No canonical

**OG URL is hardcoded to www:** `<meta property="og:url" content="https://www.visionwingsmarketing.com">`  
This is the same on ALL pages (doesn't change per page).

> [!CAUTION]
> **Critical Fix Required:** Add `<link rel="canonical" href="...">` to every page with the correct, absolute URL. Decide on www vs non-www and enforce with a 301 redirect.

---

## 2. Technical Foundations

### ✅ HTTPS & Security

| Check | Status |
|-------|--------|
| HTTPS across entire site | ✅ |
| Valid SSL certificate | ✅ (Vercel-managed) |
| Mixed content | ✅ None detected |
| `lang="en"` on `<html>` | ✅ |

### ✅ Mobile-Friendliness

| Check | Status |
|-------|--------|
| Responsive design | ✅ Tailwind breakpoints, mobile-first |
| Viewport configured | ✅ `width=device-width, initial-scale=1` |
| Tap targets ≥ 44px | ✅ All interactive elements have `min-h-[44px]` |
| Mobile bottom navigation | ✅ Present for `lg:hidden` |

### ✅ URL Structure

| Check | Status |
|-------|--------|
| Readable URLs | ✅ (`/contact`, `/work`, `/insights`) |
| Lowercase, hyphen-separated | ✅ |
| No unnecessary parameters | ✅ |
| Consistent structure | ✅ |

### ⚠️ Site Speed & Core Web Vitals

> [!NOTE]
> PageSpeed Insights requires JavaScript to render results. Run the test manually at [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fvisionwingsmarketing.com) for exact scores.

**Observations from HTML analysis:**

| Factor | Assessment |
|--------|------------|
| Next.js SSR | ✅ Server-side rendered HTML (not client-only) |
| Image optimization | ⚠️ Using `/_next/image` proxy for Unsplash images — good for format/size, but external images add latency |
| Font loading | ✅ WOFF2 fonts preloaded |
| JS bundle | ⚠️ **13+ async script chunks** on homepage — may impact INP |
| CSS delivery | ✅ Inline critical CSS via `data-precedence="next"` |
| Logo preload | ✅ `<link rel="preload" as="image" href="/logo-svg/Primary%20ICON.svg">` |

**Recommendations:**
- Audit unused JS chunks — consider code splitting further
- Replace Unsplash stock images with self-hosted optimized versions for faster LCP
- Test actual CWV scores via PageSpeed Insights or Chrome UX Report

---

## 3. On-Page SEO

### Title Tags

| Page | Title | Length | Assessment |
|------|-------|--------|------------|
| Homepage | `Vision Wings Marketing - Strategic Growth & Marketing Agency` | 61 chars | ✅ Good — keyword-rich, brand at end |
| Contact | `Contact Us \| Vision Wings Marketing` | 37 chars | ✅ Clear |
| Work | `Marketing Campaigns & Work \| Vision Wings Marketing` | 53 chars | ✅ Good |
| Insights | `Marketing Insights & Perspectives \| Vision Wings Marketing` | 60 chars | ✅ Good |

**Verdict:** ✅ All titles are unique, descriptive, and within character limits.

---

### Meta Descriptions

| Page | Description | Length | Assessment |
|------|-------------|--------|------------|
| Homepage | "Vision Wings Marketing is a strategic marketing and growth partner based in Varanasi, elevating growth-stage businesses." | 121 chars | ✅ Good |
| Contact | "Tell us about your growth goals. A senior brand strategist will respond within 24 hours." | 89 chars | ✅ Clear CTA |
| Work | "A curation of high-velocity marketing campaigns, conversion funnels, and brand acceleration that drive outsized growth." | 121 chars | ✅ Good |
| Insights | "Senior strategic viewpoints on brand acceleration, growth marketing, performance advertising, and digital conversion." | 118 chars | ✅ Good |

**Verdict:** ✅ All unique and compelling.

---

### 🔴 Open Graph & Twitter Meta — DUPLICATE across all pages

This is a significant issue:

| Meta Tag | Value on ALL Pages |
|----------|--------------------|
| `og:title` | "Vision Wings Marketing - Strategic Growth & Marketing Agency" |
| `og:description` | "Vision Wings Marketing is a strategic marketing agency and growth partner." |
| `og:url` | `https://www.visionwingsmarketing.com` |
| `og:type` | "website" |
| `og:image` | ❌ **MISSING** |
| `twitter:title` | Same as og:title |
| `twitter:description` | Same as og:description |
| `twitter:image` | ❌ **MISSING** |

> [!WARNING]
> **Impact: High.** Every page shares the same OG/Twitter meta. When someone shares `/contact` or `/insights/thought-process-ideas-log` on social media, it will show the homepage's generic title and description. Additionally, `og:url` always points to the homepage with `www.` — it never reflects the actual page URL.

**Fix:**
1. Make `og:title`, `og:description`, and `og:url` dynamic per page in your Next.js metadata
2. Add an `og:image` (1200x630px recommended)
3. Remove `www.` from `og:url` or redirect to `www.`

---

### Heading Structure

| Page | H1 | Assessment |
|------|----|------------|
| Homepage | "WE GIVE WINGS TO YOUR VISION" | ✅ Single H1, keyword-relevant |
| Contact | "Initiate Strategic Partnership." | ✅ Single H1 |
| Work | "Campaigns that soar." | ⚠️ Creative but no keywords — consider "Marketing Campaigns & Case Studies" |
| Insights | "Thinking & Perspectives." | ⚠️ Same issue — no searchable keywords in H1 |

**Homepage H2s:** ✅ Good hierarchy with section headings  
**Nested `<main>` tags:** ⚠️ Work and Insights pages have `<main>` inside `<main>` — technically invalid HTML

---

### 🔴 Missing Keywords Meta — Duplicate

All pages share identical keywords:
```
marketing agency,brand strategy,business consultancy,growth marketing,Vision Wings Marketing,Varanasi agency
```

> [!NOTE]
> Google ignores the `keywords` meta tag, but if you keep it, make it page-specific. More importantly, ensure your **content** naturally targets relevant keywords per page.

---

## 4. Structured Data / Schema Markup

### ✅ JSON-LD Present — ProfessionalService

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Vision Wings Marketing",
  "image": "https://www.visionwingsmarketing.com/logo-svg/Primary%20ICON.svg",
  "description": "Vision Wings Marketing is a strategic marketing agency and growth partner based in Varanasi, India.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kandawa",
    "addressLocality": "Varanasi",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "221106",
    "addressCountry": "IN"
  },
  "url": "https://www.visionwingsmarketing.com",
  "telephone": "+918081952359"
}
```

| Check | Status |
|-------|--------|
| Schema present | ✅ |
| Type appropriate | ✅ `ProfessionalService` is correct for an agency |
| NAP consistent | ⚠️ `url` uses `www.` variant |
| Missing fields | ⚠️ No `sameAs` (social profiles), no `openingHours`, no `areaServed`, no `priceRange` |

**Recommendations:**
- Add `sameAs` with LinkedIn, Twitter URLs  
- Add `areaServed` since you serve globally  
- Consider `Organization` schema in addition to `ProfessionalService`
- For blog posts: Add `Article` or `BlogPosting` schema on insight pages
- For case studies: Add `CreativeWork` schema on work pages

---

## 5. Content Quality & E-E-A-T

### Content Assessment

| Signal | Status |
|--------|--------|
| Author bylines | ✅ Present on insights (K Singh, Srijan Kumar, Amélie Laurent) |
| Author photos | ✅ Present (Unsplash stock — consider using real photos) |
| Contact information | ✅ Email, phone, address visible |
| Privacy/Terms pages | ✅ 8 legal pages in footer |
| Case studies | ✅ 3 case studies present |
| Blog content | ✅ 3 articles/insights |

### ⚠️ Concerns

| Issue | Impact |
|-------|--------|
| Author images are Unsplash stock photos | **Medium** — Reduces trust signals for E-E-A-T |
| Only 3 case studies | **Medium** — More portfolio depth needed |
| Only 3 blog posts | **Medium** — Content velocity is low for SEO authority |
| No "About Us" dedicated page | **Medium** — Team page with real bios would boost E-E-A-T |
| Footer social links go to generic `linkedin.com` and `twitter.com` | **High** — These should link to actual company profiles |

---

## 6. Internal Linking

| Check | Status |
|-------|--------|
| Navigation structure | ✅ Clear — Vision, Strategy, Work, Insights, Contact |
| Footer links | ✅ Comprehensive — Expertise, Agency, Connect sections |
| CTA buttons | ✅ Multiple ("Launch Your Campaign", "Start Project") |
| Cross-linking between content | ⚠️ Blog posts don't seem to link to services or case studies |

### ⚠️ Footer Link Issues
- Footer "EXPERTISE" links use `#strategy`, `#design`, `#growth`, `#web` — these are **anchor links** that only work on the homepage. On other pages, they lead nowhere.
- Footer "AGENCY" → "About Us" links to `#about` — no dedicated about page exists
- Contact link in footer goes to `#contact` instead of `/contact`

---

## 7. Image Optimization

| Check | Status |
|-------|--------|
| Alt text on images | ✅ Descriptive alt text present |
| Lazy loading | ✅ `loading="lazy"` on non-critical images |
| Responsive images | ✅ `srcSet` with multiple widths via Next.js Image |
| Image format | ⚠️ Using Unsplash URLs — rely on Next.js image proxy for WebP conversion |
| Self-hosted images | ❌ All content images are from Unsplash — adds external dependency |

---

## 8. Analytics & Tracking

| Tool | Status |
|------|--------|
| Google Analytics 4 | ✅ `G-KGL4WL9DLW` |
| Google Tag Manager | ✅ via gtag.js |
| Search Console | ❓ Unknown — **verify you've claimed the property** |

---

## Prioritized Action Plan

### 🔴 Priority 1 — Critical (Do This Week)

| # | Action | Impact |
|---|--------|--------|
| 1 | **Decide www vs non-www** and set up a 301 redirect from the other. Update robots.txt, sitemap, schema `url`, and OG `og:url` to match. | Prevents split indexing |
| 2 | **Add `<link rel="canonical">` to every page** with the correct absolute URL | Prevents duplicate content |
| 3 | **Make OG/Twitter meta dynamic per page** — each page needs its own `og:title`, `og:description`, `og:url` | Fixes social sharing & prevents duplicate signals |
| 4 | **Add an `og:image`** (1200x630px) to all pages | Massively improves social sharing CTR |

### 🟠 Priority 2 — High Impact (Do This Month)

| # | Action | Impact |
|---|--------|--------|
| 5 | **Remove `/login` and `/onboarding` from sitemap** and add `noindex` to these pages | Prevents thin/gated pages from being indexed |
| 6 | **Add individual insight and case study URLs to sitemap** | Your best content isn't being signaled to Google |
| 7 | **Fix footer navigation links** — replace `#anchor` links with proper page URLs | Prevents broken navigation on non-homepage |
| 8 | **Update social media links** in footer to actual company profiles | Trust signal for E-E-A-T |
| 9 | **Fix nested `<main>` tags** on Work and Insights pages | Invalid HTML |

### 🟢 Priority 3 — Quick Wins

| # | Action | Impact |
|---|--------|--------|
| 10 | Add `Article`/`BlogPosting` schema to insight pages | Eligible for rich results |
| 11 | Add `sameAs` to Organization schema | Better knowledge graph signals |
| 12 | Replace Unsplash stock author photos with real team photos | E-E-A-T boost |
| 13 | Verify Google Search Console for `visionwingsmarketing.com` | Essential for monitoring |

### 📈 Priority 4 — Long-Term Growth

| # | Action | Impact |
|---|--------|--------|
| 14 | Create a dedicated "About Us" page with team bios | E-E-A-T authority |
| 15 | Increase content velocity — aim for 2-4 blog posts/month | Topical authority |
| 16 | Add more case studies with detailed results/metrics | Demonstrates experience |
| 17 | Build service-specific landing pages (e.g., `/services/brand-strategy`) | Target long-tail keywords |
| 18 | Self-host critical images instead of relying on Unsplash | Faster LCP, no external dependency |
| 19 | Run PageSpeed Insights and optimize based on actual CWV scores | Technical ranking factor |

---

## Summary Scorecard

| Category | Score | Notes |
|----------|-------|-------|
| Crawlability | 🟡 6/10 | Robots.txt OK but sitemap has issues |
| Indexation | 🔴 4/10 | No canonicals, www mismatch, missing pages in sitemap |
| Technical | 🟢 8/10 | Strong Next.js foundation, HTTPS, responsive |
| On-Page | 🟡 6/10 | Good titles/descriptions, but duplicate OG tags |
| Content Quality | 🟡 6/10 | Good start, needs more depth and volume |
| Schema/Structured Data | 🟡 6/10 | Basic schema present, needs expansion |
| Internal Linking | 🟡 5/10 | Good nav, broken anchor links in footer |

**Overall Score: 5.9/10** — Solid design and technical foundation, but critical crawlability/indexation issues are likely preventing organic growth.

---

> [!TIP]
> The fastest ROI actions are **#1 (www redirect)**, **#2 (canonicals)**, and **#3 (dynamic OG tags)**. These can be implemented in a single Next.js middleware + metadata update and will have immediate impact on how Google indexes and displays your site.
