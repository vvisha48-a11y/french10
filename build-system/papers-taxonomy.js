// The CBSE Class 10 French paper, as the syllabus describes it.
//
// This replaces the topic list that used to be inferred from whatever wording a
// question happened to use. The tree here is the one students revise from, so the
// filter teaches the shape of the paper rather than the shape of my regexes.
//
// Two rules keep it honest:
//   * A leaf is bound to a SECTION. "Complétez" appears in Expression and in
//     Culture and means different things; without the binding they bleed together.
//   * Leaves are matched in the order written, most specific first, and the first
//     match wins. Order is therefore part of the data, not an accident.
//
// Verbs are the exception: their tense is not inferable from the instruction --
// "Conjuguez les verbes entre parenthèses" says nothing about which tense each
// item wants. Those tags come from paper-corrections.js, read off the papers.

/* ------------------------------------------------------------------ *
 *  Les Verbes -> the tenses, in the order the deck teaches them.
 *  `legacy` marks a form that is no longer tested but still appears in an
 *  older paper, so its questions stay reachable instead of disappearing.
 * ------------------------------------------------------------------ */
const TENSES = [
  { key: 'infinitif',   label: "L'infinitif" },
  { key: 'present',     label: 'Le présent' },
  { key: 'imperatif',   label: "L'impératif" },
  { key: 'imparfait',   label: "L'imparfait" },
  { key: 'pc',          label: 'Le passé composé' },
  { key: 'pqp',         label: 'Le plus-que-parfait' },
  { key: 'futurProche', label: 'Le futur proche' },
  { key: 'futur',       label: 'Le futur simple' },
  { key: 'futurAnt',    label: 'Le futur antérieur' },
  { key: 'cond',        label: 'Le conditionnel présent' },
  /* Its own row, not folded into the présent: both of these are si +
     plus-que-parfait, where the answer is a compound conditional
     ("aurais pu", "aurait reçu"). Filing them under "présent" described them
     wrongly, which is exactly the sort of thing a student would learn by heart. */
  { key: 'condPasse',   label: 'Le conditionnel passé' },
  { key: 'gerondif',    label: 'Ancien programme (Gérondif)', legacy: true }
];

/* Tenses on the syllabus that these ten papers never ask. Declared rather than
   discovered, so a row that silently STOPS matching is caught by the gate instead
   of being mistaken for one of these.
   Currently empty: reading the 2023 paper off the page turned up
   "Dans quelques instants, il ___ (présenter) son œuvre", which is the futur
   proche, so every tense on the list now has at least one question. The dimmed
   `0 questions` treatment stays in the UI for whenever that stops being true. */
const TENSES_NEVER_ASKED = [];

/* ------------------------------------------------------------------ *
 *  The four sections and their leaves.
 *  `marks` is the syllabus allotment where CBSE states one; where it does not,
 *  gen-papers.js fills in what the most recent paper actually awarded.
 * ------------------------------------------------------------------ */
const TAXONOMY = [
  {
    key: 'comprehension', label: 'Compréhension', section: 'A',
    leaves: [
      { key: 'cp-vocab', label: 'Vocabulary search',
        hint: 'Noun/verb forms, opposites, synonyms, adjectives',
        match: /trouvez dans le texte|cherchez dans le texte|trouvez du texte|contraire|synonyme|forme nominale|un mot qui veut dire|trouvez dans le passage|mots du texte/i },
      /* The papers write this four different ways -- "vrai ou faux",
         "Dites « Vrai » ou « Faux »", "Écrivez ''vrai'' ou ''faux''" -- so the gap
         between the two words has to allow for quote marks. */
      { key: 'cp-tf', label: 'True or false',
        match: /vrai.{0,10}faux/i },
      { key: 'cp-picture', label: 'Picture based',
        match: /regardez .{0,8}(image|photo)|d.crivez .{0,8}image|lisez .{0,8}image|selon .{0,8}image/i },
      /* Last, and matches anything left. Section A is comprehension by definition:
         2020 asks "Pourquoi la ville de Québec a été déclaré site du patrimoine
         mondial ?" with no keyword at all, and that is exactly a short-answer
         comprehension question. The catch-all is confined to this section -- B, C
         and D report anything they cannot place. */
      { key: 'cp-para', label: 'Paragraph with short answers',
        match: /./ }
    ]
  },
  {
    key: 'expression', label: 'Expression', section: 'B',
    leaves: [
      { key: 'ex-letter', label: 'Informal letter',
        match: /lettre/i },
      { key: 'ex-dialogue', label: 'Rearranging of dialogue',
        match: /dialogue/i },
      { key: 'ex-message', label: 'Writing a message',
        match: /message|invitation|refus|accept|annonce|r.digez|excusez/i },
      { key: 'ex-story', label: 'Completing a story',
        match: /compl.tez|choisissant parmi les mots|. l.aide des mots|parmi les mots donn/i }
    ]
  },
  {
    key: 'culture', label: 'Culture et Civilisation', section: 'D',
    leaves: [
      { key: 'cu-match', label: 'Match the following', marks: 5, tally: '5 × 1',
        match: /faites correspondre|reliez/i },
      { key: 'cu-tf', label: 'True or False', marks: 5, tally: '5 × 1',
        match: /vrai.{0,10}faux/i },
      { key: 'cu-mcq', label: 'MCQ',
        match: /choisissez|cochez|encerclez|la bonne r.ponse/i },
      { key: 'cu-fill', label: 'Fill in the blanks', marks: 5, tally: '5 × 1',
        match: /compl.tez|remplissez les blancs|. l.aide des mots|aide des mots/i },
      { key: 'cu-short', label: 'Short answers', marks: 10, tally: '5 × 2',
        match: /r.pondez/i }
    ]
  },
  {
    key: 'grammaire', label: 'Grammaire', section: 'C',
    leaves: [
      /* Before Les Verbes, deliberately. "Mettez les verbes au subjonctif" is a
         verb question, but your taxonomy lists Le subjonctif as its own Grammaire
         topic, so it must win the match -- otherwise Les Verbes swallows all nine
         subjonctif questions and the topic shows three. */
      { key: 'gr-subjonctif', label: 'Le subjonctif',
        match: /subjonctif/i },
      { key: 'gr-verbes', label: 'Les Verbes', tenses: true,
        match: /conjuguez|temps convenable|aux temps|mettez les verbes/i },
      { key: 'gr-discours', label: 'Le discours direct et indirect',
        match: /style (direct|indirect)|discours (direct|rapport|indirect)|directe ou indirecte/i },
      { key: 'gr-question', label: 'Trouver la question',
        match: /trouvez (la|les|des) questions?|trouvez la phrase|trouvez des questions/i },
      { key: 'gr-negation', label: 'La négation',
        match: /n.gati(f|ve)|au n.gatif|. la forme n.g/i },
      { key: 'gr-relatifs', label: 'Les pronoms relatifs simples et composés',
        match: /pronoms? relatifs?|reliez (les phrases|en utilisant)/i },
      { key: 'gr-possessifs', label: 'Les adjectifs et pronoms possessifs',
        match: /poss?ess?ifs?/i },
      { key: 'gr-demonstratifs', label: 'Les adjectifs et pronoms démonstratifs',
        match: /d.monstratifs?/i },
      { key: 'gr-pronoms', label: 'Les pronoms (COD, COI, toniques, y, en)',
        match: /remplacez les (noms|mots)|pronoms personnels|par des pronoms|remplacez les noms|y, en/i },
      /* Kept deliberately: six real questions (2017-2020) ask prepositions, and
         dropping the row would make them unreachable. Labelled so a student can
         see at a glance that it is no longer on their paper. */
      { key: 'gr-prepositions', label: 'Ancien programme (Prépositions)', legacy: true,
        match: /pr.position/i }
    ]
  }
];

/* Every leaf must find at least one question, with these declared exceptions --
   syllabus rows that are deliberately empty. */
const LEAVES_ALLOWED_EMPTY = [];

/* ---- helpers shared by the generator, the gate and the UI ---- */
function allLeaves(){
  const out = [];
  TAXONOMY.forEach(g => g.leaves.forEach(l => out.push(Object.assign({ group: g.key, section: g.section }, l))));
  return out;
}

/* A heading such as "Faites DEUX des questions suivantes" is not a question and
   must never be classified -- its sub-parts carry the real tasks. */
const RE_HEADING = /faites\s+\w+\s+des\s+questions/i;

/* First match wins, and only within the leaf's own section. Returns the leaf or
   null -- outside Section A a question that matches nothing is reported, never
   silently bucketed. */
function classify(instruction, sectionId){
  if (!instruction || RE_HEADING.test(instruction)) return null;
  const g = TAXONOMY.find(x => x.section === sectionId);
  if (!g) return null;
  const hit = g.leaves.find(l => l.match.test(instruction));
  return hit ? Object.assign({ group: g.key, section: g.section }, hit) : null;
}

function tenseByKey(k){ return TENSES.find(t => t.key === k) || null; }

const isHeading = s => RE_HEADING.test(String(s || ''));

module.exports = { TAXONOMY, TENSES, TENSES_NEVER_ASKED, LEAVES_ALLOWED_EMPTY,
                   allLeaves, classify, tenseByKey, isHeading };
