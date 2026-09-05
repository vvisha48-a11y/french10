/**
 * LOUVRE COSMIC & REALISTIC ARCHITECTURAL ENGINE (1190 - PRESENT)
 * Seamlessly integrates:
 * 1. Realistic 3D Architectural Diorama Models across 8 eras (No more abstract spheres!)
 * 2. Cosmic Orrery Navigation with orbital tracks
 * 3. Full-Scale Realistic Palace Inspector with Time-Morphing
 * 4. Realistic Lighting: Daylight, Golden Sunset, and Nocturnal Night
 */

// Global State
let scene, camera, renderer, controls;
let starField, dustField;
let centralSunGroup, sunPyramidMesh, sunLightBeam;
let eraArchitecturalModels = [];
let orbitLines = [];
let activeEraIndex = 0;
let isOrbitPlaying = true;
let orbitSpeedMultiplier = 1.0;
let isTourActive = false;
let tourTimer = null;
let raycaster, mouse;
let hoveredEraModel = null;
let currentCameraTween = null;

// Realistic Palace Inspector State
let isPalaceInspectorMode = false;
let palaceInspectorGroup = null;
let currentInspectorEraModel = null;
let dirSunLight, ambientLight, hemisphereLight;

// Quiz State
let quizCurrentIndex = 0;
let quizScore = 0;
let quizAnswered = false;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initThree();
  buildCosmicEnvironment();
  buildCentralPyramidSun();
  buildRealisticPlanetaryEras();
  buildPalaceInspectorScene();
  setupEventListeners();
  buildTimelineNodes();
  animate();

  // Welcome camera glide to 1190
  setTimeout(() => {
    glideCameraToEra(0, true);
  }, 700);
});

/* ==========================================================================
   1. THREE.JS INITIALIZATION & REALISTIC LIGHTING
   ========================================================================== */
function initThree() {
  const container = document.getElementById('webgl-container');
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030611, 0.0022);

  // Camera
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
  camera.position.set(0, 85, 190);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxDistance = 450;
  controls.minDistance = 6;
  controls.maxPolarAngle = Math.PI / 2 + 0.05;

  // Raycaster & Mouse
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Realistic Architectural Lighting
  ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  hemisphereLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 0.45);
  scene.add(hemisphereLight);

  dirSunLight = new THREE.DirectionalLight(0xfffbeb, 1.6);
  dirSunLight.position.set(80, 140, 70);
  dirSunLight.castShadow = true;
  dirSunLight.shadow.mapSize.width = 2048;
  dirSunLight.shadow.mapSize.height = 2048;
  dirSunLight.shadow.bias = -0.0005;
  scene.add(dirSunLight);

  // Secondary fill light for architectural shadow relief
  const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
  fillLight.position.set(-80, 60, -80);
  scene.add(fillLight);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

/* ==========================================================================
   2. COSMIC ENVIRONMENT (STARFIELD & DUST)
   ========================================================================== */
function buildCosmicEnvironment() {
  const starCount = 3000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colorPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xfde68a),
    new THREE.Color(0x38bdf8),
    new THREE.Color(0xc084fc)
  ];

  for (let i = 0; i < starCount; i++) {
    const radius = 350 + Math.random() * 600;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = (radius * Math.sin(phi) * Math.sin(theta)) * 0.65;
    starPositions[i * 3 + 2] = radius * Math.cos(phi);

    const starColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    starColors[i * 3] = starColor.r;
    starColors[i * 3 + 1] = starColor.g;
    starColors[i * 3 + 2] = starColor.b;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 2.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  });

  starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);

  // Cosmic Dust Ring
  const dustCount = 800;
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(dustCount * 3);

  for (let i = 0; i < dustCount; i++) {
    const r = 25 + Math.random() * 155;
    const angle = Math.random() * Math.PI * 2;
    dustPositions[i * 3] = Math.cos(angle) * r;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    dustPositions[i * 3 + 2] = Math.sin(angle) * r;
  }

  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({
    size: 1.5,
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });

  dustField = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dustField);
}

/* ==========================================================================
   3. THE CENTRAL SUN: "LE LOUVRE ÉTERNEL" (3D GLASS PYRAMID CORE)
   ========================================================================== */
function buildCentralPyramidSun() {
  centralSunGroup = new THREE.Group();
  centralSunGroup.position.set(0, 0, 0);

  // Radiant Golden Core
  const coreGeo = new THREE.SphereGeometry(3.6, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.6,
    roughness: 0.2
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  centralSunGroup.add(coreMesh);

  // Translucent 4-sided Pyramid
  const pyramidGeo = new THREE.ConeGeometry(7.5, 7.2, 4, 1, false);
  pyramidGeo.rotateY(Math.PI / 4);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xbae6fd,
    transmission: 0.9,
    opacity: 0.95,
    transparent: true,
    roughness: 0.08,
    ior: 1.52,
    reflectivity: 0.9
  });

  sunPyramidMesh = new THREE.Mesh(pyramidGeo, glassMat);
  sunPyramidMesh.position.y = 2.0;
  centralSunGroup.add(sunPyramidMesh);

  // Wireframe Cage
  const wireGeo = new THREE.ConeGeometry(7.55, 7.25, 4, 1, false);
  wireGeo.rotateY(Math.PI / 4);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  wireMesh.position.y = 2.0;
  centralSunGroup.add(wireMesh);

  // Vertical Cosmic Light Beam
  const beamGeo = new THREE.CylinderGeometry(0.3, 4.0, 70, 16, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  sunLightBeam = new THREE.Mesh(beamGeo, beamMat);
  sunLightBeam.position.y = 35;
  centralSunGroup.add(sunLightBeam);

  // Cour Napoléon Octagonal Base Platform
  const baseGeo = new THREE.CylinderGeometry(11, 12, 1.2, 8);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -1.6;
  centralSunGroup.add(baseMesh);

  scene.add(centralSunGroup);
}

/* ==========================================================================
   4. REALISTIC ARCHITECTURAL MODELS ON ORBITAL TRACKS (No simple spheres!)
   ========================================================================== */
function buildRealisticPlanetaryEras() {
  LOUVRE_ERAS.forEach((era, idx) => {
    // 1. Orbital Ring Track
    const orbitCurve = new THREE.EllipseCurve(0, 0, era.orbitRadius, era.orbitRadius, 0, 2 * Math.PI, false, 0);
    const points = orbitCurve.getPoints(128);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, 0, p.y))
    );
    const orbitMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(era.glowColor),
      transparent: true,
      opacity: 0.4
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    scene.add(orbitLine);
    orbitLines.push(orbitLine);

    // 2. Diorama Island Container (Orbits in space)
    const islandGroup = new THREE.Group();
    const initialAngle = (idx / LOUVRE_ERAS.length) * Math.PI * 2;
    islandGroup.position.set(
      Math.cos(initialAngle) * era.orbitRadius,
      0,
      Math.sin(initialAngle) * era.orbitRadius
    );

    // 3. REALISTIC 3D ARCHITECTURAL MODEL OF THE ACTUAL LOUVRE FOR THIS ERA
    // (Scale 0.38 to fit gracefully on orbital track)
    const realisticArchModel = LouvreArchitecturalModels.getModelForEra(era.id, 0.38);
    realisticArchModel.position.y = 0.5;
    islandGroup.add(realisticArchModel);

    // 4. Floating Celestial Aura Disc under the realistic architectural island
    const discGeo = new THREE.CylinderGeometry(5.2, 5.8, 0.4, 32);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.3,
      emissive: new THREE.Color(era.color),
      emissiveIntensity: 0.25
    });
    const islandDisc = new THREE.Mesh(discGeo, discMat);
    islandDisc.position.y = 0.1;
    islandGroup.add(islandDisc);

    // Outer Glow Ring for hover highlights
    const glowRingGeo = new THREE.RingGeometry(6.0, 6.6, 32);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(era.glowColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0.2;
    islandGroup.add(glowRing);

    // 5. Orbiting Masterpiece Moon / Relic Satellite
    const moonGroup = new THREE.Group();
    const moonGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(7.5, 1.2, 0);
    moonGroup.add(moonMesh);
    islandGroup.add(moonGroup);

    // Invisible Hit Cylinder for clean, easy mouse raycasting clicks
    const hitGeo = new THREE.CylinderGeometry(7.0, 7.0, 5.0, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.position.y = 2.0;
    islandGroup.add(hitMesh);

    // Attach metadata to hitMesh
    hitMesh.userData = {
      eraIndex: idx,
      eraData: era,
      islandGroup: islandGroup,
      archModel: realisticArchModel,
      glowRing: glowRing,
      moonGroup: moonGroup,
      angle: initialAngle,
      orbitRadius: era.orbitRadius,
      orbitSpeed: era.orbitSpeed
    };

    scene.add(islandGroup);
    eraArchitecturalModels.push(hitMesh);
  });
}

/* ==========================================================================
   5. REALISTIC PALACE INSPECTOR SCENE (Ground View with Time-Morphing)
   ========================================================================== */
function buildPalaceInspectorScene() {
  palaceInspectorGroup = new THREE.Group();
  palaceInspectorGroup.position.set(0, 0, 0);
  palaceInspectorGroup.visible = false;

  // Paris Ground / Courtyard Plane
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.MeshStandardMaterial({
    map: LouvreTextures.getCobblestone(),
    roughness: 0.85,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  palaceInspectorGroup.add(ground);

  // River Seine Embankment in background
  const riverGeo = new THREE.BoxGeometry(32, 0.6, 160);
  const riverMat = new THREE.MeshStandardMaterial({
    map: LouvreTextures.getWaterRipple(),
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8
  });
  const river = new THREE.Mesh(riverGeo, riverMat);
  river.position.set(-42, -0.2, 0);
  palaceInspectorGroup.add(river);

  scene.add(palaceInspectorGroup);
}

/**
 * Updates the Full-Scale Realistic Louvre Model when in Palace Inspector Mode
 */
function updatePalaceInspectorEra(index) {
  if (currentInspectorEraModel) {
    palaceInspectorGroup.remove(currentInspectorEraModel);
  }

  const era = LOUVRE_ERAS[index];
  // Build full-scale 1:1 realistic model
  currentInspectorEraModel = LouvreArchitecturalModels.getModelForEra(era.id, 1.6);
  currentInspectorEraModel.position.set(0, 0, 0);

  // Shadow casting on all children
  currentInspectorEraModel.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  palaceInspectorGroup.add(currentInspectorEraModel);
}

/* ==========================================================================
   6. NAVIGATION & CAMERA CONTROLS
   ========================================================================== */
function buildTimelineNodes() {
  const track = document.getElementById('era-selector-track');
  track.innerHTML = '';

  LOUVRE_ERAS.forEach((era, idx) => {
    const btn = document.createElement('button');
    btn.className = `era-node-btn ${idx === 0 ? 'active' : ''}`;
    btn.id = `node-${era.id}`;
    btn.innerHTML = `
      <span class="node-year">${era.year}</span>
      <span class="node-title">${era.title}</span>
    `;
    btn.addEventListener('click', () => {
      cosmicAudio.playChime(500 + idx * 70);
      glideCameraToEra(idx);
    });
    track.appendChild(btn);
  });
}

function setupEventListeners() {
  const container = document.getElementById('webgl-container');

  container.addEventListener('mousemove', onMouseMove, false);
  container.addEventListener('click', onMouseClick, false);

  // Inspection Deck
  document.getElementById('deck-close-btn').addEventListener('click', closeInspectionDeck);
  document.getElementById('deck-prev-btn').addEventListener('click', () => {
    let nextIdx = activeEraIndex - 1;
    if (nextIdx < 0) nextIdx = LOUVRE_ERAS.length - 1;
    glideCameraToEra(nextIdx);
  });
  document.getElementById('deck-next-btn').addEventListener('click', () => {
    let nextIdx = (activeEraIndex + 1) % LOUVRE_ERAS.length;
    glideCameraToEra(nextIdx);
  });

  // Header Tools
  document.getElementById('audio-toggle-btn').addEventListener('click', toggleAudio);
  document.getElementById('tour-mode-btn').addEventListener('click', toggleGuidedTour);
  document.getElementById('quiz-btn').addEventListener('click', openQuizModal);
  document.getElementById('masterpieces-btn').addEventListener('click', openMasterpiecesModal);
  document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);

  // Timeline Subcontrols
  document.getElementById('play-pause-orbit-btn').addEventListener('click', toggleOrbitPlayback);
  document.getElementById('orbit-speed-slider').addEventListener('input', (e) => {
    orbitSpeedMultiplier = parseFloat(e.target.value);
  });
  document.getElementById('reset-camera-btn').addEventListener('click', resetCameraOverview);

  // Mode Switchers
  document.getElementById('view-space-btn').addEventListener('click', () => {
    switchToCosmicOrreryMode();
  });
  document.getElementById('view-era-btn').addEventListener('click', () => {
    switchToPalaceInspectorMode();
  });

  // Time-of-day Lighting Switchers
  const lightDay = document.getElementById('light-day-btn');
  const lightSunset = document.getElementById('light-sunset-btn');
  const lightNight = document.getElementById('light-night-btn');

  if (lightDay) lightDay.addEventListener('click', () => setTimeOfDayLighting('day'));
  if (lightSunset) lightSunset.addEventListener('click', () => setTimeOfDayLighting('sunset'));
  if (lightNight) lightNight.addEventListener('click', () => setTimeOfDayLighting('night'));

  // Tour Controls
  document.getElementById('tour-pause-btn').addEventListener('click', stopGuidedTour);

  // Quiz Modal
  document.getElementById('quiz-close-btn').addEventListener('click', closeQuizModal);
  document.getElementById('quiz-next-btn').addEventListener('click', handleNextQuizQuestion);
  document.getElementById('quiz-restart-btn').addEventListener('click', restartQuiz);

  // Masterpieces Modal
  document.getElementById('masterpieces-close-btn').addEventListener('click', closeMasterpiecesModal);
}

function onMouseMove(event) {
  if (isPalaceInspectorMode) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(eraArchitecturalModels);

  const tooltip = document.getElementById('planet-tooltip');

  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    const eraData = hitMesh.userData.eraData;

    document.body.style.cursor = 'pointer';
    tooltip.style.display = 'block';
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
    tooltip.innerHTML = `
      <div class="tip-year">${eraData.year}</div>
      <div class="tip-title">${eraData.title}</div>
    `;

    if (hoveredEraModel !== hitMesh) {
      if (hoveredEraModel) hoveredEraModel.userData.glowRing.material.opacity = 0.35;
      hoveredEraModel = hitMesh;
      hoveredEraModel.userData.glowRing.material.opacity = 0.95;
    }
  } else {
    document.body.style.cursor = 'default';
    tooltip.style.display = 'none';
    if (hoveredEraModel) {
      hoveredEraModel.userData.glowRing.material.opacity = 0.35;
      hoveredEraModel = null;
    }
  }
}

function onMouseClick(event) {
  if (isPalaceInspectorMode) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(eraArchitecturalModels);

  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    glideCameraToEra(hitMesh.userData.eraIndex);
  }
}

/* ==========================================================================
   7. CINEMATIC CAMERA FLIGHT
   ========================================================================== */
function glideCameraToEra(index, isInitial = false) {
  activeEraIndex = index;
  const targetEra = LOUVRE_ERAS[index];

  if (!isInitial) {
    cosmicAudio.playWarp();
    cosmicAudio.playChime(600 + index * 60);
  }

  // Update Timeline Buttons
  document.querySelectorAll('.era-node-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  if (isPalaceInspectorMode) {
    // Morph the realistic full-scale palace model in place
    updatePalaceInspectorEra(index);
    openInspectionDeck(targetEra);
    return;
  }

  // In Cosmic Orrery Mode: Fly camera right up to the realistic 3D architectural island
  const targetMesh = eraArchitecturalModels[index];
  const islandGroup = targetMesh.userData.islandGroup;

  const islandWorldPos = new THREE.Vector3();
  islandGroup.getWorldPosition(islandWorldPos);

  const offset = new THREE.Vector3(12, 10, 16);
  const targetCamPos = islandWorldPos.clone().add(offset);

  if (currentCameraTween) TWEEN.remove(currentCameraTween);

  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const duration = isInitial ? 1800 : 1300;

  currentCameraTween = new TWEEN.Tween({ t: 0 })
    .to({ t: 1 }, duration)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate((obj) => {
      camera.position.lerpVectors(startPos, targetCamPos, obj.t);
      controls.target.lerpVectors(startTarget, islandWorldPos, obj.t);
      controls.update();
    })
    .onComplete(() => {
      controls.target.copy(islandWorldPos);
      openInspectionDeck(targetEra);
    })
    .start();
}

function resetCameraOverview() {
  cosmicAudio.playChime(440);
  closeInspectionDeck();

  if (isPalaceInspectorMode) {
    switchToCosmicOrreryMode();
    return;
  }

  const overviewPos = new THREE.Vector3(0, 100, 205);
  const origin = new THREE.Vector3(0, 0, 0);

  new TWEEN.Tween(camera.position)
    .to(overviewPos, 1400)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();

  new TWEEN.Tween(controls.target)
    .to(origin, 1400)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();
}

/* ==========================================================================
   8. MODE SWITCHING: COSMIC ORRERY vs REALISTIC PALACE INSPECTOR
   ========================================================================== */
function switchToCosmicOrreryMode() {
  isPalaceInspectorMode = false;
  document.getElementById('view-space-btn').classList.add('active');
  document.getElementById('view-era-btn').classList.remove('active');

  // Show cosmic elements
  if (centralSunGroup) centralSunGroup.visible = true;
  if (starField) starField.visible = true;
  if (dustField) dustField.visible = true;
  orbitLines.forEach(l => l.visible = true);
  eraArchitecturalModels.forEach(m => m.userData.islandGroup.visible = true);

  // Hide ground inspector
  if (palaceInspectorGroup) palaceInspectorGroup.visible = false;

  glideCameraToEra(activeEraIndex);
}

function switchToPalaceInspectorMode() {
  isPalaceInspectorMode = true;
  document.getElementById('view-space-btn').classList.remove('active');
  document.getElementById('view-era-btn').classList.add('active');

  // Hide cosmic orrery items
  if (centralSunGroup) centralSunGroup.visible = false;
  if (starField) starField.visible = false;
  if (dustField) dustField.visible = false;
  orbitLines.forEach(l => l.visible = false);
  eraArchitecturalModels.forEach(m => m.userData.islandGroup.visible = false);

  // Show full-scale realistic palace
  palaceInspectorGroup.visible = true;
  updatePalaceInspectorEra(activeEraIndex);

  // Fly camera to cinematic ground architectural angle
  const groundCamPos = new THREE.Vector3(30, 22, 38);
  const palaceCenter = new THREE.Vector3(0, 4, 0);

  new TWEEN.Tween(camera.position)
    .to(groundCamPos, 1200)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();

  new TWEEN.Tween(controls.target)
    .to(palaceCenter, 1200)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();

  openInspectionDeck(LOUVRE_ERAS[activeEraIndex]);
}

/* ==========================================================================
   9. REALISTIC LIGHTING MODES (Daylight, Sunset, Nocturnal)
   ========================================================================== */
function setTimeOfDayLighting(mode) {
  document.querySelectorAll('.light-pill').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`light-${mode}-btn`);
  if (activeBtn) activeBtn.classList.add('active');

  cosmicAudio.playChime(520);

  if (mode === 'day') {
    // Bright Parisian Sun
    dirSunLight.color.setHex(0xfffbeb);
    dirSunLight.intensity = 1.6;
    dirSunLight.position.set(80, 140, 70);
    ambientLight.color.setHex(0xffffff);
    ambientLight.intensity = 0.65;
    scene.fog.color.setHex(0x030611);
  } else if (mode === 'sunset') {
    // Golden Hour Warm Amber
    dirSunLight.color.setHex(0xf59e0b);
    dirSunLight.intensity = 2.2;
    dirSunLight.position.set(120, 40, 50);
    ambientLight.color.setHex(0xd97706);
    ambientLight.intensity = 0.45;
  } else if (mode === 'night') {
    // Nocturnal Spotlit Museum
    dirSunLight.color.setHex(0x38bdf8);
    dirSunLight.intensity = 0.5;
    ambientLight.color.setHex(0x0f172a);
    ambientLight.intensity = 0.3;
  }
}

/* ==========================================================================
   10. ERA INSPECTION DECK CONTENT
   ========================================================================== */
function openInspectionDeck(era) {
  const deck = document.getElementById('era-inspection-deck');

  document.getElementById('deck-year-badge').textContent = era.year;
  document.getElementById('deck-exact-date').textContent = era.exactDate;
  document.getElementById('deck-title').textContent = era.title;
  document.getElementById('deck-subtitle').textContent = `${era.frenchTitle} • ${era.subtitle}`;

  document.getElementById('deck-ruler').textContent = era.ruler;
  document.getElementById('deck-architect').textContent = era.architect;
  document.getElementById('deck-role').textContent = era.role;
  document.getElementById('deck-style').textContent = era.architecture.style;

  document.getElementById('deck-arch-desc').textContent = era.architecture.description;

  const bulletContainer = document.getElementById('deck-history-bullets');
  bulletContainer.innerHTML = '';
  era.historyPoints.forEach(point => {
    const b = document.createElement('div');
    b.className = 'story-bullet';
    b.innerHTML = `
      <div class="story-bullet-dot"></div>
      <div>${point}</div>
    `;
    bulletContainer.appendChild(b);
  });

  document.getElementById('deck-funfact-text').textContent = era.funFact;

  document.getElementById('deck-relic-name').textContent = era.masterpiece.name;
  document.getElementById('deck-relic-category').textContent = era.masterpiece.category;
  document.getElementById('deck-relic-desc').textContent = era.masterpiece.desc;

  deck.classList.add('open');
}

function closeInspectionDeck() {
  document.getElementById('era-inspection-deck').classList.remove('open');
}

/* ==========================================================================
   11. GUIDED TOUR MODE
   ========================================================================== */
function toggleGuidedTour() {
  if (isTourActive) {
    stopGuidedTour();
  } else {
    startGuidedTour();
  }
}

function startGuidedTour() {
  isTourActive = true;
  document.getElementById('tour-mode-btn').classList.add('active');
  document.getElementById('tour-banner').classList.add('active');
  cosmicAudio.playFanfare();

  let tourIndex = 0;
  glideCameraToEra(tourIndex);
  updateTourHUD(tourIndex);

  tourTimer = setInterval(() => {
    tourIndex = (tourIndex + 1) % LOUVRE_ERAS.length;
    glideCameraToEra(tourIndex);
    updateTourHUD(tourIndex);
  }, 9500);
}

function stopGuidedTour() {
  isTourActive = false;
  clearInterval(tourTimer);
  document.getElementById('tour-mode-btn').classList.remove('active');
  document.getElementById('tour-banner').classList.remove('active');
}

function updateTourHUD(idx) {
  document.getElementById('tour-era-label').textContent = `${LOUVRE_ERAS[idx].year}: ${LOUVRE_ERAS[idx].title}`;
}

/* ==========================================================================
   12. TIME TRAVELER QUIZ
   ========================================================================== */
function openQuizModal() {
  quizCurrentIndex = 0;
  quizScore = 0;
  cosmicAudio.playChime(660);
  document.getElementById('quiz-modal-backdrop').classList.add('open');
  document.getElementById('quiz-card-content').style.display = 'flex';
  document.getElementById('quiz-result-view').style.display = 'none';
  renderQuizQuestion();
}

function closeQuizModal() {
  document.getElementById('quiz-modal-backdrop').classList.remove('open');
}

function renderQuizQuestion() {
  quizAnswered = false;
  const qData = LOUVRE_QUIZ[quizCurrentIndex];

  document.getElementById('quiz-progress-text').textContent = `Question ${quizCurrentIndex + 1} of ${LOUVRE_QUIZ.length}`;
  document.getElementById('quiz-question-text').textContent = qData.question;

  const optionsContainer = document.getElementById('quiz-options-list');
  optionsContainer.innerHTML = '';

  const feedback = document.getElementById('quiz-feedback');
  feedback.style.display = 'none';

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.style.display = 'none';

  qData.options.forEach((optText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = optText;

    btn.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;

      const isCorrect = optIdx === qData.answer;
      if (isCorrect) {
        quizScore++;
        btn.classList.add('correct');
        cosmicAudio.playChime(880);
      } else {
        btn.classList.add('wrong');
        cosmicAudio.playChime(330);
        optionsContainer.children[qData.answer].classList.add('correct');
      }

      feedback.textContent = qData.explanation;
      feedback.style.display = 'block';
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = quizCurrentIndex < LOUVRE_QUIZ.length - 1 ? 'Next Question →' : 'See Cosmic Results ★';
    });

    optionsContainer.appendChild(btn);
  });
}

function handleNextQuizQuestion() {
  if (quizCurrentIndex < LOUVRE_QUIZ.length - 1) {
    quizCurrentIndex++;
    renderQuizQuestion();
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  document.getElementById('quiz-card-content').style.display = 'none';
  const resultView = document.getElementById('quiz-result-view');
  resultView.style.display = 'flex';

  document.getElementById('quiz-final-score').textContent = `${quizScore}/${LOUVRE_QUIZ.length}`;

  const verdict = document.getElementById('quiz-verdict');
  if (quizScore === 5) {
    verdict.textContent = "Grand Louvre Historian! You've mastered 800+ years of French history and architecture perfectly!";
  } else if (quizScore >= 3) {
    verdict.textContent = "Voyager Scholar! Great knowledge of the Louvre's grand architectural transformations!";
  } else {
    verdict.textContent = "Curious Traveler! Take the guided tour through the 8 eras to discover more secrets!";
  }

  if (window.confetti) {
    window.confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  }
  cosmicAudio.playFanfare();
}

function restartQuiz() {
  openQuizModal();
}

/* ==========================================================================
   13. MASTERPIECES GALLERY
   ========================================================================== */
function openMasterpiecesModal() {
  cosmicAudio.playChime(580);
  const container = document.getElementById('masterpieces-gallery-grid');
  container.innerHTML = '';

  LOUVRE_MASTERPIECES.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <h4>${item.name}</h4>
      <div class="gallery-artist">${item.artist}</div>
      <div style="font-size:0.75rem; color:var(--cyan-accent);">🏛️ ${item.room}</div>
      <div class="gallery-funfact">💡 ${item.funFact}</div>
    `;
    container.appendChild(card);
  });

  document.getElementById('masterpieces-modal-backdrop').classList.add('open');
}

function closeMasterpiecesModal() {
  document.getElementById('masterpieces-modal-backdrop').classList.remove('open');
}

/* ==========================================================================
   14. AUDIO & VIEW TOGGLES
   ========================================================================== */
function toggleAudio() {
  const isSoundOn = cosmicAudio.toggleMute();
  const btn = document.getElementById('audio-toggle-btn');
  btn.classList.toggle('active', isSoundOn);
  document.getElementById('audio-status-text').textContent = isSoundOn ? 'Sound: ON' : 'Sound: OFF';
}

function toggleOrbitPlayback() {
  isOrbitPlaying = !isOrbitPlaying;
  const btn = document.getElementById('play-pause-orbit-btn');
  btn.innerHTML = isOrbitPlaying ? '⏸' : '▶';
  btn.title = isOrbitPlaying ? 'Pause Orbits' : 'Resume Orbits';
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

/* ==========================================================================
   15. MAIN ANIMATION LOOP
   ========================================================================== */
function animate(time) {
  requestAnimationFrame(animate);

  TWEEN.update();

  if (!isPalaceInspectorMode) {
    // Starfield rotation
    if (starField) starField.rotation.y += 0.00012;
    if (dustField) dustField.rotation.y += 0.00025;

    // Central Sun pulse & spin
    if (sunPyramidMesh) {
      sunPyramidMesh.rotation.y += 0.003;
      const pulse = Math.sin(time * 0.002) * 0.12 + 1.0;
      sunPyramidMesh.scale.set(pulse, pulse, pulse);
    }
    if (sunLightBeam) {
      sunLightBeam.rotation.y -= 0.004;
    }

    // Planetary Dioramas Orbit & Masterpiece Moons
    eraArchitecturalModels.forEach((mesh) => {
      const data = mesh.userData;

      if (isOrbitPlaying) {
        data.angle += data.orbitSpeed * orbitSpeedMultiplier;
        data.islandGroup.position.x = Math.cos(data.angle) * data.orbitRadius;
        data.islandGroup.position.z = Math.sin(data.angle) * data.orbitRadius;
      }

      // Gentle floating diorama rotation so user sees all sides of architecture
      if (data.archModel) {
        data.archModel.rotation.y += 0.004;
      }

      // Orbiting Masterpiece Moon
      if (data.moonGroup) {
        data.moonGroup.rotation.y += 0.02;
      }
    });
  } else {
    // In Palace Inspector: slowly rotate palace model for panoramic presentation
    if (currentInspectorEraModel) {
      currentInspectorEraModel.rotation.y += 0.0012;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
