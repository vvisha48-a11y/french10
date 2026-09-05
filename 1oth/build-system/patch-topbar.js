// Apply the top bar redesign to a target file.
//
//   node patch-topbar.js b-style.html                      (markup + CSS source)
//   node patch-topbar.js e-engine.html                     (engine hooks)
//   node patch-topbar.js "C:/claude/10 th/master-grammar-app.html"   (assembled monolith)
//
// Idempotent: re-running replaces what it wrote rather than stacking a second copy.
const fs = require('fs');
const path = require('path');
const T = require('./topbar.js');

const TARGET = process.argv[2];
if (!TARGET){ console.error('usage: node patch-topbar.js <file>'); process.exit(1); }
const file = fs.existsSync(TARGET) ? TARGET : path.join(__dirname, TARGET);
if (!fs.existsSync(file)){ console.error('not found: ' + TARGET); process.exit(1); }

let s = fs.readFileSync(file, 'utf8');
let did = [];

/* ---- 1. header markup ---- */
if (s.indexOf(T.OLD_HEADER) !== -1){
  s = s.split(T.OLD_HEADER).join(T.NEW_HEADER);
  did.push('header replaced');
} else if (s.indexOf('id="utilMenu"') !== -1){
  // already patched — refresh it so edits to topbar.js land
  const a = s.indexOf('<header class="topbar">');
  const b = s.indexOf('</header>', a);
  if (a >= 0 && b > a){
    s = s.slice(0, a) + T.NEW_HEADER + s.slice(b + '</header>'.length);
    did.push('header refreshed');
  }
} else if (s.indexOf('<header class="topbar">') !== -1){
  console.error('  header present but does not match OLD_HEADER — it changed since this patch was written.');
  console.error('  Refusing to guess. Update topbar.js OLD_HEADER to the current markup first.');
  process.exit(1);
}

/* ---- 2. CSS, bounded by an end marker ---- */
const CSS_MARK = '/* ===== TOP BAR: logo + hamburger ===== */';
const CSS_END = '/* ===== END TOP BAR ===== */';
if (s.indexOf('</style>') !== -1){
  if (s.indexOf(CSS_MARK) === -1){
    const i = s.lastIndexOf('</style>');
    s = s.slice(0, i) + '\n' + T.CSS + '\n' + CSS_END + '\n' + s.slice(i);
    did.push('css injected');
  } else {
    const a = s.indexOf(CSS_MARK);
    const e = s.indexOf(CSS_END, a);
    const b = e >= 0 ? e + CSS_END.length : s.indexOf('</style>', a);
    s = s.slice(0, a) + T.CSS + CSS_END + s.slice(b);
    did.push('css replaced');
  }
}

/* ---- 3. engine hooks ---- */
const JS_MARK = '/* ---- top bar: Letters shortcut + hamburger utility menu ---- */';
const anchor = "$('#settingsBtn').onclick";
if (s.indexOf(anchor) !== -1){
  if (s.indexOf(JS_MARK) === -1){
    // insert after the line that wires settingsBtn, i.e. with the other topbar wiring
    const i = s.indexOf('\n', s.indexOf(anchor));
    s = s.slice(0, i + 1) + T.JS + s.slice(i + 1);
    did.push('engine hooks added');
  } else {
    const a = s.indexOf(JS_MARK);
    // Was lastIndexOf, which searches BACKWARDS from `a` for a needle that only occurs
    // AFTER it: it returned -1 on every file, so `end > a` was false and the refresh
    // silently did nothing while reporting success. Any handler added to topbar.js
    // would appear in the markup and never be wired up.
    const end = s.indexOf('\n});\n', s.indexOf("e.target.closest('#utilBtn')", a));
    if (end > a){
      s = s.slice(0, a) + T.JS.replace(/^\n/, '') + s.slice(end + 5);
      did.push('engine hooks refreshed');
    } else did.push('engine hooks already present');
  }
}

fs.writeFileSync(file, s);
console.log('  ' + path.basename(file) + ': ' + (did.length ? did.join(' · ') : 'nothing to do'));
