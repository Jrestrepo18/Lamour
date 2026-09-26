import "server-only";
import { MOCK_CATEGORIES, MOCK_MASSEUSES } from "@/lib/mock-data";
import type { Masseuse, ReviewSummary, ServiceCategory } from "@/lib/types";
import { isDatabaseConfigured } from "./db";
import { listCategories, listMasseuses } from "./repo";
import { publishedReviews } from "./reviews";

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

/** Published reviews for the public pages. Without a database there are none — nothing is invented. */
export async function getReviews(): Promise<ReviewSummary> {
  if (!isDatabaseConfigured()) return { count: 0, average: 0, reviews: [] };
  return publishedReviews();
}
