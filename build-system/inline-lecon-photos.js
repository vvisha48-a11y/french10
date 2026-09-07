// Embed the 85 vocabulary photos into the built deck as data: URIs, so the
// shipped file makes ZERO network requests and check-offline.js stays green.
//
//   node inline-lecon-photos.js            # build step: download-if-needed, then rewrite
//   node inline-lecon-photos.js --refresh  # re-download everything
//   node inline-lecon-photos.js --width 512
//
// Downloads are cached under build-system/vendor/lecon-img/, so repeat builds
// need no network at all -- the same contract as inline-assets.js.
//
// Wikimedia serves ONLY the cached 1280px thumbnail for these files (800/640/320
// return HTTP 400: a new size must be generated on demand and it refuses), so we
// fetch 1280px and downscale locally via resize-lecon-photos.ps1.
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const SRC_JSON = 'C:/10th lessons/build/images.json';
const OUT      = 'C:/claude/10 th/master-grammar-app.html';
const VENDOR   = path.join(__dirname, 'vendor', 'lecon-img');
const ORIG     = path.join(VENDOR, 'orig');
const REFRESH  = process.argv.includes('--refresh');

const wArg = process.argv.indexOf('--width');
const WIDTH = wArg > -1 ? Number(process.argv[wArg + 1]) : 640;
const QUALITY = 80;

/* Each output must stay well under GitHub's 50 MB warning. If the embedded total
   would push past this, the width steps down and everything is re-encoded. */
const CEILING_MB = 24;
/* This step runs BEFORE inline-photos.js and inline-assets.js, so the file it
   measures is not yet the finished one. Those two add the deck's own 27 photos
   (~9.2 MB), the woff2 faces (~0.23 MB) and gsap+lucide (~0.39 MB). Counting
   that here is what makes the ceiling mean the SHIPPED size rather than an
   intermediate one. build.sh prints the true final figure either way. */
const DOWNSTREAM_MB = 9.9;
const LADDER = [WIDTH, 512, 448, 384];

/* Wikimedia rate-limits hard (measured: HTTP 429 on 7 of 10 probes), so requests
   are spaced out, identify themselves honestly, and back off on 429. */
const UA = 'CBSE-French-Class/1.0 (educational classroom deck; contact vvisha48@gmail.com)';
const GAP_MS = 1200;
const sleep = ms => new Promise(r => setTimeout(r, ms));

fs.mkdirSync(ORIG, { recursive: true });

const IMG = JSON.parse(fs.readFileSync(SRC_JSON, 'utf8'));
const keys = Object.keys(IMG);

function get(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'image/jpeg,image/*,*/*' }, timeout: 45000 }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 4) {
        res.resume();
        return resolve(get(new URL(res.headers.location, url).href, redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve({ status: res.statusCode, buf: null });
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({ status: 200, buf: Buffer.concat(chunks) }));
    }).on('error', reject).on('timeout', function () { this.destroy(new Error('timeout')); });
  });
}

async function download() {
  let fetched = 0, cached = 0;
  const failed = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const file = path.join(ORIG, k + '.jpg');
    if (!REFRESH && fs.existsSync(file) && fs.statSync(file).size > 1024) { cached++; continue; }

    let ok = false;
    for (let attempt = 0; attempt < 4 && !ok; attempt++) {
      if (attempt) await sleep(4000 * attempt);          // back off on 429
      let r;
      try { r = await get(IMG[k].url); }
      catch (e) { r = { status: 'ERR ' + e.message, buf: null }; }
      if (r.status === 200 && r.buf && r.buf.length > 1024) {
        fs.writeFileSync(file, r.buf);
        fetched++; ok = true;
        process.stdout.write('\r  downloading: ' + (cached + fetched) + '/' + keys.length + '   ');
      } else if (attempt === 3) {
        failed.push(k + ' (' + r.status + ')');
      }
    }
    await sleep(GAP_MS);
  }
  process.stdout.write('\r');
  return { fetched, cached, failed };
}

function resize(width) {
  const dest = path.join(VENDOR, 'w' + width);
  const out = execFileSync('powershell', [
    '-NoProfile', '-ExecutionPolicy', 'Bypass',
    '-File', path.join(__dirname, 'resize-lecon-photos.ps1'),
    '-Src', ORIG, '-Dest', dest, '-Width', String(width), '-Quality', String(QUALITY)
  ], { encoding: 'utf8' });
  return { dest, report: out.trim().split('\n').pop().trim() };
}

function totalBase64(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.jpg'))
    .reduce((n, f) => n + Math.ceil(fs.statSync(path.join(dir, f)).size / 3) * 4, 0);
}

(async () => {
  console.log('  lecon photos     : ' + keys.length + ' referenced');

  const dl = await download();
  if (dl.failed.length) {
    console.error('  FAILED to download ' + dl.failed.length + ' image(s):');
    dl.failed.slice(0, 10).forEach(f => console.error('    ' + f));
    console.error('  Refusing to ship a deck with missing photos. Re-run to retry.');
    process.exit(1);
  }
  console.log('  downloaded       : ' + dl.fetched + ' new, ' + dl.cached + ' from cache');

  /* Choose the width by MEASURING, not estimating. Several photos appear on more
     than one slide (182 references from 85 keys), and every occurrence carries its
     own copy of the base64 -- so the cost is per reference, not per file. */
  const html0 = fs.readFileSync(OUT, 'utf8');
  const occ = {};
  keys.forEach(k => { occ[k] = html0.split(IMG[k].url).length - 1; });
  const refs = keys.reduce((n, k) => n + occ[k], 0);
  const used = keys.filter(k => occ[k]).length;
  console.log('  references      : ' + refs + ' across ' + used + ' distinct photos');

  const project = dir => keys.reduce((add, k) => {
    const f = path.join(dir, k + '.jpg');
    if (!occ[k] || !fs.existsSync(f)) return add;
    const b64 = Math.ceil(fs.statSync(f).size / 3) * 4 + 23;   // + the data: prefix
    return add + (b64 - IMG[k].url.length) * occ[k];
  }, 0);

  let chosen = null;
  for (const w of LADDER) {
    const r = resize(w);
    const total = (html0.length + project(r.dest)) / 1048576 + DOWNSTREAM_MB;
    console.log('  ' + r.report + '  -> file would be ' + total.toFixed(1) + ' MB');
    chosen = { w, dir: r.dest, total };
    if (total <= CEILING_MB) break;
  }
  if (chosen.total > CEILING_MB)
    console.log('  NOTE: still ' + chosen.total.toFixed(1) + ' MB at the smallest width in the ladder');
  /* Rewrite the built file. */
  let html = fs.readFileSync(OUT, 'utf8');
  const before = html.length;
  let swapped = 0, absent = [];
  keys.forEach(k => {
    const file = path.join(chosen.dir, k + '.jpg');
    if (!fs.existsSync(file)) { absent.push(k); return; }
    const uri = 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
    const url = IMG[k].url;
    if (html.indexOf(url) === -1) return;               // key not used on any slide
    html = html.split(url).join(uri);
    swapped++;
  });
  if (absent.length) {
    console.error('  missing resized file(s): ' + absent.slice(0, 8).join(', '));
    process.exit(1);
  }

  const left = (html.match(/upload\.wikimedia\.org/g) || []).length;
  if (left) {
    console.error('  ' + left + ' wikimedia reference(s) survived — the offline gate would fail');
    process.exit(1);
  }

  fs.writeFileSync(OUT, html);
  console.log('  embedded         : ' + swapped + ' photos at ' + chosen.w + 'px q' + QUALITY);
  console.log('  file             : ' + (before / 1048576).toFixed(2) + ' MB -> ' +
              (html.length / 1048576).toFixed(2) + ' MB');
})();
