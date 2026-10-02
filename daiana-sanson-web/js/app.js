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
  renderRunningBanner();
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
  setText("about-bio", info.bio);

  setPhoto("about-photo", "about-photo-placeholder", info.aboutPhotoUrl);

  const waLink = buildWhatsappLink(info.whatsappNumber, buildDefaultWhatsappMessage(info.name));
  ["whatsapp-nav-btn", "whatsapp-hero-btn", "whatsapp-mobile-btn", "whatsapp-footer-btn", "running-banner"].forEach((id) => {
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
  renderIncludesList("online-includes", d.includes);

  const priceEl = document.getElementById("online-price");
  if (priceEl && typeof d.price === "number") {
    priceEl.textContent = formatCurrency(d.price, d.currency);
  }
  setText("online-price-label", d.currency && d.period ? `${d.currency} · ${d.period}` : "");

  // Este botón ahora es el paso 2 (después de pagar), así que el mensaje
  // ya le recuerda a la persona adjuntar el comprobante ahí mismo en el chat.
  const waLink = buildWhatsappLink(DB.trainerInfo.whatsappNumber, buildPaidOnlineWhatsappMessage());
  const btn = document.getElementById("whatsapp-online-btn");
  if (btn) btn.href = waLink;

  // El botón "Pagar con Mercado Pago" ya apunta, directo en el HTML, a
  // /api/create-preference (nuestra función del servidor) — no necesita
  // nada de acá.
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
  renderIncludesList("presencial-includes", d.includes);

  const plansEl = document.getElementById("presencial-plans");
  if (plansEl && Array.isArray(d.plans)) {
    plansEl.innerHTML = d.plans
      .map(
        (p) =>
          `<div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-flash shrink-0"></span>${escapeHtml(p)}</div>`
      )
      .join("");
  }

  const mapCard = document.getElementById("presencial-map-card");
  if (mapCard && d.location) {
    mapCard.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location)}`;
  }

  const waLink = buildWhatsappLink(
    DB.trainerInfo.whatsappNumber,
    buildIntakeWhatsappMessage("la Asesoría Presencial")
  );
  const btn = document.getElementById("whatsapp-presencial-btn");
  if (btn) btn.href = waLink;
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
// Banner en movimiento (CTA) entre Servicios y Sobre mí.
// ------------------------------------------------------------------
function renderRunningBanner() {
  const track = document.getElementById("running-banner-track");
  if (!track || !Array.isArray(DB.runningBanner?.messages) || DB.runningBanner.messages.length === 0) return;

  const separator = '<span class="text-flash" aria-hidden="true">&#10022;</span>';
  const unit = DB.runningBanner.messages.map((m) => `<span>${escapeHtml(m)}</span>`).join(separator);
  const block = `${unit}${separator}`;

  const half = block.repeat(6);
  track.innerHTML = half + half;
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
function buildIntakeWhatsappMessage(contextLabel) {
  const fields = (DB.intakeForm && DB.intakeForm.fields) || [];
  const lines = fields.map((f) => `- ${f.label}: `);
  return `Hola ${DB.trainerInfo.name}! Quiero empezar ${contextLabel} 💪 Te paso mis datos:\n${lines.join("\n")}`;
}

// Mensaje para quienes ya pagaron la Asesoría Online por Mercado Pago:
// le recuerda a la persona adjuntar el comprobante ahí mismo, como
// archivo de WhatsApp (eso no se puede pre-cargar desde un link, lo
// adjunta la persona manualmente, pero el mensaje se lo recuerda), y de
// paso ya le deja armadas las preguntas del formulario.
function buildPaidOnlineWhatsappMessage() {
  const fields = (DB.intakeForm && DB.intakeForm.fields) || [];
  const lines = fields.map((f) => `- ${f.label}: `);
  return `Hola ${DB.trainerInfo.name}! Ya realicé el pago de la Asesoría Online 💪 Te adjunto acá el comprobante 📎\n\nTe paso también mis datos para armar mi plan:\n${lines.join("\n")}`;
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
