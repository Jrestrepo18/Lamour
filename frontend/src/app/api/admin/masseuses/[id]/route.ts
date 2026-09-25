import { fail, idParam, ok, readJson, refreshPublicPages, requireAdmin, route } from "@/server/http";
import { parseMasseuse } from "@/server/inputs";
import { deleteMasseuse, updateMasseuse } from "@/server/repo";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  if (!id) return fail("Masajista no encontrada.", 404);
  const input = parseMasseuse(await readJson(request));
  if (typeof input === "string") return fail(input);
  const updated = await updateMasseuse(id, input);
  if (!updated) return fail("Masajista no encontrada.", 404);
  refreshPublicPages();
  return ok(updated);
});

export const DELETE = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  if (!id || !(await deleteMasseuse(id))) return fail("Masajista no encontrada.", 404);
  refreshPublicPages();
  return new Response(null, { status: 204 });
});
