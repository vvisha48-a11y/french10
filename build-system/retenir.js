// "À retenir" — the 5th slide of each model letter.
//
// The notes in letterdata.js are free-form French prose. This types each note from
// its prefix and renders the matching card, so the same data becomes a colour-coded
// corrections table, a value-points card, a warning card, etc.
//
// Nothing is summarised or dropped: text that is not part of a « wrong » → « right »
// pair is still printed under the table as a caption.
const fs = require('fs');
const path = require('path');

const RULES = JSON.parse(fs.readFileSync(path.join(__dirname, 'notes-rules.json'), 'utf8'));

const esc = v => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const PAIR_RE = /«\s*([^»]+?)\s*»\s*(?:→|->)\s*«\s*([^»]+?)\s*»/g;

/* Highlight exactly what changed: longest common prefix and suffix are dimmed,
   the differing middle is emphasised. This is what makes "the extra e" visible
   instead of the student having to spot it themselves. */
function diffMark(a, b){
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  const mark = (str) => {
    const head = esc(str.slice(0, p));
    const mid = esc(str.slice(p, str.length - s));
    const tail = esc(str.slice(str.length - s));
    return head + (mid ? '<mark class="rt-mark">' + mid + '</mark>' : '') + tail;
  };
  return { a: mark(a), b: mark(b) };
}

function typeOf(note){
  if (/^\s*Corrections?\b|^\s*Corrigé\b/i.test(note)) return 'corr';
  if (/^\s*Ajouts?\b/i.test(note)) return 'plus';
  if (/^\s*ATTENTION\b/.test(note)) return 'warn';
  if (/^\s*Grammaire\b/i.test(note)) return 'gram';
  if (/traduction/i.test(note)) return 'trad';
  return 'note';
}

const META = {
  corr: { icon: '📝', title: 'Grammar corrections', cls: 'rt-corr' },
  plus: { icon: '⭐', title: 'Value points added',  cls: 'rt-plus' },
  warn: { icon: '⚠️', title: 'Warning',                 cls: 'rt-warn' },
  gram: { icon: '🔧', title: 'Grammar to show off',    cls: 'rt-gram' },
  trad: { icon: '🔁', title: 'Translation fix',  cls: 'rt-trad' },
  note: { icon: '💡', title: 'Points to remember',                 cls: 'rt-note' }
};

function correctionCard(note, i){
  PAIR_RE.lastIndex = 0;
  const pairs = [...note.matchAll(PAIR_RE)];
  // whatever prose is left once the pairs are removed — kept, never discarded
  let rest = note.replace(PAIR_RE, '').replace(/^\s*Corrections?[^:]*:\s*/i, '')
                 .replace(/[;·,]\s*/g, ' ').replace(/\s+/g, ' ').trim();

  // the note's own opening phrase, kept as a caption rather than discarded —
  // "Corrections apportées au français d'origine" says WHICH text was corrected
  const intro = (note.match(/^\s*(Corrections?[^:]*)\s*:/i) || [])[1] || '';

  let h = '              <div class="rt-card rt-corr fragment">\n';
  h += '                <p class="rt-head"><span class="rt-ico">📝</span>Grammar corrections</p>\n';
  if (intro) h += '                <p class="rt-intro">' + esc(intro) + '</p>\n';
  h += '                <table class="rt-table"><tbody>\n';
  h += '                  <tr><th class="rt-th-bad">✗ Do not write</th><th class="rt-th-good">✓ Write this</th><th class="rt-th-why">Why? (the rule)</th></tr>\n';
  pairs.forEach(m => {
    const d = diffMark(m[1], m[2]);
    const why = RULES[m[1]] || '';
    h += '                  <tr>' +
         '<td class="rt-bad">' + d.a + '</td>' +
         '<td class="rt-good">' + d.b + '</td>' +
         '<td class="rt-why">' + why + '</td></tr>\n';
  });
  h += '                </tbody></table>\n';
  if (rest) h += '                <p class="rt-rest">' + esc(rest) + '</p>\n';
  h += '              </div>\n';
  return h;
}

function plainCard(note, kind){
  const m = META[kind];
  // The prefix is kept. Stripping it read better but genuinely lost words —
  // "Ajouts", "ATTENTION" — and this section must not drop any source text.
  const body = note.trim();
  return '              <div class="rt-card ' + m.cls + ' fragment">\n' +
         '                <p class="rt-head"><span class="rt-ico">' + m.icon + '</span>' + m.title + '</p>\n' +
         '                <p class="rt-body">' + esc(body) + '</p>\n' +
         '              </div>\n';
}

/* Returns the inner HTML of the À retenir slide, or '' when a letter has no notes. */
function renderRetenir(t){
  const notes = t.notes || [];
  if (!notes.length) return '';
  let h = '            <div class="rt-wrap">\n';
  notes.forEach((note, i) => {
    const kind = typeOf(note);
    // A "Corrections" note only becomes a table if it actually contains
    // « wrong » → « right » pairs; otherwise it is prose and renders as a card.
    const hasPairs = note.indexOf('«') !== -1 && /«[^»]+»\s*(?:→|->)/.test(note);
    h += (kind === 'corr' && hasPairs) ? correctionCard(note, i) : plainCard(note, kind);
  });
  h += '            </div>\n';
  return h;
}

const RETENIR_CSS = `/* ===== À RETENIR cards ===== */
.rt-wrap{ width:100%; max-width:1340px; margin:0 auto; display:flex; flex-direction:column; gap:clamp(8px,1.1vh,16px); min-width:0; }
.rt-card{ border-radius:14px; padding:clamp(10px,1.3vh,18px) clamp(14px,1.6vw,24px); text-align:left; border-left:6px solid var(--card-border); background:var(--box-blue-bg); }
.rt-head{ margin:0 0 8px; font-weight:800; font-size:clamp(.95rem,1.5vh,1.25rem); display:flex; align-items:center; gap:8px; }
.rt-ico{ font-size:1.15em; flex:none; }
.rt-body, .rt-rest{ margin:0; font-size:clamp(.88rem,1.35vh,1.1rem); line-height:1.5; }
.rt-intro{ margin:-4px 0 8px; font-size:clamp(.8rem,1.15vh,.95rem); color:var(--text-muted); font-style:italic; }
.rt-rest{ margin-top:8px; color:var(--text-muted); font-style:italic; }

.rt-corr{ border-left-color:var(--heading-color); }
.rt-corr .rt-head{ color:var(--heading-color); }
.rt-plus{ border-left-color:var(--gold); background:var(--box-gold-bg); }
.rt-plus .rt-head{ color:var(--gold); }
.rt-warn{ border-left-color:var(--crimson); background:var(--box-gold-bg); }
.rt-warn .rt-head{ color:var(--crimson); }
.rt-gram{ border-left-color:var(--purple); }
.rt-gram .rt-head{ color:var(--purple); }
.rt-trad{ border-left-color:var(--crimson); background:var(--box-gold-bg); }
.rt-trad .rt-head{ color:var(--crimson); }
.rt-note{ border-left-color:var(--green); }
.rt-note .rt-head{ color:var(--green); }

.rt-table{ width:100%; border-collapse:collapse; }
.rt-table th, .rt-table td{ padding:clamp(3px,.5vh,8px) 10px; text-align:left; vertical-align:top; font-size:clamp(.82rem,1.25vh,1.05rem); line-height:1.4; }
.rt-table th{ font-size:.78rem; text-transform:uppercase; letter-spacing:.04em; border-bottom:2px solid var(--card-border); }
.rt-table tr + tr td{ border-top:1px solid var(--card-border); }
.rt-th-bad{ color:var(--crimson); }
.rt-th-good{ color:var(--green); }
.rt-th-why{ color:var(--text-muted); }
.rt-bad{ color:var(--crimson); text-decoration:line-through; text-decoration-thickness:1.5px; }
.rt-good{ color:var(--green); font-weight:800; }
.rt-why{ color:var(--text-muted); }
.rt-mark{ background:transparent; color:inherit; font-weight:900; padding:0 1px; border-bottom:2.5px solid currentColor; }

@media (max-width:1100px){ .rt-table th:last-child, .rt-table td:last-child{ display:none; } }
@media print{
  .rt-card{ break-inside:avoid; page-break-inside:avoid; border-left-width:4px; }
  .rt-table th:last-child, .rt-table td:last-child{ display:table-cell; }
}
`;

module.exports = { renderRetenir, RETENIR_CSS, typeOf, diffMark, RULES, PAIR_RE };
