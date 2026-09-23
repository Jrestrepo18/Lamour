"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/seo";

/**
 * Phone-only sticky action bar. Slides up once the visitor scrolls past the
 * hero, keeping "Reservar" permanently in thumb reach (plus WhatsApp when a
 * number is configured). On /reservar itself the booking CTA would be
 * redundant, so the bar only offers WhatsApp help there.
 */
export function MobileBookingBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const onBooking = pathname?.startsWith("/reservar") ?? false;
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hola, me gustaría más información sobre los servicios de L'AMOUR.")}`
    : null;

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (onBooking && !whatsappHref) return null;

  return (
    <div
      inert={!shown}
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-ivory/90 px-4 pt-3 backdrop-blur-xl transition-transform duration-500 ease-out lg:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        shown ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        {!onBooking && (
          <Link
            href="/reservar"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-ivory shadow-[0_12px_28px_-14px_rgba(43,32,25,0.8)] active:scale-[0.98]"
          >
            Reservar ahora
            <ArrowUpRight size={16} aria-hidden />
          </Link>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className={clsx(
              "flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/70 text-sm font-medium text-ink active:scale-[0.98]",
              onBooking ? "flex-1" : "w-12",
            )}
          >
            <MessageCircle size={19} className="text-[#1f8f4e]" aria-hidden />
            {onBooking && "¿Dudas? Escríbenos por WhatsApp"}
          </a>
        )}
      </div>
    </div>
  );
}
