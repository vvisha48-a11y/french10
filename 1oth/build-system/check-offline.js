// Hard gate: the shipped file must make ZERO network requests.
// Checks docs/index.html by default; pass a path to check something else.
const fs = require('fs');

const file = process.argv[2] || 'C:/claude/10 th/docs/index.html';
const html = fs.readFileSync(file, 'utf8');
const problems = [];

// --- resource-loading attributes only ---
// Deliberately NOT flagged (these are not network loads):
//   * xmlns="http://www.w3.org/2000/svg"  -> an XML namespace identifier, never fetched
//   * <a href="https://...">              -> user-initiated navigation, not a dependency
const loaders = [
  { re: /<img\b[^>]*\bsrc="([^"]+)"/gi,    what: 'img src' },
  { re: /<script\b[^>]*\bsrc="([^"]+)"/gi, what: 'script src' },
  { re: /<link\b[^>]*\bhref="([^"]+)"/gi,  what: 'link href' },
  { re: /<source\b[^>]*\bsrc="([^"]+)"/gi, what: 'source src' },
  { re: /<video\b[^>]*\bposter="([^"]+)"/gi, what: 'video poster' },
  { re: /<use\b[^>]*\bhref="([^"]+)"/gi,   what: 'svg use href' }
];
const external = v => /^(https?:)?\/\//i.test(v.trim());

loaders.forEach(({ re, what }) => {
  let m;
  while ((m = re.exec(html)) !== null) {
    if (external(m[1])) problems.push(`[${what}] external: ${m[1].slice(0, 90)}`);
  }
});

// --- CSS-loaded resources ---
let m;
const cssUrl = /url\(\s*['"]?((?:https?:)?\/\/[^'")]+)/gi;
while ((m = cssUrl.exec(html)) !== null) problems.push(`[css url()] external: ${m[1].slice(0, 90)}`);

const cssImport = /@import\s+(?:url\()?\s*['"]?((?:https?:)?\/\/[^'")\s;]+)/gi;
while ((m = cssImport.exec(html)) !== null) problems.push(`[@import] external: ${m[1].slice(0, 90)}`);

// --- every @font-face must be embedded ---
const faces = html.split('@font-face').slice(1);
let faceBad = 0;
faces.forEach(f => {
  const body = f.slice(0, f.indexOf('}') + 1);
  const src = body.match(/src:[^;]*/);
  if (src && !/data:/.test(src[0])) faceBad++;
});
if (faceBad) problems.push(`[@font-face] ${faceBad} rule(s) not using a data: URI`);

// --- runtime fetching ---
[
  { re: /\bfetch\s*\(/g, what: 'fetch(' },
  { re: /\bXMLHttpRequest\b/g, what: 'XMLHttpRequest' },
  { re: /\bimport\s*\(/g, what: 'dynamic import(' },
  { re: /\bnew\s+WebSocket\b/g, what: 'WebSocket' },
  { re: /\bnew\s+EventSource\b/g, what: 'EventSource' }
].forEach(({ re, what }) => {
  const n = (html.match(re) || []).length;
  if (n) problems.push(`[runtime] ${n} occurrence(s) of ${what}`);
});

// --- report ---
const imgs = (html.match(/<img\b[^>]*\bsrc="data:/gi) || []).length;
const dataFaces = faces.length - faceBad;
console.log('=== OFFLINE SELF-CONTAINMENT GATE ===');
console.log('  file             :', file);
console.log('  size             :', (fs.statSync(file).size / 1048576).toFixed(2), 'MB');
console.log('  <img> data: URIs :', imgs);
console.log('  @font-face rules :', faces.length, '(' + dataFaces + ' embedded)');
console.log('  <svg> diagrams   :', (html.match(/<svg[\s>]/g) || []).length);
console.log('');
if (!problems.length) {
  console.log('  RESULT: PASS — zero external references, file is fully self-contained.');
  process.exit(0);
}
console.log('  RESULT: FAIL');
problems.forEach(p => console.log('   x ' + p));
process.exit(1);
