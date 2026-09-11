"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "./Preloader";
import { AgeGate } from "./AgeGate";

const STORAGE_KEY = "lamour_visited";
const PRELOADER_MS = 2000;

type Stage = "checking" | "preloader" | "age-gate" | "done";

export function SiteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const [stage, setStage] = useState<Stage>(isAdmin ? "done" : "checking");

  useEffect(() => {
    if (isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time gate decision derived from the route, not a render loop
      setStage("done");
      return;
    }

    let visited = false;
    try {
      visited = sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // Private browsing or storage disabled — treat as a fresh visit.
    }

    if (visited) {
      setStage("done");
      return;
    }

    setStage("preloader");
    const timer = setTimeout(() => setStage("age-gate"), PRELOADER_MS);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  function handleConfirm() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage failures — the gate simply reappears next load.
    }
    setStage("done");
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {stage === "checking" && <div key="checking" className="fixed inset-0 z-[100] bg-ink" />}
        {stage === "preloader" && <Preloader />}
        {stage === "age-gate" && <AgeGate onConfirm={handleConfirm} />}
      </AnimatePresence>
    </>
  );
}
