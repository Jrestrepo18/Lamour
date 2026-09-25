"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import { adminUploadImages } from "@/lib/api";
import { compressImage } from "@/lib/compress-image";

type Pending = { id: string; preview: string };

/**
 * All of a profile's / service's photos as one Instagram-style grid. The first
 * photo is the cover ("Portada"); the rest are the gallery. Pick several at
 * once from the phone's gallery or the computer (or drop them on desktop):
 * they're shrunk on the device, uploaded in one request, and show a live
 * preview with a spinner meanwhile. Tap a photo to make it the cover, move it
 * or remove it.
 */
export function PhotosField({
  label,
  hint,
  photos,
  onChange,
  onBusyChange,
  token,
}: {
  label: string;
  hint?: string;
  photos: string[];
  onChange: (photos: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
  token: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  // Uploads finish after the user may have reordered, so always append to the latest list.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    onBusyChange?.(pending.length > 0);
  }, [pending.length, onBusyChange]);

  async function addFiles(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (files.length === 0) return;
    setErrors([]);
    setSelected(null);

    const batch = files.map((f) => ({ id: `${Date.now()}-${Math.random()}`, preview: URL.createObjectURL(f) }));
    setPending((p) => [...p, ...batch]);

    try {
      const ready = await Promise.all(files.map(compressImage));
      const { urls, errors: rejected } = await adminUploadImages(ready, token);
      onChange([...photosRef.current, ...urls]);
      setErrors(rejected);
    } catch {
      setErrors(["No se pudieron subir las fotos. Revisa la conexión e inténtalo de nuevo."]);
    } finally {
      batch.forEach((b) => URL.revokeObjectURL(b.preview));
      setPending((p) => p.filter((x) => !batch.some((b) => b.id === x.id)));
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setSelected(to);
  }

  function remove(index: number) {
    onChange(photos.filter((_, i) => i !== index));
    setSelected(null);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-soft">
          {photos.length} {photos.length === 1 ? "foto" : "fotos"}
        </p>
      </div>
      {hint && <p className="mt-0.5 text-xs text-ink-soft">{hint}</p>}

      <div
        className={clsx(
          "mt-3 grid grid-cols-3 gap-1 overflow-hidden rounded-2xl transition-shadow sm:grid-cols-4",
          dragOver && "shadow-[0_0_0_2px_var(--color-gold)]",
        )}
      >
        {photos.map((url, i) => (
          <button
            key={url + i}
            type="button"
            onClick={() => setSelected(selected === i ? null : i)}
            aria-pressed={selected === i}
            aria-label={`${i === 0 ? "Portada" : `Foto ${i + 1}`}: opciones`}
            className={clsx(
              "relative aspect-square cursor-pointer overflow-hidden bg-silk outline-none",
              selected === i && "ring-[3px] ring-inset ring-ink",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[0.65rem] font-semibold text-ivory">
                <Star size={10} className="fill-current" aria-hidden />
                Portada
              </span>
            )}
          </button>
        ))}

        {pending.map((p) => (
          <div key={p.id} className="relative aspect-square overflow-hidden bg-silk">
            {/* eslint-disable-next-line @next/next/no-img-element -- local preview (blob URL) while uploading */}
            <img src={p.preview} alt="" className="h-full w-full object-cover opacity-50" />
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={22} className="animate-spin text-ink" aria-label="Subiendo" />
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 bg-marfil text-ink-soft transition-colors hover:bg-silk/60 hover:text-ink"
        >
          <ImagePlus size={22} aria-hidden />
          <span className="text-xs font-medium">Agregar</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {selected !== null && photos[selected] && (
        <div className="mt-3 flex animate-fade-in flex-wrap items-center gap-2" role="toolbar" aria-label="Opciones de la foto">
          {selected !== 0 && (
            <button type="button" onClick={() => move(selected, 0)} className={toolClass}>
              <Star size={14} aria-hidden /> Hacer portada
            </button>
          )}
          <button type="button" onClick={() => move(selected, selected - 1)} disabled={selected === 0} className={toolClass} aria-label="Mover antes">
            <ChevronLeft size={16} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => move(selected, selected + 1)}
            disabled={selected === photos.length - 1}
            className={toolClass}
            aria-label="Mover después"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
          <button type="button" onClick={() => remove(selected)} className={clsx(toolClass, "text-red-700 hover:bg-red-50")}>
            <Trash2 size={14} aria-hidden /> Quitar
          </button>
        </div>
      )}

      {photos.length === 0 && pending.length === 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
          <UploadCloud size={14} aria-hidden />
          Puedes elegir varias fotos a la vez desde tu celular o computador.
        </p>
      )}

      {errors.length > 0 && (
        <ul role="alert" className="mt-2 space-y-0.5 text-xs text-red-700">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const toolClass =
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-marfil px-3.5 text-sm font-medium text-ink transition-colors hover:bg-silk/60 disabled:opacity-35";
