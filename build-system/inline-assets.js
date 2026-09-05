// Inline the last three external dependencies so the shipped file has ZERO
// network requests: Google Fonts (as base64 woff2 @font-face), GSAP and Lucide.
//
// Everything downloaded is cached under build-system/vendor/, so repeat builds
// work with no network at all. Pass --refresh to re-download.
//
// Run by build.sh after inline-photos.js.
const fs = require('fs');
const path = require('path');

const OUT = 'C:/claude/10 th/master-grammar-app.html';
const VENDOR = path.join(__dirname, 'vendor');
const FONTDIR = path.join(VENDOR, 'fonts');
const REFRESH = process.argv.includes('--refresh');

// A modern browser UA is REQUIRED: without it Google serves legacy .ttf instead of woff2.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const LIBS = [
  { file: 'gsap.min.js',   url: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js' },
  { file: 'lucide.min.js', url: 'https://unpkg.com/lucide@0.400.0/dist/umd/lucide.min.js' }
];

fs.mkdirSync(FONTDIR, { recursive: true });

async function grab(url, dest, binary) {
  if (!REFRESH && fs.existsSync(dest)) return fs.readFileSync(dest, binary ? null : 'utf8');
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
  if (binary) {
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return buf;
  }
  const txt = await res.text();
  fs.writeFileSync(dest, txt, 'utf8');
  return txt;
}

async function main() {
  let html = fs.readFileSync(OUT, 'utf8');

  // ---------- 1. fonts ----------
  const linkRe = /<link href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)" rel="stylesheet">/;
  const linkMatch = html.match(linkRe);
  if (!linkMatch) throw new Error('Google Fonts <link> not found in output');

  const cssUrl = linkMatch[1].replace(/&amp;/g, '&');
  let css = await grab(cssUrl, path.join(VENDOR, 'fonts.css'), false);

  // Keep only the latin subset: unicode-range containing U+0000-00FF.
  // That covers every French accent (é è ê à ç ù î ô û ï) plus all English.
  const blocks = css.split('@font-face').slice(1);
  const keep = [];
  for (const b of blocks) {
    const body = b.slice(0, b.indexOf('}') + 1);
    if (!/unicode-range:[^;]*U\+0000-00FF/.test(body)) continue;
    keep.push('@font-face' + body);
  }

  const urlRe = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
  const wanted = new Set();
  keep.forEach(b => { let m; while ((m = urlRe.exec(b)) !== null) wanted.add(m[1]); });

  const dataFor = new Map();
  let fontBytes = 0;
  for (const u of wanted) {
    const name = u.split('/').pop().replace(/[^A-Za-z0-9._-]/g, '_');
    const buf = await grab(u, path.join(FONTDIR, name), true);
    fontBytes += buf.length;
    dataFor.set(u, 'data:font/woff2;base64,' + buf.toString('base64'));
  }

  const inlinedCss = keep
    .map(b => b.replace(urlRe, (full, u) => 'url(' + (dataFor.get(u) || u) + ')'))
    .join('\n');

  html = html.replace(linkRe, '<style>\n/* Google Fonts, latin subset, embedded as base64 woff2 — no network needed */\n' + inlinedCss + '\n</style>');
  console.log('  fonts inlined    :', dataFor.size, 'woff2 files,', keep.length, '@font-face rules,', Math.round(fontBytes / 1024) + ' KB raw');

  // ---------- 2. GSAP + Lucide ----------
  for (const lib of LIBS) {
    const src = await grab(lib.url, path.join(VENDOR, lib.file), false);
    // Replace the whole async <script src=...> tag (incl. its onload handler) with inline source.
    const tagRe = new RegExp('<script async src="' + lib.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[\\s\\S]*?<\\/script>');
    if (!tagRe.test(html)) throw new Error('script tag not found for ' + lib.file);
    // The library source is injected verbatim; guard against a stray </script> inside it.
    const safe = src.replace(/<\/script/gi, '<\\/script');
    html = html.replace(tagRe, '<script>/* ' + lib.file + ' — inlined */\n' + safe + '\n</script>');
    console.log('  lib inlined      :', lib.file, Math.round(src.length / 1024) + ' KB');
  }

  fs.writeFileSync(OUT, html);
}

main().catch(e => { console.error('  INLINE-ASSETS FAILED:', e.message); process.exit(1); });
