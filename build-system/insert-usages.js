// Splice Usage slides into the assembled deck, immediately after each sub-topic's
// Description slide.
//
// Why post-processing instead of editing c1-c4/t2-t9 directly: it keeps the change
// strictly ADDITIVE. No existing content part is modified, so no existing
// data-slide-id, data-answer or scoring closure can be disturbed.
//
// Convention: build-system/usages/<description-slide-id>.html holds the 2-3
// <section data-step="Usages…"> blocks that belong after that Description slide.
//
// Runs from build.sh BEFORE inline-photos.js so @@PHOTO:id@@ tokens still resolve.
const fs = require('fs');
const path = require('path');

const OUT = 'C:/claude/10 th/master-grammar-app.html';
const DIR = path.join(__dirname, 'usages');

if (!fs.existsSync(DIR)) { console.log('  usages inserted  : 0 (no usages/ dir)'); process.exit(0); }

let html = fs.readFileSync(OUT, 'utf8');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html')).sort();

let inserted = 0, slides = 0;
const missing = [];

for (const f of files) {
  const descId = path.basename(f, '.html');
  const frag = fs.readFileSync(path.join(DIR, f), 'utf8');

  const openTok = `<section data-slide-id="${descId}"`;
  const at = html.indexOf(openTok);
  if (at < 0) { missing.push(descId); continue; }

  // Insert immediately before the NEXT slide's opening tag — unambiguous, and it
  // does not depend on matching the Description slide's own closing </section>.
  const next = html.indexOf('<section data-slide-id=', at + openTok.length);
  if (next < 0) { missing.push(descId + ' (no following slide)'); continue; }

  html = html.slice(0, next) + frag + (frag.endsWith('\n') ? '' : '\n') + html.slice(next);
  inserted++;
  slides += (frag.match(/data-slide-id=/g) || []).length;
}

fs.writeFileSync(OUT, html);
console.log('  usages inserted  :', inserted, 'sub-topics,', slides, 'slides');
if (missing.length) {
  console.error('  UNMATCHED usage files:', missing.join(', '));
  process.exit(1);
}
