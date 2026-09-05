// Regenerate the whole "La Lettre (Section B)" topic inside an ASSEMBLED app file.
//
//   node split-letters-in-file.js "E:/Master Grammar App v2.html"
//
// Replaces all five stacks (The Format, Useful Phrases, The Tone, Model Letters,
// Exam Practice) from letterdata.js, using the same renderers the build uses, so the
// monolith and build-system can never diverge.
//
// Writes ONLY to the target passed as an argument — never into build-system, so it
// cannot collide with the other session working there.
const fs = require('fs');
const path = require('path');

const TARGET = process.argv[2];
if (!TARGET){ console.error('usage: node split-letters-in-file.js <target.html>'); process.exit(1); }
if (!fs.existsSync(TARGET)){ console.error('target not found: ' + TARGET); process.exit(1); }

const gen = require('./gen-letter-slides.js');
const { renderLetter, renderLesson, esc, sid, LETTER_CSS } = gen;

let src = fs.readFileSync(path.join(__dirname, 'letterdata.js'), 'utf8');
const DATA = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1));

let html = fs.readFileSync(TARGET, 'utf8');
const before = { bytes: html.length, slides: (html.match(/data-slide-id=/g) || []).length };

/* Find a stack by its data-sub and return [start, end], matching <section> depth.
   A stack holds many nested <section> children, so "the next </section>" would cut
   in the wrong place. */
function stackRange(hay, sub){
  const at = hay.indexOf('data-sub="' + sub + '"');
  if (at < 0) return null;
  const start = hay.lastIndexOf('<section', at);
  const re = /<section\b|<\/section>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(hay)) !== null){
    if (m[0] === '</section>'){ depth--; if (depth === 0) return [start, m.index + '</section>'.length]; }
    else depth++;
  }
  return null;
}

const slugCount = {};
function stepName(t){
  let s = t.en.title;
  slugCount[s] = (slugCount[s] || 0) + 1;
  return slugCount[s] > 1 ? s + ' (' + slugCount[s] + ')' : s;
}

let replaced = 0, made = 0, removed = 0;
const misses = [];

// last group first, so earlier offsets stay valid as we splice
[...DATA].reverse().forEach(g => {
  const range = stackRange(html, g.group);
  if (!range){ misses.push(g.group); return; }
  const oldCount = (html.slice(range[0], range[1]).match(/data-slide-id=/g) || []).length;

  let stack = '      <section data-topic="lettre" data-topic-name="La Lettre (Section B)" data-sub="' + esc(g.group) + '">\n\n';
  g.topics.forEach((t, i) => {
    if (t.kind === 'letter'){
      renderLetter(t, i + 1).forEach(p => {
        // data-group / data-item drive the sidebar accordion (Chapter -> Letter -> parts)
        stack += '        <section data-slide-id="' + esc(sid(t.id)) + '-' + p.suffix +
                 '" data-step="' + esc(t.lecon ? t.lecon + ' — ' + p.step : p.step) + '"' +
                 ' data-group="' + esc(t.lecon || 'Autres') + '"' +
                 ' data-item="' + esc(t.en.title) + '">\n';
        stack += p.body;
        stack += '        </section>\n\n';
        made++;
      });
    } else {
      stack += '        <section data-slide-id="' + esc(sid(t.id)) + '" data-step="' + esc(stepName(t)) + '">\n';
      stack += renderLesson(t, i + 1);
      stack += '        </section>\n\n';
      made++;
    }
  });
  stack += '      </section>';

  html = html.slice(0, range[0]) + stack + html.slice(range[1]);
  replaced++;
  removed += oldCount;
});

/* ---- CSS, bounded by an END marker ---- */
const MARK = '/* ===== MODEL LETTERS 4-SLIDE SPLIT (injected) ===== */';
// Bounded by an END marker. Slicing to </style> would silently delete any CSS block
// injected after this one (it ate the sidebar accordion CSS exactly once).
const MARK_END = '/* ===== END MODEL LETTERS ===== */';
if (html.indexOf(MARK) === -1){
  const s = html.lastIndexOf('</style>');
  if (s < 0){ console.error('no </style> in target — cannot inject CSS'); process.exit(1); }
  html = html.slice(0, s) + '\n' + MARK + '\n' + LETTER_CSS + '\n' + MARK_END + '\n' + html.slice(s);
  console.log('  css              : injected');
} else {
  const a = html.indexOf(MARK);
  const e = html.indexOf(MARK_END, a);
  const b = e >= 0 ? e + MARK_END.length : html.indexOf('</style>', a);
  html = html.slice(0, a) + MARK + '\n' + LETTER_CSS + '\n' + MARK_END + html.slice(b);
  console.log('  css              : replaced');
}

fs.writeFileSync(TARGET, html);
const after = { bytes: html.length, slides: (html.match(/data-slide-id=/g) || []).length };
console.log('  stacks replaced  :', replaced, 'of', DATA.length);
console.log('  slides in topic  :', removed, '->', made);
console.log('  slides total     :', before.slides, '->', after.slides);
console.log('  size             :', (before.bytes / 1048576).toFixed(2), 'MB ->', (after.bytes / 1048576).toFixed(2), 'MB');
if (misses.length){ console.error('  STACKS NOT FOUND :', misses.join(', ')); process.exit(1); }
