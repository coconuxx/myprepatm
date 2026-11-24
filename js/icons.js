// Icônes SVG (trait, couleur héritée) — remplacent les emoji décoratifs
(function () {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    exam: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.2 7 22l5-3 5 3-1.2-8.8"/>',
    flame: '<path d="M12 22c4.1 0 7-2.9 7-7 0-3.6-2.4-5.6-3.6-8.6-.9 1.9-2 2.9-3.1 3.1.2-3.2-1.1-5.6-3.3-7.5-.2 4.6-5 6.6-5 13 0 4.1 3.4 7 8 7z"/>',
    heart: '<path d="M12 21s-7.2-4.6-9.6-9.2A5.5 5.5 0 0 1 12 6.2a5.5 5.5 0 0 1 9.6 5.6C19.2 16.4 12 21 12 21z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    mute: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
    history: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    snow: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17"/><path d="m9 3.5 3 2 3-2M9 20.5l3-2 3 2"/>',
    half: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    sprout: '<path d="M12 21v-9M12 12C12 8 9 5 4 5c0 4 3 7 8 7zM12 14c0-3 2.5-6 8-6 0 4-3 6-8 6z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    // rayons de la boutique
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    shirt: '<path d="M8 3 3.5 6l2 4.5L8 9.5V21h8V9.5l2.5 1 2-4.5L16 3c-.8 1.8-2.2 2.8-4 2.8S8.8 4.8 8 3z"/>',
    glasses: '<circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14h4M3 13l1.5-6M21 13l-1.5-6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    paw: '<circle cx="6.5" cy="10" r="2"/><circle cx="10" cy="5.5" r="2"/><circle cx="14" cy="5.5" r="2"/><circle cx="17.5" cy="10" r="2"/><path d="M12 12c-3 0-6 3.5-6 6 0 2 2 2.5 3 2s2-1 3-1 2 .5 3 1 3 0 3-2c0-2.5-3-6-6-6z"/>',
    sparkle: '<path d="M12 3c.8 4.5 3.5 7.2 8 8-4.5.8-7.2 3.5-8 8-.8-4.5-3.5-7.2-8-8 4.5-.8 7.2-3.5 8-8z"/><path d="M19 3v4M17 5h4"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5A6 6 0 0 1 5 18l-2.5-4.5a1.5 1.5 0 0 1 2.6-1.5L8 15"/>',
    // sous-tests
    comprehension: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 9h2M9 13h6M9 17h6"/>',
    calcul: '<path d="M4.5 7h5M7 4.5v5M14.5 7h5M5 15l4 4M9 15l-4 4M14.5 17h5M17 14.2h.01M17 19.8h.01"/>',
    argumentation: '<path d="M12 3v17M7 20h10M5 6.5 12 5l7 1.5"/><path d="M5 6.5 2.5 12.5a2.5 2.5 0 0 0 5 0zM19 6.5l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
    cm: '<path d="m3.5 5.5 1.5 1.5 2.5-2.5M3.5 11.5 5 13l2.5-2.5M3.5 17.5 5 19l2.5-2.5M11 6h9.5M11 12h9.5M11 18h6"/>',
    expression: '<path d="M20.2 3.8a6 6 0 0 0-8.5 0L5 10.5V19h8.5l6.7-6.7a6 6 0 0 0 0-8.5z"/><path d="M16 8 2 22M17.5 15H9"/>',
    logique: '<path d="M12 5a3 3 0 0 0-5.8-1A3 3 0 0 0 4 9a3 3 0 0 0 0 5 3 3 0 0 0 3 5 3 3 0 0 0 5 0zM12 5a3 3 0 0 1 5.8-1A3 3 0 0 1 20 9a3 3 0 0 1 0 5 3 3 0 0 1-3 5 3 3 0 0 1-5 0zM12 5v14M8 9.5h1.5M14.5 14H16"/>',
  };
  TM.icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ''}</svg>`;
  // Pièce de monnaie (pleine, dorée)
  TM.coin = (cls = '') => `<svg class="coin ${cls}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#ffc800"/><circle cx="12" cy="12" r="7" fill="none" stroke="#e0a800" stroke-width="1.6"/><path d="M12 8.2v7.6M9.8 10.2h3.4a1.4 1.4 0 0 1 0 2.8h-2.4a1.4 1.4 0 0 0 0 2.8h3.4" fill="none" stroke="#b37f00" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  // Les sous-tests utilisent désormais des icônes SVG
  TM.FORMAT.subtests.forEach((s) => { s.icon = TM.icon(s.id); });
  document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = TM.icon(el.dataset.icon); });
})();
