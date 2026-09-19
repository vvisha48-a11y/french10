// Move the photos out of the built deck into docs/images/, and let Reveal load
// each one only when its slide comes near.
//
//   node externalize-images.js        (build.sh runs it after inline-assets.js)
//
// The deck is online-only. Embedded, its 213 photos were 19.4 MB of base64 --
// 79% of a 24.7 MB file that every phone had to download and hold in memory
// before the first slide could show. Here each <img src="data:image/...;base64,...">
// becomes <img data-src="images/<name>">: Reveal's own lazy loading swaps data-src
// for src when a slide's stack comes within viewDistance (verified in the vendored
// 4.6 bundle: load() handles img[data-src]; unload() never reverts images).
//
// It runs on the ASSEMBLED file, after every embedding step, so it catches every
// photo source in one place; the embedding steps keep their downscaling and caches.
//
//   * One file per DISTINCT image. The name is a content hash, so a photo embedded
//     several times becomes one file, an unchanged photo keeps its name across
//     builds (quiet git diffs, warm browser caches), and the output is deterministic.
//   * width and height are read from the image bytes and written onto the tag, so
//     the browser reserves the photo's box before it arrives -- nothing jumps as it
//     loads. They are the intrinsic size, so a loaded photo renders exactly as it
//     did when embedded. A tag that already declares them keeps its own.
//   * loading="lazy" is dropped from every rewritten tag. Reveal's view distance is
//     the lazy mechanism now; left in place, "lazy" would make the browser hold back
//     photos on the hidden vertical slides of a stack Reveal has already reached, so
//     they would only start downloading when a student arrives instead of being ready.
//   * Only <img src="data:..."> is touched. CSS url(data:...) -- Reveal's own tiny
//     overlay icons -- stays inline.
//
// externalize() is pure and exported: check-papers.js applies the same transform
// to the Question Papers markup before its byte-for-byte drift comparison.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUT = 'C:/claude/10 th/master-grammar-app.html';
const IMG_DIR = 'C:/claude/10 th/docs/images';
const URL_DIR = 'images';
const EXT = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const OURS = /^[0-9a-f]{12}\.(jpg|png|webp|gif)$/;   // only files this step created are ever removed

/* ---------------- intrinsic size, straight from the bytes ---------------- */
function exifOrientation(b, t, end){
  if (t + 8 > end) return 1;
  const tag = b.toString('latin1', t, t + 2);
  if (tag !== 'II' && tag !== 'MM') return 1;
  const le = tag === 'II';
  const r16 = o => (le ? b.readUInt16LE(o) : b.readUInt16BE(o));
  const r32 = o => (le ? b.readUInt32LE(o) : b.readUInt32BE(o));
  const ifd = t + r32(t + 4);
  if (ifd + 2 > end) return 1;
  const n = r16(ifd);
  for (let k = 0; k < n; k++){
    const e = ifd + 2 + k * 12;
    if (e + 12 > end) break;
    if (r16(e) === 0x0112) return r16(e + 8);
  }
  return 1;
}
function jpegSize(b){
  if (b[0] !== 0xFF || b[1] !== 0xD8) return null;
  let i = 2, orient = 1;
  while (i + 4 <= b.length){
    if (b[i] !== 0xFF){ i++; continue; }
    const m = b[i + 1];
    if (m === 0xFF){ i++; continue; }                                   // fill byte
    if (m === 0x01 || (m >= 0xD0 && m <= 0xD8)){ i += 2; continue; }    // markers with no length
    if (m === 0xD9 || m === 0xDA) break;                                // end of image / start of scan
    const len = b.readUInt16BE(i + 2);
    if (m === 0xE1 && b.toString('latin1', i + 4, i + 10) === 'Exif\0\0')
      orient = exifOrientation(b, i + 10, Math.min(b.length, i + 2 + len)) || 1;
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC){
      const h = b.readUInt16BE(i + 5), w = b.readUInt16BE(i + 7);
      /* EXIF orientations 5-8 turn the photo a quarter: the browser shows it with
         width and height swapped, and the reserved box has to match what it shows */
      return orient >= 5 && orient <= 8 ? { w: h, h: w } : { w, h };
    }
    i += 2 + len;
  }
  return null;
}
function webpSize(b){
  if (b.toString('latin1', 0, 4) !== 'RIFF' || b.toString('latin1', 8, 12) !== 'WEBP') return null;
  const c = b.toString('latin1', 12, 16);
  if (c === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (c === 'VP8L'){
    const b0 = b[21], b1 = b[22], b2 = b[23], b3 = b[24];
    return { w: 1 + (((b1 & 0x3F) << 8) | b0), h: 1 + (((b3 & 0x0F) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6)) };
  }
  if (c === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  return null;
}
function pngSize(b){
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504E47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
function gifSize(b){
  if (b.toString('latin1', 0, 3) !== 'GIF') return null;
  return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
}
function dimensions(buf, mime){
  if (mime === 'image/jpeg' || mime === 'image/jpg') return jpegSize(buf);
  if (mime === 'image/webp') return webpSize(buf);
  if (mime === 'image/png') return pngSize(buf);
  if (mime === 'image/gif') return gifSize(buf);
  return null;
}

/* ---------------- the transform ---------------- */
const IMG_RE = /<img\b([^>]*?)\ssrc="data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+\/=]+)"([^>]*)>/g;

function externalize(html){
  const files = new Map();                // name -> bytes
  let photos = 0, sized = 0, kept = 0;
  const unsized = [];
  const out = html.replace(IMG_RE, (tag, before, mime, b64, after) => {
    const ext = EXT[mime];
    if (!ext) return tag;                   // a type we cannot name: leave it embedded
    const buf = Buffer.from(b64, 'base64');
    const name = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12) + '.' + ext;
    files.set(name, buf);
    photos++;
    const noLazy = s => s.replace(/\sloading="lazy"/g, '');
    before = noLazy(before); after = noLazy(after);
    const attrs = before + after;
    let size = '';
    if (/\swidth=/.test(attrs) || /\sheight=/.test(attrs)) kept++;
    else {
      const d = dimensions(buf, mime);
      if (d && d.w > 0 && d.h > 0){ size = ' width="' + d.w + '" height="' + d.h + '"'; sized++; }
      else unsized.push(name);
    }
    return '<img' + before + ' data-src="' + URL_DIR + '/' + name + '"' + size + after + '>';
  });
  return { html: out, files, photos, sized, kept, unsized };
}

module.exports = { externalize, dimensions };

/* ---------------- build step ---------------- */
if (require.main === module){
  const before = fs.readFileSync(OUT, 'utf8');
  const r = externalize(before);

  if (r.unsized.length){
    console.error('externalize-images: could not read the size of ' + r.unsized.length +
                  ' photo(s), which would jump as they load: ' + r.unsized.slice(0, 5).join(', '));
    process.exit(1);
  }
  const left = (r.html.match(/<img\b[^>]*\ssrc="data:image\//g) || []).length;
  if (left){
    console.error('externalize-images: ' + left + ' <img> still embedded after the rewrite');
    process.exit(1);
  }

  fs.mkdirSync(IMG_DIR, { recursive: true });
  let written = 0, bytes = 0;
  for (const [name, buf] of r.files){
    bytes += buf.length;
    const p = path.join(IMG_DIR, name);
    if (!fs.existsSync(p)){ fs.writeFileSync(p, buf); written++; }
  }
  /* Remove only this step's own earlier output that nothing references any more.
     The set comes from the REWRITTEN html, so a second run over an already
     externalized file keeps every image rather than emptying the folder. */
  const referenced = new Set([...r.html.matchAll(/\s(?:data-)?src="images\/([^"]+)"/g)].map(m => m[1]));
  let removed = 0;
  for (const f of fs.readdirSync(IMG_DIR)){
    if (OURS.test(f) && !referenced.has(f)){ fs.unlinkSync(path.join(IMG_DIR, f)); removed++; }
  }

  fs.writeFileSync(OUT, r.html);
  const mb = n => (n / 1048576).toFixed(2) + ' MB';
  console.log('  photos external  : ' + r.photos + ' tags -> ' + r.files.size + ' files in docs/images (' +
              mb(bytes) + '), ' + written + ' new, ' + removed + ' stale removed');
  console.log('  sizes reserved   : ' + r.sized + ' read from the bytes, ' + r.kept + ' already declared');
  console.log('  deck             : ' + mb(Buffer.byteLength(before)) + ' -> ' + mb(Buffer.byteLength(r.html)));
}
