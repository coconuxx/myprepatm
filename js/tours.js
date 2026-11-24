// Visites guidées de MyPrépaTM (affichées par js/intro.js).
//
// - FIRST : visite complète, montrée une fois par compte, à la première arrivée sur l'accueil.
// - BY_VERSION : après une mise à jour, petite visite des nouveautés de cette version (après la fenêtre « Nouveautés »).
//   Pour une nouveauté visible, ajouter ici une entrée au numéro de la version qui sera publiée, par exemple :
//   '0.1.4': [{ view: 'home', target: '#home-modes', title: 'Nouveau', text: '…' }]
// Chaque étape : view (page où la montrer : 'home', 'profile'…), target (sélecteur CSS de la zone à montrer),
// title, text. Une étape dont la zone est introuvable est simplement sautée.
window.TM_TOURS = {
  FIRST: [
    { view: 'home', target: '.home-go', title: 'Ta mission du jour', text: 'Quelques tâches courtes chaque jour. Termine-les toutes pour gagner des pièces bonus.' },
    { view: 'home', target: '.home-badges', title: 'Tes épreuves', text: 'Touche une épreuve pour t’entraîner. La petite barre montre ta réussite ; un « ! » signale ton point faible.' },
    { view: 'home', target: '#home-modes', title: 'Tous les modes', text: 'Défi du jour, entraînement, survie, examen blanc : tout est ici.' },
    { view: 'home', target: '.topbar .hud-streak', title: 'Ta série', text: 'Joue un peu chaque jour pour faire grandir ta flamme.' },
    { view: 'home', target: '.topbar .hud-coins', title: 'Tes pièces', text: 'Gagnées en jouant, à dépenser en boutique pour habiller ta mascotte.' },
    { view: 'home', target: '.nav a[data-view="lessons"]', title: 'Leçons', text: 'Méthodes, règles et pièges de chaque sous-test, avec des fiches.' },
    { view: 'home', target: '.nav a[data-view="profile"]', title: 'Profil', text: 'Ta progression, tes badges, tes amis et tes réglages.' },
  ],
  BY_VERSION: {},
};
