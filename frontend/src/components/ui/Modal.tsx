"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { X } from "lucide-react";
import { useLenisInstance } from "@/components/motion/LenisProvider";
import { useI18n } from "@/i18n/I18nProvider";

/** Open dialogs, innermost last — only the top one reacts to Escape / Tab (a confirm over a form). */
const stack: symbol[] = [];
/** How many dialogs hold the page scroll; it's released only when the last one closes. */
let scrollLocks = 0;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The product's one dialog. On phones it's a bottom sheet (grab handle, rounded
 * top, full width) like the site's profile sheet; from sm up a centered card.
 * Header and footer stay put while only the body scrolls, so "Guardar" is always
 * in reach. Portaled to <body> (no ancestor can clip or trap it), focus is kept
 * inside and returned on close, Escape closes, and the page behind can't scroll.
 */
export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = "md",
}: {
  title: string;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const { t } = useI18n();
  const lenis = useLenisInstance();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target only exists after mount
    setMounted(true);
  }, []);

  // Lenis drives the page scroll, so it has to be paused as well as overflow:hidden.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    scrollLocks += 1;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) {
        document.body.style.overflow = "";
        lenis?.start();
      }
      previouslyFocused?.focus?.();
    };
  }, [lenis]);

  useEffect(() => {
    if (!mounted) return;
    const first = dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]") ?? dialogRef.current;
    first?.focus();
  }, [mounted]);

  useEffect(() => {
    const id = Symbol("modal");
    stack.push(id);
    function onKey(e: KeyboardEvent) {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      stack.splice(stack.indexOf(id), 1);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex animate-fade-in items-end justify-center bg-espresso/55 sm:items-center sm:p-6"
    >
      <button type="button" aria-hidden tabIndex={-1} className="absolute inset-0 cursor-default" onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={clsx(
          "relative flex max-h-[92dvh] w-full animate-rise flex-col overflow-hidden rounded-t-[2rem] bg-ivory shadow-2xl outline-none sm:rounded-[2rem]",
          size === "sm" && "sm:max-w-md",
          size === "md" && "sm:max-w-lg",
          size === "lg" && "sm:max-w-2xl",
        )}
      >
        <div className="shrink-0 border-b border-ink/[0.07] px-5 pb-3 pt-3 sm:px-7 sm:pt-5">
          <span aria-hidden className="mx-auto mb-3 block h-1 w-10 rounded-full bg-ink/15 sm:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-[1.35rem] font-semibold leading-tight tracking-tight text-ink sm:text-2xl">{title}</h2>
              {subtitle && <div className="mt-0.5 text-sm text-ink-soft">{subtitle}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("Cerrar", "Close")}
              className="-mr-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-silk/70 hover:text-ink"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-ink/[0.07] bg-ivory px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-7 sm:pb-5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
