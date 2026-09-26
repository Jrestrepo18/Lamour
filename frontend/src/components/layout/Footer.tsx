import Link from "next/link";
import { Clock3, MapPin, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/seo";
import { CITIES, cityPath } from "@/lib/cities";
import { getI18n } from "@/i18n/server";
import { LanguageSwitch } from "./LanguageSwitch";

function InstagramGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const heading = "text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne";

/** Footer — the one deliberate dark "contrast moment" that closes every page. */
export async function Footer() {
  const { t, href } = await getI18n();
  const EXPLORE = [
    { href: "/", label: t("Inicio", "Home") },
    { href: "/servicios", label: t("Servicios", "Services") },
    { href: "/masajes-tantricos", label: t("Masajes tántricos", "Tantric massages") },
    { href: "/servicios#pareja", label: t("Experiencias en pareja", "Couples experiences") },
    { href: "/masajistas", label: t("Nuestro equipo", "Our team") },
    { href: "/masajes-a-domicilio", label: t("Zonas de cobertura", "Service areas") },
    { href: "/#faq", label: t("Preguntas frecuentes", "FAQ") },
    { href: "/reservar", label: t("Reservar cita", "Book an appointment") },
  ];
  const whatsappHref = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : null;

  return (
    <footer id="contacto" className="bg-ink text-ivory">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 sm:gap-12 sm:py-20 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr]">
        <div>
          <Link href={href("/")} aria-label={t("L'AMOUR — Inicio", "L'AMOUR — Home")} className="inline-flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-wide text-ivory">L&apos;AMOUR</span>
            <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-champagne">{t("Estética y Sentidos", "Aesthetics & Senses")}</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
            {t(
              "Spa de masajes a domicilio en Medellín. Rituales de bienestar y sensualidad en la privacidad de tu espacio.",
              "In-home massage spa in Medellín. Wellness and sensual rituals in the privacy of your own space.",
            )}
          </p>
          <div className="mt-6 flex gap-3">
            {SITE.instagram && (
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("Instagram de L'AMOUR", "L'AMOUR on Instagram")}
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
                aria-label={t("WhatsApp de L'AMOUR", "L'AMOUR on WhatsApp")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
              >
                <WhatsAppIcon size={19} />
              </a>
            )}
          </div>
          <LanguageSwitch tone="dark" className="mt-6 w-fit" />
        </div>

        <nav aria-label={t("Enlaces del sitio", "Site links")}>
          <p className={heading}>{t("Explorar", "Explore")}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ivory/75 sm:grid-cols-1 sm:gap-y-2.5">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link className="transition-colors hover:text-gold" href={href(l.href)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={heading}>{t("Cobertura y horario", "Area & hours")}</p>
          <ul className="mt-5 space-y-4 text-sm text-ivory/75">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              <span>
                {CITIES.map((c, i) => (
                  <span key={c.slug}>
                    {i === 0 ? "" : i === CITIES.length - 1 ? t(" y ", " and ") : ", "}
                    <Link href={href(cityPath(c))} className="transition-colors hover:text-gold">
                      {c.name}
                    </Link>
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock3 size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              {t("Todos los días, 9:00 a.m. – 9:00 p.m.", "Every day, 9:00 a.m. – 9:00 p.m.")}
            </li>
          </ul>
        </div>

        <div>
          <p className={heading}>{t("Nuestro compromiso", "Our commitment")}</p>
          <p className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ivory/75">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
            {t(
              "Servicio exclusivo para mayores de 18 años, en un marco de respeto, consentimiento y confidencialidad absoluta.",
              "Adults only (18+), always within a framework of respect, consent and complete confidentiality.",
            )}
          </p>
        </div>
      </Container>

      {/* Extra bottom room on phones so the sticky booking bar never covers the legal links. */}
      <div className="border-t border-ivory/10 pb-28 pt-6 lg:py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-ivory/65 sm:flex-row">
          <p>
            © {new Date().getFullYear()} L&apos;AMOUR — {t("Estética y Sentidos", "Aesthetics & Senses")} · Medellín, Colombia
          </p>
          <div className="flex items-center gap-5">
            <Link href={href("/legal/privacidad")} className="transition-colors hover:text-gold">
              {t("Tratamiento de datos", "Privacy policy")}
            </Link>
            <Link href={href("/legal/terminos")} className="transition-colors hover:text-gold">
              {t("Términos y condiciones", "Terms & conditions")}
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
