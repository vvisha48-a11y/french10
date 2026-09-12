// Gate for the past-paper pipeline.
//
//   node check-papers.js
//
// What this guards has changed. The old version policed a set of repair rules
// that rewrote French; those rules are gone, and with them the risk of a
// plausible-looking wrong sentence. What is left to protect is different:
//
//   * no blank items -- the whole point of reading the PDFs by hand
//   * the corrections still apply: a transcription that stops matching a live
//     question is worse than none, because it silently does nothing
//   * the menu is the syllabus -- every leaf reachable, every tense row present,
//     and a row that unexpectedly empties gets caught rather than shrugged at
//   * no repair function has crept back into the generator
const fs = require('fs');
const path = require('path');
const TAX = require('./papers-taxonomy.js');
const CORR = require('./paper-corrections.js');

const SP    = __dirname;
const DATA  = path.join(SP, 'paperdata.js');
const INDEX = 'C:/claude/10 th/docs/index.html';
const GEN   = path.join(SP, 'gen-papers.js');

const problems = [];
const notes = [];

if (!fs.existsSync(DATA)){ console.error('paperdata.js missing -- run gen-papers.js first'); process.exit(1); }
const { PAPERS, TAXONOMY, TENSES } = require(DATA);

/* ---- 1. structure ---- */
if (PAPERS.length !== 10) problems.push('[papers] ' + PAPERS.length + ' papers, expected 10');
PAPERS.forEach(p => {
  const ids = p.sections.map(s => s.id).join('');
  if (ids !== 'ABCD') problems.push('[sections] ' + p.id + ' has [' + ids + '], expected ABCD');
  p.sections.forEach(s => {
    if (!s.questions.length) problems.push('[sections] ' + p.id + ' section ' + s.id + ' has no questions');
  });
});
const badges = PAPERS.map(p => p.badge);
if (new Set(badges).size !== badges.length)
  problems.push('[badge] two papers share a badge: ' + badges.join(' | '));

/* ---- 2. NO BLANK ITEMS. This is the reason the PDFs were read. ---- */
const blanks = [];
PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q =>
  q.items.forEach(it => { if (it.missing || !String(it.text || '').trim())
    blanks.push(p.id + ' ' + q.num + '(' + it.label + ')'); }))));
if (blanks.length) problems.push('[blank] ' + blanks.length + ' items still have no text: ' + blanks.slice(0, 8).join(', '));
else notes.push('no blank items anywhere');

/* ---- 3. no page furniture survived ---- */
const SURVIVORS = [/careerindia/i, /studiestoday/i, /P\.\s?T\.\s?O/i, /HCNERF/i, /Page \d+ of \d+/i];
let furniture = 0;
PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => {
  [q.instruction].concat(q.items.map(i => i.text)).forEach(t => SURVIVORS.forEach(re => {
    if (re.test(t)){ furniture++; if (furniture < 4) problems.push('[junk] ' + p.id + ' ' + q.num + ': "' + String(t).slice(0, 60) + '"'); }
  }));
})));
if (furniture >= 4) problems.push('[junk] ' + furniture + ' texts still carry page furniture');

/* ---- 4. every correction landed ---- */
const liveQ = new Set(), liveItem = new Set(), liveSec = new Set();
PAPERS.forEach(p => p.sections.forEach(s => {
  liveSec.add(p.id + ' ' + s.id);
  s.questions.forEach(q => {
    liveQ.add(p.id + ' ' + q.num);
    q.items.forEach(it => liveItem.add(p.id + ' ' + q.num + '(' + it.label + ')'));
  });
}));
Object.keys(CORR.SECTIONS).forEach(k => {
  if (!liveSec.has(k)) problems.push('[corr] SECTIONS["' + k + '"] matches no section any more');
});
Object.keys(CORR.TEXT).forEach(k => {
  if (!liveItem.has(k) && !liveQ.has(k))
    problems.push('[corr] TEXT["' + k + '"] matches nothing any more — the transcription is doing nothing');
});
Object.keys(CORR.TENSES).forEach(k => {
  if (!liveQ.has(k)) problems.push('[corr] TENSES["' + k + '"] matches no question any more');
});

/* the transcribed sections must actually be the ones in the data */
Object.keys(CORR.SECTIONS).forEach(k => {
  const [pid, sid] = k.split(' ');
  const p = PAPERS.find(x => x.id === pid);
  const s = p && p.sections.find(x => x.id === sid);
  if (!s) return;
  const want = CORR.SECTIONS[k].questions.length;
  if (s.questions.length !== want)
    problems.push('[corr] ' + k + ' should hold ' + want + ' transcribed questions, holds ' + s.questions.length);
  const untagged = s.questions.filter(q => (q.flags || []).indexOf('read-from-pdf') === -1);
  if (untagged.length)
    problems.push('[corr] ' + k + ': ' + untagged.length + ' questions are not marked as read from the paper');
});

/* ---- 5. the menu is the syllabus ---- */
const leafByKey = {};
TAXONOMY.forEach(g => g.leaves.forEach(l => { leafByKey[l.key] = l; }));
TAX.allLeaves().forEach(src => {
  const l = leafByKey[src.key];
  if (!l){ problems.push('[tax] leaf "' + src.key + '" is in the taxonomy but missing from the data'); return; }
  if (!l.count && TAX.LEAVES_ALLOWED_EMPTY.indexOf(src.key) === -1)
    problems.push('[tax] "' + l.label + '" matches no question, and is not on the allowed-empty list');
});
/* every question that is not a heading must be reachable from the menu */
const unreachable = [];
PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => {
  if (q.isContainer) return;
  if (!q.leaf || !leafByKey[q.leaf]) unreachable.push(p.id + ' ' + q.num);
})));
if (unreachable.length)
  problems.push('[tax] ' + unreachable.length + ' questions belong to no menu row: ' + unreachable.slice(0, 6).join(', '));
else notes.push('every question is reachable from the menu');

/* ---- 6. Les Verbes: every tense row present, and empties declared ---- */
if (TENSES.length !== TAX.TENSES.length)
  problems.push('[tense] the data carries ' + TENSES.length + ' tense rows, the syllabus lists ' + TAX.TENSES.length);
TENSES.forEach(t => {
  const declared = TAX.TENSES_NEVER_ASKED.indexOf(t.key) !== -1;
  if (!t.count && !declared)
    problems.push('[tense] "' + t.label + '" has no questions and is not declared in TENSES_NEVER_ASKED');
  if (t.count && declared)
    problems.push('[tense] "' + t.label + '" is declared never-asked but matches ' + t.count + ' questions');
});
const tenseTotal = TENSES.reduce((n, t) => n + t.count, 0);
if (!tenseTotal) problems.push('[tense] no question carries a tense tag at all');
else notes.push('tense rows: ' + TENSES.filter(t => t.count).length + ' of ' + TENSES.length + ' have questions');

/* ---- 7. the repair rules must stay gone ---- */
const gen = fs.readFileSync(GEN, 'utf8');
['fixElision', 'fixSplitWords', 'elideOK', 'EXAM_WORDS', 'TENSE_HINTS', 'buildVocab'].forEach(name => {
  if (gen.indexOf(name) !== -1)
    problems.push('[repair] gen-papers.js mentions ' + name + ' again — the generator must not repair French');
});
if (gen.indexOf('papers-text') === -1)
  problems.push('[source] gen-papers.js no longer reads papers-text/ — the PDFs are the source of truth');

/* ---- 8. marks are shown where the syllabus states them ---- */
const noMarks = [];
TAXONOMY.forEach(g => g.leaves.forEach(l => { if (l.count && !l.marks) noMarks.push(g.label + ' / ' + l.label); }));
if (noMarks.length) notes.push(noMarks.length + ' leaf(s) have no marks figure yet: ' + noMarks.join(', '));

/* ---- 9. deck links still land ---- */
if (fs.existsSync(INDEX)){
  const html = fs.readFileSync(INDEX, 'utf8');
  const deckTopics = new Set([...html.matchAll(/data-topic="([^"]+)"/g)].map(m => m[1]));
  const wanted = new Set();
  PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => {
    q.topics.forEach(t => { if (t.deck) wanted.add(t.deck); });
    q.items.forEach(it => (it.topics || []).forEach(t => { if (t.deck) wanted.add(t.deck); }));
  })));
  const dangling = [...wanted].filter(k => !deckTopics.has(k));
  if (dangling.length) problems.push('[deck] "Learn this" goes nowhere for: ' + dangling.join(', '));
  else if (wanted.size) notes.push(wanted.size + ' deck link target(s) all resolve');
}

/* ---- report ---- */
const real = PAPERS.reduce((n, p) => n + p.sections.reduce((m, s) => m + s.questions.filter(q => !q.isContainer).length, 0), 0);
const its = PAPERS.reduce((n, p) => n + p.sections.reduce((m, s) => m + s.questions.reduce((c, q) => c + q.items.length, 0), 0), 0);
const hand = PAPERS.reduce((n, p) => n + p.sections.reduce((m, s) =>
  m + s.questions.filter(q => (q.flags || []).indexOf('read-from-pdf') !== -1).length, 0), 0);
const byConf = { certain: [], confirmed: [], inferred: [] };
PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => q.items.forEach(it =>
  (it.topics || []).forEach(t => {
    (byConf[t.confidence] = byConf[t.confidence] || []).push(p.id + ' ' + q.num + '(' + it.label + ')');
  })))));
const inferred = byConf.inferred || [];
/* An unrecognised confidence would render as an unconfirmed tag without saying
   so, which is the one outcome worth failing over. */
Object.keys(byConf).forEach(k => {
  if (['certain', 'confirmed', 'inferred'].indexOf(k) === -1)
    problems.push('[tense] unknown confidence "' + k + '" on ' + byConf[k].length + ' tag(s)');
});

console.log('=== PAST PAPER GATE ===');
console.log('  papers           : ' + PAPERS.length);
console.log('  questions        : ' + real);
console.log('  items            : ' + its);
console.log('  blank items      : ' + blanks.length);
console.log('  read from the PDF: ' + hand + ' questions');
console.log('  tense tags       : ' + TENSES.reduce((n, t) => n + t.count, 0) + ' questions · ' +
  (byConf.certain || []).length + ' named by the paper, ' +
  (byConf.confirmed || []).length + ' teacher-confirmed, ' +
  inferred.length + ' still unconfirmed' +
  (inferred.length ? ' (' + inferred.join(', ') + ')' : ''));
console.log('  menu rows        : ' + TAXONOMY.reduce((n, g) => n + g.leaves.length, 0) +
  ' topics + ' + TENSES.length + ' tenses');
notes.forEach(n => console.log('  note             : ' + n));
console.log('');
if (problems.length){
  console.log('=== PROBLEMS ===');
  problems.forEach(p => console.log('   x ' + p));
} else {
  console.log('  RESULT: PASS — nothing blank, nothing invented, every menu row reachable.');
}
process.exit(problems.length ? 1 : 0);
