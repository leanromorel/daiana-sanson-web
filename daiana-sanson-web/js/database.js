/**
 * database.js
 * -----------------------------------------------------------------------
 * Acá vive TODO el contenido editable del sitio: textos, precios, links,
 * productos, datos de pago, etc.
 *
 * Para cambiar algo del sitio (un precio, un texto, agregar un producto)
 * se edita ESTE archivo. No hace falta tocar index.html ni app.js.
 *
 * Los campos marcados con "// TODO" están pendientes de completar con
 * la información real que envíe la clienta.
 * -----------------------------------------------------------------------
 */

const DB = {

  // ------------------------------------------------------------------
  // Datos generales de la entrenadora
  // ------------------------------------------------------------------
  trainerInfo: {
    name: "Daiana Sanson",
    tagline: "Personal Trainer",

    heroTitle: "Entrená con un\nplan hecho para vos",
    heroSubtitle:
      "Asesoría online y presencial, seguimiento personalizado y una comunidad enfocada en resultados reales.",

    bio:
      "[Bio breve: trayectoria, formación y enfoque de entrenamiento de Daiana. " +
      "Se completa con la información que envíe la clienta.]",

    // Ruta local (ej: "img/foto-daiana.jpg") una vez que tengamos la foto real.
    // Por ahora la página usa una sola foto, en la sección "Sobre mí".
    aboutPhotoUrl: "",

    // TODO: número real de WhatsApp de la clienta.
    // Formato: código de país + característica + número, sin "+", sin espacios ni guiones.
    // Ejemplo Argentina (Santa Fe, cel): "549342XXXXXXX"
    whatsappNumber: "549000000000",

    instagramUrl: "https://www.instagram.com/daianasanson",
  },

  // ------------------------------------------------------------------
  // Datos de cobro (para el paso de pago del flujo de Asesoría Online)
  // ------------------------------------------------------------------
  paymentMethods: {
    // Los logos viven en img/payments/ (rutas locales, no se embeben en el
    // código) para no inflar el tamaño de los archivos del sitio.
    options: [
      {
        currency: "ARS",
        method: "Mercado Pago",
        alias: "daisanson",
        cvu: "0000003100033615585284",
        logo: "img/payments/mercadopago.png",
      },
      {
        currency: "USD",
        method: "Western Union",
        note: "Solicitar datos por WhatsApp",
        logo: "img/payments/western-union.png",
      },
      {
        currency: "EUR",
        method: "Banco Santander (transferencia)",
        iban: "ES69 0049 6123 3127 1619 5091",
        logo: "img/payments/santander.png",
      },
    ],
  },

  // ------------------------------------------------------------------
  // Tarjetas de la sección "Mis servicios" (home)
  // Cada una es un link/entrada hacia una de las 4 unidades de negocio.
  // ------------------------------------------------------------------
  services: [
    {
      id: "online",
      icon: "laptop",
      title: "Asesoría online",
      description: "Plan de entrenamiento y seguimiento mensual, 100% a distancia.",
      ctaLabel: "Ver planes y precio",
      href: "#asesoria-online",
    },
    {
      id: "presencial",
      icon: "pin",
      title: "Asesoría presencial",
      description: "Entrenamiento personalizado, cara a cara, en el gimnasio.",
      ctaLabel: "Ver planes y ubicación",
      href: "#asesoria-presencial",
    },
    {
      id: "suplementos",
      icon: "bottle",
      title: "Suplementos",
      description: "Mi línea de suplementos para potenciar tu entrenamiento.",
      ctaLabel: "Ver catálogo",
      href: "https://r.morashop.ar/daisanson",
    },
    {
      id: "tienda",
      icon: "shirt",
      title: "Tienda deportiva",
      description: "Indumentaria pensada para entrenar con estilo.",
      ctaLabel: "Muy pronto", // TODO: reemplazar por "Ver tienda" + href real cuando exista
      href: "#", // TODO
    },
  ],

  // ------------------------------------------------------------------
  // Mensajes del banner en movimiento (entre "Servicios" y "Sobre mí").
  // Se repiten en loop infinito. Podés sumar un dato real más adelante,
  // ej: "+5 años de experiencia" o "+300 alumnos entrenados".
  // ------------------------------------------------------------------
  runningBanner: {
    messages: [
      "Escribime por WhatsApp y armamos tu plan hoy mismo",
      "Planes 100% personalizados",
      "Asesorías online y presenciales",
      "Pago simple, directo por WhatsApp",
    ],
  },

  // ------------------------------------------------------------------
  // Asesoría online — se completa cuando la clienta pase el contenido
  // (qué incluye, qué no incluye, precio, duración, modalidad, FAQ, etc.)
  // ------------------------------------------------------------------
  onlineCoaching: {
    title: "Asesoría Online",
    price: 65000,
    currency: "ARS",
    period: "mensual",
    description:
      "Mi asesoría online está diseñada para acompañarte de manera personalizada a alcanzar tus objetivos, mejorar tu rendimiento y sentirte mejor.",
    includes: [
      "🏋🏻‍♀️ Rutina de entrenamiento personalizada, adaptada a tus objetivos, nivel y disponibilidad.",
      "🥗 Plan de alimentación personalizado para acompañar tu proceso.",
      "🔥 Ejercicios de movilidad y preparación antes de cada entrenamiento.",
      "📈 Seguimiento cada 4 semanas para evaluar tu progreso y ajustar el plan.",
      "💬 Soporte vía WhatsApp durante todo el proceso.",
      "💊 Guía sobre suplementación según tus objetivos y necesidades.",
    ],
    excludes: [], // TODO: si hay algo que aclarar que NO incluye
    requirements: [], // TODO
    closingNote:
      "Mi objetivo es que no tengas que entrenar a ciegas: vas a contar con un plan, seguimiento y acompañamiento para avanzar de forma efectiva y sostenible. 💖",
    faq: [], // TODO: [{ question, answer }]

    // TODO: pegar acá el "Link de cobro" generado desde la cuenta de Mercado
    // Pago de Daiana (Tu negocio > Cobros > Crear link de pago, por $65.000).
    // En cuanto se completa, en la sección de Asesoría Online aparece un
    // botón "Pagar con Mercado Pago" que abre ese link directo — la persona
    // paga con un clic y a Daiana le llega la notificación con su nombre,
    // sin necesidad de nada más de nuestro lado (eso ya lo maneja Mercado Pago).
    mercadoPagoLink: "",
  },

  // ------------------------------------------------------------------
  // Asesoría presencial
  // ------------------------------------------------------------------
  inPersonCoaching: {
    location: "Fortress Gym — Pedro Vittori 3759, S3002 DME, Santa Fe",
    schedule: "De lunes a viernes",
    plans: ["3 días por semana", "5 días por semana"],
    description:
      "Entrenamientos personalizados diseñados para ayudarte a alcanzar tus objetivos, mejorar tu rendimiento y sentirte mejor. ✨",
    includes: [
      "🏋🏻‍♀️ Entrenamiento personalizado según tus objetivos.",
      "🥗 Plan de alimentación personalizado.",
      "🔥 Movilidad y preparación previa al entrenamiento.",
      "📈 Seguimiento y ajuste del plan cada 4 semanas.",
      "💬 Soporte vía WhatsApp.",
      "💊 Guía sobre suplementación.",
    ],
    closingNote:
      "Un acompañamiento personalizado para que puedas entrenar con un plan, progresar y alcanzar tus objetivos de forma efectiva y sostenible. 💖",
    ctaNote: "¿Querés empezar? Escribime y coordinamos tu primer entrenamiento. ✨",
  },

  // ------------------------------------------------------------------
  // Suplementos y tienda — se completan cuando la clienta pase el catálogo
  // ------------------------------------------------------------------
  supplements: [
    // { name, category, price, imageUrl, buyLink }
  ],

  apparel: [
    // { name, size, color, price, imageUrl, buyLink }
  ],

  // ------------------------------------------------------------------
  // Preguntas del formulario de Asesoría Online (anamnesis)
  // Se completa cuando la clienta defina exactamente qué quiere preguntar.
  // ------------------------------------------------------------------
  intakeForm: {
    // Estos datos se usan para armar el mensaje de WhatsApp prearmado de
    // los botones "Quiero empezar" (Asesoría online y presencial): así la
    // clienta nueva ve las preguntas y las responde directo en el chat,
    // sin necesidad de un formulario con backend.
    fields: [
      { id: "fullName", label: "Nombre y apellido", type: "text", required: true },
      { id: "location", label: "De dónde sos (ciudad/país)", type: "text", required: true },
      { id: "age", label: "Cuántos años tenés", type: "number", required: true },
      { id: "weight", label: "Peso corporal actual en ayunas", type: "text", required: true },
      { id: "height", label: "Altura", type: "text", required: true },
      { id: "goal", label: "Cuál es tu objetivo actualmente", type: "textarea", required: true },
      { id: "injuries", label: "Lesiones: sí/no, ¿cuáles?", type: "text", required: true },
      {
        id: "extra",
        label: "¿Algo más que quieras contarme para tener en cuenta al armar tu plan?",
        type: "textarea",
        required: false,
      },
    ],
  },
};
