// Mouvements « façon iPhone » (style Apple) : ressorts interruptibles, feuille qu'on attrape au doigt,
// élan projeté au lâcher, résistance élastique en butée. Utilisé par la feuille « Jouer » sur téléphone.
(function () {
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Safari sur iPhone n'affiche l'état « appuyé » (:active) que si la page écoute le toucher
  document.addEventListener('touchstart', () => {}, { passive: true });
  // Distance que parcourrait le doigt lancé (même formule que le défilement de l'iPhone)
  const project = (vel, d = 0.998) => (vel / 1000) * d / (1 - d);
  // Plus on tire au-delà de la butée, moins l'élément suit
  const rubber = (o, dim, c = 0.55) => (o * dim * c) / (dim + c * Math.abs(o));

  function sheet(bg, el, opts = {}) {
    const app = document.getElementById('app');
    let y = 0, v = 0, raf = 0, drag = null, closing = false, onClosed = null, moving = false;
    const H = () => (el.offsetHeight || innerHeight) + 20;
    function paint() {
      el.style.transform = `translateY(${y.toFixed(1)}px)`;
      const p = Math.max(0, Math.min(1, 1 - y / H()));
      bg.style.background = `rgba(10,13,35,${(p * 0.45).toFixed(3)})`;
      if (app) {
        const on = p > 0.002;
        app.style.transform = on ? `translateY(${(p * 10).toFixed(1)}px) scale(${(1 - p * 0.06).toFixed(4)})` : '';
        app.style.borderRadius = on ? `${Math.round(p * 18)}px` : '';
        app.style.overflow = on ? 'hidden' : '';
      }
    }
    // Ressort (paramètres Apple : amortissement 1 = sans rebond, « response » = vivacité en secondes)
    function animate(to, o = {}, done) {
      cancelAnimationFrame(raf); moving = true;
      const damping = o.damping ?? 1, response = o.response ?? 0.35;
      v = o.velocity ?? v;
      if (reduce()) { y = to; v = 0; moving = false; paint(); if (done) done(); return; }
      const k = (2 * Math.PI / response) ** 2, c = (4 * Math.PI * damping) / response;
      let last = performance.now();
      const tick = (t) => {
        const dt = Math.min(0.25, (t - last) / 1000); last = t; // temps réel : même vitesse si l’écran rame
        const n = Math.max(1, Math.ceil(dt / 0.004)), h = dt / n;
        for (let i = 0; i < n; i++) { v += (-k * (y - to) - c * v) * h; y += v * h; }
        if (Math.abs(y - to) < 0.5 && Math.abs(v) < 5) { y = to; v = 0; moving = false; paint(); if (done) done(); return; }
        paint(); raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    const api = {
      get closing() { return closing; },
      open(vel) { closing = false; animate(0, { response: 0.4, velocity: vel ?? v }); },
      close(vel = 0, done) {
        closing = true; if (done) onClosed = done;
        animate(H(), { response: 0.32, velocity: vel }, () => { if (!closing) return; if (app) { app.style.transform = ''; app.style.borderRadius = ''; app.style.overflow = ''; } if (onClosed) onClosed(); });
      },
    };

    // Doigt : la feuille suit 1:1 ; vers le bas seulement si son contenu est tout en haut (sinon on la laisse défiler)
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { drag = null; return; }
      const wasMoving = moving;
      cancelAnimationFrame(raf); moving = false;
      const cy = e.touches[0].clientY;
      drag = { y0: cy, s: y, on: false, handle: !!e.target.closest('.sheet-grip, .sheet-head'), h: [[cy, e.timeStamp]] };
      if (wasMoving) drag.on = true; // rattrapée en plein mouvement : on la tient tout de suite
    }, { passive: true });
    el.addEventListener('touchmove', (e) => {
      if (!drag) return;
      const cy = e.touches[0].clientY, dy = cy - drag.y0;
      if (!drag.on) {
        if (Math.abs(dy) < 8) return;
        if (!(drag.handle || (el.scrollTop <= 0 && dy > 0))) { drag = null; return; }
        drag.on = true; drag.y0 = cy; drag.s = y;
      }
      e.preventDefault();
      let n = drag.s + (cy - drag.y0);
      if (n < 0) n = -rubber(-n, H());
      y = n; paint();
      drag.h.push([cy, e.timeStamp]); if (drag.h.length > 6) drag.h.shift();
    }, { passive: false });
    const end = () => {
      if (!drag) return;
      const d = drag; drag = null;
      if (!d.on) { if (closing) api.close(v); else if (y !== 0) animate(0); return; }
      const a = d.h[0], b = d.h[d.h.length - 1];
      const vel = b[1] > a[1] ? (b[0] - a[0]) / ((b[1] - a[1]) / 1000) : 0;
      if (y + project(vel) > H() * 0.45 && vel > -50) { if (!closing && opts.onDismiss) opts.onDismiss(vel); else api.close(vel); }
      else {
        const wasClosing = closing; closing = false;
        if (wasClosing && opts.onReopen) opts.onReopen();
        animate(0, { damping: Math.abs(vel) > 300 ? 0.8 : 1, response: 0.3, velocity: vel });
      }
    };
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);

    y = H(); paint();
    return api;
  }

  window.TM = window.TM || {};
  TM.fluid = { sheet, project, rubber };
})();
