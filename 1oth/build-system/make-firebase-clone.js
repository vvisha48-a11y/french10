// Build docs/app.html — the Firebase clone — from the finished docs/index.html.
//
//   node make-firebase-clone.js
//
// Post-processing, deliberately: it reads the ALREADY BUILT monolith and writes a
// second file. Nothing in build-system's parts is modified, so this cannot collide
// with other work, and docs/index.html stays byte-for-byte the offline original.
//
// Idempotent — re-running replaces the injected layer rather than stacking a copy.
const fs = require('fs');
const path = require('path');
const FB = require('./firebase-layer.js');

const SRC = 'C:/claude/10 th/docs/index.html';
const OUT = 'C:/claude/10 th/docs/app.html';
const CONFIG_FILE = path.join(__dirname, 'firebase-config.js');

if (!fs.existsSync(SRC)){ console.error('source not found: ' + SRC + ' — run build.sh first'); process.exit(1); }
let html = fs.readFileSync(SRC, 'utf8');
const srcBytes = html.length;

/* If you have saved your real config to build-system/firebase-config.js it is used;
   otherwise the placeholder block goes in and the app says so on screen rather than
   failing silently. */
let config = FB.CONFIG_BLOCK;
let configured = false;
if (fs.existsSync(CONFIG_FILE)){
  const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
  if (raw.indexOf('PASTE_') === -1 && raw.indexOf('apiKey') !== -1){
    config = '  ' + raw.trim();
    configured = true;
  }
}

const MARK = FB.MARKERS.BODY;
const MARK_END = FB.MARKERS.BODY_END;

/* Strip any previous injection so this is idempotent. Uses the shared inverse in
   firebase-layer.js -- the builder and the gate must agree exactly, or a rebuild
   can leave residue that the gate then reports as a changed presentation. */
html = FB.stripLayer(html);

const steps = [];

/* 1. CSS, before the final </style> */
const sIdx = html.lastIndexOf('</style>');
if (sIdx < 0){ console.error('no </style> found'); process.exit(1); }
html = html.slice(0, sIdx) + '\n' + FB.CSS + '/* ===== END FIREBASE CSS ===== */\n' + html.slice(sIdx);
steps.push('css');

/* 2. auth controls inside the existing settings panel, above "Reset everything"
      so no existing control is moved or restyled */
const resetBtn = '  <button class="reset-btn" id="resetBtn">';
const rIdx = html.indexOf(resetBtn);
if (rIdx < 0){ console.error('settings panel reset button not found'); process.exit(1); }
html = html.slice(0, rIdx) + FB.AUTH_HTML + '\n' + html.slice(rIdx);
steps.push('auth ui');

/* 3. expose the roster so the dashboard can seed 76 students without retyping.
      One assignment appended after the existing declaration — the engine's own
      code is not altered. */
const rosterEnd = html.indexOf('};', html.indexOf('const ROSTERS = {')) + 2;
if (rosterEnd > 1){
  html = html.slice(0, rosterEnd) + '\nwindow.__ROSTERS = ROSTERS;' + html.slice(rosterEnd);
  steps.push('roster exposed');
}

/* 3b. hand the deck's own confetti and sounds to the layer. Both are function
      declarations inside the engine IIFE, so they are in scope at the init call. */
const fxAnchor = 'Deck.initialize().then(boot)';
const fxIdx = html.indexOf(fxAnchor);
if (fxIdx > -1){
  html = html.slice(0, fxIdx) +
    'window.__fx = { confetti: burstConfetti, sound: playSound };\n' +
    html.slice(fxIdx);
  steps.push('effects exposed');
} else {
  console.error('effects anchor not found -- affirmations would be silent'); process.exit(1);
}

/* 4. dashboard modal + the module script, just before </body> */
const bIdx = html.lastIndexOf('</body>');
if (bIdx < 0){ console.error('no </body> found'); process.exit(1); }
html = html.slice(0, bIdx) + MARK + '\n' + FB.GATE_HTML + FB.PICK_HTML + FB.AFFIRM_HTML + FB.ADMIN_HTML + FB.DASH_HTML + FB.JS(config) + MARK_END + '\n' + html.slice(bIdx);
steps.push('gate + picker + affirmations + admin + dashboard + sdk');

fs.writeFileSync(OUT, html);
console.log('  source           :', SRC, '(' + (srcBytes / 1048576).toFixed(2) + ' MB, untouched)');
console.log('  clone            :', OUT, '(' + (html.length / 1048576).toFixed(2) + ' MB)');
console.log('  injected         :', steps.join(' · '));
console.log('  firebase config  :', configured ? 'REAL (from firebase-config.js)' : 'PLACEHOLDER — paste yours into build-system/firebase-config.js');
