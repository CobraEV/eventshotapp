"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { initLenis } from "@/lib/lenis";

const CtaBg = () => {
  // Lenis-synced scroll
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const lenis = initLenis();
    const onScroll = ({ scroll }: { scroll: number }) => {
      scrollY.set(scroll);
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [scrollY]);

  // soften the scroll value
  const smooth = useSpring(scrollY, {
    damping: 40,
    stiffness: 200,
  });

  // transform y position of bubbles
  const y1 = useTransform(smooth, [0, 1000], [0, -50]);
  const y2 = useTransform(smooth, [0, 1000], [0, 50]);

  return (
    <div>
      <motion.div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/5 will-change-transform"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-secondary/5 will-change-transform"
        style={{ y: y2 }}
      />
    </div>
  );
};

export default CtaBg;
