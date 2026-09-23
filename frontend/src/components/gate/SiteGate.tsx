"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AGE_STORAGE_KEY } from "@/lib/age-gate";
import { AgeGate } from "./AgeGate";

export function SiteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  // null = not hydrated yet (the boot script + CSS own visibility until then).
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs with the attribute the boot script already set
    setConfirmed(isAdmin || document.documentElement.hasAttribute("data-age-ok"));
  }, [isAdmin]);

  function handleConfirm() {
    try {
      sessionStorage.setItem(AGE_STORAGE_KEY, "true");
    } catch {
      // Private mode / storage disabled — the gate simply reappears next load.
    }
    document.documentElement.setAttribute("data-age-ok", "");
    setConfirmed(true);
  }

  const gated = confirmed === false;

  return (
    <>
      {/* inert keeps the page behind the gate out of the tab order and away from
          screen readers while the dialog is up. */}
      <div inert={gated} className="flex min-h-full flex-1 flex-col">
        {children}
      </div>
      {confirmed !== true && !isAdmin && <AgeGate onConfirm={handleConfirm} />}
    </>
  );
}
