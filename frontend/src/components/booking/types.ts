import type { PaymentMethod } from "@/lib/types";

export interface ClientDetails {
  clientName: string;
  clientPhone: string;
  address: string;
  addressDetails: string;
  neighborhood: string;
  city: string;
  notes: string;
  paymentMethod: PaymentMethod;
  sensoryDressRequested: boolean;
  extraMinutes: number;
}

export const EMPTY_CLIENT_DETAILS: ClientDetails = {
  clientName: "",
  clientPhone: "",
  address: "",
  addressDetails: "",
  neighborhood: "",
  city: "Medellín",
  notes: "",
  paymentMethod: "Cash",
  sensoryDressRequested: false,
  extraMinutes: 0,
};
