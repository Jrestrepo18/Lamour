"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SITE } from "@/lib/seo";
import { stripLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Phone-only floating action buttons (no bar behind them). Slide up once the visitor scrolls past the
 * hero, keeping "Reservar" permanently in thumb reach (plus WhatsApp when a
 * number is configured). On /reservar itself the booking CTA would be
 * redundant, so the bar only offers WhatsApp help there.
 */
export function MobileBookingBar() {
  const { t, href } = useI18n();
  const pathname = usePathname();
  const onBooking = pathname ? stripLocale(pathname).startsWith("/reservar") : false;
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
        t("Hola, me gustaría más información sobre los servicios de L'AMOUR.", "Hi, I'd like more information about L'AMOUR's services."),
      )}`
    : null;

  const [pastHero, setPastHero] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Step aside over the (black) footer: a black button on black disappears, and the
  // closing "Tu momento te espera" section right above already offers its own CTA.
  useEffect(() => {
    const footer = document.getElementById("contacto");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  const shown = pastHero && !footerInView;

  // The booking flow brings its own floating actions (and a WhatsApp link).
  if (onBooking) return null;

  return (
    <div
      inert={!shown}
      className={clsx(
        // No strip behind the buttons: they float on their own shadow. The wrapper itself
        // ignores taps so the page underneath stays usable around them.
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 transition-[transform,opacity] duration-500 ease-out lg:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        shown ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <Link
          href={href("/reservar")}
          className="pointer-events-auto flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-ivory shadow-[0_14px_34px_-10px_rgba(16,16,16,0.6)] ring-1 ring-gold/30 active:scale-[0.98]"
        >
          {t("Reservar ahora", "Book now")}
          <ArrowUpRight size={16} aria-hidden />
        </Link>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("Escríbenos por WhatsApp", "Message us on WhatsApp")}
            className="pointer-events-auto flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgba(16,16,16,0.6)] active:scale-[0.98]"
          >
            <WhatsAppIcon size={24} />
          </a>
        )}
      </div>
    </div>
  );
}
