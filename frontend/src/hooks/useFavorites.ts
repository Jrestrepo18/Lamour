"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Saved services ("♡ guardados"), kept only on the visitor's own device —
 * no account, no personal data. Every component reading this hook stays in
 * sync (same tab via a custom event, other tabs via the storage event).
 */
const KEY = "lamour_favoritos";
const EVENT = "lamour:favorites";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

// useSyncExternalStore needs a stable snapshot between changes, so cache by raw string.
let cacheRaw: string | null = null;
let cacheValue: string[] = [];
function snapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cacheValue = read();
  }
  return cacheValue;
}

const EMPTY: string[] = [];

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  const write = useCallback((next: string[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode): saving silently does nothing.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);
  const toggle = useCallback(
    (slug: string) => write(favorites.includes(slug) ? favorites.filter((s) => s !== slug) : [...favorites, slug]),
    [favorites, write],
  );
  const add = useCallback(
    (slug: string) => {
      if (!favorites.includes(slug)) write([...favorites, slug]);
    },
    [favorites, write],
  );

  return { favorites, isFavorite, toggle, add };
}
