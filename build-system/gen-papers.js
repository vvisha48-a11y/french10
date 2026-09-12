// Build build-system/paperdata.js from the papers' own text, plus the text that
// had to be read off the rendered pages by eye.
//
//   node extract-pdf-text.js    (once, needs poppler; output is committed)
//   node gen-papers.js
//
// This script does NOT repair French any more. It used to guess at missing
// apostrophes and rejoin split words with a vocabulary, and that was the wrong
// shape of solution for exam text: a rule that is right 95% of the time still
// puts wrong French in front of a student, and there is no way to tell which 5%.
// So what remains here is mechanical decoding only:
//
//   * strip what is certainly not exam content (watermarks, page furniture)
//   * decode two Symbol-font code points the scrape left as private-use chars
//   * read the marks tally
//   * parse the six different layouts CBSE has used across these ten papers
//
// Anything that needed a human -- the fifteen blank items, the apostrophes the
// 2022-2024 PDFs do not contain, and every verb tense -- comes from
// paper-corrections.js, where each entry names the PDF page it was read from.
const fs = require('fs');
const path = require('path');
const TAX = require('./papers-taxonomy.js');
const CORR = require('./paper-corrections.js');

const SP  = __dirname;
const DIR = path.join(SP, 'papers-text');
const OUT = path.join(SP, 'paperdata.js');

/* ------------------------------------------------------------------ *
 *  META - read off the papers themselves, not guessed from filenames.
 *  `variant` is what distinguishes one sitting from another, which
 *  matters because three separate papers are all from 2018.
 * ------------------------------------------------------------------ */
const META = [
  { id:'qp2017',  file:'CBSE Class 10 French SET 4 Annual Question Paper 2017 (All India Scheme).txt',
    year:2017, variant:'Annual', scope:'All India', marks:90, duration:'3 hours', series:'HRK C / SET-4',
    note:'The 90-mark pattern, before the paper was trimmed to 80.' },
  { id:'qp2018a', file:'CBSE Class 10 French Annual Question Paper 2018.txt',
    year:2018, variant:'Annual', scope:'', marks:80, duration:'3 hours', series:'TYM C', note:'' },
  { id:'qp2018r', file:'CBSE Class 10 French Annual Re-Conducted Question Paper 2018 (For Punjab Only).txt',
    year:2018, variant:'Re-conducted', scope:'Punjab only', marks:80, duration:'3 hours', series:'TYM / SET-4',
    note:'Re-conducted for Punjab after the original sitting.' },
  { id:'qp2018c', file:'CBSE Class 10 French SET 4 Compartment Annual Question Paper 2018.txt',
    year:2018, variant:'Compartment', scope:'', marks:80, duration:'3 hours', series:'TYM', note:'' },
  { id:'qp2019',  file:'CBSE Class 10 French Question Paper 2019.txt',
    year:2019, variant:'Annual', scope:'', marks:80, duration:'3 hours', series:'JMS C / SET-4', note:'' },
  { id:'qp2020',  file:'CBSE Class 10 French Question Paper 2020.txt',
    year:2020, variant:'Annual', scope:'', marks:80, duration:'3 hours', series:'', note:'' },
  { id:'qp2022',  file:'CBSE Class 10 French Question Paper 2022.txt',
    year:2022, variant:'40 marks', scope:'', marks:40, duration:'2 hours', series:'SET-4',
    note:'The shortened term paper: 2 hours, 40 marks, four questions of grammar instead of six.' },
  { id:'qp2023',  file:'CBSE Class 10 French Question Paper 2023.txt',
    year:2023, variant:'Annual', scope:'', marks:80, duration:'3 hours', series:'ZWYX S', note:'' },
  { id:'qp2024',  file:'CBSE Class 10 French Question Paper 2024.txt',
    year:2024, variant:'Annual', scope:'', marks:80, duration:'3 hours', series:'#CDBA / SET-4', note:'' },
  { id:'qp2025',  file:'CBSE Class 10 French Question Paper 2025.txt',
    year:2025, variant:'Annual', scope:'', marks:80, duration:'3 hours', series:'1GEFH / SET~4', note:'' }
];

/* The three papers whose PDFs draw text as unmapped glyphs. Named so the census
   can say which questions were completed by hand rather than extracted. */
const HAND_READ = ['qp2022', 'qp2023', 'qp2024'];

/* ------------------------------------------------------------------ *
 *  1. STRIP - lines and fragments that are certainly not exam content
 * ------------------------------------------------------------------ */
const JUNK = [
  /careerindia|studiestoday/i,               // scraper watermark
  /^\s*\*?\s*HCNERF\s*\*?\s*$/i,             // "FRENCH" reversed, 2025 page margin
  /^\s*\*\s*\d+\s*\*/,                       // *20*  margin code
  /^\s*#\s*$/,
  /^\s*\d+\s*-\s*\d+\s+Page\s+\d+/i,
  /^\s*Page\s+\d+(\s+of\s+\d+)?\s*$/i,
  /^\s*\d+\s+\d+\s+P\.?\s?T\.?\s?O\.?\s*$/i,
  /^\s*\[?\s*P\.?\s?T\.?\s?O\.?\s*\]?\s*$/i,
  /^\s*Roll\s*No\.?\s*$/i,
  /^\s*Q\.?\s?P\.?\s*Code\s*$/i,
  /^\s*SET[\s~-]?\d+\s*$/i,
  /^\s*Series\b/i,
  /* A page number, or a paper code and page number side by side on their own
     line ("20        4"). The single-number form alone let 2019's "20 4" get
     glued onto the end of question 5(f). */
  /^\s*\d{1,3}(\s+\d{1,3})?\s*$/
];
const isJunk = l => JUNK.some(re => re.test(l));

/* Page furniture is also printed in the margin, and -layout glues it onto the end
   of whatever question sat beside it: "...je suis malade. 20 5 [ P.T.O." */
const INLINE = [
  /\s*\d{1,3}\s+\d{1,3}\s*\[?\s*P\.?\s?T\.?\s?O\.?\s*\]?\s*/g,
  /\s*\[?\s*P\.?\s?T\.?\s?O\.?\s*\]?\s*$/,
  /\s*\d{1,2}-\d{1,2}\s+Page\s+\d+\s*/g,
  /\s*\d{1,3}\s+Page\s+\d+\s+of\s+\d+\s*/g,
  /\s*Page\s+\d+\s+of\s+\d+\s*/g,
  /\s*\*\s?\d+\s?\*\s*/g,
  /\s*\*?\s*HCNERF\s*\*?\s*/gi,    // "FRENCH" reversed, glued mid-line by -layout
  /\s+\.co(?=\s|$)/g,              // a stray fragment of the careerindia watermark
  /\s+\d{1,3}\s+[Mm]arks?\s*$/,    // a section's marks note dragged onto an item
  /* In the 2018 Compartment paper "www.careerindia.com" is set vertically down
     the margin, so single letters of it land at the start of body lines:
     "e I. Lisez le texte suivant..." and "m (f) Si Paul avait su...". Only
     stripped when what follows is unmistakably a question head or an item
     label, so real text cannot be eaten. Without the item case, "m (f) ..." was
     read as a continuation of item (d) and two questions' option lists merged. */
  /^(\s*)[a-z.]{1,3}\s+(?=(?:(?:\d{1,2}|X{0,2}(?:IX|IV|V?I{1,3}|V|X))\s*\.\s*\S|\((?:[a-h]|i|ii|iii|iv|v|vi|vii|viii)\)\s*\S))/
];
const scrubInline = l => INLINE.reduce((t, re) => t.replace(re, ' '), l);

/* -layout puts marginal text on the same line as body text, so a section header
   can arrive glued to a question: "1. Lisez le texte, SECTION A 10 Marks" and
   "(4) Trouvez du texte : .co Section – B (Expression Écrite) 2". Line-anchored
   matching misses both, and the section then disappears from the paper. This
   pass cuts such a line into its parts before anything else reads it. */
const RE_SECTION_INLINE =
  /\bSECTIONS?\s*[–—-]?\s*([A-D])\b(?!\s*:)\s*(?:\(([^)]{3,40})\))?(?:\s*(\d{1,3})\s*[Mm]arks?)?/i;
/* Does the text sitting before the header start a new question? CBSE prints the
   header in the margin beside the first question of its section, so
   "1. Lisez le texte, SECTION A 10 Marks" means question 1 belongs AFTER the
   header -- while "(4) Trouvez du texte : Section – B" is the tail of the
   PREVIOUS section, and putting it after would move it into the wrong one. */
const RE_STARTS_QUESTION = /^\s*(?:\d{1,2}\s*\.|X{0,2}(?:IX|IV|V?I{1,3}|V|X)\s*\.)/;
function splitSectionHeaders(lines){
  /* Only rescue a section that would otherwise be MISSING. Every paper prints a
     contents list in its instructions ("Section A : Question no. 1 to 1(c)"), and
     splitting on those produced each section three times over. So: find the
     letters that already have a header on a line of their own, and leave those
     alone entirely. */
  const anchored = new Set();
  lines.forEach(l => { const m = RE_SECTION.exec(l); if (m) anchored.add(m[1].toUpperCase()); });

  const out = [];
  lines.forEach(l => {
    const m = RE_SECTION_INLINE.exec(l);
    if (!m || anchored.has(m[1].toUpperCase()) ||
        (m.index === 0 && m[0].length === l.trim().length)){ out.push(l); return; }
    const before = l.slice(0, m.index).trim();
    const after  = l.slice(m.index + m[0].length).trim();
    const header = 'SECTION ' + m[1].toUpperCase() +
      (m[2] ? ' (' + m[2] + ')' : '') + (m[3] ? ' ' + m[3] + ' Marks' : '');
    const beforeOpensQuestion = before && RE_STARTS_QUESTION.test(before);
    if (before && !beforeOpensQuestion) out.push(before);
    out.push(header);
    if (beforeOpensQuestion) out.push(before);
    if (after) out.push(after);
  });
  return out;
}

/* The papers set two glyphs in the Symbol font and the scrape kept Symbol's
   private-use code points, which render as empty boxes. U+F0B4 being the
   multiplication sign is also why some marks tallies read "2 1 10=5". Symbol's
   encoding is fixed, so this is a lookup, not a guess. */
const PUA = [
  [new RegExp(String.fromCharCode(0xF0B4), 'g'), ' × '],
  [new RegExp(String.fromCharCode(0xF0B7), 'g'), ' · ']
];
const fixPUA = l => PUA.reduce((t, [re, ch]) => t.replace(re, ch), l);

function cleanPaper(raw){
  const log = { junk: 0 };
  const lines = [];
  raw.split(String.fromCharCode(0)).join('').replace(/\r\n?/g, '\n').split('\n').forEach(l => {
    if (isJunk(l)){ log.junk++; return; }
    lines.push(fixPUA(scrubInline(l)).replace(/[ \t]+/g, ' ').replace(/\s+$/, ''));
  });
  return { lines: splitSectionHeaders(lines), log };
}

/* ------------------------------------------------------------------ *
 *  2. PARSE - six layouts, one reader.
 *
 *  2017     : 90 marks, questions 1..13, sub-parts "1.1", items (a)-(e)
 *  2018 x2  : 80 marks, questions I..XVI in roman numerals
 *  2018c/19/20 : 80 marks, flat numbering, items (a)-(h)
 *  2022     : 40 marks, questions 1..7
 *  2023     : 80 marks, questions 4..9 with (a)/(b)
 *  2024     : 80 marks, one question 4 with (a)-(f) and (I)/(II)
 *  2025     : 80 marks, questions 1..12
 * ------------------------------------------------------------------ */
const SECTION_NAMES = { A:'Compréhension', B:'Expression Écrite', C:'Grammaire', D:'Culture et Civilisation' };
const ROMAN = 'i|ii|iii|iv|v|vi|vii|viii|ix|x';

const RE_SECTION = /^\s*SECTIONS?\s*[–—-]?\s*([A-D])\b(?!\s*:)\s*(?:\(([^)]+)\))?\s*(\d+)?\s*(?:marks?)?\s*$/i;
const RE_NUM     = /^\s*(\d{1,2})\s*\.\s*(.*)$/;
const RE_DOTNUM  = /^\s*(\d{1,2}\.\d)\s+(.*)$/;
const RE_ROMNUM  = /^\s*(X{0,2}(?:IX|IV|V?I{1,3}|V|X))\s*\.\s*(.*)$/;
const RE_LETTER  = /^\s*\(([a-h])\)\s*(?:\((I{1,3})\)\s*)?(.*)$/;
const RE_ROMAN   = new RegExp('^\\s*\\((' + ROMAN + ')\\)\\s*(.*)$', 'i');
const RE_OR      = /^\s*(OU\b|OU \(Or\)|\(Or\))\s*$/i;
const RE_MARKS   = /(?:(\d+)\s*×\s*(\d+)\s*=\s*(\d+)|(\d+))\s*$/;
const RE_CHOOSE  = /\(\s*(\d+)\s*au choix\s*\)/i;
const RE_CHOOSER = /faites\s+(deux|une|un|\w+)\s+des\s+questions|[ée]crivez\s+(une|la)\s+lettre|\d\s*(au choix|×\s*10)/i;

const looksLikeHead = t => /:\s*(\(.*\))?\s*(\d|$)/.test(t) || RE_CHOOSE.test(t);

/* A tally like "5 × 1 = 5" is the marks note from the margin, and the number
   after the final "=" is what the question is worth. It is not always at the end
   of the line, so it is matched wherever it appears and removed from the text. */
const RE_TALLY = /(?:\d+\s*)+(?:[×x]\s*)?(?:\d+\s*)*=\s*(\d+)/;
function takeMarks(text){
  let s = String(text);
  let marks = null;
  const t = RE_TALLY.exec(s);
  if (t){
    const v = Number(t[1]);
    if (v > 0 && v <= 40) marks = v;
    s = s.slice(0, t.index) + ' ' + s.slice(t.index + t[0].length);
  }
  s = s.replace(/\s{2,}/g, ' ').trim();
  if (marks !== null) return { text: s, marks };
  const m = RE_MARKS.exec(s);
  if (!m) return { text: s, marks: null };
  const v = m[3] ? Number(m[3]) : (m[4] ? Number(m[4]) : null);
  if (v === null || v > 40) return { text: s, marks: null };
  return { text: s.slice(0, s.lastIndexOf(m[0])).trim(), marks: v };
}

function parsePaper(lines, meta){
  const sections = [];
  let sec = null, q = null, item = null, pendingOr = false, chooserBase = null;

  /* Lines that look like a question but arrive BEFORE any section header. The
     2018 Compartment paper prints question I above its "Section – A" line, and
     without this buffer that whole question was silently dropped. */
  let orphans = [];
  const pushSection = id => {
    sec = { id, name: SECTION_NAMES[id] || id, marks: null, intro: [], questions: [] };
    sections.push(sec); q = null; item = null; pendingOr = false; chooserBase = null;
    if (sections.length === 1 && orphans.length){ const o = orphans; orphans = []; o.forEach(read); }
  };
  const pushQuestion = (num, text) => {
    const t = takeMarks(text);
    const ch = RE_CHOOSE.exec(t.text);
    q = {
      id: meta.id + '-' + num.replace(/[^\w.]/g, ''),
      num, instruction: t.text.replace(RE_CHOOSE, '').replace(/\s{2,}/g, ' ').trim(),
      marks: t.marks, choose: ch ? Number(ch[1]) : null,
      isAlternative: pendingOr, items: [], topics: [], answer: null, flags: []
    };
    pendingOr = false;
    if (RE_CHOOSER.test(q.instruction)) chooserBase = num.replace(/\(.*$/, '');
    if (sec) sec.questions.push(q);
    item = null;
  };

  const read = line => {
    line = line.trim();
    if (!line) return;

    const ms = RE_SECTION.exec(line);
    if (ms){
      pushSection(ms[1].toUpperCase());
      if (ms[2]) sec.name = ms[2].replace(/\s+/g, ' ').trim();
      if (ms[3]) sec.marks = Number(ms[3]);
      return;
    }
    if (sec && !sec.questions.length){
      const mm = /^\(?([A-Za-zÀ-ÿ’' ]+)\)?\s*(\d+)\s*[Mm]arks?\s*$/.exec(line);
      if (mm){ sec.marks = Number(mm[2]); return; }
      if (/^\d+\s*[Mm]arks?$/.test(line)){ sec.marks = parseInt(line, 10); return; }
    }
    if (!sec){
      /* hold it for the first section, rather than dropping it */
      if (RE_STARTS_QUESTION.test(line)) orphans.push(line);
      return;
    }
    if (RE_OR.test(line)){ pendingOr = true; return; }
    /* a marks tally stranded on its own line is notation, not question text */
    if (q && /^\d{1,2}\s*[=×x]\s*\d{1,2}$/.test(line)) return;

    const md = RE_DOTNUM.exec(line);
    if (md){ pushQuestion(md[1], md[2]); return; }

    const mv = RE_ROMNUM.exec(line);
    if (mv){ pushQuestion(mv[1], mv[2]); return; }

    const mn = RE_NUM.exec(line);
    if (mn && Number(mn[1]) <= 16){
      if (!/^\s*\(/.test(mn[2])) pendingOr = false;
      const inner = RE_LETTER.exec(mn[2]);
      if (inner) pushQuestion(mn[1] + '(' + inner[1] + ')' + (inner[2] ? '(' + inner[2] + ')' : ''), inner[3]);
      else pushQuestion(mn[1], mn[2]);
      return;
    }

    const ml = RE_LETTER.exec(line);
    const base0 = q ? q.num.replace(/\(.*$/, '') : null;
    if (ml && q && (looksLikeHead(ml[3]) || chooserBase === base0)){
      pushQuestion(base0 + '(' + ml[1] + ')' + (ml[2] ? '(' + ml[2] + ')' : ''), ml[3]);
      return;
    }

    const mr = RE_ROMAN.exec(line) || (q ? RE_LETTER.exec(line) : null);
    if (mr && q){
      const label = mr[1];
      const text = (mr[3] !== undefined ? mr[3] : mr[2]) || '';
      item = { label, text: text.trim(), missing: !text.trim(), flags: [] };
      q.items.push(item);
      return;
    }

    if (item){ item.text = (item.text + ' ' + line).trim(); item.missing = !item.text; return; }
    if (q){ q.instruction = (q.instruction + ' ' + line).replace(/\s{2,}/g, ' ').trim(); return; }
    sec.intro.push(line);
  };
  lines.forEach(read);

  /* Items back into their printed order. -layout follows the page's columns, and
     in the 2018 Compartment paper item (f) is printed between (d)'s options and
     (e), so the parse yields d, f, e. Each is complete; only the order is wrong. */
  const LABEL_ORDER = ['a','b','c','d','e','f','g','h',
                       'i','ii','iii','iv','v','vi','vii','viii','ix','x'];
  sections.forEach(s => s.questions.forEach(qq => {
    const romanish = qq.items.every(it => LABEL_ORDER.indexOf(it.label) !== -1);
    if (!romanish || qq.items.length < 2) return;
    const isRoman = qq.items.some(it => LABEL_ORDER.indexOf(it.label) > 7);
    const scale = isRoman ? LABEL_ORDER.slice(8) : LABEL_ORDER.slice(0, 8);
    if (!qq.items.every(it => scale.indexOf(it.label) !== -1)) return;
    qq.items.sort((a, b) => scale.indexOf(a.label) - scale.indexOf(b.label));
  }));

  /* headings, and a second look at the marks now each instruction is whole */
  sections.forEach(s => s.questions.forEach((qq, i) => {
    const next = s.questions[i + 1];
    qq.isContainer = !!(next && !qq.items.length && next.num.indexOf(qq.num + '(') === 0) ||
      (!qq.items.length && /faites\s+\w+\s+des\s+questions/i.test(qq.instruction));
    if (qq.marks === null && qq.instruction){
      const again = takeMarks(qq.instruction);
      if (again.marks !== null){ qq.marks = again.marks; qq.instruction = again.text; }
    }
  }));

  return sections;
}

/* ------------------------------------------------------------------ *
 *  3. CORRECTIONS - the text and tags that needed a person
 * ------------------------------------------------------------------ */
function applyCorrections(paperId, sections, stats){
  const key = (num, label) => paperId + ' ' + num + (label ? '(' + label + ')' : '');

  /* A whole section, replaced. In 2022-2024 Section C the missing glyphs break
     the STRUCTURE as well as the characters: a heading whose text is half gone
     stops looking like a heading, and its items get bolted onto the question
     above. Patching item by item cannot fix that, so those sections are supplied
     entire, transcribed from the rendered pages. */
  sections.forEach(s => {
    const rep = CORR.SECTIONS[paperId + ' ' + s.id];
    if (!rep) return;
    s.questions = rep.questions.map(r => ({
      id: paperId + '-' + r.num.replace(/[^\w.]/g, ''),
      num: r.num,
      instruction: r.instruction,
      marks: r.marks != null ? r.marks : null,
      choose: r.choose || null,
      tally: r.tally || null,
      isAlternative: !!r.isAlternative,
      isContainer: false,
      items: (r.items || []).map(it => ({
        label: it.label, text: it.text, missing: !it.text, flags: ['read-from-pdf'], page: rep.page
      })),
      topics: [], answer: null, flags: ['read-from-pdf'], page: rep.page
    }));
    if (rep.marks != null) s.marks = rep.marks;
    stats.sections++;
    stats.items += s.questions.reduce((n, q) => n + q.items.length, 0);
    stats.used[paperId + ' ' + s.id] = true;
  });

  sections.forEach(s => s.questions.forEach(q => {
    /* instruction text read off the page */
    const iFix = CORR.TEXT[key(q.num)];
    if (iFix && iFix.instruction){
      q.instruction = iFix.instruction;
      q.flags.push('read-from-pdf');
      stats.instructions++;
      stats.used[key(q.num)] = true;
    }
    /* item text read off the page */
    q.items.forEach(it => {
      const k = key(q.num, it.label);
      const fix = CORR.TEXT[k];
      if (!fix || !fix.text) return;
      it.text = fix.text;
      it.missing = false;
      it.flags = (it.flags || []).concat('read-from-pdf');
      it.page = fix.page;
      stats.items++;
      stats.used[k] = true;
    });
    /* verb tenses, per item */
    const tenses = CORR.TENSES[paperId + ' ' + q.num];
    if (!tenses) return;
    q.items.forEach(it => {
      const t = tenses[it.label];
      if (!t) return;
      const def = TAX.tenseByKey(t.key || t);
      if (!def){ stats.badTense.push(key(q.num, it.label) + ' -> ' + (t.key || t)); return; }
      it.topics = (it.topics || []).concat({
        key: def.key, label: def.label, deck: 'verbes',
        confidence: (t.confidence || 'inferred')
      });
      stats.tenses++;
      stats.used[paperId + ' ' + q.num + ':' + it.label] = true;
    });
  }));
}

/* ------------------------------------------------------------------ *
 *  4. CLASSIFY against the syllabus
 * ------------------------------------------------------------------ */
function classifyAll(sections, stats){
  sections.forEach(s => s.questions.forEach(q => {
    if (q.isContainer) return;
    /* "Faites DEUX des questions suivantes" is a heading however it was parsed.
       Recognising it here stops it being reported as unclassifiable. */
    if (TAX.isHeading(q.instruction)){ q.isContainer = true; return; }
    let leaf = TAX.classify(q.instruction, s.id);
    if (!leaf && q.num.indexOf('(') > 0){
      /* a lettered task under a heading inherits it: "2. Écrivez UNE lettre"
         names the task, "2(a) À votre cousin..." is one of its options. */
      const head = s.questions.find(h => h.isContainer && q.num.indexOf(h.num + '(') === 0);
      if (head) leaf = TAX.classify(head.instruction, s.id);
    }
    if (!leaf){ stats.unclassified.push(q.id + ': ' + q.instruction.slice(0, 60)); return; }
    q.leaf = leaf.key;
    q.group = leaf.group;
    q.topics.push({ key: leaf.key, label: leaf.label, group: leaf.group,
                    deck: null, confidence: 'certain', legacy: !!leaf.legacy });
  }));
}

/* ------------------------------------------------------------------ *
 *  RUN
 * ------------------------------------------------------------------ */
function run(){
  if (!fs.existsSync(DIR)){ console.error('papers-text/ missing -- run extract-pdf-text.js first'); process.exit(1); }

  const papers = [];
  const stats = { sections:0, instructions:0, items:0, tenses:0, used:{}, badTense:[], unclassified:[], junk:0 };
  const leafCount = {}, tenseCount = {}, leafMarks = {};

  META.forEach(meta => {
    const p = path.join(DIR, meta.file);
    if (!fs.existsSync(p)){ console.error('  MISSING: ' + meta.file); process.exit(1); }
    const { lines, log } = cleanPaper(fs.readFileSync(p, 'utf8'));
    stats.junk += log.junk;
    const sections = parsePaper(lines, meta);
    applyCorrections(meta.id, sections, stats);
    classifyAll(sections, stats);

    sections.forEach(s => s.questions.forEach(q => {
      if (q.isContainer) return;
      if (q.leaf){
        leafCount[q.leaf] = (leafCount[q.leaf] || 0) + 1;
        /* the allotment a student sitting the next exam should expect: the most
           recent paper that asked it wins */
        if (q.marks) leafMarks[q.leaf] = { marks: q.marks, year: meta.year };
      }
      /* Count QUESTIONS, not items. Ten futur-simple items live in seven
         questions, and the filter returns questions -- a chip reading 10 beside
         a result of 7 just looks wrong. */
      const seen = new Set();
      q.items.forEach(it => (it.topics || []).forEach(t => seen.add(t.key)));
      seen.forEach(k => { tenseCount[k] = (tenseCount[k] || 0) + 1; });
    }));

    papers.push({
      id: meta.id, year: meta.year, variant: meta.variant, scope: meta.scope,
      badge: 'CBSE ' + meta.year + ' · ' + meta.variant,
      marks: meta.marks, duration: meta.duration, series: meta.series, note: meta.note,
      handRead: HAND_READ.indexOf(meta.id) !== -1,
      sections
    });
  });

  /* the syllabus tree, with counts and marks resolved, travels with the data so
     the UI never has to recompute it */
  const tree = TAX.TAXONOMY.map(g => ({
    key: g.key, label: g.label, section: g.section,
    leaves: g.leaves.map(l => ({
      key: l.key, label: l.label, hint: l.hint || null, legacy: !!l.legacy,
      tenses: !!l.tenses,
      count: leafCount[l.key] || 0,
      marks: (l.marks != null ? l.marks : (leafMarks[l.key] ? leafMarks[l.key].marks : null)),
      marksYear: (l.marks != null ? null : (leafMarks[l.key] ? leafMarks[l.key].year : null)),
      tally: l.tally || null
    }))
  }));
  const tenses = TAX.TENSES.map(t => ({
    key: t.key, label: t.label, legacy: !!t.legacy, count: tenseCount[t.key] || 0
  }));

  const body = 'const PAPERS = ' + JSON.stringify(papers, null, 1) + ';\n' +
               'const TAXONOMY = ' + JSON.stringify(tree, null, 1) + ';\n' +
               'const TENSES = ' + JSON.stringify(tenses, null, 1) + ';\n' +
               'if (typeof module !== "undefined" && module.exports) module.exports = { PAPERS, TAXONOMY, TENSES };\n';
  fs.writeFileSync(OUT, body);

  /* ---- census ---- */
  const qs = papers.reduce((n, p) => n + p.sections.reduce((m, s) => m + s.questions.length, 0), 0);
  const real = papers.reduce((n, p) => n + p.sections.reduce((m, s) => m + s.questions.filter(q => !q.isContainer).length, 0), 0);
  const its = papers.reduce((n, p) => n + p.sections.reduce((m, s) => m + s.questions.reduce((c, q) => c + q.items.length, 0), 0), 0);
  const blanks = [];
  papers.forEach(p => p.sections.forEach(s => s.questions.forEach(q =>
    q.items.forEach(it => { if (it.missing) blanks.push(p.id + ' ' + q.num + '(' + it.label + ')'); }))));

  const pad = (s, n) => String(s).padEnd(n);
  console.log('  papers           : ' + papers.length);
  console.log('  questions        : ' + real + ' (+' + (qs - real) + ' headings)');
  console.log('  items            : ' + its);
  console.log('  stripped lines   : ' + stats.junk);
  console.log('  read off the PDF : ' + stats.sections + ' whole sections, ' + stats.items + ' items, ' + stats.instructions + ' instructions');
  console.log('  tense tags       : ' + stats.tenses);
  console.log('  BLANK ITEMS LEFT : ' + blanks.length + (blanks.length ? '  ' + blanks.join(', ') : '  — none'));
  console.log('  paperdata.js     : ' + (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB');
  console.log('');
  console.log('  --- the syllabus ---');
  tree.forEach(g => {
    console.log('  ' + g.label);
    g.leaves.forEach(l => console.log('     ' + pad(l.count, 5) + pad(l.label, 44) +
      (l.marks ? l.marks + ' marks' + (l.marksYear ? ' (' + l.marksYear + ')' : '') : '')));
  });
  console.log('');
  console.log('  --- Les Verbes, by tense ---');
  tenses.forEach(t => console.log('     ' + pad(t.count, 5) + t.label + (t.count ? '' : '   (never asked)')));
  if (stats.unclassified.length){
    console.log('');
    console.log('  --- UNCLASSIFIED (' + stats.unclassified.length + ') ---');
    stats.unclassified.slice(0, 10).forEach(u => console.log('     ' + u));
  }
  if (stats.badTense.length){
    console.log('');
    console.log('  --- corrections naming an unknown tense ---');
    stats.badTense.forEach(b => console.log('     ' + b));
  }
  /* every correction must have landed somewhere */
  const unused = Object.keys(CORR.TEXT).concat(Object.keys(CORR.SECTIONS)).filter(k => !stats.used[k]);
  if (unused.length){
    console.log('');
    console.log('  --- corrections that matched NOTHING (' + unused.length + ') ---');
    unused.slice(0, 20).forEach(u => console.log('     ' + u));
  }
}

if (require.main === module) run();
module.exports = { META, HAND_READ, cleanPaper, parsePaper, classifyAll, applyCorrections,
                   isJunk, scrubInline, fixPUA, fixMarks: takeMarks, takeMarks };
