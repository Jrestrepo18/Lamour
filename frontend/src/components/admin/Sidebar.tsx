"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { CalendarDays, ExternalLink, LogOut, Menu, Sparkles, Users, X } from "lucide-react";
import { clearAdminSession } from "@/lib/admin-auth";

const LINKS = [
  { href: "/admin/dashboard/citas", label: "Citas", icon: CalendarDays },
  { href: "/admin/dashboard/masajistas", label: "Masajistas", icon: Users },
  { href: "/admin/dashboard/servicios", label: "Servicios", icon: Sparkles },
];

/**
 * Admin navigation in the site's own light palette. Fixed rail from lg up;
 * below that, a top bar with a slide-down menu so the panel is usable on a phone.
 */
export function Sidebar({ fullName }: { fullName: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closes the mobile menu on route change
    setOpen(false);
  }, [pathname]);

  function handleLogout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  const brand = (
    <Link href="/admin/dashboard" className="flex flex-col leading-none">
      <span className="font-serif text-xl font-bold tracking-wide text-ink">L&apos;AMOUR</span>
      <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-bronze">Panel admin</span>
    </Link>
  );

  const nav = (
    <nav aria-label="Panel de administración" className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active ? "bg-ink text-ivory" : "text-ink-soft hover:bg-marfil/70 hover:text-ink",
            )}
          >
            <link.icon size={17} aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-1 border-t border-ink/10 pt-4">
      {fullName && <p className="px-3 pb-2 text-xs text-ink-soft">Sesión de {fullName}</p>}
      <Link
        href="/"
        target="_blank"
        className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-ink-soft transition-colors hover:bg-marfil/70 hover:text-ink"
      >
        <ExternalLink size={17} aria-hidden />
        Ver sitio
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm text-ink-soft transition-colors hover:bg-marfil/70 hover:text-ink"
      >
        <LogOut size={17} aria-hidden />
        Cerrar sesión
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-10 border-r border-ink/10 bg-silk/40 px-4 py-8 lg:flex">
        <div className="px-2">{brand}</div>
        <div className="flex-1">{nav}</div>
        {footer}
      </aside>

      {/* Phone: slim top bar (brand + account) and an app-style tab bar at the bottom */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory lg:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          {brand}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-mobile-account"
            aria-label={open ? "Cerrar opciones" : "Opciones de la cuenta"}
            className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center text-ink"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div id="admin-mobile-account" hidden={!open} className="border-t border-ink/10 px-4 pb-4 pt-3">
          {footer}
        </div>
      </header>

      <nav
        aria-label="Secciones del panel"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-ivory pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid grid-cols-3">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-semibold transition-colors",
                    active ? "text-ink" : "text-ink-soft",
                  )}
                >
                  <link.icon size={22} strokeWidth={active ? 2.4 : 1.8} aria-hidden />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
