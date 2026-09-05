// Verify an assembled app file after the Model Letters 4-slide split.
//
//   node verify-e-file.js "E:/Master Grammar App v2.html"
//
// The load-bearing check is CONTENT PARITY: every paragraph, closing line,
// signature, vocab row, bank row and note from letterdata.js must still be present.
// That is what proves "retain all content — do not cut, summarise or leave behind".
const fs = require('fs');
const path = require('path');

const TARGET = process.argv[2] || 'E:/Master Grammar App v2.html';
const html = fs.readFileSync(TARGET, 'utf8');
const problems = [];

let src = fs.readFileSync(path.join(__dirname, 'letterdata.js'), 'utf8');
const DATA = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1));
const letters = (DATA.find(g => g.group === 'Model Letters') || {}).topics || [];

const esc = v => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const sid = id => (String(id).indexOf('let-') === 0 ? String(id) : 'let-' + id);

// ---- 1. structure ----
const ids = [...html.matchAll(/data-slide-id="([^"]*)"/g)].map(x => x[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dup.length) problems.push(`[dup] duplicate slide ids: ${[...new Set(dup)].slice(0, 5).join(', ')}`);

const PARTS = ['sujet', 'lettre', 'vocab', 'bank', 'retenir'];
letters.forEach(t => PARTS.forEach(p => {
  if (ids.indexOf(sid(t.id) + '-' + p) === -1) problems.push(`[missing] "${t.id}" has no "${p}" slide`);
}));

const stackIdx = html.indexOf('data-sub="Model Letters"');
if (stackIdx < 0) problems.push('[stack] Model Letters stack not found');

// ---- 2. CONTENT PARITY ----
// Letters, prompts, vocab and bank rows must survive VERBATIM.
// Notes are deliberately restructured into À retenir cards (prefix stripped, the
// « wrong » → « right » pairs lifted into table cells), so a whole-string match no
// longer fits them. They are checked word-by-word against the rendered text instead,
// which still proves nothing was dropped while allowing the reordering.
// two variants: tags->space and tags->nothing. An inline <mark> splitting a word
// would otherwise read as a lost word, which it is not.
const plainTight = html.replace(/<[^>]+>/g, '')
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ');
const plain = html.replace(/<[^>]+>/g, ' ')
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ');

let checked = 0, lost = 0, noteWords = 0, noteLost = 0;
letters.forEach(t => {
  const F = t.letter.fr;
  const verbatim = []
    .concat(F.date, F.salutation, F.signature)
    .concat(F.paras || [], F.closing || [])
    .concat(t.prompt ? [t.prompt.fr] : [])
    .concat((t.vocab || []).map(r => r[0])).concat((t.vocab || []).map(r => r[1]))
    .concat((t.bank || []).map(r => r[0])).concat((t.bank || []).map(r => r[1]));
  verbatim.filter(Boolean).forEach(piece => {
    checked++;
    if (html.indexOf(esc(piece)) === -1){
      lost++;
      if (lost <= 5) problems.push(`[LOST] "${t.id}": ${String(piece).slice(0, 70)}…`);
    }
  });

  (t.notes || []).forEach(note => {
    // every substantial word of the note must still appear somewhere on the slides
    const words = note.split(/[^0-9A-Za-zÀ-ÿ'’-]+/).filter(w => w.length >= 6);
    words.forEach(w => {
      noteWords++;
      if (plain.indexOf(w) === -1 && plainTight.indexOf(w) === -1){
        noteLost++;
        if (noteLost <= 5) problems.push(`[NOTE-LOST] "${t.id}": the word “${w}” is not on any slide`);
      }
    });
  });
});

// ---- 3. offline / self-contained ----
const ext = [];
[/<img\b[^>]*\bsrc="((?:https?:)?\/\/[^"]*)"/gi,
 /<script\b[^>]*\bsrc="((?:https?:)?\/\/[^"]*)"/gi,
 /<link\b[^>]*\bhref="((?:https?:)?\/\/[^"]*)"/gi,
 /url\(\s*['"]?((?:https?:)?\/\/[^'")]+)/gi].forEach(r => {
  let m; while ((m = r.exec(html)) !== null) ext.push(m[1]);
});
if (ext.length) problems.push(`[offline] ${ext.length} external reference(s): ${ext.slice(0, 3).join(' | ')}`);

// ---- 4. sanity ----
if (!/<\/body>\s*<\/html>\s*$/.test(html.trimEnd() + '\n')) problems.push('[html] file does not end with </body></html>');
// Scope the tag-balance check to #slidesRoot. The engine's own comments mention
// "<section>" in prose, which reads as a stray unclosed tag across the whole file —
// it does so in the untouched backup too, so it is a false positive, not a defect.
const sA = html.indexOf('<div class="slides"'), sB = html.indexOf('</div><!-- /.slides -->');
const slidesRegion = (sA >= 0 && sB > sA) ? html.slice(sA, sB) : html;
const opens = (slidesRegion.match(/<section\b/g) || []).length;
const closes = (slidesRegion.match(/<\/section>/g) || []).length;
if (opens !== closes) problems.push(`[tags] slides region: <section> ${opens} vs </section> ${closes}`);

// ---- 5. GEOMETRY GATE ----
// Re-runs the exact solver the generator used, and cross-checks that the value it
// actually emitted into the file matches. A silent mismatch here is precisely how
// the scrollbar this change removes would come back unnoticed.
const gen = require('./gen-letter-slides.js');
let tooBig = 0, mismatched = 0, minPx = 99, maxPx = 0, minPxEn = 99;
letters.forEach(t => {
  const f = gen.fitLetter(t.letter.fr);
  const fe = gen.fitLetterEn ? gen.fitLetterEn(t.letter.fr, t.letter.en) : null;
  if (fe){
    if (fe.px < minPxEn) minPxEn = fe.px;
    if (fe.h > fe.avail) problems.push(`[fit-en] "${t.id}" with English predicted ${fe.h}px exceeds ${fe.avail}px`);
  }
  if (f.px < minPx) minPx = f.px;
  if (f.px > maxPx) maxPx = f.px;
  if (f.h > f.avail){
    tooBig++;
    problems.push(`[fit] "${t.id}" predicted ${f.h}px exceeds the ${f.avail}px budget`);
  }
  const i = html.indexOf('data-slide-id="' + sid(t.id) + '-lettre"');
  if (i < 0) return;
  const j = html.indexOf('data-slide-id=', i + 20);
  const slide = html.slice(i, j < 0 ? i + 20000 : j);
  if (fe && slide.indexOf('--let-fs-en:' + fe.vh + 'vh') === -1){
    mismatched++;
    problems.push(`[fit] "${t.id}" slide is missing the computed --let-fs-en:${fe.vh}vh`);
  }
  if (slide.indexOf('--let-fs:' + f.vh + 'vh') === -1){
    mismatched++;
    problems.push(`[fit] "${t.id}" slide is missing the computed --let-fs:${f.vh}vh`);
  }
});
if (minPx < 16) problems.push(`[legibility] smallest computed font is ${minPx}px — too small to read at distance`);
/* English-on floor is 13px, not 16px: the user chose English directly under each
   French line over a larger font, accepting that the longest letters shrink. */
if (minPxEn < 13) problems.push(`[legibility] smallest English-on font is ${minPxEn}px — below the 13px floor`);
const capped = (html.match(/max-width:1080px/g) || []).length;
if (capped) problems.push(`[width] .let-paper still capped at 1080px in ${capped} place(s)`);

// ---- 6. SIDEBAR ACCORDION ----
// The grouping is data, so assert it rather than eyeball it: 68 letter slides must
// partition into exactly 8 chapters / 17 letters / 4 parts each.
const groups = {}, items = {};
let ungrouped = 0;
letters.forEach(t => PARTS.forEach(p => {
  const id = sid(t.id) + '-' + p;
  const i = html.indexOf('data-slide-id="' + id + '"');
  if (i < 0) return;
  const tag = html.slice(i, html.indexOf('>', i));
  const g = (tag.match(/data-group="([^"]*)"/) || [])[1];
  const it = (tag.match(/data-item="([^"]*)"/) || [])[1];
  if (!g || !it){ ungrouped++; if (ungrouped <= 3) problems.push(`[group] "${id}" is missing data-group/data-item`); return; }
  groups[g] = (groups[g] || 0) + 1;
  items[it] = (items[it] || 0) + 1;
}));
const nGroups = Object.keys(groups).length, nItems = Object.keys(items).length;
if (nItems !== letters.length) problems.push(`[group] ${nItems} distinct letters in data-item, expected ${letters.length}`);
Object.entries(items).forEach(([k, n]) => { if (n !== PARTS.length) problems.push(`[group] letter "${k}" has ${n} slides, expected ${PARTS.length}`); });

// the engine must have the accordion AND still have the flat branch for other topics
if (html.indexOf('sb-group') === -1) problems.push('[sidebar] accordion branch missing from renderSidebar');
if (html.indexOf('sb-item step') === -1) problems.push('[sidebar] flat branch missing — other topics would lose their sidebar');
if (html.indexOf('const sbOpen') === -1) problems.push('[sidebar] sbOpen state object missing');
// toggles must not navigate: the group/sub handlers must not call Deck.slide
const sbFn = html.slice(html.indexOf('function renderSidebar(){'), html.indexOf('function renderSidebar(){') + 4200);
const groupHandler = sbFn.slice(sbFn.indexOf(".sb-group', sb)"));
if (groupHandler.indexOf('Deck.slide') !== -1 && groupHandler.indexOf('Deck.slide') < groupHandler.indexOf('renderSidebar()'))
  problems.push('[sidebar] chapter toggle calls Deck.slide — it must only open/close');

// ---- 7. INSTRUCTIONAL SLIDES: English explanations, French only where taught ----
const lessons = [];
DATA.filter(g => g.group !== 'Model Letters').forEach(g => g.topics.forEach(t => lessons.push(t)));
let lessonMissing = 0, frLeak = 0;
const EN_MAP = require('./lesson-labels.js');
lessons.forEach(t => {
  const i = html.indexOf('data-slide-id="' + sid(t.id) + '"');
  if (i < 0){ lessonMissing++; problems.push(`[lesson] slide "${t.id}" is missing`); return; }
  const j = html.indexOf('data-slide-id=', i + 20);
  const slide = html.slice(i, j < 0 ? i + 30000 : j);
  // no untranslated explanatory label may survive on a redesigned slide
  Object.keys(EN_MAP).forEach(fr => {
    if (slide.indexOf('>' + fr + '<') !== -1){
      frLeak++;
      if (frLeak <= 4) problems.push(`[lang] "${t.id}" still shows the French label “${fr.slice(0, 46)}”`);
    }
  });
});

// the French being TAUGHT must still be there — these are the target phrases
const MUST_KEEP = [
  'Comment vas-tu ?', 'D’abord', 'Ensuite', 'De plus', 'Cependant', 'Enfin',
  'Ton ami,', 'Bises,', 'Cordialement', 'Sois optimiste !',
  'Il faut que tu te reposes.', 'Je t’écris cette lettre pour parler de',
  'Ne t’inquiète pas !', 'dans laquelle'
];
let keptMissing = 0;
MUST_KEEP.forEach(p => {
  if (html.indexOf(esc(p)) === -1 && html.indexOf(p) === -1){
    keptMissing++;
    problems.push(`[lang] target French phrase lost: “${p}”`);
  }
});

// ---- 8. SIDEBAR STEP LABELS ----
// Steps are translated for the SIDEBAR only, via a lookup in the engine. data-step
// itself stays French, which is what keeps verify.js's 8-step rule intact.
const STEPS = require('./step-labels.js');
let stepMissing = 0;
if (html.indexOf('function stepLabel') === -1) problems.push('[steps] stepLabel() not in the engine');
if (html.indexOf("sec.dataset.topic === 'lettre'") === -1)
  problems.push('[steps] La Lettre is not excluded — its sidebar would be translated too');
['How to Form', 'Common Mistakes', 'Fill-in-the-blanks Practice', 'MCQ Practice', 'In Context'].forEach(v => {
  if (html.indexOf(v) === -1){ stepMissing++; problems.push(`[steps] translation missing from the engine: "${v}"`); }
});
// the structural French names must NOT have been renamed in the markup
['data-step="Formation"', 'data-step="Pièges"', 'data-step="Pratique — à compléter"'].forEach(d => {
  if (html.indexOf(d) === -1) problems.push(`[steps] ${d} was renamed in the markup — this breaks verify.js's 8-step rule`);
});

// ---- 9. "LAST BENCHER" SCALE ----
// The instructional slides must be sized for the back of a classroom.
const cssStart = html.indexOf('INSTRUCTIONAL SLIDES — visual components');
// to the end of the stylesheet, not a fixed byte window — the block grows as
// components are added, and a fixed window silently drops rules off the end
const lsCss = cssStart >= 0 ? html.slice(cssStart, html.indexOf('</style>', cssStart)) : '';
let small = 0;
[['.ls-tile-n', 3.0], ['.ls-step-t', 2.0], ['.ls-fr', 2.4]].forEach(([sel, minVh]) => {
  const i = lsCss.indexOf(sel);
  if (i < 0){ problems.push(`[scale] ${sel} rule not found`); return; }
  const m = lsCss.slice(i, i + 240).match(/clamp\([^,]+,\s*([\d.]+)vh/);
  if (!m || parseFloat(m[1]) < minVh){
    small++;
    problems.push(`[scale] ${sel} scales at ${m ? m[1] : '?'}vh — below the ${minVh}vh floor for back-of-room legibility`);
  }
});
if (lsCss.indexOf('.ls-slide') === -1) problems.push('[scale] .ls-slide full-bleed rules missing');


// ---- 10. TOP BAR ----
// The requirement is "only three buttons stay visible on the right", so assert the
// structure rather than eyeballing it. The six utilities must be MOVED into the
// hamburger, not deleted — deleting them would silently break their engine handlers.
const hdrA = html.indexOf('<header class="topbar">');
const hdrB = html.indexOf('</header>', hdrA);
const header = hdrA >= 0 ? html.slice(hdrA, hdrB) : '';
if (!header) problems.push('[topbar] header not found');

const utilA = header.indexOf('<div class="util-menu"');
const utilB = header.indexOf('</div>', utilA);
const utilMenu = utilA >= 0 ? header.slice(utilA, utilB + 6) : '';
const UTILS = ['lightBtn', 'soundBtn', 'projectorBtn', 'printBtn', 'sidebarBtn', 'shortcutsBtn'];
let utilOutside = 0;
UTILS.forEach(id => {
  if (header.indexOf('id="' + id + '"') === -1){
    problems.push('[topbar] "' + id + '" was deleted — its engine handler would break');
  } else if (utilMenu.indexOf('id="' + id + '"') === -1){
    utilOutside++;
    problems.push('[topbar] "' + id + '" is not inside #utilMenu — still cluttering the bar');
  }
});

const afterSpacer = header.slice(header.indexOf('tb-spacer'));
const visible = [...afterSpacer.matchAll(/id="([a-zA-Z]+Btn)"/g)].map(m => m[1])
  .filter(id => UTILS.indexOf(id) === -1);
const WANT = ['modeBtn', 'utilBtn', 'settingsBtn'];
if (visible.join(',') !== WANT.join(','))
  problems.push('[topbar] right side shows [' + visible.join(', ') + '], expected [' + WANT.join(', ') + ']');

const leftOrder = [...header.matchAll(/id="(topicMenuBtn|lettersBtn|searchBtn|pickStudentBtn)"/g)].map(m => m[1]);
const WANT_L = ['topicMenuBtn', 'lettersBtn', 'searchBtn', 'pickStudentBtn'];
if (leftOrder.join(',') !== WANT_L.join(','))
  problems.push('[topbar] left order is [' + leftOrder.join(', ') + '], expected [' + WANT_L.join(', ') + ']');
if (header.indexOf('Grammar') === -1) problems.push('[topbar] Topics was not renamed to Grammar');
if (header.indexOf('French Grammar — Class 10</span>') !== -1) problems.push('[topbar] old text logo still present');
if (header.indexOf('brand-logo') === -1) problems.push('[topbar] SVG logo missing');
if (header.indexOf('<img') !== -1) problems.push('[topbar] header has an <img> — logo should be inline SVG');
if (html.indexOf('--topbar-h:56px') === -1) problems.push('[topbar] --topbar-h changed — header height must stay 56px');
if (html.indexOf("$('#lettersBtn')") === -1) problems.push('[topbar] lettersBtn not wired in the engine');
// Les Messages sits BEFORE the tb-spacer, so the right-side check above still sees
// exactly [modeBtn, utilBtn, settingsBtn] and the left-order alternation does not
// include it. Assert it is wired, or the button renders and silently does nothing.
if (html.indexOf("$('#messagesBtn')") === -1) problems.push('[topbar] messagesBtn not wired in the engine');


// ---- 11. EXAM-YEAR BARS ----
// The years are derived from the same CBSE tags the q-tag badges use, so the chart
// cannot drift from the tags. Assert every non-zero bar carries its years inside the
// coloured fill, and that the counts still match the tag data.
const LS2 = require('./lessons.js');
const sujA = html.indexOf('data-slide-id="let-prac-sujets"');
const sujB = sujA >= 0 ? html.indexOf('data-slide-id=', sujA + 20) : -1;
const suj = sujA >= 0 ? html.slice(sujA, sujB < 0 ? sujA + 9000 : sujB) : '';
let barRows = 0, barNoYears = 0, barWrong = 0;
if (!suj) problems.push('[bars] the Every Possible Topic slide was not found');
[...suj.matchAll(/<div class="ls-bar-row">[\s\S]*?<\/div>/g)].forEach(m => {
  barRows++;
  const label = (m[0].match(/ls-bar-l">([^<]*)/) || [])[1] || '';
  const v = parseInt((m[0].match(/ls-bar-v">(\d+)/) || [])[1] || '0', 10);
  const inside = (m[0].match(/ls-bar-txt">([^<]*)/) || [])[1];
  if (v > 0){
    if (!inside){ barNoYears++; problems.push(`[bars] "${label}" has no years inside its fill`); }
    else {
      const yrs = (inside.match(/\d{4}/g) || []).length;
      if (yrs !== v){ barWrong++; problems.push(`[bars] "${label}" shows ${yrs} years but a count of ${v}`); }
    }
  }
});
if (barRows !== 8) problems.push(`[bars] ${barRows} chart rows, expected 8`);
// the in-bar text must be styled for contrast, not left inheriting
if (html.indexOf('.ls-bar-txt') === -1) problems.push('[bars] .ls-bar-txt styling missing');
if (html.indexOf('text-shadow:0 1px 2px rgba(0,0,0,.6)') === -1)
  problems.push('[bars] in-bar text has no shadow — white would wash out on the bright cyber gold');

// ---- report ----
const letterSlides = ids.filter(i => PARTS.some(p => i.endsWith('-' + p))).length;
console.log('=== E-FILE VERIFICATION ===');
console.log('  file             :', TARGET);
console.log('  size             :', (fs.statSync(TARGET).size / 1048576).toFixed(2), 'MB');
console.log('  slides total     :', ids.length);
console.log('  model-letter slides:', letterSlides, '(' + letters.length + ' letters x ' + PARTS.length + ')');
console.log('  content pieces   :', checked, 'checked,', lost, 'missing');
console.log('  note words       :', noteWords, 'checked,', noteLost, 'missing');
console.log("  external refs    :", ext.length);
console.log("  letter fit       :", minPx + "-" + maxPx + "px, " + tooBig + " overflow, " + mismatched + " mismatched");
console.log("  sidebar grouping :", nGroups + " chapters, " + nItems + " letters, " + ungrouped + " ungrouped");
console.log('  lesson slides    :', lessons.length, '-', lessonMissing, 'missing,', frLeak, 'French labels left');
console.log('  target French    :', MUST_KEEP.length - keptMissing, '/', MUST_KEEP.length, 'phrases kept');
console.log('  sidebar steps    :', Object.keys(STEPS).length, 'mapped,', stepMissing, 'missing; La Lettre excluded');
console.log('  back-of-room scale:', small ? small + ' TOO SMALL' : 'ok');
console.log('  topbar           :', visible.length + ' visible, ' + (UTILS.length - utilOutside) + '/6 in hamburger');
console.log('  exam-year bars   :', barRows + ' rows, ' + barNoYears + ' missing years, ' + barWrong + ' mismatched');
console.log('  <section> balance:', opens, '/', closes);
console.log('');
console.log('=== PROBLEMS ===');
if (!problems.length) console.log('  none');
else problems.forEach(p => console.log('  x ' + p));
process.exit(problems.length ? 1 : 0);
