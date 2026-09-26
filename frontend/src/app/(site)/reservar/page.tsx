import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { getMasseuses, getReviews, getServiceCategories } from "@/server/catalog";
import { Container } from "@/components/ui/Container";
import { ReviewsBadge, ReviewsSection } from "@/components/reviews/ReviewsSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingFlow } from "@/components/booking/BookingFlow";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

const TITLE = "Reservar masaje a domicilio";
const DESCRIPTION =
  "Reserva en línea tu masaje a domicilio en Medellín: elige servicio, masajista y horario disponible en tiempo real. Confirmación por WhatsApp.";

/**
 * noindex, follow: a booking form has no search demand of its own, and its first step
 * lists the whole catalog — including the adult rituals — which would get this page
 * classified as explicit. Links from here are still followed.
 */
export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/reservar" }),
  robots: { index: false, follow: true },
};

export default async function ReservarPage() {
  const [{ data: categories }, { data: masseuses }, reviews] = await Promise.all([
    getServiceCategories(),
    getMasseuses(),
    getReviews(),
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
      {reviews.count > 0 && (
        <Container>
          <div className="mx-auto -mb-2 max-w-2xl pt-6">
            <ReviewsBadge summary={reviews} />
          </div>
        </Container>
      )}
      <Suspense>
        <BookingFlow categories={categories} masseuses={masseuses} />
      </Suspense>
      <ReviewsSection summary={reviews} compact title="Lo que cuentan quienes ya reservaron" />
    </>
  );
}
