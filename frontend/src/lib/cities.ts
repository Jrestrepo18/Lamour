import { normalizePlace } from "./coverage";
import type { Locale } from "@/i18n/config";

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
  /** English versions of the fields above (the /en pages). */
  whereEn: string;
  introEn: string[];
  seoTitleEn?: string;
};

export const CITIES: City[] = [
  {
    name: "Medellín",
    slug: "medellin",
    whereEn: "in every neighbourhood",
    seoTitleEn: "In-home massage in El Poblado and Laureles, Medellín",
    introEn: [
      "From the offices and meetings of El Poblado to the residential calm of Laureles, Estadio or Belén, every neighbourhood in Medellín has its own kind of pause. We bring the ritual to your apartment, house or hotel room, so you don't have to cross the city in traffic.",
      "Book online, choose your therapist and your time, and she arrives in your neighbourhood with no uniform and nothing that reveals the type of service. We confirm your appointment on WhatsApp.",
    ],
    where: "en todos sus barrios",
    seoTitle: "Masajes a domicilio en El Poblado y Laureles, Medellín",
    intro: [
      "Del ritmo de oficinas y reuniones de El Poblado a la calma residencial de Laureles, Estadio o Belén, en Medellín cada barrio tiene su propia pausa. Llevamos el ritual hasta tu apartamento o casa, sin que tengas que cruzar la ciudad en el tráfico.",
      "Reservas en línea, eliges tu masajista y tu horario, y la terapeuta llega a tu barrio sin uniformes ni nada que revele el tipo de servicio. Te confirmamos la cita por WhatsApp.",
    ],
    sectors: ["El Poblado", "Laureles", "Estadio", "Belén", "La América", "Robledo"],
  },
  {
    name: "Envigado",
    slug: "envigado",
    whereEn: "just south of Medellín",
    introEn: [
      "Envigado sits right next to El Poblado: hillside apartments, traditional neighbourhoods and a pace of life that calls for pauses. Relaxing in your own space saves you crossing the city again after a long day.",
      "We bring the complete ritual to your place in Envigado: the therapist arrives with no uniform and nothing that reveals the type of service.",
    ],
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
    whereEn: "in the south of the Aburrá Valley",
    introEn: [
      "Sabaneta has grown upwards: new apartment towers where many people work from home — including plenty of remote workers — and want a real pause without going out to a spa. That's what in-home massage is for.",
      "Book online, choose your therapist and time, and she arrives at your apartment or house in Sabaneta with complete discretion.",
    ],
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
    whereEn: "south-west of Medellín",
    introEn: [
      "In Itagüí, between industry and residential neighbourhoods, free time counts double. An in-home massage saves you the trip and leaves the rest of the afternoon for real rest.",
      "We cover the whole municipality, with the same online booking and WhatsApp confirmation as everywhere else in the Aburrá Valley.",
    ],
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
    whereEn: "north of Medellín",
    introEn: [
      "Bello is the northern gateway to the Aburrá Valley and one of its most populated municipalities. After a long day, the last thing you want is to go out again: that's why the massage comes to you.",
      "Book your in-home massage in Bello and the therapist arrives at your address at the time you choose.",
    ],
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
    whereEn: "in the south of the Aburrá Valley",
    introEn: [
      "La Estrella mixes new developments with quieter, greener areas towards the mountains: a setting that already invites you to slow down. We take care of the rest.",
      "We bring relaxation massages, heat therapies and couples experiences to your home in La Estrella, with online booking and complete discretion.",
    ],
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
    whereEn: "at the southern end of the Aburrá Valley",
    introEn: [
      "Caldas lies at the southern end of the Aburrá Valley, far from the noise of central Medellín: which is exactly why it makes sense for the spa to come to you, not the other way round.",
      "Book online, choose your ritual and your therapist, and we'll confirm the visit to your address in Caldas on WhatsApp.",
    ],
    where: "en el extremo sur del Valle de Aburrá",
    intro: [
      "Caldas está en el extremo sur del Valle de Aburrá, lejos del ruido del centro de Medellín: justo por eso tiene sentido que el spa vaya hasta ti y no al revés.",
      "Reservas en línea, eliges tu ritual y tu masajista, y te confirmamos por WhatsApp la llegada a tu dirección en Caldas.",
    ],
  },
  {
    name: "Rionegro",
    slug: "rionegro",
    whereEn: "in eastern Antioquia",
    introEn: [
      "Rionegro, in eastern Antioquia, runs at a different pace: country houses and gated communities in Llanogrande, the town centre and José María Córdova airport just minutes away. Although it's outside the Aburrá Valley, we come here too.",
      "It's ideal if you live in the east of Antioquia or are staying a few days — perhaps near the airport — and want a massage in your own space without going down to Medellín.",
    ],
    where: "en el Oriente antioqueño",
    intro: [
      "Rionegro, en el Oriente antioqueño, es otro ritmo: fincas y condominios en Llanogrande, el casco urbano y el aeropuerto José María Córdova a pocos minutos. Aunque está fuera del Valle de Aburrá, también llegamos hasta aquí.",
      "Es ideal para quienes viven en el Oriente o pasan unos días allí y quieren un masaje en su propio espacio, sin bajar a Medellín.",
    ],
    sectors: ["Llanogrande", "San Antonio de Pereira"],
  },
];

/** A city's copy in the page's language. */
export function localizeCity(city: City, lang: Locale) {
  if (lang !== "en") return city;
  return { ...city, where: city.whereEn, intro: city.introEn, seoTitle: city.seoTitleEn };
}

export const cityPath = (city: Pick<City, "slug">) => `/masajes-a-domicilio/${city.slug}`;

export function findCity(slugOrName: string) {
  const n = normalizePlace(slugOrName).replace(/\s+/g, "-");
  return CITIES.find((c) => c.slug === n) ?? null;
}
