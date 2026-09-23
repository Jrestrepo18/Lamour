"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLenisInstance } from "@/components/motion/LenisProvider";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const lenis = useLenisInstance();

  // Focus in on open (moving keyboard/screen-reader focus into the dialog),
  // trap Tab inside it while open, and hand focus back to whatever opened it
  // on close — otherwise focus silently falls back to <body>.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Lenis hijacks wheel/touch scroll for the whole page — `data-lenis-prevent`
    // on the dialog stops it from stealing scroll gestures that start over the
    // modal, but pausing it outright is the robust fix regardless of where the
    // gesture starts.
    lenis?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      previouslyFocused.current?.focus();
    };
  }, [open, onClose, lenis]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the gallery to its first photo each time the dialog is reopened
    if (open) setActiveSlide(0);
  }, [open]);

  function goToSlide(index: number) {
    const el = galleryRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(gallery.length - 1, index));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setActiveSlide(clamped);
  }

  function onGalleryScroll() {
    const el = galleryRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveSlide(Math.round(el.scrollLeft / el.clientWidth));
  }

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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-ivory shadow-2xl sm:max-h-[85dvh] sm:rounded-[2rem]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-md backdrop-blur transition-colors hover:bg-ivory"
            >
              <X size={18} />
            </button>

            <div className="relative h-56 w-full shrink-0 overflow-hidden bg-silk sm:h-72">
              {gallery.length > 0 ? (
                <div
                  ref={galleryRef}
                  onScroll={onGalleryScroll}
                  className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
                >
                  {gallery.map((src, i) => (
                    <img
                      key={src + i}
                      src={src}
                      alt={gallery.length > 1 ? `${title} — foto ${i + 1}` : title}
                      loading="lazy"
                      className="h-full w-full flex-none snap-center object-cover"
                    />
                  ))}
                </div>
              ) : (
                fallback
              )}

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide - 1)}
                    disabled={activeSlide === 0}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-md backdrop-blur transition-opacity hover:bg-ivory disabled:pointer-events-none disabled:opacity-0"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide + 1)}
                    disabled={activeSlide === gallery.length - 1}
                    aria-label="Foto siguiente"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-md backdrop-blur transition-opacity hover:bg-ivory disabled:pointer-events-none disabled:opacity-0"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {gallery.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => goToSlide(i)}
                        aria-label={`Ir a la foto ${i + 1} de ${gallery.length}`}
                        aria-current={activeSlide === i}
                        className={`relative h-1.5 rounded-full shadow transition-all before:absolute before:-inset-2 before:content-[''] ${
                          activeSlide === i ? "w-4 bg-ivory" : "w-1.5 bg-ivory/60 hover:bg-ivory/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
              {eyebrow && (
                <p className="eyebrow">{eyebrow}</p>
              )}
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">{title}</h2>
              <div className="mt-4 space-y-5">{children}</div>
            </div>

            <div className="shrink-0 border-t border-ink/10 bg-ivory p-4 sm:p-6">{footer}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
