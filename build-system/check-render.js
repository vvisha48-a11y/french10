// RUNTIME render test for the Family Navigator.
//
// Why this exists: the navigator once shipped blank because boot() called
// `$('.vfam').forEach(...)` — `$` returns ONE element, which has no .forEach, so
// it threw a TypeError that the try/catch swallowed. Every static check passed.
// Static checks cannot catch that class of bug; only running the code can.
//
// So this builds a minimal DOM shim, actually executes initVerbFamilies against
// the real VERBS500, and asserts that tabs, chips, verbs and the 10-tense
// conjugation all really render.
const fs = require('fs');
const HTML = 'C:/claude/10 th/master-grammar-app.html';
const html = fs.readFileSync(HTML, 'utf8');
const problems = [];

/* ---------------- minimal DOM shim ---------------- */
let NODE = 0;
function mkEl(cls, tag){
  const el = {
    _id: ++NODE, tagName: (tag || 'div').toUpperCase(),
    children: [], parent: null, _html: '', _text: '',
    dataset: {}, style: {},
    classes: new Set(String(cls || '').split(/\s+/).filter(Boolean)),
    listeners: {}
  };
  Object.defineProperty(el, 'className', {
    get(){ return [...el.classes].join(' '); },
    set(v){ el.classes = new Set(String(v).split(/\s+/).filter(Boolean)); }
  });
  Object.defineProperty(el, 'textContent', {
    get(){ return el._text; }, set(v){ el._text = String(v); }
  });
  Object.defineProperty(el, 'innerHTML', {
    get(){ return el._html; },
    set(v){
      el._html = String(v);
      // parse out class="..." so querySelector can find generated nodes
      el.children = [];
      const re = /<(\w+)[^>]*class="([^"]*)"/g;
      let m;
      while ((m = re.exec(el._html)) !== null){
        const c = mkEl(m[2], m[1]);
        c.parent = el;
        el.children.push(c);
      }
    }
  });
  el.classList = {
    add: c => el.classes.add(c),
    remove: c => el.classes.delete(c),
    contains: c => el.classes.has(c),
    toggle: (c, on) => { if (on === undefined) el.classes.has(c) ? el.classes.delete(c) : el.classes.add(c); else on ? el.classes.add(c) : el.classes.delete(c); }
  };
  el.appendChild = c => { c.parent = el; el.children.push(c); return c; };
  el.addEventListener = (ev, fn) => { (el.listeners[ev] = el.listeners[ev] || []).push(fn); };
  el.click = () => (el.listeners.click || []).forEach(f => f({ stopPropagation(){}, preventDefault(){} }));
  el.closest = () => null;
  el.removeAttribute = () => {};
  el.setAttribute = () => {};
  return el;
}
function walk(root, out){ root.children.forEach(c => { out.push(c); walk(c, out); }); return out; }
function matchSel(el, sel){
  sel = sel.trim();
  if (sel.startsWith('.')) return el.classes.has(sel.slice(1));
  if (sel.startsWith('#')) return false;
  return el.tagName === sel.toUpperCase();
}
function qsa(root, sel){
  // only class/tag selectors are used by the navigator
  const simple = sel.split(',')[0].trim().split(/\s+/).pop();
  return walk(root, []).filter(e => matchSel(e, simple));
}

/* ---------------- build the slide's DOM ---------------- */
const doc = mkEl('document', 'body');
const vfam = mkEl('vfam');
const tabs = mkEl('vfam-tabs'), subs = mkEl('vfam-subs'), panel = mkEl('vfam-panel');
vfam.appendChild(tabs); vfam.appendChild(subs); vfam.appendChild(panel);
doc.appendChild(vfam);

const $  = (sel, root) => qsa(root || doc, sel)[0] || null;
const $$ = (sel, root) => qsa(root || doc, sel);
const norm = s => String(s || '').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
const document = { createElement: t => mkEl('', t) };

/* ---------------- load engine region + data ---------------- */
const vs = html.indexOf('const VERBS500 = ');
const VERBS500 = JSON.parse(html.slice(html.indexOf('{', vs), html.indexOf('};', vs) + 1));

// Two regions only. Everything between them contains top-level DOM wiring
// ($('#prevBtn').onclick = ...) that cannot run outside a browser.
const a1 = html.indexOf('const CJ_PRON'), a2 = html.indexOf('function initConjLab(');
const b1 = html.indexOf('function vfInf('), b2 = html.indexOf('function boot(){');
if (a1 < 0 || a2 < 0 || b1 < 0 || b2 < 0){ console.error('engine regions not found'); process.exit(1); }
const region = html.slice(a1, a2) + '\n' + html.slice(b1, b2);

let api;
try {
  api = new Function('$', '$$', 'norm', 'document', 'VERBS500', 'playSound', 'Deck', 'window',
    region + '\nreturn { initVerbFamilies: initVerbFamilies, VFAM: VFAM, cjRenderAllTenses: cjRenderAllTenses, cjFuturProche: cjFuturProche };'
  )($, $$, norm, document, VERBS500, function(){}, { getIndices(){ return { h:0, v:0 }; }, slide(){} }, {});
} catch (e){
  console.error('ENGINE REGION FAILED TO LOAD: ' + e.message);
  process.exit(1);
}

/* ---------------- actually run it ---------------- */
try { api.initVerbFamilies(vfam); }
catch (e){ problems.push('[fatal] initVerbFamilies threw: ' + e.message); }

// 1. tabs rendered?
if (tabs.children.length !== api.VFAM.length)
  problems.push(`[tabs] rendered ${tabs.children.length} tabs, expected ${api.VFAM.length}`);
tabs.children.forEach((t, i) => {
  if (!String(t.innerHTML).includes(api.VFAM[i].label))
    problems.push(`[tabs] tab ${i} does not show label "${api.VFAM[i].label}"`);
});

// 2. clicking each tab renders its non-empty sub-chips
api.VFAM.forEach((tab, i) => {
  try { tabs.children[i].click(); } catch (e){ problems.push(`[tab-click] ${tab.id} threw: ${e.message}`); return; }
  const expect = tab.sub.length;              // empty families intentionally hide
  if (subs.children.length === 0) problems.push(`[chips] tab "${tab.label}" rendered no sub-family chips`);
  if (subs.children.length > expect) problems.push(`[chips] tab "${tab.label}" rendered ${subs.children.length} chips, max ${expect}`);
});

// 3. clicking a chip renders pattern card + verb list + conjugation
try {
  tabs.children[0].click();                   // -ER
  subs.children[0].click();                   // Standard -ER
  const h = String(panel.innerHTML);
  ['vfam-endings','vfam-rule','vfam-search','vfam-verbs','vfam-conj','vfam-open'].forEach(c => {
    if (!h.includes(c)) problems.push(`[panel] missing .${c} after selecting a family`);
  });
  const verbs = qsa(panel, '.vfam-verb');
  if (!verbs.length) problems.push('[verbs] no verb buttons rendered for Standard -ER');
} catch (e){
  problems.push('[panel] rendering a family threw: ' + e.message);
}

// 4. the shared renderer produces all 11 tenses for a real verb
try {
  const head = mkEl('cj-head'), grid = mkEl('cj-allgrid');
  api.cjRenderAllTenses(VERBS500['parler'], head, grid, {});
  const blocks = grid.children.filter(c => c.classes.has('cj-block'));
  if (blocks.length !== 11) problems.push(`[conj] parler rendered ${blocks.length} tense blocks, expected 11`);
  if (!String(head.innerHTML).toLowerCase().includes('parler')) problems.push('[conj] header does not name the verb');
} catch (e){
  problems.push('[conj] cjRenderAllTenses threw: ' + e.message);
}

/* 4b. the futur proche is BUILT, not stored, so the rule itself is the thing to
   test: aller + a clean lower-case infinitive, and the six reflexive records that
   keep their marker inside `inf` must get their own pronoun. */
try {
  const fp = v => (api.cjFuturProche(v) || []).join(' | ');
  const want = [
    ['parler',      'vais parler',     'vont parler'],
    ['(se)reposer', 'vais me reposer', 'vont se reposer'],
    ["(s')asseoir", "vais m'asseoir",  "vont s'asseoir"],
    ['finir',       'vais finir',      'vont finir']
  ];
  want.forEach(([key, first, last]) => {
    const v = VERBS500[key];
    if (!v){ problems.push('[fp] ' + key + ' is not in the dataset'); return; }
    const forms = api.cjFuturProche(v);
    if (!forms || forms.length !== 6){
      problems.push('[fp] ' + key + ' produced ' + (forms ? forms.length : 'no') + ' forms, expected 6');
      return;
    }
    if (forms[0] !== first) problems.push('[fp] ' + key + ' je-form is "' + forms[0] + '", expected "' + first + '"');
    if (forms[5] !== last)  problems.push('[fp] ' + key + ' ils-form is "' + forms[5] + '", expected "' + last + '"');
  });
  // nothing may leak the dataset's Title Case or its reflexive markers
  const leaky = Object.keys(VERBS500).filter(k => {
    const f = api.cjFuturProche(VERBS500[k]);
    return !f || f.length !== 6 || f.some(x => /[A-Z]/.test(x) || x.indexOf('(') >= 0);
  });
  if (leaky.length)
    problems.push('[fp] ' + leaky.length + ' verb(s) build a malformed futur proche, e.g. ' +
      leaky.slice(0, 3).map(k => k + ' -> ' + fp(VERBS500[k])).join(' ; '));
} catch (e){
  problems.push('[fp] cjFuturProche threw: ' + e.message);
}

/* ---------------- 5. static lint for the exact bug that shipped ----------------
   `$` returns ONE element and `$$` returns an array. `$(sel).forEach(...)` is
   therefore always a TypeError — and because every module init is wrapped in
   try/catch, it fails silently and the slide renders blank. This lint scans the
   shipped file for that pattern; the runtime test above cannot see it, because
   the fault lives in boot()'s wiring rather than inside the function. */
const badForEach = html.match(/[^$]\$\([^)]*\)\s*\.forEach/g) || [];
badForEach.forEach(m => problems.push('[lint] single-$ with .forEach (always throws): ' + m.trim()));

// and make sure boot() really wires the navigator up at all
const bootBody = html.slice(html.indexOf('function boot(){'), html.indexOf('function boot(){') + 4000);
if (bootBody.indexOf('initVerbFamilies') === -1)
  problems.push('[lint] boot() never calls initVerbFamilies — the slide would stay blank');
if (bootBody.indexOf('initSpeedDrill') === -1)
  problems.push('[lint] boot() never calls initSpeedDrill');

/* ---------------- 6. timeline visibility guards ----------------
   The timeline once rendered as "white text on white": inlining GSAP made
   `typeof gsap !== 'undefined'` true at BOTH call sites, so __enhanceTimeline
   ran twice. gsap.from() infers its END opacity from the element's current
   value, so the second call landed mid-tween, recorded end ~0, and animated
   0 -> 0. The text colours were always correct; the nodes were just invisible. */
const tlFn = html.slice(html.indexOf('window.__enhanceTimeline'), html.indexOf('window.__enhanceTimeline') + 1400);
if (tlFn.indexOf('tlAnimated') === -1)
  problems.push('[timeline] __enhanceTimeline has no run-once guard — a second call can leave every tense invisible');
if (/gsap\.from\s*\(/.test(tlFn) && !/gsap\.fromTo\s*\(/.test(tlFn))
  problems.push('[timeline] uses gsap.from() with opacity: the end value is INFERRED, use fromTo with an explicit opacity:1');
if (tlFn.indexOf('clearProps') === -1)
  problems.push('[timeline] tween does not clearProps — inline opacity would outlive the animation');
if (tlFn.indexOf('tlReveal') === -1)
  problems.push('[timeline] no fallback that strips inline opacity if the tween fails');

// Any .tl-* selector setting light text must get a background from SOMEWHERE.
// Two passes, because the background is often painted by a sibling rule sharing
// the same selector (.tl-mood.cond.active sets colour in one rule and background
// in the next) — a single-rule check would report that as a false positive.
// strip CSS comments first: a trailing /* ... */ gets swallowed into the NEXT
// rule's selector capture, which would make an exact selector match fail
const cssSrc = html.replace(/\/\*[\s\S]*?\*\//g, '');
const cssRe = /([^{}]+)\{([^}]*)\}/g;
const paintsBg = new Set();
let cm2;
while ((cm2 = cssRe.exec(cssSrc)) !== null){
  if (!/background\s*:/.test(cm2[2])) continue;
  cm2[1].split(',').forEach(p => paintsBg.add(p.trim()));
}
cssRe.lastIndex = 0;
let tlRisk = 0;
while ((cm2 = cssRe.exec(cssSrc)) !== null){
  const sel = cm2[1].trim(), body = cm2[2];
  if (sel.indexOf('.tl-') === -1) continue;
  const col = body.match(/(^|[;\s])color\s*:\s*([^;]+)/);
  if (!col) continue;
  const val = col[2].trim().toLowerCase();
  if (val.indexOf('var(') === 0) continue;
  if (!/#fff|#ffffff|white/.test(val)) continue;
  // safe if every comma-part of this selector is painted somewhere
  const parts = sel.split(',').map(p => p.trim());
  const unpainted = parts.filter(p => !paintsBg.has(p) && !/background\s*:/.test(body));
  if (unpainted.length){
    tlRisk++;
    problems.push('[contrast] "' + unpainted[0].slice(0, 60) + '" sets light text but nothing paints it a background');
  }
}
console.log('  timeline contrast :', tlRisk ? tlRisk + ' RISK' : 'ok');

/* ---------------- report ---------------- */
console.log('  lint: bad forEach :', badForEach.length);
console.log('=== FAMILY NAVIGATOR — RUNTIME RENDER TEST ===');
console.log('  tabs rendered    :', tabs.children.length);
console.log('  chips (last tab) :', subs.children.length);
console.log('  panel rendered   :', panel.innerHTML ? 'yes' : 'no');
console.log('');
console.log('=== PROBLEMS ===');
if (!problems.length) console.log('  none');
else problems.forEach(p => console.log('  x ' + p));
process.exit(problems.length ? 1 : 0);

