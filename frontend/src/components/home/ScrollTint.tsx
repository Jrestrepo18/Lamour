"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * The gradual "gets darker as you scroll" effect: a single backdrop behind
 * several sections, tinting from ivory toward a deeper warm tan across the
 * whole span. Deliberately does NOT go anywhere near espresso-dark — every
 * section wrapped here still has dark ink-colored body text, and pushing the
 * backdrop that far would tank the contrast ratio by the time you reach the
 * bottom. The dramatic final jump to full dark still happens where it
 * already did, at FinalCta's own opaque background, right after this.
 *
 * The backdrop is `absolute` within this wrapper (sized to its full height
 * via inset-0 on a `relative` parent), not `fixed` to the viewport — so it
 * scrolls normally with the page and never touches the shared <body>
 * background used by every other route.
 */
export function ScrollTint({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!wrapperRef.current || !backdropRef.current) return;

    gsap.to(backdropRef.current, {
      backgroundColor: "#e4d2ae",
      ease: "none",
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div ref={backdropRef} className="absolute inset-0 -z-10 bg-ivory" />
      {children}
    </div>
  );
}
