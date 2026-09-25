// Gate for the desktop app. Run by npm start / dist / release after the sync, or:
//
//   npm run check
//
// It proves four things, and fails loudly if any is not true:
//   1. the copy is complete    -- every photo the page asks for, the full-res
//                                 originals, the 3 Firebase SDK files;
//   2. the copy is faithful    -- content/app.html is docs/app.html plus the offline
//                                 patch and NOTHING else (unpatched, it is identical);
//   3. the layers still fit    -- every id, rule and value the desktop scripts lean on
//                                 is still in the website, so a website change cannot
//                                 silently break them;
//   4. the website is untouched -- git shows no change in docs/, build-system/,
//                                 ai-proxy/, master-grammar-app.html or firestore.rules.
// It also runs the offline-approval logic against every case it has to handle.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { MARK, ANCHORS, WRAPPER } = require('./offline-approval.js');

const APP_DIR = path.resolve(__dirname, '..');
const REPO = path.resolve(APP_DIR, '..');
const CONTENT = path.join(APP_DIR, 'content');
const INJECT = path.join(APP_DIR, 'src', 'inject');

let failed = 0;
const ok = (cond, what, detail) => {
  console.log((cond ? '  ok    ' : '  FAIL  ') + what + (detail ? '  (' + detail + ')' : ''));
  if (!cond) failed++;
};
const count = (hay, needle) => hay.split(needle).length - 1;

/* ---------------- 1. complete ---------------- */
console.log('the copy');
let manifest = null;
try { manifest = JSON.parse(fs.readFileSync(path.join(CONTENT, 'manifest.json'), 'utf8')); } catch (_){}
ok(!!manifest, 'content/manifest.json present', manifest ? 'synced ' + manifest.syncedAt : 'run npm run sync');
if (!manifest){ console.error('\ncheck-desktop: nothing to check'); process.exit(1); }

const html = fs.readFileSync(path.join(CONTENT, 'app.html'), 'utf8');
const web = fs.readFileSync(path.join(REPO, 'docs', 'app.html'), 'utf8');
const refs = [...new Set([...html.matchAll(/\sdata-src="images\/([^"]+)"/g)].map(m => m[1]))];
const missing = refs.filter(f => !fs.existsSync(path.join(CONTENT, 'images', f)));
ok(refs.length > 0 && missing.length === 0, 'every photo the page loads is in content/images', refs.length + ' referenced, ' + missing.length + ' missing');
ok(manifest.images.originals > 0, 'lesson photos swapped for full-resolution originals', manifest.images.originals + ' photos');

const v = manifest.sdk.version;
for (const f of manifest.sdk.files){
  const p = path.join(CONTENT, 'sdk', f);
  const s = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const imports = [...s.matchAll(/https:\/\/www\.gstatic\.com\/firebasejs\/[^"']+/g)].map(m => m[0])
    .filter(u => u !== 'https://www.gstatic.com/firebasejs/' + v + '/firebase-app.js');
  ok(s.length > 1000 && imports.length === 0, 'Firebase SDK ' + f + ' bundled and self-contained', Math.round(s.length / 1024) + ' KB');
}

/* ---------------- 2. faithful ---------------- */
console.log('the patch');
ok(count(html, MARK) === 1, 'offline approval applied exactly once');
ok(count(html, 'async function loadMeLive(user){') === 1 && count(html, ANCHORS.fn) === 1, 'loadMe is wrapped, the live read kept as loadMeLive');
ok(count(html, ANCHORS.call) === 1, 'the sign-in handler still calls loadMe');
ok(html.replace(WRAPPER, () => ANCHORS.fn) === web, 'content/app.html is docs/app.html + the patch, nothing else');

/* ---------------- 3. the layers still fit ---------------- */
console.log('what the desktop layers rely on');
const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const need = [
  ['id="fontFamilySelect"', 'font list'], ['<option value="\'Plus Jakarta Sans\', sans-serif">', 'Plus Jakarta Sans option'],
  ['id="fontSizeSelect"', 'text-size list'], ['<option value="1.3">130% — Projector</option>', '130% — Projector option'],
  ["$('#fontSizeSelect').onchange", 'text-size handler'], ["$('#fontFamilySelect').onchange", 'font handler'],
  ['id="settingsBtn"', 'settings button (📅 goes before it)'], ['id="modeBtn"', 'Teacher/Student toggle'],
  ['id="printTopicBtn2"', 'Print this topic button'], ['id="printBookBtn"', 'Print workbook button'],
  ['function armPrint(){', 'armPrint()'], ["window.addEventListener('afterprint', endPrint, { once: true });", 'endPrint on afterprint'],
  /* the workbook save fires afterprint once up front so these two listeners are gone
     before it isolates each topic; print media flips back after every part */
  ['const onChange = e => { if (!e.matches) endPrint(); };', 'the print-media listener endPrint detaches'],
  ['function endPrint(){', 'endPrint()'],
  ['setTimeout(() => window.print(), 250);', 'the one window.print() call'], ["function fetchPhotos(scope, timeoutMs)", 'fetchPhotos()'],
  ['window.Deck = Deck;', 'window.Deck'], ['id="slidesRoot"', '#slidesRoot'], ['<article class="pl-q', 'past-paper questions'],
  ['class="box blue content-box let-letter let-paper"', 'letter paper'], ['class="gloss let-en"', 'English letter lines'],
  ["document.body.classList.add('fb-locked')", 'sign-in lock class'], ['id="toastNotification"', 'toast']
];
for (const [s, what] of need) ok(html.includes(s), what);

/* the English line is set to the French line's size by restating the deck's four
   letter-size rules; if the deck changes one, the desktop copy would drift */
const letterSizes = [
  'font-size:clamp(1rem, var(--let-fs,1.9vh), 2rem)',
  'body.letter-en .let-paper .example-text{ font-size:clamp(.68rem, var(--let-fs-en,1.4vh), 2rem); }',
  'font-size:clamp(1rem, calc(var(--let-fs,1.9vh) * var(--let-boost,1)), 3.2rem)',
  'font-size:clamp(.8rem, calc(var(--let-fs-en,1.4vh) * var(--let-boost,1)), 2.6rem)',
  'font-size:clamp(1.15rem,1.75vw,1.75rem)'
];
const ui = fs.readFileSync(path.join(INJECT, 'ui-overrides.css'), 'utf8').replace(/\s+/g, ' ');
letterSizes.forEach(s => {
  const val = s.match(/clamp\(.*\)/)[0];
  ok(css.includes(s) && ui.includes(val), 'letter size mirrored: ' + val);
});

/* the 23 handout rules print-bridge.js parks during a desktop print */
const bridge = fs.readFileSync(path.join(INJECT, 'print-bridge.js'), 'utf8');
const listSrc = bridge.match(/var HANDOUT_RULES = (\[[\s\S]*?\]);/);
const handout = listSrc ? JSON.parse(listSrc[1].replace(/'/g, '"')) : [];
const printRules = [];
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
for (const m of cssNoComments.matchAll(/@media\s+print\s*\{/g)){
  let i = m.index + m[0].length, depth = 1, buf = '', sel = '';
  while (i < cssNoComments.length && depth > 0){
    const c = cssNoComments[i++];
    if (c === '{'){ if (depth === 1){ sel = buf.trim().replace(/\s+/g, ' '); buf = ''; } depth++; }
    else if (c === '}'){ depth--; if (depth === 1){ printRules.push({ sel, decl: buf }); buf = ''; } }
    else buf += c;
  }
}
const missingRules = handout.filter(([sel, prop]) =>
  printRules.filter(r => r.sel === sel && new RegExp('(^|;|\\s)' + prop + '\\s*:').test(r.decl)).length !== 1);
ok(handout.length === 23 && missingRules.length === 0, 'the 23 handout print rules exist once each inside @media print',
   missingRules.length ? 'not found: ' + missingRules.map(r => r[0]).join(' | ') : handout.length + ' rules');

ok(fs.readFileSync(path.join(INJECT, 'calendar.js'), 'utf8').includes("'__FIREBASE_SDK__/firebase-app.js'"), 'calendar imports the page\'s own SDK');
ok(/match \/daily_materials\/\{id\}/.test(fs.readFileSync(path.join(APP_DIR, 'firestore-daily-materials.rules.txt'), 'utf8')), 'daily_materials rule written for the console');

/* ---------------- 4. the website is untouched ---------------- */
console.log('the website');
const guarded = ['docs', 'build-system', 'ai-proxy', 'master-grammar-app.html', 'firestore.rules'];
try {
  const diff = execFileSync('git', ['-C', REPO, 'diff', '--name-only', 'HEAD', '--', ...guarded], { encoding: 'utf8' }).trim();
  ok(diff === '', 'no tracked change in ' + guarded.join(', '), diff ? diff.split('\n').slice(0, 5).join(', ') : 'git diff is empty');
  const extra = execFileSync('git', ['-C', REPO, 'status', '--porcelain', '--untracked-files=all', '--', 'docs', 'ai-proxy'], { encoding: 'utf8' }).trim();
  ok(extra === '', 'nothing new written into docs/ or ai-proxy/', extra ? extra.split('\n').slice(0, 5).join(', ') : 'clean');
} catch (e){
  console.log('  skip  git is not available here: ' + e.message.split('\n')[0]);
}

/* ---------------- offline approval: every case ---------------- */
(async () => {
  console.log('offline approval');
  const body = 'let ME = null;\n' + WRAPPER.replace('const DESKTOP_WAIT_MS = 4000;', 'const DESKTOP_WAIT_MS = 60;') +
               '\n  return LIVE(user);\n}\nreturn { loadMe, me: () => ME };';
  const store = () => { const m = new Map(); return { getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), m }; };
  const make = (ls, online, live, gate) => new Function('localStorage', 'navigator', 'LIVE', 'applyGate', body)(ls, { onLine: online }, live, gate || (() => {}));
  const approved = { uid: 'u1', email: 's@x', label: 's@x', role: 'student', status: 'approved', studentId: null };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const offline = () => Promise.reject(Object.assign(new Error('Failed to get document because the client is offline.'), { code: 'unavailable' }));
  const u1 = { uid: 'u1' };

  const ls = store();
  let r = await make(ls, true, async () => approved).loadMe(u1);
  ok(r.status === 'approved' && JSON.parse(ls.getItem('desktop.profile.u1')).status === 'approved', 'first online sign-in: live answer used and saved on this PC');

  let t = Date.now();
  r = await make(ls, false, offline).loadMe(u1);
  ok(r.status === 'approved' && Date.now() - t < 30, 'offline: the saved profile opens the deck at once', (Date.now() - t) + ' ms');

  r = await make(ls, true, offline).loadMe(u1);
  ok(r.status === 'approved', 'network down but Windows says online: the saved profile after the live read fails');

  let threw = null;
  try { await make(ls, true, () => Promise.reject(Object.assign(new Error('Missing or insufficient permissions.'), { code: 'permission-denied' }))).loadMe(u1); }
  catch (e){ threw = e; }
  ok(threw && threw.code === 'permission-denied', 'a refusal from the server is passed on, never covered by the saved copy');

  let gated = 0;
  const h = make(ls, true, async () => { await sleep(160); return Object.assign({}, approved, { status: 'pending' }); }, () => gated++);
  t = Date.now();
  r = await h.loadMe(u1);
  const early = Date.now() - t;
  await sleep(200);
  ok(r.status === 'approved' && early < 150 && gated === 1 && h.me().status === 'pending',
     'slow line, account removed meanwhile: deck opens, then the late live answer re-locks it', 'opened in ' + early + ' ms, gate re-applied ' + gated + 'x');
  ok(JSON.parse(ls.getItem('desktop.profile.u1')).status === 'pending', 'and the saved copy now says pending, so the next offline launch stays locked');

  threw = null;
  try { await make(ls, false, offline).loadMe({ uid: 'u2' }); } catch (e){ threw = e; }
  ok(!!threw, 'another account on this PC gets nothing from u1\'s saved profile');

  threw = null;
  try { await make(store(), false, offline).loadMe(u1); } catch (e){ threw = e; }
  ok(!!threw, 'never signed in online on this PC: the website\'s own "could not read your profile" screen');

  console.log(failed ? '\ncheck-desktop: ' + failed + ' check(s) FAILED' : '\ncheck-desktop: all checks passed');
  process.exit(failed ? 1 : 0);
})();
