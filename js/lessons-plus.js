// Compléments des leçons (chargé après js/lessons.js et js/courses.js) :
//  1. parties manquantes, insérées à leur place dans TM.LESSONS[k].sections ;
//  2. un « exemple guidé » par partie : { text?, q, c: [5 choix], a: indice de la bonne réponse, steps: [étapes], trap? } ;
//  3. questions de quiz supplémentaires (même format que lessons.js : { q, c, a, why }) ;
//  4. fiches de révision réécrites en questions complètes (remplacent celles de js/courses.js).
// Les exemples sont rangés par titre de partie : l'ordre des parties peut changer sans rien casser.
(function () {
  const L = TM.LESSONS;
  if (!L) return;
  const addSection = (k, afterTitle, sec) => {
    const a = L[k] && L[k].sections; if (!a || a.some((s) => s.t === sec.t)) return;
    const i = a.findIndex((s) => s.t === afterTitle);
    a.splice(i < 0 ? a.length : i + 1, 0, sec);
  };

  // ---------- 1. Parties manquantes ----------
  addSection('calcul', 'Calcul mental', { t: 'Fractions et proportions', html: `
<p>Les fractions reviennent partout au TAGE MAGE : parts d’un budget, mélanges, partages. Trois réflexes suffisent dans la plupart des cas.</p>
<ul>
<li><strong>Additionner</strong> : on met au même dénominateur. 1/3 + 1/4 = 4/12 + 3/12 = 7/12.</li>
<li><strong>« Une fraction du reste »</strong> : on calcule d’abord le reste, puis la fraction de ce reste. 1/4 du reste après 1/3, c’est 1/4 × 2/3 = 1/6 du total.</li>
<li><strong>Un partage dans le rapport a : b</strong> : on compte a + b parts. 60 € partagés dans le rapport 2 : 3 → 5 parts de 12 €, soit 24 € et 36 €.</li>
<li><strong>Produit en croix</strong> : si 3 kg coûtent 7,50 €, 5 kg coûtent 7,50 × 5 / 3 = 12,50 €.</li>
</ul>
<p class="lesson-why"><b>Pourquoi « du reste » change tout</b> 1/3 puis 1/4 « du reste » ne fait pas 1/3 + 1/4 du total : la deuxième part se calcule sur une somme déjà diminuée. C’est l’erreur la plus fréquente sur ces questions.</p>
<div class="lesson-callout tip"><b>Astuce</b> Choisissez un total pratique, multiple de tous les dénominateurs (12 pour des tiers et des quarts), et raisonnez en nombres entiers.</div>` });

  addSection('argumentation', 'Logique des propositions', { t: 'Tous, certains, aucun', html: `
<p>Beaucoup de questions jouent sur les mots <strong>tous</strong>, <strong>certains</strong> et <strong>aucun</strong>. Il faut savoir exactement ce qu’ils disent, et surtout ce qu’ils ne disent pas.</p>
<table class="t">
<tr><th>Phrase</th><th>Sa négation</th></tr>
<tr><td>Tous les A sont B</td><td>Au moins un A n’est pas B</td></tr>
<tr><td>Aucun A n’est B</td><td>Au moins un A est B</td></tr>
<tr><td>Certains A sont B</td><td>Aucun A n’est B</td></tr>
</table>
<ul>
<li>« Certains A sont B » ne dit <strong>rien</strong> des autres A : peut-être que tous le sont.</li>
<li>« Tous les A sont B » ne permet <strong>pas</strong> de dire « tous les B sont A » (tous les chats sont des animaux, pas l’inverse).</li>
<li>« Aucun A n’est B » se retourne sans problème : aucun B n’est A.</li>
</ul>
<p class="lesson-why"><b>Pourquoi la négation de « tous » n’est pas « aucun »</b> Pour contredire « tous les candidats ont réussi », un seul échec suffit. « Aucun n’a réussi » va beaucoup plus loin que ce qu’il faut.</p>` });

  addSection('logique', 'Dominos et cartes', { t: 'Heures et calendriers', html: `
<p>Ces questions se règlent en enlevant les cycles complets : <strong>7 jours</strong> pour la semaine, <strong>24 heures</strong> pour la journée, <strong>60 minutes</strong> pour l’heure.</p>
<ul>
<li><strong>Jours</strong> : on ne garde que le reste de la division par 7. Dans 100 jours : 100 = 14 × 7 + 2, donc 2 jours plus loin.</li>
<li><strong>Heures</strong> : 15 h + 50 h = 15 h + 48 h + 2 h, soit 17 h, deux jours plus tard.</li>
<li><strong>Minutes</strong> : 22 h 40 + 5 h 35 = 27 h 75 = 28 h 15, soit 4 h 15 le lendemain.</li>
</ul>
<p class="lesson-why"><b>Pourquoi le reste suffit</b> Après 7 jours, on retombe sur le même jour de la semaine : seules les journées en plus d’un nombre entier de semaines font avancer le calendrier.</p>
<div class="lesson-callout tip"><b>Attention</b> Comptez bien à partir du lendemain : « dans 1 jour », un lundi, c’est mardi.</div>` });

  // ---------- 2. Exemples guidés ----------
  const CM = ['(1) seule suffit', '(2) seule suffit', 'Les deux ensemble', 'Chacune seule', 'Même ensemble, non'];
  const EX = {
    comprehension: {
      'Méthode': {
        text: 'Longtemps considéré comme un simple loisir, le jeu vidéo est aujourd’hui étudié par les neurosciences. Plusieurs travaux montrent qu’il améliore l’attention visuelle. Ils ne prouvent pas, en revanche, qu’il rende plus intelligent en général.',
        q: 'Selon le texte, les études sur le jeu vidéo…',
        c: ['montrent qu’il rend plus intelligent', 'montrent qu’il améliore l’attention visuelle', 'prouvent qu’il n’est qu’un loisir', 'n’ont encore rien montré', 'déconseillent d’y jouer'], a: 1,
        steps: ['Lis la question d’abord : on cherche ce que les études « montrent ».', 'Retrouve la phrase exacte : « Plusieurs travaux montrent qu’il améliore l’attention visuelle. »', 'Vérifie les autres réponses : la A contredit la dernière phrase, la D est trop forte, la E n’est pas dans le texte.'],
        trap: 'La A est tentante parce qu’elle parle d’intelligence, mais le texte dit justement le contraire.',
      },
      'Types de questions': {
        text: 'On reproche souvent aux réseaux sociaux d’isoler les adolescents. Pourtant, pour beaucoup d’entre eux, ils prolongent des amitiés nouées au lycée. Le vrai risque n’est donc pas l’isolement, mais le sommeil sacrifié.',
        q: 'Quelle est la thèse de l’auteur ?',
        c: ['Les réseaux sociaux isolent les adolescents', 'Les adolescents se font peu d’amis au lycée', 'Le principal danger des réseaux sociaux est la perte de sommeil', 'Il faut interdire les réseaux sociaux aux adolescents', 'Les réseaux sociaux ne présentent aucun risque'], a: 2,
        steps: ['« Pourtant » montre que l’auteur conteste l’idée de départ.', '« Donc » annonce sa conclusion : c’est là que se trouve la thèse.', 'La thèse : le vrai risque est le sommeil sacrifié.'],
        trap: 'La A est l’idée reçue que l’auteur réfute. La E est trop forte : il cite bien un risque.',
      },
      'Lire les connecteurs': {
        text: 'La voiture électrique n’émet aucun gaz à l’usage. Néanmoins, la fabrication de sa batterie reste très polluante.',
        q: 'Quel rapport « néanmoins » établit-il entre les deux phrases ?',
        c: ['Une conséquence', 'Une opposition', 'Un ajout', 'Un exemple', 'Une cause'], a: 1,
        steps: ['Remplace le connecteur par « pourtant » : le sens ne change pas.', 'La 2e phrase limite l’avantage cité dans la 1re : c’est une opposition (une concession).'],
        trap: 'Ne confonds pas avec « donc » : la pollution de la batterie n’est pas une conséquence de l’absence de gaz.',
      },
      'Les pièges classiques': {
        text: 'Pour réduire le gaspillage alimentaire, l’auteur propose de mieux lire les dates de péremption, de cuisiner les restes et d’acheter de plus petites quantités.',
        q: 'Laquelle de ces solutions n’est PAS proposée par l’auteur ?',
        c: ['Mieux lire les dates de péremption', 'Cuisiner les restes', 'Acheter de plus petites quantités', 'Composter les épluchures', 'Aucune : toutes sont proposées'], a: 3,
        steps: ['Lis la question deux fois : on cherche ce qui est ABSENT du texte.', 'Coche dans le texte chaque solution trouvée : les dates, les restes, les petites quantités.', 'Il reste le compost : il n’apparaît nulle part.'],
        trap: 'Le compost est une bonne idée et paraît logique, mais seul le texte compte.',
      },
    },
    calcul: {
      'Pourcentages': {
        q: 'Un prix augmente de 25 %, puis baisse de 20 %. Quelle est l’évolution globale ?',
        c: ['+5 %', '+0,5 %', '−5 %', '0 %', '+45 %'], a: 3,
        steps: ['Traduis chaque variation en coefficient : +25 % → × 1,25 ; −20 % → × 0,8.', 'Multiplie les coefficients : 1,25 × 0,8 = 1.', 'Un coefficient de 1, c’est 0 % : le prix revient exactement au départ.'],
        trap: 'Faire 25 − 20 = +5 %. Les pourcentages successifs ne s’additionnent pas.',
      },
      'Calcul mental': {
        q: 'Combien font 48 × 25 ?',
        c: ['1 100', '1 200', '1 250', '960', '1 150'], a: 1,
        steps: ['Multiplier par 25, c’est multiplier par 100 puis diviser par 4.', '48 × 100 = 4 800.', '4 800 ÷ 4 = 1 200.'],
        trap: 'Poser 48 × 20 + 48 × 5 marche aussi, mais prend plus de temps et multiplie les risques d’erreur.',
      },
      'Fractions et proportions': {
        q: 'Paul dépense 1/3 de son salaire pour le loyer, puis 1/4 du reste pour les courses. Quelle part de son salaire lui reste-t-il ?',
        c: ['5/12', '1/2', '7/12', '1/3', '2/3'], a: 1,
        steps: ['Après le loyer, il reste 2/3 du salaire.', 'Les courses : 1/4 de ce reste, soit 1/4 × 2/3 = 1/6 du salaire.', 'Il reste 2/3 − 1/6 = 4/6 − 1/6 = 3/6 = 1/2.'],
        trap: 'Calculer 1 − 1/3 − 1/4 = 5/12 : le quart porte sur le reste, pas sur le salaire entier.',
      },
      'Vitesses et débits': {
        q: 'Un cycliste fait l’aller à 60 km/h et le retour, sur le même trajet, à 40 km/h. Quelle est sa vitesse moyenne ?',
        c: ['50 km/h', '48 km/h', '45 km/h', '52 km/h', '100 km/h'], a: 1,
        steps: ['Choisis une distance pratique : 120 km (multiple de 60 et de 40).', 'Aller : 120 / 60 = 2 h. Retour : 120 / 40 = 3 h.', 'Vitesse moyenne = distance totale / temps total = 240 / 5 = 48 km/h.'],
        trap: 'Faire la moyenne des deux vitesses (50 km/h) : on passe plus de temps à la vitesse la plus lente.',
      },
      'Moyennes et équations': {
        q: 'La moyenne de 4 notes est 12. Avec une 5e note, la moyenne passe à 13. Quelle est cette 5e note ?',
        c: ['13', '14', '15', '16', '17'], a: 4,
        steps: ['Raisonne sur les totaux : 4 notes de moyenne 12 font 48 points.', '5 notes de moyenne 13 font 65 points.', 'La 5e note vaut 65 − 48 = 17.'],
        trap: 'Croire qu’une note de 13 ou 14 suffit : pour remonter la moyenne d’un point sur 5 notes, il faut 5 points de plus que 12.',
      },
      'Géométrie': {
        q: 'La diagonale d’un carré mesure 6 cm. Quelle est son aire ?',
        c: ['36 cm²', '18 cm²', '24 cm²', '12 cm²', '9 cm²'], a: 1,
        steps: ['Pythagore : côté² + côté² = diagonale², donc 2 × côté² = 36.', 'côté² = 18.', 'L’aire du carré, c’est côté² : 18 cm².'],
        trap: '36 cm² est l’aire du carré dont le côté (et non la diagonale) mesure 6 cm.',
      },
      'Probabilités': {
        q: 'Une urne contient 3 boules rouges et 2 bleues. On tire 2 boules sans remise. Quelle est la probabilité d’avoir 2 rouges ?',
        c: ['9/25', '3/10', '2/5', '3/5', '6/25'], a: 1,
        steps: ['1er tirage : 3 rouges sur 5 boules, soit 3/5.', '2e tirage, sans remise : il reste 2 rouges sur 4 boules, soit 2/4.', 'On multiplie : 3/5 × 2/4 = 6/20 = 3/10.'],
        trap: '9/25 correspond à un tirage AVEC remise (3/5 × 3/5).',
      },
    },
    argumentation: {
      'Logique des propositions': {
        q: '« S’il pleut, le match est annulé. » Le match n’est pas annulé. Que peut-on conclure ?',
        c: ['Il pleut', 'Il ne pleut pas', 'Le match se joue sous la pluie', 'On ne peut rien conclure', 'Il pleuvra demain'], a: 1,
        steps: ['La règle : pluie ⇒ annulation.', 'Sa contraposée est toujours vraie : pas d’annulation ⇒ pas de pluie.', 'Le match n’est pas annulé, donc il ne pleut pas.'],
        trap: 'À l’inverse, si le match était annulé, on ne pourrait rien conclure : il peut être annulé pour une autre raison.',
      },
      'Tous, certains, aucun': {
        q: 'Quelle est la négation de « Tous les candidats ont réussi » ?',
        c: ['Aucun candidat n’a réussi', 'Tous les candidats ont échoué', 'Au moins un candidat n’a pas réussi', 'Certains candidats ont réussi', 'La plupart des candidats ont échoué'], a: 2,
        steps: ['Pour contredire « tous », il suffit d’un contre-exemple.', 'Un seul candidat qui échoue rend la phrase fausse.', 'La négation est donc : au moins un candidat n’a pas réussi.'],
        trap: '« Aucun n’a réussi » est bien plus fort que la négation : c’est le contraire extrême.',
      },
      'Les sophismes': {
        q: '« Mon grand-père a fumé toute sa vie et a vécu jusqu’à 95 ans : le tabac n’est donc pas dangereux. » Quelle est la faiblesse de ce raisonnement ?',
        c: ['Une généralisation à partir d’un seul cas', 'Une attaque contre la personne', 'Un appel à l’autorité', 'Un faux dilemme', 'Un raisonnement circulaire'], a: 0,
        steps: ['Repère la preuve avancée : un seul exemple, le grand-père.', 'Repère la conclusion : une règle générale sur le tabac.', 'Passer d’un cas unique à une règle générale, c’est une généralisation hâtive.'],
        trap: 'Le cas cité est peut-être vrai : c’est le passage à la règle générale qui est fautif.',
      },
      'Renforcer, affaiblir': {
        q: '« Les élèves qui prennent des cours particuliers ont de meilleures notes ; les cours particuliers améliorent donc les résultats. » Quelle information affaiblit le plus ce raisonnement ?',
        c: ['Les cours particuliers coûtent cher', 'Ces élèves viennent souvent de familles qui suivent déjà de près leur scolarité', 'Certains professeurs particuliers sont étudiants', 'Les cours durent une heure en moyenne', 'Les élèves apprécient leurs professeurs'], a: 1,
        steps: ['Le raisonnement passe d’un lien (cours ↔ bonnes notes) à une cause (les cours font les notes).', 'Pour l’affaiblir, cherche une autre cause qui expliquerait les bonnes notes.', 'La B en donne une : le suivi familial, présent avant les cours.'],
        trap: 'La A est une critique des cours, mais elle ne dit rien de leur effet sur les notes.',
      },
    },
    cm: {
      'Les 5 réponses': {
        q: 'Combien coûte un stylo ? (1) Trois stylos coûtent 4,50 €. (2) Un stylo et une gomme coûtent 2 € ensemble.',
        c: CM, a: 0,
        steps: ['(1) seule : 4,50 / 3 = 1,50 € → suffit.', '(2) seule : deux prix inconnus pour une seule somme → ne suffit pas.', 'Seule (1) suffit : réponse A.'],
        trap: 'Combiner les deux alors que (1) suffit déjà : on ne combine que si aucune ne suffit seule.',
      },
      'L’arbre de décision': {
        q: 'x est un nombre entier. x est-il pair ? (1) 3x est pair. (2) x + 2 est pair.',
        c: CM, a: 3,
        steps: ['(1) seule : 3 est impair, donc si 3x est pair, x est pair → suffit.', '(2) seule, en oubliant (1) : si x + 2 est pair, x est pair → suffit.', 'Chacune suffit seule : réponse D.'],
        trap: 'S’arrêter dès que (1) suffit et répondre A sans tester (2).',
      },
      'Exemple corrigé': {
        q: 'Quel âge a Léa ? (1) Dans 4 ans, elle aura le double de l’âge qu’elle avait il y a 4 ans. (2) Son frère a 3 ans de plus qu’elle.',
        c: CM, a: 0,
        steps: ['(1) seule : L + 4 = 2 × (L − 4), donc L + 4 = 2L − 8, soit L = 12 → suffit.', '(2) seule : on connaît un écart, pas un âge → ne suffit pas.', 'Réponse A.'],
        trap: 'Inutile de finir le calcul : dès que l’équation n’a qu’une solution, on sait que (1) suffit.',
      },
      'Les pièges': {
        q: 'Quelle est la valeur de x + y ? (1) 2x + 2y = 14. (2) x − y = 1.',
        c: CM, a: 0,
        steps: ['On demande x + y, pas x et y séparément.', '(1) seule : en divisant par 2, x + y = 7 → suffit.', '(2) seule ne donne pas la somme → réponse A.'],
        trap: 'Croire qu’il faut deux équations : c’est vrai pour trouver x ET y, pas pour une combinaison comme x + y.',
      },
    },
    expression: {
      'Participe passé': {
        q: '« Les lettres que j’ai ___ hier sont arrivées. »',
        c: ['écrit', 'écrits', 'écrite', 'écrites', 'écrire'], a: 3,
        steps: ['Le verbe est conjugué avec avoir : on cherche le COD (j’ai écrit quoi ?).', 'Le COD est « que », qui reprend « les lettres » (féminin pluriel).', 'Il est placé AVANT le verbe : on accorde → écrites.'],
        trap: 'Avec avoir, on n’accorde jamais avec le sujet. Ici l’accord vient du COD placé avant.',
      },
      'Modes et temps': {
        q: '« Bien qu’il ___ fatigué, il a terminé la course. »',
        c: ['est', 'était', 'soit', 'serait', 'sera'], a: 2,
        steps: ['Repère la conjonction : « bien que ».', '« Bien que » est toujours suivi du subjonctif.', 'Subjonctif présent du verbe être : qu’il soit.'],
        trap: '« Était » sonne naturel à l’oral, mais l’indicatif est fautif après « bien que ».',
      },
      'Fautes fréquentes': {
        q: 'Quelle phrase est correcte ?',
        c: ['Il faut pallier à ce problème.', 'Je me rappelle de cette soirée.', 'Il faut pallier ce problème.', 'Malgré qu’il pleuve, il sort.', 'Au jour d’aujourd’hui, tout change.'], a: 2,
        steps: ['« Pallier » se construit sans « à » : on pallie quelque chose.', '« Se rappeler » aussi : on se rappelle quelque chose.', '« Malgré que » et « au jour d’aujourd’hui » sont fautifs : seule la C est correcte.'],
        trap: 'La A est la faute la plus répandue : on dit « remédier à », mais « pallier » sans préposition.',
      },
      'Paronymes': {
        q: '« Une réforme ___ : elle entrera en vigueur dès demain. »',
        c: ['éminente', 'imminente', 'immanente', 'émérite', 'immédiatement'], a: 1,
        steps: ['Le contexte : la réforme arrive très bientôt (« dès demain »).', '« Imminent » = qui va se produire très prochainement.', '« Éminent » veut dire remarquable : rien à voir.'],
        trap: 'Éminent / imminent : un seul son de différence, deux sens sans rapport.',
      },
      'Connecteurs': {
        q: '« Il a beaucoup révisé ; ___, il a échoué. »',
        c: ['donc', 'pourtant', 'de plus', 'ainsi', 'car'], a: 1,
        steps: ['Relation entre les deux idées : on attendait une réussite, il y a un échec.', 'C’est une opposition entre un fait et un résultat inattendu.', 'Le connecteur d’opposition : « pourtant ».'],
        trap: '« Donc » et « ainsi » annoncent une conséquence logique : ici, le résultat contredit ce qu’on attendait.',
      },
    },
    logique: {
      'Suites de nombres': {
        q: 'Quel nombre complète la suite : 3, 5, 9, 17, 33, … ?',
        c: ['49', '57', '63', '65', '66'], a: 3,
        steps: ['Écris les écarts : +2, +4, +8, +16.', 'Les écarts doublent : le suivant est +32.', '33 + 32 = 65.'],
        trap: 'Chercher une règle compliquée sur les nombres eux-mêmes : les écarts révèlent la règle en quelques secondes.',
      },
      'Suites de lettres': {
        q: 'Quelle lettre complète la suite : B, E, H, K, … ?',
        c: ['L', 'M', 'N', 'O', 'P'], a: 2,
        steps: ['Convertis en rangs : B = 2, E = 5, H = 8, K = 11.', 'On ajoute 3 à chaque fois : le suivant est 14.', 'La 14e lettre est N.'],
        trap: 'Compter sur les doigts : apprends les repères E = 5, J = 10, O = 15, T = 20.',
      },
      'Codages': {
        q: 'Si CHAT s’écrit DIBU, comment s’écrit LOUP ?',
        c: ['MPVQ', 'KNTO', 'MPUQ', 'NPVQ', 'MOVQ'], a: 0,
        steps: ['Compare lettre à lettre : C → D, H → I, A → B, T → U.', 'Chaque lettre avance d’un rang.', 'LOUP → MPVQ.'],
        trap: 'Vérifie le décalage sur toutes les lettres, pas seulement la première.',
      },
      'Dominos et cartes': {
        q: 'Trouvez la règle : 2 → 5 | 3 → 10 | 4 → 17 | 6 → ?',
        c: ['26', '35', '36', '37', '38'], a: 3,
        steps: ['Teste une règle sur le premier exemple : 2 → 5, peut-être 2² + 1 ?', 'Vérifie sur tous : 3² + 1 = 10, 4² + 1 = 17. La règle tient.', '6² + 1 = 37.'],
        trap: 'Valider une règle sur un seul exemple : « × 2 + 1 » marche pour 2 → 5 mais pas pour 3 → 10.',
      },
      'Heures et calendriers': {
        q: 'Nous sommes lundi. Quel jour serons-nous dans 100 jours ?',
        c: ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], a: 1,
        steps: ['Enlève les semaines entières : 100 = 14 × 7 + 2.', 'Les 14 semaines ramènent à un lundi.', 'Il reste 2 jours : lundi + 2 = mercredi.'],
        trap: 'Compter le jour de départ : « dans 2 jours », un lundi, c’est mercredi, pas mardi.',
      },
    },
  };
  Object.entries(EX).forEach(([k, m]) => (L[k] ? L[k].sections.forEach((s) => { if (m[s.t]) s.ex = m[s.t]; }) : null));

  // ---------- 3. Quiz plus longs ----------
  const QUIZ = {
    intro: [
      { q: 'Combien de temps dure chaque sous-test ?', c: ['15 minutes', '20 minutes', '25 minutes', '30 minutes', '40 minutes'], a: 1, why: '20 minutes par sous-test, 6 sous-tests : 2 heures au total.' },
      { q: 'Sur combien de points chaque sous-test est-il noté ?', c: ['Sur 20', 'Sur 60', 'Sur 100', 'Sur 150', 'Sur 600'], a: 2, why: 'Chaque sous-test est noté sur 100 ; les 6 réunis donnent le score sur 600.' },
      { q: 'Combien de propositions de réponse compte chaque question ?', c: ['3', '4', '5', '6', 'Cela dépend du sous-test'], a: 2, why: 'Toujours 5 propositions, une seule bonne réponse.' },
      { q: 'La calculatrice est-elle autorisée ?', c: ['Oui, partout', 'Seulement en Calcul', 'Non, jamais', 'Oui, si elle n’est pas programmable', 'Seulement en Logique'], a: 2, why: 'Aucune calculatrice : tout se fait à la main ou de tête, d’où l’importance du calcul mental.' },
      { q: 'Vous bloquez sur une question depuis 2 minutes. Que faire ?', c: ['Continuer jusqu’à trouver', 'Répondre au plus probable et passer', 'Laisser vide pour éviter une pénalité', 'Recommencer le sous-test', 'Attendre la fin du chrono'], a: 1, why: 'Sans points négatifs, on répond toujours ; mieux vaut garder du temps pour les questions faciles qui suivent.' },
    ],
    comprehension: [
      { q: '« L’auteur nuance son propos » signifie qu’il…', c: ['le contredit totalement', 'en limite la portée', 'le répète autrement', 'l’illustre par un exemple', 'l’abandonne'], a: 1, why: 'Nuancer, c’est apporter une réserve sans renoncer à l’idée.' },
      { q: 'Le connecteur « en effet » introduit…', c: ['une opposition', 'une explication', 'une conclusion', 'une concession', 'une hypothèse'], a: 1, why: '« En effet » justifie ce qui vient d’être dit.' },
      { q: 'Une proposition qui contient « toujours » ou « jamais » est souvent…', c: ['la bonne réponse', 'trop forte par rapport au texte', 'une reformulation fidèle', 'la thèse de l’auteur', 'une question sans réponse'], a: 1, why: 'Les textes nuancent souvent : un mot absolu trahit fréquemment le texte.' },
      { q: 'Où trouve-t-on le plus souvent la thèse de l’auteur ?', c: ['Dans le titre seulement', 'Au milieu du texte', 'Dans l’introduction ou la conclusion', 'Dans les exemples', 'Dans les citations'], a: 2, why: 'La thèse est annoncée au début et reprise, souvent plus nettement, à la fin.' },
      { q: 'Le texte dit « la plupart des Français ». Quelle reformulation est fidèle ?', c: ['Tous les Français', 'Une majorité de Français', 'Quelques Français', 'Aucun Français', 'Exactement la moitié des Français'], a: 1, why: '« La plupart » = plus de la moitié, sans aller jusqu’à « tous ».' },
    ],
    calcul: [
      { q: 'Un prix baisse de 20 %, puis remonte de 20 %. Quelle est l’évolution globale ?', c: ['0 %', '−4 %', '+4 %', '−2 %', '−20 %'], a: 1, why: '0,8 × 1,2 = 0,96, soit −4 %.' },
      { q: 'Combien font 75 × 12 ?', c: ['850', '900', '925', '950', '1 000'], a: 1, why: '75 × 12 = 75 × 4 × 3 = 300 × 3 = 900.' },
      { q: 'Un train parcourt 180 km en 1 h 30. Quelle est sa vitesse ?', c: ['100 km/h', '110 km/h', '120 km/h', '135 km/h', '150 km/h'], a: 2, why: '180 / 1,5 = 120 km/h.' },
      { q: 'Quelle est l’aire d’un disque de diamètre 10 ?', c: ['10π', '20π', '25π', '50π', '100π'], a: 2, why: 'Rayon 5, aire π × 5² = 25π.' },
      { q: 'On lance deux dés. Quelle est la probabilité d’obtenir au moins un 6 ?', c: ['1/6', '1/3', '11/36', '10/36', '1/36'], a: 2, why: 'Aucun 6 : (5/6)² = 25/36. Au moins un 6 : 1 − 25/36 = 11/36.' },
    ],
    argumentation: [
      { q: '« Seuls les adhérents peuvent voter. » Paul a voté. Que peut-on conclure ?', c: ['Paul est adhérent', 'Paul n’est pas adhérent', 'Tous les adhérents ont voté', 'On ne peut rien conclure', 'Paul est le seul votant'], a: 0, why: '« Seuls les adhérents » : voter ⇒ être adhérent.' },
      { q: 'Quelle est la négation de « Certains étudiants travaillent le soir » ?', c: ['Certains étudiants ne travaillent pas le soir', 'Aucun étudiant ne travaille le soir', 'Tous les étudiants travaillent le soir', 'La plupart ne travaillent pas le soir', 'Un seul étudiant travaille le soir'], a: 1, why: 'Nier « certains », c’est dire « aucun ».' },
      { q: '« Il est médecin, il a forcément raison sur l’économie. » Ce raisonnement est…', c: ['un appel à une autorité hors de son domaine', 'une généralisation hâtive', 'un faux dilemme', 'une pente glissante', 'une contraposée'], a: 0, why: 'Être compétent en médecine ne donne aucune autorité en économie.' },
      { q: 'Une condition nécessaire est une condition…', c: ['qui garantit le résultat', 'sans laquelle le résultat est impossible', 'inutile', 'qui découle du résultat', 'toujours fausse'], a: 1, why: 'Nécessaire : sans elle, rien. Suffisante : avec elle, c’est garanti.' },
      { q: '« Les ventes ont augmenté depuis la publicité : elle a donc fonctionné. » Quel fait affaiblit ce raisonnement ?', c: ['La publicité était coûteuse', 'Les ventes des concurrents, sans publicité, ont augmenté autant', 'La publicité passait le soir', 'Le produit existe depuis longtemps', 'Les clients aiment la marque'], a: 1, why: 'Si tout le marché a progressé autant, la hausse ne vient sans doute pas de la publicité.' },
    ],
    cm: [
      { q: 'Une information « suffit » quand…', c: ['elle donne une valeur probable', 'elle ne laisse qu’une seule réponse possible', 'elle aide à avancer', 'elle contient un nombre', 'elle est vraie'], a: 1, why: 'Suffire = une seule réponse possible, sans aucun doute.' },
      { q: 'Pour trouver x, l’information x² = 25 seule…', c: ['suffit', 'ne suffit pas : x = 5 ou x = −5', 'suffit si x est un nombre', 'suffit toujours pour un carré', 'ne dit rien de x'], a: 1, why: 'Deux valeurs possibles : insuffisant, sauf si on sait par ailleurs que x est positif.' },
      { q: 'Question oui/non : une information prouve que la réponse est toujours « non ». Elle…', c: ['ne suffit pas', 'suffit', 'suffit seulement avec l’autre', 'mène forcément à E', 'mène forcément à C'], a: 1, why: 'On peut répondre avec certitude : « non » est une réponse.' },
      { q: 'Pour trouver x : (1) x + y = 10 ; (2) 3x + 3y = 30. Réponse ?', c: CM, a: 4, why: '(2) est (1) multipliée par 3 : aucune information nouvelle, même ensemble c’est insuffisant.' },
      { q: 'Chacune des deux informations permet seule de répondre. Réponse ?', c: CM, a: 3, why: 'Chacune seule suffit : c’est la réponse D.' },
    ],
    expression: [
      { q: '« Elles se sont ___ les mains. »', c: ['lavé', 'lavés', 'lavée', 'lavées', 'laver'], a: 0, why: 'Le COD « les mains » est placé après le verbe : pas d’accord.' },
      { q: '« Si j’___ le temps, je viendrais. »', c: ['aurais', 'aurai', 'avais', 'aie', 'eus'], a: 2, why: 'Après « si » de condition : imparfait, jamais de conditionnel.' },
      { q: 'Quelle expression est un pléonasme ?', c: ['Monter en haut', 'Monter vite', 'Monter seul', 'Monter souvent', 'Monter enfin'], a: 0, why: 'On ne peut monter qu’en haut : « en haut » répète le verbe.' },
      { q: '« La ___ économique est difficile cette année. » (la situation du moment)', c: ['conjecture', 'conjoncture', 'conjointure', 'conjuration', 'conjugaison'], a: 1, why: 'Conjoncture = situation du moment ; conjecture = supposition.' },
      { q: '« Il est parti tôt ___ les bouchons. »', c: ['afin d’éviter', 'bien qu’évitant', 'pourtant éviter', 'donc éviter', 'cependant éviter'], a: 0, why: '« Afin de » exprime le but.' },
    ],
    logique: [
      { q: 'Quel nombre complète : 2, 6, 12, 20, 30, … ?', c: ['40', '42', '44', '36', '48'], a: 1, why: 'Écarts +4, +6, +8, +10, puis +12 : 42.' },
      { q: 'Quelle lettre complète : A, C, F, J, O, … ?', c: ['S', 'T', 'U', 'V', 'W'], a: 2, why: 'Rangs 1, 3, 6, 10, 15 (écarts +2, +3, +4, +5), puis +6 : 21 = U.' },
      { q: 'Quel nombre complète : 1, 4, 9, 16, 25, … ?', c: ['30', '34', '36', '49', '35'], a: 2, why: 'Ce sont les carrés : 6² = 36.' },
      { q: 'Il est 22 h 40. Quelle heure sera-t-il dans 5 h 35 ?', c: ['3 h 15', '4 h 05', '4 h 15', '4 h 25', '5 h 15'], a: 2, why: '22 h 40 + 5 h 35 = 27 h 75 = 28 h 15, soit 4 h 15.' },
      { q: 'Si ROSE s’écrit SPTF, comment s’écrit LYS ?', c: ['MZT', 'KXR', 'MZS', 'NZT', 'MYT'], a: 0, why: 'Chaque lettre avance d’un rang : L → M, Y → Z, S → T.' },
    ],
  };
  Object.entries(QUIZ).forEach(([k, qs]) => {
    if (!L[k]) return;
    qs.forEach((x) => { if (!L[k].quiz.some((y) => y.q === x.q)) L[k].quiz.push(x); });
  });

  // ---------- 4. Fiches de révision réécrites : une vraie question complète au recto, une réponse courte au verso ----------
  const C = TM.COURSES;
  const CARDS = {
    intro: [
      ['Combien y a-t-il de sous-tests au TAGE MAGE, et combien de questions dans chacun ?', '6 sous-tests de 15 questions, soit 90 questions en tout.'],
      ['Combien de temps dure chaque sous-test ?', '20 minutes. Le test complet dure 2 heures.'],
      ['Sur combien de points le TAGE MAGE est-il noté ?', 'Sur 600 : chacun des 6 sous-tests compte sur 100.'],
      ['Perd-on des points avec une mauvaise réponse ?', 'Non : une erreur vaut 0, comme une question sans réponse. Il faut donc répondre à tout.'],
      ['Combien de temps peut-on passer, en moyenne, sur une question ?', 'Environ 1 min 20 (20 minutes pour 15 questions).'],
      ['On finit un sous-test en avance : peut-on garder ce temps pour le suivant ?', 'Non. Chaque sous-test a son propre chronomètre : le temps restant est perdu.'],
      ['A-t-on droit à la calculatrice ?', 'Non. Tout se calcule à la main ou de tête.'],
      ['En répondant au hasard, quelle chance a-t-on de tomber juste ? Et après avoir éliminé 2 propositions ?', '1 chance sur 5 au hasard, 1 sur 3 après avoir éliminé 2 propositions.'],
    ],
    comprehension: [
      ['Face à un texte, que faut-il lire en premier ?', 'Les questions, en les survolant : on sait ensuite quoi chercher dans le texte.'],
      ['Où se trouve le plus souvent la thèse de l’auteur ?', 'Au début (introduction) ou à la fin (conclusion) du texte.'],
      ['Une proposition est vraie dans la réalité, mais le texte n’en parle pas. Faut-il la choisir ?', 'Non. On ne juge que ce que dit le texte : une idée « vraie mais hors texte » est un piège.'],
      ['Le texte dit « certains », une proposition dit « tous ». Quel est le piège ?', 'La généralisation : la proposition va plus loin que le texte. Elle est fausse.'],
      ['Le texte dit « Certains experts pensent que… ». Est-ce l’avis de l’auteur ?', 'Pas forcément : c’est un avis rapporté. L’auteur peut être d’accord ou non.'],
      ['Dans une phrase « certes…, mais… », où se trouve l’avis de l’auteur ?', 'Après le « mais ». Avant, il reconnaît un point qu’il va ensuite dépasser.'],
      ['Que demande une question « On peut en déduire que… » ?', 'Ce qui découle forcément du texte, pas ce qui est seulement probable.'],
      ['Comment choisir parmi les 5 propositions ?', 'Éliminer d’abord celles qui sont fausses, puis comparer les restantes mot à mot avec le texte.'],
    ],
    calcul: [
      ['Une baisse de 15 % revient à multiplier par combien ?', 'Par 0,85 (car 1 − 0,15 = 0,85).'],
      ['Un prix augmente de 10 %, puis baisse de 10 %. Revient-il au prix de départ ?', 'Non : 1,1 × 0,9 = 0,99, soit une baisse de 1 %.'],
      ['Après une baisse de 20 %, de combien faut-il augmenter pour revenir au prix de départ ?', 'De 25 %, car 1 ÷ 0,8 = 1,25.'],
      ['Un produit coûte 120 € TTC, avec une TVA de 20 %. Quel est son prix hors taxes ?', '100 €. On divise par 1,2 (retirer 20 % du TTC serait faux).'],
      ['Aller à 60 km/h, retour à 40 km/h sur le même trajet : la vitesse moyenne est-elle de 50 km/h ?', 'Non, 48 km/h. On passe plus de temps à la vitesse lente. Formule : 2 × v₁ × v₂ ÷ (v₁ + v₂).'],
      ['Comment passer d’une vitesse en m/s à une vitesse en km/h ?', 'On multiplie par 3,6. Exemple : 10 m/s = 36 km/h.'],
      ['Un robinet remplit une cuve en 3 h, un autre en 6 h. Ensemble, en combien de temps ?', 'En 2 h. Formule : T₁ × T₂ ÷ (T₁ + T₂), soit 18 ÷ 9.'],
      ['Quels triangles rectangles aux côtés entiers faut-il connaître par cœur ?', 'Ceux de côtés 3-4-5, 5-12-13 et 8-15-17, et leurs multiples (comme 6-8-10).'],
      ['On double toutes les longueurs d’une figure. Que deviennent son aire et son volume ?', 'L’aire est multipliée par 4 (2²) et le volume par 8 (2³).'],
      ['Comment calculer facilement la probabilité d’obtenir « au moins un » succès ?', 'On fait 1 − (probabilité de n’en obtenir aucun).'],
      ['n personnes se serrent toutes la main. Combien de poignées de main en tout ?', 'n × (n − 1) ÷ 2. Pour 10 personnes : 45.'],
      ['Comment calculer 49 × 51 de tête ?', '(50 − 1) × (50 + 1) = 50² − 1 = 2 499.'],
    ],
    argumentation: [
      ['« S’il pleut, la route est mouillée. » La route n’est pas mouillée. Que peut-on conclure ?', 'Qu’il ne pleut pas. C’est la contraposée : elle est toujours valable.'],
      ['« S’il pleut, la route est mouillée. » La route est mouillée. Peut-on conclure qu’il pleut ?', 'Non : la route peut être mouillée pour une autre raison (un arrosage, par exemple).'],
      ['« S’il pleut, la route est mouillée. » Il ne pleut pas. Peut-on conclure que la route est sèche ?', 'Non : une autre cause peut très bien la mouiller.'],
      ['Quelle est la négation de « Tous les élèves sont venus » ?', '« Au moins un élève n’est pas venu. » (Et non « aucun n’est venu ».)'],
      ['Quelle est la négation de « Il est grand et blond » ?', '« Il n’est pas grand, ou il n’est pas blond. » Il suffit qu’une des deux soit fausse.'],
      ['Que veut dire « On réussit seulement si on travaille » ?', 'Que travailler est nécessaire : si on a réussi, c’est qu’on a travaillé. Mais travailler ne garantit pas la réussite.'],
      ['Comment vérifier qu’une idée est une hypothèse cachée d’un raisonnement ?', 'On la nie : si le raisonnement ne tient plus, c’est qu’il reposait sur elle.'],
      ['Deux choses varient ensemble. Pourquoi l’une n’est-elle pas forcément la cause de l’autre ?', 'Un troisième facteur peut expliquer les deux, ou la cause peut aller dans l’autre sens.'],
      ['Qu’est-ce qu’un « faux dilemme » ?', 'Présenter seulement deux choix (« c’est A ou B ») alors qu’il en existe d’autres.'],
      ['Qu’est-ce qu’un argument « ad hominem » ?', 'Attaquer la personne qui parle au lieu de répondre à son argument.'],
    ],
    cm: [
      ['En Conditions minimales, que signifie la réponse A ?', 'L’information (1) suffit seule, mais pas la (2).'],
      ['En Conditions minimales, que signifie la réponse B ?', 'L’information (2) suffit seule, mais pas la (1).'],
      ['En Conditions minimales, que signifie la réponse C ?', 'Il faut les deux informations ensemble ; aucune ne suffit seule.'],
      ['En Conditions minimales, que signifie la réponse D ?', 'Chacune des deux informations suffit seule.'],
      ['En Conditions minimales, que signifie la réponse E ?', 'Même avec les deux informations ensemble, on ne peut pas répondre.'],
      ['Question oui/non : une information prouve que la réponse est toujours « non ». Suffit-elle ?', 'Oui. « Non » est une réponse certaine : l’information suffit.'],
      ['Si x² = 9, combien de valeurs x peut-il prendre ?', 'Deux : 3 et −3. « x² = 9 » ne suffit donc pas à trouver x.'],
      ['« x + y = 5 » et « 2x + 2y = 10 » : est-ce deux informations différentes ?', 'Non : la 2e est la 1re multipliée par 2. Elles n’apportent qu’une seule information.'],
      ['Quels nombres tester pour chercher un contre-exemple ?', '0, 1, des nombres négatifs et des fractions comme 1/2.'],
      ['Quand on teste l’information (2), que fait-on de l’information (1) ?', 'On l’oublie complètement : (2) doit suffire toute seule.'],
    ],
    expression: [
      ['Avec l’auxiliaire avoir, quand accorde-t-on le participe passé ?', 'Seulement si le COD est placé avant le verbe : « les fleurs que j’ai cueillies ».'],
      ['Pourquoi écrit-on « Elles se sont téléphoné », sans « es » ?', 'Parce qu’on téléphone À quelqu’un : « se » n’est pas un COD, donc pas d’accord.'],
      ['Quel mode utilise-t-on après « bien que » ?', 'Le subjonctif : « bien qu’il soit fatigué ».'],
      ['Quel mode utilise-t-on après « après que » ?', 'L’indicatif : « après qu’il est parti » (et non « soit parti »).'],
      ['Quel mode utilise-t-on après « j’espère que » ?', 'L’indicatif : « j’espère qu’il viendra ».'],
      ['« Si j’___ le temps, je viendrais. » Quel temps après « si » ?', 'L’imparfait : « si j’avais le temps ». Jamais de conditionnel après « si ».'],
      ['Écrit-on « une demi-heure » ou « une demie-heure » ?', '« Une demi-heure » : devant le nom, « demi » ne s’accorde pas. Mais on écrit « une heure et demie ».'],
      ['Écrit-on « des chaussures marron » ou « marrons » ?', '« Marron » : une couleur qui vient d’un nom (marron, orange…) reste invariable.'],
      ['Quelle différence entre « perpétrer » et « perpétuer » ?', 'Perpétrer = commettre (un crime). Perpétuer = faire durer (une tradition).'],
      ['Quelle différence entre « éminent » et « imminent » ?', 'Éminent = remarquable. Imminent = qui va arriver très bientôt.'],
      ['Dit-on « pallier à un problème » ?', 'Non : on dit « pallier un problème », sans « à ».'],
      ['Comment savoir s’il faut écrire « a » ou « à » ?', 'On remplace par « avait » : si la phrase reste correcte, c’est « a » (le verbe avoir).'],
    ],
    logique: [
      ['Devant une suite de nombres, dans quel ordre chercher la règle ?', 'D’abord les écarts, puis les multiplications, puis deux suites mélangées, puis les carrés et les cubes.'],
      ['Quels rangs de l’alphabet faut-il connaître par cœur ?', 'A = 1, E = 5, J = 10, O = 15, T = 20, Y = 25.'],
      ['Comment trouver la lettre « miroir » d’une autre (A ↔ Z, B ↔ Y) ?', 'Son rang vaut 27 moins le rang de départ. Exemple : C (3) ↔ X (24).'],
      ['Une suite monte et descend en alternance. Que faire en premier ?', 'Séparer les termes de rang pair et de rang impair : ce sont souvent deux suites distinctes.'],
      ['Quel nombre suit : 1, 3, 7, 13, 21 ?', '31 : les écarts augmentent de 2 à chaque fois (+2, +4, +6, +8, puis +10).'],
      ['Qu’est-ce que la suite de Fibonacci ?', 'Chaque nombre est la somme des deux précédents : 1, 1, 2, 3, 5, 8, 13…'],
      ['Quels sont les cubes des nombres de 1 à 5 ?', '1, 8, 27, 64, 125.'],
      ['Sur un domino, quelles valeurs peut prendre une moitié ?', 'De 0 (case blanche) à 6. Après 6, on repart à 0.'],
      ['Combien de temps rester bloqué sur une suite ?', 'Une minute au plus : on répond au plus probable et on passe à la suivante.'],
    ],
  };
  if (C) Object.entries(CARDS).forEach(([k, list]) => { if (C[k]) C[k].cards = list.map(([f, b]) => ({ f, b })); });
})();
