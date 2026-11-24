// Comptes MyPrépaTM : pseudo + mot de passe, enregistrés SUR L'APPAREIL (pas encore de serveur).
//
// - Chaque compte a sa propre progression. La progression du compte connecté vit dans les clés habituelles
//   (tm_profile, tm_history, tm_errors, tm_social, tm_used_*…) : les autres modules n'ont rien à changer.
//   À la déconnexion, ces clés sont rangées dans tm_acc_<id>, puis vidées ; à la connexion, on les remet.
// - La connexion est gardée : on ne se reconnecte pas à chaque ouverture, seulement après « Se déconnecter ».
// - Mot de passe : seule une empreinte salée (SHA-256 répété) est gardée, jamais le mot de passe.
// - L'administrateur (lien secret, admin.js) gère les comptes DE CET APPAREIL : liste, suspendre, supprimer,
//   modifier la progression. Gérer les comptes de tous les téléphones demandera un serveur.
(function () {
  const ACC = 'tm_accounts';
  const BLOB = 'tm_acc_';
  const DEVICE_KEYS = ['tm_accounts', 'tm_admin', 'tm_seen_version']; // propres à l'appareil, jamais rangées dans un compte
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const I = (n) => (TM.icon ? TM.icon(n) : '');

  // Demande au navigateur de ne pas effacer les données de l'appli quand l'appareil manque de place
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  // ---------- Stockage ----------
  function read() {
    try { const s = JSON.parse(localStorage.getItem(ACC) || 'null'); if (s && Array.isArray(s.list)) return s; } catch (e) {}
    return { list: [], current: null };
  }
  function write(s) { try { localStorage.setItem(ACC, JSON.stringify(s)); } catch (e) {} }
  const dataKeys = () => Object.keys(localStorage).filter((k) => k.startsWith('tm_') && !k.startsWith(BLOB) && !DEVICE_KEYS.includes(k));
  // Vraie progression déjà présente (et pas seulement le profil vide que l'appli crée au démarrage)
  const hasData = () => {
    try {
      const P = JSON.parse(localStorage.getItem('tm_profile') || '{}');
      const h = JSON.parse(localStorage.getItem('tm_history') || '[]');
      return !!(P.onboarded || P.xp > 0 || P.coins > 0 || h.length);
    } catch (e) { return false; }
  };
  function snapshot(id) {
    const blob = {}; dataKeys().forEach((k) => { blob[k] = localStorage.getItem(k); });
    try { localStorage.setItem(BLOB + id, JSON.stringify(blob)); } catch (e) {}
  }
  function clearData() { dataKeys().forEach((k) => localStorage.removeItem(k)); }
  function restore(id) {
    let blob = {}; try { blob = JSON.parse(localStorage.getItem(BLOB + id) || '{}'); } catch (e) {}
    Object.entries(blob).forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch (e) {} });
  }
  const findByName = (s, name) => s.list.find((a) => a.username.toLowerCase() === String(name).trim().toLowerCase());
  const byId = (s, id) => s.list.find((a) => a.id === id);
  const now = () => new Date().toISOString();

  // Empreinte du mot de passe : SHA-256 répété, avec un sel propre au compte
  function hashPass(salt, pass) {
    let h = TM.admin.sha256(salt + '|' + pass);
    for (let i = 0; i < 2000; i++) h = TM.admin.sha256(h + salt);
    return h;
  }
  const randHex = (n) => { const a = new Uint8Array(n); (crypto || window.msCrypto).getRandomValues(a); return [...a].map((b) => b.toString(16).padStart(2, '0')).join(''); };

  // ---------- État ----------
  function current() { const s = read(); return s.current ? byId(s, s.current) || null : null; }
  function needsGate() {
    const s = read(); const c = s.current && byId(s, s.current);
    if (c && c.suspended) { s.current = null; write(s); clearData(); return true; } // suspendu : déconnecté
    return !c;
  }
  function touch() { const s = read(); const c = s.current && byId(s, s.current); if (c) { c.lastSeen = now(); write(s); } }
  function reloadHome() { location.hash = ''; location.reload(); }

  function validName(u) { return /^[A-Za-z0-9_.-]{3,20}$/.test(u); }
  function create(username, pass) {
    const s = read(); username = String(username).trim();
    if (!validName(username)) return 'Pseudo : 3 à 20 caractères (lettres sans accent, chiffres, « _ », « - » ou « . »).';
    if (findByName(s, username)) return 'Ce pseudo est déjà pris sur cet appareil.';
    if (String(pass).length < 6) return 'Mot de passe : au moins 6 caractères.';
    const id = 'u' + randHex(6); const salt = randHex(16);
    const adopt = !s.list.length && !s.current; // premier compte : on lui rattache la progression déjà présente
    if (!adopt) { if (s.current) snapshot(s.current); clearData(); }
    s.list.push({ id, username, salt, hash: hashPass(salt, pass), created: now(), lastSeen: now(), suspended: false });
    s.current = id; write(s);
    try {
      const P = JSON.parse(localStorage.getItem('tm_profile') || '{}');
      if (!P.name) { P.name = username; localStorage.setItem('tm_profile', JSON.stringify(P)); }
    } catch (e) {}
    reloadHome(); return null;
  }
  function login(username, pass) {
    const s = read(); const a = findByName(s, username);
    if (!a || hashPass(a.salt, pass) !== a.hash) return 'Pseudo ou mot de passe incorrect.';
    if (a.suspended) return 'Ce compte est suspendu. Contacte l’équipe MyPrépaTM.';
    if (s.current && s.current !== a.id) snapshot(s.current);
    clearData(); restore(a.id); localStorage.removeItem(BLOB + a.id);
    s.current = a.id; a.lastSeen = now(); write(s);
    reloadHome(); return null;
  }
  // « Supprimer mon compte et mes données » (page Confidentialité) : seulement le compte connecté,
  // les autres comptes de l'appareil et les réglages de l'appareil restent.
  function deleteCurrent() {
    const s = read(); const id = s.current;
    clearData();
    if (id) { s.list = s.list.filter((a) => a.id !== id); try { localStorage.removeItem(BLOB + id); } catch (e) {} }
    s.current = null; write(s); reloadHome();
  }
  function logout() {
    const s = read(); if (!s.current) return;
    snapshot(s.current); clearData(); s.current = null; write(s); reloadHome();
  }

  // ---------- Écran de connexion ----------
  let mode = null;
  function gate($app) {
    const s = read();
    if (!mode) mode = s.list.length ? 'login' : 'create';
    const legacy = !s.list.length && hasData();
    const isCreate = mode === 'create';
    $app.innerHTML = `<section class="acc-gate pop-in" aria-labelledby="acc-t">
      <div class="acc-logo" aria-hidden="true"><svg viewBox="12 26 80 56" width="64" height="45"><g fill="none" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,74 20,34 41,56 62,34 62,50" stroke="var(--brand-m)"/><polyline points="52,62 63,73 84,40" stroke="#ff7a55"/></g></svg></div>
      <h1 id="acc-t">${isCreate ? (legacy ? 'Crée ton compte' : 'Bienvenue sur MyPrépaTM') : 'Connexion'}</h1>
      <p class="acc-sub">${isCreate ? (legacy ? 'Ta progression actuelle sera rattachée à ce compte : tu la retrouveras à chaque ouverture.' : 'Crée ton compte pour garder ta progression à chaque ouverture.') : 'Content de te revoir !'}</p>
      ${s.list.length ? `<div class="seg acc-tabs" role="tablist">
        <button type="button" role="tab" data-m="login" class="${!isCreate ? 'on' : ''}" aria-selected="${!isCreate}">Se connecter</button>
        <button type="button" role="tab" data-m="create" class="${isCreate ? 'on' : ''}" aria-selected="${isCreate}">Créer un compte</button></div>` : ''}
      <form id="acc-form" class="acc-form" novalidate>
        <label class="field"><span>Pseudo</span><input id="acc-user" name="username" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="20" required></label>
        <label class="field"><span>Mot de passe</span><input id="acc-pass" name="password" type="password" autocomplete="${isCreate ? 'new-password' : 'current-password'}" minlength="6" required></label>
        ${isCreate ? '<label class="field"><span>Confirme le mot de passe</span><input id="acc-pass2" type="password" autocomplete="new-password" minlength="6" required></label>' : ''}
        <p class="acc-msg" id="acc-msg" role="alert"></p>
        <button class="btn primary big-btn" type="submit">${isCreate ? 'Créer mon compte' : 'Me connecter'}</button>
      </form>
      <p class="acc-note">Ton compte et ta progression sont enregistrés sur cet appareil uniquement. Retiens bien ton mot de passe : sans serveur, il ne peut pas être récupéré.</p>
      <p class="acc-legal"><a href="#privacy">Confidentialité</a> · <a href="#legal">Mentions légales</a></p>
    </section>`;
    $app.querySelectorAll('.acc-tabs button').forEach((b) => { b.onclick = () => { mode = b.dataset.m; gate($app); }; });
    const $ = (id) => document.getElementById(id);
    $('acc-user').focus({ preventScroll: true });
    $('acc-form').onsubmit = (e) => {
      e.preventDefault();
      const u = $('acc-user').value, p = $('acc-pass').value;
      let err = null;
      if (!u.trim() || !p) err = 'Remplis le pseudo et le mot de passe.';
      else if (isCreate && p !== $('acc-pass2').value) err = 'Les deux mots de passe ne correspondent pas.';
      else err = isCreate ? create(u, p) : login(u, p);
      if (err) { $('acc-msg').textContent = err; $('acc-pass').value = ''; if ($('acc-pass2')) $('acc-pass2').value = ''; }
    };
  }

  // ---------- Réglages : compte connecté ----------
  function settingsHTML() {
    const c = current(); if (!c) return '';
    return `<div class="field acc-box"><span>Compte</span>
      <p class="acc-who">Connecté en tant que <b>${esc(c.username)}</b></p>
      <button class="btn ghost" id="acc-logout" type="button">Se déconnecter</button></div>`;
  }
  function bindSettings() {
    const b = document.getElementById('acc-logout');
    if (b) b.onclick = () => { if (confirm('Te déconnecter ? Ta progression reste enregistrée sur cet appareil.')) logout(); };
  }

  // ---------- Administration : comptes de cet appareil ----------
  function profileOf(s, a) {
    try {
      if (a.id === s.current) return JSON.parse(localStorage.getItem('tm_profile') || '{}');
      const blob = JSON.parse(localStorage.getItem(BLOB + a.id) || '{}');
      return JSON.parse(blob.tm_profile || '{}');
    } catch (e) { return {}; }
  }
  function editProfile(s, a, fn) {
    if (a.id === s.current) { const R = TM.rewards; fn(R.profile); R.setProfile({}); return; }
    let blob = {}; try { blob = JSON.parse(localStorage.getItem(BLOB + a.id) || '{}'); } catch (e) {}
    let P = {}; try { P = JSON.parse(blob.tm_profile || '{}'); } catch (e) {}
    fn(P); blob.tm_profile = JSON.stringify(P);
    try { localStorage.setItem(BLOB + a.id, JSON.stringify(blob)); } catch (e) {}
  }
  const fmt = (iso) => { try { return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return '?'; } };
  function adminHTML() {
    const s = read(); const R = TM.rewards;
    const rows = s.list.map((a) => {
      const P = profileOf(s, a); const lvl = R.levelInfo(P.xp || 0).level; const me = a.id === s.current;
      return `<details class="acc-row ${a.suspended ? 'off' : ''}" data-id="${a.id}">
        <summary><b>${esc(a.username)}</b>${me ? ' <span class="acc-me">connecté</span>' : ''}${a.suspended ? ' <span class="acc-off">suspendu</span>' : ''}
          <small>Niveau ${lvl} · ${P.coins || 0} pièces · ${P.xp || 0} XP</small></summary>
        <p class="acc-meta">Créé le ${fmt(a.created)} · dernière activité le ${fmt(a.lastSeen)}</p>
        <div class="admin-tools">
          <button class="btn" type="button" data-act="coins+">+100 pièces</button>
          <button class="btn" type="button" data-act="coins-">−100 pièces</button>
          <button class="btn" type="button" data-act="xp">+200 XP</button>
          <button class="btn" type="button" data-act="day">Mission du jour à zéro</button>
          ${me ? '' : `<button class="btn" type="button" data-act="susp">${a.suspended ? 'Réactiver' : 'Suspendre'}</button>`}
          <button class="btn danger" type="button" data-act="del">Supprimer</button>
        </div></details>`;
    }).join('');
    return `<div class="acc-admin"><span class="acc-admin-h">Comptes de cet appareil (${s.list.length})</span>
      ${rows || '<p class="muted">Aucun compte sur cet appareil.</p>'}
      <p class="muted acc-note">Seuls les comptes créés sur cet appareil apparaissent ici. Gérer les comptes de tous les téléphones demandera un serveur.</p></div>`;
  }
  function adminBind(rerender) {
    document.querySelectorAll('.acc-row [data-act]').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.closest('.acc-row').dataset.id; const s = read(); const a = byId(s, id); if (!a) return;
        const R = TM.rewards; const act = btn.dataset.act; const d = R.today();
        const strip = (o) => { const c = Object.assign({}, o || {}); delete c[d]; return c; };
        if (act === 'coins+') editProfile(s, a, (P) => { P.coins = (P.coins || 0) + 100; });
        else if (act === 'coins-') editProfile(s, a, (P) => { P.coins = Math.max(0, (P.coins || 0) - 100); });
        else if (act === 'xp') { if (a.id === s.current) R.addXP(200); else editProfile(s, a, (P) => { P.xp = (P.xp || 0) + 200; }); }
        else if (act === 'day') editProfile(s, a, (P) => { P.daily = strip(P.daily); P.missions = strip(P.missions); P.days = strip(P.days); });
        else if (act === 'susp') { a.suspended = !a.suspended; write(s); }
        else if (act === 'del') {
          if (!confirm(`Supprimer définitivement le compte « ${a.username} » et toute sa progression ? C’est irréversible.`)) return;
          s.list = s.list.filter((x) => x.id !== id); localStorage.removeItem(BLOB + id);
          if (s.current === id) { s.current = null; write(s); clearData(); reloadHome(); return; }
          write(s);
        }
        R.renderHud(); R.toast(I('check'), 'Compte mis à jour');
        const y = window.scrollY; rerender();
        const again = document.querySelector(`.acc-row[data-id="${id}"]`); if (again) again.open = true;
        // rester au même endroit (la page Réglages se replace d'elle-même au rendu suivant : on passe après)
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y })));
      };
    });
  }

  touch();
  window.TM = window.TM || {};
  TM.accounts = { needsGate, gate, current, logout, deleteCurrent, settingsHTML, bindSettings, adminHTML, adminBind };
})();
