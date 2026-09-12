"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const FAQS = [
  {
    q: "¿Cómo reservo una cita?",
    a: "Elige tu ritual, tu masajista y un horario disponible en nuestro sistema de reservas en tiempo real, confirma tus datos y listo — te contactamos por WhatsApp para coordinar la llegada.",
  },
  {
    q: "¿Puedo elegir a mi masajista?",
    a: "Sí. Conoce a nuestro equipo, revisa sus perfiles y elige con quién quieres vivir la experiencia antes de reservar.",
  },
  {
    q: "¿El servicio es discreto?",
    a: "Absolutamente. Nuestras terapeutas llegan sin nada que revele el tipo de servicio, y toda la comunicación se maneja con total confidencialidad.",
  },
  {
    q: "¿Qué zonas cubren?",
    a: "Atendemos Medellín y todo su Valle de Aburrá: Envigado, Sabaneta, Itagüí, Bello, La Estrella, Caldas y Rionegro.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Efectivo, transferencia y tarjeta. Eliges el método que prefieras al momento de reservar.",
  },
  {
    q: "¿Puedo reservar una experiencia en pareja?",
    a: "Sí, tenemos rituales diseñados especialmente para vivir en pareja, incluyendo experiencias donde cada quien tiene su propio terapeuta al mismo tiempo.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" align="left" />
            </Reveal>
            <Reveal
              from="left"
              delay={0.15}
              className="mx-auto mt-8 hidden w-full max-w-xs overflow-hidden rounded-[1.5rem] shadow-xl lg:block"
            >
              <Image
                src="/images/herbal-compress-massage.jpg"
                alt="Masaje con compresas herbales tibias"
                width={1693}
                height={2540}
                sizes="(min-width: 1024px) 25vw, 0px"
                className="aspect-[3/4] w-full object-cover"
              />
            </Reveal>
          </div>

          <div className="divide-y divide-ink/10 border-t border-ink/10">
            {FAQS.map((item, i) => {
              const open = openIndex === i;
              return (
                <Reveal key={item.q} delay={0.05 * i} from="up">
                  <div className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <span className="font-serif text-lg text-ink sm:text-xl">{item.q}</span>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden text-sm leading-relaxed text-[var(--tone-body)]">{item.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
