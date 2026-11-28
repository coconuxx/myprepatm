// Carnet d’erreurs : chaque question ratée est mise de côté pour être revue.
// Une question réussie 2 fois de suite en révision quitte le carnet.
// Stockage local uniquement (clé tm_errors).
(function () {
  const KEY = 'tm_errors';
  const MAX = 80;            // nombre maximal d’erreurs conservées (les plus anciennes partent)
  const MASTER = 2;          // réussites d’affilée pour maîtriser une question
  const today = () => new Date().toLocaleDateString('fr-CA');
  const strip = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  let D;
  function load() {
    try { D = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { D = null; }
    if (!D || !Array.isArray(D.items)) D = { items: [], mastered: 0, review: { day: null, n: 0 } };
    if (!Array.isArray(D.masteredLog)) D.masteredLog = []; // dates des erreurs maîtrisées (bilan de la semaine)
    if (!Array.isArray(D.addedLog)) D.addedLog = [];
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} }
  load();

  const keyOf = (q) => `${q.theme}|${strip(q.prompt)}|${q.choices.slice().sort().join('¦')}`;

  // Ajoute (ou remet à zéro) une question ratée. sel = indice de la réponse donnée (facultatif)
  function add(q, sel) {
    if (!q || !q.choices) return;
    const k = keyOf(q);
    const given = sel === null || sel === undefined || !q.choices[sel] ? null : q.choices[sel];
    const ex = D.items.find((x) => x.key === k);
    if (ex) { ex.streak = 0; ex.misses++; ex.last = Date.now(); if (given) ex.given = given; }
    else {
      D.items.unshift({
        key: k, added: Date.now(), last: Date.now(), streak: 0, misses: 1, given,
        q: { theme: q.theme, prompt: q.prompt, choices: q.choices, answer: q.answer, explanation: q.explanation, passage: q.passage || null, tip: q.tip, steps: q.steps, fig: q.fig },
      });
      if (D.items.length > MAX) D.items.length = MAX;
      D.addedLog.push(today()); if (D.addedLog.length > 400) D.addedLog = D.addedLog.slice(-400);
    }
    save();
  }

  // Résultat d’une question revue
  function reviewed(errKey, good) {
    const it = D.items.find((x) => x.key === errKey);
    const d = today();
    if (D.review.day !== d) D.review = { day: d, n: 0 };
    D.review.n++;
    let mastered = false;
    if (it) {
      it.last = Date.now();
      if (good) { it.streak++; if (it.streak >= MASTER) { D.items = D.items.filter((x) => x !== it); D.mastered++; D.masteredLog.push(d); mastered = true; } }
      else { it.streak = 0; it.misses++; }
    }
    save();
    return { mastered, left: it && !mastered ? MASTER - it.streak : 0 };
  }

  // Questions à revoir : d’abord les plus ratées et les moins récemment vues.
  // Les choix sont remélangés (sauf Conditions minimales, dont l’ordre A–E est fixe).
  function pick(n, theme) {
    const pool = D.items.filter((x) => !theme || x.q.theme === theme)
      .sort((a, b) => b.misses - a.misses || a.last - b.last).slice(0, n);
    return asQuestions(pool);
  }
  // Questions prêtes à rejouer à partir d'erreurs précises (ex. celles d'un piège)
  function asQuestions(pool) {
    return pool.map((x) => {
      const q = Object.assign({}, x.q, { errKey: x.key, errStreak: x.streak });
      if (q.theme !== 'cm') {
        const idx = TM.util.shuffle(q.choices.map((_, i) => i));
        q.choices = idx.map((i) => x.q.choices[i]);
        q.answer = idx.indexOf(x.q.answer);
      }
      return q;
    });
  }

  function remove(errKey) { D.items = D.items.filter((x) => x.key !== errKey); save(); }
  const count = (theme) => D.items.filter((x) => !theme || x.q.theme === theme).length;
  function byTheme() { const o = {}; D.items.forEach((x) => { o[x.q.theme] = (o[x.q.theme] || 0) + 1; }); return o; }
  const reviewedToday = () => (D.review.day === today() ? D.review.n : 0);

  // ---------- Pièges : le *genre* d'erreur, reconnu à partir de l'énoncé ----------
  // Chaque piège : épreuve, nom, phrase « À retenir », et un test sur l'énoncé (texte brut).
  const TOPICS = [
    { id: 'pct-succ', theme: 'calcul', label: 'Pourcentages successifs', tip: 'Des pourcentages successifs ne s’additionnent pas : on multiplie les coefficients. +20 % puis −20 % donne × 0,96, soit −4 %.', re: /augmente de .* puis (baisse|augmente)/ },
    { id: 'pct-evol', theme: 'calcul', label: 'Pourcentage d’évolution', tip: 'Un pourcentage d’évolution se calcule par rapport à la valeur de départ ; une hausse de points n’est pas une hausse en pourcentage.', re: /pourcentage d.augmentation|De quel pourcentage|passe de .* à .*%/ },
    { id: 'pct-inv', theme: 'calcul', label: 'Retrouver un prix de départ', tip: 'Pour annuler une remise ou une TVA, on divise par le coefficient (0,8 ou 1,2) : rajouter le pourcentage ne suffit pas.', re: /Après une remise|hors taxes/ },
    { id: 'ages', theme: 'calcul', label: 'Problèmes d’âges', tip: 'L’écart d’âge ne change jamais : traduis « le double » en équation avec n années.', re: /Une mère a/ },
    { id: 'vitesse', theme: 'calcul', label: 'Vitesses et distances', tip: 'Vitesse moyenne = distance totale / temps totale, pas la moyenne des vitesses. Face à face, les vitesses s’additionnent.', re: /km\/h|vitesse|se croisent|m\/s/ },
    { id: 'moyenne', theme: 'calcul', label: 'Moyennes et médiane', tip: 'Raisonne sur les totaux de points ; la médiane se lit sur la série rangée dans l’ordre.', re: /moyenne|médiane|coefficient \d/ },
    { id: 'travail', theme: 'calcul', label: 'Travail en commun', tip: 'On additionne les débits (1/a + 1/b), pas les durées. Plus d’ouvriers = moins de jours.', re: /robinet|ouvriers/ },
    { id: 'denombr', theme: 'calcul', label: 'Probabilités et dénombrement', tip: 'Sans remise, l’urne perd une boule au second tirage. Pour ranger n personnes : n × (n − 1) × … × 1.', re: /probabilité|façons|poignées|boules/ },
    { id: 'fractions', theme: 'calcul', label: 'Fractions et proportions', tip: 'Dénominateur commun avant d’additionner ; « 1/3 du reste » se calcule sur ce qui reste.', re: /\d\/\d|proportionnellement|du reste|kg de pommes|élèves.*%/ },
    { id: 'geom', theme: 'calcul', label: 'Géométrie', tip: 'Aire du disque : π × rayon² (pas le diamètre). Pythagore : a² + b² = c².', re: /aire|hypoténuse|rectangle|disque|carte au/ },
    { id: 'algebre', theme: 'calcul', label: 'Calcul littéral et mental', tip: 'Puissances : on additionne les exposants en multipliant. Isole x étape par étape.', re: /Simplifiez|Résolvez|Calculez \d+ ×|film commence|arbre tous les/ },
    { id: 'cm-each', theme: 'cm', label: '« Chaque information seule suffit »', tip: 'Teste chaque information SEULE, en oubliant complètement l’autre, avant de les combiner.', ans: 3 },
    { id: 'cm-one', theme: 'cm', label: 'Une seule information suffit', tip: 'Une réponse « non » certaine suffit aussi. Ne combine pas les deux si une seule permet déjà de conclure.', ans: [0, 1] },
    { id: 'cm-both', theme: 'cm', label: 'Il faut les deux ensemble', tip: 'Avant de dire E, vérifie si les deux informations combinées donnent une réponse unique.', ans: 2 },
    { id: 'cm-none', theme: 'cm', label: 'Même ensemble, ça ne suffit pas', tip: 'Méfie-toi des informations qui disent la même chose (2x + 2y et x + y) : elles ne s’additionnent pas.', ans: 4 },
    { id: 'suites-n', theme: 'logique', label: 'Suites de nombres', tip: 'Écris les écarts entre les termes, puis les écarts des écarts ; pense aussi ×2, carrés, cubes et suites alternées.', re: /nombre complète la suite/ },
    { id: 'suites-l', theme: 'logique', label: 'Suites de lettres', tip: 'Convertis les lettres en rangs : A = 1, E = 5, J = 10, O = 15, T = 20, Y = 25.', re: /lettre complète|élément complète/ },
    { id: 'codage', theme: 'logique', label: 'Codages', tip: 'Compare lettre à lettre le mot et son code pour trouver le décalage, puis applique-le.', re: /code/ },
    { id: 'regles', theme: 'logique', label: 'Règles cachées', tip: 'Vérifie ta règle sur TOUS les exemples, pas seulement le premier.', re: /règle|trio|ligne/ },
    { id: 'temps', theme: 'logique', label: 'Heures et calendriers', tip: 'Enlève les jours (24 h) ou les semaines (7 jours) entières, puis compte le reste.', re: /heure sera|jour de la semaine/ },
    { id: 'accords', theme: 'expression', label: 'Accord du participe passé', tip: 'Avec avoir, le participe s’accorde avec le COD seulement s’il est placé AVANT le verbe.', re: /s.est|se sont|que j.a|les ai|a ___|ont été/ },
    { id: 'modes', theme: 'expression', label: 'Subjonctif et conditionnel', tip: '« Bien que », « il faut que », « pourvu que », « avant que » + subjonctif ; jamais de conditionnel après « si ».', re: /Bien qu|Il faut que|Pourvu|avant qu|Si j|Si tu|qu’il ___|que nous ___|doute/ },
    { id: 'vocab', theme: 'expression', label: 'Vocabulaire et paronymes', tip: 'Méfie-toi des mots qui se ressemblent (conjoncture / conjecture, éminent / imminent).', re: /sens de|synonyme|antonyme|mot convient|signifie|Paronyme|adjectif signifie/ },
    { id: 'fautes', theme: 'expression', label: 'Fautes courantes', tip: '« Pallier » sans « à », « se rappeler » sans « de », « censé » = supposé.', re: /contient une faute|pléonasme/ },
    { id: 'connect', theme: 'expression', label: 'Connecteurs logiques', tip: 'Repère la relation : opposition (pourtant), conséquence (donc), ajout (de plus).', re: /connecteur/ },
    { id: 'implic', theme: 'argumentation', label: 'Conditions et implications', tip: '« Si A alors B » : B ne prouve pas A. Seule la contraposée (non-B ⇒ non-A) est sûre.', re: /Si .*alors|contraposée|Seuls|ne .* que s|il faut un/ },
    { id: 'affaibl', theme: 'argumentation', label: 'Affaiblir ou renforcer', tip: 'Cherche une autre cause possible (affaiblir) ou un groupe de comparaison (renforcer).', re: /affaiblit|renforce|objection|hypothèse/ },
    { id: 'quantif', theme: 'argumentation', label: 'Tous, certains, aucun', tip: 'Nier « tous » = « au moins un ne… pas ». « Certains A sont B » ne dit rien des autres.', re: /Tous|Aucun|Certains|Quelques|négation/ },
    { id: 'sophismes', theme: 'argumentation', label: 'Sophismes', tip: 'Corrélation n’est pas causalité ; un seul cas ne fait pas une règle.', re: /./ },
    { id: 'pas-cite', theme: 'comprehension', label: 'Questions « n’est PAS »', tip: 'Lis la question deux fois : on cherche l’élément absent du texte.', re: /PAS/ },
    { id: 'these', theme: 'comprehension', label: 'Thèse et position de l’auteur', tip: 'La thèse est souvent dans le dernier paragraphe, après « donc ».', re: /thèse|position|conclusion|recommande|reproche|conseil/ },
    { id: 'details', theme: 'comprehension', label: 'Détails du texte', tip: 'Retrouve la phrase exacte dans le texte avant de choisir : méfie-toi des réponses trop générales.', re: /./ },
  ];
  const plain = (h) => strip(String(h || '').replace(/&nbsp;/g, ' '));
  function topicOf(q) {
    const txt = plain(q.prompt);
    const list = TOPICS.filter((t) => t.theme === q.theme);
    for (const t of list) {
      if (t.ans !== undefined) { if ([].concat(t.ans).includes(q.answer)) return t; continue; }
      if (t.re.test(txt)) return t;
    }
    return { id: q.theme + '-autre', theme: q.theme, label: 'Autres questions', tip: '' };
  }
  // Lien leçons ↔ exercices : pour chaque partie de leçon (par son titre), les pièges qu'elle explique
  const LESSON_TOPICS = {
    comprehension: { 'Types de questions': ['these', 'details', 'pas-cite'], 'Les pièges classiques': ['pas-cite'] },
    calcul: { 'Pourcentages': ['pct-succ', 'pct-evol', 'pct-inv'], 'Calcul mental': ['algebre'], 'Fractions et proportions': ['fractions'], 'Vitesses et débits': ['vitesse', 'travail'], 'Moyennes et équations': ['moyenne', 'ages'], 'Géométrie': ['geom'], 'Probabilités': ['denombr'] },
    argumentation: { 'Logique des propositions': ['implic'], 'Tous, certains, aucun': ['quantif'], 'Les sophismes': ['sophismes'], 'Renforcer, affaiblir': ['affaibl'] },
    cm: { 'Les 5 réponses': ['cm-each', 'cm-one', 'cm-both', 'cm-none'], 'Les pièges': ['cm-none', 'cm-each'] },
    expression: { 'Participe passé': ['accords'], 'Modes et temps': ['modes'], 'Fautes fréquentes': ['fautes'], 'Paronymes': ['vocab'], 'Connecteurs': ['connect'] },
    logique: { 'Suites de nombres': ['suites-n'], 'Suites de lettres': ['suites-l'], 'Codages': ['codage'], 'Dominos et cartes': ['regles'], 'Heures et calendriers': ['temps'] },
  };
  const sectionsOf = (theme) => (TM.LESSONS && TM.LESSONS[theme] ? TM.LESSONS[theme].sections : []);
  // Pièges expliqués par la partie idx de la leçon theme
  const idsAt = (theme, idx) => { const s = sectionsOf(theme)[idx]; return (s && (LESSON_TOPICS[theme] || {})[s.t]) || []; };
  // Partie de leçon qui explique une question (-1 si aucune)
  function sectionOf(q) {
    const t = topicOf(q);
    return sectionsOf(q.theme).findIndex((s) => ((LESSON_TOPICS[q.theme] || {})[s.t] || []).includes(t.id));
  }
  // Questions d'entraînement d'un seul type : celles que la partie idx de la leçon explique
  function drill(theme, idx, n = 5) {
    const ids = idsAt(theme, idx);
    const gen = TM.gen && TM.gen[theme];
    if (!ids.length || !gen) return [];
    const out = []; const seen = new Set();
    for (let round = 0; round < 4 && out.length < n; round++) {
      (gen(40) || []).forEach((q) => {
        if (out.length >= n || !q || !q.prompt) return;
        if (!q.theme) q.theme = theme;
        const k = plain(q.prompt);
        if (seen.has(k) || !ids.includes(topicOf(q).id)) return;
        seen.add(k); out.push(q);
      });
    }
    return out;
  }

  // Pièges les plus fréquents parmi les erreurs à revoir
  function traps(theme) {
    const m = new Map();
    D.items.filter((x) => !theme || x.q.theme === theme).forEach((x) => {
      const t = topicOf(x.q); const e = m.get(t.id) || { topic: t, n: 0, items: [] };
      e.n++; e.items.push(x); m.set(t.id, e);
    });
    return [...m.values()].sort((a, b) => b.n - a.n);
  }
  // Bilan des 7 derniers jours
  function week() {
    const since = new Date(); since.setDate(since.getDate() - 6); const s = since.toLocaleDateString('fr-CA');
    const mastered = D.masteredLog.filter((d) => d >= s).length; const added = D.addedLog.filter((d) => d >= s).length;
    return { mastered, added };
  }

  TM.errors = {
    add, reviewed, pick, asQuestions, remove, count, byTheme, reviewedToday, MASTER, topicOf, traps, week, plain, TOPICS, LESSON_TOPICS, idsAt, sectionOf, drill,
    get items() { return D.items; }, get mastered() { return D.mastered; },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} load(); },
  };
})();
