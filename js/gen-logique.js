// Générateur : Logique
(function () {
  const { rand, pick, build, shuffle } = TM.util;
  const T = 'logique';
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const L = (i) => ALPHA[((i % 26) + 26) % 26];

  function series(seq, next, rule, extra = []) {
    return build({
      theme: T, keepOrder: false,
      prompt: `Quel nombre complète la suite ?<div class="series">${seq.join('&nbsp;&nbsp;·&nbsp;&nbsp;')}&nbsp;&nbsp;·&nbsp;&nbsp;<span class="blank">?</span></div>`,
      correct: next,
      distractors: [next + 1, next - 1, next + 2, ...extra],
      explanation: rule,
    });
  }

  const templates = [
    () => { // arithmétique
      const a = rand(2, 40), r = pick([3, 4, 6, 7, 9, 11, 13, -4, -6]);
      const s = Array.from({ length: 5 }, (_, i) => a + i * r + (r < 0 ? 60 : 0));
      return series(s, s[4] + r, `Suite arithmétique : on ajoute ${r} à chaque terme.`, [s[4] + 2 * r]);
    },
    () => { // géométrique
      const a = rand(1, 5), q = pick([2, 3]);
      const s = Array.from({ length: 5 }, (_, i) => a * q ** i);
      return series(s, s[4] * q, `Suite géométrique : chaque terme est multiplié par ${q}.`, [s[4] + s[3], s[4] * q + q]);
    },
    () => { // différences croissantes
      const a = rand(1, 20), d = rand(1, 4), inc = rand(1, 3);
      const s = [a]; let diff = d;
      for (let i = 1; i < 5; i++) { s.push(s[i - 1] + diff); diff += inc; }
      return series(s, s[4] + diff, `Les écarts augmentent de ${inc} à chaque fois : ${s.slice(1).map((v, i) => v - s[i]).join(', ')}, puis ${diff}.`, [s[4] + diff - inc, s[4] + diff + inc]);
    },
    () => { // deux suites entrelacées
      const a = rand(1, 10), b = rand(20, 40), ra = rand(2, 5), rb = -rand(1, 4);
      const s = [a, b, a + ra, b + rb, a + 2 * ra, b + 2 * rb];
      return series(s, a + 3 * ra, `Deux suites alternées : rangs impairs +${ra} (${a}, ${a + ra}, ${a + 2 * ra}…), rangs pairs ${rb} (${b}, ${b + rb}, ${b + 2 * rb}…).`, [b + 3 * rb, a + 2 * ra + rb]);
    },
    () => { // carrés ± k
      const k = rand(-3, 3), st = rand(1, 5);
      const s = Array.from({ length: 5 }, (_, i) => (st + i) ** 2 + k);
      const n = (st + 5) ** 2 + k;
      return series(s, n, `Carrés successifs ${k ? (k > 0 ? '+ ' + k : '− ' + -k) : ''} : ${st}², ${st + 1}², … donc ${st + 5}² ${k ? (k > 0 ? '+ ' + k : '− ' + -k) : ''} = ${n}.`, [n + 2 * (st + 5), (st + 4) ** 2 + k + 2]);
    },
    () => { // Fibonacci
      const a = rand(1, 4), b = rand(2, 6);
      const s = [a, b]; while (s.length < 6) s.push(s[s.length - 1] + s[s.length - 2]);
      return series(s, s[4] + s[5], `Chaque terme est la somme des deux précédents : ${s[4]} + ${s[5]} = ${s[4] + s[5]}.`, [s[5] + (s[5] - s[4]), s[5] * 2]);
    },
    () => { // ×a + b
      const a = 2, b = pick([1, -1, 2, 3]), st = rand(1, 4);
      const s = [st]; while (s.length < 5) s.push(s[s.length - 1] * a + b);
      const n = s[4] * a + b;
      return series(s, n, `Règle : ×${a} puis ${b > 0 ? '+' : '−'}${Math.abs(b)}. ${s[4]} × ${a} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${n}.`, [s[4] * a, n + 2 * b]);
    },
    () => { // lettres pas constant
      const st = rand(0, 10), k = pick([2, 3, 4, 5]);
      const s = Array.from({ length: 5 }, (_, i) => L(st + i * k));
      const n = L(st + 5 * k);
      return build({
        theme: T, format: (x) => x,
        prompt: `Quelle lettre complète la suite ?<div class="series">${s.join('&nbsp;&nbsp;')}&nbsp;&nbsp;<span class="blank">?</span></div>`,
        correct: n,
        distractors: [L(st + 5 * k + 1), L(st + 5 * k - 1), L(st + 6 * k), L(st + 4 * k + 1), L(st + 5 * k + 2), L(st + 5 * k - 2)],
        explanation: `On avance de ${k} lettres à chaque fois : ${s[4]} + ${k} = ${n}. Astuce : connaître le rang des lettres (A=1, E=5, J=10, O=15, T=20, Y=25).`,
      });
    },
    () => { // lettres pas croissant
      const st = rand(0, 4);
      const pos = [st]; let d = 1;
      for (let i = 1; i < 5; i++) { pos.push(pos[i - 1] + d); d++; }
      const s = pos.map(L), n = L(pos[4] + d);
      return build({
        theme: T, format: (x) => x,
        prompt: `Quelle lettre complète la suite ?<div class="series">${s.join('&nbsp;&nbsp;')}&nbsp;&nbsp;<span class="blank">?</span></div>`,
        correct: n,
        distractors: [L(pos[4] + d - 1), L(pos[4] + d + 1), L(pos[4] + 4), L(pos[4] + 2), L(pos[4] + d + 2), L(pos[4] + 3), L(pos[4] + d - 2)],
        explanation: `Les écarts augmentent : +1, +2, +3, +4, puis +${d}. ${s[4]} + ${d} = ${n}.`,
      });
    },
    () => { // codage par décalage
      const words = ['CHAT', 'LOUP', 'VERT', 'PION', 'MARS', 'ROSE', 'BLEU', 'FOND', 'NUIT', 'GARE'];
      const [w1, w2] = shuffle(words).slice(0, 2);
      const k = pick([1, 2, 3, -1, -2]);
      const enc = (w, s) => w.split('').map((c) => L(ALPHA.indexOf(c) + s)).join('');
      return build({
        theme: T, format: (x) => x,
        prompt: `Dans un code, <strong>${w1}</strong> s’écrit <strong>${enc(w1, k)}</strong>. Comment s’écrit <strong>${w2}</strong> ?`,
        correct: enc(w2, k),
        distractors: [enc(w2, -k), enc(w2, k + 1), enc(w2, k).split('').reverse().join(''), enc(w2, k === 1 ? 2 : k - 1), enc(w2, k + 2), enc(w2, -k - 1), enc(w2, k + 3)],
        explanation: `Chaque lettre est décalée de ${k > 0 ? '+' : ''}${k} dans l’alphabet : ${w2} → ${enc(w2, k)}.`,
      });
    },
    () => { // fonction cachée
      const fs = [
        { f: (x) => x * x + 1, d: 'x² + 1' },
        { f: (x) => 2 * x + 3, d: '2x + 3' },
        { f: (x) => x * x - x, d: 'x² − x' },
        { f: (x) => 3 * x - 1, d: '3x − 1' },
        { f: (x) => x * (x + 1), d: 'x(x + 1)' },
      ];
      const { f, d } = pick(fs);
      const xs = shuffle([2, 3, 4, 5, 6, 7]).slice(0, 4);
      const [a, b, c, q] = xs;
      return build({
        theme: T,
        prompt: `Trouvez la règle : <div class="series">${a} → ${f(a)}&nbsp;&nbsp;|&nbsp;&nbsp;${b} → ${f(b)}&nbsp;&nbsp;|&nbsp;&nbsp;${c} → ${f(c)}&nbsp;&nbsp;|&nbsp;&nbsp;${q} → <span class="blank">?</span></div>`,
        correct: f(q),
        distractors: [f(q) + 1, f(q) - 1, f(q) + q, f(q - 1)],
        explanation: `La règle est ${d}. Avec ${q} : ${f(q)}. Vérifiez toujours la règle sur TOUS les exemples.`,
      });
    },
    () => { // dominos / paires de nombres liés
      const pairs = Array.from({ length: 3 }, () => { const a = rand(2, 9), b = rand(2, 9); return [a, b, a * b + a]; });
      const a = rand(2, 9), b = rand(2, 9);
      return build({
        theme: T,
        prompt: `Chaque trio obéit à la même règle. Trouvez le nombre manquant.<div class="series">${pairs.map(([x, y, z]) => `(${x}, ${y}, ${z})`).join('&nbsp;&nbsp;')}&nbsp;&nbsp;(${a}, ${b}, <span class="blank">?</span>)</div>`,
        correct: a * b + a,
        distractors: [a * b, a * b + b, a + b, a * b + a + 1],
        explanation: `Règle : troisième = premier × deuxième + premier. ${a} × ${b} + ${a} = ${a * b + a}.`,
      });
    },
    // --- Ajouts ---
    () => { // opérations alternées
      const a = rand(1, 6), p = rand(2, 5), m = 2;
      const s = [a]; for (let i = 1; i < 6; i++) s.push(i % 2 ? s[i - 1] + p : s[i - 1] * m);
      const n = s[5] * m; // rang 6 : ×2
      return series(s, n, `Opérations alternées : +${p}, ×${m}, +${p}, ×${m}… Le prochain terme est ${s[5]} × ${m} = ${n}.`, [s[5] + p, n + p]);
    },
    () => { // nombres premiers
      const P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
      const st = rand(0, 8); const s = P.slice(st, st + 5);
      const n = P[st + 5];
      return series(s, n, `Ce sont les nombres premiers successifs : après ${s[4]} vient ${n}.`, [s[4] + 2 === n ? n + 2 : s[4] + 2, n + 1, n - 1]);
    },
    () => { // nombres triangulaires
      const st = rand(1, 4); const T2 = (k) => (k * (k + 1)) / 2;
      const s = Array.from({ length: 5 }, (_, i) => T2(st + i));
      const n = T2(st + 5);
      return series(s, n, `Les écarts augmentent de 1 : +${st + 1}, +${st + 2}, +${st + 3}, +${st + 4}, puis +${st + 5}. ${s[4]} + ${st + 5} = ${n}.`, [n + 1, s[4] + st + 4]);
    },
    () => { // couples lettre-chiffre
      const st = rand(0, 6), k = pick([2, 3]);
      const item = (i) => `${L(st + i * k)}${st + i * k + 1}`;
      const s = Array.from({ length: 4 }, (_, i) => item(i));
      const n = item(4);
      return build({
        theme: T, format: (x) => x,
        prompt: `Quel élément complète la suite ?<div class="series">${s.join('&nbsp;&nbsp;')}&nbsp;&nbsp;<span class="blank">?</span></div>`,
        correct: n,
        distractors: [`${L(st + 4 * k)}${st + 4 * k}`, `${L(st + 4 * k + 1)}${st + 4 * k + 2}`, `${L(st + 5 * k)}${st + 5 * k + 1}`, `${L(st + 4 * k)}${st + 4 * k + 2}`, `${L(st + 3 * k + 1)}${st + 4 * k + 1}`],
        explanation: `Chaque lettre est suivie de son rang dans l’alphabet, et on avance de ${k} lettres : ${n}.`,
      });
    },
    () => { // grille : même règle sur chaque ligne
      const rows = Array.from({ length: 3 }, () => { const a = rand(2, 9), b = rand(2, 9); return [a, b, a + b * 2]; });
      const [a, b] = [rand(2, 9), rand(2, 9)];
      return build({
        theme: T,
        prompt: `Dans chaque ligne, le troisième nombre se déduit des deux premiers par la même règle.<div class="series">${rows.map((r) => r.join(' · ')).join('<br>')}<br>${a} · ${b} · <span class="blank">?</span></div>`,
        correct: a + 2 * b,
        distractors: [2 * a + b, a + b, a * b, a + 2 * b + 1],
        explanation: `Règle : premier + 2 × deuxième. ${a} + 2 × ${b} = ${a + 2 * b}.`,
      });
    },
  ];

  TM.gen.logique = function (n) {
    const out = [];
    let pool = shuffle(templates.map((_, i) => i));
    for (let i = 0; i < n; i++) {
      if (!pool.length) pool = shuffle(templates.map((_, i) => i));
      out.push(templates[pool.pop()]());
    }
    return out;
  };
})();
