import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/seo";

/**
 * Desktop floating WhatsApp button (phones get it inside MobileBookingBar).
 * Renders nothing until a real business number is configured — better to
 * omit the CTA entirely than ship a WhatsApp link that goes nowhere.
 */
export function WhatsAppButton() {
  const digits = SITE.whatsapp;
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hola, me gustaría más información sobre los servicios de L'AMOUR.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full border-[3px] border-ivory bg-[#25D366] text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 lg:flex"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}
