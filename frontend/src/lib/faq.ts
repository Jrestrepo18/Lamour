import type { Locale } from "@/i18n/config";

/**
 * The home page's frequently asked questions, in both languages. One source for
 * the chat (the `quick` ones), the full list and the FAQPage structured data.
 *
 * Only facts the business already states elsewhere (catalog, booking flow,
 * Términos y Condiciones, Política de Datos) or the owner confirmed (hotels,
 * the therapist brings the table). Questions still unconfirmed — minimum notice,
 * travel surcharges — are deliberately left out rather than guessed.
 */
export type FaqCategory = "booking" | "payment" | "service" | "privacy";

type T = { es: string; en: string };

export type Faq = {
  id: string;
  category: FaqCategory;
  q: T;
  a: T;
  /** Shown in the chat as a suggested question. */
  quick?: boolean;
  /** Next step after reading the answer. */
  cta?: { label: T; href: string };
};

export const FAQ_CATEGORIES: { id: FaqCategory; label: T }[] = [
  { id: "booking", label: { es: "Reserva", en: "Booking" } },
  { id: "payment", label: { es: "Precios y pago", en: "Prices & payment" } },
  { id: "service", label: { es: "El servicio", en: "The service" } },
  { id: "privacy", label: { es: "Discreción y datos", en: "Discretion & data" } },
];

const BOOK = { label: { es: "Reservar", en: "Book now" }, href: "/reservar" };
const PRICES = { label: { es: "Ver servicios y precios", en: "See services & prices" }, href: "/servicios" };

export const FAQS: Faq[] = [
  // ---------- Booking ----------
  {
    id: "how-to-book",
    category: "booking",
    quick: true,
    q: { es: "¿Cómo reservo una cita?", en: "How do I book an appointment?" },
    a: {
      es: "Elige tu ritual, tu masajista y un horario disponible en nuestro sistema de reservas en tiempo real, confirma tus datos y listo: te escribimos por WhatsApp para confirmar la cita y coordinar la llegada.",
      en: "Choose your ritual, your therapist and an open time in our real-time booking system, confirm your details and you're done: we'll message you on WhatsApp to confirm and arrange the visit.",
    },
    cta: BOOK,
  },
  {
    id: "same-day",
    category: "booking",
    q: { es: "¿Puedo reservar para hoy mismo?", en: "Can I book for today?" },
    a: {
      es: "Sí, si todavía hay horarios libres. Al reservar ves la disponibilidad real de cada masajista, desde hoy y hasta dos semanas adelante. Atendemos todos los días de 9:00 a.m. a 9:00 p.m.",
      en: "Yes, if there are still open times. When you book you see each therapist's real availability, from today up to two weeks ahead. We work every day from 9:00 a.m. to 9:00 p.m.",
    },
    cta: BOOK,
  },
  {
    id: "choose-therapist",
    category: "booking",
    q: { es: "¿Puedo elegir a mi masajista?", en: "Can I choose my therapist?" },
    a: {
      es: "Sí. Conoce a nuestro equipo, revisa sus perfiles y elige con quién quieres vivir la experiencia antes de reservar.",
      en: "Yes. Meet our team, look through their profiles and choose who you'd like to share the experience with before you book.",
    },
    cta: { label: { es: "Conocer al equipo", en: "Meet the team" }, href: "/masajistas" },
  },
  {
    id: "cancel",
    category: "booking",
    q: { es: "¿Cómo cancelo o cambio mi cita?", en: "How do I cancel or change my appointment?" },
    a: {
      es: "Escríbenos por WhatsApp con al menos 2 horas de anticipación y la cancelas o la cambias sin ningún costo. Con menos tiempo, o si no estás en la dirección a la hora acordada, puede aplicarse un cargo por desplazamiento.",
      en: "Message us on WhatsApp at least 2 hours ahead and you can cancel or reschedule at no cost. With less notice, or if you're not at the address at the agreed time, a travel charge may apply.",
    },
  },
  {
    id: "couples",
    category: "booking",
    q: { es: "¿Puedo reservar una experiencia en pareja?", en: "Can I book a couples experience?" },
    a: {
      es: "Sí. Tenemos rituales pensados para vivir en pareja, incluidos algunos en los que cada uno tiene su propio terapeuta al mismo tiempo.",
      en: "Yes. We have rituals designed for couples, including some where each of you has your own therapist at the same time.",
    },
    cta: { label: { es: "Ver experiencias en pareja", en: "See couples experiences" }, href: "/servicios#pareja" },
  },

  // ---------- Prices & payment ----------
  {
    id: "price",
    category: "payment",
    quick: true,
    q: { es: "¿Cuánto cuesta un masaje?", en: "How much is a massage?" },
    a: {
      es: "Depende del ritual y de su duración. Cada servicio muestra su precio final en pesos colombianos antes de reservar, sin sorpresas.",
      en: "It depends on the ritual and its length. Every service shows its final price in Colombian pesos before you book, with no surprises.",
    },
    cta: PRICES,
  },
  {
    id: "payment-methods",
    category: "payment",
    q: { es: "¿Qué métodos de pago aceptan?", en: "Which payment methods do you accept?" },
    a: {
      es: "Efectivo, transferencia y datáfono. Eliges el método al reservar y pagas a la terapeuta al terminar la sesión.",
      en: "Cash, bank transfer and card. You choose the method when you book and pay the therapist at the end of the session.",
    },
  },
  {
    id: "dollars",
    category: "payment",
    q: { es: "¿Puedo pagar en dólares?", en: "Can I pay in US dollars?" },
    a: {
      es: "Sí, en efectivo. Los precios están en pesos colombianos; si prefieres pagar en dólares, avísanos al reservar o por WhatsApp y te confirmamos el valor.",
      en: "Yes, in cash. Prices are in Colombian pesos; if you'd rather pay in dollars, tell us when you book or on WhatsApp and we'll confirm the amount.",
    },
  },

  // ---------- The service ----------
  {
    id: "areas",
    category: "service",
    quick: true,
    q: { es: "¿Qué zonas cubren?", en: "Which areas do you cover?" },
    a: {
      es: "Medellín y todo el Valle de Aburrá (Envigado, Sabaneta, Itagüí, Bello, La Estrella y Caldas), y también Rionegro. Vamos a tu casa, apartamento u hotel.",
      en: "Medellín and the whole Aburrá Valley (Envigado, Sabaneta, Itagüí, Bello, La Estrella and Caldas), plus Rionegro. We come to your home, apartment or hotel.",
    },
    cta: { label: { es: "Ver zonas de cobertura", en: "See service areas" }, href: "/masajes-a-domicilio" },
  },
  {
    id: "prepare",
    category: "service",
    q: { es: "¿Qué necesito tener listo? ¿Llevan camilla?", en: "What do I need to have ready? Do you bring a massage table?" },
    a: {
      es: "La terapeuta lleva la camilla. Tú solo necesitas un espacio privado y tranquilo donde ponerla y donde la sesión no tenga interrupciones. Si hay algo que deba saber para llegar (portería, torre, habitación del hotel), escríbelo en las notas al reservar.",
      en: "Your therapist brings the massage table. You just need a private, quiet space to set it up where the session won't be interrupted. If there's anything she needs to know to get in (front desk, building, hotel room), add it to the notes when you book.",
    },
  },
  {
    id: "first-time",
    category: "service",
    q: { es: "Es mi primera vez, ¿qué me recomiendan?", en: "It's my first time — what do you recommend?" },
    a: {
      es: "El Masaje de Relajación Clásico: técnica sueca, presión media y 60 minutos para soltar el estrés. Es la mejor puerta de entrada si nunca has recibido un masaje a domicilio.",
      en: "The Classic Relaxation Massage: Swedish technique, medium pressure and 60 minutes to let go of stress. It's the best place to start if you've never had an in-home massage.",
    },
    cta: { label: { es: "Reservar relajación clásica", en: "Book classic relaxation" }, href: "/reservar?service=relajacion-clasica" },
  },
  {
    id: "health",
    category: "service",
    q: { es: "¿Y si tengo una condición de salud?", en: "What if I have a health condition?" },
    a: {
      es: "Si estás embarazada, tienes una lesión, una alergia o cualquier condición que tu terapeuta deba conocer, cuéntalo en las notas al reservar o por WhatsApp antes de la cita, para adaptar la sesión o recomendarte otra.",
      en: "If you're pregnant, have an injury, an allergy or any condition your therapist should know about, mention it in the booking notes or on WhatsApp before the appointment, so the session can be adapted or another one suggested.",
    },
  },
  {
    id: "english",
    category: "service",
    q: { es: "¿Atienden en inglés?", en: "Do your therapists speak English?" },
    a: {
      es: "Cuéntanos al reservar o por WhatsApp que prefieres inglés y haremos lo posible por asignarte una terapeuta con la que te comuniques cómodamente.",
      en: "Tell us in the booking notes or on WhatsApp that you'd prefer English and we'll do our best to match you with a therapist who can communicate comfortably with you.",
    },
  },

  // ---------- Discretion & data ----------
  {
    id: "discreet",
    category: "privacy",
    quick: true,
    q: { es: "¿El servicio es discreto?", en: "Is the service discreet?" },
    a: {
      es: "Totalmente. Nuestras terapeutas llegan sin uniformes ni nada que revele el tipo de servicio, y toda la comunicación se maneja con absoluta confidencialidad.",
      en: "Completely. Our therapists arrive with no uniform and nothing that reveals the type of service, and every conversation is handled in complete confidence.",
    },
  },
  {
    id: "adults",
    category: "privacy",
    q: { es: "¿Es solo para mayores de edad?", en: "Is it for adults only?" },
    a: {
      es: "Sí, nuestros servicios son exclusivamente para mayores de 18 años, y la terapeuta puede pedir un documento de identidad al llegar. Todo ocurre en un marco de respeto y consentimiento: puedes pedir cambiar el ritmo o detener la sesión en cualquier momento.",
      en: "Yes, our services are exclusively for adults over 18, and the therapist may ask for ID when she arrives. Everything happens with respect and consent: you can ask to change the pace or stop the session at any moment.",
    },
  },
  {
    id: "data",
    category: "privacy",
    q: { es: "¿Cómo cuidan mis datos?", en: "How do you look after my data?" },
    a: {
      es: "Solo usamos tus datos para gestionar tu cita, nunca los vendemos ni los compartimos, y solo te escribimos promociones si lo autorizaste. Todo conforme a la Ley 1581 de 2012 de protección de datos.",
      en: "We only use your data to manage your appointment, we never sell or share it, and we only send promotions if you opted in. All in line with Colombia's data-protection law (Ley 1581 de 2012).",
    },
    cta: { label: { es: "Leer la política de datos", en: "Read the privacy policy" }, href: "/legal/privacidad" },
  },
];

export const faqText = (lang: Locale) => FAQS.map((f) => ({ q: f.q[lang], a: f.a[lang] }));
