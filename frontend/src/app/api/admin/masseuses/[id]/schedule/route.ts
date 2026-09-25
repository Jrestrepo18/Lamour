import { fail, idParam, int, ok, readJson, requireAdmin, route } from "@/server/http";
import { getSchedule, masseuseExists, saveSchedule } from "@/server/repo";
import { parseDate, parseHm } from "@/server/time";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  const schedule = id ? await getSchedule(id) : null;
  return schedule ? ok(schedule) : fail("Masajista no encontrada.", 404);
});

/** Replaces her whole agenda. An empty week means "works the business hours every day". */
export const PUT = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  if (!id || !(await masseuseExists(id))) return fail("Masajista no encontrada.", 404);

  const b = await readJson(request);
  if (!b) return fail("Solicitud no válida.");
  const interval = int(b.slotIntervalMinutes, 30);
  const buffer = int(b.bufferMinutes, 0);
  if (interval < 5 || interval > 240) return fail("El intervalo entre sesiones debe estar entre 5 y 240 minutos.");
  if (buffer < 0 || buffer > 240) return fail("El tiempo entre citas debe estar entre 0 y 240 minutos.");

  const blocks: { day: number; start: number; end: number }[] = [];
  for (const raw of Array.isArray(b.workingHours) ? (b.workingHours as Record<string, unknown>[]) : []) {
    const day = int(raw?.dayOfWeek, -1);
    const start = parseHm(String(raw?.start ?? ""));
    const end = parseHm(String(raw?.end ?? ""));
    if (day < 0 || day > 6) return fail("Día de la semana no válido.");
    if (start === null || end === null) return fail("Las horas deben tener el formato HH:mm.");
    if (end <= start) return fail("Cada bloque debe terminar después de empezar.");
    blocks.push({ day, start, end });
  }
  for (let day = 0; day < 7; day++) {
    const sorted = blocks.filter((x) => x.day === day).sort((x, y) => x.start - y.start);
    if (sorted.some((x, i) => i > 0 && x.start < sorted[i - 1].end)) return fail("Hay bloques que se cruzan en el mismo día.");
  }

  const timeOff = new Map<string, string | null>();
  for (const raw of Array.isArray(b.timeOff) ? (b.timeOff as Record<string, unknown>[]) : []) {
    const date = String(raw?.date ?? "");
    if (Number.isNaN(parseDate(date))) return fail("Fecha de día libre no válida.");
    const note = typeof raw?.note === "string" && raw.note.trim() ? raw.note.trim().slice(0, 120) : null;
    timeOff.set(date, note);
  }

  await saveSchedule(id, interval, buffer, blocks, [...timeOff].map(([date, note]) => ({ date, note })));
  return ok(await getSchedule(id));
});
