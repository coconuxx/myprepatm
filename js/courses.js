// Cours détaillés (à lire, sans exercice) et fiches de révision (recto / verso) par leçon
// chapters : [{ t: titre, html }] · cards : [{ f: recto, b: verso }]
// Classes : .lesson-example (exemple commenté), .lesson-why, .lesson-callout
TM.COURSES = {
  intro: {
    chapters: [],
    cards: [
      { f: 'Combien de sous-tests, de questions et de temps ?', b: '6 sous-tests de 15 questions, 20 minutes chacun : 90 questions en 2 heures.' },
      { f: 'Sur combien est noté le TAGE MAGE ?', b: 'Sur 600.' },
      { f: 'Que vaut une mauvaise réponse ?', b: '0 point : il n’y a plus de points négatifs. On répond donc à toutes les questions.' },
      { f: 'Temps moyen par question ?', b: 'Environ 1 min 20 (20 minutes pour 15 questions).' },
      { f: 'Le temps restant d’un sous-test se reporte-t-il ?', b: 'Non. Chaque sous-test a son propre chronomètre.' },
      { f: 'Calculatrice autorisée ?', b: 'Non. Tout le calcul se fait à la main ou de tête.' },
      { f: 'Chances d’une réponse au hasard ? Après 2 éliminations ?', b: '1 sur 5 au hasard ; 1 sur 3 après avoir éliminé 2 propositions.' },
    ],
  },

  comprehension: {
    chapters: [
      { t: 'Lire un texte efficacement', html: `
<p>Au TAGE MAGE, on ne lit pas pour le plaisir ni pour tout retenir : on lit pour <strong>construire une carte du texte</strong>. Le but est de savoir, à la fin de la lecture, où se trouve chaque idée, pour pouvoir y revenir en quelques secondes.</p>
<h3>La structure type d’un texte argumentatif</h3>
<ul>
<li><strong>Introduction</strong> : présente le sujet et, souvent, la thèse de l’auteur ou celle qu’il va contester.</li>
<li><strong>Développement</strong> : un argument par paragraphe, en général, avec des exemples.</li>
<li><strong>Conclusion</strong> : reprend la thèse, parfois de façon plus nette qu’au début.</li>
</ul>
<h3>Une idée par paragraphe</h3>
<p>À la fin de chaque paragraphe, résumez-le mentalement en quelques mots (« coût de la mesure », « contre-exemple allemand »). Ces étiquettes forment votre carte : quand une question porte sur l’Allemagne, vous savez directement où relire.</p>
<div class="lesson-example"><b>Exemple</b>
<p>Paragraphe : « Longtemps, on a cru que le télétravail réduirait la productivité. Les études récentes montrent pourtant l’inverse dans les métiers de bureau, à condition que les équipes se voient au moins une fois par semaine. »</p>
<p>Étiquette : <em>télétravail productif (bureau), si rencontre hebdo</em>. Notez la condition : une question sur ce passage jouera presque sûrement dessus.</p></div>
<h3>Ce qui mérite votre attention</h3>
<ul>
<li>Les <strong>connecteurs</strong> (pourtant, donc, en revanche) : ils indiquent le sens du raisonnement.</li>
<li>Les <strong>restrictions</strong> (à condition que, sauf, seulement, dans certains cas).</li>
<li>Les <strong>sources</strong> : qui parle ? l’auteur, une étude, « certains » ?</li>
</ul>
<p class="lesson-why"><b>Pourquoi ne pas tout retenir</b> Votre mémoire de travail est limitée, et elle est déjà occupée par les questions. Retenir <em>où</em> sont les idées coûte beaucoup moins d’effort que de retenir leur contenu, et c’est tout ce dont vous avez besoin puisque vous pouvez relire.</p>` },
      { t: 'Analyser une question', html: `
<p>Beaucoup d’erreurs viennent d’une question mal lue, pas d’un texte mal compris. Avant de regarder les propositions, prenez trois secondes pour savoir exactement ce qu’on vous demande.</p>
<h3>Trois réflexes</h3>
<ol>
<li><strong>Le type de question</strong> : thèse, détail, sous-entendu, sens d’un mot, ton ? Chacun renvoie à un endroit différent du texte.</li>
<li><strong>Les mots-clés</strong> : quel personnage, quel chiffre, quelle période ? Ils vous indiquent le paragraphe à relire.</li>
<li><strong>Les pièges de formulation</strong> : « NE… PAS », « SAUF », « selon l’auteur », « on peut en déduire ».</li>
</ol>
<div class="lesson-example"><b>Exemple</b>
<p>Question : « Selon l’auteur, lequel de ces facteurs n’explique PAS la hausse des prix ? »</p>
<ul>
<li><em>Selon l’auteur</em> : les avis rapportés d’autres personnes ne comptent pas.</li>
<li><em>N’explique PAS</em> : quatre propositions sont des causes citées ; la bonne réponse est celle qui ne l’est pas.</li>
<li><em>Hausse des prix</em> : relire le paragraphe correspondant.</li>
</ul></div>
<h3>« On peut en déduire » : la question la plus piégeuse</h3>
<p>Elle demande ce qui découle <strong>nécessairement</strong> du texte. Une proposition simplement probable, ou qui va plus loin que le texte, est fausse.</p>
<p class="lesson-why"><b>Pourquoi être aussi strict</b> Si vous acceptez ce qui est « probable », plusieurs propositions deviennent défendables et la question n’a plus de réponse unique. Le concepteur, lui, a construit une seule réponse qui découle forcément du texte.</p>` },
      { t: 'Éliminer les mauvaises réponses', html: `
<p>Les quatre mauvaises propositions ne sont pas choisies au hasard : chacune correspond à un piège précis. Savoir nommer le piège permet d’éliminer vite et sans hésiter.</p>
<div class="lesson-example"><b>Exemple commenté</b>
<p>Texte : « Plusieurs villes européennes ont réduit la place de la voiture en centre-ville. Dans la plupart des cas, le commerce local n’a pas souffert, et certaines rues ont même vu leur fréquentation augmenter. »</p>
<p>Question : quelle affirmation est conforme au texte ?</p>
<ul>
<li>A. Réduire la voiture fait toujours augmenter le commerce. → <strong>Généralisation</strong> : le texte dit « certaines rues ».</li>
<li>B. Toutes les villes européennes ont réduit la voiture. → <strong>Généralisation</strong> : « plusieurs ».</li>
<li>C. Le commerce local n’a pas souffert dans la majorité des villes concernées. → <strong>Conforme</strong> : « dans la plupart des cas ».</li>
<li>D. Les piétons dépensent plus que les automobilistes. → <strong>Hors texte</strong> : peut-être vrai, mais jamais dit.</li>
<li>E. La baisse du commerce a poussé les villes à réduire la voiture. → <strong>Contresens</strong> : relation de cause inventée et inversée.</li>
</ul></div>
<h3>La méthode en deux temps</h3>
<ol>
<li>Barrez ce qui est clairement faux (hors texte, généralisation, contresens).</li>
<li>Entre les deux ou trois restantes, retournez au texte et comparez mot à mot.</li>
</ol>
<p class="lesson-why"><b>Pourquoi ça marche</b> Une bonne réponse est souvent une <em>reformulation</em> du texte, pas une copie. Elle peut donc paraître moins « familière » que les pièges, qui réutilisent les mots exacts du texte. Éliminer les pièges évite de se laisser attirer par les mots connus.</p>` },
    ],
    cards: [
      { f: 'Que lire en premier face à un texte ?', b: 'Les questions, en survol rapide, pour savoir quoi chercher.' },
      { f: 'Où se trouve en général la thèse ?', b: 'Dans l’introduction ou la conclusion.' },
      { f: 'Piège du « vrai mais hors texte » ?', b: 'Une proposition plausible ou vraie dans la réalité, mais que le texte ne dit pas. À écarter.' },
      { f: 'Le texte dit « certains », la réponse dit « tous » : quel piège ?', b: 'La généralisation.' },
      { f: '« Certains experts pensent que… » : est-ce l’avis de l’auteur ?', b: 'Non, c’est un avis rapporté. L’auteur peut être d’accord ou non.' },
      { f: 'Que signale « certes… mais » ?', b: 'Une concession : l’auteur reconnaît un point puis le dépasse. Son avis est après le « mais ».' },
      { f: 'Que demande « on peut en déduire » ?', b: 'Ce qui découle nécessairement du texte, pas ce qui est simplement probable.' },
      { f: 'Comment traiter les propositions ?', b: 'Éliminer d’abord les fausses, puis comparer les restantes mot à mot avec le texte.' },
    ],
  },

  calcul: {
    chapters: [
      { t: 'Les pourcentages de A à Z', html: `
<p>Tout pourcentage se ramène à une multiplication par un <strong>coefficient</strong>. Une fois ce réflexe acquis, les problèmes de soldes, de TVA ou d’évolutions deviennent des calculs simples.</p>
<h3>Le coefficient multiplicateur</h3>
<table class="t">
<tr><th>Évolution</th><th>Coefficient</th></tr>
<tr><td>+5 %</td><td>×1,05</td></tr>
<tr><td>+20 %</td><td>×1,2</td></tr>
<tr><td>+100 % (doubler)</td><td>×2</td></tr>
<tr><td>−10 %</td><td>×0,9</td></tr>
<tr><td>−25 %</td><td>×0,75</td></tr>
<tr><td>−50 % (moitié)</td><td>×0,5</td></tr>
</table>
<div class="lesson-example"><b>Exemple commenté : soldes successives</b>
<p>Un article à 200 € est soldé de 30 %, puis on applique 10 % de remise supplémentaire. Prix final ?</p>
<p>200 × 0,7 × 0,9 = 200 × 0,63 = <strong>126 €</strong>. La remise totale est de 37 %, pas de 40 % : la deuxième remise s’applique sur un prix déjà baissé.</p></div>
<h3>Revenir au point de départ</h3>
<p>Après une baisse de 20 % (×0,8), quelle hausse ramène au prix initial ? Il faut multiplier par 1 / 0,8 = 1,25, soit <strong>+25 %</strong>.</p>
<p class="lesson-why"><b>Pourquoi pas +20 %</b> La hausse se calcule sur le prix baissé, plus petit. Pour récupérer la même somme en euros sur une base plus petite, il faut un pourcentage plus grand.</p>
<div class="lesson-example"><b>Exemple commenté : la TVA</b>
<p>Un produit coûte 96 € TTC avec une TVA de 20 %. Prix HT ?</p>
<p>TTC = HT × 1,2, donc HT = 96 / 1,2 = <strong>80 €</strong>. Le piège serait 96 × 0,8 = 76,80 €.</p></div>
<h3>Points de pourcentage</h3>
<p>Un taux qui passe de 10 % à 12 % augmente de <strong>2 points</strong>, mais de <strong>20 %</strong> (2 / 10). Les deux formulations ne disent pas la même chose.</p>` },
      { t: 'Vitesses, distances et débits', html: `
<p>Tous ces problèmes reposent sur une seule relation : <strong>quantité = rythme × temps</strong>. Pour un trajet : distance = vitesse × temps. Pour un travail : travail fait = débit × temps.</p>
<h3>Bien gérer les unités</h3>
<ul>
<li>Convertissez toujours les minutes en heures : 20 min = 1/3 h ; 45 min = 0,75 h ; 1 h 12 = 1,2 h.</li>
<li>1 m/s = 3,6 km/h (multiplier par 3,6 pour passer en km/h).</li>
</ul>
<div class="lesson-example"><b>Exemple commenté : deux trains face à face</b>
<p>Deux villes sont à 300 km. Un train part de chaque ville au même moment, l’un à 80 km/h, l’autre à 120 km/h. Quand se croisent-ils ?</p>
<p>Ils se rapprochent de 80 + 120 = 200 km chaque heure. 300 / 200 = <strong>1,5 h</strong>, soit 1 h 30.</p></div>
<div class="lesson-example"><b>Exemple commenté : la poursuite</b>
<p>Un cycliste part à 20 km/h. Une heure plus tard, une voiture part du même point à 60 km/h. Quand le rattrape-t-elle ?</p>
<p>Le cycliste a 20 km d’avance. La voiture reprend 60 − 20 = 40 km par heure. 20 / 40 = <strong>0,5 h</strong> après son départ.</p></div>
<p class="lesson-why"><b>Pourquoi additionner ou soustraire</b> Ce qui compte, c’est la vitesse à laquelle l’écart entre les deux change. Face à face, chacun réduit l’écart : on additionne. Dans le même sens, seul l’excès de vitesse du plus rapide réduit l’écart : on soustrait.</p>
<h3>Travail en commun</h3>
<div class="lesson-example"><b>Exemple commenté</b>
<p>Anne peint une pièce en 4 h, Bruno en 12 h. Ensemble ?</p>
<p>Anne fait 1/4 de la pièce par heure, Bruno 1/12. Ensemble : 1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3 par heure. Il leur faut donc <strong>3 h</strong>. Vérification avec la formule : 4 × 12 / (4 + 12) = 48 / 16 = 3.</p></div>` },
      { t: 'Fractions, ratios et proportions', html: `
<p>Un ratio dit comment une quantité se partage. « Un ratio de 2 pour 3 » signifie : sur 5 parts, 2 vont d’un côté et 3 de l’autre.</p>
<div class="lesson-example"><b>Exemple commenté : partage proportionnel</b>
<p>On partage 120 € entre trois personnes dans le rapport 2 : 3 : 5.</p>
<p>Total des parts : 2 + 3 + 5 = 10. Une part vaut 120 / 10 = 12 €. Les trois reçoivent <strong>24 €, 36 € et 60 €</strong>.</p></div>
<h3>La règle de trois</h3>
<p>Si 3 cahiers coûtent 7,50 €, 8 cahiers coûtent 7,50 / 3 × 8 = 2,50 × 8 = <strong>20 €</strong>. On ramène à l’unité, puis on multiplie.</p>
<h3>Proportionnalité inverse</h3>
<p>Si 6 ouvriers mettent 10 jours, 4 ouvriers en mettent 6 × 10 / 4 = <strong>15 jours</strong>. Moins d’ouvriers, plus de temps : la quantité totale de travail (60 jours-ouvrier) reste la même.</p>
<p class="lesson-why"><b>Pourquoi raisonner en « jours-ouvrier »</b> Le chantier représente une quantité fixe de travail. Le calculer une fois (6 × 10 = 60) permet de répondre à toutes les variantes : 5 ouvriers → 12 jours, 12 ouvriers → 5 jours.</p>
<h3>Fractions utiles à connaître</h3>
<table class="t">
<tr><td>1/2 = 0,5</td><td>1/3 ≈ 0,333</td><td>1/4 = 0,25</td><td>1/5 = 0,2</td></tr>
<tr><td>1/6 ≈ 0,167</td><td>1/8 = 0,125</td><td>3/8 = 0,375</td><td>1/9 ≈ 0,111</td></tr>
</table>` },
      { t: 'Probabilités et dénombrement', html: `
<p>Une probabilité, c’est la part des cas qui vous intéressent parmi tous les cas possibles, à condition qu’ils soient tous également probables.</p>
<div class="lesson-example"><b>Exemple commenté : tirage sans remise</b>
<p>Une urne contient 3 boules rouges et 2 bleues. On tire 2 boules sans remise. Probabilité d’avoir 2 rouges ?</p>
<p>Premier tirage : 3 rouges sur 5, soit 3/5. Il reste alors 2 rouges sur 4 : 2/4. On multiplie : 3/5 × 2/4 = 6/20 = <strong>3/10</strong>.</p></div>
<div class="lesson-example"><b>Exemple commenté : « au moins un »</b>
<p>On lance deux dés. Probabilité d’obtenir au moins un 6 ?</p>
<p>Contraire : aucun 6, soit 5/6 × 5/6 = 25/36. Donc P = 1 − 25/36 = <strong>11/36</strong>.</p></div>
<h3>Dénombrer sans tout écrire</h3>
<ul>
<li><strong>Ranger n objets</strong> dans un ordre : n! (5 personnes sur 5 chaises : 5 × 4 × 3 × 2 × 1 = 120).</li>
<li><strong>Choisir 2 parmi n</strong> sans ordre : n(n − 1)/2. Exemple : 10 personnes qui se serrent toutes la main = 10 × 9 / 2 = <strong>45</strong> poignées de main.</li>
<li><strong>Choix successifs indépendants</strong> : on multiplie. 3 entrées × 4 plats = 12 menus.</li>
</ul>
<p class="lesson-why"><b>Pourquoi diviser par 2 pour les poignées de main</b> Chacune des 10 personnes serre 9 mains : 90. Mais la poignée de main entre Anne et Bruno a été comptée deux fois (une fois pour Anne, une fois pour Bruno). On divise donc par 2.</p>` },
    ],
    cards: [
      { f: 'Coefficient pour −15 % ?', b: '×0,85' },
      { f: '+10 % puis −10 % = ?', b: '×1,1 × 0,9 = ×0,99, soit −1 %.' },
      { f: 'Après −20 %, quelle hausse pour revenir au départ ?', b: '+25 % (1 / 0,8 = 1,25).' },
      { f: 'Prix HT d’un produit à 120 € TTC (TVA 20 %) ?', b: '120 / 1,2 = 100 €.' },
      { f: 'Vitesse moyenne aller-retour à v₁ et v₂ ?', b: '2·v₁·v₂ / (v₁ + v₂).' },
      { f: '1 m/s en km/h ?', b: '3,6 km/h.' },
      { f: 'Temps à deux si l’un met T₁ et l’autre T₂ ?', b: 'T₁·T₂ / (T₁ + T₂).' },
      { f: 'Triplets de Pythagore à connaître ?', b: '3-4-5, 5-12-13, 8-15-17 (et leurs multiples).' },
      { f: 'Longueurs ×k : aires et volumes ?', b: 'Aires ×k², volumes ×k³.' },
      { f: 'P(au moins un) = ?', b: '1 − P(aucun).' },
      { f: 'Nombre de poignées de main entre n personnes ?', b: 'n(n − 1)/2.' },
      { f: '49 × 51 de tête ?', b: '50² − 1² = 2499.' },
    ],
  },

  argumentation: {
    chapters: [
      { t: 'Décortiquer un argument', html: `
<p>Tout argument a la même anatomie : des <strong>prémisses</strong> (ce qui est avancé comme vrai) et une <strong>conclusion</strong> (ce qu’on veut démontrer). Entre les deux, il y a souvent une <strong>hypothèse implicite</strong> : un lien que l’auteur n’écrit pas mais dont il a besoin.</p>
<h3>Trouver la conclusion</h3>
<p>Elle est souvent annoncée par <em>donc, ainsi, par conséquent, il faut, on doit</em>. Si aucun mot ne la signale, demandez-vous : « qu’est-ce que l’auteur veut me faire croire ? »</p>
<div class="lesson-example"><b>Exemple commenté</b>
<p>« Les ventes en ligne de l’entreprise ont doublé depuis le lancement de l’application. L’application est donc la cause de ce succès. »</p>
<ul>
<li>Prémisse : les ventes ont doublé depuis le lancement.</li>
<li>Conclusion : l’application est la cause.</li>
<li>Hypothèse implicite : <em>rien d’autre n’a changé pendant cette période</em> (pas de baisse de prix, pas de concurrent disparu, pas de hausse générale du commerce en ligne).</li>
</ul>
<p>Test : niez l’hypothèse. « Une grande campagne de publicité a eu lieu en même temps. » Le raisonnement s’effondre : c’était bien l’hypothèse cachée.</p></div>
<p class="lesson-why"><b>Pourquoi chercher l’hypothèse implicite</b> C’est le point faible de presque tous les arguments du TAGE MAGE. Les questions « affaiblir », « renforcer », « hypothèse » et « faille » tournent toutes autour d’elle.</p>` },
      { t: 'Nécessaire ou suffisant ?', html: `
<p>Cette distinction est au cœur de nombreuses questions. Une condition <strong>suffisante</strong> garantit le résultat. Une condition <strong>nécessaire</strong> est indispensable, mais ne garantit rien seule.</p>
<div class="lesson-example"><b>Exemple</b>
<p>« Pour s’inscrire en master, il faut avoir une licence. »</p>
<ul>
<li>La licence est <strong>nécessaire</strong> : sans licence, pas d’inscription.</li>
<li>Elle n’est pas <strong>suffisante</strong> : avoir une licence ne garantit pas l’inscription (il y a une sélection).</li>
<li>En logique : « si inscrit, alors licence ». Contraposée : « pas de licence, donc pas inscrit ».</li>
</ul></div>
<h3>Traduire le français en « si… alors »</h3>
<table class="t">
<tr><th>Phrase</th><th>Traduction</th></tr>
<tr><td>Si A, B / A suffit pour B</td><td>Si A alors B</td></tr>
<tr><td>A seulement si B / Il faut B pour A</td><td>Si A alors B</td></tr>
<tr><td>A sauf si B / A à moins que B</td><td>Si non-B alors A</td></tr>
<tr><td>Aucun A n’est B</td><td>Si A alors non-B</td></tr>
</table>
<p class="lesson-why"><b>Pourquoi « A seulement si B » donne « si A alors B »</b> « Je sors seulement s’il fait beau » : chaque fois que je sors, c’est qu’il fait beau. Mais il peut faire beau sans que je sorte. Le beau temps est nécessaire à la sortie.</p>
<h3>Les négations à connaître</h3>
<ul>
<li>Non (tous les X sont Y) = au moins un X n’est pas Y.</li>
<li>Non (aucun X n’est Y) = au moins un X est Y.</li>
<li>Non (A et B) = non-A ou non-B.</li>
<li>Non (A ou B) = non-A et non-B.</li>
</ul>` },
      { t: 'Renforcer et affaiblir', html: `
<p>Pour renforcer ou affaiblir, ne cherchez pas à prouver ou à réfuter la conclusion directement. Visez le <strong>lien</strong> entre les prémisses et la conclusion.</p>
<div class="lesson-example"><b>Exemple commenté</b>
<p>« Une étude montre que les élèves qui prennent un petit-déjeuner ont de meilleures notes. Le petit-déjeuner améliore donc les résultats scolaires. »</p>
<p><strong>Pour affaiblir</strong> : montrer une autre explication. « Les élèves qui prennent un petit-déjeuner viennent plus souvent de familles qui suivent de près leur scolarité. » Le petit-déjeuner et les bonnes notes pourraient avoir la même cause : l’encadrement familial.</p>
<p><strong>Pour renforcer</strong> : écarter les autres explications. « À milieu familial égal, les élèves qui prennent un petit-déjeuner ont toujours de meilleures notes. »</p></div>
<h3>Les leviers classiques</h3>
<table class="t">
<tr><th>Affaiblir</th><th>Renforcer</th></tr>
<tr><td>Une autre cause possible</td><td>Les autres causes sont exclues</td></tr>
<tr><td>Causalité inverse</td><td>La cause précède bien l’effet</td></tr>
<tr><td>La cause sans l’effet</td><td>Un groupe témoin sans la cause n’a pas l’effet</td></tr>
<tr><td>Échantillon non représentatif</td><td>Échantillon large et varié</td></tr>
</table>
<p class="lesson-why"><b>Pourquoi les propositions « hors sujet » sont fausses</b> Une proposition peut être intéressante, même liée au thème, sans toucher au lien de cause à effet. « Le petit-déjeuner est important pour la santé » ne dit rien sur les notes : ni renforcement, ni affaiblissement.</p>` },
    ],
    cards: [
      { f: 'Si A alors B. Non-B. Conclusion ?', b: 'Non-A (contraposée). C’est valide.' },
      { f: 'Si A alors B. B. Peut-on conclure A ?', b: 'Non : affirmation du conséquent. B peut avoir d’autres causes.' },
      { f: 'Si A alors B. Non-A. Peut-on conclure non-B ?', b: 'Non : négation de l’antécédent.' },
      { f: 'Négation de « tous les X sont Y » ?', b: 'Au moins un X n’est pas Y.' },
      { f: 'Négation de « A et B » ?', b: 'Non-A ou non-B.' },
      { f: '« A seulement si B » s’écrit…', b: 'Si A alors B (B est nécessaire à A).' },
      { f: 'Comment tester une hypothèse implicite ?', b: 'La nier : si le raisonnement s’effondre, c’est bien elle.' },
      { f: 'Corrélation ≠ causalité : deux explications à chercher ?', b: 'Un troisième facteur commun, ou une causalité inverse.' },
      { f: 'Faux dilemme ?', b: 'Présenter seulement deux options alors qu’il en existe d’autres.' },
      { f: 'Ad hominem ?', b: 'Attaquer la personne plutôt que son argument.' },
    ],
  },

  cm: {
    chapters: [
      { t: 'Ce que « suffire » veut dire', html: `
<p>Une information <strong>suffit</strong> si elle permet de répondre à la question <strong>de façon certaine et unique</strong>. Ce n’est pas « on peut avancer », ni « dans la plupart des cas » : c’est « dans tous les cas, on connaît la réponse ».</p>
<h3>Questions « quelle est la valeur… ? »</h3>
<p>Suffisant = une seule valeur possible. Deux valeurs possibles (comme 4 et −4), c’est insuffisant.</p>
<h3>Questions « oui ou non ? »</h3>
<p>Suffisant = la réponse est toujours la même. « Toujours oui » suffit, <strong>« toujours non » suffit aussi</strong>. Insuffisant = parfois oui, parfois non.</p>
<div class="lesson-example"><b>Exemple commenté</b>
<p>n est un entier. n est-il divisible par 6 ? (1) n est impair.</p>
<p>Un nombre impair n’est jamais divisible par 2, donc jamais par 6. La réponse est « non », avec certitude : (1) <strong>suffit</strong>.</p></div>
<p class="lesson-why"><b>Pourquoi ce piège est si fréquent</b> On associe instinctivement « suffisant » à « la réponse est oui ». Or le sous-test ne demande jamais la réponse, seulement si on <em>peut</em> la donner. Un « non » certain est une réponse.</p>` },
      { t: 'La méthode des contre-exemples', html: `
<p>Pour prouver qu’une information est <strong>insuffisante</strong>, il suffit de trouver deux cas compatibles avec elle qui donnent deux réponses différentes.</p>
<h3>Les valeurs à essayer</h3>
<ul>
<li><strong>0 et 1</strong> : ils cassent beaucoup de règles (0 × n = 0, 1² = 1).</li>
<li><strong>Les négatifs</strong> : ils inversent les inégalités quand on multiplie, et leurs carrés sont positifs.</li>
<li><strong>Les fractions entre 0 et 1</strong> : leur carré est plus petit qu’elles (0,5² = 0,25).</li>
</ul>
<div class="lesson-example"><b>Exemple commenté</b>
<p>x est-il plus grand que y ? (1) x² &gt; y².</p>
<ul>
<li>x = 3, y = 1 : x² = 9 &gt; 1 et x &gt; y → oui.</li>
<li>x = −3, y = 1 : x² = 9 &gt; 1 mais x &lt; y → non.</li>
</ul>
<p>Deux réponses différentes : (1) est <strong>insuffisante</strong>.</p></div>
<div class="lesson-example"><b>Exemple commenté</b>
<p>x est-il supérieur à 1 ? (1) x² &gt; x.</p>
<ul>
<li>x = 2 : 4 &gt; 2, et x &gt; 1 → oui.</li>
<li>x = −1 : 1 &gt; −1, mais x &lt; 1 → non.</li>
</ul>
<p>Insuffisant. Si l’énoncé précisait « x &gt; 0 », alors x² &gt; x donnerait x &gt; 1 : suffisant.</p></div>
<p class="lesson-why"><b>Pourquoi tester des cas extrêmes</b> Nos intuitions sont construites sur des entiers positifs « normaux » (2, 3, 5). Les questions sont conçues pour que l’information semble suffire avec ces nombres-là et échoue avec un négatif ou une fraction.</p>` },
      { t: 'Équations et inconnues', html: `
<p>Règle de base : pour trouver la valeur de n inconnues, il faut en général <strong>n équations différentes</strong>. Mais cette règle a des exceptions importantes.</p>
<h3>Exception 1 : les équations qui disent la même chose</h3>
<p>x + y = 5 et 3x + 3y = 15 ne forment qu’<strong>une</strong> information : la deuxième est la première multipliée par 3.</p>
<h3>Exception 2 : on demande une combinaison</h3>
<p>Si la question est « que vaut x + y ? », l’équation 2x + 2y = 10 suffit seule, même si x et y restent inconnus séparément.</p>
<div class="lesson-example"><b>Exemple commenté</b>
<p>Un stylo et un cahier coûtent ensemble 5 €. Combien coûte le cahier ? (1) Le cahier coûte 3 € de plus que le stylo. (2) Deux stylos et deux cahiers coûtent 10 €.</p>
<ul>
<li>Énoncé : s + c = 5.</li>
<li>(1) : c = s + 3. Avec l’énoncé, 2s + 3 = 5, donc s = 1 et c = 4. <strong>Suffisant.</strong></li>
<li>(2) : 2s + 2c = 10, c’est l’énoncé multiplié par 2. Rien de nouveau. <strong>Insuffisant.</strong></li>
</ul>
<p>Réponse <strong>A</strong>. Remarquez que l’énoncé lui-même fournit une équation : il faut toujours la compter.</p></div>
<h3>Exception 3 : les équations non linéaires</h3>
<p>x² = 25 est une seule équation à une inconnue, mais donne deux valeurs (5 et −5). Une équation ne garantit donc pas une solution unique.</p>
<p class="lesson-why"><b>Pourquoi ne pas résoudre jusqu’au bout</b> Dès que vous voyez deux équations différentes à deux inconnues (linéaires), vous savez qu’il y a une solution unique. Faire le calcul n’apporte rien et coûte du temps.</p>` },
    ],
    cards: [
      { f: 'Réponse A ?', b: '(1) seule suffit, pas (2).' },
      { f: 'Réponse B ?', b: '(2) seule suffit, pas (1).' },
      { f: 'Réponse C ?', b: 'Les deux ensemble suffisent, aucune seule.' },
      { f: 'Réponse D ?', b: 'Chacune suffit seule.' },
      { f: 'Réponse E ?', b: 'Même ensemble, c’est insuffisant.' },
      { f: 'Question oui/non : « toujours non » suffit-il ?', b: 'Oui. On peut répondre avec certitude.' },
      { f: 'x² = 9 : combien de valeurs ?', b: 'Deux : 3 et −3.' },
      { f: 'x + y = 5 et 2x + 2y = 10 : combien d’informations ?', b: 'Une seule : elles sont proportionnelles.' },
      { f: 'Valeurs à tester pour un contre-exemple ?', b: '0, 1, des négatifs et des fractions entre 0 et 1.' },
      { f: 'En testant (2), que faire de (1) ?', b: 'L’oublier complètement.' },
    ],
  },

  expression: {
    chapters: [
      { t: 'Les accords pas à pas', html: `
<h3>Le participe passé avec avoir : la méthode</h3>
<ol>
<li>Trouvez le COD en posant la question « qui ? » ou « quoi ? » après le verbe.</li>
<li>Le COD est-il <strong>avant</strong> le verbe ? Accordez avec lui. Après, ou absent ? Invariable.</li>
</ol>
<div class="lesson-example"><b>Exemples commentés</b>
<ul>
<li>« Les fleurs que j’ai <strong>cueillies</strong>. » J’ai cueilli quoi ? <em>que</em> = les fleurs, placé avant → féminin pluriel.</li>
<li>« J’ai <strong>cueilli</strong> des fleurs. » COD après → invariable.</li>
<li>« Elles ont <strong>parlé</strong>. » Pas de COD → invariable.</li>
<li>« Je les ai <strong>vues</strong>. » <em>les</em> = elles, placé avant → accord.</li>
</ul></div>
<h3>Les verbes pronominaux</h3>
<p>On les traite comme avec avoir : on cherche le COD.</p>
<ul>
<li>« Elles se sont <strong>regardées</strong>. » Elles ont regardé qui ? <em>se</em> (elles-mêmes) → accord.</li>
<li>« Elles se sont <strong>téléphoné</strong>. » On téléphone <em>à</em> quelqu’un : <em>se</em> est COI → invariable.</li>
<li>« Elle s’est <strong>coupé</strong> le doigt. » Elle a coupé quoi ? le doigt, placé après → invariable.</li>
</ul>
<h3>Autres accords piégeux</h3>
<ul>
<li><strong>Demi</strong> : invariable devant le nom (une demi-heure), accordé en genre après (une heure et demie).</li>
<li><strong>Couleurs</strong> : un nom employé comme couleur reste invariable (des vestes marron, orange), sauf quelques-uns devenus de vrais adjectifs : rose, mauve, pourpre, fauve, écarlate. Une couleur composée est invariable (des yeux bleu clair).</li>
<li><strong>Même</strong> : adjectif accordé après un pronom (eux-mêmes), adverbe invariable au sens de « aussi » (même les enfants ont ri).</li>
</ul>
<p class="lesson-why"><b>Pourquoi « marron » ne prend pas de s</b> « Des vestes marron », c’est « des vestes couleur de marron ». Le mot reste un nom (le fruit), il ne s’accorde pas avec « vestes ». Rose et mauve sont devenus de vrais adjectifs avec l’usage, d’où l’exception.</p>` },
      { t: 'Choisir le bon mode', html: `
<p>Le mode d’un verbe dit comment on présente l’action : comme un fait (<strong>indicatif</strong>), comme une chose envisagée, voulue ou incertaine (<strong>subjonctif</strong>), ou comme la conséquence d’une hypothèse (<strong>conditionnel</strong>).</p>
<h3>Après les verbes</h3>
<table class="t">
<tr><th>Verbe</th><th>Mode</th><th>Exemple</th></tr>
<tr><td>Vouloir, souhaiter, exiger</td><td>Subjonctif</td><td>Je veux qu’il <strong>vienne</strong>.</td></tr>
<tr><td>Craindre, regretter, être content</td><td>Subjonctif</td><td>Je regrette qu’il <strong>soit</strong> parti.</td></tr>
<tr><td>Douter</td><td>Subjonctif</td><td>Je doute qu’il <strong>puisse</strong> venir.</td></tr>
<tr><td>Espérer</td><td>Indicatif</td><td>J’espère qu’il <strong>viendra</strong>.</td></tr>
<tr><td>Penser, croire (affirmatif)</td><td>Indicatif</td><td>Je pense qu’il <strong>viendra</strong>.</td></tr>
<tr><td>Penser, croire (négatif)</td><td>Subjonctif</td><td>Je ne pense pas qu’il <strong>vienne</strong>.</td></tr>
</table>
<p class="lesson-why"><b>Pourquoi « je pense » + indicatif mais « je ne pense pas » + subjonctif</b> Quand je pense qu’il viendra, je présente sa venue comme réelle à mes yeux : indicatif. Quand je ne le pense pas, sa venue devient douteuse : subjonctif.</p>
<p class="lesson-why"><b>Pourquoi « espérer » fait exception</b> On espère quelque chose qu’on envisage comme probable, presque comme un fait à venir. D’où l’indicatif, souvent au futur.</p>
<h3>Après les conjonctions</h3>
<ul>
<li>Subjonctif : bien que, quoique, pour que, afin que, avant que, à moins que, sans que, pourvu que.</li>
<li>Indicatif : après que, pendant que, parce que, alors que, puisque, tandis que.</li>
</ul>
<h3>Le système du « si »</h3>
<table class="t">
<tr><td>Si + présent</td><td>→ futur</td><td>S’il pleut, je resterai.</td></tr>
<tr><td>Si + imparfait</td><td>→ conditionnel présent</td><td>S’il pleuvait, je resterais.</td></tr>
<tr><td>Si + plus-que-parfait</td><td>→ conditionnel passé</td><td>S’il avait plu, je serais resté.</td></tr>
</table>` },
      { t: 'Vocabulaire et tournures', html: `
<h3>Les pléonasmes</h3>
<p>Un pléonasme répète une idée déjà contenue dans un mot. Au TAGE MAGE, la phrase avec pléonasme est fautive.</p>
<ul>
<li>Monter <s>en haut</s>, descendre <s>en bas</s>, sortir <s>dehors</s>.</li>
<li>Prévoir <s>à l’avance</s>, collaborer <s>ensemble</s>, <s>au jour d’</s>aujourd’hui.</li>
<li>Un <s>petit</s> détail ? Accepté dans l’usage ; mais « une panacée universelle » est un pléonasme (panacée = remède universel).</li>
</ul>
<p class="lesson-why"><b>Pourquoi c’est une faute</b> « Prévoir » contient déjà « pré- » (avant). Dire « à l’avance » n’ajoute rien. Le TAGE MAGE valorise l’expression la plus juste et la plus économe.</p>
<h3>Les homophones : le test de remplacement</h3>
<table class="t">
<tr><th>Hésitation</th><th>Test</th></tr>
<tr><td>a / à</td><td>Remplacer par « avait » : si ça marche, c’est « a ».</td></tr>
<tr><td>ou / où</td><td>Remplacer par « ou bien » : si ça marche, c’est « ou ».</td></tr>
<tr><td>ce / se</td><td>« se » est devant un verbe pronominal (il se lave) ; « ce » remplace « cela » ou accompagne un nom.</td></tr>
<tr><td>quel que / quelque</td><td>Suivi de « être » au subjonctif → quel que, accordé (quelle que soit la raison).</td></tr>
<tr><td>quand / quant</td><td>« quant » est toujours suivi de « à » ou « aux ».</td></tr>
</table>
<h3>Les constructions de verbes</h3>
<ul>
<li>Pallier un problème (et non « à un problème »).</li>
<li>Se rappeler quelque chose ; se souvenir de quelque chose.</li>
<li>Aller <em>chez</em> le médecin (personne), <em>à</em> la boulangerie (lieu).</li>
</ul>` },
    ],
    cards: [
      { f: 'Participe avec avoir : quand accorder ?', b: 'Avec le COD, seulement s’il est placé avant le verbe.' },
      { f: '« Elles se sont téléphoné » : pourquoi pas de « es » ?', b: 'On téléphone à quelqu’un : « se » est COI, pas COD.' },
      { f: 'Bien que + ?', b: 'Subjonctif (bien qu’il soit).' },
      { f: 'Après que + ?', b: 'Indicatif (après qu’il est parti).' },
      { f: 'Espérer que + ?', b: 'Indicatif (j’espère qu’il viendra).' },
      { f: 'Si + imparfait → ?', b: 'Conditionnel présent. Jamais « si j’aurais ».' },
      { f: 'Une demi-heure ou une demie-heure ?', b: 'Une demi-heure (invariable devant le nom) ; une heure et demie.' },
      { f: 'Des chaussures marron ou marrons ?', b: 'Marron, invariable (nom employé comme couleur).' },
      { f: 'Perpétrer / perpétuer ?', b: 'Perpétrer = commettre (un crime) ; perpétuer = faire durer.' },
      { f: 'Éminent / imminent ?', b: 'Éminent = remarquable ; imminent = sur le point d’arriver.' },
      { f: 'Pallier à un problème ?', b: 'Non : pallier un problème (construction directe).' },
      { f: 'a ou à : quel test ?', b: 'Remplacer par « avait ». Si la phrase marche, c’est « a ».' },
    ],
  },

  logique: {
    chapters: [
      { t: 'La méthode des écarts', html: `
<p>Face à une suite de nombres, le premier réflexe est d’écrire, sous chaque paire de termes, l’<strong>écart</strong> entre eux. Si les écarts ne forment pas une règle évidente, on recommence sur les écarts eux-mêmes.</p>
<div class="lesson-example"><b>Exemple commenté : écarts constants</b>
<p>4, 11, 18, 25, … → écarts +7, +7, +7. Suivant : <strong>32</strong>.</p></div>
<div class="lesson-example"><b>Exemple commenté : écarts de deuxième niveau</b>
<p>1, 3, 7, 13, 21, …</p>
<p>Écarts : +2, +4, +6, +8. Les écarts augmentent de 2. Prochain écart : +10. Suivant : <strong>31</strong>.</p></div>
<div class="lesson-example"><b>Exemple commenté : écarts multiplicatifs</b>
<p>2, 3, 5, 9, 17, …</p>
<p>Écarts : +1, +2, +4, +8. Ils doublent. Prochain : +16. Suivant : <strong>33</strong>.</p></div>
<p class="lesson-why"><b>Pourquoi les écarts d’abord</b> La grande majorité des suites du TAGE MAGE sont construites par addition ou à partir d’écarts qui suivent eux-mêmes une règle. C’est le test le plus rapide et celui qui résout le plus de cas.</p>
<h3>Quand les écarts ne donnent rien</h3>
<p>Si les écarts semblent aléatoires mais que la suite grandit vite, essayez les <strong>rapports</strong> : 3, 6, 12, 24 (×2) ; 2, 5, 11, 23 (×2 + 1).</p>` },
      { t: 'Suites entrelacées et alternées', html: `
<p>Quand une suite monte et descend sans logique apparente, c’est souvent qu’elle cache <strong>deux suites</strong> mêlées, ou <strong>deux opérations</strong> qui alternent.</p>
<div class="lesson-example"><b>Exemple commenté : deux suites mêlées</b>
<p>2, 10, 4, 8, 6, 6, …</p>
<p>Termes de rang impair : 2, 4, 6 (+2). Termes de rang pair : 10, 8, 6 (−2). Le prochain terme est de rang impair : <strong>8</strong>.</p></div>
<div class="lesson-example"><b>Exemple commenté : opérations alternées</b>
<p>3, 6, 4, 8, 6, 12, …</p>
<p>×2, −2, ×2, −2, ×2. Prochaine opération : −2. Suivant : <strong>10</strong>.</p></div>
<p class="lesson-why"><b>Comment les reconnaître</b> Une suite « en dents de scie » (qui monte puis descend) n’a presque jamais une règle unique. Séparer les rangs pairs et impairs est alors le test le plus efficace.</p>
<h3>Les suites remarquables</h3>
<table class="t">
<tr><td>Carrés</td><td>1, 4, 9, 16, 25, 36, 49…</td></tr>
<tr><td>Cubes</td><td>1, 8, 27, 64, 125…</td></tr>
<tr><td>Nombres premiers</td><td>2, 3, 5, 7, 11, 13, 17, 19, 23…</td></tr>
<tr><td>Fibonacci</td><td>1, 1, 2, 3, 5, 8, 13, 21…</td></tr>
</table>
<p>Une suite comme 2, 5, 10, 17, 26 est faite de carrés + 1 (1+1, 4+1, 9+1…) : reconnaître les carrés fait gagner beaucoup de temps.</p>` },
      { t: 'Lettres, codages et dominos', html: `
<h3>Lettres : passer aux nombres</h3>
<p>Retenez les repères <strong>A=1, E=5, J=10, O=15, T=20, Y=25</strong>. Toute lettre est à au plus 2 rangs d’un repère.</p>
<div class="lesson-example"><b>Exemple commenté</b>
<p>C, F, J, O, …</p>
<p>Rangs : 3, 6, 10, 15. Écarts : +3, +4, +5. Prochain : +6, soit 21 = <strong>U</strong>.</p></div>
<h3>Codages : comparer lettre à lettre</h3>
<div class="lesson-example"><b>Exemple commenté</b>
<p>CHIEN se code DJLIS. Comment se code LOUP ?</p>
<p>C→D (+1), H→J (+2), I→L (+3), E→I (+4), N→S (+5) : le décalage augmente de 1 à chaque lettre.</p>
<p>LOUP : L+1 = M, O+2 = Q, U+3 = X, P+4 = T → <strong>MQXT</strong>.</p></div>
<p class="lesson-why"><b>Pourquoi vérifier toutes les lettres</b> Si vous vous arrêtez aux deux premières (+1, +2), vous pourriez croire à un décalage « +1 puis +2 » qui se répète. Seule la vérification complète révèle la vraie règle.</p>
<h3>Dominos : penser en cercle</h3>
<p>Les demi-dominos vont de 0 (blanc) à 6. Après 6, on revient à 0 : c’est un calcul « modulo 7 ».</p>
<div class="lesson-example"><b>Exemple commenté</b>
<p>Moitiés du haut : 1, 3, 5, 0, … Écart +2 : 5 + 2 = 7, qui devient 0. Suivant : 0 + 2 = <strong>2</strong>.</p></div>
<p>Étudiez toujours la moitié haute et la moitié basse séparément : elles suivent souvent deux règles différentes.</p>` },
    ],
    cards: [
      { f: 'Ordre des tests sur une suite ?', b: 'Écarts, rapports, suites entrelacées, carrés/cubes, Fibonacci.' },
      { f: 'Rangs repères de l’alphabet ?', b: 'A=1, E=5, J=10, O=15, T=20, Y=25.' },
      { f: 'Rang « miroir » d’une lettre ?', b: '27 − rang (A↔Z, B↔Y).' },
      { f: 'Suite en dents de scie : premier réflexe ?', b: 'Séparer les termes de rang pair et impair.' },
      { f: '1, 3, 7, 13, 21, … ?', b: '31 (écarts +2, +4, +6, +8, +10).' },
      { f: 'Suite de Fibonacci ?', b: 'Chaque terme = somme des deux précédents : 1, 1, 2, 3, 5, 8, 13…' },
      { f: 'Cubes de 1 à 5 ?', b: '1, 8, 27, 64, 125.' },
      { f: 'Valeurs d’un demi-domino ?', b: 'De 0 (blanc) à 6. Après 6, on revient à 0 (modulo 7).' },
      { f: 'Combien de temps bloquer sur une suite ?', b: 'Au plus 1 minute, puis cocher et passer.' },
    ],
  },
};
