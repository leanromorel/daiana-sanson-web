/**
 * api/create-preference.js
 * -----------------------------------------------------------------------
 * Función del servidor (Vercel la detecta sola por estar en /api) que crea
 * una preferencia de pago de Mercado Pago (Checkout Pro) y redirige directo
 * al checkout. Es la única pieza "con servidor" de todo el sitio — el resto
 * sigue siendo 100% estático.
 *
 * El Access Token de Mercado Pago NUNCA está escrito acá en el código:
 * se lee de una variable de entorno configurada en Vercel
 * (Project Settings > Environment Variables > MP_ACCESS_TOKEN). Así el
 * token no queda expuesto en el repositorio de GitHub (que es público).
 *
 * Si algo falla (variable no configurada todavía, error de red, etc.), el
 * botón no se rompe: redirige de respaldo al link de pago simple de
 * Mercado Pago.
 *
 * Importante: si cambia el precio de la Asesoría Online, hay que
 * actualizarlo ACÁ (unit_price) y también en js/database.js
 * (onlineCoaching.price), son dos lugares separados porque este archivo
 * corre en el servidor y database.js corre en el navegador.
 * -----------------------------------------------------------------------
 */

const FALLBACK_LINK = "https://mpago.la/3336YAs";

export default async function handler(req, res) {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  // Todavía no se cargó el Access Token en Vercel: no rompemos el botón,
  // mandamos al link de pago simple de siempre.
  if (!accessToken) {
    res.writeHead(302, { Location: FALLBACK_LINK });
    return res.end();
  }

  try {
    const host = req.headers.host;
    const origin = `https://${host}`;

    const preference = {
      items: [
        {
          title: "Asesoría Online - Daiana Sanson",
          quantity: 1,
          unit_price: 70000,
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: `${origin}/gracias-online.html`,
        pending: `${origin}/#asesoria-online`,
        failure: `${origin}/#asesoria-online`,
      },
      auto_return: "approved",
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok || !data.init_point) {
      res.writeHead(302, { Location: FALLBACK_LINK });
      return res.end();
    }

    res.writeHead(302, { Location: data.init_point });
    return res.end();
  } catch (err) {
    res.writeHead(302, { Location: FALLBACK_LINK });
    return res.end();
  }
}
