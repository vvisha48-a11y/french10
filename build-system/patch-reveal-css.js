// stdin -> stdout filter for the vendored Reveal.js 4.6.0 stylesheet.
//
// build.sh copies that stylesheet verbatim from line 17 of
// "Les Verbes - Tous les Temps.html"; it lands on line 223 of every output.
// This fixes the six warnings VS Code's CSS linter raises on it:
//   * five vendor-prefixed properties with no standard property beside them
//   * one display:inline-block on a floated box, which CSS ignores anyway
//
// The vendored source line itself stays untouched — the fix happens on the way
// through, so every rebuild reapplies it.
//
// Each anchor must match its expected count EXACTLY or the build stops. A future
// Reveal upgrade that moves or drops one should be noticed, not half-applied.
const fs = require('fs');

const FIXES = [
  { what: 'appearance on .reveal .controls button',
    find: '-webkit-appearance:none', count: 1,
    repl: '-webkit-appearance:none;appearance:none' },

  { what: 'transform on .reveal.page .slides section:not(.stack):after',
    find: '-webkit-transform:translateZ(-90px) rotateX(65deg)', count: 1,
    repl: '-webkit-transform:translateZ(-90px) rotateX(65deg);transform:translateZ(-90px) rotateX(65deg)' },

  /* The one edit that is not a no-op: upstream wrote these as Firefox-only.
     Adding the standard property applies preserve-3d in Chrome and Edge too,
     during slide overview. Verified to render correctly in overview before
     this shipped. */
  { what: 'transform-style on .reveal.overview .slides / .backgrounds',
    find: '-moz-transform-style:preserve-3d', count: 2,
    repl: '-moz-transform-style:preserve-3d;transform-style:preserve-3d' },

  { what: 'print-color-adjust on html.print-pdf *',
    find: '-webkit-print-color-adjust:exact', count: 1,
    repl: '-webkit-print-color-adjust:exact;print-color-adjust:exact' },

  /* A box whose float is not "none" is always laid out as block, so this
     display:inline-block was already ignored. No other rule un-floats this
     anchor; its .icon child keeps its own inline-block. */
  { what: 'ignored display:inline-block on floated .reveal>.overlay header a',
    find: 'display:inline-block;width:40px;height:40px;line-height:36px;padding:0 10px;float:right', count: 1,
    repl: 'width:40px;height:40px;line-height:36px;padding:0 10px;float:right' }
];

let css = fs.readFileSync(0, 'utf8');

for (const f of FIXES) {
  const n = css.split(f.find).length - 1;
  if (n !== f.count) {
    process.stderr.write('patch-reveal-css: "' + f.what + '" matched ' + n +
                         'x, expected ' + f.count + ' — has Reveal.js changed?\n');
    process.exit(1);
  }
  // split/join rewrites every occurrence at once, so a replacement that still
  // contains its own anchor can never be matched a second time.
  css = css.split(f.find).join(f.repl);
}

// Byte-preserving: nothing else changes, including the single LF ending, so the
// stylesheet stays on line 223.
process.stdout.write(css);
