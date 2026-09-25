"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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
import { surfaceClass } from "@/lib/ui";

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
    const id = Number(searchParams.get("masseuse"));
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

  if (confirmedAt) {
    return (
      <Container className="max-w-2xl py-20">
        <SuccessScreen clientName={details.clientName} startsAt={confirmedAt} />
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div ref={formTopRef} className="mb-10 scroll-mt-28">
        <StepIndicator current={step} />
      </div>

      <div className={`${surfaceClass} p-6 sm:p-10`}>
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
            onExtraMinutesChange={(m) => setDetails((d) => ({ ...d, extraMinutes: m }))}
          />
        )}

        {step === 4 && service && <DetailsStep service={service} details={details} onChange={setDetails} />}

        {step === 5 && service && primary && slot && (
          <SummaryStep
            service={service}
            primary={primary}
            secondary={secondary}
            startsAt={slot.start}
            details={details}
            error={error}
          />
        )}

        <div className="mt-10 border-t border-ink/10 pt-6">
          {step < 5 && attemptedAdvance && validationMessage() && (
            <p role="alert" className="mb-3 text-right text-sm font-medium text-bronze">{validationMessage()}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1 text-sm font-medium text-ink-soft transition-colors hover:text-ink disabled:invisible"
            >
              <ChevronLeft size={16} />
              Atrás
            </button>

            {step < 5 ? (
              <Button
                onClick={() => {
                  if (!canAdvance()) {
                    setAttemptedAdvance(true);
                    return;
                  }
                  setStep((s) => Math.min(5, s + 1));
                }}
              >
                Continuar
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enviando…
                  </>
                ) : (
                  "Confirmar reserva"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
