"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { useLenisInstance } from "@/components/motion/LenisProvider";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const lenis = useLenisInstance();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lenis hijacks wheel/touch scroll for the whole page, so `overflow:hidden`
  // alone doesn't stop the background from scrolling under the modal — Lenis
  // itself needs to be paused while the modal owns the scroll.
  useEffect(() => {
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [lenis]);

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-hidden tabIndex={-1} className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-ink/10 bg-ivory p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-silk/60 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
