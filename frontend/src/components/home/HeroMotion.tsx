"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * The hero's scroll choreography, tied to the scroll position (scrubbed, so it
 * moves exactly as fast as the finger): the photo drifts down and slowly
 * zooms in, a warm veil settles over it, and the copy rises and softens as it
 * leaves — a calm "breath out" instead of a static block sliding away.
 * Renders nothing; it animates the [data-hero-*] parts of its parent section.
 * Skipped under prefers-reduced-motion.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useGsapContext(() => {
    const section = marker.current?.closest<HTMLElement>("[data-hero]");
    if (!section) return;
    const q = (name: string) => section.querySelector<HTMLElement>(`[data-hero-${name}]`);
    const media = q("media");
    const veil = q("veil");
    const copy = q("copy");
    const cue = q("cue");

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 1024px)",
      },
      (ctx) => {
        if (!ctx.conditions?.motion) return;
        const desktop = ctx.conditions.desktop;
        const scrub = { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 };

        if (media) gsap.fromTo(media, { yPercent: 0, scale: 1.06 }, { yPercent: desktop ? 10 : 18, scale: 1.22, ease: "none", scrollTrigger: scrub });
        if (veil) gsap.fromTo(veil, { opacity: 0 }, { opacity: 0.55, ease: "none", scrollTrigger: scrub });
        if (copy) {
          gsap.fromTo(
            copy,
            { y: 0, opacity: 1 },
            // Phones: the ivory sheet keeps rising over the photo; desktop: the column lifts and fades.
            { y: desktop ? -90 : -36, opacity: desktop ? 0.3 : 1, ease: "none", scrollTrigger: { ...scrub, end: desktop ? "bottom top" : "bottom 40%" } },
          );
        }
        if (cue) gsap.to(cue, { opacity: 0, y: 12, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "15% top", scrub: true } });
      },
    );
    return () => mm.revert();
  }, []);

  return <span ref={marker} hidden />;
}
