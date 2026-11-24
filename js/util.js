// Utilitaires partagés + format officiel
window.TM = window.TM || {};

TM.FORMAT = {
  subtests: [ // icônes SVG ajoutées par icons.js
    { id: 'comprehension', name: 'Compréhension de textes', short: 'Compréhension', icon: '' },
    { id: 'calcul', name: 'Calcul', short: 'Calcul', icon: '' },
    { id: 'argumentation', name: 'Raisonnement & Argumentation', short: 'Argumentation', icon: '' },
    { id: 'cm', name: 'Conditions minimales', short: 'Cond. minimales', icon: '' },
    { id: 'expression', name: 'Expression', short: 'Expression', icon: '' },
    { id: 'logique', name: 'Logique', short: 'Logique', icon: '' },
  ],
  questionsPerSubtest: 15,
  minutesPerSubtest: 20,
  choices: 5,
  maxScore: 600,
};

TM.util = {
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  // Exécute fn avec un hasard reproductible (même graine = mêmes questions)
  withSeed(seed, fn) {
    let a = 0;
    for (const ch of String(seed)) a = (Math.imul(a ^ ch.charCodeAt(0), 2654435761) + 1) >>> 0;
    const orig = Math.random;
    Math.random = function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { return fn(); } finally { Math.random = orig; }
  },
  sample(arr, n) { return TM.util.shuffle(arr).slice(0, n); },
  gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; },
  fmt(n) {
    if (typeof n !== 'number') return String(n);
    const r = Math.round(n * 100) / 100;
    return r.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  },
  // Construit une question à 5 choix à partir d'une bonne réponse + pièges
  build({ theme, prompt, correct, distractors, explanation, format = (x) => TM.util.fmt(x), passage, keepOrder }) {
    const seen = new Set();
    const key = (v) => String(format(v));
    const opts = [];
    const push = (v) => { const k = key(v); if (!seen.has(k)) { seen.add(k); opts.push(v); } };
    push(correct);
    (distractors || []).forEach(push);
    // complète si besoin avec des valeurs proches
    let guard = 0;
    while (opts.length < 5 && guard++ < 50 && typeof correct === 'number') {
      const step = Math.max(1, Math.round(Math.abs(correct) * 0.1));
      push(correct + TM.util.pick([-3, -2, -1, 1, 2, 3]) * step);
    }
    const chosen = [opts[0], ...TM.util.shuffle(opts.slice(1)).slice(0, 4)];
    const order = keepOrder ? chosen : TM.util.shuffle(chosen);
    if (keepOrder && typeof correct === 'number') order.sort((a, b) => a - b);
    return {
      theme,
      prompt,
      passage,
      choices: order.map(key),
      answer: order.map(key).indexOf(key(correct)),
      explanation,
    };
  },
  // Question à choix fixes (banques)
  fixed({ theme, prompt, choices, answer, explanation, passage, noShuffle }) {
    if (noShuffle) return { theme, prompt, choices, answer, explanation, passage };
    const idx = TM.util.shuffle([0, 1, 2, 3, 4].slice(0, choices.length));
    return {
      theme, prompt, passage, explanation,
      choices: idx.map((i) => choices[i]),
      answer: idx.indexOf(answer),
    };
  },
  // Tirage sans répétition récente dans une banque
  drawFromBank(bankName, bank, n) {
    let used = [];
    try { used = JSON.parse(localStorage.getItem('tm_used_' + bankName) || '[]'); } catch (e) {}
    let available = bank.map((_, i) => i).filter((i) => !used.includes(i));
    if (available.length < n) { used = []; available = bank.map((_, i) => i); }
    const picked = TM.util.sample(available, Math.min(n, available.length));
    try { localStorage.setItem('tm_used_' + bankName, JSON.stringify(used.concat(picked))); } catch (e) {}
    return picked.map((i) => bank[i]);
  },
};

TM.gen = TM.gen || {};
