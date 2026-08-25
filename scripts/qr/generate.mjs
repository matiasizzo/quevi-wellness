#!/usr/bin/env node
/**
 * Genera los materiales imprimibles del QR de reseñas de Google.
 *
 *   npm run qr
 *
 * Salida (carpeta print/):
 *   qr/quevi-resena.svg          QR vectorial (para cualquier diseño propio)
 *   qr/quevi-resena.png          QR 2000px (mismo uso, formato raster)
 *   quevi-resena-cartel-A4.pdf   Cartel A4 para el local
 *   quevi-resena-tarjetas-A4.pdf Hoja A4 con 10 tarjetas 85×55 mm para envíos
 *
 * El QR lleva DIRECTO a la ventana de escribir reseña en Google, usando el
 * identificador de la ficha que hay en reviews.config.json (shortLink o
 * placeId). Sin ese dato el script se para: no se imprime un QR que acabe en
 * un buscador en vez de en el formulario de reseña.
 *
 * Alternativas:
 *   QR_MODE=redirect  el QR apunta a queviwellnessclinic.es/resena, que
 *                     redirige a Google. Permite cambiar el destino después
 *                     sin reimprimir, a cambio de un salto intermedio.
 *   QR_URL=https://…  fuerza cualquier otra URL.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '../..')
const OUT = join(ROOT, 'print')
const OUT_QR = join(OUT, 'qr')

const SITE_URL = 'https://queviwellnessclinic.es'
const REDIRECT_URL = `${SITE_URL}/resena`

/** URL de reseña de Google a partir de reviews.config.json. */
function googleReviewUrl() {
  const cfg = JSON.parse(readFileSync(join(ROOT, 'reviews.config.json'), 'utf8'))
  if (cfg.shortLink) return cfg.shortLink
  if (cfg.placeId) {
    return `https://search.google.com/local/writereview?placeid=${cfg.placeId}`
  }
  return null
}

function resolveQrUrl() {
  if (process.env.QR_URL) return process.env.QR_URL
  if (process.env.QR_MODE === 'redirect') return REDIRECT_URL

  const direct = googleReviewUrl()
  if (direct) return direct

  console.error(
    '✗ Falta el identificador de la ficha de Google.\n\n' +
      '  Abre reviews.config.json y rellena UNO de los dos campos:\n' +
      '    shortLink  Google Business Profile → "Pide reseñas" → https://g.page/r/…\n' +
      '    placeId    https://developers.google.com/maps/documentation/places/web-service/place-id\n\n' +
      '  Sin eso el QR no puede abrir el formulario de reseña.\n' +
      '  (QR_MODE=redirect genera el QR apuntando a /resena en su lugar.)'
  )
  process.exit(1)
}

const URL_QR = resolveQrUrl()
// Texto legible bajo el QR: los enlaces de Google son ilegibles impresos, así
// que en ese caso se muestra la URL corta del sitio, que lleva al mismo sitio.
const URL_VISIBLE = URL_QR.startsWith(SITE_URL)
  ? URL_QR.replace(/^https?:\/\//, '')
  : REDIRECT_URL.replace(/^https?:\/\//, '')

const COLOR = {
  green: '#2c472f',
  greenSoft: '#3d6045',
  terra: '#c4876a',
  cream: '#f5f2ec',
  creamLight: '#fdfcfa',
  carbon: '#1e1e1e',
  muted: '#6b6a63',
}

const FONTS = readFileSync(join(HERE, 'fonts/fonts.css'), 'utf8')

// ── QR ───────────────────────────────────────────────────────────────────────
// Corrección de errores alta (H): el código sigue leyéndose con manchas,
// dobleces o una esquina impresa con poca tinta.
const QR_OPTS = {
  errorCorrectionLevel: 'H',
  // 4 módulos de zona de silencio: obligatorio para que los lectores lo detecten.
  margin: 4,
  color: { dark: COLOR.green, light: '#ffffff' },
}

async function buildQr() {
  mkdirSync(OUT_QR, { recursive: true })
  const svg = await QRCode.toString(URL_QR, { ...QR_OPTS, type: 'svg' })
  writeFileSync(join(OUT_QR, 'quevi-resena.svg'), svg)
  await QRCode.toFile(join(OUT_QR, 'quevi-resena.png'), URL_QR, {
    ...QR_OPTS,
    type: 'png',
    width: 2000,
  })
  // El SVG se incrusta inline en los PDF para que no dependa de rutas externas.
  return svg.replace(/<\?xml[^>]*\?>/, '').trim()
}

// ── Piezas de marca ──────────────────────────────────────────────────────────
const logo = (w = 46) => `
  <svg class="logo" viewBox="0 0 240 76" style="width:${w}mm" role="img" aria-label="QUEVI Wellness Clinic">
    <text x="120" y="46" text-anchor="middle" fill="${COLOR.green}"
      font-family="'Cormorant Garamond', Georgia, serif" font-size="52" font-weight="600"
      letter-spacing="4">QUEVI</text>
    <text x="120" y="66" text-anchor="middle" fill="${COLOR.green}"
      font-family="Inter, sans-serif" font-size="11" font-weight="300"
      letter-spacing="6.5">WELLNESS CLINIC</text>
  </svg>`

const stars = (size = 5) =>
  `<div class="stars" style="font-size:${size}mm">${'★'.repeat(5)}</div>`

const baseCss = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #fff; }
  body {
    font-family: Inter, -apple-system, 'Segoe UI', sans-serif;
    color: ${COLOR.carbon};
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  .serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; }
  .stars { color: ${COLOR.terra}; letter-spacing: .18em; line-height: 1; }
  .qr { display: block; width: 100%; height: 100%; }
  .qr svg { display: block; width: 100%; height: 100%; shape-rendering: crispEdges; }
`

// ── Cartel A4 (local) ────────────────────────────────────────────────────────
function posterHtml(qrSvg) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
  ${baseCss}
  @page { size: A4 portrait; margin: 0; }
  .sheet {
    width: 210mm; height: 297mm; padding: 16mm;
    background: ${COLOR.cream};
    display: flex;
  }
  .frame {
    flex: 1; border: .5mm solid ${COLOR.greenSoft}; border-radius: 3mm;
    padding: 14mm 12mm 11mm;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .eyebrow {
    font-size: 3.1mm; font-weight: 500; letter-spacing: .42em;
    text-transform: uppercase; color: ${COLOR.greenSoft}; margin-top: 9mm;
  }
  h1 { font-size: 17mm; line-height: 1.04; color: ${COLOR.green}; margin-top: 5mm; }
  h1 em { font-style: normal; color: ${COLOR.terra}; }
  .lead {
    font-size: 4.4mm; font-weight: 300; line-height: 1.55; color: ${COLOR.muted};
    max-width: 118mm; margin-top: 6mm;
  }
  .card {
    margin-top: 11mm; padding: 7mm; background: #fff;
    border: .35mm solid #e4e0d6; border-radius: 3mm;
    box-shadow: 0 2mm 8mm rgba(61,96,69,.10);
  }
  .card .qr { width: 76mm; height: 76mm; }
  .scan { margin-top: 7mm; font-size: 4.2mm; font-weight: 500; color: ${COLOR.green}; }
  .scan span { display: block; margin-top: 2mm; font-size: 3.4mm; font-weight: 300; color: ${COLOR.muted}; }
  .spacer { flex: 1; }
  .foot {
    width: 100%; border-top: .25mm solid #ddd8cc; padding-top: 5mm;
    font-size: 3.1mm; font-weight: 300; letter-spacing: .05em; color: ${COLOR.muted};
    display: flex; justify-content: space-between;
  }
  </style></head><body>
    <div class="sheet"><div class="frame">
      ${logo(48)}
      <div class="eyebrow">Tu opinión cuenta</div>
      <h1 class="serif">¿Cómo ha ido<br>tu <em>experiencia</em>?</h1>
      <p class="lead">Cuéntanoslo en Google. Tu reseña ayuda a otras personas
        a dar el primer paso hacia su nueva historia de vida de piel.</p>
      <div class="card"><div class="qr">${qrSvg}</div></div>
      <div class="scan">Escanea con la cámara de tu móvil
        <span>Te lleva directo a nuestra ficha de Google · 30 segundos</span></div>
      <div class="spacer"></div>
      ${stars(4.6)}
      <div class="foot" style="margin-top:6mm">
        <span>Calle Gibraltar 2, Local Bajo · Estepona</span>
        <span>${URL_VISIBLE}</span>
      </div>
    </div></div>
  </body></html>`
}

// ── Hoja de tarjetas A4 (envíos de paquetería) ───────────────────────────────
const CARD = { w: 85, h: 55, cols: 2, rows: 5 }

function cardHtml() {
  return `<div class="card">
    <div class="card-in">
      <div class="left">
        <div class="qr">__QR__</div>
        <div class="scan">Escanea con tu móvil</div>
      </div>
      <div class="right">
        ${logo(30)}
        <div class="title serif">Gracias por<br>tu compra</div>
        <p class="copy">¿Nos dejas tu reseña en Google? Nos ayuda muchísimo.</p>
        ${stars(3)}
        <div class="url">${URL_VISIBLE}</div>
      </div>
    </div>
  </div>`
}

function cardsHtml(qrSvg) {
  const marginX = (210 - CARD.w * CARD.cols) / 2
  const marginY = (297 - CARD.h * CARD.rows) / 2
  const cards = Array.from({ length: CARD.cols * CARD.rows }, cardHtml)
    .join('\n')
    .replaceAll('__QR__', qrSvg)

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
  ${baseCss}
  @page { size: A4 portrait; margin: 0; }
  .sheet {
    width: 210mm; height: 297mm; padding: ${marginY}mm ${marginX}mm;
    display: grid;
    grid-template-columns: repeat(${CARD.cols}, ${CARD.w}mm);
    grid-template-rows: repeat(${CARD.rows}, ${CARD.h}mm);
  }
  /* Guía de corte discreta: se ve al recortar, casi no se nota si queda dentro. */
  .card { outline: .2mm dashed #cfcabc; outline-offset: 0; background: ${COLOR.cream}; }
  .card-in {
    width: 100%; height: 100%; padding: 5mm;
    display: flex; align-items: center; gap: 4.5mm;
  }
  .left { display: flex; flex-direction: column; align-items: center; }
  .left .qr { width: 29mm; height: 29mm; padding: 1.4mm; background: #fff; border-radius: 1mm; }
  .left .scan {
    margin-top: 1.8mm; font-size: 2.1mm; font-weight: 400; letter-spacing: .05em;
    color: ${COLOR.muted}; white-space: nowrap;
  }
  .right { flex: 1; }
  .right .logo { display: block; margin-left: -.5mm; }
  .title { font-size: 6.4mm; line-height: 1.05; color: ${COLOR.green}; margin-top: 3mm; }
  .copy { font-size: 2.9mm; font-weight: 300; line-height: 1.45; color: ${COLOR.muted}; margin-top: 2mm; }
  .stars { margin-top: 2.4mm; }
  .url { margin-top: 2.2mm; font-size: 2.4mm; font-weight: 500; letter-spacing: .04em; color: ${COLOR.greenSoft}; }
  </style></head><body><div class="sheet">${cards}</div></body></html>`
}

// ── Render a PDF con Chromium ────────────────────────────────────────────────
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    ...['chromium-1194', 'chromium'].map((d) =>
      `/opt/pw-browsers/${d}/chrome-linux/chrome`
    ),
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean)
  return candidates.find((p) => existsSync(p))
}

function renderPdf(html, name) {
  const chrome = findChrome()
  const htmlPath = join(OUT, `.${name}.html`)
  writeFileSync(htmlPath, html)
  if (!chrome) {
    console.warn(
      `⚠  No se encontró Chrome/Chromium: no se genera ${name}.pdf.\n` +
        `   Abre print/.${name}.html en el navegador e imprime a PDF (A4, sin márgenes),\n` +
        `   o define CHROME_PATH con la ruta al ejecutable.`
    )
    return
  }
  execFileSync(chrome, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    '--virtual-time-budget=5000',
    `--print-to-pdf=${join(OUT, `${name}.pdf`)}`,
    `file://${htmlPath}`,
  ], { stdio: 'pipe' })
  console.log(`✓ print/${name}.pdf`)
}

// ── Main ─────────────────────────────────────────────────────────────────────
const qrSvg = await buildQr()
console.log(`QR → ${URL_QR}`)
console.log('✓ print/qr/quevi-resena.svg')
console.log('✓ print/qr/quevi-resena.png')
renderPdf(posterHtml(qrSvg), 'quevi-resena-cartel-A4')
renderPdf(cardsHtml(qrSvg), 'quevi-resena-tarjetas-A4')
