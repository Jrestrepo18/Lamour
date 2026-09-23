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
export function ParallaxMedia({
  children,
  distance = 14,
  mode = "exit",
}: {
  children: ReactNode;
  distance?: number;
  /** "exit": drift while a top-of-page frame scrolls away. "through": drift across the whole pass of a mid-page section. */
  mode?: "exit" | "through";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const through = mode === "through";
      gsap.fromTo(
        el,
        { yPercent: through ? -distance / 2 : 0, scale: 1.12 },
        {
          yPercent: through ? distance / 2 : distance,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: through ? "top bottom" : "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
    return () => mm.revert();
  }, [distance, mode]);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
