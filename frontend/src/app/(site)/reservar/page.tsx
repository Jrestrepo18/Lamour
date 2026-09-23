import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { getMasseuses, getServiceCategories } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingFlow } from "@/components/booking/BookingFlow";

const TITLE = "Reservar masaje a domicilio";
const DESCRIPTION =
  "Reserva en línea tu masaje a domicilio en Medellín: elige servicio, masajista y horario disponible en tiempo real. Confirmación por WhatsApp.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/reservar" });

export default async function ReservarPage() {
  const [{ data: categories }, { data: masseuses }] = await Promise.all([
    getServiceCategories(),
    getMasseuses(),
  ]);

  return (
    <>
      <PageHeader
        path="/reservar"
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
