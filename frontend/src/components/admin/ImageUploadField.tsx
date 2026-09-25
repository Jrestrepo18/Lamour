"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { adminUploadImage } from "@/lib/api";

/**
 * Lets an admin either upload a file (stored on the .NET API and given back
 * a public URL) or paste a URL directly — some photos may already be hosted
 * elsewhere, so the manual field stays as an escape hatch.
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  token,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
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
      onChange(url);
    } catch {
      setError("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 text-xs font-sans font-medium text-ink-soft">
      {label}
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink/15 bg-marfil/60">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded/external URL, next/image needs a known remote host
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={20} className="text-ink-soft/40" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink-soft hover:border-gold disabled:opacity-50"
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
              {uploading ? "Subiendo…" : value ? "Cambiar foto" : "Subir foto"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Quitar foto"
                className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-2 py-1.5 text-xs text-ink-soft hover:border-red-300 hover:text-red-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="o pega una URL directamente"
            className="w-full rounded-lg border border-ink/15 px-3 py-1.5 text-xs outline-none focus:border-gold"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <p className="text-[0.7rem] text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
