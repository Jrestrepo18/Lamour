"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [declined, setDeclined] = useState(false);

  return (
    <motion.div
      key="age-gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink px-5 py-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #E4D2AE 0%, transparent 45%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-3xl border border-gold/20 bg-[#1c1712] p-8 text-center shadow-2xl sm:p-10"
      >
        {declined ? (
          <>
            <h1 className="font-serif text-2xl text-ivory">Acceso restringido</h1>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60">
              Este sitio contiene información sobre servicios exclusivos para personas mayores de edad. Si no
              cumples este requisito, te pedimos abandonar la página.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
              <ShieldCheck size={26} strokeWidth={1.5} />
            </span>
            <h1 className="mt-5 font-serif text-2xl text-ivory">Confirmación de edad</h1>
            <p className="mt-4 text-sm leading-relaxed text-ivory/65">
              El contenido de <strong className="text-ivory">L&apos;AMOUR — Estética y Sentidos</strong> incluye
              servicios de naturaleza sensorial e íntima, dirigidos exclusivamente a personas mayores de 18 años.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ivory/45">
              Al continuar confirmas que eres mayor de edad y aceptas nuestra{" "}
              <Link href="/legal/privacidad" className="text-gold underline underline-offset-2 hover:text-champagne">
                Política de Tratamiento de Datos
              </Link>{" "}
              y{" "}
              <Link href="/legal/terminos" className="text-gold underline underline-offset-2 hover:text-champagne">
                Términos y Condiciones
              </Link>
              .
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-terracotta-dark"
              >
                Sí, soy mayor de 18 años
              </button>
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="flex-1 rounded-full border border-ivory/20 px-6 py-3 text-sm font-medium text-ivory/70 transition-colors hover:border-ivory/40 hover:text-ivory"
              >
                No
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
