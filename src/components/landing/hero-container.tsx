"use client";

import { ReactNode, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { initLenis } from "@/lib/lenis";

const HeroContainer = ({ children }: { children: ReactNode }) => {
  const rawScroll = useMotionValue(0);

  useEffect(() => {
    initLenis(rawScroll);
  }, [rawScroll]);

  // weichfedern
  const scroll = useSpring(rawScroll, { damping: 40, stiffness: 200 });

  const y = useTransform(scroll, [0, 500], [0, 100]);
  const opacity = useTransform(scroll, [0, 500], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 -z-10 will-change-transform"
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

export default HeroContainer;
