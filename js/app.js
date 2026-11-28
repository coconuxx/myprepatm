// Application : navigation, entraînement, examens blancs, survie, défi du jour, profil
(function () {
  const F = TM.FORMAT;
  const R = TM.rewards;
  const $app = document.getElementById('app');
  const byId = (id) => F.subtests.find((s) => s.id === id);
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  let timer = null;
  let state = null;
  let keyHandler = null;

  // ---------- Stockage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const history = () => { const h = store.get('tm_history', []); return Array.isArray(h) ? h.filter((e) => e && typeof e === 'object') : []; }; // donnée corrompue : repart de zéro
  function saveSession(entry) { const h = history(); h.unshift(entry); store.set('tm_history', h.slice(0, 200)); }
  function statsBySubtest() {
    const s = {}; F.subtests.forEach((t) => (s[t.id] = { c: 0, n: 0 }));
    history().forEach((h) => Object.entries(h.results || {}).forEach(([id, r]) => { if (s[id]) { s[id].c += r.correct; s[id].n += r.total; } }));
    return s;
  }
  const pctOf = (c, n) => (n ? Math.round((c / n) * 100) : 0);

  // ---------- Navigation ----------
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function setKeys(fn) { if (keyHandler) document.removeEventListener('keydown', keyHandler); keyHandler = fn; if (fn) document.addEventListener('keydown', fn); }
  function go(route) { if ((location.hash || '#') === '#' + route) render(); else location.hash = route; }
  window.addEventListener('hashchange', render);
  function render() {
    stopTimer(); setKeys(null);
    const [view, arg] = location.hash.replace('#', '').split('/');
    const cur = view || 'home';
    const PLAY = ['train', 'exam', 'daily', 'survival', 'quiz', 'results', 'survival-play'];
    document.body.dataset.view = cur;
    closePlay();
    const navCur = cur === 'profile' && arg === 'ranking' ? 'ranking' : cur === 'history' ? 'profile' : cur;
    document.querySelectorAll('.nav a:not(.nav-play)').forEach((a) => a.classList.toggle('active', a.dataset.view === navCur));
    const play = document.getElementById('nav-play');
    if (play) { play.classList.toggle('active', cur === 'home' || PLAY.includes(cur)); play.classList.toggle('has-dot', R.profile.daily[R.today()] === undefined); }
    document.body.classList.toggle('focus', view === 'quiz' || view === 'survival-play');
    R.renderHud();
    const views = {
      train: () => (arg ? trainSetup(arg) : trainList()),
      exam: examIntro, lessons: () => (arg ? lessonView(arg) : lessonList()),
      quiz: () => (state ? quizView() : go('')), results: () => (state ? resultsView() : go('')),
      survival: survivalIntro, 'survival-play': () => (state ? survivalView() : go('survival')),
      daily: dailyView, profile: () => (TM.social && TM.social.handles(arg) ? TM.social.view(arg) : profileView(arg)), history: historyView, shop: () => shopView(arg), errors: errorsView,
      invite: () => TM.social.invite(arg),
      legal: legalView, privacy: privacyView,
      premium: () => (TM.premium ? TM.premium.view($app) : home()),
    };
    // Compte : écran de connexion / création tant que personne n'est connecté sur cet appareil (js/accounts.js)
    const gated = TM.accounts && !['legal', 'privacy'].includes(view) && TM.accounts.needsGate();
    document.body.classList.toggle('acc-gated', !!gated);
    if (gated) { document.body.classList.add('focus', 'onboarding'); return TM.accounts.gate($app); }
    const ob1 = !R.profile.onboarded && !['legal', 'privacy'].includes(view);
    document.body.classList.toggle('onboarding', ob1);
    if (ob1) { document.body.classList.add('focus'); return onboarding(); }
    (views[view] || home)();
    window.scrollTo({ top: 0 });
  }

  // ---------- En-têtes de page ----------
  const pageHead = (variant, title, sub, icon, extra = '') => `<header class="phead phead-${variant} pop-in">
      <div class="phead-t"><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}${extra}</div>
      <div class="phead-ico">${TM.icon(icon)}</div>
    </header>`;

  // ---------- Feuille « Jouer » ----------
  let playOpenedAt = 0;
  function openPlay() {
    // Double tap sur iPhone : le 2e tap ne doit pas refermer la feuille tout juste ouverte
    const prev = document.querySelector('.sheet-bg');
    if (prev) {
      if (prev._fluid && prev._fluid.closing) { prev._fluid.open(); reopenPlay(prev); return; } // rattrapée pendant sa fermeture
      if (Date.now() - playOpenedAt > 450) closePlay(); return;
    }
    playOpenedAt = Date.now();
    const P = R.profile; const plan = nextStep();
    const today = R.today(); const dailyDone = P.daily[today] !== undefined;
    const goal = R.DAILY_GOAL; const count = P.days[today] || 0;
    const goalPct = Math.min(100, Math.round((count / goal) * 100));
    const weak = weakest(statsBySubtest());
    const nErr = TM.errors ? TM.errors.count() : 0;
    const recBase = plan.href.split('/')[0];
    const modes = [
      { id: 'daily', href: '#daily', icon: 'sun', title: 'Défi du jour', desc: '5 questions · pièces bonus', meta: dailyDone ? `${TM.icon('check')} Fait` : '~3 min', done: dailyDone },
      { id: 'train', href: '#train', icon: 'target', title: 'Entraînement', desc: `Conseillé : ${weak.short}`, meta: 'À ton rythme' },
      { id: 'survival', href: '#survival', icon: 'heart', title: 'Survie', desc: 'Une erreur = un cœur perdu', meta: `${TM.icon('trophy')} ${P.bestSurvival}` },
      { id: 'exam', href: '#exam', icon: 'exam', title: 'Examen blanc', desc: '6 sous-tests chronométrés', meta: '42 min · 2 h' },
    ];
    const bg = document.createElement('div');
    bg.className = 'sheet-bg';
    bg.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="sheet-grip" aria-hidden="true"></div>
      <div class="sheet-head">
        <div class="sheet-head-t">
          <h2 id="sheet-title">Jouer</h2>
          <p>${count >= goal ? 'Objectif du jour atteint, bravo !' : `${count} / ${goal} questions aujourd’hui`}</p>
        </div>
        <button class="sheet-x" type="button" aria-label="Fermer">${TM.icon('x')}</button>
      </div>
      <div class="sheet-goal" role="progressbar" aria-label="Objectif du jour" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(count, goal)}"><span style="width:${goalPct}%"></span></div>
      <a class="sheet-rec" href="${plan.href}">
        <span class="sheet-rec-ico">${TM.icon(plan.icon)}</span>
        <span class="sheet-rec-t"><span class="sheet-l">Recommandé pour toi</span><b>${plan.title}</b><small>${plan.why}</small></span>
        <span class="sheet-rec-go"><span>${plan.cta}</span>${TM.icon('arrow')}</span>
      </a>
      <p class="sheet-sec">Tous les modes</p>
      <div class="sheet-list">
        ${modes.map((m) => `<a class="home-row ${m.done ? 'done' : ''} ${recBase === m.href ? 'is-rec' : ''}" href="${m.href}">
          <span class="home-row-ico ri-${m.id}">${TM.icon(m.icon)}</span>
          <span class="home-row-t"><b>${m.title}</b><small>${m.desc}</small></span><span class="sheet-meta">${m.meta}</span>${TM.icon('chevron')}
        </a>`).join('')}
        ${nErr ? `<a class="home-row" href="#errors"><span class="home-row-ico ri-errors">${TM.icon('history')}</span><span class="home-row-t"><b>Carnet d’erreurs</b><small>${nErr} question${nErr > 1 ? 's' : ''} à retravailler</small></span><span class="home-row-n">${nErr}</span>${TM.icon('chevron')}</a>` : ''}
      </div>
    </div>`;
    document.body.appendChild(bg);
    document.body.classList.add('sheet-open');
    // Téléphone : feuille au doigt et ressorts (js/fluid.js) ; ordinateur : fenêtre centrée classique
    if (TM.fluid && matchMedia('(max-width: 760px)').matches) {
      bg.classList.add('open', 'fluid');
      bg._fluid = TM.fluid.sheet(bg, bg.querySelector('.sheet'), {
        onDismiss: (v) => closePlay(false, v),
        onReopen: () => reopenPlay(bg),
      });
      bg._fluid.open(0);
    } else requestAnimationFrame(() => bg.classList.add('open'));
    bg.onclick = (e) => { if (e.target === bg || e.target.closest('a, .sheet-x')) closePlay(!e.target.closest('a')); };
    // Clavier : focus dans la feuille, Tab reste à l’intérieur
    bg.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [...bg.querySelectorAll('a, button')]; const first = f[0]; const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    setTimeout(() => bg.querySelector('.sheet-rec')?.focus({ preventScroll: true }), 60);
    document.getElementById('home-modes')?.setAttribute('aria-expanded', 'true');
  }
  function reopenPlay(bg) {
    bg.style.pointerEvents = '';
    document.body.classList.add('sheet-open');
    document.getElementById('home-modes')?.setAttribute('aria-expanded', 'true');
  }
  function closePlay(restoreFocus, velocity = 0) {
    const bg = document.querySelector('.sheet-bg'); if (!bg) return;
    if (bg._fluid && bg._fluid.closing) return;
    const hadFocus = restoreFocus === true && bg.contains(document.activeElement);
    if (bg._fluid) {
      // La page redevient utilisable tout de suite ; seule la feuille reste attrapable pendant qu'elle descend
      bg.style.pointerEvents = 'none'; bg.querySelector('.sheet').style.pointerEvents = 'auto';
      bg._fluid.close(velocity, () => bg.remove());
    } else { bg.classList.remove('open'); setTimeout(() => bg.remove(), 220); }
    document.body.classList.remove('sheet-open');
    const btn = document.getElementById('home-modes');
    btn?.setAttribute('aria-expanded', 'false');
    if (hadFocus) btn?.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePlay(true); });

  // ---------- Plan de révision ----------
  const daysUntilExam = () => {
    const d = R.profile.examDate; if (!d) return null;
    return Math.ceil((new Date(d) - new Date(R.today())) / 86400000);
  };
  function weakest(st) {
    const untried = F.subtests.find((t) => st[t.id].n === 0);
    if (untried) return { ...untried, pct: null };
    return F.subtests.map((t) => ({ ...t, pct: pctOf(st[t.id].c, st[t.id].n) })).sort((a, b) => a.pct - b.pct)[0];
  }
  // Score estimé : dernier examen complet, sinon projection à partir de la réussite par sous-test
  function estimateScore() {
    const ex = history().find((e) => e.mode === 'exam' && e.full);
    if (ex) return { value: ex.score, src: 'dernier examen blanc' };
    const st = statsBySubtest();
    const tried = F.subtests.filter((t) => st[t.id].n >= 5);
    if (tried.length < 3) return null;
    // Même barème que l'examen blanc : 100 × réussite par sous-test, 6 sous-tests
    const per = tried.reduce((a, t) => a + subScore(st[t.id].c, st[t.id].n), 0) / tried.length;
    return { value: Math.max(0, Math.round((per * 6) / 10) * 10), src: 'projection de ta réussite' };
  }
  // ---------- Barème TAGE MAGE (FAQ officielle tagemage.fr, vérifiée le 26/11/2026) ----------
  // Score total sur 600, 6 sous-tests de 15 questions (90 au total) : chaque sous-test vaut 100 points.
  // Les erreurs et les absences de réponse ne retirent aucun point (l'ancien barème allait de −150 à 600).
  const subScore = (correct, total) => (total ? Math.max(0, Math.min(100, (correct * 100) / total)) : 0);
  function scoreSection(sec) {
    const c = sec.answers.filter((a, i) => a === sec.questions[i].answer).length;
    const blank = sec.answers.filter((a) => a === null || a === undefined).length;
    const w = sec.questions.length - c - blank;
    return { correct: c, wrong: w, blank, total: sec.questions.length, score: Math.round(subScore(c, sec.questions.length)) };
  }
  function nextStep() {
    const P = R.profile; const st = statsBySubtest(); const goal = R.DAILY_GOAL;
    const todayCount = P.days[R.today()] || 0;
    const left = daysUntilExam();
    const lastExam = history().find((e) => e.mode === 'exam');
    const sinceExam = lastExam ? (Date.now() - new Date(lastExam.date)) / 864e5 : Infinity;
    const weak = weakest(st);
    if (P.totalAnswered === 0) return { icon: 'exam', title: 'Situe ton niveau', why: 'Un mini-examen de 42 minutes couvre les 6 sous-tests et montre où tu en es.', cta: 'Lancer le mini-examen', href: '#exam', say: `Salut${P.name ? ' ' + P.name : ''} ! On commence par voir où tu en es ?` };
    if (P.daily[R.today()] === undefined) return { icon: 'sun', title: 'Défi du jour', why: '5 questions rapides pour lancer ta journée, avec des pièces en bonus.', cta: 'Relever le défi', href: '#daily', say: 'Un petit défi pour s’échauffer ?' };
    if ((left === null || left <= 60) && sinceExam > 7 && P.totalAnswered >= 40) return { icon: 'exam', title: 'Examen blanc de la semaine', why: left !== null ? `Plus que ${left} jours : un examen blanc par semaine t’habitue au rythme réel.` : 'Un examen blanc par semaine t’habitue au rythme réel.', cta: 'Passer un examen blanc', href: '#exam', say: 'C’est le moment de te tester en conditions réelles !' };
    if (todayCount < goal) return { icon: weak.id, title: `Travailler : ${weak.name}`, why: weak.pct === null ? 'Tu n’as pas encore essayé ce sous-test.' : `C’est ton sous-test le plus faible (${weak.pct} % de réussite).`, cta: `S’entraîner en ${weak.short}`, href: `#train/${weak.id}`, say: `Encore ${goal - todayCount} questions pour l’objectif du jour.` };
    return { icon: 'trophy', title: 'Objectif du jour atteint', why: 'Tu peux t’arrêter là, ou tenter de battre ton record en survie.', cta: 'Mode survie', href: '#survival', say: 'Super journée, bravo !' };
  }

  // ---------- Mission du jour ----------
  const MISSION_BONUS = 20; // pièces quand les 3 tâches du jour sont faites
  function dailyMission() {
    const P = R.profile; const today = R.today(); const goal = R.DAILY_GOAL;
    const count = P.days[today] || 0;
    const st = statsBySubtest(); const weak = weakest(st);
    const left = daysUntilExam();
    const h = history();
    const examThisWeek = h.some((e) => e.mode === 'exam' && (Date.now() - new Date(e.date)) / 864e5 < 7);
    const tasks = [
      { id: 'daily', icon: 'sun', title: 'Relever le défi du jour', sub: '5 questions rapides', href: '#daily', done: P.daily[today] !== undefined },
      { id: 'goal', icon: 'target', title: `Répondre à ${goal} questions`, sub: count >= goal ? 'Objectif atteint' : `${count} / ${goal} · conseillé : ${weak.short}`, href: `#train/${weak.id}`, done: count >= goal },
    ];
    if (P.totalAnswered === 0) {
      tasks.unshift({ id: 'level', icon: 'exam', title: 'Situer ton niveau', sub: 'Mini-examen de 42 minutes', href: '#exam', done: false });
      tasks.pop();
    } else if ((left === null || left <= 60) && P.totalAnswered >= 40) {
      tasks.push({ id: 'exam', icon: 'exam', title: 'Examen blanc de la semaine', sub: examThisWeek ? 'Fait cette semaine' : 'Conditions réelles', href: '#exam', done: examThisWeek });
    } else if (TM.errors.count() + TM.errors.reviewedToday() >= 3) {
      const done = TM.errors.reviewedToday(); const target = Math.min(5, done + TM.errors.count());
      tasks.push({ id: 'errors', icon: 'history', title: `Revoir ${target} erreurs`, sub: done >= target ? 'Fait aujourd’hui' : `${done} / ${target} · carnet d’erreurs`, href: '#errors', done: done >= target });
    } else {
      const lp = (P.lessons || {})[weak.id] || {}; // progression écrite par la page Leçons
      tasks.push({ id: 'lesson', icon: 'book', title: `Revoir la leçon : ${weak.short}`, sub: lp.quiz !== undefined ? `Méthode et pièges · meilleur quiz : ${lp.quiz}${(TM.LESSONS[weak.id]?.quiz || []).length ? '/' + TM.LESSONS[weak.id].quiz.length : ''}` : 'Méthode et pièges', href: `#lessons/${weak.id}`, done: lp.read === today });
    }
    return { tasks, count, goal, allDone: tasks.every((t) => t.done) };
  }

  // ---------- Accueil ----------
  function home() {
    const P = R.profile;
    const M = dailyMission();
    const hour = new Date().getHours();
    const hello = hour < 5 ? 'Bonsoir' : hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
    const next = M.tasks.find((t) => !t.done);
    const doneN = M.tasks.filter((t) => t.done).length;
    const missionKey = R.today();
    const bonusGiven = (P.missions || {})[missionKey];

    // Bulle de la mascotte
    const plan = nextStep();
    const left_ = M.tasks.length - doneN;
    const say = M.allDone ? 'Mission accomplie, bravo ! Reviens demain pour la suite.'
      : doneN ? `Encore ${left_} tâche${left_ > 1 ? 's' : ''} et ta journée est bouclée !`
      : /^(Salut|Bonjour|Bonsoir|Coucou)/.test(plan.say) ? plan.say : `${hello}${P.name ? ' ' + P.name : ''} ! ${plan.say}`;
    // Épreuves : réussite par sous-test, point faible signalé
    const st = statsBySubtest(); const weak = weakest(st);
    const nErr = TM.errors.count();

    // Style iPhone : salut en grand titre, la phrase de la mascotte en dessous (sans répéter le salut)
    const hiTitle = `${hello}${P.name ? ' ' + P.name : ''}`;
    const hiSub = say.replace(/^(Salut|Bonjour|Bonsoir|Coucou|Bon après-midi)[^!.?]*[!.?]\s*/, '') || say;
    $app.innerHTML = `
      <header class="home-hi pop-in">
        <h1>${esc(hiTitle)}&nbsp;<span aria-hidden="true">👋</span></h1>
        <p>${esc(hiSub)}</p>
      </header>

      <section class="home-go ${M.allDone ? 'complete' : ''}" aria-label="Mission du jour">
        <div class="home-go-l">Mission du jour · ${doneN}/${M.tasks.length}</div>
        <ol class="home-go-steps">${M.tasks.map((t) => `<li class="${t.done ? 'done' : t === next ? 'cur' : ''}"><a href="${t.href}" title="${t.title}${t.done ? ' (fait)' : ''}"><span class="sr-only">${t.title}${t.done ? ' (fait)' : ''}</span></a></li>`).join('')}</ol>
        ${next ? `<b class="home-go-t">${next.title}</b>
          <span class="home-go-d">${next.sub}${bonusGiven ? '' : ` · bonus +${MISSION_BONUS} ${TM.coin('xs')}`}</span>
          <a class="home-go-btn" href="${next.href}">Continuer</a>`
        : `<b class="home-go-t">Mission accomplie</b>
          <span class="home-go-d">${TM.coin('xs')} +${MISSION_BONUS} pièces gagnées · reviens demain</span>
          <button class="home-go-btn" type="button" id="home-modes-2">Jouer encore</button>`}
      </section>
      ${P.hideGame ? '' : weekCard()}

      <section class="home-sub pop-in" aria-labelledby="home-sub-h">
        <div class="home-sub-h">
          <h2 id="home-sub-h">Tes épreuves</h2>
          <a href="#train">Tout voir</a>
        </div>
        <div class="home-badges">${F.subtests.map((t) => {
          const s = st[t.id]; const pct = s.n ? pctOf(s.c, s.n) : null;
          const isWeak = weak.id === t.id && weak.pct !== null;
          return `<a class="home-badge hb-${t.id} ${isWeak ? 'weak' : ''}" href="#train/${t.id}">
            <span class="home-badge-c">${TM.icon(t.id)}${isWeak ? '<span class="home-badge-warn" aria-hidden="true">!</span>' : ''}</span>
            <b>${t.short}</b><span class="home-badge-p">${isWeak ? 'À revoir' : pct === null ? 'À découvrir' : pct + ' %'}</span>
            <span class="home-badge-bar" aria-hidden="true"><i style="width:${pct || 0}%"></i></span>
          </a>`;
        }).join('')}</div>
      </section>

      <div class="home-list pop-in">
        <button class="home-row" type="button" id="home-modes" aria-haspopup="dialog" aria-expanded="false">
          <span class="home-row-ico ri-modes">${TM.icon('target')}</span>
          <span class="home-row-t"><b>Tous les modes</b><small>Survie, examen blanc, entraînement</small></span>${TM.icon('chevron')}
        </button>
        <a class="home-row" href="#errors">
          <span class="home-row-ico ri-errors">${TM.icon('history')}</span>
          <span class="home-row-t"><b>Carnet d’erreurs</b><small>${nErr ? `${nErr} question${nErr > 1 ? 's' : ''} à revoir` : 'Rien à revoir pour l’instant'}</small></span>${nErr ? `<span class="home-row-n">${nErr}</span>` : ''}${TM.icon('chevron')}
        </a>
      </div>`;

    $app.querySelectorAll('#home-modes, #home-modes-2').forEach((b) => b.onclick = openPlay);
    bindWeek();
    if (!P.hideGame) { R.claimToday(); R.checkChests(); }

    // Bonus une fois par jour quand la mission est terminée
    if (M.allDone && !bonusGiven) {
      R.setProfile({ missions: Object.assign({}, P.missions, { [missionKey]: true }) });
      R.addCoins(MISSION_BONUS);
      R.confetti(110); R.sound('level');
      R.toast(TM.icon('check'), `Mission du jour accomplie · +${MISSION_BONUS} ${TM.coin('xs')}`);
    }
  }
  // ---------- Semaine de révision et coffres de série (validés sur maquette le 27/11/2026, version compacte A+C) ----------
  const giftIco = (g) => (g.icon === 'coin' ? TM.coin('xs') : TM.icon(g.icon));
  const plural = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
  function weekCard() {
    const W = R.weekState(); const n = W.filter((d) => d.done).length;
    const cur = W.find((d) => d.today); const c = R.nextChest(); const st = R.currentStreak();
    const sv = R.savableDays(); const have = R.profile.inv.freeze; const canSave = sv.length && sv.length <= 2;
    const prev = c ? (R.CHESTS[R.CHESTS.indexOf(c) - 1] || { n: 0 }).n : 0;
    const pct = c ? Math.max(4, Math.min(100, Math.round(((st - prev) / (c.n - prev)) * 100))) : 100;
    return `<section class="home-week pop-in" aria-label="Ta semaine">
      <div class="home-week-h"><b>Ta semaine · ${n}/7</b><span class="home-week-t">${cur.done ? 'Case du jour ouverte' : `Aujourd’hui : ${cur.gift.label}`}</span></div>
      <div class="home-week-days">${W.map((d) => `<span class="hw-d ${d.done ? 'done' : d.frozen ? 'frozen' : d.today ? 'cur' : d.past ? 'missed' : ''} ${!d.done && !d.frozen && d.gift.icon === 'gift' ? 'big' : ''}" title="${d.frozen ? 'Jour sauvé par un gel' : d.gift.label}">${d.done ? TM.icon('check') : d.frozen ? TM.icon('snow') : giftIco(d.gift)}<i>${d.letter}</i></span>`).join('')}</div>
      <button class="hw-chest" type="button" id="home-week" aria-haspopup="dialog">
        <span class="hw-chest-i">${R.chestSVG(c ? 'next' : 'open', 30, c ? c.n : 100)}</span>
        <span class="hw-chest-t">${c ? `Coffre à ${c.n} jours · encore ${Math.max(0, c.n - st)}` : 'Tous les coffres sont ouverts'}</span>
        <span class="hw-bar" aria-hidden="true"><i style="width:${pct}%"></i></span>${TM.icon('chevron')}
      </button>
      ${canSave ? `<div class="hw-freeze"><span class="hw-freeze-i">${TM.icon('snow')}</span><span class="hw-freeze-t">${dayNames(sv)} raté${sv.length > 1 ? 's' : ''}<small>Tu as ${plural(have, 'gel')}</small></span>
        ${have >= sv.length ? `<button class="hw-freeze-b" type="button" id="hw-freeze">Utiliser ${sv.length > 1 ? `${sv.length} gels` : 'un gel'}</button>` : `<a class="hw-freeze-b" href="#shop/bonus">Acheter un gel</a>`}</div>` : ''}
    </section>`;
  }
  function bindWeek() {
    const wk = document.getElementById('home-week');
    if (wk) wk.onclick = openChests;
    const fz = document.getElementById('hw-freeze');
    if (fz) fz.onclick = () => { if (R.useFreeze()) home(); };
  }
  const dayNames = (keys) => keys.map((k) => new Date(k + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long' })).map((n, i) => (i ? n : n[0].toUpperCase() + n.slice(1))).join(' et ');
  // Petite fenêtre : rangée de cartes qui défile (le prochain coffre en grand), détail du coffre touché
  function openChests() {
    const st = R.currentStreak(); const got = R.profile.chests || {}; const C = R.CHESTS;
    const next = R.nextChest(); let sel = next || C[C.length - 1];
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal pop chest-sheet" role="dialog" aria-modal="true" aria-labelledby="chl-h">
      <h2 id="chl-h">Coffres de série</h2>
      <p class="muted chl-st">Série : ${plural(st, 'jour')}</p>
      <div class="chr" role="list">${C.map((c) => { const state = got[c.n] ? 'open' : c === next ? 'next' : 'lock';
        return `<button type="button" role="listitem" class="chr-c chr-${state}" data-n="${c.n}" aria-label="Coffre à ${c.n} jours${got[c.n] ? ', ouvert' : ''}">${R.chestSVG(state, state === 'next' ? 56 : 40, c.n)}<b>${c.n} j</b>${state === 'next' ? `<small>encore ${Math.max(0, c.n - st)}</small>` : state === 'open' ? '<small>ouvert</small>' : ''}</button>`; }).join('')}</div>
      <div class="chf-detail" id="chf-detail" aria-live="polite"></div>
      <button class="btn primary big-btn" type="button" id="chl-ok">Fermer</button></div>`;
    document.body.appendChild(bg);
    const detail = () => {
      const done = got[sel.n];
      bg.querySelector('#chf-detail').innerHTML = `<b>${done ? `${sel.n} jours · ouvert` : sel === next ? `Prochain : ${sel.n} jours` : `${sel.n} jours de série`} · coffre en ${R.CHEST_LOOK[sel.n].name}</b><span>${sel.label}</span>`;
      bg.querySelectorAll('.chr-c').forEach((b) => b.classList.toggle('sel', +b.dataset.n === sel.n));
    };
    detail();
    bg.querySelectorAll('.chr-c').forEach((b) => { b.onclick = () => { sel = C.find((c) => c.n === +b.dataset.n); detail(); b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); }; });
    const row = bg.querySelector('.chr'); const cur = bg.querySelector('.chr-c.sel');
    if (cur) row.scrollLeft = cur.offsetLeft - (row.clientWidth - cur.offsetWidth) / 2;
    const close = () => bg.remove();
    bg.querySelector('#chl-ok').onclick = close;
    bg.onclick = (e) => { if (e.target === bg) close(); };
    bg.querySelector('#chl-ok').focus();
  }

  // ---------- Carnet d’erreurs ----------
  function startReview(theme) {
    const qs = TM.errors.pick(10, theme);
    if (qs.length) startPractice('review', 'mix', qs, null);
  }
  // Texte brut d'un énoncé : sans balises, et avec les espaces spéciaux (&nbsp;) et autres entités convertis
  function plainText(h) { const d = document.createElement('div'); d.innerHTML = String(h || '').replace(/<[^>]+>/g, ' '); return d.textContent.replace(/\s+/g, ' ').trim(); }
  function errorsView() {
    const E = TM.errors; const n = E.count(); const by = E.byTheme();
    const full = !TM.premium || TM.premium.has(2); // Premium : carnet complet à partir du pass 3 mois
    const items = E.items.slice(0, full ? 25 : 5);
    const dots = (k) => Array.from({ length: E.MASTER }, (_, i) => `<span class="errors-dot ${i < k ? 'on' : ''}"></span>`).join('');
    $app.innerHTML = `${pageHead('errors', 'Carnet d’erreurs', n ? `${n} question${n > 1 ? 's' : ''} à revoir. Réussis-en une ${E.MASTER} fois de suite pour la maîtriser.` : 'Aucune erreur à revoir pour l’instant.', 'history')}
      <section class="errors-sum pop-in">
        <div class="errors-k"><b>${n}</b><span>à revoir</span></div>
        <div class="errors-k"><b>${E.mastered}</b><span>maîtrisées</span></div>
        <div class="errors-k"><b>${E.reviewedToday()}</b><span>revues aujourd’hui</span></div>
      </section>
      ${n && !full ? TM.premium.lock('Revoir tes erreurs en séries', 'Les séries de révision et le tri par sous-test font partie du carnet complet.', 2) : ''}
      ${n && full ? `<button class="btn primary big-btn" id="errors-go">Revoir ${Math.min(10, n)} erreur${Math.min(10, n) > 1 ? 's' : ''}</button>`
          : `<div class="empty errors-empty">${TM.icon('check')}<p>Ton carnet est vide. Chaque question ratée en entraînement, au défi du jour, en survie ou en examen blanc arrivera ici.</p><a class="btn" href="#train">S’entraîner</a></div>`}
      ${n && full ? `<h2>Par sous-test</h2>
      <div class="rows">${F.subtests.filter((t) => by[t.id]).map((t) => `<button class="row-i errors-row" data-theme="${t.id}">
          <span class="ico ico-${t.id}">${t.icon}</span>
          <span class="row-t"><b>${t.name}</b><span>${by[t.id]} erreur${by[t.id] > 1 ? 's' : ''} · revoir celles-ci</span></span>
          <span class="errors-n">${by[t.id]}</span>${TM.icon('arrow', 'chev')}
        </button>`).join('')}</div>` : ''}
      ${n ? `<h2>Dernières erreurs</h2>
      <div class="review">${items.map((x, i) => {
        const t = byId(x.q.theme); const txt = plainText(x.q.prompt);
        return `<details class="rv ko errors-item"><summary><span class="errors-tag">${t ? t.short : ''}</span> ${esc(txt.slice(0, 90))}${txt.length > 90 ? '…' : ''}</summary>
          <div class="prompt">${x.q.prompt}</div>
          <p><strong>Bonne réponse :</strong> ${x.q.choices[x.q.answer]}</p>
          <p class="muted">${x.q.explanation}</p>
          <div class="errors-meta"><span>Maîtrise ${dots(x.streak)}</span><span>Ratée ${x.misses} fois</span><button class="btn ghost" data-rm="${i}">Retirer du carnet</button></div>
        </details>`;
      }).join('')}</div>` : ''}`;
    const go = document.getElementById('errors-go'); if (go) go.onclick = () => startReview();
    $app.querySelectorAll('[data-theme]').forEach((b) => b.onclick = () => startReview(b.dataset.theme));
    $app.querySelectorAll('[data-rm]').forEach((b) => b.onclick = (e) => { e.preventDefault(); TM.errors.remove(items[+b.dataset.rm].key); errorsView(); });
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Éditeur d’avatar ----------
  // shop = true : affiche aussi les options à obtenir avec des pièces
  function lookEditorHTML(look, { shop = false, cat = 'skin' } = {}) {
    const M = TM.mascot; const P = R.profile;
    const cats = Object.keys(M.LOOK);
    const thumb = (c, id) => M.svg({ look: Object.assign({}, look, { [c]: id }), size: 62, frame: false });
    const opts = M.LOOK[cat].filter((o) => shop || !o.price).map((o) => {
      const st = R.lookState(cat, o.id); const on = look[cat] === o.id;
      const inner = o.color ? `<span class="sw" style="background:${o.color}"></span>` : thumb(cat, o.id);
      const tag = st === 'buy' ? `<span class="price">${TM.coin('xs')} ${o.price}</span>` : (o.name ? `<span class="nm">${o.name}</span>` : '');
      return `<button class="lk ${on ? 'on' : ''} ${st === 'buy' ? 'paid' : ''} ${o.color ? 'col' : ''}" data-cat="${cat}" data-id="${o.id}" ${st === 'buy' && P.coins < o.price ? 'data-poor="1"' : ''} title="${o.name || ''}">${inner}${tag}</button>`;
    }).join('');
    return `<div class="lk-tabs">${cats.map((c) => `<button class="${c === cat ? 'on' : ''}" data-lkcat="${c}">${M.LOOK_LABELS[c]}</button>`).join('')}</div>
      <div class="lk-opts ${['skin', 'hairColor', 'outfitColor'].includes(cat) ? 'colors' : ''}">${opts}</div>`;
  }

  // ---------- Premier lancement ----------
  let ob = null;
  function onboarding() {
    const P = R.profile;
    ob = ob || { step: 0, name: P.name, look: Object.assign({}, P.look), lkcat: 'skin', examDate: P.examDate, target: P.target, goal: P.dailyGoal };
    const steps = 4;
    const dots = `<div class="ob-dots">${Array.from({ length: steps }, (_, i) => `<span class="${i <= ob.step ? 'on' : ''}"></span>`).join('')}</div>`;
    const minDate = R.today();
    let body = '';
    if (ob.step === 0) body = `
      <h1>Crée ton avatar</h1>
      <div class="ob-m" id="ob-ava">${TM.mascot.svg({ look: ob.look, size: 130, cls: 'bob' })}</div>
      <div id="ob-editor">${lookEditorHTML(ob.look, { cat: ob.lkcat })}</div>
      <label class="field"><span>Ton prénom ou pseudo <em>(facultatif)</em></span><input id="ob-name" maxlength="20" value="${esc(ob.name || '')}" autocomplete="off"></label>
      <p class="muted small">Ces informations restent sur ton appareil. D’autres coiffures, couleurs et tenues s’obtiennent en boutique.</p>`;
    if (ob.step === 1) body = `
      <div class="ob-ico">${TM.icon('calendar')}</div>
      <h1>Ton objectif</h1>
      <label class="field"><span>Date de ton TAGE MAGE</span><input type="date" id="ob-date" min="${minDate}" value="${ob.examDate || ''}" ${ob.examDate === 'unknown' ? 'disabled' : ''}></label>
      <label class="opt left"><input type="checkbox" id="ob-nodate" ${!ob.examDate ? 'checked' : ''}> Je ne connais pas encore la date</label>
      <label class="field"><span>Score visé : <b id="ob-tv">${ob.target}</b> / 600</span><input type="range" id="ob-target" min="150" max="600" step="10" value="${ob.target}"></label>
      <div class="seg" id="ob-presets">${[300, 350, 400, 450].map((v) => `<button data-v="${v}" class="${+ob.target === v ? 'on' : ''}">${v}</button>`).join('')}</div>`;
    if (ob.step === 2) body = `
      <div class="ob-ico">${TM.icon('timer')}</div>
      <h1>Ton rythme</h1>
      <p>Combien de temps peux-tu consacrer au TAGE MAGE chaque jour ?</p>
      <div class="ob-choices" id="ob-goal">${[[10, '10 min', 'Tranquille'], [20, '20 min', 'Régulier'], [40, '40 min', 'Intensif']].map(([v, t, d]) => `<button data-v="${v}" class="${ob.goal === v ? 'on' : ''}"><b>${t}</b><span>${d} · ${v} questions par jour</span></button>`).join('')}</div>`;
    if (ob.step === 3) body = `
      <div class="ob-m">${TM.mascot.svg({ look: ob.look, level: 1, mood: 'happy', size: 130, cls: 'bob' })}</div>
      <h1>Comment ça marche</h1>
      <div class="tour">
        <div class="tour-i">${TM.icon('target')}<div><b>Entraîne-toi chaque jour</b><span>L’accueil te propose toujours la prochaine étape, selon tes points faibles et ta date d’examen.</span></div></div>
        <div class="tour-i">${TM.icon('star')}<div><b>Gagne de l’XP et des pièces</b><span>Chaque niveau fait évoluer le cadre de ton avatar, et les pièces s’échangent contre des tenues et des accessoires.</span></div></div>
        <div class="tour-i">${TM.icon('flame')}<div><b>Garde ta série</b><span>Atteins ton objectif quotidien (${ob.goal} questions) plusieurs jours de suite.</span></div></div>
      </div>`;
    $app.innerHTML = `<div class="onboard pop-in">${dots}${body}
      <div class="row ob-nav">
        ${ob.step > 0 ? '<button class="btn ghost" id="ob-back">Retour</button>' : '<button class="btn ghost" id="ob-skip">Passer</button>'}
        <button class="btn primary" id="ob-next">${ob.step === steps - 1 ? 'C’est parti' : 'Continuer'}</button>
      </div></div>`;
    const $ = (id) => document.getElementById(id);
    const collect = () => {
      if (ob.step === 0) { ob.name = $('ob-name').value.trim(); }
      if (ob.step === 1) { ob.examDate = $('ob-nodate').checked ? null : ($('ob-date').value || null); ob.target = +$('ob-target').value; }
    };
    if (ob.step === 1) {
      $('ob-target').oninput = (e) => { $('ob-tv').textContent = e.target.value; document.querySelectorAll('#ob-presets button').forEach((b) => b.classList.toggle('on', b.dataset.v === e.target.value)); };
      $('ob-presets').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; $('ob-target').value = b.dataset.v; $('ob-target').oninput({ target: $('ob-target') }); };
      $('ob-nodate').onchange = (e) => { $('ob-date').disabled = e.target.checked; };
      $('ob-date').oninput = () => { if ($('ob-date').value) $('ob-nodate').checked = false; };
    }
    if (ob.step === 0) {
      $('ob-editor').onclick = (e) => {
        const t = e.target.closest('[data-lkcat]'); if (t) { ob.lkcat = t.dataset.lkcat; }
        const b = e.target.closest('[data-cat]'); if (b) { ob.look[b.dataset.cat] = b.dataset.id; R.sound('tick'); }
        if (t || b) { $('ob-editor').innerHTML = lookEditorHTML(ob.look, { cat: ob.lkcat }); $('ob-ava').innerHTML = TM.mascot.svg({ look: ob.look, size: 130, mood: b ? 'happy' : 'idle' }); }
      };
    }
    if (ob.step === 2) $('ob-goal').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; ob.goal = +b.dataset.v; onboarding(); };
    const finish = () => {
      R.setProfile({ onboarded: true, name: ob.name || '', look: ob.look, examDate: ob.examDate || null, target: ob.target, dailyGoal: ob.goal });
      ob = null; R.confetti(80); go('');
    };
    $('ob-next').onclick = () => { collect(); if (ob.step === steps - 1) finish(); else { ob.step++; onboarding(); } };
    if ($('ob-back')) $('ob-back').onclick = () => { collect(); ob.step--; onboarding(); };
    if ($('ob-skip')) $('ob-skip').onclick = () => { collect(); finish(); };
  }

  // ---------- Entraînement ----------
  function trainList() {
    const st = statsBySubtest();
    $app.innerHTML = `${pageHead('train', 'Entraînement', 'Choisis un sous-test. Calcul, Logique et Conditions minimales sont illimités.', 'target')}
      <div class="rows">${F.subtests.map((t, i) => {
        const s = st[t.id]; const p = s.n ? pctOf(s.c, s.n) : null;
        return `<a class="row-i pop-in" style="animation-delay:${i * 35}ms" href="#train/${t.id}">
          <span class="ico ico-${t.id}">${t.icon}</span>
          <span class="row-t"><b>${t.name}</b><span>${['calcul', 'logique', 'cm'].includes(t.id) ? 'Questions illimitées' : t.id === 'argumentation' ? 'Banque + générateur' : 'Banque de questions'}${s.n ? ` · ${s.n} faites` : ''}</span></span>
          <span class="ring-mini" style="--p:${p ?? 0}" title="${p === null ? 'Pas encore commencé' : p + ' % de réussite'}"><span>${p === null ? '—' : p + '%'}</span></span>
          ${TM.icon('arrow', 'chev')}
        </a>`;
      }).join('')}</div>`;
  }
  function trainSetup(id) {
    const t = byId(id); if (!t) return go('train');
    // Premium (js/premium.js) : sans pass, 2 séries par jour (verrou actif seulement en test administrateur)
    if (TM.premium && TM.premium.seriesLeft() <= 0) { $app.innerHTML = `<a class="back" href="#train">← Thèmes</a>${TM.premium.seriesDoneHTML('#')}`; return; }
    const left = TM.premium ? TM.premium.seriesLeft() : Infinity;
    $app.innerHTML = `<a class="back" href="#train">← Thèmes</a>
      <div class="setup pop-in">
        <div class="setup-ico ico-${id}">${t.icon}</div>
        <h1>${t.name}</h1>
        <label class="lbl">Nombre de questions</label>
        <div class="seg" id="count">${[5, 10, 15].map((n, i) => `<button data-v="${n}" class="${i === 1 ? 'on' : ''}">${n}</button>`).join('')}</div>
        <label class="lbl">Mode</label>
        <div class="seg" id="timed"><button data-v="0" class="on">Libre</button><button data-v="1">Chronométré (1 min 20 / question)</button></div>
        <button class="btn primary big-btn" id="start">Commencer</button>
        ${left !== Infinity ? `<p class="muted prem-left">Encore ${left} série${left > 1 ? 's' : ''} aujourd’hui · <a href="#premium">illimitées avec Premium</a></p>` : ''}
        <a class="btn ghost" href="#lessons/${id}">Revoir la leçon d’abord</a>
      </div>`;
    document.querySelectorAll('.seg').forEach((seg) => seg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      seg.querySelectorAll('button').forEach((x) => x.classList.remove('on')); b.classList.add('on');
    }));
    document.getElementById('start').onclick = () => {
      const n = +document.querySelector('#count .on').dataset.v;
      const timed = document.querySelector('#timed .on').dataset.v === '1';
      if (TM.premium && left !== Infinity) TM.premium.useSeries();
      startPractice('train', id, TM.gen[id](n), timed ? n * 80 : null);
    };
  }
  function startPractice(mode, id, questions, timeLeft) {
    R.resetCombo();
    state = { mode, timed: timeLeft !== null, sections: [{ id, questions, answers: Array(questions.length).fill(null), flags: {}, timeLeft, elapsed: 0 }], s: 0, q: 0, revealed: {}, xp: 0 };
    go('quiz');
  }

  // Point d'entrée pour js/social.js (défis entre amis)
  TM.app = {
    startDuel(questions, code) { startPractice('duel', 'mix', questions, null); state.duel = code; },
    get state() { return state; },
  };

  // ---------- Défi du jour ----------
  function dailyQuestions() {
    return TM.util.withSeed('tm-' + R.today(), () => TM.util.shuffle([...TM.gen.calcul(2), ...TM.gen.logique(2), ...TM.gen.cm(1)]));
  }
  function dailyView() {
    const done = R.profile.daily[R.today()];
    if (done !== undefined) {
      const now = new Date(), tm = new Date(now); tm.setHours(24, 0, 0, 0);
      const h = Math.floor((tm - now) / 3600000), m = Math.floor(((tm - now) % 3600000) / 60000);
      $app.innerHTML = `<div class="setup pop-in"><div class="setup-ico ico-sun">${TM.icon('sun')}</div><h1>Défi du jour terminé</h1>
        <div class="big">${done}<small> / 5</small></div>
        <p class="muted">Prochain défi dans ${h} h ${m} min.</p>
        <a class="btn primary big-btn" href="#survival">Tenter le mode survie</a></div>`;
      return;
    }
    $app.innerHTML = `<div class="setup pop-in"><div class="setup-ico ico-sun">${TM.icon('sun')}</div><h1>Défi du jour</h1>
      <p>5 questions, les mêmes pour tout le monde aujourd’hui. Une seule tentative.</p>
      <p class="muted">Bonus : +30 XP et ${R.EARN.dailyBase} ${TM.coin('xs')}, plus 10 XP et ${R.EARN.dailyPerCorrect} ${TM.coin('xs')} par bonne réponse.</p>
      <button class="btn primary big-btn" id="go">Relever le défi</button></div>`;
    document.getElementById('go').onclick = () => startPractice('daily', 'mix', dailyQuestions(), null);
  }

  // ---------- Examen blanc ----------
  function examIntro() {
    $app.innerHTML = `<div class="setup pop-in wide">
      <div class="setup-ico">${TM.icon('exam')}</div><h1>Examen blanc</h1>
      <p>Conditions réelles : <strong>6 sous-tests de 15 questions</strong>, <strong>20 minutes chacun</strong>, dans l’ordre officiel. Le temps restant ne se reporte pas. Correction à la fin.</p>
      <div class="order">${F.subtests.map((t, i) => `<div class="order-i"><span class="num">${i + 1}</span><span class="ico ico-${t.id}">${t.icon}</span>${t.name}</div>`).join('')}</div>
      <p class="muted">Pas de points négatifs : réponds à tout. Sans calculatrice. Examen complet : +100 XP et ${R.EARN.examFull} ${TM.coin('xs')}.</p>
      ${TM.premium && TM.premium.examsLeft() <= 0 ? TM.premium.examsDoneHTML() : `<button class="btn primary big-btn" id="full">Examen complet (2 h)</button>`}
      <button class="btn big-btn" id="mini">Mini-examen (6 × 5 questions, 42 min)</button>
    </div>`;
    const start = (n, minutes, full) => {
      R.resetCombo();
      state = {
        mode: 'exam', full, timed: true, s: 0, q: 0, revealed: {}, startedSection: false,
        sections: F.subtests.map((t) => { const qs = TM.gen[t.id](n); return { id: t.id, questions: qs, answers: Array(qs.length).fill(null), flags: {}, timeLeft: minutes * 60, elapsed: 0 }; }),
      };
      go('quiz');
    };
    const full = document.getElementById('full');
    if (full) full.onclick = () => { if (TM.premium && TM.premium.examsLeft() !== Infinity) TM.premium.useExam(); start(F.questionsPerSubtest, F.minutesPerSubtest, true); };
    document.getElementById('mini').onclick = () => start(5, 7, false);
  }

  // ---------- Rendu d’une question ----------
  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;
  // Joker 50/50 : retire deux mauvaises réponses
  function fiftyRemove(qu) {
    return TM.util.shuffle(qu.choices.map((_, i) => i).filter((i) => i !== qu.answer)).slice(0, 2);
  }
  function jokerBtn(used) {
    const n = R.profile.inv.fifty;
    if (used) return '';
    return n ? `<button class="joker" id="joker">${TM.icon('half')} Joker 50/50 <b>${n}</b></button>`
             : `<a class="joker off" href="#shop" title="Obtenir des jokers">${TM.icon('half')} Joker 50/50 · boutique</a>`;
  }
  function choicesHTML(qu, isCM, sel, revealed, removed) {
    return qu.choices.map((c, i) => {
      if (removed && removed.includes(i) && !revealed) return `<button class="choice gone" disabled><span class="letter">${LETTERS[i]}</span><span>${isCM ? c.replace(/^[A-E] — /, '') : c}</span></button>`;
      let cls = sel === i ? 'sel' : '';
      if (revealed) cls = i === qu.answer ? 'ok' : sel === i ? 'ko' : 'dim';
      const label = isCM ? `<span class="letter">${LETTERS[i]}</span><span>${c.replace(/^[A-E] — /, '')}</span>` : `<span class="letter">${LETTERS[i]}</span><span>${c}</span>`;
      return `<button class="choice ${cls}" data-i="${i}" ${revealed ? 'disabled' : ''} style="animation-delay:${i * 35}ms">${label}</button>`;
    }).join('');
  }
  function themeOf(qu, sec) { return byId(qu.theme) || byId(sec.id) || { icon: TM.icon('sun'), short: 'Défi', id: 'mix' }; }

  // ---------- Quiz (entraînement, défi, examen) ----------
  function quizView() {
    const sec = state.sections[state.s];
    if (state.mode === 'exam' && !state.startedSection) return sectionIntro(sec);
    const qu = sec.questions[state.q];
    const practice = state.mode !== 'exam';
    const revealed = practice && state.revealed[state.q];
    const t = themeOf(qu, sec);
    const sel = sec.answers[state.q];
    const done = practice ? Object.keys(state.revealed).length : sec.answers.filter((a) => a !== null).length;
    const progress = Math.round((done / sec.questions.length) * 100);
    const last = state.q === sec.questions.length - 1;
    const ok = sel === qu.answer;

    $app.innerHTML = `
      <div class="quiz-top">
        <a class="quit" href="#" title="Quitter">${TM.icon('x')}</a>
        <div class="progress"><span style="width:${progress}%"></span></div>
        ${practice && R.getCombo() >= 2 ? `<div class="combo">${TM.icon('flame')}×${R.getCombo()}</div>` : ''}
        <div class="timer ${sec.timeLeft !== null && sec.timeLeft < 60 ? 'warn' : ''}" id="timer">${sec.timeLeft !== null ? fmtTime(sec.timeLeft) : fmtTime(sec.elapsed)}</div>
      </div>
      ${state.duel ? TM.social.duelBar(state) : ''}
      <div class="quiz-meta"><span class="tag ico-${t.id}">${t.icon} ${t.short}</span>${state.mode === 'exam' ? `<span class="muted">Sous-test ${state.s + 1}/6</span>` : ''}<span class="muted">Question ${state.q + 1}/${sec.questions.length}</span></div>
      ${state.mode === 'exam' ? `<div class="dots">${sec.questions.map((_, i) => `<button class="dot ${sec.answers[i] !== null ? 'done' : ''} ${i === state.q ? 'cur' : ''} ${sec.flags[i] ? 'flag' : ''}" data-i="${i}">${i + 1}</button>`).join('')}</div>` : ''}
      <div class="quiz ${qu.passage ? 'with-passage' : ''}">
        ${qu.passage ? `<details class="passage" open><summary>${qu.passage.title}</summary><div class="passage-body">${qu.passage.body}</div></details>` : ''}
        <div class="qbox slide-in" id="qbox">
          <div class="prompt">${qu.prompt}</div>
          <div class="choices ${revealed ? 'folded' : ''}" id="choices">${choicesHTML(qu, qu.theme === 'cm', sel, revealed, state.fifty && state.fifty[state.q])}</div>
          ${practice && !revealed ? jokerBtn(state.fifty && state.fifty[state.q]) : ''}
          ${revealed && TM.correction ? `<button type="button" class="cor-all" id="cor-all">Afficher toutes les réponses</button>${TM.correction.card(qu, sel)}` : ''}
          ${state.mode === 'exam' ? `<div class="row nav-row">
            <button class="btn ghost" id="prev" ${state.q === 0 ? 'disabled' : ''}>Précédente</button>
            <button class="btn ghost" id="flag">${sec.flags[state.q] ? 'Marquée' : 'Marquer'}</button>
            ${last ? `<button class="btn primary" id="finish">${state.s < 5 ? 'Sous-test suivant' : 'Terminer'}</button>` : `<button class="btn primary" id="next">Suivante</button>`}
          </div>` : ''}
        </div>
      </div>
      ${practice ? `<div class="checkbar ${revealed ? (ok ? 'good' : 'bad') : ''}">
        <div class="checkbar-in">
          ${revealed ? (TM.correction
            ? (TM.LESSONS && TM.LESSONS[qu.theme] ? `<a class="btn ghost cor-lesson" href="#lessons/${qu.theme}" id="cor-lesson">Leçon</a>` : '<span></span>')
            : `<div class="fb"><div class="fb-e">${ok ? '' : `<strong>Réponse : ${LETTERS[qu.answer]}.</strong> `}${qu.explanation}</div></div>`)
            : `<div class="fb-m quiz-ava quiz-ava-think">${R.mascotSVG({ size: 64, mood: 'think' })}</div><div class="fb muted kbd-hint">Astuce : touches A–E puis Entrée</div>`}
          <button class="btn ${revealed ? (ok ? 'success' : 'danger') : 'primary'} big-btn" id="${revealed ? 'continue' : 'check'}" ${!revealed && sel === null ? 'disabled' : ''}>${revealed ? (last ? 'Voir les résultats' : 'Continuer') : 'Vérifier'}</button>
        </div></div>` : ''}`;

    $app.querySelectorAll('.choice').forEach((b) => b.onclick = () => select(+b.dataset.i));
    $app.querySelectorAll('.dot').forEach((b) => b.onclick = () => { state.q = +b.dataset.i; quizView(); });
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
    on('prev', () => { state.q--; quizView(); });
    on('next', () => { state.q++; quizView(); });
    on('check', check);
    on('continue', next);
    on('flag', () => { sec.flags[state.q] = !sec.flags[state.q]; quizView(); });
    on('cor-all', () => { document.getElementById('choices')?.classList.remove('folded'); document.getElementById('cor-all')?.remove(); });
    const lessonLink = document.getElementById('cor-lesson');
    if (lessonLink) lessonLink.onclick = (e) => { if (!confirm('Quitter la série pour lire la leçon ? Ta progression dans cette série sera perdue.')) e.preventDefault(); };
    on('joker', () => {
      if (!R.useItem('fifty')) return;
      state.fifty = state.fifty || {};
      state.fifty[state.q] = fiftyRemove(qu);
      if (state.fifty[state.q].includes(sec.answers[state.q])) sec.answers[state.q] = null;
      quizView();
    });
    on('finish', () => {
      const blank = sec.answers.filter((a) => a === null).length;
      if (blank && !confirm(`${blank} question(s) sans réponse. Une erreur ne retire aucun point : mieux vaut répondre au hasard. Terminer quand même ?`)) return;
      nextSection();
    });

    function select(i) {
      if (revealed) return;
      sec.answers[state.q] = i;
      R.sound('tick');
      $app.querySelectorAll('.choice').forEach((b) => b.classList.toggle('sel', +b.dataset.i === i));
      const c = document.getElementById('check'); if (c) c.disabled = false;
    }
    function check() {
      if (sec.answers[state.q] === null) return;
      state.revealed[state.q] = true;
      const good = sec.answers[state.q] === qu.answer;
      const { gain, coins } = R.answer(good, qu.theme);
      state.xp += gain; state.coins = (state.coins || 0) + coins;
      // Carnet d’erreurs : révision ou ajout
      if (qu.errKey) { const rv = TM.errors.reviewed(qu.errKey, good); if (rv.mastered) setTimeout(() => R.toast(TM.icon('check'), 'Erreur maîtrisée : elle quitte ton carnet'), 300); }
      else if (!good) TM.errors.add(qu, sec.answers[state.q]);
      R.sound(good ? 'ok' : 'ko');
      quizView();
      // On fait glisser la page jusqu'à la correction, en gardant la question visible au-dessus
      const cor = document.getElementById('cor');
      if (cor) requestAnimationFrame(() => {
        const r = cor.getBoundingClientRect(); const bar = document.querySelector('.checkbar');
        const limit = innerHeight - (bar ? bar.offsetHeight : 0) - 12;
        if (r.bottom > limit) window.scrollBy({ top: Math.min(r.bottom - limit, r.top - 80), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
      const box = document.getElementById('qbox');
      if (!good && box) box.classList.add('shake');
      const okEl = document.querySelector('.choice.ok');
      R.floatText(okEl, `+${gain} XP`, good ? '' : 'small');
      if (coins) setTimeout(() => R.floatText(okEl, `+${coins}`, 'coin-float'), 150);
    }
    function next() {
      if (last) finishSession(); else { state.q++; quizView(); }
    }
    setKeys((e) => {
      if (e.target.tagName === 'INPUT') return;
      const k = e.key.toUpperCase();
      const idx = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : '12345'.indexOf(k);
      if (idx >= 0 && idx < qu.choices.length && !(state.fifty && state.fifty[state.q] && state.fifty[state.q].includes(idx))) { e.preventDefault(); if (state.mode === 'exam') { sec.answers[state.q] = idx; quizView(); } else select(idx); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.mode === 'exam') { if (!last) { state.q++; quizView(); } }
        else if (state.revealed[state.q]) next(); else check();
      } else if (state.mode === 'exam' && e.key === 'ArrowRight' && !last) { state.q++; quizView(); }
      else if (state.mode === 'exam' && e.key === 'ArrowLeft' && state.q > 0) { state.q--; quizView(); }
    });
    if (!timer) startTimer();
  }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  function startTimer() {
    timer = setInterval(() => {
      const sec = state.sections[state.s];
      const el = document.getElementById('timer');
      if (sec.timeLeft !== null) {
        sec.timeLeft--;
        if (el) { el.textContent = fmtTime(sec.timeLeft); el.classList.toggle('warn', sec.timeLeft < 60); }
        if (sec.timeLeft <= 0) {
          stopTimer();
          R.toast(TM.icon('timer'), 'Temps écoulé !');
          if (state.mode === 'exam') nextSection(); else finishSession();
        }
      } else {
        sec.elapsed++;
        if (el) el.textContent = fmtTime(sec.elapsed);
      }
    }, 1000);
  }

  function sectionIntro(sec) {
    stopTimer(); setKeys(null);
    const t = byId(sec.id);
    $app.innerHTML = `<div class="setup pop-in">
      <div class="muted">Sous-test ${state.s + 1} sur 6</div>
      <div class="setup-ico ico-${t.id}">${t.icon}</div>
      <h1>${t.name}</h1>
      <p>${sec.questions.length} questions · ${Math.round(sec.timeLeft / 60)} minutes</p>
      ${sec.id === 'cm' ? `<div class="cm-legend">${TM.CM_CHOICES.map((c) => `<div>${c}</div>`).join('')}</div>` : ''}
      <button class="btn primary big-btn" id="go">Démarrer le chrono</button>
    </div>`;
    document.getElementById('go').onclick = () => { state.startedSection = true; state.q = 0; quizView(); };
  }
  function nextSection() {
    stopTimer();
    if (state.s < state.sections.length - 1) { state.s++; state.q = 0; state.startedSection = false; quizView(); }
    else finishSession();
  }

  function finishSession() {
    stopTimer();
    const results = {};
    state.sections.forEach((sec) => {
      if (sec.id === 'mix') return;
      results[sec.id] = scoreSection(sec);
    });
    const all = state.sections.flatMap((s) => s.questions.map((q, i) => s.answers[i] === q.answer));
    const correct = all.filter(Boolean).length;
    const entry = { date: new Date().toISOString(), mode: state.mode, results, correct, total: all.length };
    if (state.mode === 'exam') {
      state.sections.forEach((sec) => sec.questions.forEach((q, i) => { if (sec.answers[i] !== q.answer) TM.errors.add(q, sec.answers[i]); }));
      entry.score = Object.values(results).reduce((a, r) => a + r.score, 0); // barème 2025 : +4 / 0 / 0
      entry.bareme = 'tage';
      entry.full = state.full;
      // XP de l’examen : 5 par bonne réponse + bonus de fin
      const before = R.profile.xp;
      R.addXP(correct * 5);
      const c0 = R.profile.coinsEarned;
      R.onExamEnd(entry.score, state.full);
      state.xp = R.profile.xp - before;
      state.coins = R.profile.coinsEarned - c0;
    } else if (state.mode === 'daily') {
      const c0 = R.profile.coinsEarned;
      R.onDailyEnd(correct, all.length);
      state.xp += 30 + correct * 10;
      state.coins = (state.coins || 0) + (R.profile.coinsEarned - c0);
    } else {
      R.onTrainingEnd(correct, all.length);
    }
    saveSession(entry);
    if (state.duel) return TM.social.finishDuel(state);
    state.entry = entry;
    state.reviewSection = 0;
    go('results');
  }

  // ---------- Résultats ----------
  function resultsView() {
    const { entry } = state;
    const exam = state.mode === 'exam';
    const rs = entry.results;
    const pct = pctOf(entry.correct, entry.total);
    const rsec = state.sections[state.reviewSection];
    const mood = pct >= 80 ? ['trophy', 'Impressionnant !'] : pct >= 60 ? ['star', 'Beau travail !'] : pct >= 40 ? ['check', 'Ça progresse !'] : ['sprout', 'Chaque erreur est une leçon'];
    $app.innerHTML = `
      <div class="result-hero pop-in">
        <div class="result-ico">${TM.icon(mood[0])}</div>
        <h1>${mood[1]}</h1>
        ${exam ? (() => {
          const prev = history().find((e) => e.date !== entry.date && e.mode === 'exam' && e.bareme === 'tage' && !!e.full === !!entry.full);
          const diff = prev ? entry.score - prev.score : null;
          const nWrong = Object.values(rs).reduce((a, r) => a + (r.wrong || 0), 0), nBlank = Object.values(rs).reduce((a, r) => a + (r.blank || 0), 0);
          return `<div class="big" data-count="${entry.score}">0<small> / 600</small></div>
          ${diff !== null ? `<div class="score-diff ${diff >= 0 ? 'up' : 'down'}">${diff >= 0 ? '+' : '−'}${Math.abs(diff)} points par rapport à ton dernier examen${entry.full ? '' : ' (mini)'}</div>` : ''}
          <div class="muted score-note">Score estimé : chaque sous-test est noté sur 100 selon ta part de bonnes réponses (${entry.correct} sur ${entry.total}). Depuis 2025, une erreur${nWrong ? ` (tu en as fait ${nWrong})` : ''} ou une question sans réponse${nBlank ? ` (${nBlank} ici)` : ''} ne retire aucun point : il vaut mieux répondre à tout.</div>`;
        })()
               : `<div class="big" data-count="${entry.correct}">0<small> / ${entry.total}</small></div>`}
        <div class="result-stats">
          <div class="rs"><span class="rs-v">+${state.xp}</span><span class="rs-l">XP gagnés</span></div>
          <div class="rs"><span class="rs-v">+${state.coins || 0} ${TM.coin('sm')}</span><span class="rs-l">pièces</span></div>
          <div class="rs"><span class="rs-v">${pct} %</span><span class="rs-l">réussite</span></div>
        </div>
      </div>
      ${exam ? `<h2>Détail par sous-test</h2><div class="breakdown">${Object.entries(rs).map(([id, r]) => {
        const sc = pctOf(r.correct, r.total); // sur 100, comme le vrai TAGE MAGE
        const p = Math.max(0, Math.min(100, sc));
        return `<div class="brow"><span>${byId(id).icon} ${byId(id).short}</span><div class="bar"><span style="width:${p}%" class="${p < 50 ? 'low' : p < 75 ? 'mid' : ''}"></span></div><span class="bval"><b>${String(sc).replace('-', '−')}</b>/100 · ${r.correct}/${r.total}</span></div>`;
      }).join('')}</div>` : ''}
      <h2>Correction</h2>
      ${exam ? `<div class="seg" id="revtabs">${state.sections.map((s, i) => `<button data-i="${i}" class="${i === state.reviewSection ? 'on' : ''}">${byId(s.id).icon} ${byId(s.id).short}</button>`).join('')}</div>` : ''}
      <div class="review">${rsec.questions.map((q, i) => {
        const a = rsec.answers[i]; const ok = a === q.answer;
        return `<details class="rv ${ok ? 'ok' : 'ko'}"><summary><span class="mark">${ok ? '✓' : a === null ? '–' : '✗'}</span> Question ${i + 1}</summary>
          <div class="prompt">${q.prompt}</div>
          <p><strong>Ta réponse :</strong> ${a === null ? 'aucune' : q.choices[a]}${TM.correction ? '' : `<br><strong>Bonne réponse :</strong> ${q.choices[q.answer]}`}</p>
          ${TM.correction ? TM.correction.card(q, a, { review: true, id: 'cor-' + i }) : `<p class="muted">${q.explanation}</p>`}</details>`;
      }).join('')}</div>
      <div class="row center"><a class="btn primary big-btn" href="#${exam ? 'exam' : state.mode === 'daily' ? 'survival' : state.mode === 'review' ? 'errors' : 'train/' + state.sections[0].id}">${state.mode === 'daily' ? 'Enchaîner en mode survie' : state.mode === 'review' ? 'Retour au carnet' : 'Recommencer'}</a><a class="btn ghost" href="#">Accueil</a></div>`;
    countUp();
    const tabs = document.getElementById('revtabs');
    if (tabs) tabs.onclick = (e) => { const b = e.target.closest('button'); if (b) { state.reviewSection = +b.dataset.i; resultsView(); } };
  }
  function countUp() {
    const el = document.querySelector('[data-count]'); if (!el) return;
    const target = +el.dataset.count; const small = el.querySelector('small').outerHTML;
    const t0 = performance.now(), dur = 900;
    (function f(t) {
      const k = Math.min(1, (t - t0) / dur), v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      el.innerHTML = v + small;
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  // ---------- Mode survie ----------
  const SURVIVAL_TIME = 45;
  const SURVIVAL_THEMES = ['calcul', 'logique', 'cm', 'expression', 'argumentation'];
  function survivalIntro() {
    $app.innerHTML = `<div class="setup pop-in"><div class="setup-ico ico-heart">${TM.icon('heart')}</div><h1>Mode survie</h1>
      <p>Questions mélangées, <strong>${SURVIVAL_TIME} secondes</strong> chacune. Une erreur ou un temps écoulé coûte une vie. Tu as <strong>3 vies</strong>.</p>
      <div class="record">Record : <strong>${R.profile.bestSurvival}</strong> · nouveau record : +${R.EARN.survivalRecord} ${TM.coin('xs')}</div>
      ${R.profile.inv.life ? `<label class="opt"><input type="checkbox" id="uselife"> Utiliser une vie bonus (${R.profile.inv.life} en stock) : 4 vies</label>` : `<p class="muted">Astuce : achète une vie bonus en <a href="#shop">boutique</a>.</p>`}
      <button class="btn primary big-btn" id="go">Jouer</button></div>`;
    document.getElementById('go').onclick = () => {
      R.resetCombo();
      const extra = document.getElementById('uselife')?.checked && R.useItem('life') ? 1 : 0;
      state = { mode: 'survival', lives: 3 + extra, maxLives: 3 + extra, points: 0, xp: 0, coins: 0, qu: newSurvivalQ(), sel: null, revealed: false, tLeft: SURVIVAL_TIME };
      go('survival-play');
    };
  }
  function newSurvivalQ() { return TM.gen[pick(SURVIVAL_THEMES)](1)[0]; }
  function survivalView() {
    const S = state; const qu = S.qu; const t = byId(qu.theme);
    const ok = S.sel === qu.answer;
    $app.innerHTML = `
      <div class="quiz-top">
        <a class="quit" href="#survival" title="Quitter">${TM.icon('x')}</a>
        <div class="hearts">${Array.from({ length: S.maxLives }, (_, i) => `<span class="heart ${i < S.lives ? '' : 'lost'}">${TM.icon('heart')}</span>`).join('')}</div>
        <div class="surv-score">${TM.icon('star')} ${S.points}</div>
      </div>
      <div class="tbar"><span id="tbar" style="width:${(S.tLeft / SURVIVAL_TIME) * 100}%"></span></div>
      <div class="quiz-meta"><span class="tag ico-${t.id}">${t.icon} ${t.short}</span>${R.getCombo() >= 2 ? `<span class="combo">${TM.icon('flame')}×${R.getCombo()}</span>` : ''}</div>
      <div class="qbox slide-in" id="qbox">
        <div class="prompt">${qu.prompt}</div>
        <div class="choices">${choicesHTML(qu, qu.theme === 'cm', S.sel, S.revealed, S.fifty)}</div>
        ${!S.revealed ? jokerBtn(S.fifty) : ''}
      </div>
      <div class="checkbar ${S.revealed ? (ok ? 'good' : 'bad') : ''}"><div class="checkbar-in">
        ${S.revealed ? `<div class="fb-m quiz-ava">${ok && R.getCombo() >= 5 ? `<span class="quiz-combo-bubble">${R.comboLine(R.getCombo())}</span>` : ''}${R.mascotSVG({ size: 64, mood: ok ? 'happy' : 'sad', celebrate: ok && R.getCombo() >= 5 })}</div><div class="fb"><div class="fb-h">${ok ? 'Bien joué !' : S.sel === null ? 'Temps écoulé : une vie en moins' : 'Raté : une vie en moins'}</div><div class="fb-e">${ok ? '' : `<strong>Réponse : ${LETTERS[qu.answer]}.</strong> `}${qu.explanation}</div></div>` : `<div class="fb-m quiz-ava quiz-ava-think">${R.mascotSVG({ size: 64, mood: 'think' })}</div><div class="fb muted kbd-hint">Touches A–E puis Entrée</div>`}
        <button class="btn ${S.revealed ? (ok ? 'success' : 'danger') : 'primary'} big-btn" id="act" ${!S.revealed && S.sel === null ? 'disabled' : ''}>${S.revealed ? (S.lives > 0 ? 'Continuer' : 'Voir le score') : 'Vérifier'}</button>
      </div></div>`;
    const choose = (i) => { if (S.revealed) return; S.sel = i; R.sound('tick'); $app.querySelectorAll('.choice').forEach((b) => b.classList.toggle('sel', +b.dataset.i === i)); document.getElementById('act').disabled = false; };
    $app.querySelectorAll('.choice').forEach((b) => b.onclick = () => choose(+b.dataset.i));
    const jk = document.getElementById('joker');
    if (jk) jk.onclick = () => { if (!R.useItem('fifty')) return; S.fifty = fiftyRemove(qu); if (S.fifty.includes(S.sel)) S.sel = null; survivalView(); };
    const act = () => (S.revealed ? advance() : resolve());
    document.getElementById('act').onclick = act;
    setKeys((e) => {
      const k = e.key.toUpperCase(); const idx = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : '12345'.indexOf(k);
      if (idx >= 0 && idx < 5 && !(S.fifty && S.fifty.includes(idx))) { e.preventDefault(); choose(idx); } else if (e.key === 'Enter') { e.preventDefault(); if (S.revealed || S.sel !== null) act(); }
    });
    if (!S.revealed && !timer) {
      timer = setInterval(() => {
        S.tLeft -= 0.1;
        const b = document.getElementById('tbar');
        if (b) { b.style.width = Math.max(0, (S.tLeft / SURVIVAL_TIME) * 100) + '%'; b.classList.toggle('warn', S.tLeft < 10); }
        if (S.tLeft <= 0) resolve();
      }, 100);
    }
    function resolve() {
      stopTimer();
      S.revealed = true;
      const good = S.sel === qu.answer;
      const { gain, coins } = R.answer(good, qu.theme);
      S.xp += gain; S.coins += coins;
      if (!good) TM.errors.add(qu, S.sel);
      if (good) S.points++; else S.lives--;
      R.sound(good ? 'ok' : 'ko');
      survivalView();
      if (!good) { document.getElementById('qbox').classList.add('shake'); document.querySelectorAll('.heart')[S.lives]?.classList.add('break'); }
      else { const okEl = document.querySelector('.choice.ok'); R.floatText(okEl, `+${gain} XP`); if (coins) setTimeout(() => R.floatText(okEl, `+${coins}`, 'coin-float'), 150); }
    }
    function advance() {
      if (S.lives <= 0) return survivalOver();
      S.qu = newSurvivalQ(); S.sel = null; S.revealed = false; S.fifty = null; S.tLeft = SURVIVAL_TIME;
      survivalView();
    }
  }
  function survivalOver() {
    stopTimer(); setKeys(null);
    const S = state;
    const c0 = R.profile.coinsEarned;
    const record = R.onSurvivalEnd(S.points);
    S.coins += R.profile.coinsEarned - c0;
    saveSession({ date: new Date().toISOString(), mode: 'survival', results: {}, correct: S.points, total: S.points + 3 });
    if (record) R.confetti(120);
    $app.innerHTML = `<div class="setup pop-in"><div class="setup-ico">${TM.icon(record ? 'trophy' : 'heart')}</div>
      <h1>${record ? 'Nouveau record !' : 'Partie terminée'}</h1>
      <div class="big">${S.points}<small> points</small></div>
      <p class="muted">Record : ${R.profile.bestSurvival} · +${S.xp} XP · +${S.coins} ${TM.coin('xs')}</p>
      <button class="btn primary big-btn" id="again">Rejouer</button><a class="btn ghost" href="#">Accueil</a></div>`;
    document.getElementById('again').onclick = () => go('survival');
  }

  // ---------- Graphiques (SVG, une série, infobulle au survol) ----------
  function lineChart(points, { max = 600, ref = null, refLabel = '', fmt = (v) => v } = {}) {
    const W = 560, H = 200, pl = 36, pr = 12, pt = 14, pb = 26;
    const x = (i) => pl + (points.length === 1 ? (W - pl - pr) / 2 : (i * (W - pl - pr)) / (points.length - 1));
    const y = (v) => pt + (1 - v / max) * (H - pt - pb);
    const ticks = [0, max / 2, max];
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ');
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution du score">
      ${ticks.map((t) => `<line x1="${pl}" x2="${W - pr}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${pl - 6}" y="${y(t) + 4}" class="ax" text-anchor="end">${t}</text>`).join('')}
      ${ref !== null ? `<line x1="${pl}" x2="${W - pr}" y1="${y(ref)}" y2="${y(ref)}" class="ref"/><text x="${pl + 6}" y="${y(ref) - 6}" class="ax ref-t">${refLabel}</text>` : ''}
      <path d="${path}" class="ln"/>
      ${points.map((p, i) => `<g class="pt"><circle cx="${x(i)}" cy="${y(p.v)}" r="14" class="hit"/><circle cx="${x(i)}" cy="${y(p.v)}" r="5" class="dot"/><title>${p.label} : ${fmt(p.v)}</title></g>`).join('')}
      ${points.length ? `<text x="${x(points.length - 1)}" y="${y(points[points.length - 1].v) - 12}" class="val" text-anchor="middle">${fmt(points[points.length - 1].v)}</text>` : ''}
      <text x="${pl}" y="${H - 6}" class="ax">${points[0] ? points[0].short : ''}</text>
      <text x="${W - pr}" y="${H - 6}" class="ax" text-anchor="end">${points.length > 1 ? points[points.length - 1].short : ''}</text>
    </svg>`;
  }
  function barChart(bars, { goal = null } = {}) {
    const W = 560, H = 170, pl = 28, pr = 8, pt = 14, pb = 24;
    const max = Math.max(goal || 0, ...bars.map((b) => b.v), 1);
    const bw = (W - pl - pr) / bars.length;
    const y = (v) => pt + (1 - v / max) * (H - pt - pb);
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Questions par jour">
      <line x1="${pl}" x2="${W - pr}" y1="${y(0)}" y2="${y(0)}" class="grid"/>
      ${goal ? `<line x1="${pl}" x2="${W - pr}" y1="${y(goal)}" y2="${y(goal)}" class="ref"/><text x="${W - pr}" y="${y(goal) - 5}" class="ax ref-t" text-anchor="end">objectif ${goal}</text>` : ''}
      ${bars.map((b, i) => {
        const h = Math.max(0, y(0) - y(b.v)); const bx = pl + i * bw + 2;
        return `<g class="bar-g"><rect x="${pl + i * bw}" y="${pt}" width="${bw}" height="${H - pt - pb}" class="hit"/>${b.v ? `<path d="M${bx} ${y(0)}V${y(b.v) + Math.min(4, h)}q0-4 4-4h${bw - 12}q4 0 4 4V${y(0)}z" class="b ${goal && b.v >= goal ? 'full' : ''}"/>` : ''}<title>${b.label} : ${b.v} question${b.v > 1 ? 's' : ''}</title></g>`;
      }).join('')}
      ${bars.map((b, i) => (i % 2 === bars.length % 2 ? '' : `<text x="${pl + i * bw + bw / 2}" y="${H - 6}" class="ax" text-anchor="middle">${b.short}</text>`)).join('')}
    </svg>`;
  }

  // ---------- Profil ----------
  function profileView(arg) {
    if (arg && /^settings(-|$)/.test(arg)) return settingsView(arg.replace(/^settings-?/, ''));
    const P = R.profile; const L = R.levelInfo();
    const owned = R.BADGES.filter((b) => P.badges[b.id]).length;
    const st = statsBySubtest(); const weak = weakest(st);
    const exams = history().filter((e) => e.mode === 'exam').reverse().slice(-12);
    const dfmt = (d, o) => new Date(d).toLocaleDateString('fr-FR', o);
    const examPts = exams.map((e) => ({ v: e.score, label: `${dfmt(e.date, { day: 'numeric', month: 'short' })}${e.full ? '' : ' (mini)'}`, short: dfmt(e.date, { day: 'numeric', month: 'short' }) }));
    const est = estimateScore(); const dLeft = daysUntilExam();
    const acc = TM.accounts && TM.accounts.current();
    const since = acc && acc.created ? dfmt(acc.created, { month: 'long', year: 'numeric' }) : null;
    // Semaine en cours, du lundi au dimanche
    const now = new Date(); const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); const key = d.toLocaleDateString('fr-CA'); return { l: 'LMMJVSD'[i], on: (P.days[key] || 0) > 0, today: key === now.toLocaleDateString('fr-CA'), full: dfmt(d, { weekday: 'long' }) }; });
    const played = week.filter((d) => d.on).length;
    const badgeList = R.BADGES.slice().sort((a, b) => (P.badges[b.id] ? 1 : 0) - (P.badges[a.id] ? 1 : 0));
    $app.innerHTML = `${TM.social ? TM.social.tabs('me') : ''}
      <div class="pf pop-in">
        <div class="pf-top"><h1>Profil</h1><a class="pf-gear" href="#profile/settings" aria-label="Réglages" title="Réglages">${TM.icon('settings')}</a></div>
        <section class="pf-id">
          <a class="pf-ring" href="#shop/look" style="--p:${L.pct}" aria-label="Personnaliser mon avatar">${R.mascotSVG({ size: 74 })}</a>
          <div class="pf-who"><b>${P.name ? esc(P.name) : 'Mon profil'}</b>
            ${since ? `<span class="muted">Membre depuis ${since}</span>` : `<span class="muted">${esc(L.title)}</span>`}
            <span class="pf-lv">Niveau ${L.level} · ${L.pct} %</span></div>
        </section>
        <section class="pf-score">
          <span class="pf-score-l">Score estimé</span>
          ${est ? `<div class="pf-big">${est.value}<span> / 600</span></div>
            <div class="pf-bar" role="progressbar" aria-label="Progression vers l’objectif" aria-valuemin="0" aria-valuemax="${P.target}" aria-valuenow="${Math.min(est.value, P.target)}"><i style="width:${Math.min(100, Math.round((est.value / P.target) * 100))}%"></i></div>
            <span class="pf-score-l">Objectif ${P.target}${est.value >= P.target ? ' · atteint, bravo !' : ` · encore ${P.target - est.value} points`}${dLeft !== null && dLeft >= 0 ? ` · examen dans ${dLeft} jour${dLeft > 1 ? 's' : ''}` : ''}</span>
            <span class="pf-src">${est.src}</span>`
          : `<p class="pf-empty">Passe un examen blanc, ou entraîne-toi sur au moins 3 épreuves, pour estimer ton score sur 600.</p><a class="btn primary" href="#exam">Passer un mini-examen</a>`}
        </section>
        <section class="pf-tiles">
          ${P.hideGame ? '' : `<div><span class="pf-ti">${TM.icon('flame')}</span><b>${R.currentStreak()} j</b><span class="muted">série</span></div>`}
          ${P.hideGame ? '' : `<div><span class="pf-ti">${TM.coin('sm')}</span><b>${P.coins}</b><span class="muted">pièces</span></div>`}
          <div><span class="pf-ti">${TM.icon('check')}</span><b>${P.totalAnswered}</b><span class="muted">réponses</span></div>
          ${P.hideGame ? `<div><span class="pf-ti">${TM.icon('target')}</span><b>${pctOf(P.totalCorrect, P.totalAnswered)} %</b><span class="muted">réussite</span></div>` : ''}
        </section>
        <section class="pf-card">
          <div class="pf-h"><b>Par épreuve</b><span class="muted">sur 100</span></div>
          ${F.subtests.map((t) => {
            const s = st[t.id]; const sc = s.n ? pctOf(s.c, s.n) : null; const isWeak = weak.id === t.id && weak.pct !== null;
            return `<a class="pf-sub ${isWeak ? 'weak' : ''}" href="#train/${t.id}" style="--c:var(--c-${t.id})" title="${t.name} : ${s.n ? sc + '/100 sur ' + s.n + ' questions' : 'pas encore commencé'}">
              <span>${t.short}${isWeak ? ' !' : ''}</span><span class="pf-b"><i style="width:${sc === null ? 0 : sc}%"></i></span><em>${sc === null ? '—' : sc}</em></a>`;
          }).join('')}
        </section>
        <section class="pf-card">
          <div class="pf-h"><b>Cette semaine</b><span class="muted">${played} jour${played > 1 ? 's' : ''} sur 7</span></div>
          <div class="pf-week">${week.map((d) => `<span class="${d.on ? 'on' : ''} ${d.today ? 'today' : ''}" title="${d.full}${d.on ? ' : joué' : ''}">${d.l}</span>`).join('')}</div>
        </section>
        <section class="pf-card">
          <div class="pf-h"><b>Mon score</b><span class="muted">examens blancs</span></div>
          ${examPts.length ? lineChart(examPts, { ref: P.target, refLabel: `objectif ${P.target}` }) : `<div class="empty">${TM.icon('exam')}<p>Passe un examen blanc pour voir ta courbe de score.</p><a class="btn" href="#exam">Passer un examen</a></div>`}
        </section>
        <section class="pf-card">
          <div class="pf-h"><b>Badges</b><button type="button" class="pf-link" id="pf-badges">${owned} / ${R.BADGES.length} · Tout voir</button></div>
          <div class="pf-badges" id="pf-badge-row">${badgeList.map((b) => `<span class="pf-badge ${P.badges[b.id] ? 'got' : ''}" title="${esc(b.name)} : ${esc(b.desc)}">${TM.icon(P.badges[b.id] ? b.icon : 'lock')}</span>`).join('')}</div>
          <div class="badges pf-allbadges" id="pf-badge-all" hidden>${badgeList.map((b) => `<div class="badge ${P.badges[b.id] ? 'got' : ''}" title="${b.desc}"><span class="badge-ico">${TM.icon(P.badges[b.id] ? b.icon : 'lock')}</span><span class="badge-n">${b.name}</span><span class="badge-d">${b.desc}</span></div>`).join('')}</div>
        </section>
      </div>`;
    const bt = document.getElementById('pf-badges');
    bt.onclick = () => { const all = document.getElementById('pf-badge-all'); const open = all.hidden; all.hidden = !open; document.getElementById('pf-badge-row').hidden = open; bt.textContent = open ? 'Réduire' : `${owned} / ${R.BADGES.length} · Tout voir`; };
  }

  // ---------- Réglages : 5 rubriques, chacune sur sa page (#profile/settings-<rubrique>) ----------
  function settingsView(sub) {
    const P = R.profile; const $ = (id) => document.getElementById(id);
    const acc = TM.accounts && TM.accounts.current();
    const isAdmin = TM.admin && TM.admin.isAdmin();
    const dLong = (d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    const modeLabel = { auto: 'Automatique', light: 'Clair', dark: 'Sombre' }[P.mode] || 'Clair';
    const back = (href, label) => `<a class="set-back" href="${href}">${TM.icon('arrow')} ${label}</a>`;
    const toggle = (id, on, label, note = '') => `<label class="set-tg"><span><b>${label}</b>${note ? `<small>${note}</small>` : ''}</span><input type="checkbox" id="${id}" role="switch" ${on ? 'checked' : ''}><i aria-hidden="true"></i></label>`;
    const row = (key, icon, cls, title, desc) => `<a class="set-row" href="#profile/settings-${key}"><span class="set-ic ${cls}">${TM.icon(icon)}</span><span class="set-l"><b>${title}</b><small>${desc}</small></span>${TM.icon('chevron')}</a>`;
    const pages = {
      '': () => `${back('#profile', 'Profil')}<h1>Réglages</h1>
        ${acc ? `<a class="set-me" href="#profile/settings-compte"><span class="set-ava">${R.mascotSVG({ size: 46 })}</span><span class="set-l"><b>${esc(acc.username)}</b><small>Mon compte · pseudo, déconnexion</small></span>${TM.icon('chevron')}</a>` : ''}
        <div class="set-list">
          ${row('prep', 'target', 'i-prep', 'Ma préparation', `${P.examDate ? `Examen le ${dLong(P.examDate)} · ` : ''}${P.target} / 600 · ${P.dailyGoal} questions par jour`)}
          ${row('aff', 'sun', 'i-aff', 'Affichage et sons', `${modeLabel} · sons ${P.sound ? 'activés' : 'coupés'}${P.hideGame ? ' · concentration' : ''}`)}
          ${row('prog', 'chart', 'i-prog', 'Ma progression', 'Historique, réinitialiser')}
          ${row('aide', 'book', 'i-aide', 'Aide et informations', 'Nouveautés, visite guidée, confidentialité')}
          ${isAdmin ? row('admin', 'lock', 'i-admin', 'Administration', 'Visible seulement pour toi') : ''}
        </div>
        <p class="muted app-version">MyPrépaTM version ${esc(window.TM_VERSION || '?')} (bêta)</p>`,
      compte: () => `${back('#profile/settings', 'Réglages')}<h1>Mon compte</h1>
        <label class="set-f"><span>Prénom ou pseudo affiché</span><input id="s-name" maxlength="20" value="${esc(P.name)}" autocomplete="nickname"></label>
        ${acc ? `<div class="set-f"><span>Connexion</span><p class="set-p">Connecté en tant que <b>${esc(acc.username)}</b>. Ton compte et ta progression restent sur cet appareil.</p>
          <button class="btn ghost set-wide" id="acc-logout" type="button">Se déconnecter</button></div>
          <div class="set-zone"><button class="btn danger set-wide" id="s-delete" type="button">Supprimer mon compte et mes données</button><small>Efface ce compte et toute sa progression. C’est définitif.</small></div>` : ''}`,
      prep: () => `${back('#profile/settings', 'Réglages')}<h1>Ma préparation</h1>
        <label class="set-f"><span>Date de l’examen</span><input type="date" id="s-date" value="${P.examDate || ''}"></label>
        <label class="set-f"><span>Score visé : <b id="s-tv">${P.target}</b> / 600</span><input type="range" id="s-target" min="150" max="600" step="10" value="${P.target}"></label>
        <div class="set-f"><span>Objectif du jour</span><div class="seg set-seg" id="s-goal">${[10, 20, 40].map((v) => `<button type="button" data-v="${v}" class="${P.dailyGoal === v ? 'on' : ''}">${v} questions</button>`).join('')}</div></div>
        <p class="set-note">Ces réglages servent à te proposer la bonne mission chaque jour et à afficher le compte à rebours.</p>`,
      aff: () => `${back('#profile/settings', 'Réglages')}<h1>Affichage et sons</h1>
        <div class="set-f"><span>Apparence</span><div class="seg set-seg" id="s-mode">${[['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']].map(([v, l]) => `<button type="button" data-v="${v}" class="${P.mode === v ? 'on' : ''}">${l}</button>`).join('')}</div><small class="set-small">« Auto » suit le réglage de ton téléphone.</small></div>
        <div class="set-f">${toggle('s-sound', P.sound, 'Sons')}</div>
        <div class="set-f">${toggle('s-hide', P.hideGame, 'Mode concentration', 'Masque la série et les pièces')}</div>`,
      prog: () => `${back('#profile/settings', 'Réglages')}<h1>Ma progression</h1>
        <div class="set-list"><a class="set-row" href="#history"><span class="set-ic i-prog">${TM.icon('history')}</span><span class="set-l"><b>Historique des sessions</b><small>Tous tes entraînements et examens</small></span>${TM.icon('chevron')}</a></div>
        <p class="set-sec">Zone sensible</p>
        <div class="set-zone"><button class="btn danger set-wide" id="reset" type="button">Réinitialiser ma progression</button><small>Efface XP, pièces, objets, badges, série, historique et questions déjà vues de ce compte. C’est définitif.</small></div>`,
      aide: () => `${back('#profile/settings', 'Réglages')}<h1>Aide</h1>
        <div class="set-list">
          <a class="set-row" href="#" id="s-news"><span class="set-ic i-aide">${TM.icon('star')}</span><span class="set-l"><b>Nouveautés</b><small>Version ${esc(window.TM_VERSION || '?')}</small></span>${TM.icon('chevron')}</a>
          <a class="set-row" href="#" id="s-tour"><span class="set-ic i-prep">${TM.icon('target')}</span><span class="set-l"><b>Revoir la visite guidée</b><small>Les zones de l’accueil, une par une</small></span>${TM.icon('chevron')}</a>
          <a class="set-row" href="#privacy"><span class="set-ic i-gray">${TM.icon('lock')}</span><span class="set-l"><b>Confidentialité</b><small>Tes données, tes droits</small></span>${TM.icon('chevron')}</a>
          <a class="set-row" href="#legal"><span class="set-ic i-gray">${TM.icon('book')}</span><span class="set-l"><b>Mentions légales</b><small>Éditeur, hébergeur</small></span>${TM.icon('chevron')}</a>
        </div>`,
      admin: () => `${back('#profile/settings', 'Réglages')}<h1>Administration</h1>${isAdmin ? TM.admin.settingsHTML() : '<p class="muted">Réservé à l’administrateur.</p>'}`,
    };
    const key = pages[sub] ? sub : '';
    $app.innerHTML = `${TM.social ? TM.social.tabs('me') : ''}<div class="set-page ${key ? 'set-in' : ''}">${pages[key]()}</div>`;
    // Branchements (seuls les éléments présents sur la page affichée sont reliés)
    const saveField = (k, v) => { R.setProfile({ [k]: v }); };
    const on = (id, ev, fn) => { const el = $(id); if (el) el[ev] = fn; };
    on('s-name', 'onchange', (e) => saveField('name', e.target.value.trim()));
    on('s-date', 'onchange', (e) => saveField('examDate', e.target.value || null));
    on('s-target', 'oninput', (e) => { $('s-tv').textContent = e.target.value; });
    on('s-target', 'onchange', (e) => saveField('target', +e.target.value));
    on('s-goal', 'onclick', (e) => { const b = e.target.closest('button'); if (b) { saveField('dailyGoal', +b.dataset.v); settingsView('prep'); } });
    on('s-mode', 'onclick', (e) => { const b = e.target.closest('button'); if (b) { R.setMode(b.dataset.v); settingsView('aff'); } });
    on('s-sound', 'onchange', (e) => { saveField('sound', e.target.checked); R.sound('ok'); });
    on('s-hide', 'onchange', (e) => saveField('hideGame', e.target.checked));
    on('reset', 'onclick', () => { if (confirm('Effacer XP, pièces, objets, badges, série, historique et questions déjà vues ? C’est définitif.')) { clearLocalData(); go(''); } });
    on('s-delete', 'onclick', () => { if (confirm(`Supprimer ton compte « ${acc ? acc.username : ''} » et toute sa progression ? C’est définitif.`)) deleteMyAccount(); });
    on('s-news', 'onclick', (e) => { e.preventDefault(); if (TM.update) TM.update.showNotes(true); });
    on('s-tour', 'onclick', (e) => { e.preventDefault(); if (TM.tour) TM.tour.replay(); });
    if (key === 'compte' && TM.accounts) TM.accounts.bindSettings();
    // Admin : outils sur sa page ; l'entrée cachée (5 touches sur la version) reste sur la page principale
    if (TM.admin && (key === 'admin' || key === '')) TM.admin.bind(() => settingsView(key));
  }

  // ---------- Boutique ----------
  function shopView(tab) {
    tab = tab || shopView.tab || 'look';
    // Fonds, compagnons, effets et gestes sont regroupés dans « Extras » (les anciens liens #shop/bg… y mènent)
    if (['bg', 'pet', 'aura', 'emote'].includes(tab)) { shopView.sub = tab; tab = 'fx'; }
    if (tab !== shopView.tab) shopView.try = null;
    shopView.tab = tab;
    // L’onglet ouvert reste dans l’adresse : un rechargement ou un lien rouvre le même rayon
    if (location.hash.startsWith('#shop') && location.hash !== `#shop/${tab}`) window.history.replaceState(null, '', `#shop/${tab}`);
    if (!shopView.keys) { shopView.keys = true; document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.dataset.view === 'shop' && shopView.try && !document.querySelector('.modal-bg')) { shopView.try = null; shopView(shopView.tab); } }); }
    const P = R.profile, M = TM.mascot;
    const price = (n) => `<span class="price">${TM.coin('xs')} ${n}</span>`;
    // Prix d’un objet, barré + réduit s’il fait partie de la sélection de la semaine
    const itemPrice = (x) => (R.isDeal(x) ? `<span class="shop-deal-p"><s>${x.price}</s>${price(R.priceOf(x))}</span>` : price(x.price));
    const GROUPS = { acc: M.ACC_SLOTS, fx: ['bg', 'pet', 'aura', 'emote'] };
    const tabOf = (slot) => Object.keys(GROUPS).find((g) => GROUPS[g].includes(slot)) || slot;
    const TABS = [['look', 'Apparence'], ['acc', 'Accessoires'], ['fx', 'Extras'], ['sets', 'Ensembles'], ['coll', 'Collection'], ['bonus', 'Bonus']];
    const slotsOf = (t) => GROUPS[t] || [t];

    // Cabine d’essayage : tenue actuelle + objet à l’essai (rien n’est acheté sans clic sur « Acheter »)
    const tr = shopView.try;
    const equip = Object.assign({}, P.equip), look = Object.assign({}, P.look);
    let tryItem = null, tryLook = null;
    if (tr && tr.slot) { tryItem = R.ITEMS.find((x) => x.id === tr.id); if (tryItem) equip[tryItem.slot] = tryItem.id; }
    if (tr && tr.cat) { tryLook = M.LOOK[tr.cat].find((o) => o.id === tr.id); if (tryLook) look[tr.cat] = tr.id; }
    const trySet = tr && tr.set ? M.SETS.find((x) => x.id === tr.set) : null;
    if (trySet) trySet.items.forEach((pid) => { if (pid.startsWith('look:')) { const [, c, v] = pid.split(':'); look[c] = v; } else { const it = R.ITEMS.find((x) => x.id === pid); if (it) equip[it.slot] = it.id; } });
    const pieceName = (pid) => { if (pid.startsWith('look:')) { const [, c, v] = pid.split(':'); return M.LOOK[c].find((o) => o.id === v).name; } return R.ITEMS.find((x) => x.id === pid).name; };
    const cabAva = R.mascotSVG({ size: 190, cls: 'bob', equip, look, loop: !!(tryItem && tryItem.slot === 'emote') });
    let panel;
    if (trySet) {
      const inf = R.setInfo(trySet);
      panel = `<div class="shop-try"><span class="shop-rar r-set">Ensemble</span><b class="shop-try-n">${trySet.name}</b><span class="muted small">${inf.have} / ${inf.total} pièces possédées · bonus +${trySet.bonus} ${TM.coin('xs')}</span>
        <ul class="shop-pieces">${trySet.items.map((pid) => `<li class="${R.pieceOwned(pid) ? 'ok' : ''}">${R.pieceOwned(pid) ? TM.icon('check') : TM.icon('lock')} ${pieceName(pid)}</li>`).join('')}</ul>
        <button class="btn ghost shop-untry" data-shop-untry>Annuler l’essai</button></div>`;
    } else if (tryItem || tryLook) {
      const name = tryItem ? tryItem.name : (tryLook.name || M.LOOK_LABELS[tr.cat]);
      const cost = tryItem ? R.priceOf(tryItem) : tryLook.price;
      const st = tryItem ? R.itemState(tryItem) : R.lookState(tr.cat, tr.id);
      const rar = R.rarity(tryItem || { price: cost });
      let action;
      if (st === 'buy') {
        action = P.coins >= cost
          ? `<button class="btn primary shop-buy" data-shop-buy>Acheter ${price(cost)}</button><div class="shop-after">Solde après achat : ${P.coins - cost} ${TM.coin('xs')}</div>`
          : `<button class="btn shop-buy" disabled>Il te manque ${cost - P.coins} ${TM.coin('xs')}</button><button class="shop-after shop-earn-link" type="button" data-shop-earn>Comment gagner des pièces ?</button>`;
      } else {
        const lp = R.lockProgress(tryItem);
        action = `<div class="shop-lock">${TM.icon('lock')}<div><b>${lp.label}</b><span>${lp.hint}</span></div></div><span class="shop-bar"><i style="width:${lp.pct}%"></i></span>`;
      }
      panel = `<div class="shop-try"><span class="shop-rar r-${rar.id}">${rar.name}</span>${tryItem && R.isDeal(tryItem) && st === 'buy' ? `<span class="shop-deal-tag">−${R.DEAL_PCT} % cette semaine</span>` : ''}<b class="shop-try-n">${name}</b><span class="muted small">À l’essai dans la cabine</span>${action}<button class="btn ghost shop-untry" data-shop-untry>Annuler l’essai</button></div>`;
    } else {
      const c = R.collection();
      panel = `<div class="shop-try shop-idle"><b>${tab === 'coll' ? 'Ta tenue du moment' : 'Touche un objet pour l’essayer'}</b><span class="muted small">${tab === 'coll' ? 'Touche un objet possédé pour l’enfiler.' : `Rien n’est acheté sans ton accord · ${c.owned}/${c.total} objets`}</span></div>`;
    }

    let main = '';
    if (tab === 'look') {
      main = `<div id="lk-editor">${lookEditorHTML(look, { shop: true, cat: shopView.lkcat || 'hair' })}</div><p class="muted small">Les options gratuites se changent à volonté. Les options payantes s’essaient avant l’achat.</p>`;
    } else if (tab === 'coll') {
      const c = R.collection(), pc = R.pace(), lvl = R.levelInfo().level;
      const quests = R.ITEMS.filter((x) => x.quest);
      const setsDone = M.SETS.filter((x) => R.setInfo(x).complete).length;
      const fmt = (d) => (d ? new Date(d + 'T12:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '');
      const dateOf = (x) => P.ownedAt[x.id] || P.quests[x.id] || (x.badge && P.badges[x.badge]) || '';
      const mine = R.ITEMS.filter((x) => x.price !== 0 && R.itemState(x) === 'owned');
      const paceTxt = pc.days === null ? 'Entraîne-toi quelques jours : j’estimerai le temps pour tout débloquer.'
        : pc.remaining <= P.coins ? 'Tu as de quoi acheter tout ce qui reste.'
        : `Environ <b>${pc.days} jour${pc.days > 1 ? 's' : ''} d’entraînement</b> pour acheter tout le reste, à ton rythme.`;
      main = `<p class="shop-sum"><b>${c.owned}/${c.total}</b> objets · <b>${setsDone}/${M.SETS.length}</b> ensembles · <b>${quests.filter((x) => P.quests[x.id]).length}/${quests.length}</b> quêtes</p>
        <p class="shop-pace" title="${pc.days === null ? '' : `Environ ${pc.perDay} pièces par jour d’entraînement, ${pc.remaining} pièces restantes. Les objets de quête, de badge et de série se gagnent, ils ne s’achètent pas.`}">${TM.icon('timer')} <span>${paceTxt}</span></p>
        <h3 class="shop-h">Quêtes</h3>
        <div class="shop-quests">${quests.map((x) => { const qp = R.questProgress(x), done = !!P.quests[x.id];
          return `<button class="shop-quest ${done ? 'is-done' : ''}" data-shop-item="${x.id}">${M.preview(x.id, P.look, P.equip, { level: lvl, size: 56 })}<span class="shop-quest-b"><b>${x.name}</b><span>${done ? `Réussie le ${fmt(P.quests[x.id])} · touche pour ${P.equip[x.slot] === x.id ? 'retirer' : 'enfiler'}` : `${qp.label} · ${qp.hint}`}</span>${done ? '' : `<span class="shop-bar sm"><i style="width:${qp.pct}%"></i></span>`}</span></button>`; }).join('')}</div>
        <h3 class="shop-h">Mes objets (${mine.length})</h3>
        ${mine.length ? `<div class="shop-mine">${mine.map((x) => `<button class="shop-mine-i ${P.equip[x.slot] === x.id ? 'is-on' : ''}" data-shop-item="${x.id}" title="${x.name}">${M.preview(x.id, P.look, P.equip, { level: lvl, size: 64 })}<b>${x.name}</b><span>${fmt(dateOf(x)) || M.SLOTS[x.slot]}</span></button>`).join('')}</div>` : '<p class="shop-empty">Ta vitrine est vide pour l’instant. Ton premier objet t’attend dans les rayons.</p>'}`;
    } else if (tab === 'sets') {
      main = `
        <div class="shop-sets">${M.SETS.map((set) => {
          const inf = R.setInfo(set);
          const eq = Object.assign({}, P.equip), lk = Object.assign({}, P.look);
          set.items.forEach((pid) => { if (pid.startsWith('look:')) { const [, c, v] = pid.split(':'); lk[c] = v; } else { const it = R.ITEMS.find((x) => x.id === pid); eq[it.slot] = it.id; } });
          const action = inf.complete
            ? (inf.claimed ? `<button class="btn" data-shop-wear="${set.id}">Porter l’ensemble</button>` : `<button class="btn primary" data-shop-claim="${set.id}">Récupérer +${set.bonus} ${TM.coin('xs')}</button>`)
            : `<button class="btn" data-shop-tryset="${set.id}">${TM.icon('eye')} Essayer</button>`;
          return `<div class="shop-set ${inf.complete ? 'is-done' : ''}">
            <div class="shop-set-ava">${M.svg({ look: lk, equip: eq, level: R.levelInfo().level, size: 92 })}</div>
            <div class="shop-set-b"><div class="shop-set-h"><b>${set.name}</b><span>${inf.claimed ? 'Bonus récupéré' : `+${set.bonus} ${TM.coin('xs')}`}</span></div>
              <span class="shop-bar"><i style="width:${Math.round((inf.have / inf.total) * 100)}%"></i></span>
              <ul class="shop-pieces">${set.items.map((pid) => `<li class="${R.pieceOwned(pid) ? 'ok' : ''}">${R.pieceOwned(pid) ? TM.icon('check') : '·'} ${pieceName(pid)}</li>`).join('')}</ul>
              ${action}</div></div>`;
        }).join('')}</div>`;
    } else if (tab !== 'bonus') {
      const filter = shopView.filter || 'all';
      const sub = GROUPS[tab] && GROUPS[tab].includes(shopView.sub) ? shopView.sub : 'all';
      const lvl = R.levelInfo().level;
      let list = R.ITEMS.filter((x) => slotsOf(tab).includes(x.slot) && (sub === 'all' || x.slot === sub));
      if (filter === 'owned') list = list.filter((x) => R.itemState(x) === 'owned');
      if (filter === 'todo') list = list.filter((x) => R.itemState(x) !== 'owned');
      if (filter === 'afford') list = list.filter((x) => R.itemState(x) === 'buy' && R.priceOf(x) <= P.coins);
      // Achetables d’abord (promos en tête), puis possédés, puis trop chers, puis à gagner ; ordre d’origine conservé dans chaque groupe
      const rank = (x) => { const st = R.itemState(x); if (st === 'buy') return R.priceOf(x) <= P.coins ? (R.isDeal(x) ? 0 : 1) : 3; return st === 'owned' ? 2 : 4; };
      list = list.map((x, i) => [x, i, rank(x)]).sort((a, b) => a[2] - b[2] || a[1] - b[1]).map((a) => a[0]);
      // « Voir plus » : 3 lignes au départ (9 sur téléphone, 12 sur ordinateur), puis 3 lignes de plus à chaque appui
      const step = window.matchMedia('(max-width: 760px)').matches ? 9 : 12;
      const moreKey = `${tab}|${sub}|${filter}`;
      if (shopView.moreKey !== moreKey) { shopView.moreKey = moreKey; shopView.shown = step; }
      const tryIdx = tr && tr.slot ? list.findIndex((x) => x.id === tr.id) : -1;
      if (tryIdx >= shopView.shown) shopView.shown = Math.ceil((tryIdx + 1) / step) * step; // l’objet à l’essai reste visible
      const rest = list.length - shopView.shown;
      const chips = (key, opts, cur) => `<div class="shop-chips" data-shop-chip="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${cur === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
      const card = (x) => {
        const st = R.itemState(x);
        const on = P.equip[x.slot] === x.id || (x.slot === 'emote' && !P.equip.emote && x.id === 'e-hop');
        const rar = R.rarity(x), locked = !['owned', 'buy'].includes(st);
        let foot;
        if (st === 'owned') foot = on ? `<span class="shop-worn">${TM.icon('check')} ${x.slot === 'emote' ? 'Actif' : 'Porté'}</span>` : `<span class="shop-own">Possédé · ${x.slot === 'emote' ? 'choisir' : 'enfiler'}</span>`;
        else if (st === 'buy') foot = itemPrice(x);
        else { const lp = R.lockProgress(x); const short = x.badge ? 'Badge' : x.season ? 'Saison' : x.quest ? 'Quête' : x.streak ? `Série ${x.streak} j` : lp.label; foot = `<span class="shop-lk" title="${lp.label}">${TM.icon('lock')} ${short}</span>`; }
        const cls = [`r-${rar.id}`, st === 'owned' && 'is-owned', on && 'is-on', locked && 'is-locked', st === 'buy' && P.coins < R.priceOf(x) && 'is-poor', tr && tr.slot && tr.id === x.id && 'is-try'].filter(Boolean).join(' ');
        return `<button class="shop-card ${cls}" data-shop-item="${x.id}" aria-label="${x.name}">
          ${on ? `<span class="shop-on">${TM.icon('check')}</span>` : st === 'buy' && R.isDeal(x) ? `<span class="shop-deal-tag">−${R.DEAL_PCT} %</span>` : ''}
          <span class="shop-prev">${M.preview(x.id, P.look, P.equip, { level: lvl, size: 96 })}</span>
          <span class="shop-n">${x.name}</span><span class="shop-foot">${foot}</span></button>`;
      };
      main = `
        <div class="shop-toolbar">${GROUPS[tab] ? chips('sub', [['all', 'Tout']].concat(GROUPS[tab].map((s) => [s, M.SLOTS[s]])), sub) : ''}${chips('filter', [['all', 'Tout'], ['afford', 'Dans mon budget'], ['owned', 'Possédés']], filter)}</div>
        ${list.length ? `<div class="shop-cards">${list.slice(0, shopView.shown).map(card).join('')}</div>${rest > 0 ? `<button class="btn shop-more" type="button" data-shop-more>Voir plus <span>(${rest})</span></button>` : ''}` : `<p class="shop-empty">${filter === 'afford' ? 'Rien dans ton budget pour l’instant. Encore quelques bonnes réponses !' : filter === 'owned' ? 'Tu n’as encore rien dans ce rayon.' : 'Rien ici pour l’instant.'}</p>`}`;
    }
    const bonus = `<div class="shop-grid">${R.BOOSTS.map((b) => {
      const have = b.id === 'boost' ? (R.boostActive() ? `actif · ${Math.ceil((P.boostUntil - Date.now()) / 60000)} min` : '') : `${P.inv[b.id]}${b.max ? ' / ' + b.max : ''} en stock`;
      const full = b.max && P.inv[b.id] >= b.max;
      return `<div class="shop-item">
        <div class="shop-ico ico-${b.id}">${TM.icon(b.icon)}</div>
        <div class="shop-n">${b.name}</div><div class="shop-d">${b.desc}</div>
        ${have ? `<div class="shop-have">${have}</div>` : ''}
        <button class="btn ${P.coins >= b.price && !full ? 'primary' : ''}" data-boost="${b.id}" ${P.coins < b.price || full ? 'disabled' : ''}>${full ? 'Stock plein' : price(b.price)}</button>
      </div>`;
    }).join('')}</div>`;

    const end = new Date(R.dealsEnd().getTime() - 86400000).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    // Sélection de la semaine en une ligne : vignettes seules (nom au survol), prix barré sur la carte de l’objet
    const deals = tab === 'bonus' ? '' : `<section class="shop-deals shop-deals-slim" aria-label="Sélection de la semaine">
      <div class="shop-deals-h"><b>−${R.DEAL_PCT} % cette semaine</b><span>jusqu’au ${end}</span></div>
      <div class="shop-deals-l">${R.weeklyDeals().map((id) => { const x = R.ITEMS.find((i) => i.id === id); const own = R.itemState(x) === 'owned';
        return `<button class="shop-deal ${own ? 'is-owned' : ''}" data-shop-deal="${x.id}" title="${x.name}${own ? ' (possédé)' : ''}" aria-label="${x.name}${own ? ', possédé' : ''}">${M.preview(x.id, P.look, P.equip, { level: R.levelInfo().level, size: 40 })}${own ? `<i class="shop-deal-ok">${TM.icon('check')}</i>` : ''}</button>`; }).join('')}</div></section>`;
    const E = R.EARN;
    const scrollY = window.scrollY;
    $app.innerHTML = `
      <header class="shop-top"><h1>Boutique</h1><a class="shop-wallet" href="#shop/coll" title="Ma collection">${TM.coin()}<b>${P.coins}</b></a></header>
      <details class="shop-note"><summary>${TM.icon('check')} Pièces virtuelles, gagnées uniquement en jouant : jamais achetables avec de l’argent réel. <u>En savoir plus</u></summary><p>Elles ne sont ni remboursables ni transférables, n’ont aucune valeur hors de l’appli, et sont perdues si tu effaces les données de ton navigateur.</p></details>
      ${deals}
      <nav class="shop-tabs" id="shoptabs" aria-label="Rayons de la boutique">${TABS.map(([id, l]) => `<button data-tab="${id}" class="${tab === id ? 'on' : ''}" ${tab === id ? 'aria-current="page"' : ''}><span>${l}</span></button>`).join('')}</nav>
      ${tab === 'bonus' ? bonus : `<div class="shop-layout" data-tab="${tab}">
        <aside class="shop-cabin ${tryItem || tryLook || trySet ? 'is-trying' : ''}" aria-label="Cabine d’essayage"><div class="shop-stage">${cabAva}<span class="shop-floor"></span></div>${panel}</aside>
        <section class="shop-main">${main}</section></div>`}
      <details class="earn"><summary>Comment gagner des pièces ?</summary>
        <ul>
          <li>Bonne réponse : +${E.correct}, et +${E.comboBonus} de plus à partir de 5 d’affilée</li>
          <li>Objectif du jour (${R.DAILY_GOAL} questions) : +${E.goal}</li>
          <li>Défi du jour : +${E.dailyBase}, plus ${E.dailyPerCorrect} par bonne réponse</li>
          <li>Nouveau record en survie : +${E.survivalRecord}</li>
          <li>Examen blanc complet : +${E.examFull} (mini : +${E.examMini})</li>
          <li>Niveau supérieur : +${E.levelUp} · Badge débloqué : +${E.badge}</li>
        </ul>
      </details>`;
    window.scrollTo(0, scrollY);
    const rerender = (playEmote) => { shopView(tab); if (playEmote) requestAnimationFrame(() => M.play(document.querySelector('.shop-stage .mascot'))); };
    document.getElementById('shoptabs').onclick = (e) => { const b = e.target.closest('button'); if (b) { shopView.sub = 'all'; shopView(b.dataset.tab); } };
    $app.querySelectorAll('[data-shop-chip]').forEach((g) => g.onclick = (e) => { const b = e.target.closest('button'); if (b) { shopView[g.dataset.shopChip] = b.dataset.v; rerender(); } });
    $app.querySelectorAll('[data-boost]').forEach((b) => b.onclick = () => { if (R.buyBoost(b.dataset.boost)) { R.confetti(40); R.toast(TM.coin(), 'Bonus obtenu'); } rerender(); });
    $app.querySelectorAll('[data-shop-item]').forEach((b) => b.onclick = () => {
      const it = R.ITEMS.find((x) => x.id === b.dataset.shopItem);
      if (R.itemState(it) === 'owned') { R.equip(it.id); R.sound('tick'); shopView.try = null; return rerender(P.equip[it.slot] === it.id); }
      shopView.try = { slot: it.slot, id: it.id }; R.sound('tick'); rerender();
    });
    const buy = $app.querySelector('[data-shop-buy]');
    if (buy) buy.onclick = () => {
      let ok = false;
      if (tryItem) { ok = R.buyItem(tryItem.id); if (ok) R.equip(tryItem.id); }
      else if (tryLook) { ok = R.buyLook(tr.cat, tr.id); if (ok) R.setLook(tr.cat, tr.id); }
      if (!ok) return;
      shopView.try = null; R.confetti(60); R.toast(TM.coin(), `<strong>${tryItem ? tryItem.name : tryLook.name || 'Nouvelle option'}</strong> obtenu !`);
      rerender(true);
    };
    $app.querySelectorAll('[data-shop-deal]').forEach((b) => b.onclick = () => {
      const it = R.ITEMS.find((x) => x.id === b.dataset.shopDeal);
      shopView.tab = tabOf(it.slot); shopView.filter = 'all'; shopView.sub = 'all';
      shopView.try = R.itemState(it) === 'owned' ? null : { slot: it.slot, id: it.id }; R.sound('tick'); shopView(shopView.tab);
    });
    $app.querySelectorAll('[data-shop-tryset]').forEach((b) => b.onclick = () => { shopView.try = { set: b.dataset.shopTryset }; R.sound('tick'); rerender(true); });
    $app.querySelectorAll('[data-shop-claim]').forEach((b) => b.onclick = () => { const set = M.SETS.find((x) => x.id === b.dataset.shopClaim); if (R.claimSet(set.id)) { R.wearSet(set.id); R.confetti(90); R.toast(TM.coin(), `Ensemble <strong>${set.name}</strong> complet · +${set.bonus} ${TM.coin('xs')}`); } rerender(true); });
    $app.querySelectorAll('[data-shop-wear]').forEach((b) => b.onclick = () => { R.wearSet(b.dataset.shopWear); R.sound('tick'); shopView.try = null; rerender(true); });
    $app.querySelectorAll('[data-tab-go]').forEach((b) => b.onclick = () => shopView(b.dataset.tabGo));
    const more = $app.querySelector('[data-shop-more]');
    if (more) more.onclick = () => { shopView.shown += window.matchMedia('(max-width: 760px)').matches ? 9 : 12; R.sound('tick'); rerender(); };
    const earn = $app.querySelector('[data-shop-earn]');
    if (earn) earn.onclick = () => { const d = $app.querySelector('details.earn'); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    // Onglet actif toujours visible dans la barre qui défile (mobile)
    const tabsEl = document.getElementById('shoptabs'), onTab = tabsEl.querySelector('.on');
    if (onTab && tabsEl.scrollWidth > tabsEl.clientWidth) tabsEl.scrollLeft = onTab.offsetLeft - (tabsEl.clientWidth - onTab.offsetWidth) / 2;
    const untry = $app.querySelector('[data-shop-untry]');
    if (untry) untry.onclick = () => { shopView.try = null; rerender(); };
    const ed = document.getElementById('lk-editor');
    if (ed) ed.onclick = (e) => {
      const t = e.target.closest('[data-lkcat]'); if (t) { shopView.lkcat = t.dataset.lkcat; return rerender(); }
      const b = e.target.closest('[data-cat]'); if (!b) return;
      const { cat, id } = b.dataset;
      R.sound('tick');
      if (R.lookState(cat, id) === 'buy') { shopView.try = { cat, id }; return rerender(); }
      shopView.try = null; R.setLook(cat, id); rerender();
    };
  }

  // Clés propres à l'appareil et progression rangée des AUTRES comptes : jamais effacées pour un seul compte
  const DEVICE_KEYS = ['tm_accounts', 'tm_admin', 'tm_seen_version', 'tm_prem_test'];
  const progressKeys = () => { try { return Object.keys(localStorage).filter((k) => k.startsWith('tm_') && !k.startsWith('tm_acc_') && !DEVICE_KEYS.includes(k)); } catch (e) { return []; } };
  // Efface la progression du compte connecté (les autres comptes de l'appareil ne sont pas touchés)
  function clearLocalData() {
    TM.errors && TM.errors.reset();
    progressKeys().forEach((k) => { try { localStorage.removeItem(k); } catch (e) {} });
    R.reset();
    if (TM.social && TM.social.reset) TM.social.reset();
  }
  // Supprime le compte connecté (identifiants + progression), puis déconnecte. RGPD art. 17.
  function deleteMyAccount() {
    if (TM.accounts && TM.accounts.deleteCurrent) return TM.accounts.deleteCurrent();
    clearLocalData();
    try {
      const st = JSON.parse(localStorage.getItem('tm_accounts') || 'null');
      if (st && st.current) {
        st.list = (st.list || []).filter((a) => a.id !== st.current);
        localStorage.removeItem('tm_acc_' + st.current);
        st.current = null; localStorage.setItem('tm_accounts', JSON.stringify(st));
      }
    } catch (e) {}
    location.hash = ''; location.reload();
  }

  // ---------- Pages légales ----------
  function legalView() {
    $app.innerHTML = `<article class="lesson pop-in"><h1>Mentions légales</h1>
      <h2>Éditeur du site</h2>
      <p>Ce site est édité à titre non professionnel par un particulier qui, comme la loi le permet, a choisi de rester anonyme. Ses coordonnées ont été communiquées à l’hébergeur ci-dessous.</p>
      <h2>Hébergeur</h2>
      <p>GitHub, Inc. (service GitHub Pages)<br>
      88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis<br>
      Téléphone : +1 877 448 4820 · <a href="https://github.com" target="_blank" rel="noopener">github.com</a></p>
      <h2>Propriété intellectuelle</h2>
      <p>Les contenus de ce site (exercices, leçons, textes, code) sont protégés. Toute reproduction sans autorisation est interdite.
      TAGE MAGE® est une marque de la FNEGE. Ce site indépendant n’est ni affilié à la FNEGE ni approuvé par elle. Les informations officielles sur l’épreuve sont sur <a href="https://www.tagemage.fr" target="_blank" rel="noopener">tagemage.fr</a>.</p>
      <p class="muted">Articles 1-1 et 1-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.</p>
      <p><a href="#privacy">Politique de confidentialité →</a></p></article>`;
  }
  function privacyView() {
    const me = TM.accounts && TM.accounts.current ? TM.accounts.current() : null;
    $app.innerHTML = `<article class="lesson pop-in"><h1>Confidentialité</h1>
      <p><b>En bref : nous ne collectons aucune donnée personnelle.</b> Tout reste dans ton navigateur : rien n’est envoyé à un serveur. Pas de mesure d’audience, pas de publicité.</p>
      <h2>Ce qui est enregistré sur ton appareil</h2>
      <p>Pour que l’appli fonctionne, ta progression est enregistrée <b>uniquement dans ton navigateur</b> (stockage local, « localStorage »). Ces données ne nous sont jamais envoyées :</p>
      <ul>
        <li><code>tm_profile</code> : prénom ou pseudo (facultatif), apparence de l’avatar (dessin, aucune photo), date d’examen et score visé, objectif quotidien, XP, niveau, pièces virtuelles, options et accessoires obtenus en boutique, badges, série de jours, réglages (apparence, son, mode concentration), suivi des missions du jour, cases de la semaine, jours sauvés par un gel et coffres de série ouverts ;</li>
        <li><code>tm_history</code> : tes 200 dernières sessions (date, mode, score) ;</li>
        <li><code>tm_used_…</code> : les questions déjà vues, pour éviter de te les reposer ;</li>
        <li><code>tm_errors</code> : ton carnet d’erreurs (les questions ratées à revoir, la réponse que tu avais donnée, ta progression sur celles-ci et les dates où tu les as ajoutées ou maîtrisées) ;</li>
        <li><code>tm_accounts</code> : les comptes créés sur cet appareil (pseudo, empreinte salée du mot de passe — jamais le mot de passe lui-même —, dates de création et de dernière activité, compte suspendu ou non) et le compte connecté ;</li>
        <li><code>tm_acc_…</code> : la progression des comptes de cet appareil qui ne sont pas connectés, rangée en attendant leur prochaine connexion ;</li>
        <li><code>tm_social</code> : partie « amis » de ton compte (même identifiant et même pseudo), code ami, date de création, listes d’amis et de demandes (vides tant qu’il n’y a pas de serveur) ;</li>
        <li><code>tm_tour</code> : retient que tu as déjà vu la visite guidée, pour ne pas te la remontrer ;</li>
        <li><code>tm_seen_version</code> : le numéro de la dernière version dont tu as vu les « Nouveautés », pour ne pas te les remontrer ;</li>
        <li><code>tm_admin</code> (seulement pour l’équipe du site) : jeton d’accès administrateur, enregistré uniquement sur l’appareil qui a ouvert le lien d’administration.</li>
      </ul>
      <p>L’appli demande aussi à ton navigateur de conserver ces données durablement (pour qu’il ne les efface pas s’il manque de place).</p>
      <p>À chaque ouverture, l’appli lit le fichier <code>version.json</code> sur ce même site pour savoir si une nouvelle version est disponible. Cette vérification ne transmet aucune de tes données (progression, compte…) et ne fait appel à aucun autre site.</p>
      <h2>Compte et amis</h2>
      <p>Ton compte MyPrépaTM (pseudo et mot de passe) est enregistré <b>uniquement sur cet appareil</b> : il ne nous est jamais transmis et ne fonctionne pas sur un autre appareil. Ton mot de passe n’est jamais conservé, seulement une empreinte qui permet de le vérifier. <b>Faute de serveur, un mot de passe oublié ne peut pas être récupéré.</b></p>
      <p>Plusieurs personnes peuvent avoir un compte sur le même appareil ; chacune a sa propre progression. Sur un appareil où l’équipe du site a ouvert son lien d’administration, elle peut voir les comptes de cet appareil (pseudo, niveau, pièces, XP, dates), les suspendre, les supprimer ou modifier leur progression. Elle n’a jamais accès aux comptes d’un autre appareil.</p>
      <p>Les amis utilisent ce même compte : aucun autre identifiant ni aucune adresse e-mail ne te sont demandés.</p>
      <p>Pour l’instant, il n’y a <b>aucun échange entre joueurs</b> : sans serveur, tes amis, le classement et les défis restent vides, et tes données ne sont partagées avec personne. Cette page sera mise à jour avant que de vrais échanges entre joueurs soient possibles.</p>
      <p>Tu peux supprimer ton compte à tout moment avec le bouton « Supprimer mon compte et mes données » plus bas sur cette page.</p>
      <p>Ce stockage est strictement nécessaire au service demandé : il ne demande donc pas de consentement (article 82 de la loi Informatique et Libertés). Il ne sert pas à te suivre et n’est partagé avec personne.</p>
      <h2>Hébergement</h2>
      <p>Le site est hébergé par GitHub Pages (GitHub, Inc., États-Unis). Comme pour tout site web, l’hébergeur reçoit ton adresse IP pour t’afficher les pages ; GitHub l’enregistre dans ses journaux pour la sécurité de son service, que tu aies un compte GitHub ou non. Ce traitement est réalisé par GitHub sous sa propre responsabilité : voir sa <a href="https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">déclaration de confidentialité</a>. Nous n’avons pas accès à ces journaux.</p>
      <h2>Effacer tes données</h2>
      ${me ? `<p>Le bouton ci-dessous supprime ton compte <b>${esc(me.username)}</b> et toute sa progression, puis te déconnecte. Les autres comptes de cet appareil ne sont pas touchés.</p>
      <div class="row"><button class="btn danger" id="wipe">Supprimer mon compte et mes données</button></div>` : `<p>Connecte-toi pour supprimer ton compte et ta progression.</p>`}
      <p>Vider les données du site dans les réglages de ton navigateur efface tous les comptes de cet appareil.</p>
      <h2>Tes droits</h2>
      <p>Comme nous ne recevons aucune de tes données, tu exerces toi-même tes droits d’accès et d’effacement : tout est visible dans l’appli et s’efface avec le bouton ci-dessus. Tu peux aussi adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener">CNIL</a>.</p>
      <p class="muted">Dernière mise à jour : 24 novembre 2026.</p></article>`;
    const wipe = document.getElementById('wipe');
    if (wipe) wipe.onclick = () => { if (confirm(`Supprimer ton compte « ${me.username} » et toute sa progression : XP, pièces, objets, badges, série, historique ? C’est définitif.`)) deleteMyAccount(); };
  }

  // ---------- Leçons ----------
  const lessonKeys = () => ['intro', ...F.subtests.map((s) => s.id)];
  const lessonProg = (k) => (R.profile.lessons || {})[k] || {};
  function saveLessonProg(k, fields) {
    const all = { ...(R.profile.lessons || {}) };
    all[k] = { ...(all[k] || {}), ...fields };
    R.setProfile({ lessons: all });
  }
  function readMinutes(L) {
    const txt = [L.lead, ...L.memo, ...L.sections.map((s) => s.html)].join(' ').replace(/<[^>]+>/g, ' ');
    return Math.max(1, Math.round(txt.split(/\s+/).filter(Boolean).length / 180));
  }
  function mastery(k, st) {
    if (!byId(k) || !st[k].n) return null;
    return pctOf(st[k].c, st[k].n);
  }
  const masteryCls = (p) => (p >= 70 ? '' : p >= 45 ? 'mid' : 'low');
  function recommendedLesson(st) {
    if (R.profile.totalAnswered === 0 && !lessonProg('intro').quiz) return { k: 'intro', why: 'Commence par comprendre le format et le barème de l’épreuve.' };
    const w = weakest(st);
    return { k: w.id, why: w.pct === null ? 'Tu n’as pas encore travaillé ce sous-test.' : `C’est ton sous-test le plus faible : ${w.pct} % de réussite.` };
  }
  function lessonList() {
    const st = statsBySubtest();
    const rec = recommendedLesson(st);
    const R0 = TM.LESSONS[rec.k]; const rt = byId(rec.k);
    const recIco = rt ? `<span class="ico ico-${rt.id}">${rt.icon}</span>` : `<span class="ico">${TM.icon('exam')}</span>`;
    $app.innerHTML = `${pageHead('lessons', 'Leçons', 'Méthodes, règles et pièges pour chaque sous-test.', 'book')}
      <a class="lesson-rec pop-in" href="#lessons/${rec.k}">
        ${recIco}
        <span class="row-t"><span class="lesson-rec-l">Recommandée pour toi</span><b>${R0.title}</b><span>${rec.why}</span></span>
        ${TM.icon('arrow')}
      </a>
      <ol class="chapters">${lessonKeys().map((k, i) => {
        const t = byId(k); const L = TM.LESSONS[k];
        const m = mastery(k, st); const q = lessonProg(k).quiz;
        return `<li class="pop-in" style="animation-delay:${(i + 1) * 35}ms"><a href="#lessons/${k}">
          <span class="ch-n">${String(i).padStart(2, '0')}</span>
          <span class="row-t"><b>${L.title}</b>
            <span class="lesson-ch-meta"><span>${readMinutes(L)} min de lecture</span>${(TM.COURSES[k]?.chapters.length) ? `<span>· cours en ${TM.COURSES[k].chapters.length} chapitres</span>` : ''}${q !== undefined ? `<span class="lesson-ch-quiz${q === L.quiz.length ? ' full' : ''}">Quiz ${q}/${L.quiz.length}</span>` : ''}</span>
            ${t ? (m === null ? '<span class="lesson-mast"><span class="lesson-mast-l">Maîtrise : pas encore testé</span></span>'
              : `<span class="lesson-mast"><span class="lesson-mast-l">Maîtrise ${m} %</span><span class="bar"><span class="${masteryCls(m)}" style="width:${m}%"></span></span></span>`) : ''}
          </span>
          ${t ? `<span class="ico ico-${t.id}">${t.icon}</span>` : `<span class="ico">${TM.icon('exam')}</span>`}
        </a></li>`;
      }).join('')}</ol>`;
  }
  function lessonView(k) {
    const L = TM.LESSONS[k]; if (!L) return go('lessons');
    // Sous-pages : #lessons/<id>/cours[/<n>] et #lessons/<id>/fiches
    const [, , sub, subArg] = location.hash.replace('#', '').split('/');
    if (sub === 'cours') return courseView(k, subArg);
    if (sub === 'fiches') return cardsView(k);
    const t = byId(k); const st = statsBySubtest();
    const idx = lessonKeys().indexOf(k);
    const m = mastery(k, st);
    if (t) R.setProfile({ lessonDay: R.today() });
    saveLessonProg(k, { read: R.today() });
    const C = TM.COURSES[k] || { chapters: [], cards: [] };
    const doneCh = (lessonProg(k).course || []).length;
    const toc = [...L.sections.map((s, i) => [`ls-${i}`, s.t]), ['ls-quiz', 'Quiz']];
    $app.innerHTML = `<a class="back" href="#lessons">← Leçons</a>
      <header class="lesson-head pop-in">
        <span class="lesson-kicker">${t ? `<span class="ico ico-${t.id}">${t.icon}</span>` : `<span class="ico">${TM.icon('exam')}</span>`}Chapitre ${String(idx).padStart(2, '0')}</span>
        <h1>${L.title}</h1>
        <p class="lesson-lead">${L.lead}</p>
        <div class="lesson-meta"><span>${TM.icon('timer')} ${readMinutes(L)} min de lecture</span>${t ? `<span>Maîtrise : ${m === null ? 'pas encore testé' : `${m} %`}</span>` : ''}</div>
      </header>
      <aside class="lesson-memo pop-in"><h2>À retenir</h2><ul>${L.memo.map((x) => `<li>${x}</li>`).join('')}</ul></aside>
      <div class="lesson-study pop-in">
        <h2>Réviser sans exercice</h2>
        <div class="lesson-study-grid">
          ${C.chapters.length ? `<a class="lesson-study-i" href="#lessons/${k}/cours">${TM.icon('book')}<b>Cours complet</b><span>${C.chapters.length} chapitres expliqués avec des exemples${doneCh ? ` · ${doneCh}/${C.chapters.length} lus` : ''}</span></a>` : ''}
          ${C.cards.length ? `<a class="lesson-study-i" href="#lessons/${k}/fiches">${TM.icon('sprout')}<b>Fiches de révision</b><span>${C.cards.length} fiches à retourner pour mémoriser</span></a>` : ''}
        </div>
      </div>
      <nav class="lesson-toc" aria-label="Sommaire">${toc.map(([id, label]) => `<button type="button" data-to="${id}">${label}</button>`).join('')}</nav>
      ${L.sections.map((s, i) => `<section class="lesson lesson-sec" id="ls-${i}"><h2>${s.t}</h2>${s.html}</section>`).join('')}
      <section class="lesson lesson-quiz" id="ls-quiz"></section>
      <div class="row center">${t ? `<a class="btn primary big-btn" href="#train/${k}">S’entraîner en ${t.short}</a>` : `<a class="btn primary big-btn" href="#exam">Passer un examen blanc</a>`}</div>`;
    $app.querySelector('.lesson-toc').style.top = `${document.querySelector('.topbar').offsetHeight}px`;
    const tocBtns = [...$app.querySelectorAll('.lesson-toc button')];
    tocBtns.forEach((b) => (b.onclick = () => {
      const el = document.getElementById(b.dataset.to);
      const y = el.getBoundingClientRect().top + window.scrollY - (document.querySelector('.topbar').offsetHeight + $app.querySelector('.lesson-toc').offsetHeight + 12);
      window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }));
    lessonQuiz(k, L, t);
  }
  // Cours détaillé : sommaire des chapitres, puis un chapitre par page
  function courseView(k, chArg) {
    const L = TM.LESSONS[k]; const C = TM.COURSES[k];
    if (!C || !C.chapters.length) return go(`lessons/${k}`);
    const t = byId(k);
    const read = lessonProg(k).course || [];
    const mins = (html) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 180));
    const ico = t ? `<span class="ico ico-${t.id}">${t.icon}</span>` : `<span class="ico">${TM.icon('exam')}</span>`;
    if (chArg === undefined) {
      const next = C.chapters.findIndex((_, i) => !read.includes(i));
      $app.innerHTML = `<a class="back" href="#lessons/${k}">← ${L.title}</a>
        <header class="lesson-head pop-in">
          <span class="lesson-kicker">${ico}Cours complet</span>
          <h1>${L.title}</h1>
          <p class="lesson-lead">Lis les chapitres dans l’ordre : chacun explique une notion pas à pas, avec des exemples commentés. Aucun exercice, juste de quoi comprendre.</p>
          <div class="lesson-meta"><span>${read.length} / ${C.chapters.length} chapitres lus</span></div>
        </header>
        <ol class="chapters">${C.chapters.map((c, i) => `<li class="pop-in" style="animation-delay:${i * 35}ms"><a href="#lessons/${k}/cours/${i + 1}">
          <span class="ch-n">${i + 1}</span>
          <span class="row-t"><b>${c.t}</b><span>${mins(c.html)} min de lecture</span></span>
          <span class="lesson-ch-check${read.includes(i) ? ' on' : ''}" aria-label="${read.includes(i) ? 'Lu' : 'Pas encore lu'}">${read.includes(i) ? TM.icon('check') : ''}</span>
        </a></li>`).join('')}</ol>
        <div class="row center"><a class="btn primary big-btn" href="#lessons/${k}/cours/${(next < 0 ? 0 : next) + 1}">${next < 0 ? 'Relire depuis le début' : read.length ? 'Reprendre la lecture' : 'Commencer le cours'}</a></div>`;
      return;
    }
    const i = parseInt(chArg, 10) - 1;
    const c = C.chapters[i]; if (!c) return go(`lessons/${k}/cours`);
    // Premium (js/premium.js) : sans le pass 3 mois, seul le 1er chapitre (verrou actif seulement en test administrateur)
    if (i > 0 && TM.premium && !TM.premium.has(2)) { $app.innerHTML = `<a class="back" href="#lessons/${k}/cours">← Sommaire du cours</a><h1>${c.t}</h1>${TM.premium.lock('Le cours complet', 'Le 1er chapitre est ouvert à tous ; les suivants font partie de Premium.', 2)}`; return; }
    if (!read.includes(i)) saveLessonProg(k, { course: [...read, i].sort((a, b) => a - b) });
    const last = i === C.chapters.length - 1;
    $app.innerHTML = `<a class="back" href="#lessons/${k}/cours">← Sommaire du cours</a>
      <header class="lesson-head pop-in">
        <span class="lesson-kicker">${ico}${L.title} · Chapitre ${i + 1} / ${C.chapters.length}</span>
        <h1>${c.t}</h1>
        <div class="lesson-q-dots" aria-hidden="true">${C.chapters.map((_, j) => `<span class="${j < i ? 'done' : j === i ? 'cur' : ''}"></span>`).join('')}</div>
      </header>
      <article class="lesson lesson-course pop-in">${c.html}</article>
      <nav class="lesson-pager">
        ${i > 0 ? `<a class="btn" href="#lessons/${k}/cours/${i}">← ${C.chapters[i - 1].t}</a>` : `<a class="btn" href="#lessons/${k}">← La leçon</a>`}
        ${last ? (C.cards.length ? `<a class="btn primary" href="#lessons/${k}/fiches">Réviser avec les fiches →</a>` : `<a class="btn primary" href="#lessons/${k}">Retour à la leçon</a>`)
          : `<a class="btn primary" href="#lessons/${k}/cours/${i + 2}">${C.chapters[i + 1].t} →</a>`}
      </nav>`;
  }

  // Fiches de révision : recto / verso, « je savais » ou « à revoir »
  function cardsView(k) {
    const L = TM.LESSONS[k]; const C = TM.COURSES[k];
    if (!C || !C.cards.length) return go(`lessons/${k}`);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let deck; let pos; let flipped; let known; let review;
    // Premium (js/premium.js) : sans le pass 3 mois, les 5 premières fiches (verrou actif seulement en test administrateur)
    const allCards = !TM.premium || TM.premium.has(2);
    const start = (ids) => { if (!allCards) ids = ids.filter((x) => x < 5); deck = ids.slice().sort(() => Math.random() - 0.5); pos = 0; flipped = false; known = []; review = []; show(); };
    $app.innerHTML = `<a class="back" href="#lessons/${k}">← ${L.title}</a>
      <header class="lesson-head pop-in"><span class="lesson-kicker"><span class="ico">${TM.icon('sprout')}</span>Fiches de révision</span><h1>${L.title}</h1>
      <p class="lesson-lead">Lis la question, essaie de répondre de tête, puis retourne la fiche. Sois honnête : les fiches « à revoir » reviennent à la fin.</p></header>
      ${!allCards && C.cards.length > 5 ? TM.premium.lock(`${C.cards.length - 5} autres fiches`, 'Toutes les fiches de révision font partie de Premium.', 2) : ''}
      <div id="lesson-deck"></div>`;
    const box = document.getElementById('lesson-deck');
    const flip = () => {
      if (flipped) return; flipped = true;
      box.querySelector('.lesson-card').classList.add('flipped');
      box.querySelector('.lesson-card').setAttribute('aria-pressed', 'true');
      box.querySelector('.lesson-card-back').removeAttribute('aria-hidden');
      box.querySelector('.lesson-card-acts').classList.add('on');
      box.querySelector('#lc-ok').focus({ preventScroll: true });
    };
    const rate = (ok) => { if (!flipped) return; (ok ? known : review).push(deck[pos]); pos++; flipped = false; show(); };
    const show = () => {
      if (pos >= deck.length) return end();
      const c = C.cards[deck[pos]];
      box.innerHTML = `<div class="lesson-q-top"><span class="muted">Fiche ${pos + 1} / ${deck.length}</span><span class="muted">${known.length} sue${known.length > 1 ? 's' : ''} · ${review.length} à revoir</span></div>
        <div class="lesson-q-dots" aria-hidden="true">${deck.map((_, j) => `<span class="${j < pos ? 'done' : j === pos ? 'cur' : ''}"></span>`).join('')}</div>
        <button type="button" class="lesson-card${reduce ? ' still' : ''}" aria-pressed="false" aria-label="Retourner la fiche">
          <span class="lesson-card-inner">
            <span class="lesson-card-face lesson-card-front"><small>Question</small><b>${c.f}</b><em>Touche pour voir la réponse</em></span>
            <span class="lesson-card-face lesson-card-back" aria-hidden="true"><small>Réponse</small><b>${c.b}</b></span>
          </span>
        </button>
        <div class="lesson-card-acts">
          <button type="button" class="btn" id="lc-ko">À revoir</button>
          <button type="button" class="btn success" id="lc-ok">Je savais</button>
        </div>`;
      box.querySelector('.lesson-card').onclick = flip;
      box.querySelector('#lc-ko').onclick = () => rate(false);
      box.querySelector('#lc-ok').onclick = () => rate(true);
    };
    const end = () => {
      const n = known.length + review.length;
      if (!review.length) R.confetti(50);
      box.innerHTML = `<section class="lesson lesson-quiz pop-in"><h2>${known.length} / ${n} fiches sues</h2>
        <p>${review.length ? `Il te reste ${review.length} fiche${review.length > 1 ? 's' : ''} à revoir. Repasse-les maintenant tant que la réponse est fraîche.` : 'Tout est su. Reviens demain pour vérifier que ça tient sur la durée.'}</p>
        <div class="row">${review.length ? `<button class="btn primary" id="lc-review">Revoir les ${review.length} fiche${review.length > 1 ? 's' : ''}</button>` : ''}
        <button class="btn" id="lc-all">Tout recommencer</button>
        ${TM.COURSES[k].chapters.length ? `<a class="btn ghost" href="#lessons/${k}/cours">Lire le cours</a>` : ''}</div></section>`;
      const rv = review.slice();
      box.querySelector('#lc-review')?.addEventListener('click', () => start(rv));
      box.querySelector('#lc-all').onclick = () => start(C.cards.map((_, i) => i));
    };
    setKeys((e) => {
      if (!document.getElementById('lesson-deck') || pos >= deck.length) return;
      if (e.target.closest && e.target.closest('button') && (e.key === 'Enter' || e.key === ' ')) return; // le bouton focalisé gère lui-même
      if (!flipped && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp')) { e.preventDefault(); flip(); }
      else if (flipped && e.key === 'ArrowRight') rate(true);
      else if (flipped && e.key === 'ArrowLeft') rate(false);
    });
    start(C.cards.map((_, i) => i));
  }

  function lessonQuiz(k, L, t) {
    const box = document.getElementById('ls-quiz');
    let i = 0; let score = 0; let picked = null;
    const intro = () => {
      const best = lessonProg(k).quiz;
      box.innerHTML = `<h2>Vérifie tes acquis</h2>
        <p class="muted">${L.quiz.length} questions rapides pour savoir si la leçon est bien comprise.${best !== undefined ? ` Meilleur score : ${best}/${L.quiz.length}.` : ' +10 XP par bonne réponse la première fois.'}</p>
        <div class="row"><button class="btn primary" id="lq-go">${best !== undefined ? 'Refaire le quiz' : 'Commencer le quiz'}</button></div>`;
      box.querySelector('#lq-go').onclick = () => { i = 0; score = 0; ask(); };
    };
    const ask = () => {
      const qu = L.quiz[i]; picked = null;
      box.innerHTML = `<div class="lesson-q-top"><h2>Quiz</h2><span class="muted">Question ${i + 1} / ${L.quiz.length}</span></div>
        <div class="lesson-q-dots">${L.quiz.map((_, j) => `<span class="${j < i ? 'done' : j === i ? 'cur' : ''}"></span>`).join('')}</div>
        <p class="lesson-q-text">${qu.q}</p>
        <div class="choices">${qu.c.map((c, j) => `<button class="choice" data-i="${j}" style="animation-delay:${j * 30}ms"><span class="letter">${LETTERS[j]}</span><span>${c}</span></button>`).join('')}</div>
        <div class="lesson-q-fb" aria-live="polite"></div>`;
      box.querySelectorAll('.choice').forEach((b) => (b.onclick = () => choose(+b.dataset.i)));
      setKeys((e) => {
        if (!document.getElementById('ls-quiz')) return setKeys(null);
        const n = LETTERS.indexOf(e.key.toUpperCase()); const d = parseInt(e.key, 10) - 1;
        if (picked === null && (n >= 0 || (d >= 0 && d < 5))) choose(n >= 0 ? n : d);
        else if (picked !== null && e.key === 'Enter') box.querySelector('#lq-next')?.click();
      });
    };
    const choose = (j) => {
      if (picked !== null) return;
      const qu = L.quiz[i]; picked = j;
      const ok = j === qu.a; if (ok) score++;
      R.sound(ok ? 'ok' : 'ko');
      box.querySelectorAll('.choice').forEach((b, n) => {
        b.disabled = true;
        if (n === qu.a) b.classList.add('ok'); else if (n === j) b.classList.add('ko'); else b.classList.add('dim');
      });
      const last = i === L.quiz.length - 1;
      box.querySelector('.lesson-q-fb').innerHTML = `<div class="lesson-callout ${ok ? 'good' : 'bad'}"><b>${ok ? 'Bonne réponse' : `Réponse : ${LETTERS[qu.a]}`}</b>${qu.why}</div>
        <div class="row"><button class="btn primary" id="lq-next">${last ? 'Voir mon score' : 'Question suivante'}</button></div>`;
      box.querySelector('#lq-next').onclick = () => { if (last) end(); else { i++; ask(); } };
      box.querySelector('#lq-next').focus({ preventScroll: true });
    };
    const end = () => {
      setKeys(null);
      const n = L.quiz.length; const prev = lessonProg(k).quiz;
      const first = prev === undefined;
      saveLessonProg(k, { quiz: Math.max(score, prev || 0) });
      if (first && score) R.addXP(score * 10);
      if (score === n) R.confetti(60);
      const msg = score === n ? 'Parfait, la leçon est acquise !' : score >= n - 1 ? 'Presque ! Relis la correction de ton erreur.' : 'Relis l’encadré « À retenir » puis retente le quiz.';
      box.innerHTML = `<h2>Ton score : ${score} / ${n}</h2>
        <p>${msg}${first && score ? ` <strong>+${score * 10} XP</strong>` : ''}</p>
        <div class="row"><button class="btn" id="lq-again">Recommencer le quiz</button></div>`;
      box.querySelector('#lq-again').onclick = () => { i = 0; score = 0; ask(); };
    };
    intro();
  }

  // ---------- Historique ----------
  function historyView() {
    const h = history();
    const label = (e) => {
      if (e.mode === 'exam') return `Examen blanc${e.full === false ? ' (mini)' : ''}`;
      if (e.mode === 'survival') return 'Survie';
      if (e.mode === 'daily') return 'Défi du jour';
      const id = Object.keys(e.results)[0]; return id ? byId(id).short : 'Entraînement';
    };
    const val = (e) => (e.mode === 'exam' ? `${e.score} / 600` : e.mode === 'survival' ? `${e.correct} pts` : `${e.correct ?? Object.values(e.results).reduce((a, r) => a + r.correct, 0)} / ${e.total ?? Object.values(e.results).reduce((a, r) => a + r.total, 0)}`);
    $app.innerHTML = `<a class="back" href="#profile">← Profil</a>${pageHead('history', 'Historique', `${h.length} session${h.length > 1 ? 's' : ''} enregistrée${h.length > 1 ? 's' : ''} sur cet appareil.`, 'history')}${h.length ? `<div class="hist">${h.map((e) => `<div class="hrow"><span>${new Date(e.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span><span>${label(e)}</span><span class="bval">${val(e)}</span></div>`).join('')}</div>` : '<p class="muted">Aucune session pour l’instant.</p>'}`;
  }

  render();
})();
