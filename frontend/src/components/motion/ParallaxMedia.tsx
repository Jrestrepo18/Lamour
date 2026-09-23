"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * Wraps a `fill` image inside an overflow-hidden frame and drifts it slower
 * than the page as it scrolls out of view — the classic editorial parallax.
 * GSAP ScrollTrigger, so it runs on phones (iOS included) as well as desktop;
 * skipped entirely under prefers-reduced-motion. The image is pre-scaled so
 * the drift never reveals the frame's edge.
 */
export function ParallaxMedia({ children, distance = 14 }: { children: ReactNode; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { yPercent: 0, scale: 1.12 },
        {
          yPercent: distance,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, [distance]);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
