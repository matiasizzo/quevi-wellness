import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  alternates: { canonical: '/politica-cookies' },
  title: 'Política de cookies',
  robots: { index: false },
}

export default function PoliticaCookiesPage() {
  return (
    <LegalPage title="Política de cookies" updated="julio 2026">
      <p>
        Esta web utiliza cookies y tecnologías similares (como el almacenamiento local del navegador)
        para funcionar correctamente y, con tu consentimiento, para fines analíticos.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Son pequeños archivos que el navegador almacena en tu dispositivo cuando visitas una web.
        Permiten recordar información sobre tu visita, como tu sesión o el contenido de tu carrito.
      </p>

      <h2>2. Cookies que utilizamos</h2>
      <ul>
        <li>
          <strong>Técnicas (necesarias, no requieren consentimiento):</strong> gestión de la sesión de
          usuario (Supabase Auth), contenido del carrito de compra, preferencia de consentimiento de
          cookies y las cookies de seguridad de Stripe para procesar pagos y prevenir fraude.
        </li>
        <li>
          <strong>Analíticas (opcionales, solo con tu consentimiento):</strong> nos ayudarían a entender
          cómo se navega el sitio para mejorarlo. Actualmente no cargamos ninguna herramienta analítica
          sin tu aceptación expresa en el banner de cookies.
        </li>
      </ul>

      <h2>3. Gestión del consentimiento</h2>
      <p>
        En tu primera visita mostramos un banner donde puedes aceptar todas las cookies o solo las
        necesarias. Puedes cambiar tu elección en cualquier momento borrando los datos de navegación
        de este sitio en tu navegador — el banner volverá a mostrarse.
      </p>

      <h2>4. Cookies de terceros</h2>
      <p>
        Stripe (procesador de pagos) puede establecer cookies propias durante el proceso de pago con
        finalidad exclusiva de seguridad y prevención de fraude. Puedes consultar su política en{' '}
        <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer">stripe.com/es/privacy</a>.
      </p>

      <h2>5. Cómo desactivar las cookies en tu navegador</h2>
      <p>
        Puedes bloquear o eliminar las cookies desde la configuración de tu navegador (Chrome, Safari,
        Firefox, Edge). Ten en cuenta que bloquear las cookies técnicas puede impedir el funcionamiento
        del carrito, el login o el proceso de pago.
      </p>
    </LegalPage>
  )
}
