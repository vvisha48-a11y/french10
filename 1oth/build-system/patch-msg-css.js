// Injects MESSAGE_CSS into a target's stylesheet.
//
//   node patch-msg-css.js                      -> b-style.html (the build source)
//   node patch-msg-css.js "E:/Master Grammar App v2.html"
//
// Idempotent by a BOUNDED marker pair. The bounding is not decoration: a patcher here
// once sliced from its own marker to </style> and silently ate the sidebar accordion
// CSS, because that block had been injected after it. Replace between the two markers
// and nothing else can be caught in the blast radius.
//
// MESSAGE_CSS already begins and ends with the markers, so the injected region is
// exactly the stylesheet — no wrapper to drift out of sync.

const fs = require('fs');
const path = require('path');
const { MESSAGE_CSS } = require('./msg-css.js');

const MARK = '/* ===== LES MESSAGES ===== */';
const MARK_END = '/* ===== END LES MESSAGES ===== */';

const target = process.argv[2] || path.join(__dirname, 'b-style.html');
if (!fs.existsSync(target)){ console.error('target not found: ' + target); process.exit(1); }

let html = fs.readFileSync(target, 'utf8');
const before = html.length;

if (MESSAGE_CSS.indexOf(MARK) !== 0)
  { console.error('MESSAGE_CSS no longer starts with its marker — refusing to guess'); process.exit(1); }
if (MESSAGE_CSS.indexOf(MARK_END) === -1)
  { console.error('MESSAGE_CSS no longer ends with its marker — refusing to guess'); process.exit(1); }

const a = html.indexOf(MARK);
if (a === -1){
  const s = html.lastIndexOf('</style>');
  if (s < 0){ console.error('no </style> in target — cannot inject'); process.exit(1); }
  html = html.slice(0, s) + '\n' + MESSAGE_CSS + '\n' + html.slice(s);
  console.log('  message css      : injected');
} else {
  const e = html.indexOf(MARK_END, a);
  if (e === -1){ console.error('start marker present but END marker missing — refusing to guess'); process.exit(1); }
  html = html.slice(0, a) + MESSAGE_CSS.replace(/\n$/, '') + html.slice(e + MARK_END.length);
  console.log('  message css      : replaced');
}

fs.writeFileSync(target, html);
console.log('  target           :', path.basename(target));
console.log('  bytes            :', before, '->', html.length, '(' + (html.length - before >= 0 ? '+' : '') + (html.length - before) + ')');
