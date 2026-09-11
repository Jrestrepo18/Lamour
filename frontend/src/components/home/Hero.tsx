"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Hero3D } from "@/components/three/Hero3D";

/**
 * One orchestrated entrance, not five loose effects: every element below is
 * a child of a single stagger container in the JSX tree, so they all fire
 * off one shared timeline (rule → line 1 → line 2 → paragraph → CTA →
 * coverage caption), each offset by `staggerChildren`.
 */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.25 } },
};

const revealLine: Variants = {
  hidden: { y: "100%" },
  show: { y: "0%", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-ivory via-champagne/35 to-silk"
    >
      {/* Soft breathing light behind the piece — warmth, not drama */}
      <div className="pointer-events-none absolute right-[6%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-gold/20 blur-[140px]" />

      {/* The "full-bleed image": a slow, breathing 3D piece, parallaxed by GSAP as the page scrolls past. */}
      <div className="absolute inset-0">
        <Hero3D triggerRef={sectionRef} />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-screen flex-col justify-center pt-24 pb-16"
      >
        <Container>
          <div className="max-w-3xl">
            <motion.div variants={drawLine} className="mb-8 h-px w-16 origin-left bg-gold" />

            <h1 className="text-display font-serif font-bold">
              <span className="block overflow-hidden">
                <motion.span variants={revealLine} className="block text-ink-soft">
                  estética
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={revealLine} className="block uppercase text-ink">
                  y sentidos
                </motion.span>
              </span>
            </h1>

            <motion.p variants={fadeUp} className="text-body mt-9 max-w-md text-ink-soft">
              Rituales de masaje tántrico, relajación y terapia de pareja, llevados hasta la privacidad de tu
              espacio. Una pausa para respirar.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10">
              <Link href="/reservar" className="group inline-flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-espresso transition-transform duration-300 group-hover:scale-105">
                  <ArrowUpRight size={22} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="rounded-full border border-ink/15 py-4 pl-6 pr-7 font-semibold text-ink transition-colors duration-300 group-hover:border-gold">
                  reservar mi experiencia
                </span>
              </Link>
            </motion.div>
          </div>
        </Container>

        <Container className="mt-auto pt-16">
          <motion.div variants={fadeUp} className="text-label flex items-center gap-2 font-medium text-ink-soft/70">
            <MapPin size={13} className="text-gold" />
            Medellín y su área metropolitana
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}
