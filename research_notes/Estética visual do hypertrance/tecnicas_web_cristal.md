# Web techniques for the hypertrance / Y2K-trance "crystalline shattered glass" look (static HTML/CSS/vanilla JS)

Scope: 3D crystal/glass shards flying toward the camera, light rays and speed lines, motion blur, bloom/white blow-out, ice palette (#7fe9e6, #bff7f5, #2f6bff, #0a1a5c, lilac), chrome/glass/gel UI (WMP 9 / Sonique skin) with a cyan LCD, thin extended uppercase type, HUD micro-elements. Constraints: no build step, served by `python -m http.server`, CDN scripts only from cdnjs/jsdelivr/unpkg with exact versions, mobile-friendly, respects `prefers-reduced-motion`. Versions checked against the jsdelivr/npm/cdnjs APIs on 2026-11-03.

How to read this: items under "Cited Findings" come from the linked source. Code under "Inferences" is my own synthesis (standard CSS/JS/three.js patterns). It is not copied from a source and has not been browser-tested here.

---

## 1. Background: animated shard field / speed lines / starburst (CSS vs Canvas 2D vs WebGL), cost, pausing, reduced motion

### Takeaway
Use layers. A pure-CSS starburst (repeating-conic-gradient rays plus radial white blow-out, `mix-blend-mode: screen`) costs almost nothing and is the reduced-motion fallback. A Canvas 2D "warp" field (particles drawn as radial streaks from a vanishing point with `globalCompositeOperation = 'lighter'`) gives speed lines and fake motion blur cheaply on mobile. Use WebGL/three.js (0.187.0) with UnrealBloomPass only for real 3D refractive shards, at reduced resolution and DPR, and only when the device can handle it.

### Cited Findings
- three.js latest on npm/jsdelivr is **0.187.0** (published 2026-10-30). Earlier: 0.186.0 (2026-09-08), 0.184.0 (2026-04-16) — [jsdelivr three](https://www.jsdelivr.com/package/npm/three); npm registry `time` field (registry.npmjs.org/three, queried 2026-11-03).
- cdnjs also hosts three under the name **`three.js`**, also at 0.187.0 (api.cdnjs.com/libraries/three.js, queried 2026-11-03). For ES-module addons (`three/addons/...`), an importmap pointing to `https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js` and `.../three@0.187.0/examples/jsm/` is the usual no-build setup (paths follow the `examples/jsm/postprocessing/UnrealBloomPass.js` layout in [the three.js repo](https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/UnrealBloomPass.js)).
- **UnrealBloomPass**: imitates Unreal Engine's bloom by building a mipmap chain of bloom textures and blurring each at a different radius. Constructor `(resolution: Vector2, strength=1, radius 0..1, threshold)`. The docs example uses `1.5, 0.4, 0.85`. Tone mapping should be enabled on the renderer. The docs call it more advanced than the simpler `BloomPass` and more expensive — [three.js docs: UnrealBloomPass](https://threejs.org/docs/pages/UnrealBloomPass.html); [BloomPass](https://threejs.org/docs/pages/BloomPass.html).
- **MeshPhysicalMaterial** for glass shards: `transmission` 0–1 (opacity must stay 1 when transmission is non-zero); `thickness` (0 means thin-walled); `ior` 1.0–2.333 (default 1.5); `dispersion` gives chromatic aberration through the volume (transmissive only, realistic range 0–1); `iridescence` gives an angle-dependent RGB shift. Per the docs it "has a higher performance cost, per pixel, than other three.js materials", each enabled effect adds cost, and an environment map should always be set — [three.js docs: MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html).
- Alternative post-processing stack: **pmndrs `postprocessing` 6.39.6** (published 2026-11-01), peerDependency `three >= 0.168.0 < 0.188.0`, so it is compatible with three 0.187.0. Its v7 is still alpha/beta — [jsdelivr postprocessing](https://www.jsdelivr.com/package/npm/postprocessing); npm registry metadata.
- Other libraries (jsdelivr, 2026-11-03): **ogl 1.0.11** (minimal WebGL lib, good for a single fullscreen fragment shader); **gsap 3.15.0** (also on cdnjs, 2026-04-13); **three-stdlib 2.36.1**; **jsbarcode 3.12.3** — data.jsdelivr.com package API; api.cdnjs.com.
- Codrops "High-speed Light Trails in Three.js" (Patrick Cox, 2019): light trails drawn from one tube geometry instanced many times, which avoids a draw call per light. It also covers infinite looping and frame-rate-independent motion. It is the canonical web reference for "speed lines in a tunnel" — [Codrops](https://tympanus.net/codrops/2019/11/13/high-speed-light-trails-in-three-js/); open-source repo [Anemolo/Infinite-Lights](https://relatedrepos.com/gh/Anemolo/Infinite-Lights). The page returned 403 to my fetch, so details come from search snippets.
- A community "Light Speed" component: a full-screen WebGL hyperspace warp with bloom streaks, built on three.js + React Three Fiber (needs a build, so useful only as a visual reference) — [21st.dev Light Speed](https://21st.dev/@chamaac/components/light-speed.md).
- Canvas compositing: `'lighter'` means "where both shapes overlap, the color is determined by adding color values" (additive, produces white blow-out where streaks cross). `'screen'` inverts, multiplies and inverts again, giving a softer lighten — [MDN globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation).
- In motion graphics the classic warp look comes from radial blur plus a matte choker to keep edges crisp. The web equivalent is radial streaks with a sharp head and a faded tail — [lesterbanks / Evan Abrams AE tutorial](https://lesterbanks.com/2018/07/make-warp-speed-effect-ae/).
- `prefers-reduced-motion`: values `no-preference` and `reduce`; Baseline widely available since January 2020. MDN warns that scaling or panning large objects can trigger vestibular discomfort, and suggests replacing such motion with opacity-only fades — [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

### Inferences

**Cost ranking (my assessment):**
| Approach | GPU/CPU cost | Mobile | Look |
|---|---|---|---|
| CSS conic/radial gradients, static or slowly rotated | very low (rotating one composited layer) | safe | starburst, rays, blow-out; no depth |
| CSS + `filter: blur()` on animated layers | medium to high (blur re-rasterizes on change) | use sparingly | soft bloom |
| Canvas 2D streak particles, 300–800 particles, `'lighter'` | low to medium, CPU-bound, scales with count × DPR | OK at DPR ≤ 1.5 | speed lines, fake motion blur, white core |
| Single fullscreen fragment shader (ogl or raw WebGL) | medium, scales with pixel count | OK at half resolution | rays, caustics, procedural shards |
| three.js instanced shards + MeshPhysicalMaterial transmission + UnrealBloomPass | high (transmission needs an extra scene render; bloom adds several blur passes) | desktop only, or a degraded mobile mode | true refractive crystals with bloom |

Shard tip: for shards that fly *toward the camera*, use `MeshStandardMaterial`/`MeshBasicMaterial` with an env map, or a fake-refraction shader with high `metalness`/`emissive` edges, rather than transmission. Fast-moving shards hide the lack of true refraction, and you save the transmission pass. Keep `dispersion`/`transmission` for one hero crystal.

**Recipe A, CSS starburst plus blow-out (also the reduced-motion fallback):**
```css
:root{--ice1:#7fe9e6;--ice2:#bff7f5;--blue:#2f6bff;--navy:#0a1a5c;--lilac:#c7b8ff;}
.burst{position:fixed;inset:0;z-index:-1;background:
  radial-gradient(circle at 50% 50%, #fff 0 2%, var(--ice2) 6%, transparent 35%),
  repeating-conic-gradient(from 0deg at 50% 50%,
     rgb(191 247 245 / .22) 0 1.2deg, transparent 1.2deg 7deg),
  radial-gradient(ellipse at 50% 50%, var(--blue) 0%, var(--navy) 70%);
  mix-blend-mode:normal;}
.burst::after{content:"";position:absolute;inset:-50%;
  background:repeating-conic-gradient(from 3deg, rgb(127 233 230/.15) 0 .6deg, transparent .6deg 11deg);
  mix-blend-mode:screen;animation:spin 60s linear infinite;}
@keyframes spin{to{transform:rotate(1turn)}}
@media (prefers-reduced-motion: reduce){.burst::after{animation:none}}
```

**Recipe B, Canvas 2D warp streaks from a vanishing point:**
```js
const c=document.querySelector('#warp'),x=c.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let W,H,DPR=Math.min(devicePixelRatio,1.5),P=[],run=true;
function size(){W=c.width=innerWidth*DPR;H=c.height=innerHeight*DPR;}
addEventListener('resize',size);size();
for(let i=0;i<(innerWidth<700?250:600);i++)P.push({a:Math.random()*6.283,r:Math.random()*W,v:.5+Math.random()*2});
function frame(t){
  if(!run)return;
  x.globalCompositeOperation='source-over';
  x.fillStyle='rgba(10,26,92,.35)';x.fillRect(0,0,W,H);   // trail = motion blur
  x.globalCompositeOperation='lighter';
  const cx=W/2,cy=H/2;
  for(const p of P){
    const r0=p.r, r1=p.r+p.v*p.r*.08+2;                    // streak lengthens with distance
    p.r+=p.v*(1+p.r*.02); if(p.r>Math.hypot(W,H)/2)p.r=Math.random()*20;
    const ca=Math.cos(p.a),sa=Math.sin(p.a);
    x.strokeStyle=`rgba(191,247,245,${Math.min(1,p.r/W*3)})`;
    x.lineWidth=DPR*(.5+p.r/W*2);
    x.beginPath();x.moveTo(cx+ca*r0,cy+sa*r0);x.lineTo(cx+ca*r1,cy+sa*r1);x.stroke();
  }
  requestAnimationFrame(frame);
}
function setRun(v){ if(v&&!run){run=true;requestAnimationFrame(frame)} else run=v; }
document.addEventListener('visibilitychange',()=>setRun(!document.hidden&&!reduce.matches));
new IntersectionObserver(([e])=>setRun(e.isIntersecting&&!reduce.matches)).observe(c);
reduce.addEventListener('change',()=>setRun(!reduce.matches));
if(!reduce.matches)requestAnimationFrame(frame); else {run=false;/* draw one static frame or show .burst */}
```
Shards in 2D: draw random thin triangles (3 points around a center, scaled by `z`) with a `createLinearGradient` from `--ice2` to transparent. Project with `sx = cx + X/z*f`, decrement `z` each frame, and use `'lighter'` for the crossing glints.

**Recipe C, three.js no-build setup (importmap):**
```html
<script type="importmap">{"imports":{
 "three":"https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js",
 "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
const r=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
r.setPixelRatio(Math.min(devicePixelRatio, innerWidth<700?1:1.5));
r.toneMapping=THREE.ACESFilmicToneMapping;
// InstancedMesh of ~200 tetra/octahedron shards; move z toward camera, wrap; rotate per instance
const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth/2,innerHeight/2),1.2,0.4,0.8); // half-res bloom
// composer: RenderPass -> bloom -> OutputPass; pause loop via r.setAnimationLoop(null) on hidden/offscreen/reduced
</script>
```
- Pausing: `renderer.setAnimationLoop(null)` when `document.hidden`, when the IntersectionObserver reports the canvas offscreen, or when reduced motion is on. Resume with `setAnimationLoop(loop)`.
- Mobile tier: if `navigator.hardwareConcurrency<=4`, or a probe of the first ~60 frames shows mean frame time over 20 ms, drop bloom or fall back to Recipe B.
- Bloom without post-processing: draw a pre-blurred sprite (radial gradient PNG/canvas) additively behind each bright element. On mobile this is much cheaper than UnrealBloomPass.

### Gaps
- No measured fps numbers for UnrealBloomPass or transmission on specific mobile GPUs. I found no reliable benchmark, so profile on a real mid-range Android.
- Full Codrops article text was blocked (403). Implementation details beyond the summary are unverified.
- I did not verify the specific three.js release notes for 0.18x changes to `EffectComposer`/`OutputPass` file paths. Check that the `examples/jsm/postprocessing/OutputPass.js` path exists at 0.187.0 before relying on it.

---

## 2. Chrome and glass CSS recipes (brushed/blue chrome, specular, inset shadows, backdrop glass, gel/aqua buttons, glare), plus CodePen and collection references

### Takeaway
Chrome comes from hard-stop multi-band linear gradients: light sky top, a sharp dark horizon band at about 50%, and a bright bottom bounce. Fill text with them via `background-clip:text`. Make gel/aqua buttons from a saturated vertical gradient, a white top "glare" pseudo-element with a rounded bottom edge, inset shadows and a soft outer glow. Use `backdrop-filter` glass only on small, static panels, because blur over moving or scrolling backgrounds is the main source of mobile jank.

### Cited Findings
- Chrome text technique: background-image gradient, `background-clip: text` (+ `-webkit-background-clip`), and transparent color / `-webkit-text-fill-color: transparent` — [30 Seconds of Code: gradient text](https://www.30secondsofcode.org/css/s/gradient-text).
- The metallic look depends on hard stops rather than smooth fades, for example a 180deg gradient with a sharp dark-blue band at 50% and light stops above and below — [Gradient text showcase](https://gradientshub.pages.dev/blog/css-text-gradient-showcase-and-code-tutorial); example pen [ricoui "Text Gradient 001"](https://codepen.io/ricoui/pen/GggLJzP); [codepen twit96](https://codepen.io/twit96/pen/Babzyew) (not opened).
- Y2K web traits: translucent, iridescent, shiny, with chrome/silver panels, chrome borders and pearlescent buttons — [Webflow: Y2K aesthetic](https://webflow.com/blog/y2k-aesthetic); [ThePlus: Y2K web design](https://theplusaddons.com/blog/y2k-web-design/).
- Classic aqua button without images: a gradient body plus a separate "glare" element for the highlight (Tomomi Imura, 2009) — [girliemac.com](https://girliemac.com/blog/2009/04/30/css3-gradients-no-image-aqua-button).
- Frutiger Aero Archive, "How to nail the Web 2.0 gloss look": the author uses mostly CSS for buttons and notes that gradients get you part of the way, with less range than images — [frutigeraeroarchive.org](https://frutigeraeroarchive.org/blog/posts/20_09_2025) (403 on fetch; snippet only).
- **Make Aero** button generator exports HTML/CSS with adjustable colour, size and gloss, using OKLCH — [Visnalize/makeaero (mirror)](https://github.gg22.workers.dev/Visnalize/makeaero); [aero-btn-generator.pages.dev](https://aero-btn-generator.pages.dev/about).
- An aqua design system example: white top highlight fading to teal, inset shadows, hover lift / active press transforms — [mintlify windows-xp-developer aqua](https://mintlify.wiki/apursley2012/windows-xp-developer/concepts/aqua-design-system).
- Trend overviews with palettes and components: [daisyUI trends: Frutiger Aero](https://trends.daisyui.com/trend/frutiger-aero/), [daisyUI trends: Cybercore](https://trends.daisyui.com/trend/cybercore/); resource roundup (fonts, Figma kits) [designpieces.com, Aug 2026](https://www.designpieces.com/2026/08/frutiger-aero-design-resources/).
- backdrop-filter cost: blur cost grows with radius and blurred area. A sticky header with backdrop blur caused scroll jank because the backdrop changes every frame, and the fix was an opaque background with blur kept on static cards — [lightnode PR #175](https://github.com/marinom2/lightnode/pull/175); [OpenReplay](https://blog.openreplay.com/creating-blurred-backgrounds-css-backdrop-filter/). The numeric rules of thumb on the web ("3–5 blurs", "≤8px") are unsourced — [digitalthriveai](https://www.digitalthriveai.com/en-us/resources/web-development/the-backdrop-filter-css-property/).

### Inferences

**Blue chrome title (WMP9 / trance CD-cover chrome):**
```css
.chrome{font:400 clamp(2rem,8vw,6rem)/1 "Michroma",sans-serif;letter-spacing:.12em;text-transform:uppercase;
  background:linear-gradient(180deg,#fff 0%,#bff7f5 18%,#7fe9e6 38%,#0a1a5c 49%,#2f6bff 51%,#bff7f5 72%,#fff 86%,#7fe9e6 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 12px rgb(127 233 230/.6));}
```
(`text-shadow` does not work with transparent fill. Use `filter: drop-shadow` for the glow.)

**Brushed metal panel (WMP 9 / Sonique-style skin body):**
```css
.skin{border-radius:28px 28px 60px 18px;            /* organic, asymmetric skin silhouette */
  background:
    repeating-linear-gradient(90deg,rgb(255 255 255/.05) 0 1px,transparent 1px 3px),   /* brushing */
    linear-gradient(180deg,#e9f4ff 0%,#9fb4d6 45%,#5b6f99 50%,#c9d8f0 80%,#eef6ff 100%);
  box-shadow:inset 0 1px 0 #fff, inset 0 -2px 6px rgb(10 26 92/.5), 0 10px 30px rgb(10 26 92/.45);
  border:1px solid #2f6bff33;}
```
For extra-organic Sonique shapes, use `clip-path: path(...)` or an inline SVG `<path>` frame. `border-radius` alone can't make the blobby lobes.

**Gel/aqua button:**
```css
.gel{position:relative;border:0;border-radius:999px;padding:.6em 1.6em;color:#fff;
  font:600 .75rem "Chakra Petch",sans-serif;letter-spacing:.2em;text-transform:uppercase;
  background:linear-gradient(180deg,#7fe9e6 0%,#2f6bff 55%,#0a1a5c 100%);
  box-shadow:inset 0 -6px 12px rgb(127 233 230/.7), inset 0 1px 1px rgb(255 255 255/.8), 0 2px 8px rgb(47 107 255/.6);}
.gel::before{content:"";position:absolute;inset:2px 8% 50% 8%;border-radius:999px 999px 40% 40%/999px 999px 100% 100%;
  background:linear-gradient(180deg,rgb(255 255 255/.9),rgb(255 255 255/.1));pointer-events:none;}  /* glare */
.gel:active{transform:translateY(1px);filter:brightness(.92);}
.gel:focus-visible{outline:2px solid #bff7f5;outline-offset:3px;}
```

**Glass card plus diagonal glare sweep:**
```css
.glass{background:linear-gradient(135deg,rgb(191 247 245/.25),rgb(47 107 255/.08));
  backdrop-filter:blur(8px) saturate(140%);-webkit-backdrop-filter:blur(8px) saturate(140%);
  border:1px solid rgb(191 247 245/.5);box-shadow:inset 0 0 0 1px rgb(255 255 255/.15);overflow:hidden;position:relative;}
.glass::after{content:"";position:absolute;inset:-50%;
  background:linear-gradient(115deg,transparent 40%,rgb(255 255 255/.35) 48%,transparent 56%);
  transform:translateX(-60%);animation:glare 6s ease-in-out infinite;}
@keyframes glare{60%,100%{transform:translateX(60%)}}
@media (prefers-reduced-motion:reduce){.glass::after{animation:none;transform:none;opacity:.4}}
@supports not (backdrop-filter:blur(1px)){.glass{background:rgb(10 26 92/.85)}}
```

**Cyan LCD:** dark teal panel `#03201f`, inner shadow, text in `#7fe9e6` with `text-shadow:0 0 4px #7fe9e6`, and a "ghost segments" layer behind it (the same string as `8888` at 8% opacity) to mimic unlit LCD segments. Optional scanline overlay (see section 3).

### Gaps
- I found no curated CodePen *collection* specifically for "WMP 9 skin" or "Sonique skin" CSS. Searches returned only generic Y2K chrome/aqua material. Original skins live in skin archives (e.g. the Winamp/WMP skin museum community), which I did not verify.
- The Frutiger Aero Archive post body could not be fetched (403), so none of its code was verified.

---

## 3. Glow/bloom text, lens flare, chromatic aberration, scanlines on video

### Takeaway
Stack `text-shadow` layers (white core, cyan halo, blue wide halo) for bloom text. Use offset R/B `text-shadow` or cloned layers with `mix-blend-mode: screen` for chromatic aberration. Build lens flares from radial gradients on pseudo-elements blended with `screen`. Do scanlines with a `repeating-linear-gradient` overlay (pointer-events none). In WebGL, three.js `dispersion` gives real CA through glass.

### Cited Findings
- RGB split via multiple comma-chained `text-shadow`s, offset in different directions and coloured R/G/B. For animation, snap between states with keyframes that have near-zero transition — [jonathanmh.com: CSS RGB/CMYK channel splitting](https://jonathanmh.com/p/css-rgb-cmyk-channel-splitting).
- Alternative: clone the text into three absolutely positioned layers with `mix-blend-mode` (difference) and animate them apart — [dev.to kapantzak: RGB split effect](https://www.dev.to/kapantzak/the-rgb-split-effect-with-css-and-a-bit-of-javascript-4j4i).
- Commercial Framer components do the same with transforms and `mix-blend-mode: screen` — [Framer chromatic aberration](https://www.framer.com/marketplace/components/chromatic-aberration/).
- Y2K skill guides recommend neon `text-shadow` glow alongside chrome gradients — [y2k-design skill](https://claudeskills.info/skills/sickn33/agentic-awesome-skills/y2k-design/) (low-authority aggregator).
- Physically based CA in 3D: `MeshPhysicalMaterial.dispersion` ("angular separation of colors (chromatic aberration)") — [three.js docs](https://threejs.org/docs/pages/MeshPhysicalMaterial.html).
- Porter Robinson cited the 2000s digital-art trope of tiny, blurry, semi-transparent floating text as an influence on Virtual Self — [Dazed interview](https://www.dazeddigital.com/music/article/39536/1/porter-robinson-virtual-world-y2k-faves-interview) (summarized via search).

### Inferences
```css
.bloom{color:#fff;text-shadow:0 0 1px #fff,0 0 6px #bff7f5,0 0 14px #7fe9e6,0 0 32px #2f6bff,0 0 64px rgb(47 107 255/.6);}
.ca{color:#fff;text-shadow:-1.5px 0 rgb(255 0 80/.7),1.5px 0 rgb(0 200 255/.8);}         /* static CA */
.flare{position:relative}
.flare::before{content:"";position:absolute;left:50%;top:50%;width:60vmax;height:2px;translate:-50% -50%;
  background:linear-gradient(90deg,transparent,#bff7f5 45%,#fff 50%,#bff7f5 55%,transparent);mix-blend-mode:screen;filter:blur(1px);}
.flare::after{content:"";position:absolute;left:50%;top:50%;width:18vmax;aspect-ratio:1;translate:-50% -50%;
  background:radial-gradient(circle,#fff 0 3%,rgb(191 247 245/.6) 8%,transparent 40%),
             radial-gradient(circle,transparent 55%,rgb(199 184 255/.25) 58%,transparent 62%);   /* lilac ring ghost */
  mix-blend-mode:screen;pointer-events:none;}
.scan{position:relative}
.scan::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,rgb(0 0 0/.25) 0 1px,transparent 1px 3px);mix-blend-mode:multiply;}
```
- Scanlines on `<video>`: wrap the video in `.scan`. The overlay is static, so it is cheap. Avoid animating the scanline position (flicker affects photosensitive users). Keep any flashing under 3 per second (the WCAG 2.3.1 threshold; that is my recollection of the guideline and was not fetched here).
- "White blow-out": layer a full-screen `radial-gradient(#fff, transparent)` with `mix-blend-mode: screen` and animate only its opacity. That is cheap, and under reduced motion you can hold it static.
- Avoid animating `filter: blur()` or large `text-shadow` radii every frame. Animate `opacity`/`transform` of pre-glowed layers instead.

### Gaps
- No authoritative performance data for large `text-shadow` stacks. My guidance here comes from general compositing knowledge, not a source.
- The WCAG flash threshold page itself was not fetched in this session.

---

## 4. Fonts: free Google Fonts for thin, wide techno type, and pairings

### Takeaway
For the title, **Michroma** (400 only, very wide) or **Syncopate** (400/700, wide, all-caps feel) is closest to the extended trance-CD look. **Saira** is the most flexible because it has a real width axis (75–125%) plus weights 100–900. Use **Chakra Petch** (300–700) or **Exo 2** (100–900 variable) for UI. Use **Share Tech Mono** for micro HUD text, and **Doto** (variable dot-matrix, 100–900 plus a ROND axis) or **VT323** for the LCD. Load only 3–4 families.

### Cited Findings (weights verified against fonts.googleapis.com css2 on 2026-11-03)
| Family | Available weights/axes | Note |
|---|---|---|
| Michroma | 400 only | very wide geometric; no thin weight |
| Syncopate | 400, 700 | wide, small-caps-like lowercase |
| Orbitron | variable 400–900 | sci-fi; no light weight, clichéd |
| Unica One | 400 | condensed caps, not wide |
| Tektur | variable 400–900 | angular techno; a wdth axis may exist but my check was inconclusive |
| Chakra Petch | 300, 400, 500, 600, 700 | angular, readable at small sizes |
| Exo 2 | variable 100–900 | has true thin weights |
| Saira | variable wght 100–900 and **wdth 75–125%** | can be both extended *and* thin |
| Audiowide | 400 | rounded retro display |
| Aldrich | 400 | squarish UI/HUD |
| Share Tech Mono | 400 | monospace HUD |
| VT323 | 400 | pixel terminal |
| Doto | variable 100–900, plus ROND axis | dot-matrix, LCD |
| Jura | variable 300–700 | thin techno alternative |
| Libre Barcode 128 / 39 | 400 | barcodes (see section 5) |

Source: Google Fonts CSS API responses (`https://fonts.googleapis.com/css2?family=<name>:wght@...`), queried 2026-11-03; [Google Fonts](https://fonts.google.com/).

### Inferences
- The suggested set is Michroma (title) + Saira (variable, `font-stretch:125%; font-weight:200` for thin-extended subtitles) + Share Tech Mono (HUD) + Doto (LCD). One URL: `https://fonts.googleapis.com/css2?family=Michroma&family=Saira:wdth,wght@75..125,100..900&family=Share+Tech+Mono&family=Doto:wght@100..900&display=swap`.
- Michroma has no thin weight. For a thin-wide title, Saira at wdth 125 / wght 100–200 with `letter-spacing:.3em` is the only verified free option among those tested.
- For micro HUD text, set `font-size:10–11px` minimum with `letter-spacing:.15em`. Below about 10px, text fails legibility on mobile, so mark purely decorative micro text `aria-hidden="true"`.
- Orbitron and Audiowide read as "generic sci-fi" rather than late-90s trance. Use them sparingly.

### Gaps
- I couldn't confirm Tektur's width-axis range (the query returned an ambiguous response).
- I didn't compare file sizes per family.

---

## 5. HUD micro-elements: crosshairs, corner brackets, barcodes, tick rulers, catalog codes, accessible ticker

### Takeaway
Everything can be CSS gradients or inline SVG, with no library. For barcodes, use the **Libre Barcode 128** Google Font (text in, bars out) or **JsBarcode 3.12.3** for scannable SVG. Mark decorative HUD elements `aria-hidden`. A marquee should be CSS-transform based, pausable, and stopped under reduced motion.

### Cited Findings
- Libre Barcode fonts (Lasse Fister, on Google Fonts since 2017, SIL OFL) render Code 39, Code 128 and EAN-13/UPC, with or without text below. "Libre Barcode 128 Text" adds the human-readable line, and Code 128 needs no wrapping characters (Code 39 needs `*...*`) — [fontsource Libre Barcode 128](https://fontsource.org/fonts/libre-barcode-128/about); [Ben Collins: barcodes in Sheets](https://www.benlcollins.com/?p=18302).
- Note: a truly *scannable* Code 128 needs check-digit encoding. The Libre Barcode project provides an encoder tool for that — [feedbagel: Libre Barcode project](https://feedbagel.com/post/libre-barcode-project).
- JsBarcode latest is 3.12.3 on npm/jsdelivr (v4 still alpha) — data.jsdelivr.com.
- MDN reduced-motion guidance (section 1) applies to tickers and marquees — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

### Inferences
```css
/* corner brackets on any box */
.hud{--c:#7fe9e6;--l:14px;--w:1px;padding:12px;background:
 linear-gradient(var(--c) 0 0) top left/var(--l) var(--w),linear-gradient(var(--c) 0 0) top left/var(--w) var(--l),
 linear-gradient(var(--c) 0 0) top right/var(--l) var(--w),linear-gradient(var(--c) 0 0) top right/var(--w) var(--l),
 linear-gradient(var(--c) 0 0) bottom left/var(--l) var(--w),linear-gradient(var(--c) 0 0) bottom left/var(--w) var(--l),
 linear-gradient(var(--c) 0 0) bottom right/var(--l) var(--w),linear-gradient(var(--c) 0 0) bottom right/var(--w) var(--l);
 background-repeat:no-repeat;}
/* tick ruler */
.ruler{height:10px;background:
 repeating-linear-gradient(90deg,#bff7f5 0 1px,transparent 1px 10px) bottom/100% 4px no-repeat,
 repeating-linear-gradient(90deg,#bff7f5 0 1px,transparent 1px 50px) bottom/100% 10px no-repeat;}
/* grid */
.grid{background-image:linear-gradient(rgb(127 233 230/.12) 1px,transparent 1px),linear-gradient(90deg,rgb(127 233 230/.12) 1px,transparent 1px);background-size:24px 24px;}
/* decorative barcode with no font */
.barcode{height:28px;width:120px;background:repeating-linear-gradient(90deg,#bff7f5 0 1px,transparent 1px 3px,#bff7f5 3px 5px,transparent 5px 6px,#bff7f5 6px 7px,transparent 7px 10px);}
.code128{font-family:"Libre Barcode 128",monospace;font-size:40px;color:#bff7f5}
.micro{font:10px/1.2 "Share Tech Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:#7fe9e6;opacity:.8}
```
- Crosshair SVG: `<svg aria-hidden="true" viewBox="0 0 40 40" stroke="#7fe9e6" fill="none"><circle cx="20" cy="20" r="8"/><path d="M20 0v14M20 26v14M0 20h14M26 20h14"/></svg>`.
- Catalog codes: generate them in JS, e.g. `HT-${year}-${String(n).padStart(4,'0')} // CRYSTAL.SYS v2.0`, rendered in `.micro`.
- Accessible ticker: make the visible track `aria-hidden="true"` and put the same text once in a visually hidden element (or a normal `<p>`). Animate `transform: translateX` on a duplicated track. Pause on `:hover`/`:focus-within`, add a visible pause button (WCAG 2.2.2 requires a pause control for motion over 5 s; my recollection, not fetched), and under `prefers-reduced-motion: reduce` set `animation:none` and let it wrap or scroll horizontally.
```css
.ticker{overflow:hidden;white-space:nowrap}
.ticker__track{display:inline-flex;gap:3rem;animation:tick 30s linear infinite}
.ticker:hover .ticker__track,.ticker:focus-within .ticker__track,.ticker[data-paused] .ticker__track{animation-play-state:paused}
@keyframes tick{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.ticker__track{animation:none}.ticker{overflow-x:auto}}
```

### Gaps
- I did not fetch WCAG 2.2.2 / 2.3.1 primary texts. The thresholds cited are from memory, so verify them at w3.org/WAI.

---

## 6. Real-world examples (Virtual Self, hypertrance, Y2K portfolios, Codrops and Awwwards demos)

### Takeaway
Direct examples of the exact "crystal shard" hypertrance web look are scarce. **Virtual Self** (Porter Robinson, 2017) is the main reference: an early-message-board-style, cryptic, layered site with hidden text and a 360° video. The **hypertrance** label is mostly a music scene (nuphory's project). The best technique references are Codrops (light trails), the Web Design Museum's Y2K exhibition, and the daisyUI/Webflow trend write-ups.

### Cited Findings
- Virtual Self's site was designed to look like an early-internet message board, with cryptic messages and a "looping wormhole" of interactive digital art. Fans found hidden text and images in the source and a hidden old-HTML-style forum page. The source links a six-second 360° video of grey flashes, and phrases are spelled across the browser tab while tracks play. The articles don't name any technologies — [Dancing Astronaut](https://dancingastronaut.com/2017/11/virtual-self-fans-uncover-hidden-text-images-360-degree-video-virtual-self-website-source-code/); [The FADER interview](https://www.thefader.com/2018/02/28/porter-robinson-virtual-self-interview); [Wikipedia: Virtual Self (EP)](https://en.wikipedia.org/wiki/Virtual_Self_(EP)).
- Robinson named *Serial Experiments Lain* as a major influence and linked a Lain-style fansite by the artist Fauux — [Dazed](https://www.dazeddigital.com/music/article/39536/1/porter-robinson-virtual-world-y2k-faves-interview).
- "Hypertrance" as a label: nuphory's Bandcamp describes it as "the ultimate in y2k music and art", and an Image-Line forum post describes a "Hypertrance" FLEX pack as a tribute to the golden era of trance. The site hypertrance.eu was linked but did not appear in results — [hypertrance.bandcamp.com](https://hypertrance.bandcamp.com/music); [Image-Line forum](https://forum.image-line.com/viewtopic.php?p=2006618).
- Codrops "High-speed Light Trails in Three.js" (instanced tubes, infinite loop) — [Codrops](https://tympanus.net/codrops/2019/11/13/high-speed-light-trails-in-three-js/).
- The Web Design Museum has a Y2K exhibition and galleries of early-2000s Flash-era sites (useful for authentic chrome/skin UI references) — [Web Design Museum: Y2K exhibition](https://www.webdesignmuseum.org/exhibitions/y2k-aesthetic-in-web-design); [gallery](https://www.webdesignmuseum.org/gallery/style-texture-or-y2k-aesthetic). The page returned 403 to my fetch.
- Contemporary write-ups: [Webflow: Y2K aesthetic](https://webflow.com/blog/y2k-aesthetic) (cites Griffo House as a monochrome reinterpretation); [Chris Lemke design reference: Y2K Futurism](https://chrislemke.github.io/website_designs/examples/Y2K_Futurism.html) (describes Neo-Y2K mixing glitchcore and vaporwave with chrome motifs); [Wikipedia: Y2K aesthetic](https://en.wikipedia.org/wiki/Y2K_aesthetic) (cybercore as a revivalist term).

### Inferences
- Virtual Self's lesson is atmosphere over tech: layered, semi-transparent micro text, hidden easter eggs and looping media. It is achievable with static HTML (a `<video loop muted playsinline>` and absolutely positioned `.micro` text at low opacity with slight `filter: blur(.4px)`).
- For an authentic WMP 9 / Sonique feel, Web Design Museum screenshots and skin archives are better references than modern CodePens, which skew toward Frutiger Aero (green/sky, bubbly) rather than icy trance chrome.

### Gaps
- I could not reach hypertrance.eu or the virtualself.co archive (Wayback) in this session, so I can't say what those sites use technically.
- No Awwwards site with a specific "glass shatter toward camera" effect was verified. Searches returned only generic results, so this needs a targeted Awwwards/Codrops search ("shatter", "fracture", "Voronoi glass").
