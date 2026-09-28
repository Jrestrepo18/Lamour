"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * The gradual "gets warmer as you scroll" backdrop behind the home sections
 * (blanco hueso → beige cálido, the palette's 60/20 pair).
 *
 * Performance matters here — this runs on every scroll frame across a very
 * tall element — so the colour shift is an **opacity** fade of a warm-beige
 * layer over the bone-white base (compositor-only, no repaint), not an
 * animated background-color. The secondary text tone stays constant: the
 * warm grey passes AA (≥ 4.6:1) over the whole bone → beige range.
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
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-10">
      <div aria-hidden className="absolute inset-0 -z-10 rounded-t-[2rem] bg-ivory shadow-[0_-24px_48px_-28px_rgba(23,23,23,0.35)]" />
      <div ref={tintRef} aria-hidden className="absolute inset-0 -z-10 rounded-t-[2rem] bg-beige opacity-0 will-change-[opacity]" />
      {children}
    </div>
  );
}
