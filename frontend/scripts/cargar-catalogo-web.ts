/**
 * One-off: loads the website's catalog into Firebase (spaapp-adaee), adapting
 * the existing model instead of replacing it.
 *
 *   node scripts/cargar-catalogo-web.ts            simulation — prints the plan, writes nothing
 *   node scripts/cargar-catalogo-web.ts --aplicar  applies it
 *
 * Needs FIREBASE_SERVICE_ACCOUNT_FILE (or firebase-admin.json next to package.json).
 * What it does:
 *   - categorias/{slug}: the site's five categories.
 *   - servicios: each site service under its site slug, with real names, prices,
 *     durations and texts. Former demo ids that correspond to a site service are
 *     renamed (their citas and therapists' servicioIds follow); unmatched ones are
 *     kept but deactivated.
 *   - terapeutas: servicioIds renamed accordingly (plus the site's new services for
 *     anyone who did every service), and the agenda fields the site uses.
 *   - meta/contadores.citas: continues after the highest LA-#### code.
 */
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { MOCK_CATEGORIES } from "../src/lib/mock-data.ts";

const APPLY = process.argv.includes("--aplicar");
const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE ?? new URL("../firebase-admin.json", import.meta.url);
const key = JSON.parse(readFileSync(keyPath, "utf8"));
const db = getFirestore(initializeApp({ credential: cert(key), projectId: key.project_id }));

/** Former demo service id → the site's service id. */
const RENAME: Record<string, string> = {
  "aceites-calientes": "aceites-calientes",
  "contacto-total": "ritual-contacto-total",
  "cuatro-manos": "masaje-cuatro-manos",
  "cuerpo-a-cuerpo": "cuerpo-a-cuerpo",
  "experiencia-en-pareja": "experiencia-en-pareja",
  "experiencia-sensorial": "masaje-sensorial",
  interactivo: "masaje-interactivo",
  muscular: "recuperacion-muscular-profunda",
  "piedras-volcanicas": "piedras-volcanicas",
  "ritual-lamour": "ritual-lamour-full-nuru",
  salvaje: "salvaje-cambio-de-roles",
  voyerista: "masaje-voyerista",
  "exfoliacion-pies": "masaje-pies-reflexologia",
};

const log = (...a: unknown[]) => console.log(APPLY ? "" : "[simulación]", ...a);

async function main() {
  const batch = db.batch();
  let writes = 0;
  const set = (ref: FirebaseFirestore.DocumentReference, data: object, merge = true) => {
    batch.set(ref, data, { merge });
    writes++;
  };

  // 1. Categories
  for (const c of MOCK_CATEGORIES) {
    set(db.collection("categorias").doc(c.id), {
      nombre: c.name,
      slug: c.slug,
      descripcion: c.description,
      destacado: c.highlight,
      orden: c.displayOrder,
      activa: c.isActive,
    });
  }
  log(`categorias: ${MOCK_CATEGORIES.map((c) => c.id).join(", ")}`);

  // 2. Services
  const existing = new Map((await db.collection("servicios").get()).docs.map((d) => [d.id, d.data()]));
  const oldFor = new Map(Object.entries(RENAME).map(([o, n]) => [n, o]));
  const siteIds = new Set<string>();
  for (const c of MOCK_CATEGORIES) {
    for (const s of c.services) {
      siteIds.add(s.id);
      const previous = existing.get(oldFor.get(s.id) ?? s.id) ?? existing.get(s.id);
      set(db.collection("servicios").doc(s.id), {
        nombre: s.name,
        slug: s.slug,
        categoria: c.id,
        descripcion: s.shortDescription,
        descripcionLarga: s.longDescription,
        duracionMin: s.durationMinutes,
        precio: s.price,
        numTerapeutas: s.requiresTwoTherapists ? 2 : 1,
        permiteExtension: s.allowsExtraTime,
        opcionVestidura: s.hasSensoryDressOption,
        experienciaPareja: s.isCoupleExperience,
        fotoUrl: s.imageUrl,
        fotos: s.imageGallery,
        incluye: s.highlights,
        activo: s.isActive,
        orden: s.displayOrder,
        bufferMin: previous?.bufferMin ?? 0,
        permiteDomicilio: previous?.permiteDomicilio ?? true,
        precioExtension30: previous?.precioExtension30 ?? 0,
      });
      log(`servicio ${s.id}${oldFor.get(s.id) && oldFor.get(s.id) !== s.id ? `  (antes: ${oldFor.get(s.id)})` : previous ? "" : "  (nuevo)"}  $${s.price} ${s.durationMinutes}m`);
    }
  }
  for (const [id, data] of existing) {
    if (siteIds.has(id)) continue;
    if (RENAME[id]) {
      batch.delete(db.collection("servicios").doc(id));
      writes++;
      log(`servicio ${id} → renombrado a ${RENAME[id]} (se borra el id viejo)`);
    } else {
      set(db.collection("servicios").doc(id), { activo: false, categoria: data.categoria === "SENSORIAL" ? "sensoriales" : data.categoria });
      log(`servicio ${id} → sin equivalente en la web: se desactiva`);
    }
  }

  // 3. Bookings pointing at renamed services
  const citas = await db.collection("citas").get();
  let maxCode = 0;
  for (const c of citas.docs) {
    const n = Number(/^LA-(\d+)$/.exec(c.id)?.[1] ?? 0);
    maxCode = Math.max(maxCode, n);
    const to = RENAME[c.get("servicioId")];
    if (to && to !== c.get("servicioId")) {
      batch.update(c.ref, { servicioId: to });
      writes++;
    }
  }
  log(`citas: ${citas.size} revisadas; contador de códigos continúa en LA-${String(maxCode + 1).padStart(4, "0")}`);
  set(db.collection("meta").doc("contadores"), { citas: maxCode });

  // 4. Therapists: renamed servicioIds + agenda fields
  const allOld = [...existing.keys()];
  const newSite = [...siteIds].filter((id) => !oldFor.has(id) && !existing.has(id));
  for (const t of (await db.collection("terapeutas").get()).docs) {
    const had: string[] = t.get("servicioIds") ?? [];
    const didAll = allOld.every((id) => had.includes(id));
    const mapped = [...new Set(had.map((id) => RENAME[id] ?? id).filter((id) => siteIds.has(id)))];
    const servicioIds = didAll ? [...new Set([...mapped, ...newSite])] : mapped;
    set(t.ref, {
      servicioIds,
      intervaloMin: t.get("intervaloMin") ?? 30,
      bufferMin: t.get("bufferMin") ?? 0,
      diasLibres: t.get("diasLibres") ?? [],
      fotos: t.get("fotos") ?? [],
    });
    log(`terapeuta ${t.get("nombreArtistico")}: ${servicioIds.length} servicios`);
  }

  set(db.collection("meta").doc("catalogoWeb"), { cargadoEn: FieldValue.serverTimestamp() });
  log(`${writes} escrituras en total`);

  if (APPLY) {
    await batch.commit();
    console.log("Aplicado.");
  } else {
    console.log("\nNada se escribió. Ejecuta con --aplicar para aplicarlo.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
