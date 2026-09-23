import { PageHeader } from "@/components/ui/PageHeader";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";

export const metadata = {
  title: "Política de Tratamiento de Datos",
  alternates: { canonical: "/legal/privacidad" },
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
  return (
    <>
      <PageHeader path="/legal/privacidad" eyebrow="Documento legal" title="Tratamiento de Datos" compact />
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
    </>
  );
}
