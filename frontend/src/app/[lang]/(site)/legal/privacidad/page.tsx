import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";
import { languageAlternates } from "@/lib/seo";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t, href } = await getI18n();
  return {
    title: t("Política de Tratamiento de Datos", "Privacy Policy"),
    alternates: { canonical: href("/legal/privacidad"), languages: languageAlternates("/legal/privacidad") },
    robots: { index: false, follow: true },
  };
}

export default async function PrivacidadPage() {
  const { t, lang } = await getI18n();
  return (
    <>
      <PageHeader
        path="/legal/privacidad"
        eyebrow={t("Documento legal", "Legal document")}
        title={t("Tratamiento de Datos", "Privacy Policy")}
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
          Esta Política de Tratamiento de Datos Personales y Aviso de Privacidad se expide en cumplimiento de la
          Ley 1581 de 2012, el Decreto 1074 de 2015 (que compiló el Decreto 1377 de 2013) y la Ley 1266 de 2008
          de la República de Colombia, que regulan el derecho constitucional de Hábeas Data y el tratamiento de
          datos personales.
        </p>

        <LegalSection title="1. Responsable del tratamiento">
          <p>
            <strong>Razón social / nombre comercial:</strong> L&apos;AMOUR — Estética y Sentidos.
          </p>
          <p>
            <strong>Identificación tributaria (NIT):</strong> [completar antes de publicar].
          </p>
          <p>
            <strong>Domicilio:</strong> Medellín, Antioquia, Colombia.
          </p>
          <p>
            <strong>Correo electrónico para el ejercicio de derechos:</strong>{" "}
            [correo de contacto de protección de datos].
          </p>
          <p>
            <strong>Teléfono / WhatsApp de contacto:</strong> [número de contacto].
          </p>
        </LegalSection>

        <LegalSection title="2. Datos que recolectamos">
          <p>
            Para poder prestar nuestros servicios a domicilio, recolectamos los siguientes datos cuando reservas
            una cita a través de nuestro sitio web:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Datos de identificación: nombre completo.</li>
            <li>Datos de contacto: número de teléfono / WhatsApp.</li>
            <li>Datos de ubicación: dirección, barrio y ciudad donde se prestará el servicio.</li>
            <li>Datos de la reserva: servicio elegido, masajista asignada, fecha, hora y método de pago.</li>
            <li>
              Notas opcionales que decidas compartir con la terapeuta (por ejemplo, indicaciones de acceso al
              inmueble o condiciones de salud relevantes para el masaje).
            </li>
          </ul>
          <p>
            Algunos de estos datos —en particular las notas relacionadas con condiciones de salud y las
            preferencias asociadas a servicios de carácter sensorial e íntimo— pueden constituir{" "}
            <strong>datos sensibles</strong> en los términos del artículo 5 de la Ley 1581 de 2012. Su
            suministro es voluntario y únicamente los solicitamos cuando resultan necesarios para brindarte una
            experiencia segura y adecuada; no estás obligado a autorizar su tratamiento y ello no impide la
            prestación del servicio en su forma estándar.
          </p>
        </LegalSection>

        <LegalSection title="3. Finalidad del tratamiento">
          <p>Tus datos personales serán utilizados para:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Gestionar la reserva, confirmación y prestación del servicio solicitado.</li>
            <li>Coordinar la asignación de la masajista y la logística de desplazamiento a tu domicilio.</li>
            <li>Contactarte para confirmar, reprogramar o dar seguimiento a tu cita.</li>
            <li>Atender solicitudes, quejas, reclamos (PQR) y responder tus consultas.</li>
            <li>
              Cumplir obligaciones legales, contables y fiscales aplicables a la prestación del servicio.
            </li>
            <li>
              Enviarte comunicaciones sobre promociones o novedades, únicamente si otorgaste tu autorización
              expresa para ello y en todo momento podrás dejar de recibirlas.
            </li>
          </ul>
          <p>No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines comerciales ajenos a la prestación de nuestros servicios.</p>
        </LegalSection>

        <LegalSection title="4. Derechos del titular de los datos">
          <p>Como titular de tus datos personales, la ley colombiana te otorga los siguientes derechos:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Conocer, actualizar y rectificar tus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada para el tratamiento de tus datos.</li>
            <li>
              Ser informado, previa solicitud, sobre el uso que se ha dado a tus datos personales.
            </li>
            <li>
              Revocar la autorización y/o solicitar la supresión de tus datos cuando no se respeten los
              principios, derechos y garantías constitucionales y legales.
            </li>
            <li>
              Acceder de forma gratuita a tus datos personales que hayan sido objeto de tratamiento.
            </li>
            <li>
              Presentar quejas ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong> por
              infracciones a la normatividad de protección de datos personales, una vez agotado el trámite de
              consulta o reclamo ante nosotros.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Procedimiento para ejercer tus derechos">
          <p>
            Puedes ejercer tus derechos enviando una solicitud al correo electrónico o número de contacto
            indicados en la sección 1, describiendo claramente tu solicitud (consulta, reclamo, actualización,
            rectificación, supresión o revocatoria).
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Consultas:</strong> serán atendidas en un término máximo de diez (10) días hábiles
              contados desde la fecha de recibo, prorrogable por cinco (5) días hábiles adicionales.
            </li>
            <li>
              <strong>Reclamos:</strong> serán atendidos en un término máximo de quince (15) días hábiles
              contados desde el día siguiente a la fecha de recibo, prorrogable por ocho (8) días hábiles
              adicionales cuando no sea posible atenderlo en ese plazo.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Seguridad de la información">
          <p>
            Implementamos medidas técnicas, humanas y administrativas razonables para proteger tus datos
            personales contra acceso no autorizado, pérdida, alteración o uso indebido, incluyendo el acceso
            restringido a la información de las reservas únicamente al personal administrativo autorizado.
          </p>
        </LegalSection>

        <LegalSection title="7. Vigencia">
          <p>
            Esta política rige a partir de su fecha de publicación. Los datos personales se conservarán durante
            el tiempo necesario para cumplir la finalidad para la cual fueron recolectados y, posteriormente,
            durante los plazos exigidos por la ley aplicable (incluyendo obligaciones contables y fiscales).
          </p>
        </LegalSection>

        <LegalSection title="8. Aceptación">
          <p>
            Al ingresar tus datos personales en el formulario de reserva de este sitio web, declaras que has
            leído esta Política y autorizas de manera libre, previa, expresa e informada el tratamiento de tus
            datos personales conforme a lo aquí descrito.
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
          This is a courtesy English translation of our Personal Data Processing Policy and Privacy Notice. In case
          of any difference, the Spanish version prevails. The policy is issued in compliance with Colombian Law
          1581 of 2012, Decree 1074 of 2015 (which compiled Decree 1377 of 2013) and Law 1266 of 2008, which
          regulate the constitutional right of Habeas Data and the processing of personal data.
        </p>

        <LegalSection title="1. Data controller">
          <p>
            <strong>Business name:</strong> L&apos;AMOUR — Estética y Sentidos.
          </p>
          <p>
            <strong>Tax ID (NIT):</strong> [to be completed before publishing].
          </p>
          <p>
            <strong>Address:</strong> Medellín, Antioquia, Colombia.
          </p>
          <p>
            <strong>Email for data-protection requests:</strong> [data-protection contact email].
          </p>
          <p>
            <strong>Contact phone / WhatsApp:</strong> [contact number].
          </p>
        </LegalSection>

        <LegalSection title="2. Data we collect">
          <p>To provide our in-home services, we collect the following data when you book through our website:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Identification data: full name.</li>
            <li>Contact data: phone / WhatsApp number.</li>
            <li>Location data: address, neighbourhood and city where the service will take place.</li>
            <li>Booking data: chosen service, assigned therapist, date, time and payment method.</li>
            <li>
              Optional notes you choose to share with the therapist (for example, building or hotel access
              instructions or health conditions relevant to the massage).
            </li>
          </ul>
          <p>
            Some of this data — in particular notes about health conditions and preferences related to sensory and
            intimate services — may constitute <strong>sensitive data</strong> under article 5 of Law 1581 of 2012.
            Providing it is voluntary and we only ask for it when needed to give you a safe and suitable experience;
            you are not required to authorise its processing and doing so does not prevent the standard service.
          </p>
        </LegalSection>

        <LegalSection title="3. Purpose of processing">
          <p>Your personal data will be used to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Manage the booking, confirmation and delivery of the requested service.</li>
            <li>Coordinate the therapist&apos;s assignment and travel to your address.</li>
            <li>Contact you to confirm, reschedule or follow up on your appointment.</li>
            <li>Handle requests, complaints and claims, and answer your questions.</li>
            <li>Comply with legal, accounting and tax obligations that apply to the service.</li>
            <li>
              Send you promotions or news, only if you gave your express authorisation, and you may stop receiving
              them at any time.
            </li>
          </ul>
          <p>
            We do not sell, rent or share your personal data with third parties for commercial purposes unrelated to
            providing our services.
          </p>
        </LegalSection>

        <LegalSection title="4. Your rights as data subject">
          <p>As the owner of your personal data, Colombian law grants you the following rights:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>To know, update and correct your personal data.</li>
            <li>To request proof of the authorisation you gave for processing your data.</li>
            <li>To be informed, on request, of how your personal data has been used.</li>
            <li>
              To revoke your authorisation and/or request deletion of your data when constitutional and legal
              principles, rights and guarantees are not respected.
            </li>
            <li>To access, free of charge, the personal data that has been processed.</li>
            <li>
              To file complaints with the <strong>Superintendencia de Industria y Comercio (SIC)</strong> for breaches
              of data-protection rules, once you have completed the inquiry or claim process with us.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="5. How to exercise your rights">
          <p>
            You can exercise your rights by sending a request to the email or contact number in section 1, clearly
            describing your request (inquiry, claim, update, correction, deletion or revocation).
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Inquiries:</strong> answered within ten (10) business days of receipt, extendable by five (5)
              additional business days.
            </li>
            <li>
              <strong>Claims:</strong> answered within fifteen (15) business days from the day after receipt,
              extendable by eight (8) additional business days when it cannot be answered in that time.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Information security">
          <p>
            We apply reasonable technical, human and administrative measures to protect your personal data against
            unauthorised access, loss, alteration or misuse, including restricting access to booking information to
            authorised administrative staff only.
          </p>
        </LegalSection>

        <LegalSection title="7. Validity">
          <p>
            This policy applies from its publication date. Personal data is kept for as long as needed to fulfil the
            purpose for which it was collected and, afterwards, for the periods required by applicable law
            (including accounting and tax obligations).
          </p>
        </LegalSection>

        <LegalSection title="8. Acceptance">
          <p>
            By entering your personal data in this website&apos;s booking form, you declare that you have read this
            Policy and freely, previously, expressly and knowingly authorise the processing of your personal data as
            described here.
          </p>
        </LegalSection>
      </LegalArticle>
  );
}
