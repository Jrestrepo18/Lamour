"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { Masseuse, Service } from "@/lib/types";
import { formatDateLong, formatTime } from "@/lib/format";
import { SITE } from "@/lib/seo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { StoryAvatar } from "./parts";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * "Sent" moment: the therapist's avatar with a gold ring and a check that
 * pops in like a sticker, the booking in one sentence, and a WhatsApp message
 * already written with the booking so the client can nudge it along.
 */
export function SuccessScreen({
  clientName,
  startsAt,
  service,
  primary,
  secondary,
}: {
  clientName: string;
  startsAt: string;
  service: Service;
  primary: Masseuse;
  secondary: Masseuse | null;
}) {
  const { t, href, lang } = useI18n();
  const firstName = clientName.trim().split(" ")[0];
  const team = secondary ? `${primary.stageName} ${t("y", "and")} ${secondary.stageName}` : primary.stageName;
  const when = `${formatDateLong(startsAt, lang)} ${t("a las", "at")} ${formatTime(startsAt, lang)}`;
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
        t(
          `Hola, soy ${firstName}. Acabo de solicitar ${service.name} con ${team} para el ${when}.`,
          `Hi, I'm ${firstName}. I've just requested ${service.name} with ${team} on ${when}.`,
        ),
      )}`
    : null;

  return (
    <div className="flex flex-col items-center py-10 text-center sm:py-16">
      <span className="relative animate-fade-up">
        <StoryAvatar masseuse={primary} size={96} ring />
        <span className="absolute -bottom-1 -right-1 flex h-10 w-10 animate-sticker-pop items-center justify-center rounded-full border-4 border-ivory bg-ink text-ivory [animation-delay:350ms]">
          <Check size={18} strokeWidth={3} aria-hidden />
        </span>
      </span>

      <p className="mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bronze">{t("Solicitud enviada", "Request sent")}</p>
      <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-tight text-ink">
        {t("Gracias", "Thank you")}, {firstName}
      </h2>
      <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[var(--tone-body)]">
        {t("Recibimos tu solicitud de", "We've received your request for")} <strong className="text-ink">{service.name}</strong>{" "}
        {t("con", "with")} {team} {t("para el", "on")} <strong className="text-ink">{when}</strong>.{" "}
        {t("Te escribiremos por WhatsApp para confirmarla.", "We'll message you on WhatsApp to confirm it.")}
      </p>

      <div className="mt-9 flex w-full max-w-sm flex-col gap-3">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[0.95rem] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(37,211,102,0.8)] transition-transform active:scale-[0.98]"
          >
            <WhatsAppIcon size={20} />
            {t("Escribirnos por WhatsApp", "Message us on WhatsApp")}
          </a>
        )}
        <Link
          href={href("/")}
          className="inline-flex min-h-12 items-center justify-center text-sm font-semibold text-ink underline decoration-gold/60 underline-offset-8 hover:decoration-ink"
        >
          {t("Volver al inicio", "Back to home")}
        </Link>
      </div>
    </div>
  );
}
