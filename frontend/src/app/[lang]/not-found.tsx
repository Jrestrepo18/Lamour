import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Grain } from "@/components/ui/Grain";
import { LinkButton } from "@/components/ui/Button";
import { getI18n } from "@/i18n/server";

/**
 * Brand 404 for any unmatched URL (and for notFound() calls). Next already marks it
 * noindex and answers with a 404 status; this replaces the default English page with
 * the site's own calm register and routes the visitor back to the pages that matter.
 */
export default async function NotFound() {
  const { t, href } = await getI18n();
  const WAYS_BACK = [
    { href: "/servicios", label: t("Servicios y precios", "Services & prices") },
    { href: "/masajistas", label: t("Nuestras masajistas", "Our therapists") },
    { href: "/#faq", label: t("Preguntas frecuentes", "FAQ") },
  ];
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-ivory via-champagne/35 to-silk pb-24 pt-36 sm:pb-32 sm:pt-44">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-[120px]" />
          <Grain />
          <Container className="relative z-10 max-w-2xl text-center">
            <p className="eyebrow justify-center">Error 404</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-ink text-balance sm:text-7xl">
              {t("Esta página no existe", "This page doesn't exist")}
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              {t(
                "Puede que el enlace haya cambiado o que la dirección tenga un error. Respira: tu pausa sigue a un par de clics.",
                "The link may have changed or the address may have a typo. Breathe: your pause is still just a couple of clicks away.",
              )}
            </p>
            <div className="mt-10 flex justify-center">
              <LinkButton href={href("/")}>{t("Volver al inicio", "Back to home")}</LinkButton>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
              {WAYS_BACK.map((l) => (
                <li key={l.href}>
                  <Link
                    href={href(l.href)}
                    className="font-medium text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
