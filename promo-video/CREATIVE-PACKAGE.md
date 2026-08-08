# Vision Wings Marketing — 60s Brand Film
## Complete Creative Package

**Title:** *Your Vision. Amplified.*
**Runtime:** 60.00s — 1800 frames @ 30fps
**Formats:** 16:9 (1920×1080) · 9:16 (1080×1920)
**Audience:** Hotels · restaurants · clinics · schools · local businesses · startups
**Reference grade:** Apple × Linear × Vercel × Stripe

> **Domain correction.** The brief specified `visionwingmarketing.com`. That domain does not resolve. The live site is **`visionwingsmarketing.com`** (Vision Win**gs**), confirmed against the production sitemap. All end cards use the correct domain.

---

## 0. Brand System (locked from your codebase)

Pulled from `frontend/app/globals.css` — these are your real tokens, not invented ones.

| Role | Token | Hex |
|---|---|---|
| Cinematic void (film base) | — | `#070B14` |
| Brand navy | `navy-950` | `#0F172A` |
| Elevated surface | `navy-900` | `#16213D` |
| **Accent — bronze** | `bronze-500` | `#B87333` |
| Accent light | `bronze-400` | `#C68E57` |
| Accent glow | `bronze-300` | `#D4A87A` |
| Primary text | `warm-50` | `#FFF8EF` |
| Muted text | `navy-300` | `#8891A3` |
| Glass fill | — | `rgba(255,255,255,0.04)` |
| Glass stroke | — | `rgba(255,255,255,0.08)` |

**Type:** League Spartan (display / headlines) · DM Sans (body / UI labels) — both already your site fonts.
**Logo assets:** `frontend/logo svg/Wings.svg` (clean 1024² vector), `VISION WINGS.svg` (wordmark), `Primary ICON.svg`.

**Core brand line (from your live site):** *"WE GIVE WINGS TO YOUR VISION"* — the requested end card *"Your Vision. Amplified."* is a direct tightening of it. Deliberate continuity, not a new claim.

---

## 1. Voice-Over Script (complete, with timecodes)

**Total: 101 words / 60s ≈ 101 wpm.** Deliberately sparse. Premium brand films breathe; the silence is doing work.

**Recommended voice:** **Daniel** (`onwK4e9ZLuTAKqWW03F9`) — authoritative, polished, broadcast/advertising. Closest to an Apple keynote read.
*Alternate:* Matilda (`XrExE9yKIg1WjnnlVkGX`) — warm confident female, if you want less corporate distance.

| # | In | Line | Emotion | Stability / Sim / Style |
|---|---|---|---|---|
| — | 0.0–3.2 | *(silence — sound design only)* | — | — |
| 1 | **3.2** | "Every day, remarkable businesses go unnoticed." | Intimate | 0.30 / 0.90 / 0.30 |
| 2 | **5.8** | "Your competitors aren't better — just easier to find." | Intimate | 0.30 / 0.90 / 0.30 |
| 3 | **9.2** | "An empty table at seven. A clinic with open slots. Rooms unbooked. Not because the work isn't good — because no one saw it." | Measured | 0.45 / 0.88 / 0.30 |
| 4 | **18.6** | "Vision Wings Marketing." | Confident | 0.60 / 0.85 / 0.25 |
| 5 | **21.9** | "One partner. Brand, website, search, ads, and social — moving together." | Confident | 0.60 / 0.85 / 0.25 |
| 6 | **26.6** | "Built and run by senior practitioners. Never juniors." | Confident | 0.60 / 0.85 / 0.25 |
| 7 | **30.3** | "So you get found first." | Rising | 0.55 / 0.85 / 0.30 |
| 8 | **33.8** | "Enquiries that arrive while you sleep." | Rising | 0.55 / 0.85 / 0.30 |
| 9 | **37.6** | "Tables filled. Rooms booked. Appointments confirmed." | Rising | 0.55 / 0.85 / 0.30 |
| 10 | **41.5** | "Growth you can actually measure." | Warm | 0.65 / 0.83 / 0.20 |
| 11 | **45.3** | "Mobile-first. Fast. Built to convert." | Warm | 0.65 / 0.83 / 0.20 |
| 12 | **48.7** | "Every project, senior-led. Complete transparency." | Warm | 0.65 / 0.83 / 0.20 |
| 13 | **51.8** | "This is what a real growth partner looks like." | Warm | 0.65 / 0.83 / 0.20 |
| 14 | **55.5** | "Your vision. Amplified." | Dramatic | 0.45 / 0.88 / 0.35 |

**Read direction:** Lines 1–3 are *quiet* — almost confessional, under the music. Line 4 is the pivot: the room opens up. Lines 7–9 accelerate slightly. Line 14 lands, then two full beats of silence before the fade.

---

## 2. Scene-by-Scene Storyboard

18 scenes. Every duration below is the **authored** length; `TransitionSeries` overlaps each pair by 12 frames, which is why the sum (2004) exceeds the timeline (1800).

### ACT I — HOOK · 0.00 → 7.73s

**S01 · Cold Open · 0.00–3.33s · 100f**
Aerial-abstract night city. Thousands of dark windows; exactly **one** warm bronze window glows. Very slow push-in.
*On-screen:* none.
*Note:* Not a single frame of text or logo. Earn the attention first.

**S02 · Hook Line 1 · 2.93–5.73s · 84f**
The city recedes into deep bokeh. Text resolves out of focus into focus.
*On-screen:* `Every day, remarkable businesses` / `go unnoticed.` (League Spartan 300, 78px, `#FFF8EF`)

**S03 · Hook Turn · 5.33–8.13s · 84f**
Two glass cards side by side, identical in quality. The right one lifts, brightens, gains a bronze rim-light. The left stays dim.
*On-screen:* `Your competitors aren't better.` / **`They're simply easier to find.`** (second line bronze `#C68E57`)

### ACT II — THE PROBLEM · 7.73 → 17.33s

**S04 · Invisible · 7.73–10.53s · 84f**
A search field types itself: `best restaurant near me`. Results populate — competitor, competitor, competitor. The business card sits far below the fold, greyed, ranked #47.
*On-screen:* `#47` in muted `#8891A3`.

**S05 · Slow · 10.13–12.93s · 84f**
A load bar crawls to 71% and stalls. A visitor silhouette turns and leaves. Counter: `4.3s`.
*On-screen:* `4.3s to load.` / `53% already left.`

**S06 · Flat · 12.53–15.33s · 84f**
An engagement chart flatlines across the frame — a single dead horizontal line, faint grid behind.
*On-screen:* `Engagement` (small label, muted)

**S07 · Lost · 14.93–17.73s · 84f**
Bronze particles — each one a customer — drift up and out of frame, dimming as they go. A counter ticks *down*.
*On-screen:* `Customers lost this month` `— 312`

### ACT III — VISION WINGS · 17.33 → 29.53s

**S08 · Logo Reveal · 17.33–21.80s · 134f** ⭐ *hero moment*
The escaping particles reverse. They rush back in, converge, and **form the Wings mark** — which strikes into solidity with a bronze specular sweep across it. Bloom pulse. Wordmark fades up beneath.
*On-screen:* Wings mark + `VISION WINGS MARKETING`

**S09 · Services Constellation · 21.40–25.87s · 134f**
Eight glass chips orbit the wings mark on a slow 3D-tilted plane, each springing in on stagger (4f apart):
`Branding` · `Web Development` · `SEO` · `Performance Marketing` · `Google Business Profile` · `Content Strategy` · `Social Media` · `AI-Powered Marketing`
Thin bronze connector lines draw between them — one system, not eight vendors.

**S10 · The Work · 25.47–29.93s · 134f**
A browser mockup in 3D perspective (`rotateY(-18deg) rotateX(6deg)`), floating, with a soft bronze under-glow and a real reflection. Site scrolls smoothly inside. A phone frame slides in front-right, in parallax.
*On-screen:* `Senior practitioners. Never juniors.`
*Note:* This is the **only** website footage in the film — supporting evidence, per brief. It never becomes a walkthrough.

### ACT IV — RESULTS · 29.53 → 44.60s

**S11 · Visibility · 29.53–33.70s · 125f**
A ranking list animates: the card climbs `#47 → #12 → #4 → #1`, each jump a spring, bronze glow intensifying at #1. Rivals slide down and desaturate.
*On-screen:* `More Visibility` + big `#1`

**S12 · Leads · 33.30–37.47s · 125f**
Enquiry cards stack in from the right on 3-frame stagger — WhatsApp, form fill, call. A counter rolls `0 → 148`.
*On-screen:* `More Leads` · `+148 this month`

**S13 · Bookings · 37.07–41.23s · 125f**
A calendar grid fills cell by cell with bronze — a hotel occupancy chart going from sparse to dense. Table icons flip to "reserved".
*On-screen:* `More Bookings` · `92% occupancy`

**S14 · Sales · 40.83–45.00s · 125f**
A revenue area chart draws left-to-right with a bronze gradient fill, then the axis label counts up.
*On-screen:* `More Sales` · `3.4× return on ad spend`
> ⚠️ **Placeholder metric.** Replace with a real client figure before publishing, or cut to `More Sales` alone. See §15.

**S15 · Speed & Mobile · 44.60–48.33s · 112f**
Three phones in a row, each loading instantly; a Lighthouse-style ring sweeps to `98`.
*On-screen:* `Mobile-first.` `98 / 100`

### ACT V — TRUST · 44.60 → 54.60s

**S16 · Craft · 47.93–51.67s · 112f**
A 3×2 grid of premium design frames tiles in on stagger, each a different sector: hotel, restaurant, clinic, school, boutique, startup. Depth-of-field falls off toward the edges.
*On-screen:* `Built for your sector.`

**S17 · Partnership · 51.27–55.00s · 112f**
Two glass panels converge and lock together with a bronze seam-light. Calm, symmetrical, confident.
*On-screen:* `Senior-led. Fully transparent.`

### ACT VI — ENDING · 54.60 → 60.00s

**S18 · Logo Reveal & CTA · 54.60–60.00s · 162f**
Everything falls away to void. The Wings mark draws itself in bronze light. Headline types on. Then the wordmark and URL. Specular sweep. Hold two beats. Fade to black.
*On-screen:*
```
Your Vision.
Amplified.

VISION WINGS MARKETING
visionwingsmarketing.com
```

---

## 3. Camera Directions

| Scene | Move | Detail |
|---|---|---|
| S01 | Slow push-in | 1.00 → 1.08 scale over 100f, `easeOutExpo`. Never linear. |
| S02 | Rack focus | Background bokeh 0→24px blur; text 12px→0px. Focus *pulls* to the words. |
| S03 | Subtle dolly-right | 0 → −40px x-drift. Parallax: right card moves 1.4×, left 0.6×. |
| S04–S07 | Locked off | Static. The stillness is the point — nothing is happening for this business. |
| S08 | Push-in + settle | Scale 1.15 → 1.00 with `spring({damping: 14})`. Overshoot ~2%, then rest. |
| S09 | Slow orbit | Plane rotates `rotateX(52deg)` and yaws −6° → +6° across the scene. |
| S10 | Parallax truck | Browser drifts −30px, phone +50px. Different rates = depth. |
| S11–S14 | Micro push | 1.00 → 1.04 only. Let the data animation carry it. |
| S15–S17 | Lateral drift | Slow −25px pan, continuous. Never stops moving. |
| S18 | Push-in → hold | 1.06 → 1.00 over 60f, then absolutely locked for the final 100f. |

**Rule:** every camera move uses `easeOutExpo` `cubic-bezier(0.16, 1, 0.3, 1)` — your own site's easing token. Nothing linear. Nothing ever stops abruptly.

**Depth of field:** simulated with layered `filter: blur()` driven by `interpolate()`. Foreground 0px, mid 2–4px, background 12–24px.

**Motion blur:** on fast-moving elements only (S07 particles, S12 card stack), via short trailing ghosts at 30–40% opacity offset 2–3 frames back.

---

## 4. B-Roll Suggestions

Shoot or license these as optional live-action plates. The film is designed to work **fully without them** — motion graphics carry it. These add warmth if you have budget.

**Act I–II (pain):**
- Restaurant owner at 7pm, wiping down an empty four-top, warm tungsten light, shallow DOF
- Hotel front desk, no queue, keys in rows behind
- Clinic waiting room, empty chairs, sun through blinds
- Hands on a phone, refreshing a booking dashboard, nothing new
- Shop shutter half-open at dusk

**Act III–IV (rise):**
- Same restaurant, full, warm, motion-blurred servers moving through
- Phone lighting up repeatedly on a counter — notification after notification
- Hotel corridor, housekeeping trolley, "occupied" tags
- Owner smiling at a tablet, genuinely reacting, not posed

**Act V (trust):**
- Two people at a monitor, one pointing, real conversation
- Over-shoulder of a designer working on a layout
- Handshake at a doorway — *cropped tight*, no cliché wide

**Shooting spec:** 4K, 24 or 48fps, shallow depth (f/1.8–2.8), practical warm sources, no fluorescent. Grade toward the palette in §9.

---

## 5. On-Screen Text (complete list)

| Scene | Text | Font | Size (16:9) | Color |
|---|---|---|---|---|
| S01 | *(none)* | — | — | — |
| S02 | Every day, remarkable businesses go unnoticed. | League Spartan 300 | 78px | `#FFF8EF` |
| S03 | Your competitors aren't better. / They're simply easier to find. | League Spartan 300 / 500 | 72px | `#FFF8EF` / `#C68E57` |
| S04 | best restaurant near me · #47 | DM Sans 400 | 32px / 64px | `#8891A3` |
| S05 | 4.3s to load. / 53% already left. | League Spartan 400 | 68px | `#FFF8EF` |
| S06 | Engagement | DM Sans 500 | 28px | `#8891A3` |
| S07 | Customers lost this month / −312 | DM Sans 500 / League Spartan 600 | 30px / 88px | `#8891A3` |
| S08 | VISION WINGS MARKETING | League Spartan 600, 0.18em tracking | 42px | `#FFF8EF` |
| S09 | 8 service chips | DM Sans 500 | 26px | `#FFF8EF` @ 0.9 |
| S10 | Senior practitioners. Never juniors. | League Spartan 400 | 54px | `#FFF8EF` |
| S11 | More Visibility / #1 | League Spartan 600 | 56px / 140px | `#FFF8EF` / `#B87333` |
| S12 | More Leads / +148 this month | League Spartan 600 / DM Sans | 56px / 34px | `#FFF8EF` |
| S13 | More Bookings / 92% occupancy | League Spartan 600 / DM Sans | 56px / 34px | `#FFF8EF` |
| S14 | More Sales / 3.4× return on ad spend | League Spartan 600 / DM Sans | 56px / 34px | `#FFF8EF` |
| S15 | Mobile-first. / 98 / 100 | League Spartan 400 | 60px / 96px | `#FFF8EF` / `#B87333` |
| S16 | Built for your sector. | League Spartan 400 | 58px | `#FFF8EF` |
| S17 | Senior-led. Fully transparent. | League Spartan 400 | 58px | `#FFF8EF` |
| S18 | Your Vision. / Amplified. | League Spartan 300 / 600 | 96px | `#FFF8EF` / `#B87333` |
| S18 | VISION WINGS MARKETING / visionwingsmarketing.com | League Spartan 600 / DM Sans 400 | 38px / 30px | `#FFF8EF` / `#8891A3` |

**Portrait (9:16):** multiply all sizes by **0.72**, stack every two-column layout vertically, increase edge padding to 80px.

---

## 6. Animation Notes

**Every value is frame-driven.** `useCurrentFrame()` + `interpolate()` / `spring()`. Zero CSS transitions, zero Tailwind animate classes — Remotion renders frame-by-frame and CSS animation simply does not exist at render time.

**Spring presets:**
```ts
const ENTER  = { damping: 14, mass: 0.8, stiffness: 100 }; // standard element entry
const HERO   = { damping: 12, mass: 1.0, stiffness: 90  }; // logo, big reveals — slight overshoot
const SETTLE = { damping: 22, mass: 0.6, stiffness: 120 }; // counters, precise UI — no bounce
```

**Signature techniques:**

1. **Particle reversal (S07 → S08).** The single best moment in the film. Same particle system, same seeded positions; `interpolate` the progress term from 1→0 instead of 0→1. The customers you lost become the wings. Cost: one sign flip. Payoff: the whole narrative pivots on it.

2. **Specular sweep.** A `linear-gradient(105deg, transparent 40%, rgba(255,248,239,0.55) 50%, transparent 60%)` translated across the mark from −150% to +150% over 20 frames, `mix-blend-mode: overlay`. This is what makes a logo feel *machined* rather than *placed*.

3. **Counter rolls.** Never `Math.round()` a linear interpolate — it stutters visibly. Drive with `spring(SETTLE)` and round the result: numbers decelerate into place like a mechanical odometer.

4. **Stagger.** Children enter 3–4 frames apart, never simultaneously. `delay = i * 4`. This one detail separates professional from template.

5. **Glassmorphism.** `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(24px)`, `border: 1px solid rgba(255,255,255,0.08)`, plus an inset top highlight `inset 0 1px 0 rgba(255,255,255,0.12)`. The inset highlight is what sells glass.

6. **Bronze glow.** `box-shadow: 0 0 80px rgba(184,115,51,0.35)` animated on opacity, never on blur radius (blur-radius animation is expensive and stutters).

**Transitions:** `fade` (18f) between acts, `slide from right` (12f) between scenes inside an act. No 3D transforms in transitions — they don't render reliably. 3D lives *inside* scenes only.

---

## 7. Music Direction

**Track:** `inspired-ambient-141686.mp3` (bundled, royalty-free, Pixabay) — ambient, cinematic, advertising-grade.

**Arc:**

| Time | Intent |
|---|---|
| 0–3s | Near-silence. A single low sub-drone. Space. |
| 3–17s | Sparse piano/pad. Minor tonality. Restrained — the pain section must feel *quiet*, not sad-dramatic. |
| **17.3s** | **The lift.** Music opens exactly on the logo reveal — pads bloom, low strings enter. This is the emotional hinge; it must hit the frame, not near it. |
| 18–30s | Steady confident pulse. Subtle rhythmic element enters. |
| 30–45s | Build. Layer every 4 seconds, tracking the four result beats. |
| 45–55s | Sustained plateau — warm, resolved, not climbing further. |
| 55–58s | Final swell into the logo. |
| 58–60s | Decay to a single sustained note, fade to silence. |

**Mix:** music at **0.09** under voice (this track is dense; 0.10 fights the VO). Fade in 2s, fade out from 57s over 3s. Duck −3dB under every VO line.

---

## 8. Sound Design

| Time | Cue |
|---|---|
| 0.0 | Deep sub-drone fade-in, 40Hz, cinematic room tone |
| 2.9 | Soft airy whoosh as city dissolves |
| 7.7 | Mechanical keyboard taps — search typing, 4 light clicks |
| 10.1 | Loading hum that *stalls* — pitch drops and stops. Uncomfortable on purpose. |
| 12.5 | Flatline tone — thin, sustained, medical. Very low in the mix. |
| 14.9 | Airy particle dissipation, panned wide, drifting up |
| **17.3** | **Reverse-swell into a deep impact.** The signature hit. Sub + a bright metallic ring. |
| 17.5 | Specular shimmer — high bell, short decay |
| 21.4 | 8 soft UI ticks on the chip stagger, panned across stereo field |
| 25.5 | Smooth glass-slide as browser enters |
| 29.5–44.6 | Four ascending "confirm" tones, one per result — each a semitone higher |
| 33.3 | Notification chimes on lead cards, layered, warm |
| 37.1 | Soft mechanical clicks as calendar fills |
| 44.6 | Rising whoosh into the trust act |
| 54.6 | Final impact — deepest hit in the film |
| 55.0 | Specular shimmer on the logo |
| 57.5 | Everything decays to silence |

**Principle:** every visual accent gets an audible partner. That sync is most of what "premium" actually means.

---

## 9. Color Grading Guide

**LUT intent:** cinematic teal-navy shadows, warm bronze highlights. A split-tone, not a wash.

| Control | Setting |
|---|---|
| Lift (shadows) | Push toward `#070B14` — blue-cyan bias, crush to true black at the very bottom |
| Gamma (mids) | Neutral, very slightly desaturated (−8%) so bronze reads as *the* color |
| Gain (highlights) | Warm toward `#D4A87A` |
| Contrast | S-curve, moderately strong. Deep blacks are non-negotiable in dark mode. |
| Saturation | Global 92%. Bronze channel selectively +15%. |
| Vignette | Subtle, −18% at corners, very soft falloff |
| Bloom | Bronze elements only, threshold high, radius 40px |
| Grain | 2–3% monochromatic. Kills the "clean digital" look and reads as film. |
| Halation | Light bronze halation on bright highlights (S08, S18) |

**Per-act shift:**
- **Act I–II:** desaturate an extra 12%, cooler, lower contrast — visually "flat" to match the story
- **Act III onward:** saturation returns, bronze warms, contrast opens
- **Act VI:** richest grade of the film

This grade progression is doing narrative work. The picture should literally get warmer as the story resolves.

---

## 10. AI Prompts for Every Visual

For Midjourney v7 / Sora / Runway Gen-4 / Kling / Flux. All share this suffix:

> `--style raw --ar 16:9 --v 7` · *cinematic, dark mode, navy #0F172A base, bronze #B87333 accent, volumetric light, shallow depth of field, anamorphic, film grain, no text, no watermark*

**S01 — Cold open**
> Aerial night view of a dense city grid from high above, thousands of dark windows, exactly one window glowing warm bronze amber, deep navy-black atmosphere, volumetric haze, extreme shallow depth of field, cinematic anamorphic, moody, minimal, Apple advertisement aesthetic

**S02 — Bokeh field**
> Abstract dark navy field of out-of-focus bronze bokeh lights, extreme shallow depth, cinematic negative space, premium minimal, soft volumetric glow

**S03 — Two businesses**
> Two identical elegant storefronts side by side at dusk, the right one lit with warm bronze light and visible customers, the left dark and empty, symmetrical composition, cinematic, shallow depth of field, moody navy tones

**S04 — Invisible**
> Abstract dark UI, a long vertical list of glowing cards receding into deep fog, one card far down dimmed and desaturated, navy and bronze, glassmorphism, minimal, cinematic depth

**S05 — Slow**
> A single thin horizontal progress bar stalled partway across a vast dark navy void, faint bronze fill, one silhouetted figure walking away into darkness, minimal, cinematic, high contrast

**S06 — Flatline**
> A single dead flat horizontal line across a dark navy grid, faint graph paper texture, one thin bronze line with no variation, clinical, minimal, cinematic emptiness, negative space

**S07 — Customers lost**
> Hundreds of small warm bronze particles of light drifting upward and dissipating into dark navy void, motion blur trails, dispersing, melancholy, cinematic volumetric, extreme depth of field

**S08 — Logo reveal** ⭐
> Thousands of bronze light particles rushing inward through dark navy void and converging into a single luminous abstract wing shape, energy convergence, dramatic volumetric god rays, metallic bronze specular highlight sweeping across, cinematic hero shot, Apple keynote reveal aesthetic

**S09 — Services constellation**
> Eight translucent frosted glass cards floating in orbital formation on a tilted 3D plane in dark navy space, connected by thin glowing bronze lines, glassmorphism, depth of field, premium UI, Linear and Vercel aesthetic

**S10 — The work**
> A floating browser window in 3D perspective over dark navy void, frosted glass chrome, warm bronze under-glow, a smartphone floating in front at an angle, soft reflections beneath, premium product render, Apple advertisement lighting

**S11 — Visibility**
> A vertical stack of glowing search result cards in dark navy space, the top card brilliantly lit in bronze and elevated above the rest, others dim and receding, dramatic rim lighting, glassmorphism, cinematic

**S12 — Leads**
> A cascade of translucent glass notification cards stacking diagonally in dark navy space, each with a soft bronze glow, motion blur on entry, depth of field, premium UI, floating

**S13 — Bookings**
> An abstract calendar grid in dark navy filling progressively with warm bronze light cells, glassmorphic, glowing from within, cinematic depth, minimal, premium

**S14 — Sales**
> An elegant ascending area chart with bronze gradient fill rising across dark navy void, glowing edge line, volumetric glow beneath the curve, minimal, cinematic, premium data visualization

**S15 — Mobile & speed**
> Three floating smartphones in a row in dark navy space, screens glowing warm, a circular bronze progress ring, product render lighting, soft reflections, Apple aesthetic, shallow depth

**S16 — Craft grid**
> A 3×2 grid of premium website design frames floating in dark navy space, each glowing softly, depth of field falling off toward the edges, glassmorphism, bronze accents, portfolio showcase, cinematic

**S17 — Partnership**
> Two large translucent frosted glass panels converging and locking together in dark navy void, a brilliant bronze seam of light where they meet, symmetrical, minimal, cinematic, volumetric

**S18 — Final logo**
> A luminous abstract wing mark drawing itself in liquid bronze light in pure black void, dramatic volumetric rays, metallic specular sweep, particles settling, cinematic hero logo reveal, Apple keynote finale, extreme minimalism

---

## 11. Remotion Implementation Plan

```
promo-video/
├── CREATIVE-PACKAGE.md          ← this document
├── voiceover-config.json        ← ready to run
└── remotion/
    ├── public/
    │   ├── wings.svg  ·  wordmark.svg
    │   └── background-music.mp3
    └── src/
        ├── Root.tsx                    Promo-Landscape + Promo-Portrait
        ├── theme.ts                    tokens from globals.css
        ├── LayoutContext.tsx           useLayout() → {width,height,isPortrait}
        ├── components/                 Glass · WingsMark · Counter · Sweep · Particles
        └── scenes/                      S01…S18
```

**Composition duration:** `1800` frames. Derived, not guessed:
`sum(scenes) − transitions × duration = 2004 − (17 × 12) = 1800`

**Multi-format:** one set of scene components. `LayoutProvider` supplies dimensions; scenes read `isPortrait` and adjust font scale (×0.72), padding (80px), and flex direction. Write once, render twice.

**Composition IDs:** `Promo-Landscape`, `Promo-Portrait` — hyphens only. Underscores break renders.

**Build order:** theme + layout → shared components → S18 first (validates the hero look) → S08 → remaining scenes → transitions → audio.

**Render:**
```bash
npx remotion render Promo-Landscape out/promo-landscape.mp4 --image-format png --crf 1
npx remotion render Promo-Portrait  out/promo-portrait.mp4  --image-format png --crf 1
```

---

## 12. 16:9 YouTube Version (1920×1080)

- Headlines 78–96px · body 32–44px
- Edge padding 100px · safe area 1720×880
- Two-column layouts allowed (S03 dual cards, S10 browser + phone)
- Service constellation is a wide 4×2 orbital plane
- S16 craft grid is 3 across × 2 down
- Browser mockup at 68% frame width
- **Use for:** YouTube, website hero, LinkedIn, presentations, trade displays

## 13. 9:16 Instagram Reel Version (1080×1920)

- All type ×0.72 · headlines 56–70px · body 24–32px
- Edge padding 80px
- **Every two-column layout stacks vertically**
- Service constellation becomes a vertical 2×4 column
- S16 craft grid becomes 2 across × 3 down
- Browser mockup rotates to a phone-forward composition — device is hero, browser recedes behind
- **Critical:** keep all text between 12% and 82% of frame height. IG UI covers top and bottom; the CTA at 55–60s must sit in the middle third or it lands under the caption bar.
- **Use for:** Reels, Stories, TikTok, YouTube Shorts

---

## 14. Runtime Table

| # | Scene | Act | Start | End | Duration | Frames |
|---|---|---|---|---|---|---|
| 01 | Cold Open | Hook | 0.00 | 3.33 | 3.33s | 100 |
| 02 | Hook Line 1 | Hook | 2.93 | 5.73 | 2.80s | 84 |
| 03 | Hook Turn | Hook | 5.33 | 8.13 | 2.80s | 84 |
| 04 | Invisible | Problem | 7.73 | 10.53 | 2.80s | 84 |
| 05 | Slow | Problem | 10.13 | 12.93 | 2.80s | 84 |
| 06 | Flat | Problem | 12.53 | 15.33 | 2.80s | 84 |
| 07 | Lost | Problem | 14.93 | 17.73 | 2.80s | 84 |
| 08 | **Logo Reveal** | Reveal | 17.33 | 21.80 | 4.47s | 134 |
| 09 | Services | Reveal | 21.40 | 25.87 | 4.47s | 134 |
| 10 | The Work | Reveal | 25.47 | 29.93 | 4.47s | 134 |
| 11 | Visibility | Results | 29.53 | 33.70 | 4.17s | 125 |
| 12 | Leads | Results | 33.30 | 37.47 | 4.17s | 125 |
| 13 | Bookings | Results | 37.07 | 41.23 | 4.17s | 125 |
| 14 | Sales | Results | 40.83 | 45.00 | 4.17s | 125 |
| 15 | Speed & Mobile | Trust | 44.60 | 48.33 | 3.73s | 112 |
| 16 | Craft | Trust | 47.93 | 51.67 | 3.73s | 112 |
| 17 | Partnership | Trust | 51.27 | 55.00 | 3.73s | 112 |
| 18 | **Ending** | End | 54.60 | 60.00 | 5.40s | 162 |

**Authored sum:** 2004 frames · **17 transitions × 12f:** −204 · **Timeline: 1800 frames = 60.00s**

| Act | Brief target | Actual | |
|---|---|---|---|
| Hook | 0–8s | 0.00–7.73s | ✅ |
| Problem | 8–18s | 7.73–17.33s | ✅ |
| Vision Wings | 18–30s | 17.33–29.53s | ✅ |
| Results | 30–45s | 29.53–44.60s | ✅ |
| Trust | 45–55s | 44.60–54.60s | ✅ |
| Ending | 55–60s | 54.60–60.00s | ✅ |

---

## 15. Before You Publish

**Substantiate or remove these.** They are placeholders chosen for visual rhythm, not claims I can support:

| Scene | Claim | Action |
|---|---|---|
| S07 | `−312 customers lost` | Illustrative. Keep only if you can frame it as a scenario, or drop the number and keep the visual. |
| S11 | `#1` ranking | Fine as aspiration; do not pair with a named client unless true. |
| S12 | `+148 leads` | Replace with a real client figure or delete. |
| S13 | `92% occupancy` | Replace or delete. |
| S14 | `3.4× ROAS` | **Highest risk.** Advertising a specific return with no case study behind it is a regulatory problem in most markets. Replace with a real, documented number or cut to `More Sales` alone. |
| S15 | `98/100` | Verifiable — run PageSpeed on a real client site and use the true score. |

The film is strong without any of these numbers. Outcome words alone (*More Visibility · More Leads · More Bookings · More Sales*) carry the act. **Recommendation: ship with real figures or no figures.**

**Also:** your live site positions to B2B SaaS, fintech, e-commerce and VC. This film targets hotels, restaurants, clinics and local businesses, per your brief. Sending local-business traffic to a page written for fintech buyers will cost you conversions — align the landing page before you run this as an ad.
