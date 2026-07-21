import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Términos y condiciones de compra',
  robots: { index: false },
}

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y condiciones de compra" updated="julio 2026">
      <h2>1. Ámbito</h2>
      <p>
        Estas condiciones regulan la compra de productos cosméticos, rituales de bienestar y la reserva
        de citas con seña a través de <strong>queviwellnessclinic.es</strong>, titularidad de{' '}
        <strong>QUEVI WELLNESS CLINIC SL</strong> (NIF B88657044), con domicilio en Calle Gibraltar 2,
        Local Bajo, 29680 Estepona, Málaga. Al completar un pedido, aceptas estas condiciones.
      </p>

      <h2>2. Productos y precios</h2>
      <p>
        Los precios se muestran en euros (€) e incluyen IVA. Los gastos de envío se calculan antes del
        pago: envío estándar 4,95 €, <strong>gratuito a partir de 50 €</strong> de compra. Nos
        reservamos el derecho de corregir errores tipográficos evidentes en precios; en tal caso, te
        contactaremos antes de procesar el pedido.
      </p>

      <h2>3. Pago</h2>
      <p>
        Los pagos se procesan de forma segura a través de Stripe (tarjeta de crédito/débito y otros
        métodos disponibles). No almacenamos los datos completos de tu tarjeta.
      </p>

      <h2>4. Envíos</h2>
      <p>
        Realizamos envíos a España peninsular y a los países mostrados en el proceso de compra. El
        plazo estimado de entrega es de 2 a 5 días laborables desde la confirmación del pedido.
      </p>

      <h2>5. Rituales y citas con seña</h2>
      <ul>
        <li>
          Los <strong>Rituales de Firma</strong> comprados online se canjean en clínica. Contacta con
          nosotros para agendar tu sesión tras la compra. Validez: 12 meses desde la fecha de compra.
        </li>
        <li>
          La <strong>seña de 50 €</strong> para tratamientos médicos se descuenta del precio final del
          tratamiento. Puedes reprogramar tu cita hasta 24 h antes sin coste.
        </li>
      </ul>

      <h2>6. Derecho de desistimiento y devoluciones</h2>
      <p>
        Conforme a la legislación de consumo, dispones de <strong>14 días naturales</strong> desde la
        recepción para desistir de tu compra de productos, siempre que estén sin abrir y con el
        precinto intacto — por razones de higiene y protección de la salud, no se aceptan devoluciones
        de cosméticos abiertos o usados (art. 103 LGDCU). Para iniciar una devolución escribe a{' '}
        <a href="mailto:info@queviwellnessclinic.es">info@queviwellnessclinic.es</a>. El reembolso se
        realiza por el mismo método de pago en un máximo de 14 días desde la recepción del producto
        devuelto.
      </p>

      <h2>7. Productos defectuosos</h2>
      <p>
        Si recibes un producto dañado o erróneo, contáctanos en un plazo de 48 h con fotos del producto
        y del embalaje. Cubrimos los gastos de la devolución y el reenvío.
      </p>

      <h2>8. Atención al cliente</h2>
      <p>
        Para cualquier consulta: <a href="mailto:info@queviwellnessclinic.es">info@queviwellnessclinic.es</a>{' '}
        · WhatsApp <a href="https://wa.me/34683462705" target="_blank" rel="noopener noreferrer">+34 683 462 705</a>.
      </p>
    </LegalPage>
  )
}
