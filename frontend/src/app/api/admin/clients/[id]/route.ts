import { fail, idParam, ok, readJson, requireAdmin, route } from "@/server/http";
import { listClients, updateClient } from "@/server/clients";

type Ctx = { params: Promise<{ id: string }> };

/** Name, internal notes, and whether the client agreed to receive promotions. */
export const PUT = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const phone = idParam((await params).id);
  const b = await readJson(request);
  if (!phone || !/^\+\d{7,15}$/.test(phone) || !b) return fail("Solicitud no válida.");
  await updateClient(phone, {
    name: typeof b.name === "string" ? b.name.trim().slice(0, 120) : undefined,
    notes: typeof b.notes === "string" ? b.notes.trim().slice(0, 1000) : undefined,
    acceptsMarketing: typeof b.acceptsMarketing === "boolean" ? b.acceptsMarketing : undefined,
  });
  const updated = (await listClients()).find((c) => c.phone === phone);
  return updated ? ok(updated) : fail("Cliente no encontrado.", 404);
});
