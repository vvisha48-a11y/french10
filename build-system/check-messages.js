// Gate for Les Messages.
//
//   node check-messages.js ["path/to/monolith.html"]
//
// verify.js proves the module does not break the grammar schema. This proves the module
// is actually correct on its own terms: the geometry solver agrees with what shipped, the
// four widgets are wired, the exemptions hold, and nothing drafted is presented as a real
// past paper.

const fs = require('fs');
const path = require('path');

const GEN = require('./gen-message-slides.js');

const FILE = process.argv[2] || 'C:/claude/10 th/master-grammar-app.html';
if (!fs.existsSync(FILE)){ console.error('not found: ' + FILE); process.exit(1); }
const html = fs.readFileSync(FILE, 'utf8');
const problems = [];

const src = fs.readFileSync(path.join(__dirname, 'messagedata.js'), 'utf8');
const at = src.indexOf('MESSAGEDATA');
const DATA = JSON.parse(src.slice(src.indexOf('[', at), src.lastIndexOf(']') + 1));

/* ---- 1. stacks and slides ---- */
// data-sub is HTML-escaped in the markup (Tips &amp; Traps), so decode before comparing
// with the raw group names in messagedata.js.
const unesc = v => String(v).replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const stacks = [...html.matchAll(/<section data-topic="messages"[^>]*data-sub="([^"]*)"/g)].map(m => unesc(m[1]));
if (stacks.length !== DATA.length)
  problems.push('[stacks] ' + stacks.length + ' message stacks, expected ' + DATA.length);
DATA.forEach(g => {
  if (stacks.indexOf(g.group) === -1) problems.push('[stacks] missing stack "' + g.group + '"');
});

const slideIds = [...html.matchAll(/data-slide-id="(msg-[^"]*)"/g)].map(m => m[1]);
let expected = 0;
DATA.forEach(g => { expected += g.topics.length; });
/* every message topic carrying vocabulary also emits a follow-on "Vocabulaire" slide,
   so the vocabulary can never crowd the message it belongs to */
DATA.forEach(g => g.topics.forEach(t => {
  if (t.kind === 'message' && t.vocab && t.vocab.length) expected++;
}));
expected += 2;                                  // the two generated correction slides
if (slideIds.length !== expected)
  problems.push('[slides] ' + slideIds.length + ' message slides, expected ' + expected);
const dup = slideIds.filter((x, i) => slideIds.indexOf(x) !== i);
if (dup.length) problems.push('[slides] duplicate ids: ' + [...new Set(dup)].join(', '));

/* ---- 2. the exemptions that keep verify.js's 8-step rule at 49 ---- */
/* End at the first stack belonging to a DIFFERENT topic. Hard-coding "revision"
   as the boundary broke the moment Les Lecons was inserted between this module
   and Revision: the region silently swallowed 217 foreign slides. */
const endOfTopic = (h, from, topic) => {
  const re = /<section data-topic="([^"]+)"/g;
  re.lastIndex = from + 1;
  let m2;
  while ((m2 = re.exec(h)) !== null) if (m2[1] !== topic) return m2.index;
  return h.length;
};
const region = (() => {
  const a = html.indexOf('<section data-topic="messages"');
  if (a === -1) return '';
  return html.slice(a, endOfTopic(html, a, 'messages'));
})();
if (!region) problems.push('[exempt] no messages region found');
const steps = [...region.matchAll(/data-step="([^"]*)"/g)].map(m => m[1]);
if (steps.indexOf('Description') !== -1)
  problems.push('[exempt] a step is named "Description" — that pulls these stacks into the 8-step rule');
const usage = steps.filter(s => /^Usages/.test(s));
if (usage.length) problems.push('[exempt] step starts with "Usages" (demands a visual): ' + usage.join(', '));

/* ---- 3. the four widgets ---- */
[['type-switcher tabs', 'msg-sw-tab'], ['type-switcher panels', 'msg-sw-panel'],
 ['switcher :checked rule', '#msgsw-inv:checked'],
 ['hotspot lines', 'msg-hot-line'], ['hotspot :checked rule', '.msg-hot-in:checked'],
 ['mark simulator', 'msg-mk-crit'], ['mark :checked rule', '.msg-mk-in:checked'],
 ['builder markup', 'data-msg-build'], ['builder engine fn', 'function initMsgBuilder'],
 ['builder boot call', "$$('.msg-build').forEach(initMsgBuilder)"]
].forEach(([label, needle]) => {
  if (html.indexOf(needle) === -1) problems.push('[widget] ' + label + ' missing (' + needle + ')');
});

/* The three CSS-only widgets must NOT depend on the engine: if someone later "helps" by
   adding JS for them, the offline/print/no-JS guarantee quietly goes away. */
['msg-sw-tab', 'msg-hot-line', 'msg-mk-crit'].forEach(cls => {
  const re = new RegExp("\\$\\$?\\('\\." + cls + "'");
  if (re.test(html)) problems.push('[widget] .' + cls + ' is now queried by the engine — it is meant to be CSS-only');
});

/* ---- 4. geometry: what shipped must equal a fresh solve ---- */
let fitChecked = 0, fitBad = 0;
DATA.forEach(g => g.topics.forEach(t => {
  if (t.kind !== 'message') return;
  const want = GEN.fitMessage(t.message.fr).vh;
  const seg = html.indexOf('data-slide-id="' + t.id + '"');
  if (seg === -1){ problems.push('[fit] slide not found: ' + t.id); return; }
  const m = /--msg-fs:([0-9.]+)vh/.exec(html.slice(seg, seg + 6000));
  if (!m){ problems.push('[fit] no --msg-fs on ' + t.id); return; }
  fitChecked++;
  if (Math.abs(parseFloat(m[1]) - want) > 0.005){
    fitBad++;
    problems.push('[fit] ' + t.id + ' shipped ' + m[1] + 'vh, solver says ' + want + 'vh');
  }
}));

/* The solver must actually discriminate. If every message lands on the ceiling the
   sizing is decorative — that is precisely what reusing fitLetter would have done. */
const pxs = [];
DATA.forEach(g => g.topics.forEach(t => { if (t.kind === 'message') pxs.push(GEN.fitMessage(t.message.fr).px); }));
if (new Set(pxs).size < 2)
  problems.push('[fit] every message solved to the same size — the solver is not discriminating');
if (pxs.filter(p => p === GEN.FITM.MAXPX).length === pxs.length)
  problems.push('[fit] every message is at the ' + GEN.FITM.MAXPX + 'px ceiling — raise MAXPX and the CSS clamp together');

/* The CSS clamp and the solver ceiling must agree, or sizes are silently capped. */
const clamp = /--msg-fs,[^)]*\)\s*,\s*([0-9.]+)rem\s*\)/.exec(html);
if (clamp){
  const ceilPx = parseFloat(clamp[1]) * 16;
  if (ceilPx < GEN.FITM.MAXPX)
    problems.push('[fit] CSS clamps at ' + ceilPx + 'px but the solver goes to ' + GEN.FITM.MAXPX + 'px — sizes above the clamp are silently capped');
} else problems.push('[fit] could not find the --msg-fs clamp in the stylesheet');

/* ---- 5. honesty: nothing drafted may look like a real past paper ---- */
let drafts = 0;
DATA.forEach(g => g.topics.forEach(t => {
  if (!t.draft) return;
  drafts++;
  const seg = html.indexOf('data-slide-id="' + t.id + '"');
  if (seg === -1) return;
  if (html.slice(seg, seg + 4000).indexOf('awaiting review') === -1)
    problems.push('[honesty] drafted model "' + t.id + '" is not labelled on the slide');
}));
if (/CBSE\s*20\d\d/.test(region))
  problems.push('[honesty] a "CBSE 20xx" year label appears in the Messages module — no year here is verified');

/* ---- 6. house rules ---- */
const hex = region.match(/(?:fill|stroke)="#[0-9a-fA-F]{3,8}"/g);
if (hex) problems.push('[theme] SVG literal hex (breaks 6 of 7 themes): ' + [...new Set(hex)].join(' '));
const quiz = (region.match(/class="quiz-container"/g) || []).length;
const score = (region.match(/class="score-display"/g) || []).length;
const fill = (region.match(/class="quiz-progress-fill"/g) || []).length;
if (quiz !== score || quiz !== fill)
  problems.push('[quiz] ' + quiz + ' containers but ' + score + ' score-display / ' + fill + ' progress-fill');
if (html.indexOf('id="messagesBtn"') === -1) problems.push('[topbar] Messages button missing');
if (html.indexOf("topicByKey['messages']") === -1) problems.push('[topbar] Messages button not wired in the engine');
/* Assert the BEHAVIOUR, not one exact literal: the hide-list grew when Les
   Lecons was merged, and pinning the old string made a correct change look
   like a regression. */
if (!/MENU_HIDE = {[^}]*messages: 1/.test(html))
  problems.push('[topbar] Messages is not hidden from the Grammar dropdown');

/* ---- report ---- */
const types = {};
DATA.forEach(g => g.topics.forEach(t => { if (t.kind === 'message') types[t.type] = (types[t.type] || 0) + 1; }));
console.log('=== LES MESSAGES GATE ===');
console.log('  file             :', FILE);
console.log('  stacks           :', stacks.length, '->', stacks.join(' · '));
console.log('  slides           :', slideIds.length);
console.log('  message models   :', Object.keys(types).map(k => k + ' ' + types[k]).join(', '));
console.log('  drafted (review) :', drafts);
console.log('  geometry         :', fitChecked, 'checked,', fitBad, 'mismatched,',
            Math.min.apply(null, pxs) + '-' + Math.max.apply(null, pxs) + 'px,',
            new Set(pxs).size, 'distinct sizes');
console.log('  widgets          : switcher · hotspots · mark-scheme (CSS-only) + builder (engine)');
console.log('  8-step exemption :', steps.indexOf('Description') === -1 ? 'holds' : 'BROKEN');
console.log('');
console.log('=== PROBLEMS ===');
if (!problems.length) console.log('  none');
else problems.forEach(p => console.log('  x ' + p));
process.exit(problems.length ? 1 : 0);
