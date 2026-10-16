/**
 * app.js
 * -----------------------------------------------------------------------
 * Toda la lógica del sitio: toma los datos de database.js y los vuelca
 * en el HTML, arma los links de WhatsApp, maneja el menú mobile, la
 * cinta animada, el scroll-reveal y la navbar reactiva.
 *
 * No hay contenido "hardcodeado" acá: si algo hay que cambiar, se edita
 * database.js, no este archivo.
 * -----------------------------------------------------------------------
 */

// Set de íconos en línea (stroke, sin dependencias externas).
const ICONS = {
  laptop: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M2 19h20"/></svg>`,
  pin: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  bottle: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4"/><path d="M11 2v6.5L5.5 18a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L13 8.5V2"/><path d="M8 15h8"/></svg>`,
  shirt: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4 4 7l2 3 2-1.3V20h8V8.7L18 10l2-3-4-3-2 2h-4Z"/></svg>`,
  arrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`,
};

// Fondo de ícono por tarjeta de servicio (degradé, mismo orden que database.js > services).
const CARD_ICON_BG = {
  online: "bg-gradient-to-br from-pink to-azalea",
  presencial: "bg-gradient-to-br from-sky to-pink",
  suplementos: "bg-gradient-to-br from-azalea to-sky",
  tienda: "bg-gradient-to-br from-beige to-sky",
};

document.addEventListener("DOMContentLoaded", () => {
  renderTrainerInfo();
  renderServices();
  renderMarquee();
  renderOnlineCoaching();
  renderInPersonCoaching();
  renderPaymentMethods();
  setupMobileMenu();
  setupStickyNavbar();
  setupScrollReveal();
});

// ------------------------------------------------------------------
// Datos generales (nav, hero, sobre mí, footer, botones de WhatsApp)
// ------------------------------------------------------------------
function renderTrainerInfo() {
  const info = DB.trainerInfo;

  setText("brand-name", info.name);
  setText("footer-name", info.name);
  setText("footer-year-name", info.name);

  setText("hero-title", info.heroTitle);
  setText("hero-subtitle", info.heroSubtitle);
  setText("story-quote", info.aboutQuote);
  const paragraphs = (Array.isArray(info.bio) ? info.bio : [info.bio]).filter(Boolean);
  const half = Math.ceil(paragraphs.length / 2);
  const toHtml = (list) => list.map((t) => `<p>${escapeHtml(t)}</p>`).join("");
  const col1 = document.getElementById("story-col-1");
  const col2 = document.getElementById("story-col-2");
  if (col1) col1.innerHTML = toHtml(paragraphs.slice(0, half));
  if (col2) col2.innerHTML = toHtml(paragraphs.slice(half));
  setText("about-highlight", info.aboutHighlight);
  setText("about-cta", info.aboutCta);

  const strip = document.getElementById("story-strip");
  if (strip) {
    strip.innerHTML = (info.aboutPhotos || [])
      .map(
        (ph) => `
      <div class="shrink-0 w-[46%] md:w-[24%] bg-[#0B121B] rounded-md px-2 py-3">
        <div class="sprockets h-3"></div>
        <div class="aspect-[3/4] overflow-hidden my-1.5 rounded-sm">
          <img src="${escapeHtml(ph.src)}" alt="${escapeHtml(ph.alt || "")}" loading="lazy" class="object-cover w-full h-full" style="object-position:${escapeHtml(ph.position || "50% 30%")}" />
        </div>
        <div class="sprockets h-3"></div>
      </div>`
      )
      .join("");
  }

  const waLink = buildWhatsappLink(info.whatsappNumber, buildDefaultWhatsappMessage(info.name));
  ["whatsapp-nav-btn", "whatsapp-hero-btn", "whatsapp-mobile-btn", "whatsapp-footer-btn", "whatsapp-float-btn"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = waLink;
  });

  const igLink = document.getElementById("instagram-link");
  if (igLink) igLink.href = info.instagramUrl;

  const igHandle = getInstagramHandle(info.instagramUrl);
  const igCtaBtn = document.getElementById("instagram-cta-btn");
  if (igCtaBtn) igCtaBtn.href = info.instagramUrl;
  setText("instagram-handle", igHandle);
}

// Extrae "@usuario" a partir de la URL completa de Instagram.
function getInstagramHandle(instagramUrl) {
  if (!instagramUrl) return "";
  const clean = instagramUrl.replace(/\/+$/, "");
  const parts = clean.split("/");
  const user = parts[parts.length - 1];
  return user ? `@${user}` : "";
}

// ------------------------------------------------------------------
// Grilla de servicios (Asesoría online / presencial / suplementos / tienda)
// ------------------------------------------------------------------
function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid || !Array.isArray(DB.services)) return;

  grid.innerHTML = DB.services
    .map((service) => {
      const iconBg = CARD_ICON_BG[service.id] || "bg-pink";
      const icon = ICONS[service.icon] || "";
      const isExternal = /^https?:\/\//.test(service.href || "");
      const isPlaceholder = !service.href || service.href === "#";

      const cta = isPlaceholder
        ? `<span class="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-navy/40">${escapeHtml(service.ctaLabel || "Muy pronto")}</span>`
        : `<a href="${escapeAttr(service.href)}" ${isExternal ? 'target="_blank" rel="noopener"' : ""} class="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-all group-hover:gap-2.5">
             ${escapeHtml(service.ctaLabel || "Ver más")} ${ICONS.arrow}
           </a>`;

      return `
        <div id="${escapeAttr(service.id)}" data-reveal class="group relative overflow-hidden bg-white border border-navy/10 rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl scroll-mt-[88px]">
          <span class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-flash to-[#FF2D6B] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          <div class="w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-navy transition-all duration-300 group-hover:from-flash group-hover:to-[#FF2D6B] group-hover:text-white">
            ${icon}
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold">${escapeHtml(service.title)}</h3>
            <p class="text-[14.5px] leading-relaxed text-navy/70">${escapeHtml(service.description)}</p>
          </div>
          ${cta}
        </div>
      `;
    })
    .join("");
}

// ------------------------------------------------------------------
// Cinta animada (marquee) con los servicios en loop, entre el hero
// y la sección de servicios.
// ------------------------------------------------------------------
function renderMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track || !Array.isArray(DB.services) || DB.services.length === 0) return;

  const titles = DB.services.map((s) => s.title);
  const separator = '<span class="opacity-60" aria-hidden="true">&#10022;</span>';
  const unit = titles.map((t) => `<span>${escapeHtml(t)}</span>`).join(separator);
  const block = `${unit}${separator}`;

  // Se repite varias veces para cubrir pantallas anchas, y se duplica
  // el bloque entero para que el loop de la animación sea perfecto
  // (la segunda mitad es idéntica a la primera).
  const half = block.repeat(6);
  track.innerHTML = half + half;
}

// ------------------------------------------------------------------
// Asesoría online: precio, qué incluye y botón de WhatsApp con el
// formulario (formulario) prearmado en el mensaje.
// ------------------------------------------------------------------
function renderOnlineCoaching() {
  const d = DB.onlineCoaching;
  if (!d) return;

  setText("online-title", d.title);
  setText("online-description", d.description);
  setText("online-closing", d.closingNote);

  renderPlanCards("online-plans", "online", "dark");
  setupPaidButton("whatsapp-online-btn", "online");
}

// ------------------------------------------------------------------
// Tarjetas de planes. Se usan en Asesoría online (fondo oscuro) y en
// Asesoría presencial (fondo claro): son los mismos planes, con los
// mismos precios, que viven en DB.onlineCoaching.plans.
// mode: "online" | "presencial" · theme: "dark" | "light"
// ------------------------------------------------------------------
function renderPlanCards(containerId, mode, theme) {
  const el = document.getElementById(containerId);
  const d = DB.onlineCoaching;
  if (!el || !d || !Array.isArray(d.plans)) return;

  const dark = theme === "dark";
  el.innerHTML = d.plans
    .map((plan, i) => {
      const featured = !!plan.featured;
      const card = featured
        ? "bg-gradient-to-br from-flash to-[#FF2D6B] text-white shadow-[0_20px_50px_-16px_rgba(255,45,107,0.6)] md:-translate-y-2"
        : dark
        ? "bg-white/5 border border-beige/15 text-beige"
        : "bg-white border border-navy/10 text-navy shadow-sm";
      const soft = featured ? "text-white/80" : dark ? "text-beige/60" : "text-navy/55";
      const body = featured ? "text-white/95" : dark ? "text-beige/85" : "text-navy/80";
      const check = featured ? "text-white" : "text-flash";
      const cta = featured
        ? "bg-white text-navy hover:-translate-y-0.5"
        : "bg-gradient-to-r from-flash to-[#FF2D6B] text-white shadow-[0_10px_28px_-6px_rgba(255,45,107,0.55)] hover:-translate-y-0.5";
      const consult = mode === "presencial"; // presencial: sin precio, se consulta
      const equiv = !consult && plan.monthlyEquivalent
        ? `<span class="text-sm ${soft}">Equivale a ${formatCurrency(plan.monthlyEquivalent, d.currency)} por mes</span>`
        : "";
      const priceBlock = consult
        ? `<div class="flex flex-col gap-1"><span class="font-serif text-2xl font-semibold">Consultá el valor</span><span class="text-sm ${soft}">${escapeHtml(plan.period)} · el precio lo coordinás con Daiana</span></div>`
        : `<div class="flex flex-col gap-1">
          <span class="font-serif text-4xl font-semibold">${formatCurrency(plan.price, d.currency)}</span>
          <span class="text-sm ${soft}">${escapeHtml(plan.period)}</span>
          ${equiv}
        </div>`;
      const ctaHref = consult
        ? buildWhatsappLink(DB.trainerInfo.whatsappNumber, buildIntakeWhatsappMessage(`la Asesoría Presencial (${plan.name})`, DB.intakeForm.presencial))
        : `/api/create-preference?plan=${escapeAttr(plan.id)}`;
      const ctaTarget = consult ? ' target="_blank" rel="noopener"' : "";
      const ctaLabel = consult ? "Consultar precio por WhatsApp" : `Elegir ${escapeHtml(plan.name)}`;
      // En presencial el precio se consulta, así que no mostramos "precio congelado".
      const items = (plan.includes || [])
        .filter((t) => !(consult && /congel/i.test(t)))
        .map(
          (t) =>
            `<li class="flex gap-2.5 items-start"><span class="${check} font-bold leading-snug">✓</span><span>${escapeHtml(t)}</span></li>`
        )
        .join("");
      return `
      <article data-reveal style="transition-delay:${i * 100}ms" class="relative rounded-3xl p-7 flex flex-col gap-5 ${card}">
        ${featured ? '<span class="absolute -top-3 left-7 bg-navy text-beige text-[11px] font-semibold tracking-[2px] uppercase px-3.5 py-1 rounded-full border border-beige/30">Recomendado</span>' : ""}
        <div class="flex flex-col gap-1.5">
          <span class="text-xs font-semibold tracking-[2px] uppercase ${soft}">${escapeHtml(plan.tag)}</span>
          <h3 class="font-serif text-2xl font-semibold">${escapeHtml(plan.name)}</h3>
        </div>
        ${priceBlock}
        <p class="text-[14px] leading-relaxed ${soft}">${escapeHtml(plan.intro)}</p>
        <div class="flex flex-col gap-3 text-[14px] leading-snug ${body}">
          <span class="font-semibold">${escapeHtml(plan.includesLead)}</span>
          <ul class="flex flex-col gap-2.5">${items}</ul>
        </div>
        <a href="${ctaHref}"${ctaTarget} data-plan-id="${escapeAttr(plan.id)}"
           class="plan-pay-btn mt-auto inline-flex justify-center items-center text-center rounded-full px-6 py-4 text-[15px] font-semibold transition-all duration-200 ${cta}">
          ${ctaLabel}
        </a>
      </article>`;
    })
    .join("");

  // Al tocar "Elegir", recordamos qué plan eligió la persona (así el botón
  // "Ya pagué" lo menciona en el WhatsApp).
  el.querySelectorAll(".plan-pay-btn").forEach((a) => {
    a.addEventListener("click", () => {
      try { sessionStorage.setItem("chosenPlan:" + mode, a.dataset.planId); } catch (e) {}
    });
  });
}

// Botón "Ya pagué, continuar por WhatsApp": arma el mensaje con el plan
// elegido (si lo recordamos) y el formulario de la modalidad.
function setupPaidButton(buttonId, mode) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  const refresh = () => {
    let id = null;
    try { id = sessionStorage.getItem("chosenPlan:" + mode); } catch (e) {}
    const plan = ((DB.onlineCoaching && DB.onlineCoaching.plans) || []).find((p) => p.id === id);
    btn.href = buildWhatsappLink(DB.trainerInfo.whatsappNumber, buildPaidWhatsappMessage(mode, plan && plan.name));
  };
  refresh();
  btn.addEventListener("click", refresh);
}

// ------------------------------------------------------------------
// Asesoría presencial: ubicación (con link al mapa), planes, qué
// incluye y botón de WhatsApp con el formulario prearmado.
// ------------------------------------------------------------------
function renderInPersonCoaching() {
  const d = DB.inPersonCoaching;
  if (!d) return;

  setText("presencial-description", d.description);
  setText("presencial-closing", d.closingNote);
  setText("presencial-cta-note", d.ctaNote);
  setText("presencial-location", d.location);
  setText("presencial-schedule", d.schedule);

  renderPlanCards("presencial-plans", "presencial", "light");
  const waBtn = document.getElementById("whatsapp-presencial-btn");
  if (waBtn) {
    waBtn.href = buildWhatsappLink(
      DB.trainerInfo.whatsappNumber,
      buildIntakeWhatsappMessage("la Asesoría Presencial", DB.intakeForm.presencial)
    );
  }

  const mapCard = document.getElementById("presencial-map-card");
  if (mapCard && d.location) {
    mapCard.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location)}`;
  }
}

// ------------------------------------------------------------------
// Medios de pago (dentro de la sección de Asesoría online).
// ------------------------------------------------------------------
function renderPaymentMethods() {
  const container = document.getElementById("payment-methods");
  if (!container || !DB.paymentMethods || !Array.isArray(DB.paymentMethods.options)) return;

  container.innerHTML = DB.paymentMethods.options
    .map((opt) => {
      const rows = [];
      if (opt.alias) rows.push(`Alias: ${escapeHtml(opt.alias)}`);
      if (opt.cvu) rows.push(`CVU: ${escapeHtml(opt.cvu)}`);
      if (opt.iban) rows.push(`IBAN: ${escapeHtml(opt.iban)}`);
      if (opt.note) rows.push(escapeHtml(opt.note));

      const logo = opt.logo
        ? `<span class="inline-flex items-center h-11 rounded-lg overflow-hidden shrink-0">
             <img src="${escapeAttr(opt.logo)}" alt="${escapeAttr(opt.method)}" class="h-full w-auto object-contain" />
           </span>`
        : "";

      return `
        <div class="flex items-center gap-3 pb-4 border-b border-beige/10 last:border-0 last:pb-0 last:mb-0">
          ${logo}
          <div class="flex flex-col gap-1">
            <span class="font-semibold text-beige">${escapeHtml(opt.currency)} · ${escapeHtml(opt.method)}</span>
            ${rows.map((r) => `<span class="text-beige/70">${r}</span>`).join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

// ------------------------------------------------------------------
// Menú mobile (hamburguesa)
// ------------------------------------------------------------------
function setupMobileMenu() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("flex");

    if (isOpen) {
      menu.classList.remove("flex");
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    } else {
      menu.classList.remove("hidden");
      menu.classList.add("flex");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  // Cierra el menú al tocar un link.
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("flex");
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

// ------------------------------------------------------------------
// Navbar reactiva: se compacta y toma fondo/blur al scrollear.
// ------------------------------------------------------------------
function setupStickyNavbar() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// ------------------------------------------------------------------
// Aparición de secciones/tarjetas al hacer scroll.
// ------------------------------------------------------------------
function setupScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

function setPhoto(imgId, placeholderId, url) {
  const img = document.getElementById(imgId);
  const placeholder = document.getElementById(placeholderId);
  if (!img || !placeholder) return;

  if (url) {
    img.src = url;
    img.classList.remove("hidden");
    placeholder.classList.add("hidden");
  }
}

function buildDefaultWhatsappMessage(name) {
  return `Hola ${name}! Quería consultarte por tus asesorías 🙌`;
}

// Arma el mensaje de WhatsApp con las preguntas del formulario (DB.intakeForm)
// ya listadas, para que la persona las responda directo en el chat.
// Arma las líneas del formulario. Los campos normales quedan con ": "
// al final (para que la persona escriba la respuesta ahí mismo); los de
// type "attachment" (como el comprobante de pago) no, porque no son una
// pregunta para responder sino una acción para hacer en el chat.
function buildFieldLines(fields) {
  return (fields || [])
    .map((f) => {
      if (f.type === "section") return `\n*${f.label}*`; // título de bloque, con una línea en blanco antes
      if (f.type === "note") return `${f.label}`; // aviso, sin espacio para responder
      if (f.type === "attachment") return `- ${f.label}`; // algo para adjuntar en el chat
      return `- ${f.label}: `;
    })
    .join("\n");
}

function buildIntakeWhatsappMessage(contextLabel, fields) {
  return `Hola ${DB.trainerInfo.name}! Quiero empezar ${contextLabel} 💪 Te paso mis datos:\n${buildFieldLines(fields)}`;
}

// Mensaje para quienes ya pagaron la Asesoría Online por Mercado Pago:
// le recuerda a la persona adjuntar el comprobante ahí mismo, como
// archivo de WhatsApp (eso no se puede pre-cargar desde un link, lo
// adjunta la persona manualmente, pero el formulario se lo recuerda al
// final), y de paso ya le deja armadas las preguntas del formulario.
function buildPaidWhatsappMessage(mode, planName) {
  const isPresencial = mode === "presencial";
  const fields = (DB.intakeForm && DB.intakeForm[isPresencial ? "presencial" : "online"]) || [];
  const label = isPresencial ? "Asesoría Presencial" : "Asesoría Online";
  const planText = planName ? ` (${planName})` : "";
  return `Hola ${DB.trainerInfo.name}! Ya realicé el pago de la ${label}${planText} 💪\n\nTe paso mis datos para armar mi plan:\n${buildFieldLines(fields)}`;
}

// (se mantiene el nombre anterior por compatibilidad)
function buildPaidOnlineWhatsappMessage(planName) {
  return buildPaidWhatsappMessage("online", planName);
}

// Lista de "qué incluye" reutilizada por Asesoría online y presencial.
function renderIncludesList(containerId, items) {
  const list = document.getElementById(containerId);
  if (!list || !Array.isArray(items)) return;
  list.innerHTML = items.map((item) => `<li class="flex items-start gap-2 leading-snug">${escapeHtml(item)}</li>`).join("");
}

function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency || "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

function buildWhatsappLink(number, message) {
  const cleanNumber = (number || "").replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str ?? "").replace(/"/g, "&quot;");
}
