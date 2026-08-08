import React from "react";
import { Composition } from "remotion";
import { MyComposition, MyCompositionPortrait, TOTAL_FRAMES } from "./Composition";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Promo-Landscape"
      component={MyComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Promo-Portrait"
      component={MyCompositionPortrait}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
