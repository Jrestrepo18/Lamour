"use client";

import { useMemo, useState } from "react";
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

export function BookingFlow({
  categories,
  masseuses,
}: {
  categories: ServiceCategory[];
  masseuses: Masseuse[];
}) {
  const searchParams = useSearchParams();
  const allServices = useMemo(() => categories.flatMap((c) => c.services), [categories]);

  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(() => {
    const slug = searchParams.get("service");
    return slug ? allServices.find((s) => s.slug === slug) ?? null : null;
  });
  const [primary, setPrimary] = useState<Masseuse | null>(() => {
    const id = Number(searchParams.get("masseuse"));
    return id ? masseuses.find((m) => m.id === id) ?? null : null;
  });
  const [secondary, setSecondary] = useState<Masseuse | null>(null);
  const [date, setDate] = useState(new Date());
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  const [details, setDetails] = useState<ClientDetails>(EMPTY_CLIENT_DETAILS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

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
        "No pudimos conectar con el servidor de reservas. Verifica que la API esté disponible e inténtalo de nuevo, o escríbenos directamente por WhatsApp.",
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
      <div className="mb-10">
        <StepIndicator current={step} />
      </div>

      <div className="rounded-3xl border border-silk bg-white/40 p-6 sm:p-10">
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

        <div className="mt-10 flex items-center justify-between border-t border-silk pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-1 text-sm font-sans text-ink-soft transition-colors hover:text-ink disabled:opacity-0"
          >
            <ChevronLeft size={16} />
            Atrás
          </button>

          {step < 5 ? (
            <Button onClick={() => setStep((s) => Math.min(5, s + 1))} disabled={!canAdvance()}>
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
                "Confirmar Reserva"
              )}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
