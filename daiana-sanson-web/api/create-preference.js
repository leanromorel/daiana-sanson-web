/**
 * api/create-preference.js
 * Crea una preferencia de pago de Mercado Pago (Checkout Pro) según el plan
 * elegido y redirige al checkout. El Access Token NO está acá: se lee de la
 * variable de entorno MP_ACCESS_TOKEN configurada en Vercel.
 *
 * Si cambia el precio de un plan, hay que actualizarlo ACÁ (PLANS) y también
 * en js/database.js (onlineCoaching.plans): mismo "id" y mismo precio.
 */

const PLANS = {
  start: { name: "Plan Start (mensual)", price: 70000 },
  pro: { name: "Plan Pro (trimestral)", price: 195000 },
  premium: { name: "Plan Premium (anual)", price: 660000 },
};

// Link de pago simple de respaldo: solo existe para el Plan Start ($70.000).
const FALLBACK_LINK = "https://mpago.la/3336YAs";

module.exports = async function handler(req, res) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  const origin = `https://${req.headers.host}`;

  // Plan elegido (?plan=start|pro|premium). Si falta o es inválido, Start.
  const url = new URL(req.url, origin);
  const requested = url.searchParams.get("plan");
  const planId = PLANS[requested] ? requested : "start";
  const plan = PLANS[planId];

  const mode = "online";
  const modeLabel = "Online";

  // Si algo falla: Start usa el link simple; los otros planes vuelven a la
  // sección de planes para no cobrar un monto equivocado.
  const fallback = planId === "start" ? FALLBACK_LINK : `${origin}/#asesoria-${mode}`;

  if (!accessToken) {
    res.writeHead(302, { Location: fallback });
    return res.end();
  }

  try {
    const preference = {
      items: [
        {
          title: `Asesoría ${modeLabel} - ${plan.name} - Daiana Sanson`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: `${origin}/gracias-online.html?plan=${planId}&mode=${mode}`,
        pending: `${origin}/#asesoria-${mode}`,
        failure: `${origin}/#asesoria-${mode}`,
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
      res.writeHead(302, { Location: fallback });
      return res.end();
    }

    res.writeHead(302, { Location: data.init_point });
    return res.end();
  } catch (err) {
    res.writeHead(302, { Location: fallback });
    return res.end();
  }
};
