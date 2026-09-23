import Link from "next/link";
import { Clock3, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/seo";

function InstagramGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const EXPLORE = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/servicios#pareja", label: "Experiencias en pareja" },
  { href: "/masajistas", label: "Nuestro equipo" },
  { href: "/#faq", label: "Preguntas frecuentes" },
  { href: "/reservar", label: "Reservar cita" },
];

const heading = "text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne";

/** Footer — the one deliberate dark "contrast moment" that closes every page. */
export function Footer() {
  const whatsappHref = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : null;

  return (
    <footer id="contacto" className="bg-ink text-ivory">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 sm:gap-12 sm:py-20 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr]">
        <div>
          <p className="font-serif text-2xl font-bold tracking-wide text-ivory">L&apos;AMOUR</p>
          <p className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-champagne">Estética y Sentidos</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
            Spa de masajes a domicilio en Medellín. Rituales de bienestar y sensualidad en la privacidad de tu
            espacio.
          </p>
          <div className="mt-6 flex gap-3">
            {SITE.instagram && (
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de L'AMOUR"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
              >
                <InstagramGlyph />
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de L'AMOUR"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
              >
                <MessageCircle size={18} />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Enlaces del sitio">
          <p className={heading}>Explorar</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ivory/75 sm:grid-cols-1 sm:gap-y-2.5">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link className="transition-colors hover:text-gold" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={heading}>Cobertura y horario</p>
          <ul className="mt-5 space-y-4 text-sm text-ivory/75">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              Medellín, Envigado, Sabaneta, Itagüí, Bello, La Estrella, Caldas y Rionegro
            </li>
            <li className="flex items-start gap-3">
              <Clock3 size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              Todos los días, 9:00 a.m. – 9:00 p.m.
            </li>
          </ul>
        </div>

        <div>
          <p className={heading}>Nuestro compromiso</p>
          <p className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ivory/75">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
            Servicio exclusivo para mayores de 18 años, en un marco de respeto, consentimiento y confidencialidad
            absoluta.
          </p>
        </div>
      </Container>

      {/* Extra bottom room on phones so the sticky booking bar never covers the legal links. */}
      <div className="border-t border-ivory/10 pb-28 pt-6 lg:py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-ivory/65 sm:flex-row">
          <p>© {new Date().getFullYear()} L&apos;AMOUR — Estética y Sentidos · Medellín, Colombia</p>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacidad" className="transition-colors hover:text-gold">
              Tratamiento de datos
            </Link>
            <Link href="/legal/terminos" className="transition-colors hover:text-gold">
              Términos y condiciones
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
