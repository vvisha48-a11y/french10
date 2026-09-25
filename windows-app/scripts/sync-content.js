// Build the desktop app's own copy of the website into windows-app/content/.
//
//   npm run sync        (also run by npm start / dist / release)
//
// READ-ONLY on the website: it reads docs/ and build-system/ and writes only inside
// windows-app/. Run `bash build.sh` at the repo root first when the lessons change.
//
//   content/app.html      docs/app.html + the offline-approval patch (scripts/offline-approval.js)
//   content/images/       docs/images/, with the 85 lesson photos swapped for their
//                         full-resolution originals under the SAME names
//   content/sdk/          the 3 Firebase SDK files the page imports, so it starts offline
//   content/manifest.json what was copied, for check-desktop.js
//
// Full resolution without moving anything: the web ships each lesson photo at 512px
// (build-system/vendor/lecon-img/w512/) under a name that is the hash of those bytes.
// The originals (orig/, up to 1280px) have the same file names and the same
// proportions. The tag keeps its width/height, so a slide lays out exactly as on the
// website -- the photo is simply 2.5x sharper when a projector or a high-DPI screen
// enlarges it.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { patch } = require('./offline-approval.js');

const APP_DIR = path.resolve(__dirname, '..');
const REPO = path.resolve(APP_DIR, '..');
const DOCS = path.join(REPO, 'docs');
const LECON = path.join(REPO, 'build-system', 'vendor', 'lecon-img');
const OUT = path.join(APP_DIR, 'content');
const CACHE = path.join(APP_DIR, '.cache', 'sdk');
const { dimensions } = require(path.join(REPO, 'build-system', 'externalize-images.js'));

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

function fail(msg){ console.error('sync-content: ' + msg); process.exit(1); }
const sha1 = buf => crypto.createHash('sha1').update(buf).digest('hex');
const mb = n => (n / 1048576).toFixed(1) + ' MB';

async function fetchSdk(version, names){
  const dir = path.join(CACHE, version);
  fs.mkdirSync(dir, { recursive: true });
  for (const name of names){
    const file = path.join(dir, name);
    if (fs.existsSync(file) && fs.statSync(file).size > 1000) continue;
    const url = 'https://www.gstatic.com/firebasejs/' + version + '/' + name;
    let res;
    for (let attempt = 1; ; attempt++){
      try { res = await fetch(url); break; }
      catch (e){ if (attempt === 3) fail('could not download ' + url + ' (' + e.message + '). The first sync needs the internet once.'); }
    }
    if (!res.ok) fail(url + ' answered ' + res.status);
    const text = await res.text();
    if (/^\s*</.test(text)) fail(url + ' returned HTML, not JavaScript');
    fs.writeFileSync(file, text);
    console.log('  downloaded        : ' + name + ' (' + Math.round(text.length / 1024) + ' KB)');
  }
  return dir;
}

(async () => {
  /* ---- the page ---- */
  const src = path.join(DOCS, 'app.html');
  if (!fs.existsSync(src)) fail('docs/app.html not found -- run bash build.sh at the repo root first');
  const html = fs.readFileSync(src, 'utf8');

  const sdkUrls = [...new Set([...html.matchAll(/https:\/\/www\.gstatic\.com\/firebasejs\/([\d.]+)\/([a-z-]+\.js)/g)].map(m => m[0]))];
  const versions = [...new Set(sdkUrls.map(u => u.split('/')[4]))];
  if (versions.length !== 1) fail('expected one Firebase SDK version in app.html, found: ' + versions.join(', '));
  const sdkNames = sdkUrls.map(u => u.split('/').pop()).sort();

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'images'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'sdk'), { recursive: true });

  fs.writeFileSync(path.join(OUT, 'app.html'), patch(html));

  /* ---- the photos ---- */
  let bytes = 0, files = 0;
  for (const f of fs.readdirSync(path.join(DOCS, 'images'))){
    const buf = fs.readFileSync(path.join(DOCS, 'images', f));
    fs.writeFileSync(path.join(OUT, 'images', f), buf);
    files++; bytes += buf.length;
  }
  const referenced = [...new Set([...html.matchAll(/\sdata-src="images\/([^"]+)"/g)].map(m => m[1]))];
  const missing = referenced.filter(f => !fs.existsSync(path.join(OUT, 'images', f)));
  if (missing.length) fail(missing.length + ' photo(s) referenced by app.html are not in docs/images: ' + missing.slice(0, 3).join(', '));

  let swapped = 0, notOnDeck = 0, origBytes = 0;
  const w512 = path.join(LECON, 'w512'), orig = path.join(LECON, 'orig');
  for (const f of fs.readdirSync(w512)){
    const mime = MIME[path.extname(f).toLowerCase()];
    if (!mime) continue;
    const small = fs.readFileSync(path.join(w512, f));
    const name = sha1(small).slice(0, 12) + '.' + EXT[mime];
    const target = path.join(OUT, 'images', name);
    if (!fs.existsSync(target)){ notOnDeck++; continue; }
    const origFile = path.join(orig, f);
    if (!fs.existsSync(origFile)) fail('no original for ' + f + ' in ' + orig);
    const big = fs.readFileSync(origFile);
    const a = dimensions(small, mime), b = dimensions(big, mime);
    if (!a || !b) fail('could not read the size of ' + f);
    /* same proportions or the reserved box would distort it: scaled to the small
       width, the original's height may differ by the 512px copy's rounding, no more */
    if (Math.abs(a.w * b.h / b.w - a.h) > 1) fail(f + ': original ' + b.w + 'x' + b.h + ' is not the same shape as ' + a.w + 'x' + a.h);
    fs.writeFileSync(target, big);
    swapped++; origBytes += big.length - small.length;
  }

  /* ---- the Firebase SDK ---- */
  const sdkDir = await fetchSdk(versions[0], sdkNames);
  for (const name of sdkNames) fs.copyFileSync(path.join(sdkDir, name), path.join(OUT, 'sdk', name));

  const manifest = {
    syncedAt: new Date().toISOString(),
    source: { file: 'docs/app.html', sha1: sha1(Buffer.from(html)), bytes: Buffer.byteLength(html) },
    sdk: { version: versions[0], files: sdkNames },
    images: { files, referenced: referenced.length, originals: swapped }
  };
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('  page              : docs/app.html (' + mb(Buffer.byteLength(html)) + ') + offline approval');
  console.log('  photos            : ' + files + ' files (' + mb(bytes + origBytes) + '), ' + swapped + ' lesson photos at full resolution' +
              (notOnDeck ? ', ' + notOnDeck + ' originals not used by the deck' : ''));
  console.log('  firebase sdk      : ' + versions[0] + ' -- ' + sdkNames.join(', '));
  console.log('  -> ' + path.relative(REPO, OUT));
})().catch(e => fail(e.stack || e.message));
