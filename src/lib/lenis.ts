// lib/lenis.ts
import Lenis from "lenis";
import { MotionValue } from "framer-motion";

let lenis: Lenis | null = null;

export const initLenis = (scrollMV?: MotionValue<number>) => {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.08, // smoothness   (0-1 – kleiner = weicher)
    wheelMultiplier: 1, // z.B. 0.8 auf Mac-Trackpads
    smoothWheel: true,
    orientation: "vertical",
  });

  const raf = (time: number) => {
    lenis!.raf(time);
    // <<< 1x pro Frame Synchro mit Framer Motion >>>
    if (scrollMV) scrollMV.set(lenis!.scroll);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenis;
};
