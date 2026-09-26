/** Ids are Firestore document ids (service and category ids are their slugs). */
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  highlight: string | null;
  displayOrder: number;
  isActive: boolean;
  services: Service[];
}

export interface Service {
  id: string;
  serviceCategoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string | null;
  durationMinutes: number;
  price: number;
  imageUrl: string | null;
  imageGallery: string[];
  highlights: string[];
  requiresTwoTherapists: boolean;
  hasSensoryDressOption: boolean;
  allowsExtraTime: boolean;
  isCoupleExperience: boolean;
  displayOrder: number;
  isActive: boolean;
}

export interface Masseuse {
  id: string;
  stageName: string;
  age: number | null;
  bio: string | null;
  photoUrl: string | null;
  photoGallery: string[];
  displayOrder: number;
  isActive: boolean;
  /** Services she performs; empty means all of them. */
  serviceIds: string[];
  /** False when she only works at the spa (noDomicilios in Firebase) — then she isn't offered for home visits. */
  offersHomeVisits: boolean;
}

export interface MasseuseAdmin extends Masseuse {
  whatsAppNumber: string;
  /** She authorised publishing her photos (consentimientoImagen); without it the site shows none. */
  imageConsent: boolean;
}

/** One working block on a weekday. dayOfWeek: 0 = domingo … 6 = sábado; times "HH:mm". */
export interface WorkingBlock {
  dayOfWeek: number;
  start: string;
  end: string;
}

export interface TimeOff {
  date: string;
  note: string | null;
}

/** A masseuse's agenda. An empty week means she works the business hours every day. */
export interface MasseuseSchedule {
  slotIntervalMinutes: number;
  bufferMinutes: number;
  workingHours: WorkingBlock[];
  timeOff: TimeOff[];
}

export type PaymentMethod = "Cash" | "Transfer" | "Card";

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled" | "NoShow";

export interface AvailabilitySlot {
  start: string;
  end: string;
  available: boolean;
}

export interface AppointmentCreatePayload {
  serviceId: string;
  masseuseId: string;
  secondMasseuseId?: string | null;
  startsAt: string;
  sensoryDressRequested: boolean;
  extraMinutes: number;
  clientName: string;
  clientPhone: string;
  address: string;
  addressDetails?: string;
  neighborhood: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  /** Opted in to promotions by WhatsApp (unchecked by default). */
  acceptsMarketing?: boolean;
}

export interface Appointment {
  /** Booking code, e.g. "LA-0012". */
  id: string;
  serviceId: string;
  serviceName: string;
  masseuseId: string;
  masseuseName: string;
  secondMasseuseId: string | null;
  secondMasseuseName: string | null;
  clientName: string;
  clientPhone: string;
  address: string;
  addressDetails: string | null;
  neighborhood: string;
  city: string;
  notes: string | null;
  sensoryDressRequested: boolean;
  extraMinutes: number;
  paymentMethod: PaymentMethod;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  totalPrice: number;
  status: AppointmentStatus;
  createdAt: string;
  confirmedAt: string | null;
  /** Admin only: the client's personal review link, once the booking is completed. */
  reviewUrl?: string | null;
  /** Admin only: the client already left a review for this booking. */
  reviewed?: boolean;
}

export interface AppointmentConfirmationResult {
  appointment: Appointment;
  whatsAppLink: string;
  secondWhatsAppLink: string | null;
}

export type ReviewStatus = "Pending" | "Published" | "Hidden";
export type ReviewSource = "appointment" | "whatsapp" | "google";

/** A client's review. Only real clients: from a completed booking's link, or copied from a real message with consent. */
export interface Review {
  id: string;
  /** How the client chose to appear, e.g. "María G." */
  displayName: string;
  city: string | null;
  serviceName: string | null;
  rating: number;
  text: string;
  /** "YYYY-MM-DD" */
  date: string;
  source: ReviewSource;
  /** Tied to a completed booking (the client reviewed through their own link). */
  verified: boolean;
  /** Public reply from L'AMOUR, shown under the review. */
  reply: string | null;
}

export interface ReviewAdmin extends Review {
  status: ReviewStatus;
  appointmentId: string | null;
  createdAt: string;
}

export interface ReviewSummary {
  count: number;
  average: number;
  reviews: Review[];
}

/** Admin: one client, with totals from their bookings. `phone` is E.164 (+573001234567) and is the id. */
export interface Client {
  phone: string;
  name: string;
  notes: string;
  /** Agreed to receive promotions by WhatsApp (booking checkbox or told the team). */
  acceptsMarketing: boolean;
  consentAt: string | null;
  createdAt: string | null;
  bookings: number;
  completed: number;
  totalSpent: number;
  lastVisit: string | null;
  lastService: string | null;
}
