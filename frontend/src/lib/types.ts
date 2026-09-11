export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  highlight: string | null;
  displayOrder: number;
  isActive: boolean;
  services: Service[];
}

export interface Service {
  id: number;
  serviceCategoryId: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string | null;
  durationMinutes: number;
  price: number;
  imageUrl: string | null;
  highlights: string[];
  requiresTwoTherapists: boolean;
  hasSensoryDressOption: boolean;
  allowsExtraTime: boolean;
  isCoupleExperience: boolean;
  displayOrder: number;
  isActive: boolean;
}

export interface Masseuse {
  id: number;
  stageName: string;
  bio: string | null;
  photoUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface MasseuseAdmin extends Masseuse {
  whatsAppNumber: string;
}

export type PaymentMethod = "Cash" | "Transfer" | "Card";

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface AvailabilitySlot {
  start: string;
  end: string;
  available: boolean;
}

export interface AppointmentCreatePayload {
  serviceId: number;
  masseuseId: number;
  secondMasseuseId?: number | null;
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
  id: number;
  serviceId: number;
  serviceName: string;
  masseuseId: number;
  masseuseName: string;
  secondMasseuseId: number | null;
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
