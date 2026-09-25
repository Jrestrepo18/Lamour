import "server-only";
import { MOCK_CATEGORIES, MOCK_MASSEUSES } from "@/lib/mock-data";
import type { Masseuse, ServiceCategory } from "@/lib/types";
import { isDatabaseConfigured } from "./db";
import { listCategories, listMasseuses } from "./repo";

/**
 * Catalog for server-rendered pages, read straight from the database (no HTTP
 * round trip to our own API, which doesn't exist yet while the site is being
 * built). Without a database — local development — the demo catalog is used.
 * Pages regenerate every minute and immediately after an admin edit.
 */
export async function getServiceCategories(): Promise<{ data: ServiceCategory[]; isDemo: boolean }> {
  if (!isDatabaseConfigured()) return { data: MOCK_CATEGORIES, isDemo: true };
  return { data: await listCategories(true), isDemo: false };
}

export async function getMasseuses(): Promise<{ data: Masseuse[]; isDemo: boolean }> {
  if (!isDatabaseConfigured()) return { data: MOCK_MASSEUSES, isDemo: true };
  return { data: await listMasseuses(true), isDemo: false };
}
