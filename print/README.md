# QR de reseñas de Google — QUEVI

Materiales listos para imprimir para pedir reseñas en Google, en el local y en
los envíos de paquetería.

| Archivo | Uso | Formato |
|---|---|---|
| `quevi-resena-cartel-A4.pdf` | Cartel para mostrador, sala de espera o cabina | A4, 1 cara |
| `quevi-resena-tarjetas-A4.pdf` | 10 tarjetas por hoja para meter en cada pedido | A4 → tarjetas de 85×55 mm |
| `qr/quevi-resena.svg` | QR vectorial para cualquier otro diseño (bolsas, flyers, packaging) | SVG |
| `qr/quevi-resena.png` | Lo mismo en 2000 px | PNG |

## ⚠️ Estado actual: falta el enlace de Google

El QR debe abrir **directamente** la ventana de escribir reseña. Para eso hace
falta el identificador de la ficha de Google, que solo se puede sacar del perfil
del negocio. Hay que rellenar **uno** de los dos campos de
`reviews.config.json` (en la raíz del proyecto):

| Campo | De dónde sale | Recomendado |
|---|---|---|
| `shortLink` | Google Business Profile → **Pide reseñas** → copiar el enlace `https://g.page/r/…` | ✅ sí |
| `placeId` | <https://developers.google.com/maps/documentation/places/web-service/place-id> | funciona igual, pero genera un QR más denso (49 módulos frente a 37), o sea menos margen de lectura en la tarjeta pequeña |

Después:

```bash
npm run qr
```

y quedan regenerados el QR y los dos PDF apuntando directos a Google. Sin ese
dato el comando se para: así no se imprime por error un QR que acabe en un
buscador en vez de en el formulario de reseña.

**Los PDF que hay ahora en esta carpeta son provisionales**: se generaron en
modo redirección (`QR_MODE=redirect`) y pasan por
`queviwellnessclinic.es/resena`, que reenvía a Google. Funcionan, pero se ve un
parpadeo de carga intermedio. Regenéralos antes de mandar a imprimir.

### Los dos modos

| Modo | Qué codifica el QR | Cuándo usarlo |
|---|---|---|
| directo (por defecto) | el enlace de reseña de Google | Lo que quieres normalmente: el móvil abre Google Maps sin pasos intermedios |
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
