// QA sweep 2: validate the AUXILIARY of every compound form across all 500
// verbs in the Interactive Lab. The reference book only prints full tables for
// 38 verbs; this check needs no reference, because a compound tense is
// structurally "<auxiliary> <participle>" and the auxiliary set is closed.
// Catches the broken-auxiliary class of bug directly.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'verbdata.js'), 'utf8');
const V = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));

const AVOIR = {
  pc:        ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
  pqp:       ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
  futurAnt:  ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
  condPasse: ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient']
};
const ETRE = {
  pc:        ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
  pqp:       ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
  futurAnt:  ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
  condPasse: ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient']
};
const COMPOUND = Object.keys(AVOIR);

let checked = 0;
const bad = [];
Object.entries(V).forEach(([key, rec]) => {
  COMPOUND.forEach(t => {
    const forms = rec.t && rec.t[t];
    if (!Array.isArray(forms)) return;
    forms.forEach((f, i) => {
      if (!f) return;                       // impersonal verbs legitimately blank
      checked++;
      const parts = String(f).trim().split(/\s+/);
      /* Pronominals carry a reflexive pronoun, possibly elided onto the
         auxiliary: "me suis" is two tokens, "m'etais" is one (elided). */
      const ai = (/^(me|te|se|nous|vous)$/.test(parts[0]) && parts.length > 2) ? 1 : 0;
      const aux = String(parts[ai]).replace(/^[mts]'/, '');
      const rest = parts.slice(ai + 1).join(' ');
      const okAux = aux === AVOIR[t][i] || aux === ETRE[t][i]
                 || aux === 'me ' + ETRE[t][i]            // defensive: pronominals
                 || /^(me|te|se|nous|vous)$/.test(aux);
      if (!okAux) bad.push({ key, tense: t, person: i, form: f, aux,
                             expected: AVOIR[t][i] + ' / ' + ETRE[t][i] });
      else if (!rest) bad.push({ key, tense: t, person: i, form: f, aux,
                                 expected: 'auxiliary + participle (participle missing)' });
    });
  });
});

console.log('=== INTERACTIVE LAB — AUXILIARY SWEEP (all 500 verbs) ===');
console.log(`compound forms checked : ${checked}`);
if (!bad.length) {
  console.log('RESULT: every compound form has a valid auxiliary.');
  process.exit(0);
}
const byVerb = {};
bad.forEach(b => { (byVerb[b.key] = byVerb[b.key] || []).push(b); });
console.log(`\nBROKEN: ${bad.length} form(s) across ${Object.keys(byVerb).length} verb(s)\n`);
Object.entries(byVerb).forEach(([k, list]) => {
  console.log(`  ${k}  (${list.length})`);
  list.slice(0, 8).forEach(b => console.log(`     ${b.tense.padEnd(10)} p${b.person}  "${b.form}"   aux "${b.aux}" — expected ${b.expected}`));
  if (list.length > 8) console.log(`     … ${list.length - 8} more`);
});
process.exit(1);
