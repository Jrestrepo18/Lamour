"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Hero3D } from "@/components/three/Hero3D";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      {/* Faint editorial backdrop text for depth, like a magazine spread */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[26vw] italic leading-none text-ivory/[0.03] sm:text-[18vw]"
      >
        Sentidos
      </span>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-terracotta/10 blur-[140px]" />
        <div className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-champagne/10 blur-[140px]" />
      </div>

      {/* Real 3D piece, offset to the right like an editorial hero image */}
      <div className="absolute inset-y-0 right-[-8%] hidden w-[55%] lg:block">
        <Hero3D />
      </div>
      <div className="absolute inset-x-0 top-1/2 h-[26rem] -translate-y-1/2 lg:hidden">
        <Hero3D />
      </div>

      <Container className="relative z-10 pt-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial="hidden" animate="show" className="max-w-2xl">
            <motion.div
              custom={0}
              variants={fadeUp}
              className="mb-7 inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-champagne"
            >
              <span className="h-px w-8 bg-gold" />
              Spa exclusivo a domicilio
            </motion.div>

            <motion.h1
              custom={0.12}
              variants={fadeUp}
              className="font-serif text-[4rem] italic leading-[0.92] text-ivory text-balance sm:text-[5.5rem] lg:text-[6.5rem]"
            >
              L&apos;AMOUR
            </motion.h1>

            <motion.p
              custom={0.26}
              variants={fadeUp}
              className="mt-2 text-sm font-medium uppercase tracking-[0.55em] text-gold"
            >
              Estética y Sentidos
            </motion.p>

            <motion.p
              custom={0.4}
              variants={fadeUp}
              className="mt-9 max-w-md text-base leading-relaxed text-ivory/65 sm:text-lg"
            >
              Rituales de masaje tántrico, relajación y terapia de pareja, llevados hasta la privacidad de tu
              espacio. Una pausa absoluta para los sentidos.
            </motion.p>

            <motion.div custom={0.55} variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <LinkButton href="/reservar" size="lg">
                Reservar mi Experiencia
              </LinkButton>
              <LinkButton href="/servicios" variant="secondary" size="lg" className="border-ivory/25 text-ivory">
                Ver Servicios
              </LinkButton>
            </motion.div>

            <motion.div
              custom={0.7}
              variants={fadeUp}
              className="mt-12 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ivory/45"
            >
              <MapPin size={14} className="text-gold" />
              Medellín y su área metropolitana
            </motion.div>
          </motion.div>

          {/* Spacer column on large screens so the 3D piece has room; content just breathes on smaller ones */}
          <div className="hidden lg:block" aria-hidden />
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-ivory/25 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
