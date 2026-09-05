// Slide layouts for Les Messages, plus the module's own CSS.
//
// Mirrors lessons.js: a registry of id -> function returning the inner HTML of a
// .slide-card. Returning undefined means "no layout", and the generator fails loudly
// rather than emitting a blank slide.
//
// THREE OF THE FOUR WIDGETS ARE CSS-ONLY. The type-switcher, the hotspot model and the
// mark-scheme simulator are built from hidden <input> + :checked sibling selectors, so
// they need no engine code, cannot break on a JS error, and keep working in print and
// with JS disabled. Only the Message Builder needs real logic; it lives in the engine
// as initMsgBuilder() and degrades to a readable static list if that never runs.
//
// Every SVG id carries an "msg-" prefix: verify.js:73 rejects duplicate id= anywhere in
// the file, with no whitelist, and that includes SVG <defs>.
// Every colour is a theme variable — literal hex would break 5 of the 7 themes.

const C = require('./components.js');
const { tiles, bullets, callout, doDont, flow, phrases, bars, blueprint } = C;

const esc = v => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* The message blueprint rail — four parts, not the letter's five. */
const RAIL = ['Header', 'Date / Time', 'Message', 'Sign-off'];
const rail = i => blueprint(i, RAIL);

const fig = svg => '            <figure class="ls-fig">' + svg + '</figure>\n';

/* ---------------- diagrams (theme variables only) ---------------- */

const svgBox = () =>
  '<svg viewBox="0 0 640 300" role="img" aria-label="The parts of a CBSE message">' +
  '<rect x="12" y="12" width="616" height="276" rx="16" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="3"/>' +
  '<text x="600" y="52" text-anchor="end" font-size="20" font-weight="700" fill="var(--crimson)">Delhi, le 28 novembre</text>' +
  '<text x="40" y="104" font-size="20" font-weight="700" fill="var(--purple)">Chère Nivya,</text>' +
  '<text x="40" y="148" font-size="18" fill="var(--text-main)">Je t&#39;invite à l&#39;anniversaire de mon frère</text>' +
  '<text x="40" y="176" font-size="18" fill="var(--text-main)">le 7 décembre. Viens en avance !</text>' +
  '<text x="40" y="228" font-size="19" font-weight="700" fill="var(--green)">Ton amie</text>' +
  '<text x="40" y="258" font-size="19" font-weight="800" fill="var(--gold)">Avaanika</text>' +
  '<text x="600" y="84" text-anchor="end" font-size="13" fill="var(--text-muted)">1 · place + date</text>' +
  '<text x="330" y="104" font-size="13" fill="var(--text-muted)">2 · salutation</text>' +
  '<text x="330" y="176" font-size="13" fill="var(--text-muted)">3 · the message</text>' +
  '<text x="330" y="248" font-size="13" fill="var(--text-muted)">4 · sign-off</text>' +
  '</svg>';

const svgMarks = () =>
  '<svg viewBox="0 0 640 210" role="img" aria-label="How the five marks are split">' +
  '<rect x="10" y="30" width="150" height="58" rx="10" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2"/>' +
  '<text x="85" y="56" text-anchor="middle" font-size="22" font-weight="800" fill="var(--gold)">1</text>' +
  '<text x="85" y="78" text-anchor="middle" font-size="13" fill="var(--text-main)">Format</text>' +
  '<rect x="170" y="30" width="150" height="58" rx="10" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="2"/>' +
  '<text x="245" y="56" text-anchor="middle" font-size="22" font-weight="800" fill="var(--heading-color)">2</text>' +
  '<text x="245" y="78" text-anchor="middle" font-size="13" fill="var(--text-main)">Content</text>' +
  '<rect x="330" y="30" width="150" height="58" rx="10" fill="var(--box-blue-bg)" stroke="var(--purple)" stroke-width="2"/>' +
  '<text x="405" y="56" text-anchor="middle" font-size="22" font-weight="800" fill="var(--purple)">1</text>' +
  '<text x="405" y="78" text-anchor="middle" font-size="13" fill="var(--text-main)">Grammar</text>' +
  '<rect x="490" y="30" width="140" height="58" rx="10" fill="var(--box-gold-bg)" stroke="var(--green)" stroke-width="2"/>' +
  '<text x="560" y="56" text-anchor="middle" font-size="22" font-weight="800" fill="var(--green)">1</text>' +
  '<text x="560" y="78" text-anchor="middle" font-size="13" fill="var(--text-main)">Vocabulary</text>' +
  '<text x="320" y="140" text-anchor="middle" font-size="16" fill="var(--text-muted)">Two of the five marks need no French at all —</text>' +
  '<text x="320" y="166" text-anchor="middle" font-size="16" font-weight="700" fill="var(--heading-color)">they are yours for laying the message out correctly.</text>' +
  '</svg>';

const svgSalut = () =>
  '<svg viewBox="0 0 640 230" role="img" aria-label="Choosing the salutation">' +
  '<text x="320" y="30" text-anchor="middle" font-size="15" fill="var(--text-muted)">Who is receiving this?</text>' +
  '<rect x="20" y="50" width="185" height="86" rx="12" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2"/>' +
  '<text x="112" y="78" text-anchor="middle" font-size="14" fill="var(--text-muted)">a friend, same age</text>' +
  '<text x="112" y="106" text-anchor="middle" font-size="19" font-weight="700" fill="var(--green)">Cher / Chère</text>' +
  '<text x="112" y="126" text-anchor="middle" font-size="13" fill="var(--text-main)">+ tu</text>' +
  '<rect x="227" y="50" width="186" height="86" rx="12" fill="var(--box-blue-bg)" stroke="var(--purple)" stroke-width="2"/>' +
  '<text x="320" y="78" text-anchor="middle" font-size="14" fill="var(--text-muted)">family</text>' +
  '<text x="320" y="106" text-anchor="middle" font-size="19" font-weight="700" fill="var(--purple)">Chère Maman</text>' +
  '<text x="320" y="126" text-anchor="middle" font-size="13" fill="var(--text-main)">+ tu</text>' +
  '<rect x="435" y="50" width="185" height="86" rx="12" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2"/>' +
  '<text x="527" y="78" text-anchor="middle" font-size="14" fill="var(--text-muted)">a teacher, an adult</text>' +
  '<text x="527" y="106" text-anchor="middle" font-size="19" font-weight="700" fill="var(--crimson)">Monsieur</text>' +
  '<text x="527" y="126" text-anchor="middle" font-size="13" fill="var(--text-main)">+ vous</text>' +
  '<text x="320" y="176" text-anchor="middle" font-size="16" font-weight="700" fill="var(--heading-color)">Pick the pronoun with the salutation,</text>' +
  '<text x="320" y="200" text-anchor="middle" font-size="16" fill="var(--text-main)">then never change it. Mixing tu and vous costs the grammar mark.</text>' +
  '</svg>';

/* ---------------- the registry ---------------- */
const M = {};

/* ===== 1. THE FORMAT ===== */

M['msg-quoi'] = () =>
  tiles([
    { n: '5', label: 'marks, every year', tone: 'gold' },
    { n: '30–50', label: 'words is plenty', tone: 'blue' },
    { n: '4', label: 'parts, always the same', tone: 'green' },
    { n: '~8', label: 'minutes in the exam', tone: 'purple' }
  ]) +
  bullets([
    { icon: '✉️', text: 'A message is a <b>short note</b> — the kind you leave on a table or send quickly. Not a letter.' },
    { icon: '🎯', text: 'The examiner checks <b>four things</b>: is it laid out right, does it answer the task, is the French correct, is the vocabulary right.' },
    { icon: '🔁', text: 'The situation changes every year. <b>The skeleton never does.</b>' }
  ]) +
  callout('tip', '💡 Why this is the easiest 5 marks on the paper',
    'You can write <b>the date, the salutation and the sign-off before you even read the question</b>. That is roughly a third of the message, already correct.');

M['msg-boite'] = () =>
  fig(svgBox()) +
  callout('tip', '💡 The box is the mark',
    'Miss the date line or the signature and you lose the format mark <b>even if every French word is perfect</b>. Draw the four slots first, fill them second.');

M['msg-lieu-date'] = () =>
  rail(1) +
  doDont('✓ Write this', '✗ Not this', [
    { good: 'Delhi, le 28 novembre', bad: 'Delhi, Le 28 Novembre', note: 'Months never take a capital in French, and <b>le</b> is lowercase too.' },
    { good: 'Kolkata, le 13 mars', bad: 'Kolkata le 13 mars', note: 'The comma between the town and the date is not optional.' },
    { good: 'Paris, 14 h', bad: 'Paris, 14h00', note: 'A space before <b>h</b>, and nothing after it. Never <b>2 pm</b>.' },
    { good: 'le 1<sup>er</sup> mai', bad: 'le 1 mai', note: 'Only the first of the month is ordinal. All others are plain: <b>le 2 mai</b>.' }
  ]) +
  callout('danger', '⚠️ The one that catches everybody',
    'If the task says the person <b>goes out</b> or <b>leaves a note</b>, write the <b>time</b>, not the date. A note on the kitchen table is timed, not dated.');

M['msg-salut'] = () =>
  fig(svgSalut()) +
  doDont('✓ Write this', '✗ Not this', [
    { good: 'Chère Nivya,', bad: 'Chère Nivya', note: 'The comma after the salutation is part of the format mark.' },
    { good: 'Cher Paul,', bad: 'Chere Paul,', note: '<b>Chère</b> for a girl, <b>Cher</b> for a boy — and the accent is not decoration.' }
  ]);

M['msg-corps'] = () =>
  rail(2) +
  flow([
    { n: '1', title: 'Say why', body: 'the reason you are writing<br><i lang="fr">Je t&#39;invite à…</i>' },
    { n: '2', title: 'Give the facts', body: 'when · where · what time<br><i lang="fr">le 7 décembre, à 18 h</i>' },
    { n: '3', title: 'Ask something', body: 'a reply, a favour, a time<br><i lang="fr">J&#39;attends ta réponse.</i>' }
  ]) +
  callout('tip', '💡 Three sentences is a full answer',
    'One sentence per move. A 40-word message that does all three beats an 80-word one that only does the first.');

M['msg-signature'] = () =>
  rail(3) +
  phrases([
    { fr: 'À bientôt !', en: 'See you soon!', tag: 'Works for every type', tone: 'green' },
    { fr: 'Amicalement,', en: 'Kind regards,', tag: 'Slightly more formal' },
    { fr: 'Ton ami / Ton amie', en: 'Your friend', tag: 'Agrees with YOUR gender', tone: 'purple' },
    { fr: 'Ton fils / Ta fille', en: 'Your son / daughter', tag: 'Writing to a parent' }
  ]) +
  callout('danger', '⚠️ Two lines, not one',
    'The closing and the signature are <b>separate lines</b>. <i lang="fr">Ton amie</i> then <i lang="fr">Avaanika</i> underneath. Running them together loses the format mark.');

M['msg-plan'] = () =>
  rail(0) +
  tiles([
    { n: '1', label: 'Place + date (or time)', tone: 'gold' },
    { n: '2', label: 'Chère / Cher + name,', tone: 'purple' },
    { n: '3', label: 'Why · facts · ask', tone: 'blue' },
    { n: '4', label: 'Closing, then name', tone: 'green' }
  ]) +
  callout('tip', '💡 Write the skeleton first',
    'Put down the four slots the moment you read the question. Even if you then run out of time, <b>the format mark is already banked</b>.');

/* ===== 2. THE THREE TYPES ===== */

M['msg-3types'] = () =>
  tiles([
    { n: '✉️', label: 'Invitation — you ask', tone: 'blue' },
    { n: '✅', label: 'Acceptance — you say yes', tone: 'green' },
    { n: '🙏', label: 'Refusal — you say no, kindly', tone: 'gold' }
  ]) +
  bullets([
    { icon: '🧩', text: 'All three use the <b>same four-part skeleton</b>. Only the middle changes.' },
    { icon: '⏱️', text: 'Decide the type in the first ten seconds. The verb in the question tells you: <i lang="fr">invitez</i>, <i lang="fr">acceptez</i>, <i lang="fr">refusez</i>.' }
  ]) +
  callout('danger', '⚠️ The costliest misread',
    'Answering an invitation when the paper asked for a <b>refusal</b> loses the content marks outright. Underline the instruction verb before you write a word.');

M['msg-invitation'] = () =>
  flow([
    { n: '1', title: 'Invite', body: '<i lang="fr">Je t&#39;invite à…</i>' },
    { n: '2', title: 'Detail', body: 'date · time · place' },
    { n: '3', title: 'Tempt', body: '<i lang="fr">On va s&#39;amuser !</i>' }
  ]) +
  phrases([
    { fr: 'J&#39;ai le grand plaisir de t&#39;inviter…', en: 'I have great pleasure in inviting you…', tag: 'Best opening', tone: 'green' },
    { fr: 'La soirée commencera à 18 h.', en: 'The party will begin at 6 p.m.', tag: 'Future — always' },
    { fr: 'J&#39;attends ta réponse.', en: 'I await your reply.', tag: 'Closing move', tone: 'purple' }
  ]);

M['msg-acceptation'] = () =>
  flow([
    { n: '1', title: 'Thank', body: '<i lang="fr">Merci pour ton invitation.</i>' },
    { n: '2', title: 'Say YES', body: '<i lang="fr">J&#39;accepte avec plaisir !</i>' },
    { n: '3', title: 'Confirm', body: 'when you arrive, what you bring' }
  ]) +
  phrases([
    { fr: 'J&#39;accepte avec plaisir !', en: 'I accept with pleasure!', tag: 'Say it early', tone: 'green' },
    { fr: 'Quelle bonne idée !', en: 'What a good idea!', tag: 'Warm opening' },
    { fr: 'À quelle heure dois-je arriver ?', en: 'What time should I arrive?', tag: 'Asking back earns marks', tone: 'purple' }
  ]) +
  callout('tip', '💡 Say yes in the first six words',
    'Do not make the reader wait. Thank, accept, <i>then</i> give details.');

M['msg-refus'] = () =>
  flow([
    { n: '1', title: 'Thank', body: '<i lang="fr">Je te remercie de ton invitation.</i>' },
    { n: '2', title: 'Refuse', body: '<i lang="fr">mais je ne peux pas venir</i>' },
    { n: '3', title: 'Explain + offer', body: '<i lang="fr">car… Nous irons après.</i>' }
  ]) +
  phrases([
    { fr: 'Je voudrais venir, mais…', en: 'I would like to come, but…', tag: 'The politest refusal there is', tone: 'green' },
    { fr: 'Je suis désolé(e) de ne pas pouvoir…', en: 'I am sorry not to be able to…', tag: 'Agrees with YOUR gender' },
    { fr: 'Il faut que j&#39;aille travailler.', en: 'I have to go to work.', tag: 'SUBJUNCTIVE — free grammar mark', tone: 'purple' }
  ]) +
  callout('danger', '⚠️ A refusal without a reason is half an answer',
    'The task almost always says <i lang="fr">donnez une raison</i>. No reason, no content mark — however elegant the French.');

M['msg-compare'] = () =>
  doDont('Stays the same in all three', 'Changes with the type', [
    { good: 'Place + date line', bad: 'The opening verb', note: '<i lang="fr">Je t&#39;invite</i> · <i lang="fr">J&#39;accepte</i> · <i lang="fr">Je ne peux pas</i>' },
    { good: 'Chère / Cher + name,', bad: 'The middle sentence', note: 'Details to tempt · details to confirm · a reason to excuse' },
    { good: 'Closing + signature', bad: 'The final move', note: 'Ask for a reply · promise to come · offer another time' }
  ]) +
  callout('tip', '💡 Learn one skeleton, not three',
    'About <b>30 of your 50 words</b> are identical whichever type comes up.');

/* --- WIDGET 1: type-switcher (CSS only) --- */
M['msg-switcher'] = () => {
  const T = [
    { id: 'inv', label: '✉️ Invitation', open: 'Je t&#39;invite au cinéma samedi à 18 h.',
      mid: 'Le film commence à 18 h 30. On va bien s&#39;amuser !', end: 'J&#39;attends ta réponse.' },
    { id: 'acc', label: '✅ Acceptance', open: 'Merci pour ton invitation. J&#39;accepte avec plaisir !',
      mid: 'Je serai devant le cinéma à 18 h. J&#39;apporterai les billets.', end: 'À samedi !' },
    { id: 'ref', label: '🙏 Refusal', open: 'Je te remercie, mais je ne peux pas venir.',
      mid: 'J&#39;ai un examen le lendemain et je dois réviser.', end: 'Nous irons une autre fois, promis.' }
  ];
  let h = '            <p class="msg-lead">Same scene — the cinema on Saturday. Watch which lines move and which never do.</p>\n';
  h += '            <div class="msg-switch">\n';
  T.forEach((t, i) => {
    h += '              <input type="radio" name="msgsw" id="msgsw-' + t.id + '" class="msg-sw-in"' + (i === 0 ? ' checked' : '') + '>\n';
  });
  h += '              <div class="msg-sw-tabs">\n';
  T.forEach(t => { h += '                <label class="msg-sw-tab" for="msgsw-' + t.id + '">' + t.label + '</label>\n'; });
  h += '              </div>\n';
  T.forEach(t => {
    h += '              <div class="msg-sw-panel msg-sw-' + t.id + '">\n';
    h += '                <div class="msg-paper">\n';
    h += '                  <p class="msg-date msg-fix">Delhi, le 14 mai</p>\n';
    h += '                  <p class="msg-sal msg-fix">Chère Pauline,</p>\n';
    h += '                  <p class="msg-body msg-var">' + t.open + '</p>\n';
    h += '                  <p class="msg-body msg-var">' + t.mid + '</p>\n';
    h += '                  <p class="msg-body msg-var">' + t.end + '</p>\n';
    h += '                  <p class="msg-close msg-fix">Ton amie</p>\n';
    h += '                  <p class="msg-sig msg-fix">Julie</p>\n';
    h += '                </div>\n';
    h += '              </div>\n';
  });
  h += '            </div>\n';
  h += '            <p class="msg-key"><span class="msg-k msg-k-fix"></span> never changes &nbsp; <span class="msg-k msg-k-var"></span> changes with the type</p>\n';
  return h;
};

/* --- WIDGET 2: annotated model, hotspots (CSS only) --- */
M['msg-hotspot'] = () => {
  const H = [
    { id: 'a', txt: 'Delhi, le 28 novembre', cls: 'msg-date', why: '<b>Format mark.</b> Town, comma, <i>le</i>, day, lowercase month. Four things to get right in five words.' },
    { id: 'b', txt: 'Chère Nivya,', cls: 'msg-sal', why: '<b>Format mark.</b> <i>Chère</i> agrees with Nivya, and the comma is compulsory.' },
    { id: 'c', txt: 'Je t&#39;invite à l&#39;anniversaire de mon frère cadet le 7 décembre chez moi.', cls: 'msg-body', why: '<b>Content mark.</b> Why + when + where in one sentence. This is the sentence the task actually asked for.' },
    { id: 'd', txt: 'Je serai très contente si tu viens en avance.', cls: 'msg-body', why: '<b>Grammar mark.</b> Future <i>serai</i> plus the feminine agreement <i>contente</i>, because Avaanika is writing.' },
    { id: 'e', txt: 'Ton amie', cls: 'msg-close', why: '<b>Format mark.</b> On its own line, above the name — and feminine again.' },
    { id: 'f', txt: 'Avaanika', cls: 'msg-sig', why: '<b>Format mark.</b> The signature is the last line. Nothing goes under it.' }
  ];
  let h = '            <p class="msg-lead">Click any line to see which of the five marks it earns.</p>\n';
  h += '            <div class="msg-hot">\n';
  H.forEach(x => {
    h += '              <input type="checkbox" id="msghot-' + x.id + '" class="msg-hot-in">\n';
    h += '              <div class="msg-hot-row">\n';
    h += '                <label class="msg-hot-line ' + x.cls + '" for="msghot-' + x.id + '">' + x.txt + '</label>\n';
    h += '                <p class="msg-hot-why">' + x.why + '</p>\n';
    h += '              </div>\n';
  });
  h += '            </div>\n';
  return h;
};

/* --- WIDGET 3: Message Builder (needs the engine; degrades to a static list) --- */
M['msg-builder'] = () => {
  const PARTS = [
    { k: '3', t: 'Je t&#39;invite à mon anniversaire le 20 mai à 18 h.' },
    { k: '1', t: 'Mumbai, le 14 mai' },
    { k: '4', t: 'Ton amie' },
    { k: '2', t: 'Cher Paul,' },
    { k: '5', t: 'Julie' }
  ];
  let h = '            <p class="msg-lead">The five lines are scrambled. Click them in the right order — top of the message first.</p>\n';
  h += '            <div class="msg-build" data-msg-build="1">\n';
  h += '              <div class="msg-build-pool">\n';
  PARTS.forEach(p => {
    h += '                <button type="button" class="msg-chip" data-k="' + p.k + '">' + p.t + '</button>\n';
  });
  h += '              </div>\n';
  h += '              <ol class="msg-build-slots"></ol>\n';
  h += '              <p class="msg-build-msg"></p>\n';
  h += '            </div>\n';
  h += callout('tip', '💡 If you are stuck', 'Ask yourself what a postman needs first: <b>where and when</b>. The date line is always the top line.');
  return h;
};

/* ===== 3. EXAM PRACTICE ===== */

M['msg-freq'] = () =>
  bars([
    { label: 'Invitation to a party or event', v: 3, inside: 'most common', tone: 'gold' },
    { label: 'Refusal with a reason', v: 3, inside: 'most common', tone: 'gold' },
    { label: 'Announcing a visit', v: 2, inside: 'regular', tone: 'blue' },
    { label: 'A note left at home', v: 1, inside: 'occasional', tone: 'blue' },
    { label: 'Accepting an invitation', v: 1, inside: 'occasional', tone: 'blue' }
  ], 3, '×') +
  callout('danger', '⚠️ Read this before you trust the chart',
    'These counts come from <b>the 8 messages in your teacher&#39;s own file</b>, not from a verified board-paper survey. They show what your material covers — treat them as a study guide, <b>not</b> as a prediction of the paper.');

const prac = (verb, promptFr, promptEn, model, tipTitle, tipBody) =>
  '            <div class="box gold content-box msg-prompt">\n' +
  '              <p class="msg-q-tag">Practice prompt · drafted for review</p>\n' +
  '              <p class="msg-prompt-fr" lang="fr">' + promptFr + '</p>\n' +
  '              <p class="msg-prompt-en">' + promptEn + '</p>\n' +
  '            </div>\n' +
  '            <details class="msg-reveal">\n' +
  '              <summary>Show a model answer</summary>\n' +
  '              <div class="msg-paper">\n' + model + '              </div>\n' +
  '            </details>\n' +
  callout('tip', tipTitle, tipBody);

const paper = (date, sal, body, close, sig) =>
  '                <p class="msg-date">' + date + '</p>\n' +
  '                <p class="msg-sal">' + sal + '</p>\n' +
  body.map(b => '                <p class="msg-body">' + b + '</p>\n').join('') +
  (close ? '                <p class="msg-close">' + close + '</p>\n' : '') +
  '                <p class="msg-sig">' + sig + '</p>\n';

M['msg-prac-inv'] = () => prac('invitation',
  'Vous organisez une fête pour la fin des examens. Invitez votre ami(e). (30 mots)',
  'You are organising a party for the end of the exams. Invite your friend. (30 words)',
  paper('Chennai, le 12 avril', 'Chère Meera,',
    ['J&#39;organise une petite fête chez moi le 20 avril pour fêter la fin des examens.',
     'Nous mangerons et nous danserons. Viens vers 19 h ! J&#39;attends ta réponse.'],
    'Ton amie', 'Anjali'),
  '💡 What the examiner is looking for',
  'A <b>date</b>, a <b>time</b> and a <b>reason to come</b>. Miss any one and the content mark slips.');

M['msg-prac-acc'] = () => prac('acceptance',
  'Votre ami(e) vous invite à sa fête. Vous acceptez et vous proposez d&#39;apporter quelque chose. (30 mots)',
  'Your friend invites you to their party. You accept and offer to bring something. (30 words)',
  paper('Chennai, le 14 avril', 'Chère Anjali,',
    ['Merci beaucoup pour ton invitation ! J&#39;accepte avec grand plaisir.',
     'Je serai chez toi à 19 h et j&#39;apporterai un gâteau au chocolat. À bientôt !'],
    'Ton amie', 'Meera'),
  '💡 The move most students forget',
  '<b>Offer something.</b> A message that only says yes is thin; one that offers to bring the cake answers the whole task.');

M['msg-prac-ref'] = () => prac('refusal',
  'Votre ami(e) vous invite à un concert, mais vous ne pouvez pas y aller. Refusez et donnez une raison. (30 mots)',
  'Your friend invites you to a concert, but you cannot go. Refuse and give a reason. (30 words)',
  paper('Chennai, le 18 avril', 'Cher Rahul,',
    ['Je te remercie de ton invitation, mais je suis désolée, je ne peux pas venir au concert.',
     'Il faut que j&#39;aille chez ma grand-mère ce week-end. Nous sortirons une autre fois !'],
    'Ton amie', 'Meera'),
  '💡 Three moves, three marks',
  'Thank · refuse · explain. The model adds a fourth — <b>offer another time</b> — which is what turns a good answer into a full one.');

/* --- WIDGET 4: mark-scheme simulator (CSS only) --- */
M['msg-marks'] = () => {
  const ROWS = [
    { id: 'm1', crit: 'Format — date, salutation, closing, signature all present', got: '1 / 1',
      why: 'All four slots are there and on their own lines.', tone: 'good' },
    { id: 'm2', crit: 'Content — does it do what the task asked?', got: '1 / 2',
      why: 'It refuses and thanks, but gives <b>no reason</b> — and the task said <i lang="fr">donnez une raison</i>.', tone: 'mid' },
    { id: 'm3', crit: 'Grammar — tenses and agreements', got: '1 / 1',
      why: 'Future and a correct feminine agreement on <i lang="fr">désolée</i>.', tone: 'good' },
    { id: 'm4', crit: 'Vocabulary — right words for the situation', got: '0 / 1',
      why: '<i lang="fr">Je suis busy</i> — an English word in a French answer scores nothing.', tone: 'low' }
  ];
  let h = '            <div class="msg-paper msg-paper-sample">\n';
  h += paper('Delhi, le 30 mai', 'Chère Deepti,',
    ['Merci pour ton invitation. Je suis désolée, je ne peux pas venir.',
     'Je suis busy ce soir.'], 'Ton amie', 'Priya');
  h += '            </div>\n';
  h += '            <p class="msg-lead">Award the 5 marks yourself. Then open each row to see the examiner&#39;s split.</p>\n';
  h += '            <div class="msg-mark">\n';
  ROWS.forEach(r => {
    h += '              <input type="checkbox" id="msgmk-' + r.id + '" class="msg-mk-in">\n';
    h += '              <div class="msg-mk-row">\n';
    h += '                <label class="msg-mk-crit" for="msgmk-' + r.id + '">' + r.crit + '</label>\n';
    h += '                <p class="msg-mk-why"><span class="fb-pill msg-mk-got ' + r.tone + '">' + r.got + '</span> ' + r.why + '</p>\n';
    h += '              </div>\n';
  });
  h += '            </div>\n';
  h += callout('danger', '⚠️ 3 out of 5, and the French was almost perfect',
    'Two marks went for things that had nothing to do with grammar: <b>a missing reason</b> and <b>one English word</b>. That is where messages are usually lost.');
  return h;
};

M['msg-quiz'] = () => {
  const Q = [
    { q: 'Which date line is correct?',
      opts: ['Delhi, Le 28 Novembre', 'Delhi, le 28 novembre', 'Delhi le 28 Novembre'], a: 1 },
    { q: 'Your friend invites you out but you have an exam. Which opening is best?',
      opts: ['Non, je ne viens pas.', 'Je te remercie de ton invitation, mais…', 'Je suis busy.'], a: 1 },
    { q: 'Paul leaves a note for his mother before going out. What goes on the top line?',
      opts: ['The date', 'The time', 'Nothing'], a: 1 },
    { q: 'Avaanika signs her own message. Which is right?',
      opts: ['Je serai très content', 'Je serai très contente', 'Je serai très contentes'], a: 1 },
    { q: 'Which phrase shows off the subjunctive in a refusal?',
      opts: ['Il faut que j&#39;aille travailler.', 'Je dois travailler.', 'Je vais travailler.'], a: 0 }
  ];
  let h = '            <div class="quiz-container">\n';
  h += '              <div class="quiz-progress-bar"><div class="quiz-progress-fill"></div></div>\n';
  Q.forEach((x, i) => {
    h += '              <div class="question-row" data-answer="' + esc(x.opts[x.a].replace(/&#39;/g, "'")) + '">\n';
    h += '                <p class="question-text">' + (i + 1) + '. ' + x.q + '</p>\n';
    h += '                <div class="options-row">\n';
    x.opts.forEach(o => { h += '                  <button class="option-btn">' + o + '</button>\n'; });
    h += '                </div>\n';
    h += '              </div>\n';
  });
  h += '              <div class="score-display"></div>\n';
  h += '            </div>\n';
  return h;
};

/* ===== 4. TIPS & TRAPS ===== */

M['msg-erreurs'] = () =>
  doDont('✓ Write this', '✗ Not this', [
    { good: 'le 28 novembre', bad: 'le 28 Novembre', note: 'Capital months — the single most common mistake in the whole section.' },
    { good: 'Chère Nivya,', bad: 'Chère Nivya', note: 'The missing comma after the salutation.' },
    { good: 'Je suis désolé', bad: 'Je suis desolé', note: 'A missing accent is a spelling mistake, not a typo.' },
    { good: 'j&#39;ai un examen le lendemain', bad: 'j&#39;ai un examen lendemain', note: '<i lang="fr">Lendemain</i> is a noun and needs its article.' },
    { good: 'Je suis désolé. Nous irons…', bad: 'Je suis désolé, Nous irons…', note: 'A comma cannot join two full sentences.' },
    { good: 'rendre visite à ma cousine', bad: 'visiter ma cousine', note: 'You <i>visit</i> places; you <i lang="fr">rendez visite à</i> people.' },
    { good: '18 h', bad: '6 pm', note: 'English time formats score nothing.' },
    { good: 'Ton amie<br>Avaanika', bad: 'Ton amie Avaanika', note: 'Closing and signature are two separate lines.' }
  ]);

M['msg-temps'] = () =>
  flow([
    { n: '1', title: 'Present', body: 'the situation now<br><i lang="fr">Je ne peux pas venir.</i>' },
    { n: '2', title: 'Future', body: 'the event itself<br><i lang="fr">La soirée commencera à 18 h.</i>' },
    { n: '3', title: 'Imperative', body: 'the request<br><i lang="fr">Viens en avance !</i>' }
  ]) +
  callout('tip', '💡 One subjunctive is worth hunting for',
    '<i lang="fr">Il faut que j&#39;aille…</i> is the easiest way to prove you know the Class 10 grammar. It fits naturally into any refusal.');

M['msg-vocab'] = () =>
  phrases([
    { fr: 'Je t&#39;invite à…', en: 'I invite you to…', tag: 'Invitation', tone: 'green' },
    { fr: 'J&#39;accepte avec plaisir !', en: 'I accept with pleasure!', tag: 'Acceptance', tone: 'green' },
    { fr: 'Je te remercie, mais…', en: 'Thank you, but…', tag: 'Refusal', tone: 'purple' },
    { fr: 'J&#39;attends ta réponse.', en: 'I await your reply.', tag: 'Any type' },
    { fr: 'Ne t&#39;inquiète pas !', en: 'Don&#39;t worry!', tag: 'A note at home' },
    { fr: 'On va s&#39;amuser !', en: 'We&#39;re going to have fun!', tag: 'Tempting them' }
  ]) +
  callout('tip', '💡 Six phrases, every message',
    'Learn these by heart and roughly <b>half your word count is written before you read the question</b>.');

M['msg-astuces'] = () =>
  bullets([
    { icon: '1️⃣', text: 'Draw the <b>four slots</b> before you write. The format mark is banked in ten seconds.' },
    { icon: '2️⃣', text: 'Underline the <b>instruction verb</b> — <i lang="fr">invitez / acceptez / refusez</i>. Answering the wrong type costs the most marks.' },
    { icon: '3️⃣', text: 'Check <b>your own gender</b> on <i lang="fr">désolé(e)</i>, <i lang="fr">content(e)</i>, <i lang="fr">ton ami(e)</i>. Free marks, endlessly thrown away.' },
    { icon: '4️⃣', text: 'If the task says <i lang="fr">donnez une raison</i>, <b>give one</b>. It is a separate mark.' },
    { icon: '5️⃣', text: 'Count your words. <b>30–50</b>. Longer is not better — it just gives you more chances to make a mistake.' },
    { icon: '6️⃣', text: 'Slip in one <b>subjunctive</b> or one <b>relative pronoun</b>. That is the grammar mark, deliberately earned.' }
  ]);

M['msg-checklist'] = () =>
  fig(svgMarks()) +
  bullets([
    { icon: '☑️', text: 'Town, comma, <i lang="fr">le</i>, day, <b>lowercase</b> month — or the time if it is a note.' },
    { icon: '☑️', text: '<i lang="fr">Cher</i> / <i lang="fr">Chère</i> matches the reader, and there is a comma.' },
    { icon: '☑️', text: 'The task&#39;s verb is answered — invited, accepted, or refused <b>with a reason</b>.' },
    { icon: '☑️', text: 'Every <i lang="fr">-é</i> has its accent; no English words anywhere.' },
    { icon: '☑️', text: 'Closing and signature on <b>two separate lines</b>.' }
  ]) +
  callout('tip', '💡 Thirty seconds, one mark',
    'Read it back once, looking <b>only</b> at capital letters and accents. That single pass is usually worth a mark on its own.');

/* ---------------- entry point ---------------- */
function renderMessageBody(t){
  const fn = M[t.id];
  return fn ? fn(t) : null;
}

module.exports = { renderMessageBody, M, esc, RAIL };
