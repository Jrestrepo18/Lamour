import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";
import { languageAlternates } from "@/lib/seo";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t, href } = await getI18n();
  return {
    title: t("Términos y Condiciones", "Terms & Conditions"),
    alternates: { canonical: href("/legal/terminos"), languages: languageAlternates("/legal/terminos") },
    robots: { index: false, follow: true },
  };
}

export default async function TerminosPage() {
  const { t, lang } = await getI18n();
  return (
    <>
      <PageHeader
        path="/legal/terminos"
        eyebrow={t("Documento legal", "Legal document")}
        title={t("Términos y Condiciones", "Terms & Conditions")}
        compact
      />
      {lang === "en" ? <English /> : <Spanish />}
    </>
  );
}

function Spanish() {
  return (
      <LegalArticle>
        <p className="eyebrow">
          Última actualización: [fecha de publicación]
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Estos Términos y Condiciones regulan el uso del sitio web de{" "}
          <strong className="text-ink">L&apos;AMOUR — Estética y Sentidos</strong> y la prestación de sus
          servicios de masajes y bienestar a domicilio en Medellín y su área metropolitana. Al reservar un
          servicio a través de este sitio, aceptas estos términos en su totalidad. Este documento se rige por la
          legislación colombiana, incluyendo la Ley 1480 de 2011 (Estatuto del Consumidor) en lo que resulte
          aplicable a la relación de consumo.
        </p>

        <LegalSection title="1. Requisito de edad mínima">
          <p>
            Los servicios ofrecidos por L&apos;AMOUR son de naturaleza sensorial e íntima y están dirigidos{" "}
            <strong>exclusivamente a personas mayores de 18 años</strong>. Al reservar una cita, declaras bajo tu
            responsabilidad ser mayor de edad. Nos reservamos el derecho de solicitar un documento de identidad
            al momento de la prestación del servicio y de cancelar la cita sin reembolso si existen dudas
            razonables sobre el cumplimiento de este requisito.
          </p>
        </LegalSection>

        <LegalSection title="2. Naturaleza del servicio">
          <p>
            L&apos;AMOUR presta servicios de masajes de relajación, terapéuticos y sensoriales a domicilio,
            ejecutados por terapeutas independientes que colaboran con la marca. Todos los servicios se prestan
            dentro de un marco de respeto mutuo, consentimiento y profesionalismo. Cualquier solicitud, conducta
            o insinuación por parte del cliente que exceda el alcance del servicio contratado, o que constituya
            acoso, maltrato o falta de respeto hacia la terapeuta, dará lugar a la terminación inmediata de la
            sesión sin derecho a reembolso, sin perjuicio de las acciones legales a que haya lugar.
          </p>
        </LegalSection>

        <LegalSection title="3. Reservas y confirmación">
          <p>
            La solicitud de reserva realizada a través del sitio web queda sujeta a confirmación por parte de
            nuestro equipo, quien validará la disponibilidad real de la masajista antes de considerarla
            definitiva. Recibirás la confirmación por WhatsApp o el canal de contacto que hayas suministrado.
          </p>
        </LegalSection>

        <LegalSection title="4. Cancelaciones y reprogramaciones">
          <p>
            Puedes cancelar o reprogramar tu cita contactándonos con al menos dos (2) horas de anticipación a la
            hora agendada, sin ningún cargo. Las cancelaciones con menor anticipación, o la ausencia del cliente
            en la dirección indicada a la hora acordada, podrán generar un cargo por desplazamiento, el cual se
            informará al momento de la reserva.
          </p>
        </LegalSection>

        <LegalSection title="5. Precios y forma de pago">
          <p>
            Los precios publicados están expresados en pesos colombianos (COP) e incluyen la duración indicada
            para cada servicio. El pago se realiza directamente a la terapeuta al finalizar la sesión, mediante
            el método seleccionado durante la reserva (efectivo, transferencia o datáfono, sujeto a
            disponibilidad). Los tiempos adicionales u opciones especiales contratadas el día del servicio se
            cobrarán conforme a la tarifa vigente informada por la terapeuta.
          </p>
        </LegalSection>

        <LegalSection title="6. Condiciones del espacio y seguridad">
          <p>
            El cliente es responsable de proporcionar un espacio privado, seguro y en condiciones adecuadas de
            higiene para la prestación del servicio. L&apos;AMOUR se reserva el derecho de suspender una sesión,
            sin reembolso, si las condiciones del lugar representan un riesgo para la integridad de la
            terapeuta.
          </p>
        </LegalSection>

        <LegalSection title="7. Protección de datos personales">
          <p>
            El tratamiento de los datos personales suministrados durante el proceso de reserva se rige por
            nuestra{" "}
            <Link href="/legal/privacidad">Política de Tratamiento de Datos Personales</Link>, la cual forma parte
            integral de estos Términos y Condiciones.
          </p>
        </LegalSection>

        <LegalSection title="8. Limitación de responsabilidad">
          <p>
            L&apos;AMOUR actúa con la debida diligencia en la selección y capacitación de sus terapeutas. Sin
            perjuicio de ello, y en los términos permitidos por la ley colombiana, no seremos responsables por
            daños o perjuicios derivados de información de salud incompleta o inexacta suministrada por el
            cliente, ni por circunstancias de fuerza mayor o caso fortuito que impidan la prestación del
            servicio.
          </p>
        </LegalSection>

        <LegalSection title="9. Propiedad intelectual">
          <p>
            El contenido de este sitio web —incluyendo textos, logotipos, diseño y elementos visuales— es
            propiedad de L&apos;AMOUR — Estética y Sentidos y no podrá ser reproducido sin autorización previa.
          </p>
        </LegalSection>

        <LegalSection title="10. Ley aplicable y jurisdicción">
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la República de Colombia. Cualquier
            controversia derivada de su interpretación o cumplimiento será resuelta ante los jueces competentes
            de la ciudad de Medellín, sin perjuicio del derecho del consumidor a acudir ante la Superintendencia
            de Industria y Comercio.
          </p>
        </LegalSection>

        <LegalSection title="11. Contacto">
          <p>
            Para dudas sobre estos Términos y Condiciones, escríbenos a [correo de contacto] o al WhatsApp
            [número de contacto].
          </p>
        </LegalSection>
      </LegalArticle>
  );
}

/** Courtesy translation for visitors; the Spanish text is the one that governs. */
function English() {
  return (
      <LegalArticle>
        <p className="eyebrow">Last updated: [publication date]</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          This is a courtesy English translation; in case of any difference, the Spanish version prevails. These
          Terms and Conditions govern the use of the website of{" "}
          <strong className="text-ink">L&apos;AMOUR — Estética y Sentidos</strong> and its in-home massage and
          wellness services in Medellín and its metropolitan area. By booking a service through this site, you
          accept these terms in full. They are governed by Colombian law, including Law 1480 of 2011 (Consumer
          Statute) where applicable.
        </p>

        <LegalSection title="1. Minimum age">
          <p>
            L&apos;AMOUR&apos;s services are sensory and intimate in nature and are intended{" "}
            <strong>exclusively for people aged 18 and over</strong>. By booking, you declare under your own
            responsibility that you are of legal age. We reserve the right to ask for ID when the service is provided
            and to cancel the appointment without refund if there is reasonable doubt about this requirement.
          </p>
        </LegalSection>

        <LegalSection title="2. Nature of the service">
          <p>
            L&apos;AMOUR provides relaxation, therapeutic and sensory massages at your address, performed by
            independent therapists who work with the brand. All services take place within a framework of mutual
            respect, consent and professionalism. Any request, conduct or suggestion by the client that goes beyond
            the booked service, or that amounts to harassment, abuse or disrespect towards the therapist, will end
            the session immediately without refund, without prejudice to any legal action.
          </p>
        </LegalSection>

        <LegalSection title="3. Bookings and confirmation">
          <p>
            Booking requests made through the website are subject to confirmation by our team, who will check the
            therapist&apos;s actual availability before the booking is final. You will receive confirmation on
            WhatsApp or the contact channel you provided.
          </p>
        </LegalSection>

        <LegalSection title="4. Cancellations and rescheduling">
          <p>
            You can cancel or reschedule your appointment free of charge by contacting us at least two (2) hours
            before the scheduled time. Later cancellations, or not being at the given address at the agreed time, may
            incur a travel charge, which will be stated when you book.
          </p>
        </LegalSection>

        <LegalSection title="5. Prices and payment">
          <p>
            Published prices are in Colombian pesos (COP) and include the duration stated for each service. Payment
            is made directly to the therapist at the end of the session, using the method chosen when booking (cash,
            bank transfer or card, subject to availability). Extra time or special options added on the day will be
            charged at the current rate given by the therapist.
          </p>
        </LegalSection>

        <LegalSection title="6. Space and safety">
          <p>
            The client is responsible for providing a private, safe and hygienic space for the service. L&apos;AMOUR
            reserves the right to suspend a session, without refund, if the conditions of the place pose a risk to
            the therapist&apos;s safety.
          </p>
        </LegalSection>

        <LegalSection title="7. Personal data protection">
          <p>
            The processing of personal data provided during booking is governed by our{" "}
            <Link href="/en/legal/privacidad">Privacy Policy</Link>, which forms an integral part of these Terms and
            Conditions.
          </p>
        </LegalSection>

        <LegalSection title="8. Limitation of liability">
          <p>
            L&apos;AMOUR exercises due diligence in selecting and training its therapists. Notwithstanding this, and
            to the extent permitted by Colombian law, we are not liable for damages arising from incomplete or
            inaccurate health information provided by the client, nor for force majeure or unforeseeable
            circumstances that prevent the service.
          </p>
        </LegalSection>

        <LegalSection title="9. Intellectual property">
          <p>
            The content of this website — including text, logos, design and visual elements — belongs to L&apos;AMOUR
            — Estética y Sentidos and may not be reproduced without prior authorisation.
          </p>
        </LegalSection>

        <LegalSection title="10. Governing law and jurisdiction">
          <p>
            These Terms and Conditions are governed by the laws of the Republic of Colombia. Any dispute over their
            interpretation or performance will be settled by the competent courts of Medellín, without prejudice to
            the consumer&apos;s right to go to the Superintendencia de Industria y Comercio.
          </p>
        </LegalSection>

        <LegalSection title="11. Contact">
          <p>For questions about these Terms and Conditions, write to [contact email] or WhatsApp [contact number].</p>
        </LegalSection>
      </LegalArticle>
  );
}
