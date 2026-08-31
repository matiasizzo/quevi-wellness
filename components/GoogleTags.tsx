import Script from 'next/script'
import { GA4_ID, GOOGLE_ADS_ID } from '@/lib/gtag'

/**
 * Google Analytics 4 + etiqueta de Google Ads, con Consent Mode v2.
 *
 * Orden de ejecución, que es lo único delicado de todo esto:
 *
 *   1. El script en línea de abajo se ejecuta mientras el navegador parsea el
 *      <head>, ANTES de que exista gtag.js. Ahí se declara el consentimiento por
 *      defecto DENEGADO para publicidad y analítica.
 *   2. Si el visitante ya había decidido, se restaura su decisión.
 *   3. Solo entonces se carga gtag.js.
 *
 * Con esto, la etiqueta nunca escribe una cookie antes del consentimiento: los
 * envíos previos van sin identificadores (`ads_data_redaction`) y sirven solo
 * para el modelado de conversiones, que es lo que exige el RGPD y lo que Google
 * llama "modo de consentimiento avanzado".
 *
 * Variables de entorno (Vercel):
 *   NEXT_PUBLIC_GA4_ID         G-XXXXXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_ID  AW-XXXXXXXXXX
 *
 * Sin ellas, no se carga nada.
 */
export default function GoogleTags() {
  if (!GA4_ID && !GOOGLE_ADS_ID) return null

  const primaryId = GA4_ID || GOOGLE_ADS_ID

  const bootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;

// 1. Por defecto, todo denegado. wait_for_update da medio segundo al banner.
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);

// 2. Restaurar la decisión previa antes del primer envío.
try {
  var stored = JSON.parse(localStorage.getItem('quevi-consent') || 'null');
  if (stored && stored.v === 2) {
    gtag('consent', 'update', {
      ad_storage: stored.ads ? 'granted' : 'denied',
      ad_user_data: stored.ads ? 'granted' : 'denied',
      ad_personalization: stored.ads ? 'granted' : 'denied',
      analytics_storage: stored.analytics ? 'granted' : 'denied'
    });
  }
} catch (e) { /* almacenamiento bloqueado: seguimos denegados */ }

gtag('js', new Date());
${GA4_ID ? `gtag('config', '${GA4_ID}', { send_page_view: true });` : ''}
${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });` : ''}
`.trim()

  return (
    <>
      <script
        id="google-consent-default"
        // Debe ejecutarse durante el parseo, antes que gtag.js
        dangerouslySetInnerHTML={{ __html: bootstrap }}
      />
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
    </>
  )
}
