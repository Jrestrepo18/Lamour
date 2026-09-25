import { ping } from "@/server/repo";
import { ok, route } from "@/server/http";

/** Quick check after a deploy: database reachable, schema in place, catalog seeded. */
export const GET = route(async () => ok({ ok: true, database: "conectada", ...(await ping()) }));
