// Récompenses : XP, niveaux, pièces, boutique, badges, série de jours, sons, animations
//
// GARDE-FOU JURIDIQUE : les pièces sont purement virtuelles et gagnées en jouant.
// Elles ne doivent JAMAIS devenir achetables avec de l'argent réel, échangeables entre
// joueurs, convertibles, ni servir à un tirage au sort, sans revue juridique préalable
// (jeux d'argent, JONUM, droit de la consommation, protection des mineurs).
// Voir conformite/rapports/2026-11-23-monnaie-virtuelle-boutique.md
(function () {
  const KEY = 'tm_profile';
  const I = TM.icon;
  const today = () => new Date().toLocaleDateString('fr-CA'); // AAAA-MM-JJ, heure locale
  const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

  const DEFAULT = {
    xp: 0, coins: 0, coinsEarned: 0, badges: {}, sound: true,
    owned: [], equip: { hat: null, eyes: null, neck: null, bg: null, pet: null, aura: null, emote: null }, inv: { freeze: 0, fifty: 0, life: 0 }, boostUntil: 0,
    onboarded: false, name: '', look: null, examDate: null, target: 400, dailyGoal: 20,
    mode: 'light', hideGame: false,
    days: {}, streak: 0, bestStreak: 0, lastActive: null,
    totalAnswered: 0, totalCorrect: 0, bestCombo: 0, trained: {},
    bestSurvival: 0, daily: {}, exams: 0, bestExam: 0, sets: {}, subStats: {}, quests: {}, ownedAt: {},
  };
  let P;
  function load() {
    try { P = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { P = Object.assign({}, DEFAULT); }
    P.sets = P.sets && typeof P.sets === 'object' ? P.sets : {};
    ['subStats', 'quests', 'ownedAt'].forEach((k) => { if (!P[k] || typeof P[k] !== 'object') P[k] = {}; });
    P.inv = Object.assign({ freeze: 0, fifty: 0, life: 0 }, P.inv);
    P.owned = Array.isArray(P.owned) ? P.owned.filter((id) => id.startsWith('look:') || TM.mascot.ITEMS.some((x) => x.id === id)) : [];
    P.look = Object.assign({}, TM.mascot.DEFAULT_LOOK, P.look);
    P.equip = Object.assign({ hat: null, eyes: null, neck: null, bg: null, pet: null, aura: null, emote: null }, P.equip);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }
  load();

  // ---------- Niveaux ----------
  const TITLES = [
    [1, 'Candidat'], [3, 'Bachelier'], [5, 'Préparationnaire'], [8, 'Admissible'],
    [12, 'Admis'], [16, 'Major de promo'], [20, 'Légende du TAGE'],
  ];
  const needFor = (lvl) => 100 + (lvl - 1) * 50;
  function levelInfo(xp = P.xp) {
    let lvl = 1, rest = xp;
    while (rest >= needFor(lvl)) { rest -= needFor(lvl); lvl++; }
    const title = TITLES.filter(([l]) => lvl >= l).pop()[1];
    return { level: lvl, into: rest, need: needFor(lvl), pct: Math.round((rest / needFor(lvl)) * 100), title };
  }

  // ---------- Pièces ----------
  // Barème des gains (affiché dans la boutique)
  const EARN = {
    correct: 1, comboBonus: 1, goal: 15, levelUp: 25, badge: 15,
    dailyBase: 10, dailyPerCorrect: 2, examFull: 40, examMini: 10, survivalRecord: 20,
  };
  function addCoins(n, el) {
    if (!n) return;
    P.coins += n; P.coinsEarned += n; save();
    renderHud();
    const c = document.querySelector('.hud-coins');
    if (c) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
    if (el) floatText(el, `+${n}`, 'coin-float');
  }

  // ---------- Boutique ----------
  const ITEMS = TM.mascot.ITEMS; // accessoires de l’avatar
  const BOOSTS = [
    { id: 'fifty', name: 'Joker 50/50', icon: 'half', price: 15, max: 10, desc: 'Retire deux mauvaises réponses (entraînement, défi, survie).' },
    { id: 'life', name: 'Vie bonus', icon: 'heart', price: 25, max: 5, desc: 'Commence une partie de survie avec 4 vies.' },
    { id: 'freeze', name: 'Gel de série', icon: 'snow', price: 60, max: 2, desc: 'Protège ta série si tu manques un jour. S’utilise tout seul, ou depuis « Ta semaine » sur l’accueil.' },
    { id: 'boost', name: 'Double XP', icon: 'zap', price: 50, desc: 'Toute l’XP gagnée compte double pendant 20 minutes.' },
  ];
  const owns = (id) => P.owned.includes(id);
  // État d’un objet cosmétique : 'owned' | 'buy' | 'level' | 'badge'
  function itemState(item) {
    if (owns(item.id) || item.price === 0) return 'owned';
    if (item.badge) return P.badges[item.badge] ? 'owned' : 'badge';
    if (item.streak) return P.bestStreak >= item.streak ? 'owned' : 'streak';
    if (item.quest) return P.quests[item.id] ? 'owned' : 'quest';
    if (item.season && !TM.mascot.seasonActive(item.season)) return 'season';
    if (item.level && levelInfo().level < item.level) return 'level';
    return 'buy';
  }
  function buyItem(id) {
    const item = ITEMS.find((x) => x.id === id);
    const cost = item ? priceOf(item) : 0;
    if (!item || itemState(item) !== 'buy' || P.coins < cost) return false;
    P.coins -= cost; P.owned.push(id); P.ownedAt[id] = today(); save(); sound('buy'); renderHud();
    return true;
  }
  function equip(id) {
    const item = ITEMS.find((x) => x.id === id);
    if (!item || itemState(item) !== 'owned') return;
    P.equip[item.slot] = P.equip[item.slot] === id ? null : id; // re-cliquer retire l’accessoire
    save(); renderHud();
  }
  const mascotSVG = (opts = {}) => TM.mascot.svg(Object.assign({ level: levelInfo().level, equip: P.equip, look: P.look }, opts));
  // Apparence de l’avatar : options gratuites ou à obtenir avec des pièces
  const lookItem = (cat, id) => TM.mascot.LOOK[cat].find((x) => x.id === id);
  const lookState = (cat, id) => { const it = lookItem(cat, id); return !it ? 'none' : !it.price || P.owned.includes(`look:${cat}:${id}`) ? 'owned' : 'buy'; };
  function buyLook(cat, id) {
    const it = lookItem(cat, id);
    if (!it || lookState(cat, id) !== 'buy' || P.coins < it.price) return false;
    P.coins -= it.price; P.owned.push(`look:${cat}:${id}`); P.ownedAt[`look:${cat}:${id}`] = today(); save(); sound('buy'); renderHud();
    return true;
  }
  function setLook(cat, id) { if (lookState(cat, id) !== 'owned') return false; P.look[cat] = id; save(); renderHud(); return true; }
  function buyBoost(id) {
    const b = BOOSTS.find((x) => x.id === id);
    if (!b || P.coins < b.price) return false;
    if (b.max && P.inv[id] >= b.max) return false;
    P.coins -= b.price;
    if (id === 'boost') P.boostUntil = Math.max(Date.now(), P.boostUntil) + 20 * 60000;
    else P.inv[id]++;
    save(); sound('buy'); renderHud();
    return true;
  }
  function useItem(id) { if (P.inv[id] > 0) { P.inv[id]--; save(); return true; } return false; }
  const boostActive = () => P.boostUntil > Date.now();
  const lockLabel = (item) => (item.badge ? `Badge « ${BADGES.find((b) => b.id === item.badge).name} »` : `Niveau ${item.level}`);
  // ---------- Sélection de la semaine ----------
  // Choix déterministe (même sélection pour la semaine entière, renouvelée le lundi) : aucun hasard payant.
  // GARDE-FOUS (validés par l'agent juridique le 2026-11-23, public possiblement mineur) :
  // - afficher une date de fin, jamais un compte à rebours en heures/secondes ;
  // - aucun toast ni aucune notification « dernière chance » ;
  // - le prix barré est toujours item.price, sans gonfler le prix de référence ;
  // - si les pièces devenaient achetables avec de l'argent réel, revoir ces promos avec le juridique AVANT.
  const DEAL_PCT = 25;
  function weekStart(d = new Date()) { const t = new Date(d); t.setHours(0, 0, 0, 0); t.setDate(t.getDate() - ((t.getDay() + 6) % 7)); return t; }
  let dealsCache = null;
  function weeklyDeals() {
    const key = weekStart().toLocaleDateString('fr-CA');
    if (dealsCache && dealsCache.key === key) return dealsCache.ids;
    let h = 0; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const pool = ITEMS.filter((x) => x.price > 0 && !x.level && !x.season);
    const ids = [];
    while (ids.length < 4 && ids.length < pool.length) { h = (h * 1103515245 + 12345) >>> 0; const it = pool[h % pool.length]; if (!ids.includes(it.id)) ids.push(it.id); }
    dealsCache = { key, ids };
    return ids;
  }
  const isDeal = (item) => weeklyDeals().includes(item.id);
  const priceOf = (item) => (isDeal(item) ? Math.round(item.price * (1 - DEAL_PCT / 100)) : item.price);
  function dealsEnd() { const e = weekStart(); e.setDate(e.getDate() + 7); return e; }

  // ---------- Ensembles ----------
  const pieceOwned = (pid) => { if (pid.startsWith('look:')) { const [, c, id] = pid.split(':'); return lookState(c, id) === 'owned'; } const it = ITEMS.find((x) => x.id === pid); return !!it && itemState(it) === 'owned'; };
  function setInfo(set) { const have = set.items.filter(pieceOwned).length; return { have, total: set.items.length, complete: have === set.items.length, claimed: !!P.sets[set.id] }; }
  function claimSet(id) {
    const set = TM.mascot.SETS.find((x) => x.id === id);
    if (!set) return false;
    const inf = setInfo(set);
    if (!inf.complete || inf.claimed) return false;
    P.sets[id] = today(); save(); addCoins(set.bonus); sound('badge');
    return true;
  }
  function wearSet(id) {
    const set = TM.mascot.SETS.find((x) => x.id === id);
    if (!set || !setInfo(set).complete) return false;
    set.items.forEach((pid) => { if (pid.startsWith('look:')) { const [, c, v] = pid.split(':'); P.look[c] = v; } else { const it = ITEMS.find((x) => x.id === pid); P.equip[it.slot] = it.id; } });
    save(); renderHud(); return true;
  }

  // ---------- Quêtes : objets gagnés en réussissant un défi (jamais achetables) ----------
  // quest : { sub, ok, rate } = maîtriser un sous-test · { exams } = examens blancs complets
  const subName = (id) => (TM.FORMAT.subtests.find((x) => x.id === id) || {}).short || id;
  function questProgress(item) {
    const q = item.quest;
    if (q.sub) {
      const st = P.subStats[q.sub] || { n: 0, ok: 0 };
      const rate = st.n ? st.ok / st.n : 0;
      const pct = Math.min(rate >= q.rate ? 100 : 99, Math.round((st.ok / q.ok) * 100));
      return { label: `Maîtriser : ${subName(q.sub)}`, hint: `${Math.min(st.ok, q.ok)}/${q.ok} bonnes réponses · réussite ${Math.round(rate * 100)} % (il faut ${Math.round(q.rate * 100)} %)`, pct, done: st.ok >= q.ok && rate >= q.rate };
    }
    if (q.exams) return { label: `${q.exams} examens blancs complets`, hint: `${Math.min(P.exams, q.exams)}/${q.exams} terminés`, pct: Math.min(100, Math.round((P.exams / q.exams) * 100)), done: P.exams >= q.exams };
    return { label: 'Quête', hint: '', pct: 0, done: false };
  }
  function checkQuests() {
    ITEMS.filter((x) => x.quest && !P.quests[x.id]).forEach((x) => {
      if (!questProgress(x).done) return;
      P.quests[x.id] = today(); P.ownedAt[x.id] = today(); save();
      setTimeout(() => { toast(I('trophy'), `Quête réussie ! <strong>${x.name}</strong> rejoint ta collection`); sound('badge'); }, 600);
    });
  }

  // ---------- Rythme : estimation du temps pour tout débloquer ----------
  function pace() {
    const activeDays = Object.values(P.days).filter((n) => n > 0).length;
    const perDay = activeDays ? P.coinsEarned / activeDays : 0;
    const looks = Object.entries(TM.mascot.LOOK).flatMap(([c, l]) => l.filter((o) => o.price && lookState(c, o.id) !== 'owned').map((o) => o.price));
    const items = ITEMS.filter((x) => x.price > 0 && itemState(x) !== 'owned').map((x) => priceOf(x));
    const remaining = looks.concat(items).reduce((a, b) => a + b, 0);
    return { activeDays, perDay: Math.round(perDay), remaining, days: perDay > 0 ? Math.ceil(Math.max(0, remaining - P.coins) / perDay) : null };
  }

  // Avancement vers le déblocage d’un objet verrouillé
  function lockProgress(item) {
    if (item.quest) return questProgress(item);
    if (item.season) { const se = TM.mascot.SEASONS[item.season]; return { label: `Saison : ${se.name}`, hint: `En vente ${se.when}`, pct: 0 }; }
    if (item.badge) { const b = BADGES.find((x) => x.id === item.badge); return { label: `Badge « ${b.name} »`, hint: b.desc, pct: P.badges[b.id] ? 100 : 0 }; }
    if (item.streak) return { label: `Série de ${item.streak} jours`, hint: `Ton record : ${P.bestStreak} jour${P.bestStreak > 1 ? 's' : ''} d’affilée`, pct: Math.min(100, Math.round((P.bestStreak / item.streak) * 100)) };
    const lv = levelInfo().level;
    return { label: `Niveau ${item.level}`, hint: `Tu es niveau ${lv} : encore ${item.level - lv} niveau${item.level - lv > 1 ? 'x' : ''}`, pct: Math.round((lv / item.level) * 100) };
  }
  // Rareté affichée dans la boutique (purement visuelle, aucun tirage au sort)
  function rarity(item) {
    if (item.quest) return { id: 'quest', name: 'Quête' };
    if (item.badge || item.streak) return { id: 'excl', name: 'Exclusif' };
    if (item.season) return { id: 'season', name: TM.mascot.SEASONS[item.season].name };
    const p = item.price || 0;
    if (item.level >= 10 || p > 200) return { id: 'leg', name: 'Légendaire' };
    if (p > 100 || item.level) return { id: 'epic', name: 'Épique' };
    if (p > 50) return { id: 'rare', name: 'Rare' };
    return { id: 'com', name: 'Commun' };
  }
  // Collection : objets de la boutique + options d’apparence payantes
  function collection() {
    const looks = Object.entries(TM.mascot.LOOK).flatMap(([c, l]) => l.filter((o) => o.price).map((o) => lookState(c, o.id) === 'owned'));
    const items = ITEMS.filter((x) => x.price !== 0).map((x) => itemState(x) === 'owned');
    const all = looks.concat(items);
    return { owned: all.filter(Boolean).length, total: all.length };
  }
  // Toucher son avatar joue le geste équipé (hors liens)
  document.addEventListener('click', (e) => {
    const m = e.target.closest('.mascot.avatar');
    if (m && !m.closest('a, button')) { TM.mascot.play(m); sound('tick'); say(m); }
  });
  // ---------- Répliques de l’avatar (ton « pote drôle ») ----------
  const TAP_LINES = ['Hé, ça chatouille !', 'On révise ou on fait les beaux ?', 'Je suis prêt. Et toi ?', 'Encore un petit quiz ?', 'Arrête, je vais rougir.', 'Psst… le calcul mental, ça s’entretient.', 'Tu me trouves stylé, avoue.', 'Moi je vise 600/600. Rien que ça.', 'Les conditions minimales ? Même pas peur.', 'Une pause ? On a dit une seule.'];
  let tapN = Math.floor(Math.random() * TAP_LINES.length);
  function say(el, text) {
    const r = el.getBoundingClientRect();
    document.querySelectorAll('.m-say').forEach((x) => x.remove());
    const b = document.createElement('div');
    b.className = 'm-say';
    b.textContent = text || TAP_LINES[tapN++ % TAP_LINES.length];
    b.style.left = Math.min(innerWidth - 110, Math.max(110, r.left + r.width / 2)) + 'px';
    b.style.top = r.top + window.scrollY - 6 + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 2200);
  }
  const COMBO_LINES = ['×{n}, ça chauffe !', '×{n}, tranquille.', '×{n}, même pas en sueur.', '×{n}, on se calme !', '×{n}, le jury tremble.'];
  function comboLine(n) {
    if (n === 5) return 'Combo ×5, t’es chaud !';
    if (n === 10) return '×10 ! Quelqu’un l’arrête ?!';
    if (n === 15) return '×15… t’as triché ou quoi ?';
    if (n >= 20 && n % 5 === 0) return `×${n}. Légende vivante.`;
    return COMBO_LINES[n % COMBO_LINES.length].replace('{n}', n);
  }

  // ---------- Badges ----------
  const BADGES = [
    { id: 'first', icon: 'sprout', name: 'Premier pas', desc: 'Répondre à sa première question', test: () => P.totalAnswered >= 1 },
    { id: 'q100', icon: 'check', name: 'Centurion', desc: 'Répondre à 100 questions', test: () => P.totalAnswered >= 100 },
    { id: 'q500', icon: 'book', name: 'Bûcheur', desc: 'Répondre à 500 questions', test: () => P.totalAnswered >= 500 },
    { id: 'q1000', icon: 'comprehension', name: 'Encyclopédie', desc: 'Répondre à 1 000 questions', test: () => P.totalAnswered >= 1000 },
    { id: 'combo5', icon: 'flame', name: 'En feu', desc: '5 bonnes réponses d’affilée', test: () => P.bestCombo >= 5 },
    { id: 'combo10', icon: 'zap', name: 'Inarrêtable', desc: '10 bonnes réponses d’affilée', test: () => P.bestCombo >= 10 },
    { id: 'perfect', icon: 'target', name: 'Sans faute', desc: '100 % sur un entraînement d’au moins 10 questions', test: () => false },
    { id: 'all6', icon: 'compass', name: 'Touche-à-tout', desc: 'S’entraîner sur les 6 sous-tests', test: () => Object.keys(P.trained).length >= 6 },
    { id: 'exam1', icon: 'exam', name: 'Baptême du feu', desc: 'Terminer un examen blanc complet', test: () => P.exams >= 1 },
    { id: 'exam400', icon: 'trophy', name: 'Cap des 400', desc: 'Atteindre 400/600 à un examen blanc complet', test: () => P.bestExam >= 400 },
    { id: 'exam500', icon: 'trophy', name: 'Cap des 500', desc: 'Atteindre 500/600 à un examen blanc complet', test: () => P.bestExam >= 500 },
    { id: 'streak3', icon: 'calendar', name: 'Régulier', desc: '3 jours d’affilée', test: () => P.bestStreak >= 3 },
    { id: 'streak7', icon: 'calendar', name: 'Semaine parfaite', desc: '7 jours d’affilée', test: () => P.bestStreak >= 7 },
    { id: 'streak30', icon: 'trophy', name: 'Discipline de fer', desc: '30 jours d’affilée', test: () => P.bestStreak >= 30 },
    { id: 'survival10', icon: 'heart', name: 'Survivant', desc: '10 points en mode survie', test: () => P.bestSurvival >= 10 },
    { id: 'survival25', icon: 'zap', name: 'Increvable', desc: '25 points en mode survie', test: () => P.bestSurvival >= 25 },
    { id: 'daily1', icon: 'sun', name: 'Bonjour défi', desc: 'Terminer un premier défi du jour', test: () => Object.keys(P.daily).length >= 1 },
    { id: 'daily7', icon: 'sun', name: 'Habitué', desc: 'Terminer 7 défis du jour', test: () => Object.keys(P.daily).length >= 7 },
    { id: 'nightowl', icon: 'moon', name: 'Oiseau de nuit', desc: 'S’entraîner après 23 h', test: () => false },
    { id: 'level5', icon: 'star', name: 'Étoile montante', desc: 'Atteindre le niveau 5', test: () => levelInfo().level >= 5 },
    { id: 'level10', icon: 'star', name: 'Confirmé', desc: 'Atteindre le niveau 10', test: () => levelInfo().level >= 10 },
    { id: 'rich', icon: 'bag', name: 'Économe', desc: 'Gagner 500 pièces au total', test: () => P.coinsEarned >= 500 },
  ];

  // ---------- Objectif du jour & série (avec gel de série) ----------
  const goal = () => P.dailyGoal || 20;
  function touchDay(n) {
    const d = today();
    P.days[d] = (P.days[d] || 0) + n;
    if (P.days[d] >= goal() && P.lastActive !== d) {
      const missed = P.lastActive ? missedSince(P.lastActive, d) : null;
      if (missed && !missed.length) P.streak++;
      else if (missed && missed.length <= P.inv.freeze) { freezeDays(missed); P.streak++; toast(I('snow'), `Gel de série utilisé : ta série est sauvée`); }
      else P.streak = 1;
      P.lastActive = d;
      P.bestStreak = Math.max(P.bestStreak, P.streak);
      toast(I('flame'), `Objectif du jour atteint ! Série : ${P.streak} jour${P.streak > 1 ? 's' : ''}`);
      sound('level');
      addCoins(EARN.goal);
      setTimeout(() => { claimToday(); checkChests(); }, 700);
    }
  }

  // ---------- Semaine de révision : une case par jour où l’objectif est atteint ----------
  // Cadeaux connus à l’avance, sans tirage au sort (voir garde-fou en tête de fichier).
  const WEEK_COINS = [10, 15, 15, 20, 25];
  const dayKey = (d) => d.toLocaleDateString('fr-CA');
  // Accessoire du dimanche : le premier objet de la sélection de la semaine que tu n’as pas encore
  function weekItem() { const id = weeklyDeals().find((x) => itemState(ITEMS.find((i) => i.id === x)) === 'buy'); return id ? ITEMS.find((i) => i.id === id) : null; }
  function weekGift(i) {
    if (i < 5) return { coins: WEEK_COINS[i], label: `+${WEEK_COINS[i]} pièces`, icon: 'coin' };
    if (i === 5) return P.inv.freeze < 2 ? { freeze: 1, label: 'Un gel de série', icon: 'snow' } : { coins: 40, label: '+40 pièces', icon: 'coin' };
    const it = weekItem();
    return it ? { item: it.id, label: it.name, icon: 'gift' } : { coins: 80, label: '+80 pièces', icon: 'gift' };
  }
  function weekState() {
    const start = weekStart(); const t = today();
    P.gifts = P.gifts || {};
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(d.getDate() + i); const k = dayKey(d);
      const done = !!P.gifts[k] || (P.days[k] || 0) >= goal();
      return { key: k, letter: 'LMMJVSD'[i], gift: weekGift(i), done, frozen: !done && !!(P.frozen || {})[k], today: k === t, past: k < t };
    });
  }
  function claimToday() {
    const t = today(); P.gifts = P.gifts || {};
    if (P.gifts[t] || (P.days[t] || 0) < goal()) return;
    const i = (new Date().getDay() + 6) % 7; const g = weekGift(i);
    P.gifts[t] = g.label;
    if (g.freeze) P.inv.freeze++;
    if (g.item) { P.owned.push(g.item); P.ownedAt[g.item] = t; }
    save();
    if (g.coins) addCoins(g.coins);
    toast(g.icon === 'coin' ? TM.coin('xs') : I(g.icon), `Case du jour ouverte : <strong>${g.label}</strong>`);
  }

  // ---------- Coffres de série : contenu connu à l’avance, ouverts une seule fois ----------
  const CHESTS = [
    { n: 7, coins: 50, inv: { fifty: 2, freeze: 1 }, label: '50 pièces, 2 jokers 50/50 et un gel de série' },
    { n: 14, coins: 100, item: 'embers', label: '100 pièces et l’aura « Braises de série »' },
    { n: 30, coins: 150, inv: { freeze: 2 }, item: 'halo', label: '150 pièces, 2 gels de série et l’Auréole' },
    { n: 50, coins: 200, item: 'phoenix', label: '200 pièces et le compagnon Phénix' },
    { n: 100, coins: 300, item: 'diamond', label: '300 pièces et le Diadème de diamant' },
  ];
  const nextChest = () => CHESTS.find((c) => !(P.chests || {})[c.n]) || null;
  function openChest(c) {
    P.chests = Object.assign({}, P.chests, { [c.n]: today() });
    let extra = 0; // un bonus déjà au maximum devient des pièces
    Object.entries(c.inv || {}).forEach(([k, v]) => {
      const max = (BOOSTS.find((b) => b.id === k) || {}).max || 99;
      const add = Math.min(v, Math.max(0, max - P.inv[k])); P.inv[k] += add; extra += (v - add) * 20;
    });
    if (c.item && !P.owned.includes(c.item)) { P.owned.push(c.item); P.ownedAt[c.item] = today(); }
    save(); addCoins(c.coins + extra); sound('level'); confetti(140);
    const it = c.item && ITEMS.find((x) => x.id === c.item);
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `<div class="modal pop chest-modal">
      <div class="chest-ico">${it ? mascotSVG({ mood: 'happy', size: 130, celebrate: true, equip: Object.assign({}, P.equip, { [it.slot]: it.id }) }) : I('gift')}</div>
      <div class="muted">Série de ${c.n} jours</div>
      <h2>Coffre ouvert</h2>
      <p>${c.label}</p>
      ${it ? `<button class="btn big-btn" id="chwear">Porter : ${it.name}</button>` : ''}
      <button class="btn primary big-btn" id="chok">Continuer</button></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#chok').onclick = () => modal.remove();
    const w = modal.querySelector('#chwear');
    if (w) w.onclick = () => { P.equip[it.slot] = it.id; save(); renderHud(); modal.remove(); if (location.hash === '' || location.hash === '#') window.dispatchEvent(new HashChangeEvent('hashchange')); };
  }
  function checkChests() {
    const c = nextChest();
    if (c && currentStreak() >= c.n) openChest(c);
  }
  function currentStreak() {
    if (!P.lastActive) return 0;
    return missedSince(P.lastActive, today()).length <= P.inv.freeze ? P.streak : 0;
  }
  // ---------- Gel de série : un jour gelé compte comme un jour actif ----------
  // Jours ratés (ni objectif atteint, ni gel) strictement entre deux dates AAAA-MM-JJ
  function missedSince(from, to) {
    const out = []; const d = new Date(from + 'T12:00'); const end = new Date(to + 'T12:00');
    for (d.setDate(d.getDate() + 1); d < end; d.setDate(d.getDate() + 1)) { const k = d.toLocaleDateString('fr-CA'); if (!(P.frozen || {})[k]) out.push(k); }
    return out.slice(-400);
  }
  function freezeDays(keys) { P.frozen = Object.assign({}, P.frozen); keys.forEach((k) => { P.frozen[k] = true; }); P.inv.freeze -= keys.length; save(); }
  // Jours ratés depuis le dernier jour actif, que des gels peuvent encore sauver (série toujours en cours)
  function savableDays() { return P.lastActive && P.streak ? missedSince(P.lastActive, today()) : []; }
  function useFreeze() {
    const m = savableDays();
    if (!m.length || P.inv.freeze < m.length) return false;
    freezeDays(m); sound('badge'); renderHud();
    toast(I('snow'), `Gel utilisé : ta série de ${P.streak} jour${P.streak > 1 ? 's' : ''} est sauvée`);
    return true;
  }

  // ---------- Gains ----------
  let combo = 0;
  function answer(correct, theme) {
    P.totalAnswered++;
    if (theme) { P.trained[theme] = true; const st = P.subStats[theme] || (P.subStats[theme] = { n: 0, ok: 0 }); st.n++; if (correct) st.ok++; }
    if (new Date().getHours() >= 23) unlock('nightowl');
    let gain, coins = 0;
    if (correct) {
      P.totalCorrect++; combo++;
      P.bestCombo = Math.max(P.bestCombo, combo);
      gain = 10 + Math.min(10, (combo - 1) * 2);
      coins = EARN.correct + (combo >= 5 ? EARN.comboBonus : 0);
    } else { combo = 0; gain = 2; }
    if (boostActive()) gain *= 2;
    touchDay(1);
    addXP(gain);
    addCoins(coins);
    checkQuests();
    return { gain, coins, combo };
  }
  const resetCombo = () => { combo = 0; };
  const getCombo = () => combo;

  function addXP(n) {
    const before = levelInfo().level;
    P.xp += n;
    const after = levelInfo();
    save();
    if (after.level > before) {
      addCoins(EARN.levelUp * (after.level - before));
      setTimeout(() => levelUp(after, before), 400);
    }
    checkBadges();
    renderHud();
  }

  function unlock(id) {
    if (P.badges[id]) return;
    P.badges[id] = today();
    save();
    const b = BADGES.find((x) => x.id === id);
    addCoins(EARN.badge);
    setTimeout(() => { toast(I(b.icon), `Badge débloqué : <strong>${b.name}</strong> · +${EARN.badge} ${TM.coin('xs')}`); sound('badge'); }, 250);
  }
  function checkBadges() { BADGES.forEach((b) => { if (!P.badges[b.id] && b.test()) unlock(b.id); }); }

  function levelUp(info, from = info.level - 1) {
    sound('level');
    confetti(140);
    const newItems = ITEMS.filter((x) => x.level > from && x.level <= info.level);
    const evolved = TM.mascot.stageFor(info.level).id !== TM.mascot.stageFor(from).id;
    const modal = document.createElement('div');
    modal.className = 'modal-bg';
    modal.innerHTML = `<div class="modal pop">
      <div class="modal-ico">${mascotSVG({ level: info.level, mood: 'happy', size: 140, celebrate: true })}</div>
      <div class="muted">${evolved ? `Nouveau rang : ${TM.mascot.stageFor(info.level).name}. Ton cadre d’avatar change !` : 'Niveau supérieur'}</div>
      <h2>Niveau ${info.level}</h2>
      <div class="title-chip">${info.title}</div>
      <div class="reward-line">+${EARN.levelUp * (info.level - from)} ${TM.coin()}</div>
      ${newItems.length ? `<p>Nouveau en boutique : ${newItems.map((x) => x.name).join(' · ')}</p>` : ''}
      <button class="btn primary big-btn" id="lvok">Continuer</button></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#lvok').onclick = () => modal.remove();
  }

  // ---------- Sons (Web Audio, sans fichier) ----------
  let ctx;
  function tone(freq, start, dur, type = 'sine', vol = 0.15) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
  }
  function sound(kind) {
    if (!P.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (kind === 'ok') { tone(660, 0, 0.12, 'triangle'); tone(990, 0.09, 0.18, 'triangle'); }
      else if (kind === 'ko') { tone(220, 0, 0.18, 'sawtooth', 0.07); tone(180, 0.12, 0.22, 'sawtooth', 0.07); }
      else if (kind === 'level') { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle')); }
      else if (kind === 'badge') { tone(880, 0, 0.12, 'sine'); tone(1320, 0.1, 0.25, 'sine'); }
      else if (kind === 'buy') { tone(1318, 0, 0.08, 'square', 0.05); tone(1760, 0.07, 0.2, 'square', 0.05); }
      else if (kind === 'tick') { tone(1200, 0, 0.04, 'square', 0.03); }
    } catch (e) {}
  }

  // ---------- Animations ----------
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function confetti(n = 80) {
    if (reduced()) return;
    const c = document.createElement('canvas');
    c.className = 'confetti';
    c.width = innerWidth; c.height = innerHeight;
    document.body.appendChild(c);
    const g = c.getContext('2d');
    const colors = ['#5b5bf0', '#ffc800', '#2fae5c', '#f76b3c', '#e64995', '#1c9bd6'];
    const parts = Array.from({ length: n }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      col: colors[Math.floor(Math.random() * colors.length)],
    }));
    let t = 0;
    (function frame() {
      g.clearRect(0, 0, c.width, c.height);
      parts.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.col;
        g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore();
      });
      if (++t < 140) requestAnimationFrame(frame); else c.remove();
    })();
  }
  function floatText(el, text, cls = '') {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'float-xp ' + cls;
    f.innerHTML = cls === 'coin-float' ? `${text} ${TM.coin('xs')}` : text;
    f.style.left = r.left + r.width / 2 + (cls === 'coin-float' ? 60 : 0) + 'px';
    f.style.top = r.top + window.scrollY + 'px';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1100);
  }
  function toast(iconHTML, html) {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast-ico">${iconHTML}</span><span>${html}</span>`;
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3200);
    setTimeout(() => t.remove(), 3600);
  }

  // ---------- Barre du haut (HUD) ----------
  function renderHud() {
    const hud = document.getElementById('hud');
    if (!hud) return;
    const L = levelInfo();
    const st = currentStreak();
    const todayCount = P.days[today()] || 0;
    hud.innerHTML = `
      ${boostActive() ? `<span class="hud-boost" title="Double XP actif">${I('zap')}×2</span>` : ''}
      ${P.hideGame ? '' : `<a class="hud-streak ${st ? 'on' : ''}" href="#profile" title="Série de jours">${I('flame')}<b>${st}</b></a>
      <a class="hud-coins" href="#shop" title="Pièces — ouvrir la boutique">${TM.coin()}<b>${P.coins}</b></a>`}
      <a class="hud-goal" href="#profile" title="Objectif du jour : ${goal()} questions">
        <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="ring-bg"/><circle cx="18" cy="18" r="15" class="ring" style="stroke-dasharray:${Math.min(100, (todayCount / goal()) * 100) * 0.94} 100"/></svg>
        <span>${Math.min(todayCount, goal())}</span></a>
      <a class="hud-lvl" href="#profile" title="${L.title}">
        <span class="hud-ava">${mascotSVG({ size: 34 })}</span>
        <span class="hud-xp"><span class="hud-l">Niv. ${L.level}</span><span class="xpbar"><span style="width:${L.pct}%"></span></span></span>
      </a>`;
  }

  // Thème unique bleu nuit + jaune ; mode clair / sombre / automatique
  function applyTheme() {
    const root = document.documentElement;
    // Refonte 23/11/2026 : l’appli passe en clair par défaut (le mode sombre reste dans les réglages)
    if (!P.modeV) { if (P.mode === 'auto') P.mode = 'light'; P.modeV = 2; save(); }
    if (P.mode === 'light' || P.mode === 'dark') root.setAttribute('data-theme', P.mode);
    else root.removeAttribute('data-theme');
    const dark = P.mode === 'dark' || (P.mode !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b132b' : '#ffffff');
  }
  function setMode(m) { P.mode = m; save(); applyTheme(); }
  function setProfile(fields) { Object.assign(P, fields); save(); renderHud(); }
  function toggleSound() { P.sound = !P.sound; save(); return P.sound; }

  // ---------- Fins de session ----------
  function onTrainingEnd(correct, total) {
    if (total >= 10 && correct === total) unlock('perfect');
    if (total > 0 && correct / total >= 0.8) confetti(70);
  }
  function onExamEnd(score, full) {
    if (full) { P.exams++; P.bestExam = Math.max(P.bestExam, score); }
    save(); checkQuests();
    addXP(full ? 100 : 30);
    addCoins(full ? EARN.examFull : EARN.examMini);
    confetti(120);
    return full ? EARN.examFull : EARN.examMini;
  }
  function onSurvivalEnd(points) {
    const record = points > P.bestSurvival && points > 0;
    P.bestSurvival = Math.max(P.bestSurvival, points);
    save(); checkBadges();
    if (record) addCoins(EARN.survivalRecord);
    return record;
  }
  function onDailyEnd(correct) {
    const d = today();
    if (P.daily[d] !== undefined) return 0;
    P.daily[d] = correct;
    save();
    addXP(30 + correct * 10);
    const c = EARN.dailyBase + correct * EARN.dailyPerCorrect;
    addCoins(c);
    confetti(100);
    return c;
  }

  TM.rewards = {
    get profile() { return P; }, get DAILY_GOAL() { return goal(); }, today, levelInfo, BADGES, ITEMS, BOOSTS, EARN,
    itemState, lockLabel, lockProgress, rarity, collection, weeklyDeals, isDeal, priceOf, dealsEnd, DEAL_PCT, setInfo, claimSet, wearSet, pieceOwned, questProgress, checkQuests, pace, comboLine, say, buyItem, buyBoost, useItem, boostActive, addCoins, equip, mascotSVG, setMode, setProfile, lookState, buyLook, setLook,
    answer, resetCombo, getCombo, addXP, sound, confetti, floatText, toast,
    renderHud, applyTheme, toggleSound, currentStreak,
    weekState, claimToday, CHESTS, nextChest, checkChests, savableDays, useFreeze,
    onTrainingEnd, onExamEnd, onSurvivalEnd, onDailyEnd,
    reset() { localStorage.removeItem(KEY); load(); applyTheme(); renderHud(); },
  };
  applyTheme();
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme); } catch (e) {}
})();
