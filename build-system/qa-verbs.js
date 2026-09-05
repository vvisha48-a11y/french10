// QA: cross-check the Interactive Lab's VERBS500 conjugations against the
// reference book "new plan/verbs.md".
//
// Method: the book prints a FULL table for ~44 verbs (être, avoir and the
// irregulars). For each of those, take the verb's block verbatim and assert that
// every form the Lab would display appears somewhere in it. Containment is used
// rather than column parsing because the source is OCR'd two- and four-column
// text with no delimiters — containment still catches wrong stems, wrong
// endings and broken auxiliaries, which is what this QA is for.
//
// Read-only: reports, changes nothing.
const fs = require('fs');
const path = require('path');

const REF = 'C:/claude/10 th/new plan/verbs.md';
const raw = fs.readFileSync(REF, 'utf8').replace(/\r/g, '');
const lines = raw.split('\n');

const src = fs.readFileSync(path.join(__dirname, 'verbdata.js'), 'utf8');
const V = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));

/* normalise for comparison: lowercase, strip accents, collapse apostrophes/space */
const norm = s => String(s || '').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’'`]/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

/* heading -> VERBS500 key. Only verbs the book conjugates in full. */
const MAP = {
  'ÊTRE': 'être', 'AVOIR': 'avoir', 'APPELER': 'appeler', 'CRÉER': 'créer',
  'ENVOYER': 'envoyer', 'JETER': 'jeter', 'ALLER': 'aller', "(s')ASSEOIR": "(s')asseoir",
  'BATTRE': 'battre', 'BOIRE': 'boire', 'BOUILLIR': 'bouillir', 'COUDRE': 'coudre',
  'COURIR': 'courir', 'CROIRE': 'croire', 'CUEILLIR': 'cueillir', 'DEVOIR': 'devoir',
  'DÉPLAIRE': 'déplaire', 'DIRE': 'dire', 'DORMIR': 'dormir', 'ÉCRIRE': 'écrire',
  'FAIRE': 'faire', 'FALLOIR': 'falloir', 'HAÏR': 'haïr', 'LIRE': 'lire',
  'METTRE': 'mettre', 'MOURIR': 'mourir', 'NAÎTRE': 'naître', 'PLEUVOIR': 'pleuvoir',
  'PRENDRE': 'prendre', 'POUVOIR': 'pouvoir', 'RIRE': 'rire', 'SAVOIR': 'savoir',
  'SERVIR': 'servir', 'SUIVRE': 'suivre', 'VAINCRE': 'vaincre', 'VIVRE': 'vivre',
  'VOIR': 'voir', 'VOULOIR': 'vouloir'
};

/* collect each heading's block (heading line -> next heading or --- separator run) */
const headIdx = [];
lines.forEach((l, i) => { const m = /^#\s+(.+?)\s*$/.exec(l); if (m) headIdx.push({ i, name: m[1] }); });

const blocks = {};
headIdx.forEach((h, k) => {
  const end = k + 1 < headIdx.length ? headIdx[k + 1].i : lines.length;
  blocks[h.name] = lines.slice(h.i, end).join('\n');
});

const TENSES = ['present','pc','imparfait','pqp','futur','futurAnt','cond','condPasse','subj','imperatif'];
const PERSON = ['je','tu','il/elle','nous','vous','ils/elles'];

let checkedVerbs = 0, checkedForms = 0;
const misses = [];
const notFound = [];

Object.entries(MAP).forEach(([heading, key]) => {
  const block = blocks[heading];
  if (!block) { notFound.push(`reference block missing for heading "${heading}"`); return; }
  const rec = V[key];
  if (!rec) { notFound.push(`VERBS500 has no entry "${key}" (heading ${heading})`); return; }
  const hay = norm(block);
  checkedVerbs++;

  TENSES.forEach(t => {
    const forms = rec.t && rec.t[t];
    if (!Array.isArray(forms)) { misses.push({ key, tense: t, person: '-', form: '(tense missing)', }); return; }
    forms.forEach((f, i) => {
      if (!f) return;                       // impersonal verbs legitimately blank
      checkedForms++;
      if (hay.indexOf(norm(f)) === -1) {
        misses.push({ key, tense: t, person: PERSON[i] || String(i), form: f });
      }
    });
  });
});

console.log('=== INTERACTIVE LAB — CONJUGATION QA ===');
console.log(`reference : ${REF}`);
console.log(`verbs with a full reference table : ${checkedVerbs} / ${Object.keys(MAP).length}`);
console.log(`forms cross-checked               : ${checkedForms}`);
notFound.forEach(n => console.log('  ! ' + n));

if (!misses.length) {
  console.log('\nRESULT: every checked form appears in the reference. No discrepancies.');
  process.exit(0);
}

/* group by verb so the report is actionable */
const byVerb = {};
misses.forEach(m => { (byVerb[m.key] = byVerb[m.key] || []).push(m); });
console.log(`\nDISCREPANCIES: ${misses.length} form(s) across ${Object.keys(byVerb).length} verb(s)\n`);
Object.entries(byVerb).sort((a, b) => b[1].length - a[1].length).forEach(([k, list]) => {
  console.log(`  ${k}  (${list.length})`);
  list.slice(0, 12).forEach(m => console.log(`     ${m.tense.padEnd(10)} ${m.person.padEnd(10)} "${m.form}"`));
  if (list.length > 12) console.log(`     … ${list.length - 12} more`);
});
process.exit(1);
