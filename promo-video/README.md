# Vision Wings Marketing — 60s Brand Film

Cinematic dark-mode brand film. 1800 frames @ 30fps = **60.00s exactly**, rendered
in both 16:9 and 9:16 from one set of scene components.

- **[CREATIVE-PACKAGE.md](CREATIVE-PACKAGE.md)** — script, storyboard, camera, B-roll,
  on-screen text, animation notes, music, sound design, colour grade, AI image
  prompts, both format specs, and the full runtime table.
- **[voiceover-config.json](voiceover-config.json)** — 14 VO sections with timecodes
  and per-section emotional presets, ready for ElevenLabs.
- **[build-audio.sh](build-audio.sh)** — voiceover → normalise → verify → mix → mux.

## Quick start

```bash
cd remotion && npm install
npx remotion studio          # preview
npm run render:landscape     # 1920x1080
npm run render:portrait      # 1080x1920
```

## Adding the voiceover

The renders currently ship with the **music bed only** — voiceover generation needs
an ElevenLabs key, which was not present when this was built.

```bash
export ELEVENLABS_API_KEY="sk_..."   # PowerShell: $env:ELEVENLABS_API_KEY = "sk_..."
cd promo-video && bash build-audio.sh
```

That writes `remotion/out/promo-{landscape,portrait}-final.mp4`.

Whisper is optional but recommended — it verifies no VO section overruns the next.
Install with `pip install openai-whisper`. Without it the script skips step 3 and
you should spot-check the timing by ear.

## How the timing works

`TransitionSeries` **overlaps** adjacent scenes, so the timeline is shorter than the
sum of the scene lengths:

```
sum(scenes) − transitions × length = 2004 − (17 × 12) = 1800 frames = 60.00s
```

`TOTAL_FRAMES` in `src/Composition.tsx` derives this rather than hardcoding it, so
editing any scene duration keeps the composition length correct automatically.

## Structure

| Path | Purpose |
|---|---|
| `src/Composition.tsx` | Scene table, transitions, audio, both format roots |
| `src/theme.ts` | Colour and type tokens mirrored from `frontend/app/globals.css` |
| `src/LayoutContext.tsx` | `useLayout()` → `{width, height, isPortrait, fs(), pad}` |
| `src/components/WingsMark.tsx` | Generated from `frontend/logo svg/Wings.svg`, recolourable |
| `src/components/Particles.tsx` | One field, two directions — drives the S07→S08 pivot |
| `src/scenes/ActOne.tsx` | S01–S07 · hook + problem |
| `src/scenes/ActTwo.tsx` | S08–S10 · logo reveal, services, the work |
| `src/scenes/ActThree.tsx` | S11–S18 · results, trust, ending |

## Editing notes

- **All motion is frame-driven** (`useCurrentFrame()` + `interpolate()`/`spring()`).
  CSS transitions and Tailwind animations do not exist at render time — Remotion
  renders frame-by-frame. Never add them.
- **Composition IDs use hyphens.** Underscores break rendering.
- **No 3D transforms inside transitions** — they render unreliably. 3D lives inside
  scenes only (S09 constellation, S10 browser).
- Write scenes once; `useLayout()` adapts them to portrait. Don't fork components
  per format.

## Before publishing

`CREATIVE-PACKAGE.md` §15 lists the placeholder metrics (`+148 leads`,
`92% occupancy`, `3.4× ROAS`, `−312 customers`). Replace them with real client
figures or remove them. The **3.4× ROAS claim is the highest risk** — advertising a
specific return with no case study behind it is a regulatory problem in most
markets. The film works fine with the outcome words alone.
