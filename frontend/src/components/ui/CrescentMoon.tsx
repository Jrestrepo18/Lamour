"use client";

import { motion, type Variants } from "framer-motion";
import type { CSSProperties } from "react";

const reveal: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -8 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * A filled crescent (two overlapping arcs, filled — not stroked). The
 * previous version only stroked the outline of a lune path with two very
 * different arc radii, which traced as two visibly separate curved lines
 * instead of one clean sliver shape. Filling the same path data is what
 * actually renders a crescent; stroking it doesn't. Inherits `hidden`/
 * `show` from whatever parent Framer Motion stagger container it's placed
 * in (no own initial/animate), so it can join an existing sequence.
 */
export function CrescentMoon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <motion.path
        d="M54,4 A48,48 0 1,0 54,96 A34,34 0 1,1 54,4 Z"
        fill="currentColor"
        variants={reveal}
      />
    </motion.svg>
  );
}
