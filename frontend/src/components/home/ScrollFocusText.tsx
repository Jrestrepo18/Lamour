"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

/**
 * A line of text that "comes into focus" as it crosses the viewport — dimmed
 * on approach, full ink by the time it settles near center. Independent of
 * ScrollTint's page-level color shift; this one is local per-element, driven
 * by that element's own scroll position rather than the whole section span.
 */
export function ScrollFocusText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGsapContext(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0.32 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          end: "top 40%",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
