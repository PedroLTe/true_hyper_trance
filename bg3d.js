/* TR-01 :: fundo 3D — cromo líquido (clima das capas "exoplanet '02" e "NEOY2K")
   three.js 0.187.0 via importmap.
   - fitas curvas espelhadas que ondulam (deformação no vertex shader)
   - lâminas de cristal cromado
   - núcleo de metal líquido deformando
   - ambiente de reflexo HDR: céu escuro + faixas de luz fortes, para o cromo ter contraste de espelho
   Dois temas: "night" (cobalto, padrão) e "day" (céu claro, para a discografia do nuphory).
   Rolar a página aproxima a câmera. Expõe window.TRBG = { dive(), setColor(hex), setTheme(name) }.
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
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
} catch (e) {
  canvas.remove(); // sem WebGL: o fundo CSS assume
  throw e;
}
let dpr = Math.min(devicePixelRatio || 1, small() ? 1.25 : 1.5);
renderer.setPixelRatio(dpr);
renderer.setSize(innerWidth, innerHeight, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
renderer.setClearColor(0x05071c, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070a2a, 0.012);
const pmrem = new THREE.PMREMGenerator(renderer);
const envNight = pmrem.fromScene(chromeEnvironment(false), 0).texture;
const envDay = pmrem.fromScene(chromeEnvironment(true), 0).texture;
scene.environment = envNight;

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 120);
camera.position.set(0, 0, 9);

/* ambiente de reflexo HDR: céu (escuro cobalto à noite, branco-lavanda de dia) e faixas de luz (valores > 1).
   É o contraste claro/escuro que faz o metal parecer espelho em vez de massinha. */
function chromeEnvironment(day) {
  const sky = day
    ? { top: "1.45,1.5,1.85", mid: ".6,.66,1.", low: ".18,.22,.52" }
    : { top: ".3,.33,.9", mid: ".025,.03,.12", low: ".003,.004,.02" };
  const kLight = day ? 0.9 : 0.8; // à noite as faixas ficam 20% mais fracas: menos branco estourado
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(
    new THREE.SphereGeometry(20, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `varying vec3 vP;
        void main(){
          vec3 d = normalize(vP);
          vec3 top = vec3(${sky.top}), mid = vec3(${sky.mid}), low = vec3(${sky.low});
          vec3 c = d.y > 0. ? mix(mid, top, pow(d.y, 1.6)) : mix(mid, low, pow(-d.y, .6));
          c += vec3(.5,.45,1.2) * pow(max(0., 1. - abs(d.y - .15)), 18.) * .6; // linha de horizonte lilás
          gl_FragColor = vec4(c, 1.);
        }`
    })
  ));
  const strip = (w, h, pos, rot, rgb) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(...rgb.map((v) => v * kLight)), side: THREE.DoubleSide, toneMapped: false })
    );
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  // softboxes brancas e lilases em volta: viram os riscos brilhantes no cromo
  strip(16, 0.6, [0, 9, -8], [0.6, 0, 0.25], [9, 9, 10]);
  strip(0.5, 14, [11, 1, -4], [0, -1.1, 0.15], [6, 6.5, 9]);
  strip(12, 0.35, [-10, -3, 5], [0, 1.2, -0.45], [4, 4.2, 8]);
  strip(0.3, 10, [-6, 6, -9], [0.3, 0.6, 0.6], [7, 7, 8]);
  strip(14, 0.25, [3, -7, 8], [-1.1, 0.2, 0.1], [2.5, 2.8, 7]);
  strip(3, 3, [0, 3, 12], [0, Math.PI, 0], [3, 3.2, 5]);
  strip(18, 0.18, [0, -1, -10], [0, 0, -0.35], [12, 12, 14]);
  strip(0.2, 16, [-12, 0, -2], [0, 1.3, 0.3], [8, 8, 11]);
  strip(10, 0.15, [6, 5, 9], [0.8, -0.6, 0.4], [10, 10, 12]);
  return env;
}

/* ---------- materiais ---------- */
const shared = { uTime: { value: 0 }, uDive: { value: 0 } };

// ondulação "líquida" nas fitas: deslocamento ao longo da normal, mais forte na ponta
function liquidRibbons(mat) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = shared.uTime;
    sh.uniforms.uDive = shared.uDive;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", `#include <common>
        attribute float aT; attribute float aPhase;
        uniform float uTime; uniform float uDive;`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        float wave = sin(aT * 9. - uTime * 1.5 + aPhase) * .07 + sin(aT * 17. + uTime * 2.3 + aPhase * 2.) * .025;
        transformed += objectNormal * wave * aT;
        transformed *= 1. + uDive * .4 * aT;`);
  };
  return mat;
}
const chromeOpts = { metalness: 1, roughness: 0.035, envMapIntensity: 1.35, clearcoat: 0.6, clearcoatRoughness: 0.04, iridescence: 0.35, iridescenceIOR: 1.35, side: THREE.DoubleSide };
const chromeWhite = liquidRibbons(new THREE.MeshPhysicalMaterial({ ...chromeOpts, color: 0xffffff }));
const chromeLilac = liquidRibbons(new THREE.MeshPhysicalMaterial({ ...chromeOpts, color: 0xa7b0ff }));
const glassRibbon = liquidRibbons(new THREE.MeshPhysicalMaterial({
  color: 0xdfe6ff, metalness: 0.3, roughness: 0.02, clearcoat: 1, envMapIntensity: 1.8,
  transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false,
  iridescence: 0.6, iridescenceIOR: 1.4
}));
const bladeChrome = new THREE.MeshPhysicalMaterial({ ...chromeOpts, color: 0xd6dbff, side: THREE.FrontSide });

/* ---------- fitas curvas ---------- */
const UP = new THREE.Vector3(0, 1, 0);
const FLOW = new THREE.Vector3(1, 0.45, 0.15).normalize(); // a diagonal da capa: baixo-esquerda → cima-direita
const rand = (a, b) => a + Math.random() * (b - a);

function flowDir() {
  const dir = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1) * 0.55).normalize();
  if (Math.random() < 0.72) dir.lerp(FLOW.clone().multiplyScalar(Math.random() < 0.65 ? 1 : -1), rand(0.45, 0.85)).normalize();
  return dir;
}

/* várias fitas num único BufferGeometry (uma chamada de desenho por material).
   Cada fita: linha central que sai do núcleo e curva em torno de um eixo perpendicular,
   largura que afina até a ponta e torção ao longo do comprimento. A seção é curva (como uma calha),
   para a normal variar na largura e o reflexo correr em faixas, em vez de uma cor chapada. */
function ribbons(count, { wMin, wMax, lenMin, lenMax }) {
  const SEG = 72, ACROSS = 7;
  const pos = [], aT = [], aPhase = [], idx = [];
  const c = new THREE.Vector3(), c2 = new THREE.Vector3(), T = new THREE.Vector3(), W = new THREE.Vector3(), N = new THREE.Vector3(), q = new THREE.Quaternion();
  let base = 0;
  for (let r = 0; r < count; r++) {
    const dir = flowDir();
    const axis = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1))).normalize();
    const bend = rand(0.25, 1.5) * (Math.random() < 0.5 ? 1 : -1);
    const len = rand(lenMin, lenMax), r0 = rand(0, 0.5), w0 = rand(wMin, wMax), twist = rand(-2.6, 2.6), phase = rand(0, 6.28);
    const bow = rand(0.35, 0.8) * (Math.random() < 0.5 ? 1 : -1);
    const center = (tt, out) => out.copy(dir).applyQuaternion(q.setFromAxisAngle(axis, bend * tt)).multiplyScalar(r0 + len * tt);
    for (let i = 0; i <= SEG; i++) {
      const tt = i / SEG;
      center(tt, c);
      center(Math.min(1, tt + 0.01), c2);
      T.subVectors(c2, c);
      if (T.lengthSq() < 1e-8) T.copy(dir); else T.normalize();
      W.crossVectors(T, axis).normalize().applyAxisAngle(T, twist * tt);
      N.crossVectors(T, W).normalize();
      const w = w0 * Math.pow(Math.sin(Math.PI * Math.min(1, tt * 1.25 + 0.05)), 0.6) * (1 - tt * 0.55);
      for (let j = 0; j < ACROSS; j++) {
        const u = (j / (ACROSS - 1)) * 2 - 1;      // -1..1 na largura
        const lift = bow * w * (1 - u * u);       // curvatura da calha
        pos.push(c.x + W.x * w * u + N.x * lift, c.y + W.y * w * u + N.y * lift, c.z + W.z * w * u + N.z * lift);
        aT.push(tt); aPhase.push(phase);
      }
      if (i < SEG) {
        for (let j = 0; j < ACROSS - 1; j++) {
          const a = base + i * ACROSS + j, b = a + ACROSS;
          idx.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
    base += (SEG + 1) * ACROSS;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(aT, 1));
  g.setAttribute("aPhase", new THREE.Float32BufferAttribute(aPhase, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const burst = new THREE.Group();
scene.add(burst);
const k = small() ? 0.55 : 1;
const ribbonMeshes = [
  new THREE.Mesh(ribbons(Math.round(46 * k), { wMin: 0.08, wMax: 0.42, lenMin: 2.5, lenMax: 8.5 }), chromeWhite),
  new THREE.Mesh(ribbons(Math.round(28 * k), { wMin: 0.06, wMax: 0.3, lenMin: 2, lenMax: 7 }), chromeLilac),
  new THREE.Mesh(ribbons(Math.round(16 * k), { wMin: 0.2, wMax: 0.6, lenMin: 3, lenMax: 8 }), glassRibbon)
];
ribbonMeshes.forEach((m) => { m.frustumCulled = false; burst.add(m); });

/* ---------- lâminas de cristal (instanciadas) ---------- */
function blade() {
  // prisma hexagonal fino que afina até a ponta, sombreamento suave
  const g = new THREE.CylinderGeometry(0, 1, 1, 6, 1, false);
  g.translate(0, 0.5, 0);
  g.scale(0.07, 1, 0.025);
  g.computeVertexNormals();
  return g;
}
const NB = Math.round(60 * k);
const blades = new THREE.InstancedMesh(blade(), bladeChrome, NB);
blades.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
blades.frustumCulled = false;
burst.add(blades);
const bladeData = [];
for (let i = 0; i < NB; i++) {
  const dir = flowDir();
  bladeData.push({
    dir, q: new THREE.Quaternion().setFromUnitVectors(UP, dir),
    roll: rand(0, 6.28), spin: rand(-0.3, 0.3),
    r0: rand(0.2, 1.2), len: 1.2 + Math.pow(Math.random(), 1.4) * 6,
    s: rand(0.6, 2), phase: rand(0, 6.28), amp: rand(0.05, 0.3)
  });
}

/* ---------- núcleo de metal líquido ---------- */
const blobMat = new THREE.MeshPhysicalMaterial({ ...chromeOpts, color: 0xf2f3ff, side: THREE.FrontSide, iridescence: 0.5 });
blobMat.onBeforeCompile = (sh) => {
  sh.uniforms.uTime = shared.uTime;
  sh.uniforms.uDive = shared.uDive;
  sh.vertexShader = sh.vertexShader
    .replace("#include <common>", `#include <common>
      uniform float uTime; uniform float uDive;
      vec3 liquid(vec3 n){
        float d = sin(n.x * 3.1 + uTime * 1.1) * sin(n.y * 2.7 + uTime * 1.3) * sin(n.z * 3.3 + uTime * .9)
                + .5 * sin((n.x + n.y) * 5. + uTime * 1.7) * sin(n.z * 4. - uTime)
                + .25 * sin(n.y * 9. + uTime * 2.2);
        return n * (1. + d * .2 * (1. + uDive * 1.5));
      }`)
    // normal recalculada a partir de dois vizinhos deslocados
    .replace("#include <beginnormal_vertex>", `
      vec3 n0 = normalize(position);
      vec3 tA = normalize(cross(n0, abs(n0.y) < .99 ? vec3(0., 1., 0.) : vec3(1., 0., 0.)));
      vec3 tB = cross(n0, tA);
      vec3 p0 = liquid(n0);
      vec3 objectNormal = normalize(cross(liquid(normalize(n0 + tA * .01)) - p0, liquid(normalize(n0 + tB * .01)) - p0));
      if (dot(objectNormal, n0) < 0.) objectNormal = -objectNormal;`)
    .replace("#include <begin_vertex>", `vec3 transformed = p0 * length(position);`);
};
const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, small() ? 24 : 48), blobMat);
burst.add(blob);

/* ---------- brilho, riscos, faíscas, grade ---------- */
function glowTexture(stops) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const softGlow = glowTexture([[0, "rgba(255,255,255,1)"], [0.25, "rgba(200,206,255,.55)"], [0.6, "rgba(110,118,240,.15)"], [1, "rgba(0,0,0,0)"]]);
const dotTex = glowTexture([[0, "rgba(255,255,255,1)"], [0.4, "rgba(220,226,255,.6)"], [1, "rgba(0,0,0,0)"]]);
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: softGlow, color: 0x8f99ff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
halo.scale.setScalar(5.5);
burst.add(halo);
const keyLight = new THREE.PointLight(0xdfe4ff, 4, 12, 2);
burst.add(keyLight);

const LINES = small() ? 110 : 200;
const linePos = new Float32Array(LINES * 6);
const lineData = [];
for (let i = 0; i < LINES; i++) {
  lineData.push({ dir: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-0.6, 1)).normalize(), r: rand(0.5, 14), len: rand(0.3, 1.6), v: rand(0.6, 1.8) });
}
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
const lineMat = new THREE.LineBasicMaterial({ color: 0x9fb0ff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
const lines = new THREE.LineSegments(lineGeo, lineMat);
lines.frustumCulled = false;
burst.add(lines);

const SP = small() ? 350 : 800;
const spPos = new Float32Array(SP * 3);
for (let i = 0; i < SP; i++) {
  const d = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(Math.pow(Math.random(), 0.7) * 11);
  spPos.set([d.x, d.y, d.z], i * 3);
}
const spGeo = new THREE.BufferGeometry();
spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
const sparks = new THREE.Points(spGeo, new THREE.PointsMaterial({
  map: dotTex, color: 0xdfe4ff, size: 0.035, sizeAttenuation: true, opacity: 0.7,
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
}));
burst.add(sparks);

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
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.55, 0.5, 0.8);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------- temas ---------- */
const C = (h) => new THREE.Color(h);
const THEMES = [
  { // night
    clear: C(0x05071c), fog: C(0x070a2a), fogD: 0.012, exposure: 0.92, bloom: 0.55, thr: 0.8, halo: 0.25,
    white: C(0xffffff), lilac: C(0xa7b0ff), blade: C(0xd6dbff), grid: C(0x7c86f0)
  },
  { // day: céu claro, cromo prateado-lavanda (as capas claras do nuphory)
    clear: C(0xe4e9f8), fog: C(0xdfe5f7), fogD: 0.02, exposure: 1.0, bloom: 0.16, thr: 0.95, halo: 0,
    white: C(0xd5dbff), lilac: C(0x8590ec), blade: C(0xbfc7ff), grid: C(0x5a66d6)
  }
];
let themeK = 0, themeTarget = 0;
const tmpC = new THREE.Color();
const lerp = (a, b, k) => a + (b - a) * k;

function applyTheme(dt) {
  themeK = dt ? themeK + (themeTarget - themeK) * Math.min(1, dt * 1.6) : themeTarget;
  const [n, d] = THEMES, k = themeK;
  renderer.setClearColor(tmpC.lerpColors(n.clear, d.clear, k), 1);
  scene.fog.color.lerpColors(n.fog, d.fog, k);
  scene.fog.density = lerp(n.fogD, d.fogD, k);
  renderer.toneMappingExposure = lerp(n.exposure, d.exposure, k);
  chromeWhite.color.lerpColors(n.white, d.white, k);
  chromeLilac.color.lerpColors(n.lilac, d.lilac, k);
  bladeChrome.color.lerpColors(n.blade, d.blade, k);
  gridMat.uniforms.uColor.value.lerpColors(n.grid, d.grid, k);
  halo.material.opacity = lerp(n.halo, d.halo, k);
  bloom.strength = lerp(n.bloom, d.bloom, k) + dive * lerp(0.8, 0.3, k);
  bloom.threshold = lerp(n.thr, d.thr, k);
  // troca o reflexo no meio da transição (escondido pelo flash do "dive");
  // brilho aditivo some no branco, então de dia grade e riscos usam mistura normal
  const isDay = k > 0.5;
  scene.environment = isDay ? envDay : envNight;
  const blend = isDay ? THREE.NormalBlending : THREE.AdditiveBlending;
  gridMat.blending = lineMat.blending = blend;
}

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
  shared.uTime.value = t;
  shared.uDive.value = dive;

  burst.rotation.set(0.25 + mouse.y * 0.12 + scrollP * 0.5, t * 0.05 + mouse.x * 0.25 + scrollP * 1.2, -0.38);
  camera.position.set(mouse.x * 0.5, -mouse.y * 0.3, baseZ - scrollP * 3.2 - dive * 1.2);
  camera.fov = 50 + dive * 9;
  camera.updateProjectionMatrix();
  camera.lookAt(burst.position.x * 0.6, burst.position.y * 0.6, 0);

  for (let i = 0; i < NB; i++) {
    const s = bladeData[i];
    const r = s.r0 + Math.sin(t * 0.6 + s.phase) * s.amp + dive * (1.2 + s.r0 * 1.8);
    v3.copy(s.dir).multiplyScalar(r);
    qRoll.setFromAxisAngle(UP, s.roll + t * s.spin);
    qq.copy(s.q).multiply(qRoll);
    s3.set(s.s, s.len * (1 + dive * 0.35), s.s);
    m4.compose(v3, qq, s3);
    blades.setMatrixAt(i, m4);
  }
  blades.instanceMatrix.needsUpdate = true;

  ribbonMeshes.forEach((m, i) => { m.rotation.z = Math.sin(t * 0.15 + i * 2) * 0.06; });
  blob.rotation.set(t * 0.2, t * 0.3, 0);
  blob.scale.setScalar(1 + dive * 0.5);
  halo.scale.setScalar(5.5 * (1 + dive * 0.3));
  keyLight.intensity = 4 + dive * 20;

  for (let i = 0; i < LINES; i++) {
    const L = lineData[i];
    L.r += L.v * dt * (1 + dive * 9);
    if (L.r > 14) { L.r = rand(0.4, 1.5); }
    const a = L.r, b = L.r + L.len * (1 + dive * 4);
    linePos.set([L.dir.x * a, L.dir.y * a, L.dir.z * a, L.dir.x * b, L.dir.y * b, L.dir.z * b], i * 6);
  }
  lineGeo.attributes.position.needsUpdate = true;
  lineMat.opacity = 0.2 + dive * 0.5;

  sparks.rotation.y = -t * 0.02;
  gridMat.uniforms.uTime.value = t * (1 + dive * 6);
  applyTheme(dt);
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
window.TRBG.setTheme = (name) => {
  const target = name === "day" ? 1 : 0;
  if (target === themeTarget) return;
  themeTarget = target;
  document.documentElement.dataset.bg = target ? "day" : "night";
  if (reduce.matches) still(); else window.TRBG.dive();
};
window.TRBG.setColor(char[document.documentElement.dataset.char] || char.angel);

layout();
onScroll();
start();
document.documentElement.classList.add("has-3d");
