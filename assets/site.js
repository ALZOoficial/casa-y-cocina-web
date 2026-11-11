(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const RM = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------- Data ---------------- */
const SECTIONS = [
  ['sartenes', 'Sartenes, woks y planchas', 'Frying pans, woks & griddles', 271],
  ['ollas', 'Ollas y cacerolas', 'Pots & casseroles', 392],
  ['cafe', 'Café y té', 'Coffee & tea', 326],
  ['electro', 'Pequeño electrodoméstico', 'Small appliances', 409],
  ['cuchillos', 'Cuchillos', 'Knives', 246],
  ['utensilios', 'Utensilios de cocina', 'Kitchen tools', 2441],
  ['reposteria', 'Repostería y horno', 'Baking & oven', 465],
  ['vajilla', 'Vajilla y mesa', 'Tableware', 789],
  ['cuberteria', 'Cubertería', 'Cutlery', 208],
  ['cristaleria', 'Cristalería y vino', 'Glassware & wine', 195],
  ['termos', 'Termos y botellas', 'Flasks & bottles', 170],
  ['hogar', 'Planchado y hogar', 'Ironing & home', 375],
  ['cuidado', 'Cuidado personal', 'Personal care', 691],
  ['infantil', 'Infantil', 'Kids', 165]
];
const OTHER = ['Otros', 'Other'];
// minutes from midnight; index 0 = Sunday
const HOURS = [[], [[570, 810], [1050, 1230]], [[570, 810], [1050, 1230]], [[570, 810], [1050, 1230]], [[570, 810], [1050, 1230]], [[570, 810], [1050, 1230]], [[630, 840]]];

/* ---------------- Copy ---------------- */
const T = {
  es: {
    skip: 'Saltar al contenido', navLabel: 'Principal', langLabel: 'Idioma',
    'nav.shop': 'Tienda', 'nav.sections': 'Secciones', 'nav.catalogue': 'Catálogo', 'nav.press': 'Prensa', 'nav.visit': 'Visítanos',
    'cta.directions': 'Cómo llegar', 'cta.catalogue': 'Ver catálogo',
    'hero.b1': 'Menaje, cocina y hogar en Ceuta.', 'hero.b1s': 'Desde hace más de 30 años.',
    'hero.b2': 'Balda a balda.', 'hero.b2s': 'Catorce secciones y miles de artículos, todo a mano.',
    'hero.b3': 'Lo que buscas para tu cocina, probablemente ya lo tenemos.',
    'hero.b4': 'La luz está encendida. Pasa.', 'hero.b4s': 'De lunes a sábado en el centro de Ceuta. Ven a verlo en persona.',
    'hero.static': 'Menaje, cocina y hogar en Ceuta. Calle Solís, 4, desde hace más de 30 años.',
    'hero.cue': 'Desliza',
    'shop.eyebrow': 'La tienda', 'shop.title': 'Más de 30 años en el centro de Ceuta.',
    'shop.body': 'Empezamos en la calle Velarde y hoy te esperamos en la calle Solís, 4. Sartenes, ollas, cafeteras, cuchillos, vajilla, pequeño electrodoméstico y todo lo que hace falta en una casa, con precios para cada bolsillo y alguien que te atiende de verdad.',
    'shop.alt': 'Baldas iluminadas con ollas, sartenes, copas y cuencos',
    'shop.s1': 'años en Ceuta', 'shop.s2': 'secciones', 'shop.s3': 'artículos en tienda', 'shop.s4': 'marcas destacadas',
    'sec.eyebrow': 'Secciones', 'sec.title': 'Catorce secciones. Pasea por ellas.', 'sec.lede': 'Pulsa una sección para ver sus artículos y precios.',
    'sec.count': '{n} artículos con precio', prev: 'Anterior', next: 'Siguiente', 'sec.hint': 'Arrastra para ver más',
    mqCat: ['Sartenes', 'Cafeteras', 'Ollas', 'Termos', 'Cuchillos', 'Vajilla', 'Moldes', 'Tazas', 'Copas', 'Planchas'],
    mqPress: ['El Faro de Ceuta', 'Reportaje', 'RTVCE', 'FaroTV', 'Radio Televisión Ceuta', 'Ceuta'],
    mqReviews: ['Gracias', 'Buen trato', 'Consejo', 'Calidad', 'Confianza', 'Cercanía'],
    mqVisit: ['C/ Solís, 4', '51001 Ceuta', 'Centro', 'Lunes a sábado', 'Te esperamos'],
    'cat.eyebrow': 'Catálogo', 'cat.title': 'Busca un artículo.',
    'cat.lede': 'Elige una marca, después la categoría, y mira el precio antes de venir.',
    'cat.s1': 'artículos con precio', 'cat.s2': 'secciones',
    tw: ['Sartén', 'Cafetera', 'Olla a presión', 'Termo', 'Cocotte', 'Molde'],
    'cat.note': 'Los precios son los de la tienda y pueden cambiar. Llama o escribe por WhatsApp para confirmar que lo tenemos.',
    'cat.label': 'Buscar', 'cat.ph': 'Sartén, cafetera, termo…', 'cat.qhelp': 'Busca por el principio del nombre: «ca» encuentra cafeteras, cazos y cacerolas.',
    'cat.sort': 'Ordenar', 'cat.sortRec': 'Recomendados', 'cat.sortAz': 'Nombre, de la A a la Z', 'cat.sortPa': 'Precio, de menor a mayor', 'cat.sortPd': 'Precio, de mayor a menor',
    'cat.steps': 'Pasos', 'cat.step1': 'Marca', 'cat.step2': 'Categoría', 'cat.step3': 'Artículo y precio',
    'cat.pickBrand': 'Elige una marca', 'cat.pickBrandSub': '{n} marcas en tienda. O escribe arriba para buscar en todo el catálogo.',
    'cat.pickSec': 'Elige una categoría', 'cat.allSecs': 'Todas', 'cat.allBrands': 'Todas las marcas', 'cat.otherBrands': 'Otras marcas',
    'cat.change': 'Cambiar marca', 'cat.items': '{n} artículos', 'cat.items1': '1 artículo',
    'cat.count': '{n} artículos', 'cat.count1': '1 artículo', 'cat.startWith': 'que empiezan por «{q}»',
    'cat.none': 'Ningún artículo empieza por «{q}». Prueba con el principio de otra palabra o pregúntanos.', 'cat.noneHere': 'No hay artículos aquí.',
    'cat.loading': 'Cargando catálogo…', 'cat.error': 'No se pudo cargar el catálogo. Inténtalo de nuevo.',
    'cat.more': 'Ver más artículos', 'cat.moreN': 'Ver {n} artículos más', 'cat.from': 'desde',
    'cat.zoom': 'Ver la foto de {p} en grande', 'cat.approx': 'Orientativa', 'cat.approxLong': 'Imagen orientativa: el modelo o el color de la tienda pueden ser distintos.',
    'cat.noPhoto': 'Aún no tenemos foto de este artículo. Pregúntanos y te la enviamos.',
    'cat.askWa': 'Pregúntanos por WhatsApp', 'cat.waMsg': 'Hola, ¿tenéis {p}?',
    'store.altFacade': 'Fachada de Casa & Cocina en la calle Solís, 4',
    'walk.p1': 'Empezamos en la calle Velarde y hoy te esperamos en la calle Solís, 4.',
    'walk.p2': 'Pasillos llenos, todo a mano y alguien que te atiende de verdad.',
    'walk.p3': 'Sartenes, ollas, cafeteras, cuchillos, vajilla y todo lo que hace falta en una casa.',
    'walk.p4': 'Marcas que conoces, con precios para cada bolsillo.',
    'walk.p5': 'Lo mejor es verlo en persona.',
    'tour.c1': 'La fachada, en la calle Solís, 4.', 'tour.c2': 'Pasa: todo está a la vista.', 'tour.c3': 'Del pequeño electrodoméstico a la cocotte.',
    'tour.c4': 'Le Creuset, en todos sus colores.', 'tour.c5': 'Cafeteras, termos y mucho más, balda a balda.',
    'tour.alt1': 'Pasillo de la tienda hacia el fondo', 'tour.alt2': 'Mostrador con ollas a presión y baldas de Le Creuset', 'tour.alt3': 'Pared de cocottes y vajilla Le Creuset de colores',
    'pr.eyebrow': 'Prensa', 'pr.title': 'Nos han visitado.', 'pr.lede': 'El Faro de Ceuta y Radio Televisión Ceuta vinieron a conocernos.',
    'pr.kick': 'Reportaje', 'pr.q2': '«Una tienda especializada en dar a tu hogar un toque especial.»',
    'pr.faroKick': 'También en prensa', 'pr.faroPre': 'También nos ha visitado', 'pr.faroPost': '.',
    'pr.faroSub': 'Pulsa el faro para ver su reportaje en YouTube.', 'pr.faroCta': 'Ver el reportaje',
    'pr.faroAria': 'Ver el reportaje de El Faro de Ceuta en YouTube (se abre en una pestaña nueva)',
    'lb.label': 'Vídeo', 'lb.close': 'Cerrar', 'lb.open': 'Ver en {s}',
    'wa.label': 'Escríbenos por WhatsApp', 'wa.tip': 'Escríbenos por WhatsApp', 'wa.msg': 'Hola, os escribo desde la web.',
    'pr.yt': 'Al pulsar se carga el vídeo desde YouTube.', 'pr.fb': 'Al pulsar se carga el vídeo desde Facebook.', 'pr.play': 'Reproducir vídeo',
    'rv.eyebrow': 'Opiniones', 'rv.title': '¿Ya nos conoces? Cuéntalo.',
    'rv.lede': 'Tu opinión en Google ayuda a que más gente de Ceuta nos encuentre. Son dos minutos.', 'rv.btn': 'Dejar una opinión en Google',
    'vi.eyebrow': 'Visítanos', 'vi.title': 'Ven a vernos a la calle Solís.',
    'vi.hold': 'Mantén pulsado para encender el letrero', 'vi.done': 'Letrero encendido',
    'vi.open': 'ABIERTO', 'vi.closed': 'CERRADO',
    'vi.isOpen': '<b>Abierto ahora.</b> Cerramos a las {t}.', 'vi.isClosed': '<b>Cerrado ahora.</b> Abrimos {d} a las {t}.',
    'vi.today': 'hoy', 'vi.tomorrow': 'mañana', 'vi.on': 'el {d}',
    'vi.holiday': '¿Es festivo? Llámanos antes de venir.', 'vi.call': 'Llamar', 'vi.map': 'Abrir mapa interactivo',
    'vi.mapAria': 'Abrir el mapa interactivo de OpenStreetMap', 'vi.photoCap': 'Busca el letrero negro con letras blancas.',
    'vi.photoAlt': 'Letrero negro con letras blancas de Casa & Cocina sobre la entrada',
    'vi.closedDay': 'Cerrado', 'vi.and': 'y',
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    'ft.tag': 'Menaje, cocina y hogar en el centro de Ceuta desde hace más de 30 años.', 'ft.visit': 'Visítanos', 'ft.contact': 'Contacto',
    'ft.h1': 'Lunes a viernes 9:30 a 13:30 y 17:30 a 20:30', 'ft.h2': 'Sábado 10:30 a 14:00'
  },
  en: {
    skip: 'Skip to content', navLabel: 'Main', langLabel: 'Language',
    'nav.shop': 'The shop', 'nav.sections': 'Sections', 'nav.catalogue': 'Catalogue', 'nav.press': 'Press', 'nav.visit': 'Visit us',
    'cta.directions': 'Get directions', 'cta.catalogue': 'Browse the catalogue',
    'hero.b1': 'Cookware, kitchen and home in Ceuta.', 'hero.b1s': 'For more than 30 years.',
    'hero.b2': 'Shelf by shelf.', 'hero.b2s': 'Fourteen sections and thousands of items, all within reach.',
    'hero.b3': 'Whatever your kitchen needs, we probably have it.',
    'hero.b4': 'The lights are on. Come in.', 'hero.b4s': 'Monday to Saturday in the centre of Ceuta. Come and see it in person.',
    'hero.static': 'Cookware, kitchen and home in Ceuta. Calle Solís, 4, for more than 30 years.',
    'hero.cue': 'Scroll',
    'shop.eyebrow': 'The shop', 'shop.title': 'More than 30 years in the centre of Ceuta.',
    'shop.body': 'We started on Calle Velarde and today you will find us at Calle Solís, 4. Frying pans, pots, coffee makers, knives, tableware, small appliances and everything a home needs, with prices for every budget and real people to help you.',
    'shop.alt': 'Lit shelves with pots, pans, glasses and bowls',
    'shop.s1': 'years in Ceuta', 'shop.s2': 'sections', 'shop.s3': 'items in store', 'shop.s4': 'featured brands',
    'sec.eyebrow': 'Sections', 'sec.title': 'Fourteen sections. Take a walk.', 'sec.lede': 'Tap a section to see its items and prices.',
    'sec.count': '{n} items with prices', prev: 'Previous', next: 'Next', 'sec.hint': 'Drag to see more',
    mqCat: ['Frying pans', 'Coffee makers', 'Pots', 'Flasks', 'Knives', 'Tableware', 'Moulds', 'Mugs', 'Glasses', 'Irons'],
    mqPress: ['El Faro de Ceuta', 'Report', 'RTVCE', 'FaroTV', 'Radio Televisión Ceuta', 'Ceuta'],
    mqReviews: ['Thank you', 'Kind service', 'Advice', 'Quality', 'Trust', 'Neighbours'],
    mqVisit: ['C/ Solís, 4', '51001 Ceuta', 'Town centre', 'Monday to Saturday', 'See you soon'],
    'cat.eyebrow': 'Catalogue', 'cat.title': 'Find an item.',
    'cat.lede': 'Pick a brand, then a category, and check the price before you come in.',
    'cat.s1': 'items with prices', 'cat.s2': 'sections',
    tw: ['Sartén', 'Cafetera', 'Olla a presión', 'Termo', 'Cocotte', 'Molde'],
    'cat.note': 'Prices are in-store prices and may change. Call or message us on WhatsApp to check we have it.',
    'cat.label': 'Search', 'cat.ph': 'Sartén, cafetera, termo…', 'cat.qhelp': 'Type the start of the name (item names are in Spanish): “ca” finds cafeteras, cazos and cacerolas.',
    'cat.sort': 'Sort by', 'cat.sortRec': 'Recommended', 'cat.sortAz': 'Name, A to Z', 'cat.sortPa': 'Price, low to high', 'cat.sortPd': 'Price, high to low',
    'cat.steps': 'Steps', 'cat.step1': 'Brand', 'cat.step2': 'Category', 'cat.step3': 'Item and price',
    'cat.pickBrand': 'Pick a brand', 'cat.pickBrandSub': '{n} brands in store. Or type above to search the whole catalogue.',
    'cat.pickSec': 'Pick a category', 'cat.allSecs': 'All', 'cat.allBrands': 'All brands', 'cat.otherBrands': 'Other brands',
    'cat.change': 'Change brand', 'cat.items': '{n} items', 'cat.items1': '1 item',
    'cat.count': '{n} items', 'cat.count1': '1 item', 'cat.startWith': 'starting with “{q}”',
    'cat.none': 'No item starts with “{q}”. Try the start of another word, or ask us.', 'cat.noneHere': 'There are no items here.',
    'cat.loading': 'Loading catalogue…', 'cat.error': 'The catalogue could not load. Please try again.',
    'cat.more': 'Show more items', 'cat.moreN': 'Show {n} more items', 'cat.from': 'from',
    'cat.zoom': 'See a larger photo of {p}', 'cat.approx': 'Indicative', 'cat.approxLong': 'Indicative image: the model or colour in store may differ.',
    'cat.noPhoto': 'We don’t have a photo of this item yet. Ask us and we’ll send you one.',
    'cat.askWa': 'Ask us on WhatsApp', 'cat.waMsg': 'Hello, do you have {p}?',
    'store.altFacade': 'Casa & Cocina shop front on Calle Solís, 4',
    'walk.p1': 'We started on Calle Velarde and today you will find us at Calle Solís, 4.',
    'walk.p2': 'Full aisles, everything within reach and real people to help you.',
    'walk.p3': 'Frying pans, pots, coffee makers, knives, tableware and everything a home needs.',
    'walk.p4': 'Brands you know, with prices for every budget.',
    'walk.p5': 'It is best seen in person.',
    'tour.c1': 'The shop front, Calle Solís, 4.', 'tour.c2': 'Step in: everything is on display.', 'tour.c3': 'From small appliances to cast iron.',
    'tour.c4': 'Le Creuset, in every colour.', 'tour.c5': 'Coffee makers, flasks and much more, shelf by shelf.',
    'tour.alt1': 'The shop aisle leading to the back', 'tour.alt2': 'Counter with pressure cookers and Le Creuset shelves', 'tour.alt3': 'A wall of colourful Le Creuset casseroles and tableware',
    'pr.eyebrow': 'Press', 'pr.title': 'They came to visit.', 'pr.lede': 'El Faro de Ceuta and Radio Televisión Ceuta came to see us.',
    'pr.kick': 'TV report', 'pr.q2': '“A shop that specialises in giving your home a special touch.”',
    'pr.faroKick': 'Also in the press', 'pr.faroPre': 'We were also visited by', 'pr.faroPost': '.',
    'pr.faroSub': 'Tap the lighthouse to watch their report on YouTube.', 'pr.faroCta': 'Watch the report',
    'pr.faroAria': 'Watch El Faro de Ceuta’s report on YouTube (opens in a new tab)',
    'lb.label': 'Video', 'lb.close': 'Close', 'lb.open': 'Watch on {s}',
    'wa.label': 'Message us on WhatsApp', 'wa.tip': 'Message us on WhatsApp', 'wa.msg': 'Hello, I’m writing to you from your website.',
    'pr.yt': 'Pressing play loads the video from YouTube.', 'pr.fb': 'Pressing play loads the video from Facebook.', 'pr.play': 'Play video',
    'rv.eyebrow': 'Reviews', 'rv.title': 'Been in already? Tell people.',
    'rv.lede': 'Your Google review helps more people in Ceuta find us. It takes two minutes.', 'rv.btn': 'Leave a Google review',
    'vi.eyebrow': 'Visit us', 'vi.title': 'Come and see us on Calle Solís.',
    'vi.hold': 'Press and hold to light the sign', 'vi.done': 'The sign is on',
    'vi.open': 'OPEN', 'vi.closed': 'CLOSED',
    'vi.isOpen': '<b>Open now.</b> We close at {t}.', 'vi.isClosed': '<b>Closed now.</b> We open {d} at {t}.',
    'vi.today': 'today', 'vi.tomorrow': 'tomorrow', 'vi.on': 'on {d}',
    'vi.holiday': 'Public holiday? Call us before you come.', 'vi.call': 'Call', 'vi.map': 'Open interactive map',
    'vi.mapAria': 'Open the interactive OpenStreetMap map', 'vi.photoCap': 'Look for the black sign with white letters.',
    'vi.photoAlt': 'Black Casa & Cocina sign with white letters above the entrance',
    'vi.closedDay': 'Closed', 'vi.and': 'and',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'ft.tag': 'Cookware, kitchen and home in the centre of Ceuta for more than 30 years.', 'ft.visit': 'Visit us', 'ft.contact': 'Contact',
    'ft.h1': 'Monday to Friday 9:30 to 13:30 and 17:30 to 20:30', 'ft.h2': 'Saturday 10:30 to 14:00'
  }
};
let lang = 'es';
try { const s = localStorage.getItem('cc-lang'); if (s === 'es' || s === 'en') lang = s; else if (/^en/i.test(navigator.language || '')) lang = 'en'; } catch (e) {}
const t = (k, vars) => { let s = (T[lang][k] ?? T.es[k] ?? k); if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]); return s; };
// 'always' so Spanish shows 7.202 too (es-ES skips the separator on four-digit numbers by default)
const fmtNum = n => n.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB', { useGrouping: 'always' });
const fmtEur = n => new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/* ---------------- Text splitting for hero bands ---------------- */
function splitInto(el, text, seed) {
  const r = rng(seed);
  const words = text.split(' ');
  const n = words.length;
  const vis = words.map((w, i) => `<span class="w" style="--th:${(i / Math.max(1, n) * 0.5 + r() * 0.06).toFixed(3)}">${esc(w)}</span>`).join(' ');
  if (el.closest('.b1')) {
    el.innerHTML = `<span class="sr-only">${esc(text)}</span><span class="stack" aria-hidden="true"><span class="soft">${esc(text)}</span><span class="sharp">${esc(text)}</span></span>`;
  } else {
    el.innerHTML = `<span class="sr-only">${esc(text)}</span><span aria-hidden="true">${vis}</span>`;
  }
}
function buildSign() {
  $$('.sign-inner').forEach(inner => {
    const txt = 'Casa & Cocina'.toUpperCase();
    const r = rng(7), mid = (txt.length - 1) / 2;
    // --c: place from the centre (-1..1); --w: when the letter starts folding away at the end, outer letters first
    inner.innerHTML = [...txt].map((ch, i) => {
      const c = (i - mid) / mid;
      return ch === ' ' ? ' ' : `<span class="L${ch === '&' ? ' amp' : ''}" style="--d:${(0.05 + i * 0.07 + r() * 0.25).toFixed(2)}s;--c:${c.toFixed(3)};--w:${((1 - Math.abs(c)) * 0.5).toFixed(3)}">${ch === '&' ? '&amp;' : ch}</span>`;
    }).join('');
  });
}

/* ---------------- Language ---------------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (el.classList.contains('split')) splitInto(el, v, el.dataset.i18n.length * 31);
    else el.textContent = v;
  });
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  $$('[data-i18n-alt]').forEach(el => el.alt = t(el.dataset.i18nAlt));
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  $$('.stat dt').forEach(dt => { if (dt.dataset.done) dt.textContent = (dt.dataset.prefix || '') + fmtNum(+dt.dataset.count); });
  renderSections(); renderSort(); renderResults(); renderHours(); tourText(); renderGapRibbons();
  $('#waFloat').href = 'https://wa.me/34956512987?text=' + encodeURIComponent(t('wa.msg'));
  bands.forEach(b => { b.op = -1; b.k = -1; });
  signGeo = null;
  if (scrubOn) updateCaptions(shown);
}
$$('.lang button').forEach(b => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  try { localStorage.setItem('cc-lang', lang); } catch (e) {}
  applyLang();
}));

/* ---------------- Environment motes ---------------- */
(() => {
  const env = $('.env'); const r = rng(42); let html = '';
  for (let i = 0; i < 16; i++) html += `<span class="mote" style="left:${(r() * 100).toFixed(1)}%;top:${(40 + r() * 70).toFixed(1)}%;animation-duration:${(60 + r() * 40).toFixed(0)}s;animation-delay:-${(r() * 60).toFixed(1)}s;opacity:${(0.3 + r() * 0.5).toFixed(2)}"></span>`;
  env.innerHTML = html;
})();
document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

/* ---------------- Hero scrub ---------------- */
const hero = $('.hero');
const stage = $('.stage');
const video = $('.stage video');
const posterLayer = $('.poster');
const ring = $('.ring');
const cue = $('.cue');
const sign = $('.stage .sign');
const nav = $('.nav');
const bands = $$('.stage .band').map(el => ({ el, a: +el.dataset.a, b: +el.dataset.b, ramp: el.dataset.ramp ? +el.dataset.ramp : 0, op: -1, k: -1 }));
// desktop gets the full frame; portrait screens get a lighter centre crop that keeps the shelves
const SOURCES = {
  d: { url: 'assets/hero-scrub.mp4', bytes: 3869983, poster: 'assets/hero-poster.jpg' },
  m: { url: 'assets/hero-scrub-m.mp4', bytes: 941009, poster: 'assets/hero-poster-m.jpg' }
};
const PORTRAIT = matchMedia('(max-width: 720px), (orientation: portrait) and (max-width: 1024px)');
let target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true, scrubOn = false;
let loadK = 0, loadStart = 0;
let cueOn = true, logoOn = null, solidOn = null, endOn = null;
let signGeo = null;

function heroProgress() {
  const r = hero.getBoundingClientRect();
  const range = hero.offsetHeight - innerHeight;
  return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
}

let seekBusy = false, pendingTime = null;
function requestSeek(tm) {
  if (!video.duration) return;
  tm = Math.min(tm, video.duration - 0.05);
  if (seekBusy) { pendingTime = tm; return; }
  if (Math.abs(video.currentTime - tm) < 0.001) return;
  seekBusy = true;
  video.currentTime = tm;
}
video.addEventListener('seeked', () => {
  seekBusy = false;
  if (pendingTime !== null) { const tm = pendingTime; pendingTime = null; requestSeek(tm); }
});
video.addEventListener('error', () => { seekBusy = false; pendingTime = null; stage.classList.remove('video-ready'); video.style.display = 'none'; });

function updateCaptions(p) {
  bands.forEach((b, i) => {
    const f = Math.min(0.02, (b.b - b.a) / 3);
    const inO = i === 0 ? 1 : smoothstep(p, b.a, b.a + f);
    const outO = b.b >= 1 ? 1 : 1 - smoothstep(p, b.b - f, b.b);
    let op = inO * outO;
    let k = clamp((p - b.a) / (b.ramp || Math.min(0.025, (b.b - b.a) * 0.35)), 0, 1);
    if (i === 0) { k = Math.max(k, loadK); op *= Math.max(0.0001, Math.min(1, loadK * 1.6)); }
    op = Math.round(op * 1000) / 1000;
    if (op !== b.op) { b.op = op; b.el.style.opacity = op; b.el.classList.toggle('live', op > 0.5); }
    if (Math.abs(k - b.k) > 0.008 || (k === 1 && b.k !== 1) || (k === 0 && b.k !== 0)) { b.k = k; b.el.style.setProperty('--k', k.toFixed(3)); }
  });
  // scroll cue
  const c = p < 0.03;
  if (c !== cueOn) { cueOn = c; cue.style.opacity = c ? '' : '0'; }
  // the ending: the sign folds into a line of light, the line parts to open the last caption on the
  // sign's own spot, and only after that does the nav logo come on
  if (!signGeo) measureSign();
  stageVar('--off', smoothstep(p, 0.79, 0.87));
  stageVar('--fl', smoothstep(p, 0.835, 0.875));
  stageVar('--op', smoothstep(p, 0.875, 0.93));
  stageVar('--fo', smoothstep(p, 0.835, 0.855) * (1 - smoothstep(p, 0.925, 0.965)));
  const end = p > 0.785;
  if (end !== endOn) { endOn = end; stage.classList.toggle('ending', end); }
  setLogo(p >= 0.955);
}
const stageVars = {};
function stageVar(name, v) {
  v = Math.round(v * 1000) / 1000;
  if (stageVars[name] !== v) { stageVars[name] = v; stage.style.setProperty(name, v); }
}
// where the sign sits, and how big the line it opens into is
function measureSign() {
  const sr = stage.getBoundingClientRect(), box = sign.getBoundingClientRect();
  const h2 = $('.b4 h2', stage), words = $('[aria-hidden]', h2);
  stage.style.setProperty('--sy', (box.top + box.height / 2 - sr.top).toFixed(1) + 'px');
  stage.style.setProperty('--b4h', h2.offsetHeight + 'px');
  stage.style.setProperty('--fw', Math.round(words.offsetWidth + 80) + 'px');
  signGeo = true;
}
function setLogo(on) { if (on !== logoOn) { logoOn = on; nav.classList.toggle('show-logo', on); } }
function setSolid(on) { if (on !== solidOn) { solidOn = on; nav.classList.toggle('solid', on); } }

function tick(now) {
  const dt = Math.min(100, now - (lastTick || now));
  lastTick = now;
  const k = 0.14;
  shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
  let more = loadK < 1;
  if (loadK < 1) loadK = clamp((now - loadStart) / 1400, 0, 1);
  if (Math.abs(target - shown) < 0.0005) shown = target; else more = true;
  requestSeek(shown * (video.duration || 0));
  updateCaptions(shown);
  if (more && heroOnScreen) rafId = requestAnimationFrame(tick);
  else { rafId = null; lastTick = 0; }
}
function kick() { if (rafId === null && scrubOn) rafId = requestAnimationFrame(tick); }
function onScroll() {
  target = heroProgress();
  kick();
}

let heroKind = null, loadToken = 0;
const blobCache = {};
function initHeroOnce() {
  const kind = PORTRAIT.matches ? 'm' : 'd';
  if (kind === heroKind) return;
  heroKind = kind;
  const src = SOURCES[kind], token = ++loadToken;
  stage.classList.remove('video-ready', 'video-failed');
  seekBusy = false; pendingTime = null;
  posterLayer.style.backgroundImage = `url('${src.poster}')`;
  if (blobCache[kind]) { useBlob(blobCache[kind], token); return; }
  ring.classList.remove('done'); ring.style.setProperty('--ld', 126);
  let started = false;
  const start = () => { if (started) return; started = true; loadHeroBlob(src, kind, token).catch(() => { if (token === loadToken) failVideo(); }); };
  const img = new Image(); img.onload = start; img.onerror = start; img.src = src.poster;
  setTimeout(start, 4000);
}
function useBlob(url, token) {
  if (token !== loadToken) return;
  video.addEventListener('canplay', () => {
    if (token !== loadToken) return;
    requestSeek(heroProgress() * video.duration);
    stage.classList.add('video-ready');
  }, { once: true });
  video.src = url;
  video.load();
  // iOS only decodes frames after a play() call; prime it and pause straight away
  if (matchMedia('(pointer: coarse)').matches) {
    const pr = video.play();
    if (pr && pr.then) pr.then(() => { video.pause(); requestSeek(shown * video.duration); }).catch(() => {});
  }
}
async function loadHeroBlob(src, kind, token) {
  const ctrl = new AbortController();
  let watchdog = setTimeout(() => ctrl.abort(), 20000);
  const res = await fetch(src.url, { priority: 'low', signal: ctrl.signal });
  if (!res.ok || !res.body) throw new Error('video ' + res.status);
  const total = Number(res.headers.get('Content-Length')) || src.bytes;
  const reader = res.body.getReader();
  const chunks = []; let got = 0, lastRing = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    clearTimeout(watchdog); watchdog = setTimeout(() => ctrl.abort(), 20000);
    chunks.push(value); got += value.length;
    const frac = Math.min(1, got / total); const now = performance.now();
    if (token === loadToken && (now - lastRing > 100 || frac === 1)) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
  }
  clearTimeout(watchdog);
  blobCache[kind] = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
  if (token !== loadToken) return;
  ring.style.setProperty('--ld', 0);
  ring.classList.add('done');
  useBlob(blobCache[kind], token);
}
function failVideo() { ring.classList.add('done'); stage.classList.add('video-failed'); }

new IntersectionObserver(es => { heroOnScreen = es[0].isIntersecting; if (heroOnScreen) kick(); }).observe(hero);

// only these two get the still hero; phones and tablets now get the scrub too
const GATES = [
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];
function enableScrub() {
  if (scrubOn) { initHeroOnce(); return; }
  scrubOn = true;
  initHeroOnce();
  addEventListener('scroll', onScroll, { passive: true });
  bands.forEach(b => { b.op = -1; b.k = -1; });
  signGeo = null;
  unpinFinalStates();
  shown = target = heroProgress();
  updateCaptions(shown);
  onScroll();
}
function disableScrub() {
  if (!scrubOn) return; scrubOn = false;
  removeEventListener('scroll', onScroll);
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
}
function applyHeroMode() { if (GATES.some(q => matchMedia(q).matches)) disableScrub(); else enableScrub(); }
const MQLS = GATES.map(q => matchMedia(q)).concat(PORTRAIT);
MQLS.forEach(m => m.addEventListener('change', () => { signGeo = null; applyHeroMode(); if (scrubOn) updateCaptions(shown); }));
addEventListener('resize', () => { signGeo = null; if (scrubOn) updateCaptions(shown); }, { passive: true });

// nav state for the whole page
function navState() {
  if (scrubOn) {
    const end = hero.offsetTop + hero.offsetHeight - innerHeight;
    setSolid(scrollY > end + 40);
    if (scrollY > end) setLogo(true);
  } else {
    const past = scrollY > innerHeight * 0.55;
    setSolid(past); setLogo(past);
  }
}
addEventListener('scroll', navState, { passive: true });

/* ---------------- Reveals and counters ---------------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  $$('.strip', e.target).forEach(s => s.classList.add('in'));
  $$('.stat dt', e.target).forEach(countUp);
  io.unobserve(e.target);
}), { threshold: 0, rootMargin: '0px 0px -14% 0px' });
$$('.io').forEach(el => io.observe(el));
function countUp(dt) {
  if (dt.dataset.done) return; dt.dataset.done = '1';
  const end = +dt.dataset.count, pre = dt.dataset.prefix || '';
  if (RM.matches) { dt.textContent = pre + fmtNum(end); return; }
  const t0 = performance.now(), dur = 1600;
  const step = now => {
    const x = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - x, 3);
    dt.textContent = pre + fmtNum(Math.round(end * e));
    if (x < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function pinToFinalStates() {
  $$('.io').forEach(el => { el.classList.add('in'); $$('.strip', el).forEach(s => s.classList.add('in')); $$('.stat dt', el).forEach(dt => { dt.dataset.done = '1'; dt.textContent = (dt.dataset.prefix || '') + fmtNum(+dt.dataset.count); }); });
  loadK = 1;
  if (hold.h < 1 && hold.started) finishHold();
}
function unpinFinalStates() { /* reveals stay revealed; CSS owns the motion again */ }
RM.addEventListener('change', e => { if (e.matches) pinToFinalStates(); else applyHeroMode(); });

/* ---------------- Sections reel ---------------- */
function renderSections() {
  const name = s => esc(lang === 'es' ? s[1] : s[2]);
  $('#reel').innerHTML = SECTIONS.map((s, i) => `
    <button type="button" class="sec" data-sec="${i}" style="--i:${Math.min(i, 6)}" aria-label="${name(s)}, ${esc(t('sec.count', { n: fmtNum(s[3]) }))}">
      <span class="sec-in">
        <span class="sec-media"><img src="assets/sec/${s[0]}.webp" alt="" loading="lazy" width="600" height="800" draggable="false"></span>
        <span class="sec-glare"></span>
        <span class="sec-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="sec-txt" aria-hidden="true"><span class="nm">${name(s)}</span><span class="ct">${t('sec.count', { n: fmtNum(s[3]) })}</span></span>
        <span class="sec-go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </span>
    </button>`).join('');
  // the drifting outline names in the gap above the heading, written twice for a seamless loop
  const words = SECTIONS.map(s => `<span>${name(s)}</span><i></i>`).join('');
  $('#secBg').innerHTML = words + words;
  reelCards = $$('.sec', $('#reel')).map(el => ({ el, media: $('.sec-media', el), px: null }));
  reelUpdate();
}
const reel = $('#reel');
let reelCards = [], reelRaf = null, reelN = '';
// as the row scrolls, each photo drifts inside its frame (depth), and the counter and bar follow
function reelUpdate() {
  reelRaf = null;
  const r = reel.getBoundingClientRect(), mid = r.left + r.width / 2;
  reelCards.forEach(c => {
    const b = c.el.getBoundingClientRect();
    const d = clamp((b.left + b.width / 2 - mid) / r.width, -1, 1);
    const px = RM.matches ? 0 : Math.round(-d * 90) / 10;
    if (px !== c.px) { c.px = px; c.media.style.setProperty('--px', px + '%'); }
  });
  const max = reel.scrollWidth - reel.clientWidth;
  const p = max > 0 ? reel.scrollLeft / max : 0;
  $('#reelBar').style.setProperty('--p', (0.08 + 0.92 * p).toFixed(3));
  const first = reelCards.findIndex(c => c.el.getBoundingClientRect().right > r.left + 40);
  const label = p > 0.995 ? '14' : String(clamp(first + 1, 1, 14)).padStart(2, '0');
  if (label !== reelN) { reelN = label; $('#reelN').textContent = label; }
}
const reelKick = () => { if (reelRaf === null) reelRaf = requestAnimationFrame(reelUpdate); };
reel.addEventListener('scroll', reelKick, { passive: true });
addEventListener('resize', reelKick, { passive: true });

// drag with the mouse, with a little momentum; touch keeps its native swipe
let reelDrag = null, reelMoved = false, reelGlide = null;
reel.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  cancelAnimationFrame(reelGlide);
  reelDrag = { x: e.clientX, left: reel.scrollLeft, vx: 0, lx: e.clientX, lt: performance.now(), id: e.pointerId };
  reelMoved = false;
});
reel.addEventListener('pointermove', e => {
  if (!reelDrag) return;
  const dx = e.clientX - reelDrag.x;
  if (!reelMoved && Math.abs(dx) > 5) {
    reelMoved = true; reel.classList.add('dragging');
    try { reel.setPointerCapture(reelDrag.id); } catch (err) { /* pointer already gone */ }
  }
  if (!reelMoved) return;
  reel.scrollLeft = reelDrag.left - dx;
  const now = performance.now();
  reelDrag.vx = 0.8 * reelDrag.vx + 0.2 * ((e.clientX - reelDrag.lx) / Math.max(1, now - reelDrag.lt));
  reelDrag.lx = e.clientX; reelDrag.lt = now;
});
function reelRelease() {
  if (!reelDrag) return;
  let v = -reelDrag.vx * 16;   // px per frame
  reelDrag = null;
  if (!reelMoved) return;
  const glide = () => {
    if (Math.abs(v) < 0.4 || RM.matches) { reel.classList.remove('dragging'); return; }
    reel.scrollLeft += v; v *= 0.94;
    reelGlide = requestAnimationFrame(glide);
  };
  glide();
}
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => reel.addEventListener(ev, reelRelease));

// tilt toward the pointer, with a glare that follows it
reel.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || reelDrag || RM.matches) return;
  const card = e.target.closest('.sec'); if (!card) return;
  const b = card.getBoundingClientRect();
  const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
  card.classList.add('tilting');
  card.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
  card.style.setProperty('--rx', ((0.5 - y) * 9).toFixed(2) + 'deg');
  card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
  card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
});
reel.addEventListener('pointerout', e => {
  const card = e.target.closest('.sec');
  if (!card || card.contains(e.relatedTarget)) return;
  card.classList.remove('tilting');
  card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg');
});

reel.addEventListener('click', e => {
  if (reelMoved) { reelMoved = false; e.preventDefault(); return; }   // a drag is not a click
  const b = e.target.closest('[data-sec]'); if (!b) return;
  // a section opens the catalogue on that category, across every brand
  cat.brand = -1; cat.sec = +b.dataset.sec; cat.limit = PAGE; $('#q').value = '';
  ensureCatalog().then(renderResults).catch(() => renderResults());
  $('#catalogo').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth' });
  setTimeout(() => $('#q').focus({ preventScroll: true }), 700);
});
$$('[data-reel]').forEach(b => b.addEventListener('click', () => {
  const card = reel.firstElementChild;
  reel.scrollBy({ left: (+b.dataset.reel) * ((card ? card.offsetWidth : 300) + 22) * 2, behavior: RM.matches ? 'auto' : 'smooth' });
}));
new IntersectionObserver(es => $('#secciones').classList.toggle('live', es[0].isIntersecting)).observe($('#secciones'));

// outline-type ribbons in the empty gaps between sections; each list is written twice for a seamless loop
function renderGapRibbons() {
  const ribbon = (words, sep = '<i></i>') => { const h = words.map(w => `<span>${esc(w)}</span>${sep}`).join(''); return h + h; };
  $('#mqCat').innerHTML = ribbon(T[lang].mqCat);
  $('#mqPress').innerHTML = ribbon(T[lang].mqPress);
  $('#mqReviews').innerHTML = ribbon(T[lang].mqReviews, '<i class="st"></i>');
  $('#mqVisit').innerHTML = ribbon(T[lang].mqVisit);
  ribbonSpeed();
}
// same drift speed whatever the list length (half the row is one loop)
function ribbonSpeed() {
  $$('.gap-row').forEach(r => { r.style.animationDuration = Math.max(40, r.scrollWidth / 2 / (r.parentElement.classList.contains('rev') ? 56 : 66)) + 's'; });
}
if (document.fonts) document.fonts.ready.then(ribbonSpeed);
addEventListener('resize', ribbonSpeed, { passive: true });
$$('.gap-mq').forEach(m => new IntersectionObserver(es => m.classList.toggle('live', es[0].isIntersecting)).observe(m));

/* ---------------- Catalogue: brand → category → item ---------------- */
// tienda.json: b brands [[name, logo]] (the last one is «Otras marcas»), g photos [[file, exact]], i items [[name, section, sizes, price, from, brand, photo]]
let CAT = null, BR = [], IMG = [], catPromise = null, catFailed = false;
const cat = { brand: null, sec: -1, sort: 'rec', limit: 24 };   // brand: null = not chosen yet, -1 = all brands
const PAGE = 24;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
function ensureCatalog() {
  if (CAT) return Promise.resolve();
  if (!catPromise) {
    catPromise = fetch('assets/data/tienda.json?v=20261111c').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => {
        BR = d.b.map(([n, logo], i) => ({ i, n, logo, count: 0, secs: new Map() }));
        IMG = d.g;
        CAT = d.i.map(([n, c, s, p, m, b, g]) => ({ n, c, s, p, m, b, g, k: norm(n) }));
        CAT.sort((a, b) => a.n.localeCompare(b.n, 'es'));
        CAT.forEach(it => { const B = BR[it.b]; B.count++; B.secs.set(it.c, (B.secs.get(it.c) || 0) + 1); });
        catFailed = false;
      })
      .catch(err => { catPromise = null; catFailed = true; throw err; });
  }
  return catPromise;
}
const OTHER_B = () => BR.length - 1;
const brandName = i => i === OTHER_B() ? t('cat.otherBrands') : BR[i].n;
function secName(c) { const s = SECTIONS[c]; return s ? (lang === 'es' ? s[1] : s[2]) : OTHER[lang === 'es' ? 0 : 1]; }
// small brand mark: the logo on a light tile, or the name set in type when there is no logo
function brandMark(i, cls) {
  const B = BR[i];
  if (i === OTHER_B()) return `<span class="${cls} gen" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 10.5 12 4l8 6.5V20H4z"/><path d="M9.5 20v-5.5h5V20"/></svg></span>`;
  if (B.logo) return `<span class="${cls}" aria-hidden="true"><img src="assets/logos/${esc(B.logo)}" alt="" loading="lazy" decoding="async"></span>`;
  // no logo file: the name set as a wordmark, sized to its length so it never breaks mid-word
  return `<span class="${cls} type" style="--n:${Math.max(4, B.n.length)}" aria-hidden="true"><span>${esc(B.n)}</span></span>`;
}
// line drawing per section, for items without a photo
const SEC_ICON = [
  '<path d="M4 13h10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M14 13.5l6.5-3"/>',
  '<path d="M5 9h14v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"/><path d="M3 10h2M19 10h2M8 9V7h8v2M11 5h2"/>',
  '<path d="M8 4h8l-1 6H9z"/><path d="M9 10l-2 9h10l-2-9"/><path d="M16 6h2"/>',
  '<path d="M8 3h8l-1 8H9z"/><path d="M7 21h10l-1-6H8z"/><path d="M10 11v4M14 11v4"/>',
  '<path d="M4 20 16 8c2-2 4-1 4 1L8 20z"/><path d="M14 10l2 2"/>',
  '<path d="M12 3v10"/><path d="M9 3c0 3 1 5 3 5s3-2 3-5"/><path d="M11 13h2v8h-2z"/>',
  '<path d="M4 12h16l-2 7H6z"/><path d="M7 12c0-3 2-5 5-5s5 2 5 5"/><path d="M12 4v3"/>',
  '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/>',
  '<path d="M8 3v6a2 2 0 0 1-2 2v10M6 3v5M10 3v5"/><path d="M17 3c-2 0-3 2-3 5s1 4 3 4v9"/>',
  '<path d="M7 3h10c0 5-2 8-5 8s-5-3-5-8z"/><path d="M12 11v8M8 21h8"/>',
  '<path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3z"/><path d="M8 13h8"/>',
  '<path d="M3 17h15l3-4c0-3-2-5-6-5H9c-2 0-4 2-6 9z"/><path d="M9 8V6"/>',
  '<path d="M9 3h6v9H9z"/><path d="M8 12h8v9H8z"/><path d="M11 6h2"/>',
  '<path d="M9 7h6v13a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M10 7V4h4v3"/><path d="M9 12h6"/>',
  '<path d="M4 8h16v11H4z"/><path d="M3 5h18v3H3z"/><path d="M10 12h4"/>'
];
const secIcon = c => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SEC_ICON[c] || SEC_ICON[14]}</svg>`;
function photoOf(it) { const g = IMG[it.g]; return g ? { src: 'assets/fotos/' + g[0], exact: !!g[1] } : null; }

function renderSort() {
  const sel = $('#sortSel');
  sel.innerHTML = [['rec', t('cat.sortRec')], ['az', t('cat.sortAz')], ['pa', t('cat.sortPa')], ['pd', t('cat.sortPd')]].map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('');
  sel.value = cat.sort;
}
// mark the typed start of the name
function highlight(name, q) {
  if (!q) return esc(name);
  let i = 0, k = 0;
  while (i < name.length && k < q.length) {
    const ch = norm(name[i]) || (name[i] === ' ' ? ' ' : '');
    if (ch === ' ' && q[k] !== ' ') { i++; continue; }
    k += ch.length; i++;
  }
  return `<mark>${esc(name.slice(0, i))}</mark>${esc(name.slice(i))}`;
}
function renderWall() {
  const wall = $('#brandWall');
  const show = cat.brand === null && !norm($('#q').value);
  wall.hidden = !show || !CAT;
  if (wall.hidden) return;
  const tiles = BR.map(B => B.i).filter(i => i !== OTHER_B() && BR[i].count);
  const tile = (i, name, n, mark) => `
    <button type="button" class="btile" data-b="${i}" style="--d:${Math.min(tiles.length, 30)}">
      ${mark}<span class="bt-tx"><span class="bt-nm">${esc(name)}</span><span class="bt-ct">${esc(n === 1 ? t('cat.items1') : t('cat.items', { n: fmtNum(n) }))}</span></span>
      <span class="bt-go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    </button>`;
  wall.innerHTML =
    `<p class="bwall-h">${esc(t('cat.pickBrand'))}<small>${esc(t('cat.pickBrandSub', { n: fmtNum(tiles.length) }))}</small></p>` +
    `<div class="bwall-grid">` +
    tiles.map((i, k) => tile(i, BR[i].n, BR[i].count, brandMark(i, 'bt-logo')).replace('--d:', `--k:${Math.min(k, 18)};--d:`)).join('') +
    tile(OTHER_B(), t('cat.otherBrands'), BR[OTHER_B()].count, brandMark(OTHER_B(), 'bt-logo')).replace('class="btile"', 'class="btile wide"') +
    tile(-1, t('cat.allBrands'), CAT.length, `<span class="bt-logo gen" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg></span>`).replace('class="btile"', 'class="btile wide"') +
    `</div>`;
}
function renderBrandBar() {
  const bar = $('#brandBar'), chips = $('#secChips');
  const on = cat.brand !== null && !!CAT;
  bar.hidden = !on; chips.hidden = !on;
  $('#stepBrandVal').textContent = on ? (cat.brand < 0 ? t('cat.allBrands') : brandName(cat.brand)) : '';
  $('#stepSecVal').textContent = on && cat.sec >= 0 ? secName(cat.sec) : '';
  const steps = $('#steps'); steps.dataset.at = !on ? '1' : cat.sec < 0 ? '2' : '3';
  if (!on) return;
  const all = cat.brand < 0;
  $('#bbLogo').outerHTML = all ? `<span class="bbar-logo gen" id="bbLogo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg></span>` : brandMark(cat.brand, 'bbar-logo').replace('class="bbar-logo', 'id="bbLogo" class="bbar-logo');
  $('#bbName').textContent = all ? t('cat.allBrands') : brandName(cat.brand);
  const total = all ? CAT.length : BR[cat.brand].count;
  $('#bbCount').textContent = total === 1 ? t('cat.items1') : t('cat.items', { n: fmtNum(total) });
  // categories this brand actually has, biggest first
  const secs = new Map();
  if (all) CAT.forEach(it => secs.set(it.c, (secs.get(it.c) || 0) + 1)); else BR[cat.brand].secs.forEach((v, k) => secs.set(k, v));
  const list = [...secs.entries()].sort((a, b) => a[0] - b[0]);
  chips.innerHTML = `<span class="cchips-h">${esc(t('cat.pickSec'))}</span>` +
    `<button type="button" class="cchip" data-sec="-1" aria-pressed="${cat.sec < 0}">${esc(t('cat.allSecs'))}<i>${fmtNum(total)}</i></button>` +
    list.map(([c, n]) => `<button type="button" class="cchip" data-sec="${c}" aria-pressed="${cat.sec === c}"><span class="ci">${secIcon(c)}</span>${esc(secName(c))}<i>${fmtNum(n)}</i></button>`).join('');
}
function card(it, q, i) {
  const ph = photoOf(it);
  const brand = brandName(it.b);
  const meta = [cat.sec < 0 ? secName(it.c) : '', it.s].filter(Boolean).join(' · ');
  return `
    <li class="pc" style="--k:${Math.min(i % PAGE, 12)}">
      ${brandMark(it.b, 'pc-logo')}
      <div class="pc-tx">
        <span class="pc-br">${esc(brand)}</span>
        <h4 class="pc-nm">${highlight(it.n, q)}</h4>
        ${meta ? `<span class="pc-mt">${esc(meta)}</span>` : ''}
        <span class="pc-pr">${it.m ? `<small>${esc(t('cat.from'))}</small>` : ''}<b>${fmtEur(it.p)}</b></span>
      </div>
      <button type="button" class="pc-ph${ph ? '' : ' none'}" data-zoom="${CAT.indexOf(it)}" aria-label="${esc(t('cat.zoom', { p: it.n }))}">
        ${ph ? `<img src="${esc(ph.src)}" alt="" loading="lazy" decoding="async" draggable="false">${ph.exact ? '' : `<span class="pc-tag">${esc(t('cat.approx'))}</span>`}` : secIcon(it.c)}
      </button>
    </li>`;
}
function renderResults() {
  const q = norm($('#q').value);
  const count = $('#count'), list = $('#results'), more = $('#moreResults');
  if (!CAT) {
    renderWall(); renderBrandBar();
    count.textContent = catFailed ? t('cat.error') : t('cat.loading'); list.innerHTML = ''; more.hidden = true;
    if (!catFailed) ensureCatalog().then(renderResults).catch(() => { count.textContent = t('cat.error'); });
    return;
  }
  renderWall(); renderBrandBar();
  if (cat.brand === null && !q) { count.textContent = ''; list.innerHTML = ''; more.hidden = true; return; }
  // only names that START with what was typed
  let r = CAT.filter(it => (cat.brand === null || cat.brand < 0 || it.b === cat.brand) && (cat.sec < 0 || it.c === cat.sec) && (!q || it.k.startsWith(q)));
  // recommended: items with a photo first (exact, then indicative), then the rest; A to Z inside each group (CAT is already A to Z)
  const rank = it => it.g < 0 ? 2 : IMG[it.g][1] ? 0 : 1;
  if (cat.sort === 'rec') r = r.slice().sort((a, b) => rank(a) - rank(b));
  else if (cat.sort === 'pa') r = r.slice().sort((a, b) => a.p - b.p);
  else if (cat.sort === 'pd') r = r.slice().sort((a, b) => b.p - a.p);
  if (!r.length) {
    count.textContent = '';
    list.innerHTML = `<li class="empty">${esc(q ? t('cat.none', { q: $('#q').value.trim() }) : t('cat.noneHere'))}</li>`;
    more.hidden = true; return;
  }
  const where = cat.brand === null || cat.brand < 0 ? '' : ' · ' + brandName(cat.brand);
  count.textContent = (r.length === 1 ? t('cat.count1') : t('cat.count', { n: fmtNum(r.length) })) + (q ? ' ' + t('cat.startWith', { q: $('#q').value.trim() }) : '') + where;
  list.innerHTML = r.slice(0, cat.limit).map((it, i) => card(it, q, i)).join('');
  more.hidden = r.length <= cat.limit;
  if (!more.hidden) more.textContent = t('cat.moreN', { n: fmtNum(Math.min(PAGE, r.length - cat.limit)) });
}
function chooseBrand(i) { cat.brand = i; cat.sec = -1; cat.limit = PAGE; renderResults(); }
let qTimer = 0;
$('#q').addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => { cat.limit = PAGE; renderResults(); }, 120); });
$('#q').addEventListener('focus', () => { ensureCatalog().catch(() => {}); }, { once: true });
$('#sortSel').addEventListener('change', e => { cat.sort = e.target.value; cat.limit = PAGE; renderResults(); });
$('#moreResults').addEventListener('click', () => { cat.limit += PAGE; renderResults(); });
$('#brandWall').addEventListener('click', e => {
  const b = e.target.closest('[data-b]'); if (!b) return;
  chooseBrand(+b.dataset.b);
  const bar = $('#brandBar');
  if (bar.getBoundingClientRect().top < 80) bar.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'center' });
  $('#secChips .cchip').focus({ preventScroll: true });
});
$('#secChips').addEventListener('click', e => {
  const b = e.target.closest('[data-sec]'); if (!b) return;
  cat.sec = +b.dataset.sec; cat.limit = PAGE; renderResults();
});
const backToBrands = () => { cat.brand = null; cat.sec = -1; cat.limit = PAGE; $('#q').value = ''; renderResults(); $('#steps').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'start' }); };
$('#bbChange').addEventListener('click', backToBrands);
$('#stepBrand').addEventListener('click', backToBrands);
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { ensureCatalog().then(() => { renderResults(); fillTicker(); }).catch(() => { renderResults(); }); o.disconnect(); } }, { rootMargin: '600px' }).observe($('#catalogo'));

// the enlarged photo: hover grows it in place (CSS); a click or tap opens it full size with the price
const zoom = $('#zoom');
let zoomOpener = null;
function openZoom(btn) {
  const it = CAT[+btn.dataset.zoom]; if (!it) return;
  zoomOpener = btn;
  const ph = photoOf(it);
  $('#zoomPh').innerHTML = ph ? `<img src="${esc(ph.src)}" alt="${esc(it.n)}">` : `<span class="zoom-ic">${secIcon(it.c)}</span>`;
  $('#zoomPh').classList.toggle('none', !ph);
  $('#zoomBrand').textContent = brandName(it.b);
  $('#zoomName').textContent = it.n;
  $('#zoomPrice').innerHTML = (it.m ? `<small>${esc(t('cat.from'))}</small>` : '') + `<b>${fmtEur(it.p)}</b>` + (it.s ? `<span>${esc(it.s)}</span>` : '');
  $('#zoomNote').textContent = !ph ? t('cat.noPhoto') : ph.exact ? '' : t('cat.approxLong');
  const who = [it.b === OTHER_B() ? '' : brandName(it.b), it.n].filter(Boolean).join(' ');
  $('#zoomAsk').href = 'https://wa.me/34956512987?text=' + encodeURIComponent(t('cat.waMsg', { p: who }));
  zoom.hidden = false;
  document.documentElement.classList.add('lb-open');
  requestAnimationFrame(() => zoom.classList.add('show'));
  $('#zoomClose').focus();
}
function closeZoom() {
  if (zoom.hidden) return;
  zoom.classList.remove('show');
  document.documentElement.classList.remove('lb-open');
  setTimeout(() => { zoom.hidden = true; }, RM.matches ? 0 : 300);
  if (zoomOpener) zoomOpener.focus({ preventScroll: true });
}
$('#results').addEventListener('click', e => { const b = e.target.closest('[data-zoom]'); if (b) openZoom(b); });
$('#zoomClose').addEventListener('click', closeZoom);
zoom.addEventListener('click', e => { if (e.target === zoom) closeZoom(); });
document.addEventListener('keydown', e => {
  if (zoom.hidden) return;
  if (e.key === 'Escape') closeZoom();
  if (e.key === 'Tab') {
    const f = [$('#zoomClose'), $('#zoomAsk')];
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[1]) { e.preventDefault(); f[0].focus(); }
  }
});
// hovering a photo enlarges it; keep it inside the window by growing toward the free side
$('#results').addEventListener('pointerover', e => {
  const b = e.target.closest('.pc-ph'); if (!b || e.pointerType !== 'mouse') return;
  const r = b.getBoundingClientRect();
  b.classList.toggle('up', r.top > innerHeight * 0.55);
});

/* Decorative life around the search: drifting item names, a typing hint, motion only while on screen */
const consoleEl = $('.console');
function fillTicker() {
  if (!CAT || consoleEl.classList.contains('ticker-on')) return;
  const r = rng(11);
  const pick = n => Array.from({ length: n }, () => CAT[Math.floor(r() * CAT.length)].n);
  // each row holds its list twice so the -50% loop is seamless
  const row = names => { const h = names.map(n => `<span>${esc(n)}</span><i>·</i>`).join(''); return h + h; };
  $('#tk1').innerHTML = row(pick(26));
  $('#tk2').innerHTML = row(pick(26));
  consoleEl.classList.add('ticker-on');
}
const typing = { timer: null, ex: 0, ch: 0, back: false, on: false };
function typeStep() {
  const words = T[lang].tw, w = words[typing.ex % words.length], input = $('#q');
  if (!typing.back) {
    typing.ch++;
    if (typing.ch >= w.length) { typing.back = true; input.placeholder = w + '…'; typing.timer = setTimeout(typeStep, 1700); return; }
  } else {
    typing.ch--;
    if (typing.ch <= 0) { typing.back = false; typing.ex++; }
  }
  input.placeholder = w.slice(0, typing.ch) + '▏';
  typing.timer = setTimeout(typeStep, typing.back ? 38 : 85);
}
function startTyping() {
  const input = $('#q');
  if (typing.on || RM.matches || input.value || document.activeElement === input) return;
  typing.on = true; typing.ch = 0; typing.back = false; typeStep();
}
function stopTyping() { typing.on = false; clearTimeout(typing.timer); $('#q').placeholder = t('cat.ph'); }
$('#q').addEventListener('focus', stopTyping);
$('#q').addEventListener('blur', () => setTimeout(startTyping, 1200));
new IntersectionObserver(es => {
  const vis = es[0].isIntersecting;
  consoleEl.classList.toggle('live', vis);
  vis ? startTyping() : stopTyping();
}, { threshold: 0.2 }).observe(consoleEl);
RM.addEventListener('change', e => { if (e.matches) stopTyping(); });

/* ---------------- 01 The walk: through the open door and deeper into the shop ---------------- */
let tourText = () => {};   // refreshes the walk's figures after a language change
(() => {
  const track = $('#tour'); if (!track) return;
  const stage = $('.walk-stage', track);
  const layers = $$('.w-layer', track).map(el => ({ el, media: el.firstElementChild, k: '' }));
  const ambs = $$('.walk-amb img', track).map(el => ({ el, o: -1 }));
  const beats = $$('.w-beat', track).map(el => ({ el, k: -1 }));
  const stats = $$('.w-stat', track).map(el => ({ el, k: -1, n: $('.n', el), txt: '' }));
  const rail = $$('.w-rail i', track).map(el => ({ el, f: -1 }));
  const bloom = $('.w-bloom', track), tagN = $('.w-n', track), vid = $('video', track);
  const N = layers.length, DX = 0.713, DY = 0.519;      // the open doorway in the facade photo
  let target = 0, shown = 0, raf = null, last = 0, live = false, lastBloom = -1, lastTag = '';
  let vidReady = false, seekBusy = false, seekNext = null;

  function progress() {
    const r = track.getBoundingClientRect();
    const span = r.height - stage.offsetHeight;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  }
  let lastOut = -1;
  function render(q) {
    const rm = RM.matches;
    // the shots play over the first 86% of the track; then a calm hold, then the stage eases back for the next section
    const x = Math.min((q / 0.86) * N, N - 0.0001), b = Math.floor(x), f = x - b;
    const out = rm ? 0 : Math.round(smoothstep(q, 0.93, 1) * 1000) / 1000;
    if (out !== lastOut) { lastOut = out; stage.style.setProperty('--out', out); }
    let tr = b < N - 1 ? smoothstep(f, 0.55, 1) : 0;    // the hand-over to the next shot
    if (rm) tr = tr > 0.5 ? 1 : 0;
    layers.forEach((L, i) => {
      let o = 0, s = 1, tx = 0, ty = 0;
      if (i === b) {
        if (i === 0) {
          // the facade: push in on the open door, sliding it to the centre, then dissolve into the aisle behind it
          const e = rm ? 0 : Math.pow(tr, 1.35);
          s = 1 + (rm ? 0 : 0.06 * f) + 2.6 * e;
          tx = (0.5 - DX) * 100 * Math.min(1, e * 1.3);
          ty = (0.5 - DY) * 100 * Math.min(1, e * 1.3);
          o = 1 - smoothstep(tr, 0.55, 0.95);
        } else {
          // inside: keep walking forward, and lean into the next shot as it arrives
          s = 1 + (rm ? 0 : 0.07 * f + 0.2 * tr);
          o = 1 - tr;
        }
      } else if (i === b + 1) {
        o = b === 0 ? smoothstep(tr, 0.4, 0.9) : tr;
        s = rm ? 1 : 1 + (b === 0 ? 0.32 : 0.16) * (1 - tr);
      }
      const key = `${o.toFixed(3)}|${s.toFixed(3)}|${tx.toFixed(1)}|${ty.toFixed(1)}`;
      if (key !== L.k) {
        L.k = key;
        L.el.style.opacity = o.toFixed(3);
        L.media.style.transform = `translate3d(${tx.toFixed(2)}%,${ty.toFixed(2)}%,0) scale(${s.toFixed(3)})`;
      }
      const a = ambs[i];
      if (a && Math.abs(a.o - o) > 0.004) { a.o = o; a.el.style.opacity = o.toFixed(3); }
    });
    // a flash of warm light as the camera crosses each threshold, strongest at the door
    const bl = rm ? 0 : Math.round(Math.sin(Math.PI * tr) * (b === 0 ? 0.9 : 0.35) * 1000) / 1000;
    if (bl !== lastBloom) { lastBloom = bl; bloom.style.opacity = bl; }
    // copy and figures for each shot rise in as it arrives and step aside as the next one comes
    beats.forEach((B, i) => {
      const k = Math.round((i === b ? 1 - smoothstep(tr, 0, 0.45) : i === b + 1 ? smoothstep(tr, 0.55, 1) : 0) * 1000) / 1000;
      if (k !== B.k) { B.k = k; B.el.style.setProperty('--k', k); B.el.classList.toggle('on', k > 0.5); }
      const S = stats[i];
      if (S && k !== S.k) {
        S.k = k; S.el.style.setProperty('--k', k);
        const to = +S.el.dataset.to;
        if (to) {
          const txt = (S.el.dataset.pre || '') + fmtNum(Math.round(to * (rm ? 1 : clamp(k * 1.25, 0, 1))));
          if (txt !== S.txt) { S.txt = txt; S.n.textContent = txt; }
        }
      }
    });
    rail.forEach((R, i) => {
      const v = Math.round((i < b ? 1 : i === b ? Math.max(f, 0.06) : 0) * 100) / 100;
      if (v !== R.f) { R.f = v; R.el.style.setProperty('--f', v); }
    });
    const tag = String(Math.min(N, b + (tr > 0.5 ? 2 : 1))).padStart(2, '0');
    if (tag !== lastTag) { lastTag = tag; tagN.textContent = tag; }
    // the last shot is a short walk along the shelves, scrubbed by scroll
    if (vidReady && vid.duration) seek(b === N - 1 ? f * (vid.duration - 0.05) : 0);
  }
  // eased toward the scroll position so the walk keeps a little inertia
  function tick(now) {
    const dt = Math.min(100, now - (last || now)); last = now;
    shown += (target - shown) * (RM.matches ? 1 : 1 - Math.pow(1 - 0.12, dt / 16.667));
    if (Math.abs(target - shown) < 0.0004) shown = target;
    render(shown);
    if (shown !== target) raf = requestAnimationFrame(tick); else { raf = null; last = 0; }
  }
  const onScroll = () => { target = progress(); if (raf === null) raf = requestAnimationFrame(tick); };

  // small figure line inside each beat, for screens too narrow for the figures column
  function minis() {
    beats.forEach((B, i) => {
      const S = stats[i]; if (!S) return;
      let m = $('.w-mini', B.el);
      if (!m) { m = document.createElement('p'); m.className = 'w-mini'; m.setAttribute('aria-hidden', 'true'); B.el.insertBefore(m, B.el.firstChild); }
      const to = S.el.dataset.to;
      m.textContent = to ? `${S.el.dataset.pre || ''}${fmtNum(+to)} ${$('.l', S.el).textContent}` : `${S.n.textContent} · ${$('.l', S.el).textContent}`;
    });
  }

  function seek(time) {
    if (!vidReady) return;
    if (seekBusy) { seekNext = time; return; }
    if (Math.abs(vid.currentTime - time) < 0.02) return;
    seekBusy = true; vid.currentTime = time;
  }
  vid.addEventListener('seeked', () => { seekBusy = false; if (seekNext !== null) { const s = seekNext; seekNext = null; seek(s); } });
  vid.addEventListener('error', () => { seekBusy = false; seekNext = null; });

  let loading = false;
  function loadVideo() {
    if (loading) return; loading = true;
    vid.poster = 'assets/tour-video-poster.jpg';
    fetch('assets/tour-video.mp4').then(res => { if (!res.ok) throw new Error(res.status); return res.blob(); })
      .then(b => {
        vid.src = URL.createObjectURL(b);
        vid.addEventListener('loadeddata', () => { vidReady = true; onScroll(); }, { once: true });
        vid.load();
        if (matchMedia('(pointer: coarse)').matches) { const pr = vid.play(); if (pr && pr.then) pr.then(() => vid.pause()).catch(() => {}); }
      })
      .catch(() => { /* the poster stands in for the walk */ });
  }
  new IntersectionObserver(es => {
    const vis = es[0].isIntersecting;
    if (vis) loadVideo();
    if (vis && !live) { live = true; addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
    else if (!vis && live) { live = false; removeEventListener('scroll', onScroll); }
  }, { rootMargin: '300px 0px' }).observe(track);
  addEventListener('resize', onScroll, { passive: true });
  RM.addEventListener('change', () => { layers.forEach(L => L.k = ''); beats.forEach(B => B.k = -1); stats.forEach(S => { S.k = -1; S.txt = ''; }); onScroll(); });
  tourText = () => { minis(); stats.forEach(S => { S.k = -1; S.txt = ''; }); render(shown); };
  minis();
  render(0);
})();

/* ---------------- Press embeds (load on request) ---------------- */
// the lighthouse beam and the play pulses only move while the section is on screen
new IntersectionObserver(es => $('#prensa').classList.toggle('live', es[0].isIntersecting)).observe($('#prensa'));
// a click opens the report in a lightbox; the original link below it always works, even where embeds are blocked
const lb = $('#lightbox'), lbFrame = $('.lb-frame', lb);
let lbOpener = null;
function openVideo(b) {
  lbOpener = b;
  const f = document.createElement('iframe');
  f.src = b.dataset.embed; f.title = b.dataset.title;
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write';
  f.allowFullscreen = true;
  f.referrerPolicy = 'strict-origin-when-cross-origin';   // YouTube refuses to play embeds sent with no referrer
  lbFrame.replaceChildren(f);
  $('.lb-title', lb).textContent = b.dataset.title;
  $('.lb-out', lb).href = b.dataset.url;
  $('.lb-out-t', lb).textContent = t('lb.open', { s: b.dataset.from });
  lb.hidden = false;
  document.documentElement.classList.add('lb-open');
  requestAnimationFrame(() => lb.classList.add('show'));
  $('.lb-close', lb).focus();
}
function closeVideo() {
  if (lb.hidden) return;
  lb.classList.remove('show');
  document.documentElement.classList.remove('lb-open');
  lbFrame.replaceChildren();                                // removing the frame stops playback
  setTimeout(() => { lb.hidden = true; }, RM.matches ? 0 : 350);
  if (lbOpener) lbOpener.focus({ preventScroll: true });
}
$$('.vid button').forEach(b => b.addEventListener('click', () => openVideo(b)));
$('.lb-close', lb).addEventListener('click', closeVideo);
lb.addEventListener('click', e => { if (e.target === lb) closeVideo(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeVideo();
  if (e.key === 'Tab') {                                    // keep focus inside the dialog
    const f = [$('.lb-close', lb), $('.lb-out', lb)];
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[1]) { e.preventDefault(); f[0].focus(); }
  }
});

/* ---------------- Map (load on request) ---------------- */
// the pin's rings and the slow drift of the map only run while the visit section is on screen
new IntersectionObserver(es => $('#visita').classList.toggle('live', es[0].isIntersecting)).observe($('#visita'));
$('#map button').addEventListener('click', e => {
  const f = document.createElement('iframe');
  f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=-5.3139%2C35.8858%2C-5.3039%2C35.8908&layer=mapnik&marker=35.8883%2C-5.3089';
  f.title = 'Mapa: Calle Solís, 4, Ceuta'; f.loading = 'lazy';
  e.currentTarget.replaceWith(f);
});

/* ---------------- Hours, status and the hold-to-light sign ---------------- */
function nowInCeuta() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = k => parts.find(p => p.type === k).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, min: +get('hour') * 60 + +get('minute') };
}
const hhmm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function openState() {
  const { day, min } = nowInCeuta();
  const cur = HOURS[day].find(([a, b]) => min >= a && min < b);
  if (cur) return { open: true, text: t('vi.isOpen', { t: hhmm(cur[1]) }) };
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const next = HOURS[d].find(([a]) => i > 0 || a > min);
    if (next) {
      const when = i === 0 ? t('vi.today') : i === 1 ? t('vi.tomorrow') : t('vi.on', { d: T[lang].days[d].toLowerCase() });
      return { open: false, text: t('vi.isClosed', { d: when, t: hhmm(next[0]) }) };
    }
  }
  return { open: false, text: '' };
}
function renderHours() {
  const { day } = nowInCeuta();
  const order = [1, 2, 3, 4, 5, 6, 0];
  $('#hours').innerHTML = order.map(d => {
    const h = HOURS[d];
    const txt = h.length ? h.map(([a, b]) => `${hhmm(a)} – ${hhmm(b)}`).join(` ${t('vi.and')} `) : t('vi.closedDay');
    return `<li class="${d === day ? 'today' : ''}"><span>${T[lang].days[d]}</span><span>${txt}</span></li>`;
  }).join('');
  const st = openState();
  $('#status').innerHTML = st.text;
  const word = st.open ? t('vi.open') : t('vi.closed');
  $('#signWord').textContent = word; $('#signGlow').textContent = word;
  $('#signGlow').classList.toggle('closed', !st.open);
  $('#holdBtn').textContent = hold.h >= 1 ? t('vi.done') : t('vi.hold');
}
setInterval(() => { renderHours(); }, 60000);

const hold = { h: 0, holding: false, raf: null, last: 0, started: false };
const holdWrap = $('#hold'), holdBtn = $('#holdBtn');
function setH(v) { hold.h = v; holdWrap.style.setProperty('--h', v.toFixed(3)); holdBtn.style.setProperty('--h', v.toFixed(3)); }
function holdTick(now) {
  const dt = Math.min(100, now - (hold.last || now)); hold.last = now;
  if (hold.holding) setH(Math.min(1, hold.h + dt / 1300));
  else setH(Math.max(0, hold.h - dt / 700));
  if (hold.h >= 1) { finishHold(); return; }
  if (hold.holding || hold.h > 0) hold.raf = requestAnimationFrame(holdTick); else { hold.raf = null; hold.last = 0; }
}
function startHold() {
  if (hold.h >= 1) return;
  hold.started = true;
  if (RM.matches) { finishHold(); return; }
  hold.holding = true;
  if (!hold.raf) hold.raf = requestAnimationFrame(holdTick);
}
function stopHold() { hold.holding = false; }
function finishHold() {
  hold.holding = false; if (hold.raf) cancelAnimationFrame(hold.raf); hold.raf = null;
  setH(1); holdBtn.classList.add('done'); $('#signWord').classList.add('lit');
  holdBtn.textContent = t('vi.done');
}
holdBtn.addEventListener('pointerdown', e => { e.preventDefault(); holdBtn.setPointerCapture?.(e.pointerId); startHold(); });
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => holdBtn.addEventListener(ev, stopHold));
holdBtn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); } });
holdBtn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stopHold(); });
holdBtn.addEventListener('contextmenu', e => e.preventDefault());

/* ---------------- Boot ---------------- */
buildSign();
applyLang();
applyHeroMode();
navState();
const lightSign = () => {
  $$('.sign').forEach(s => s.classList.add('on'));
  loadStart = performance.now(); loadK = RM.matches ? 1 : 0;
  if (scrubOn) { signGeo = null; updateCaptions(shown); kick(); }
};
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(lightSign, 250));
if (RM.matches) pinToFinalStates();
})();
