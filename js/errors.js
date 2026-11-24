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
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} }
  load();

  const keyOf = (q) => `${q.theme}|${strip(q.prompt)}|${q.choices.slice().sort().join('¦')}`;

  // Ajoute (ou remet à zéro) une question ratée
  function add(q) {
    if (!q || !q.choices) return;
    const k = keyOf(q);
    const ex = D.items.find((x) => x.key === k);
    if (ex) { ex.streak = 0; ex.misses++; ex.last = Date.now(); }
    else {
      D.items.unshift({
        key: k, added: Date.now(), last: Date.now(), streak: 0, misses: 1,
        q: { theme: q.theme, prompt: q.prompt, choices: q.choices, answer: q.answer, explanation: q.explanation, passage: q.passage || null },
      });
      if (D.items.length > MAX) D.items.length = MAX;
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
      if (good) { it.streak++; if (it.streak >= MASTER) { D.items = D.items.filter((x) => x !== it); D.mastered++; mastered = true; } }
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

  TM.errors = {
    add, reviewed, pick, remove, count, byTheme, reviewedToday, MASTER,
    get items() { return D.items; }, get mastered() { return D.mastered; },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} load(); },
  };
})();
