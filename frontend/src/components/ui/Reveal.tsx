"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import type { RevealDirection as Direction } from "@/lib/motion";

/**
 * One IntersectionObserver shared by every Reveal on the page — cheaper than
 * one per element, and supported everywhere (iOS Safari included, unlike CSS
 * scroll-driven animations, which is why this replaced them).
 */
const callbacks = new Map<Element, () => void>();
let observer: IntersectionObserver | null = null;

function observe(el: Element, onEnter: () => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    // Fire slightly before the element enters (positive bottom margin, any overlap), so tall
    // blocks never leave an empty stretch on screen while they wait to appear.
    { rootMargin: "0px 0px 15% 0px", threshold: 0 },
  );
  callbacks.set(el, onEnter);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

/**
 * Fade/slide-in as an element scrolls into view — on phones and desktop alike.
 *
 * Server-rendered fully visible, so nothing waits for JavaScript and above-the-
 * fold content still counts as LCP immediately. After hydration, only elements
 * that are still *below* the fold are tucked away and then revealed when they
 * enter the viewport (they're off-screen, so hiding them causes no flicker).
 * Reduced-motion users get the content with no animation.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  from = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: Direction;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setState("pending");
    return observe(el, () => setState("in"));
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={state}
      className={clsx("reveal", from !== "up" && `reveal-${from}`, className)}
      style={delay > 0 ? ({ "--reveal-delay": `${Math.min(delay, 0.5)}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
