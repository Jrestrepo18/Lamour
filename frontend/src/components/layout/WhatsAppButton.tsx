import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SITE } from "@/lib/seo";
import { getI18n } from "@/i18n/server";

/**
 * Desktop floating WhatsApp button (phones get it inside MobileBookingBar).
 * Renders nothing until a real business number is configured — better to
 * omit the CTA entirely than ship a WhatsApp link that goes nowhere.
 */
export async function WhatsAppButton() {
  const { t } = await getI18n();
  const digits = SITE.whatsapp;
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    t("Hola, me gustaría más información sobre los servicios de L'AMOUR.", "Hi, I'd like more information about L'AMOUR's services."),
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Escríbenos por WhatsApp", "Message us on WhatsApp")}
      className="fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full border-[3px] border-ivory bg-[#25D366] text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 lg:flex"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
