/* ============================================================
   extract-verbs.js — BUILD-TIME ONLY (never ships)
   Reads  : C:/claude/10 th/new plan/verbs.md
   Writes : scratchpad/verbdata.js   ->  const VERBS500 = {...}
   ============================================================ */
const fs = require('fs');
const SRC = 'C:/claude/10 th/new plan/verbs.md';
const OUT = 'verbdata.js';
const L = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
const report = { modelWarnings: [], verbWarnings: [] };

/* ---------- helpers ---------- */
const norm = s => (s || '').toUpperCase().replace(/[^A-ZÀ-ÿ]/gi, '');
const lc = s => (s || '').toLowerCase();

// strip the leading pronoun; position in the array carries the person
function stripPron(f) {
  if (!f) return null;
  let t = f.trim();
  if (t === '-' || t === '') return null;
  t = t.replace(/^Que\s+j['’]/i, '')
       .replace(/^Qu['’]il\/elle\s+/i, '')
       .replace(/^Qu['’]ils\/elles\s+/i, '')
       .replace(/^Que\s+(je|tu|nous|vous)\s+/i, '')
       .replace(/^J['’]/i, '')
       .replace(/^(Je|Tu|Nous|Vous)\s+/i, '')
       .replace(/^Il\/elle\s+/i, '')
       .replace(/^Ils\/elles\s+/i, '')
       .replace(/^Il\s+/i, '');           // impersonal: "Il faut"
  t = t.replace(/\s*-\s*$/, '').trim();   // drop a trailing "-" placeholder
  return t.trim() || null;
}

const SPLIT = /(?=\bJ['’]|\bJe |\bTu |\bIl\/elle |\bNous |\bVous |\bIls\/elles )/;
function splitRow(line, n) {
  const parts = (line || '').split(SPLIT).map(s => s.trim()).filter(Boolean);
  if (parts.length === n) return parts;
  // impersonal rows ("- - - -", or "Il faut Il a fallu ...") -> pad
  if (/^[-\s]+$/.test(line || '')) return new Array(n).fill(null);
  if (/^Il\s/.test((line || '').trim())) {
    const p = (line || '').split(/(?=\bIl\s)/).map(s => s.trim()).filter(Boolean);
    if (p.length === n) return p;
  }
  return null;
}

/* ---------- STEP A: parse the 69 model tables ---------- */
const anchors = [];
L.forEach((l, i) => { if (l.trim() === 'Présent Passé composé Imparfait Plus-que-parfait') anchors.push(i); });

const BLOCKS = [
  { hdr: 'Présent Passé composé Imparfait Plus-que-parfait', cols: 4, tenses: ['present', 'pc', 'imparfait', 'pqp'] },
  { hdr: 'Futur simple Futur antérieur',                     cols: 2, tenses: ['futur', 'futurAnt'] },
  { hdr: 'Conditionnel présent Conditionnel passé',          cols: 2, tenses: ['cond', 'condPasse'] }
];

const models = {};
anchors.forEach(a => {
  // model name + infinitive stem live just above the table
  let name = null, stem = null, ending = null;
  for (let j = a - 1; j > a - 16 && j >= 0; j--) {
    const t = (L[j] || '').trim();
    if (!stem) {
      const m = t.match(/^•\s*([A-Za-zÀ-ÿ'’()]+)\s+-\s+([a-zà-ÿ'’]+)$/);
      if (m) { stem = m[1]; ending = m[2]; }
    }
    if (/^#\s+/.test(t)) { name = t.replace(/^#\s+/, '').trim(); break; }
  }
  if (!name) { report.modelWarnings.push('unnamed model table at line ' + (a + 1)); return; }

  const key = norm(name);
  const t = {};
  BLOCKS.forEach(b => {
    const h = L.findIndex((l, j) => j >= a - 2 && j < a + 70 && l.trim() === b.hdr);
    if (h < 0) { report.modelWarnings.push(name + ': missing block "' + b.hdr + '"'); return; }
    b.tenses.forEach(tn => t[tn] = []);
    for (let r = h + 1; r < h + 7; r++) {
      const cells = splitRow(L[r], b.cols);
      b.tenses.forEach((tn, ci) => t[tn].push(cells ? stripPron(cells[ci]) : null));
    }
  });

  // subjonctif + impératif share one block with different row counts
  const hs = L.findIndex((l, j) => j >= a - 2 && j < a + 70 && l.trim() === 'Subjonctif présent Impératif présent');
  t.subj = []; t.imperatif = [];
  if (hs >= 0) {
    for (let r = hs + 1; r < hs + 7; r++) {
      const line = (L[r] || '').trim();
      // anchor the imperative at END of line, else a lazy match eats the subjunctive
      const m = line.match(/^(.*?)\s+(\S+)\s*!\s*\((?:Tu|Nous|Vous)\)\s*$/);
      if (m) { t.subj.push(stripPron(m[1])); t.imperatif.push(m[2].trim()); }
      else { t.subj.push(stripPron(line)); }
    }
  }

  models[key] = { name, stem, ending, inf: stem && ending ? stem + ending : null, t };
});

/* ---- corrections for typos present in the SOURCE BOOK itself ----
   Each was found by the rule-based validator, then confirmed against the
   printed table. Format: MODELKEY -> tense -> index -> correct form.      */
const CORRECTIONS = {
  BOIRE:  { present: { 2: 'boit' } },                    // book prints "Il/elle bois"
  METTRE: { futur:   { 2: 'mettra' } },                  // book prints "Il/elle mettrait"
  FAIRE:  { subj: { 3: 'fassions', 4: 'fassiez' } },     // book prints the présent "faisons/faites"
  POUVOIR:{ subj: { 2: 'puisse' } }                      // book prints "Qu'il/elle puisses"
};
let corrected = 0;
Object.keys(CORRECTIONS).forEach(mk => {
  const M = models[mk];
  if (!M) { report.modelWarnings.push('correction target model missing: ' + mk); return; }
  Object.keys(CORRECTIONS[mk]).forEach(tn => {
    Object.keys(CORRECTIONS[mk][tn]).forEach(i => {
      if (!M.t[tn]) return;
      M.t[tn][+i] = CORRECTIONS[mk][tn][i]; corrected++;
    });
  });
});

/* ---- RULE-BASED AUTO-REPAIR --------------------------------------------
   The book repeatedly prints the PRÉSENT form in the nous/vous slots of the
   imparfait and subjonctif, and occasionally a futur form in the conditionnel.
   These three tenses are 100% regular in French, so the correct form is
   derivable. Repair ONLY where the printed form breaks the rule.           */
const SUBJ_IRREG = new Set(['ÊTRE', 'AVOIR', 'FAIRE', 'POUVOIR', 'SAVOIR']);  // own subjunctive stems
let repaired = { futur: 0, imparfait: 0, cond: 0, subj: 0 };
Object.keys(models).forEach(mk => {
  const M = models[mk], t = M.t;
  if (!t) return;

  // 1. futur — stem always ends in -r; endings are -ai -as -a -ons -ez -ont
  if (t.futur && t.futur[0] && /ai$/.test(t.futur[0])) {
    const stem = t.futur[0].replace(/ai$/, '');
    ['ai', 'as', 'a', 'ons', 'ez', 'ont'].forEach((e, i) => {
      if (t.futur[i] && t.futur[i] !== stem + e) { t.futur[i] = stem + e; repaired.futur++; }
    });
  }
  // 2. imparfait — endings are -ais -ais -ait -ions -iez -aient for EVERY French verb.
  //    -GER/-CER keep their softening ONLY before a/o, so "mangeais" but "mangions".
  if (t.imparfait && t.imparfait[0] && /ais$/.test(t.imparfait[0])) {
    const raw = t.imparfait[0].replace(/ais$/, '');
    const soft = raw.replace(/ge$/, 'g').replace(/ç$/, 'c');   // stem used before -ions/-iez
    ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].forEach((e, i) => {
      const want = (e[0] === 'i' ? soft : raw) + e;
      if (t.imparfait[i] && t.imparfait[i] !== want) { t.imparfait[i] = want; repaired.imparfait++; }
    });
  }
  // 3. conditionnel — always the FUTUR stem + imparfait endings
  if (t.cond && t.futur && t.futur[0] && /ai$/.test(t.futur[0])) {
    const stem = t.futur[0].replace(/ai$/, '');
    ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].forEach((e, i) => {
      if (t.cond[i] && t.cond[i] !== stem + e) { t.cond[i] = stem + e; repaired.cond++; }
    });
  }
  // 4. subjonctif nous/vous are ALWAYS identical to the imparfait nous/vous,
  //    except for the five verbs with their own subjunctive stem.
  if (t.subj && t.imparfait && !SUBJ_IRREG.has(mk)) {
    [3, 4].forEach(i => {
      const want = t.imparfait[i];
      if (want && t.subj[i] !== want) { t.subj[i] = want; repaired.subj++; }
    });
  }
});

/* ---------- STEP B: parse the 500-verb index ---------- */
const start = L.findIndex(l => l.trim() === '## 500 MOST COMMON FRENCH VERBS');
let listEnd = start;
for (let i = start; i < L.length; i++) if (/(1st|2nd|3rd) group\s+See/.test(L[i])) listEnd = i;

const entries = [];
let buf = null;
for (let i = start + 1; i <= listEnd; i++) {
  const raw = (L[i] || '').trim();
  if (/^\d+\.\s/.test(raw)) { if (buf) entries.push(buf); buf = raw; }
  else if (buf) buf += ' ' + raw;                 // join wrapped continuation lines
  // être/avoir are listed as "Auxiliary" rather than a numbered group
  if (buf && /(?:(?:1st|2nd|3rd) group|Auxilia\w*)\s+See\s+.+?\s+P\.\d+/.test(buf)) { entries.push(buf); buf = null; }
}
if (buf) entries.push(buf);

const verbs = {};
entries.forEach(line => {
  const m = line.match(/^(\d+)\.\s+(.+?)\s+(?:(1st|2nd|3rd)\s+group|(Auxilia\w*))\s+See\s+(.+?)\s+P\.\d+/);
  if (!m) { report.verbWarnings.push('unparsed index line: ' + line.slice(0, 70)); return; }
  const head = m[2], grp = m[3] || '3rd', modelRef = m[5];
  // "Armer To arm" -> infinitive | english
  const ti = head.search(/\sTo\s/);
  const inf = (ti > 0 ? head.slice(0, ti) : head).trim();
  const en  = (ti > 0 ? head.slice(ti + 1) : '').trim();
  const key = norm(modelRef.replace(/^verbs ending in\s+/i, ''));
  verbs[lc(inf).replace(/\s+/g, '')] = { inf, en, group: +grp[0], modelKey: key, raw: modelRef };
});

/* ---- MODEL OVERRIDES -----------------------------------------------------
   A verb whose own page in the book carries a full table, but whose entry in
   the 500-verb list points at a generic model, ends up conjugated by that
   generic model instead of its own.

   envoyer: the list sends it to the YER model, which yields the regular
   "j’envoierai". The real future stem is irregular — "enverr-" — and the book
   prints it correctly on the ENVOYER page (p.43). Its own derivative
   "renvoyer" already resolves to ENVOYER and is right; only the base verb
   slipped through. Verified against verbs.md: "Tu enverras", "Nous enverrons",
   "Tu enverrais", "Nous enverrions".                                        */
const MODEL_OVERRIDE = { envoyer: "ENVOYER" };
Object.keys(MODEL_OVERRIDE).forEach(v => {
  if (verbs[v]) verbs[v].modelKey = MODEL_OVERRIDE[v];
  else report.verbWarnings.push("model override for missing verb: " + v);
});

/* ---------- STEP C: generate every form ---------- */
// Diacritic-blind comparison: "plaçais" must still match the stem "plac".
const deacc = s => (s || '').normalize('NFD').replace(new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']','g'), '').replace(/ç/g, 'c').replace(/Ç/g, 'C');

/* Replace the model stem at the start of each word (handles "ai chanté").
   Stem-changing families alter the stem in some persons only —
   plac->plaç before a/o, préfér->préfèr, achet->achèt. We detect that
   alternation by diffing the model's form-stem against its infinitive stem,
   then apply the same change to the target verb, aligned from the END
   (same-family verbs share their stem ending).                              */
/* Compound tenses are "<auxiliary> <participle>"; only the participle varies
   with the verb. prefixForm() already leaves the auxiliary alone, but swapStem
   mapped over EVERY word, and its length guard (p < ms.length - 2) can never
   reject anything when the model stem is 1-2 characters. A model whose stem
   parsed as "a" therefore rewrote the auxiliary itself: "avons" -> "affaibvons",
   "avais" -> "bâvais", "ai" -> "ass". 747 forms across 37 verbs were affected.
   Auxiliaries are a closed set, so exclude them explicitly. */
const AUX_WORDS = new Set([
  'ai','as','a','avons','avez','ont',
  'avais','avait','avions','aviez','avaient',
  'aurai','auras','aura','aurons','aurez','auront',
  'aurais','aurait','aurions','auriez','auraient',
  'aie','aies','ait','ayons','ayez','aient',
  'suis','es','est','sommes','etes','sont',
  'etais','etait','etions','etiez','etaient',
  'serai','seras','sera','serons','serez','seront',
  'serais','serait','serions','seriez','seraient',
  'sois','soit','soyons','soyez','soient'
]);

function swapStem(form, mStem, vStem) {
  if (!form) return null;
  const n = mStem.length, ms = deacc(lc(mStem));
  return form.split(' ').map(w => {
    if (AUX_WORDS.has(deacc(lc(w)))) return w;   // never rewrite the auxiliary
    // Lenient match: the stem may itself be altered in this person
    // (nettoy -> nettoie, plac -> plaç), so allow the last 2 chars to differ.
    const dw = deacc(lc(w));
    let p = 0; while (p < ms.length && p < dw.length && dw[p] === ms[p]) p++;
    if (p === 0 || p < ms.length - 2) return w;
    const modelPrefix = w.slice(0, n);     // e.g. "plaç" / "préfèr" / "nettoi"
    const rest = w.slice(n);               // e.g. "ais"  / "e"      / "e"
    const ns = vStem.split('');
    for (let k = 0; k < n; k++) {
      const mc = mStem[n - 1 - k], pc = modelPrefix[n - 1 - k];
      if (mc === undefined || pc === undefined) break;
      if (lc(mc) !== lc(pc)) { const idx = ns.length - 1 - k; if (idx >= 0) ns[idx] = pc; }
    }
    return ns.join('') + rest;
  }).join(' ');
}
function prefixForm(form, pre) {
  if (!form) return null;
  // prefix only the FIRST word: "ai pris" -> "ai appris" is wrong; participle carries it
  const parts = form.split(' ');
  if (parts.length === 1) return pre + parts[0];
  // compound: auxiliary stays, participle takes the prefix
  return parts[0] + ' ' + pre + parts.slice(1).join(' ');
}

const TENSES = ['present', 'pc', 'imparfait', 'pqp', 'futur', 'futurAnt', 'cond', 'condPasse', 'subj', 'imperatif'];
const FAM = k => {
  if (['ER','CER','GER','YER','ETER','ELER','ENER','ESER','EVER','ÉDER','ÉRER','ÉTER','ÉTRER','APPELER','CRÉER','ENVOYER','JETER'].includes(k)) return 'reg-er';
  if (k === 'IR') return 'reg-ir';
  if (['TIR','DORMIR','SERVIR','FUIR','FRIR','VRIR','CUEILLIR','BOUILLIR','COURIR','MOURIR','ÉRIR','HAÏR'].includes(k)) return 'partir';
  if (['DRE','URE','AINDRE','EINDRE','OINDRE','SOUDRE','COUDRE','VAINCRE','BATTRE','METTRE'].includes(k)) return 'reg-re';
  if (k === 'PRENDRE') return 'prendre';
  if (k === 'ENIR') return 'venir';
  if (['ÊTRE','AVOIR','ALLER','FAIRE','VOIR','DIRE','LIRE','ÉCRIRE','SAVOIR','UIRE','AÎTRE','NAÎTRE','SUIVRE','VIVRE','RIRE','CROIRE','DÉPLAIRE','SASSEOIR'].includes(k)) return 'essential';
  return 'boot';   // boire, devoir, pouvoir, vouloir, cevoir, falloir, pleuvoir…
};

const out = {};
let derivedPrefix = 0, derivedStem = 0;
Object.keys(verbs).forEach(vk => {
  const v = verbs[vk];
  const M = models[v.modelKey];
  if (!M) { report.verbWarnings.push(v.inf + ': model "' + v.raw + '" (' + v.modelKey + ') not found'); return; }

  // Reflexives are printed as "Abstenir (s')" or "(se)Reposer" — strip the marker
  // so the bare infinitive drives the stem.
  const vInf = lc(v.inf)
      .replace(/\(\s*s['’]\s*\)/g, '')
      .replace(/\(\s*se\s*\)/g, '')
      .replace(/^s['’]/, '')
      .replace(/[()]/g, '')
      .replace(/\s+/g, '')
      .trim();
  const mInf = M.inf ? lc(M.inf) : null;
  let method = null, mStem = null, vStem = null, pre = null;

  if (mInf && vInf !== mInf && vInf.endsWith(mInf)) { method = 'prefix'; pre = vInf.slice(0, vInf.length - mInf.length); }
  else if (M.stem && M.ending && vInf.endsWith(lc(M.ending))) {
    method = 'stem'; mStem = M.stem; vStem = vInf.slice(0, vInf.length - M.ending.length);
  } else if (mInf && vInf === mInf) { method = 'same'; }
  else if (M.stem) { method = 'stem'; mStem = M.stem; vStem = vInf.replace(/(er|ir|re|oir)$/, ''); }
  else { method = 'same'; }

  const t = {};
  TENSES.forEach(tn => {
    const src = M.t[tn] || [];
    t[tn] = src.map(f => {
      if (!f) return null;
      if (method === 'prefix') return prefixForm(f, pre);
      if (method === 'stem')   return swapStem(f, mStem, vStem);
      return f;
    });
  });
  if (method === 'prefix') derivedPrefix++; else if (method === 'stem') derivedStem++;

  out[vk] = { inf: v.inf, en: v.en, group: v.group, fam: FAM(v.modelKey), model: M.name, t };
});

/* ---------- STEP D: emit ---------- */
/* ---- AUXILIARY: ÊTRE ----------------------------------------------------
   The book's model pages carry the MODEL verb's auxiliary, and every verb in
   the family inherits it. That is wrong whenever the auxiliary differs inside
   a family: the -ENIR page is Tenir ("J'ai tenu") so venir/devenir/revenir all
   got avoir; the -TIR page is Mentir ("J'ai menti") so partir and sortir did
   too. The auxiliary is a lexical property of each verb, not of its ending, so
   it has to be listed.

   Source of the list: the deck's own lesson slide (c2-verbes.html) —
   "DR & MRS VANDERTRAMP" (16 verbs) + all pronominal verbs — extended with
   parvenir/survenir/intervenir (venir-family, être in standard French) and
   passer/demeurer (both auxiliaries exist; être chosen deliberately).

   Agreement follows the "né(e)s" pattern already used by naître and mourir.
   A participle ending in -s (assis) is invariable in the masculine plural, so
   it takes "(es)" rather than "(e)s".                                        */
const ETRE_VERBS = new Set([
  // DR & MRS VANDERTRAMP, exactly as the lesson slide teaches them
  'devenir','revenir','monter','rester','sortir','venir','aller','naître',
  'descendre','entrer','rentrer','tomber','retourner','arriver','mourir','partir',
  // venir family, standard être
  'parvenir','survenir','intervenir',
  // both auxiliaries exist; être chosen
  'passer','demeurer'
]);
/* pronominals: être AND a reflexive pronoun */
const PRONOMINAL = new Set([
  "abstenir(s')", "(s')asseoir", "enfuir(s')", "fier(se)", "(se)reposer", "souvenir(se)"
]);

const ETRE_AUX = {
  pc:        ['suis','es','est','sommes','êtes','sont'],
  pqp:       ['étais','étais','était','étions','étiez','étaient'],
  futurAnt:  ['serai','seras','sera','serons','serez','seront'],
  condPasse: ['serais','serais','serait','serions','seriez','seraient']
};
/* reflexive pronoun per person; elides before a vowel (t'es, s'est, m'étais) */
const REFL = ['me','te','se','nous','vous','se'];
const elide = (p, aux) => (/^[aeiouéèêh]/i.test(aux) && /^(me|te|se)$/.test(p))
  ? p[0] + "'" + aux : p + ' ' + aux;

/* strip the auxiliary and any agreement markers to recover the participle */
function participleOf(pcForm) {
  if (!pcForm) return null;
  let t = String(pcForm).trim().replace(/^\S+\s+/, '');   // drop the auxiliary
  t = t.replace(/^(me|te|se|nous|vous)\s+/, '').replace(/^[mts]'/, '');
  return t.replace(/\((e|es)\)s?$/, '').replace(/\(e\)$/, '').trim();
}

let etreFixed = 0, etreForms = 0;
Object.keys(out).forEach(k => {
  const isPron = PRONOMINAL.has(k);
  if (!ETRE_VERBS.has(k) && !isPron) return;
  const rec = out[k];
  const part = participleOf((rec.t.pc || [])[0]);
  if (!part) { report.verbWarnings.push('être verb with no participle: ' + k); return; }
  const plural = /s$/.test(part) ? part + '(es)' : part + '(e)s';
  const single = part + '(e)';
  Object.keys(ETRE_AUX).forEach(tn => {
    if (!Array.isArray(rec.t[tn])) return;
    rec.t[tn] = ETRE_AUX[tn].map((aux, i) => {
      const p = i < 3 ? single : plural;
      etreForms++;
      return isPron ? elide(REFL[i], aux) + ' ' + p : aux + ' ' + p;
    });
  });
  etreFixed++;
});
console.log('être auxiliary applied : ' + etreFixed + ' verbs, ' + etreForms + ' forms');

fs.writeFileSync(OUT, 'const VERBS500 = ' + JSON.stringify(out) + ';\n', 'utf8');

const bytes = fs.statSync(OUT).size;
console.log('source typos corrected:', corrected);
console.log('model tables parsed :', Object.keys(models).length);
console.log('verbs in index      :', Object.keys(verbs).length);
console.log('verbs generated     :', Object.keys(out).length, '(prefix:' + derivedPrefix + ' stem:' + derivedStem + ' same:' + (Object.keys(out).length - derivedPrefix - derivedStem) + ')');
console.log('verbdata.js size    :', (bytes / 1024).toFixed(0) + ' KB');
if (report.modelWarnings.length) console.log('\nMODEL WARNINGS (' + report.modelWarnings.length + '):\n  ' + report.modelWarnings.slice(0, 10).join('\n  '));
if (report.verbWarnings.length)  console.log('\nVERB WARNINGS (' + report.verbWarnings.length + '):\n  ' + report.verbWarnings.slice(0, 15).join('\n  '));
