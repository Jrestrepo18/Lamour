"use client";

import { useRouter } from "next/navigation";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";

/**
 * Keeps an open public page current without reloading it: every 30 s (and when the
 * visitor comes back to the tab) the page's server data — services, prices, photos,
 * the team — is fetched again and merged in place. Scroll position, open sheets and
 * anything typed in the booking form stay as they are.
 */
export function LiveRefresh() {
  const router = useRouter();
  useAutoRefresh(() => router.refresh(), 30_000);
  return null;
}
