import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { LegalArticle, LegalSection, LegalValue } from "@/components/legal/LegalArticle";
import { LEGAL, formatPhone } from "@/lib/legal";
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

const phone = formatPhone(LEGAL.whatsapp);

function Spanish() {
  return (
    <LegalArticle>
      <p className="eyebrow">
        Vigente desde el {LEGAL.effectiveDate} · Versión {LEGAL.policyVersion}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Esta Política de Tratamiento de Datos Personales y Aviso de Privacidad explica cómo recogemos, usamos, guardamos
        y protegemos tus datos personales. Se expide en cumplimiento del artículo 15 de la Constitución Política, la Ley
        Estatutaria 1581 de 2012, el Decreto 1074 de 2015 (Capítulos 25 y 26 del Título 2 de la Parte 2 del Libro 2, que
        compilaron el Decreto 1377 de 2013) y las instrucciones de la Superintendencia de Industria y Comercio (SIC).
      </p>

      <LegalSection title="1. Responsable del tratamiento">
        <p>
          <strong>Nombre o razón social:</strong> <LegalValue value={LEGAL.legalName} />, que opera bajo el nombre
          comercial <strong>{LEGAL.tradeName}</strong> (en adelante, «L&apos;AMOUR»).
        </p>
        <p>
          <strong>NIT:</strong> <LegalValue value={LEGAL.nit} />
        </p>
        <p>
          <strong>Domicilio y dirección:</strong> <LegalValue value={LEGAL.address} />, {LEGAL.city}.
        </p>
        <p>
          <strong>Correo electrónico:</strong> <LegalValue value={LEGAL.email} />
        </p>
        <p>
          <strong>Teléfono y WhatsApp:</strong> {phone}
        </p>
        <p>
          <strong>Área responsable de atender consultas y reclamos:</strong> la administración de L&apos;AMOUR, a través
          de los canales anteriores.
        </p>
      </LegalSection>

      <LegalSection title="2. Definiciones">
        <p>
          Para esta política aplican las definiciones del artículo 3 de la Ley 1581 de 2012. En particular:{" "}
          <strong>dato personal</strong> es cualquier información que te identifica o te hace identificable;{" "}
          <strong>dato sensible</strong> es el que afecta tu intimidad o cuyo uso indebido puede generar discriminación,
          como los datos de salud y los relativos a la vida sexual; <strong>titular</strong> eres tú, la persona a quien
          se refieren los datos; <strong>tratamiento</strong> es cualquier operación sobre los datos (recoger, guardar,
          usar, circular o suprimir); y <strong>encargado</strong> es quien trata datos por cuenta de L&apos;AMOUR.
        </p>
      </LegalSection>

      <LegalSection title="3. Datos que tratamos">
        <p>Según cómo te relaciones con nosotros, tratamos:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Al reservar:</strong> nombre, número de celular o WhatsApp, dirección, barrio u hotel, ciudad,
            servicio elegido, masajista(s), fecha y hora, opciones del servicio, idioma y método de pago preferido.
          </li>
          <li>
            <strong>Notas opcionales</strong> que decidas dejar para la terapeuta (por ejemplo, alergias, zonas a
            evitar o cómo entrar al edificio).
          </li>
          <li>
            <strong>Al prestar el servicio:</strong> estado de la cita, valor pagado, método y moneda de pago, y
            registro de llegada y salida de la terapeuta.
          </li>
          <li>
            <strong>Historial de cliente:</strong> citas anteriores, total pagado, fecha de la última visita, una
            categoría interna según tu frecuencia (por ejemplo, «Nuevo» o «Frecuente») y notas internas de servicio.
          </li>
          <li>
            <strong>Reseñas:</strong> calificación, comentario y el nombre con el que decidas publicarla (nombre e
            inicial del apellido).
          </li>
          <li>
            <strong>Conversaciones</strong> que sostengas con nosotros por WhatsApp u otros canales.
          </li>
          <li>
            <strong>Datos técnicos mínimos:</strong> el sitio guarda en tu propio navegador si ya confirmaste tu mayoría
            de edad y los servicios que marcaste como favoritos; no usamos cookies de publicidad ni de seguimiento. Nuestro
            proveedor de alojamiento registra de forma automática datos técnicos de conexión (como la dirección IP) para
            fines de seguridad y funcionamiento.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Datos sensibles">
        <p>Te informamos de forma explícita que los siguientes datos son sensibles:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>El tipo de servicio que reservas</strong>, porque algunos de nuestros servicios son de carácter
            sensorial e íntimo y su elección puede revelar aspectos de tu vida sexual.
          </li>
          <li>
            <strong>La información de salud</strong> que escribas en las notas (alergias, lesiones, embarazo u otras
            condiciones).
          </li>
        </ul>
        <p>
          <strong>No estás obligado a autorizar el tratamiento de datos sensibles ni a responder preguntas sobre
          ellos.</strong> Las notas de salud son siempre opcionales. El tipo de servicio es indispensable para agendar y
          prestar el servicio que tú mismo eliges, por lo que solo lo tratamos con tu autorización explícita, únicamente
          para esa finalidad, con acceso restringido y sin compartirlo con terceros distintos de los encargados
          señalados en la sección 7. No tratamos datos de menores de 18 años: nuestros servicios son solo para adultos y,
          si detectamos que un menor nos suministró datos, los suprimiremos.
        </p>
      </LegalSection>

      <LegalSection title="5. Finalidades">
        <p>Tratamos tus datos para:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Recibir, confirmar, reprogramar, cancelar y prestar el servicio que reservaste.</li>
          <li>
            Compartir con la terapeuta asignada la información que necesita para llegar y atenderte (nombre, dirección,
            hora, servicio y notas).
          </li>
          <li>Comunicarnos contigo sobre tu cita por WhatsApp o llamada.</li>
          <li>Verificar tu mayoría de edad al momento del servicio.</li>
          <li>Registrar pagos, llevar la contabilidad y cumplir obligaciones tributarias y legales.</li>
          <li>
            Conocer tu historial para darte un mejor servicio y organizar internamente a nuestros clientes por
            frecuencia de visita.
          </li>
          <li>Pedirte tu opinión después del servicio y, solo si lo autorizas en ese momento, publicar tu reseña.</li>
          <li>Atender peticiones, quejas, reclamos y solicitudes de garantía, y ejercer o defender derechos.</li>
          <li>Proteger la seguridad de nuestras terapeutas y de nuestros clientes.</li>
          <li>
            Enviarte promociones y novedades por WhatsApp, <strong>solo si marcaste la casilla opcional</strong> para
            recibirlas (sección 9).
          </li>
        </ul>
        <p>
          No vendemos, alquilamos ni cedemos tus datos personales, y no los usamos para finalidades distintas de las aquí
          descritas sin pedirte una nueva autorización.
        </p>
      </LegalSection>

      <LegalSection title="6. Autorización">
        <p>
          Antes de enviar tu reserva, te pedimos que marques una casilla con la que autorizas de forma previa, expresa e
          informada el tratamiento de tus datos, incluidos los sensibles, conforme a esta política. Sin esa autorización
          no podemos registrar la reserva. Guardamos prueba de ella (fecha y versión de la política aceptada), como exige
          la ley. La autorización para recibir promociones y la de publicar una reseña son independientes y opcionales.
        </p>
        <p>
          No se requiere autorización en los casos del artículo 10 de la Ley 1581 de 2012 (por ejemplo, requerimientos de
          autoridad competente o datos de naturaleza pública).
        </p>
      </LegalSection>

      <LegalSection title="7. Con quién compartimos tus datos">
        <p>Solo acceden a tus datos:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>El personal administrativo autorizado de L&apos;AMOUR.</li>
          <li>
            La terapeuta o terapeutas asignadas a tu cita, únicamente con la información necesaria para prestar el
            servicio, bajo deber de confidencialidad.
          </li>
          <li>
            Proveedores tecnológicos que actúan como encargados: Google LLC (Firebase, base de datos y almacenamiento),
            Vercel Inc. (alojamiento del sitio) y WhatsApp LLC / Meta Platforms (mensajería).
          </li>
          <li>Autoridades que lo soliciten en ejercicio de sus funciones legales.</li>
        </ul>
        <p>
          Algunos de estos proveedores almacenan la información en servidores ubicados fuera de Colombia, principalmente
          en Estados Unidos, país que la SIC reconoce con un nivel adecuado de protección de datos (Circular Única de la
          SIC, Título V, Capítulo Tercero). Al autorizar esta política, autorizas también esa transmisión internacional a
          los encargados, que solo pueden usar los datos para prestarnos sus servicios.
        </p>
      </LegalSection>

      <LegalSection title="8. Tus derechos">
        <p>Conforme al artículo 8 de la Ley 1581 de 2012, tienes derecho a:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Conocer, actualizar y rectificar tus datos, incluso si son parciales, inexactos o incompletos.</li>
          <li>Solicitar prueba de la autorización que nos diste.</li>
          <li>Ser informado, previa solicitud, del uso que hemos dado a tus datos.</li>
          <li>
            Revocar la autorización y pedir la supresión de tus datos, salvo cuando exista un deber legal o contractual
            de conservarlos (por ejemplo, registros contables).
          </li>
          <li>Acceder gratuitamente a tus datos personales.</li>
          <li>No responder preguntas sobre datos sensibles.</li>
          <li>
            Presentar quejas ante la Superintendencia de Industria y Comercio (www.sic.gov.co), después de haber agotado
            la consulta o el reclamo ante nosotros.
          </li>
        </ul>
        <p>
          Pueden ejercer estos derechos tú, tus causahabientes, tu representante o apoderado, acreditando su calidad.
        </p>
      </LegalSection>

      <LegalSection title="9. Promociones por WhatsApp">
        <p>
          Solo te enviaremos promociones si marcaste la casilla opcional al reservar o nos lo pediste. Puedes dejar de
          recibirlas en cualquier momento respondiendo «NO» o escribiéndonos, sin costo. Conforme a la Ley 2300 de 2023,
          solo te contactaremos con fines comerciales de lunes a viernes entre las 7:00 a. m. y las 7:00 p. m. y los
          sábados entre las 8:00 a. m. y las 3:00 p. m., nunca domingos ni festivos, y por el canal que autorizaste.
        </p>
      </LegalSection>

      <LegalSection title="10. Cómo hacer consultas y reclamos">
        <p>
          Escríbenos al correo <LegalValue value={LEGAL.email} /> o al WhatsApp {phone} indicando tu nombre, el teléfono
          con el que reservaste, la descripción de lo que solicitas y el medio por el cual quieres recibir la respuesta.
          Podremos verificar tu identidad antes de responder.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Consultas</strong> (conocer qué datos tenemos y cómo los usamos): respondemos en máximo diez (10) días
            hábiles desde su recibo. Si no es posible, te informaremos el motivo y la fecha de respuesta, que no superará
            cinco (5) días hábiles adicionales.
          </li>
          <li>
            <strong>Reclamos</strong> (corrección, actualización, supresión, revocatoria o incumplimiento): respondemos en
            máximo quince (15) días hábiles desde el día siguiente a su recibo, prorrogables hasta ocho (8) días hábiles
            más, informándote el motivo. Si el reclamo está incompleto, te pediremos completarlo dentro de los cinco (5)
            días siguientes; si pasan dos (2) meses sin que lo hagas, se entenderá que desististe. Mientras se resuelve, tu
            registro llevará la leyenda «reclamo en trámite».
          </li>
        </ul>
        <p>
          Si te respondemos que no procede una supresión o revocatoria, te explicaremos el deber legal o contractual que
          nos obliga a conservar los datos.
        </p>
      </LegalSection>

      <LegalSection title="11. Seguridad y confidencialidad">
        <p>
          Aplicamos medidas técnicas, humanas y administrativas para proteger tus datos contra acceso no autorizado,
          pérdida, uso indebido o alteración: acceso restringido con usuario y contraseña al panel administrativo,
          conexiones cifradas (HTTPS), proveedores con estándares reconocidos de seguridad y deberes de confidencialidad
          para el personal y las terapeutas. Si ocurre un incidente de seguridad que comprometa tus datos, lo informaremos
          a la SIC y, cuando corresponda, a ti.
        </p>
      </LegalSection>

      <LegalSection title="12. Conservación">
        <p>
          Conservamos tus datos mientras sean necesarios para las finalidades descritas y mientras mantengas una relación
          con nosotros. Después los suprimimos, salvo aquellos que debamos guardar para cumplir obligaciones legales,
          contables o tributarias (los soportes contables se conservan hasta por diez (10) años, según el artículo 28 de
          la Ley 962 de 2005) o para atender reclamaciones.
        </p>
      </LegalSection>

      <LegalSection title="13. Vigencia y cambios">
        <p>
          Esta política rige desde el {LEGAL.effectiveDate}. Nuestras bases de datos estarán vigentes mientras
          L&apos;AMOUR desarrolle su actividad. Si hacemos cambios sustanciales (por ejemplo, en las finalidades o en la
          identificación del responsable), te los comunicaremos antes de aplicarlos y, si cambian las finalidades, te
          pediremos una nueva autorización. La versión vigente siempre estará publicada en esta página.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}

/** Courtesy translation for visitors; the Spanish text is the one that governs. */
function English() {
  return (
    <LegalArticle>
      <p className="eyebrow">
        In force from {LEGAL.effectiveDateEn} · Version {LEGAL.policyVersion}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        This is a courtesy English translation of our Personal Data Processing Policy and Privacy Notice; if there is any
        difference, the Spanish version prevails. It explains how we collect, use, keep and protect your personal data,
        and is issued under article 15 of the Colombian Constitution, Statutory Law 1581 of 2012, Decree 1074 of 2015
        (which compiled Decree 1377 of 2013) and the instructions of the Superintendencia de Industria y Comercio (SIC).
      </p>

      <LegalSection title="1. Data controller">
        <p>
          <strong>Legal name:</strong> <LegalValue value={LEGAL.legalName} />, trading as{" "}
          <strong>{LEGAL.tradeName}</strong> («L&apos;AMOUR»).
        </p>
        <p>
          <strong>Tax ID (NIT):</strong> <LegalValue value={LEGAL.nit} />
        </p>
        <p>
          <strong>Registered address:</strong> <LegalValue value={LEGAL.address} />, {LEGAL.city}.
        </p>
        <p>
          <strong>Email:</strong> <LegalValue value={LEGAL.email} />
        </p>
        <p>
          <strong>Phone and WhatsApp:</strong> {phone}
        </p>
        <p>
          <strong>Team handling requests and claims:</strong> L&apos;AMOUR&apos;s management, through the channels above.
        </p>
      </LegalSection>

      <LegalSection title="2. Definitions">
        <p>
          The definitions in article 3 of Law 1581 of 2012 apply. In particular: <strong>personal data</strong> is any
          information that identifies you or makes you identifiable; <strong>sensitive data</strong> is data that affects
          your privacy or whose misuse could lead to discrimination, such as health data and data about sex life; the{" "}
          <strong>data subject</strong> is you; <strong>processing</strong> is any operation on the data (collecting,
          storing, using, sharing or deleting); and a <strong>processor</strong> handles data on L&apos;AMOUR&apos;s
          behalf.
        </p>
      </LegalSection>

      <LegalSection title="3. Data we process">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>When you book:</strong> name, mobile or WhatsApp number, address, neighbourhood or hotel, city, chosen
            service, therapist(s), date and time, service options, language and preferred payment method.
          </li>
          <li>
            <strong>Optional notes</strong> you leave for the therapist (for example allergies, areas to avoid or how to
            get into the building).
          </li>
          <li>
            <strong>When the service takes place:</strong> appointment status, amount paid, payment method and currency,
            and the therapist&apos;s arrival and departure times.
          </li>
          <li>
            <strong>Client history:</strong> past appointments, total paid, date of last visit, an internal category
            based on visit frequency (e.g. «New» or «Frequent») and internal service notes.
          </li>
          <li>
            <strong>Reviews:</strong> rating, comment and the name you choose to publish it under (first name and last
            initial).
          </li>
          <li>
            <strong>Conversations</strong> you have with us on WhatsApp or other channels.
          </li>
          <li>
            <strong>Minimal technical data:</strong> the site stores in your own browser whether you already confirmed
            your age and which services you saved as favourites; we use no advertising or tracking cookies. Our hosting
            provider automatically logs technical connection data (such as IP address) for security and operation.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sensitive data">
        <p>We explicitly inform you that the following data is sensitive:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>The type of service you book</strong>, because some of our services are sensory and intimate and
            choosing them may reveal aspects of your sex life.
          </li>
          <li>
            <strong>Health information</strong> you write in the notes (allergies, injuries, pregnancy or other
            conditions).
          </li>
        </ul>
        <p>
          <strong>You are not required to authorise the processing of sensitive data or to answer questions about
          it.</strong> Health notes are always optional. The type of service is essential to schedule and deliver the
          service you choose, so we process it only with your explicit authorisation, only for that purpose, with
          restricted access and without sharing it with anyone other than the processors listed in section 7. We do not
          process data of people under 18: our services are for adults only, and if we find that a minor gave us data we
          will delete it.
        </p>
      </LegalSection>

      <LegalSection title="5. Purposes">
        <ul className="list-disc space-y-1 pl-5">
          <li>Receive, confirm, reschedule, cancel and deliver the service you booked.</li>
          <li>
            Share with the assigned therapist what she needs to reach and attend you (name, address, time, service and
            notes).
          </li>
          <li>Contact you about your appointment by WhatsApp or phone.</li>
          <li>Verify you are of legal age when the service takes place.</li>
          <li>Record payments, keep accounts and meet tax and legal obligations.</li>
          <li>Know your history to serve you better and organise clients internally by visit frequency.</li>
          <li>Ask for your opinion after the service and, only if you authorise it then, publish your review.</li>
          <li>Handle requests, complaints, claims and warranty requests, and exercise or defend rights.</li>
          <li>Protect the safety of our therapists and clients.</li>
          <li>
            Send you promotions and news on WhatsApp, <strong>only if you ticked the optional box</strong> (section 9).
          </li>
        </ul>
        <p>
          We do not sell, rent or transfer your personal data, and we do not use it for other purposes without asking for
          a new authorisation.
        </p>
      </LegalSection>

      <LegalSection title="6. Authorisation">
        <p>
          Before sending your booking, we ask you to tick a box giving prior, express and informed authorisation to
          process your data, including sensitive data, under this policy. Without it we cannot record the booking. We keep
          proof of it (date and version of the policy accepted), as the law requires. Authorisation to receive promotions
          and to publish a review are separate and optional.
        </p>
        <p>
          No authorisation is required in the cases of article 10 of Law 1581 of 2012 (for example, requests from a
          competent authority or public data).
        </p>
      </LegalSection>

      <LegalSection title="7. Who we share your data with">
        <ul className="list-disc space-y-1 pl-5">
          <li>L&apos;AMOUR&apos;s authorised administrative staff.</li>
          <li>
            The therapist(s) assigned to your appointment, with only the information needed to provide the service, under
            a duty of confidentiality.
          </li>
          <li>
            Technology providers acting as processors: Google LLC (Firebase database and storage), Vercel Inc. (website
            hosting) and WhatsApp LLC / Meta Platforms (messaging).
          </li>
          <li>Authorities that request it in the exercise of their legal functions.</li>
        </ul>
        <p>
          Some of these providers store information on servers outside Colombia, mainly in the United States, a country
          the SIC recognises as having an adequate level of data protection (SIC Circular Única, Title V, Chapter Three).
          By authorising this policy you also authorise that international transmission to the processors, who may only
          use the data to provide their services to us.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>Under article 8 of Law 1581 of 2012 you have the right to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Know, update and correct your data, including partial, inaccurate or incomplete data.</li>
          <li>Request proof of the authorisation you gave us.</li>
          <li>Be informed, on request, of how we have used your data.</li>
          <li>
            Revoke your authorisation and request deletion of your data, except where there is a legal or contractual
            duty to keep it (for example, accounting records).
          </li>
          <li>Access your personal data free of charge.</li>
          <li>Decline to answer questions about sensitive data.</li>
          <li>
            File complaints with the Superintendencia de Industria y Comercio (www.sic.gov.co), after completing the
            inquiry or claim process with us.
          </li>
        </ul>
        <p>These rights may be exercised by you, your successors, or your representative, proving their standing.</p>
      </LegalSection>

      <LegalSection title="9. Promotions on WhatsApp">
        <p>
          We will only send you promotions if you ticked the optional box when booking or asked us to. You can stop them
          at any time, free of charge, by replying «NO» or writing to us. Under Law 2300 of 2023, we only contact you for
          commercial purposes Monday to Friday between 7:00 a.m. and 7:00 p.m. and Saturdays between 8:00 a.m. and 3:00
          p.m., never on Sundays or public holidays, and only through the channel you authorised.
        </p>
      </LegalSection>

      <LegalSection title="10. How to make inquiries and claims">
        <p>
          Write to <LegalValue value={LEGAL.email} /> or WhatsApp {phone} with your name, the phone number you booked
          with, a description of your request and how you want to receive the answer. We may verify your identity before
          replying.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Inquiries</strong> (what data we hold and how we use it): answered within ten (10) business days of
            receipt. If that is not possible, we will tell you why and when you will get an answer, within five (5)
            additional business days.
          </li>
          <li>
            <strong>Claims</strong> (correction, update, deletion, revocation or breach): answered within fifteen (15)
            business days from the day after receipt, extendable by up to eight (8) business days with notice. If a claim
            is incomplete, we will ask you to complete it within five (5) days; if two (2) months pass without it, the
            claim is deemed withdrawn. While it is being resolved, your record will be marked «claim in progress».
          </li>
        </ul>
        <p>
          If deletion or revocation is not possible, we will explain the legal or contractual duty that requires us to
          keep the data.
        </p>
      </LegalSection>

      <LegalSection title="11. Security and confidentiality">
        <p>
          We apply technical, human and administrative measures to protect your data against unauthorised access, loss,
          misuse or alteration: password-protected access to the admin panel, encrypted connections (HTTPS), providers
          with recognised security standards and confidentiality duties for staff and therapists. If a security incident
          compromises your data, we will report it to the SIC and, where appropriate, to you.
        </p>
      </LegalSection>

      <LegalSection title="12. Retention">
        <p>
          We keep your data while it is needed for the purposes described and while you have a relationship with us. We
          then delete it, except data we must keep to meet legal, accounting or tax obligations (accounting records are
          kept for up to ten (10) years under article 28 of Law 962 of 2005) or to handle claims.
        </p>
      </LegalSection>

      <LegalSection title="13. Validity and changes">
        <p>
          This policy applies from {LEGAL.effectiveDateEn}. Our databases will remain in force while L&apos;AMOUR operates.
          If we make substantial changes (for example to the purposes or the controller&apos;s identity), we will tell you
          before applying them and, if the purposes change, we will ask for a new authorisation. The current version is
          always published on this page.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}
