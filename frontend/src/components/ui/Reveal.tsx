import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import type { RevealDirection as Direction } from "@/lib/motion";

/**
 * Scroll reveal driven entirely by CSS (`animation-timeline: view()`, see
 * globals.css) — no JavaScript, no hydration wait. Anything already on
 * screen at load is painted fully visible on the first frame (so it can
 * count as LCP), and everything below fades/slides in as it enters the
 * viewport. Browsers without scroll-driven animations, and reduced-motion
 * users, simply get the content with no animation.
 *
 * `delay` (seconds, as before) is mapped onto the scroll range: a larger
 * value starts the 200px reveal window a little further in, which keeps the
 * staggered rhythm of card grids.
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
  const start = Math.round(Math.min(120, delay * 240));
  const style = delay > 0 ? ({ "--reveal-start": `${start}px` } as CSSProperties) : undefined;

  return (
    <div className={clsx("reveal", from !== "up" && `reveal-${from}`, className)} style={style}>
      {children}
    </div>
  );
}
