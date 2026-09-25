import { changeAdminPassword, findAdmin } from "@/server/repo";
import { verifyPassword } from "@/server/auth";
import { fail, ok, readJson, requireAdmin, route } from "@/server/http";

/** The signed-in admin changes their own password; the current one is always required. */
export const POST = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;

  const body = await readJson(request);
  const current = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const next = typeof body?.newPassword === "string" ? body.newPassword : "";

  const user = await findAdmin(admin.sub);
  if (!user || !verifyPassword(current, user.password_hash)) return fail("La contraseña actual no es correcta.");
  if (next.length < 10) return fail("La nueva contraseña debe tener al menos 10 caracteres.");
  if (next === current) return fail("La nueva contraseña debe ser distinta de la actual.");

  await changeAdminPassword(user.username, next);
  return ok({ ok: true });
});
