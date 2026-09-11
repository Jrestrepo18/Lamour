import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { formatDateLong, formatTime } from "@/lib/format";

export function SuccessScreen({ clientName, startsAt }: { clientName: string; startsAt: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 text-gold">
        <CheckCircle2 size={40} strokeWidth={1.5} />
      </span>
      <h2 className="mt-6 font-serif text-3xl italic text-ink">Gracias, {clientName.split(" ")[0]}</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        Tu solicitud para el <strong className="capitalize text-ink">{formatDateLong(startsAt)}</strong> a las{" "}
        <strong className="text-ink">{formatTime(startsAt)}</strong> fue recibida. Nuestro equipo la confirmará y
        te contactará por WhatsApp muy pronto.
      </p>
      <LinkButton href="/" className="mt-8">
        Volver al Inicio
      </LinkButton>
    </div>
  );
}
