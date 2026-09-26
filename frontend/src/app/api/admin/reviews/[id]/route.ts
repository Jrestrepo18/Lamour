import type { ReviewStatus } from "@/lib/types";
import { fail, idParam, ok, readJson, refreshPublicPages, requireAdmin, route } from "@/server/http";
import { deleteManualReview, updateReview } from "@/server/reviews";

type Ctx = { params: Promise<{ id: string }> };
const STATUSES: ReviewStatus[] = ["Pending", "Published", "Hidden"];

/** Publish / hide a review, or reply to it. The client's own words are never edited. */
export const PUT = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  const b = await readJson(request);
  if (!id || !b) return fail("Solicitud no válida.");
  const status = STATUSES.includes(b.status as ReviewStatus) ? (b.status as ReviewStatus) : undefined;
  const reply = b.reply === null ? null : typeof b.reply === "string" ? b.reply.trim().slice(0, 400) || null : undefined;
  const updated = await updateReview(id, { status, reply });
  if (!updated) return fail("Opinión no encontrada.", 404);
  refreshPublicPages();
  return ok(updated);
});

export const DELETE = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  const result = id ? await deleteManualReview(id) : "not-found";
  if (result === "not-found") return fail("Opinión no encontrada.", 404);
  if (result === "client-review") return fail("Las opiniones de clientas no se borran; puedes ocultarlas.");
  refreshPublicPages();
  return new Response(null, { status: 204 });
});
