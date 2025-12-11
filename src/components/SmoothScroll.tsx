"use client";
import { initLenis } from "@/lib/lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = initLenis();

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
