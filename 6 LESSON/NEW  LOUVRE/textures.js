/**
 * LOUVRE PROCEDURAL ARCHITECTURAL TEXTURES ENGINE
 * Generates realistic Paris limestone (pierre de liais), slate roof tiles,
 * cobblestone courtyard paving, glass pyramid lattices, and water ripples
 * directly on HTML5 Canvases for 100% reliable, zero-network PBR materials.
 */

const LouvreTextures = {
  // Cache generated textures
  cache: {},

  // 1. Parisian Ashlar Limestone (Pierre de Liais)
  getParisStone() {
    if (this.cache.stone) return this.cache.stone;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base warm limestone tone
    ctx.fillStyle = '#dfd3be';
    ctx.fillRect(0, 0, 512, 512);

    // Stone surface noise & grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 24;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.9)); // G
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7)); // B
    }
    ctx.putImageData(imgData, 0, 0);

    // Ashlar block joints (horizontal & vertical stone seams)
    ctx.strokeStyle = 'rgba(105, 95, 80, 0.45)';
    ctx.lineWidth = 2;

    const blockHeight = 32;
    const blockWidth = 64;

    for (let y = 0; y < 512; y += blockHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      const offset = (y / blockHeight) % 2 === 0 ? 0 : blockWidth / 2;
      for (let x = offset; x < 512; x += blockWidth) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + blockHeight);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.stone = texture;
    return texture;
  },

  // 2. Weathered Parisian Slate Roof Tiles (Ardoise de Paris)
  getSlateRoof() {
    if (this.cache.slate) return this.cache.slate;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep blue-grey slate color
    ctx.fillStyle = '#343a46';
    ctx.fillRect(0, 0, 512, 512);

    const tileH = 24;
    const tileW = 16;

    for (let y = 0; y < 512; y += tileH) {
      const isShifted = (y / tileH) % 2 !== 0;
      const startX = isShifted ? -tileW / 2 : 0;

      for (let x = startX; x < 512 + tileW; x += tileW) {
        const shade = Math.floor(Math.random() * 20) - 10;
        ctx.fillStyle = `rgb(${52 + shade}, ${58 + shade}, ${70 + shade})`;
        ctx.fillRect(x + 1, y + 1, tileW - 2, tileH - 2);

        // Tile bevel / shadow
        ctx.strokeStyle = '#20242c';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileW, tileH);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.slate = texture;
    return texture;
  },

  // 3. Paris Cobblestone / Courtyard Pavement
  getCobblestone() {
    if (this.cache.cobble) return this.cache.cobble;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, 512, 512);

    // Stone pavers
    const step = 20;
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const val = 120 + Math.floor(Math.random() * 40);
        ctx.fillStyle = `rgb(${val}, ${val - 5}, ${val - 12})`;
        ctx.fillRect(x + 1, y + 1, step - 2, step - 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.cobble = texture;
    return texture;
  },

  // 4. Seine River / Water Pool Specular Texture
  getWaterRipple() {
    if (this.cache.water) return this.cache.water;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.5, '#0369a1');
    grad.addColorStop(1, '#075985');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 256,
        Math.random() * 256,
        10 + Math.random() * 60,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.water = texture;
    return texture;
  },

  // 5. Glass Pyramid Structural Lattice
  getPyramidGlassLattice() {
    if (this.cache.pyramidLattice) return this.cache.pyramidLattice;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(224, 242, 254, 0.15)';
    ctx.fillRect(0, 0, 256, 256);

    // Diamond grid lines (representing Pei's steel cables)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 3;

    const step = 32;
    for (let d = -256; d < 512; d += step) {
      ctx.beginPath();
      ctx.moveTo(d, 0);
      ctx.lineTo(d + 256, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(d, 256);
      ctx.lineTo(d + 256, 0);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.pyramidLattice = texture;
    return texture;
  }
};
