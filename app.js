/* Interacciones de la landing. Sin dependencias. No guarda datos personales (ni consola, ni almacenamiento, ni analítica). */
(function () {
  'use strict';
  var SITE = window.SITE;
  if (!SITE) { document.documentElement.classList.remove('js'); return; }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Menú móvil (no modal) ---------- */
  var menuBtn = $('#menu-btn'), mobileNav = $('#mobile-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileNav.classList.toggle('open', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  /* ---------- Horario abierto/cerrado (zona del negocio) ---------- */
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60, suf = h >= 12 ? 'p.m.' : 'a.m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + suf;
  }
  function nowInZone() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: SITE.zonaHoraria, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
    var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[map.weekday];
    return { day: wd, min: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10) };
  }
  function openStatus() {
    var n = nowInZone(), today = SITE.horario[n.day] || [];
    for (var i = 0; i < today.length; i++) {
      if (n.min >= today[i][0] && n.min < today[i][1]) return { open: true, text: 'Abierto ahora · cierra a las ' + fmt(today[i][1]), day: n.day };
    }
    for (var d = 0; d < 8; d++) {
      var di = (n.day + d) % 7, slots = SITE.horario[di] || [];
      for (var j = 0; j < slots.length; j++) {
        if (d === 0 && slots[j][0] <= n.min) continue;
        return { open: false, text: 'Cerrado ahora · abre ' + (d === 0 ? 'hoy' : d === 1 ? 'mañana' : DIAS[di]) + ' a las ' + fmt(slots[j][0]), day: n.day };
      }
    }
    return { open: false, text: 'Cerrado ahora', day: n.day };
  }
  function renderStatus() {
    try {
      var s = openStatus();
      ['status', 'status2'].forEach(function (id) {
        var el = document.getElementById(id); if (!el) return;
        el.textContent = s.text; el.dataset.open = String(s.open); el.hidden = false;
      });
      $$('#hours dt').forEach(function (dt) {
        var on = Number(dt.dataset.d) === s.day;
        dt.classList.toggle('today', on);
        if (on) dt.setAttribute('aria-current', 'date'); else dt.removeAttribute('aria-current');
      });
    } catch (e) { /* si Intl falla, el horario fijo sigue visible */ }
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  /* ---------- Formulario → WhatsApp ---------- */
  var form = $('#quote-form'), select = $('#f-servicio'), submitBtn = $('#submit-btn'), statusEl = $('#form-status');
  SITE.servicios.forEach(function (s) {
    var o = document.createElement('option'); o.value = s.id; o.textContent = s.nombre; select.appendChild(o);
  });
  submitBtn.disabled = false; // se habilita solo cuando el script está listo

  var fields = {
    nombre: { el: $('#f-nombre'), err: $('#e-nombre') },
    servicio: { el: select, err: $('#e-servicio') },
    vehiculo: { el: $('#f-vehiculo'), err: $('#e-vehiculo') },
    mensaje: { el: $('#f-mensaje'), err: $('#e-mensaje') }
  };
  function validate(key) {
    var f = fields[key], v = f.el.value.trim(), msg = '';
    if (key === 'nombre') { if (v.length < 2) msg = 'escribe tu nombre (mínimo 2 letras).'; }
    if (key === 'servicio') { if (!v) msg = 'elige un servicio.'; }
    if (key === 'mensaje') { if (v.length < 10) msg = 'cuéntanos un poco más (mínimo 10 caracteres).'; else if (v.length > 500) msg = 'el mensaje es muy largo (máximo 500).'; }
    if (key === 'vehiculo') { if (v.length > 80) msg = 'máximo 80 caracteres.'; }
    f.err.textContent = msg;
    if (msg) f.el.setAttribute('aria-invalid', 'true'); else f.el.removeAttribute('aria-invalid');
    return !msg;
  }
  Object.keys(fields).forEach(function (k) {
    var ev = k === 'servicio' ? 'change' : 'input';
    fields[k].el.addEventListener(ev, function () { if (fields[k].el.getAttribute('aria-invalid') === 'true') validate(k); });
    fields[k].el.addEventListener('blur', function () { if (fields[k].el.value.trim() !== '' || fields[k].el.getAttribute('aria-invalid') === 'true') validate(k); });
  });

  function serviceName(id) {
    var s = SITE.servicios.filter(function (x) { return x.id === id; })[0]; return s ? s.nombre : id;
  }
  function buildUrl() {
    var lines = ['Hola, quiero solicitar una cotización.',
      'Nombre: ' + fields.nombre.el.value.trim(),
      'Servicio: ' + serviceName(select.value)];
    var veh = fields.vehiculo.el.value.trim(); if (veh) lines.push('Auto: ' + veh);
    lines.push('Detalle: ' + fields.mensaje.el.value.trim());
    return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
  }
  function setStatus(text, href) {
    statusEl.textContent = '';
    if (!text) return;
    var p = document.createElement('p');
    p.className = 'form-status' + (href ? ' form-status--warn' : '');
    p.textContent = text;
    if (href) {
      var a = document.createElement('a');
      a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Abrir WhatsApp con tu mensaje';
      p.appendChild(document.createTextNode(' '));
      p.appendChild(a);
    }
    statusEl.appendChild(p);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('');
    var ok = true, first = null;
    ['nombre', 'servicio', 'vehiculo', 'mensaje'].forEach(function (k) {
      if (!validate(k)) { ok = false; if (!first) first = fields[k].el; }
    });
    if (!ok) { first.focus(); return; }
    // Sin la opción 'noopener': con ella window.open siempre devuelve null y no se puede saber si abrió.
    var url = buildUrl();
    var w = window.open(url, '_blank');
    if (w) {
      w.opener = null;
      setStatus('Se abrió WhatsApp con tu mensaje. Revísalo y envíalo allá para que lo recibamos.');
    } else {
      setStatus('No se pudo abrir WhatsApp automáticamente. Tus datos siguen aquí.', url);
    }
  });

  // Botones de servicio: preseleccionan sin borrar lo ya escrito
  $$('[data-servicio]').forEach(function (b) {
    b.addEventListener('click', function () {
      select.value = b.dataset.servicio;
      select.removeAttribute('aria-invalid'); fields.servicio.err.textContent = '';
      var target = $('#contacto');
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { (fields.nombre.el.value.trim() ? fields.mensaje.el : fields.nombre.el).focus({ preventScroll: true }); }, reduce ? 0 : 450);
    });
  });

  /* ---------- Carrusel de reseñas ---------- */
  var rv = $('#reviews'), prev = $('#rev-prev'), next = $('#rev-next');
  function step() { var li = rv.querySelector('li'); return li ? li.getBoundingClientRect().width + 18 : 300; }
  function updateArrows() {
    // aria-disabled en lugar de disabled: una flecha enfocada no debe perder el foco al llegar al extremo
    prev.setAttribute('aria-disabled', String(rv.scrollLeft <= 4));
    next.setAttribute('aria-disabled', String(rv.scrollLeft + rv.clientWidth >= rv.scrollWidth - 4));
  }
  prev.addEventListener('click', function () { rv.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
  next.addEventListener('click', function () { rv.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
  rv.addEventListener('scroll', function () { window.requestAnimationFrame(updateArrows); }, { passive: true });
  rv.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { rv.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { rv.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); e.preventDefault(); }
  });
  window.addEventListener('resize', updateArrows);
  updateArrows();

  // Avance automático. Se detiene con el botón de pausa, al pasar el cursor, con foco de teclado,
  // al tocar la lista, fuera de pantalla y con la pestaña oculta. Con movimiento reducido arranca en pausa.
  var AUTO_MS = 5000, TICK_MS = 200;
  var toggle = $('#rev-toggle'), revWrap = rv.closest('.wrap');
  var auto = { pausado: reduce, cursor: false, foco: false, toque: false, transcurrido: 0 };
  function renderToggle() {
    toggle.setAttribute('aria-label', auto.pausado ? 'Reanudar reseñas' : 'Pausar reseñas');
    toggle.querySelector('use').setAttribute('href', auto.pausado ? '#i-play' : '#i-pause');
  }
  toggle.addEventListener('click', function () { auto.pausado = !auto.pausado; auto.transcurrido = 0; renderToggle(); });
  renderToggle();
  function siguienteResena() {
    var alFinal = rv.scrollLeft + rv.clientWidth >= rv.scrollWidth - 4;
    var comportamiento = reduce ? 'auto' : 'smooth';
    if (alFinal) rv.scrollTo({ left: 0, behavior: comportamiento });
    else rv.scrollBy({ left: step(), behavior: comportamiento });
  }
  function carruselEnPantalla() {
    var r = rv.getBoundingClientRect();
    return r.top < window.innerHeight - r.height * 0.3 && r.bottom > r.height * 0.3;
  }
  setInterval(function () {
    if (auto.pausado || auto.cursor || auto.foco || auto.toque || document.hidden) return;
    if (!carruselEnPantalla()) { auto.transcurrido = 0; return; }
    auto.transcurrido += TICK_MS;
    if (auto.transcurrido >= AUTO_MS) { auto.transcurrido = 0; siguienteResena(); }
  }, TICK_MS);
  revWrap.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') auto.cursor = true; });
  revWrap.addEventListener('pointerleave', function () { auto.cursor = false; auto.transcurrido = 0; });
  revWrap.addEventListener('focusin', function (e) { auto.foco = e.target.matches(':focus-visible'); });
  revWrap.addEventListener('focusout', function () { auto.foco = false; auto.transcurrido = 0; });
  rv.addEventListener('touchstart', function () { auto.toque = true; }, { passive: true });
  ['touchend', 'touchcancel'].forEach(function (ev) {
    rv.addEventListener(ev, function () { auto.toque = false; auto.transcurrido = 0; }, { passive: true });
  });
  [prev, next].forEach(function (b) { b.addEventListener('click', function () { auto.transcurrido = 0; }); });

  /* ---------- Carretera: progreso de lectura ---------- */
  var root = document.documentElement, ticking = false;
  function rail() {
    var max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--rail', max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : '0');
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(rail); } }, { passive: true });
  window.addEventListener('resize', rail);
  rail();

  /* ---------- Navegación activa, revelado y barra móvil ---------- */
  if ('IntersectionObserver' in window) {
    var links = $$('.nav a');
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { secObs.observe(s); });

    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.reveal').forEach(function (el) { revObs.observe(el); });

    var sticky = $('#sticky-cta');
    var hideSticky = { hero: false, contact: false };
    function syncSticky() { sticky.classList.toggle('hide', hideSticky.hero || hideSticky.contact); }
    var stObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { hideSticky[en.target.id === 'contacto' ? 'contact' : 'hero'] = en.isIntersecting; });
      syncSticky();
    });
    stObs.observe($('#contacto'));
    stObs.observe($('.hero-actions')); $('.hero-actions').id = 'hero-actions';

    var blinkObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('in-view', en.isIntersecting); });
    });
    $$('.status').forEach(function (s) { blinkObs.observe(s); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    $$('.status').forEach(function (s) { s.classList.add('in-view'); });
  }
})();
