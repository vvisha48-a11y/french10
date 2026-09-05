// Partition test for the Verb Family Navigator.
//
// This is the one thing that would silently mislead students if wrong, so it is
// tested rather than eyeballed. It extracts the REAL VFAM block out of the built
// HTML and runs it against the REAL VERBS500, so the test can never drift from
// what actually ships.
const fs = require('fs');

const HTML = 'C:/claude/10 th/master-grammar-app.html';
const html = fs.readFileSync(HTML, 'utf8');
const problems = [];

// ---- load VERBS500 straight from the built file ----
const vs = html.indexOf('const VERBS500 = ');
if (vs < 0) { console.error('VERBS500 not found in output'); process.exit(1); }
const vOpen = html.indexOf('{', vs);
const vClose = html.indexOf('};', vOpen);
const VERBS500 = JSON.parse(html.slice(vOpen, vClose + 1));

// ---- extract and evaluate the VFAM block from the engine ----
const marker = 'function vfInf(';
const mi = html.indexOf(marker);
const endMarker = 'function initVerbFamilies(';
const ei = html.indexOf(endMarker, mi);
if (mi < 0 || ei < 0) { console.error('VFAM block not found in output'); process.exit(1); }
const block = html.slice(mi, ei);

const sandbox = { VERBS500: VERBS500 };
const run = new Function('VERBS500', block + '\nreturn { VFAM: VFAM, vfBucketOf: vfBucketOf, vfSubById: vfSubById };');
const { VFAM, vfBucketOf, vfSubById } = run(VERBS500);

// ---- expected counts, from the approved plan ----
const EXPECT = {
  'er-std': 229, 'er-gercer': 47, 'er-yer': 13, 'er-accent': 26, 'er-double': 4,
  'ir-reg': 27, 'ir-likeer': 9, 'ir-partir': 12, 'ir-venir': 20, 'ir-autres': 10,
  're-reg': 17, 're-prendre': 6, 're-mettre': 6, 're-conn': 6, 're-uire': 12,
  're-indre': 7, 're-autres': 28,
  'irr-piliers': 7, 'irr-oir': 12, 'irr-imp': 2,
  // Safety-net chip. It must stay EMPTY: anything landing here is a verb that
  // matched no real family, i.e. an orphan the UI would otherwise have dropped.
  'irr-autres': 0
};
const FALLBACK = 'irr-autres';

// ---- bucket every verb, and count how many buckets each verb matches ----
const buckets = {}, multi = [], orphans = [];
VFAM.forEach(t => t.sub.forEach(s => { buckets[s.id] = []; }));

Object.keys(VERBS500).forEach(k => {
  const v = VERBS500[k];
  const hits = [];
  VFAM.forEach(t => t.sub.forEach(s => { try { if (s.rule(v)) hits.push(s.id); } catch (e) {} }));
  if (hits.length === 0) orphans.push(k);
  if (hits.length > 1) multi.push(k + ' -> ' + hits.join(' + '));
  const b = vfBucketOf(v);
  if (b) buckets[b.sub].push(k);
});

// 1. exact partition
const total = Object.keys(buckets).reduce((n, id) => n + buckets[id].length, 0);
if (total !== 500) problems.push(`[partition] bucketed ${total} verbs, expected 500`);
if (orphans.length) problems.push(`[orphan] ${orphans.length} verb(s) match no sub-family: ${orphans.slice(0, 8).join(', ')}`);
if (multi.length) problems.push(`[overlap] ${multi.length} verb(s) match more than one sub-family: ${multi.slice(0, 5).join(' | ')}`);

// 2. per-bucket counts
Object.keys(EXPECT).forEach(id => {
  if (!(id in buckets)) { problems.push(`[missing-chip] ${id} is not defined in VFAM`); return; }
  if (buckets[id].length !== EXPECT[id]) problems.push(`[count] ${id}: ${buckets[id].length}, expected ${EXPECT[id]}`);
});
Object.keys(buckets).forEach(id => {
  if (!(id in EXPECT)) problems.push(`[unexpected-chip] ${id} has no expected count`);
  if (id === FALLBACK){
    if (buckets[id].length) problems.push(`[orphan] ${buckets[id].length} verb(s) fell through to the safety net: ${buckets[id].slice(0, 8).join(', ')}`);
    return;   // an empty safety net is the correct state, and the UI hides it
  }
  if (!buckets[id].length) problems.push(`[empty-chip] ${id} has no verbs — would render a dead card`);
});

// 3. specific verbs that must land in specific places
const where = key => { const b = vfBucketOf(VERBS500[key]); return b ? b.sub : '(none)'; };
const MUST = {
  aller: 'irr-piliers', etre: 'irr-piliers', avoir: 'irr-piliers', faire: 'irr-piliers',
  geler: 'er-accent', appeler: 'er-double', jeter: 'er-double', acheter: 'er-accent',
  manger: 'er-gercer', commencer: 'er-gercer', payer: 'er-yer',
  finir: 'ir-reg', ouvrir: 'ir-likeer', partir: 'ir-partir', venir: 'ir-venir',
  vendre: 're-reg', prendre: 're-prendre', mettre: 're-mettre', conduire: 're-uire'
};
Object.keys(MUST).forEach(k => {
  const key = (k === 'etre') ? 'être' : k;
  if (!VERBS500[key]) { problems.push(`[key] verb "${key}" not in dataset`); return; }
  const got = where(key);
  if (got !== MUST[k]) problems.push(`[placement] ${key} is in "${got}", expected "${MUST[k]}"`);
});

// 4. every verb carries all 10 tenses with usable forms.
// Exactly three verbs legitimately have NO imperative in French: you cannot
// command someone to "be necessary", "rain", or "be able". Anything else with a
// missing tense is a real data gap, and a new name appearing here is a regression.
const TENSES = ['present','pc','imparfait','pqp','futur','futurAnt','cond','condPasse','subj','imperatif'];
const NO_IMPERATIVE = ['falloir','pleuvoir','pouvoir','neiger'];
const foundNoImp = [];
let tenseBad = 0;
Object.keys(VERBS500).forEach(k => {
  const t = VERBS500[k].t || {};
  TENSES.forEach(tn => {
    const f = t[tn];
    const filled = (f || []).filter(x => x && String(x).trim()).length;
    if (filled) return;
    if (tn === 'imperatif'){
      foundNoImp.push(k);
      if (NO_IMPERATIVE.indexOf(k) === -1 && tenseBad++ < 6) problems.push(`[tense] ${k} has no imperatif and is not a known exception`);
      return;
    }
    if (tenseBad++ < 6) problems.push(`[tense] ${k}.${tn} has no forms`);
  });
});
foundNoImp.sort();
console.log('  no imperative    :', foundNoImp.join(', ') || '(none)', '— expected: falloir, pleuvoir, pouvoir');

// ---- report ----
console.log('=== VERB FAMILY NAVIGATOR — PARTITION TEST ===');
console.log('  verbs in dataset :', Object.keys(VERBS500).length);
console.log('  tabs             :', VFAM.length);
console.log('  sub-families     :', Object.keys(buckets).length);
console.log('  bucketed         :', total);
console.log('  orphans          :', orphans.length);
console.log('  double-matched   :', multi.length);
console.log('');
VFAM.forEach(t => {
  const n = t.sub.reduce((x, s) => x + buckets[s.id].length, 0);
  console.log('  ' + String(t.label).padEnd(14) + String(n).padStart(4));
  t.sub.forEach(s => console.log('      ' + s.id.padEnd(14) + String(buckets[s.id].length).padStart(4)));
});
console.log('');
console.log('=== PROBLEMS ===');
if (!problems.length) console.log('  none');
else problems.forEach(p => console.log('  x ' + p));
process.exit(problems.length ? 1 : 0);
