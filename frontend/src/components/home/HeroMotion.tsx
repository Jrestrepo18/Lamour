"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * The hero's scroll choreography: the photo stays still on screen while its
 * frame — and the page — scroll up over it, so it disappears little by little
 * like a curtain closing, instead of simply sliding away with the page. A
 * soft warm veil settles as it goes. Scrubbed to the scroll position, so it
 * moves exactly as fast as the finger. Renders nothing; it animates the
 * [data-hero-*] parts of its parent section. Skipped under prefers-reduced-motion.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useGsapContext(() => {
    const section = marker.current?.closest<HTMLElement>("[data-hero]");
    if (!section) return;
    const q = (name: string) => section.querySelector<HTMLElement>(`[data-hero-${name}]`);
    const media = q("media");
    const veil = q("veil");
    const cue = q("cue");

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrub = { trigger: section, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true };
      // Moving the photo down exactly as far as the page scrolls up keeps it fixed on screen:
      // its overflow-hidden frame (and the ivory sheet below it on phones) glide over it.
      if (media) gsap.fromTo(media, { y: 0, scale: 1.04 }, { y: () => section.offsetHeight, scale: 1, ease: "none", scrollTrigger: scrub });
      if (veil) gsap.fromTo(veil, { opacity: 0 }, { opacity: 0.3, ease: "none", scrollTrigger: scrub });
      if (cue) gsap.to(cue, { opacity: 0, y: 12, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "15% top", scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return <span ref={marker} hidden />;
}
