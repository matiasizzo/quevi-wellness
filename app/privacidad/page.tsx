import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  robots: { index: false },
}

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad" updated="julio 2026">
      <p>
        En QUEVI Wellness Clinic tratamos tus datos personales conforme al Reglamento (UE) 2016/679
        (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD). Esta política explica qué datos recogemos, con qué
        finalidad y qué derechos tienes.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Responsable:</strong> QUEVI Wellness Clinic [completar razón social]</li>
        <li><strong>Domicilio:</strong> Calle Gibraltar 2, 29680 Estepona, Málaga</li>
        <li><strong>Email:</strong> info@queviwellnessclinic.es</li>
      </ul>

      <h2>2. Datos que tratamos y finalidades</h2>
      <ul>
        <li>
          <strong>Reserva de citas:</strong> nombre, email, teléfono y servicio solicitado — para
          gestionar tu cita y contactarte. Base legal: ejecución de medidas precontractuales.
        </li>
        <li>
          <strong>Compras online:</strong> datos identificativos, dirección de envío y datos de pago —
          para procesar el pedido, el envío y la facturación. Base legal: ejecución de contrato.
          El pago se procesa a través de Stripe; esta web no almacena datos completos de tarjeta.
        </li>
        <li>
          <strong>Cuenta de usuario:</strong> nombre, email y contraseña cifrada — para gestionar tu
          área personal y tu historial de pedidos. Base legal: ejecución de contrato.
        </li>
        <li>
          <strong>Newsletter:</strong> email — para enviarte comunicaciones si te suscribes. Base
          legal: consentimiento, revocable en cualquier momento.
        </li>
      </ul>

      <h2>3. Destinatarios</h2>
      <p>
        Tus datos pueden ser tratados por proveedores que nos prestan servicios como encargados del
        tratamiento: Supabase (base de datos y autenticación), Stripe (pagos), Vercel (alojamiento
        web) y Resend (emails transaccionales). Algunos de estos proveedores pueden realizar
        transferencias internacionales amparadas en cláusulas contractuales tipo aprobadas por la
        Comisión Europea.
      </p>

      <h2>4. Conservación</h2>
      <p>
        Conservamos tus datos mientras exista una relación contractual o comercial, y posteriormente
        durante los plazos legales aplicables (fiscales, sanitarios y de responsabilidad).
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo a <a href="mailto:info@queviwellnessclinic.es">info@queviwellnessclinic.es</a>.
        También tienes derecho a reclamar ante la Agencia Española de Protección de Datos
        (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
      </p>

      <h2>6. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas apropiadas: cifrado TLS en todas las comunicaciones,
        contraseñas cifradas, acceso restringido a los datos y proveedores con certificaciones de
        seguridad reconocidas.
      </p>
    </LegalPage>
  )
}
