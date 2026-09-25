import "server-only";
import { bool, id, int, optStr, str, strList } from "./http";
import type { MasseuseInput, ServiceInput } from "./repo";

/** Validates an admin masseuse form; returns the clean input or a message in Spanish. */
export function parseMasseuse(b: Record<string, unknown> | null): MasseuseInput | string {
  if (!b) return "Solicitud no válida.";
  const stageName = str(b.stageName);
  const whatsAppNumber = str(b.whatsAppNumber).replace(/\D/g, "");
  if (!stageName) return "Escribe su nombre artístico.";
  if (whatsAppNumber.length < 10) return "Escribe su WhatsApp con indicativo (ej. 573001234567).";
  const age = b.age == null || b.age === "" ? null : int(b.age);
  return {
    stageName: stageName.slice(0, 80),
    age: age && age >= 18 && age < 100 ? age : null,
    bio: optStr(b.bio)?.slice(0, 1000) ?? null,
    photoUrl: optStr(b.photoUrl),
    photoGallery: strList(b.photoGallery).slice(0, 30),
    whatsAppNumber,
    imageConsent: bool(b.imageConsent),
    displayOrder: int(b.displayOrder),
    isActive: bool(b.isActive),
  };
}

/** "Masaje de Piedras Volcánicas" → "masaje-de-piedras-volcanicas" */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseService(b: Record<string, unknown> | null): ServiceInput | string {
  if (!b) return "Solicitud no válida.";
  const name = str(b.name);
  const shortDescription = str(b.shortDescription);
  const durationMinutes = int(b.durationMinutes);
  const price = Number(b.price);
  if (!name) return "Escribe el nombre del servicio.";
  if (!shortDescription) return "Escribe una descripción corta.";
  if (durationMinutes < 5 || durationMinutes > 600) return "La duración debe estar entre 5 y 600 minutos.";
  if (!(price > 0)) return "Indica el precio.";
  return {
    serviceCategoryId: id(b.serviceCategoryId) ?? "",
    name: name.slice(0, 120),
    slug: slugify(str(b.slug) || name).slice(0, 120),
    shortDescription: shortDescription.slice(0, 300),
    longDescription: optStr(b.longDescription)?.slice(0, 4000) ?? null,
    durationMinutes,
    price: Math.round(price),
    imageUrl: optStr(b.imageUrl),
    imageGallery: strList(b.imageGallery).slice(0, 30),
    highlights: strList(b.highlights).slice(0, 12),
    requiresTwoTherapists: bool(b.requiresTwoTherapists),
    hasSensoryDressOption: bool(b.hasSensoryDressOption),
    allowsExtraTime: bool(b.allowsExtraTime),
    isCoupleExperience: bool(b.isCoupleExperience),
    displayOrder: int(b.displayOrder),
    isActive: bool(b.isActive),
  };
}
