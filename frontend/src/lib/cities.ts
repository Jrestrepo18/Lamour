import { normalizePlace } from "./coverage";

/**
 * Local landing pages (/masajes-a-domicilio/[municipio]) for each covered
 * municipality. Medellín's page targets its barrios ("masajes a domicilio El
 * Poblado / Laureles" are real searches) so it complements the home page
 * instead of competing with it for the plain "masajes a domicilio Medellín".
 *
 * Each page needs something genuinely local, or Google treats the set as
 * doorway pages: the copy below describes the municipality and who books
 * there. It only states what the business already states site-wide (whole
 * municipality covered, 9 a.m.–9 p.m. every day) — no invented arrival times,
 * surcharges or client counts. Add real local proof here as it comes in
 * (reviews from clients in each municipality, typical arrival times).
 */
export type City = {
  name: string;
  slug: string;
  /** Short geographic framing, used in the meta description. */
  where: string;
  intro: string[];
  /** Well-known sectors, only as examples of the area covered. */
  sectors?: string[];
  /** Overrides the default "Masajes a domicilio en {name}" for <title> and the page heading. */
  seoTitle?: string;
};

export const CITIES: City[] = [
  {
    name: "Medellín",
    slug: "medellin",
    where: "en todos sus barrios",
    seoTitle: "Masajes a domicilio en El Poblado, Laureles y toda Medellín",
    intro: [
      "Del ritmo de oficinas y reuniones de El Poblado a la calma residencial de Laureles, Estadio o Belén, en Medellín cada barrio tiene su propia pausa. Llevamos el ritual hasta tu apartamento o casa, sin que tengas que cruzar la ciudad en el tráfico.",
      "Reservas en línea, eliges tu masajista y tu horario, y la terapeuta llega a tu barrio sin uniformes ni nada que revele el tipo de servicio. Te confirmamos la cita por WhatsApp.",
    ],
    sectors: ["El Poblado", "Laureles", "Estadio", "Belén", "La América", "Robledo"],
  },
  {
    name: "Envigado",
    slug: "envigado",
    where: "al sur de Medellín",
    intro: [
      "Envigado es vecino directo de El Poblado: apartamentos en la loma, casas en los barrios tradicionales y un ritmo de vida que pide pausas. Relajarte en tu propio espacio te evita volver a cruzar la ciudad después de un día largo.",
      "Llevamos el ritual completo hasta tu espacio en Envigado: la terapeuta llega sin uniformes ni nada que revele el tipo de servicio.",
    ],
    sectors: ["Zúñiga", "La Magnolia", "El Portal", "Loma del Escobero"],
  },
  {
    name: "Sabaneta",
    slug: "sabaneta",
    where: "al sur del Valle de Aburrá",
    intro: [
      "Sabaneta ha crecido hacia arriba: torres de apartamentos nuevas donde muchas personas trabajan desde casa y buscan una pausa real sin tener que salir a un spa. Para eso existe el masaje a domicilio.",
      "Reservas en línea, eliges masajista y horario, y la terapeuta llega a tu apartamento o casa en Sabaneta con total discreción.",
    ],
    sectors: ["Aves María", "Calle Larga", "La Doctora"],
  },
  {
    name: "Itagüí",
    slug: "itagui",
    where: "al suroccidente de Medellín",
    intro: [
      "En Itagüí, entre la industria y los barrios residenciales, el tiempo libre vale doble. Un masaje a domicilio te ahorra el trayecto y te deja el resto de la tarde para descansar de verdad.",
      "Atendemos en todo el municipio, con la misma reserva en línea y confirmación por WhatsApp que en el resto del Valle de Aburrá.",
    ],
    sectors: ["Santa María", "San Pío X", "Ditaires"],
  },
  {
    name: "Bello",
    slug: "bello",
    where: "al norte de Medellín",
    intro: [
      "Bello es la puerta norte del Valle de Aburrá y uno de sus municipios más poblados. Después de una jornada larga, lo último que apetece es volver a moverse: por eso el masaje llega a tu casa.",
      "Reserva tu masaje a domicilio en Bello y la terapeuta llega a tu dirección en el horario que elijas.",
    ],
    sectors: ["Niquía", "Cabañas", "Santa Ana", "Fontidueño"],
  },
  {
    name: "La Estrella",
    slug: "la-estrella",
    where: "al sur del Valle de Aburrá",
    intro: [
      "La Estrella combina urbanizaciones nuevas con zonas más tranquilas y verdes hacia la montaña: un entorno que ya invita a bajar el ritmo. Nosotros ponemos el resto.",
      "Llevamos masajes de relajación, terapias con calor y experiencias en pareja hasta tu casa en La Estrella, con reserva en línea y total discreción.",
    ],
    sectors: ["La Tablaza", "Pueblo Viejo"],
  },
  {
    name: "Caldas",
    slug: "caldas",
    where: "en el extremo sur del Valle de Aburrá",
    intro: [
      "Caldas está en el extremo sur del Valle de Aburrá, lejos del ruido del centro de Medellín: justo por eso tiene sentido que el spa vaya hasta ti y no al revés.",
      "Reservas en línea, eliges tu ritual y tu masajista, y te confirmamos por WhatsApp la llegada a tu dirección en Caldas.",
    ],
  },
  {
    name: "Rionegro",
    slug: "rionegro",
    where: "en el Oriente antioqueño",
    intro: [
      "Rionegro, en el Oriente antioqueño, es otro ritmo: fincas y condominios en Llanogrande, el casco urbano y el aeropuerto José María Córdova a pocos minutos. Aunque está fuera del Valle de Aburrá, también llegamos hasta aquí.",
      "Es ideal para quienes viven en el Oriente o pasan unos días allí y quieren un masaje en su propio espacio, sin bajar a Medellín.",
    ],
    sectors: ["Llanogrande", "San Antonio de Pereira"],
  },
];

export const cityPath = (city: Pick<City, "slug">) => `/masajes-a-domicilio/${city.slug}`;

export function findCity(slugOrName: string) {
  const n = normalizePlace(slugOrName).replace(/\s+/g, "-");
  return CITIES.find((c) => c.slug === n) ?? null;
}
