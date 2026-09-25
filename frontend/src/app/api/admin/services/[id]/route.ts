import { fail, idParam, ok, readJson, refreshPublicPages, requireAdmin, route } from "@/server/http";
import { parseService } from "@/server/inputs";
import { categoryExists, deleteService, updateService } from "@/server/repo";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  if (!id) return fail("Servicio no encontrado.", 404);
  const input = parseService(await readJson(request));
  if (typeof input === "string") return fail(input);
  if (!(await categoryExists(input.serviceCategoryId))) return fail("Categoría no válida.");
  const updated = await updateService(id, input);
  if (!updated) return fail("Servicio no encontrado.", 404);
  refreshPublicPages();
  return ok(updated);
});

export const DELETE = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  if (!id || !(await deleteService(id))) return fail("Servicio no encontrado.", 404);
  refreshPublicPages();
  return new Response(null, { status: 204 });
});
