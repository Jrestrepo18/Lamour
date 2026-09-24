"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * Body-text tone per stretch of the tint. Each value keeps WCAG AA (≥ 4.5:1)
 * across its whole range of the ivory → caramel backdrop (worst cases 4.95,
 * 5.34 and 4.86).
 */
const TONE_STEPS: { until: number; tone: string }[] = [
  { until: 0.3, tone: "#6b5a4a" },
  { until: 0.65, tone: "#52402f" },
  { until: 1.01, tone: "#3d2f22" },
];

/**
 * The gradual "gets warmer as you scroll" backdrop behind the home sections.
 *
 * Performance matters here — this runs on every scroll frame across a very
 * tall element — so:
 *  - the colour shift is an **opacity** fade of a caramel layer over the ivory
 *    base (compositor-only, no repaint), not an animated background-color;
 *  - the body-text tone (`--tone-body`, see globals.css) changes in **three
 *    discrete steps** as the scroll crosses each threshold, instead of being
 *    interpolated per frame (a custom property on this wrapper is inherited by
 *    every element below it, so a per-frame change re-styled the whole page).
 *
 * The backdrop is `absolute` within this wrapper, so it scrolls with the page
 * and never touches the shared <body> background used by every other route.
 */
export function ScrollTint({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    const wrapper = wrapperRef.current;
    const tint = tintRef.current;
    if (!wrapper || !tint) return;

    gsap.fromTo(
      tint,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: wrapper, start: "top top", end: "bottom bottom", scrub: true },
      },
    );

    let current = "";
    ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const tone = TONE_STEPS.find((s) => self.progress < s.until)!.tone;
        if (tone !== current) {
          current = tone;
          wrapper.style.setProperty("--tone-body", tone);
        }
      },
    });
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div aria-hidden className="absolute inset-0 -z-10 bg-ivory" />
      <div ref={tintRef} aria-hidden className="absolute inset-0 -z-10 bg-[#b89a73] opacity-0 will-change-[opacity]" />
      {children}
    </div>
  );
}
