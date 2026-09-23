import { CalendarCheck, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The service's guarantees, stated plainly right after the Hero — the
 * reassurance a first-time visitor looks for before scrolling further.
 * Only factual promises the business already makes elsewhere on the site.
 */
const ITEMS = [
  { icon: Sparkles, title: "Terapeutas certificadas", text: "Técnica, presencia y trato profesional en cada ritual." },
  { icon: ShieldCheck, title: "Discreción total", text: "Sin señalética ni uniformes. Confidencialidad absoluta." },
  { icon: CalendarCheck, title: "Reserva en tiempo real", text: "Elige servicio, terapeuta y horario disponible en minutos." },
  { icon: MapPinned, title: "Todo el Valle de Aburrá", text: "Medellín, Envigado, Sabaneta, Itagüí, Bello y más." },
];

export function TrustBar() {
  return (
    <section aria-label="Por qué elegir L'AMOUR" className="relative border-y border-ink/10 bg-white/40 backdrop-blur-sm">
      <Container>
        {/* Phones: a compact 2×2 of icon + title (the detail line appears from sm up). */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:gap-y-0 sm:py-0 lg:grid-cols-4 lg:divide-x lg:divide-ink/10">
          {ITEMS.map((item, i) => (
            <li key={item.title} className="sm:py-9 lg:px-7 lg:first:pl-0 lg:last:pr-0">
              <Reveal delay={0.06 * i} className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-bronze sm:h-11 sm:w-11">
                  <item.icon size={18} strokeWidth={1.6} aria-hidden />
                </span>
                <div>
                  <p className="font-serif text-sm font-semibold leading-snug text-ink sm:text-base">{item.title}</p>
                  <p className="mt-1 hidden text-sm leading-relaxed text-ink-soft sm:block">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
