import React, { createContext, useContext, useMemo } from "react";

interface Layout {
  width: number;
  height: number;
  isPortrait: boolean;
  /** Multiply every authored (landscape) font size by this. */
  fs: (landscapePx: number) => number;
  /** Safe edge padding for the active format. */
  pad: number;
}

const LayoutCtx = createContext<Layout | null>(null);

export const LayoutProvider: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => {
  const value = useMemo<Layout>(() => {
    const isPortrait = height > width;
    return {
      width,
      height,
      isPortrait,
      // 0.72 keeps 78px headlines readable at 1080 wide without wrapping badly.
      fs: (px: number) => Math.round(px * (isPortrait ? 0.72 : 1)),
      pad: isPortrait ? 80 : 100,
    };
  }, [width, height]);

  return <LayoutCtx.Provider value={value}>{children}</LayoutCtx.Provider>;
};

export const useLayout = (): Layout => {
  const ctx = useContext(LayoutCtx);
  if (!ctx) throw new Error("useLayout must be used inside <LayoutProvider>");
  return ctx;
};
