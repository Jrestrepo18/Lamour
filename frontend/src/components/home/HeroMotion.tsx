"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * The hero's photo is a fixed backdrop that the page slides over (see Hero).
 * While it's being covered the photo breathes out very slightly, and once the
 * next section has covered the screen the fixed photo is hidden — so it can
 * never peek through further down the page. Renders nothing; it works on the
 * [data-hero-*] parts of its parent section.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useGsapContext(() => {
    const section = marker.current?.closest<HTMLElement>("[data-hero]");
    const bg = section?.querySelector<HTMLElement>("[data-hero-bg]");
    const cue = section?.querySelector<HTMLElement>("[data-hero-cue]");
    if (!section || !bg) return;

    // Hide the fixed photo while the hero is off screen; bring it back on the way up.
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onLeave: () => gsap.set(bg, { autoAlpha: 0 }),
      onEnterBack: () => gsap.set(bg, { autoAlpha: 1 }),
    });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrub = { trigger: section, start: "top top", end: "bottom top", scrub: true };
      // The still photo gets a gentle "breath out" as it's covered.
      gsap.fromTo(bg.firstElementChild, { scale: 1 }, { scale: 1.06, ease: "none", scrollTrigger: scrub });
      if (cue) gsap.to(cue, { opacity: 0, y: 12, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "15% top", scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return <span ref={marker} hidden />;
}
