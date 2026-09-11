"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import type { RevealDirection as Direction } from "@/lib/motion";

const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 30 },
  left: { x: -36 },
  right: { x: 36 },
};

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
  const offset = OFFSETS[from];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
