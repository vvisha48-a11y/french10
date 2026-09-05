// Integrity check for La Lettre (Section B), now that it ships as ordinary slides.
//
// Two load-bearing assertions:
//   * the 17 model letters in letterdata.js are byte-identical to the baseline
//     snapshot taken before any of this work (the user asked for them untouched);
//   * every one of those letters is actually RENDERED into the slides, so a
//     generator bug cannot quietly drop a letter while the data stays pristine.
const fs = require('fs');
const path = require('path');

const HTML = 'C:/claude/10 th/master-grammar-app.html';
const html = fs.readFileSync(HTML, 'utf8');
const problems = [];

// ---- source data ----
let src = fs.readFileSync(path.join(__dirname, 'letterdata.js'), 'utf8');
const D = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1));
const VISUALS = require('./lm-visuals.js');

const flat = [];
D.forEach(g => g.topics.forEach(t => flat.push(t)));
const lessons = flat.filter(t => t.kind === 'lesson');
const letters = flat.filter(t => t.kind === 'letter');

// ---- the lettre region of the built file ----
const marks = [];
const re = /<section data-topic="lettre"[^>]*data-sub="([^"]*)"/g;
let m;
while ((m = re.exec(html)) !== null) marks.push({ idx: m.index, sub: m[1] });
const first = marks.length ? marks[0].idx : -1;
const region = first < 0 ? '' : html.slice(first, html.indexOf('<section data-topic="revision"', first) + 1 || html.length);

// 1. structure
if (marks.length !== D.length) problems.push(`[stacks] ${marks.length} lettre stacks in the build, expected ${D.length}`);
const slideIds = [...region.matchAll(/data-slide-id="(let-[^"]*)"/g)].map(x => x[1]);
const PARTS = ['sujet','lettre','vocab','bank','retenir'];
const wantSlides = lessons.length + letters.length * PARTS.length;
if (slideIds.length !== wantSlides) problems.push(`[slides] ${slideIds.length} letter slides, expected ${wantSlides}`);
const dup = slideIds.filter((v, i) => slideIds.indexOf(v) !== i);
if (dup.length) problems.push(`[dup] duplicate letter slide ids: ${[...new Set(dup)].join(', ')}`);

// 2. every topic became a slide
const sid = id => (String(id).indexOf('let-') === 0 ? String(id) : 'let-' + id);
lessons.forEach(t => { if (slideIds.indexOf(sid(t.id)) === -1) problems.push(`[missing] lesson "${t.id}" has no slide`); });
letters.forEach(t => PARTS.forEach(p => { if (slideIds.indexOf(sid(t.id) + '-' + p) === -1) problems.push(`[missing] letter "${t.id}" has no "${p}" slide`); }));

// 3. diagrams present and theme-safe
let figs = (region.match(/class="let-fig"/g) || []).length;
const wantFigs = flat.filter(t => t.visual).length;
if (figs !== wantFigs) problems.push(`[visual] ${figs} diagrams rendered, expected ${wantFigs}`);
flat.forEach(t => { if (t.visual && !VISUALS[t.visual]) problems.push(`[visual] "${t.id}" references unknown diagram "${t.visual}"`); });
Object.keys(VISUALS).forEach(k => {
  const svg = VISUALS[k]();
  const hex = svg.match(/(fill|stroke)="#[0-9a-fA-F]{3,8}"/g) || [];
  if (hex.length) problems.push(`[theme] diagram "${k}" has ${hex.length} hardcoded colour(s)`);
});

// 4. the FR/EN toggle exists on every letter slide and is wired
const toggles = (region.match(/class="let-toggle"/g) || []).length;
/* The toggle is required on the LETTER slides (the Model Letters view). Lesson
   slides also carry .let-en but are out of scope for that change; the state is
   global, so a toggle set on a letter slide still applies there. */
const wantToggles = letters.length * PARTS.length;
if (toggles !== wantToggles) problems.push(`[toggle] ${toggles} toggle buttons, expected ${wantToggles}`);
if (html.indexOf('function initLetterToggle') === -1) problems.push('[toggle] initLetterToggle is not in the engine');
if (html.indexOf('initLetterToggle()') === -1) problems.push('[toggle] initLetterToggle is never called from boot()');

// 5. the old module is fully gone
['initLetterModule', 'lettermod', 'lm-nav-list', 'const LETTERDATA'].forEach(dead => {
  if (html.indexOf(dead) !== -1) problems.push(`[stale] "${dead}" still present in the shipped file`);
});

// 6. THE GUARD: model letters unchanged, and actually rendered
const BASE = process.env.LETTER_BASELINE || path.join(
  'C:/Users/User/AppData/Local/Temp/claude/C--claude-10-th-1/62f545d8-bfc7-49be-a707-b19be96afab1/scratchpad',
  'letters-baseline.json');
let drift = 0;
if (fs.existsSync(BASE)){
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const baseIds = Object.keys(base).sort();
  const nowIds = letters.map(t => t.id).sort();
  if (baseIds.join(',') !== nowIds.join(',')) problems.push('[letters] the set of model letters changed');
  letters.forEach(t => {
    if (base[t.id] && JSON.stringify(t) !== base[t.id]){
      drift++;
      if (drift <= 3) problems.push(`[letters] model letter "${t.id}" was MODIFIED — it must be left as-is`);
    }
  });
} else {
  problems.push('[letters] baseline snapshot missing — cannot prove the model letters are unchanged');
}

// each letter's own signature line must appear in its rendered slide
const escHtml = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
let rendered = 0;
letters.forEach(t => {
  const i = region.indexOf('data-slide-id="' + sid(t.id) + '-lettre"');
  if (i < 0) return;
  const j = region.indexOf('data-slide-id=', i + 20);
  const slide = region.slice(i, j < 0 ? region.length : j);
  const sig = escHtml(t.letter.fr.signature);
  if (slide.indexOf(sig) === -1) problems.push(`[render] letter "${t.id}" is missing its signature line in the slide`);
  else rendered++;
});

// ---- report ----
console.log('=== LA LETTRE — SLIDE FORMAT INTEGRITY ===');
console.log('  stacks           :', marks.length, '(' + marks.map(x => x.sub).join(' · ') + ')');
console.log('  slides           :', slideIds.length, '=', lessons.length, 'lessons +', letters.length, 'letters x 4');
console.log('  diagrams         :', figs);
console.log('  FR/EN toggles    :', toggles);
console.log('  model letters    :', letters.length, drift ? `(${drift} MODIFIED)` : '(byte-identical to baseline)');
console.log('  letters rendered :', rendered, '/', letters.length);
console.log('');
console.log('=== PROBLEMS ===');
if (!problems.length) console.log('  none');
else problems.forEach(p => console.log('  x ' + p));
process.exit(problems.length ? 1 : 0);
