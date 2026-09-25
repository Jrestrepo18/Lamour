import { randomUUID } from "node:crypto";
import { bucket, STORAGE_BUCKET } from "@/server/db";
import { fail, ok, requireAdmin, route } from "@/server/http";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Vercel caps a function's request body at 4.5 MB; photos arrive already shrunk on the device (~0.4 MB). */
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * One photo per request into Firebase Storage (spaapp-adaee), under fotos/.
 * It gets a download token, the same public URL form the Firebase console
 * uses, so it shows on the site without opening the bucket's security rules.
 */
export const POST = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("No se recibió ninguna foto.");
  const ext = TYPES[file.type];
  if (!ext) return fail("Formato no permitido. Usa JPG, PNG, WEBP o GIF.");
  if (file.size > MAX_BYTES) return fail("La foto pesa más de 4 MB.");

  const path = `fotos/${randomUUID()}.${ext}`;
  const token = randomUUID();
  await bucket()
    .file(path)
    .save(Buffer.from(await file.arrayBuffer()), {
      resumable: false,
      contentType: file.type,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

  const url = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
  return ok({ url }, 201);
});
