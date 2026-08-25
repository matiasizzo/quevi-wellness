# QR de reseñas de Google — QUEVI

Materiales listos para imprimir para pedir reseñas en Google, en el local y en
los envíos de paquetería.

| Archivo | Uso | Formato |
|---|---|---|
| `quevi-resena-cartel-A4.pdf` | Cartel para mostrador, sala de espera o cabina | A4, 1 cara |
| `quevi-resena-tarjetas-A4.pdf` | 10 tarjetas por hoja para meter en cada pedido | A4 → tarjetas de 85×55 mm |
| `qr/quevi-resena.svg` | QR vectorial para cualquier otro diseño (bolsas, flyers, packaging) | SVG |
| `qr/quevi-resena.png` | Lo mismo en 2000 px | PNG |

## Cómo funciona

El QR **no** apunta directamente a Google: apunta a
`https://queviwellnessclinic.es/resena`, que redirige a la ficha de Google.

Ventaja: si Google cambia el enlace, o quieres cambiar el destino más adelante,
se toca una línea de código y **no hay que reimprimir nada**.

## ⚠️ Antes de imprimir: activar el enlace directo

Ahora mismo `/resena` abre la ficha del negocio en Google Maps buscando por
nombre y dirección. Para que abra directamente el formulario de reseña
(mejor conversión), hay que rellenar uno de estos dos datos en `content.ts` →
`GOOGLE_REVIEWS`:

1. **Enlace corto** (lo más fácil): en Google Business Profile → *Pide reseñas*
   → copiar el enlace `https://g.page/r/…` y pegarlo en `shortLink`.
2. **Place ID**: buscarlo en
   <https://developers.google.com/maps/documentation/places/web-service/place-id>
   y pegarlo en `placeId`.

También se puede fijar en Vercel con la variable de entorno
`NEXT_PUBLIC_GOOGLE_REVIEW_URL` sin tocar código.

Después de configurarlo, comprobar escaneando el QR con el móvil que se abre la
ventana de escribir reseña.

## Impresión

- **Cartel**: papel de 200–250 g, A4, **sin escalar** ("Tamaño real" / 100 %,
  no "Ajustar a página"). Queda bien plastificado o en un porta-carteles A4.
- **Tarjetas**: cartulina de 250–300 g, A4, sin escalar, y recortar por las
  líneas discontinuas. Salen 10 tarjetas por hoja (85×55 mm, tamaño tarjeta de
  visita, entra en cualquier caja o sobre).
- Imprimir siempre a color: el QR es verde marca sobre blanco. En blanco y
  negro también se lee, pero pierde marca.

## Regenerar los archivos

```bash
npm run qr
```

Regenera QR y PDFs. Necesita Chrome/Chromium instalado (si no lo encuentra,
deja los HTML en `print/` para imprimir a PDF desde el navegador, o se le
indica la ruta con `CHROME_PATH=/ruta/al/chrome npm run qr`).

Para apuntar el QR a otra URL: `QR_URL=https://... npm run qr`.

Los textos y el diseño de las piezas están en `scripts/qr/generate.mjs`.
