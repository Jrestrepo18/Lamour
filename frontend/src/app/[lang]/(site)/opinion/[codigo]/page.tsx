import type { Metadata } from "next";
import Link from "next/link";
import { isValidReviewToken } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { reviewContext } from "@/server/reviews";
import { Container } from "@/components/ui/Container";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getI18n } from "@/i18n/server";

/** A private page reached only through a client's personal link — never indexed. */
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Tu opinión", "Your review"), robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ codigo: string }>; searchParams: Promise<{ t?: string }> };

async function Notice({ title, text }: { title: string; text: string }) {
  const { t, href } = await getI18n();
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <h1 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">{title}</h1>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--tone-body)]">{text}</p>
      <Link href={href("/")} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-ivory">
        {t("Ir a L'AMOUR", "Go to L'AMOUR")}
      </Link>
    </div>
  );
}

export default async function OpinionPage({ params, searchParams }: Props) {
  const code = decodeURIComponent((await params).codigo);
  const token = (await searchParams).t ?? "";
  const { t } = await getI18n();
  const ctx = isDatabaseConfigured() && token && isValidReviewToken(code, token) ? await reviewContext(code) : null;

  return (
    <section className="pb-20 pt-32 sm:pt-40">
      <Container className="max-w-xl">
        {!ctx ? (
          <Notice
            title={t("Este enlace no es válido", "This link isn't valid")}
            text={t(
              "Revisa que lo hayas abierto completo desde nuestro mensaje de WhatsApp, o escríbenos y te enviamos uno nuevo.",
              "Check that you opened the full link from our WhatsApp message, or write to us and we'll send you a new one.",
            )}
          />
        ) : ctx.alreadyReviewed ? (
          <Notice
            title={`${t("¡Gracias", "Thank you")}${ctx.firstName ? `, ${ctx.firstName}` : ""}!`}
            text={t(
              "Ya recibimos tu opinión sobre esta cita. Nos ayuda muchísimo a seguir cuidando cada detalle.",
              "We've already received your review of this appointment. It helps us enormously to keep taking care of every detail.",
            )}
          />
        ) : !ctx.completed ? (
          <Notice
            title={t("Aún no es momento", "Not quite yet")}
            text={t("Podrás contarnos cómo te fue cuando tu cita esté completada.", "You'll be able to tell us how it went once your appointment is completed.")}
          />
        ) : (
          <ReviewForm
            appointmentId={ctx.appointmentId}
            token={token}
            firstName={ctx.firstName}
            suggestedName={ctx.suggestedName}
            serviceName={ctx.serviceName}
          />
        )}
      </Container>
    </section>
  );
}
