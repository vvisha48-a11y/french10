// Draws build/icon.png: a 512px tricolour tile with an open book, the app's
// placeholder icon until a designed one replaces it (keep the same file name, PNG,
// at least 256x256). No dependencies: shapes are rasterised here with 4x4
// supersampling and written as a PNG with Node's zlib.
//
//   node scripts/make-icon.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const N = 512, SS = 4;
const NAVY = [0, 35, 149], WHITE = [255, 255, 255], RED = [237, 41, 57], GOLD = [201, 162, 39], PAGE = [248, 250, 252];

const inRound = (x, y, r) => {                      // rounded square, 6% inset
  const a = N * 0.06, b = N - a;
  if (x < a || x > b || y < a || y > b) return false;
  const cx = Math.min(Math.max(x, a + r), b - r), cy = Math.min(Math.max(y, a + r), b - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};
const inPoly = (x, y, pts) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++){
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const s = v => v * N / 200;                          // design on a 200-unit grid
const P = pts => pts.map(([x, y]) => [s(x), s(y)]);
const leftCover = P([[40, 70], [98, 84], [98, 150], [40, 136]]);
const rightCover = P([[160, 70], [102, 84], [102, 150], [160, 136]]);
const leftPage = P([[46, 66], [98, 80], [98, 144], [46, 130]]);
const rightPage = P([[154, 66], [102, 80], [102, 144], [154, 130]]);
const lines = [];
for (let k = 0; k < 4; k++){
  const y = 84 + k * 13;
  lines.push(P([[56, y], [90, y + 9], [90, y + 12], [56, y + 3]]));
  lines.push(P([[144, y], [110, y + 9], [110, y + 12], [144, y + 3]]));
}

function colourAt(x, y){
  if (!inRound(x, y, N * 0.18)) return null;
  const inCircle = (x - N / 2) ** 2 + (y - N * 0.53) ** 2 <= (N * 0.36) ** 2;
  if (inCircle){
    if (lines.some(l => inPoly(x, y, l))) return GOLD;
    if (inPoly(x, y, leftPage) || inPoly(x, y, rightPage)) return PAGE;
    if (inPoly(x, y, leftCover)) return NAVY;
    if (inPoly(x, y, rightCover)) return RED;
    return WHITE;
  }
  return x < N / 3 ? NAVY : x < 2 * N / 3 ? WHITE : RED;
}

const raw = Buffer.alloc((N * 4 + 1) * N);
for (let y = 0; y < N; y++){
  raw[y * (N * 4 + 1)] = 0;
  for (let x = 0; x < N; x++){
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++){
      const c = colourAt(x + (sx + 0.5) / SS, y + (sy + 0.5) / SS);
      if (c){ r += c[0]; g += c[1]; b += c[2]; a++; }
    }
    const o = y * (N * 4 + 1) + 1 + x * 4;
    if (a){ raw[o] = Math.round(r / a); raw[o + 1] = Math.round(g / a); raw[o + 2] = Math.round(b / a); }
    raw[o + 3] = Math.round(255 * a / (SS * SS));
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = buf => { let c = 0xFFFFFFFF; for (const b of buf) c = crcTable[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);

const out = path.join(__dirname, '..', 'build', 'icon.png');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log('icon: ' + path.relative(process.cwd(), out) + ' (' + N + 'x' + N + ', ' + Math.round(png.length / 1024) + ' KB)');
