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

    // Texto de "Sobre mí": cada elemento es un párrafo. La última línea
    // ("closing") se muestra destacada, con el botón para empezar.
    aboutTitle: "Conocé mi historia",
    // Frase que va arriba, sobre la foto grande de la sección.
    aboutQuote:
      "Un espacio creado para acompañarte en tu proceso, impulsarte a superar tus límites y recordarte que cada paso te acerca a tu mejor versión.",
    // Fotos de la tira de película (se pueden cambiar/agregar/quitar).
    // position = qué parte de la foto queda visible (x% y%).
    aboutPhotos: [
      { src: "img/fotos/historia-perfil.jpg", alt: "Daiana Sanson, retrato de perfil", position: "50% 25%" },
      { src: "img/fotos/historia-espalda.jpg", alt: "Daiana Sanson, de espaldas", position: "50% 30%" },
      { src: "img/fotos/historia-bn.jpg", alt: "Daiana Sanson, silueta en blanco y negro", position: "50% 35%" },
      { src: "img/fotos/historia-pelo.jpg", alt: "Daiana Sanson, de espaldas con las manos en el pelo", position: "50% 30%" },
    ],
    bio: [
      "Soy Dai Sanson, entrenadora personal y apasionada por el mundo del fitness.",
      "Mi camino en el entrenamiento comenzó mucho antes de convertirlo en mi profesión. Con el tiempo entendí que entrenar no se trata solamente de cambiar el cuerpo, sino también de ganar confianza, sentirse mejor, cuidar nuestra salud y construir hábitos que podamos sostener en el tiempo.",
      "Sé que empezar no siempre es fácil. Muchas veces no sabemos por dónde hacerlo, qué ejercicios elegir, cómo progresar o simplemente nos cuesta mantener la motivación cuando los resultados no llegan tan rápido como esperamos.",
      "Por eso, hoy mi objetivo como entrenadora es mucho más que darte una rutina. Quiero acompañarte durante todo el proceso.",
      "Cada persona tiene objetivos, necesidades y tiempos diferentes. Por eso trabajo de manera personalizada, creando un plan adaptado a vos y acompañándote para que puedas entrenar con seguridad, confianza y una dirección clara.",
      "Mi compromiso es ayudarte a superar tus límites, disfrutar del proceso y acercarte cada día un poco más a tu mejor versión.",
    ],
    aboutHighlight: "Tu objetivo marca el rumbo. Yo te acompaño a construir el camino para alcanzarlo.",
    aboutCta: "¿Empezamos?",

    // Ruta local (ej: "img/foto-daiana.jpg") una vez que tengamos la foto real.
    // Por ahora la página usa una sola foto, en la sección "Sobre mí".
    aboutPhotoUrl: "img/fotos/retrato.jpg",

    // TODO: reemplazar por el número real de WhatsApp de Daiana.
    // Por ahora, provisoriamente, está el número de Gonzalo para probar cómo llega el formulario.
    // Formato: código de país + característica + número, sin "+", sin espacios ni guiones.
    whatsappNumber: "5493772634185",

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
      description: "Mi línea de suplementos para potenciar tu entrenamiento. Usá el código DAISANSON10 y tenés 10% OFF.",
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
  // Asesoría online — se completa cuando la clienta pase el contenido
  // (qué incluye, qué no incluye, precio, duración, modalidad, FAQ, etc.)
  // ------------------------------------------------------------------
  onlineCoaching: {
    title: "Asesoría Online",
    currency: "ARS",
    description:
      "Mi asesoría online está diseñada para acompañarte de manera personalizada a alcanzar tus objetivos, mejorar tu rendimiento y sentirte mejor.",
    // Planes. "id" se usa también en api/create-preference.js (ahí están los
    // precios que realmente se cobran): si cambia un precio, cambiarlo en los
    // dos archivos. "monthlyEquivalent" es solo el texto de "equivale a".
    plans: [
      {
        id: "start",
        tag: "Plan mensual",
        name: "Plan Start",
        price: 70000,
        period: "por mes",
        intro: "Ideal para quienes quieren probar la asesoría y empezar a trabajar mes a mes.",
        includesLead: "Incluye:",
        includes: [
          "Rutina de entrenamiento personalizada según objetivos y nivel.",
          "Plan de alimentación personalizado.",
          "Ejercicios de movilidad y preparación antes de entrenar.",
          "Seguimiento y ajuste del plan cada 4 semanas.",
          "Soporte por WhatsApp para consultas.",
          "Orientación sobre suplementación.",
          "Adaptaciones de ejercicios según necesidades.",
        ],
      },
      {
        id: "pro",
        tag: "Plan trimestral",
        name: "Plan Pro",
        price: 195000,
        period: "cada 3 meses",
        monthlyEquivalent: 65000,
        featured: true, // lleva la etiqueta "Recomendado"
        intro: "Un proceso progresivo de 3 meses, con seguimiento más completo.",
        includesLead: "Incluye todo lo del Plan Start, más:",
        includes: [
          "Compromiso de 3 meses para trabajar de manera progresiva.",
          "Seguimiento más completo de tu evolución durante el trimestre.",
          "Revisión de objetivos y estrategia al finalizar cada mes.",
          "1 revisión técnica por video al mes: me mandás videos de ejercicios puntuales y corrijo tu técnica.",
          "Beneficio exclusivo: congelás el precio durante los 3 meses.",
        ],
      },
      {
        id: "premium",
        tag: "Plan anual",
        name: "Plan Premium",
        price: 660000,
        period: "por 12 meses",
        monthlyEquivalent: 55000,
        intro: "Acompañamiento todo el año, con planificación a largo plazo.",
        includesLead: "Incluye todo lo del Plan Pro, más:",
        includes: [
          "Acompañamiento durante todo el año.",
          "Planificación a largo plazo, trabajando distintas etapas y objetivos.",
          "Seguimiento de tu evolución física y rendimiento.",
          "Revisiones periódicas de objetivos.",
          "Corrección técnica por video.",
          "Adaptación de entrenamiento y alimentación según cada etapa.",
          "2 videollamadas individuales durante el año para evaluar el proceso y definir próximos objetivos.",
          "Precio congelado durante todo el año.",
        ],
      },
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
    mercadoPagoLink: "https://mpago.la/3336YAs",
  },

  // ------------------------------------------------------------------
  // Asesoría presencial
  // ------------------------------------------------------------------
  inPersonCoaching: {
    location: "Fortress Gym — Pedro Vittori 3759, S3002 DME, Santa Fe",
    schedule: "De lunes a viernes",
    description:
      "Entrenamientos personalizados diseñados para ayudarte a alcanzar tus objetivos, mejorar tu rendimiento y sentirte mejor. ✨",
    closingNote:
      "Un acompañamiento personalizado para que puedas entrenar con un plan, progresar y alcanzar tus objetivos de forma efectiva y sostenible. 💖",
    ctaNote: "El valor de la asesoría presencial varía según el plan y tus días de entrenamiento. Escribile a Daiana por WhatsApp y te pasa el precio y coordinan tu primer entrenamiento. ✨",
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
  // Preguntas del formulario (anamnesis) — una lista para Asesoría Online
  // y otra para Asesoría Presencial, porque ahora piden datos distintos.
  // Estos datos se usan para armar el mensaje de WhatsApp prearmado de
  // cada botón ("Ya pagué, continuar por WhatsApp" / "Coordinar mi primer
  // entrenamiento"): así la persona ve las preguntas y las responde
  // directo en el chat, sin necesidad de un formulario con backend.
  // ------------------------------------------------------------------
  intakeForm: {
    // Online: el formulario común de siempre, más el recordatorio de
    // adjuntar el comprobante de pago al final (type: "attachment" hace
    // que esa línea no termine en ": ___" como las demás, porque no es
    // una pregunta para responder sino una acción para hacer ahí mismo).
    online: [
      { id: "fullName", label: "👤 Nombre y apellido", type: "text", required: true },
      { id: "location", label: "📍 Desde dónde me escribís (país/ciudad)", type: "text", required: true },
      { id: "age", label: "🎂 Edad", type: "number", required: true },
      { id: "weight", label: "⚖️ Peso corporal actual en ayunas", type: "text", required: true },
      { id: "height", label: "📏 Altura", type: "text", required: true },
      { id: "goal", label: "🎯 Cuál es tu objetivo actualmente", type: "textarea", required: true },
      { id: "injuries", label: "🩹 Lesiones: sí/no (de ser sí, ¿cuáles?)", type: "text", required: true },
      { id: "experience", label: "💪 Hace cuánto tiempo venís entrenando y si hay algún movimiento que no puedas hacer", type: "textarea", required: true },
      { id: "schedule", label: "⏰ Horario de entrenamiento habitual", type: "text", required: true },
      { id: "days", label: "📅 Cuántos días por semana disponés para entrenar", type: "text", required: true },
      { id: "gym", label: "🏋️ Con respecto al gimnasio al que vas: ¿cuenta con maquinaria o no?", type: "text", required: true },
      { type: "note", label: "⚠️ Necesito un breve video o fotos de las máquinas que tiene tu gimnasio para poder planificar tu rutina 🙏🏻 (adjuntalo en este chat)" },
      { type: "section", label: "🥗 TEMA ALIMENTACIÓN" },
      { id: "dislikes", label: "🙅 ¿Hay algún alimento que no te guste?", type: "text", required: true },
      { id: "intolerance", label: "🚫 ¿Sos intolerante a algún alimento?", type: "text", required: true },
      { type: "section", label: "📸 FOTOS DE PUNTO DE PARTIDA" },
      {
        id: "photos",
        label: "Necesito 3 fotos tuyas de la cabeza para abajo: de frente, de perfil y de espalda, para ver en qué condición estás hoy y poder comparar tu proceso 📎 (adjuntalas en este chat)",
        type: "attachment",
        required: true,
      },
      { type: "section", label: "✨ PARA TERMINAR" },
      {
        id: "extra",
        label: "💬 ¿Algo más que quieras contarme para tener en cuenta al armar tu plan?",
        type: "textarea",
        required: false,
      },
      { id: "receipt", label: "🧾 Adjuntar comprobante de pago 📎", type: "attachment", required: true },
    ],

    // Presencial: sin datos físicos (peso/altura) ni ciudad.
    presencial: [
      { id: "fullName", label: "👤 Nombre y apellido", type: "text", required: true },
      { id: "age", label: "🎂 Edad", type: "number", required: true },
      { id: "goal", label: "🎯 Cuál es tu objetivo actualmente", type: "textarea", required: true },
      { id: "injuries", label: "🩹 Lesiones: sí/no (de ser sí, ¿cuáles?)", type: "text", required: true },
      { id: "experience", label: "💪 Hace cuánto tiempo venís entrenando y si hay algún movimiento que no puedas hacer", type: "textarea", required: true },
      { id: "schedule", label: "⏰ Horario de entrenamiento habitual", type: "text", required: true },
      { id: "days", label: "📅 Cuántos días por semana disponés para entrenar", type: "text", required: true },
      { id: "gym", label: "🏋️ Con respecto al gimnasio al que vas: ¿cuenta con maquinaria o no?", type: "text", required: true },
      { type: "note", label: "⚠️ Necesito un breve video o fotos de las máquinas que tiene tu gimnasio para poder planificar tu rutina 🙏🏻 (adjuntalo en este chat)" },
      { type: "section", label: "🥗 TEMA ALIMENTACIÓN" },
      { id: "dislikes", label: "🙅 ¿Hay algún alimento que no te guste?", type: "text", required: true },
      { id: "intolerance", label: "🚫 ¿Sos intolerante a algún alimento?", type: "text", required: true },
      { type: "section", label: "📸 FOTOS DE PUNTO DE PARTIDA" },
      {
        id: "photos",
        label: "Necesito 3 fotos tuyas de la cabeza para abajo: de frente, de perfil y de espalda, para ver en qué condición estás hoy y poder comparar tu proceso 📎 (adjuntalas en este chat)",
        type: "attachment",
        required: true,
      },
      { type: "section", label: "✨ PARA TERMINAR" },
      {
        id: "extra",
        label: "💬 ¿Algo más que quieras contarme para tener en cuenta al armar tu plan?",
        type: "textarea",
        required: false,
      },
    ],
  },
};
