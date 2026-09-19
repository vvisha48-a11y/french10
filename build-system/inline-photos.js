// Inline @@PHOTO:<id>@@ tokens in the assembled app as base64 data URIs.
// Keeps the u-*.html source parts small and human-editable while the shipped
// photos come only from local files, never an external image host.
// (externalize-images.js later moves every embedded photo out to docs/images/.)
// Run by build.sh after assembly.
const fs = require('fs');
const path = require('path');

const OUT = 'C:/claude/10 th/master-grammar-app.html';
const PHOTOS = path.join(__dirname, 'photos');

let html = fs.readFileSync(OUT, 'utf8');
const token = /@@PHOTO:([A-Za-z0-9_-]+)@@/g;

// Extension -> MIME. Resolved in this order, so the original .jpg library keeps
// working untouched while newer art-directed photos can ship as .webp/.png.
const EXTS = [['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.png', 'image/png'], ['.webp', 'image/webp']];

const seen = new Set();
const missing = [];
let inlined = 0;
let added = 0;

html = html.replace(token, (full, id) => {
  const hit = EXTS.map(([ext, mime]) => [path.join(PHOTOS, id + ext), mime])
                  .find(([file]) => fs.existsSync(file));
  if (!hit) { missing.push(id); return full; }
  const [file, mime] = hit;
  const b64 = fs.readFileSync(file).toString('base64');
  inlined++;
  added += b64.length;
  seen.add(id);
  return 'data:' + mime + ';base64,' + b64;
});

fs.writeFileSync(OUT, html);

console.log('  photos inlined   :', inlined, '(' + seen.size + ' unique)');
console.log('  base64 added     :', Math.round(added / 1024) + ' KB');
if (missing.length) {
  console.error('  MISSING PHOTOS   :', [...new Set(missing)].join(', '));
  process.exit(1);
}

// Hot-link guard: no photo may point at another host. The single-offline-file
// rule is gone (the deck is online-only), but the photos are still ours to serve.
const ext = html.match(/<img[^>]+src="https?:\/\/[^"]*"/g);
if (ext) {
  console.error('  HOT-LINKED IMG   :', ext.length, '->', ext.slice(0, 3).join(' | '));
  process.exit(1);
}
console.log('  hot-link guard   : ok (no photo points at another host)');
