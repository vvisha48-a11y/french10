// Extract the papers' text layer from the original PDFs into papers-text/.
//
//   node extract-pdf-text.js
//
// Run once, or again whenever the PDFs change. The output is committed, so
// gen-papers.js needs no PDF tooling and a rebuild on another machine is
// reproducible without poppler installed.
//
// Why -layout: the old scrape broke an item's label away from its text, leaving
// "(iii)" on one line and its sentence on the next, which the parser then had to
// guess at. pdftotext -layout keeps "(iii) Nous ne connaissons pas cette dame."
// together, which is the whole reason for switching source.
//
// What this CANNOT do, and no extractor can: 2022, 2023 and 2024 draw part of
// their text as glyphs with no Unicode mapping. Those characters are absent from
// the text layer -- every apostrophe in those three papers, and fifteen items
// entirely. They were read off the rendered pages by eye and live in
// paper-corrections.js. Nothing here guesses at them.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SP  = __dirname;
const OUT = path.join(SP, 'papers-text');
const PDFS = 'C:/10th/previous qp';

/* The ten usable papers. 2011 and 2012 are scans with no text layer at all
   (3 fonts, 8 images, nothing extractable) and the syllabus is not a paper. */
const FILES = [
  'CBSE Class 10 French SET 4 Annual Question Paper 2017 (All India Scheme)',
  'CBSE Class 10 French Annual Question Paper 2018',
  'CBSE Class 10 French Annual Re-Conducted Question Paper 2018 (For Punjab Only)',
  'CBSE Class 10 French SET 4 Compartment Annual Question Paper 2018',
  'CBSE Class 10 French Question Paper 2019',
  'CBSE Class 10 French Question Paper 2020',
  'CBSE Class 10 French Question Paper 2022',
  'CBSE Class 10 French Question Paper 2023',
  'CBSE Class 10 French Question Paper 2024',
  'CBSE Class 10 French Question Paper 2025'
];

fs.mkdirSync(OUT, { recursive: true });

let ok = 0;
const report = [];
FILES.forEach(base => {
  const pdf = path.join(PDFS, base + '.pdf');
  const txt = path.join(OUT, base + '.txt');
  if (!fs.existsSync(pdf)){ console.error('  MISSING PDF: ' + base); process.exit(1); }
  execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdf, txt], { stdio: 'pipe' });
  const s = fs.readFileSync(txt, 'utf8');
  report.push({
    base,
    pages: s.split('\f').length,
    apostrophes: (s.match(/['\u2019]/g) || []).length,
    accents: (s.match(/[\u00c0-\u00ff]/g) || []).length,
    blanks: (s.match(/^[ \t]*\((?:i|ii|iii|iv|v|vi|vii|[a-h])\)[ \t]*$/gm) || []).length
  });
  ok++;
});

const pad = (s, n) => String(s).padEnd(n);
console.log('  extracted        : ' + ok + ' papers -> papers-text/');
console.log('');
console.log('  ' + pad('PAPER', 46) + pad('pages', 7) + pad('apostr', 8) + pad('accents', 9) + 'blank items');
report.forEach(r => console.log('  ' + pad(r.base.replace('CBSE Class 10 French ', '').slice(0, 44), 46) +
  pad(r.pages, 7) + pad(r.apostrophes, 8) + pad(r.accents, 9) + r.blanks));
const blanks = report.reduce((n, r) => n + r.blanks, 0);
console.log('');
console.log('  blank items in the PDF text layer: ' + blanks +
  ' -- these are supplied by paper-corrections.js, read off the rendered pages.');
