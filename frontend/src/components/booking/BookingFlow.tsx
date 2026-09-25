"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { createAppointment } from "@/lib/api";
import type { AvailabilitySlot, Masseuse, ServiceCategory, Service } from "@/lib/types";
import { StepIndicator } from "./StepIndicator";
import { ServiceStep } from "./ServiceStep";
import { MasseuseStep } from "./MasseuseStep";
import { ScheduleStep } from "./ScheduleStep";
import { DetailsStep } from "./DetailsStep";
import { SummaryStep } from "./SummaryStep";
import { SuccessScreen } from "./SuccessScreen";
import { EMPTY_CLIENT_DETAILS, type ClientDetails } from "./types";
import { findMunicipio } from "@/lib/coverage";
import { formatCOP } from "@/lib/format";
import { SITE } from "@/lib/seo";

export function BookingFlow({
  categories,
  masseuses,
}: {
  categories: ServiceCategory[];
  masseuses: Masseuse[];
}) {
  const searchParams = useSearchParams();
  const allServices = useMemo(() => categories.flatMap((c) => c.services), [categories]);

  const preselectedService = useMemo(() => {
    const slug = searchParams.get("service");
    return slug ? allServices.find((s) => s.slug === slug) ?? null : null;
  }, [searchParams, allServices]);
  const preselectedMasseuse = useMemo(() => {
    const id = searchParams.get("masseuse");
    return id ? masseuses.find((m) => m.id === id) ?? null : null;
  }, [searchParams, masseuses]);

  // Arriving with a service already picked (from a service card) means step 1
  // is redundant — jump straight to choosing the masseuse. Arriving with both
  // a service and a masseuse (from a masseuse card that also carried a
  // service) skips both and lands on scheduling.
  const [step, setStep] = useState(() => {
    if (preselectedService && preselectedMasseuse) return 3;
    if (preselectedService) return 2;
    return 1;
  });
  const [service, setService] = useState<Service | null>(preselectedService);
  const [primary, setPrimary] = useState<Masseuse | null>(preselectedMasseuse);
  const [secondary, setSecondary] = useState<Masseuse | null>(null);
  const [date, setDate] = useState(new Date());
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  // Arriving from the coverage search ("Reservar en Envigado") pre-fills the municipality.
  const [details, setDetails] = useState<ClientDetails>(() => {
    const city = findMunicipio(searchParams.get("city"));
    return city ? { ...EMPTY_CLIENT_DETAILS, city } : EMPTY_CLIENT_DETAILS;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const previousStep = useRef(step);

  useEffect(() => {
    // Bring the form back into view when the step actually changes — not on
    // arrival, where it would yank the page past its own header.
    if (previousStep.current !== step) {
      previousStep.current = step;
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clears the previous step's "attempted" flag so its validation message doesn't carry over
    setAttemptedAdvance(false);
  }, [step]);

  function validationMessage() {
    if (step === 1) return service ? null : "Elige un servicio para continuar.";
    if (step === 2) {
      if (!primary) return "Elige tu masajista para continuar.";
      if (service?.requiresTwoTherapists && !secondary) return "Elige también la segunda masajista.";
      return null;
    }
    if (step === 3) return slot ? null : "Elige un horario disponible para continuar.";
    if (step === 4) {
      if (details.clientName.trim().length <= 1) return "Ingresa tu nombre completo.";
      if (details.clientPhone.trim().length <= 6) return "Ingresa un teléfono válido.";
      if (details.address.trim().length <= 3) return "Ingresa tu dirección.";
      if (details.neighborhood.trim().length <= 1) return "Ingresa tu barrio.";
      return null;
    }
    return null;
  }

  function selectService(s: Service) {
    setService(s);
    if (!s.requiresTwoTherapists) setSecondary(null);
    setSlot(null);
  }

  function canAdvance() {
    if (step === 1) return !!service;
    if (step === 2) return !!primary && (!service?.requiresTwoTherapists || !!secondary);
    if (step === 3) return !!slot;
    if (step === 4) {
      return (
        details.clientName.trim().length > 1 &&
        details.clientPhone.trim().length > 6 &&
        details.address.trim().length > 3 &&
        details.neighborhood.trim().length > 1
      );
    }
    return true;
  }

  async function handleSubmit() {
    if (!service || !primary || !slot) return;
    setSubmitting(true);
    setError(null);
    try {
      const appointment = await createAppointment({
        serviceId: service.id,
        masseuseId: primary.id,
        secondMasseuseId: secondary?.id ?? null,
        startsAt: slot.start,
        sensoryDressRequested: details.sensoryDressRequested,
        extraMinutes: details.extraMinutes,
        clientName: details.clientName.trim(),
        clientPhone: details.clientPhone.trim(),
        address: details.address.trim(),
        addressDetails: details.addressDetails.trim() || undefined,
        neighborhood: details.neighborhood.trim(),
        city: details.city.trim(),
        notes: details.notes.trim() || undefined,
        paymentMethod: details.paymentMethod,
      });
      setConfirmedAt(appointment.startsAt);
    } catch {
      setError(
        "No pudimos enviar tu solicitud en este momento. Inténtalo de nuevo en unos segundos, o escríbenos directamente por WhatsApp para confirmar tu cita.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (confirmedAt) successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [confirmedAt]);

  if (confirmedAt && service && primary) {
    return (
      <Container>
        <div ref={successRef} className="mx-auto max-w-2xl scroll-mt-20">
        <SuccessScreen
          clientName={details.clientName}
          startsAt={confirmedAt}
          service={service}
          primary={primary}
          secondary={secondary}
        />
        </div>
      </Container>
    );
  }

  const message = attemptedAdvance ? validationMessage() : null;
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hola, tengo una duda sobre mi reserva en L'AMOUR.")}`
    : null;

  function advance() {
    if (!canAdvance()) {
      setAttemptedAdvance(true);
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  }

  return (
    <Container className="pb-10 pt-8 sm:pt-12">
      <div className="mx-auto max-w-2xl">
      <div ref={formTopRef} className="scroll-mt-24">
        <StepIndicator current={step} onJump={setStep} />
      </div>

      <div key={step} className="mt-8 animate-fade-up">
        {step === 1 && <ServiceStep categories={categories} selected={service} onSelect={selectService} />}

        {step === 2 && service && (
          <MasseuseStep
            masseuses={masseuses}
            service={service}
            primary={primary}
            secondary={secondary}
            onSelectPrimary={setPrimary}
            onSelectSecondary={setSecondary}
          />
        )}

        {step === 3 && service && primary && (
          <ScheduleStep
            service={service}
            primary={primary}
            secondary={secondary}
            date={date}
            onDateChange={(d) => {
              setDate(d);
              setSlot(null);
            }}
            selectedStart={slot?.start ?? null}
            onSelectSlot={setSlot}
            extraMinutes={details.extraMinutes}
            onExtraMinutesChange={(m) => {
              setDetails((d) => ({ ...d, extraMinutes: m }));
              setSlot(null);
            }}
          />
        )}

        {step === 4 && service && <DetailsStep service={service} details={details} onChange={setDetails} />}

        {step === 5 && service && primary && slot && (
          <SummaryStep
            categories={categories}
            service={service}
            primary={primary}
            secondary={secondary}
            startsAt={slot.start}
            details={details}
            error={error}
            onEdit={setStep}
          />
        )}
      </div>

      {whatsappHref && (
        <p className="mt-10 text-center text-sm text-ink-soft">
          ¿Dudas?{" "}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-gold/60 underline-offset-4"
          >
            <WhatsAppIcon size={15} className="text-[#25D366]" />
            Escríbenos
          </a>
        </p>
      )}

      {/* Floating actions: no strip behind them, same as the site's booking button.
          Sticky inside the flow, so they ride along while scrolling and settle at its end. */}
      <div className="pointer-events-none sticky bottom-0 z-30 -mx-1 mt-6 px-1 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        {message && (
          <p
            role="alert"
            key={message}
            className="pointer-events-auto mx-auto mb-3 w-fit max-w-full animate-fade-up rounded-full bg-ink px-4 py-2 text-center text-sm text-ivory shadow-[0_12px_28px_-12px_rgba(16,16,16,0.6)]"
          >
            {message}
          </p>
        )}
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              aria-label="Paso anterior"
              className="pointer-events-auto flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center rounded-full bg-marfil text-ink shadow-[0_14px_34px_-12px_rgba(16,16,16,0.45)] ring-1 ring-ink/10 transition-transform active:scale-95"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={step < 5 ? advance : handleSubmit}
            disabled={submitting}
            className="pointer-events-auto flex min-h-13 flex-1 cursor-pointer items-center justify-between gap-3 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-ivory shadow-[0_14px_34px_-10px_rgba(16,16,16,0.6)] ring-1 ring-gold/30 transition-transform active:scale-[0.98] disabled:opacity-80"
          >
            <span className="flex items-center gap-2 text-[0.95rem] font-semibold">
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  Enviando…
                </>
              ) : step < 5 ? (
                "Continuar"
              ) : (
                "Enviar solicitud"
              )}
            </span>
            {service ? (
              <span className="rounded-full bg-ivory/10 px-3.5 py-2 text-sm font-semibold text-champagne">
                {formatCOP(service.price)}
              </span>
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10">
                <ChevronRight size={18} aria-hidden />
              </span>
            )}
          </button>
        </div>
      </div>
      </div>
    </Container>
  );
}
