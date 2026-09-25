"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Age confirmation. Server-rendered (so it needs no JS to appear), hidden by
 * CSS via `html[data-age-ok]` for visitors who already confirmed. Light, warm
 * glass over the real page instead of a black wall — the first impression
 * is the brand's calm, not a blocking screen. The title is a <p>, not a heading:
 * the dialog is in every page's HTML, and a heading would join each page's outline.
 */
export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [declined, setDeclined] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return (
    <div
      id="age-gate"
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory/70 px-5 py-10 backdrop-blur-xl animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-desc"
        className="relative w-full max-w-md rounded-[2rem] border border-gold/25 bg-ivory/95 p-8 text-center shadow-[0_40px_80px_-30px_rgba(23,23,23,0.45)] sm:p-10"
      >
        <p className="font-serif text-2xl font-bold tracking-wide text-ink">L&apos;AMOUR</p>
        <p className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-bronze">Estética y Sentidos</p>
        <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />

        {declined ? (
          <>
            <p id="age-gate-title" className="mt-6 font-serif text-2xl font-semibold text-ink">
              Acceso restringido
            </p>
            <p id="age-gate-desc" className="mt-4 text-sm leading-relaxed text-ink-soft">
              Este sitio contiene información sobre servicios exclusivos para personas mayores de edad. Si no
              cumples este requisito, te pedimos abandonar la página.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-bronze">
              <ShieldCheck size={22} strokeWidth={1.6} />
            </span>
            <p id="age-gate-title" className="mt-4 font-serif text-2xl font-semibold text-ink">
              Confirmación de edad
            </p>
            <p id="age-gate-desc" className="mt-3 text-sm leading-relaxed text-ink-soft">
              Nuestros servicios son de naturaleza sensorial e íntima, dirigidos exclusivamente a personas
              mayores de 18 años.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Al continuar aceptas nuestra{" "}
              <Link href="/legal/privacidad" className="text-bronze underline underline-offset-2 hover:text-ink">
                Política de Tratamiento de Datos
              </Link>{" "}
              y los{" "}
              <Link href="/legal/terminos" className="text-bronze underline underline-offset-2 hover:text-ink">
                Términos y Condiciones
              </Link>
              .
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button ref={confirmRef} onClick={onConfirm} className="flex-1">
                Soy mayor de 18 años
              </Button>
              <Button variant="secondary" onClick={() => setDeclined(true)} className="sm:w-28">
                Salir
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
