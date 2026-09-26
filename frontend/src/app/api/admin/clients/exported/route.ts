import { fail, ok, readJson, requireAdmin, route, strList } from "@/server/http";
import { markExported } from "@/server/clients";

/** Records which clients were downloaded for a WhatsApp broadcast list. */
export const POST = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const phones = strList((await readJson(request))?.phones).filter((p) => /^\+\d{7,15}$/.test(p));
  if (phones.length === 0) return fail("No hay contactos para marcar.");
  return ok({ marked: await markExported(phones.slice(0, 2000)) });
});
