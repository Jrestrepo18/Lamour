"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/seo";

/**
 * Phone-only floating action buttons (no bar behind them). Slide up once the visitor scrolls past the
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
        // No strip behind the buttons: they float on their own shadow. The wrapper itself
        // ignores taps so the page underneath stays usable around them.
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 transition-[transform,opacity] duration-500 ease-out lg:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        shown ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        {!onBooking && (
          <Link
            href="/reservar"
            className="pointer-events-auto flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-ivory shadow-[0_14px_34px_-10px_rgba(20,13,8,0.6)] ring-1 ring-gold/30 active:scale-[0.98]"
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
              "pointer-events-auto flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-medium text-white shadow-[0_14px_34px_-10px_rgba(20,13,8,0.6)] active:scale-[0.98]",
              onBooking ? "flex-1" : "w-13",
            )}
          >
            <MessageCircle size={20} fill="currentColor" strokeWidth={0} aria-hidden />
            {onBooking && "¿Dudas? Escríbenos por WhatsApp"}
          </a>
        )}
      </div>
    </div>
  );
}
