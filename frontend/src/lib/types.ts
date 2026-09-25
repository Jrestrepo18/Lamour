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
}

export interface AppointmentConfirmationResult {
  appointment: Appointment;
  whatsAppLink: string;
  secondWhatsAppLink: string | null;
}
