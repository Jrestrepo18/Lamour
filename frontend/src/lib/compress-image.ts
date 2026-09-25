const MAX_SIDE = 2000;
const QUALITY = 0.85;

/**
 * Shrinks a photo on the device before upload: longest side 2000 px, JPEG 85 %.
 * A 6 MB phone photo becomes ~400 KB, so it uploads fast on mobile data and the
 * site serves a light file. Also turns formats the API won't take but the
 * browser can decode (e.g. HEIC in Safari) into JPEG. GIFs, small files, or
 * anything the browser can't decode go up untouched.
 */
export async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
  const acceptedAsIs = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!blob || (acceptedAsIs && blob.size >= file.size)) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}
