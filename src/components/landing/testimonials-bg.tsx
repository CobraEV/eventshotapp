"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { initLenis } from "@/lib/lenis";

const TestimonialsBg = () => {
  // ── Scroll-linked opacity ──
  const rawScroll = useMotionValue(0);
  const smooth = useSpring(rawScroll, { damping: 40, stiffness: 200 });
  const opacity = useTransform(smooth, [1000, 1500], [0, 1]);

  useEffect(() => {
    const lenis = initLenis();
    const sync = ({ scroll }: { scroll: number }) => rawScroll.set(scroll);
    lenis.on("scroll", sync);
    return () => lenis.off("scroll", sync);
  }, [rawScroll]);

  const bubbleBase =
    "absolute rounded-full will-change-transform pointer-events-none";

  return (
    <motion.div className="absolute inset-0 -z-10" style={{ opacity }}>
      {/* Moving gradient */}
      <motion.div
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, var(--tw-gradient-from), transparent)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "50% 50%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent"
      />

      {/* Bubble 1 – primary */}
      <motion.div
        className={`${bubbleBase} top-1/2 left-1/4 w-64 h-64 bg-primary/10`}
        animate={{ x: [0, 30, -20, 15, 0], y: [0, -25, 15, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bubble 2 – secondary */}
      <motion.div
        className={`${bubbleBase} top-1/4 right-1/4 w-48 h-48 bg-primary/5`}
        animate={{ x: [0, -25, 20, -15, 0], y: [0, 20, -15, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default TestimonialsBg;
