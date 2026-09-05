// The replacement renderSidebar(), shared by the build-system patch and the
// E: monolith patch so both get byte-identical code.
//
// Chapter and letter rows carry the real `.sb-item` class, so they inherit the
// standard sidebar styling and cannot drift from it. Navigation is bound only to
// rows that have a data-v, which is what lets a toggle row share the class without
// also jumping the deck.
module.exports.OLD_MARKER = 'function renderSidebar(){';

module.exports.NEW_FN = `function renderSidebar(){
  const sb = $('#sidebar');
  const idx = Deck.getIndices();
  const t = topicOf(idx.h);
  if (!t){ sb.innerHTML = ''; return; }

  let html = \`<div class="sb-title">\${t.name}</div>\`;
  t.indices.forEach(h => {
    const sec = stackAt(h);
    const label = sec.dataset.sub || sec.dataset.topicName || 'Section';
    const active = (h === idx.h);
    html += \`<button class="sb-item\${active ? ' active' : ''}" data-h="\${h}" data-v="0">\${label}</button>\`;
    if (!active) return;

    const steps = $$(':scope > section', sec);
    const grouped = steps.some(s => s.dataset.group);

    /* Flat list — every stack except Model Letters. Unchanged behaviour. */
    if (!grouped){
      steps.forEach((st, v) => {
        const nm = stepLabel(sec, st, v);
        html += \`<button class="sb-item step\${v === idx.v ? ' active' : ''}" data-h="\${h}" data-v="\${v}">\${v+1}. \${nm}</button>\`;
      });
      return;
    }

    /* Accordion — Chapter > Letter > parts. Model Letters is one stack of 68
       vertical slides, which as a flat list is 68 unusable rows. */
    const cur = steps[idx.v] || {};
    const curGroup = (cur.dataset || {}).group || null;
    const curItem  = (cur.dataset || {}).item  || null;
    const openGroup = sbOpen.group !== null ? sbOpen.group : curGroup;
    const openItem  = sbOpen.item  !== null ? sbOpen.item  : curItem;

    const groups = [];
    steps.forEach((st, v) => {
      const g = st.dataset.group || 'Autres';
      const it = st.dataset.item || '';
      let G = groups.find(x => x.name === g);
      if (!G){ G = { name: g, items: [] }; groups.push(G); }
      let I = G.items.find(x => x.name === it);
      if (!I){ I = { name: it, steps: [] }; G.items.push(I); }
      I.steps.push({ v, name: st.dataset.step || ('Step ' + (v+1)) });
    });

    groups.forEach(G => {
      const gOpen = (G.name === openGroup);
      html += \`<button class="sb-item sb-group\${gOpen ? ' open' : ''}\${G.name === curGroup ? ' here' : ''}" data-group="\${G.name}">\${G.name}</button>\`;
      if (!gOpen) return;
      G.items.forEach(I => {
        const iOpen = (I.name === openItem);
        html += \`<button class="sb-item sb-group sb-sub\${iOpen ? ' open' : ''}\${I.name === curItem ? ' here' : ''}" data-group="\${G.name}" data-item="\${I.name}">\${I.name}</button>\`;
        if (!iOpen) return;
        I.steps.forEach(s => {
          // drop the "Ch 3 — " prefix; the chapter is already the row above
          const nm = s.name.replace(/^.*?\\u2014\\s*/, '');
          html += \`<button class="sb-item step part\${s.v === idx.v ? ' active' : ''}" data-h="\${h}" data-v="\${s.v}">\${nm}</button>\`;
        });
      });
    });
  });
  html += \`<div class="sb-divider"></div><div class="sb-title">Progress — \${topicPct(t)}%</div>\`;
  sb.innerHTML = html;

  /* Only rows with a data-v navigate. Chapter and letter rows share the .sb-item
     class purely for styling, so this selector is what keeps them inert. */
  $$('.sb-item[data-v]', sb).forEach(b => b.addEventListener('click', () => {
    Deck.slide(parseInt(b.dataset.h,10), parseInt(b.dataset.v,10));
  }));
  /* Toggle rows only open/close. They must NOT move the deck — a toggle that also
     jumped the slide would make the accordion unusable during a live lesson. */
  $$('.sb-group', sb).forEach(b => b.addEventListener('click', () => {
    if (b.dataset.item){
      sbOpen.group = b.dataset.group;
      sbOpen.item = (sbOpen.item === b.dataset.item) ? '' : b.dataset.item;
    } else {
      sbOpen.group = (sbOpen.group === b.dataset.group) ? '' : b.dataset.group;
      sbOpen.item = null;
    }
    renderSidebar();
  }));
}
`;

module.exports.STEPS = "/* Sidebar step labels: English for every topic EXCEPT La Lettre, whose steps\n   are already English. Lookup normalises apostrophes (’ vs ') because the two\n   forms are mixed across the content files. */\nconst SB_STEP_EN = {\"Description\":\"Description\",\"Formation\":\"How to Form\",\"Exceptions\":\"Exceptions\",\"Pièges\":\"Common Mistakes\",\"Exemples\":\"Examples\",\"En contexte\":\"In Context\",\"Pratique QCM\":\"MCQ Practice\",\"Pratique — à compléter\":\"Fill-in-the-blanks Practice\",\"Usages\":\"Usage\",\"Mémo visuel\":\"Visual Memory Aid\",\"En application\":\"In Practice\",\"Galerie visuelle\":\"Visual Gallery\",\"Tableau de référence\":\"Reference Table\",\"Examen CBSE\":\"CBSE Exam\",\"Check-list\":\"Checklist\",\"Cartes mémoire\":\"Flashcards\",\"Bienvenue\":\"Welcome\",\"Les 8 étapes\":\"The 8 Steps\",\"Les 3 groupes\":\"The 3 Groups\",\"La ligne du temps\":\"Timeline\",\"Laboratoire de conjugaison\":\"Conjugation Lab\",\"Examen CBSE — tous les temps\":\"CBSE Exam — All Tenses\",\"Check-list de l’examen\":\"Exam Checklist\",\"Arbre de décision\":\"Decision Tree\",\"Pourquoi mélanger\":\"Why Mix Them\",\"Identifier le sujet\":\"Identify the Topic\",\"Mélange 1 — QCM\":\"Mixed 1 — MCQ\",\"Mélange 2 — à compléter\":\"Mixed 2 — Fill in the Blanks\",\"Les pièges les plus coûteux\":\"The Costliest Traps\",\"Stratégie de l’examen\":\"Exam Strategy\",\"Bonne chance\":\"Good Luck\",\"Usages · La routine\":\"Usage: Daily Routine\",\"Usages · Maintenant\":\"Usage: Happening Now\",\"Usages · Vérités générales\":\"Usage: General Truths\",\"Usages · Les instructions\":\"Usage: Instructions\",\"Usages · Conseils & invitations\":\"Usage: Advice & Invitations\",\"Usages · La description\":\"Usage: Description & Background\",\"Usages · L’habitude passée\":\"Usage: Past Habits\",\"Usages · L’action interrompue\":\"Usage: Interrupted Action\",\"Usages · L’événement terminé\":\"Usage: A Completed Event\",\"Usages · La suite d’actions\":\"Usage: A Sequence of Actions\",\"Usages · Le résultat présent\":\"Usage: Present Result\",\"Usages · Le passé du passé\":\"Usage: The Past Before the Past\",\"Usages · Le regret & l’explication\":\"Usage: Regret & Explanation\",\"Usages · Projets & prédictions\":\"Usage: Plans & Predictions\",\"Usages · Promesses & conseils\":\"Usage: Promises & Advice\",\"Usages · Après quand & dès que\":\"Usage: After quand & dès que\",\"Usages · Fini avant un moment futur\":\"Usage: Finished Before a Future Moment\",\"Usages · La supposition\":\"Usage: Supposition\",\"Usages · La politesse\":\"Usage: Politeness\",\"Usages · L’hypothèse\":\"Usage: Hypotheses\",\"Usages · Conseils & nouvelles\":\"Usage: Advice & News\",\"Usages · La routine quotidienne\":\"Usage: Daily Routine\",\"Usages · Le sens réciproque\":\"Usage: Reciprocal Meaning\",\"Usages · Volonté & Désir\":\"Usage: Will & Desire\",\"Usages · L’Émotion\":\"Usage: Emotion\",\"Usages · La Nécessité\":\"Usage: Necessity\",\"Usages · Doute & Négation\":\"Usage: Doubt & Negation\",\"Usages · Les conjonctions déclencheurs\":\"Usage: Trigger Conjunctions\",\"Usages · Refuser & démentir\":\"Usage: Refusing & Denying\",\"Usages · La fréquence zéro\":\"Usage: Never — Zero Frequency\",\"Usages · Ce qui a changé\":\"Usage: What Has Changed\",\"Usages · Zéro chose\":\"Usage: Nothing — Zero Things\",\"Usages · Zéro personne\":\"Usage: Nobody — Zero People\",\"Usages · La restriction\":\"Usage: Only — Restriction\",\"Usages · Refuser deux choses\":\"Usage: Refusing Two Things\",\"Usages · Éviter la répétition\":\"Usage: Avoiding Repetition\",\"Usages · À qui on parle\":\"Usage: Who You Speak To\",\"Usages · Le lieu où l’on va\":\"Usage: Where You Go\",\"Usages · Les quantités\":\"Usage: Quantities\",\"Usages · Insister & après une préposition\":\"Usage: Emphasis & After a Preposition\",\"Usages · Deux pronoms ensemble\":\"Usage: Two Pronouns Together\",\"Usages · Décrire qui fait l’action\":\"Usage: Describing Who Acts\",\"Usages · Décrire ce qu’on subit\":\"Usage: Describing What Receives\",\"Usages · Le lieu et le moment\":\"Usage: Place & Time\",\"Usages · Quand le verbe demande DE\":\"Usage: When the Verb Needs DE\",\"Usages · Après une préposition\":\"Usage: After a Preposition\",\"Usages · Rapporter une affirmation\":\"Usage: Reporting a Statement\",\"Usages · Rapporter une question\":\"Usage: Reporting a Question\",\"Usages · Rapporter un ordre\":\"Usage: Reporting an Order\",\"Usages · Quand le verbe introducteur est au passé\":\"Usage: When the Reporting Verb Is Past\",\"Usages · Les repères de temps changent\":\"Usage: Time Markers Change\",\"Usages · La question passe-partout\":\"Usage: The All-Purpose Question\",\"Usages · Le registre formel\":\"Usage: The Formal Register\",\"Usages · Une personne ou une chose\":\"Usage: A Person or a Thing\",\"Usages · Demander les circonstances\":\"Usage: Asking About Circumstances\",\"Usages · Choisir dans un ensemble\":\"Usage: Choosing From a Set\",\"Usages · Demander une quantité\":\"Usage: Asking How Many\",\"Usages · Présenter ce qui est à soi\":\"Usage: Saying What Is Yours\",\"Usages · Comparer sans répéter\":\"Usage: Comparing Without Repeating\",\"Usages · Montrer du doigt\":\"Usage: Pointing at Things\",\"Usages · Celui de, celui qui\":\"Usage: celui de, celui qui\",\"Usages · Celui-ci ou celui-là\":\"Usage: celui-ci or celui-là\"};\nconst sbNorm = s => String(s || '').replace(/[’ʼ`]/g, \"'\");\nconst SB_STEP_LOOKUP = {};\nObject.keys(SB_STEP_EN).forEach(k => { SB_STEP_LOOKUP[sbNorm(k)] = SB_STEP_EN[k]; });\nfunction stepLabel(sec, st, v){\n  const raw = st.dataset.step || ('Step ' + (v + 1));\n  if (sec.dataset.topic === 'lettre') return raw;\n  return SB_STEP_LOOKUP[sbNorm(raw)] || raw;\n}\n";

module.exports.STATE = `/* Sidebar accordion state. null = follow the current slide; a string = the user
   explicitly opened that chapter/letter; '' = the user explicitly closed it. */
const sbOpen = { group: null, item: null };
`;

/* Deliberately minimal: chapter and letter rows already inherit everything from
   .sb-item. Only the disclosure caret and the indent are added, and the caret uses
   the same ::before convention the existing .sb-item.step dot uses. No count badge —
   a pill sitting against "Ch 2" read as "Ch 22" and looked like a square button. */
module.exports.CSS = `/* ===== SIDEBAR ACCORDION (Model Letters) ===== */
.sb-group{ position:relative; padding-left:22px; }
.sb-group::before{
  content:'\\203A'; position:absolute; left:9px; top:50%;
  transform:translateY(-50%); transition:transform .15s ease;
  color:var(--text-muted); font-weight:700; line-height:1;
}
.sb-group.open::before{ transform:translateY(-50%) rotate(90deg); }
.sb-group.here{ color:var(--heading-color); }
.sb-sub{ padding-left:34px; font-size:.79rem; font-weight:500; }
.sb-sub::before{ left:21px; }
.sb-item.step.part{ padding-left:46px; }
.sb-item.step.part::before{ left:35px; }
@media print{ .sb-group{ display:none !important; } }
`;
