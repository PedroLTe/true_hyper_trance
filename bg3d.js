/* TR-01 :: fundo 3D — explosão de cacos de cromo e vidro (clima da capa "exoplanet '02")
   three.js 0.187.0 via importmap. Cacos em InstancedMesh, núcleo branco estourado com bloom,
   riscos de velocidade, faíscas e grade em perspectiva. Rolar a página aproxima a câmera.
   Expõe window.TRBG = { dive(), setColor(hex) } para o app.js.
   Sem WebGL: fica o fundo CSS. Com prefers-reduced-motion: um quadro estático. */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const canvas = document.getElementById("bg3d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const small = () => innerWidth < 760;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
} catch (e) {
  canvas.remove(); // sem WebGL: o fundo CSS assume
  throw e;
}
let dpr = Math.min(devicePixelRatio || 1, small() ? 1.25 : 1.5);
renderer.setPixelRatio(dpr);
renderer.setSize(innerWidth, innerHeight, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.setClearColor(0x05071c, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0e36, 0.045);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(skyEnvironment(), 0.02).texture;

/* ambiente de reflexo: céu cobalto → lilás com algumas faixas de luz branca,
   para o cromo refletir azul (como na capa) em vez de um estúdio branco */
function skyEnvironment() {
  const env = new THREE.Scene();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `varying vec3 vP;
        void main(){
          float h = normalize(vP).y;
          vec3 top = vec3(.86,.88,1.), mid = vec3(.24,.27,.62), low = vec3(.02,.03,.1);
          vec3 c = h > 0. ? mix(mid, top, pow(h, .8)) : mix(mid, low, pow(-h, .5));
          gl_FragColor = vec4(c, 1.);
        }`
    })
  );
  env.add(sky);
  const strip = (w, h, pos, rot, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 1.05), side: THREE.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  strip(9, 0.5, [0, 5, -6], [0.4, 0, 0.3], 3);
  strip(0.4, 8, [7, 0, -3], [0, -1, 0.2], 2.2);
  strip(6, 0.3, [-6, -2, 4], [0, 1.2, -0.5], 1.6);
  return env;
}

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 120);
camera.position.set(0, 0, 9);

/* ---------- texturas geradas ---------- */
function glowTexture(stops) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const softGlow = glowTexture([[0, "rgba(255,255,255,1)"], [0.25, "rgba(200,206,255,.55)"], [0.6, "rgba(110,118,240,.15)"], [1, "rgba(0,0,0,0)"]]);
const dotTex = glowTexture([[0, "rgba(255,255,255,1)"], [0.4, "rgba(220,226,255,.6)"], [1, "rgba(0,0,0,0)"]]);

/* ---------- geometria dos cacos ----------
   prisma de seção losangular (4 lados) que afina até a ponta; "bend" curva a lâmina como as fitas da capa */
function blade({ w, t, bend = 0, seg = 1 }) {
  const g = new THREE.CylinderGeometry(0, 1, 1, 4, seg, false);
  g.translate(0, 0.5, 0);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i) * w, y = p.getY(i), z = p.getZ(i) * t;
    if (bend) {
      const th = y * bend;
      const cx = (1 - Math.cos(th)) / bend, cy = Math.sin(th) / bend;
      [x, y] = [cx + x * Math.cos(th), cy - x * Math.sin(th)];
    }
    p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  return g;
}

const chrome = new THREE.MeshStandardMaterial({ color: 0xd2d7ff, metalness: 1, roughness: 0.12, flatShading: true, envMapIntensity: 1.25 });
const glass = new THREE.MeshPhysicalMaterial({
  color: 0xdfe4ff, metalness: 0.5, roughness: 0.02, clearcoat: 1, flatShading: true,
  transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false,
  emissive: 0x14185a, emissiveIntensity: 0.15, envMapIntensity: 1.6
});
const variants = [
  { geo: blade({ w: 0.2, t: 0.05 }), mat: chrome, n: 40 },                      // lâminas retas
  { geo: blade({ w: 0.3, t: 0.04, bend: 0.28, seg: 14 }), mat: chrome, n: 34 }, // lâminas curvas de cromo
  { geo: blade({ w: 0.38, t: 0.015, bend: 0.45, seg: 14 }), mat: glass, n: 30 },// fitas curvas de vidro
  { geo: blade({ w: 0.05, t: 0.05 }), mat: chrome, n: 40 }                      // agulhas
];

const burst = new THREE.Group();
scene.add(burst);
const UP = new THREE.Vector3(0, 1, 0);
const FLOW = new THREE.Vector3(1, 0.45, 0.15).normalize(); // a diagonal da capa: baixo-esquerda → cima-direita
const shards = [];
const rand = (a, b) => a + Math.random() * (b - a);

variants.forEach((v) => {
  const n = small() ? Math.round(v.n * 0.55) : v.n;
  const mesh = new THREE.InstancedMesh(v.geo, v.mat, n);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  burst.add(mesh);
  for (let i = 0; i < n; i++) {
    const dir = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1) * 0.55).normalize();
    // parte dos cacos segue o fluxo diagonal (para os dois lados)
    if (Math.random() < 0.72) dir.lerp(FLOW.clone().multiplyScalar(Math.random() < 0.65 ? 1 : -1), rand(0.45, 0.85)).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir);
    shards.push({
      mesh, i, dir, q,
      roll: rand(0, Math.PI * 2), spin: rand(-0.25, 0.25),
      r0: rand(0.1, 1.1), len: 1.4 + Math.pow(Math.random(), 1.4) * (v.mat === glass ? 6 : 7.5),
      s: rand(0.6, 1.8), phase: rand(0, Math.PI * 2), amp: rand(0.05, 0.3)
    });
  }
});

/* núcleo: cristal cromado + estouro branco */
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 0), chrome);
burst.add(core);
const coreInner = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), glass);
burst.add(coreInner);
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: softGlow, color: 0x8f99ff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
halo.scale.setScalar(5);
burst.add(halo);
const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: softGlow, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
flare.scale.setScalar(1.3);
burst.add(flare);
const keyLight = new THREE.PointLight(0xdfe4ff, 10, 14, 2);
burst.add(keyLight);
const rim = new THREE.DirectionalLight(0x6d76e8, 2.2);
rim.position.set(-4, -2, 3);
scene.add(rim);
scene.add(new THREE.AmbientLight(0x3a42c0, 0.5));

/* riscos de velocidade saindo do núcleo */
const LINES = small() ? 110 : 220;
const linePos = new Float32Array(LINES * 6);
const lineData = [];
for (let i = 0; i < LINES; i++) {
  lineData.push({ dir: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-0.6, 1)).normalize(), r: rand(0.5, 14), len: rand(0.3, 1.6), v: rand(0.6, 1.8) });
}
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
const lineMat = new THREE.LineBasicMaterial({ color: 0x9fb0ff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false });
const lines = new THREE.LineSegments(lineGeo, lineMat);
lines.frustumCulled = false;
burst.add(lines);

/* faíscas */
const SP = small() ? 350 : 800;
const spPos = new Float32Array(SP * 3);
for (let i = 0; i < SP; i++) {
  const d = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(Math.pow(Math.random(), 0.7) * 11);
  spPos.set([d.x, d.y, d.z], i * 3);
}
const spGeo = new THREE.BufferGeometry();
spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
const sparks = new THREE.Points(spGeo, new THREE.PointsMaterial({
  map: dotTex, color: 0xdfe4ff, size: 0.07, sizeAttenuation: true,
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
}));
burst.add(sparks);

/* grade em perspectiva (canto inferior, como na capa) */
const gridMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0x7c86f0) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `
    uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
    void main(){
      vec2 g = vUv * 34.; g.y += uTime * .6;
      vec2 f = abs(fract(g) - .5);
      float line = 1. - smoothstep(.0, .045, min(f.x, f.y));
      float fade = smoothstep(0., .35, vUv.y) * (1. - smoothstep(.55, 1., vUv.y)) * smoothstep(0., .25, vUv.x) * (1. - smoothstep(.75, 1., vUv.x));
      gl_FragColor = vec4(uColor * line, line * fade * .3);
    }`
});
const grid = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), gridMat);
grid.rotation.x = -Math.PI / 2.35;
grid.rotation.z = 0.35;
grid.position.set(3, -4.2, -2);
scene.add(grid);

/* ---------- pós-processamento ---------- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.55, 0.45, 0.82);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------- estado ---------- */
const m4 = new THREE.Matrix4(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3(), qRoll = new THREE.Quaternion(), qq = new THREE.Quaternion();
let dive = 0, t = 0, last = performance.now(), raf = 0;
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
let scrollP = 0;
let baseZ = 9;
const perf = { frames: 0, acc: 0, degraded: 0 };

function layout() {
  const w = innerWidth, h = innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  bloom.resolution.set(w / 2, h / 2);
  baseZ = w / h < 1 ? 9 + (1 / (w / h) - 1) * 4 : 9; // tela em pé: afasta a câmera
  // no desktop o núcleo fica um pouco à direita (o texto do hero ocupa a esquerda)
  burst.position.set(w > 900 ? 1.6 : 0, w > 900 ? 0.5 : 0.9, 0);
}

function update(dt) {
  t += dt;
  dive *= Math.pow(0.25, dt);
  mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 2);
  mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 2);

  burst.rotation.set(0.25 + mouse.y * 0.12 + scrollP * 0.5, t * 0.05 + mouse.x * 0.25 + scrollP * 1.2, -0.38);
  camera.position.set(mouse.x * 0.5, -mouse.y * 0.3, baseZ - scrollP * 3.2 - dive * 1.2);
  camera.fov = 50 + dive * 9;
  camera.updateProjectionMatrix();
  camera.lookAt(burst.position.x * 0.6, burst.position.y * 0.6, 0);

  for (const s of shards) {
    const r = s.r0 + Math.sin(t * 0.6 + s.phase) * s.amp + dive * (1.2 + s.r0 * 1.8);
    v3.copy(s.dir).multiplyScalar(r);
    qRoll.setFromAxisAngle(UP, s.roll + t * s.spin);
    qq.copy(s.q).multiply(qRoll);
    s3.set(s.s, s.len * (1 + dive * 0.35), s.s);
    m4.compose(v3, qq, s3);
    s.mesh.setMatrixAt(s.i, m4);
  }
  for (const v of burst.children) if (v.isInstancedMesh) v.instanceMatrix.needsUpdate = true;

  core.rotation.set(t * 0.3, t * 0.4, 0);
  coreInner.rotation.set(-t * 0.5, t * 0.2, 0);
  const pulse = 1 + Math.sin(t * 2.2) * 0.04 + dive * 0.6;
  flare.scale.setScalar(1.3 * pulse);
  halo.scale.setScalar(5 * (1 + dive * 0.3));
  keyLight.intensity = 10 + dive * 30;

  for (let i = 0; i < LINES; i++) {
    const L = lineData[i];
    L.r += L.v * dt * (1 + dive * 9);
    if (L.r > 14) { L.r = rand(0.4, 1.5); }
    const a = L.r, b = L.r + L.len * (1 + dive * 4);
    linePos.set([L.dir.x * a, L.dir.y * a, L.dir.z * a, L.dir.x * b, L.dir.y * b, L.dir.z * b], i * 6);
  }
  lineGeo.attributes.position.needsUpdate = true;
  lineMat.opacity = 0.22 + dive * 0.5;

  sparks.rotation.y = -t * 0.02;
  gridMat.uniforms.uTime.value = t * (1 + dive * 6);
  bloom.strength = 0.55 + dive * 0.8;
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  composer.render();
  adapt(dt);
  raf = requestAnimationFrame(frame);
}

/* se ficar pesado: primeiro baixa a resolução, depois desliga o bloom */
function adapt(dt) {
  if (perf.degraded >= 2) return;
  perf.frames++; perf.acc += dt;
  if (perf.frames < 90) return;
  const avg = perf.acc / perf.frames;
  perf.frames = 0; perf.acc = 0;
  if (avg > 0.024) {
    perf.degraded++;
    if (perf.degraded === 1) { dpr = 1; renderer.setPixelRatio(1); composer.setPixelRatio(1); layout(); }
    else bloom.enabled = false;
  }
}

function still() {
  cancelAnimationFrame(raf);
  update(0);
  composer.render();
}
function start() {
  cancelAnimationFrame(raf);
  if (reduce.matches) return still();
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

/* ---------- eventos ---------- */
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  scrollP = max > 0 ? Math.min(1, scrollY / max) : 0;
  document.documentElement.style.setProperty("--sp", scrollP.toFixed(3));
  if (reduce.matches) still();
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("pointermove", (e) => {
  mouse.tx = (e.clientX / innerWidth) * 2 - 1;
  mouse.ty = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });
addEventListener("resize", () => { layout(); if (reduce.matches) still(); });
document.addEventListener("visibilitychange", () => (document.hidden ? cancelAnimationFrame(raf) : start()));
reduce.addEventListener("change", start);

const char = { angel: 0x22c8ff, path: 0xe6c17a };
window.TRBG = {
  dive() { if (!reduce.matches && !document.hidden) dive = 1; },
  setColor(hex) {
    const c = new THREE.Color(hex);
    lineMat.color.copy(c).lerp(new THREE.Color(0x9fb0ff), 0.5);
    halo.material.color.copy(c).lerp(new THREE.Color(0xb9c2ff), 0.6);
    if (reduce.matches) still();
  }
};
window.TRBG.setColor(char[document.documentElement.dataset.char] || char.angel);

layout();
onScroll();
start();
document.documentElement.classList.add("has-3d");
