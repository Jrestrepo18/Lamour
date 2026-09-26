import type { Metadata } from "next";
import Link from "next/link";
import { isValidReviewToken } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { reviewContext } from "@/server/reviews";
import { Container } from "@/components/ui/Container";
import { ReviewForm } from "@/components/reviews/ReviewForm";

/** A private page reached only through a client's personal link — never indexed. */
export const metadata: Metadata = {
  title: "Tu opinión",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ codigo: string }>; searchParams: Promise<{ t?: string }> };

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <h1 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">{title}</h1>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--tone-body)]">{text}</p>
      <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-ivory">
        Ir a L&apos;AMOUR
      </Link>
    </div>
  );
}

export default async function OpinionPage({ params, searchParams }: Props) {
  const code = decodeURIComponent((await params).codigo);
  const token = (await searchParams).t ?? "";
  const ctx = isDatabaseConfigured() && token && isValidReviewToken(code, token) ? await reviewContext(code) : null;

  return (
    <section className="pb-20 pt-32 sm:pt-40">
      <Container className="max-w-xl">
        {!ctx ? (
          <Notice title="Este enlace no es válido" text="Revisa que lo hayas abierto completo desde nuestro mensaje de WhatsApp, o escríbenos y te enviamos uno nuevo." />
        ) : ctx.alreadyReviewed ? (
          <Notice title={`¡Gracias${ctx.firstName ? `, ${ctx.firstName}` : ""}!`} text="Ya recibimos tu opinión sobre esta cita. Nos ayuda muchísimo a seguir cuidando cada detalle." />
        ) : !ctx.completed ? (
          <Notice title="Aún no es momento" text="Podrás contarnos cómo te fue cuando tu cita esté completada." />
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
