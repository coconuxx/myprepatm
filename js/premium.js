// Premium : niveaux d'accès (gratuit, pass Sprint 1 mois, Prépa 3 mois, Intégral 1 an) et page de présentation.
// Décisions de l'utilisateur (27/11/2026) : pass payés une fois, sans renouvellement automatique ;
// chaque pass ajoute des fonctions à celles du pass d'en dessous.
//
// BÊTA : il n'y a pas encore de paiement. Tout le monde garde donc l'accès complet (niveau « testeur »).
// Seul l'administrateur peut se mettre en Gratuit / Sprint / Prépa / Intégral pour essayer les verrous
// (Réglages › Administration). Ce choix reste sur son appareil et disparaît s'il quitte le mode administrateur.
(function () {
  window.TM = window.TM || {};
  const TEST_KEY = 'tm_prem_test';   // niveau de test choisi par l'administrateur (appareil seulement)
  const USE_KEY = 'tm_prem_use';     // compteurs du jour et du mois (séries, examens blancs complets)
  const SERIES_FREE = 2;             // séries d'entraînement par jour sans pass
  const EXAMS_PER_MONTH = [1, 2];    // examens blancs complets par mois : gratuit, pass Sprint ; illimités ensuite

  const TIERS = [
    { id: 0, name: 'Gratuit' },
    { id: 1, name: 'Pass Sprint', short: 'Sprint', length: '1 mois', price: '9,99 €', sum: 'Tout réviser sans limite, avec 2 examens blancs par mois.' },
    { id: 2, name: 'Pass Prépa', short: 'Prépa', length: '3 mois', price: '19,99 €', perMonth: '6,66 €/mois', sum: 'Une préparation entière : examens blancs illimités et carnet d’erreurs.', tag: 'Conseillé' },
    { id: 3, name: 'Pass Intégral', short: 'Intégral', length: '1 an', price: '54,99 €', perMonth: '4,58 €/mois', sum: 'Toute l’année, l’esprit tranquille : tout est inclus, avec ton plan jusqu’au jour J.' },
  ];
  // tier = pass minimum ; soon = fonction pas encore construite dans l'appli
  const FEATURES = [
    { tier: 1, icon: 'zap', color: 'var(--c-comprehension)', t: 'Séries illimitées', d: 'Plus de limite de 2 séries par jour' },
    { tier: 1, icon: 'eye', color: 'var(--c-calcul)', t: 'Corrections complètes', d: 'La méthode pas à pas sous chaque réponse' },
    { tier: 1, icon: 'exam', color: 'var(--c-cm)', t: '2 examens blancs par mois', d: '2 h, 90 questions, score sur 600' },
    { tier: 2, icon: 'exam', color: 'var(--c-cm)', t: 'Examens blancs illimités', d: 'Autant d’examens complets que tu veux' },
    { tier: 2, icon: 'history', color: 'var(--c-expression)', t: 'Carnet d’erreurs complet', d: 'Tes erreurs par sous-test et des séries pour les revoir' },
    { tier: 2, icon: 'chart', color: 'var(--c-argumentation)', t: 'Bilan détaillé des examens', d: 'Temps par question, points forts et faibles', soon: true },
    { tier: 2, icon: 'book', color: 'var(--accent)', t: 'Toutes les leçons et fiches', d: 'Les cours complets et toutes les fiches de révision' },
    { tier: 3, icon: 'calendar', color: 'var(--c-logique)', t: 'Ton plan jusqu’au jour J', d: 'Quoi réviser chaque jour jusqu’à ton examen', soon: true },
    { tier: 3, icon: 'target', color: 'var(--coral)', t: 'Mode expert', d: 'Des séries de questions difficiles pour viser 450+', soon: true },
    { tier: 3, icon: 'compass', color: 'var(--c-cm)', t: 'Suivi vers ton objectif', d: 'Ta courbe de score et le chemin vers ton score visé', soon: true },
    { tier: 3, icon: 'sprout', color: 'var(--c-calcul)', t: 'Fiches à imprimer', d: 'Toutes les fiches de révision en PDF', soon: true },
    { tier: 3, icon: 'sparkle', color: 'var(--gold-dark)', t: 'Couronne et aura dorées', d: 'Objet d’avatar introuvable en boutique', soon: true, exclusive: true },
  ];
  const GROUPS = [[1, 'Dans tous les pass'], [2, 'À partir du pass Prépa'], [3, 'Pass Intégral seulement']];

  const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const today = () => new Date().toLocaleDateString('fr-CA');
  const isAdmin = () => !!(TM.admin && TM.admin.isAdmin());
  const ic = (n) => (TM.icon ? TM.icon(n) : '');

  // Niveau de test de l'administrateur (null = pas de test : accès testeur complet)
  function testTier() {
    if (!isAdmin()) return null;
    const v = get(TEST_KEY, null);
    return v === null || v === undefined ? null : Math.max(0, Math.min(3, +v));
  }
  const isTest = () => testTier() !== null;
  const tier = () => { const t = testTier(); return t === null ? 3 : t; }; // bêta : tout ouvert
  const has = (min) => tier() >= min;
  const tierName = () => (isTest() ? TIERS[tier()].name : 'Testeur bêta');

  // ---------- Compteurs ----------
  function usage() {
    const u = get(USE_KEY, {}); const d = today(); const m = d.slice(0, 7);
    if (u.day !== d) { u.day = d; u.series = 0; }
    if (u.month !== m) { u.month = m; u.exams = 0; }
    return u;
  }
  const seriesLeft = () => (has(1) ? Infinity : Math.max(0, SERIES_FREE - usage().series));
  const useSeries = () => { const u = usage(); u.series++; set(USE_KEY, u); };
  const examsMax = () => (has(2) ? Infinity : EXAMS_PER_MONTH[tier()]);
  const examsLeft = () => Math.max(0, examsMax() - usage().exams);
  const useExam = () => { const u = usage(); u.exams++; set(USE_KEY, u); };
  const resetUsage = () => { try { localStorage.removeItem(USE_KEY); } catch (e) {} };

  // ---------- Morceaux d'interface ----------
  // Cadenas doux : un bloc qui explique ce qui manque et renvoie vers la page Premium
  function lock(title, text, minTier) {
    const need = minTier ? ` <small>· ${TIERS[minTier].name.replace('Pass ', 'pass ')}</small>` : '';
    return `<div class="prem-lock"><span class="prem-lock-i">${ic('lock')}</span><span class="prem-lock-t"><b>${title}${need}</b><span>${text}</span></span><a class="prem-lock-b" href="#premium">✦ Voir Premium</a></div>`;
  }
  // Écran « séries du jour faites »
  function seriesDoneHTML(back) {
    return `<div class="setup pop-in prem-done">
      <div class="setup-ico">${ic('check')}</div>
      <h1>Les ${SERIES_FREE} séries du jour sont faites</h1>
      <p>Belle séance ! Tu retrouves <b>${SERIES_FREE} nouvelles séries demain</b>. Le défi du jour, la survie et ton carnet d’erreurs restent ouverts.</p>
      <a class="btn primary big-btn" href="${back || '#'}">Revenir demain</a>
      <a class="btn big-btn" href="#premium">✦ Continuer avec Premium</a>
    </div>`;
  }
  function examsDoneHTML() {
    const n = EXAMS_PER_MONTH[tier()];
    return lock(n === 1 ? 'Ton examen complet du mois est fait' : `Tes ${n} examens complets du mois sont faits`, `${n === 1 ? 'Sans pass : 1 examen blanc complet par mois' : `Pass Sprint : ${n} examens blancs complets par mois`}. Illimités avec le pass Prépa. Le mini-examen reste ouvert.`, 2);
  }

  // ---------- Page Premium (#premium) ----------
  function view($app) {
    let sel = Math.max(1, isTest() ? tier() : 2);
    const row = (f) => `<div class="prem-row prem-feat" data-tier="${f.tier}"><span class="prem-ico" style="background:${f.color}">${ic(f.icon)}</span><span class="prem-row-t"><b>${f.t}${f.exclusive ? ' <i class="prem-chip">Exclusif</i>' : ''}${f.soon ? ' <i class="prem-chip soon">Bientôt</i>' : ''}</b><span>${f.d}</span></span><em class="prem-state" aria-hidden="true"></em></div>`;
    $app.innerHTML = `<div class="prem-page pop-in">
      <a class="back" href="#profile/settings">← Réglages</a>
      <header class="prem-hero">
        <img class="prem-logo" src="icons/logo.svg" alt="">
        <span class="prem-badge">✦ Premium</span>
        <h1>Vise plus haut le jour J</h1>
        <p>Comprends chaque erreur et entraîne-toi en conditions réelles.</p>
      </header>
      <p class="prem-now">Ton accès actuel : <b>${tierName()}</b>${isTest() ? '' : ' (tout est ouvert pendant la bêta)'}</p>
      <div class="prem-seg" role="radiogroup" aria-label="Choisir un pass">${TIERS.slice(1).map((t) => `<button type="button" class="prem-seg-b" role="radio" data-tier="${t.id}">${t.tag ? `<i class="prem-tag">${t.tag}</i>` : ''}<b>${t.short}</b><small>${t.length}</small><span>${t.price}</span></button>`).join('')}</div>
      <p class="prem-sum" id="prem-sum"></p>
      ${GROUPS.map(([g, label]) => `<p class="prem-grp">${label}</p><div class="prem-list">${FEATURES.filter((f) => f.tier === g).map(row).join('')}</div>`).join('')}
      <button class="btn primary big-btn prem-cta" type="button" disabled>Paiement bientôt disponible</button>
      <p class="prem-fine">Paiement unique, sans renouvellement automatique. Prix TTC.<br>Pendant la bêta, tout est gratuit : rien n’est à payer.</p>
    </div>`;
    const paint = () => {
      $app.querySelectorAll('.prem-seg-b').forEach((b) => { const on = +b.dataset.tier === sel; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      $app.querySelectorAll('.prem-feat').forEach((r) => { const ok = +r.dataset.tier <= sel; r.classList.toggle('in', ok); r.classList.toggle('out', !ok); });
      const t = TIERS[sel];
      document.getElementById('prem-sum').innerHTML = `<b>${t.name} · ${t.length} · ${t.price}</b>${t.perMonth ? ` (${t.perMonth})` : ''}<br>${t.sum}`;
    };
    $app.querySelectorAll('.prem-seg-b').forEach((b) => b.onclick = () => { sel = +b.dataset.tier; paint(); });
    paint();
  }

  // ---------- Réglages › Administration ----------
  function adminHTML() {
    const cur = testTier();
    const opts = [[null, 'Testeur (tout ouvert)'], ...TIERS.map((t) => [t.id, t.name.replace('Pass ', '')])];
    const u = usage();
    return `<div class="prem-admin">
      <span>Tester un niveau Premium</span>
      <div class="admin-tools prem-admin-seg" id="prem-test">${opts.map(([v, l]) => `<button type="button" class="btn${cur === v ? ' primary' : ''}" data-v="${v === null ? '' : v}">${l}</button>`).join('')}</div>
      <p class="muted">Sur cet appareil seulement. Les testeurs gardent tout ouvert. Compteurs : ${u.series} série${u.series > 1 ? 's' : ''} aujourd’hui, ${u.exams} examen${u.exams > 1 ? 's' : ''} complet${u.exams > 1 ? 's' : ''} ce mois-ci.</p>
      <div class="admin-tools"><button type="button" class="btn ghost" id="prem-reset">Remettre les compteurs à zéro</button><a class="btn ghost" href="#premium">Voir la page Premium</a></div>
    </div>`;
  }
  function adminBind(rerender) {
    const box = document.getElementById('prem-test');
    if (box) box.onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.v === '') { try { localStorage.removeItem(TEST_KEY); } catch (err) {} } else set(TEST_KEY, +b.dataset.v);
      if (TM.rewards) TM.rewards.toast(ic('check'), `Accès : ${tierName()}`);
      rerender();
    };
    const r = document.getElementById('prem-reset');
    if (r) r.onclick = () => { resetUsage(); if (TM.rewards) TM.rewards.toast(ic('check'), 'Compteurs remis à zéro'); rerender(); };
  }

  TM.premium = { TIERS, FEATURES, tier, has, isTest, tierName, seriesLeft, useSeries, examsLeft, useExam, lock, seriesDoneHTML, examsDoneHTML, view, adminHTML, adminBind };
})();
