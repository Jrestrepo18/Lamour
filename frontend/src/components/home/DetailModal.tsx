"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * The editorial, image-forward detail sheet used by MasseuseCard and ServiceCard —
 * distinct from ui/Modal (the compact admin CRUD form dialog). Three fixed regions
 * (image header, scrollable body, pinned footer) rather than one long scroll, so
 * the close button and the reserve CTA are always reachable regardless of how
 * long the description or highlights list gets. Behaves as a bottom sheet on
 * mobile (rounded top only, anchored to the bottom edge) and a centered dialog
 * on desktop.
 */
export function DetailModal({
  open,
  onClose,
  eyebrow,
  title,
  gallery,
  fallback,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  gallery: string[];
  fallback: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/60 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button aria-hidden tabIndex={-1} className="absolute inset-0 cursor-default" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-ivory shadow-2xl sm:max-h-[85vh] sm:rounded-[2rem]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-md backdrop-blur transition-colors hover:bg-ivory"
            >
              <X size={18} />
            </button>

            <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gradient-to-br from-champagne/50 to-gold/15 sm:h-64">
              {gallery.length > 0 ? (
                <div className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
                  {gallery.map((src, i) => (
                    <img
                      key={src + i}
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full flex-none snap-center object-cover"
                    />
                  ))}
                </div>
              ) : (
                fallback
              )}
              {gallery.length > 1 && (
                <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {gallery.map((src, i) => (
                    <span key={src + i} className="h-1.5 w-1.5 rounded-full bg-ivory/80 shadow" />
                  ))}
                </div>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{eyebrow}</p>
              )}
              <h2 className="mt-2 font-serif text-3xl text-ink">{title}</h2>
              <div className="mt-4 space-y-5">{children}</div>
            </div>

            <div className="shrink-0 border-t border-ink/10 bg-ivory p-4 sm:p-6">{footer}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
