"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
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
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const revealLine: Variants = {
  hidden: { y: "100%" },
  show: { y: "0%", transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-espresso">
      {/* The "full-bleed image": a real 3D piece, parallaxed by GSAP as the page scrolls past this section. */}
      <div className="absolute inset-0">
        <Hero3D triggerRef={sectionRef} />
      </div>

      {/* Scrim so the text column stays legible over the piece */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-espresso via-espresso/75 to-espresso/10" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-screen flex-col justify-center pt-24 pb-16"
      >
        <Container>
          <div className="max-w-2xl">
            <motion.div variants={drawLine} className="mb-8 h-px w-16 origin-left bg-gold" />

            <h1 className="text-display font-serif italic text-ivory">
              <span className="block overflow-hidden">
                <motion.span variants={revealLine} className="block">
                  estética
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={revealLine} className="block font-bold not-italic uppercase text-gold">
                  Y sentidos
                </motion.span>
              </span>
            </h1>

            <motion.p variants={fadeUp} className="text-body mt-9 max-w-md text-ivory/65">
              Rituales de masaje tántrico, relajación y terapia de pareja, llevados hasta la privacidad de tu
              espacio.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9">
              <Link
                href="/reservar"
                className="text-body group inline-flex items-center gap-2 text-ivory transition-colors hover:text-gold"
              >
                reserva tu ritual
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </div>
        </Container>

        <Container className="mt-auto pt-16">
          <motion.div variants={fadeUp} className="text-label flex items-center gap-2 text-ivory/40">
            <MapPin size={13} className="text-gold" />
            Medellín y su área metropolitana
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}
