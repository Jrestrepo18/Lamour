"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { adminUploadImage } from "@/lib/api";

/**
 * Multiple photos for a masseuse/service's detail-modal carousel. Stored the
 * same way the rest of the admin does — a semicolon-joined list of URLs — so
 * this is just a friendlier editor for that same string, with thumbnails and
 * a working upload button instead of hand-typing URLs into a textarea.
 */
export function GalleryUploadField({
  label,
  urls,
  onChange,
  token,
}: {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  token: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { url } = await adminUploadImage(file, token);
      onChange([...urls, url]);
    } catch {
      setError("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-1.5 text-xs font-sans font-medium text-ink-soft">
      {label}
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <div key={url + i} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-ink/15">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded/external URL */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Quitar esta foto"
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-ivory opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={11} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-ink/15 text-ink-soft/50 hover:border-gold hover:text-bronze disabled:opacity-50"
          aria-label="Agregar foto a la galería"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && <p className="text-[0.7rem] text-red-600">{error}</p>}
    </div>
  );
}
