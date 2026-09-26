import { ok, requireAdmin, route } from "@/server/http";
import { listClients } from "@/server/clients";

export const GET = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  return ok(await listClients());
});
