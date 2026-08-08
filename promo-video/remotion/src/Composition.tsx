import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont as loadSpartan } from "@remotion/google-fonts/LeagueSpartan";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";

import { LayoutProvider } from "./LayoutContext";
import {
  S01ColdOpen, S02HookOne, S03HookTurn, S04Invisible, S05Slow, S06Flat, S07Lost,
} from "./scenes/ActOne";
import { S08Reveal, S09Services, S10TheWork } from "./scenes/ActTwo";
import {
  S11Visibility, S12Leads, S13Bookings, S14Sales, S15Speed, S16Craft, S17Partnership, S18Ending,
} from "./scenes/ActThree";

// Only the weights actually used, latin only. The unrestricted call fires 63
// font requests per render worker, which is pure overhead across 3,600 frames.
loadSpartan("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});
loadDMSans("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const TRANSITION = 12;

/**
 * Authored scene lengths. TransitionSeries overlaps each adjacent pair by
 * TRANSITION frames, so the timeline is shorter than the sum:
 *   2004 - (17 * 12) = 1800 frames = 60.00s @ 30fps
 */
export const SCENES = [
  { id: "s01", C: S01ColdOpen,     d: 100, act: "hook"    },
  { id: "s02", C: S02HookOne,      d:  84, act: "hook"    },
  { id: "s03", C: S03HookTurn,     d:  84, act: "hook"    },
  { id: "s04", C: S04Invisible,    d:  84, act: "problem" },
  { id: "s05", C: S05Slow,         d:  84, act: "problem" },
  { id: "s06", C: S06Flat,         d:  84, act: "problem" },
  { id: "s07", C: S07Lost,         d:  84, act: "problem" },
  { id: "s08", C: S08Reveal,       d: 134, act: "reveal"  },
  { id: "s09", C: S09Services,     d: 134, act: "reveal"  },
  { id: "s10", C: S10TheWork,      d: 134, act: "reveal"  },
  { id: "s11", C: S11Visibility,   d: 125, act: "results" },
  { id: "s12", C: S12Leads,        d: 125, act: "results" },
  { id: "s13", C: S13Bookings,     d: 125, act: "results" },
  { id: "s14", C: S14Sales,        d: 125, act: "results" },
  { id: "s15", C: S15Speed,        d: 112, act: "trust"   },
  { id: "s16", C: S16Craft,        d: 112, act: "trust"   },
  { id: "s17", C: S17Partnership,  d: 112, act: "trust"   },
  { id: "s18", C: S18Ending,       d: 162, act: "end"     },
] as const;

export const TOTAL_FRAMES =
  SCENES.reduce((n, s) => n + s.d, 0) - (SCENES.length - 1) * TRANSITION;

/**
 * Fade across act boundaries, slide within an act. No 3D transforms in
 * transitions — they do not render reliably.
 */
const Film: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {SCENES.map((s, i) => {
        const prev = SCENES[i - 1];
        const crossesAct = prev && prev.act !== s.act;
        return (
          <React.Fragment key={s.id}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={crossesAct ? fade() : slide({ direction: "from-right" })}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={s.d}>
              <s.C />
            </TransitionSeries.Sequence>
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

/**
 * Music is bundled; the voiceover is not committed (it needs an ElevenLabs
 * key). Drop voiceover-with-music.mp3 into public/ and flip HAS_VOICEOVER.
 */
const HAS_VOICEOVER = false;

const Soundtrack: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const seconds = durationInFrames / fps;
  if (HAS_VOICEOVER) {
    return <Audio src={staticFile("voiceover-with-music.mp3")} />;
  }
  return (
    <Audio
      src={staticFile("background-music.mp3")}
      volume={(f) => {
        const t = f / fps;
        const fadeIn = Math.min(1, t / 2);
        const fadeOut = Math.min(1, Math.max(0, (seconds - t) / 3));
        return 0.09 * fadeIn * fadeOut;
      }}
    />
  );
};

export const MyComposition: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <LayoutProvider width={1920} height={1080}>
      <Film />
    </LayoutProvider>
    <Soundtrack />
  </AbsoluteFill>
);

export const MyCompositionPortrait: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <LayoutProvider width={1080} height={1920}>
      <Film />
    </LayoutProvider>
    <Soundtrack />
  </AbsoluteFill>
);
