"use client";

import { initLenis } from "@/lib/lenis";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const HowItWorksBg = () => {
  const rawScroll = useMotionValue(0);

  useEffect(() => {
    const lenis = initLenis();
    const sync = ({ scroll }: { scroll: number }) => rawScroll.set(scroll);
    lenis.on("scroll", sync);
    return () => lenis.off("scroll", sync);
  }, [rawScroll]);

  // Scale linked to scroll
  const smooth = useSpring(rawScroll, { damping: 40, stiffness: 200 });
  const scale = useTransform(smooth, [0, 1500], [0.9, 1.1]);

  return (
    <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
      {/* Bubble 1 */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary will-change-transform"
        style={{ scale }}
        animate={{
          x: [0, 20, 0, -15, 0],
          y: [0, -10, 5, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bubble 2 */}
      <motion.div
        className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-primary will-change-transform"
        style={{ scale }}
        animate={{
          x: [0, -25, 10, -15, 0],
          y: [0, 10, -10, 5, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default HowItWorksBg;
