// Banque : Compréhension de textes (textes originaux)
(function () {
  const TEXTS = [
    {
      title: 'La fin du bureau ?',
      body: `<p>Depuis le début des années 2020, le travail à distance s’est imposé dans de nombreuses entreprises. Ce qui relevait autrefois du privilège accordé à quelques cadres est devenu, pour une partie importante des salariés du tertiaire, une modalité ordinaire d’organisation. Certains observateurs ont alors annoncé la « fin du bureau ». Cette prophétie mérite pourtant d’être nuancée.</p>
<p>D’abord, le télétravail concerne avant tout les emplois dont les tâches peuvent être réalisées sur un ordinateur. Les ouvriers, les soignants, les commerçants ou les artisans en restent largement exclus. Parler d’une transformation générale du travail revient donc à généraliser l’expérience d’une minorité, certes visible, mais loin d’être représentative.</p>
<p>Ensuite, les entreprises qui avaient misé sur le « tout distanciel » sont nombreuses à revenir sur leurs choix. Elles invoquent la difficulté à intégrer les nouveaux arrivants, l’affaiblissement des échanges informels, ces conversations de couloir qui font naître des idées, et un sentiment d’appartenance plus fragile. L’auteur de ces lignes ne pense pas que ces arguments soient de simples prétextes : la coopération repose aussi sur une présence physique que les outils numériques ne remplacent qu’imparfaitement.</p>
<p>Le bureau ne disparaît donc pas ; il change de fonction. Il devient moins un lieu où l’on effectue des tâches individuelles qu’un lieu de rencontre, de formation et de création collective. Cette évolution suppose de repenser les espaces — moins de postes attribués, davantage de salles de réunion — mais aussi le management, qui doit apprendre à évaluer le travail sur ses résultats plutôt que sur le temps de présence.</p>`,
      questions: [
        { prompt: 'Quelle est la thèse principale de l’auteur ?', choices: ['Le bureau ne disparaît pas mais change de fonction.', 'Le télétravail va disparaître.', 'Le bureau est voué à disparaître.', 'Le télétravail concerne tous les salariés.', 'Les entreprises doivent interdire le télétravail.'], answer: 0, explanation: 'Dernier paragraphe : « Le bureau ne disparaît donc pas ; il change de fonction. »' },
        { prompt: 'Selon le texte, qui est largement exclu du télétravail ?', choices: ['Les ouvriers, soignants, commerçants et artisans', 'Les cadres', 'Les nouveaux arrivants', 'Les salariés du tertiaire', 'Les managers'], answer: 0, explanation: 'Deuxième paragraphe.' },
        { prompt: 'Quelle est la position de l’auteur sur les raisons invoquées par les entreprises qui reviennent au présentiel ?', choices: ['Il les juge fondées.', 'Il les juge hypocrites.', 'Il ne se prononce pas.', 'Il les trouve exagérées.', 'Il les trouve dépassées.'], answer: 0, explanation: '« L’auteur de ces lignes ne pense pas que ces arguments soient de simples prétextes. »' },
        { prompt: 'Que reproche l’auteur à l’expression « fin du bureau » ?', choices: ['Elle généralise l’expérience d’une minorité.', 'Elle est trop technique.', 'Elle ignore les cadres.', 'Elle est trop récente.', 'Elle vient des syndicats.'], answer: 0, explanation: '« Généraliser l’expérience d’une minorité, certes visible, mais loin d’être représentative. »' },
        { prompt: 'D’après le texte, quelle évolution du management l’auteur juge-t-il nécessaire ?', choices: ['Évaluer sur les résultats plutôt que sur le temps de présence', 'Contrôler davantage les horaires', 'Supprimer les réunions', 'Attribuer un poste fixe à chacun', 'Généraliser le tout distanciel'], answer: 0, explanation: 'Fin du dernier paragraphe. Attention au piège « postes attribués » : l’auteur en prévoit moins.' },
      ],
    },
    {
      title: 'Le paradoxe de l’abondance',
      body: `<p>On croit volontiers que disposer de davantage de choix rend plus libre et plus satisfait. Plusieurs travaux de psychologie suggèrent pourtant que l’abondance d’options peut produire l’effet inverse. Dans une expérience souvent citée, des clients d’un magasin se voyaient proposer soit six, soit vingt-quatre variétés de confiture. Le stand le plus fourni attirait davantage de curieux, mais c’est le plus modeste qui générait le plus d’achats.</p>
<p>Les chercheurs avancent deux explications. La première tient au coût de la décision : comparer de nombreuses options demande du temps et de l’énergie, si bien que certains renoncent à choisir. La seconde concerne le regret : plus les alternatives écartées sont nombreuses, plus il est facile d’imaginer qu’une autre aurait été meilleure, ce qui diminue la satisfaction tirée de son choix.</p>
<p>Il serait toutefois imprudent d’en tirer une loi universelle. Des tentatives de reproduction de ces résultats ont donné des effets plus faibles, voire nuls, dans certains contextes. L’effet semble dépendre de la familiarité du consommateur avec le produit : un connaisseur, qui sait ce qu’il cherche, n’est guère gêné par un large assortiment. Il dépend aussi de la manière dont les options sont présentées ; un classement clair réduit nettement la difficulté.</p>
<p>La leçon pour les entreprises n’est donc pas de réduire systématiquement leur offre, mais d’aider le client à s’y retrouver.</p>`,
      questions: [
        { prompt: 'Dans l’expérience des confitures, quel stand générait le plus d’achats ?', choices: ['Celui à six variétés', 'Celui à vingt-quatre variétés', 'Les deux autant', 'Aucun', 'Le texte ne le dit pas'], answer: 0, explanation: '« C’est le plus modeste qui générait le plus d’achats. »' },
        { prompt: 'Quelles sont les deux explications avancées ?', choices: ['Le coût de la décision et le regret', 'Le prix et la qualité', 'La curiosité et la fatigue', 'La publicité et l’habitude', 'Le regret et le prix'], answer: 0, explanation: 'Deuxième paragraphe.' },
        { prompt: 'Que dit le texte des tentatives de reproduction ?', choices: ['Elles ont parfois donné des effets plus faibles, voire nuls.', 'Elles ont toutes confirmé l’effet.', 'Elles n’ont jamais eu lieu.', 'Elles ont montré l’effet inverse partout.', 'Elles ont été interdites.'], answer: 0, explanation: 'Troisième paragraphe : « des effets plus faibles, voire nuls, dans certains contextes ».' },
        { prompt: 'Selon le texte, qui est peu gêné par un large assortiment ?', choices: ['Le connaisseur qui sait ce qu’il cherche', 'Le client pressé', 'Le curieux', 'Le client âgé', 'Tous les clients'], answer: 0, explanation: 'Troisième paragraphe.' },
        { prompt: 'Quelle recommandation l’auteur adresse-t-il aux entreprises ?', choices: ['Aider le client à s’y retrouver', 'Réduire systématiquement l’offre', 'Augmenter l’offre', 'Baisser les prix', 'Supprimer les classements'], answer: 0, explanation: 'Dernière phrase. Piège : « réduire systématiquement » est explicitement rejeté.' },
      ],
    },
    {
      title: 'Villes et arbres',
      body: `<p>Longtemps considérés comme un simple élément de décor, les arbres sont désormais vus par de nombreuses municipalités comme une infrastructure à part entière. La raison principale est climatique : lors des vagues de chaleur, un quartier arboré peut afficher plusieurs degrés de moins qu’un quartier minéral voisin, grâce à l’ombre portée et à l’évapotranspiration des feuilles.</p>
<p>Les bénéfices ne s’arrêtent pas là. Les arbres favorisent l’infiltration des eaux de pluie, ce qui limite la saturation des réseaux d’égouts lors des orages. Ils offrent un refuge à la faune et, selon plusieurs études, contribueraient au bien-être psychologique des habitants. Le conditionnel s’impose sur ce dernier point, car il est difficile d’isoler l’effet des arbres de celui d’autres facteurs, comme le niveau de revenu des quartiers concernés.</p>
<p>Planter ne suffit cependant pas. Un jeune arbre met des années, parfois des décennies, avant de rendre pleinement ces services. Or, en ville, sa survie est menacée par le manque d’espace pour les racines, la pollution et les sols compactés. Abattre un arbre adulte pour en planter trois jeunes peut ainsi constituer, à court et moyen terme, une perte nette.</p>
<p>Les politiques les plus efficaces combinent donc la plantation et la préservation du patrimoine existant, et choisissent des essences adaptées au climat futur plutôt qu’à celui du passé.</p>`,
      questions: [
        { prompt: 'Quelle est la raison principale de l’intérêt nouveau des villes pour les arbres ?', choices: ['Le rafraîchissement lors des vagues de chaleur', 'La beauté du paysage', 'La valeur immobilière', 'La production de bois', 'L’attraction touristique'], answer: 0, explanation: '« La raison principale est climatique. »' },
        { prompt: 'Pourquoi l’auteur emploie-t-il le conditionnel à propos du bien-être psychologique ?', choices: ['Parce que l’effet des arbres est difficile à isoler d’autres facteurs', 'Parce que les études sont anciennes', 'Parce qu’il pense que c’est faux', 'Parce que les habitants le contestent', 'Par simple politesse'], answer: 0, explanation: 'Deuxième paragraphe : facteurs confondants comme le revenu.' },
        { prompt: 'Selon le texte, abattre un arbre adulte pour en planter trois jeunes :', choices: ['peut être une perte nette à court et moyen terme', 'est toujours bénéfique', 'est interdit', 'double les bénéfices', 'n’a aucun effet'], answer: 0, explanation: 'Troisième paragraphe.' },
        { prompt: 'Lequel de ces éléments n’est PAS cité comme une menace pour les arbres en ville ?', choices: ['Les maladies', 'Le manque d’espace pour les racines', 'La pollution', 'Les sols compactés', 'Aucun, tous sont cités'], answer: 0, explanation: 'Les maladies ne sont pas mentionnées. Lisez précisément : « n’est PAS cité ».' },
        { prompt: 'Quelle essence l’auteur recommande-t-il de planter ?', choices: ['Des essences adaptées au climat futur', 'Des essences locales traditionnelles', 'Des arbres à croissance rapide', 'Des arbres fruitiers', 'Le texte ne recommande rien'], answer: 0, explanation: 'Dernière phrase : climat futur plutôt que celui du passé.' },
      ],
    },
    {
      title: 'Dormir pour apprendre',
      body: `<p>Pendant les révisions, le sommeil est souvent la première variable sacrifiée. Beaucoup d’étudiants considèrent qu’une heure passée à dormir est une heure perdue pour le travail. Ce calcul repose pourtant sur une idée fausse : l’apprentissage ne s’arrête pas quand on ferme ses livres.</p>
<p>De nombreux chercheurs en sciences cognitives estiment en effet que le sommeil joue un rôle actif dans la mémorisation. Pendant la nuit, le cerveau trierait les informations de la journée et consoliderait celles qui ont été répétées. Réduire son temps de sommeil reviendrait donc à apprendre davantage le jour pour retenir moins la nuit.</p>
<p>Il ne faudrait pas en conclure que dormir suffit. Le sommeil consolide ce qui a été travaillé ; il ne remplace pas le travail. Un étudiant qui dort beaucoup sans réviser n’en tirera aucun bénéfice particulier. L’auteur insiste sur ce point, car certains discours de « bien-être » laissent croire qu’une bonne hygiène de vie dispense de l’effort.</p>
<p>La recommandation qui s’en dégage est modeste : répartir les révisions sur plusieurs jours plutôt que de tout concentrer la veille, et protéger ses nuits, surtout dans la dernière semaine. Une nuit blanche avant une épreuve de raisonnement est sans doute le pire des compromis.</p>`,
      questions: [
        { prompt: 'Quelle idée l’auteur conteste-t-il dans le premier paragraphe ?', choices: ['Une heure de sommeil serait une heure perdue pour le travail.', 'Le sommeil serait inutile à la santé.', 'Les étudiants dormiraient trop.', 'Les révisions seraient inefficaces.', 'Il faudrait réviser la nuit.'], answer: 0, explanation: '« Ce calcul repose pourtant sur une idée fausse » : celle qu’une heure de sommeil est perdue.' },
        { prompt: 'Pourquoi l’auteur emploie-t-il le conditionnel (« trierait », « consoliderait ») ?', choices: ['Pour rapporter une thèse de chercheurs sans la présenter comme certaine', 'Parce qu’il la juge fausse', 'Pour exprimer un souhait', 'Par politesse envers le lecteur', 'Parce que les faits sont futurs'], answer: 0, explanation: 'Le conditionnel signale une information rapportée, attribuée aux chercheurs.' },
        { prompt: 'Selon l’auteur, un étudiant qui dort beaucoup sans réviser :', choices: ['n’en tirera aucun bénéfice particulier', 'retiendra tout de même ses cours', 'réussira mieux que les autres', 'sera plus créatif', 'compensera plus tard'], answer: 0, explanation: '« Le sommeil consolide ce qui a été travaillé ; il ne remplace pas le travail. »' },
        { prompt: 'Quelle critique l’auteur adresse-t-il à certains discours de « bien-être » ?', choices: ['Ils laissent croire qu’une bonne hygiène de vie dispense de l’effort.', 'Ils recommandent de dormir trop peu.', 'Ils s’appuient sur la recherche.', 'Ils sont trop techniques.', 'Ils interdisent les révisions.'], answer: 0, explanation: 'Troisième paragraphe.' },
        { prompt: 'Quelle recommandation finale l’auteur fait-il ?', choices: ['Répartir les révisions sur plusieurs jours et protéger ses nuits', 'Réviser toute la nuit la veille', 'Dormir au moins dix heures', 'Arrêter de réviser la dernière semaine', 'Faire des siestes pendant l’épreuve'], answer: 0, explanation: 'Dernier paragraphe. Il juge la nuit blanche « le pire des compromis ».' },
      ],
    },
    {
      title: 'Quand c’est gratuit',
      body: `<p>« Si c’est gratuit, c’est vous le produit. » La formule est devenue un lieu commun pour décrire les services numériques financés par la publicité. Elle a le mérite de rappeler qu’un service gratuit n’est jamais sans coût : quelqu’un paie, et ce quelqu’un attend un retour.</p>
<p>Le modèle est simple en apparence. La plateforme attire des utilisateurs, retient leur attention le plus longtemps possible et vend à des annonceurs la possibilité de s’adresser à eux. Plus l’utilisateur reste, plus il rapporte. On comprend dès lors que la durée d’utilisation devienne un indicateur central, parfois au détriment de la qualité du service rendu.</p>
<p>La formule est toutefois trop sommaire. Tous les services gratuits ne reposent pas sur la publicité : certains sont financés par des dons, par l’argent public ou par une version payante réservée à une minorité d’utilisateurs. Dans ce dernier cas, les utilisateurs gratuits ne sont pas « le produit » mais plutôt une vitrine destinée à convaincre les futurs clients.</p>
<p>Plutôt que de se méfier de toute gratuité, l’auteur invite donc à poser une question simple avant d’adopter un service : qui le finance, et qu’attend-il en échange ?</p>`,
      questions: [
        { prompt: 'Quel mérite l’auteur reconnaît-il à la formule citée en introduction ?', choices: ['Rappeler qu’un service gratuit n’est jamais sans coût', 'Prouver que la publicité est nuisible', 'Décrire tous les services numériques', 'Encourager les dons', 'Défendre la gratuité'], answer: 0, explanation: 'Premier paragraphe : « Elle a le mérite de rappeler… ».' },
        { prompt: 'Dans le modèle publicitaire, pourquoi la durée d’utilisation est-elle centrale ?', choices: ['Plus l’utilisateur reste, plus il rapporte.', 'Elle mesure la qualité du service.', 'Elle est imposée par la loi.', 'Les annonceurs paient à l’inscription.', 'Elle réduit les coûts de la plateforme.'], answer: 0, explanation: 'Deuxième paragraphe.' },
        { prompt: 'Pourquoi l’auteur juge-t-il la formule « trop sommaire » ?', choices: ['Tous les services gratuits ne reposent pas sur la publicité.', 'La publicité n’existe plus en ligne.', 'Les utilisateurs paient toujours.', 'Elle est trop récente.', 'Elle ignore les annonceurs.'], answer: 0, explanation: 'Troisième paragraphe : dons, argent public, version payante.' },
        { prompt: 'Dans le cas d’une version payante réservée à une minorité, les utilisateurs gratuits sont présentés comme :', choices: ['une vitrine destinée à convaincre de futurs clients', 'le produit vendu aux annonceurs', 'des donateurs', 'des salariés de la plateforme', 'des concurrents'], answer: 0, explanation: 'Fin du troisième paragraphe.' },
        { prompt: 'Quelle attitude l’auteur recommande-t-il ?', choices: ['Se demander qui finance un service et ce qu’il attend en échange', 'Refuser tout service gratuit', 'Payer systématiquement', 'Bloquer toute publicité', 'Ne rien changer'], answer: 0, explanation: 'Dernier paragraphe. Piège : « se méfier de toute gratuité » est rejeté.' },
      ],
    },
    {
      title: 'Le droit à l’erreur',
      body: `<p>L’école française a longtemps entretenu un rapport méfiant à l’erreur. La faute était sanctionnée, soulignée en rouge, retranchée de la note. Il en est resté chez beaucoup d’adultes une peur de se tromper qui freine l’initiative, au travail comme ailleurs.</p>
<p>Plusieurs pédagogues défendent aujourd’hui une autre approche : l’erreur ne serait pas l’inverse de l’apprentissage mais l’une de ses étapes. Se tromper, puis comprendre pourquoi, laisserait une trace plus durable que réussir du premier coup sans savoir comment. Encore faut-il que l’erreur soit analysée ; une erreur simplement corrigée par quelqu’un d’autre n’apprend presque rien.</p>
<p>Cette idée n’implique pas que toutes les erreurs se valent. Une erreur d’inattention ne se traite pas comme une erreur de raisonnement, et confondre les deux conduit à de mauvais remèdes : on ne corrige pas un défaut de méthode en « faisant plus attention ».</p>
<p>Pour un candidat qui prépare un concours, la conséquence est pratique : tenir un carnet d’erreurs, classées par type, vaut sans doute mieux que d’enchaîner les exercices sans revenir sur ceux qui ont échoué.</p>`,
      questions: [
        { prompt: 'Selon l’auteur, quelle conséquence l’ancien rapport à l’erreur a-t-il eue chez beaucoup d’adultes ?', choices: ['Une peur de se tromper qui freine l’initiative', 'Un goût du risque', 'Une meilleure orthographe', 'Une indifférence aux notes', 'Un rejet de l’école'], answer: 0, explanation: 'Premier paragraphe.' },
        { prompt: 'À quelle condition l’erreur est-elle utile, d’après le texte ?', choices: ['Qu’elle soit analysée', 'Qu’elle soit sanctionnée', 'Qu’elle soit rare', 'Qu’elle soit corrigée par un professeur', 'Qu’elle soit oubliée'], answer: 0, explanation: '« Encore faut-il que l’erreur soit analysée. » Piège : la correction par autrui « n’apprend presque rien ».' },
        { prompt: 'Que reproche l’auteur au conseil de « faire plus attention » ?', choices: ['Il ne corrige pas un défaut de méthode.', 'Il est trop sévère.', 'Il est inutile pour les erreurs d’inattention.', 'Il vient des pédagogues.', 'Il augmente le stress.'], answer: 0, explanation: 'Troisième paragraphe : confondre les types d’erreurs mène à de mauvais remèdes.' },
        { prompt: 'Le mot « remèdes » (3e paragraphe) désigne ici :', choices: ['des façons de corriger les erreurs', 'des médicaments', 'des sanctions', 'des exercices de concours', 'des notes'], answer: 0, explanation: 'Sens figuré : solutions apportées à un problème.' },
        { prompt: 'Quel conseil pratique le texte donne-t-il aux candidats ?', choices: ['Tenir un carnet d’erreurs classées par type', 'Enchaîner le plus d’exercices possible', 'Éviter les exercices difficiles', 'Ne jamais revenir sur ses erreurs', 'Réviser uniquement la théorie'], answer: 0, explanation: 'Dernier paragraphe.' },
      ],
    },
    {
      title: 'Le commerce de proximité',
      body: `<p>On annonce depuis vingt ans la mort du petit commerce, victime des grandes surfaces puis de la vente en ligne. Le diagnostic n’est pas sans fondement : dans de nombreuses villes moyennes, les vitrines vides du centre-ville témoignent d’un déclin bien réel.</p>
<p>Le tableau mérite cependant d’être nuancé. Les commerces qui résistent le mieux sont rarement ceux qui vendent des produits standardisés, que l’on trouve partout au même prix. Ce sont plutôt ceux qui offrent ce qu’un site ne peut pas offrir : un conseil, un service immédiat, une relation. La librairie qui recommande un livre ou le réparateur de vélos ne sont pas en concurrence frontale avec une plateforme.</p>
<p>Beaucoup de commerçants ont d’ailleurs cessé d’opposer boutique et internet. Ils vendent en ligne, proposent le retrait en magasin et utilisent les réseaux sociaux pour faire venir des clients. L’auteur y voit moins une capitulation qu’une adaptation.</p>
<p>Le sort du commerce de proximité dépendra donc moins de la technologie que de choix collectifs : loyers, stationnement, aménagement des centres-villes. Ce sont des décisions politiques, et non une fatalité économique.</p>`,
      questions: [
        { prompt: 'Que reconnaît l’auteur dans le premier paragraphe ?', choices: ['Le déclin du petit commerce est réel dans de nombreuses villes moyennes.', 'Le petit commerce est en pleine croissance.', 'Les grandes surfaces ont disparu.', 'La vente en ligne recule.', 'Les vitrines vides sont un mythe.'], answer: 0, explanation: '« Le diagnostic n’est pas sans fondement. »' },
        { prompt: 'Quels commerces résistent le mieux selon le texte ?', choices: ['Ceux qui offrent conseil, service immédiat ou relation', 'Ceux qui vendent les produits les moins chers', 'Ceux qui vendent des produits standardisés', 'Ceux qui refusent internet', 'Ceux situés en périphérie'], answer: 0, explanation: 'Deuxième paragraphe.' },
        { prompt: 'Comment l’auteur qualifie-t-il le recours des commerçants à internet ?', choices: ['Comme une adaptation plutôt qu’une capitulation', 'Comme une trahison', 'Comme une erreur stratégique', 'Comme une obligation légale', 'Comme une mode passagère'], answer: 0, explanation: 'Fin du troisième paragraphe.' },
        { prompt: 'De quoi dépendra principalement le sort du commerce de proximité, d’après l’auteur ?', choices: ['De choix collectifs comme les loyers et l’aménagement', 'De la technologie', 'Des grandes plateformes', 'Du hasard', 'Des prix des produits'], answer: 0, explanation: 'Dernier paragraphe : « moins de la technologie que de choix collectifs ».' },
        { prompt: 'Quelle est la thèse générale du texte ?', choices: ['Le déclin du petit commerce n’est pas une fatalité.', 'Le petit commerce est condamné.', 'Internet sauvera le petit commerce.', 'Les grandes surfaces sont responsables de tout.', 'Les centres-villes doivent devenir piétons.'], answer: 0, explanation: 'La conclusion oppose « décisions politiques » et « fatalité économique ».' },
      ],
    },
    {
      title: 'Trop de réunions',
      body: `<p>Dans beaucoup d’entreprises, l’agenda des cadres est saturé de réunions. Elles sont censées favoriser la coordination ; elles finissent souvent par empêcher le travail qu’elles devaient organiser. Nombre de salariés disent n’avancer réellement sur leurs dossiers qu’en début de matinée ou le soir, une fois les réunions terminées.</p>
<p>Le problème ne vient pas de la réunion en elle-même, mais de son usage par défaut. On réunit dix personnes pour transmettre une information qu’un message aurait suffi à faire circuler, ou pour prendre une décision qu’une seule personne aurait pu prendre. Chaque participant inutile représente une heure de travail perdue, multipliée par le nombre de réunions.</p>
<p>Certaines organisations ont tenté des remèdes radicaux, comme des journées sans réunion. L’auteur reste prudent : supprimer les réunions sans changer les habitudes risque de déplacer le problème vers les messageries, où les échanges deviennent aussi envahissants.</p>
<p>La solution la plus efficace lui paraît plus simple : n’organiser une réunion que si elle a un objectif écrit, une durée limitée et des participants qui ont tous une raison d’être présents.</p>`,
      questions: [
        { prompt: 'Selon le texte, quand beaucoup de salariés avancent-ils réellement sur leurs dossiers ?', choices: ['En début de matinée ou le soir', 'Pendant les réunions', 'Le week-end uniquement', 'À l’heure du déjeuner', 'Pendant les journées sans réunion'], answer: 0, explanation: 'Premier paragraphe.' },
        { prompt: 'D’où vient le problème, selon l’auteur ?', choices: ['De l’usage par défaut des réunions', 'De la réunion en elle-même', 'Des messageries', 'Des salariés trop nombreux', 'Des journées trop courtes'], answer: 0, explanation: '« Le problème ne vient pas de la réunion en elle-même, mais de son usage par défaut. »' },
        { prompt: 'Pourquoi l’auteur reste-t-il prudent face aux journées sans réunion ?', choices: ['Le problème risque de se déplacer vers les messageries.', 'Elles sont illégales.', 'Elles réduisent la productivité.', 'Les cadres les refusent.', 'Elles coûtent cher.'], answer: 0, explanation: 'Troisième paragraphe.' },
        { prompt: 'Lequel de ces critères n’est PAS proposé par l’auteur pour organiser une réunion ?', choices: ['Un compte rendu envoyé à toute l’entreprise', 'Un objectif écrit', 'Une durée limitée', 'Des participants qui ont une raison d’être là', 'Aucun, tous sont proposés'], answer: 0, explanation: 'Le compte rendu n’est pas mentionné.' },
        { prompt: 'Le mot « radicaux » (3e paragraphe) signifie ici :', choices: ['extrêmes, qui vont à la racine du problème', 'politiques', 'chimiques', 'inefficaces', 'progressifs'], answer: 0, explanation: 'Des remèdes radicaux sont des solutions extrêmes.' },
      ],
    },
  ];

  function questionsFor(text) {
    return text.questions.map((q) => TM.util.fixed({ theme: 'comprehension', passage: { title: text.title, body: text.body }, ...q }));
  }

  // Entraînement : n questions, en tirant des textes entiers dans l'ordre
  TM.gen.comprehension = function (n) {
    const texts = TM.util.shuffle(TEXTS);
    const out = [];
    for (const t of texts) {
      if (out.length >= n) break;
      out.push(...questionsFor(t));
    }
    return out.slice(0, n);
  };
  TM.COMPREHENSION_TEXTS = TEXTS.length;
})();
