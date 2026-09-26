"use client";

import { useEffect, useRef } from "react";

/**
 * Keeps data fresh without reloading the page: runs `refresh` every `intervalMs`
 * while the tab is visible, and right away when the user comes back to it
 * (switching apps on the phone, returning to the browser tab). Hidden tabs don't
 * poll, so a forgotten tab costs nothing.
 */
export function useAutoRefresh(refresh: () => void | Promise<void>, intervalMs: number, enabled = true) {
  const latest = useRef(refresh);
  useEffect(() => {
    latest.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!enabled) return;
    let busy = false;
    const run = async () => {
      if (busy || document.visibilityState !== "visible") return;
      busy = true;
      try {
        await latest.current();
      } catch {
        // A failed background refresh keeps what's on screen; the next tick tries again.
      } finally {
        busy = false;
      }
    };
    const timer = window.setInterval(run, intervalMs);
    const onVisible = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [intervalMs, enabled]);
}
