import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { LegalArticle, LegalSection, LegalValue } from "@/components/legal/LegalArticle";
import { LEGAL, formatPhone } from "@/lib/legal";
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

const phone = formatPhone(LEGAL.whatsapp);

function Spanish() {
  return (
    <LegalArticle>
      <p className="eyebrow">Vigentes desde el {LEGAL.effectiveDate}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Estos Términos y Condiciones regulan el uso de este sitio web y la prestación de los servicios de masaje y
        bienestar a domicilio de <strong className="text-ink">{LEGAL.tradeName}</strong> en Medellín y su área
        metropolitana. Se rigen por la ley colombiana, en especial la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley
        527 de 1999 (comercio electrónico) y la Ley 1581 de 2012 (protección de datos). Al marcar la casilla de
        aceptación y enviar una reserva, declaras que los leíste y los aceptas. Ninguna disposición de estos términos
        limita los derechos que la ley te reconoce como consumidor.
      </p>

      <LegalSection title="1. Quiénes somos">
        <p>
          <strong>Nombre o razón social:</strong> <LegalValue value={LEGAL.legalName} />
          <br />
          <strong>Nombre comercial:</strong> {LEGAL.tradeName}
          <br />
          <strong>NIT:</strong> <LegalValue value={LEGAL.nit} />
          <br />
          <strong>Dirección de notificación judicial:</strong> <LegalValue value={LEGAL.address} />, {LEGAL.city}
          <br />
          <strong>Correo electrónico:</strong> <LegalValue value={LEGAL.email} />
          <br />
          <strong>Teléfono y WhatsApp:</strong> {phone}
        </p>
      </LegalSection>

      <LegalSection title="2. Servicio exclusivo para mayores de 18 años">
        <p>
          Algunos de nuestros servicios son de naturaleza sensorial e íntima, por lo que todos se prestan{" "}
          <strong>exclusivamente a personas mayores de 18 años</strong>. Al reservar declaras ser mayor de edad. La
          terapeuta podrá pedirte un documento de identidad al llegar y no prestará el servicio si no se acredita la
          mayoría de edad de todas las personas que lo reciben. Tampoco puede haber menores de edad presentes en el lugar
          durante la sesión.
        </p>
      </LegalSection>

      <LegalSection title="3. Los servicios">
        <p>
          La descripción, duración, precio y condiciones de cada servicio son los publicados en su página al momento de
          reservar. El servicio se limita exactamente a lo descrito: cualquier práctica distinta no forma parte de nuestra
          oferta y no puede exigirse a la terapeuta.
        </p>
        <p>
          Nuestros masajes son servicios de bienestar y relajación; <strong>no son tratamientos médicos</strong> ni
          reemplazan la atención de un profesional de la salud. Si tienes una condición de salud, lesión, embarazo o
          alergia, infórmalo en las notas de la reserva o a la terapeuta antes de iniciar.
        </p>
        <p>
          Todos los servicios se prestan en un marco de respeto y consentimiento mutuo. Tanto tú como la terapeuta pueden
          detener la sesión en cualquier momento.
        </p>
      </LegalSection>

      <LegalSection title="4. Reserva y confirmación">
        <p>
          Enviar el formulario es una solicitud de reserva. La reserva queda en firme cuando la confirmamos por WhatsApp
          o por el canal que indicaste, después de verificar la disponibilidad de la terapeuta. Si no podemos
          confirmarla, te lo informaremos y no tendrás ningún costo. Te enviaremos por ese mismo canal el resumen de tu
          cita (servicio, fecha, hora, dirección y valor).
        </p>
      </LegalSection>

      <LegalSection title="5. Precios y pago">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Los precios se publican en pesos colombianos (COP) y son el valor total a pagar por el servicio,{" "}
            <strong>con todos los impuestos incluidos</strong>. El desplazamiento dentro de nuestra zona de cobertura
            está incluido, salvo que te informemos otra cosa antes de confirmar.
          </li>
          <li>
            El pago se hace al finalizar la sesión, en efectivo, transferencia o datáfono, según lo que elijas y la
            disponibilidad del medio. No cobramos anticipos a través del sitio.
          </li>
          <li>
            Los visitantes no residentes en Colombia pueden pagar en dólares estadounidenses (USD) en efectivo. En ese
            caso te informaremos antes del servicio el valor en USD equivalente, que no podrá ser superior al precio en
            COP convertido a la tasa de cambio del día.
          </li>
          <li>
            El tiempo adicional u otras opciones que pidas el mismo día se cobran según la tarifa publicada, y solo si las
            aceptas antes de que se presten.
          </li>
          <li>Expediremos la factura o el documento equivalente que exija la normativa tributaria.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Cancelaciones, cambios y derecho de retracto">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Puedes cancelar o reprogramar tu cita <strong>sin ningún costo</strong> avisándonos con al menos dos (2)
            horas de anticipación.
          </li>
          <li>
            Si cancelas con menos de dos horas de anticipación, o si no estás en la dirección indicada a la hora acordada,
            podremos cobrarte un cargo por desplazamiento, siempre que su valor te haya sido informado de forma expresa
            en el mensaje de confirmación de la cita. Si no se te informó, no habrá cargo.
          </li>
          <li>
            Si somos nosotros quienes debemos cancelar o cambiar la cita, te avisaremos tan pronto como sea posible y
            podrás elegir otra fecha o desistir, sin ningún costo.
          </li>
          <li>
            Conforme al artículo 47 de la Ley 1480 de 2011, puedes retractarte de la reserva hecha por este medio a
            distancia. El derecho de retracto no aplica una vez que el servicio ha comenzado con tu acuerdo. Como no
            cobramos anticipos, retractarte antes del servicio no te genera costos, salvo el cargo por desplazamiento
            descrito arriba cuando corresponda.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Calidad y garantía">
        <p>
          Nos comprometemos a prestar cada servicio con la calidad, idoneidad y seguridad ofrecidas. Si el servicio no
          corresponde a lo ofrecido, puedes hacer efectiva la garantía legal (artículos 7 y 11 de la Ley 1480 de 2011)
          informándonos por los canales de la sección 1, preferiblemente dentro de los treinta (30) días siguientes al
          servicio. Según el caso, te ofreceremos repetir el servicio sin costo o devolverte el dinero pagado.
        </p>
      </LegalSection>

      <LegalSection title="8. Tus compromisos">
        <ul className="list-disc space-y-1 pl-5">
          <li>Dar datos veraces y completos, incluida la información de salud relevante para el masaje.</li>
          <li>Ofrecer un espacio privado, seguro e higiénico para la sesión.</li>
          <li>
            Tratar a la terapeuta con respeto. Cualquier conducta de acoso, violencia, presión para realizar prácticas
            distintas al servicio contratado, o condiciones del lugar que pongan en riesgo su integridad, dará lugar a la
            terminación inmediata de la sesión. En ese caso se cobrará el servicio completo y no habrá reembolso, sin
            perjuicio de las acciones legales que correspondan.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Responsabilidad">
        <p>
          L&apos;AMOUR responde frente a ti por los servicios que ofrece a través de este sitio, incluidos los prestados
          por las terapeutas que colaboran con la marca, en los términos del Estatuto del Consumidor. No seremos
          responsables por daños que se deriven de información de salud falsa u omitida por el cliente, de culpa exclusiva
          del cliente o de un tercero, ni de fuerza mayor o caso fortuito.
        </p>
      </LegalSection>

      <LegalSection title="10. Reseñas y uso del sitio">
        <p>
          Solo quienes recibieron un servicio pueden dejar una reseña, y solo la publicamos si lo autorizas. Podemos no
          publicar o retirar reseñas con contenido ofensivo, datos personales de terceros o información falsa. No
          modificamos el contenido de las reseñas que publicamos.
        </p>
        <p>
          No está permitido usar el sitio para fines ilícitos, suplantar a otra persona ni hacer reservas falsas.
        </p>
      </LegalSection>

      <LegalSection title="11. Propiedad intelectual">
        <p>
          La marca, el logotipo, los textos y el diseño de este sitio pertenecen a L&apos;AMOUR o se usan con licencia de
          sus titulares. No pueden reproducirse ni usarse sin autorización previa y escrita.
        </p>
      </LegalSection>

      <LegalSection title="12. Datos personales">
        <p>
          El tratamiento de tus datos se rige por nuestra{" "}
          <Link href="/legal/privacidad">Política de Tratamiento de Datos Personales</Link>, que forma parte de estos
          términos.
        </p>
      </LegalSection>

      <LegalSection title="13. Peticiones, quejas y reclamos (PQR)">
        <p>
          Puedes presentar cualquier petición, queja, reclamo o solicitud de garantía por WhatsApp al {phone} o al correo{" "}
          <LegalValue value={LEGAL.email} />. Te responderemos dentro de los quince (15) días hábiles siguientes a su
          recibo. Si no quedas conforme, puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co) o a
          los jueces competentes.
        </p>
      </LegalSection>

      <LegalSection title="14. Cambios a estos términos">
        <p>
          Podemos actualizar estos términos. La versión vigente es la publicada en esta página con su fecha, y a cada
          reserva se le aplica la versión vigente en el momento en que la hiciste.
        </p>
      </LegalSection>

      <LegalSection title="15. Ley aplicable y solución de conflictos">
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Cualquier diferencia se intentará resolver
          primero de forma directa a través de los canales de PQR. Si no hay acuerdo, podrás acudir a la Superintendencia
          de Industria y Comercio en ejercicio de sus funciones jurisdiccionales o a los jueces competentes según la ley.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}

/** Courtesy translation for visitors; the Spanish text is the one that governs. */
function English() {
  return (
    <LegalArticle>
      <p className="eyebrow">In force from {LEGAL.effectiveDateEn}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        This is a courtesy English translation; if there is any difference, the Spanish version prevails. These Terms and
        Conditions govern the use of this website and the in-home massage and wellness services of{" "}
        <strong className="text-ink">{LEGAL.tradeName}</strong> in Medellín and its metropolitan area. They are governed
        by Colombian law, in particular Law 1480 of 2011 (Consumer Statute), Law 527 of 1999 (e-commerce) and Law 1581 of
        2012 (data protection). By ticking the acceptance box and sending a booking, you confirm you have read and
        accept them. Nothing in these terms limits the rights the law grants you as a consumer.
      </p>

      <LegalSection title="1. Who we are">
        <p>
          <strong>Legal name:</strong> <LegalValue value={LEGAL.legalName} />
          <br />
          <strong>Trade name:</strong> {LEGAL.tradeName}
          <br />
          <strong>Tax ID (NIT):</strong> <LegalValue value={LEGAL.nit} />
          <br />
          <strong>Address for legal notices:</strong> <LegalValue value={LEGAL.address} />, {LEGAL.city}
          <br />
          <strong>Email:</strong> <LegalValue value={LEGAL.email} />
          <br />
          <strong>Phone and WhatsApp:</strong> {phone}
        </p>
      </LegalSection>

      <LegalSection title="2. Adults only (18+)">
        <p>
          Some of our services are sensory and intimate, so all of them are provided{" "}
          <strong>exclusively to people aged 18 and over</strong>. By booking you declare you are of legal age. The
          therapist may ask for ID on arrival and will not provide the service if the legal age of everyone receiving it
          is not shown. No minors may be present at the place during the session.
        </p>
      </LegalSection>

      <LegalSection title="3. The services">
        <p>
          The description, duration, price and conditions of each service are those published on its page when you book.
          The service is limited to exactly what is described: any other practice is not part of our offer and cannot be
          demanded of the therapist.
        </p>
        <p>
          Our massages are wellness and relaxation services; <strong>they are not medical treatments</strong> and do not
          replace care from a health professional. If you have a health condition, injury, pregnancy or allergy, mention
          it in the booking notes or to the therapist before starting.
        </p>
        <p>
          All services take place within a framework of mutual respect and consent. Both you and the therapist may stop
          the session at any time.
        </p>
      </LegalSection>

      <LegalSection title="4. Booking and confirmation">
        <p>
          Sending the form is a booking request. The booking is final when we confirm it on WhatsApp or the channel you
          gave, after checking the therapist&apos;s availability. If we cannot confirm it, we will let you know at no cost
          to you. We will send you a summary of your appointment (service, date, time, address and price) on that same
          channel.
        </p>
      </LegalSection>

      <LegalSection title="5. Prices and payment">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Prices are published in Colombian pesos (COP) and are the total amount payable for the service,{" "}
            <strong>all taxes included</strong>. Travel within our coverage area is included unless we tell you otherwise
            before confirming.
          </li>
          <li>
            Payment is made at the end of the session, in cash, bank transfer or card, as you choose and subject to
            availability. We take no advance payments through the site.
          </li>
          <li>
            Visitors who are not resident in Colombia may pay in cash in US dollars (USD). We will tell you the USD amount
            before the service; it will not exceed the COP price converted at that day&apos;s exchange rate.
          </li>
          <li>
            Extra time or other options you ask for on the day are charged at the published rate, and only if you accept
            them before they are provided.
          </li>
          <li>We will issue the invoice or equivalent document required by tax regulations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Cancellations, changes and right of withdrawal">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            You can cancel or reschedule <strong>free of charge</strong> by telling us at least two (2) hours in advance.
          </li>
          <li>
            If you cancel less than two hours in advance, or are not at the given address at the agreed time, we may
            charge a travel fee, provided its amount was expressly stated in the appointment confirmation message. If it
            was not stated, there is no charge.
          </li>
          <li>
            If we have to cancel or change the appointment, we will tell you as soon as possible and you may choose another
            date or withdraw, at no cost.
          </li>
          <li>
            Under article 47 of Law 1480 of 2011, you may withdraw from a booking made through this distance channel. The
            right of withdrawal no longer applies once the service has started with your agreement. As we take no advance
            payments, withdrawing before the service costs you nothing, except the travel fee described above where it
            applies.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Quality and warranty">
        <p>
          We undertake to provide each service with the quality, suitability and safety offered. If the service does not
          match what was offered, you can claim the legal warranty (articles 7 and 11 of Law 1480 of 2011) through the
          channels in section 1, preferably within thirty (30) days of the service. Depending on the case, we will offer
          to repeat the service free of charge or refund what you paid.
        </p>
      </LegalSection>

      <LegalSection title="8. Your commitments">
        <ul className="list-disc space-y-1 pl-5">
          <li>Give true and complete information, including health information relevant to the massage.</li>
          <li>Provide a private, safe and hygienic space for the session.</li>
          <li>
            Treat the therapist with respect. Any harassment, violence, pressure to perform practices other than the
            booked service, or conditions at the place that endanger her safety will end the session immediately. In that
            case the full service is charged and there is no refund, without prejudice to any legal action.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Liability">
        <p>
          L&apos;AMOUR is answerable to you for the services it offers through this site, including those provided by the
          therapists who work with the brand, under the Consumer Statute. We are not liable for damage arising from false
          or omitted health information given by the client, from the sole fault of the client or a third party, or from
          force majeure or unforeseeable circumstances.
        </p>
      </LegalSection>

      <LegalSection title="10. Reviews and use of the site">
        <p>
          Only people who received a service can leave a review, and we only publish it if you authorise it. We may
          decline to publish or remove reviews with offensive content, third parties&apos; personal data or false
          information. We do not edit the content of the reviews we publish.
        </p>
        <p>You may not use the site for unlawful purposes, impersonate anyone or make false bookings.</p>
      </LegalSection>

      <LegalSection title="11. Intellectual property">
        <p>
          The brand, logo, text and design of this site belong to L&apos;AMOUR or are used under licence from their
          owners. They may not be reproduced or used without prior written permission.
        </p>
      </LegalSection>

      <LegalSection title="12. Personal data">
        <p>
          Processing of your data is governed by our <Link href="/en/legal/privacidad">Privacy Policy</Link>, which forms
          part of these terms.
        </p>
      </LegalSection>

      <LegalSection title="13. Requests, complaints and claims">
        <p>
          You can send any request, complaint, claim or warranty request by WhatsApp to {phone} or by email to{" "}
          <LegalValue value={LEGAL.email} />. We will reply within fifteen (15) business days of receipt. If you are not
          satisfied, you may go to the Superintendencia de Industria y Comercio (www.sic.gov.co) or the competent courts.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to these terms">
        <p>
          We may update these terms. The version in force is the one published on this page with its date, and each
          booking is governed by the version in force when you made it.
        </p>
      </LegalSection>

      <LegalSection title="15. Governing law and disputes">
        <p>
          These terms are governed by the laws of the Republic of Colombia. Any disagreement will first be addressed
          directly through our complaints channels. If no agreement is reached, you may go to the Superintendencia de
          Industria y Comercio in the exercise of its judicial functions or to the competent courts under the law.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}
