"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * The gradual "gets darker as you scroll" effect: a single backdrop behind
 * several sections, tinting from ivory toward a deep warm caramel across the
 * whole span, with no per-section background of its own breaking it into
 * visible bands (see FeaturedServices/CoverageSection, which stay transparent
 * so this backdrop shows through uninterrupted).
 *
 * It deliberately stops short of espresso-dark — every section wrapped here
 * still sets dark ink-colored text directly against this backdrop, and WCAG
 * AA (4.5:1) caps how far a background can darken under a fixed dark-ink
 * foreground. The real constraint is `--color-ink-soft` (the lighter
 * secondary-text tone): at the caramel end color below it would otherwise
 * drop under 4.5:1, so `--tone-body` (see globals.css) is animated in lockstep
 * from ink-soft to a darker, more saturated brown — same "dark text on light
 * background" pairing throughout, just recalibrated so it keeps working as
 * the background deepens. Headings (`text-ink`) are dark enough already to
 * stay safe across this whole range without any change.
 *
 * The dramatic final jump to full espresso still happens after this, at
 * FinalCta's own opaque background — see the gradient strip at its top that
 * picks up exactly where this backdrop leaves off, so that seam reads as a
 * continuation rather than a hard cut.
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
      backgroundColor: "#b89a73",
      ease: "none",
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    gsap.to(wrapperRef.current, {
      "--tone-body": "#3d2f22",
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
