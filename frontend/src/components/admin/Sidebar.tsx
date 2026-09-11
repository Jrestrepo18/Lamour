"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { CalendarDays, LogOut, Sparkles, Users } from "lucide-react";
import { clearAdminSession } from "@/lib/admin-auth";

const LINKS = [
  { href: "/admin/dashboard/citas", label: "Citas", icon: CalendarDays },
  { href: "/admin/dashboard/masajistas", label: "Masajistas", icon: Users },
  { href: "/admin/dashboard/servicios", label: "Servicios", icon: Sparkles },
];

export function Sidebar({ fullName }: { fullName: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-ivory/10 bg-ink px-4 py-8">
      <div className="px-2">
        <span className="font-serif text-xl italic text-ivory">L&apos;AMOUR</span>
        <p className="text-[0.6rem] font-sans uppercase tracking-[0.3em] text-gold">Admin</p>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-sans transition-colors",
                active ? "bg-gold/10 text-gold" : "text-ivory/60 hover:bg-white/5 hover:text-ivory",
              )}
            >
              <link.icon size={17} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ivory/10 pt-4">
        {fullName && <p className="px-3 text-xs text-ivory/50">{fullName}</p>}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-sans text-ivory/60 transition-colors hover:bg-white/5 hover:text-ivory"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
