# QR de reseñas de Google — QUEVI

Materiales listos para imprimir para pedir reseñas en Google, en el local y en
los envíos de paquetería.

| Archivo | Uso | Formato |
|---|---|---|
| `quevi-resena-cartel-A4.pdf` | Cartel para mostrador, sala de espera o cabina | A4, 1 cara |
| `quevi-resena-tarjetas-A4.pdf` | 10 tarjetas por hoja para meter en cada pedido | A4 → tarjetas de 85×55 mm |
| `qr/quevi-resena.svg` | QR vectorial para cualquier otro diseño (bolsas, flyers, packaging) | SVG |
| `qr/quevi-resena.png` | Lo mismo en 2000 px | PNG |

## A dónde lleva el QR

Directo a la ventana de escribir reseña de la ficha de QUEVI:
`https://g.page/r/Cau5BKt0MBMREBM/review`. Sin pasos intermedios ni pasar por
la web.

Ese enlace vive en `reviews.config.json` (raíz del proyecto), y de ahí lo cogen
tanto el generador del QR como la página `/resena`. Si algún día cambia, se
edita ahí y se ejecuta `npm run qr`.

También se acepta un `placeId` en lugar del enlace corto
(<https://developers.google.com/maps/documentation/places/web-service/place-id>),
pero genera un QR más denso — 49 módulos frente a 37 — o sea menos margen de
lectura en la tarjeta pequeña. Mejor el enlace corto.

### Los dos modos

| Modo | Qué codifica el QR | Cuándo usarlo |
|---|---|---|
| directo (por defecto, el que está impreso) | el enlace de reseña de Google | Lo normal: el móvil abre Google Maps sin pasos intermedios |
| `QR_MODE=redirect npm run qr` | `queviwellnessclinic.es/resena` | Si algún día quieres poder cambiar el destino **sin reimprimir**, o medir cuánta gente escanea |

La página `/resena` sigue existiendo en los dos casos y redirige a la ficha de
Google: es un enlace corto cómodo para WhatsApp, email de postventa o la bio de
Instagram.

## Impresión

- **Cartel**: papel de 200–250 g, A4, **sin escalar** ("Tamaño real" / 100 %,
  no "Ajustar a página"). Queda bien plastificado o en un porta-carteles A4.
- **Tarjetas**: cartulina de 250–300 g, A4, sin escalar, y recortar por las
  líneas discontinuas. Salen 10 tarjetas por hoja (85×55 mm, tamaño tarjeta de
  visita, entra en cualquier caja o sobre).
- Imprimir siempre a color: el QR es verde marca sobre blanco. En blanco y
  negro también se lee, pero pierde marca.
- Antes de encargar una tirada, imprime una hoja y **escanea el QR con dos
  móviles** (uno Android y uno iPhone) para comprobar que abre lo que debe.

## Regenerar los archivos

```bash
npm run qr                                  # modo directo (necesita reviews.config.json)
QR_MODE=redirect npm run qr                 # vía /resena
QR_URL=https://ejemplo.com npm run qr       # cualquier otra URL
CHROME_PATH=/ruta/al/chrome npm run qr      # si no encuentra Chrome
```

Necesita Chrome/Chromium para los PDF. Si no lo encuentra, deja los HTML en
`print/` para imprimir a PDF desde el navegador.

Los textos y el diseño de las piezas están en `scripts/qr/generate.mjs`.
