// Leçons par sous-test
// Chaque leçon : memo (à retenir), sections (sommaire + contenu expliqué), quiz (3 questions de vérification)
// Les cours détaillés et les fiches de révision sont dans js/courses.js
// Classe .lesson-why : « pourquoi ça marche », juste après une règle
TM.LESSONS = {
  intro: {
    title: 'Le format du TAGE MAGE',
    lead: 'Le TAGE MAGE est le test d’aptitude utilisé par de nombreuses écoles de commerce et masters. Avant de réviser le contenu, il faut comprendre les règles du jeu : elles dictent toute la stratégie. Format d’après les sources de préparation à jour en 2026 (vérifiez toujours sur le site officiel de la FNEGE).',
    memo: [
      '<strong>6 sous-tests × 15 questions</strong>, 20 minutes chacun : 90 questions en 2 heures.',
      'Score sur <strong>600</strong>, <strong>pas de points négatifs</strong> : on répond à tout.',
      'Le temps non utilisé dans un sous-test <strong>ne se reporte pas</strong>.',
      'Environ <strong>1 min 20 par question</strong> ; jamais plus de 2 minutes bloqué.',
    ],
    sections: [
      { t: 'Les épreuves', html: `
<p>Le test est découpé en six blocs indépendants. Chacun mesure une aptitude différente : lire, calculer, raisonner, juger si une information suffit, maîtriser la langue, repérer une règle.</p>
<table class="t">
<tr><th>#</th><th>Sous-test</th><th>Questions</th><th>Durée</th></tr>
<tr><td>1</td><td>Compréhension de textes</td><td>15</td><td>20 min</td></tr>
<tr><td>2</td><td>Calcul</td><td>15</td><td>20 min</td></tr>
<tr><td>3</td><td>Raisonnement &amp; Argumentation</td><td>15</td><td>20 min</td></tr>
<tr><td>4</td><td>Conditions minimales</td><td>15</td><td>20 min</td></tr>
<tr><td>5</td><td>Expression</td><td>15</td><td>20 min</td></tr>
<tr><td>6</td><td>Logique</td><td>15</td><td>20 min</td></tr>
</table>
<ul>
<li><strong>90 questions, 2 heures</strong>, 5 propositions par question, une seule bonne réponse.</li>
<li>Chaque sous-test a son <strong>propre chronomètre</strong> : impossible de revenir sur un sous-test terminé.</li>
<li><strong>Pas de calculatrice</strong> : tout le calcul se fait à la main ou de tête.</li>
</ul>
<p class="lesson-why"><b>Pourquoi c’est important</b> Comme les blocs sont séparés, un sous-test raté ne contamine pas les autres. Mais un point faible ne se compense pas non plus par du temps gagné ailleurs : il faut un niveau correct partout.</p>` },
      { t: 'Barème et score', html: `
<ul>
<li>Score sur <strong>600</strong>.</li>
<li><strong>Plus de points négatifs</strong> depuis la réforme du barème (2025) : une erreur ou une absence de réponse vaut 0.</li>
<li>Jusqu’à <strong>4 passages par an</strong> (un par trimestre civil) depuis 2026 ; le score est valable deux années civiles.</li>
</ul>
<p class="lesson-why"><b>Pourquoi répondre à tout</b> Avec 5 propositions, une réponse au hasard a 1 chance sur 5 d’être juste. Sur 10 questions laissées vides, cocher au hasard rapporte en moyenne 2 bonnes réponses, et une erreur ne coûte rien. Une case vide, elle, rapporte toujours 0.</p>
<div class="lesson-callout tip"><b>Encore mieux que le hasard</b> Si vous avez éliminé 2 propositions sûres, vos chances passent à 1 sur 3. Éliminer d’abord, deviner ensuite.</div>` },
      { t: 'Gérer son temps', html: `
<p>20 minutes pour 15 questions, cela fait <strong>1 min 20 par question</strong> en moyenne. C’est peu : la gestion du temps compte autant que le niveau.</p>
<ul>
<li>Ne restez jamais bloqué plus de 2 minutes sur une question.</li>
<li><strong>Deux passages</strong> : faites d’abord les questions faciles, marquez les autres, revenez-y.</li>
<li>Gardez <strong>30 secondes à la fin</strong> de chaque sous-test pour cocher une réponse partout.</li>
</ul>
<p class="lesson-why"><b>Pourquoi les faciles d’abord</b> Toutes les questions rapportent autant. Trois minutes perdues sur une question difficile, ce sont deux questions faciles jamais lues. En faisant d’abord ce que vous savez faire, vous sécurisez vos points.</p>` },
      { t: 'Plan de révision', html: `
<ol>
<li><strong>Faites un examen blanc</strong> pour situer votre niveau dans chaque sous-test.</li>
<li>Lisez la leçon et le cours de votre sous-test le plus faible, puis entraînez-vous dessus <strong>tous les jours</strong>.</li>
<li>Révisez les <strong>fiches</strong> dans les temps morts (transports, pauses) : quelques minutes suffisent.</li>
<li>Un <strong>examen blanc par semaine</strong> dans le dernier mois, en conditions réelles (chrono, sans pause).</li>
<li>Après chaque séance, relisez vos erreurs : la plupart viennent toujours des mêmes pièges.</li>
</ol>
<p class="lesson-why"><b>Pourquoi le plus faible d’abord</b> Passer de 30 % à 60 % de réussite sur un sous-test est bien plus facile que de passer de 80 % à 90 % sur un autre. Les gros gains de points sont là où vous êtes le moins bon.</p>
<div class="lesson-callout"><b>Le jour J</b> Arrivez en avance avec votre convocation et une pièce d’identité. Dormez bien la veille : au TAGE MAGE, la fraîcheur vaut plus qu’une dernière révision.</div>` },
    ],
    quiz: [
      { q: 'Combien de questions compte le TAGE MAGE complet ?', c: ['60', '75', '90', '100', '120'], a: 2, why: '6 sous-tests de 15 questions, soit 90 questions en 2 heures.' },
      { q: 'Il reste 30 secondes et vous n’avez pas répondu à 3 questions. Que faire ?', c: ['Les laisser vides pour éviter des points négatifs', 'Répondre au hasard aux 3', 'En traiter une seule sérieusement', 'Garder le temps pour le sous-test suivant', 'Relire les questions déjà faites'], a: 1, why: 'Il n’y a plus de points négatifs : une case vide vaut 0, une réponse au hasard peut rapporter des points. Le temps ne se reporte pas.' },
      { q: 'Vous finissez un sous-test 3 minutes en avance. Que deviennent ces 3 minutes ?', c: ['Elles s’ajoutent au sous-test suivant', 'Elles s’ajoutent au dernier sous-test', 'Elles sont perdues', 'Elles donnent un bonus de points', 'On peut les utiliser sur un sous-test précédent'], a: 2, why: 'Chaque sous-test a son propre chronomètre : le temps restant ne se reporte pas. Utilisez-le pour vérifier vos réponses.' },
    ],
  },

  comprehension: {
    title: 'Compréhension de textes',
    lead: 'Un ou plusieurs textes, suivis de questions sur le sens, la thèse, les arguments et les détails. Ce sous-test ne mesure pas votre culture : il mesure votre capacité à dire exactement ce que dit le texte, ni plus, ni moins.',
    memo: [
      '<strong>Survolez les questions</strong> avant de lire le texte.',
      'Repérez la <strong>thèse</strong> et les <strong>connecteurs</strong> (pourtant, donc, toutefois).',
      'Chaque réponse se <strong>justifie par une phrase du texte</strong>, jamais de mémoire.',
      'Méfiez-vous du vrai-mais-hors-texte, des généralisations et des négations.',
    ],
    sections: [
      { t: 'Méthode', html: `
<ol>
<li><strong>Lisez les questions avant le texte</strong> (survol rapide) pour savoir quoi chercher.</li>
<li>Lisez le texte une fois, en repérant la <strong>thèse</strong> (souvent en introduction ou en conclusion) et les <strong>connecteurs</strong>.</li>
<li>Pour chaque question, <strong>retrouvez la phrase précise</strong> dans le texte. Ne répondez jamais de mémoire.</li>
<li><strong>Éliminez</strong> les propositions fausses plutôt que de chercher directement la bonne.</li>
</ol>
<p class="lesson-why"><b>Pourquoi les questions d’abord</b> Une lecture « à l’aveugle » retient surtout l’idée générale. Si vous savez déjà qu’on vous interroge sur un chiffre ou sur l’avis de l’auteur, votre œil l’accroche au passage et vous n’aurez pas à tout relire.</p>
<p class="lesson-why"><b>Pourquoi éliminer</b> Les mauvaises propositions sont construites avec des mots du texte pour avoir l’air justes. Il est plus facile de trouver le défaut précis d’une mauvaise réponse que de prouver qu’une réponse est parfaite.</p>` },
      { t: 'Types de questions', html: `
<p>Chaque type de question pointe vers un endroit différent du texte. Savoir où chercher fait gagner un temps précieux.</p>
<table class="t">
<tr><th>La question demande…</th><th>Où chercher</th></tr>
<tr><td>La thèse, l’idée principale</td><td>Introduction et conclusion ; la réponse est générale, pas un détail.</td></tr>
<tr><td>Un détail, un chiffre</td><td>Le passage précis : relisez la phrase entière.</td></tr>
<tr><td>Ce que l’auteur sous-entend</td><td>Ce qui découle <em>forcément</em> du texte, sans extrapoler.</td></tr>
<tr><td>Le sens d’un mot</td><td>Le contexte de la phrase, pas le sens courant du mot.</td></tr>
<tr><td>Le ton, l’intention</td><td>Les adjectifs, les connecteurs, la ponctuation (ironie, critique, neutralité).</td></tr>
</table>
<p class="lesson-why"><b>Pourquoi relire la phrase entière</b> Un détail est souvent nuancé juste après (« …, du moins en ville »). Lire trois mots isolés, c’est risquer de rater la restriction qui rend la réponse fausse.</p>` },
      { t: 'Lire les connecteurs', html: `
<p>Les connecteurs sont les panneaux de signalisation du texte : ils indiquent où va le raisonnement.</p>
<ul>
<li><strong>Opposition</strong> (mais, pourtant, cependant) : ce qui suit est souvent l’avis de l’auteur.</li>
<li><strong>Conséquence</strong> (donc, ainsi, c’est pourquoi) : annonce une conclusion.</li>
<li><strong>Concession</strong> (certes… mais) : l’auteur reconnaît un point pour mieux le dépasser.</li>
<li><strong>Nuance</strong> (souvent, parfois, en partie) : à reporter tel quel dans la réponse.</li>
</ul>
<p class="lesson-why"><b>Pourquoi « mais » compte autant</b> Un auteur présente souvent l’opinion courante pour la contredire ensuite. Dans « Certes, la mesure coûte cher, mais elle sauve des vies », ce qui compte pour lui, c’est la deuxième partie.</p>` },
      { t: 'Les pièges classiques', html: `
<ul>
<li><strong>La réponse vraie mais hors texte</strong> : plausible, conforme à vos connaissances, mais non dite par l’auteur.</li>
<li><strong>La généralisation</strong> : le texte dit « certains », la réponse dit « tous ».</li>
<li><strong>Le contresens partiel</strong> : les bons mots du texte, mais la mauvaise relation (cause et conséquence inversées).</li>
<li><strong>La position de l’auteur vs. celle qu’il rapporte</strong> : « certains observateurs pensent que… » n’est pas l’avis de l’auteur.</li>
<li><strong>La négation dans la question</strong> : « lequel n’est PAS… ».</li>
<li><strong>Le mot absolu</strong> (toujours, jamais, uniquement) : rarement juste si le texte nuance.</li>
</ul>
<p class="lesson-why"><b>Pourquoi ces pièges marchent</b> Ils misent sur la lecture rapide : on reconnaît des mots familiers et on coche. La seule défense est de comparer la proposition à la phrase exacte du texte, mot à mot sur les termes importants (tous/certains, cause/conséquence, l’auteur/d’autres).</p>` },
    ],
    quiz: [
      { q: 'Le texte dit : « Certains économistes jugent la mesure inefficace. » Quelle affirmation est fidèle au texte ?', c: ['L’auteur juge la mesure inefficace', 'Les économistes jugent la mesure inefficace', 'Une partie des économistes doute de l’efficacité de la mesure', 'La mesure est inefficace', 'Les économistes sont unanimes'], a: 2, why: '« Certains » ne veut pas dire « tous », et l’avis rapporté n’est pas celui de l’auteur.' },
      { q: 'Quelle est la première étape conseillée face à un texte ?', c: ['Lire le texte deux fois en entier', 'Survoler les questions', 'Lire uniquement la conclusion', 'Répondre de mémoire puis vérifier', 'Souligner tous les chiffres'], a: 1, why: 'Survoler les questions d’abord indique quoi chercher pendant la lecture.' },
      { q: 'Une proposition est vraie dans la réalité mais n’est pas dite dans le texte. Elle est…', c: ['à cocher : elle est vraie', 'à cocher si elle est plausible', 'à écarter : hors texte', 'à cocher si elle complète la thèse', 'à garder en cas de doute'], a: 2, why: 'On juge uniquement d’après le texte. C’est le piège du vrai-mais-hors-texte.' },
    ],
  },

  calcul: {
    title: 'Calcul',
    lead: 'Arithmétique, pourcentages, proportions, vitesses, géométrie, équations, probabilités. Pas de calculatrice : le sous-test récompense moins le calcul que le fait de savoir quel calcul faire, et de le simplifier.',
    memo: [
      'Évolutions successives : on <strong>multiplie les coefficients</strong> (+10 % puis −10 % = −1 %).',
      'Vitesse moyenne aller-retour : <strong>2·v₁·v₂ / (v₁ + v₂)</strong>.',
      'Travail en commun : <strong>T = T₁·T₂ / (T₁ + T₂)</strong>.',
      '<strong>Éliminez par ordre de grandeur</strong> avant de calculer précisément.',
    ],
    sections: [
      { t: 'Pourcentages', html: `
<p>Un pourcentage est toujours un pourcentage <strong>de quelque chose</strong>. Presque toutes les erreurs viennent d’une confusion sur ce « quelque chose », la valeur de référence.</p>
<ul>
<li>Évolution = (arrivée − départ) / <strong>départ</strong>.</li>
<li>Coefficient multiplicateur : +20 % → ×1,2 ; −15 % → ×0,85.</li>
<li>Évolutions successives : on <strong>multiplie</strong> les coefficients. +10 % puis −10 % = ×0,99 = −1 %.</li>
<li>Retrouver le prix initial : diviser par le coefficient (HT = TTC / 1,2).</li>
</ul>
<p class="lesson-why"><b>Pourquoi +10 % puis −10 % ne revient pas au départ</b> Les 10 % de baisse se calculent sur le prix <em>déjà augmenté</em>. 100 € → 110 € ; 10 % de 110 € = 11 €, donc on retombe à 99 €. La baisse porte sur une base plus grande, elle enlève plus que la hausse n’a ajouté.</p>
<p class="lesson-why"><b>Pourquoi on divise pour remonter</b> Si TTC = HT × 1,2, alors HT = TTC / 1,2. Retirer 20 % du TTC serait faux : les 20 % de TVA ont été calculés sur le HT, pas sur le TTC.</p>
<div class="lesson-callout tip"><b>Astuce</b> x % de y = y % de x. 8 % de 50 = 50 % de 8 = 4.</div>` },
      { t: 'Calcul mental', html: `
<p>Sans calculatrice, l’objectif est de transformer un calcul pénible en calcul facile.</p>
<ul>
<li>×25 = ×100 ÷ 4 ; ×125 = ×1000 ÷ 8 ; ×99 = ×100 − x ; ×11 = ×10 + x.</li>
<li>(a + b)² = a² + 2ab + b² : 51² = 2500 + 100 + 1 = 2601.</li>
<li>a² − b² = (a − b)(a + b) : 49 × 51 = 50² − 1 = 2499.</li>
<li>Carrés de 1 à 20 et fractions usuelles (1/8 = 0,125 ; 3/8 = 0,375 ; 1/6 ≈ 0,167 ; 1/7 ≈ 0,143).</li>
</ul>
<p class="lesson-why"><b>Pourquoi ×25 = ×100 ÷ 4</b> Parce que 25 = 100 / 4. Multiplier par 100 et diviser par 4 sont deux opérations faciles, alors que multiplier par 25 directement ne l’est pas.</p>
<p class="lesson-why"><b>Pourquoi l’ordre de grandeur d’abord</b> Les 5 réponses sont souvent très différentes. Arrondir (49 × 51 ≈ 50 × 50 = 2500) suffit parfois à éliminer 3 ou 4 propositions sans calcul exact.</p>` },
      { t: 'Vitesses et débits', html: `
<ul>
<li>d = v × t. Convertissez les minutes en heures (45 min = 0,75 h).</li>
<li>Vitesse moyenne sur aller-retour : <strong>2·v₁·v₂ / (v₁ + v₂)</strong> (jamais la moyenne simple).</li>
<li>1 m/s = 3,6 km/h.</li>
<li>Deux mobiles face à face : on <strong>additionne</strong> les vitesses ; l’un poursuit l’autre : on les <strong>soustrait</strong>.</li>
<li>Travail en commun : on additionne les débits, 1/T = 1/T₁ + 1/T₂, donc T = T₁·T₂ / (T₁ + T₂).</li>
</ul>
<p class="lesson-why"><b>Pourquoi pas la moyenne simple</b> La vitesse moyenne, c’est la distance totale divisée par le temps total. Aller 60 km à 60 km/h prend 1 h ; revenir à 40 km/h prend 1 h 30. On a fait 120 km en 2 h 30, soit 48 km/h, pas 50. On passe plus de temps à la vitesse lente, elle pèse donc davantage.</p>
<p class="lesson-why"><b>Pourquoi additionner les débits</b> Un robinet qui remplit une cuve en 3 h en remplit 1/3 par heure ; un autre en 6 h en remplit 1/6. Ensemble : 1/3 + 1/6 = 1/2 par heure, donc 2 h. Ce sont les quantités par heure qui s’additionnent, pas les durées.</p>` },
      { t: 'Moyennes et équations', html: `
<ul>
<li>Moyenne pondérée : Σ(valeur × coefficient) / Σ coefficients.</li>
<li>Si la moyenne de n nombres vaut m, leur <strong>somme vaut n × m</strong> : souvent la clé.</li>
<li>Problèmes d’âges : posez l’âge actuel x ; dans k ans, tout le monde a vieilli de k.</li>
<li>Quand les réponses sont des nombres, <strong>testez-les</strong> dans l’énoncé plutôt que de résoudre.</li>
</ul>
<p class="lesson-why"><b>Pourquoi passer par la somme</b> Une moyenne ne s’additionne pas, une somme si. « La moyenne de 4 notes est 12, on ajoute un 17 » : la somme passe de 48 à 65, la nouvelle moyenne est 65 / 5 = 13.</p>` },
      { t: 'Géométrie', html: `
<ul>
<li>Aire du disque πr², périmètre 2πr. Attention au diamètre !</li>
<li>Triangles de Pythagore à connaître : 3-4-5, 5-12-13, 8-15-17 et leurs multiples.</li>
<li>Aire du triangle : base × hauteur / 2. Diagonale du carré de côté a : a√2.</li>
<li>Agrandir les longueurs par k multiplie les aires par <strong>k²</strong> et les volumes par <strong>k³</strong>.</li>
</ul>
<p class="lesson-why"><b>Pourquoi k² pour les aires</b> Une aire, c’est une longueur fois une longueur. Si les deux sont multipliées par 2, l’aire l’est par 2 × 2 = 4. Un volume a trois dimensions : ×2 × 2 × 2 = ×8.</p>` },
      { t: 'Probabilités', html: `
<ul>
<li>P = cas favorables / cas possibles.</li>
<li>Tirages successifs sans remise : on multiplie en retirant une boule à chaque fois.</li>
<li>« Au moins un » : calculez 1 − P(aucun).</li>
<li>Nombre de façons de ranger n objets : n! (4 objets : 24). Choisir 2 parmi n : n(n − 1)/2.</li>
</ul>
<p class="lesson-why"><b>Pourquoi passer par « aucun »</b> « Au moins un six en 3 lancers » regroupe beaucoup de cas (un six, deux six, trois six). Son contraire, « aucun six », n’en a qu’un : (5/6)³. On le calcule puis on le retire de 1.</p>` },
    ],
    quiz: [
      { q: 'Un prix augmente de 20 %, puis baisse de 20 %. Au total, il…', c: ['ne change pas', 'baisse de 4 %', 'augmente de 4 %', 'baisse de 2 %', 'baisse de 40 %'], a: 1, why: '1,2 × 0,8 = 0,96, soit une baisse de 4 %.' },
      { q: 'Aller à 60 km/h, retour sur la même route à 40 km/h. Vitesse moyenne ?', c: ['45 km/h', '48 km/h', '50 km/h', '52 km/h', '55 km/h'], a: 1, why: '2 × 60 × 40 / (60 + 40) = 4800 / 100 = 48 km/h. On passe plus de temps à 40 km/h.' },
      { q: 'Un robinet remplit une cuve en 3 h, un autre en 6 h. Ensemble ?', c: ['1 h 30', '2 h', '2 h 30', '4 h 30', '9 h'], a: 1, why: 'T = 3 × 6 / (3 + 6) = 18 / 9 = 2 h.' },
    ],
  },

  argumentation: {
    title: 'Raisonnement & Argumentation',
    lead: 'On vous présente un raisonnement : il faut identifier sa conclusion, son hypothèse cachée, sa faiblesse, ou ce qui le renforce ou l’affaiblit. Il ne s’agit jamais de dire si vous êtes d’accord, mais de juger si le raisonnement tient debout.',
    memo: [
      'Si A alors B ⇒ <strong>si non-B alors non-A</strong> (contraposée). B ne prouve pas A.',
      'Négation de « tous les X sont Y » : <strong>au moins un X n’est pas Y</strong>.',
      '<strong>Corrélation ≠ causalité</strong> : cherchez un troisième facteur ou la causalité inverse.',
      'Hypothèse implicite : <strong>niez-la</strong>, le raisonnement doit s’effondrer.',
    ],
    sections: [
      { t: 'Logique des propositions', html: `
<p>« Si A alors B » signifie seulement : <em>chaque fois que A est vrai, B l’est aussi</em>. Cela ne dit rien de ce qui se passe quand A est faux.</p>
<table class="t">
<tr><th>Forme</th><th>Valide ?</th></tr>
<tr><td>Si A alors B. A. Donc B. (modus ponens)</td><td class="yes">Oui</td></tr>
<tr><td>Si A alors B. Non-B. Donc non-A. (contraposée)</td><td class="yes">Oui</td></tr>
<tr><td>Si A alors B. B. Donc A.</td><td class="no">Non : affirmation du conséquent</td></tr>
<tr><td>Si A alors B. Non-A. Donc non-B.</td><td class="no">Non : négation de l’antécédent</td></tr>
</table>
<p class="lesson-why"><b>Pourquoi la contraposée marche</b> « S’il pleut, la route est mouillée. » Si la route est sèche, il ne peut pas avoir plu : sinon elle serait mouillée. L’absence de B exclut A.</p>
<p class="lesson-why"><b>Pourquoi l’inverse ne marche pas</b> La route mouillée ne prouve pas la pluie : elle a pu être arrosée. B peut avoir d’autres causes que A.</p>
<ul>
<li><strong>Condition nécessaire</strong> (« il faut », « seulement si ») ≠ <strong>condition suffisante</strong> (« il suffit », « si »).</li>
<li>« A seulement si B » s’écrit <strong>si A alors B</strong>.</li>
<li>La négation de « tous les X sont Y » est « <strong>au moins un</strong> X n’est pas Y ».</li>
<li>La négation de « A et B » est « non-A <strong>ou</strong> non-B ».</li>
</ul>
<p class="lesson-why"><b>Pourquoi « au moins un »</b> Pour prouver qu’une phrase avec « tous » est fausse, il suffit d’un contre-exemple. « Aucun » va beaucoup trop loin : c’est le contraire extrême, pas la négation.</p>` },
      { t: 'Les sophismes', html: `
<p>Un sophisme est un raisonnement qui a l’air solide mais contient une faille. Les connaître par leur nom aide à les repérer vite.</p>
<ul>
<li><strong>Corrélation ≠ causalité</strong> (cherchez un troisième facteur ou une causalité inverse).</li>
<li><strong>Généralisation hâtive</strong> et <strong>échantillon non représentatif</strong>.</li>
<li><strong>Faux dilemme</strong> : seulement deux options présentées alors qu’il en existe d’autres.</li>
<li><strong>Pente glissante</strong> : une suite de conséquences de plus en plus graves, sans preuve.</li>
<li><strong>Raisonnement circulaire</strong> : la conclusion est déjà dans les prémisses.</li>
<li><strong>Ad hominem</strong> (attaquer la personne), <strong>argument d’autorité</strong> abusif.</li>
</ul>
<p class="lesson-why"><b>Pourquoi corrélation ≠ causalité</b> Les ventes de glaces et les noyades augmentent ensemble. Les glaces ne noient personne : c’est la chaleur qui fait monter les deux. Deux choses qui varient ensemble peuvent avoir une cause commune.</p>` },
      { t: 'Renforcer, affaiblir', html: `
<ul>
<li>Pour <strong>affaiblir</strong> un lien causal : une autre cause possible, ou l’effet observé sans la cause (groupe témoin).</li>
<li>Pour <strong>renforcer</strong> : éliminer les autres causes, montrer un groupe témoin sans l’effet.</li>
<li>Hypothèse implicite : ce qui doit être vrai pour que la conclusion tienne. Test : niez-la, le raisonnement s’effondre-t-il ?</li>
</ul>
<p class="lesson-why"><b>Pourquoi le test de la négation</b> Une hypothèse implicite est un pilier caché. Si on la retire (en la niant) et que la conclusion tient toujours, ce n’était pas un pilier. Si tout s’écroule, vous l’avez trouvée.</p>
<div class="lesson-callout tip"><b>Réflexe</b> Isolez d’abord la conclusion (souvent après « donc », « ainsi », « par conséquent »), puis demandez-vous ce qui manque pour y arriver.</div>` },
    ],
    quiz: [
      { q: '« S’il pleut, la route est mouillée. La route est mouillée. Donc il a plu. » Ce raisonnement est…', c: ['valide (modus ponens)', 'valide (contraposée)', 'invalide : affirmation du conséquent', 'invalide : négation de l’antécédent', 'circulaire'], a: 2, why: 'La route peut être mouillée pour une autre raison (arrosage, nettoyage) : B ne prouve pas A.' },
      { q: 'Quelle est la négation de « Tous les cadres parlent anglais » ?', c: ['Aucun cadre ne parle anglais', 'Tous les cadres ne parlent pas anglais', 'Au moins un cadre ne parle pas anglais', 'Certains cadres parlent anglais', 'La plupart des cadres ne parlent pas anglais'], a: 2, why: 'Il suffit d’un contre-exemple pour contredire « tous ».' },
      { q: '« Les villes qui ont le plus de policiers ont le plus de crimes : la police favorise le crime. » Meilleure critique ?', c: ['L’échantillon est trop petit', 'Causalité inverse : on affecte plus de policiers là où il y a plus de crimes', 'C’est un argument d’autorité', 'C’est un faux dilemme', 'La conclusion est dans les prémisses'], a: 1, why: 'Une corrélation peut s’expliquer dans l’autre sens : le crime attire la police.' },
    ],
  },

  cm: {
    title: 'Conditions minimales',
    lead: 'On ne vous demande pas de calculer la réponse, mais de dire si les informations permettent de la trouver. C’est un sous-test de jugement : savoir qu’un calcul aboutirait suffit, inutile de le faire.',
    memo: [
      'Testez (1) seule, puis <strong>(2) seule en oubliant (1)</strong>.',
      'A : (1) seule · B : (2) seule · C : ensemble · D : chacune · E : jamais.',
      'Une réponse <strong>« toujours non » suffit</strong> pour une question oui/non.',
      'Cherchez un <strong>contre-exemple</strong> : 0, négatifs, fractions.',
    ],
    sections: [
      { t: 'Les 5 réponses', html: `
<table class="t">
<tr><td><strong>A</strong></td><td>(1) seule suffit, pas (2)</td></tr>
<tr><td><strong>B</strong></td><td>(2) seule suffit, pas (1)</td></tr>
<tr><td><strong>C</strong></td><td>Les deux ensemble, aucune seule</td></tr>
<tr><td><strong>D</strong></td><td>Chacune seule suffit</td></tr>
<tr><td><strong>E</strong></td><td>Même ensemble, insuffisant</td></tr>
</table>
<p>Ces 5 réponses sont <strong>toujours les mêmes</strong> : apprenez-les par cœur pour ne pas les relire à chaque question.</p>
<p class="lesson-why"><b>Pourquoi c’est rentable</b> Relire le tableau prend 10 à 15 secondes. Sur 15 questions, c’est plus de 3 minutes perdues, soit deux questions de plus que vous auriez pu traiter.</p>` },
      { t: 'L’arbre de décision', html: `
<ol>
<li>(1) seule suffit-elle ? Puis (2) seule suffit-elle ? <strong>Oubliez (1) en testant (2).</strong></li>
<li>Les deux oui → <strong>D</strong>. Une seule oui → <strong>A</strong> ou <strong>B</strong>.</li>
<li>Aucune → combinez. Ensemble oui → <strong>C</strong>, sinon → <strong>E</strong>.</li>
</ol>
<p class="lesson-why"><b>Pourquoi oublier (1)</b> C’est l’erreur la plus fréquente : après avoir lu (1), on garde son information en tête et (2) semble suffire alors qu’elle ne suffit qu’<em>avec</em> (1). On répond B ou D au lieu de C.</p>
<div class="lesson-callout tip"><b>Gain de temps</b> Dès que vous savez qu’une valeur <em>peut</em> être trouvée, arrêtez-vous : inutile de faire le calcul jusqu’au bout.</div>` },
      { t: 'Exemple corrigé', html: `
<p><strong>Question :</strong> quelle est la valeur de x ? (1) x² = 16. (2) x &gt; 0.</p>
<ul>
<li>(1) seule : x = 4 ou x = −4 → insuffisant.</li>
<li>(2) seule : x peut valoir n’importe quel positif → insuffisant.</li>
<li>Ensemble : x = 4 → suffisant. Réponse <strong>C</strong>.</li>
</ul>
<p class="lesson-why"><b>Ce qu’il faut retenir</b> « Suffire » veut dire « donner <em>une seule</em> valeur possible ». Deux valeurs possibles (4 et −4), c’est déjà insuffisant.</p>` },
      { t: 'Les pièges', html: `
<ul>
<li><strong>Deux équations proportionnelles</strong> (x + y = 5 et 2x + 2y = 10) : une seule information → souvent E.</li>
<li><strong>Les carrés</strong> : x² = 9 donne x = 3 <em>ou</em> −3.</li>
<li><strong>Questions oui/non</strong> : une réponse « toujours non » est suffisante ! Suffire, c’est pouvoir répondre de façon certaine, quelle que soit la réponse.</li>
<li>Pour invalider une information, cherchez un <strong>contre-exemple</strong> (0, nombres négatifs, fractions).</li>
<li>Une seule équation peut suffire si on demande une <strong>combinaison</strong> (x + y), pas x seul.</li>
<li>Ne supposez rien qui ne soit pas écrit : une figure n’est pas forcément à l’échelle, x n’est pas forcément entier.</li>
</ul>
<p class="lesson-why"><b>Pourquoi deux équations ne suffisent pas toujours</b> 2x + 2y = 10, c’est x + y = 5 multiplié par 2 : aucune information nouvelle. Pour trouver deux inconnues, il faut deux équations <em>vraiment différentes</em>.</p>
<p class="lesson-why"><b>Pourquoi « toujours non » suffit</b> La question est « peut-on répondre ? ». Si l’information prouve que la réponse est non dans tous les cas, on a bien répondu, avec certitude.</p>` },
    ],
    quiz: [
      { q: 'x est un entier positif. x est-il pair ? (1) 3x est pair. (2) x + 2 est pair.', c: ['A : (1) seule', 'B : (2) seule', 'C : les deux ensemble', 'D : chacune seule', 'E : insuffisant'], a: 3, why: '3 est impair, donc 3x pair ⇒ x pair. Et x + 2 pair ⇒ x pair. Chacune suffit seule.' },
      { q: 'Quelle est la valeur de x + y ? (1) 2x + 2y = 10. (2) x − y = 1.', c: ['A : (1) seule', 'B : (2) seule', 'C : les deux ensemble', 'D : chacune seule', 'E : insuffisant'], a: 0, why: '(1) donne directement x + y = 5. (2) ne donne que la différence.' },
      { q: 'Quelle est la valeur de x ? (1) x + y = 6. (2) 3x + 3y = 18.', c: ['A : (1) seule', 'B : (2) seule', 'C : les deux ensemble', 'D : chacune seule', 'E : insuffisant'], a: 4, why: '(2) est (1) multipliée par 3 : c’est la même information. Une équation à deux inconnues ne donne pas x.' },
    ],
  },

  expression: {
    title: 'Expression',
    lead: 'Grammaire, orthographe, vocabulaire, paronymes, connecteurs et reformulation. Les règles du français ont presque toujours une logique : la comprendre évite d’apprendre des listes par cœur.',
    memo: [
      'Avoir : accord avec le <strong>COD placé avant</strong>, sinon invariable.',
      '<strong>Bien que</strong> + subjonctif ; <strong>après que</strong> + indicatif.',
      '<strong>Si + imparfait → conditionnel</strong>. Jamais « si j’aurais ».',
      'Pallier <em>quelque chose</em>, se rappeler <em>quelque chose</em>.',
    ],
    sections: [
      { t: 'Participe passé', html: `
<ul>
<li>Avec <strong>être</strong> : accord avec le sujet (elles sont parties).</li>
<li>Avec <strong>avoir</strong> : accord avec le COD <strong>s’il est placé avant</strong> (les lettres que j’ai envoyées), sinon invariable.</li>
<li>Pronominaux : accord avec le COD placé avant. « Elle s’est lavée » mais « elle s’est lavé les mains ». « Ils se sont parlé » (parler à → pas de COD).</li>
<li>Verbes impersonnels : invariable (les chaleurs qu’il a fait).</li>
<li>Avec « en » : invariable en règle générale (des pommes, j’en ai mangé).</li>
</ul>
<p class="lesson-why"><b>Pourquoi « COD placé avant »</b> Quand on écrit le participe, il faut savoir avec quoi l’accorder. Dans « les lettres que j’ai envoyées », on sait déjà qu’il s’agit des lettres. Dans « j’ai envoyé les lettres », le participe arrive avant le COD : on ne sait pas encore de quoi on parle, il reste invariable.</p>
<p class="lesson-why"><b>Pourquoi « lavée » mais « lavé les mains »</b> Pour trouver le COD, on pose la question « quoi ? ». Elle a lavé quoi ? <em>Se</em> (elle-même), placé avant : accord. Elle a lavé quoi ? <em>Les mains</em>, placé après : pas d’accord.</p>` },
      { t: 'Modes et temps', html: `
<ul>
<li>Subjonctif : <strong>bien que, quoique, pour que, avant que, à moins que, sans que</strong>.</li>
<li>Indicatif : <strong>après que, pendant que, parce que, alors que</strong>.</li>
<li>Si + imparfait → conditionnel (si j’avais, je viendrais). Jamais « si j’aurais ».</li>
</ul>
<p class="lesson-why"><b>Pourquoi cette différence</b> L’indicatif sert aux faits réels, le subjonctif à ce qui est envisagé, voulu ou pas encore arrivé. « Après qu’il est parti » : le départ a eu lieu, c’est un fait → indicatif. « Avant qu’il parte » : le départ n’a pas encore eu lieu → subjonctif.</p>
<p class="lesson-why"><b>Pourquoi pas « si j’aurais »</b> Le « si » pose déjà l’hypothèse. Le conditionnel exprime la conséquence de cette hypothèse : il va dans l’autre partie de la phrase (« si j’avais le temps, <em>je viendrais</em> »).</p>` },
      { t: 'Fautes fréquentes', html: `
<ul>
<li>Pallier <em>quelque chose</em> (pas « à »). Se rappeler <em>quelque chose</em> (pas « de »).</li>
<li>« Malgré que » → bien que. « Dont » remplace « de + nom » : ne pas ajouter « en » ou « de ».</li>
<li>Quel que soit / quelle que soit (en deux mots, accordé) ≠ quelque (adverbe ou déterminant).</li>
<li>Quant à (en ce qui concerne) ≠ quand (temps). Davantage (plus) ≠ d’avantage (d’un bénéfice).</li>
<li>« Au temps pour moi » (expression militaire) est la graphie recommandée.</li>
</ul>
<p class="lesson-why"><b>Pourquoi « dont » suffit</b> « Dont » contient déjà le « de ». « Le livre dont je t’ai parlé » = je t’ai parlé <em>de</em> ce livre. Écrire « dont je t’en ai parlé » revient à dire « de » deux fois.</p>
<p class="lesson-why"><b>Astuce pour se rappeler</b> On dit « je me souviens <em>de</em> quelque chose » mais « je me rappelle quelque chose » : se rappeler, c’est « rappeler à soi » une chose, directement.</p>` },
      { t: 'Paronymes', html: `
<p>Les paronymes se ressemblent mais n’ont pas le même sens. Le plus sûr est de rattacher chaque mot à un mot de sa famille.</p>
<table class="t">
<tr><td><strong>Acception</strong> : sens d’un mot</td><td><strong>Acceptation</strong> : fait d’accepter</td></tr>
<tr><td><strong>Inclination</strong> : penchant</td><td><strong>Inclinaison</strong> : pente</td></tr>
<tr><td><strong>Éruption</strong> : sortie brusque</td><td><strong>Irruption</strong> : entrée brusque</td></tr>
<tr><td><strong>Prolixe</strong> : trop bavard</td><td><strong>Prolifique</strong> : très productif</td></tr>
<tr><td><strong>Perpétrer</strong> : commettre</td><td><strong>Perpétuer</strong> : faire durer</td></tr>
<tr><td><strong>Conjecture</strong> : hypothèse</td><td><strong>Conjoncture</strong> : situation</td></tr>
<tr><td><strong>Effraction</strong> : bris de clôture</td><td><strong>Infraction</strong> : violation d’une loi</td></tr>
<tr><td><strong>Éminent</strong> : remarquable</td><td><strong>Imminent</strong> : sur le point d’arriver</td></tr>
</table>
<p class="lesson-why"><b>Le truc des familles</b> <em>Ér</em>uption vient du latin « sortir » (comme un volcan qui <em>sort</em> sa lave) ; <em>ir</em>ruption contient « in » (<em>entrer</em>). Perpé<em>tuer</em> est de la famille de « perpétuel » : faire durer.</p>` },
      { t: 'Connecteurs', html: `
<p>Choisir un connecteur, c’est choisir la relation logique entre deux idées. Avant de regarder les propositions, demandez-vous : la deuxième idée s’oppose-t-elle, découle-t-elle, explique-t-elle ou complète-t-elle la première ?</p>
<table class="t">
<tr><th>Rôle</th><th>Connecteurs</th></tr>
<tr><td>Opposition</td><td>pourtant, néanmoins, cependant, toutefois</td></tr>
<tr><td>Conséquence</td><td>donc, dès lors, aussi (en tête, avec inversion), par conséquent</td></tr>
<tr><td>Cause</td><td>car, en effet, puisque</td></tr>
<tr><td>Addition</td><td>de plus, en outre, par ailleurs</td></tr>
</table>` },
    ],
    quiz: [
      { q: 'Quelle phrase est correcte ?', c: ['Les lettres que j’ai envoyé sont arrivées.', 'Les lettres que j’ai envoyées sont arrivées.', 'Les lettres que j’ai envoyés sont arrivées.', 'J’ai envoyées les lettres.', 'Les lettres que j’ai envoyer sont arrivées.'], a: 1, why: 'Avec avoir, on accorde avec le COD placé avant : « que » reprend « les lettres » (féminin pluriel).' },
      { q: 'Bien qu’il ___ malade, il est venu.', c: ['est', 'soit', 'était', 'serait', 'sera'], a: 1, why: '« Bien que » est toujours suivi du subjonctif.' },
      { q: 'Le cambrioleur est entré par ___.', c: ['infraction', 'effraction', 'irruption', 'éruption', 'fraction'], a: 1, why: 'L’effraction est le bris d’une clôture ou d’une serrure ; l’infraction est une violation de la loi.' },
    ],
  },

  logique: {
    title: 'Logique',
    lead: 'Suites de nombres, de lettres, codages et règles cachées. Il n’y a pas de formule à appliquer : il faut tester des hypothèses dans un ordre efficace, et vérifier qu’une règle marche sur toutes les données.',
    memo: [
      'Testez dans l’ordre : <strong>écarts, rapports, suites entrelacées, carrés, Fibonacci</strong>.',
      'Lettres en rangs : <strong>A=1, E=5, J=10, O=15, T=20, Y=25</strong>.',
      'La règle doit marcher sur <strong>tous</strong> les termes.',
      'Rien après 1 minute : <strong>cochez et passez</strong>.',
    ],
    sections: [
      { t: 'Suites de nombres', html: `
<ol>
<li><strong>Écarts</strong> entre termes : constants (arithmétique) ? croissants (+1, +2, +3…) ?</li>
<li><strong>Rapports</strong> : ×2, ×3 (géométrique) ? ×2 + 1 ?</li>
<li><strong>Deux suites entrelacées</strong> (rangs pairs et impairs), surtout si la suite « monte et descend ».</li>
<li><strong>Carrés et cubes</strong> (± une constante) : 1, 4, 9, 16, 25… / 1, 8, 27, 64…</li>
<li><strong>Fibonacci</strong> : chaque terme = somme des deux précédents.</li>
</ol>
<p class="lesson-why"><b>Pourquoi cet ordre</b> Il va du plus fréquent et du plus rapide à tester vers le plus rare. Calculer des écarts prend 10 secondes et résout une grande partie des suites ; inutile de chercher des cubes avant.</p>
<p class="lesson-why"><b>Comment reconnaître ×2 ou +k</b> Une suite additive grandit régulièrement (5, 8, 11, 14). Une suite multiplicative grandit de plus en plus vite (3, 6, 12, 24) : les écarts eux-mêmes doublent.</p>
<div class="lesson-callout tip"><b>Exemple</b> 2, 6, 12, 20, 30 : écarts +4, +6, +8, +10 → le suivant est 30 + 12 = <strong>42</strong>.</div>` },
      { t: 'Suites de lettres', html: `
<ul>
<li>Convertissez en rangs : <strong>A=1, E=5, J=10, O=15, T=20, Y=25</strong>.</li>
<li>L’alphabet boucle : après Z vient A.</li>
<li>Rang « miroir » : A↔Z, B↔Y… la somme des deux rangs vaut 27.</li>
</ul>
<p class="lesson-why"><b>Pourquoi convertir</b> Une suite de lettres est presque toujours une suite de nombres déguisée. Une fois en rangs (B, E, H → 2, 5, 8), on applique la même méthode : ici +3. Les repères tous les 5 rangs évitent de réciter l’alphabet.</p>` },
      { t: 'Codages', html: `
<p>Comparez lettre par lettre le mot et son code : décalage constant ? inversion ? Vérifiez sur <strong>toutes</strong> les lettres.</p>
<ul>
<li>Décalage : CHAT → DIBU (+1 sur chaque lettre).</li>
<li>Inversion : l’ordre des lettres est retourné.</li>
<li>Lettres → chiffres : souvent le rang alphabétique ou la somme des rangs.</li>
</ul>
<p class="lesson-why"><b>Pourquoi tout vérifier</b> Plusieurs règles peuvent coller aux deux premières lettres. Les propositions fausses sont justement construites pour marcher sur une partie du mot seulement.</p>` },
      { t: 'Dominos et cartes', html: `
<ul>
<li>Les demi-dominos vont de 0 (blanc) à 6 : après 6, on revient à 0. Pensez <strong>modulo 7</strong>.</li>
<li>Étudiez séparément la moitié haute et la moitié basse : ce sont souvent deux suites indépendantes.</li>
<li>Cartes : la couleur et la valeur suivent chacune leur propre règle.</li>
</ul>
<p class="lesson-why"><b>Pourquoi « modulo 7 »</b> Il n’existe que 7 valeurs (0 à 6). Une suite +2 qui part de 5 donne 5, 0, 2, 4… : après 6, on repart à 0 comme les heures d’une horloge repartent à 1 après 12.</p>` },
      { t: 'Conseils', html: `
<ul>
<li>Écrivez les écarts sous la suite : la règle saute souvent aux yeux.</li>
<li>Vérifiez votre règle sur le premier <em>et</em> le dernier terme.</li>
<li>Si rien ne marche en 1 minute, cochez une réponse et passez.</li>
</ul>` },
    ],
    quiz: [
      { q: 'Quel nombre suit : 2, 6, 12, 20, 30, … ?', c: ['36', '40', '42', '44', '48'], a: 2, why: 'Écarts +4, +6, +8, +10, puis +12 : 30 + 12 = 42.' },
      { q: 'Quel nombre suit : 3, 4, 7, 11, 18, … ?', c: ['25', '27', '29', '31', '36'], a: 2, why: 'Chaque terme est la somme des deux précédents (Fibonacci) : 11 + 18 = 29.' },
      { q: 'Quelle lettre suit : B, E, H, K, … ?', c: ['L', 'M', 'N', 'O', 'P'], a: 2, why: 'Rangs 2, 5, 8, 11 : +3 à chaque fois, donc 14 = N.' },
    ],
  },
};
