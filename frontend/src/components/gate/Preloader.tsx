"use client";

import { motion } from "framer-motion";

export function Preloader() {
  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <motion.span
        initial={{ opacity: 0, letterSpacing: "0.1em" }}
        animate={{ opacity: 1, letterSpacing: "0.02em" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-4xl text-ivory sm:text-5xl"
      >
        L&apos;AMOUR
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-4 font-sans text-xs uppercase tracking-[0.4em] text-gold"
      >
        Bienvenido
      </motion.span>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </motion.div>
  );
}
