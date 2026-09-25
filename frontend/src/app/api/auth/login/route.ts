import { signToken, verifyPassword } from "@/server/auth";
import { fail, ok, readJson, route, str } from "@/server/http";
import { findAdmin } from "@/server/repo";

export const POST = route(async (request: Request) => {
  const body = await readJson(request);
  const username = str(body?.username);
  const password = typeof body?.password === "string" ? body.password : "";
  const user = username ? await findAdmin(username) : undefined;
  if (!user || !verifyPassword(password, user.password_hash)) {
    return fail("Usuario o contraseña incorrectos.", 401);
  }
  const { token, expiresAt } = signToken({ username: user.username, fullName: user.full_name, role: user.role });
  return ok({ token, expiresAt, fullName: user.full_name, username: user.username });
});
