// Gate for the external photos. Run after build.sh.
//
// The deck is online-only: photos live in docs/images/ and Reveal lazy-loads each
// one as its slide comes near (see externalize-images.js). This gate holds that
// contract in both built files:
//   * no photo is embedded as base64 any more -- that is what made the file 25 MB;
//   * every images/ reference exists on disk, and nothing on disk is orphaned;
//   * every photo is data-src, so Reveal owns its loading, not a plain eager src;
//   * every photo declares width and height, so nothing jumps as it arrives;
//   * nothing is hot-linked from another host;
//   * the deck stays under 8 MB, so photos cannot quietly creep back in;
//   * Reveal's own tiny overlay icons are still inline CSS, as intended.
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/claude/10 th';
const IMG = path.join(ROOT, 'docs/images');
const CEILING_MB = 8;
const problems = [], notes = [];

const onDisk = fs.existsSync(IMG) ? fs.readdirSync(IMG).filter(f => !f.startsWith('.')) : [];
if (!onDisk.length) problems.push('[images] docs/images/ is missing or empty');
const disk = new Set(onDisk);
const used = new Set();

['docs/index.html', 'docs/app.html'].forEach(rel => {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)){ problems.push('[' + rel + '] missing -- run build.sh first'); return; }
  const h = fs.readFileSync(file, 'utf8');
  const tags = [...h.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);

  const embedded = tags.filter(t => /\ssrc="data:image\//.test(t)).length;
  if (embedded) problems.push('[' + rel + '] ' + embedded + ' photo(s) still embedded as base64');

  const ext = tags.filter(t => /\s(?:data-)?src="images\//.test(t));
  let unsized = 0, eager = 0;
  ext.forEach(t => {
    const f = (t.match(/\s(?:data-)?src="images\/([^"]+)"/) || [])[1];
    used.add(f);
    if (!disk.has(f)) problems.push('[' + rel + '] references images/' + f + ', which does not exist');
    if (!/\swidth="\d+"/.test(t) || !/\sheight="\d+"/.test(t)) unsized++;
    if (/\ssrc="images\//.test(t)) eager++;
  });
  if (unsized) problems.push('[' + rel + '] ' + unsized + ' photo(s) lack width/height -- they would jump as they load');
  if (eager) problems.push('[' + rel + '] ' + eager + ' photo(s) use a plain src, so they load eagerly and bypass Reveal');

  const hot = tags.filter(t => /\ssrc="https?:\/\//.test(t) || /\sdata-src="https?:\/\//.test(t)).length;
  if (hot) problems.push('[' + rel + '] ' + hot + ' photo(s) hot-linked from another host');

  const icons = (h.match(/url\(["']?data:image\/png;base64,/g) || []).length;
  if (icons < 2) problems.push('[' + rel + '] Reveal\'s inline overlay icons are gone (' + icons + ' found)');

  const mb = fs.statSync(file).size / 1048576;
  if (mb > CEILING_MB) problems.push('[' + rel + '] is ' + mb.toFixed(2) + ' MB, over the ' + CEILING_MB + ' MB ceiling');
  notes.push(rel.padEnd(16) + ': ' + mb.toFixed(2) + ' MB, ' + ext.length + ' lazy photos, all sized: ' + (unsized === 0));
});

const orphans = onDisk.filter(f => !used.has(f));
if (orphans.length) problems.push('[images] ' + orphans.length + ' file(s) in docs/images are referenced by nothing: ' + orphans.slice(0, 5).join(', '));
const bytes = onDisk.reduce((n, f) => n + fs.statSync(path.join(IMG, f)).size, 0);
notes.push('docs/images     : ' + onDisk.length + ' files, ' + (bytes / 1048576).toFixed(2) + ' MB');

console.log('=== EXTERNAL PHOTOS GATE ===');
notes.forEach(n => console.log('  ' + n));
console.log('');
if (problems.length){
  console.log('  RESULT: FAIL');
  problems.forEach(p => console.log('   x ' + p));
  process.exit(1);
}
console.log('  RESULT: PASS -- every photo external, lazy, sized, present and referenced.');
