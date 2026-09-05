// Regenerates engine-extract.js -- the engine's JavaScript with its <script> wrapper
// removed -- so that check-refs.js and check-lab.js can parse it as JavaScript.
//
// This is a derived scratch file, not a source file. It had gone missing, which made
// both of those gates crash on startup rather than report a failure, so the harness
// was quietly two gates short. Regenerate it before running them:
//
//   node gen-engine-extract.js && node check-refs.js && node check-lab.js
const fs = require('fs');
const src = fs.readFileSync('e-engine.html', 'utf8');

const a = src.indexOf('<script>');
if (a === -1){ console.error('no <script> opener in e-engine.html'); process.exit(1); }
const b = src.indexOf('</script>', a);
if (b === -1){ console.error('no </script> closer in e-engine.html'); process.exit(1); }

const js = src.slice(a + '<script>'.length, b);
fs.writeFileSync('engine-extract.js', js);
console.log('  engine-extract.js :', js.length, 'bytes,', js.split('\n').length, 'lines');
