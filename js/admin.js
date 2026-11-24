// Mode administrateur de la version bêta.
// Accès par lien secret, vérifié dans le navigateur (empreinte SHA-256, voir admin-config.js).
// C'est un verrou de confort, pas une vraie sécurité : un site sans serveur ne peut pas protéger
// un accès administrateur. La gestion des utilisateurs bêta demandera un serveur.
(function () {
  const KEY = 'tm_admin';
  const CFG = window.TM_ADMIN_CONFIG || { keys: [] };

  // SHA-256 en JavaScript pur : crypto.subtle n'existe pas en http:// sur le Wi-Fi local
  function sha256(str) {
    const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    const bytes = new TextEncoder().encode(str);
    const len = bytes.length; const nBlocks = ((len + 9 + 63) >> 6);
    const w = new Uint32Array(nBlocks * 16);
    for (let i = 0; i < len; i++) w[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
    w[len >> 2] |= 0x80 << (24 - (len % 4) * 8);
    w[nBlocks * 16 - 1] = len * 8;
    let h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const r = (x, n) => (x >>> n) | (x << (32 - n));
    const m = new Uint32Array(64);
    for (let b = 0; b < nBlocks; b++) {
      for (let t = 0; t < 64; t++) {
        if (t < 16) m[t] = w[b * 16 + t];
        else {
          const s0 = r(m[t - 15], 7) ^ r(m[t - 15], 18) ^ (m[t - 15] >>> 3);
          const s1 = r(m[t - 2], 17) ^ r(m[t - 2], 19) ^ (m[t - 2] >>> 10);
          m[t] = (m[t - 16] + s0 + m[t - 7] + s1) | 0;
        }
      }
      let [a, bb, c, d, e, f, g, hh] = h;
      for (let t = 0; t < 64; t++) {
        const t1 = (hh + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + m[t]) | 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & bb) ^ (a & c) ^ (bb & c))) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      h = h.map((v, i) => (v + [a, bb, c, d, e, f, g, hh][i]) | 0);
    }
    return h.map((v) => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }

  // Accès administrateur par lien secret uniquement (« …#cle=<jeton> »), créé sur le Mac avec admin-links.py.
  // Le jeton n'est jamais écrit dans l'appli : seule son empreinte SHA-256 figure dans admin-config.js.
  // Le fragment « #… » d'une adresse n'est jamais envoyé au serveur. Retirer un lien de admin-config.js
  // le désactive au prochain chargement, sur tous les appareils qui l'avaient utilisé.
  const KEYS = Array.isArray(CFG.keys) ? CFG.keys : [];
  const known = (h) => KEYS.some((k) => k.hash === h);
  // On garde le jeton lui-même sur l'appareil (pas son empreinte, qui est publique dans admin-config.js) :
  // recopier l'empreinte à la main ne suffit donc pas pour devenir administrateur.
  let cache = null;
  function isAdmin() {
    try {
      const t = localStorage.getItem(KEY);
      if (!t) return false;
      if (!cache || cache.t !== t) cache = { t, ok: known(sha256(t)) };
      return cache.ok;
    } catch (e) { return false; }
  }
  function lock() { try { localStorage.removeItem(KEY); } catch (e) {} applyBadge(); }
  function applyBadge() { document.body.classList.toggle('is-admin', isAdmin()); }
  // Lien reçu : on vérifie, on mémorise, puis on efface le jeton de la barre d'adresse et de l'historique
  let linkResult = null;
  (function readLink() {
    const m = /^#cle=([A-Za-z0-9_-]{16,})$/.exec(location.hash || '');
    if (!m) return;
    const h = sha256(m[1]);
    if (known(h)) { try { localStorage.setItem(KEY, m[1]); } catch (e) {} linkResult = 'ok'; }
    else linkResult = 'bad';
    try { history.replaceState(null, '', location.pathname + location.search + '#'); } catch (e) { location.hash = ''; }
  })();
  if (!isAdmin()) { try { localStorage.removeItem(KEY); } catch (e) {} } // lien retiré : accès perdu
  window.addEventListener('load', () => {
    if (!linkResult || !TM.rewards) return;
    if (linkResult === 'ok') TM.rewards.toast(TM.icon('check'), 'Mode administrateur activé sur cet appareil');
    else TM.rewards.toast(TM.icon('x'), 'Ce lien administrateur n’est plus valable');
  });

  // Section « Administration » des Réglages : invisible pour les autres utilisateurs
  function settingsHTML() {
    if (!isAdmin()) return '';
    return `<div class="field admin-box on">
        <span>Administration <b class="admin-tag">Admin</b></span>
        <div class="admin-tools">
          <button class="btn" id="adm-coins" type="button">+100 pièces</button>
          <button class="btn" id="adm-xp" type="button">+200 XP</button>
          <button class="btn" id="adm-day" type="button">Rejouer la mission du jour</button>
        </div>
        <p class="muted admin-soon">Les liens d’accès administrateur se créent et se retirent sur le Mac (admin-links.py). Utilisateurs bêta : bientôt, leur gestion demandera un serveur.</p>
        <button class="btn ghost" id="adm-off" type="button">Quitter le mode administrateur sur cet appareil</button>
      </div>`;
  }
  function bind(rerender) {
    const $ = (id) => document.getElementById(id);
    const R = TM.rewards;
    if ($('adm-coins')) $('adm-coins').onclick = (e) => R.addCoins(100, e.currentTarget);
    if ($('adm-xp')) $('adm-xp').onclick = () => { R.addXP(200); R.renderHud(); };
    if ($('adm-day')) $('adm-day').onclick = () => {
      const P = R.profile; const d = R.today();
      const strip = (o) => { const c = Object.assign({}, o); delete c[d]; return c; };
      R.setProfile({ daily: strip(P.daily), missions: strip(P.missions || {}), days: strip(P.days) });
      R.toast(TM.icon('check'), 'Mission du jour remise à zéro');
    };
    if ($('adm-off')) $('adm-off').onclick = () => { lock(); rerender(); };

    // Entrée cachée pour l'appli installée sur l'iPhone : elle ne partage pas la mémoire de Safari, et un lien
    // touché s'ouvre toujours dans Safari. 5 touches rapides sur la ligne « version » font apparaître un champ
    // où coller le lien. Sans lien valide, ce champ ne donne rien.
    const ver = document.querySelector('.app-version');
    if (!ver || isAdmin()) return;
    let taps = [];
    ver.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const now = Date.now(); taps = taps.filter((t) => now - t < 3000); taps.push(now);
      if (taps.length < 5 || $('adm-paste')) return;
      const box = document.createElement('div');
      box.className = 'field admin-box';
      box.innerHTML = `<span>Lien administrateur</span>
        <div class="admin-row"><input id="adm-paste" type="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Colle ton lien ici"><button class="btn" id="adm-paste-go" type="button">Valider</button></div>
        <small class="admin-msg" id="adm-msg" role="status"></small>`;
      ver.after(box);
      const input = $('adm-paste'); input.focus();
      const tryIt = () => {
        const m = /(?:#cle=)?([A-Za-z0-9_-]{16,})\s*$/.exec(input.value.trim());
        if (m && known(sha256(m[1]))) {
          try { localStorage.setItem(KEY, m[1]); } catch (err) {}
          applyBadge(); R.toast(TM.icon('check'), 'Mode administrateur activé sur cet appareil'); rerender();
        } else { $('adm-msg').textContent = 'Ce lien n’est pas valable.'; input.value = ''; }
      };
      $('adm-paste-go').onclick = tryIt;
      input.onkeydown = (ev) => { if (ev.key === 'Enter') tryIt(); };
    });
  }

  TM.admin = { isAdmin, lock, settingsHTML, bind, sha256 };
  applyBadge();
})();
