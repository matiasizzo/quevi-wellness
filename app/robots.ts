import type { MetadataRoute } from 'next'

// Rutas transaccionales o privadas: no aportan nada en búsqueda y diluyen el rastreo.
// Ojo: /cita NO se bloquea entero — /cita/diagnostico es la landing de campaña y
// tiene que ser rastreable. Solo se excluyen los pasos finales del embudo.
const PRIVATE = [
  '/admin',
  '/cuenta',
  '/checkout',
  '/cita/confirmada',
  '/vale',
  '/api',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE,
      },
      // Allow AI crawlers explicit access
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: PRIVATE,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: PRIVATE,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: PRIVATE,
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: PRIVATE,
      },
    ],
    sitemap: 'https://www.queviwellnessclinic.es/sitemap.xml',
    host: 'https://www.queviwellnessclinic.es',
  }
}
