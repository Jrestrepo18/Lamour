"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * The editorial, image-forward detail sheet used by MasseuseCard and ServiceCard —
 * distinct from ui/Modal (the compact admin CRUD form dialog). Behaves as a
 * bottom sheet on mobile (rounded top only, anchored to the bottom edge) and a
 * centered dialog on desktop.
 */
export function DetailModal({
  open,
  onClose,
  eyebrow,
  title,
  gallery,
  fallback,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  gallery: string[];
  fallback: ReactNode;
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
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-ivory shadow-2xl sm:rounded-[2rem]"
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

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-champagne/50 to-gold/15 sm:rounded-t-[2rem]">
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

            <div className="p-6 sm:p-8">
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{eyebrow}</p>
              )}
              <h2 className="mt-2 font-serif text-3xl text-ink">{title}</h2>
              <div className="mt-4">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
