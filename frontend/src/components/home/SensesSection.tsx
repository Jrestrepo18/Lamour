"use client";

import { useState } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PHOTOS } from "@/lib/photos";
import { InstagramPost, type PostSlide } from "./InstagramPost";

const SENSES: PostSlide[] = [
  { title: "Aroma", caption: "Incienso, velas y aceites esenciales preparan tu espacio antes del primer contacto.", photo: PHOTOS.incense, tags: ["aroma", "ritual", "medellín"] },
  { title: "Calor", caption: "Aceites tibios y piedras calientes que sueltan, una a una, cada tensión.", photo: PHOTOS.oilHand, tags: ["calor", "aceitestibios", "bienestar"] },
  { title: "Tacto", caption: "Manos expertas y presión consciente, siempre a tu ritmo.", photo: PHOTOS.herbal, tags: ["tacto", "masajeadomicilio"] },
  { title: "Calma", caption: "Penumbra, silencio y un tiempo que es solo tuyo.", photo: PHOTOS.oilBowl, tags: ["calma", "pausa", "autocuidado"] },
  { title: "En pareja", caption: "Rituales para compartir la experiencia, en la intimidad de tu hogar.", photo: PHOTOS.bathTray, tags: ["enpareja", "ritual", "lamour"] },
];

/**
 * "Un ritual para cada sentido" — one Instagram carousel post holding all five
 * photos; swiping changes the photo and its caption together. On desktop the
 * heading sits beside it with a numbered index of the five senses that jumps
 * the post to each photo.
 */
export function SensesSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="sentidos" aria-labelledby="sentidos-title" className="py-16 sm:py-32">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,31rem)] lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="La experiencia"
                title={<span id="sentidos-title">Un ritual para cada sentido</span>}
                description="Cada detalle está pensado para que el cuerpo suelte y la mente descanse. Desliza la publicación."
              />
            </Reveal>

            {/* Desktop index: jumps the post to each sense */}
            <ol className="mt-10 hidden border-t border-ink/10 lg:block">
              {SENSES.map((s, i) => (
                <li key={s.title} className="border-b border-ink/10">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={i === active}
                    className={clsx(
                      "flex w-full cursor-pointer items-baseline gap-5 py-4 text-left transition-colors",
                      i === active ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <span className="w-6 text-xs font-semibold tabular-nums tracking-widest text-bronze">0{i + 1}</span>
                    <span className="font-serif text-2xl font-semibold">{s.title}</span>
                    <span
                      aria-hidden
                      className={clsx("ml-auto h-px self-center bg-gold transition-[width] duration-500", i === active ? "w-16" : "w-0")}
                    />
                  </button>
                </li>
              ))}
            </ol>

            <Reveal className="mt-10 hidden lg:block">
              <LinkButton href="/reservar" size="lg">
                Reservar mi ritual
              </LinkButton>
            </Reveal>
          </div>

          {/* Full-bleed on phones (cancels the container padding); its own column on desktop. */}
          <Reveal delay={0.1} className="-mx-5 sm:-mx-8 lg:mx-0">
            <InstagramPost slides={SENSES} active={active} onActiveChange={setActive} />
          </Reveal>

          <Reveal className="lg:hidden">
            <LinkButton href="/reservar" size="lg" className="w-full sm:w-auto">
              Reservar mi ritual
            </LinkButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
