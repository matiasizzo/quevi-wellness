import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Aviso legal',
  robots: { index: false },
}

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal" updated="julio 2026">
      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio
        Electrónico (LSSI-CE), se informa de que el presente sitio web,{' '}
        <strong>queviwellnessclinic.es</strong>, es titularidad de:
      </p>
      <ul>
        <li><strong>Titular:</strong> QUEVI WELLNESS CLINIC SL</li>
        <li><strong>NIF:</strong> B88657044</li>
        <li><strong>Domicilio:</strong> Calle Gibraltar 2, Local Bajo, 29680 Estepona, Málaga (España)</li>
        <li><strong>Email de contacto:</strong> info@queviwellnessclinic.es</li>
        <li><strong>Teléfono:</strong> +34 683 462 705</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene por objeto informar sobre los servicios de medicina estética de la clínica,
        permitir la reserva de citas y la venta online de productos cosméticos y rituales de bienestar.
        Los tratamientos médico-estéticos requieren siempre valoración médica previa presencial.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso a este sitio web atribuye la condición de usuario e implica la aceptación de las
        presentes condiciones. El usuario se compromete a hacer un uso adecuado de los contenidos y
        servicios, y a no emplearlos para actividades ilícitas o contrarias a la buena fe.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos de este sitio (textos, imágenes, logotipos, diseño, código) son propiedad
        del titular o de terceros que han autorizado su uso, y están protegidos por la normativa de
        propiedad intelectual e industrial. Queda prohibida su reproducción sin autorización expresa.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        El contenido informativo de esta web —incluido el Journal— tiene carácter divulgativo y no
        sustituye en ningún caso el consejo, diagnóstico o tratamiento médico profesional. Ante cualquier
        duda sobre tu salud, consulta con un profesional sanitario.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para cualquier controversia,
        las partes se someten a los juzgados y tribunales de Málaga, salvo que la normativa de consumo
        disponga otro fuero.
      </p>
    </LegalPage>
  )
}
