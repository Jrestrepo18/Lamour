import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";

function InstagramGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contacto" className="bg-ink text-ivory">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-serif text-2xl text-ivory">L&apos;AMOUR</span>
          <p className="mt-1 text-[0.65rem] font-sans uppercase tracking-[0.35em] text-champagne">
            Estética y Sentidos
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/60">
            Rituales de bienestar y sensualidad, a domicilio, en la privacidad y comodidad de tu espacio.
          </p>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Explorar</h3>
          <ul className="mt-4 space-y-2 text-sm text-ivory/70">
            <li><Link className="hover:text-gold" href="/">Inicio</Link></li>
            <li><Link className="hover:text-gold" href="/servicios">Servicios</Link></li>
            <li><Link className="hover:text-gold" href="/servicios#pareja">Experiencias en pareja</Link></li>
            <li><Link className="hover:text-gold" href="/masajistas">Nuestro equipo</Link></li>
            <li><Link className="hover:text-gold" href="/reservar">Reservar cita</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Cobertura</h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              Medellín y área metropolitana (Envigado, Sabaneta, Itagüí, Bello, Rionegro)
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
              Reservas por WhatsApp y web, todos los días 9:00 a.m. – 9:00 p.m.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Síguenos</h3>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              aria-label="Instagram de L'AMOUR"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramGlyph />
            </a>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-ivory/40">
            Servicio exclusivo para mayores de 18 años. Todas nuestras experiencias se realizan bajo un marco de
            respeto, consentimiento y confidencialidad absoluta.
          </p>
        </div>
      </Container>

      <div className="border-t border-ivory/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-ivory/40 sm:flex-row">
          <p>© {new Date().getFullYear()} L&apos;AMOUR — Estética y Sentidos. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacidad" className="hover:text-gold">
              Tratamiento de datos
            </Link>
            <Link href="/legal/terminos" className="hover:text-gold">
              Términos y condiciones
            </Link>
            <p>Medellín, Colombia</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
