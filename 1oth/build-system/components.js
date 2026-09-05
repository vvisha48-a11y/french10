// Shared slide-layout components.
//
// These were private to lessons.js. La Lettre and Les Messages both need them, so
// they live here and lessons.js requires them back — moved, never re-implemented, so
// the two modules cannot drift into rendering the same component two different ways.
//
// TWO RULES, both load-bearing:
//
//  1. Every function takes ALREADY-ESCAPED HTML and does not escape. That is
//     deliberate: it lets a caller pass <b>, <br> or <i lang="fr"> in a literal it
//     authored itself. When the data comes from letterdata.js / messagedata.js the
//     CALLER must apply esc() first — see lessons.js L['lieu-date'] for the pattern.
//
//  2. Output is indented 12 spaces and ends in '\n', so components concatenate with
//     plain '+' and land correctly inside a .slide-card.
//
// The matching CSS (.ls-*) already ships in b-style.html, so neither module emits any
// stylesheet for these.

/* Stat tiles. arr = [{n, label, tone}] — tone: gold | green | purple | blue | '' */
const tiles = arr => '            <div class="ls-tiles">\n' + arr.map(t =>
  '              <div class="ls-tile ' + (t.tone || '') + '"><span class="ls-tile-n">' + t.n +
  '</span><span class="ls-tile-l">' + t.label + '</span></div>\n').join('') + '            </div>\n';

/* Icon bullets. arr = [{icon, text}] */
const bullets = arr => '            <ul class="ls-bullets">\n' + arr.map(b =>
  '              <li><span class="ls-ico">' + b.icon + '</span><span>' + b.text + '</span></li>\n'
).join('') + '            </ul>\n';

/* Callout box. kind = tip | danger */
const callout = (kind, title, body) =>
  '            <div class="ls-call ls-' + kind + ' fragment">\n' +
  '              <p class="ls-call-h">' + title + '</p>\n' +
  '              <p class="ls-call-b">' + body + '</p>\n' +
  '            </div>\n';

/* Two-column DO / DON'T. rows = [{good, bad, note}]
   .ls-bad is struck through by CSS — never pre-strike the text. */
const doDont = (goodHead, badHead, rows) =>
  '            <table class="ls-dd">\n' +
  '              <tr><th class="ls-dd-good">' + goodHead + '</th><th class="ls-dd-bad">' + badHead + '</th></tr>\n' +
  rows.map(r => '              <tr><td class="ls-good">' + r.good + '</td><td class="ls-bad">' + r.bad + '</td></tr>' +
    (r.note ? '<tr><td colspan="2" class="ls-dd-note">' + r.note + '</td></tr>' : '') + '\n').join('') +
  '            </table>\n';

/* Numbered flow: steps = [{n, title, body}]. Arrows go BETWEEN steps, not after
   the last one. Three steps is the tested width. */
const flow = steps => '            <div class="ls-flow">\n' + steps.map((s, i) =>
  '              <div class="ls-step fragment"><span class="ls-step-n">' + s.n + '</span>' +
  '<span class="ls-step-t">' + s.title + '</span>' +
  '<span class="ls-step-b">' + s.body + '</span></div>\n' +
  (i < steps.length - 1 ? '              <div class="ls-arrow">→</div>\n' : '')
).join('') + '            </div>\n';

/* French phrase + English meaning. arr = [{fr, en, tag, tone}] — tone: green | purple | ''
   .ls-en is always visible; it is NOT the .let-en toggle class. */
const phrases = arr => '            <div class="ls-phrases">\n' + arr.map(p =>
  '              <div class="ls-phrase ' + (p.tone || '') + ' fragment">' +
  (p.tag ? '<span class="ls-tag">' + p.tag + '</span>' : '') +
  '<p class="ls-fr" lang="fr">' + p.fr + '</p>' +
  (p.en ? '<p class="ls-en">' + p.en + '</p>' : '') + '</div>\n'
).join('') + '            </div>\n';

/* Horizontal bar chart — topic frequency and the mark scheme.
   r.inside renders INSIDE the coloured fill (the exam years). A zero-value row has
   no fill to sit in, so its text goes in the empty track instead.
   `max` is passed explicitly, never derived, so several charts can share one scale. */
const bars = (rows, max, unit) => '            <div class="ls-bars">\n' + rows.map(r => {
  const pct = Math.round(r.v / max * 100);
  const txt = r.inside ? '<span class="ls-bar-txt">' + r.inside + '</span>' : '';
  const track = r.v > 0
    ? '<span class="ls-bar-fill ' + (r.tone || '') + '" style="width:' + pct + '%">' + txt + '</span>'
    : (r.inside ? '<span class="ls-bar-none">' + r.inside + '</span>' : '');
  return '              <div class="ls-bar-row"><span class="ls-bar-l">' + r.label + '</span>' +
    '<span class="ls-bar-track">' + track + '</span>' +
    '<span class="ls-bar-v">' + r.v + (unit || '') + '</span></div>\n';
}).join('') + '            </div>\n';

/* Progress rail showing where this slide sits in the piece of writing.
   `steps` defaults to the letter blueprint so lessons.js renders exactly as before;
   Les Messages passes its own four-part rail. */
const BLUEPRINT = ['Opening', 'Purpose', 'Linking', 'Ending', 'Sign-off'];
const blueprint = (active, steps) => {
  const S = steps || BLUEPRINT;
  return '            <div class="ls-blueprint">\n' + S.map((s, i) =>
    '              <span class="ls-bp' + (i === active ? ' on' : '') + '">' + s + '</span>' +
    (i < S.length - 1 ? '<span class="ls-bp-sep">›</span>' : '') + '\n'
  ).join('') + '            </div>\n';
};

module.exports = { tiles, bullets, callout, doDont, flow, phrases, bars, blueprint, BLUEPRINT };
