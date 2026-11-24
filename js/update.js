// Mises à jour : à chaque ouverture (et au retour dans l'appli), on regarde si une version plus récente
// est en ligne (version.json). Si oui, l'appli se recharge toute seule avec les nouveaux fichiers, sauf
// en plein exercice, puis affiche « Nouveautés ». Pas de service worker : la bêta reste simple.
(function () {
  const CUR = window.TM_VERSION || '0';
  const SEEN = 'tm_seen_version';
  let last = 0, info = null;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function fetchInfo() {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('version.json');
    return (info = await r.json());
  }
  async function check() {
    if (Date.now() - last < 60e3) return;
    last = Date.now();
    try {
      const v = await fetchInfo();
      if (!v.version || v.version === CUR) return;
      if (new URLSearchParams(location.search).get('v') === v.version) return; // déjà rechargée : pas de boucle
      if (document.body.classList.contains('focus')) { last = 0; return; } // en plein exercice : plus tard
      location.replace(location.pathname + '?v=' + encodeURIComponent(v.version) + location.hash);
    } catch (e) { /* hors ligne : on garde la version en place */ }
  }

  function showNotes(force) {
    let seen = null;
    try { seen = localStorage.getItem(SEEN); localStorage.setItem(SEEN, CUR); } catch (e) {}
    if (!force && (seen === CUR || seen === null)) return; // déjà vues, ou toute première ouverture
    const go = (v) => {
      const h = (v && v.history || []).find((x) => x.version === CUR);
      if (!h || !h.notes || !h.notes.length || document.querySelector('.upd-bg')) return;
      const bg = document.createElement('div');
      bg.className = 'upd-bg';
      bg.innerHTML = `<div class="upd-card" role="dialog" aria-modal="true" aria-labelledby="upd-t">
        <h2 id="upd-t">Nouveautés</h2><p class="upd-v">Version ${esc(CUR)}${h.date ? ' · ' + esc(new Date(h.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })) : ''}</p>
        <ul>${h.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
        <button class="btn primary big-btn" type="button">C’est parti</button></div>`;
      const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
      const onKey = (e) => { if (e.key === 'Escape') close(); };
      bg.onclick = (e) => { if (e.target === bg || e.target.closest('button')) close(); };
      document.addEventListener('keydown', onKey);
      document.body.appendChild(bg);
      bg.querySelector('button').focus({ preventScroll: true });
    };
    if (info) go(info); else fetchInfo().then(go, () => {});
  }

  check();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
  window.addEventListener('load', () => setTimeout(() => showNotes(false), 400));
  window.TM = window.TM || {};
  TM.update = { version: CUR, check, showNotes };
})();
