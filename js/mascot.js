// Avatar humain personnalisable : peau, coiffure, couleur de cheveux, tenue, barbe,
// accessoires (chapeau, lunettes, cou) et cadre de rang selon le niveau.
// (Le nom TM.mascot est conservé pour la compatibilité avec le reste de l’appli.)
(function () {
  const INK = '#1b1b2f';

  // ---------- Options d’apparence ----------
  // price : à obtenir avec des pièces (sinon gratuit)
  const LOOK = {
    skin: [
      { id: 's1', color: '#fbe0cc' }, { id: 's2', color: '#f1c7a5' }, { id: 's3', color: '#dea47e' },
      { id: 's4', color: '#bf8058' }, { id: 's5', color: '#8f5a3a' }, { id: 's6', color: '#5e3a26' },
    ],
    hair: [
      { id: 'short', name: 'Courts' }, { id: 'buzz', name: 'Ras' }, { id: 'long', name: 'Longs' },
      { id: 'bob', name: 'Carré' }, { id: 'bun', name: 'Chignon' }, { id: 'ponytail', name: 'Queue de cheval' },
      { id: 'curly', name: 'Bouclés' }, { id: 'bald', name: 'Sans' },
      { id: 'spiky', name: 'En pointes', price: 80 }, { id: 'afro', name: 'Afro', price: 80 },
      { id: 'braids', name: 'Tresses', price: 90 }, { id: 'mohawk', name: 'Iroquoise', price: 110 },
    ],
    hairColor: [
      { id: 'black', color: '#231a16' }, { id: 'brown', color: '#5b3a26' }, { id: 'auburn', color: '#8e3e1f' },
      { id: 'blond', color: '#e1b65f' }, { id: 'grey', color: '#b8b8bf' },
      { id: 'blue', color: '#3a5bd9', price: 60 }, { id: 'pink', color: '#e86aa6', price: 60 }, { id: 'green', color: '#2fae5c', price: 60 },
      { id: 'purple', color: '#7b4dd6', price: 60 }, { id: 'red', color: '#d62839', price: 60 }, { id: 'platinum', color: '#ece3cf', price: 80 },
    ],
    outfit: [
      { id: 'hoodie', name: 'Sweat' }, { id: 'tshirt', name: 'T-shirt' }, { id: 'shirt', name: 'Chemise' },
      { id: 'blazer', name: 'Blazer', price: 100 }, { id: 'jersey', name: 'Maillot', price: 70 },
      { id: 'stripes', name: 'Marinière', price: 90 }, { id: 'turtleneck', name: 'Col roulé', price: 80 }, { id: 'gown', name: 'Toge de diplômé', price: 150 },
    ],
    outfitColor: [
      { id: 'navy', color: '#1f3a93' }, { id: 'yellow', color: '#ffc300' }, { id: 'red', color: '#d64045' },
      { id: 'green', color: '#2e9e55' }, { id: 'grey', color: '#8b93a7' }, { id: 'white', color: '#f4f4f7' },
      { id: 'purple', color: '#7b4dd6', price: 30 }, { id: 'orange', color: '#f2994a', price: 30 }, { id: 'black', color: '#25283a', price: 30 },
    ],
    beard: [{ id: 'none', name: 'Aucune' }, { id: 'stubble', name: 'Légère' }, { id: 'full', name: 'Barbe' },
      { id: 'mustache', name: 'Moustache', price: 50 }, { id: 'goatee', name: 'Bouc', price: 50 }],
  };
  const LOOK_LABELS = { skin: 'Peau', hair: 'Coiffure', hairColor: 'Couleur des cheveux', outfit: 'Tenue', outfitColor: 'Couleur de la tenue', beard: 'Barbe' };
  const DEFAULT_LOOK = { skin: 's2', hair: 'short', hairColor: 'brown', outfit: 'hoodie', outfitColor: 'navy', beard: 'none' };
  const get = (cat, id) => LOOK[cat].find((x) => x.id === id) || LOOK[cat][0];

  // ---------- Rangs (cadre selon le niveau) ----------
  const STAGES = [
    { id: 0, min: 1, name: 'Candidat', ring: '#9aa6c7', bg: '#e8ecf7' },
    { id: 1, min: 5, name: 'Bronze', ring: '#c27c3e', bg: '#f6e3d2' },
    { id: 2, min: 10, name: 'Argent', ring: '#9ea7b5', bg: '#eef1f5' },
    { id: 3, min: 15, name: 'Or', ring: '#e0a100', bg: '#fff1c2' },
    { id: 4, min: 20, name: 'Légende', ring: '#7b4dd6', bg: '#ece4ff' },
  ];
  const stageFor = (level) => STAGES.filter((s) => level >= s.min).pop();

  // ---------- Accessoires (boutique) ----------
  const ITEMS = [
    { id: 'cap', slot: 'hat', name: 'Toque de diplômé', price: 60 },
    { id: 'beret', slot: 'hat', name: 'Béret', price: 40 },
    { id: 'beanie', slot: 'hat', name: 'Bonnet', price: 40 },
    { id: 'phones', slot: 'hat', name: 'Casque audio', price: 80 },
    { id: 'wizard', slot: 'hat', name: 'Chapeau de mage', price: 150, level: 5 },
    { id: 'crown', slot: 'hat', name: 'Couronne', price: 300, level: 10 },
    { id: 'round', slot: 'eyes', name: 'Lunettes rondes', price: 40 },
    { id: 'square', slot: 'eyes', name: 'Lunettes carrées', price: 40 },
    { id: 'sun', slot: 'eyes', name: 'Lunettes de soleil', price: 70 },
    { id: 'monocle', slot: 'eyes', name: 'Monocle', price: 120, level: 6 },
    { id: 'bowtie', slot: 'neck', name: 'Nœud papillon', price: 30 },
    { id: 'tie', slot: 'neck', name: 'Cravate', price: 50 },
    { id: 'scarf', slot: 'neck', name: 'Écharpe', price: 60 },
    { id: 'medal', slot: 'neck', name: 'Médaille d’or', badge: 'exam400' },
    { id: 'laurel', slot: 'hat', name: 'Couronne de laurier', badge: 'streak7' },
    // --- Nouveaux couvre-chefs
    { id: 'party', slot: 'hat', name: 'Chapeau de fête', price: 35 },
    { id: 'catears', slot: 'hat', name: 'Oreilles de chat', price: 45 },
    { id: 'flowers', slot: 'hat', name: 'Couronne de fleurs', price: 55 },
    { id: 'tophat', slot: 'hat', name: 'Haut-de-forme', price: 90 },
    { id: 'viking', slot: 'hat', name: 'Casque viking', price: 180, level: 12 },
    { id: 'halo', slot: 'hat', name: 'Auréole', badge: 'streak30' },
    // --- Nouvelles lunettes
    { id: 'hearts', slot: 'eyes', name: 'Lunettes cœur', price: 60 },
    { id: 'stars', slot: 'eyes', name: 'Lunettes étoiles', price: 75 },
    { id: 'aviator', slot: 'eyes', name: 'Aviateur', price: 90 },
    { id: 'visor', slot: 'eyes', name: 'Visière futuriste', price: 220, level: 12 },
    // --- Nouveaux accessoires de cou
    { id: 'kerchief', slot: 'neck', name: 'Foulard', price: 45 },
    { id: 'pearls', slot: 'neck', name: 'Collier de perles', price: 70 },
    { id: 'cape', slot: 'neck', name: 'Cape de héros', price: 160, level: 8 },
    { id: 'lanyard', slot: 'neck', name: 'Badge de candidat', badge: 'exam1' },
    // --- Récompenses de série (record de jours d’affilée, non achetables)
    { id: 'embers', slot: 'aura', name: 'Braises de série', streak: 14 },
    { id: 'phoenix', slot: 'pet', name: 'Phénix', streak: 50 },
    { id: 'diamond', slot: 'hat', name: 'Diadème de diamant', streak: 100 },
    // --- Quêtes : un objet par sous-test maîtrisé (40 bonnes réponses, au moins 60 % de réussite) + examens
    { id: 'calcpet', slot: 'pet', name: 'Calculatrice dorée', quest: { sub: 'calcul', ok: 40, rate: 0.6 } },
    { id: 'magnifier', slot: 'eyes', name: 'Loupe de détective', quest: { sub: 'cm', ok: 40, rate: 0.6 } },
    { id: 'quill', slot: 'hat', name: 'Plume d’écrivain', quest: { sub: 'expression', ok: 40, rate: 0.6 } },
    { id: 'letters', slot: 'aura', name: 'Lettres volantes', quest: { sub: 'comprehension', ok: 40, rate: 0.6 } },
    { id: 'scales', slot: 'neck', name: 'Balance d’argumentation', quest: { sub: 'argumentation', ok: 40, rate: 0.6 } },
    { id: 'chess', slot: 'bg', name: 'Échiquier', quest: { sub: 'logique', ok: 40, rate: 0.6 } },
    { id: 'stopwatch', slot: 'neck', name: 'Chrono d’or', quest: { exams: 3 } },
    // --- Saisons : en vente seulement pendant leur période, gardés pour toujours une fois obtenus
    { id: 'forest', slot: 'bg', name: 'Forêt d’automne', price: 60, season: 'automne' },
    { id: 'leaves', slot: 'aura', name: 'Feuilles mortes', price: 80, season: 'automne' },
    { id: 'pumpkin', slot: 'hat', name: 'Citrouille', price: 70, season: 'halloween' },
    { id: 'bats', slot: 'aura', name: 'Chauves-souris', price: 90, season: 'halloween' },
    { id: 'santa', slot: 'hat', name: 'Bonnet de Noël', price: 60, season: 'noel' },
    { id: 'snowland', slot: 'bg', name: 'Paysage enneigé', price: 70, season: 'noel' },
    { id: 'straw', slot: 'hat', name: 'Chapeau de paille', price: 50, season: 'ete' },
    { id: 'beach', slot: 'bg', name: 'Plage', price: 70, season: 'ete' },
    // --- Sport
    { id: 'sweatband', slot: 'hat', name: 'Bandeau', price: 35 },
    { id: 'sportcap', slot: 'hat', name: 'Casquette', price: 40 },
    { id: 'whistle', slot: 'neck', name: 'Sifflet d’arbitre', price: 40 },
    { id: 'stadium', slot: 'bg', name: 'Stade', price: 80 },
    // --- Fantastique
    { id: 'unicorn', slot: 'hat', name: 'Corne de licorne', price: 120 },
    { id: 'amulet', slot: 'neck', name: 'Amulette', price: 90 },
    { id: 'castle', slot: 'bg', name: 'Château enchanté', price: 110 },
    { id: 'fairy', slot: 'pet', name: 'Fée', price: 130 },
    { id: 'magic', slot: 'aura', name: 'Cercle magique', price: 150, level: 6 },
    // --- Fonds d’avatar
    { id: 'sky', slot: 'bg', name: 'Ciel bleu', price: 30 },
    { id: 'sunset', slot: 'bg', name: 'Coucher de soleil', price: 50 },
    { id: 'night', slot: 'bg', name: 'Nuit étoilée', price: 70 },
    { id: 'board', slot: 'bg', name: 'Tableau noir', price: 80 },
    { id: 'library', slot: 'bg', name: 'Bibliothèque', price: 90 },
    { id: 'galaxy', slot: 'bg', name: 'Galaxie', price: 250, level: 12 },
    { id: 'gold', slot: 'bg', name: 'Or massif', badge: 'exam500' },
    // --- Compagnons
    { id: 'chick', slot: 'pet', name: 'Poussin', price: 60 },
    { id: 'cat', slot: 'pet', name: 'Chat', price: 100 },
    { id: 'owl', slot: 'pet', name: 'Chouette savante', price: 120 },
    { id: 'fox', slot: 'pet', name: 'Renard', price: 150, level: 6 },
    { id: 'robot', slot: 'pet', name: 'Robot', price: 180 },
    { id: 'dragon', slot: 'pet', name: 'Dragon', price: 400, level: 15 },
    // --- Effets animés autour de l’avatar
    { id: 'snow', slot: 'aura', name: 'Neige', price: 70 },
    { id: 'sparkles', slot: 'aura', name: 'Étincelles', price: 80 },
    { id: 'notes', slot: 'aura', name: 'Notes de musique', price: 90 },
    { id: 'bubbles', slot: 'aura', name: 'Bulles', price: 90 },
    { id: 'hearts-fx', slot: 'aura', name: 'Cœurs flottants', price: 100 },
    { id: 'rainbow', slot: 'aura', name: 'Anneau arc-en-ciel', badge: 'daily7' },
    { id: 'fire', slot: 'aura', name: 'Aura de feu', price: 250, level: 10 },
    // --- Gestes : joués quand on touche l’avatar et après une bonne réponse
    { id: 'hop', slot: 'emote', name: 'Petit saut', price: 0 },
    { id: 'wave', slot: 'emote', name: 'Coucou', price: 30 },
    { id: 'laugh', slot: 'emote', name: 'Fou rire', price: 45 },
    { id: 'dance', slot: 'emote', name: 'Danse', price: 60 },
    { id: 'spin', slot: 'emote', name: 'Pirouette', price: 90 },
    { id: 'love', slot: 'emote', name: 'Pluie de cœurs', price: 120 },
    { id: 'flip', slot: 'emote', name: 'Salto', price: 150, level: 8 },
    { id: 'party', slot: 'emote', name: 'Fête', badge: 'combo10' },
    { id: 'win', slot: 'emote', name: 'Victoire', price: 70 },
  ].map((x) => (x.slot === 'emote' ? Object.assign(x, { id: 'e-' + x.id }) : x)); // ids de gestes préfixés (pas de collision avec le chapeau « party »)
  const SLOTS = { hat: 'Couvre-chefs', eyes: 'Lunettes', neck: 'Cou', bg: 'Fonds', pet: 'Compagnons', aura: 'Effets', emote: 'Gestes' };
  const ACC_SLOTS = ['hat', 'eyes', 'neck'];

  // ---------- Saisons (dates MM-JJ, bornes incluses ; une saison peut chevaucher le nouvel an) ----------
  const SEASONS = {
    automne: { name: 'Automne', from: '09-22', to: '12-20', when: 'du 22 septembre au 20 décembre' },
    halloween: { name: 'Halloween', from: '10-15', to: '11-05', when: 'du 15 octobre au 5 novembre' },
    noel: { name: 'Noël', from: '12-01', to: '01-06', when: 'du 1er décembre au 6 janvier' },
    ete: { name: 'Été', from: '06-21', to: '08-31', when: 'du 21 juin au 31 août' },
  };
  function seasonActive(id, d = new Date()) {
    const s = SEASONS[id]; if (!s) return false;
    const md = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to;
  }

  // ---------- Ensembles : posséder toutes les pièces donne un bonus unique ----------
  // Les pièces « look:cat:id » sont des options d’apparence
  // Ne pas y mettre d’objet de saison sans le signaler clairement (sinon l’ensemble n’est complétable qu’un an plus tard)
  const SETS = [
    { id: 'night', name: 'Nuit d’hiver', items: ['night', 'owl', 'snow'], bonus: 30 },
    { id: 'grad', name: 'Jeune diplômé', items: ['cap', 'look:outfit:gown', 'board'], bonus: 40 },
    { id: 'sport', name: 'Champion', items: ['sportcap', 'whistle', 'stadium', 'look:outfit:jersey', 'e-win'], bonus: 50 },
    { id: 'fantasy', name: 'Royaume enchanté', items: ['unicorn', 'amulet', 'castle', 'fairy'], bonus: 60 },
    { id: 'hero', name: 'Super-héros', items: ['cape', 'stars', 'e-flip'], bonus: 60 },
    { id: 'space', name: 'Explorateur de l’espace', items: ['visor', 'galaxy', 'robot'], bonus: 80 },
  ];

  const heartP = (x, y, s = 1) => `M${x} ${y + 4 * s}C${x - 9 * s} ${y - 2 * s} ${x - 4 * s} ${y - 8 * s} ${x} ${y - 3 * s}C${x + 4 * s} ${y - 8 * s} ${x + 9 * s} ${y - 2 * s} ${x} ${y + 4 * s}z`;
  const starP = (x, y, r) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, k = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${(x + k * Math.cos(a)).toFixed(1)} ${(y + k * Math.sin(a)).toFixed(1)}`; }).join('') + 'z';
  const ACC = {
    party: `<path d="M47 33 61 3l13 30z" fill="#e86aa6"/><path d="M52 23l14 4M56 14l10 3" stroke="#ffc300" stroke-width="2.4"/><circle cx="61" cy="3" r="3.4" fill="#ffc300"/>`,
    catears: `<path d="M38 38 41 16l14 12zM82 38 79 16 65 28z" fill="#25283a"/><path d="M41 33 43 21l7 6zM79 33 77 21l-7 6z" fill="#ff8fa3"/>`,
    flowers: [[39, 39, '#e86aa6'], [46, 31, '#ffc300'], [55, 27, '#3a86ff'], [65, 27, '#e86aa6'], [74, 31, '#ffc300'], [81, 39, '#3a86ff']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${c}"/><circle cx="${x}" cy="${y}" r="1.7" fill="#fff6c8"/>`).join('') + `<path d="M44 35q16-12 32 0" stroke="#2fae5c" stroke-width="2" fill="none"/>`,
    tophat: `<rect x="47" y="11" width="26" height="21" rx="2" fill="#14213d"/><rect x="47" y="25" width="26" height="5" fill="#d62839"/><ellipse cx="60" cy="32" rx="23" ry="4.5" fill="#0b132b"/>`,
    viking: `<path d="M39 30c-10-2-14-12-12-20 4 7 9 10 15 11zM81 30c10-2 14-12 12-20-4 7-9 10-15 11z" fill="#f4f1e6" stroke="#cfc6ad" stroke-width="1.2"/><path d="M36 40c0-17 10-23 24-23s24 6 24 23z" fill="#9ea7b5"/><rect x="34" y="36" width="52" height="7" rx="3" fill="#7a8396"/><circle cx="45" cy="39.5" r="1.4" fill="#e0a100"/><circle cx="60" cy="39.5" r="1.4" fill="#e0a100"/><circle cx="75" cy="39.5" r="1.4" fill="#e0a100"/>`,
    halo: `<g class="m-float"><ellipse cx="60" cy="15" rx="19" ry="5" fill="none" stroke="#ffe066" stroke-width="5" opacity=".45"/><ellipse cx="60" cy="15" rx="19" ry="5" fill="none" stroke="#ffc300" stroke-width="2.6"/></g>`,
    hearts: `<g fill="#e5484d" stroke="#a4161a" stroke-width="1.2" opacity=".92"><path d="${heartP(51, 55, 1.15)}"/><path d="${heartP(69, 55, 1.15)}"/></g><path d="M58 54h4M42 53l-5-2M78 53l5-2" stroke="#a4161a" stroke-width="1.8"/>`,
    stars: `<g fill="#ffc300" stroke="#c98f00" stroke-width="1.2"><path d="${starP(51, 55, 9)}"/><path d="${starP(69, 55, 9)}"/></g><path d="M59 55h2M42 53l-5-2M78 53l5-2" stroke="#c98f00" stroke-width="1.8"/><circle cx="51" cy="55" r="2.2" fill="${INK}"/><circle cx="69" cy="55" r="2.2" fill="${INK}"/>`,
    aviator: `<g fill="#2b3a55" fill-opacity=".85" stroke="#c98f00" stroke-width="1.6"><path d="M42 50h16v5c0 5-3 8-8 8s-8-3-8-8z"/><path d="M62 50h16v5c0 5-3 8-8 8s-8-3-8-8z"/></g><path d="M58 51.5h4M42 51l-5-1M78 51l5-1" stroke="#c98f00" stroke-width="1.6"/><path d="M45 53l4 5M65 53l4 5" stroke="rgba(255,255,255,.5)" stroke-width="1.6" stroke-linecap="round"/>`,
    visor: `<rect x="37" y="48" width="46" height="13" rx="6.5" fill="#1c9bd6" fill-opacity=".85" stroke="#14213d" stroke-width="2"/><rect class="m-scan" x="40" y="50" width="4" height="9" rx="2" fill="#bff1ff" opacity=".85"/>`,
    kerchief: `<path d="M46 86h28l-14 14z" fill="#d62839"/><circle cx="55" cy="90" r="1.3" fill="#fff"/><circle cx="64" cy="90" r="1.3" fill="#fff"/><circle cx="60" cy="95" r="1.3" fill="#fff"/>`,
    pearls: Array.from({ length: 11 }, (_, i) => { const x = 46 + i * 2.8, y = 98 - ((x - 60) / 14) ** 2 * 8; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1" fill="#f8f4ea" stroke="#d6cfbd" stroke-width=".6"/>`; }).join(''),
    cape: `<path d="M22 120c2-15 9-25 24-30l-5 30zM98 120c-2-15-9-25-24-30l5 30z" fill="#d62839"/><path d="M47 91q13 6 26 0" stroke="#ffc300" stroke-width="1.6" fill="none"/><circle cx="47" cy="91" r="3" fill="#ffc300"/><circle cx="73" cy="91" r="3" fill="#ffc300"/>`,
    lanyard: `<path d="M49 86l9 19M71 86l-9 19" stroke="#1f3a93" stroke-width="2.6"/><rect x="51" y="104" width="18" height="13" rx="2" fill="#fff" stroke="#1f3a93" stroke-width="1.5"/><rect x="54" y="107" width="5" height="6" fill="#9aa6c7"/><path d="M61 108h5M61 111h4" stroke="#9aa6c7" stroke-width="1.3"/>`,
    magnifier: `<circle cx="69" cy="55" r="9" fill="rgba(191,241,255,.35)" stroke="#8b5e3c" stroke-width="2.6"/><path d="M75 62l9 11" stroke="#8b5e3c" stroke-width="4" stroke-linecap="round"/><path d="M64 51q3-3 7-2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    quill: `<path d="M74 40C78 24 88 12 98 8c-2 10-8 22-20 32z" fill="#f4f4f7" stroke="#9aa6c7" stroke-width="1.2"/><path d="M76 38 95 11" stroke="#9aa6c7" stroke-width="1"/><path d="M74 40l-2 4" stroke="#1b1b2f" stroke-width="1.6"/>`,
    scales: `<path d="M50 86l10 12 10-12" stroke="#c98f00" stroke-width="1.8" fill="none"/><path d="M60 98v12M52 102h16" stroke="#c98f00" stroke-width="1.8"/><path d="M49 102l-3 6h6zM71 102l-3 6h6z" fill="#ffc300" stroke="#c98f00" stroke-width="1"/><circle cx="60" cy="98" r="1.8" fill="#ffc300"/>`,
    stopwatch: `<path d="M50 86l10 13 10-13" stroke="#1f3a93" stroke-width="2" fill="none"/><circle cx="60" cy="106" r="7.5" fill="#ffc300" stroke="#c98f00" stroke-width="1.8"/><rect x="58.5" y="96" width="3" height="3" fill="#c98f00"/><path d="M60 106v-4.5M60 106l3 2" stroke="#14213d" stroke-width="1.4" stroke-linecap="round"/>`,
    pumpkin: `<ellipse cx="60" cy="27" rx="21" ry="12" fill="#f2994a"/><path d="M49 17q-3 10 0 20M71 17q3 10 0 20M60 15v24" stroke="#d07a2a" stroke-width="1.6" fill="none"/><path d="M60 16c0-5 2-8 6-9" stroke="#2e9e55" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    santa: `<path d="M38 34C40 18 52 12 64 14c8 2 14 8 20 22-6-6-10-6-12-4z" fill="#d62839"/><rect x="36" y="31" width="48" height="8" rx="4" fill="#f4f4f7"/><circle cx="85" cy="37" r="4.5" fill="#f4f4f7"/>`,
    straw: `<ellipse cx="60" cy="32" rx="31" ry="6" fill="#e8c46a"/><path d="M44 32c0-12 7-16 16-16s16 4 16 16z" fill="#e1b65f"/><rect x="44" y="27" width="32" height="4" fill="#d62839"/>`,
    sweatband: `<rect x="37" y="36" width="46" height="7" rx="3.5" fill="#f4f4f7"/><path d="M40 39.5h40" stroke="#1c9bd6" stroke-width="2"/>`,
    sportcap: `<path d="M37 40c0-16 10-22 23-22s23 6 23 22z" fill="#d62839"/><path d="M62 38c10-1 24-1 31 4-7 2-21 2-31 0z" fill="#a4161a"/><circle cx="60" cy="18.5" r="2" fill="#a4161a"/>`,
    unicorn: `<path d="M56 30 62 4l4 26z" fill="#ffe066" stroke="#e0a100" stroke-width="1"/><path d="M57.5 24l7-2M58.5 18l6-2M60 12l4-1.4" stroke="#e0a100" stroke-width="1.2"/><path class="m-tw" d="${starP(70, 8, 3)}" fill="#e86aa6"/>`,
    whistle: `<path d="M50 86l10 13 10-13" stroke="#ffc300" stroke-width="2" fill="none"/><rect x="56" y="98" width="13" height="7" rx="3.5" fill="#8b93a7"/><circle cx="59" cy="101.5" r="4.6" fill="#b8c2d6"/>`,
    amulet: `<path d="M49 86q11 14 22 0" stroke="#8b5e3c" stroke-width="1.6" fill="none"/><path d="M60 97l6 6-6 8-6-8z" fill="#7b4dd6" stroke="#ffc300" stroke-width="1.6"/><path class="m-tw" d="${starP(62, 102, 2)}" fill="#fff"/>`,
    diamond: `<path d="M40 34q20-12 40 0l-3 4q-17-9-34 0z" fill="#c8d0e0" stroke="#8b93a7" stroke-width="1"/><path d="M60 14l7 9-7 9-7-9z" fill="#9fe3ff" stroke="#3a86ff" stroke-width="1.2"/><path d="M47 25l4 5-4 5-4-5zM73 25l4 5-4 5-4-5z" fill="#9fe3ff" stroke="#3a86ff" stroke-width="1"/><path class="m-tw" d="${starP(64, 17, 3)}" fill="#fff"/>`,
    cap: `<path d="M28 27 60 14l32 13-32 13z" fill="#14213d"/><path d="M44 31v8c0 3 7 5 16 5s16-2 16-5v-8l-16 7z" fill="#0b132b"/><path d="M60 27 86 30v12" stroke="#ffc300" stroke-width="2.2" fill="none"/><circle cx="86" cy="43" r="3" fill="#ffc300"/>`,
    beret: `<ellipse cx="55" cy="29" rx="26" ry="8.5" fill="#d62839"/><ellipse cx="55" cy="26.5" rx="21" ry="6" fill="#e5383b"/><circle cx="55" cy="20" r="2.6" fill="#d62839"/>`,
    beanie: `<path d="M35 40c0-18 11-24 25-24s25 6 25 24z" fill="#ffc300"/><rect x="33" y="36" width="54" height="9" rx="4" fill="#e0a100"/><circle cx="60" cy="14" r="5" fill="#f4f4f7"/>`,
    phones: `<path d="M35 54C33 20 87 20 85 54" stroke="#14213d" stroke-width="5" fill="none"/><rect x="30" y="47" width="9" height="16" rx="4" fill="#ffc300"/><rect x="81" y="47" width="9" height="16" rx="4" fill="#ffc300"/>`,
    wizard: `<path d="M36 34C46 26 52 4 66 0c-4 12 8 24 18 34z" fill="#3d2c8d"/><ellipse cx="60" cy="34" rx="30" ry="6" fill="#2b1f66"/><path d="m58 16 1.6 3.4 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#ffc300"/>`,
    crown: `<path d="M41 33V15l9.5 8 9.5-12 9.5 12 9.5-8v18z" fill="#ffc300" stroke="#e0a100" stroke-width="1.5"/><circle cx="60" cy="25" r="2.8" fill="#d62839"/><circle cx="48" cy="28" r="1.8" fill="#3a86ff"/><circle cx="72" cy="28" r="1.8" fill="#3a86ff"/>`,
    laurel: [200, 214, 228, 242, 256, 284, 298, 312, 326, 340].map((d) => { const r = (d * Math.PI) / 180, x = 60 + 27 * Math.cos(r), y = 50 + 27 * Math.sin(r); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5.5" ry="2.8" fill="${d < 270 ? '#2fae5c' : '#38c172'}" transform="rotate(${d + (d < 270 ? 60 : -60)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join(''),
    round: `<g fill="rgba(255,255,255,.2)" stroke="${INK}" stroke-width="2.2"><circle cx="51" cy="55" r="7"/><circle cx="69" cy="55" r="7"/><path d="M58 55h4M44 54l-6-2M76 54l6-2" fill="none"/></g>`,
    square: `<g fill="rgba(255,255,255,.2)" stroke="${INK}" stroke-width="2.2"><rect x="43" y="50" width="15" height="11" rx="2.5"/><rect x="62" y="50" width="15" height="11" rx="2.5"/><path d="M58 55h4M43 54l-5-2M77 54l5-2" fill="none"/></g>`,
    sun: `<rect x="42" y="50" width="16" height="10" rx="4.5" fill="${INK}"/><rect x="62" y="50" width="16" height="10" rx="4.5" fill="${INK}"/><path d="M58 54h4M42 53l-4-1M78 53l4-1" stroke="${INK}" stroke-width="2"/><path d="M45 53h5M65 53h5" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-linecap="round"/>`,
    monocle: `<circle cx="69" cy="55" r="8" fill="rgba(255,255,255,.18)" stroke="#e0a100" stroke-width="2.2"/><path d="M76 59c5 9 3 20-2 26" stroke="#e0a100" stroke-width="1.3" fill="none"/>`,
    bowtie: `<path d="M60 90 49 84v12zM60 90l11-6v12z" fill="#d62839"/><circle cx="60" cy="90" r="3" fill="#a4161a"/>`,
    tie: `<path d="M56 86h8l-2 5h-4z" fill="#ffc300"/><path d="M57.5 91h5l3.5 20-6 6-6-6z" fill="#ffc300"/><path d="M58 97l5 3M57 105l6 3" stroke="#e0a100" stroke-width="1.8"/>`,
    scarf: `<path d="M42 82c11 6 25 6 36 0l2 8c-13 7-27 7-40 0z" fill="#ffc300"/><path d="M68 87l3 22 8-1-4-22z" fill="#ffc300"/><path d="M48 86l2 6M57 88l1 7M66 87l1 7M70 96l7-1M71 104l7-1" stroke="#14213d" stroke-width="2"/>`,
    medal: `<path d="M51 84l9 16 9-16" fill="none" stroke="#3a86ff" stroke-width="4.5"/><circle cx="60" cy="104" r="7.5" fill="#ffc300" stroke="#e0a100" stroke-width="2"/><path d="m60 99.5 1.4 2.8 3.1.4-2.3 2.2.6 3-2.8-1.5-2.8 1.5.6-3-2.3-2.2 3.1-.4z" fill="#e0a100"/>`,
  };

  // ---------- Cheveux ----------
  function hairBack(style, c) {
    if (style === 'long') return `<path d="M35 50c-3 26 0 52 6 58h38c6-6 9-32 6-58z" fill="${c}"/>`;
    if (style === 'bob') return `<path d="M35 48c-2 16 0 28 5 33h40c5-5 7-17 5-33z" fill="${c}"/>`;
    if (style === 'ponytail') return `<path d="M78 36c16 4 20 26 12 46-3-14-7-24-14-30z" fill="${c}"/>`;
    if (style === 'bun') return `<circle cx="60" cy="21" r="9" fill="${c}"/>`;
    if (style === 'afro') return `<circle cx="60" cy="44" r="33" fill="${c}"/>`;
    if (style === 'braids') return `<g fill="${c}">${[58, 66, 74, 82, 90, 98].map((y, i) => `<circle cx="36" cy="${y}" r="${4.8 - i * 0.3}"/><circle cx="84" cy="${y}" r="${4.8 - i * 0.3}"/>`).join('')}</g><circle cx="36" cy="104" r="2.4" fill="#d62839"/><circle cx="84" cy="104" r="2.4" fill="#d62839"/>`;
    return '';
  }
  function hairFront(style, c) {
    switch (style) {
      case 'short': return `<path d="M37 52c-2-20 8-29 23-29s25 9 23 29c-2-8-6-13-12-15-6 4-17 5-26 1-5 3-7 8-8 14z" fill="${c}"/>`;
      case 'buzz': return `<path d="M38 46c1-14 10-21 22-21s21 7 22 21c-6-7-14-10-22-10s-16 3-22 10z" fill="${c}" opacity=".9"/>`;
      case 'long': return `<path d="M37 56c-4-22 7-33 23-33s27 11 23 33c-3-12-9-19-21-21-4 6-13 10-25 21z" fill="${c}"/>`;
      case 'bob': return `<path d="M37 52c-2-20 8-29 23-29s25 9 23 29c0-6-2-10-6-12H43c-4 2-6 6-6 12z" fill="${c}"/>`;
      case 'mohawk': return `<path d="M38 46c1-14 10-21 22-21s21 7 22 21c-6-7-14-10-22-10s-16 3-22 10z" fill="${c}" opacity=".35"/><path d="M53 38c-1-12 1-22 7-27 6 5 8 15 7 27-4-2-10-2-14 0z" fill="${c}"/>`;
      case 'braids':
      case 'bun':
      case 'ponytail': return `<path d="M38 48c0-16 9-23 22-23s22 7 22 23c-6-9-13-13-22-13s-16 4-22 13z" fill="${c}"/>`;
      case 'curly': return `<g fill="${c}">${[[39, 44], [42, 34], [50, 27], [60, 25], [70, 27], [78, 34], [81, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8"/>`).join('')}</g>`;
      case 'afro': return `<path d="M38 50c2-14 10-20 22-20s20 6 22 20c-6-6-14-9-22-9s-16 3-22 9z" fill="${c}"/>`;
      case 'spiky': return `<path d="M37 50l-2-16 9 5 2-14 8 9 6-13 6 13 8-9 2 14 9-5-2 16c-6-8-14-11-23-11s-17 3-23 11z" fill="${c}"/>`;
      default: return '';
    }
  }

  // ---------- Tenues ----------
  const TORSO = 'M22 120c2-20 14-30 38-31 24 1 36 11 38 31z';
  // Parties de tenue dessinées par-dessus le cou (col roulé, toge)
  function outfitTop(style, c) {
    if (style === 'turtleneck') return `<path d="M50 82h20v10c-6 3-14 3-20 0z" fill="${shade(c, -0.1)}"/><path d="M51 86h18M51 89h18" stroke="${shade(c, -0.28)}" stroke-width="1"/>`;
    if (style === 'gown') return `<path d="M51 88l-5 32h8l5-28zM69 88l5 32h-8l-5-28z" fill="#ffc300"/>`;
    return '';
  }
  function outfit(style, c, skin, uid) {
    const dark = shade(c, -0.18);
    const torso = `<path d="${TORSO}" fill="${c}"/>`;
    switch (style) {
      case 'stripes': return `<defs><clipPath id="t${uid}"><path d="${TORSO}"/></clipPath></defs><path d="${TORSO}" fill="#f4f4f7"/><g clip-path="url(#t${uid})" stroke="${c}" stroke-width="3.2">${[96, 103, 110, 117].map((y) => `<path d="M20 ${y}h80"/>`).join('')}</g><path d="M50 89c3 6 17 6 20 0" fill="${skin}" stroke="${c}" stroke-width="2"/>`;
      case 'turtleneck': return torso;
      case 'gown': return `<path d="${TORSO}" fill="${c === '#f4f4f7' ? '#25283a' : shade(c, -0.35)}"/><path d="M52 88l8 14 8-14z" fill="#fff"/>`;
      case 'hoodie': return `${torso}<path d="M42 90c4 10 32 10 36 0" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M55 98v10M65 98v10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
      case 'tshirt': return `${torso}<path d="M50 89c3 6 17 6 20 0" fill="${skin}" stroke="${dark}" stroke-width="2"/>`;
      case 'shirt': return `${torso}<path d="M50 88l10 12 10-12" fill="${skin}"/><path d="M48 87l12 8-6 8zM72 87l-12 8 6 8z" fill="#fff"/><path d="M60 100v20" stroke="${dark}" stroke-width="1.5"/><circle cx="60" cy="106" r="1.3" fill="${dark}"/><circle cx="60" cy="114" r="1.3" fill="${dark}"/>`;
      case 'blazer': return `${torso}<path d="M50 88l10 30 10-30z" fill="#fff"/><path d="M48 88l12 30-14-6-6-16zM72 88l-12 30 14-6 6-16z" fill="${dark}"/><circle cx="62" cy="112" r="1.6" fill="${INK}"/>`;
      case 'jersey': return `${torso}<path d="M50 89c3 6 17 6 20 0" fill="${skin}" stroke="#fff" stroke-width="2.5"/><text x="60" y="114" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="system-ui">10</text>`;
      default: return torso;
    }
  }
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
    return '#' + ((1 << 24) | (f(r) << 16) | (f(g) << 8) | f(b)).toString(16).slice(1);
  }

  // ---------- Visage ----------
  function face(mood, brow) {
    let eyes, mouth, brows;
    if (mood === 'happy') {
      eyes = `<path d="M47 56q4-5 8 0M65 56q4-5 8 0" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M52 65q8 9 16 0z" fill="${INK}"/><path d="M55 68q5 3 10 0" fill="#ff8fa3"/>`;
      brows = `<path d="M46 48q5-3 9-1M65 47q4-2 9 1" stroke="${brow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    } else if (mood === 'sad') {
      eyes = `<g class="m-eyes"><circle cx="51" cy="57" r="2.6" fill="${INK}"/><circle cx="69" cy="57" r="2.6" fill="${INK}"/></g>`;
      mouth = `<path d="M54 69q6-5 12 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      brows = `<path d="M46 49l9-3M74 49l-9-3" stroke="${brow}" stroke-width="2.4" stroke-linecap="round"/>`;
    } else if (mood === 'think') {
      eyes = `<g class="m-eyes"><circle cx="53" cy="53" r="2.7" fill="${INK}"/><circle cx="71" cy="53" r="2.7" fill="${INK}"/></g>`;
      mouth = `<path d="M55 67q4-2 9 1" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      brows = `<path d="M46 49q5-2 9-1M65 44q4-3 9-1" stroke="${brow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    } else {
      eyes = `<g class="m-eyes"><circle cx="51" cy="55" r="2.7" fill="${INK}"/><circle cx="69" cy="55" r="2.7" fill="${INK}"/><circle cx="52" cy="54" r=".9" fill="#fff"/><circle cx="70" cy="54" r=".9" fill="#fff"/></g>`;
      mouth = `<path d="M54 66q6 4.5 12 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      brows = `<path d="M46 48q5-2.5 9-1M65 47q4-1.5 9 1" stroke="${brow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
    const blush = mood === 'happy' ? `<ellipse cx="45" cy="62" rx="4" ry="2.4" fill="#ff8fa3" opacity=".55"/><ellipse cx="75" cy="62" rx="4" ry="2.4" fill="#ff8fa3" opacity=".55"/>` : '';
    return brows + eyes + blush + mouth;
  }

  // ---------- Fonds (dans le cadre) ----------
  const grad = (id, stops, radial) => `<defs><${radial ? 'radialGradient' : 'linearGradient'} id="${id}" ${radial ? '' : 'x1="0" y1="0" x2="0" y2="1"'}>${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</${radial ? 'radialGradient' : 'linearGradient'}></defs>`;
  const twinkles = (pts, col = '#fff') => pts.map(([x, y, r], i) => `<circle class="m-tw" style="animation-delay:${(i * 0.37) % 2}s" cx="${x}" cy="${y}" r="${r || 1.2}" fill="${col}"/>`).join('');
  const STARS = [[18, 30], [30, 18, 1.5], [96, 52], [104, 74, 1.5], [14, 64], [86, 14], [24, 92, 1], [106, 96, 1]];
  function background(id, uid) {
    const g = `g${uid}`, fill = `<rect width="120" height="120" fill="url(#${g})"/>`;
    switch (id) {
      case 'sky': return grad(g, ['#5cb8ff', '#d8f1ff']) + fill + `<g fill="#fff" class="m-drift"><ellipse cx="22" cy="36" rx="12" ry="5"/><ellipse cx="28" cy="32" rx="7" ry="5"/><ellipse cx="96" cy="26" rx="11" ry="4.5"/><ellipse cx="101" cy="22" rx="6" ry="4"/></g>`;
      case 'sunset': return grad(g, ['#ff6f61', '#ffa45c', '#ffd56b']) + fill + `<circle cx="92" cy="46" r="14" fill="#fff0b3" opacity=".9"/><path d="M0 70h30M90 64h30" stroke="#fff" stroke-width="2" opacity=".35"/>`;
      case 'night': return grad(g, ['#0b132b', '#2a3a7a']) + fill + `<circle cx="94" cy="28" r="9" fill="#fff3c4"/><circle cx="98" cy="25" r="8" fill="#101c40"/>` + twinkles(STARS);
      case 'board': return `<rect width="120" height="120" fill="#2f5d50"/><g fill="#e8f3ee" font-family="Georgia,serif" font-size="9" font-style="italic" opacity=".75"><text x="8" y="38">x²+y²</text><text x="90" y="34">π</text><text x="92" y="64">√2</text><text x="12" y="68">Σ</text><text x="84" y="90">a/b</text><text x="16" y="96">%</text></g>`;
      case 'library': {
        const cols = ['#d62839', '#1f3a93', '#ffc300', '#2e9e55', '#8e6ad8', '#f2994a'];
        const row = (y) => Array.from({ length: 22 }, (_, i) => { const h = 15 + ((i * 7) % 6); return `<rect x="${2 + i * 5.3}" y="${y - h}" width="4.4" height="${h}" fill="${cols[(i * 5) % 6]}"/>`; }).join('');
        return `<rect width="120" height="120" fill="#7a4b2a"/>${row(42)}${row(80)}<rect y="42" width="120" height="4" fill="#4a2c17"/><rect y="80" width="120" height="4" fill="#4a2c17"/>`;
      }
      case 'galaxy': return grad(g, ['#7a4ae0', '#2a1468', '#0d0626'], true) + fill + `<g class="m-rot"><ellipse cx="60" cy="60" rx="52" ry="14" fill="none" stroke="#c9a6ff" stroke-width="3" opacity=".35" transform="rotate(-24 60 60)"/><ellipse cx="60" cy="60" rx="40" ry="9" fill="none" stroke="#ff9ad5" stroke-width="2" opacity=".3" transform="rotate(30 60 60)"/></g>` + twinkles(STARS.concat([[50, 12], [70, 104, 1.4]]));
      case 'gold': return grad(g, ['#fff6c8', '#ffc300', '#d18d00'], true) + fill + `<g class="m-rot" opacity=".28" fill="#fff">${Array.from({ length: 12 }, (_, i) => `<path d="M60 60 ${(60 + 80 * Math.cos((i * Math.PI) / 6 - 0.1)).toFixed(1)} ${(60 + 80 * Math.sin((i * Math.PI) / 6 - 0.1)).toFixed(1)} ${(60 + 80 * Math.cos((i * Math.PI) / 6 + 0.1)).toFixed(1)} ${(60 + 80 * Math.sin((i * Math.PI) / 6 + 0.1)).toFixed(1)}z"/>`).join('')}</g>`;
      case 'chess': return `<rect width="120" height="120" fill="#f4ecd8"/><g fill="#5b3a26" opacity=".85">${Array.from({ length: 64 }, (_, i) => ((i % 8) + Math.floor(i / 8)) % 2 ? `<rect x="${(i % 8) * 15}" y="${Math.floor(i / 8) * 15}" width="15" height="15"/>` : '').join('')}</g><g fill="#14213d" opacity=".55"><path d="M14 104h12l-2-4h-8zM16 100l2-12h4l2 12zM20 88a3 3 0 1 0 0-.1z"/><path d="M96 104h12l-2-4h-8zM98 100l1-10 5-4 3 4-2 3 1 7z"/></g>`;
      case 'forest': return grad(g, ['#ffb26b', '#f6d9a8']) + fill + `<rect x="12" y="58" width="4" height="62" fill="#6b4226"/><rect x="104" y="56" width="4" height="64" fill="#6b4226"/><g fill="#c0582b"><circle cx="14" cy="50" r="14"/><circle cx="106" cy="46" r="15"/></g><g fill="#e0892f"><circle cx="24" cy="40" r="10"/><circle cx="96" cy="36" r="10"/></g>`;
      case 'snowland': return grad(g, ['#9fc7ff', '#eaf4ff']) + fill + `<g fill="#2e7d4f"><path d="M16 78 6 98h20zM16 66 8 84h16zM104 74l-10 20h20zM104 62l-8 18h16z"/></g><ellipse cx="30" cy="112" rx="50" ry="16" fill="#fff"/><ellipse cx="96" cy="110" rx="44" ry="14" fill="#f4f8ff"/>` + twinkles([[30, 20], [80, 14], [50, 30], [100, 34]], '#fff');
      case 'beach': return `<rect width="120" height="72" fill="#8fd3ff"/><rect y="70" width="120" height="20" fill="#1c9bd6"/><rect y="88" width="120" height="32" fill="#f2d48a"/><circle cx="94" cy="26" r="11" fill="#ffe066"/><path class="m-drift" d="M4 78q6-3 12 0t12 0M90 82q6-3 12 0t12 0" stroke="#fff" stroke-width="1.6" fill="none"/>`;
      case 'stadium': return grad(g, ['#14213d', '#1f3a93']) + fill + `<g>${Array.from({ length: 30 }, (_, i) => `<circle cx="${4 + (i % 15) * 8}" cy="${66 + Math.floor(i / 15) * 8}" r="2.4" fill="${['#ffc300', '#e5484d', '#f4f4f7', '#5cb8ff'][i % 4]}"/>`).join('')}</g><rect y="82" width="120" height="38" fill="#2e9e55"/><path d="M0 96h120" stroke="#fff" stroke-width="1.5" opacity=".7"/><circle class="m-tw" cx="14" cy="20" r="5" fill="#fff"/><circle class="m-tw" style="animation-delay:1s" cx="106" cy="20" r="5" fill="#fff"/>`;
      case 'castle': return grad(g, ['#c9a6ff', '#ffe3f1']) + fill + `<g fill="#8e6ad8" opacity=".85"><path d="M2 120V52h4v-5h4v5h4v-5h4v5h4v68z"/><path d="M96 120V48h4v-5h4v5h4v-5h4v5h4v72z"/></g><path d="M12 47V30M106 43V26" stroke="#5e3a8a" stroke-width="1.4"/><path d="M12 30l8 3-8 3zM106 26l8 3-8 3z" fill="#e86aa6"/>` + twinkles([[40, 14], [80, 18], [60, 8]], '#fff');
      default: return '';
    }
  }

  // ---------- Compagnons (posés sur le cadre, en bas à droite) ----------
  const eye = (x, y, r = 1.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
  const PETS = {
    chick: `<ellipse cx="0" cy="-1" rx="10" ry="10.5" fill="#ffd43b"/><path d="M-3-11c1-3 3-3 4 0 1-2 3-2 3 0" stroke="#f2b600" stroke-width="1.6" fill="none"/><ellipse cx="7" cy="2" rx="3.5" ry="2.4" fill="#f2b600" transform="rotate(-25 7 2)"/>${eye(-3.5, -2.5)}${eye(3, -2.5)}<path d="M-2.5 1h5L0 4.5z" fill="#f76b3c"/>`,
    cat: `<path d="M-9-3-8-14-2-9zM9-3 8-14 2-9z" fill="#8b93a7"/><path d="M-7.5-6-7-11.5-4-8.5zM7.5-6 7-11.5 4-8.5z" fill="#ff8fa3"/><circle cx="0" cy="0" r="10" fill="#8b93a7"/>${eye(-3.6, -1)}${eye(3.6, -1)}<path d="M-1.4 2.5h2.8L0 4.2z" fill="#ff8fa3"/><path d="M-3 7q3 2 6 0M-12 2l6 1M-12 5l6 0M12 2l-6 1M12 5l-6 0" stroke="${INK}" stroke-width=".8" fill="none"/>`,
    owl: `<path d="M-8-7-9-15-3-10zM8-7 9-15 3-10z" fill="#6b4226"/><ellipse cx="0" cy="0" rx="10.5" ry="11.5" fill="#8b5e3c"/><ellipse cx="0" cy="5" rx="6.5" ry="6" fill="#d9b38c"/><g class="m-pet-eyes"><circle cx="-4.2" cy="-3" r="4" fill="#fff"/><circle cx="4.2" cy="-3" r="4" fill="#fff"/>${eye(-4, -3, 2)}${eye(4, -3, 2)}</g><path d="M-1.6 0h3.2L0 3.4z" fill="#ffc300"/><path d="M-9-9h7v-2h4v2h7" stroke="#14213d" stroke-width="1.6" fill="none"/><rect x="-4" y="-14" width="8" height="2.6" fill="#14213d"/>`,
    fox: `<path d="M-10-13-4-7h8l6-6v11c0 8-5 12-10 13-5-1-10-5-10-13z" fill="#f2994a"/><path d="M-10-2c1 7 5 11 10 12-1-5-4-9-10-12zM10-2c-1 7-5 11-10 12 1-5 4-9 10-12z" fill="#fff"/><path d="M-8.5-10.5-5-7.5h-3zM8.5-10.5 5-7.5h3z" fill="#5e3a26"/>${eye(-4, -2)}${eye(4, -2)}<circle cx="0" cy="8.5" r="1.8" fill="${INK}"/>`,
    robot: `<path d="M0-10v-5" stroke="#8b93a7" stroke-width="1.6"/><circle class="m-tw" cx="0" cy="-16" r="2.2" fill="#e5484d"/><rect x="-10" y="-10" width="20" height="18" rx="5" fill="#c8d0e0" stroke="#8b93a7" stroke-width="1.4"/><rect x="-7" y="-6" width="14" height="6" rx="3" fill="#14213d"/><circle class="m-tw" cx="-3.5" cy="-3" r="1.5" fill="#5de0ff"/><circle class="m-tw" style="animation-delay:.4s" cx="3.5" cy="-3" r="1.5" fill="#5de0ff"/><path d="M-4 4h8" stroke="#8b93a7" stroke-width="1.4"/>`,
    dragon: `<path d="M-6-8-10-17-2-10zM6-8 10-17 2-10z" fill="#ffc300"/><circle cx="0" cy="-1" r="10" fill="#2fae5c"/><path d="M-4-11l2 3 2-4 2 4 2-3" fill="#1e8a46"/><ellipse cx="0" cy="4.5" rx="6.5" ry="4.2" fill="#5fd38d"/><circle cx="-2.2" cy="4" r=".9" fill="${INK}"/><circle cx="2.2" cy="4" r=".9" fill="${INK}"/><circle cx="-4" cy="-3" r="2.2" fill="#ffe066"/><circle cx="4" cy="-3" r="2.2" fill="#ffe066"/>${eye(-4, -3, 1)}${eye(4, -3, 1)}<path class="m-puff" d="M9 5c4-1 6 1 9-1-1 3-4 4-7 4" fill="#ff8a1f"/>`,
  };
  PETS.phoenix = `<path class="m-flick" d="M-6-8c-2-6 0-9 3-11 0 4 2 5 3 7 1-3 3-4 5-5-1 4 1 6 1 9z" fill="#ffc300"/><circle cx="0" cy="0" r="10" fill="#e5484d"/><path d="M-10 2c-5 2-7 6-6 10 3-3 6-4 8-4zM10 2c5 2 7 6 6 10-3-3-6-4-8-4z" fill="#ff8a1f"/><circle cx="-3.6" cy="-2" r="2" fill="#ffe066"/><circle cx="3.6" cy="-2" r="2" fill="#ffe066"/>${eye(-3.6, -2, 1)}${eye(3.6, -2, 1)}<path d="M-2 2h4L0 6z" fill="#ffc300"/>`;
  PETS.calcpet = `<rect x="-9" y="-11" width="18" height="22" rx="3.5" fill="#ffc300" stroke="#c98f00" stroke-width="1.4"/><rect x="-6.5" y="-8.5" width="13" height="6" rx="1.5" fill="#14213d"/><path d="M-4-5.5h3M1-5.5h3" stroke="#5de0ff" stroke-width="1.2"/>${[[-5, 2], [0, 2], [5, 2], [-5, 7], [0, 7], [5, 7]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#c98f00"/>`).join('')}<circle cx="-3" cy="-5.5" r=".01"/><path class="m-tw" d="${starP(10, -12, 2.5)}" fill="#fff"/>`;
  PETS.fairy = `<g class="m-flick" style="animation-duration:.25s"><ellipse cx="-6" cy="-3" rx="6" ry="9" fill="#bff1ff" opacity=".85" transform="rotate(-30 -6 -3)"/><ellipse cx="6" cy="-3" rx="6" ry="9" fill="#bff1ff" opacity=".85" transform="rotate(30 6 -3)"/></g><path d="M-5 10 0-2 5 10z" fill="#e86aa6"/><circle cx="0" cy="-5" r="5" fill="#f1c7a5"/><path d="M-5-6c0-4 2-6 5-6s5 2 5 6c-2-2-8-2-10 0z" fill="#e1b65f"/>${eye(-1.8, -4.5, 0.8)}${eye(1.8, -4.5, 0.8)}<path class="m-tw" d="${starP(9, -12, 2.5)}" fill="#ffc300"/>`;
  const pet = (id) => (PETS[id] ? `<g transform="translate(98 99)"><g class="m-pet"><ellipse cx="0" cy="12" rx="9" ry="2" fill="rgba(0,0,0,.18)"/>${PETS[id]}</g></g>` : '');

  // ---------- Effets animés ----------
  // back : derrière le cadre · clip : dans le cadre · front : devant tout
  const flames = Array.from({ length: 12 }, (_, i) => { const a = i * 30; return `<g transform="rotate(${a} 60 60) translate(60 4)"><path class="m-flick" style="animation-delay:${(i % 4) * 0.15}s" d="M0 10c-9-6-9-14 0-24 9 10 9 18 0 24z" fill="${i % 2 ? '#ffc300' : '#ff6a1f'}"/></g>`; }).join('');
  const AURA = {
    snow: { clip: Array.from({ length: 9 }, (_, i) => `<circle class="m-fall" style="animation-duration:${3 + (i % 3)}s;animation-delay:-${(i * 0.7).toFixed(1)}s" cx="${8 + i * 13}" cy="-4" r="${1.4 + (i % 3) * 0.5}" fill="#fff" opacity=".9"/>`).join('') },
    sparkles: { front: [[10, 22, 6], [110, 30, 5], [106, 90, 4], [14, 86, 5], [60, 2, 4]].map(([x, y, r], i) => `<path class="m-tw" style="animation-delay:${i * 0.4}s" d="${starP(x, y, r)}" fill="#ffc300"/>`).join('') },
    notes: { front: [['♪', 10, 70], ['♫', 106, 60], ['♪', 98, 26], ['♫', 18, 30]].map(([n, x, y], i) => `<text class="m-rise" style="animation-delay:${i * 0.6}s" x="${x}" y="${y}" font-size="13" font-weight="900" fill="#7b4dd6" text-anchor="middle">${n}</text>`).join('') },
    bubbles: { clip: Array.from({ length: 7 }, (_, i) => `<circle class="m-bub" style="animation-delay:-${(i * 0.55).toFixed(2)}s" cx="${12 + i * 16}" cy="124" r="${2.5 + (i % 3)}" fill="rgba(255,255,255,.35)" stroke="#9fe3ff" stroke-width="1"/>`).join('') },
    'hearts-fx': { front: [[12, 84], [108, 76], [100, 30], [18, 40]].map(([x, y], i) => `<path class="m-rise" style="animation-delay:${i * 0.55}s" d="${heartP(x, y, 0.75)}" fill="#e5484d"/>`).join('') },
    rainbow: { back: `<g class="m-rot">${['#e5484d', '#ff8a1f', '#ffc300', '#2fae5c', '#1c9bd6', '#7b4dd6'].map((c, i) => `<circle cx="60" cy="60" r="61" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="64 320" stroke-dashoffset="${-i * 64}"/>`).join('')}</g>` },
    letters: { front: [['A', 12, 78], ['B', 106, 66], ['C', 100, 26], ['é', 16, 34], ['?', 60, 8]].map(([l, x, y], i) => `<text class="m-rise" style="animation-delay:${i * 0.5}s" x="${x}" y="${y}" font-size="11" font-weight="900" font-family="Georgia,serif" fill="#2f80ed" text-anchor="middle">${l}</text>`).join('') },
    leaves: { clip: Array.from({ length: 8 }, (_, i) => `<ellipse class="m-fall" style="animation-duration:${4 + (i % 3)}s;animation-delay:-${(i * 0.8).toFixed(1)}s" cx="${8 + i * 15}" cy="-6" rx="3.5" ry="2" fill="${['#e0892f', '#c0582b', '#e1b65f'][i % 3]}"/>`).join('') },
    bats: { front: [[14, 24], [100, 18], [108, 60]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><path class="m-float" style="animation-delay:${i * 0.5}s" d="M0 0q-4-5-10-2 4 0 5 3 2-2 5-1 3-1 5 1 1-3 5-3-6-3-10 2z" fill="#25283a"/></g>`).join('') },
    magic: { back: `<g class="m-rot"><circle cx="60" cy="60" r="61" fill="none" stroke="#b38cff" stroke-width="2.5" stroke-dasharray="3 7"/><circle cx="60" cy="60" r="64" fill="none" stroke="#7b4dd6" stroke-width="1.2" opacity=".6"/></g>`, front: [[12, 30, 4], [108, 40, 3.5], [100, 100, 3], [18, 94, 3.5]].map(([x, y, r], i) => `<path class="m-tw" style="animation-delay:${i * 0.5}s" d="${starP(x, y, r)}" fill="#b38cff"/>`).join('') },
    embers: { front: [[16, 96], [104, 96], [30, 108], [90, 110], [60, 116]].map(([x, y], i) => `<circle class="m-rise" style="animation-delay:${i * 0.45}s" cx="${x}" cy="${y}" r="${2 + (i % 2)}" fill="${i % 2 ? '#ffc300' : '#ff6a1f'}"/>`).join('') },
    fire: { back: `<circle cx="60" cy="60" r="60" fill="#ff8a1f" opacity=".25" class="m-glow"/>${flames}` },
  };

  // ---------- Gestes ----------
  const EMOTE_FX = {
    wave: (skin, oc) => `<g class="m-hand" opacity="0"><path d="M86 120 93 84" stroke="${oc}" stroke-width="11" stroke-linecap="round"/><circle cx="93" cy="76" r="7" fill="${skin}"/><path d="M88 72v-7M92 70v-8M96 70v-7M99 74l3-4" stroke="${skin}" stroke-width="3" stroke-linecap="round"/></g>`,
    win: (skin, oc) => `<g class="m-hand" opacity="0"><path d="M86 120 92 82" stroke="${oc}" stroke-width="11" stroke-linecap="round"/><circle cx="92" cy="75" r="7.5" fill="${skin}"/><path d="M87 72h10" stroke="${shade(skin, -0.2)}" stroke-width="1.4"/></g>`,
    love: () => [[38, 30], [82, 26], [60, 16]].map(([x, y], i) => `<path class="m-fxh" style="animation-delay:${i * 0.12}s" opacity="0" d="${heartP(x, y, 0.9)}" fill="#e5484d"/>`).join(''),
    party: () => [['#e5484d', -40, -30], ['#ffc300', 40, -34], ['#2fae5c', -46, 6], ['#1c9bd6', 46, 4], ['#7b4dd6', -24, -50], ['#ff8a1f', 26, -50], ['#e86aa6', 0, -58], ['#2fae5c', -10, 40]].map(([c, dx, dy]) => `<rect class="m-fxc" opacity="0" style="--dx:${dx}px;--dy:${dy}px" x="58" y="50" width="5" height="3" rx="1" fill="${c}"/>`).join(''),
  };
  const emoteName = (id) => (id || 'e-hop').replace(/^e-/, '');

  // ---------- Assemblage ----------
  // opts : { look, equip, level, mood, size, cls, frame, emote, loop }
  // equip : { hat, eyes, neck, bg, pet, aura, emote } · emote : forcer un geste · loop : le rejouer en boucle (aperçu)
  function svg({ look = DEFAULT_LOOK, equip = {}, level = 1, mood = 'idle', size = 120, cls = '', frame = true, emote = null, loop = false, celebrate = false } = {}) {
    const L = Object.assign({}, DEFAULT_LOOK, look);
    const skin = get('skin', L.skin).color;
    const hc = get('hairColor', L.hairColor).color;
    const oc = get('outfitColor', L.outfitColor).color;
    const st = stageFor(level);
    const uid = Math.random().toString(36).slice(2, 8);
    const em = emoteName(emote || equip.emote);
    const aura = AURA[equip.aura] || {};
    // Le geste se joue seulement pour les grandes occasions (combo de 5+, niveau supérieur),
    // quand on touche l’avatar, ou en boucle dans l’aperçu de la boutique
    const emCls = loop ? `emote-${em} emote-loop` : celebrate ? `emote-${em}` : '';
    const beard = L.beard === 'full'
      ? `<path d="M38 56c1 18 10 28 22 28s21-10 22-28c-4 8-9 12-14 12-3-3-13-3-16 0-5 0-10-4-14-12z" fill="${hc}"/>`
      : L.beard === 'stubble' ? `<path d="M40 60c2 13 10 21 20 21s18-8 20-21c-4 6-10 9-20 9s-16-3-20-9z" fill="${hc}" opacity=".28"/>`
      : L.beard === 'mustache' ? `<path d="M49 64c4-4 8-4 11-1 3-3 7-3 11 1-3 3-8 3-11 1-3 2-8 2-11-1z" fill="${hc}"/>`
      : L.beard === 'goatee' ? `<path d="M54 72c1 7 11 7 12 0-3 2-9 2-12 0z" fill="${hc}"/>` : '';
    const acc = ACC_SLOTS.slice().reverse().map((s) => (equip[s] && ACC[equip[s]] ? `<g>${ACC[equip[s]]}</g>` : '')).join('');
    const sparks = st.id >= 3 ? [[14, 26], [104, 22], [110, 70]].map(([x, y]) => `<path d="m${x} ${y - 5} 1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#ffc300" class="m-spark"/>`).join('') : '';
    const fx = EMOTE_FX[em] ? EMOTE_FX[em](skin, oc) : '';
    return `<svg class="mascot avatar ${cls} mood-${mood} ${emCls}" data-emote="${em}" width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="Avatar">
      <defs><clipPath id="c${uid}"><circle cx="60" cy="60" r="56"/></clipPath></defs>
      ${aura.back || ''}
      ${frame || equip.bg ? `<circle cx="60" cy="60" r="56" fill="${st.bg}"/>` : ''}
      <g clip-path="url(#c${uid})">${equip.bg ? background(equip.bg, uid) : ''}<g class="m-body">
        ${outfit(L.outfit, oc, skin, uid)}
        ${hairBack(L.hair, hc)}
        <path d="M53 74h14v16c-3 3-11 3-14 0z" fill="${shade(skin, -0.12)}"/>
        ${outfitTop(L.outfit, oc)}
        <circle cx="38" cy="56" r="5" fill="${skin}"/><circle cx="82" cy="56" r="5" fill="${skin}"/>
        <ellipse cx="60" cy="53" rx="22" ry="25" fill="${skin}"/>
        ${beard}
        ${face(mood, shade(hc, -0.1))}
        ${hairFront(L.hair, hc)}
        ${acc}
        ${em === 'wave' || em === 'win' ? fx : ''}
      </g>${aura.clip || ''}</g>
      ${frame ? `<circle cx="60" cy="60" r="56" fill="none" stroke="${st.ring}" stroke-width="4"/>` : ''}
      ${sparks}
      ${aura.front || ''}
      ${pet(equip.pet)}
      ${em !== 'wave' && em !== 'win' ? fx : ''}
      ${mood === 'think' ? `<g class="m-think"><circle cx="90" cy="26" r="2.6" fill="#fff" stroke="${INK}" stroke-width="1"/><circle cx="98" cy="17" r="3.6" fill="#fff" stroke="${INK}" stroke-width="1"/><circle cx="108" cy="7" r="5" fill="#fff" stroke="${INK}" stroke-width="1"/></g>` : ''}
    </svg>`;
  }

  // Aperçu d’un objet porté par l’avatar (look et autres objets conservés)
  const preview = (itemId, look, equip = {}, opts = {}) => {
    const it = ITEMS.find((x) => x.id === itemId);
    return svg(Object.assign({ look, equip: Object.assign({}, equip, { [it.slot]: it.id }), size: 84, frame: true, loop: it.slot === 'emote' }, opts));
  };

  // Joue un geste sur un avatar déjà affiché
  function play(el, emoteId) {
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const em = emoteName(emoteId || ('e-' + (el.dataset.emote || 'hop')));
    el.classList.forEach((c) => { if (c.startsWith('emote-')) el.classList.remove(c); });
    void el.getBoundingClientRect();
    el.classList.add('emote-' + em);
    clearTimeout(el._emT);
    el._emT = setTimeout(() => el.classList.remove('emote-' + em), 1700);
  }

  TM.mascot = { svg, preview, play, SEASONS, seasonActive, SETS, stageFor, STAGES, ITEMS, SLOTS, ACC_SLOTS, LOOK, LOOK_LABELS, DEFAULT_LOOK };
})();
