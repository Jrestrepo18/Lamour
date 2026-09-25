import { listMasseuses } from "@/server/repo";
import { ok, route } from "@/server/http";

export const GET = route(async () => ok(await listMasseuses(true)));
