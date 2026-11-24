// Social : compte, amis, classement, défis 1 contre 1, profil public.
//
// SIMULATION LOCALE : il n'y a pas encore de serveur. Le compte est enregistré dans ce
// navigateur (clé tm_social) et les autres joueurs sont simulés (BOTS ci-dessous).
// Pour brancher un vrai serveur plus tard, remplacer les fonctions de la section « Données »
// (directory, botStats, sendRequest, duel*) par des appels réseau : les vues n'en dépendent pas.
//
// GARDE-FOU JURIDIQUE : les pièces gagnées en défi sont données par l'appli au gagnant.
// Rien n'est misé ni transféré entre joueurs (voir rewards.js).
(function () {
  const R = TM.rewards;
  const F = TM.FORMAT;
  const I = TM.icon;
  const KEY = 'tm_social';
  const $app = () => document.getElementById('app');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => Date.now();
  const H = 3600e3, DAY = 24 * H;

  // ---------- Hasard reproductible ----------
  function rng(seed) {
    let a = 0;
    for (const ch of String(seed)) a = (Math.imul(a ^ ch.charCodeAt(0), 2654435761) + 1) >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0; let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pickR = (r, a) => a[Math.floor(r() * a.length)];
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randCode = (n, r = Math.random) => Array.from({ length: n }, () => CODE_CHARS[Math.floor(r() * CODE_CHARS.length)]).join('');

  // ---------- Stockage ----------
  const DEFAULT = { account: null, seedAt: null, friends: [], sent: [], incoming: [], duels: [], week: null, lastBotInvite: 0, seen: {} };
  let S;
  function load() { try { S = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEFAULT); } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  load();
  // Le compte social suit le vrai compte de l'appareil (js/accounts.js) : un seul pseudo,
  // une seule connexion. Aucun e-mail ni mot de passe n'est stocké par ce module.
  function linkedAccount() {
    const c = TM.accounts && TM.accounts.current && TM.accounts.current();
    if (!c) return null;
    if (!S.account || S.account.linked !== c.id) {
      S.account = { id: c.id, linked: c.id, pseudo: c.username, code: (S.account && S.account.code) || 'TAGE-' + randCode(4), createdAt: (S.account && S.account.createdAt) || new Date(c.created || now()).toISOString() };
      delete S.loggedIn; seedFirst(); save();
    } else if (S.account.pseudo !== c.username) { S.account.pseudo = c.username; save(); }
    return S.account;
  }
  const me = () => linkedAccount();
  function seedFirst() {
    if (S.seedAt) return;
    // Premiers amis, une demande reçue et une invitation à un défi, pour démarrer
    S.seedAt = now();
    S.friends = ['b0', 'b1', 'b4'];
    S.incoming = [{ id: 'b6', at: now() }];
    S.lastBotInvite = 0;
  }

  // ---------- Joueurs simulés ----------
  const NAMES = ['lea_prepa', 'Max.TAGE', 'Ines_B', 'yanis92', 'CamilleM', 'hugo.calc', 'sarah_esc', 'Nathan_R', 'jade.logique', 'adam600', 'chloe.v', 'theo_b', 'manon.prep', 'lucas_k', 'emma.tm', 'rayan_m'];
  const BOTS = NAMES.map((pseudo, i) => {
    const r = rng('bot-' + pseudo);
    const L = TM.mascot.LOOK;
    const look = {};
    Object.keys(L).forEach((k) => { look[k] = pickR(r, L[k].filter((x) => !x.price || r() < 0.4)).id; });
    const skill = 0.38 + r() * 0.5;
    const rate = Math.round(30 + r() * 170); // XP par jour
    const xp0 = Math.round(200 + r() * 3800);
    const lvl = R.levelInfo(xp0).level;
    const equip = {};
    ['hat', 'eyes', 'neck', 'bg', 'pet', 'aura'].forEach((slot) => {
      const opts = TM.mascot.ITEMS.filter((x) => x.slot === slot && (!x.level || x.level <= lvl) && !x.badge);
      equip[slot] = opts.length && r() < 0.45 ? pickR(r, opts).id : null;
    });
    const sub = {}; F.subtests.forEach((t) => { sub[t.id] = Math.max(15, Math.min(98, Math.round(skill * 100 + (r() - 0.5) * 30))); });
    return { id: 'b' + i, pseudo, code: 'TAGE-' + randCode(4, r), look, equip, skill, rate, xp0, streak0: Math.floor(r() * 25), lazy: r() < 0.2, sub, bestExam: Math.round((180 + skill * 380 + r() * 40) / 10) * 10, badgeOrder: R.BADGES.map((b) => b.id).sort(() => r() - 0.5) };
  });
  const bot = (id) => BOTS.find((b) => b.id === id);

  function weekId(d = new Date()) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return t.getUTCFullYear() + '-W' + String(Math.ceil(((t - y0) / DAY + 1) / 7)).padStart(2, '0');
  }
  function botStats(b) {
    const days = Math.max(0, (now() - (S.seedAt || now())) / DAY);
    const xp = Math.round(b.xp0 + b.rate * days);
    const L = R.levelInfo(xp);
    const d = new Date(); const dow = (d.getDay() + 6) % 7;
    const wr = rng(b.id + weekId())();
    const weekXP = Math.round(b.rate * (dow + d.getHours() / 24 + 0.3) * (0.5 + wr));
    const streak = b.lazy ? Math.floor(b.streak0 / 4) : b.streak0 + Math.floor(days);
    const nb = Math.min(R.BADGES.length, Math.floor(L.level * 1.1) + 1);
    return { xp, level: L.level, title: L.title, weekXP, streak, bestExam: b.bestExam, sub: b.sub, badges: b.badgeOrder.slice(0, nb) };
  }

  // ---------- Mes statistiques (mêmes champs que les joueurs simulés) ----------
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

  // ---------- Avatar ----------
  const avatar = (id, size = 48) => {
    if (id === 'me') return R.mascotSVG({ size, frame: true });
    const b = bot(id); return TM.mascot.svg({ look: b.look, equip: b.equip, level: botStats(b).level, size });
  };
  const nameOf = (id) => (id === 'me' ? (me() ? me().pseudo : 'Moi') : bot(id).pseudo);

  // ---------- Amis ----------
  const isFriend = (id) => S.friends.includes(id);
  function sendRequest(id) {
    if (isFriend(id) || S.sent.some((x) => x.id === id)) return;
    const inc = S.incoming.findIndex((x) => x.id === id);
    if (inc >= 0) { S.incoming.splice(inc, 1); S.friends.push(id); save(); R.toast(I('check'), `${esc(bot(id).pseudo)} est maintenant ton ami`); return; }
    S.sent.push({ id, at: now(), acceptAt: now() + 4000 + Math.random() * 8000 });
    save(); R.toast(I('plus'), `Demande envoyée à ${esc(bot(id).pseudo)}`);
  }
  function addFriendNow(id) {
    if (isFriend(id)) return false;
    S.sent = S.sent.filter((x) => x.id !== id); S.incoming = S.incoming.filter((x) => x.id !== id);
    S.friends.push(id); save(); return true;
  }
  const findByCode = (code) => BOTS.find((b) => b.code === String(code).trim().toUpperCase());
  const inviteLink = () => location.origin + location.pathname + '#invite/' + me().code;

  // ---------- Défis ----------
  const DUEL_THEMES = [['mix', 'Mélange'], ['calcul', 'Calcul'], ['logique', 'Logique'], ['cm', 'Cond. minimales']];
  const themeName = (t) => (DUEL_THEMES.find((x) => x[0] === t) || DUEL_THEMES[0])[1];
  function duelQuestions(d, who) {
    const base = TM.util.withSeed(d.code, () => {
      if (d.theme !== 'mix') return TM.gen[d.theme](d.n);
      const a = Math.ceil(d.n * 0.4), b = Math.ceil(d.n * 0.3);
      return TM.util.shuffle([...TM.gen.calcul(a), ...TM.gen.logique(b), ...TM.gen.cm(d.n - a - b)]);
    });
    return d.order === 'shuffle' ? TM.util.withSeed(d.code + who, () => TM.util.shuffle(base)) : base;
  }
  // Partie d'un joueur simulé : temps et justesse de chaque réponse
  function botRun(d, id) {
    const b = bot(id); const r = rng(d.code + id);
    const sk = d.theme === 'mix' ? b.skill : b.sub[d.theme] / 100;
    let t = 0; const steps = [];
    for (let i = 0; i < d.n; i++) { t += 5 + r() * 9; steps.push({ t: Math.round(t), ok: r() < sk }); }
    return { steps, correct: steps.filter((s) => s.ok).length, time: Math.round(t) };
  }
  const getDuel = (code) => S.duels.find((d) => d.code === code);
  function newDuel(opts) {
    const d = Object.assign({ code: 'D-' + randCode(5), n: 10, theme: 'mix', order: 'same', mode: 'async', host: 'me', opp: null, createdAt: now(), expiresAt: now() + 48 * H, me: null, oppRes: null, result: null }, opts);
    S.duels.unshift(d); S.duels = S.duels.slice(0, 40); save(); return d;
  }
  function oppProgress(d) {
    if (!d.opp) return { done: 0, correct: 0, finished: false };
    const run = botRun(d, d.opp);
    if (d.mode === 'live') {
      if (!d.startedAt) return { done: 0, correct: 0, finished: false };
      const el = (now() - d.startedAt) / 1000;
      const st = run.steps.filter((s) => s.t <= el);
      return { done: st.length, correct: st.filter((s) => s.ok).length, finished: st.length === d.n, time: run.time };
    }
    const fin = d.oppFinishAt && now() >= d.oppFinishAt;
    return { done: fin ? d.n : 0, correct: fin ? run.correct : 0, finished: fin, time: run.time };
  }
  function settle(d) {
    if (d.result || !d.me || !d.opp) return false;
    const op = oppProgress(d); if (!op.finished) return false;
    const a = d.me, b = { correct: op.correct, time: op.time };
    d.oppRes = b;
    d.result = a.correct > b.correct ? 'win' : a.correct < b.correct ? 'loss' : a.time < b.time ? 'win' : a.time > b.time ? 'loss' : 'draw';
    const prize = { win: [15, 20], draw: [8, 10], loss: [5, 5] }[d.result];
    d.prize = prize[0];
    save();
    R.addCoins(prize[0]); R.addXP(prize[1]);
    if (d.result === 'win') R.confetti(90);
    R.toast(I(d.result === 'win' ? 'trophy' : 'zap'), `Défi contre ${esc(nameOf(d.opp))} : ${d.result === 'win' ? 'victoire !' : d.result === 'draw' ? 'égalité' : 'défaite'} (+${prize[0]} pièces)`);
    return true;
  }

  // ---------- Activité simulée (horloge) ----------
  function botActivity() {
    if (!me()) return;
    let changed = false;
    S.sent.slice().forEach((x) => { if (now() >= x.acceptAt) { addFriendNow(x.id); changed = true; R.toast(I('check'), `${esc(bot(x.id).pseudo)} a accepté ta demande d’ami`); } });
    S.duels.forEach((d) => {
      if (d.status === 'lobby' && !d.opp && d.joinAt && now() >= d.joinAt) {
        d.opp = d.pendingOpp || pickR(Math.random, S.friends.length ? S.friends : ['b0']); d.joinAt = null; changed = true;
        if (d.mode === 'async') { d.status = 'open'; d.oppFinishAt = now() + 30e3 + Math.random() * 90e3; }
        R.toast(I('zap'), `${esc(nameOf(d.opp))} a rejoint ton défi ${d.code}`);
      }
      if (!d.result && d.me && settle(d)) changed = true;
      if (!d.result && !d.me && d.status !== 'lobby' && now() > d.expiresAt) { d.result = 'expired'; changed = true; }
    });
    // De temps en temps, un ami lance un défi
    if (S.friends.length && now() - S.lastBotInvite > 20 * H) {
      const id = pickR(Math.random, S.friends);
      const d = newDuel({ host: id, opp: id, status: 'open', theme: pickR(Math.random, DUEL_THEMES)[0], order: Math.random() < 0.5 ? 'same' : 'shuffle', createdAt: now(), oppFinishAt: now() });
      S.lastBotInvite = now(); changed = true;
      R.toast(I('zap'), `${esc(bot(id).pseudo)} te défie ! Code ${d.code}`);
    }
    if (changed) { save(); refreshCurrent(); }
    updateDot();
  }
  function pendingCount() {
    if (!me()) return 0;
    return S.incoming.length + S.duels.filter((d) => !d.result && !d.me && d.host !== 'me' && d.status === 'open').length + S.duels.filter((d) => d.result && d.result !== 'expired' && !S.seen[d.code]).length;
  }
  function updateDot() {
    const a = document.querySelector('.nav a[data-view="profile"]');
    if (a) a.classList.toggle('social-dot', pendingCount() > 0);
  }

  // ---------- Vues ----------
  const route = () => location.hash.replace('#', '').split('/');
  const TABS = [['', 'Profil', 'award'], ['friends', 'Amis', 'heart'], ['ranking', 'Classement', 'trophy'], ['duels', 'Défis', 'zap']];
  function tabs(cur) {
    const badge = { friends: me() ? S.incoming.length : 0, duels: me() ? pendingCount() - S.incoming.length : 0 };
    return `<nav class="social-tabs" aria-label="Moi et mes amis">${TABS.map(([id, l, ic]) => `<a href="#profile${id ? '/' + id : ''}" class="${cur === (id || 'me') ? 'on' : ''}" ${cur === (id || 'me') ? 'aria-current="page"' : ''}>${I(ic)}<span>${l}</span>${badge[id] ? `<small>${badge[id]}</small>` : ''}</a>`).join('')}</nav>`;
  }
  const handles = (arg) => ['friends', 'ranking', 'duels', 'u', 'account'].includes(arg);
  function view(arg) {
    const r = route();
    if (!me()) return noAccountView(arg);
    if (arg === 'friends') return friendsView();
    if (arg === 'ranking') return rankingView(r[2]);
    if (arg === 'duels') return r[2] ? duelView(r[2]) : duelsView();
    if (arg === 'u') return publicView(r[2]);
    if (arg === 'account') return accountView();
  }
  function refreshCurrent() {
    const r = route();
    if (r[0] === 'profile' && handles(r[1]) && !document.querySelector('.social-keep')) view(r[1]);
    else if (r[0] === 'profile' && !r[1]) { const t = document.querySelector('.social-tabs'); if (t) t.outerHTML = tabs('me'); }
  }
  const page = (cur, html) => { $app().innerHTML = tabs(cur) + `<div class="social-page pop-in">${html}</div>`; };

  // ----- Sans compte (normalement impossible : l'appli demande de se connecter au lancement) -----
  function noAccountView(arg) {
    page(arg || 'friends', `<div class="social-card center"><h1>Connecte-toi</h1><p class="muted">Connecte-toi à ton compte pour retrouver tes amis, le classement et les défis.</p><a class="btn primary" href="#">Retour à l’accueil</a></div>`);
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
      <div class="row"><button class="btn ghost social-danger" id="social-del">Effacer mes amis et mes défis</button></div>`);
    document.getElementById('social-del').onclick = () => {
      if (!confirm('Effacer tes amis et tes défis ? Ton compte et ta progression sont conservés. C’est définitif.')) return;
      localStorage.removeItem(KEY); load(); updateDot(); location.hash = 'profile';
    };
  }

  // ----- Amis -----
  function friendRow(id, actions) {
    const s = botStats(bot(id));
    return `<div class="social-row">
      <a class="social-row-main" href="#profile/u/${id}"><span class="social-ava">${avatar(id, 46)}</span>
        <span class="social-row-t"><b>${esc(bot(id).pseudo)}</b><span class="muted">Niv. ${s.level} · ${I('flame')} ${s.streak} j</span></span></a>
      <span class="social-row-a">${actions}</span></div>`;
  }
  function friendsView(query) {
    const a = me();
    const q = (query || '').trim();
    const results = q.length >= 2 ? BOTS.filter((b) => b.pseudo.toLowerCase().includes(q.toLowerCase())) : [];
    const sugg = BOTS.filter((b) => !isFriend(b.id) && !S.sent.some((x) => x.id === b.id) && !S.incoming.some((x) => x.id === b.id)).slice(0, 4);
    const relBtn = (b) => isFriend(b.id) ? '<span class="tag social-tag-ok">Ami</span>' : S.sent.some((x) => x.id === b.id) ? '<span class="tag">Envoyée</span>' : `<button class="btn social-sm" data-add="${b.id}">${I('plus')} Ajouter</button>`;
    page('friends', `
      <section class="social-me">
        <div class="social-me-l"><span class="muted">Ton code ami</span><b class="social-code">${a.code}</b><span class="muted">${esc(a.pseudo)} · <a href="#profile/account">mon compte</a></span></div>
        <div class="social-me-a">
          <button class="btn social-sm" id="social-copy">${I('check')} Copier le lien</button>
          <button class="btn social-sm" id="social-qr">${I('target')} QR code</button>
        </div>
      </section>
      <form class="social-search" id="social-search">
        <label class="sr-only" for="social-q">Code ami ou pseudo</label>
        <input id="social-q" placeholder="Code ami (TAGE-XXXX) ou pseudo" value="${esc(q)}" autocomplete="off">
        <button class="btn primary" type="submit">Chercher</button>
      </form>
      <div id="social-results">${q ? (results.length ? results.map((b) => friendRow(b.id, relBtn(b))).join('') : `<p class="muted">Aucun joueur trouvé pour « ${esc(q)} ».</p>`) : ''}</div>
      ${S.incoming.length ? `<h2>Demandes reçues <span class="muted">${S.incoming.length}</span></h2>
        <div class="social-list">${S.incoming.map((x) => friendRow(x.id, `<button class="btn success social-sm" data-accept="${x.id}">Accepter</button><button class="btn ghost social-sm" data-decline="${x.id}" aria-label="Refuser">${I('x')}</button>`)).join('')}</div>` : ''}
      <h2>Mes amis <span class="muted">${S.friends.length}</span></h2>
      <div class="social-list">${S.friends.length ? S.friends.map((id) => friendRow(id, `<a class="btn social-sm" href="#profile/duels" data-duel="${id}">${I('zap')} Défier</a>`)).join('') : `<div class="empty">${I('heart')}<p>Partage ton code ou ton lien pour ajouter tes premiers amis.</p></div>`}</div>
      ${S.sent.length ? `<h2>Demandes envoyées</h2><div class="social-list">${S.sent.map((x) => friendRow(x.id, '<span class="tag">En attente</span>')).join('')}</div>` : ''}
      ${sugg.length ? `<h2>Suggestions</h2><div class="social-list">${sugg.map((b) => friendRow(b.id, relBtn(b))).join('')}</div>` : ''}`);
    const root = $app();
    document.getElementById('social-search').onsubmit = (e) => {
      e.preventDefault();
      const v = document.getElementById('social-q').value.trim();
      if (/^TAGE-[A-Z0-9]{4}$/i.test(v)) {
        if (v.toUpperCase() === a.code) return R.toast(I('x'), 'C’est ton propre code');
        const b = findByCode(v); if (!b) return R.toast(I('x'), 'Aucun joueur avec ce code');
        sendRequest(b.id); return friendsView();
      }
      friendsView(v);
    };
    root.onclick = (e) => {
      const t = e.target.closest('[data-add],[data-accept],[data-decline],[data-duel]'); if (!t) return;
      if (t.dataset.add) { sendRequest(t.dataset.add); friendsView(q); }
      if (t.dataset.accept) { addFriendNow(t.dataset.accept); R.toast(I('check'), `${esc(bot(t.dataset.accept).pseudo)} est maintenant ton ami`); friendsView(q); updateDot(); }
      if (t.dataset.decline) { S.incoming = S.incoming.filter((x) => x.id !== t.dataset.decline); save(); friendsView(q); updateDot(); }
      if (t.dataset.duel) { e.preventDefault(); createDuelView({ opp: t.dataset.duel }); }
    };
    document.getElementById('social-copy').onclick = () => share(inviteLink(), `Rejoins-moi sur MyPrépaTM ! Mon code ami : ${a.code}`);
    document.getElementById('social-qr').onclick = () => modal(`<h2>Ajoute-moi</h2><p class="muted">Scanne ce code avec l’appareil photo du téléphone.</p><div class="social-qr">${TM.qr.svg(inviteLink(), 220)}</div><b class="social-code">${a.code}</b>`);
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
    const target = findByCode(code || '');
    const set = (html) => { $app().innerHTML = `<div class="setup pop-in social-invite">${html}</div>`; };
    if (!me()) {
      set(`${target ? `<div class="social-hero-ava">${avatar(target.id, 110)}</div><h1>${esc(target.pseudo)} t’invite</h1>` : '<h1>Invitation</h1>'}
        <p>Crée ton compte en quelques secondes pour devenir amis.</p><a class="btn primary big-btn" href="#profile/friends">Créer mon compte</a>`);
      S.pendingInvite = code; save(); return;
    }
    if (me().code === String(code).toUpperCase()) return set(`<h1>C’est ton lien d’invitation</h1><p class="muted">Envoie-le à tes amis : en l’ouvrant, ils seront ajoutés.</p><a class="btn primary" href="#profile/friends">Retour aux amis</a>`);
    if (!target) return set(`<h1>Invitation introuvable</h1><p class="muted">Ce lien ne correspond à aucun joueur.</p><a class="btn primary" href="#profile/friends">Mes amis</a>`);
    const added = addFriendNow(target.id);
    if (added) { R.confetti(60); }
    set(`<div class="social-hero-ava">${avatar(target.id, 110)}</div><h1>${added ? `Toi et ${esc(target.pseudo)} êtes amis !` : `${esc(target.pseudo)} est déjà ton ami`}</h1>
      <div class="row center"><a class="btn primary" href="#profile/u/${target.id}">Voir son profil</a><a class="btn" href="#profile/duels" id="social-inv-duel">${I('zap')} Le défier</a></div>`);
    document.getElementById('social-inv-duel').onclick = (e) => { e.preventDefault(); location.hash = 'profile/duels'; setTimeout(() => createDuelView({ opp: target.id }), 0); };
  }

  // ----- Classement -----
  const METRICS = [
    ['xp', 'Global', (s) => s.xp, (v) => `${v.toLocaleString('fr-FR')} XP`],
    ['week', 'Cette semaine', (s) => s.weekXP, (v) => `${v.toLocaleString('fr-FR')} XP`],
    ['streak', 'Série', (s) => s.streak, (v) => `${v} j`],
    ['exam', 'Examen blanc', (s) => s.bestExam, (v) => `${v} / 600`],
    ...F.subtests.map((t) => [t.id, t.short, (s) => s.sub[t.id], (v) => `${v} %`]),
  ];
  function rankingView(metric) {
    const m = METRICS.find((x) => x[0] === metric) || METRICS[0];
    const rows = [{ id: 'me', s: myStats() }, ...S.friends.map((id) => ({ id, s: botStats(bot(id)) }))]
      .map((x) => ({ ...x, v: m[2](x.s) }))
      .sort((a, b) => (b.v == null ? -1 : b.v) - (a.v == null ? -1 : a.v));
    const myRank = rows.findIndex((x) => x.id === 'me') + 1;
    const ahead = rows[myRank - 2];
    const top3 = rows.slice(0, 3);
    const podium = [top3[1], top3[0], top3[2]];
    const tip = m[0] === 'week' ? 'Remis à zéro chaque lundi.' : m[0] === 'exam' ? 'Meilleur score à un examen blanc complet.' : F.subtests.some((t) => t.id === m[0]) ? 'Taux de réussite sur toutes tes sessions.' : m[0] === 'streak' ? 'Jours d’affilée avec l’objectif quotidien atteint.' : 'XP gagnés depuis le début.';
    page('ranking', `
      <div class="social-chips" id="social-metric" role="tablist">${METRICS.map(([id, l]) => `<button role="tab" aria-selected="${id === m[0]}" data-m="${id}" class="${id === m[0] ? 'on' : ''}">${l}</button>`).join('')}</div>
      <p class="muted">${tip}</p>
      ${rows.length > 1 ? `<div class="social-podium">${podium.map((x, i) => x ? `<a class="social-pod social-pod-${[2, 1, 3][i]} ${x.id === 'me' ? 'is-me' : ''}" href="#profile/u/${x.id}">
          <span class="social-ava">${avatar(x.id, [64, 84, 64][i])}</span><b>${esc(nameOf(x.id))}</b><span>${x.v == null ? '—' : m[3](x.v)}</span><span class="social-pod-step">${[2, 1, 3][i]}</span></a>` : '<span></span>').join('')}</div>` : ''}
      ${myRank > 1 && ahead && ahead.v != null ? `<p class="social-chase">${I('zap')} Plus que <b>${m[3](Math.max(1, ahead.v - (rows[myRank - 1].v || 0)))}</b> pour dépasser ${esc(nameOf(ahead.id))}.</p>` : myRank === 1 && rows.length > 1 ? `<p class="social-chase">${I('trophy')} Tu es en tête de ton groupe d’amis !</p>` : ''}
      <ol class="social-rank">${rows.map((x, i) => `<li class="${x.id === 'me' ? 'is-me' : ''}"><a href="#profile/u/${x.id}"><span class="social-rank-n">${i + 1}</span><span class="social-ava">${avatar(x.id, 40)}</span><b>${esc(nameOf(x.id))}${x.id === 'me' ? ' <span class="muted">(toi)</span>' : ''}</b><span class="social-rank-v">${x.v == null ? '—' : m[3](x.v)}</span></a></li>`).join('')}</ol>
      ${S.friends.length < 3 ? `<p class="muted center"><a href="#profile/friends">Ajoute des amis</a> pour rendre le classement plus disputé.</p>` : ''}`);
    document.getElementById('social-metric').onclick = (e) => { const b = e.target.closest('button'); if (b) { history.replaceState(null, '', '#profile/ranking/' + b.dataset.m); rankingView(b.dataset.m); } };
  }

  // ----- Profil public -----
  function publicView(id) {
    if (!id || (id !== 'me' && !bot(id))) { location.hash = 'profile/friends'; return; }
    if (id === 'me' && !me()) { location.hash = 'profile/friends'; return; }
    const s = id === 'me' ? myStats() : botStats(bot(id));
    const stage = TM.mascot.stageFor(s.level);
    const fr = id !== 'me' && isFriend(id);
    page(id === 'me' ? 'me' : 'friends', `
      <a class="social-back" href="#profile/${id === 'me' ? '' : 'friends'}">${I('arrow')} ${id === 'me' ? 'Profil' : 'Amis'}</a>
      ${id === 'me' ? '<p class="notice">Voici ce que tes amis voient de toi.</p>' : ''}
      <section class="profile-hero social-pub">
        <div class="profile-m">${avatar(id, 140)}</div>
        <div class="profile-info">
          <div class="title-chip">${s.title}</div>
          <h1>${esc(nameOf(id))} · niveau ${s.level}</h1>
          <div class="muted">Rang ${stage.name} · ${id === 'me' ? me().code : bot(id).code}</div>
          <div class="row">${fr ? `<button class="btn primary" id="social-pub-duel">${I('zap')} Défier</button><button class="btn ghost" id="social-pub-rm">Retirer</button>` : id === 'me' ? '' : `<button class="btn primary" id="social-pub-add">${I('plus')} Ajouter</button>`}</div>
        </div>
      </section>
      <section class="kpis">
        <div class="kpi"><span class="kpi-v">${I('flame', 'fire')} ${s.streak}</span><span class="kpi-l">série (jours)</span></div>
        <div class="kpi"><span class="kpi-v">${s.xp.toLocaleString('fr-FR')}</span><span class="kpi-l">XP</span></div>
        <div class="kpi"><span class="kpi-v">${s.bestExam || '—'}</span><span class="kpi-l">meilleur examen</span></div>
        <div class="kpi"><span class="kpi-v">${s.badges.length}</span><span class="kpi-l">badges</span></div>
      </section>
      ${id !== 'me' ? duelRecordHTML(id) : ''}
      <h2>Réussite par sous-test</h2>
      <div class="breakdown">${F.subtests.map((t) => { const p = s.sub[t.id]; return `<div class="brow"><span>${t.short}</span><div class="bar"><span style="width:${p || 0}%" class="${p == null ? '' : p < 50 ? 'low' : p < 75 ? 'mid' : ''}"></span></div><span class="bval">${p == null ? '—' : p + ' %'}</span></div>`; }).join('')}</div>
      <h2>Badges <span class="muted">${s.badges.length}/${R.BADGES.length}</span></h2>
      <div class="badges">${R.BADGES.filter((b) => s.badges.includes(b.id)).map((b) => `<div class="badge got" title="${b.desc}"><span class="badge-ico">${I(b.icon)}</span><span class="badge-n">${b.name}</span><span class="badge-d">${b.desc}</span></div>`).join('') || '<p class="muted">Aucun badge pour l’instant.</p>'}</div>`);
    const on = (x, fn) => { const el = document.getElementById(x); if (el) el.onclick = fn; };
    on('social-pub-duel', () => { location.hash = 'profile/duels'; setTimeout(() => createDuelView({ opp: id }), 0); });
    on('social-pub-add', () => { sendRequest(id); publicView(id); });
    on('social-pub-rm', () => { if (confirm(`Retirer ${bot(id).pseudo} de tes amis ?`)) { S.friends = S.friends.filter((x) => x !== id); save(); location.hash = 'profile/friends'; } });
  }
  function duelRecordHTML(id) {
    const ds = S.duels.filter((d) => d.opp === id && ['win', 'loss', 'draw'].includes(d.result));
    if (!ds.length) return '';
    const c = (r) => ds.filter((d) => d.result === r).length;
    return `<p class="social-chase">${I('zap')} Vos défis : <b>${c('win')} victoire${c('win') > 1 ? 's' : ''}</b> · ${c('draw')} égalité${c('draw') > 1 ? 's' : ''} · ${c('loss')} défaite${c('loss') > 1 ? 's' : ''}</p>`;
  }

  // ----- Défis : liste -----
  const left = (t) => { const ms = Math.max(0, t - now()); const h = Math.floor(ms / H); return h >= 1 ? `${h} h` : `${Math.ceil(ms / 60e3)} min`; };
  function duelCard(d) {
    const who = d.opp ? nameOf(d.opp) : 'en attente…';
    const meta = `${d.mode === 'live' ? 'Direct' : 'Asynchrone'} · ${themeName(d.theme)} · ${d.n} q. · ${d.order === 'same' ? 'même ordre' : 'ordre mélangé'}`;
    let st, cls = '';
    if (d.result === 'win') { st = `Victoire ${d.me.correct}-${d.oppRes.correct}`; cls = 'win'; }
    else if (d.result === 'loss') { st = `Défaite ${d.me.correct}-${d.oppRes.correct}`; cls = 'loss'; }
    else if (d.result === 'draw') { st = `Égalité ${d.me.correct}-${d.oppRes.correct}`; }
    else if (d.result === 'expired') { st = 'Expiré'; cls = 'dim'; }
    else if (d.me) st = `${esc(who)} joue… (toi : ${d.me.correct}/${d.n})`;
    else if (d.status === 'lobby') st = 'Salle d’attente';
    else st = `À toi de jouer · ${left(d.expiresAt)}`;
    const isNew = d.result && d.result !== 'expired' && !S.seen[d.code];
    return `<a class="social-duel ${cls}" href="#profile/duels/${d.code}">
      <span class="social-ava">${d.opp ? avatar(d.opp, 44) : `<span class="social-ava-empty">${I('zap')}</span>`}</span>
      <span class="social-duel-t"><b>${d.host === 'me' ? 'Toi contre ' + esc(who) : esc(who) + ' te défie'}${isNew ? ' <span class="social-new">nouveau</span>' : ''}</b><span class="muted">${meta}</span></span>
      <span class="social-duel-s">${st}</span></a>`;
  }
  function duelsView() {
    const todo = S.duels.filter((d) => !d.result && !d.me);
    const wait = S.duels.filter((d) => !d.result && d.me);
    const done = S.duels.filter((d) => d.result);
    const c = (r) => done.filter((d) => d.result === r).length;
    page('duels', `
      <div class="social-duel-actions">
        <button class="btn primary big-btn" id="social-new">${I('zap')} Créer un défi</button>
        <form class="social-search" id="social-join"><label class="sr-only" for="social-jc">Code du défi</label><input id="social-jc" placeholder="Code (D-XXXXX)" autocomplete="off"><button class="btn" type="submit">Rejoindre</button></form>
      </div>
      ${done.length ? `<p class="social-chase">${I('trophy')} Bilan : <b>${c('win')} V</b> · ${c('draw')} N · ${c('loss')} D</p>` : ''}
      ${todo.length ? `<h2>À jouer</h2><div class="social-list">${todo.map(duelCard).join('')}</div>` : ''}
      ${wait.length ? `<h2>En attente de l’adversaire</h2><div class="social-list">${wait.map(duelCard).join('')}</div>` : ''}
      <h2>Terminés</h2>
      <div class="social-list">${done.length ? done.map(duelCard).join('') : `<div class="empty">${I('zap')}<p>Défie un ami : vous jouez les mêmes questions, le meilleur score gagne des pièces.</p></div>`}</div>`);
    document.getElementById('social-new').onclick = () => createDuelView({});
    document.getElementById('social-join').onsubmit = (e) => {
      e.preventDefault();
      const code = document.getElementById('social-jc').value.trim().toUpperCase();
      const d = getDuel(code);
      if (!d) return R.toast(I('x'), 'Aucun défi avec ce code');
      if (d.host === 'me') return R.toast(I('x'), 'C’est ton propre défi : partage ce code à un ami');
      location.hash = 'profile/duels/' + code;
    };
  }

  // ----- Défis : création -----
  function createDuelView(opts) {
    const o = Object.assign({ opp: null, mode: 'live', theme: 'mix', order: 'same', n: 10 }, opts);
    const seg = (key, list) => `<div class="seg" data-k="${key}">${list.map(([v, l]) => `<button type="button" data-v="${v}" class="${String(o[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const { bg, close } = modal(`<h2>Nouveau défi</h2>
      <div class="field"><span>Adversaire</span>
        <div class="social-pick">${[null, ...S.friends].map((id) => `<button type="button" data-opp="${id || ''}" class="${o.opp === id ? 'on' : ''}">${id ? `<span class="social-ava">${avatar(id, 40)}</span>${esc(bot(id).pseudo)}` : `<span class="social-ava-empty">${I('plus')}</span>Par code`}</button>`).join('')}</div></div>
      <div class="field"><span>Mode</span>${seg('mode', [['live', 'En direct'], ['async', 'Asynchrone (48 h)']])}</div>
      <div class="field"><span>Questions</span>${seg('theme', DUEL_THEMES)}</div>
      <div class="field"><span>Nombre</span>${seg('n', [[5, '5'], [10, '10'], [15, '15']])}</div>
      <div class="field"><span>Ordre des questions</span>${seg('order', [['same', 'Même ordre'], ['shuffle', 'Mélangé pour chacun']])}</div>
      <p class="muted social-small" id="social-new-hint"></p>
      <button class="btn primary big-btn" id="social-create">Créer le défi</button>`);
    const hint = () => { bg.querySelector('#social-new-hint').textContent = (o.mode === 'live' ? 'Vous jouez en même temps et tu vois la progression de ton adversaire.' : 'Ton adversaire a 48 h pour jouer les mêmes questions.') + (o.opp ? '' : ' Tu recevras un code à partager.'); };
    hint();
    bg.querySelector('.social-modal').onclick = (e) => {
      const p = e.target.closest('[data-opp]');
      if (p) { o.opp = p.dataset.opp || null; bg.querySelectorAll('[data-opp]').forEach((x) => x.classList.toggle('on', x === p)); hint(); return; }
      const b = e.target.closest('.seg button');
      if (b) { const k = b.parentElement.dataset.k; o[k] = k === 'n' ? +b.dataset.v : b.dataset.v; b.parentElement.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); hint(); }
    };
    bg.querySelector('#social-create').onclick = () => {
      const d = newDuel({ mode: o.mode, theme: o.theme, order: o.order, n: o.n, status: 'lobby', pendingOpp: o.opp, joinAt: now() + (o.opp ? 1500 + Math.random() * 2500 : 6000 + Math.random() * 8000) });
      close();
      location.hash = 'profile/duels/' + d.code;
    };
  }

  // ----- Défis : page d'un défi -----
  function duelView(code) {
    const d = getDuel(code);
    if (!d) { location.hash = 'profile/duels'; return; }
    const back = `<a class="social-back" href="#profile/duels">${I('arrow')} Défis</a>`;
    const meta = `<p class="muted center">${d.mode === 'live' ? 'En direct' : 'Asynchrone'} · ${themeName(d.theme)} · ${d.n} questions · ${d.order === 'same' ? 'même ordre' : 'ordre mélangé'}</p>`;
    const vs = (l, r) => `<div class="social-vs"><div>${avatar('me', 84)}<b>${esc(nameOf('me'))}</b>${l}</div><span class="social-vs-x">VS</span><div>${d.opp ? avatar(d.opp, 84) : `<span class="social-ava-empty big">?</span>`}<b>${d.opp ? esc(nameOf(d.opp)) : 'En attente'}</b>${r}</div></div>`;
    // Salle d'attente
    if (d.status === 'lobby') {
      page('duels', `${back}<div class="social-card social-keep center" id="social-lobby">
        <h1>Salle d’attente</h1>
        <p>Code du défi</p><b class="social-code big">${d.code}</b>
        <div class="row center"><button class="btn social-sm" id="social-dcopy">${I('check')} Copier le code</button></div>
        ${vs('', d.opp ? '' : `<span class="social-wait">${d.pendingOpp ? `Invitation envoyée à ${esc(bot(d.pendingOpp).pseudo)}…` : 'Partage le code à un ami…'}</span>`)}
        ${meta}
        <div id="social-lobby-go">${d.opp ? startBtn(d) : ''}</div>
        <button class="btn ghost" id="social-cancel">Annuler le défi</button></div>`);
      document.getElementById('social-dcopy').onclick = async () => { try { await navigator.clipboard.writeText(d.code); R.toast(I('check'), 'Code copié'); } catch (e) { prompt('Code du défi :', d.code); } };
      document.getElementById('social-cancel').onclick = () => { S.duels = S.duels.filter((x) => x !== d); save(); location.hash = 'profile/duels'; };
      wireStart(d);
      return;
    }
    // Terminé
    if (d.result) {
      S.seen[d.code] = 1; save(); updateDot();
      if (d.result === 'expired') return page('duels', `${back}<div class="social-card center"><h1>Défi expiré</h1><p class="muted">Le délai de 48 h est passé.</p></div>`);
      const title = { win: 'Victoire !', loss: 'Défaite', draw: 'Égalité' }[d.result];
      page('duels', `${back}<div class="social-card center social-result social-${d.result}">
        <div class="social-result-ico">${I(d.result === 'win' ? 'trophy' : d.result === 'draw' ? 'hand' : 'sprout')}</div>
        <h1>${title}</h1>
        ${vs(`<span class="social-score">${d.me.correct}/${d.n}</span><span class="muted">${fmt(d.me.time)}</span>`, `<span class="social-score">${d.oppRes.correct}/${d.n}</span><span class="muted">${fmt(d.oppRes.time)}</span>`)}
        ${meta}
        <p>+${d.prize} pièces${d.result === 'win' ? ' · à égalité de score, le plus rapide gagne' : ''}</p>
        <div class="row center"><button class="btn primary" id="social-rematch">${I('zap')} Revanche</button><a class="btn ghost" href="#profile/u/${d.opp}">Voir son profil</a></div></div>`);
      document.getElementById('social-rematch').onclick = () => createDuelView({ opp: d.opp, mode: d.mode, theme: d.theme, order: d.order, n: d.n });
      return;
    }
    // J'ai joué, j'attends l'adversaire
    if (d.me) {
      const op = oppProgress(d);
      page('duels', `${back}<div class="social-card center" id="social-waiting">
        <h1>${esc(nameOf(d.opp))} n’a pas fini</h1>
        ${vs(`<span class="social-score">${d.me.correct}/${d.n}</span><span class="muted">${fmt(d.me.time)}</span>`, `<span class="social-score" id="social-opp-sc">${d.mode === 'live' ? `${op.done}/${d.n}` : '…'}</span><span class="muted" id="social-opp-st">${d.mode === 'live' ? 'répond en ce moment' : `a jusqu’à ${left(d.expiresAt)} pour jouer`}</span>`)}
        ${meta}<p class="muted">Le résultat s’affiche dès que ${esc(nameOf(d.opp))} a terminé.</p></div>`);
      return;
    }
    // À jouer
    const oppDone = d.host !== 'me' && d.oppFinishAt && now() >= d.oppFinishAt;
    page('duels', `${back}<div class="social-card center social-keep">
      <h1>${d.host === 'me' ? 'Défi prêt' : `${esc(nameOf(d.opp))} te défie`}</h1>
      ${vs('', oppDone ? `<span class="social-score">${botRun(d, d.opp).correct}/${d.n}</span><span class="muted">score à battre</span>` : '')}
      ${meta}<p class="muted">Code ${d.code} · expire dans ${left(d.expiresAt)}</p>
      <div id="social-lobby-go">${startBtn(d)}</div></div>`);
    wireStart(d);
  }
  const fmt = (s) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
  const startBtn = (d) => `<button class="btn primary big-btn" id="social-start">${I('zap')} ${d.mode === 'live' ? 'C’est parti !' : 'Jouer maintenant'}</button>`;
  function wireStart(d) {
    const b = document.getElementById('social-start'); if (!b) return;
    b.onclick = () => {
      if (d.mode === 'live') {
        let n = 3;
        const box = document.getElementById('social-lobby-go');
        const tick = () => {
          if (n === 0) return launch(d);
          box.innerHTML = `<div class="social-count" aria-live="assertive">${n}</div>`; R.sound('tick'); n--; setTimeout(tick, 800);
        };
        tick();
      } else launch(d);
    };
  }
  function launch(d) {
    if (location.hash !== '#profile/duels/' + d.code) return;
    if (d.status === 'lobby') d.status = 'open';
    d.startedAt = now(); save();
    TM.app.startDuel(duelQuestions(d, 'me'), d.code);
  }

  // Bandeau de progression pendant un défi en direct
  function duelBar(st) {
    const d = getDuel(st.duel); if (!d) return '';
    const sec = st.sections[0];
    const myDone = Object.keys(st.revealed).length;
    const myOk = sec.answers.filter((a, i) => st.revealed[i] && a === sec.questions[i].answer).length;
    const op = d.mode === 'live' ? oppProgress(d) : null;
    const target = d.mode !== 'live' && d.host !== 'me' && d.oppFinishAt && now() >= d.oppFinishAt ? botRun(d, d.opp).correct : null;
    const lane = (who, done, ok, cls) => `<div class="social-lane ${cls}"><span class="social-ava">${avatar(who, 28)}</span><div class="social-lane-bar"><span style="width:${(done / d.n) * 100}%"></span></div><b>${ok} ${I('check')}</b></div>`;
    return `<div class="social-duelbar" id="social-duelbar">${lane('me', myDone, myOk, 'me')}${op ? lane(d.opp, op.done, op.correct, 'opp') : target !== null ? `<div class="social-lane opp"><span class="muted">Score à battre : <b>${target}/${d.n}</b></span></div>` : ''}</div>`;
  }
  function finishDuel(st) {
    const d = getDuel(st.duel); if (!d) return;
    const sec = st.sections[0];
    d.me = { correct: sec.answers.filter((a, i) => a === sec.questions[i].answer).length, time: sec.elapsed };
    if (d.mode === 'async' && d.host === 'me' && !d.oppFinishAt) d.oppFinishAt = now() + 30e3 + Math.random() * 90e3;
    save(); settle(d);
    location.hash = 'profile/duels/' + d.code;
  }

  // ---------- Horloge ----------
  setInterval(() => {
    botActivity();
    const r = route();
    if (r[0] === 'quiz') {
      const st = TM.app && TM.app.state; const el = document.getElementById('social-duelbar');
      if (st && st.duel && el) el.outerHTML = duelBar(st);
    } else if (r[0] === 'profile' && r[1] === 'duels' && r[2]) {
      const d = getDuel(r[2]); if (!d) return;
      if (d.status === 'lobby' && d.opp && !document.getElementById('social-start') && !document.querySelector('.social-count')) duelView(d.code);
      else if (d.me && !d.result && d.mode === 'live') {
        const op = oppProgress(d); const sc = document.getElementById('social-opp-sc');
        if (sc) sc.textContent = `${op.done}/${d.n}`;
      } else if (d.result && document.getElementById('social-waiting')) duelView(d.code);
    }
  }, 1000);
  window.addEventListener('hashchange', () => setTimeout(updateDot, 0));
  document.addEventListener('DOMContentLoaded', () => { botActivity(); updateDot(); });
  // Une invitation ouverte avant la création du compte est appliquée ensuite
  window.addEventListener('hashchange', () => { if (me() && S.pendingInvite) { const c = S.pendingInvite; delete S.pendingInvite; save(); location.hash = 'invite/' + c; } });

  TM.social = { tabs, handles, view, invite, duelBar, finishDuel, get account() { return me(); },
    // Recharge l'état depuis le stockage (appelé après « Effacer toutes mes données ») pour ne pas réécrire un compte supprimé
    reset() { load(); updateDot(); } };
})();
