import Image from "next/image";
import { Check, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = { app: "lamour" | "whatsapp"; title: string; text: string };

const STEPS: Step[] = [
  { app: "lamour", title: "Elige tu servicio", text: "Explora el catálogo y selecciona el ritual perfecto para ti." },
  { app: "lamour", title: "Elige tu masajista", text: "Conoce a nuestro equipo y elige con quién vivir la experiencia." },
  { app: "lamour", title: "Elige tu horario", text: "Consulta disponibilidad en tiempo real y agenda sin cruces." },
  {
    app: "whatsapp",
    title: "Recibe en tu espacio",
    text: "Te confirmamos la cita por WhatsApp y llegamos a tu dirección, con total discreción.",
  },
];

/**
 * "Cómo funciona" told as the phone notifications a client receives while
 * booking: four notification cards that spring in one after another as the
 * section scrolls into view. The last one arrives "from WhatsApp", which is
 * how bookings are actually confirmed. Part of the page itself (no phone
 * frame). The right-hand slot shows the step number, not an invented time.
 */
export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-16 sm:py-32">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Reserva en 4 pasos"
                title="Simple, discreto, a tu ritmo"
                description="Así vive tu reserva: unas cuantas notificaciones y tu ritual llega a casa. Sin llamadas ni esperas."
              />
            </Reveal>
            <Reveal delay={0.2} className="mt-10 hidden lg:block">
              <LinkButton href="/reservar" size="lg">
                Empezar mi reserva
              </LinkButton>
            </Reveal>
          </div>

          <ol aria-label="Pasos para reservar" className="flex flex-col gap-3">
            {STEPS.map((step, i) => {
              const whatsapp = step.app === "whatsapp";
              return (
                <li key={step.title}>
                  <Reveal from="drop" delay={0.12 * i}>
                    <div className="flex gap-3 rounded-[1.25rem] border border-ink/[0.07] bg-white/85 p-3.5 shadow-[0_14px_34px_-22px_rgba(43,32,25,0.55)] sm:p-4">
                      {/* App icon */}
                      <span
                        className={
                          "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[0.7rem] " +
                          (whatsapp ? "bg-[#25D366] text-white" : "")
                        }
                        aria-hidden
                      >
                        {whatsapp ? (
                          <MessageCircle size={22} fill="currentColor" strokeWidth={0} />
                        ) : (
                          <Image src="/icon.svg" alt="" width={40} height={40} className="h-10 w-10" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">
                            {whatsapp ? "WhatsApp · L'AMOUR" : "L'AMOUR"}
                          </p>
                          <p className="shrink-0 text-[0.7rem] text-ink-soft">Paso {i + 1}</p>
                        </div>
                        <h3 className="mt-0.5 flex items-center gap-1.5 text-[0.95rem] font-semibold text-ink">
                          {step.title}
                          {!whatsapp && <Check size={15} className="text-bronze" aria-hidden />}
                        </h3>
                        <p className="mt-0.5 text-sm leading-snug text-ink-soft">{step.text}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          <Reveal className="lg:hidden">
            <LinkButton href="/reservar" size="lg" className="w-full sm:w-auto">
              Empezar mi reserva
            </LinkButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
