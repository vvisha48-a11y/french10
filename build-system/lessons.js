// Visual redesign of the 18 instructional slides (The Format, Useful Phrases,
// The Tone, Exam Practice).
//
// Same knowledge, far fewer words: the prose is replaced by stat tiles, do/don't
// tables, flow steps, bar charts and callouts. All explanation is in English;
// French appears only where it IS the thing being taught — model phrases, target
// vocabulary, grammar examples.
const VISUALS = require('./lm-visuals.js');
const EN = require('./lesson-labels.js');

const esc = v => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* Diagram with its explanatory labels swapped to English. French examples inside
   the diagram are untouched — they are not in the map. */
function diagram(name){
  const fn = VISUALS[name];
  if (!fn) return '';
  let svg = fn();
  Object.keys(EN).forEach(fr => {
    svg = svg.split('>' + fr + '<').join('>' + EN[fr] + '<');
  });
  return '            <figure class="ls-fig">' + svg + '</figure>\n';
}

/* ---------------- components ---------------- */
// Moved to components.js so Les Messages renders them identically. Behaviour is
// unchanged: blueprint() defaults to the letter rail when no step list is passed.
const C = require('./components.js');
const { tiles, bullets, callout, doDont, flow, phrases, bars, blueprint } = C;

/* Exam years per chart row, derived from the CBSE tags already in letterdata.js —
   the same source the q-tag badges use, so the chart cannot drift from the tags. */
const TOPIC_LETTERS = {
  'Health — a sick friend': ['let-malade'],
  'French political system': ['let-politique-fr'],
  'Library or a book': ['let-biblio'],
  'School system': ['let-edu-fr'],
  'Hobbies': ['let-loisirs'],
  'Work': ['let-chomage', 'let-nouveau-job'],
  'Media': ['let-emission'],
  'Environment': ['let-environnement']
};
function topicYears(letters, label){
  const ids = TOPIC_LETTERS[label] || [];
  const ys = [];
  ids.forEach(id => {
    const t = letters.find(x => x.id === id);
    (t && t.years || []).forEach(y => {
      const n = String(y).replace(/[^0-9]/g, '');
      if (n && ys.indexOf(n) === -1) ys.push(n);
    });
  });
  ys.sort();
  return { n: ys.length, text: ys.length ? 'CBSE ' + ys.join(', ') : 'not yet asked' };
}

/* ---------------- per-slide layouts ---------------- */
const L = {};

/* ===== THE FORMAT ===== */
L['pourquoi'] = () =>
  tiles([
    { n: '10', label: 'marks, every year', tone: 'gold' },
    { n: '80', label: 'words, about', tone: 'blue' },
    { n: '1 of 3', label: 'topics — you choose', tone: 'green' },
    { n: '30', label: 'words already written', tone: 'purple' }
  ]) +
  bullets([
    { icon: '🔁', text: 'The topic changes. <b>The structure never does.</b>' },
    { icon: '📋', text: 'The examiner ticks a list: format · tone (<i lang="fr">tu</i>) · content · grammar · ~80 words.' }
  ]) +
  callout('tip', '💡 Pro tip', 'Learn the skeleton and the set phrases by heart. About <b>30 of your 80 words</b> are written before you even see the topic.');

L['squelette'] = () =>
  diagram('skeleton') +
  callout('tip', '💡 Pro tip', 'Draw this frame <b>before</b> you write. Two minutes, and it protects the marks that do not depend on your French at all.');

L['lieu-date'] = t => {
  const rows = (t.compare && t.compare.rows || []).map(r => ({
    good: esc(r.good), bad: esc(r.bad), note: esc(r.why.en)
  }));
  return diagram('datebar') + doDont('✓ Write this', '✗ Not this', rows);
};

L['appel-signature'] = () =>
  diagram('salute') +
  tiles([
    { n: 'Cher', label: 'to a boy', tone: 'blue' },
    { n: 'Chère', label: 'to a girl', tone: 'purple' },
    { n: 'Chers', label: 'group, male or mixed', tone: 'green' },
    { n: 'Chères', label: 'group, all female', tone: 'gold' }
  ]) +
  callout('danger', '⛔ Costs you marks', 'First name only. <b>Never</b> a surname, never a title — “Marc Dupont” or “M. Dupont” turns a friendly letter into a formal one.');

L['budget'] = () =>
  diagram('budget') +
  bars([
    { label: 'Opening', v: 15, tone: 'blue' },
    { label: 'Body', v: 50, tone: 'green' },
    { label: 'Closing', v: 15, tone: 'gold' }
  ], 50, ' words') +
  callout('tip', '💡 Pro tip', 'Opening and closing are memorised, so they cost no thinking time. Only the <b>50-word body</b> changes with the topic.');

L['entrainement'] = () => '';   // quiz slide — the quiz itself is the content

/* ===== USEFUL PHRASES ===== */
L['ouvrir'] = () => blueprint(0) +
  phrases([
    { tag: 'Safest — works for any topic', tone: 'green', fr: 'Comment vas-tu ? J’espère que cette lettre te trouvera en bonne santé.', en: 'How are you? I hope this letter finds you in good health.' },
    { tag: 'Shorter, very natural', tone: 'blue', fr: 'Comment ça va ? Moi, je vais bien ici.', en: 'How are things? I’m well here.' },
    { tag: 'When your friend wrote first', tone: 'purple', fr: 'J’ai reçu ta lettre dans laquelle tu m’as demandé…', en: 'I got your letter in which you asked me…' }
  ]) +
  callout('tip', '💡 Two marks in one', '<i lang="fr">dans laquelle</i> is a compound relative pronoun — Section C grammar. One memorised sentence earns marks in <b>two</b> places.');

L['annoncer'] = () => blueprint(1) +
  callout('tip', '🎯 One sentence, between greeting and content', 'It proves to the examiner that you understood the question.') +
  phrases([
    { tag: 'The template — swap the last words for any topic', tone: 'green', fr: 'Je t’écris cette lettre pour parler de <b>l’environnement</b>.', en: 'I’m writing to talk about the environment.' },
    { tag: 'Alternative', tone: 'blue', fr: 'Dans cette lettre, je voudrais t’écrire au sujet de…', en: 'In this letter I’d like to write to you about…' },
    { tag: 'Alternative', tone: 'blue', fr: 'Aujourd’hui, je veux partager avec toi…', en: 'Today I want to share with you…' }
  ]);

L['charnieres'] = () => blueprint(2) +
  diagram('linkers') +
  callout('tip', '💡 The maths', '<b>5 sentences × 5 linking words = the 50-word body.</b> Without them your letter is a list; with them it is a paragraph — and that is what earns the content marks.');

L['clore'] = () => blueprint(3) +
  phrases([
    { tag: '1 · Ask for a reply', tone: 'green', fr: 'Écris-moi vite. · Réponds-moi. · J’attends ta réponse avec impatience.', en: 'Write soon. · Reply to me. · I’m looking forward to your reply.' },
    { tag: '2 · Send greetings', tone: 'blue', fr: 'Dis bonjour à tes parents de ma part. · Donne mes salutations à tout le monde.', en: 'Say hello to your parents from me. · Give my regards to everyone.' }
  ]) +
  callout('tip', '💡 Worth more than a generic ending', 'Match the closing to the topic: <i lang="fr">Bonne chance !</i> after advice about work · <i lang="fr">Soigne-toi bien !</i> after advice about health.');

L['signer'] = () => blueprint(4) +
  tiles([
    { n: 'Ton ami,', label: 'neutral — always safe', tone: 'green' },
    { n: 'Amitiés,', label: 'warmer', tone: 'blue' },
    { n: 'Bises,', label: 'close friends + family only', tone: 'purple' },
    { n: 'Ton fils,', label: 'to a parent', tone: 'gold' }
  ]) +
  bullets([
    { icon: '✍️', text: 'Sign-off ends with a <b>comma</b>. Your <b>first name alone</b> goes underneath.' }
  ]) +
  callout('danger', '⛔ Never in a friendly letter', '<i lang="fr">Cordialement</i> · <i lang="fr">Sincèrement</i> · <i lang="fr">Veuillez agréer</i> — these are formal letters. They cost you the register mark.');

/* ===== THE TONE (REGISTER) ===== */
L['tu-jamais-vous'] = () =>
  diagram('register') +
  callout('danger', '⛔ One exception only', 'Writing to <b>two</b> people — <i lang="fr">« Chers papa et maman, »</i> — then <i lang="fr">vous</i> is the plural and it is correct.');

L['ce-que-tu-change'] = () =>
  callout('tip', '🔑 Choosing <i lang="fr">tu</i> changes four things at once — and you must change all four', '') +
  tiles([
    { n: 'Verb', label: 'vous allez → <b>tu vas</b>', tone: 'green' },
    { n: 'Possessive', label: 'votre lettre → <b>ta lettre</b>', tone: 'blue' },
    { n: 'Object', label: 'je vous écris → <b>je t’écris</b>', tone: 'purple' },
    { n: 'Imperative', label: 'écrivez-moi → <b>écris-moi</b>', tone: 'gold' }
  ]) +
  callout('tip', '💡 Section C, reused', 'Possessives, object pronouns, the imperative — the letter is where you show you can actually use them.');

L['fautes'] = () =>
  bullets([
    { icon: '⛔', text: 'Mixing <i lang="fr">tu</i> and <i lang="fr">vous</i> — <b>by far the most common</b>' },
    { icon: '⛔', text: 'Capital on the month — <i lang="fr">le 13 <s>Octobre</s></i>' },
    { icon: '⛔', text: 'Forgetting the town before the date' },
    { icon: '⛔', text: '<i lang="fr">Cher</i> before a girl’s name' },
    { icon: '⛔', text: 'Signing <i lang="fr">Cordialement</i> in a friendly letter' },
    { icon: '⛔', text: 'Writing about the <b>wrong thing</b> — the most expensive of all' }
  ]) +
  callout('danger', '⚠️ The drift', 'The register mistake rarely happens at the start. You begin with <i lang="fr">tu</i>, drift into <i lang="fr">vous</i> in paragraph 2, and never notice. <b>Check every verb before you hand in.</b>');

L['ton-juste'] = () =>
  flow([
    { n: '1', title: 'Direct', body: 'imperative<br><i lang="fr">Sois optimiste !</i>' },
    { n: '2', title: 'Softer', body: 'devoir / pouvoir<br><i lang="fr">Tu dois te reposer.</i>' },
    { n: '3', title: 'Strongest', body: 'subjunctive<br><i lang="fr">Il faut que tu te reposes.</i>' }
  ]) +
  callout('tip', '💡 Use all three in one letter', 'That variety is the difference between a good answer and a <b>very</b> good one.') +
  callout('danger', '⛔ Trap', 'In a <b>negative</b> imperative the pronoun goes in front: <i lang="fr">Ne t’inquiète pas !</i> — never <i lang="fr">Ne inquiète-toi pas</i>.');

/* ===== EXAM PRACTICE ===== */
L['prac-sujets'] = (t, letters) => {
  const rows = Object.keys(TOPIC_LETTERS).map(label => {
    const y = topicYears(letters || [], label);
    return { label, v: y.n, inside: y.text, tone: y.n >= 3 ? 'gold' : (y.n > 0 ? 'blue' : '') };
  }).sort((a, b) => b.v - a.v);
  const max = Math.max.apply(null, rows.map(r => r.v).concat([1]));
  return bars(rows, max, '×') +
  bullets([
    { icon: '📊', text: 'Every CBSE topic since <b>2017</b>, and how often it appeared.' },
    { icon: '⚠️', text: 'Media and the environment have not appeared — but they are <b>still on the syllabus</b>.' }
  ]) +
  callout('tip', '💡 Pro tip', 'Four well-prepared topics beat ten half-remembered ones. <b>You will only ever write one.</b>');
};

L['prac-choisir'] = () =>
  callout('tip', '⏱️ Read all three topics before writing anything', 'Thirty seconds spent well stops you getting stuck halfway through.') +
  flow([
    { n: '1', title: 'Which do I know 8 sentences for?', body: 'Choose that one — <b>not</b> the most interesting one.' },
    { n: '2', title: 'Who am I writing to?', body: 'Friend · cousin · mother · pen-friend.<br>Fixes greeting + signature.' },
    { n: '3', title: 'Advice, or describing?', body: 'Advice → imperative + <i lang="fr">il faut que</i><br>Describing → present + a question' }
  ]) +
  callout('tip', '🏦 Bank the easy marks first', 'Then write the skeleton — date, greeting, signature — <b>before</b> a single sentence of content. If you run out of time, the format marks are already banked.');

L['prac-checklist'] = () =>
  diagram('checklist') +
  bars([
    { label: 'Format', v: 2, tone: 'blue' },
    { label: 'Register (tu)', v: 2, tone: 'purple' },
    { label: 'Content', v: 3, tone: 'green' },
    { label: 'Grammar', v: 3, tone: 'gold' }
  ], 3, ' / 10') +
  callout('danger', '⚠️ Keep two minutes at the end', 'This re-read is worth several marks and needs <b>no inspiration at all</b>. The commonest mistake is the <i lang="fr">tu</i> → <i lang="fr">vous</i> drift in paragraph 2.');

/* ---------------- entry point ---------------- */
function renderLessonBody(t, letters){
  const fn = L[t.id];
  return fn ? fn(t, letters) : null;   // null = fall back to the original prose renderer
}

const LESSON_CSS = `/* ===== INSTRUCTIONAL SLIDES — visual components ===== */
.ls-fig{ margin:0 0 clamp(6px,1vh,14px); width:100%; display:flex; justify-content:center; }
.ls-fig > svg{ width:100%; height:auto; max-height:min(58vh,560px); object-fit:contain; }

.ls-tiles{ display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:clamp(8px,1vw,14px); margin-bottom:clamp(8px,1.2vh,16px); }
.ls-tile{ border-radius:14px; padding:clamp(10px,1.4vh,18px) 12px; text-align:center; background:var(--box-blue-bg); border:2px solid var(--card-border); }
.ls-tile-n{ display:block; font-family:var(--custom-heading-font); font-weight:900; font-size:clamp(1.7rem,4vh,3.1rem); line-height:1.1; color:var(--heading-color); }
.ls-tile-l{ display:block; margin-top:4px; font-size:clamp(.95rem,1.8vh,1.35rem); color:var(--text-muted); line-height:1.3; }
.ls-tile.gold{ background:var(--box-gold-bg); border-color:var(--gold); } .ls-tile.gold .ls-tile-n{ color:var(--gold); }
.ls-tile.green{ border-color:var(--green); } .ls-tile.green .ls-tile-n{ color:var(--green); }
.ls-tile.purple{ border-color:var(--purple); } .ls-tile.purple .ls-tile-n{ color:var(--purple); }
.ls-tile.blue{ border-color:var(--heading-color); }

.ls-bullets{ list-style:none; padding:0; margin:0 0 clamp(8px,1.2vh,16px); text-align:left; }
.ls-bullets li{ display:flex; gap:10px; align-items:flex-start; margin:.5em 0; font-size:clamp(1.05rem,2.1vh,1.6rem); line-height:1.45; }
.ls-ico{ flex:none; font-size:1.1em; }

.ls-call{ border-radius:14px; padding:clamp(9px,1.2vh,16px) clamp(12px,1.5vw,20px); text-align:left; margin-bottom:clamp(8px,1.1vh,14px); border-left:6px solid var(--gold); background:var(--box-gold-bg); }
.ls-call-h{ margin:0; font-weight:800; font-size:clamp(1.05rem,2vh,1.55rem); color:var(--gold); }
.ls-call-b{ margin:5px 0 0; font-size:clamp(1rem,1.95vh,1.5rem); line-height:1.45; }
.ls-call-b:empty{ display:none; }
.ls-danger{ border-left-color:var(--crimson); } .ls-danger .ls-call-h{ color:var(--crimson); }

.ls-dd{ width:100%; border-collapse:collapse; margin-bottom:clamp(8px,1.1vh,14px); }
.ls-dd th, .ls-dd td{ padding:clamp(6px,1vh,14px) 16px; text-align:left; font-size:clamp(1.02rem,2vh,1.55rem); }
.ls-dd th{ font-size:clamp(.86rem,1.5vh,1.15rem); text-transform:uppercase; letter-spacing:.04em; border-bottom:3px solid var(--card-border); }
.ls-dd-good{ color:var(--green); } .ls-dd-bad{ color:var(--crimson); }
.ls-good{ color:var(--green); font-weight:700; }
.ls-bad{ color:var(--crimson); text-decoration:line-through; }
.ls-dd-note{ color:var(--text-muted); font-size:clamp(.9rem,1.6vh,1.25rem); padding-top:0; border-bottom:1px solid var(--card-border); }

.ls-flow{ display:flex; align-items:stretch; gap:8px; margin-bottom:clamp(8px,1.1vh,14px); flex-wrap:wrap; }
.ls-step{ flex:1 1 240px; min-width:0; border-radius:18px; padding:clamp(12px,2vh,26px); background:var(--box-blue-bg); border:2px solid var(--heading-color); text-align:left; }
.ls-step-n{ display:inline-grid; place-items:center; width:clamp(38px,4.4vh,54px); height:clamp(38px,4.4vh,54px); border-radius:50%; background:var(--heading-color); color:#fff; font-weight:900; font-size:clamp(1.15rem,2.4vh,1.7rem); }
.ls-step-t{ display:block; margin-top:8px; font-weight:800; font-size:clamp(1.1rem,2.2vh,1.7rem); color:var(--heading-color); }
.ls-step-b{ display:block; margin-top:5px; font-size:clamp(.98rem,1.85vh,1.42rem); line-height:1.4; color:var(--text-main); }
.ls-arrow{ align-self:center; color:var(--gold); font-size:clamp(1.8rem,3.4vh,2.8rem); font-weight:900; flex:none; }

.ls-phrases{ display:flex; flex-direction:column; gap:clamp(7px,1vh,13px); margin-bottom:clamp(8px,1.1vh,14px); }
.ls-phrase{ border-radius:14px; padding:clamp(8px,1.1vh,15px) clamp(12px,1.5vw,20px); text-align:left; background:var(--box-blue-bg); border-left:6px solid var(--heading-color); }
.ls-phrase.green{ border-left-color:var(--green); }
.ls-phrase.purple{ border-left-color:var(--purple); }
.ls-tag{ display:inline-block; font-size:clamp(.8rem,1.4vh,1.05rem); font-weight:800; text-transform:uppercase; letter-spacing:.04em; color:var(--text-muted); margin-bottom:3px; }
.ls-fr{ margin:0; font-size:clamp(1.15rem,2.5vh,1.95rem); font-weight:600; color:var(--text-main); line-height:1.4; }
.ls-en{ margin:4px 0 0; font-size:clamp(.95rem,1.75vh,1.35rem); color:var(--text-muted); font-style:italic; }

.ls-bars{ margin-bottom:clamp(8px,1.1vh,14px); }
.ls-bar-row{ display:flex; align-items:center; gap:10px; margin:.42em 0; font-size:clamp(1rem,2vh,1.55rem); }
.ls-bar-l{ flex:0 0 clamp(150px,20vw,300px); text-align:left; }
.ls-bar-track{ flex:1 1 auto; height:clamp(20px,3.2vh,38px); border-radius:999px; background:var(--card-border); overflow:hidden; }
.ls-bar-fill{
  display:flex; align-items:center; height:100%; border-radius:999px;
  background:var(--heading-color); padding:0 clamp(8px,1vw,16px); overflow:hidden;
}
/* Years inside the bar. White + a dark shadow rather than plain white: --gold is a
   bright yellow in the cyber theme, where white alone would wash out. The shadow
   keeps it legible on every fill colour in all 7 themes. */
.ls-bar-txt{
  color:#fff; font-weight:800; white-space:nowrap;
  font-size:clamp(.82rem,1.55vh,1.2rem); letter-spacing:.01em;
  text-shadow:0 1px 2px rgba(0,0,0,.6);
}
.ls-bar-none{
  display:flex; align-items:center; height:100%; padding:0 clamp(8px,1vw,16px);
  color:var(--text-muted); font-style:italic;
  font-size:clamp(.8rem,1.45vh,1.1rem);
}
.ls-bar-fill.gold{ background:var(--gold); } .ls-bar-fill.green{ background:var(--green); }
.ls-bar-fill.blue{ background:var(--heading-color); } .ls-bar-fill.purple{ background:var(--purple); }
.ls-bar-v{ flex:0 0 auto; font-weight:800; color:var(--text-muted); min-width:52px; text-align:right; }

.ls-blueprint{ display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:clamp(8px,1.2vh,16px); }
.ls-bp{ padding:6px 18px; border-radius:999px; font-size:clamp(.9rem,1.65vh,1.25rem); font-weight:700; background:var(--card-bg); border:1.5px solid var(--card-border); color:var(--text-muted); }
.ls-bp.on{ background:var(--heading-color); border-color:var(--heading-color); color:#fff; }
.ls-bp-sep{ color:var(--text-muted); opacity:.6; }

/* full-bleed: these slides are infographics, not prose pages */
.ls-slide{ padding:clamp(14px,1.8vh,26px) clamp(16px,2vw,34px) clamp(10px,1.4vh,20px); justify-content:flex-start; }
.ls-slide > h2{ font-size:clamp(1.45rem,3.4vh,2.6rem); margin:2px 0 clamp(8px,1.4vh,18px); line-height:1.15; }
.ls-slide .ls-tiles, .ls-slide .ls-bullets, .ls-slide .ls-call,
.ls-slide .ls-dd, .ls-slide .ls-flow, .ls-slide .ls-phrases,
.ls-slide .ls-bars, .ls-slide .ls-fig{ width:100%; max-width:none; }
.ls-slide .quiz-container{ width:100%; max-width:none; }

@media (max-width:1100px){
  .ls-flow{ flex-direction:column; } .ls-arrow{ transform:rotate(90deg); align-self:center; }
  .ls-bar-l{ flex-basis:110px; }
}
@media print{
  .ls-call, .ls-step, .ls-phrase, .ls-tile{ break-inside:avoid; page-break-inside:avoid; }
  .ls-fig > svg{ max-height:70mm !important; }
}
`;

module.exports = { renderLessonBody, LESSON_CSS, diagram, EN };
