import { fail, ok, readJson, refreshPublicPages, requireAdmin, route } from "@/server/http";
import { parseService } from "@/server/inputs";
import { categoryExists, createService, listServicesAdmin } from "@/server/repo";

export const GET = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  return ok(await listServicesAdmin());
});

export const POST = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const input = parseService(await readJson(request));
  if (typeof input === "string") return fail(input);
  if (!(await categoryExists(input.serviceCategoryId))) return fail("Categoría no válida.");
  const created = await createService(input);
  refreshPublicPages();
  return ok(created, 201);
});
