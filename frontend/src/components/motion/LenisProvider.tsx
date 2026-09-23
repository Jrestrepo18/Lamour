"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Access the live Lenis instance — e.g. to read `lenis.velocity` and drive the
 * coverage marquee's speed off real scroll speed in a later phase.
 */
export function useLenisInstance() {
  return useContext(LenisContext);
}

/**
 * Owns smooth scroll for the whole app and keeps GSAP's ScrollTrigger in sync
 * with it. Responsibility split:
 *  - Lenis: the physics of the scroll itself (this file only).
 *  - GSAP + ScrollTrigger: anything pinned or scrubbed to scroll position.
 *  - Framer Motion: one-shot viewport reveals, hover/tap micro-interactions,
 *    and mount/unmount transitions (preloader, gate, modals).
 * `respectReducedMotion` makes Lenis fall back to native 1:1 scrolling on its
 * own when the user has `prefers-reduced-motion` set — no extra branching
 * needed here.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      // Offset keeps anchor targets clear of the fixed header (Lenis ignores CSS scroll-padding).
      anchors: { offset: -110 },
      respectReducedMotion: true,
    });

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // gsap.ticker reports elapsed time in seconds; Lenis wants milliseconds.
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- publishes the instance created by this same effect, not derived from a render
    setLenis(instance);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
