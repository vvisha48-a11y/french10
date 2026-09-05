/**
 * LOUVRE 3D ARCHITECTURAL MODELS GENERATOR
 * Builds authentic, detailed 3D architectural reconstructions of the actual Louvre
 * as it evolved from Philippe Auguste's 1190 medieval fortress to I.M. Pei's 1989 glass pyramid.
 */

const LouvreArchitecturalModels = {
  // Shared materials using procedural textures
  getMaterials() {
    const stoneTex = LouvreTextures.getParisStone();
    stoneTex.repeat.set(4, 4);

    const slateTex = LouvreTextures.getSlateRoof();
    slateTex.repeat.set(3, 3);

    const cobbleTex = LouvreTextures.getCobblestone();
    cobbleTex.repeat.set(6, 6);

    const waterTex = LouvreTextures.getWaterRipple();
    waterTex.repeat.set(2, 2);

    const pyramidTex = LouvreTextures.getPyramidGlassLattice();
    pyramidTex.repeat.set(4, 4);

    return {
      stone: new THREE.MeshStandardMaterial({
        map: stoneTex,
        roughness: 0.85,
        metalness: 0.1,
        bumpScale: 0.05
      }),
      darkStone: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.9,
        metalness: 0.1
      }),
      slateRoof: new THREE.MeshStandardMaterial({
        map: slateTex,
        roughness: 0.45,
        metalness: 0.2
      }),
      gildedRoof: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.2
      }),
      cobblestone: new THREE.MeshStandardMaterial({
        map: cobbleTex,
        roughness: 0.9
      }),
      water: new THREE.MeshStandardMaterial({
        map: waterTex,
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.8
      }),
      glassPyramid: new THREE.MeshPhysicalMaterial({
        map: pyramidTex,
        color: 0xe0f2fe,
        transmission: 0.9,
        transparent: true,
        opacity: 0.95,
        roughness: 0.08,
        ior: 1.52,
        reflectivity: 0.9
      }),
      pyramidWire: new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true
      }),
      timber: new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.8
      })
    };
  },

  // =========================================================================
  // 1. 1190 AD: THE MEDIEVAL FORTRESS (Philippe Auguste)
  // =========================================================================
  createMedievalFortress(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // 1. Cobblestone Island & Moat Platform
    const islandGeo = new THREE.BoxGeometry(16, 1.2, 16);
    const island = new THREE.Mesh(islandGeo, mats.cobblestone);
    island.position.y = 0.6;
    group.add(island);

    // Dry Moat Excavation (recessed border)
    const moatOuterGeo = new THREE.BoxGeometry(20, 0.4, 20);
    const moatOuter = new THREE.Mesh(moatOuterGeo, mats.darkStone);
    moatOuter.position.y = 0.2;
    group.add(moatOuter);

    // 2. The Grosse Tour (Massive 30m Central Cylindrical Keep / Donjon)
    const keepGeo = new THREE.CylinderGeometry(2.4, 2.6, 6.5, 24);
    const keep = new THREE.Mesh(keepGeo, mats.stone);
    keep.position.set(0, 4.4, 0);
    group.add(keep);

    // Keep Conical Slate Roof
    const keepRoofGeo = new THREE.ConeGeometry(2.8, 3.2, 24);
    const keepRoof = new THREE.Mesh(keepRoofGeo, mats.slateRoof);
    keepRoof.position.set(0, 9.2, 0);
    group.add(keepRoof);

    // Keep Crenellation Ring (battlements)
    const crenelGeo = new THREE.CylinderGeometry(2.65, 2.65, 0.6, 24);
    const crenel = new THREE.Mesh(crenelGeo, mats.stone);
    crenel.position.set(0, 7.8, 0);
    group.add(crenel);

    // 3. Square Curtain Walls (78m x 72m fortified enclosure)
    const wallThickness = 0.9;
    const wallHeight = 3.5;
    const wallLength = 11.5;

    const wallPositions = [
      { x: 0, z: -5.75, rx: 0, ry: 0 },
      { x: 0, z: 5.75, rx: 0, ry: 0 },
      { x: -5.75, z: 0, rx: 0, ry: Math.PI / 2 },
      { x: 5.75, z: 0, rx: 0, ry: Math.PI / 2 }
    ];

    wallPositions.forEach(wp => {
      const wallGeo = new THREE.BoxGeometry(wallLength, wallHeight, wallThickness);
      const wall = new THREE.Mesh(wallGeo, mats.stone);
      wall.position.set(wp.x, 1.2 + wallHeight / 2, wp.z);
      wall.rotation.y = wp.ry;
      group.add(wall);
    });

    // 4. 10 Defensive Towers (4 corners + intermediate curtain towers)
    const towerCoords = [
      // 4 Corner Towers
      { x: -5.75, z: -5.75 }, { x: 5.75, z: -5.75 },
      { x: -5.75, z: 5.75 },  { x: 5.75, z: 5.75 },
      // Flanking Wall Towers
      { x: 0, z: -5.75 }, { x: -5.75, z: 0 }, { x: 5.75, z: 0 },
      // Gatehouse Twin Towers (South entrance facing the Seine)
      { x: -1.2, z: 5.75 }, { x: 1.2, z: 5.75 }
    ];

    towerCoords.forEach(tc => {
      const towGeo = new THREE.CylinderGeometry(0.9, 1.0, 4.8, 16);
      const tow = new THREE.Mesh(towGeo, mats.stone);
      tow.position.set(tc.x, 1.2 + 2.4, tc.z);
      group.add(tow);

      const towRoofGeo = new THREE.ConeGeometry(1.1, 2.0, 16);
      const towRoof = new THREE.Mesh(towRoofGeo, mats.slateRoof);
      towRoof.position.set(tc.x, 1.2 + 4.8 + 1.0, tc.z);
      group.add(towRoof);
    });

    // 5. Timber Drawbridge over the Moat
    const bridgeGeo = new THREE.BoxGeometry(1.8, 0.25, 4.2);
    const bridge = new THREE.Mesh(bridgeGeo, mats.timber);
    bridge.position.set(0, 1.1, 7.8);
    group.add(bridge);

    group.scale.set(scale, scale, scale);
    return group;
  },

  // =========================================================================
  // 2. 1364 AD: THE GOTHIC ROYAL PALACE (Charles V)
  // =========================================================================
  createGothicPalace(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // Re-use medieval base layout
    const base = this.createMedievalFortress(1);
    group.add(base);

    // Add Gothic High-Pitched Roofs & Royal Apartments
    const wingGeo = new THREE.BoxGeometry(9.5, 3.2, 2.8);
    const northWing = new THREE.Mesh(wingGeo, mats.stone);
    northWing.position.set(0, 4.0, -3.8);
    group.add(northWing);

    // High Steep Gothic Slate Roof with Lucarne Dormer Windows
    const roofGeo = new THREE.ConeGeometry(5.2, 3.4, 4);
    roofGeo.rotateY(Math.PI / 4);
    const gothicRoof = new THREE.Mesh(roofGeo, mats.slateRoof);
    gothicRoof.position.set(0, 7.2, -3.8);
    gothicRoof.scale.set(1.8, 1, 0.6);
    group.add(gothicRoof);

    // Falconry Library Tower (Tour de la Fauconnerie - 900+ manuscripts)
    const libGeo = new THREE.CylinderGeometry(1.2, 1.3, 7.2, 16);
    const libTower = new THREE.Mesh(libGeo, mats.stone);
    libTower.position.set(4.8, 5.0, -4.8);
    group.add(libTower);

    // Ornate Gothic Spire
    const spireGeo = new THREE.ConeGeometry(1.4, 4.5, 16);
    const spire = new THREE.Mesh(spireGeo, mats.slateRoof);
    spire.position.set(4.8, 10.6, -4.8);
    group.add(spire);

    // Sculpted Royal Chimneys & Gold Finials
    for (let c of [-2.5, 2.5]) {
      const chimGeo = new THREE.BoxGeometry(0.6, 2.2, 0.6);
      const chim = new THREE.Mesh(chimGeo, mats.stone);
      chim.position.set(c, 8.2, -3.8);
      group.add(chim);

      const finialGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const finial = new THREE.Mesh(finialGeo, mats.gildedRoof);
      finial.position.set(c, 9.4, -3.8);
      group.add(finial);
    }

    group.scale.set(scale, scale, scale);
    return group;
  },

  // =========================================================================
  // 3. 1546 AD: THE RENAISSANCE REBIRTH (Francis I & Pierre Lescot)
  // =========================================================================
  createRenaissancePalace(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // Cobblestone Courtyard (Keep is gone!)
    const courtGeo = new THREE.BoxGeometry(18, 0.8, 18);
    const court = new THREE.Mesh(courtGeo, mats.cobblestone);
    court.position.y = 0.4;
    group.add(court);

    // Pierre Lescot Wing (West facade of Cour Carrée)
    const wingW = 14;
    const wingH = 5.2;
    const wingD = 3.2;

    const wingGeo = new THREE.BoxGeometry(wingW, wingH, wingD);
    const lescotWing = new THREE.Mesh(wingGeo, mats.stone);
    lescotWing.position.set(-6.5, 3.4, 0);
    group.add(lescotWing);

    // Classical French Renaissance Mansard Roof
    const roofGeo = new THREE.BoxGeometry(wingW + 0.6, 2.6, wingD + 0.6);
    const roof = new THREE.Mesh(roofGeo, mats.slateRoof);
    roof.position.set(-6.5, 7.2, 0);
    roof.scale.set(1, 1, 0.8);
    group.add(roof);

    // Pediment & Caryatids Central Pavilion
    const pavGeo = new THREE.BoxGeometry(4.2, 6.2, 3.8);
    const pav = new THREE.Mesh(pavGeo, mats.stone);
    pav.position.set(-6.5, 3.8, 0);
    group.add(pav);

    // Sculptured Triangular Pediment
    const pedGeo = new THREE.ConeGeometry(2.4, 1.8, 3);
    pedGeo.rotateY(Math.PI / 2);
    const ped = new THREE.Mesh(pedGeo, mats.stone);
    ped.position.set(-6.5, 7.8, 0.8);
    group.add(ped);

    // Classical Pilasters row
    for (let p = -5.5; p <= 5.5; p += 1.8) {
      const pilGeo = new THREE.BoxGeometry(0.3, 5.0, 0.2);
      const pil = new THREE.Mesh(pilGeo, mats.stone);
      pil.position.set(-6.5 + 1.8, 3.3, p);
      group.add(pil);
    }

    group.scale.set(scale, scale, scale);
    return group;
  },

  // =========================================================================
  // 4. 1600 AD: THE GRAND GALLERY OF HENRY IV (Le Grand Dessein)
  // =========================================================================
  createGrandGallery(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // Add Renaissance core palace
    const palaceCore = this.createRenaissancePalace(1);
    group.add(palaceCore);

    // The Colossal 450m Grande Galerie stretching along the Seine
    const galleryLength = 24;
    const galleryH = 3.6;
    const galleryW = 2.4;

    const galGeo = new THREE.BoxGeometry(galleryW, galleryH, galleryLength);
    const gallery = new THREE.Mesh(galGeo, mats.stone);
    gallery.position.set(-6.5, 2.6, 12);
    group.add(gallery);

    // Long French Slate Mansard Roof with Dormer Windows
    const galRoofGeo = new THREE.BoxGeometry(galleryW + 0.4, 1.8, galleryLength + 0.4);
    const galRoof = new THREE.Mesh(galRoofGeo, mats.slateRoof);
    galRoof.position.set(-6.5, 5.2, 12);
    group.add(galRoof);

    // Rhythm of Pavilions along the gallery
    for (let z of [4, 12, 20]) {
      const pavGeo = new THREE.BoxGeometry(3.0, 4.6, 3.0);
      const pav = new THREE.Mesh(pavGeo, mats.stone);
      pav.position.set(-6.5, 3.1, z);
      group.add(pav);

      const pavRoof = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.2, 4), mats.slateRoof);
      pavRoof.position.set(-6.5, 6.5, z);
      pavRoof.rotation.y = Math.PI / 4;
      group.add(pavRoof);
    }

    // River Seine Embankment & Reflecting Water
    const riverGeo = new THREE.BoxGeometry(10, 0.4, 34);
    const river = new THREE.Mesh(riverGeo, mats.water);
    river.position.set(-14, 0.2, 12);
    group.add(river);

    const quayGeo = new THREE.BoxGeometry(2.5, 0.8, 34);
    const quay = new THREE.Mesh(quayGeo, mats.darkStone);
    quay.position.set(-8.8, 0.4, 12);
    group.add(quay);

    group.scale.set(scale, scale, scale);
    return group;
  },

  // =========================================================================
  // 5. 1682 AD: THE SUN KING & PERRAULT COLONNADE (Louis XIV)
  // =========================================================================
  createSunKingColonnade(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // 1. Fully Quadrupled Enclosed Cour Carrée (Square Courtyard)
    const sideLen = 20;
    const wingH = 5.6;
    const wingD = 3.0;

    // 4 Wings of Cour Carrée
    const wings = [
      { x: 0, z: -8.5, w: sideLen, d: wingD, ry: 0 },        // North
      { x: 0, z: 8.5, w: sideLen, d: wingD, ry: 0 },         // South
      { x: -8.5, z: 0, w: wingD, d: sideLen - 6, ry: 0 },    // West (Lescot)
      { x: 8.5, z: 0, w: wingD, d: sideLen - 6, ry: 0 }      // East (Colonnade)
    ];

    wings.forEach(w => {
      const wg = new THREE.Mesh(new THREE.BoxGeometry(w.w, wingH, w.d), mats.stone);
      wg.position.set(w.x, wingH / 2 + 0.4, w.z);
      group.add(wg);

      // Mansard Slate Roof
      const rg = new THREE.Mesh(new THREE.BoxGeometry(w.w + 0.3, 2.2, w.d + 0.3), mats.slateRoof);
      rg.position.set(w.x, wingH + 1.5, w.z);
      group.add(rg);
    });

    // 2. Claude Perrault's Monumental East Colonnade (52 Paired Columns)
    const colonnadeGroup = new THREE.Group();
    for (let c = -7; c <= 7; c += 1.4) {
      for (let pair of [-0.25, 0.25]) {
        const colGeo = new THREE.CylinderGeometry(0.18, 0.2, 4.4, 12);
        const col = new THREE.Mesh(colGeo, mats.stone);
        col.position.set(10.2, 3.4, c + pair);
        colonnadeGroup.add(col);
      }
    }
    group.add(colonnadeGroup);

    // Flat Classical Neoclassical Balustrade on Colonnade
    const balustrade = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 16), mats.stone);
    balustrade.position.set(10.2, 6.0, 0);
    group.add(balustrade);

    // Inner Courtyard Pavement
    const courtPave = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 14), mats.cobblestone);
    courtPave.position.set(0, 0.2, 0);
    group.add(courtPave);

    group.scale.set(scale, scale, scale);
    return group;
  },

  // =========================================================================
  // 6. 1793 AD: THE PEOPLE'S MUSEUM (French Revolution)
  // =========================================================================
  createRevolutionaryMuseum(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // Base: Cour Carrée + Grand Gallery
    const base = this.createSunKingColonnade(0.85);
    group.add(base);

    const galGeo = new THREE.BoxGeometry(2.4, 3.2, 22);
    const gal = new THREE.Mesh(galGeo, mats.stone);
    gal.position.set(-8.5, 2.0, 10);
    group.add(gal);

    // Roof Skylights along the Grand Gallery (Revolutionary Innovation!)
    for (let s = 1; s <= 19; s += 3.5) {
      const skylight = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.4, 2.2),
        mats.glassPyramid
      );
      skylight.position.set(-8.5, 3.8, s);
      group.add(skylight);
    }

    // Revolutionary Tricolor Ribbons (Blue, White, Red) atop entrance
    const tricolorGroup = new THREE.Group();
    const cColors = [0x1d4ed8, 0xf8fafc, 0xb91c1c];
    cColors.forEach((col, idx) => {
      const banner = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 2.5, 0.1),
        new THREE.MeshBasicMaterial({ color: col })
      );
      banner.position.set(idx * 0.4 - 0.4, 7.5, 7.5);
      tricolorGroup.add(banner);
    });
    group.add(tricolorGroup);

    group.scale.set(scale, scale, scale);
    return group;
  },

  // =========================================================================
  // 7. 1857 AD: NAPOLEON III & THE GRAND LOUVRE
  // =========================================================================
  createNapoleonIIIComplex(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // 1. East Cour Carrée
    const courCarree = this.createSunKingColonnade(0.65);
    courCarree.position.set(14, 0, 0);
    group.add(courCarree);

    // 2. Vast Cour Napoléon (Massive Central Courtyard)
    const courNapGeo = new THREE.BoxGeometry(22, 0.4, 18);
    const courNap = new THREE.Mesh(courNapGeo, mats.cobblestone);
    courNap.position.set(0, 0.2, 0);
    group.add(courNap);

    // 3. North Wing: Richelieu Wing
    const richGeo = new THREE.BoxGeometry(22, 4.8, 3.2);
    const richWing = new THREE.Mesh(richGeo, mats.stone);
    richWing.position.set(0, 2.8, -9);
    group.add(richWing);

    const richRoof = new THREE.Mesh(new THREE.BoxGeometry(22.4, 2.2, 3.6), mats.slateRoof);
    richRoof.position.set(0, 6.2, -9);
    group.add(richRoof);

    // 4. South Wing: Denon Wing
    const denonGeo = new THREE.BoxGeometry(22, 4.8, 3.2);
    const denonWing = new THREE.Mesh(denonGeo, mats.stone);
    denonWing.position.set(0, 2.8, 9);
    group.add(denonWing);

    const denonRoof = new THREE.Mesh(new THREE.BoxGeometry(22.4, 2.2, 3.6), mats.slateRoof);
    denonRoof.position.set(0, 6.2, 9);
    group.add(denonRoof);

    // 5. Ornate Second Empire Mansard Pavilions (Lefuel & Visconti)
    const pavilions = [
      { x: -10, z: -9, name: "Richelieu West" },
      { x: 0, z: -9, name: "Pavillon Colbert" },
      { x: -10, z: 9, name: "Denon West" },
      { x: 0, z: 9, name: "Pavillon Mollien" },
      { x: 5, z: 0, name: "Pavillon de l'Horloge / Sully" }
    ];

    pavilions.forEach(p => {
      const pavGeo = new THREE.BoxGeometry(3.8, 6.2, 4.2);
      const pav = new THREE.Mesh(pavGeo, mats.stone);
      pav.position.set(p.x, 3.5, p.z);
      group.add(pav);

      // High French Mansard Roof with Gilded Ridge
      const roofGeo = new THREE.ConeGeometry(2.8, 3.2, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, mats.slateRoof);
      roof.position.set(p.x, 8.2, p.z);
      group.add(roof);

      const ridge = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 0.3), mats.gildedRoof);
      ridge.position.set(p.x, 9.8, p.z);
      group.add(ridge);
    });

    group.scale.set(scale, scale, scale);
    return group;
  },

  // =========================================================================
  // 8. 1989 – PRESENT: THE MODERN GLASS PYRAMID & GRAND LOUVRE (I.M. Pei)
  // =========================================================================
  createModernPyramidLouvre(scale = 1) {
    const mats = this.getMaterials();
    const group = new THREE.Group();

    // 1. Napoleon III Palace Complex Base
    const palace = this.createNapoleonIIIComplex(1);
    group.add(palace);

    // 2. I.M. Pei's Central 21.6-Meter Glass Pyramid
    const pyrHeight = 5.2;
    const pyrBase = 7.8;

    const pyramidGeo = new THREE.ConeGeometry(pyrBase / Math.sqrt(2), pyrHeight, 4, 1, false);
    pyramidGeo.rotateY(Math.PI / 4);

    const pyramid = new THREE.Mesh(pyramidGeo, mats.glassPyramid);
    pyramid.position.set(0, pyrHeight / 2 + 0.3, 0);
    group.add(pyramid);

    // Diamond Cable Wireframe Cage
    const wireGeo = new THREE.ConeGeometry(pyrBase / Math.sqrt(2) + 0.05, pyrHeight + 0.05, 4, 1, false);
    wireGeo.rotateY(Math.PI / 4);
    const wire = new THREE.Mesh(wireGeo, mats.pyramidWire);
    wire.position.set(0, pyrHeight / 2 + 0.3, 0);
    group.add(wire);

    // Glowing Subterranean Concourse (Internal Core Light)
    const lobbyLight = new THREE.PointLight(0xfef08a, 1.8, 15);
    lobbyLight.position.set(0, 1.2, 0);
    group.add(lobbyLight);

    // 3. Three Mini Glass Pyramids
    const miniPositions = [
      { x: -5.5, z: 0 },
      { x: 3.8, z: -3.8 },
      { x: 3.8, z: 3.8 }
    ];

    miniPositions.forEach(mp => {
      const miniGeo = new THREE.ConeGeometry(1.2, 1.2, 4);
      miniGeo.rotateY(Math.PI / 4);
      const mini = new THREE.Mesh(miniGeo, mats.glassPyramid);
      mini.position.set(mp.x, 0.9, mp.z);
      group.add(mini);
    });

    // 4. Seven Reflecting Water Pools with aquatic ripples
    const poolCoords = [
      { x: 0, z: -5.2, w: 6.5, d: 2.2 },
      { x: 0, z: 5.2, w: 6.5, d: 2.2 },
      { x: -4.8, z: -3.8, w: 2.8, d: 2.8 },
      { x: -4.8, z: 3.8, w: 2.8, d: 2.8 }
    ];

    poolCoords.forEach(pc => {
      const poolGeo = new THREE.BoxGeometry(pc.w, 0.15, pc.d);
      const pool = new THREE.Mesh(poolGeo, mats.water);
      pool.position.set(pc.x, 0.42, pc.z);
      group.add(pool);

      // Stone border around pool
      const borderGeo = new THREE.BoxGeometry(pc.w + 0.3, 0.2, pc.d + 0.3);
      const border = new THREE.Mesh(borderGeo, mats.stone);
      border.position.set(pc.x, 0.38, pc.z);
      group.add(border);
    });

    group.scale.set(scale, scale, scale);
    return group;
  },

  // Factory function to get model by era ID
  getModelForEra(eraId, scale = 1) {
    switch (eraId) {
      case 'era-1190': return this.createMedievalFortress(scale);
      case 'era-1364': return this.createGothicPalace(scale);
      case 'era-1546': return this.createRenaissancePalace(scale);
      case 'era-1600': return this.createGrandGallery(scale);
      case 'era-1682': return this.createSunKingColonnade(scale);
      case 'era-1793': return this.createRevolutionaryMuseum(scale);
      case 'era-1857': return this.createNapoleonIIIComplex(scale);
      case 'era-1989': return this.createModernPyramidLouvre(scale);
      default: return this.createModernPyramidLouvre(scale);
    }
  }
};
