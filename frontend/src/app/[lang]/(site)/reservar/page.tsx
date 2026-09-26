import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { getMasseuses, getReviews, getServiceCategories } from "@/server/catalog";
import { localizeCatalog, localizeMasseuses } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { ReviewsBadge, ReviewsSection } from "@/components/reviews/ReviewsSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { getI18n } from "@/i18n/server";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

/**
 * noindex, follow: a booking form has no search demand of its own, and its first step
 * lists the whole catalog — including the adult rituals — which would get this page
 * classified as explicit. Links from here are still followed.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return {
    ...pageMetadata({
      lang,
      path: "/reservar",
      title: t("Reservar masaje a domicilio", "Book an in-home massage"),
      description: t(
        "Reserva en línea tu masaje a domicilio en Medellín: elige servicio, masajista y horario disponible en tiempo real. Confirmación por WhatsApp.",
        "Book your in-home or hotel massage in Medellín online: choose service, therapist and an open time in real time. Confirmation on WhatsApp.",
      ),
    }),
    robots: { index: false, follow: true },
  };
}

export default async function ReservarPage() {
  const { t, lang } = await getI18n();
  const [{ data: categories }, { data: masseuses }, reviews] = await Promise.all([
    getServiceCategories(),
    getMasseuses(),
    getReviews(),
  ]);

  return (
    <>
      <PageHeader
        path="/reservar"
        eyebrow={t("Reserva en minutos", "Book in minutes")}
        title={t("Reservar", "Book")}
        description={t(
          "Elige tu servicio, tu masajista y tu horario. Confirmamos tu cita a domicilio en Medellín y su área metropolitana.",
          "Choose your service, your therapist and your time. We confirm your appointment at your home or hotel in Medellín and its metropolitan area.",
        )}
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
        <BookingFlow categories={localizeCatalog(categories, lang)} masseuses={localizeMasseuses(masseuses, lang)} />
      </Suspense>
      <ReviewsSection
        summary={reviews}
        compact
        title={t("Lo que cuentan quienes ya reservaron", "What people who booked say")}
      />
    </>
  );
}
