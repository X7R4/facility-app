"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Media query preferences directly mimicking the HTML code
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      const lenis = new Lenis({
        smoothWheel: true,
        touchMultiplier: 1.15,
      });

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove((time) => {
          lenis.raf(time * 1000);
        });
        lenis.destroy();
      };
    }
  }, []);

  return <>{children}</>;
}
