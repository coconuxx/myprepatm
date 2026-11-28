// Typographie française à l'affichage : espace insécable fine avant % € ? ! : ; » et après «,
// apostrophe courbe (’) entre deux lettres. Évite par exemple « 60 » en fin de ligne et « % » seul à la ligne suivante.
// Ne touche qu'au texte affiché (jamais aux champs de saisie, ni au code) : les réponses restent comparées par leur numéro.
(function () {
  const NB = ' ';
  const SKIP = /^(INPUT|TEXTAREA|SCRIPT|STYLE|CODE|PRE)$/;
  function fix(t) {
    return t
      .replace(/(\S) ([%€?!:;»])/g, `$1${NB}$2`)
      .replace(/« /g, `«${NB}`)
      .replace(/([A-Za-zÀ-ÖØ-öø-ÿ])'([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1’$2');
  }
  function walk(root) {
    if (root.nodeType === 3) { const v = fix(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; return; }
    if (root.nodeType !== 1 || SKIP.test(root.nodeName) || root.isContentEditable) return;
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentNode && SKIP.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let n = it.nextNode(); n; n = it.nextNode()) { const v = fix(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  }
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'characterData') walk(m.target);
      else m.addedNodes.forEach(walk);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  walk(document.body);
  TM.typo = { fix };
})();
