// Apply the sidebar accordion to a target file.
//
//   node patch-sidebar.js e-engine.html              (build-system source)
//   node patch-sidebar.js "E:/Master Grammar App v2.html"   (assembled monolith)
//
// renderSidebar() is byte-identical in both, so one patch serves both. Idempotent:
// re-running replaces the existing accordion rather than nesting a second copy.
const fs = require('fs');
const path = require('path');
const A = require('./sidebar-accordion.js');

const TARGET = process.argv[2];
if (!TARGET){ console.error('usage: node patch-sidebar.js <file>'); process.exit(1); }
const file = fs.existsSync(TARGET) ? TARGET : path.join(__dirname, TARGET);
if (!fs.existsSync(file)){ console.error('not found: ' + TARGET); process.exit(1); }

let s = fs.readFileSync(file, 'utf8');
const isCss = file.indexOf('b-style') !== -1;

/* ---- CSS goes into whichever file carries the stylesheet ---- */
const CSS_MARK = '/* ===== SIDEBAR ACCORDION (Model Letters) ===== */';
const CSS_END = '/* ===== END SIDEBAR ACCORDION ===== */';
if (s.indexOf('</style>') !== -1){
  if (s.indexOf(CSS_MARK) === -1){
    const i = s.lastIndexOf('</style>');
    s = s.slice(0, i) + '\n' + A.CSS + '\n' + CSS_END + '\n' + s.slice(i);
    console.log('  css              : injected');
  } else {
    // bounded replacement — see the same note in split-letters-in-file.js
    const a = s.indexOf(CSS_MARK);
    const e = s.indexOf(CSS_END, a);
    const b = e >= 0 ? e + CSS_END.length : s.indexOf('</style>', a);
    s = s.slice(0, a) + A.CSS + '\n' + CSS_END + s.slice(b);
    console.log('  css              : replaced');
  }
}

/* ---- replace renderSidebar() ---- */
const start = s.indexOf(A.OLD_MARKER);
if (start < 0){
  if (s.indexOf('sb-group') !== -1){ console.log('  renderSidebar    : already patched'); }
  else { console.error('  renderSidebar() not found in ' + file); process.exit(1); }
} else {
  // function ends at the first "\n}\n" after it (top-level closing brace)
  const end = s.indexOf('\n}\n', start);
  if (end < 0){ console.error('could not find end of renderSidebar()'); process.exit(1); }
  const before = s.slice(start, end + 3);
  s = s.slice(0, start) + A.NEW_FN + s.slice(end + 3);
  console.log('  renderSidebar    : replaced (' + before.length + ' -> ' + A.NEW_FN.length + ' chars)');
}

/* ---- the state object, declared once above the function ----
   Only in a file that actually contains the function. b-style.html is markup and CSS;
   injecting JS there silently corrupted #slidesRoot the first time this ran. */
const fnAt = s.indexOf('function renderSidebar(){');
if (fnAt === -1){
  console.log('  sbOpen state     : n/a (no renderSidebar in this file)');
} else if (s.indexOf('const sbOpen') === -1){
  s = s.slice(0, fnAt) + A.STATE + s.slice(fnAt);
  console.log('  sbOpen state     : added');
} else {
  console.log('  sbOpen state     : already present');
}

/* ---- step-label map: English sub-divisions everywhere except La Lettre ---- */
const stepAt = s.indexOf('function renderSidebar(){');
if (stepAt === -1){
  console.log('  step labels      : n/a');
} else if (s.indexOf('const SB_STEP_EN') === -1){
  s = s.slice(0, stepAt) + A.STEPS + s.slice(stepAt);
  console.log('  step labels      : added (' + Object.keys(require('./step-labels.js')).length + ' entries)');
} else {
  // replace the existing block so edits to step-labels.js actually land
  const a = s.indexOf('/* Sidebar step labels:');
  const b = s.indexOf('function renderSidebar(){', a);
  s = s.slice(0, a) + A.STEPS + s.slice(b);
  console.log('  step labels      : replaced');
}

fs.writeFileSync(file, s);
console.log('  target           :', file);
