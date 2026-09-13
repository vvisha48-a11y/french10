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


/* ---- 10. answers: provenance, rubrics and coverage ---- */
const ANS = require('./paper-answers.js');
const UI_SRC = fs.readFileSync(path.join(SP, 'papers-ui.js'), 'utf8');

/* every answer key still names a live question, and every item label a live item */
Object.keys(ANS.ANSWERS).forEach(k => {
  const e = ANS.ANSWERS[k];
  if (!liveQ.has(k)){
    problems.push('[ans] ANSWERS["' + k + '"] matches no question any more — the answer is doing nothing');
    return;
  }
  Object.keys(e.items || {}).forEach(l => {
    if (!liveItem.has(k + '(' + l + ')'))
      problems.push('[ans] ANSWERS["' + k + '"] item (' + l + ') matches no item any more');
  });
});

/* provenance: every answer declares a tier, official ones cite their page */
let nOfficial = 0, nModele = 0;
const noTier = [], noPage = [];
PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => {
  const seen = [];
  if (q.answer) seen.push(['', q.answerTier, q.answerPage]);
  q.items.forEach(it => { if (it.answer) seen.push(['(' + it.label + ')', it.answerTier, it.answerPage]); });
  seen.forEach(([lab, tier, page]) => {
    const id = p.id + ' ' + q.num + lab;
    if (tier === 'official'){ nOfficial++; if (!page) noPage.push(id); }
    else if (tier === 'modele') nModele++;
    else noTier.push(id);
  });
})));
if (noTier.length)
  problems.push('[ans] ' + noTier.length + ' answer(s) declare no tier: ' + noTier.slice(0, 5).join(', '));
if (noPage.length)
  problems.push('[ans] ' + noPage.length + ' official answer(s) cite no marking-scheme page: ' + noPage.slice(0, 5).join(', '));

/* an open-ended task must carry the mark split that justifies its answer */
const noRubric = [];
PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => {
  const needs = ANS.RUBRIC_FOR[q.leaf];
  if (!needs) return;
  if (!q.answer && !q.items.some(i => i.answer)) return;
  if (!q.answerRubric) noRubric.push(p.id + ' ' + q.num + ' [' + q.leaf + ']');
})));
if (noRubric.length)
  problems.push('[ans] ' + noRubric.length + ' free-response answer(s) ship without their rubric: ' +
    noRubric.slice(0, 6).join(', '));

/* coverage, per section */
const cov = {};
PAPERS.forEach(p => p.sections.forEach(s => {
  const c = cov[s.id] = cov[s.id] || { done: 0, total: 0 };
  s.questions.forEach(q => {
    if (q.isContainer) return;
    if (q.items.length){
      q.items.forEach(it => { c.total++; if (it.answer) c.done++; });
    } else {
      c.total++; if (q.answer) c.done++;
    }
  });
}));
const covTotal = Object.keys(cov).reduce((a, k) => ({ done: a.done + cov[k].done, total: a.total + cov[k].total }), { done: 0, total: 0 });
notes.push('answers: ' + covTotal.done + '/' + covTotal.total + ' — ' +
  Object.keys(cov).sort().map(k => k + ' ' + cov[k].done + '/' + cov[k].total).join('  ') +
  '   (' + nOfficial + ' official, ' + nModele + ' modelled)');
if (covTotal.done < covTotal.total)
  problems.push('[ans] ' + (covTotal.total - covTotal.done) + ' item(s) have no answer yet');

/* ---- 11. the figures ---- */
const { PHOTOS } = require('./papers-images.js');
const { ILLUS } = require('./papers-illustrations.js');
const paperIds = new Set(PAPERS.map(p => p.id));
Object.keys(PHOTOS).forEach(k => { if (!paperIds.has(k)) problems.push('[img] PHOTOS["' + k + '"] is not a paper'); });
Object.keys(ILLUS).forEach(k => { if (!paperIds.has(k)) problems.push('[img] ILLUS["' + k + '"] is not a paper'); });
const noFig = PAPERS.filter(p => !PHOTOS[p.id] && !ILLUS[p.id]).map(p => p.id);
if (noFig.length) problems.push('[img] no figure for: ' + noFig.join(', '));
else notes.push('every paper has a figure: ' + Object.keys(PHOTOS).length + ' from the PDFs, ' +
  Object.keys(ILLUS).length + ' drawn here and labelled as added');
/* an external <img src> would be a network fetch, which the offline gate bans */
Object.keys(PHOTOS).forEach(k => {
  if (PHOTOS[k].src.indexOf('data:image/') !== 0)
    problems.push('[img] PHOTOS["' + k + '"] is not a data URI — docs/index.html must stay offline');
});

/* ---- 12. the old popover must not half-survive ---- */
['plFilterBtn', 'plPanel', 'plDrill', 'renderDrill', 'drillLevel'].forEach(name => {
  if (UI_SRC.indexOf(name) !== -1)
    problems.push('[ui] papers-ui.js still mentions ' + name + ' — the dropdown was replaced, not kept');
});
if (UI_SRC.indexOf('function renderNav()') === -1)
  problems.push('[ui] papers-ui.js has no renderNav() — the persistent nav is missing');


/* ---- 13. Phase 2: the module inside the deck ----
   The promise is zero drift between the lab and the live app, so it is proven by
   bytes: the deck and the lab must each carry papers-ui.js's CSS, page markup and
   engine verbatim. The rest guards what the deck itself imposes. */
{
  const UI2 = require('./papers-ui.js');
  const PAGE2 = UI2.PAGE(PAPERS);
  const HOSTS = [['docs/index.html', INDEX], ['docs/app.html', 'C:/claude/10 th/docs/app.html']];
  HOSTS.forEach(([name, file]) => {
    if (!fs.existsSync(file)){ problems.push('[deck] ' + name + ' is missing -- run build.sh'); return; }
    const h = fs.readFileSync(file, 'utf8');
    if (h.indexOf(UI2.CSS) === -1) problems.push('[drift] ' + name + ' does not carry the papers-ui.js CSS byte-for-byte');
    if (h.indexOf(UI2.JS) === -1)  problems.push('[drift] ' + name + ' does not carry the papers-ui.js engine byte-for-byte');
    if (h.indexOf(PAGE2) === -1)   problems.push('[drift] ' + name + ' does not carry the papers page markup byte-for-byte -- rebuild after gen-papers.js');

    /* the button: Messages' class exactly, and no dropdown caret */
    const b = h.match(/<button class="([^"]*)" id="papersBtn"[^>]*>([^<]*)<\/button>/);
    if (!b) problems.push('[button] #papersBtn is missing from ' + name);
    else {
      if (b[1] !== 'tb-btn') problems.push('[button] #papersBtn has class "' + b[1] + '"; Messages has exactly "tb-btn"');
      if (b[2].indexOf('\u25BE') !== -1) problems.push('[button] #papersBtn still carries a dropdown caret');
    }
    if (h.indexOf('id="papersMenu"') !== -1) problems.push('[button] a Papers dropdown menu is still in ' + name);
    if (h.indexOf('<section class="pl-paper"') !== -1)
      problems.push('[deck] .pl-paper is a <section> in ' + name + ' -- the deck styles every nested section');

    /* exactly one papers stack, and it is the last one */
    const a = h.indexOf('id="slidesRoot"'), z = h.indexOf('<!-- /.slides -->', a);
    const body = h.slice(a, z);
    const stacks = [];
    let depth = 0, m;
    const re = /<section\b[^>]*>|<\/section>/g;
    while ((m = re.exec(body))){
      if (m[0][1] === '/'){ depth--; continue; }
      if (depth === 0) stacks.push((m[0].match(/data-topic="([^"]*)"/) || [])[1]);
      depth++;
    }
    const nPapers = stacks.filter(t => t === 'papers').length;
    if (nPapers !== 1) problems.push('[deck] ' + name + ' has ' + nPapers + ' papers stacks, expected 1');
    else if (stacks[stacks.length - 1] !== 'papers')
      problems.push('[deck] the papers stack is not last in ' + name + ' -- every stack after it would shift its #/h/v link and progress');
    else if (name === 'docs/index.html')
      notes.push('papers is the last of ' + stacks.length + ' stacks: #/' + (stacks.length - 1) + '/0');
  });

  /* the lab is built from the same strings */
  const LAB = 'C:/claude/10 th/papers-lab.html';
  if (fs.existsSync(LAB)){
    const lab = fs.readFileSync(LAB, 'utf8');
    if (lab.indexOf(PAGE2) === -1)   problems.push('[drift] papers-lab.html does not carry the same page markup as the deck');
    if (lab.indexOf(UI2.JS) === -1)  problems.push('[drift] papers-lab.html does not carry the same engine as the deck');
    if (lab.indexOf(UI2.CSS) === -1) problems.push('[drift] papers-lab.html does not carry the same CSS as the deck');
  }

  /* no duplicate ids in the module markup -- the Done ticks are keyed on them */
  const idCount = {};
  [...PAGE2.matchAll(/\sid="([^"]+)"/g)].forEach(x => { idCount[x[1]] = (idCount[x[1]] || 0) + 1; });
  const dupIds = Object.keys(idCount).filter(k => idCount[k] > 1);
  if (dupIds.length) problems.push('[ids] ' + dupIds.length + ' duplicated id(s) in the papers markup: ' + dupIds.slice(0, 6).join(', '));

  /* every selector the module ships is scoped to it, so it cannot restyle the deck */
  const flat = UI2.CSS.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@(media|supports)[^{]*\{/g, '');
  const sels = new Set();
  flat.split('}').forEach(block => {
    const i = block.indexOf('{');
    if (i < 0) return;
    block.slice(0, i).split(',').forEach(s => { s = s.trim(); if (s && s[0] !== '@') sels.add(s); });
  });
  const unscoped = [...sels].filter(s => !/\.pl-|#pl|body\.pl-/.test(s));
  if (unscoped.length) problems.push('[css] ' + unscoped.length + ' papers selector(s) are not .pl- scoped: ' + unscoped.slice(0, 5).join(' | '));
  else notes.push('all ' + sels.size + ' papers selectors are .pl- scoped');
}

/* ---- 14. "Learn this" links, and the measured label colours ---- */
{
  const UI3 = require('./papers-ui.js');
  const page3 = UI3.PAGE(PAPERS);
  const links = [...page3.matchAll(/class="pl-learn" data-deck="([^"]+)"/g)].map(m => m[1]);
  let expected = 0;
  PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => {
    if (!q.isContainer && q.topics.some(t => t.deck)) expected++;
  })));
  if (!links.length) problems.push('[learn] no "Learn this" link renders anywhere');
  else if (links.length !== expected) problems.push('[learn] ' + links.length + ' links render but ' + expected + ' questions have a lesson');
  /* every leaf the deck teaches must name its lesson, so no such question goes without a link */
  const taught = TAX.allLeaves().filter(l => (/^gr-/.test(l.key) && !l.legacy) || l.key === 'ex-letter' || l.key === 'ex-message');
  const unlinked = taught.filter(l => !l.deck).map(l => l.key);
  if (unlinked.length) problems.push('[learn] leaves the deck teaches have no lesson: ' + unlinked.join(', '));
  if (fs.existsSync(INDEX)){
    const inDeck = new Set([...fs.readFileSync(INDEX, 'utf8').matchAll(/data-topic="([^"]+)"/g)].map(m => m[1]));
    const lost = [...new Set(links)].filter(k => !inDeck.has(k));
    if (lost.length) problems.push('[learn] link target(s) missing from the deck: ' + lost.join(', '));
    else if (links.length) notes.push(links.length + ' "Learn this" links render, to ' + new Set(links).size + ' lessons, all in the deck');
  }
  /* colours measured to pass 4.5:1 in all 7 themes on all four section grounds (numbers in papers-ui.js) */
  [
    ['.pl-answer-tag.is-official{ background:var(--green); color:var(--card-bg); }', 'officielle tag'],
    ['.pl-answer-tag.is-modele{ background:var(--card-bg); color:var(--text-main); border:1px dashed var(--card-border); }', 'modele tag'],
    ['color:var(--text-muted); white-space:nowrap;', 'citation'],
    ['.pl-learn:hover{ background:var(--heading-color); color:var(--card-bg); }', 'Learn this hover']
  ].forEach(([rule, label]) => {
    if (UI3.CSS.indexOf(rule) === -1)
      problems.push('[contrast] the ' + label + ' colours differ from the ones measured in all 7 themes -- re-measure before shipping');
  });
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
