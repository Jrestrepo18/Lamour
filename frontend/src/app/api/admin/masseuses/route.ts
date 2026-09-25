import { fail, ok, readJson, refreshPublicPages, requireAdmin, route } from "@/server/http";
import { parseMasseuse } from "@/server/inputs";
import { createMasseuse, listMasseusesAdmin } from "@/server/repo";

export const GET = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  return ok(await listMasseusesAdmin());
});

export const POST = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const input = parseMasseuse(await readJson(request));
  if (typeof input === "string") return fail(input);
  const created = await createMasseuse(input);
  refreshPublicPages();
  return ok(created, 201);
});
