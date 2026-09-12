"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Grain } from "@/components/ui/Grain";
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

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-ivory via-champagne/35 to-silk"
    >
      {/* Soft breathing light behind the piece — warmth, not drama */}
      <div className="pointer-events-none absolute right-[10%] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full bg-gold/25 blur-[120px]" />

      {/* Aura waves: slow, soft glow pulses behind the figure — blurred radial light, not a hard-edged
          ring, so it reads as an aura rather than the water-ripple lines that didn't land before. Three
          instances staggered in time keep one always mid-expansion, so it never reads as "done". */}
      <div className="pointer-events-none absolute right-[10%] top-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 72%)" }}
            animate={{ scale: [0.7, 2.1], opacity: [0.55, 0] }}
            transition={{ duration: 8, delay: i * (8 / 3), repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Grain on the flat gradient — under the 3D piece, never over it (Fase 0). */}
      <Grain />

      {/* The "full-bleed image": the user's own 3D figure, parallaxed by GSAP as the page scrolls past. */}
      <div className="absolute inset-0">
        <Hero3D triggerRef={sectionRef} />
      </div>

      {/* Cinematic vignette: edges settle toward espresso instead of staying flat all the way to the
          frame, so the scene reads as a lit space with depth rather than a sticker pasted on a gradient. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 45%, rgba(20,13,8,0.16) 100%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-dvh flex-col justify-center pt-20 pb-20 sm:pt-24 sm:pb-28"
      >
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-display font-serif font-bold">
              <span className="block overflow-hidden">
                <motion.span variants={revealLine} className="block text-ink-soft">
                  Estética
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={revealLine} className="block text-ink">
                  y Sentidos
                </motion.span>
              </span>
            </h1>

            <motion.p variants={fadeUp} className="text-body mt-5 max-w-md text-ink-soft sm:mt-9">
              Rituales de masaje tántrico, relajación y terapia de pareja, llevados hasta la privacidad de tu
              espacio. Una pausa para respirar.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 sm:mt-10">
              <Link href="/reservar" className="group inline-flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-espresso transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
                  <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-[22px]" />
                </span>
                <span className="rounded-full border border-ink/15 py-3 pl-5 pr-6 text-sm font-semibold text-ink transition-colors duration-300 group-hover:border-gold sm:py-4 sm:pl-6 sm:pr-7 sm:text-base">
                  reservar mi experiencia
                </span>
              </Link>
            </motion.div>
          </div>
        </Container>

        <Container className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 pb-6 sm:gap-6 sm:pb-10">
          <motion.div variants={fadeUp} className="text-label flex items-center gap-2 font-medium text-ink-soft/70">
            <MapPin size={13} className="text-gold" />
            Medellín y su área metropolitana
          </motion.div>

          <motion.div variants={fadeUp} className="hidden max-w-[14rem] text-right sm:block">
            <p className="text-label font-medium uppercase tracking-wider text-gold">¿Qué transmite esto?</p>
            <p className="mt-1 font-serif text-lg font-semibold text-ink">Quietud</p>
            <p className="text-label mt-1 leading-relaxed text-ink-soft/75">
              Presencia sin prisa. Calma que se siente antes del primer contacto.
            </p>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}
