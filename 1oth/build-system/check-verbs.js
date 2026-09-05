/* check-verbs.js — validates the generated 500-verb dataset against French rules
   and against the hand-verified 23-verb CONJ table already in the engine.      */
const fs = require('fs');
const V = new Function(fs.readFileSync('verbdata.js', 'utf8') + '; return VERBS500;')();
const keys = Object.keys(V);
const problems = [], notes = [];

const SIMPLE = ['present', 'imparfait', 'futur', 'cond', 'subj'];
const COMPOUND = ['pc', 'pqp', 'futurAnt', 'condPasse'];
const ALL = [...SIMPLE, ...COMPOUND, 'imperatif'];
const END = {
  imparfait: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
  cond:      ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
  futur:     ['ai', 'as', 'a', 'ons', 'ez', 'ont'],
  subj:      ['e', 'es', 'e', 'ions', 'iez', 'ent']
};
// verbs that legitimately have only a 3rd-person form
const IMPERSONAL = new Set(['falloir', 'pleuvoir', 'neiger']);

keys.forEach(k => {
  const v = V[k], P = s => k + '.' + s;
  if (!v.inf || !v.en || !v.group || !v.fam || !v.model) problems.push(P('meta') + ': incomplete');

  ALL.forEach(t => {
    if (!Array.isArray(v.t[t])) { problems.push(P(t) + ': missing tense'); return; }
    const want = (t === 'imperatif') ? 3 : 6;
    const got = v.t[t].filter(x => x !== undefined).length;
    if (got !== want && !(t === 'imperatif' && got <= 3)) problems.push(P(t) + ': ' + got + ' slots, expected ' + want);
  });

  if (IMPERSONAL.has(k)) { notes.push(k + ': impersonal — only 3rd person expected'); return; }

  const pr = v.t.present || [];
  // in French the tu- and il-forms of the présent are NEVER identical
  if (pr[1] && pr[2] && pr[1] === pr[2]) problems.push(P('present') + ': tu === il/elle ("' + pr[1] + '") — source typo');
  // every simple tense should be fully populated
  SIMPLE.forEach(t => (v.t[t] || []).forEach((f, i) => { if (!f) problems.push(P(t) + '[' + i + ']: empty'); }));

  // ending rules — être/avoir/faire/pouvoir/savoir have genuinely irregular
  // subjunctives ("qu'il ait", "que je sois"), so they are exempt from that one.
  const SUBJ_OK = /^(ÊTRE|AVOIR|FAIRE|POUVOIR|SAVOIR)$/.test(v.model);
  Object.keys(END).forEach(t => {
    if (t === 'subj' && SUBJ_OK) return;
    (v.t[t] || []).forEach((f, i) => {
      if (f && !f.endsWith(END[t][i])) problems.push(P(t) + '[' + i + '] "' + f + '" should end -' + END[t][i]);
    });
  });
  // futur and conditionnel must share one stem
  if (v.t.futur && v.t.cond && v.t.futur[0] && v.t.cond[0]) {
    const a = v.t.futur[0].replace(/ai$/, ''), b = v.t.cond[0].replace(/ais$/, '');
    if (a !== b) problems.push(P('stem') + ': futur "' + a + '" != cond "' + b + '"');
  }
  // compound tenses = auxiliary + participle (2+ words)
  COMPOUND.forEach(t => (v.t[t] || []).forEach((f, i) => {
    if (f && f.split(/\s+/).length < 2) problems.push(P(t) + '[' + i + '] "' + f + '" is not compound');
  }));

});

/* ---- STEM-SWAP COLLISION CHECK -----------------------------------------
   Two DIFFERENT verbs sharing one model must never generate the same form.
   If they do, the stem substitution silently failed and left the model
   verb's stem behind (this is how "balayer -> nettoie" was caught).
   A naive "does the form start with the infinitive" test cannot be used,
   because suppletive verbs are legitimately different (aller -> irai).   */
const byModel = {};
keys.forEach(k => { (byModel[V[k].model] = byModel[V[k].model] || []).push(k); });
Object.keys(byModel).forEach(mk => {
  const group = byModel[mk];
  if (group.length < 2) return;
  const seen = {};
  group.forEach(k => {
    const f = (V[k].t.present || [])[0];
    if (!f) return;
    if (seen[f]) problems.push('COLLISION [' + mk + ']: "' + seen[f] + '" and "' + k + '" both give présent "' + f + '"');
    else seen[f] = k;
  });
});

/* ---- cross-check against the hand-verified 23-verb CONJ table in the engine ---- */
const eng = fs.readFileSync('e-engine.html', 'utf8');
const cm = eng.match(/const CONJ = (\{[\s\S]*?\n\};)/);
let mismatches = 0, compared = 0;
if (cm) {
  const CONJ = eval('(' + cm[1].replace(/;$/, '') + ')');
  const MAP = { present: 'present', imparfait: 'imparfait', futur: 'futur', cond: 'cond', subj: 'subj' };
  Object.keys(CONJ).forEach(vk => {
    const gen = V[vk]; if (!gen) { notes.push('CONJ verb "' + vk + '" not in 500 set'); return; }
    Object.keys(MAP).forEach(t => {
      (CONJ[vk][t] || []).forEach((expected, i) => {
        const got = gen.t[MAP[t]] && gen.t[MAP[t]][i];
        compared++;
        if (got && got !== expected) { mismatches++; if (mismatches <= 12) problems.push('MISMATCH ' + vk + '.' + t + '[' + i + ']: generated "' + got + '" vs verified "' + expected + '"'); }
      });
    });
  });
}

console.log('verbs validated     :', keys.length);
console.log('groups              :', [...new Set(keys.map(k => V[k].group))].sort().join(', '));
console.log('families            :', [...new Set(keys.map(k => V[k].fam))].join(', '));
console.log('distinct models used:', new Set(keys.map(k => V[k].model)).size);
console.log('forms total         :', keys.reduce((n, k) => n + ALL.reduce((m, t) => m + (V[k].t[t] || []).filter(Boolean).length, 0), 0));
console.log('cross-checked vs hand-verified table:', compared, 'forms,', mismatches, 'mismatches');
console.log('');
if (notes.length) console.log('NOTES (' + notes.length + '): ' + notes.slice(0, 5).join(' | '));
console.log(problems.length ? 'PROBLEMS (' + problems.length + '):\n  ' + problems.slice(0, 25).join('\n  ') : 'PROBLEMS: none');
process.exit(problems.length ? 1 : 0);
