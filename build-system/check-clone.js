// Gate for the Firebase clone (docs/app.html).
//
// The load-bearing assertion is the THIRD one: stripping the injected layer back
// out of the clone must reproduce docs/index.html byte for byte. That is what
// proves the Firebase work did not disturb a single slide, style or script of the
// presentation -- a promise no amount of eyeballing can make.
//
// Run after build.sh. check-offline.js still guards docs/index.html separately.
const fs = require('fs');
const path = require('path');
const FB = require('./firebase-layer.js');

const MASTER = 'C:/claude/10 th/master-grammar-app.html';
const INDEX  = 'C:/claude/10 th/docs/index.html';
const APP    = 'C:/claude/10 th/docs/app.html';
const problems = [];

[MASTER, INDEX, APP].forEach(f => {
  if (!fs.existsSync(f)) { console.error('missing: ' + f + ' -- run build.sh first'); process.exit(1); }
});

const master = fs.readFileSync(MASTER, 'utf8');
const index  = fs.readFileSync(INDEX, 'utf8');
const app    = fs.readFileSync(APP, 'utf8');

// 1. the published offline deck is the built deck
if (master !== index) problems.push('[offline] docs/index.html differs from master-grammar-app.html');

// 2. the offline deck carries no trace of Firebase
['firebase', 'fbGate', 'gstatic.com/firebasejs'].forEach(t => {
  if (index.toLowerCase().indexOf(t.toLowerCase()) !== -1)
    problems.push('[offline] docs/index.html contains "' + t + '" -- it must stay Firebase-free');
});

// 3. THE GUARD: the clone is the deck plus a removable layer, nothing else
const stripped = FB.stripLayer(app);
if (stripped !== index) {
  let i = 0;
  while (i < stripped.length && i < index.length && stripped[i] === index[i]) i++;
  problems.push('[presentation] stripping the layer does not reproduce docs/index.html '
    + '(first difference at byte ' + i + ' of ' + index.length + ')');
}

// 4. the gate is actually present in the clone
const NEED = ['fbGate', 'fbGateForm', 'fbGateWait', 'fbGateDown', 'fbFeedbackModal',
              'fbFbText', 'fbFeedbackBtn', 'gateShow', 'applyGate', 'ADMIN_EMAIL',
              // Features 2-3: the weekly-fair picker
              'psStage', 'psBar', 'psCorrect', 'psWrong', 'psWeekKey', 'psChoose', 'psVerdict',
              // Features 4-5: affirmations and the leaderboard
              'afPop', 'afWord', 'afRecord', 'afTierFor', 'AF_TIERS',
              'lbWrap', 'lbPanel', 'lbTop3', 'lbRender', 'window.__fx',
              // Feature 6: the admin dashboard
              'adBtn', 'adDash', 'adApprovals', 'adScores', 'adFeedback', 'adSetTab'];
NEED.forEach(t => { if (app.indexOf(t) === -1) problems.push('[gate] "' + t + '" missing from the clone'); });

// the feedback field must be capped in the markup as well as in JS
if (app.indexOf('maxlength="150"') === -1) problems.push('[gate] the 150-character cap is not in the markup');
// the gate must outrank every existing layer (highest pre-existing was #dropClose at 9001)
// AND the picker overlay, or a signed-out visitor could be shown a student name.
if (app.indexOf('z-index:10100') === -1) problems.push('[gate] the auth gate is not at z-index 10100');
if (app.indexOf('z-index:10000') === -1) problems.push('[pick] the picker stage is not at z-index 10000');
if (app.indexOf('z-index:10020') === -1) problems.push('[affirm] the affirmation pop is not at z-index 10020');
if (app.indexOf('z-index:10050') === -1) problems.push('[admin] the admin dashboard is not at z-index 10050');
// the admin trigger must ship hidden -- it is revealed only for the admin account
if (app.indexOf('id="adBtn" type="button" hidden') === -1)
  problems.push('[admin] the admin trigger does not ship hidden');
// the affirmation must never block a click during a lesson
if (app.indexOf('pointer-events:none;   /* never steals a click from the lesson */') === -1)
  problems.push('[affirm] the affirmation overlay is not click-through');
// the French must keep its accents -- this is a French class
/* Whole words, not substrings. A bare indexOf read "comme cadeau" -- correct French,
   transcribed verbatim from the 2023 paper -- as a missing cedilla. "comme ca" is
   only the error when no letter follows it. */
[['Tres bien', /Tres bien/], ['reponse ', /reponse /], ['comme ca', /comme ca(?![A-Za-zÀ-ÿ])/]].forEach(([w, re]) => {
  if (re.test(app)) problems.push('[french] unaccented French in the clone: "' + w + '"');
});
// the picker must never draw uniformly at random -- that is the bug it exists to fix
if (app.indexOf('spinPick') !== -1 && app.indexOf('stopImmediatePropagation') === -1)
  problems.push('[pick] the engine spinPick is not intercepted');

// 4b. the vocabulary is MERGED natively into both files, not linked out
[['index', index], ['app', app]].forEach(pair => {
  const name = pair[0], docHtml = pair[1];
  if (docHtml.indexOf('id="leconsMenu"') === -1)
    problems.push('[lecons] the Lecons dropdown is missing from docs/' + name + '.html');
  if (docHtml.indexOf('href="lecons.html"') !== -1)
    problems.push('[lecons] docs/' + name + '.html still links out to lecons.html');
  // all 8 lessons must have merged, not just some
  ['l2','l3','l4','l5','l6','l7','l8','l10'].forEach(k => {
    if (docHtml.indexOf('data-topic="' + k + '"') === -1)
      problems.push('[lecons] lesson ' + k + ' is missing from docs/' + name + '.html');
  });
  // THE GUARD: every photo must be embedded, or the offline promise is broken
  const wm = (docHtml.match(/upload.wikimedia.org/g) || []).length;
  if (wm) problems.push('[lecons] docs/' + name + '.html still has ' + wm + ' wikimedia reference(s)');
  // the lesson CSS must never be able to restyle a grammar slide in projector mode
  const bare = (docHtml.match(/body.projector-mode .(?!lecon-slide)(slide-card|question-row|accent-bar|fib-actions|quiz-container)/g) || []);
  if (bare.length > 30) problems.push('[lecons] unscoped projector rules leaked: ' + bare.length);
});

// the standalone backup keeps its own memory: same 217 slide ids in two files
const LECONS = 'C:/claude/10 th/docs/lecons.html';
if (fs.existsSync(LECONS)){
  const lec = fs.readFileSync(LECONS, 'utf8');
  if (lec.indexOf('cbse_fr_lecons_') === -1)
    problems.push('[lecons] the standalone backup lost its own storage prefix');
}
// 4d. the topbar: no hamburger, its tools live in Settings, the sidebar toggle is top-level
[['index', index], ['app', app]].forEach(pair => {
  const name = pair[0], docHtml = pair[1];
  const hs = docHtml.indexOf('<header class="topbar">');
  const header = hs === -1 ? '' : docHtml.slice(hs, docHtml.indexOf('</header>', hs));
  const ps = docHtml.indexOf('id="settingsPanel"');
  const panel = ps === -1 ? '' : docHtml.slice(ps, docHtml.indexOf('id="themeSelect"', ps));
  if (/id="utilBtn"|class="util-menu"|class="util-wrap"/.test(docHtml))
    problems.push('[topbar] the hamburger menu is still in docs/' + name + '.html');
  if (header.indexOf('<button class="tb-btn" id="sidebarBtn"') === -1)
    problems.push('[topbar] #sidebarBtn is not a top-level topbar button in docs/' + name + '.html');
  ['lightBtn', 'soundBtn', 'projectorBtn', 'shortcutsBtn'].forEach(id => {
    if (panel.indexOf('id="' + id + '"') === -1) problems.push('[topbar] #' + id + ' is not in Settings in docs/' + name + '.html');
    if (header.indexOf('id="' + id + '"') !== -1) problems.push('[topbar] #' + id + ' is still in the topbar in docs/' + name + '.html');
  });
  if (docHtml.indexOf('id="printBtn"') !== -1) problems.push('[topbar] the duplicate Print this topic button is back in docs/' + name + '.html');
  if ((docHtml.match(/id="printTopicBtn2"/g) || []).length !== 1)
    problems.push('[topbar] expected exactly one Print this topic control in docs/' + name + '.html');
});

// 4e. Print this topic: the label, the promise that BOTH roles keep it, and the
//     print stylesheet the targeted job depends on.
[['index', index], ['app', app]].forEach(pair => {
  const name = pair[0], docHtml = pair[1];
  const ps = docHtml.indexOf('id="settingsPanel"');
  const panel = ps === -1 ? '' : docHtml.slice(ps, docHtml.indexOf('id="themeSelect"', ps));

  /* --- the button --- */
  const BTN = '<button class="print-topic-btn" id="printTopicBtn2">🖨️ Print this topic</button>';
  if (docHtml.indexOf(BTN) === -1)
    problems.push('[print] the button is not exactly "🖨️ Print this topic" in docs/' + name + '.html');
  if (panel.indexOf('id="printTopicBtn2"') === -1)
    problems.push('[print] #printTopicBtn2 is not inside #settingsPanel in docs/' + name + '.html');

  /* --- no role gate. Students print too, so nothing may hide the control by
         role: no role class between #settingsPanel and the button, and the
         Firebase layer must never name it. --- */
  const bi = docHtml.indexOf('id="printTopicBtn2"');
  const above = (ps !== -1 && bi > ps) ? docHtml.slice(ps, bi) : '';
  const gates = above.match(/\b(teacher-only|student-only|fb-gate|admin-only)\b/g) || [];
  if (gates.length)
    problems.push('[print] a role gate (' + gates.join(', ') + ') stands between #settingsPanel and ' +
                  '#printTopicBtn2 in docs/' + name + '.html -- students must keep this button');

  /* --- the print stylesheet --- */
  if (/@media print\{html:not\(\.print-pdf\)/.test(docHtml))
    problems.push('[print] Reveal\'s own paper.css is back in docs/' + name + '.html -- it forces 20pt black text and flattens the grids');
  if (docHtml.indexOf('print-color-adjust:exact') === -1)
    problems.push('[print] print-color-adjust:exact is missing from docs/' + name + '.html');
  if (docHtml.indexOf('.student-only, .teacher-only{ display:block !important; }') !== -1)
    problems.push('[print] the print block still forces both views visible in docs/' + name + '.html -- a student would print the answer key');
  ['body.printing-topic .reveal .slides > section.print-target:not([data-topic="papers"]) > section{',
   'width:auto !important; height:100vh !important;',
   'section.print-target[data-topic="papers"]',
   'body.printing-topic .reveal .fragment{ opacity:1 !important; visibility:visible !important; transform:none !important; }',
   '@page{ size:A4 landscape; margin:6mm; }'].forEach(need => {
    if (docHtml.indexOf(need) === -1)
      problems.push('[print] docs/' + name + '.html is missing the rule "' + need.slice(0, 56) + '..."');
  });
  /* strictly one sheet per slide. min-height let an oversized slide continue onto a
     second sheet and break its boxes in half; the teacher chose to cut the bottom off
     instead. Both the page box and the card inside it must be fixed and clipped. */
  const ruleBody = sel => {
    const i = docHtml.indexOf(sel);
    return i < 0 ? '' : docHtml.slice(i, docHtml.indexOf('}', i));
  };
  const pageBox = ruleBody('section.print-target:not([data-topic="papers"]) > section{');
  const pageCard = ruleBody('section.print-target:not([data-topic="papers"]) > section > .slide-card{');
  [['page box', pageBox, 'height:100vh !important'], ['card', pageCard, 'height:100% !important']].forEach(([what, rule, h]) => {
    if (!rule){ problems.push('[print] the ' + what + ' rule is missing from docs/' + name + '.html'); return; }
    if (/min-height/.test(rule))
      problems.push('[print] the ' + what + ' uses min-height in docs/' + name + '.html -- an oversized slide would spill onto a second sheet');
    if (rule.indexOf(h) === -1)
      problems.push('[print] the ' + what + ' is not fixed at ' + h + ' in docs/' + name + '.html');
    if (rule.indexOf('overflow:hidden !important') === -1)
      problems.push('[print] the ' + what + ' is not overflow:hidden in docs/' + name + '.html');
  });
  if (pageBox && pageBox.indexOf('break-inside:avoid') === -1)
    problems.push('[print] the page box allows a break inside a slide in docs/' + name + '.html');

  /* The projector's columns must survive the page's own width. The A4-landscape
     page area is 1077px, so @media (max-width:1100px) fires on paper though never on
     a 1920px projector, and would collapse every multi-column grid to one column --
     which is what made boxes stack and slides lose their bottoms. Measured: 355
     grids stacked before these restatements, 0 after. */
  [['.two-columns', '1fr 1fr'],
   ['.three-columns', '1fr 1fr 1fr'],
   ['.usage-grid', 'minmax(0,1fr) minmax(0,1.05fr)'],
   ['.topic-visual-grid', 'repeat(3,minmax(0,1fr))']].forEach(([sel, cols]) => {
    if (docHtml.indexOf('body.printing-topic ' + sel + '{ grid-template-columns:' + cols + ' !important; }') === -1)
      problems.push('[print] docs/' + name + '.html does not restate ' + sel +
                    ' for the printed page -- at 1077px it would collapse to one column');
  });

  /* the workbook keeps the static portrait @page: only the topic print is landscape */
  if ((docHtml.match(/@page{ size:A4 landscape/g) || []).length !== 1)
    problems.push('[print] docs/' + name + '.html has more than one landscape @page');
  if (docHtml.indexOf("PRINT_PAGE_RULE = '@page{ size:A4 landscape; margin:6mm; }'") === -1)
    problems.push('[print] the landscape @page is not the engine-injected one in docs/' + name + '.html -- a stylesheet rule would turn the workbook landscape too');
  if (docHtml.indexOf('@page{ size:A4; margin:12mm 12mm 14mm 12mm; }') === -1)
    problems.push('[print] the workbook'+String.fromCharCode(39)+'s portrait @page is gone from docs/' + name + '.html');
  /* the page box must stay in viewport units: they ARE the page area when printing,
     to the pixel, and a box stated in mm rounds long and spills a blank sheet */
  const box = docHtml.slice(docHtml.indexOf('section.print-target:not([data-topic="papers"]) > section{'));
  if (/\d+mm/.test(box.slice(0, 260)))
    problems.push('[print] the page box in docs/' + name + '.html is stated in mm; use 100vw/100vh, which resolve against the page area');

  /* --- the dark themes must not reach paper --- */
  const darkRules = docHtml.match(/body\.theme-(cyber|slate)[^{,]*[ ,][^{]*\{/g) || [];
  const unguarded = darkRules.filter(r => r.indexOf(':not(.printing-topic)') === -1);
  if (unguarded.length)
    problems.push('[print] ' + unguarded.length + ' dark-theme component rule(s) in docs/' + name +
                  '.html lack :not(.printing-topic): ' + unguarded[0].trim());
});

/* the print palette is body.theme-classic, and may differ only where it says so */
{
  const grab = (src, sel) => {
    const i = src.indexOf(sel);
    if (i === -1) return null;
    /* comments first: they carry ':' and would be read as declarations */
    const body = src.slice(src.indexOf('{', i) + 1, src.indexOf('}', i)).replace(/\/\*[\s\S]*?\*\//g, '');
    const out = {};
    body.split(';').forEach(d => {
      const c = d.indexOf(':');
      if (c === -1) return;
      const k = d.slice(0, c).trim();
      if (k.indexOf('--') === 0) out[k] = d.slice(c + 1).trim();
    });
    return out;
  };
  const classic = grab(index, 'body.theme-classic{');
  const print = grab(index, 'html body.printing-topic{');
  const ALLOWED = { '--bg-gradient': 1, '--card-bg': 1, '--custom-text-color': 1, '--text-main': 1 };
  if (!classic || !print) problems.push('[print] could not read the classic and print palettes');
  else {
    Object.keys(classic).forEach(k => {
      if (!(k in print)) problems.push('[print] the print palette is missing ' + k + ' -- it would fall through to the screen theme');
      else if (print[k] !== classic[k] && !ALLOWED[k])
        problems.push('[print] ' + k + ' drifted from body.theme-classic: "' + print[k] + '" vs "' + classic[k] + '"');
    });
    Object.keys(print).forEach(k => {
      if (!(k in classic) && !ALLOWED[k]) problems.push('[print] the print palette declares ' + k + ', which body.theme-classic does not');
    });
    console.log('  print palette    : ' + Object.keys(print).length + ' tokens from body.theme-classic, ' +
                Object.keys(print).filter(k => print[k] !== classic[k]).length + ' deliberate differences');
  }
}

/* the engine: one stack, and both listeners come off again */
['function printTopic(){', 'stacks[Deck.getIndices().h]', "printPageStyle.id = 'printPageRule'",
 "window.addEventListener('afterprint', endPrint, { once: true })",
 'window.removeEventListener(\'afterprint\', endPrint)'].forEach(need => {
  if (index.indexOf(need) === -1) problems.push('[print] the engine lost "' + need + '"');
});
if (index.indexOf('t.indices.forEach(h => stacks[h].classList.add(\'print-target\'))') !== -1)
  problems.push('[print] printTopic() still tags every stack of the topic, not the current one');

/* the Firebase layer must never learn this button's name: it is what would make
   printing an account-gated feature instead of one every student has */
{
  const fb = fs.readFileSync('C:/claude/10 th/build-system/firebase-layer.js', 'utf8');
  ['printTopicBtn2', 'printing-topic', 'print-target'].forEach(t => {
    if (fb.indexOf(t) !== -1)
      problems.push('[print] firebase-layer.js references "' + t + '" -- printing must not depend on an account');
  });
}

// 4c. the Teacher AI assistant, and the guarantee that turning it OFF changes nothing

// it must never reach the offline student deck
['aiTip', 'aiBtn', 'generativelanguage', 'AI_PROMPTS'].forEach(t => {
  if (index.indexOf(t) !== -1)
    problems.push('[ai] docs/index.html contains "' + t + '" -- the AI must stay out of the offline deck');
});

// and it must be present in the clone
['aiBtn', 'aiTip', 'aiSet', 'onAiClick', 'aiAsk', 'adAI', 'afEnrich', 'aiGenderSafe'].forEach(t => {
  if (app.indexOf(t) === -1) problems.push('[ai] "' + t + '" missing from the clone');
});

// THE GUARD: every AI style must be scoped, or turning AI Mode off would still
// leave the deck restyled. Same discipline that caught the unscoped
// body.projector-mode rules during the vocabulary merge.
(() => {
  const a = app.indexOf('/* ===== TEACHER AI ASSISTANT ===== */');
  if (a === -1) { problems.push('[ai] the AI CSS block is missing from the clone'); return; }
  /* End at the next banner comment, not at </style>: the layer appends its CSS in
     labelled blocks, and reading to the end of the stylesheet made every later
     block look like an unscoped AI rule. */
  const nextBlock = app.indexOf('/* =====', a + 10);
  const style = app.indexOf('</style>', a);
  let end = (nextBlock !== -1 && (style === -1 || nextBlock < style)) ? nextBlock : style;
  const bad = app.slice(a, end === -1 ? a + 4000 : end).split(String.fromCharCode(10))
    .map(l => l.trim())
    .filter(l => l.indexOf('{') > -1 && /^[.#a-z]/i.test(l))
    .filter(l => !/^(body\.ai-mode|\.ai-|#aiBtn|#aiTip|@media)/.test(l));
  if (bad.length) problems.push('[ai] unscoped AI selector(s) could restyle the deck: ' + bad.slice(0, 3).join(' | '));
})();

// the click listener must be added only inside the ON path, never at top level
(() => {
  /* Match the declaration, not one exact parameter list: the signature gained a
     byUser parameter and a literal 'function aiSet(on)' anchor went stale. */
  const a = app.indexOf('function aiSet(');
  const decl = app.indexOf("document.addEventListener('click', onAiClick)");
  if (decl === -1) { problems.push('[ai] onAiClick is never registered'); return; }
  if (a === -1 || decl < a)
    problems.push('[ai] the AI click listener is registered outside aiSet() -- OFF would not be clean');
})();

// The assistant server address must reach students through Firestore. Keeping it
// only in the teacher's browser is exactly the bug that hid the AI button from
// every student device.
if (app.indexOf("setDoc(doc(db, 'config', 'ai'), { proxy: v") === -1)
  problems.push('[ai] Admin Save does not share the server address through config/ai');
if (app.indexOf("aiProxyShared = typeof cfg.proxy === 'string'") === -1)
  problems.push('[ai] aiLoadSwitch does not read the shared server address');
if (app.indexOf("aiLS.get('ai_proxy', '').trim() || aiProxyShared") === -1)
  problems.push('[ai] aiProxy() does not fall back to the shared address');
// a system switch-off must never overwrite a student's own on/off choice
if (app.indexOf("if (byUser) aiLS.set('ai_on'") === -1)
  problems.push("[ai] ai_on is saved on system switch-offs, not only on the user's own choice");

// 4d. Pick Student belongs to the teacher only.
//
// The deck ships the button to everyone -- it has to, because docs/index.html is
// the offline deck with no accounts at all and must stay byte-identical. So the
// LAYER does the hiding, and these four checks keep it that way: both halves
// present in the clone, and neither of them leaking into the offline deck.
if (app.indexOf('body:not(.fb-teacher) #pickStudentBtn') === -1)
  problems.push('[pick] the clone does not hide #pickStudentBtn from non-teachers');
if (app.indexOf("classList.toggle('fb-teacher'") === -1)
  problems.push('[pick] applyGate does not set the fb-teacher body class');
if (index.indexOf('fb-teacher') !== -1)
  problems.push('[pick] docs/index.html mentions fb-teacher -- the role gate must stay in the layer');
if (index.indexOf('#pickStudentBtn{ display:none') !== -1)
  problems.push('[pick] docs/index.html hides its own Pick Student button -- the offline deck must keep it');

// placement: must not collide with the admin trigger, and must sit on its own rung
if (app.indexOf('z-index:10040') === -1) problems.push('[ai] the tooltip is not at z-index 10040');
if (app.indexOf('position:fixed; right:60px;') === -1)
  problems.push('[ai] the AI button is not at right:60px -- .ad-btn owns right:16px');

// No Gemini key may ever be baked into a published file. Two refinements matter:
// base64 image payloads contain "AIza" by sheer chance (measured: exactly one such
// run in 23 MB of photos), so data: URIs are stripped first; and only a real
// 39-character Google key shape counts. The Firebase web config carries one legitimately.
(() => {
  const KEYRE = /AIza[0-9A-Za-z_-]{35}/g;
  const strip = h => h.replace(/data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+/g, 'DATA_URI');
  [['index', index, 0], ['app', app, 1]].forEach(t => {
    const hits = strip(t[1]).match(KEYRE) || [];
    if (hits.length > t[2])
      problems.push('[ai] docs/' + t[0] + '.html holds ' + hits.length +
                    ' API-key literal(s), expected at most ' + t[2]);
  });
})();

// 5. the clone may reach Firebase and nothing else
const ALLOW = ['www.gstatic.com', 'firebasejs', 'googleapis.com', 'firebaseio.com',
               'firebaseapp.com', 'generativelanguage.googleapis.com'];
const ext = [];
const push = u => { if (/^(https?:)?\/\//i.test(u.trim())) ext.push(u.trim()); };
let m;
const re1 = /<script\b[^>]*\bsrc="([^"]+)"/gi;  while ((m = re1.exec(app)) !== null) push(m[1]);
const re2 = /<link\b[^>]*\bhref="([^"]+)"/gi;   while ((m = re2.exec(app)) !== null) push(m[1]);
const re3 = /<img\b[^>]*\bsrc="([^"]+)"/gi;     while ((m = re3.exec(app)) !== null) push(m[1]);
const re4 = /from\s+['"]((?:https?:)?\/\/[^'"]+)['"]/gi; while ((m = re4.exec(app)) !== null) push(m[1]);
const re5 = /url\(\s*['"]?((?:https?:)?\/\/[^'")]+)/gi;  while ((m = re5.exec(app)) !== null) push(m[1]);

const bad = ext.filter(u => !ALLOW.some(a => u.indexOf(a) !== -1));
bad.forEach(u => problems.push('[network] clone reaches a non-Firebase host: ' + u.slice(0, 90)));

// 6. SDK version actually is v11+
const vm = app.match(/firebasejs\/(\d+)\.(\d+)\.(\d+)\//);
if (!vm) problems.push('[sdk] no Firebase SDK URL found in the clone');
else if (Number(vm[1]) < 11) problems.push('[sdk] Firebase ' + vm[0] + ' is older than v11');

// 7. config state -- a warning, not a failure: the app says so on screen too
const configured = app.indexOf('PASTE_API_KEY') === -1;

console.log('=== FIREBASE CLONE GATE ===');
console.log('  docs/index.html  :', (index.length / 1048576).toFixed(2), 'MB (offline deck)');
console.log('  docs/app.html    :', (app.length / 1048576).toFixed(2), 'MB (clone)');
console.log('  layer adds       :', (app.length - index.length), 'bytes');
console.log('  presentation     :', stripped === index ? 'byte-identical after strip' : 'CHANGED');
console.log('  SDK              :', vm ? vm[0].replace(/\//g, '') : '(none)');
console.log('  external hosts   :', [...new Set(ext.map(u => u.split('/')[2] || u))].join(', ') || 'none');
console.log('  firebase config  :', configured ? 'REAL' : 'PLACEHOLDER (paste yours into build-system/firebase-config.js)');
console.log('');

if (!problems.length) {
  console.log('  RESULT: PASS -- the clone is docs/index.html plus a removable Firebase layer.');
  if (!configured) console.log('  NOTE  : sign-in will not work until the real config is pasted in.');
  process.exit(0);
}
console.log('  RESULT: FAIL');
problems.forEach(p => console.log('   x ' + p));
process.exit(1);
