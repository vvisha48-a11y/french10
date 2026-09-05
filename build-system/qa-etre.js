// QA sweep 3: assert the CORRECT auxiliary per verb.
//
// qa-aux.js only checked that an auxiliary was a *valid* auxiliary form — it
// accepted "ai" or "suis" interchangeably, so a verb like aller conjugated with
// avoir passed. That gap is why 19 être-verbs shipped with avoir. This check
// closes it: être-verbs must use être, everything else must use avoir.
//
// The être list is the deck's own lesson (c2-verbes.html, "DR & MRS
// VANDERTRAMP" + all pronominals), extended with parvenir/survenir/intervenir
// and passer/demeurer per an explicit decision.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'verbdata.js'), 'utf8');
const V = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));

const ETRE = new Set([
  'devenir','revenir','monter','rester','sortir','venir','aller','naître',
  'descendre','entrer','rentrer','tomber','retourner','arriver','mourir','partir',
  'parvenir','survenir','intervenir','passer','demeurer'
]);
const PRONOMINAL = new Set([
  "abstenir(s')", "(s')asseoir", "enfuir(s')", "fier(se)", "(se)reposer", "souvenir(se)"
]);
const COMPOUND = ['pc','pqp','futurAnt','condPasse'];
const ETRE_AUX  = /^(suis|es|est|sommes|êtes|sont|étais|était|étions|étiez|étaient|serai|seras|sera|serons|serez|seront|serais|serait|serions|seriez|seraient)$/;
const AVOIR_AUX = /^(ai|as|a|avons|avez|ont|avais|avait|avions|aviez|avaient|aurai|auras|aura|aurons|aurez|auront|aurais|aurait|aurions|auriez|auraient)$/;
const REFL      = /^(me|te|se|nous|vous|m'|t'|s')/;

let checked = 0;
const wrongAux = [], missingRefl = [], strayRefl = [], noAgreement = [];

Object.entries(V).forEach(([key, rec]) => {
  const wantEtre = ETRE.has(key) || PRONOMINAL.has(key);
  const isPron   = PRONOMINAL.has(key);
  COMPOUND.forEach(t => {
    const forms = rec.t && rec.t[t];
    if (!Array.isArray(forms)) return;
    forms.forEach((f, i) => {
      if (!f) return;
      checked++;
      const words = String(f).trim().split(/\s+/);
      let idx = 0;
      const hasRefl = REFL.test(words[0]) && words.length > 2
                   || /^[mts]'/.test(words[0]);
      if (isPron) {
        if (!REFL.test(words[0])) missingRefl.push(`${key}.${t}[${i}] "${f}"`);
        // "m'étais" is one token; "me suis" is two
        idx = /^[mts]'/.test(words[0]) ? 0 : 1;
      } else if (REFL.test(words[0]) && words.length > 2) {
        strayRefl.push(`${key}.${t}[${i}] "${f}"`);
      }
      const aux = /^[mts]'/.test(words[idx]) ? words[idx].replace(/^[mts]'/, '') : words[idx];
      const isEtre = ETRE_AUX.test(aux), isAvoir = AVOIR_AUX.test(aux);
      if (wantEtre && !isEtre) wrongAux.push(`${key}.${t}[${i}] "${f}" — needs ÊTRE`);
      if (!wantEtre && !isAvoir) wrongAux.push(`${key}.${t}[${i}] "${f}" — needs AVOIR`);
      // être forms must show agreement
      if (wantEtre && !/\((e|es)\)s?$/.test(String(f).trim())) noAgreement.push(`${key}.${t}[${i}] "${f}"`);
    });
  });
});

console.log('=== INTERACTIVE LAB — CORRECT-AUXILIARY SWEEP ===');
console.log(`compound forms checked : ${checked}`);
console.log(`verbs expected to use être : ${ETRE.size + PRONOMINAL.size}`);
const report = (list, label) => {
  if (!list.length) return 0;
  console.log(`\n${label}: ${list.length}`);
  list.slice(0, 12).forEach(x => console.log('   ' + x));
  if (list.length > 12) console.log(`   … ${list.length - 12} more`);
  return list.length;
};
let bad = 0;
bad += report(wrongAux,    'WRONG AUXILIARY');
bad += report(missingRefl, 'PRONOMINAL MISSING REFLEXIVE PRONOUN');
bad += report(strayRefl,   'NON-PRONOMINAL WITH A REFLEXIVE PRONOUN');
bad += report(noAgreement, 'ÊTRE FORM WITHOUT PARTICIPLE AGREEMENT');
if (!bad) console.log('\nRESULT: every compound form uses the correct auxiliary, with agreement.');
process.exit(bad ? 1 : 0);
