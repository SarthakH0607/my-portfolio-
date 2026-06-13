// ==========================================
// 1. Custom Spacecraft Cursor
// ==========================================
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

document.addEventListener('mousedown', () => {
  cursor.classList.add('hover');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('hover');
});

// Interactive elements hover state
const addCursorHoverListeners = () => {
  const interactives = document.querySelectorAll('a, button, input, textarea, .interactive');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
};

// ==========================================
// 2. Three.js Solar System Background
// ==========================================
const container = document.getElementById('space-canvas-container');
const scene = new THREE.Scene();

// Camera setup
let perspectiveCamera;
const initCamera = () => {
  perspectiveCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  perspectiveCamera.position.set(0, 20, 52); // Elevated diagonal viewpoint
};
initCamera();

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x0e0e1a, 1.8);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xfff0dd, 6.0, 300, 1.1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const spaceFillLight = new THREE.DirectionalLight(0x4a5568, 0.8);
spaceFillLight.position.set(10, 20, 10);
scene.add(spaceFillLight);

// System Group
const systemGroup = new THREE.Group();
systemGroup.rotation.x = 0.28; // Tilted perspective matching the reference photo
systemGroup.rotation.z = -0.05;
scene.add(systemGroup);

// Shared 3D Simplex Noise and fBm GLSL Library
const noiseGLSL = `
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
             
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
`;

// Helper to generate a detailed, layered canvas texture for the Sun without shader precision issues
const createSunTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Fill background with warm solar orange-red
  ctx.fillStyle = '#ff3c00';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw solar granulation pattern (fine-grained yellow spots)
  ctx.fillStyle = '#ff9900';
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2 + 1;
    ctx.fillRect(x, y, size, size);
  }

  ctx.fillStyle = '#ffcc00';
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.5 + 0.5;
    ctx.fillRect(x, y, size, size);
  }
  
  // Add large active solar storm regions (plages/solar flares)
  for (let i = 0; i < 16; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 60 + 20;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(255, 255, 200, 0.7)'); // Hot yellow center
    grad.addColorStop(0.3, 'rgba(255, 170, 0, 0.4)');
    grad.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  return new THREE.CanvasTexture(canvas);
};

// 1. The Glowing Sun Core (using procedural canvas texture for absolute GPU compatibility)
const sunGeo = new THREE.SphereGeometry(6.0, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({
  map: createSunTexture(),
  color: 0xffffff
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
systemGroup.add(sunMesh);

// Glowing sun inner rim (bright glowing plasma edge)
const rimGeo = new THREE.SphereGeometry(6.1, 64, 64);
const rimMat = new THREE.MeshBasicMaterial({
  color: 0xffa200,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const rimMesh = new THREE.Mesh(rimGeo, rimMat);
systemGroup.add(rimMesh);

// Glowing sun corona halo (tightly hugging red-orange halo)
const coronaGeo = new THREE.SphereGeometry(6.6, 64, 64);
const coronaShaderMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  vertexShader: `
    varying vec3 vPosition;
    varying vec2 vDist;
    void main() {
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 mvCenter = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      vDist = mvPosition.xy - mvCenter.xy;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec3 vPosition;
    varying vec2 vDist;

    void main() {
      float d = length(vDist);
      
      // Calculate normalized radial distance for a tight halo (d goes from 5.8 to 6.6)
      float normR = (d - 5.8) / (6.6 - 5.8);
      normR = clamp(normR, 0.0, 1.0);
      
      // Smooth falloff to make the outline look soft and glowing
      float falloff = smoothstep(1.0, 0.0, normR);
      
      // Fade out at the center of the sphere to avoid rendering over the sun disk
      float centerFade = smoothstep(4.0, 5.8, d);
      falloff *= centerFade;
      
      // Corona color (soft red-orange glow)
      vec3 fireColor = vec3(1.0, 0.32, 0.0);
      float alpha = falloff * 0.65;
      
      gl_FragColor = vec4(fireColor * alpha, alpha);
    }
  `
});
const coronaMesh = new THREE.Mesh(coronaGeo, coronaShaderMat);
systemGroup.add(coronaMesh);

// 2. Orbit Paths Helper (warm gold orbits matching the photo)
const createOrbitRing = (radius) => {
  const points = [];
  for (let i = 0; i <= 128; i++) {
    const theta = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: 0xffdd66,
    transparent: true,
    opacity: 0.32 // Brighter golden lines matching the photo
  });
  return new THREE.LineLoop(geo, mat);
};

// Add golden orbits for all 8 planets
systemGroup.add(createOrbitRing(10)); // Mercury Orbit
systemGroup.add(createOrbitRing(14)); // Venus Orbit
systemGroup.add(createOrbitRing(19)); // Earth Orbit
systemGroup.add(createOrbitRing(25)); // Mars Orbit
systemGroup.add(createOrbitRing(35)); // Jupiter Orbit
systemGroup.add(createOrbitRing(46)); // Saturn Orbit
systemGroup.add(createOrbitRing(56)); // Uranus Orbit
systemGroup.add(createOrbitRing(66)); // Neptune Orbit

// 3. Planet Mercury (small grey rocky planet)
const mercuryGroup = new THREE.Group();
const mercuryGeo = new THREE.SphereGeometry(0.45, 32, 32);
const mercuryMat = new THREE.MeshStandardMaterial({
  color: 0x909090,
  roughness: 0.9,
  metalness: 0.1
});
const mercuryMesh = new THREE.Mesh(mercuryGeo, mercuryMat);
mercuryGroup.add(mercuryMesh);
systemGroup.add(mercuryGroup);

// 4. Planet Venus (beige glowing atmosphere)
const venusGroup = new THREE.Group();
const venusGeo = new THREE.SphereGeometry(0.9, 32, 32);
const venusMat = new THREE.MeshStandardMaterial({
  color: 0xe5c158,
  roughness: 0.8,
  metalness: 0.1
});
const venusMesh = new THREE.Mesh(venusGeo, venusMat);
venusGroup.add(venusMesh);

// Venus glow
const venusGlowGeo = new THREE.SphereGeometry(0.98, 32, 32);
const venusGlowMat = new THREE.MeshBasicMaterial({
  color: 0xffddaa,
  transparent: true,
  opacity: 0.22,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const venusGlowMesh = new THREE.Mesh(venusGlowGeo, venusGlowMat);
venusGroup.add(venusGlowMesh);
systemGroup.add(venusGroup);

// 5. Planet Earth (reusing textures)
const textureLoader = new THREE.TextureLoader();
const earthTex = textureLoader.load('/earth-blue-marble.jpg');
const cloudsTex = textureLoader.load('/earth-clouds.png');

const earthGroup = new THREE.Group();
const earthGeo = new THREE.SphereGeometry(1.8, 48, 48);
const earthMat = new THREE.MeshStandardMaterial({
  map: earthTex,
  roughness: 0.65,
  metalness: 0.1,
});
const earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthGroup.add(earthMesh);

// Earth cloud layer
const cloudsGeo = new THREE.SphereGeometry(1.83, 48, 48);
const cloudsMat = new THREE.MeshStandardMaterial({
  map: cloudsTex,
  transparent: true,
  opacity: 0.45,
  blending: THREE.NormalBlending
});
const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
earthGroup.add(cloudsMesh);

// Earth atmospheric glow layer (rim glow)
const earthGlowGeo = new THREE.SphereGeometry(1.92, 48, 48);
const earthGlowMat = new THREE.MeshBasicMaterial({
  color: 0x00d2ff,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const earthGlowMesh = new THREE.Mesh(earthGlowGeo, earthGlowMat);
earthGroup.add(earthGlowMesh);

systemGroup.add(earthGroup);

// 6. Planet Mars (Rust Red with Glow)
const marsGroup = new THREE.Group();
const marsGeo = new THREE.SphereGeometry(1.1, 32, 32);
const marsMat = new THREE.MeshStandardMaterial({
  color: 0xe06030,
  roughness: 0.8,
  metalness: 0.1
});
const marsMesh = new THREE.Mesh(marsGeo, marsMat);
marsGroup.add(marsMesh);

// Mars atmospheric glow
const marsGlowGeo = new THREE.SphereGeometry(1.18, 32, 32);
const marsGlowMat = new THREE.MeshBasicMaterial({
  color: 0xff3300,
  transparent: true,
  opacity: 0.3,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const marsGlowMesh = new THREE.Mesh(marsGlowGeo, marsGlowMat);
marsGroup.add(marsGlowMesh);

systemGroup.add(marsGroup);

// 7. Planet Jupiter (Procedural stripes with Glow)
const createJupiterTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#4a3b32');
  grad.addColorStop(0.15, '#8b7d72');
  grad.addColorStop(0.3, '#d4a373');
  grad.addColorStop(0.42, '#e3d5ca');
  grad.addColorStop(0.55, '#a38f85');
  grad.addColorStop(0.7, '#d4a373');
  grad.addColorStop(0.85, '#8b7d72');
  grad.addColorStop(1, '#4a3b32');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 15; i++) {
    ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 10 + 2);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  for (let i = 0; i < 15; i++) {
    ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 8 + 1);
  }
  return new THREE.CanvasTexture(canvas);
};

const jupiterGroup = new THREE.Group();
const jupiterGeo = new THREE.SphereGeometry(3.0, 48, 48);
const jupiterMat = new THREE.MeshStandardMaterial({
  map: createJupiterTexture(),
  roughness: 0.9,
  metalness: 0.0
});
const jupiterMesh = new THREE.Mesh(jupiterGeo, jupiterMat);
jupiterGroup.add(jupiterMesh);

// Jupiter glow
const jupiterGlowGeo = new THREE.SphereGeometry(3.15, 48, 48);
const jupiterGlowMat = new THREE.MeshBasicMaterial({
  color: 0xffbb44,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const jupiterGlowMesh = new THREE.Mesh(jupiterGlowGeo, jupiterGlowMat);
jupiterGroup.add(jupiterGlowMesh);

systemGroup.add(jupiterGroup);

// 8. Planet Saturn (Pale gold with horizontal rings)
const saturnGroup = new THREE.Group();
const saturnGeo = new THREE.SphereGeometry(2.4, 48, 48);
const saturnMat = new THREE.MeshStandardMaterial({
  color: 0xe2bf7d,
  roughness: 0.85,
  metalness: 0.1
});
const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
saturnGroup.add(saturnMesh);

// Helper to generate a detailed, layered canvas texture for Saturn's rings (realistic white/grey icy rings)
const createSaturnRingTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Create vertical gradient representing radial bands (V maps from inner to outer radius)
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');   // Inner edge fade
  grad.addColorStop(0.12, 'rgba(235, 235, 240, 0.7)');  // Faint C ring (grey-white)
  grad.addColorStop(0.18, 'rgba(250, 248, 245, 0.95)'); // Bright B ring (cream-white)
  grad.addColorStop(0.48, 'rgba(255, 255, 255, 0.98)'); // Inner B ring edge (pure white)
  grad.addColorStop(0.52, 'rgba(10, 10, 20, 0.08)');     // Cassini Division (dark gap)
  grad.addColorStop(0.56, 'rgba(240, 238, 235, 0.85)'); // A Ring (light grey-beige)
  grad.addColorStop(0.85, 'rgba(248, 248, 250, 0.88)'); // Outer A ring (ice white)
  grad.addColorStop(0.92, 'rgba(220, 222, 225, 0.3)');  // Faint F ring (pale grey)
  grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');   // Outer edge fade
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add fine-grained concentric ring line variations (fine icy dust/gaps)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 30; i++) {
    ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 2 + 1);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  for (let i = 0; i < 20; i++) {
    ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 1.5 + 0.5);
  }
  
  return new THREE.CanvasTexture(canvas);
};

// Saturn rings (flat on X-Z plane with a slight tilt)
const saturnRingGeo = new THREE.RingGeometry(2.8, 5.0, 64);
saturnRingGeo.rotateX(-Math.PI / 2);
const saturnRingMat = new THREE.MeshStandardMaterial({
  map: createSaturnRingTexture(),
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.92,
  roughness: 0.5,
  metalness: 0.3
});
const saturnRingMesh = new THREE.Mesh(saturnRingGeo, saturnRingMat);
saturnRingMesh.rotation.z = 0.15;
saturnGroup.add(saturnRingMesh);

// Saturn glow
const saturnGlowGeo = new THREE.SphereGeometry(2.52, 48, 48);
const saturnGlowMat = new THREE.MeshBasicMaterial({
  color: 0xffcc66,
  transparent: true,
  opacity: 0.15,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const saturnGlowMesh = new THREE.Mesh(saturnGlowGeo, saturnGlowMat);
saturnGroup.add(saturnGlowMesh);

systemGroup.add(saturnGroup);

// 9. Planet Uranus (Pale cyan-blue with vertical rings)
const uranusGroup = new THREE.Group();
const uranusGeo = new THREE.SphereGeometry(1.6, 32, 32);
const uranusMat = new THREE.MeshStandardMaterial({
  color: 0x8ba6ca,
  roughness: 0.8,
  metalness: 0.1
});
const uranusMesh = new THREE.Mesh(uranusGeo, uranusMat);
uranusGroup.add(uranusMesh);

// Uranus rings (vertical tilt, rotating on Y axis)
const uranusRingGeo = new THREE.RingGeometry(2.0, 2.6, 64);
uranusRingGeo.rotateY(Math.PI / 2);
const uranusRingMat = new THREE.MeshBasicMaterial({
  color: 0x8ba6ca,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.35
});
const uranusRingMesh = new THREE.Mesh(uranusRingGeo, uranusRingMat);
uranusRingMesh.rotation.x = 0.18;
uranusGroup.add(uranusRingMesh);

// Uranus glow
const uranusGlowGeo = new THREE.SphereGeometry(1.7, 32, 32);
const uranusGlowMat = new THREE.MeshBasicMaterial({
  color: 0x66ccff,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const uranusGlowMesh = new THREE.Mesh(uranusGlowGeo, uranusGlowMat);
uranusGroup.add(uranusGlowMesh);

systemGroup.add(uranusGroup);

// 10. Planet Neptune (Deep azure blue)
const neptuneGroup = new THREE.Group();
const neptuneGeo = new THREE.SphereGeometry(1.5, 32, 32);
const neptuneMat = new THREE.MeshStandardMaterial({
  color: 0x3a53c1,
  roughness: 0.8,
  metalness: 0.1
});
const neptuneMesh = new THREE.Mesh(neptuneGeo, neptuneMat);
neptuneGroup.add(neptuneMesh);

// Neptune glow
const neptuneGlowGeo = new THREE.SphereGeometry(1.6, 32, 32);
const neptuneGlowMat = new THREE.MeshBasicMaterial({
  color: 0x3366ff,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const neptuneGlowMesh = new THREE.Mesh(neptuneGlowGeo, neptuneGlowMat);
neptuneGroup.add(neptuneGlowMesh);

systemGroup.add(neptuneGroup);

// ------------------------------------------
// Purple & Blue Spiral Galaxy
// ------------------------------------------
const createStarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.35)'); // subtle white glow border
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 16);
  return new THREE.CanvasTexture(canvas);
};

const galaxyCount = 4500;
const galaxyGeo = new THREE.BufferGeometry();
const galaxyPositions = new Float32Array(galaxyCount * 3);
const galaxyColors = new Float32Array(galaxyCount * 3);

for (let i = 0; i < galaxyCount; i++) {
  // Sparse density in the planetary zone (r < 72), higher density outside
  let r;
  if (Math.random() < 0.05) {
    // Only 5% of stars are placed inside the planetary zone
    r = 12 + Math.random() * 60;
  } else {
    // 95% of stars are placed outside the planetary zone
    r = 72 + Math.random() * 80;
  }
  
  const spiralFactor = 0.08;
  const armsCount = 2;
  const armAngle = (i % armsCount) * ((2 * Math.PI) / armsCount);
  const theta = r * spiralFactor + armAngle + (Math.random() - 0.5) * 0.35;
  
  const x = Math.cos(theta) * r;
  const z = Math.sin(theta) * r;
  const y = (Math.random() - 0.5) * (15 - (r * 0.1));

  galaxyPositions[i * 3] = x;
  galaxyPositions[i * 3 + 1] = y;
  galaxyPositions[i * 3 + 2] = z;

  // Set star colors to pure white
  galaxyColors[i * 3] = 1.0;
  galaxyColors[i * 3 + 1] = 1.0;
  galaxyColors[i * 3 + 2] = 1.0;
}

galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

const galaxyMat = new THREE.PointsMaterial({
  size: 0.85, // Slightly larger for nice glowing star look
  vertexColors: true,
  transparent: true,
  opacity: 0.75,
  sizeAttenuation: true,
  map: createStarTexture(),
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
scene.add(galaxyPoints);

// ==========================================
// 3. Selection & Animation Controllers
// ==========================================
let isIntroVisible = true;
let isLaunched = false;
const cameraControl = { zoomProgress: 0.0 };
let isModalOpen = false;
let focusedPlanet = null; // 'sun', 'mercury', 'venus', 'earth', etc.
let introSelectedPlanet = null;
let clock = new THREE.Clock();

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
});

let scrollPercent = 0;
window.addEventListener('scroll', () => {
  if (isIntroVisible || isModalOpen) return;
  scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
});

// Render loop
const animate = () => {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // Slow orbit animations for all 8 planets
  const mercAngle = time * 0.35;
  mercuryGroup.position.set(Math.cos(mercAngle) * 10, 0, Math.sin(mercAngle) * 10);
  mercuryMesh.rotation.y += 0.015;

  const venAngle = time * 0.24;
  venusGroup.position.set(Math.cos(venAngle) * 14, 0, Math.sin(venAngle) * 14);
  venusMesh.rotation.y += 0.01;

  const earthAngle = time * 0.16;
  earthGroup.position.set(Math.cos(earthAngle) * 19, 0, Math.sin(earthAngle) * 19);

  // Slow rotation of Earth and its clouds
  if (isIntroVisible) {
    earthMesh.rotation.y += 0.0015; // Slow rotation on landing page
    cloudsMesh.rotation.y += 0.0022;
  } else if (isLaunched) {
    earthMesh.rotation.y += 0.0008; // Slower rotation after launch
    cloudsMesh.rotation.y += 0.0012;
  }
  // During the launch transition, manual rotation is skipped to allow GSAP to take over smoothly.

  const marsAngle = time * 0.11;
  marsGroup.position.set(Math.cos(marsAngle) * 25, 0, Math.sin(marsAngle) * 25);
  marsMesh.rotation.y += 0.006;

  const jupAngle = time * 0.06;
  jupiterGroup.position.set(Math.cos(jupAngle) * 35, 0, Math.sin(jupAngle) * 35);
  jupiterMesh.rotation.y += 0.003;

  const satAngle = time * 0.045;
  saturnGroup.position.set(Math.cos(satAngle) * 46, 0, Math.sin(satAngle) * 46);
  saturnMesh.rotation.y += 0.0025;

  const uraAngle = time * 0.03;
  uranusGroup.position.set(Math.cos(uraAngle) * 56, 0, Math.sin(uraAngle) * 56);
  uranusMesh.rotation.y += 0.002;

  const nepAngle = time * 0.02;
  neptuneGroup.position.set(Math.cos(nepAngle) * 66, 0, Math.sin(nepAngle) * 66);
  neptuneMesh.rotation.y += 0.0018;

  // Update sun and corona shader uniforms
  if (sunMesh.material.uniforms && sunMesh.material.uniforms.uTime) {
    sunMesh.material.uniforms.uTime.value = time;
  }
  if (coronaMesh.material.uniforms && coronaMesh.material.uniforms.uTime) {
    coronaMesh.material.uniforms.uTime.value = time;
  }
  sunMesh.rotation.y += 0.0012;
  rimMesh.rotation.y -= 0.0018;
  coronaMesh.rotation.z += 0.002;

  coronaMesh.scale.setScalar(1.0 + Math.sin(time * 1.2) * 0.025);
  galaxyPoints.rotation.y = time * 0.006;
  
  // Star twinkle effect
  galaxyMat.opacity = 0.55 + Math.sin(time * 2.5) * 0.12;

  // Camera tracking logic
  if (isIntroVisible) {
    if (introSelectedPlanet) {
      // Focus camera on selected planet on landing page
      let targetPos = new THREE.Vector3();
      if (introSelectedPlanet === 'sun') targetPos.set(0, 0, 0);
      else if (introSelectedPlanet === 'mercury') mercuryGroup.getWorldPosition(targetPos);
      else if (introSelectedPlanet === 'venus') venusGroup.getWorldPosition(targetPos);
      else if (introSelectedPlanet === 'earth') earthGroup.getWorldPosition(targetPos);
      else if (introSelectedPlanet === 'mars') marsGroup.getWorldPosition(targetPos);
      else if (introSelectedPlanet === 'jupiter') jupiterGroup.getWorldPosition(targetPos);
      else if (introSelectedPlanet === 'saturn') saturnGroup.getWorldPosition(targetPos);
      else if (introSelectedPlanet === 'uranus') uranusGroup.getWorldPosition(targetPos);
      else if (introSelectedPlanet === 'neptune') neptuneGroup.getWorldPosition(targetPos);

      // Keep camera following the planet in real-time orbit
      let orbitOffset = 5.0;
      if (introSelectedPlanet === 'jupiter') orbitOffset = 9.0;
      else if (introSelectedPlanet === 'saturn') orbitOffset = 8.0;
      else if (introSelectedPlanet === 'sun') orbitOffset = 13.0;

      const lerpCamX = targetPos.x;
      const lerpCamY = targetPos.y + (introSelectedPlanet === 'jupiter' || introSelectedPlanet === 'saturn' ? 2.8 : 1.4);
      const lerpCamZ = targetPos.z + orbitOffset;

      perspectiveCamera.position.x += (lerpCamX - perspectiveCamera.position.x) * 0.08;
      perspectiveCamera.position.y += (lerpCamY - perspectiveCamera.position.y) * 0.08;
      perspectiveCamera.position.z += (lerpCamZ - perspectiveCamera.position.z) * 0.08;

      perspectiveCamera.lookAt(targetPos);
    } else {
      // Cinematic rotation on intro screen
      perspectiveCamera.position.x = Math.sin(time * 0.05) * 8;
      perspectiveCamera.position.y = 18 + Math.cos(time * 0.05) * 3;
      perspectiveCamera.position.z = 52;
      perspectiveCamera.lookAt(0, -6, 0);
    }
  } else if (isModalOpen && focusedPlanet) {
    // Camera locked onto planet in detail zoom
    let targetPos = new THREE.Vector3();
    if (focusedPlanet === 'sun') targetPos.set(0, 0, 0);
    else if (focusedPlanet === 'mercury') mercuryGroup.getWorldPosition(targetPos);
    else if (focusedPlanet === 'venus') venusGroup.getWorldPosition(targetPos);
    else if (focusedPlanet === 'earth') earthGroup.getWorldPosition(targetPos);
    else if (focusedPlanet === 'mars') marsGroup.getWorldPosition(targetPos);
    else if (focusedPlanet === 'jupiter') jupiterGroup.getWorldPosition(targetPos);
    else if (focusedPlanet === 'saturn') saturnGroup.getWorldPosition(targetPos);
    else if (focusedPlanet === 'uranus') uranusGroup.getWorldPosition(targetPos);
    else if (focusedPlanet === 'neptune') neptuneGroup.getWorldPosition(targetPos);

    // Keep camera following the planet in real-time orbit
    let orbitOffset = 4.5;
    if (focusedPlanet === 'jupiter') orbitOffset = 8.5;
    else if (focusedPlanet === 'saturn') orbitOffset = 7.5;
    else if (focusedPlanet === 'sun') orbitOffset = 12.0;

    const lerpCamX = targetPos.x;
    const lerpCamY = targetPos.y + (focusedPlanet === 'jupiter' || focusedPlanet === 'saturn' ? 2.5 : 1.2);
    const lerpCamZ = targetPos.z + orbitOffset;

    perspectiveCamera.position.x += (lerpCamX - perspectiveCamera.position.x) * 0.08;
    perspectiveCamera.position.y += (lerpCamY - perspectiveCamera.position.y) * 0.08;
    perspectiveCamera.position.z += (lerpCamZ - perspectiveCamera.position.z) * 0.08;

    perspectiveCamera.lookAt(targetPos);
  } else {
    // Dynamically interpolate between Overview (zoomProgress = 0) and Earth Closeup (zoomProgress = 1)
    const earthWorldPos = new THREE.Vector3();
    earthGroup.getWorldPosition(earthWorldPos);

    // 1. Overview Camera Coordinates (scroll & mouse parallax)
    const overviewX = scrollPercent * 10 + mouseX * 6;
    const overviewY = 22 - scrollPercent * 14 + mouseY * 5;
    const scrollCamZ = 52 + scrollPercent * 18;

    // 2. Earth Closeup Camera Coordinates (India/Mumbai facing offset)
    const zoomCamX = earthWorldPos.x + 1.2 + mouseX * 0.4;
    const zoomCamY = earthWorldPos.y + 0.8 + mouseY * 0.3;
    const zoomCamZ = earthWorldPos.z + 3.0;

    // Interpolate camera coordinates based on zoomProgress
    const camX = THREE.MathUtils.lerp(overviewX, zoomCamX, cameraControl.zoomProgress);
    const camY = THREE.MathUtils.lerp(overviewY, zoomCamY, cameraControl.zoomProgress);
    const camZ = THREE.MathUtils.lerp(scrollCamZ, zoomCamZ, cameraControl.zoomProgress);
    perspectiveCamera.position.set(camX, camY, camZ);

    // Interpolate camera lookAt target
    const lookX = THREE.MathUtils.lerp(0, earthWorldPos.x, cameraControl.zoomProgress);
    const lookY = THREE.MathUtils.lerp(-6 - scrollPercent * 5, earthWorldPos.y, cameraControl.zoomProgress);
    const lookZ = THREE.MathUtils.lerp(0, earthWorldPos.z, cameraControl.zoomProgress);
    perspectiveCamera.lookAt(lookX, lookY, lookZ);
  }

  renderer.render(scene, perspectiveCamera);
};
animate();

// Resize handler
window.addEventListener('resize', () => {
  perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
  perspectiveCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 4. Launch Screen Zoom Action
// ==========================================
const launchBtn = document.getElementById('launch-mission-btn');
const introScreen = document.getElementById('intro-screen');

launchBtn.addEventListener('click', () => {
  if (!isIntroVisible) return;
  isIntroVisible = false;
  introSelectedPlanet = null;

  // 1. Fade out the landing screen content
  gsap.to(introScreen, {
    opacity: 0,
    duration: 1.0,
    ease: 'power2.inOut',
    onComplete: () => {
      introScreen.style.display = 'none';
    }
  });

  // 2. Perform camera zoom timeline directly onto Earth
  const launchTimeline = gsap.timeline({
    onComplete: () => {
      isLaunched = true;

      // Keep space canvas clearly visible behind glass portfolio sections
      gsap.to('#space-canvas-container', {
        opacity: 0.45,
        duration: 1.0,
        ease: 'power2.out'
      });

      // Reveal portfolio HUD overlay
      document.getElementById('navbar').classList.add('visible');
      document.getElementById('city-overlay').classList.add('visible');

      gsap.from('.section-container', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
      });
      
      // Update interactive highlights
      addCursorHoverListeners();
    }
  });

  // Rotate Earth to face Mumbai (no markers)
  launchTimeline.to(earthMesh.rotation, {
    y: 0.95, // Align longitude
    x: 0.35, // Tilt to Mumbai latitude
    duration: 3.5,
    ease: 'power2.inOut'
  });

  // Dynamically interpolate cameraControl.zoomProgress from 0.0 to 1.0
  launchTimeline.to(cameraControl, {
    zoomProgress: 1.0,
    duration: 3.5,
    ease: 'power2.inOut'
  }, '-=3.5');
});

// ==========================================
// 5. Planet Selection & Modal Controls
// ==========================================
const PLANET_DETAILS = {
  sun: {
    title: 'SOLAR SECTOR: THE SUN',
    desc: 'The central power source of the system, generating nuclear fusion energy to power all districts, hologram networks, and cybergrids.',
    specs: 'Diameter: 1,392,700 km | Core Temp: 15,000,000°C | Output: 3.8 x 10^26 W'
  },
  mercury: {
    title: 'SECTOR MERCURY: FAST CORE',
    desc: 'The innermost planet, orbiting rapidly around the central node. Representing lightning-fast scripts, execution speed, and compact microservices.',
    specs: 'Diameter: 4,879 km | Year: 88 Earth Days | Surface: Solid Cratered'
  },
  venus: {
    title: 'SECTOR VENUS: GREENHOUSE NODE',
    desc: 'A dense, shrouded atmosphere containing highly active server engines. Host to cloud computing setups, automated integrations, and web servers.',
    specs: 'Diameter: 12,104 km | Temp: 462°C | Atmosphere: Carbon Dioxide, Nitrogen'
  },
  earth: {
    title: 'TERRESTRIAL SECTOR: EARTH',
    desc: 'Sarthak\'s primary home base (Mumbai). Hosting core web architectures, college voting systems, semantic structures, and full-stack responsive systems.',
    specs: 'Type: Terrestrial Planet | Gravity: 9.8 m/s² | Atmosphere: Nitrogen, Oxygen'
  },
  mars: {
    title: 'EXPLORATION SECTOR: MARS',
    desc: 'The testing grounds for future AI technologies. Hosting Python automation scripts, neural networks, machine learning algorithms, and intelligent agentic workflows.',
    specs: 'Type: Terrestrial Planet | Gravity: 3.7 m/s² | Key Asset: AI Research Facility'
  },
  jupiter: {
    title: 'GAS GIANT SECTOR: JUPITER',
    desc: 'A massive database node. Hosting scalable SQL architectures, data science pipelines, analytical structures, and high-throughput backend services.',
    specs: 'Type: Gas Giant | Gravity: 24.79 m/s² | Key Asset: SQL Data Core'
  },
  saturn: {
    title: 'SECTOR SATURN: RING NODE',
    desc: 'A spectacular gas giant surrounded by millions of ice and rock particles. Hosting security frameworks, firewalls, and data access layers.',
    specs: 'Diameter: 116,460 km | Ring Span: 282,000 km | Key Asset: Cyber-Defense Ring'
  },
  uranus: {
    title: 'SECTOR URANUS: COLD VAULT',
    desc: 'An ice giant tilted completely on its side, representing off-axis computing, backup datacenters, and secure offline storage systems.',
    specs: 'Diameter: 50,724 km | Axial Tilt: 97.8° | Temperature: -224°C'
  },
  neptune: {
    title: 'SECTOR NEPTUNE: AZURE OUTPOST',
    desc: 'A deep blue storm-ridden giant at the edge of the solar system. Host to microservice clusters, background workers, and long-range network routing.',
    specs: 'Diameter: 49,244 km | Wind Speed: Up to 2,100 km/h | Year: 165 Earth Years'
  }
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const detailsModal = document.getElementById('planet-details-modal');
const modalTitle = document.getElementById('modal-planet-title');
const modalDesc = document.getElementById('modal-planet-description');
const modalSpecs = document.getElementById('modal-planet-specs');
const modalClose = document.getElementById('modal-close-btn');
const modalReturn = document.getElementById('modal-return-btn');

const zoomToPlanet = (planetName, details) => {
  focusedPlanet = planetName;
  isModalOpen = true;

  // Restore space canvas visibility so planet is bright
  gsap.to('#space-canvas-container', {
    opacity: 0.85,
    duration: 0.5
  });

  // Populate modal data
  modalTitle.textContent = details.title;
  modalDesc.textContent = details.desc;
  modalSpecs.textContent = details.specs;

  // Animate modal in
  setTimeout(() => {
    detailsModal.classList.add('visible');
  }, 400);
};

const resetCameraView = (e) => {
  if (e) e.stopPropagation();
  isModalOpen = false;
  focusedPlanet = null;
  detailsModal.classList.remove('visible');

  // Fade canvas back to standard launched overview opacity
  gsap.to('#space-canvas-container', {
    opacity: isLaunched ? 0.45 : 0.15,
    duration: 0.8
  });
};

// Bind canvas click intersections (for standard click on 3D objects)
window.addEventListener('click', (e) => {
  if (isIntroVisible || isModalOpen) return;

  // Filter out clicks inside overlays
  if (e.target.closest('#city-overlay') || e.target.closest('#navbar') || e.target.closest('#planet-details-modal')) {
    return;
  }

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, perspectiveCamera);
  const targets = [sunMesh, mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh];
  const intersects = raycaster.intersectObjects(targets);

  if (intersects.length > 0) {
    const hitObj = intersects[0].object;
    let name = '';

    if (hitObj === sunMesh) name = 'sun';
    else if (hitObj === mercuryMesh) name = 'mercury';
    else if (hitObj === venusMesh) name = 'venus';
    else if (hitObj === earthMesh) name = 'earth';
    else if (hitObj === marsMesh) name = 'mars';
    else if (hitObj === jupiterMesh) name = 'jupiter';
    else if (hitObj === saturnMesh) name = 'saturn';
    else if (hitObj === uranusMesh) name = 'uranus';
    else if (hitObj === neptuneMesh) name = 'neptune';

    if (name && PLANET_DETAILS[name]) {
      zoomToPlanet(name, PLANET_DETAILS[name]);
    }
  }
});

// Bind close events for modal
modalClose.addEventListener('click', resetCameraView);
modalReturn.addEventListener('click', resetCameraView);

// Prevent inner modal clicks from triggering background planet selections
document.querySelector('.modal-card').addEventListener('click', (e) => {
  e.stopPropagation();
});

// ==========================================
// 5a. Landing Page Planet Selector HUD Logic
// ==========================================
const planetItems = document.querySelectorAll('.planet-item');
const hudTitle = document.getElementById('sector-info-title');
const hudDesc = document.getElementById('sector-info-desc');
const hudSpecs = document.getElementById('sector-info-specs');
const planetSelectorList = document.querySelector('.planet-selector-list');

planetItems.forEach((item) => {
  const planetName = item.getAttribute('data-planet');

  // Hover/preview behavior
  item.addEventListener('mouseenter', () => {
    if (!isIntroVisible) return;

    // Set active item class
    planetItems.forEach(pi => pi.classList.remove('active'));
    item.classList.add('active');

    // Update HUD display text
    const details = PLANET_DETAILS[planetName];
    if (details) {
      hudTitle.textContent = details.title;
      hudDesc.textContent = details.desc;
      hudSpecs.textContent = details.specs;
    }

    // Set active intro camera focus target
    introSelectedPlanet = planetName;
  });
});

// Mouse leaving selector panel resets camera view back to cinematic rotation
if (planetSelectorList) {
  planetSelectorList.addEventListener('mouseleave', () => {
    if (!isIntroVisible) return;
    introSelectedPlanet = null;
  });
}

// ==========================================
// 6. District Scroll Interactivity
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
  root: null,
  threshold: 0.25,
  rootMargin: '0px'
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const activeId = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => navObserver.observe(section));

// Skills Tower progress bar triggers
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      skillBars.forEach((bar) => {
        const targetLevel = bar.getAttribute('data-level');
        bar.style.width = targetLevel;
      });
    }
  });
}, { threshold: 0.1 });

const skillsSection = document.getElementById('skills-tower');
if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

// ==========================================
// 7. Dynamic Hover Glow (Certificate Cards)
// ==========================================
const certCards = document.querySelectorAll('.cert-card');
certCards.forEach((card) => {
  const shine = document.createElement('div');
  shine.className = 'cert-shine';
  card.appendChild(shine);

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    shine.style.setProperty('--x', `${x}px`);
    shine.style.setProperty('--y', `${y}px`);
  });
});

// ==========================================
// 8. GitHub Live Stats Fetcher
// ==========================================
const fetchGitHubStats = async () => {
  try {
    const response = await fetch('https://api.github.com/users/SarthakH0607');
    if (response.ok) {
      const data = await response.json();
      document.getElementById('gh-repos').textContent = data.public_repos || 12;
      document.getElementById('gh-followers').textContent = data.followers || 18;
      
      const starResponse = await fetch('https://api.github.com/users/SarthakH0607/repos');
      if (starResponse.ok) {
        const repos = await starResponse.json();
        let starsCount = 0;
        repos.forEach(repo => starsCount += repo.stargazers_count);
        document.getElementById('gh-stars').textContent = starsCount || 28;
      }
    }
  } catch (error) {
    console.warn('GitHub stats fetch failed. Using static nodes.', error);
  }
};
fetchGitHubStats();

// ==========================================
// 9. Contact Terminal Portal Info
// ==========================================
console.log("Portal Gateways: ONLINE (Email, LinkedIn, GitHub)");

