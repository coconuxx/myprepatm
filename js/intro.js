// Animation de lancement + visites guidées (contenu des visites : js/tours.js).
(function () {
  // ---------- Lancement ----------
  const splash = document.getElementById('splash');
  if (splash) {
    const done = () => { if (splash.parentNode) splash.remove(); };
    splash.addEventListener('animationend', (e) => { if (e.target === splash) done(); });
    splash.addEventListener('pointerdown', () => splash.classList.add('skip'), { once: true }); // un toucher : on passe
    setTimeout(done, 2600); // sécurité si l'animation ne se termine pas
  }

  // ---------- Visite guidée ----------
  const KEY = 'tm_tour';
  const TOURS = window.TM_TOURS || { FIRST: [], BY_VERSION: {} };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function seen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function mark(fields) { try { localStorage.setItem(KEY, JSON.stringify(Object.assign(seen(), fields))); } catch (e) {} }

  let running = false;
  function run(steps, opts = {}) {
    const list = steps.filter((st) => (!st.view || (document.body.dataset.view || 'home') === st.view) && document.querySelector(st.target));
    if (!list.length || running) { if (opts.onEnd) opts.onEnd(); return; }
    running = true;
    const root = document.createElement('div');
    root.className = 'tour';
    root.innerHTML = `<div class="tour-hole"></div>
      <div class="tour-tip" role="dialog" aria-modal="true" aria-labelledby="tour-t" aria-describedby="tour-d">
        <p class="tour-step" id="tour-n"></p><h2 id="tour-t"></h2><p id="tour-d"></p>
        <div class="tour-acts"><button type="button" class="btn ghost" id="tour-skip">Passer</button><button type="button" class="btn primary" id="tour-next">Suivant</button></div>
      </div>`;
    document.body.appendChild(root);
    const hole = root.querySelector('.tour-hole'), tip = root.querySelector('.tour-tip');
    let i = 0;
    const end = () => {
      running = false; root.classList.add('out');
      document.removeEventListener('keydown', onKey); window.removeEventListener('resize', place); window.removeEventListener('scroll', place);
      setTimeout(() => root.remove(), reduce() ? 0 : 220);
      if (opts.onEnd) opts.onEnd();
    };
    function place() {
      const el = document.querySelector(list[i].target); if (!el) return;
      const r = el.getBoundingClientRect(), pad = 8;
      hole.style.cssText = `top:${r.top - pad}px;left:${r.left - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px`;
      const tw = Math.min(320, innerWidth - 24); tip.style.width = tw + 'px';
      const left = Math.max(12, Math.min(innerWidth - tw - 12, r.left + r.width / 2 - tw / 2));
      const th = tip.offsetHeight; const below = r.bottom + pad + 14 + th < innerHeight - 8;
      tip.style.left = left + 'px';
      tip.style.top = (below ? r.bottom + pad + 14 : Math.max(12, r.top - pad - 14 - th)) + 'px';
      tip.dataset.side = below ? 'below' : 'above';
      tip.style.setProperty('--arrow', Math.max(18, Math.min(tw - 18, r.left + r.width / 2 - left)) + 'px');
    }
    function show() {
      const st = list[i]; const el = document.querySelector(st.target);
      root.querySelector('#tour-n').textContent = `${i + 1} / ${list.length}`;
      root.querySelector('#tour-t').textContent = st.title;
      root.querySelector('#tour-d').textContent = st.text;
      root.querySelector('#tour-next').textContent = i === list.length - 1 ? (opts.last || 'C’est parti !') : 'Suivant';
      const r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > innerHeight - 90) el.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' });
      tip.classList.remove('in'); void tip.offsetWidth; tip.classList.add('in');
      setTimeout(place, reduce() ? 0 : 280); place();
      root.querySelector('#tour-next').focus({ preventScroll: true });
    }
    const next = () => { if (i < list.length - 1) { i++; show(); } else end(); };
    const onKey = (e) => { if (e.key === 'Escape') end(); else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next(); } };
    root.querySelector('#tour-next').onclick = next;
    root.querySelector('#tour-skip').onclick = end;
    hole.onclick = next; // toucher la zone montrée = suivant
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true }); // la découpe suit la page pendant qu'elle défile
    show();
  }

  // Quand lancer une visite : sur l'accueil, compte connecté, avatar créé, rien d'autre d'ouvert
  function maybe() {
    if (running || document.body.dataset.view !== 'home' || document.body.classList.contains('acc-gated') || document.body.classList.contains('onboarding')) return;
    if (document.getElementById('splash') || document.querySelector('.upd-bg, .sheet-bg, .tour')) { setTimeout(maybe, 600); return; }
    const s = seen(); const ver = window.TM_VERSION || '0';
    if (!s.first) { mark({ first: true, v: ver }); run(TOURS.FIRST); return; }
    const vt = TOURS.BY_VERSION && TOURS.BY_VERSION[ver];
    if (vt && s.v !== ver) { mark({ v: ver }); run(vt, { last: 'Compris' }); }
  }
  let t = 0;
  const later = () => { clearTimeout(t); t = setTimeout(maybe, 700); };
  window.addEventListener('load', later);
  window.addEventListener('hashchange', later);
  // Fin de la création d'avatar : l'accueil s'affiche sans changer d'adresse ; on suit donc les changements de page
  new MutationObserver(later).observe(document.body, { attributes: true, attributeFilter: ['data-view', 'class'] });

  window.TM = window.TM || {};
  TM.tour = { run, replay: () => { location.hash = ''; setTimeout(() => run(TOURS.FIRST), 500); } };
})();
