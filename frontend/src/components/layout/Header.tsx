"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { LinkButton } from "@/components/ui/Button";
import { useLenisInstance } from "@/components/motion/LenisProvider";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/masajistas", label: "Masajistas" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenisInstance();

  // On the home page a link to "/" is a no-op, so the logo glides back to the top instead.
  function handleLogoClick(e: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.hash) history.replaceState(null, "", "/");
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closes the mobile menu on route change, not a render loop
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500", scrolled ? "pt-3" : "pt-0")}
    >
      <div
        className={clsx(
          "flex w-full items-center justify-between transition-all duration-500 ease-out",
          scrolled
            ? "mx-4 max-w-3xl rounded-full border border-gold/15 bg-ivory/95 px-5 py-2.5 shadow-[0_8px_32px_-12px_rgba(23,23,23,0.25)]"
            : "max-w-none rounded-none border-transparent bg-transparent px-6 py-6 sm:px-10",
        )}
      >
        <Link href="/" onClick={handleLogoClick} aria-label="L'AMOUR — Inicio" className="flex flex-col leading-none">
          <span className="font-serif text-xl font-bold tracking-wide text-ink">
            L&apos;AMOUR
          </span>
          {!scrolled && (
            <span className="mt-0.5 text-[0.55rem] font-medium uppercase tracking-[0.35em] text-bronze">
              Estética y Sentidos
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={clsx("group relative text-sm transition-colors", active ? "text-ink" : "text-ink-soft hover:text-ink")}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 right-0 h-px origin-center scale-x-0 bg-ink-soft/50 transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <LinkButton href="/reservar" size="sm" className="px-5">
            Reservar
          </LinkButton>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="-m-2.5 flex items-center justify-center p-2.5 text-ink md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        id="mobile-nav"
        inert={!menuOpen}
        className={clsx(
          "fixed inset-x-4 top-20 z-40 overflow-hidden rounded-3xl border border-gold/15 bg-ivory/95 shadow-xl backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden",
          menuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-3 text-base text-ink-soft hover:bg-silk/60 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <LinkButton href="/reservar" size="md" className="mt-2 justify-center">
            Reservar Ahora
          </LinkButton>
        </div>
      </div>
    </motion.header>
  );
}
