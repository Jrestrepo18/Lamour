import { Suspense } from "react";
import { getMasseuses, getServiceCategories } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata = {
  title: "Reservar | L'AMOUR — Estética y Sentidos",
};

export default async function ReservarPage() {
  const [{ data: categories }, { data: masseuses }] = await Promise.all([
    getServiceCategories(),
    getMasseuses(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Reserva en minutos"
        title="Reservar"
        description="Elige tu servicio, tu masajista y tu horario. Confirmamos tu cita a domicilio en Medellín y su área metropolitana."
        compact
      />
      <Suspense>
        <BookingFlow categories={categories} masseuses={masseuses} />
      </Suspense>
    </>
  );
}
