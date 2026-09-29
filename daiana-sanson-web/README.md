# Daiana Sanson — Web

Sitio de una sola página (HTML + Tailwind CSS por CDN + JavaScript vanilla). No requiere build, servidor ni base de datos: se abre directo en el navegador.

## Estructura

```
daiana-sanson-web/
├── index.html        → estructura de la página (no hay textos "a mano": todo se llena desde database.js)
├── css/
│   └── styles.css     → ajustes puntuales que Tailwind no cubre
├── js/
│   ├── database.js    → TODO el contenido editable: textos, precios, links, productos, WhatsApp, pagos
│   └── app.js          → lógica: toma database.js y arma el HTML, menú mobile, links de WhatsApp
└── img/                → poner acá las fotos reales cuando las tengamos
```

## Cómo verlo mientras se construye

Alcanza con abrir `index.html` en el navegador (doble clic, o "Abrir con" → Chrome). No hace falta instalar nada.

Si preferís servirlo con un servidor local (recomendado para que las rutas de imágenes funcionen igual que en producción):

```bash
# Con Python
python3 -m http.server 5500

# Con Node (si tenés npx)
npx serve .
```

Y entrás a `http://localhost:5500`.

## Cómo editar contenido (precios, textos, links)

**Nunca se toca `index.html` ni `app.js` para un cambio de contenido.** Todo vive en `js/database.js`:

- `trainerInfo` → nombre, bio, textos del hero, número de WhatsApp, Instagram, fotos.
- `paymentMethods` → alias, CBU, banco/billetera, QR.
- `services` → las 4 tarjetas de la home (Asesoría online, presencial, suplementos, tienda).
- `onlineCoaching` / `inPersonCoaching` → detalle de cada asesoría (precio, qué incluye, FAQ, etc.) — pendiente de completar.
- `supplements` / `apparel` → catálogos — pendiente de completar.
- `intakeForm` → preguntas del formulario de la asesoría online — pendiente de completar.

Los campos marcados `// TODO` en `database.js` son los que faltan completar con la info real que pase la clienta.

## Pendiente (según lo que definamos con el contenido)

- Cargar fotos reales en `img/` y referenciarlas en `database.js` (`heroPhotoUrl`, `aboutPhotoUrl`).
- Número real de WhatsApp en `trainerInfo.whatsappNumber`.
- Contenido completo de `onlineCoaching` e `inPersonCoaching` (precio, qué incluye, FAQ).
- Formulario de anamnesis (paso previo al pago) con las preguntas que definió la clienta.
- Paso de pago: alias/CBU/QR + botón "copiar alias" + mensaje armado a WhatsApp con los datos del formulario y el comprobante.
- Catálogo de suplementos y de la tienda de ropa.
- Dominio propio (`.com.ar`) — se conecta al final, sobre Vercel (gratis).

## Deploy (cuando esté listo)

El sitio es 100% estático, así que se puede subir tal cual a **Vercel**, **Netlify** o **GitHub Pages**, sin configuración adicional.
