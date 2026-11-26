// Corrections courtes et visuelles (validées sur maquette le 26/11/2026).
// Une correction = une phrase pour comprendre + un petit schéma si utile + la méthode, repliée.
// Les générateurs peuvent fournir : tip (la phrase), steps (étapes de la méthode), fig (schéma : { type, … }).
// Sinon, on se débrouille avec « explanation » : 1re phrase = la phrase, la suite = la méthode.
(function () {
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  const fmt = (x) => (TM.util && TM.util.fmt ? TM.util.fmt(x) : String(x));
  const strip = (h) => String(h || '').replace(/<[^>]+>/g, '');

  // Découpe une explication en phrases, sans couper les nombres décimaux (« 1,2 ») ni « etc. »
  function sentences(text) {
    const t = String(text || '').trim();
    if (!t) return [];
    return t.split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ(«])/).map((s) => s.trim()).filter(Boolean);
  }

  // ---------- Schémas ----------
  const bar = (cls, w, label) => `<span class="cf-bar ${cls}" style="--w:${Math.max(6, Math.min(100, w))}%">${label}</span>`;
  const FIGS = {
    // Âges : aujourd'hui / plus tard, l'écart reste le même
    ages({ parent, child, years }) {
      const max = parent + years;
      return `<div class="cf-ages">
        <div class="cf-row"><span class="cf-k">Aujourd’hui</span><span class="cf-bars">${bar('cf-a', (parent / max) * 100, `Mère ${parent}`)}${bar('cf-b', (child / max) * 100, `${child}`)}</span></div>
        <div class="cf-row"><span class="cf-k">Dans ${years} ans</span><span class="cf-bars">${bar('cf-a', 100, `Mère ${parent + years} = 2 × ${child + years}`)}${bar('cf-b', ((child + years) / max) * 100, `Fils ${child + years}`)}</span></div>
        <p class="cf-cap">écart constant : ${parent - child} ans</p></div>`;
    },
    // Suite de nombres : on montre l'écart entre chaque terme
    seq({ terms, next }) {
      const all = terms.concat([next]);
      const diffs = all.slice(1).map((v, i) => v - all[i]);
      const sign = (d) => (d >= 0 ? '+' + fmt(d) : '−' + fmt(-d));
      return `<div class="cf-seq">${all.map((v, i) => `${i ? `<span class="cf-d">${sign(diffs[i - 1])}</span>` : ''}<span class="cf-n ${i === all.length - 1 ? 'cf-ans' : ''}">${fmt(v)}</span>`).join('')}</div>`;
    },
    // Deux trains qui se rapprochent
    trains({ d, v1, v2, t }) {
      const p = (v1 / (v1 + v2)) * 100;
      return `<div class="cf-line"><span class="cf-end">A</span><span class="cf-track"><span class="cf-seg cf-a" style="--w:${p}%">${fmt(v1 * t)} km</span><span class="cf-seg cf-b" style="--w:${100 - p}%">${fmt(v2 * t)} km</span></span><span class="cf-end">B</span></div>
        <p class="cf-cap">${fmt(d)} km parcourus ensemble à ${v1 + v2} km/h</p>`;
    },
    // Arbres le long d'une allée : un de plus que d'intervalles
    posts({ n, k }) {
      const show = Math.min(n, 6);
      const dots = Array.from({ length: show + 1 }, (_, i) => `<span class="cf-post">${i === show && n > show ? '…' : ''}</span>`).join('<span class="cf-gap"></span>');
      return `<div class="cf-posts">${dots}</div><p class="cf-cap">${n} intervalles de ${k} m → ${n + 1} arbres</p>`;
    },
    // Conditions minimales : tableau (1) seule / (2) seule / ensemble
    cm({ answer }) {
      const tbl = [[1, 0, 1], [0, 1, 1], [0, 0, 1], [1, 1, 1], [0, 0, 0]][answer];
      const cell = (ok) => `<span class="cf-cell ${ok ? 'ok' : 'ko'}">${ok ? '✓' : '✗'}</span>`;
      return `<div class="cf-cm"><span>(1) seule</span>${cell(tbl[0])}<span>(2) seule</span>${cell(tbl[1])}<span>Les deux ensemble</span>${cell(tbl[2])}</div>`;
    },
  };

  // ---------- Contenu d'une correction ----------
  function content(qu) {
    const parts = sentences(strip(qu.explanation));
    let tip = qu.tip || parts[0] || '';
    let steps = qu.steps || parts.slice(1);
    let fig = qu.fig && FIGS[qu.fig.type] ? FIGS[qu.fig.type](qu.fig) : '';
    if (qu.theme === 'cm') {
      // La phrase = la bonne réponse en clair ; la méthode = le raisonnement complet
      tip = String(qu.choices[qu.answer] || '').replace(/^[A-E] — /, '') + '.';
      steps = qu.steps || parts;
      fig = FIGS.cm({ answer: qu.answer });
    }
    return { tip, steps, fig };
  }

  // Carte de correction affichée sous les réponses (entraînement, défi) ou dans la correction d'examen
  function card(qu, sel, opts = {}) {
    const ok = sel === qu.answer;
    const { tip, steps, fig } = content(qu);
    const ansLabel = qu.theme === 'cm' ? LETTERS[qu.answer] : `${LETTERS[qu.answer]} · ${strip(qu.choices[qu.answer])}`;
    const head = ok ? 'Bien joué' : sel === null || sel === undefined ? (opts.review ? 'Sans réponse' : 'Temps écoulé') : 'Raté';
    return `<section class="cor ${ok ? 'good' : 'bad'}" id="${opts.id || 'cor'}" aria-live="polite">
      <h3 class="cor-h">${head} <small>· réponse : ${ansLabel}</small></h3>
      ${tip ? `<p class="cor-one">${tip}</p>` : ''}
      ${fig ? `<div class="cor-fig">${fig}</div>` : ''}
      ${steps.length ? `<details class="cor-more"><summary>Voir la méthode</summary><ol class="cor-steps">${steps.map((s) => `<li>${s}</li>`).join('')}</ol></details>` : ''}
    </section>`;
  }

  window.TM = window.TM || {};
  TM.correction = { card, content };
})();
