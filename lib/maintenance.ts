import { SITE } from '@/content'

/**
 * Modo mantenimiento.
 *
 * Con `enabled` a true, el middleware sirve la página de "volvemos pronto" en
 * la home y en cualquier ruta que no esté en ALLOWED_PREFIXES. Se decide en el
 * middleware y no en cada página para que no quede ningún contenido fuera por
 * olvido: lo que no está en la lista, no se ve.
 *
 *  · Responde 503 con Retry-After: es la señal de "cerrado por obras" que
 *    Google entiende como temporal, así que no desindexa la web por unos días
 *    de cierre. Un 200 haría que indexara este aviso como si fuera la home.
 *  · Es HTML autónomo: sin analítica, sin cookies y sin fuentes de terceros,
 *    así que no necesita aviso de cookies ni carga nada de Google.
 *
 * Para volver a abrir la web: `enabled: false` y desplegar.
 */
export const MAINTENANCE = {
  enabled: true,

  /**
   * Rutas que siguen funcionando. Cada una es la ruta exacta o su prefijo de
   * carpeta: '/admin' deja pasar '/admin' y '/admin/...', no '/administrar'.
   */
  allowedPrefixes: [
    // El webhook de Stripe, el panel y lo que piden las páginas que siguen abiertas
    '/api',
    '/admin',
    // Información legal obligatoria (LSSI): tiene que estar siempre accesible
    '/aviso-legal',
    '/privacidad',
    '/politica-cookies',
    '/terminos',
    // Cuestionarios de salud que se envían a mano a pacientes con cita
    '/chequeo-piel',
    '/chequeo-capilar',
    '/proteccion-datos',
    // Destino del QR impreso para reseñas: solo redirige a Google
    '/resena',
    '/robots.txt',
    '/sitemap.xml',
  ],
}

export function isMaintenanceBlocked(pathname: string): boolean {
  if (!MAINTENANCE.enabled) return false
  return !MAINTENANCE.allowedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34683462705'

const telHref = `tel:${SITE.phone.replace(/\s+/g, '')}`

export const MAINTENANCE_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SITE.name} — Volvemos pronto</title>
<meta name="description" content="Estamos mejorando nuestros servicios y protocolos. Volvemos pronto.">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #f5f2ec;
    color: #1e1e1e;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .serif { font-family: "Cormorant Garamond", "Playfair Display", Georgia, "Times New Roman", serif; }
  main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 56px 24px 40px;
  }
  .wrap { width: 100%; max-width: 560px; text-align: center; }
  .logo { display: block; margin: 0 auto 48px; }
  .rule { width: 40px; height: 1px; background: #adc5af; margin: 0 auto 32px; border: 0; }
  h1 {
    margin: 0;
    font-weight: 500;
    font-size: clamp(30px, 6.4vw, 44px);
    line-height: 1.12;
    letter-spacing: -0.01em;
    color: #2c472f;
    text-wrap: balance;
  }
  .lead {
    margin: 18px 0 0;
    font-size: clamp(19px, 3.6vw, 23px);
    font-style: italic;
    color: #3d6045;
  }
  .contact {
    margin: 48px 0 0;
    padding: 28px 24px;
    border: 1px solid #ddd8cc;
    border-radius: 20px;
    background: #f9f7f3;
  }
  .contact p { margin: 0; font-size: 14px; line-height: 1.6; color: #525252; }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin: 18px 0 18px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 10px 20px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: background-color .2s ease, border-color .2s ease;
  }
  .btn-primary { background: #355539; color: #fdfcfa; }
  .btn-primary:hover { background: #2c472f; }
  .btn-ghost { border: 1px solid #ccc5b6; color: #2c472f; }
  .btn-ghost:hover { border-color: #5d8c61; }
  .btn:focus-visible { outline: 2px solid #3d6045; outline-offset: 3px; }
  .contact a.plain { color: #2c472f; text-decoration: none; border-bottom: 1px solid #adc5af; }
  .en { margin: 32px 0 0; font-size: 13px; line-height: 1.6; color: #737373; }
  footer {
    padding: 24px;
    border-top: 1px solid #ddd8cc;
    text-align: center;
    font-size: 12px;
    line-height: 1.7;
    color: #737373;
  }
  footer .nw { white-space: nowrap; }
  footer nav { margin-top: 6px; }
  footer a { color: #525252; text-decoration: none; margin: 0 8px; }
  footer a:hover { color: #2c472f; text-decoration: underline; }
</style>
</head>
<body>
<main>
  <div class="wrap">
    <svg class="logo" width="190" height="60" viewBox="0 0 240 76" role="img" aria-label="${SITE.name}">
      <text x="120" y="46" class="serif" font-size="52" font-weight="600" text-anchor="middle" fill="#2b4430" letter-spacing="4">QUEVI</text>
      <text x="120" y="72" class="serif" font-size="12" text-anchor="middle" fill="#2b4430" letter-spacing="5" opacity="0.8">Wellness Clinic</text>
    </svg>

    <hr class="rule">

    <h1 class="serif">Estamos mejorando nuestros servicios y protocolos</h1>
    <p class="lead serif">Volvemos muy pronto.</p>

    <div class="contact">
      <p>Si necesitas ponerte en contacto con nosotros:</p>
      <div class="actions">
        <a class="btn btn-primary" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a class="btn btn-ghost" href="${telHref}">${SITE.phone}</a>
      </div>
      <p><a class="plain" href="mailto:${SITE.email}">${SITE.email}</a></p>
      <p>${SITE.address}</p>
    </div>

    <p class="en" lang="en">We are improving our services and protocols. We will be back soon.</p>
  </div>
</main>
<footer>
  <div><span class="nw">QUEVI WELLNESS CLINIC SL</span> · <span class="nw">CIF B88657044</span> · <span class="nw">Nº NICA ${SITE.nica}</span></div>
  <nav aria-label="Información legal">
    <a href="/aviso-legal">Aviso legal</a>
    <a href="/privacidad">Privacidad</a>
    <a href="/politica-cookies">Cookies</a>
  </nav>
</footer>
</body>
</html>`
