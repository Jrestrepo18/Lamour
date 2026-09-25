import type { NextRequest } from "next/server";
import { daySlots } from "@/server/availability";
import { fail, idParam, ok, route } from "@/server/http";

export const GET = route(async (request: NextRequest) => {
  const q = request.nextUrl.searchParams;
  const masseuseId = idParam(q.get("masseuseId") ?? "");
  const duration = Number(q.get("durationMinutes"));
  const date = q.get("date") ?? "";
  if (!masseuseId || !(duration > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return fail("masseuseId, date (AAAA-MM-DD) y durationMinutes son requeridos.");
  }
  return ok(await daySlots(masseuseId, date, duration));
});
