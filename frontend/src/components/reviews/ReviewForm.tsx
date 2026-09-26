"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Loader2, Star } from "lucide-react";
import { ApiError, submitReview } from "@/lib/api";
import { fieldClass, labelClass } from "@/lib/ui";

const LABELS = ["", "No me gustó", "Regular", "Estuvo bien", "Muy buena", "¡Excelente!"];

/** A client's review of their own completed booking. Arrives pending; the team publishes it. */
export function ReviewForm({
  appointmentId,
  token,
  firstName,
  suggestedName,
  serviceName,
}: {
  appointmentId: string;
  token: string;
  firstName: string;
  suggestedName: string;
  serviceName: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState(suggestedName);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function send() {
    if (!rating) return setError("Elige de 1 a 5 estrellas.");
    if (text.trim().length < 10) return setError("Cuéntanos un poco más (mínimo 10 caracteres).");
    if (!consent) return setError("Necesitamos tu autorización para publicar la opinión.");
    setBusy(true);
    setError(null);
    try {
      await submitReview({ appointmentId, token, rating, text: text.trim(), displayName: displayName.trim(), consent });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError && err.message && !err.message.startsWith("{") ? err.message : "No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="py-10 text-center">
        <span className="mx-auto flex h-16 w-16 animate-sticker-pop items-center justify-center rounded-full bg-ink text-ivory">
          <Check size={28} strokeWidth={3} aria-hidden />
        </span>
        <h1 className="mt-6 font-serif text-[1.9rem] font-semibold leading-tight text-ink">Gracias{firstName ? `, ${firstName}` : ""}</h1>
        <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[var(--tone-body)]">
          Recibimos tu opinión. La publicaremos en nuestra web en los próximos días.
        </p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bronze">Tu opinión</p>
        <h1 className="mt-2 font-serif text-[1.9rem] font-semibold leading-tight text-ink">
          {firstName ? `${firstName}, ¿cómo` : "¿Cómo"} estuvo tu {serviceName}?
        </h1>
        <p className="mt-2 text-[0.95rem] text-[var(--tone-body)]">Tu experiencia ayuda a otras personas a decidirse.</p>
      </div>

      <fieldset>
        <legend className="sr-only">Calificación</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-transform active:scale-90"
            >
              <Star size={34} className={clsx("transition-colors", n <= shown ? "fill-gold text-gold" : "text-ink/20")} />
            </button>
          ))}
        </div>
        <p className="mt-1 h-5 text-sm font-medium text-bronze" aria-live="polite">{LABELS[shown]}</p>
      </fieldset>

      <label className={labelClass}>
        Cuéntanos tu experiencia
        <textarea
          className={clsx(fieldClass, "min-h-32 resize-none")}
          value={text}
          maxLength={600}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Cómo te sentiste? ¿Qué destacarías de tu terapeuta?"
        />
        <span className="text-right text-xs font-normal text-ink-soft">{text.length}/600</span>
      </label>

      <label className={labelClass}>
        Así aparecerá tu nombre
        <input className={fieldClass} value={displayName} maxLength={40} onChange={(e) => setDisplayName(e.target.value)} />
        <span className="text-xs font-normal text-ink-soft">Solo tu nombre y la inicial del apellido, para cuidar tu privacidad.</span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-ink)]" />
        Autorizo a L&apos;AMOUR a publicar esta opinión en su sitio web con el nombre que indiqué.
      </label>

      {error && <p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink text-[0.95rem] font-semibold text-ivory shadow-[0_14px_34px_-12px_rgba(16,16,16,0.6)] disabled:opacity-60"
      >
        {busy && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {busy ? "Enviando…" : "Enviar mi opinión"}
      </button>
    </form>
  );
}
