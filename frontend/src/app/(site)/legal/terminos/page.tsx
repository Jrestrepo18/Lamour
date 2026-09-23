import { PageHeader } from "@/components/ui/PageHeader";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";

export const metadata = {
  title: "Términos y Condiciones",
  alternates: { canonical: "/legal/terminos" },
  robots: { index: false, follow: true },
};

export default function TerminosPage() {
  return (
    <>
      <PageHeader path="/legal/terminos" eyebrow="Documento legal" title="Términos y Condiciones" compact />
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
            <a href="/legal/privacidad">Política de Tratamiento de Datos Personales</a>, la cual forma parte
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
    </>
  );
}
