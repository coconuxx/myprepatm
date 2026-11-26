// Générateur : Conditions minimales
(function () {
  const { rand, pick, shuffle } = TM.util;
  const CHOICES = [
    'A — L’information (1) seule suffit, mais pas (2) seule',
    'B — L’information (2) seule suffit, mais pas (1) seule',
    'C — Les deux ensemble suffisent, mais aucune seule ne suffit',
    'D — Chaque information seule suffit',
    'E — Même ensemble, les informations ne suffisent pas',
  ];
  TM.CM_CHOICES = CHOICES;

  // Chaque modèle renvoie { q, p, r, type, why } avec type ∈ 'p' (seule p suffit) | 'both' | 'each' | 'none'
  const templates = [
    () => {
      const x = rand(2, 15), y = rand(1, 12);
      return { q: 'Quelle est la valeur de x ?', p: `x + y = ${x + y}`, r: `x − y = ${String(x - y).replace('-', '−')}`, type: 'both',
        why: `Chaque équation seule a une infinité de solutions. Ensemble : 2x = ${2 * x}, donc x = ${x}.` };
    },
    () => {
      const x = rand(3, 9), k = 3 * x - 7; // k positif
      return { q: 'Quelle est la valeur de x ?', p: `3x − 7 = ${k}`, r: `x² = ${x * x}`, type: 'p',
        why: `(1) donne x = ${x}. (2) donne x = ${x} ou x = −${x} : insuffisant seule.` };
    },
    () => {
      const m = rand(2, 7), k = rand(1, m - 1);
      return { q: 'x est-il strictement positif ?', p: `x² = ${m * m}`, r: `x > −${k}`, type: 'both',
        why: `(1) : x = ${m} ou −${m}. (2) : x pourrait être négatif (ex. −${k === 1 ? '0,5' : k - 1}). Ensemble, −${m} < −${k} est exclu, donc x = ${m} > 0.` };
    },
    () => {
      const c = pick([8, 27, 64, 125]);
      return { q: 'x est-il strictement positif ?', p: `x³ = ${c}`, r: `x² = ${Math.round(Math.cbrt(c)) ** 2}`, type: 'p',
        why: `(1) : un cube positif implique x = ${Math.round(Math.cbrt(c))} > 0. (2) : x = ±${Math.round(Math.cbrt(c))}, on ne peut pas conclure.` };
    },
    () => {
      const v = pick([
        { r: '3n est pair', type: 'each', why: '(1) : si n² est pair, n est pair. (2) : 3 étant impair, 3n pair implique n pair. Chacune suffit.' },
        { r: '2n est pair', type: 'p', why: '(1) : n² pair ⇒ n pair. (2) : 2n est toujours pair, cela n’apprend rien.' },
        { r: 'n + 4 est pair', type: 'each', why: '(1) : n² pair ⇒ n pair. (2) : n + 4 pair ⇒ n pair. Chacune suffit.' },
      ]);
      return { q: 'L’entier n est-il pair ?', p: 'n² est pair', r: v.r, type: v.type, why: v.why };
    },
    () => {
      const L = rand(5, 14), l = rand(2, L - 1);
      return { q: 'Quelle est l’aire de ce rectangle ?', p: `Sa longueur mesure ${L} cm`, r: `Son périmètre mesure ${2 * (L + l)} cm`, type: 'both',
        why: `Ensemble : largeur = ${2 * (L + l)}/2 − ${L} = ${l} cm, aire = ${L * l} cm². Seule, aucune ne donne les deux dimensions.` };
    },
    () => {
      const c = rand(3, 12);
      return { q: 'Quelle est l’aire de ce carré ?', p: `Son périmètre mesure ${4 * c} cm`, r: `Sa diagonale mesure ${c}√2 cm`, type: 'each',
        why: `(1) : côté = ${c} cm. (2) : côté = diagonale/√2 = ${c} cm. Chacune donne l’aire (${c * c} cm²).` };
    },
    () => {
      const p0 = pick([40, 50, 60, 80, 100, 150]);
      return { q: 'Un prix a augmenté de 20 %. Quel était le prix initial ?', p: `Le nouveau prix est ${p0 * 1.2} €`, r: `L’augmentation représente ${p0 * 0.2} €`, type: 'each',
        why: `(1) : ${p0 * 1.2} / 1,2 = ${p0} €. (2) : ${p0 * 0.2} / 0,2 = ${p0} €. Chacune suffit.` };
    },
    () => {
      const m = rand(10, 30), d = rand(1, 8);
      return { q: 'Quel âge a Paul ?', p: `Paul a ${d} ans de plus que Marie`, r: `La somme de leurs âges vaut ${2 * m + d} ans`, type: 'both',
        why: `Ensemble : 2M + ${d} = ${2 * m + d} ⇒ M = ${m}, Paul a ${m + d} ans.` };
    },
    () => {
      const s = rand(4, 15), d = rand(1, s - 1);
      return { q: 'Quelle est la valeur de x + y ?', p: `2x + 2y = ${2 * s}`, r: `x − y = ${d}`, type: 'p',
        why: `(1) : x + y = ${s} directement. (2) seule ne donne pas la somme.` };
    },
    () => {
      const s = rand(5, 20);
      return { q: 'Quelle est la valeur de x ?', p: `x + y = ${s}`, r: `2x + 2y = ${2 * s}`, type: 'none',
        why: `(2) est (1) multipliée par 2 : c’est la même information. Une seule équation pour deux inconnues : impossible.` };
    },
    () => {
      const n = pick([20, 25, 30, 35, 40, 45, 50]); const f = 0.4 * n, g = 0.6 * n;
      return { q: 'Combien d’élèves compte la classe ?', p: '40 % des élèves sont des filles', r: `Il y a ${g - f} garçons de plus que de filles`, type: 'both',
        why: `Ensemble : 60 % − 40 % = 20 % de la classe = ${g - f} élèves ⇒ ${n} élèves. Seules, aucune ne donne l’effectif.` };
    },
    () => {
      const k = rand(2, 6);
      return { q: 'Quelle est la valeur de a/b (avec b ≠ 0) ?', p: `2a = ${2 * k}b`, r: `a + b = ${(k + 1) * rand(2, 5)}`, type: 'p',
        why: `(1) : a/b = ${k}. (2) : une somme ne donne pas le rapport.` };
    },
    () => {
      const v = pick([
        { r: 'x est divisible par 4', why: 'Ensemble : divisible par 3 et par 4 ⇒ par 12 ⇒ par 6. Seules : 9 (div. par 3) et 4 (div. par 4) ne sont pas divisibles par 6.' },
        { r: 'x est pair', why: 'Ensemble : divisible par 2 et par 3 ⇒ par 6. Seules : 9 est divisible par 3 mais pas par 6 ; 4 est pair mais pas divisible par 6.' },
      ]);
      return { q: 'L’entier x est-il divisible par 6 ?', p: 'x est divisible par 3', r: v.r, type: 'both', why: v.why };
    },
    () => {
      const t = rand(2, 4), v = pick([60, 80, 90, 120]);
      return { q: 'Quelle est la vitesse moyenne d’un train entre A et B ?', p: `La distance AB est de ${v * t} km`, r: `Le trajet dure ${t} h`, type: 'both',
        why: `Vitesse = distance / temps = ${v * t} / ${t} = ${v} km/h. Il faut les deux données.` };
    },
    () => ({ q: 'x est-il supérieur à y ?', p: 'x² > y²', r: 'x > 0', type: 'both',
      why: '(1) seule : x = −3, y = 1 donne x² > y² mais x < y. (2) seule : rien sur y. Ensemble : x > 0 et x² > y² ⇒ x > |y| ≥ y.' }),
    () => {
      const pct = pick([5, 10, 15]);
      return { q: 'Quel est le chiffre d’affaires 2025 de l’entreprise ?', p: `Le CA a augmenté de ${pct} % entre 2024 et 2025`, r: `Le bénéfice 2025 s’élève à ${rand(2, 9) * 10} k€`, type: 'none',
        why: 'On connaît une évolution sans valeur de départ, et le bénéfice ne renseigne pas sur le CA.' };
    },
    () => {
      const s = rand(1, 4), c = rand(1, 4);
      const prop = Math.random() < 0.5;
      return {
        q: 'Combien coûte un stylo ?',
        p: `3 stylos et 2 cahiers coûtent ${3 * s + 2 * c} €`,
        r: prop ? `6 stylos et 4 cahiers coûtent ${6 * s + 4 * c} €` : `1 stylo et 1 cahier coûtent ${s + c} €`,
        type: prop ? 'none' : 'both',
        why: prop ? '(2) est exactement (1) multipliée par 2 : aucune information nouvelle.' : `Ensemble : 3s + 2c = ${3 * s + 2 * c} et s + c = ${s + c} ⇒ s = ${3 * s + 2 * c} − 2×${s + c} = ${s} €.`,
      };
    },
    () => {
      const total = pick([300, 250, 275, 325]);
      return { q: 'Quelle est la moyenne des notes d’une classe de 25 élèves ?', p: `La somme des notes vaut ${total}`, r: 'La note médiane est 12', type: 'p',
        why: `(1) : moyenne = ${total}/25 = ${TM.util.fmt(total / 25)}. (2) : la médiane ne donne pas la moyenne.` };
    },
    // --- Ajouts ---
    () => {
      const p = pick([15, 20, 25, 30]), d = rand(3, 9);
      return { q: 'Combien de pages Paul a-t-il lues cette semaine ?', p: `Il lit ${p} pages par jour de lecture`, r: `Il a lu pendant ${d} jours`, type: 'both',
        why: `Ensemble : ${p} × ${d} = ${p * d} pages. Seule, aucune ne suffit.` };
    },
    () => ({ q: 'L’entier x est-il pair ?', p: 'x + y est pair', r: 'y est pair', type: 'both',
      why: '(1) seule : x et y peuvent être tous deux impairs. (2) seule : rien sur x. Ensemble : x = (x + y) − y est pair.' }),
    () => {
      const pr = pick([40, 60, 80, 120]), rm = pick([10, 20, 25]);
      return { q: 'Quel est le prix d’un article après remise ?', p: `Le prix avant remise est de ${pr} €`, r: `La remise est de ${rm} %`, type: 'both',
        why: `Ensemble : ${pr} × ${1 - rm / 100} = ${TM.util.fmt(pr * (1 - rm / 100))} €.` };
    },
    () => {
      // Les deux informations doivent être vraies en même temps (avant : un angle de 45° impossible dans ce triangle)
      const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
      return { q: 'Le triangle ABC est-il rectangle ?', p: `Ses côtés mesurent ${a}, ${b} et ${c} cm`, r: `Son périmètre mesure ${a + b + c} cm`, type: 'p',
        why: `(1) : ${a}² + ${b}² = ${c}², donc rectangle (réciproque de Pythagore). (2) : un périmètre ne dit rien des angles.` };
    },
    () => {
      const d = rand(1, 9);
      return { q: 'a est-il supérieur à b ?', p: `a − b = ${d}`, r: 'a² > b²', type: 'p',
        why: `(1) : a = b + ${d} > b. (2) : a = −3 et b = 1 donnent a² > b² mais a < b.` };
    },
    () => {
      const k = rand(2, 9);
      return { q: 'Quelle est la valeur de x ?', p: `|x| = ${k}`, r: 'x < 0', type: 'both',
        why: `(1) : x = ${k} ou −${k}. (2) : infinité de valeurs. Ensemble : x = −${k}.` };
    },
    () => ({ q: 'L’entier n est-il divisible par 9 ?', p: 'La somme des chiffres de n vaut 18', r: 'n est divisible par 3', type: 'p',
      why: '(1) : un nombre est divisible par 9 si la somme de ses chiffres l’est, et 18 l’est. (2) : 6 est divisible par 3 mais pas par 9.' }),
    () => {
      const s = pick([30, 45, 60, 75]);
      return { q: 'Quelle est la moyenne de trois nombres ?', p: `Leur somme vaut ${s}`, r: `Le plus grand vaut ${s / 3 + 5}`, type: 'p',
        why: `(1) : ${s} / 3 = ${s / 3}. (2) : connaître le maximum ne donne pas la moyenne.` };
    },
    () => {
      const n = pick([40, 50, 60]); const f = n * 0.6, h = n - f;
      return { q: `Combien d’hommes y a-t-il dans une salle de ${n} personnes ?`, p: '60 % des personnes sont des femmes', r: `Il y a ${f - h} femmes de plus que d’hommes`, type: 'each',
        why: `(1) : 40 % de ${n} = ${h}. (2) : H + F = ${n} et F − H = ${f - h} donnent H = ${h}. Chacune suffit.` };
    },
    () => {
      const age = rand(10, 30);
      return { q: 'Quel âge a Léo ?', p: 'Dans 5 ans, il aura le double de l’âge qu’il avait il y a 5 ans', r: `Sa sœur a ${rand(2, 6)} ans de moins que lui`, type: 'p',
        why: '(1) : L + 5 = 2(L − 5) donne L = 15. (2) : un écart ne donne pas l’âge.' };
    },
    // --- Ajouts (variété) ---
    () => {
      const c = rand(2, 6), s = rand(1, 4);
      return { q: 'Combien coûte un cahier ?', p: `4 cahiers identiques coûtent ${4 * c} €`, r: `Un cahier et un stylo coûtent ensemble ${c + s} €`, type: 'p',
        why: `(1) : ${4 * c} / 4 = ${c} €. (2) : une seule équation pour deux prix inconnus.` };
    },
    () => ({ q: 'L’entier n est-il un multiple de 10 ?', p: 'n est pair', r: 'n est divisible par 5', type: 'both',
      why: '(1) seule : 4 est pair mais pas multiple de 10. (2) seule : 15 est divisible par 5 mais pas par 10. Ensemble : divisible par 2 et par 5, donc par 10.' }),
    () => {
      const m = rand(5, 20), d = rand(1, 6);
      return { q: 'Quelle est la moyenne de a et b ?', p: `a + b = ${2 * m}`, r: `a − b = ${d}`, type: 'p',
        why: `(1) : moyenne = ${2 * m} / 2 = ${m}. (2) : un écart ne donne pas la moyenne.` };
    },
    () => {
      const k = rand(4, 8);
      return { q: `x est-il supérieur à ${k} ?`, p: `x > ${k + 2}`, r: `x < ${k + 4}`, type: 'p',
        why: `(1) : x > ${k + 2} > ${k}, donc oui. (2) : x peut valoir ${k + 3} (oui) ou 0 (non).` };
    },
    () => {
      const base = pick([3, 4, 5]), km = pick([2, 2.5, 3]), d = rand(4, 12);
      return { q: 'Combien coûte une course en taxi ?', p: `La prise en charge coûte ${base} €, puis ${TM.util.fmt(km)} € par kilomètre`, r: `La course fait ${d} km`, type: 'both',
        why: `Ensemble : ${base} + ${TM.util.fmt(km)} × ${d} = ${TM.util.fmt(base + km * d)} €. Seule, aucune ne suffit.` };
    },
    () => ({ q: 'L’entier n est-il un nombre premier ?', p: 'n est strictement compris entre 24 et 28', r: 'n est impair', type: 'p',
      why: '(1) : n vaut 25, 26 ou 27, aucun n’est premier (25 = 5², 26 = 2 × 13, 27 = 3³) : la réponse est « non » à coup sûr, ce qui suffit. (2) : 9 est impair non premier, 7 est impair premier.' }),
    () => ({ q: 'Quelle est la valeur de x ?', p: 'x² − 5x + 6 = 0', r: 'x > 2', type: 'both',
      why: '(1) : x = 2 ou x = 3. (2) : infinité de valeurs. Ensemble : x = 3.' }),
    () => {
      const l = pick([1500, 2000, 2500, 3000]), p = pick([10, 20, 25]);
      return { q: 'Quel est le salaire de Marc ?', p: `Marc gagne ${p} % de plus que Léa`, r: `Léa gagne ${TM.util.fmt(l)} € par mois`, type: 'both',
        why: `Ensemble : ${TM.util.fmt(l)} × ${TM.util.fmt(1 + p / 100)} = ${TM.util.fmt(l * (1 + p / 100))} €. Seule, aucune ne suffit.` };
    },
    () => {
      const g = rand(5, 15);
      return { q: 'Combien y a-t-il de filles dans le groupe ?', p: `Le groupe compte ${3 * g} personnes`, r: 'Il y a deux fois plus de filles que de garçons', type: 'both',
        why: `Ensemble : F + G = ${3 * g} et F = 2G ⇒ G = ${g}, F = ${2 * g}. Seule, aucune ne suffit.` };
    },
    () => {
      const a = pick([40, 50, 65, 70]);
      return { q: 'Le triangle ABC est-il isocèle ?', p: `Deux de ses angles mesurent ${a}° et ${180 - 2 * a}°`, r: 'Son périmètre mesure 20 cm', type: 'p',
        why: `(1) : le troisième angle vaut 180 − ${a} − ${180 - 2 * a} = ${a}°, deux angles égaux : isocèle. (2) : un périmètre ne dit rien de la forme.` };
    },
  ];

  function toQuestion(t) {
    let { p, r, type } = t;
    const swap = Math.random() < 0.5;
    let first = p, second = r, answer;
    if (swap) { first = r; second = p; }
    if (type === 'p') answer = swap ? 1 : 0;
    else answer = { both: 2, each: 3, none: 4 }[type];
    let why = t.why;
    if (swap) why = why.replace(/\((1)\)|\((2)\)/g, (m) => (m === '(1)' ? '(2)' : '(1)'));
    return {
      theme: 'cm',
      prompt: `<p class="cm-q">${t.q}</p><ol class="cm-info"><li><strong>(1)</strong> ${first}</li><li><strong>(2)</strong> ${second}</li></ol>`,
      choices: CHOICES.slice(),
      answer,
      explanation: why,
    };
  }

  TM.gen.cm = function (n) {
    const out = [];
    let pool = shuffle(templates.map((_, i) => i));
    for (let i = 0; i < n; i++) {
      if (!pool.length) pool = shuffle(templates.map((_, i) => i));
      out.push(toQuestion(templates[pool.pop()]()));
    }
    return out;
  };
})();
