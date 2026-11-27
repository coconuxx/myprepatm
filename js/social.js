// Social : code ami, invitation (lien + QR code), amis, classement, profil public.
//
// AUCUN JOUEUR SIMULÉ : sans serveur, l'appli ne connaît aucun autre joueur. Les listes
// d'amis et le classement ne montrent donc que l'utilisateur tant que la section « Réseau »
// ci-dessous n'est pas branchée sur un serveur (prévenir l'agent juridique avant).
// Ancienne version avec joueurs simulés et défis : archives/social-avec-joueurs-simules.js
// (non publiée), réutilisable pour brancher les défis 1 contre 1 sur le serveur.
(function () {
  const R = TM.rewards;
  const F = TM.FORMAT;
  const I = TM.icon;
  const KEY = 'tm_social';
  const $app = () => document.getElementById('app');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => Date.now();
  const DAY = 864e5;
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randCode = (n) => Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');

  // ---------- Stockage ----------
  // players : fiches publiques des autres joueurs, remplies par le serveur (vide sans serveur)
  const DEFAULT = { account: null, friends: [], sent: [], incoming: [], duels: [], players: {}, week: null };
  let S;
  // Anciens joueurs simulés (ids « b0 », « b1 »…) : retirés des données enregistrées
  const isSimulated = (id) => /^b\d+$/.test(String(id || ''));
  function cleanSimulated() {
    let changed = false;
    const keep = (arr, idOf) => { const out = arr.filter((x) => !isSimulated(idOf(x))); if (out.length !== arr.length) changed = true; return out; };
    S.friends = keep(S.friends, (x) => x);
    S.sent = keep(S.sent, (x) => x.id);
    S.incoming = keep(S.incoming, (x) => x.id);
    const duels = S.duels.filter((d) => d.opp && !isSimulated(d.opp) && !isSimulated(d.host));
    if (duels.length !== S.duels.length) { S.duels = duels; changed = true; }
    ['seedAt', 'lastBotInvite', 'seen', 'pendingInvite', 'loggedIn'].forEach((k) => { if (k in S) { delete S[k]; changed = true; } });
    return changed;
  }
  function load() {
    try { S = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEFAULT); }
    if (localStorage.getItem(KEY) !== null && cleanSimulated()) save();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  load();

  // ---------- Réseau (à brancher sur un serveur) ----------
  // Sans serveur, ces fonctions ne trouvent personne. Un serveur devra :
  // retrouver un joueur par code ou pseudo, envoyer/accepter les demandes d'amis,
  // et renvoyer la fiche publique de chaque ami : { id, pseudo, code, look, equip, stats }.
  const Net = {
    online: false,
    findByCode: () => null,
    search: () => [],
    player: (id) => S.players[id] || null,
  };

  // ---------- Compte ----------
  // Le compte social suit le vrai compte de l'appareil (js/accounts.js) : un seul pseudo,
  // une seule connexion. Aucun e-mail ni mot de passe n'est stocké par ce module.
  function me() {
    const c = TM.accounts && TM.accounts.current && TM.accounts.current();
    if (!c) return null;
    if (!S.account || S.account.linked !== c.id) {
      S.account = { id: c.id, linked: c.id, pseudo: c.username, code: (S.account && S.account.code) || 'TAGE-' + randCode(4), createdAt: (S.account && S.account.createdAt) || new Date(c.created || now()).toISOString() };
      save();
    } else if (S.account.pseudo !== c.username) { S.account.pseudo = c.username; save(); }
    return S.account;
  }

  // ---------- Statistiques ----------
  function weekId(d = new Date()) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return t.getUTCFullYear() + '-W' + String(Math.ceil(((t - y0) / DAY + 1) / 7)).padStart(2, '0');
  }
  function myStats() {
    const P = R.profile; const L = R.levelInfo();
    const wk = weekId();
    if (!S.week || S.week.id !== wk) { S.week = { id: wk, xp0: P.xp }; save(); }
    const hist = (() => { try { return JSON.parse(localStorage.getItem('tm_history') || '[]'); } catch (e) { return []; } })();
    const acc = {}; F.subtests.forEach((t) => (acc[t.id] = { c: 0, n: 0 }));
    hist.forEach((h) => Object.entries(h.results || {}).forEach(([id, r]) => { if (acc[id]) { acc[id].c += r.correct; acc[id].n += r.total; } }));
    const sub = {}; F.subtests.forEach((t) => { sub[t.id] = acc[t.id].n ? Math.round((acc[t.id].c / acc[t.id].n) * 100) : null; });
    return { xp: P.xp, level: L.level, title: L.title, weekXP: Math.max(0, P.xp - S.week.xp0), streak: R.currentStreak(), bestExam: P.bestExam || null, sub, badges: R.BADGES.filter((b) => P.badges[b.id]).map((b) => b.id) };
  }
  const statsOf = (id) => (id === 'me' ? myStats() : (Net.player(id) || {}).stats || null);
  const knownFriends = () => S.friends.filter((id) => Net.player(id));

  // ---------- Avatar ----------
  function avatar(id, size = 48) {
    if (id === 'me') return R.mascotSVG({ size, frame: true });
    const p = Net.player(id) || {};
    return TM.mascot.svg({ look: p.look, equip: p.equip || {}, level: (p.stats && p.stats.level) || 1, size });
  }
  const nameOf = (id) => (id === 'me' ? (me() ? me().pseudo : 'Moi') : (Net.player(id) || {}).pseudo || 'Joueur');

  // ---------- Amis ----------
  const isFriend = (id) => S.friends.includes(id);
  const inviteLink = () => location.origin + location.pathname + '#invite/' + me().code;

  function pendingCount() { return me() ? S.incoming.filter((x) => Net.player(x.id)).length : 0; }
  function updateDot() {
    const a = document.querySelector('.nav a[data-view="profile"]');
    if (a) a.classList.toggle('social-dot', pendingCount() > 0);
  }

  // ---------- Vues ----------
  const route = () => location.hash.replace('#', '').split('/');
  const TABS = [['', 'Profil', 'award'], ['friends', 'Amis', 'heart'], ['duels', 'Défis', 'zap']];
  function tabs(cur) {
    const badge = { friends: pendingCount() };
    return `<nav class="social-tabs" aria-label="Moi et mes amis">${TABS.map(([id, l, ic]) => `<a href="#profile${id ? '/' + id : ''}" class="${cur === (id || 'me') ? 'on' : ''}" ${cur === (id || 'me') ? 'aria-current="page"' : ''}>${I(ic)}<span>${l}</span>${badge[id] ? `<small>${badge[id]}</small>` : ''}</a>`).join('')}</nav>`;
  }
  const handles = (arg) => ['friends', 'ranking', 'duels', 'u', 'account'].includes(arg);
  function view(arg) {
    const r = route();
    if (!me()) return noAccountView(arg);
    if (arg === 'friends') return friendsView();
    if (arg === 'ranking') return rankingView(r[2]);
    if (arg === 'duels') return duelsView();
    if (arg === 'u') return publicView(r[2]);
    if (arg === 'account') return accountView();
  }
  // Le classement a son propre onglet dans la barre du bas : pas d'onglets du profil au-dessus.
  const page = (cur, html) => { $app().innerHTML = (cur === 'ranking' ? '' : tabs(cur)) + `<div class="social-page pop-in">${html}</div>`; };
  const shareBlock = () => `<div class="row center"><button class="btn primary" data-social-share>${I('check')} Copier mon lien</button><button class="btn" data-social-qr>${I('target')} Mon QR code</button></div>`;
  function wireShare() {
    const a = me();
    $app().querySelectorAll('[data-social-share]').forEach((b) => { b.onclick = () => share(inviteLink(), `Rejoins-moi sur MyPrépaTM ! Mon code ami : ${a.code}`); });
    $app().querySelectorAll('[data-social-qr]').forEach((b) => { b.onclick = () => modal(`<h2>Ajoute-moi</h2><p class="muted">Scanne ce code avec l’appareil photo du téléphone.</p><div class="social-qr">${TM.qr.svg(inviteLink(), 220)}</div><b class="social-code">${a.code}</b>`); });
  }
  const emptyInvite = (icon, title, text) => `<div class="social-card center social-empty">
      <div class="social-empty-ico">${I(icon)}</div><h2>${title}</h2><p class="muted">${text}</p>
      <p class="social-empty-code">Ton code ami <b class="social-code">${me().code}</b></p>${shareBlock()}</div>`;

  // ----- Sans compte (normalement impossible : l'appli demande de se connecter au lancement) -----
  function noAccountView(arg) {
    page(arg || 'friends', `<div class="social-card center"><h1>Connecte-toi</h1><p class="muted">Connecte-toi à ton compte pour retrouver tes amis et le classement.</p><a class="btn primary" href="#">Retour à l’accueil</a></div>`);
  }

  // ----- Compte -----
  function accountView() {
    const a = me();
    page('friends', `
      <a class="social-back" href="#profile/friends">${I('arrow')} Amis</a>
      <h1>Mon compte</h1>
      <div class="social-card">
        <div class="social-kv"><span>Pseudo</span><b>${esc(a.pseudo)}</b></div>
        <div class="social-kv"><span>Code ami</span><b>${a.code}</b></div>
        <div class="social-kv"><span>Créé le</span><b>${new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</b></div>
      </div>
      <p class="muted">Ton pseudo, ton mot de passe et la déconnexion se gèrent dans les <a href="#profile/settings">réglages du profil</a>.</p>
      <div class="row"><button class="btn ghost social-danger" id="social-del">Effacer ma liste d’amis</button></div>`);
    document.getElementById('social-del').onclick = () => {
      if (!confirm('Effacer ta liste d’amis ? Ton compte, ton code ami et ta progression sont conservés.')) return;
      Object.assign(S, { friends: [], sent: [], incoming: [], duels: [], players: {} }); save(); updateDot(); location.hash = 'profile/friends';
    };
  }

  // ----- Amis -----
  function friendRow(id, actions) {
    const s = statsOf(id);
    return `<div class="social-row">
      <a class="social-row-main" href="#profile/u/${esc(id)}"><span class="social-ava">${avatar(id, 46)}</span>
        <span class="social-row-t"><b>${esc(nameOf(id))}</b>${s ? `<span class="muted">Niv. ${s.level} · ${I('flame')} ${s.streak} j</span>` : ''}</span></a>
      <span class="social-row-a">${actions}</span></div>`;
  }
  function friendsView(query) {
    const a = me();
    const q = (query || '').trim();
    const results = q.length >= 2 ? Net.search(q) : [];
    const friends = knownFriends();
    const incoming = S.incoming.filter((x) => Net.player(x.id));
    const sent = S.sent.filter((x) => Net.player(x.id));
    page('friends', `
      <section class="social-me">
        <div class="social-me-l"><span class="muted">Ton code ami</span><b class="social-code">${a.code}</b><span class="muted">${esc(a.pseudo)} · <a href="#profile/account">mon compte</a></span></div>
        <div class="social-me-a">
          <button class="btn social-sm" data-social-share>${I('check')} Copier le lien</button>
          <button class="btn social-sm" data-social-qr>${I('target')} QR code</button>
        </div>
      </section>
      <form class="social-search" id="social-search">
        <label class="sr-only" for="social-q">Code ami ou pseudo</label>
        <input id="social-q" placeholder="Code ami (TAGE-XXXX) ou pseudo" value="${esc(q)}" autocomplete="off">
        <button class="btn primary" type="submit">Chercher</button>
      </form>
      ${q ? `<div id="social-results">${results.length ? results.map((p) => friendRow(p.id, '')).join('') : `<p class="muted">Aucun joueur trouvé pour « ${esc(q)} ». ${Net.online ? '' : 'La recherche d’amis ouvrira avec les comptes en ligne.'}</p>`}</div>` : ''}
      ${incoming.length ? `<h2>Demandes reçues <span class="muted">${incoming.length}</span></h2>
        <div class="social-list">${incoming.map((x) => friendRow(x.id, `<button class="btn success social-sm" data-accept="${esc(x.id)}">Accepter</button><button class="btn ghost social-sm" data-decline="${esc(x.id)}" aria-label="Refuser">${I('x')}</button>`)).join('')}</div>` : ''}
      <h2>Mes amis <span class="muted">${friends.length}</span></h2>
      ${friends.length ? `<div class="social-list">${friends.map((id) => friendRow(id, '')).join('')}</div>`
        : `<div class="social-card center social-empty"><div class="social-empty-ico">${I('heart')}</div><h2>Invite tes amis avec ton code</h2>
          <p class="muted">Envoie ton lien ou montre ton QR code à tes amis qui préparent le TAGE MAGE. Ils apparaîtront ici et dans le classement.</p>${shareBlock()}</div>`}
      ${sent.length ? `<h2>Demandes envoyées</h2><div class="social-list">${sent.map((x) => friendRow(x.id, '<span class="tag">En attente</span>')).join('')}</div>` : ''}`);
    wireShare();
    document.getElementById('social-search').onsubmit = (e) => {
      e.preventDefault();
      const v = document.getElementById('social-q').value.trim();
      if (/^TAGE-[A-Z0-9]{4}$/i.test(v)) {
        if (v.toUpperCase() === a.code) return R.toast(I('x'), 'C’est ton propre code');
        if (!Net.findByCode(v)) return R.toast(I('x'), Net.online ? 'Aucun joueur avec ce code' : 'L’ajout par code ouvrira avec les comptes en ligne');
      }
      friendsView(v);
    };
    $app().onclick = (e) => {
      const t = e.target.closest('[data-accept],[data-decline]'); if (!t) return;
      if (t.dataset.accept) { const id = t.dataset.accept; S.incoming = S.incoming.filter((x) => x.id !== id); if (!isFriend(id)) S.friends.push(id); save(); }
      if (t.dataset.decline) { S.incoming = S.incoming.filter((x) => x.id !== t.dataset.decline); save(); }
      friendsView(q); updateDot();
    };
  }
  async function share(url, text) {
    try { if (navigator.share && matchMedia('(pointer: coarse)').matches) { await navigator.share({ title: 'MyPrépaTM', text, url }); return; } } catch (e) { return; }
    try { await navigator.clipboard.writeText(url); R.toast(I('check'), 'Lien copié'); } catch (e) { prompt('Copie ce lien :', url); }
  }
  function modal(html) {
    const bg = document.createElement('div');
    bg.className = 'social-modal-bg';
    bg.innerHTML = `<div class="social-modal pop-in" role="dialog" aria-modal="true"><button class="social-modal-x" aria-label="Fermer">${I('x')}</button>${html}</div>`;
    document.body.appendChild(bg);
    const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    bg.onclick = (e) => { if (e.target === bg || e.target.closest('.social-modal-x')) close(); };
    bg.querySelector('.social-modal-x').focus();
    return { bg, close };
  }

  // ----- Lien d'invitation -----
  function invite(code) {
    const set = (html) => { $app().innerHTML = `<div class="setup pop-in social-invite">${html}</div>`; };
    const c = String(code || '').toUpperCase();
    if (!me()) return set(`<h1>Invitation</h1><p>Connecte-toi d’abord à ton compte.</p><a class="btn primary big-btn" href="#">Continuer</a>`);
    if (me().code === c) return set(`<h1>C’est ton lien d’invitation</h1><p class="muted">Envoie-le à tes amis pour qu’ils t’ajoutent.</p><a class="btn primary" href="#profile/friends">Retour aux amis</a>`);
    const target = Net.findByCode(c);
    if (!target) {
      return set(`<div class="social-empty-ico">${I('heart')}</div><h1>Invitation reçue</h1>
        <p class="muted">${Net.online ? 'Ce lien ne correspond à aucun joueur.' : `Les amis en ligne arrivent bientôt : garde ce lien, il servira à ajouter ${/^TAGE-[A-Z0-9]{4}$/.test(c) ? `le joueur <b>${esc(c)}</b>` : 'ton ami'} dès leur ouverture.`}</p>
        <a class="btn primary" href="#profile/friends">Mes amis</a>`);
    }
    if (!isFriend(target.id)) { S.players[target.id] = target; S.friends.push(target.id); save(); R.confetti(60); }
    set(`<div class="social-hero-ava">${avatar(target.id, 110)}</div><h1>Toi et ${esc(target.pseudo)} êtes amis !</h1>
      <div class="row center"><a class="btn primary" href="#profile/u/${esc(target.id)}">Voir son profil</a></div>`);
  }

  // ----- Classement -----
  const METRICS = [
    ['xp', 'Global', (s) => s.xp, (v) => `${v.toLocaleString('fr-FR')} XP`],
    ['week', 'Cette semaine', (s) => s.weekXP, (v) => `${v.toLocaleString('fr-FR')} XP`],
    ['streak', 'Série', (s) => s.streak, (v) => `${v} j`],
    ['exam', 'Examen blanc', (s) => s.bestExam, (v) => `${v} / 600`],
    ...F.subtests.map((t) => [t.id, t.short, (s) => (s.sub || {})[t.id], (v) => `${v} %`]),
  ];
  function rankingView(metric) {
    const m = METRICS.find((x) => x[0] === metric) || METRICS[0];
    const rows = [{ id: 'me', s: myStats() }, ...knownFriends().map((id) => ({ id, s: statsOf(id) })).filter((x) => x.s)]
      .map((x) => ({ ...x, v: m[2](x.s) }))
      .sort((a, b) => (b.v == null ? -1 : b.v) - (a.v == null ? -1 : a.v));
    const solo = rows.length === 1;
    const myRank = rows.findIndex((x) => x.id === 'me') + 1;
    const ahead = rows[myRank - 2];
    const top3 = rows.slice(0, 3);
    const podium = [top3[1], top3[0], top3[2]];
    const tip = m[0] === 'week' ? 'Remis à zéro chaque lundi.' : m[0] === 'exam' ? 'Meilleur score à un examen blanc complet.' : F.subtests.some((t) => t.id === m[0]) ? 'Taux de réussite sur toutes tes sessions.' : m[0] === 'streak' ? 'Jours d’affilée avec l’objectif quotidien atteint.' : 'XP gagnés depuis le début.';
    page('ranking', `
      <div class="social-chips" id="social-metric" role="tablist">${METRICS.map(([id, l]) => `<button role="tab" aria-selected="${id === m[0]}" data-m="${id}" class="${id === m[0] ? 'on' : ''}">${l}</button>`).join('')}</div>
      <p class="muted">${tip}</p>
      ${solo ? '' : `<div class="social-podium">${podium.map((x, i) => x ? `<a class="social-pod social-pod-${[2, 1, 3][i]} ${x.id === 'me' ? 'is-me' : ''}" href="#profile/u/${esc(x.id)}">
          <span class="social-ava">${avatar(x.id, [64, 84, 64][i])}</span><b>${esc(nameOf(x.id))}</b><span>${x.v == null ? '—' : m[3](x.v)}</span><span class="social-pod-step">${[2, 1, 3][i]}</span></a>` : '<span></span>').join('')}</div>`}
      ${!solo && myRank > 1 && ahead && ahead.v != null ? `<p class="social-chase">${I('zap')} Plus que <b>${m[3](Math.max(1, ahead.v - (rows[myRank - 1].v || 0)))}</b> pour dépasser ${esc(nameOf(ahead.id))}.</p>` : !solo && myRank === 1 ? `<p class="social-chase">${I('trophy')} Tu es en tête de ton groupe d’amis !</p>` : ''}
      <ol class="social-rank">${rows.map((x, i) => `<li class="${x.id === 'me' ? 'is-me' : ''}"><a href="#profile/u/${esc(x.id)}"><span class="social-rank-n">${i + 1}</span><span class="social-ava">${avatar(x.id, 40)}</span><b>${esc(nameOf(x.id))}${x.id === 'me' ? ' <span class="muted">(toi)</span>' : ''}</b><span class="social-rank-v">${x.v == null ? '—' : m[3](x.v)}</span></a></li>`).join('')}</ol>
      ${solo ? emptyInvite('trophy', 'Invite tes amis avec ton code', 'Le classement compare ta progression à celle de tes amis. Partage ton code pour qu’ils te rejoignent.') : ''}`);
    wireShare();
    document.getElementById('social-metric').onclick = (e) => { const b = e.target.closest('button'); if (b) { history.replaceState(null, '', '#profile/ranking/' + b.dataset.m); rankingView(b.dataset.m); } };
  }

  // ----- Profil public -----
  function publicView(id) {
    if (!id || (id !== 'me' && !Net.player(id))) { location.hash = 'profile/friends'; return; }
    const s = statsOf(id) || { level: 1, title: '', xp: 0, streak: 0, bestExam: null, sub: {}, badges: [] };
    const stage = TM.mascot.stageFor(s.level);
    const p = id === 'me' ? null : Net.player(id);
    page(id === 'me' ? 'me' : 'friends', `
      <a class="social-back" href="#profile/${id === 'me' ? '' : 'friends'}">${I('arrow')} ${id === 'me' ? 'Profil' : 'Amis'}</a>
      ${id === 'me' ? '<p class="notice">Voici ce que tes amis voient de toi.</p>' : ''}
      <section class="profile-hero social-pub">
        <div class="profile-m">${avatar(id, 140)}</div>
        <div class="profile-info">
          ${s.title ? `<div class="title-chip">${s.title}</div>` : ''}
          <h1>${esc(nameOf(id))} · niveau ${s.level}</h1>
          <div class="muted">Rang ${stage.name} · ${id === 'me' ? me().code : esc(p.code || '')}</div>
          ${p && isFriend(id) ? `<div class="row"><button class="btn ghost" id="social-pub-rm">Retirer de mes amis</button></div>` : ''}
        </div>
      </section>
      <section class="kpis">
        <div class="kpi"><span class="kpi-v">${I('flame', 'fire')} ${s.streak}</span><span class="kpi-l">série (jours)</span></div>
        <div class="kpi"><span class="kpi-v">${s.xp.toLocaleString('fr-FR')}</span><span class="kpi-l">XP</span></div>
        <div class="kpi"><span class="kpi-v">${s.bestExam || '—'}</span><span class="kpi-l">meilleur examen</span></div>
        <div class="kpi"><span class="kpi-v">${s.badges.length}</span><span class="kpi-l">badges</span></div>
      </section>
      <h2>Réussite par sous-test</h2>
      <div class="breakdown">${F.subtests.map((t) => { const v = (s.sub || {})[t.id]; return `<div class="brow"><span>${t.short}</span><div class="bar"><span style="width:${v || 0}%" class="${v == null ? '' : v < 50 ? 'low' : v < 75 ? 'mid' : ''}"></span></div><span class="bval">${v == null ? '—' : v + ' %'}</span></div>`; }).join('')}</div>
      <h2>Badges <span class="muted">${s.badges.length}/${R.BADGES.length}</span></h2>
      <div class="badges">${R.BADGES.filter((b) => s.badges.includes(b.id)).map((b) => `<div class="badge got" title="${b.desc}"><span class="badge-ico">${I(b.icon)}</span><span class="badge-n">${b.name}</span><span class="badge-d">${b.desc}</span></div>`).join('') || '<p class="muted">Aucun badge pour l’instant.</p>'}</div>`);
    const rm = document.getElementById('social-pub-rm');
    if (rm) rm.onclick = () => { if (confirm(`Retirer ${nameOf(id)} de tes amis ?`)) { S.friends = S.friends.filter((x) => x !== id); save(); location.hash = 'profile/friends'; } };
  }

  // ----- Défis -----
  function duelsView() {
    page('duels', `${emptyInvite('zap', 'Les défis entre amis arrivent bientôt', 'Tu pourras défier tes amis sur les mêmes questions, en direct ou à ton rythme, dès l’ouverture des comptes en ligne. En attendant, partage ton code pour qu’ils soient prêts.')}
      <div class="row center"><a class="btn ghost" href="#daily">${I('sun')} Faire le défi du jour</a></div>`);
    wireShare();
  }

  // Points d'entrée appelés par app.js pendant un défi (aucun défi possible sans serveur)
  const duelBar = () => '';
  function finishDuel() { location.hash = 'profile/duels'; }

  window.addEventListener('hashchange', () => setTimeout(updateDot, 0));
  document.addEventListener('DOMContentLoaded', updateDot);

  TM.social = { tabs, handles, view, invite, duelBar, finishDuel, get account() { return me(); },
    // Recharge l'état depuis le stockage (appelé après « Effacer toutes mes données ») pour ne pas réécrire un compte supprimé
    reset() { load(); updateDot(); } };
})();
