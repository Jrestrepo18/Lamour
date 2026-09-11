"use client";

import { motion, type Variants } from "framer-motion";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * A hand-drawn-feeling crescent, built from two overlapping arcs — not an
 * icon-font glyph. Inherits `hidden`/`show` from whatever parent Framer
 * Motion stagger container it's placed in (no own initial/animate), so it
 * can join an existing orchestrated sequence as one more staggered child.
 */
export function CrescentMoon({ className }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <motion.path
        d="M52,6 A46,46 0 1,0 52,94 A34,34 0 1,1 52,6 Z"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        variants={draw}
      />
    </motion.svg>
  );
}
