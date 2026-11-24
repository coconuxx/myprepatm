// Générateur : Calcul
(function () {
  const { rand, pick, build, fmt, gcd } = TM.util;
  const T = 'calcul';

  const templates = [
    // Pourcentage d'évolution
    () => {
      const a = pick([40, 50, 60, 80, 120, 150, 200, 250, 400]);
      const p = pick([5, 10, 12.5, 15, 20, 25, 30, 40]);
      const b = a * (1 + p / 100);
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' %',
        prompt: `Un article passe de ${fmt(a)} € à ${fmt(b)} €. Quel est le pourcentage d'augmentation ?`,
        correct: p,
        distractors: [Math.round(((b - a) / b) * 1000) / 10, b - a, p / 2, p * 2],
        explanation: `Évolution = (${fmt(b)} − ${fmt(a)}) / ${fmt(a)} = ${fmt(b - a)} / ${fmt(a)} = ${fmt(p)} %. Piège : diviser par la valeur d'arrivée.`,
      });
    },
    // Hausses successives
    () => {
      const p1 = pick([10, 20, 25, 50]);
      const p2 = pick([10, 20, 25, 50]);
      const down = Math.random() < 0.5;
      const coef = (1 + p1 / 100) * (1 + (down ? -p2 : p2) / 100);
      const res = Math.round((coef - 1) * 1000) / 10;
      return build({
        theme: T, keepOrder: true, format: (x) => (x > 0 ? '+' : '') + fmt(x) + ' %',
        prompt: `Un prix augmente de ${p1} % puis ${down ? 'baisse' : 'augmente'} de ${p2} %. Quelle est l'évolution globale ?`,
        correct: res,
        distractors: [p1 + (down ? -p2 : p2), res + 5, res - 5, -res === res ? res + 10 : -res],
        explanation: `On multiplie les coefficients : ${fmt(1 + p1 / 100)} × ${fmt(1 + (down ? -p2 : p2) / 100)} = ${fmt(coef)}, soit ${res > 0 ? '+' : ''}${fmt(res)} %. Les pourcentages ne s'additionnent pas.`,
      });
    },
    // Vitesse moyenne aller-retour
    () => {
      const pairs = [[60, 90], [40, 60], [30, 70], [60, 120], [20, 30], [80, 120]];
      const [v1, v2] = pick(pairs);
      const vm = (2 * v1 * v2) / (v1 + v2);
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' km/h',
        prompt: `Un cycliste fait un aller à ${v1} km/h et le retour, sur le même trajet, à ${v2} km/h. Quelle est sa vitesse moyenne sur l'ensemble ?`,
        correct: vm,
        distractors: [(v1 + v2) / 2, vm - 4, vm + 3, Math.sqrt(v1 * v2)],
        explanation: `Vitesse moyenne = distance totale / temps total = 2·v₁·v₂ / (v₁ + v₂) = 2×${v1}×${v2} / ${v1 + v2} = ${fmt(vm)} km/h. Ce n'est pas la moyenne simple (${fmt((v1 + v2) / 2)}).`,
      });
    },
    // Distance / temps
    () => {
      const v = pick([45, 60, 72, 80, 90, 108, 120]);
      const min = pick([20, 30, 40, 45, 50, 75, 90]);
      const d = (v * min) / 60;
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' km',
        prompt: `Une voiture roule à ${v} km/h pendant ${min} minutes. Quelle distance parcourt-elle ?`,
        correct: d,
        distractors: [v * min / 100, d * 1.5, d - 5, (v * Math.floor(min / 60)) + (min % 60)],
        explanation: `${min} min = ${fmt(min / 60)} h. Distance = ${v} × ${fmt(min / 60)} = ${fmt(d)} km.`,
      });
    },
    // Moyenne
    () => {
      const n = pick([4, 5]);
      const m = rand(11, 15);
      const notes = Array.from({ length: n }, () => rand(8, 17));
      const sum = notes.reduce((a, b) => a + b, 0);
      const need = m * (n + 1) - sum;
      return build({
        theme: T, keepOrder: true,
        prompt: `Un élève a obtenu les notes ${notes.join(', ')}. Quelle note doit-il avoir au prochain devoir (même coefficient) pour obtenir exactement ${m} de moyenne ?`,
        correct: need,
        distractors: [need + 1, need - 1, m, need + 2],
        explanation: `Total nécessaire : ${m} × ${n + 1} = ${m * (n + 1)}. Total actuel : ${sum}. Note requise : ${m * (n + 1)} − ${sum} = ${need}.`,
      });
    },
    // Fraction d'un tout
    () => {
      const d1 = pick([3, 4, 5]); const d2 = pick([2, 3, 4]);
      const total = d1 * d2 * pick([6, 10, 12]);
      const first = total / d1;
      const second = (total - first) / d2;
      const rest = total - first - second;
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' €',
        prompt: `Paul dépense 1/${d1} de son budget de ${total} € en loyer, puis 1/${d2} du reste en nourriture. Combien lui reste-t-il ?`,
        correct: rest,
        distractors: [total - total / d1 - total / d2, first, rest + second, total / d2],
        explanation: `Loyer : ${total}/${d1} = ${fmt(first)} €. Reste : ${fmt(total - first)} €. Nourriture : ${fmt(total - first)}/${d2} = ${fmt(second)} €. Il reste ${fmt(rest)} €.`,
      });
    },
    // Travail en commun
    () => {
      const pairs = [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [6, 3]];
      const [a, b] = pick(pairs);
      const t = (a * b) / (a + b);
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' h',
        prompt: `Un robinet remplit une cuve en ${a} h, un second en ${b} h. Ensemble, en combien de temps la remplissent-ils ?`,
        correct: t,
        distractors: [(a + b) / 2, a + b, Math.abs(a - b) || 1, t + 1],
        explanation: `Débits : 1/${a} + 1/${b} = ${a + b}/${a * b} de cuve par heure. Temps = ${a * b}/${a + b} = ${fmt(t)} h.`,
      });
    },
    // Calcul mental : produit
    () => {
      const a = pick([25, 125, 15, 99, 101, 48, 52, 11]);
      const b = rand(12, 48);
      const res = a * b;
      return build({
        theme: T, keepOrder: true,
        prompt: `Calculez ${a} × ${b}.`,
        correct: res,
        distractors: [res + 10, res - 10, res + a, res - b],
        explanation: a === 25 ? `25 × ${b} = 100 × ${b} / 4 = ${res}.` : a === 125 ? `125 × ${b} = 1000 × ${b} / 8 = ${res}.` : a === 99 ? `99 × ${b} = 100 × ${b} − ${b} = ${res}.` : a === 101 ? `101 × ${b} = 100 × ${b} + ${b} = ${res}.` : a === 11 ? `11 × ${b} = 10 × ${b} + ${b} = ${res}.` : a === 15 ? `15 × ${b} = 10 × ${b} + 5 × ${b} = ${10 * b} + ${5 * b} = ${res}.` : `${a} × ${b} = (50 ${a < 50 ? '−' : '+'} ${Math.abs(50 - a)}) × ${b} = ${50 * b} ${a < 50 ? '−' : '+'} ${Math.abs(50 - a) * b} = ${res}.`,
      });
    },
    // Équation du 1er degré
    () => {
      const x = rand(2, 15); const a = rand(2, 9); const b = rand(1, 30); const c = rand(1, Math.max(1, a - 1));
      const rhs = a * x + b - c * x;
      return build({
        theme: T, keepOrder: true,
        prompt: `Résolvez : ${a}x + ${b} = ${c === 1 ? '' : c}x + ${rhs}`,
        correct: x,
        distractors: [x + 1, x - 1, -x, (rhs + b) / (a - c)],
        explanation: `${a}x − ${c}x = ${rhs} − ${b} ⇒ ${a - c}x = ${rhs - b} ⇒ x = ${x}.`,
      });
    },
    // Ratio / partage
    () => {
      const r1 = rand(1, 4), r2 = rand(2, 5), r3 = rand(1, 3);
      const k = pick([10, 20, 25, 50, 100]);
      const total = (r1 + r2 + r3) * k;
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' €',
        prompt: `Trois associés se partagent ${total} € proportionnellement à ${r1}, ${r2} et ${r3}. Combien reçoit le deuxième ?`,
        correct: r2 * k,
        distractors: [total / 3, r1 * k, r3 * k + k, (r2 * k) + k],
        explanation: `${r1} + ${r2} + ${r3} = ${r1 + r2 + r3} parts, soit ${k} € la part. Le deuxième reçoit ${r2} × ${k} = ${r2 * k} €.`,
      });
    },
    // Probabilités
    () => {
      const r = rand(2, 6), b = rand(2, 6);
      const n = r + b;
      const num = r * (r - 1), den = n * (n - 1);
      const g = gcd(num, den);
      const frac = `${num / g}/${den / g}`;
      const wrong1 = (() => { const g2 = gcd(r * r, n * n); return `${(r * r) / g2}/${(n * n) / g2}`; })();
      const wrong2 = (() => { const g2 = gcd(r, n); return `${r / g2}/${n / g2}`; })();
      const wrong3 = (() => { const nn = r * b * 2, g2 = gcd(nn, den); return `${nn / g2}/${den / g2}`; })();
      const wrong4 = (() => { const nn = b * (b - 1), g2 = gcd(nn, den) || 1; return nn === 0 ? '0' : `${nn / g2}/${den / g2}`; })();
      return build({
        theme: T, format: (x) => x,
        prompt: `Une urne contient ${r} boules rouges et ${b} boules bleues. On tire successivement 2 boules sans remise. Quelle est la probabilité d'obtenir 2 rouges ?`,
        correct: frac,
        distractors: [wrong1, wrong2, wrong3, wrong4, '1/2', '1/3', '1/4', '2/3', '1/5'],
        explanation: `P = (${r}/${n}) × (${r - 1}/${n - 1}) = ${num}/${den} = ${frac}. Sans remise, l'urne perd une boule au second tirage.`,
      });
    },
    // Aire / géométrie
    () => {
      const kind = pick(['rect', 'tri', 'cercle']);
      if (kind === 'rect') {
        const L = rand(4, 15), l = rand(2, L - 1);
        const P = 2 * (L + l);
        return build({
          theme: T, keepOrder: true, format: (x) => fmt(x) + ' m²',
          prompt: `Un rectangle a un périmètre de ${P} m et une longueur de ${L} m. Quelle est son aire ?`,
          correct: L * l,
          distractors: [L * (P / 2), L * (P - 2 * L), (L * l) + L, L * L],
          explanation: `Largeur = ${P}/2 − ${L} = ${l} m. Aire = ${L} × ${l} = ${L * l} m².`,
        });
      }
      if (kind === 'tri') {
        const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];
        const [a, b, c] = pick(triples);
        return build({
          theme: T, keepOrder: true,
          prompt: `Un triangle rectangle a des côtés de l'angle droit mesurant ${a} et ${b}. Combien mesure l'hypoténuse ?`,
          correct: c,
          distractors: [a + b, c + 1, c - 1, (a * b) / 2],
          explanation: `Pythagore : √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.`,
        });
      }
      const r = rand(2, 10);
      return build({
        theme: T, format: (x) => x,
        prompt: `Quelle est l'aire d'un disque de diamètre ${2 * r} cm ?`,
        correct: `${r * r}π cm²`,
        distractors: [`${4 * r * r}π cm²`, `${2 * r}π cm²`, `${4 * r}π cm²`, `${r}π cm²`, `${2 * r * r}π cm²`, `${r * r + 1}π cm²`, `${r * r * 3}π cm²`],
        explanation: `Rayon = ${r} cm. Aire = π × ${r}² = ${r * r}π cm². Piège : utiliser le diamètre au lieu du rayon.`,
      });
    },
    // Puissances
    () => {
      const base = pick([2, 3, 5, 10]);
      const a = rand(2, 6), b = rand(2, 5), c = rand(1, 4);
      const e = a + b - c;
      return build({
        theme: T, format: (x) => x.replace(/\^(-?\d+)/, '<sup>$1</sup>'),
        prompt: `Simplifiez : ${base}<sup>${a}</sup> × ${base}<sup>${b}</sup> ÷ ${base}<sup>${c}</sup>`,
        correct: `${base}^${e}`,
        distractors: [`${base}^${a * b - c}`, `${base}^${a + b + c}`, `${base}^${(a * b) / c}`.replace(/\.\d+/, ''), `${base * base}^${e}`, `${base}^${e + 1}`, `${base}^${e - 1}`, `${base}^${a * b}`, `${base}^${e + 2}`],
        explanation: `aᵐ × aⁿ = aᵐ⁺ⁿ et aᵐ ÷ aⁿ = aᵐ⁻ⁿ : ${a} + ${b} − ${c} = ${e}.`,
      });
    },
    // Âges
    () => {
      const child = rand(4, 12); const k = pick([3, 4, 5]); const parent = child * k;
      const years = (() => { // dans combien d'années parent = 2 × enfant ?
        return parent - 2 * child;
      })();
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' ans',
        prompt: `Une mère a ${parent} ans et son fils ${child} ans. Dans combien d'années la mère aura-t-elle exactement le double de l'âge de son fils ?`,
        correct: years,
        distractors: [years + 2, years - 2 > 0 ? years - 2 : years + 4, parent - child, child],
        explanation: `${parent} + n = 2(${child} + n) ⇒ n = ${parent} − ${2 * child} = ${years}.`,
      });
    },
    // Intérêts / remise
    () => {
      const price = pick([80, 120, 150, 200, 240, 360]);
      const tva = 20;
      const ht = price / 1.2;
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' €',
        prompt: `Un produit coûte ${price} € TTC (TVA à ${tva} %). Quel est son prix hors taxes ?`,
        correct: ht,
        distractors: [price * 0.8, price - 20, price / 1.02, price * 1.2],
        explanation: `TTC = HT × 1,2 ⇒ HT = ${price} / 1,2 = ${fmt(ht)} €. Piège : retirer 20 % du TTC (${fmt(price * 0.8)} €).`,
      });
    },
    // --- Ajouts ---
    // Intérêts composés sur 2 ans
    () => {
      const c = pick([1000, 2000, 5000, 10000]); const t = pick([2, 5, 10]);
      const res = c * (1 + t / 100) ** 2;
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' €',
        prompt: `On place ${fmt(c)} € à ${t} % par an, intérêts composés. Quelle somme obtient-on au bout de 2 ans ?`,
        correct: res,
        distractors: [c * (1 + (2 * t) / 100), c * (1 + t / 100), res + c * 0.01, c * (1 + (t * t) / 100)],
        explanation: `Chaque année, on multiplie par ${fmt(1 + t / 100)} : ${fmt(c)} × ${fmt(1 + t / 100)}² = ${fmt(res)} €. Piège : les intérêts simples (${fmt(c * (1 + (2 * t) / 100))} €).`,
      });
    },
    // Mélange / concentration
    () => {
      const v1 = pick([200, 300, 400, 500]); const p1 = pick([10, 20, 30, 40]);
      const v2 = pick([100, 200, 300]); const p2 = pick([0, 50, 60]);
      const res = Math.round(((v1 * p1 + v2 * p2) / (v1 + v2)) * 10) / 10;
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' %',
        prompt: `On mélange ${v1} mL d’une solution à ${p1} % de sucre avec ${v2} mL d’une solution à ${p2} %. Quelle est la concentration du mélange ?`,
        correct: res,
        distractors: [(p1 + p2) / 2, res + 5, res - 5 > 0 ? res - 5 : res + 8, Math.round(((v1 * p2 + v2 * p1) / (v1 + v2)) * 10) / 10],
        explanation: `Sucre total : ${v1} × ${p1} % + ${v2} × ${p2} % = ${fmt((v1 * p1 + v2 * p2) / 100)} mL, pour ${v1 + v2} mL : ${fmt(res)} %. Piège : la moyenne simple des pourcentages.`,
      });
    },
    // Conversion de vitesse
    () => {
      const ms = pick([5, 10, 15, 20, 25, 30]);
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' km/h',
        prompt: `Un objet se déplace à ${ms} m/s. Quelle est sa vitesse en km/h ?`,
        correct: ms * 3.6,
        distractors: [ms * 3.6 / 10, ms * 60, ms / 3.6, ms * 36],
        explanation: `1 m/s = 3 600 m/h = 3,6 km/h. Donc ${ms} × 3,6 = ${fmt(ms * 3.6)} km/h.`,
      });
    },
    // Part d’une part
    () => {
      const total = pick([200, 400, 500, 800, 1000]); const a = pick([40, 60, 75]); const b = pick([20, 25, 30, 50]);
      const res = (total * a * b) / 10000;
      return build({
        theme: T, keepOrder: true,
        prompt: `Une école compte ${total} élèves. ${a} % sont en filière commerce, et ${b} % de ceux-ci font un échange à l’étranger. Combien d’élèves de commerce partent à l’étranger ?`,
        correct: res,
        distractors: [(total * (a + b)) / 100, (total * b) / 100, (total * a) / 100 - res, res * 2],
        explanation: `${a} % de ${total} = ${(total * a) / 100} élèves ; ${b} % de ${(total * a) / 100} = ${fmt(res)}.`,
      });
    },
    // Moyenne pondérée
    () => {
      const n1 = rand(8, 16), n2 = rand(8, 16), n3 = rand(8, 16); const c1 = pick([1, 2]), c2 = pick([2, 3]), c3 = pick([3, 4, 5]);
      const res = Math.round(((n1 * c1 + n2 * c2 + n3 * c3) / (c1 + c2 + c3)) * 100) / 100;
      return build({
        theme: T, keepOrder: true,
        prompt: `Un étudiant obtient ${n1} (coefficient ${c1}), ${n2} (coefficient ${c2}) et ${n3} (coefficient ${c3}). Quelle est sa moyenne ?`,
        correct: res,
        distractors: [Math.round(((n1 + n2 + n3) / 3) * 100) / 100, res + 1, res - 1, Math.round(((n1 * c3 + n2 * c2 + n3 * c1) / (c1 + c2 + c3)) * 100) / 100],
        explanation: `(${n1}×${c1} + ${n2}×${c2} + ${n3}×${c3}) / ${c1 + c2 + c3} = ${n1 * c1 + n2 * c2 + n3 * c3} / ${c1 + c2 + c3} ≈ ${fmt(res)}.`,
      });
    },
    // Proportionnalité inverse (ouvriers)
    () => {
      const w1 = pick([3, 4, 5, 6]); const d1 = pick([10, 12, 15, 20]);
      const w2 = pick([2, 3, 4, 5, 6, 10].filter((x) => x !== w1 && (w1 * d1) % x === 0));
      const res = (w1 * d1) / w2;
      return build({
        theme: T, keepOrder: true, format: (x) => fmt(x) + ' jours',
        prompt: `${w1} ouvriers construisent un mur en ${d1} jours. En combien de jours ${w2} ouvriers, travaillant au même rythme, le construiraient-ils ?`,
        correct: res,
        distractors: [(d1 * w2) / w1, d1 + w1 - w2, res + 2, res - 2 > 0 ? res - 2 : res + 4],
        explanation: `Le travail total vaut ${w1} × ${d1} = ${w1 * d1} jours-ouvrier. Avec ${w2} ouvriers : ${w1 * d1} / ${w2} = ${fmt(res)} jours. C’est une proportionnalité inverse.`,
      });
    },
    // Dénombrement : poignées de main
    () => {
      const n = rand(5, 14);
      const res = (n * (n - 1)) / 2;
      return build({
        theme: T, keepOrder: true,
        prompt: `${n} personnes se serrent toutes la main une fois. Combien de poignées de main sont échangées ?`,
        correct: res,
        distractors: [n * (n - 1), n * n, res + n, n * 2],
        explanation: `Chacun serre ${n - 1} mains, mais chaque poignée est comptée deux fois : ${n} × ${n - 1} / 2 = ${res}.`,
      });
    },
    // Fractions
    () => {
      const pairs = [[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [5, 6], [3, 8]];
      const [a, b] = pick(pairs); const [c, d] = pick(pairs.filter(([x, y]) => y !== b));
      const num = a * d + c * b, den = b * d, g = gcd(num, den);
      const show = (n, m) => `${n}/${m}`;
      return build({
        theme: T, format: (x) => x,
        prompt: `Calculez ${a}/${b} + ${c}/${d}.`,
        correct: show(num / g, den / g),
        distractors: [show(a + c, b + d), show(a * c, b * d), show(num / g + 1, den / g), show(a + c, b * d), show(num / g, den / g + 1)],
        explanation: `Dénominateur commun ${den} : ${a * d}/${den} + ${c * b}/${den} = ${num}/${den}${g > 1 ? ` = ${num / g}/${den / g}` : ''}. On n’additionne jamais les dénominateurs.`,
      });
    },
  ];

  TM.gen.calcul = function (n) {
    const out = [];
    let pool = TM.util.shuffle(templates.map((_, i) => i));
    for (let i = 0; i < n; i++) {
      if (!pool.length) pool = TM.util.shuffle(templates.map((_, i) => i));
      out.push(templates[pool.pop()]());
    }
    return out;
  };
})();
