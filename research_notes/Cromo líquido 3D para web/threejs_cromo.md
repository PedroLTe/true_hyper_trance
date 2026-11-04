# Cromo líquido / Y2K chrome em tempo real com three.js (vanilla, importmap, three@0.187.0)

Escopo: como fazer UMA forma de cromo derretido (estrela/burst com tentáculos e espinhos afinando em ponta, fitas em laço, partes translúcidas, reflexos azul/lilás com brilhos rosa-violeta) em tempo real num site estático sem bundler. Pesquisa feita em 2026-11-03/04. Caminhos do CDN verificados com `curl` contra cdn.jsdelivr.net (status HTTP 200/404 anotado abaixo).

Diagnóstico da tentativa atual (inferência, não tem fonte): fitas procedurais + lâminas instanciadas + esfera deslocada por seno são malhas separadas. As interseções delas ficam duras (descontinuidade de normal) e cada peça tem a própria silhueta. O "derretido" do cromo líquido vem justamente de normais contínuas nas junções. Isso exige um único campo de distância/isosuperfície (SDF com smooth-min, ou metaballs) ou então uma malha única modelada (GLB). Mudar só o material ou o ambiente não resolve.

---

## 1. SDF raymarched num fragment shader (smin de cones/cápsulas + núcleo esférico + toros como fitas)

### Takeaway
É a abordagem que dá diretamente "um objeto de cromo derretido": cada espinho (round cone afinando até quase raio 0), o núcleo e as fitas (toros / toros cortados) se juntam com smooth-min polinomial. A normal vem do gradiente (técnica do tetraedro, 4 avaliações). Com cerca de 10 a 20 primitivas, 64 a 96 passos e o raymarch restrito a uma esfera envolvente, costuma rodar a 60 fps num laptop. O custo cresce com o número de pixels, então escala de resolução (0.5 a 0.75) é a alavanca principal no celular.

### Cited Findings
- Smooth-min polinomial quadrático **normalizado** do iq (com essa normalização, `k` passa a ser a espessura da junção em unidades de distância; é também quanto a bounding box precisa crescer para conter a mistura): — [iq, smooth minimum](https://iquilezles.org/articles/smin/)
  ```glsl
  float smin( float a, float b, float k ){ k *= 4.0; float h = max(k-abs(a-b),0.0)/k; return min(a,b) - h*h*k*(1.0/4.0); }
  // cubic (mais suave, C2):  k *= 6.0; ... return min(a,b) - h*h*h*k*(1.0/6.0);
  ```
- O mesmo artigo traz uma variante que devolve também o **fator de mistura** (`vec2(dist, blend)`), útil para misturar materiais (por exemplo, núcleo cromado e fita de vidro) na junção: — [iq, smooth minimum](https://iquilezles.org/articles/smin/)
  ```glsl
  vec2 smin( float a, float b, float k ){ float h = 1.0 - min(abs(a-b)/(4.0*k),1.0); float w=h*h; float m=w*0.5; float s=w*k;
    return (a<b) ? vec2(a-s,m) : vec2(b-s,1.0-m); }
  ```
- Primitivas exatas da lista do iq. São as mais úteis aqui: `sdCapsule(p,a,b,r)`, `sdRoundCone(p,a,b,r1,r2)` (cone com pontas arredondadas e raios diferentes entre dois pontos arbitrários; é o espinho ideal com r2 de 0.005 a 0.02), `sdCappedCone(p,a,b,ra,rb)` (shadertoy tsSXzK) e `sdTorus(p, vec2(R,r))`. A página diz que esse primeiro bloco é de SDFs "exatas" e avisa que há muitas implementações erradas por aí: — [iq, distance functions](https://iquilezles.org/articles/distfunctions/) (round cone: https://www.shadertoy.com/view/tdXGWr ; capped cone: https://www.shadertoy.com/view/tsSXzK)
  ```glsl
  float sdCapsule( vec3 p, vec3 a, vec3 b, float r ){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
  float sdTorus( vec3 p, vec2 t ){ vec2 q = vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
  float sdRoundCone( vec3 p, vec3 a, vec3 b, float r1, float r2 ){
    vec3 ba=b-a; float l2=dot(ba,ba); float rr=r1-r2; float a2=l2-rr*rr; float il2=1.0/l2;
    vec3 pa=p-a; float y=dot(pa,ba); float z=y-l2; vec3 t=pa*l2-ba*y; float x2=dot(t,t);
    float y2=y*y*l2; float z2=z*z*l2; float k=sign(rr)*rr*rr*x2;
    if( sign(z)*a2*z2>k ) return sqrt(x2+z2)*il2 - r2;
    if( sign(y)*a2*y2<k ) return sqrt(x2+y2)*il2 - r1;
    return (sqrt(x2*a2*il2)+y*rr)*il2 - r1; }
  ```
- O iq também lista `opElongate` (exato, preserva a distância), `opOnion` (`abs(d)-thickness`, casca oca, útil para fitas finas ou partes de vidro) e `sdCappedTorus` (arco de toro: https://www.shadertoy.com/view/tl23RK, bom para fitas em laço que não fecham). Mudar a métrica (normas não euclidianas) dá só um limite inferior e pede mais passos, e ele não recomenda: — [iq, distance functions](https://iquilezles.org/articles/distfunctions/)
- Normais pela **técnica do tetraedro** (4 avaliações em vez das 6 das diferenças centrais, sem viés direcional). No WebGL o compilador pode inlinear `map()` 4 vezes e travar ou demorar para compilar. O truque é um laço com zero não constante (`#define ZERO min(iFrame,0)`; em three, um uniform int com valor 0): — [iq, normals for an SDF](https://iquilezles.org/articles/normalsSDF/)
  ```glsl
  vec3 calcNormal(vec3 p){ const float h=0.0005; vec3 n=vec3(0.0);
    for(int i=ZERO;i<4;i++){ vec3 e=0.5773*(2.0*vec3((((i+3)>>1)&1),((i>>1)&1),(i&1))-1.0); n+=e*map(p+e*h); }
    return normalize(n); }
  ```
- Integração mínima em three (Codrops, 2025): `PlaneGeometry(2,2)` + `RawShaderMaterial` com uniform `uResolution`. O vertex shader repassa a posição em clip space, o fragment faz o sphere tracing (no exemplo, `ITR = 16`, `EPS = 1e-4`, câmera ortográfica) e as normais por diferenças centrais. O smooth-min usado é o exponencial `-log(exp(-k*d1)+exp(-k*d2))/k`. O "líquido" vem de uma cor que depende do vetor refletido `reflect(rayDir, normal)` e passa por ruído 3D animado no tempo, ou seja, um ambiente procedural sem cubemap: — [Codrops: Interactive, Droplet-like Metaballs with Three.js and GLSL (Yuki Kojima, 2025-06-09)](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/)
- Thread recente no fórum three.js sobre a mesma ideia (quad de tela cheia, sphere tracing por pixel, normais pelo gradiente, rim de Fresnel, soft-min log-sum-exp misturando forma e cor, rotação aplicada como transformação inversa para manter a distância estável). Demo: https://fwdapps.net/l/sdf/ — [discourse.threejs.org: Raymarching SDF shapes, soft-min color blends](https://discourse.threejs.org/t/raymarching-sdf-shapes-soft-min-color-blends/89570)
- A biblioteca **three-raymarcher** (danielesteban, MIT) mostra que dá para fazer SDF com **PBR indireto usando um envMap PMREM (CubeUV)** carregado com RGBELoader + PMREMGenerator, além de `metalness`/`roughness`, `blending` (união suave global), `resolution` (os exemplos usam 0.5, ou seja 2x de downsampling) e `conetracing` como antialias. As formas dos exemplos são box, capsule e sphere (sem cone, sem toro), e não há luz direta: — [GitHub danielesteban/three-raymarcher](https://github.com/danielesteban/three-raymarcher)
- Custo de raymarch é proporcional aos pixels. Renderizar a 75% da resolução corta cerca de metade dos pixels (aceleração teórica de ~2x): — [blenderartists, ConjureSDF](https://blenderartists.org/t/conjuresdf-smooth-non-destructive-booleans/1478671/218)
- O Codrops TSL (2024) faz cena líquida raymarched com React Three Fiber + Three Shading Language, o que pede WebGPURenderer. É referência para uma variante TSL e aponta o "Painting with Math: A Gentle Study of Raymarching" de Maxime Heckel como leitura aprofundada: — [Codrops: Liquid Raymarching Scene Using TSL](https://tympanus.net/codrops/2024/07/15/how-to-create-a-liquid-raymarching-scene-using-three-js-shading-language/)

### Inferences
- **Receita concreta para a estrela** (inferência, montada a partir das fórmulas acima):
  - núcleo: `sdSphere(p, 0.45)`, mais um leve ruído ou deslocamento senoidal *de baixa amplitude* (amplitude grande quebra a propriedade de distância e cria artefatos; nesse caso, multiplique o passo por 0.6 a 0.8);
  - N = 8 a 14 espinhos: `sdRoundCone(p, vec3(0), dir_i*len_i, 0.18, 0.01)`, com `dir_i` vindo de uma distribuição de Fibonacci na esfera e `len_i` animado por `sin(t+i)`. Para tentáculos curvos, use 2 ou 3 round cones encadeados (ponto final de um = início do próximo, raios decrescentes) ou dobre o espaço (`p.xz *= rot(p.y*bend)`) antes de avaliar o cone;
  - fitas: `sdCappedTorus` ou `sdTorus` achatado (`opOnion` + escala anisotrópica), girando em eixos diferentes;
  - juntar tudo com `smin(..., k≈0.08–0.15)` entre o núcleo e cada espinho, e `k` menor (≈0.03) entre os espinhos, para não virarem uma bolha.
  - Em vez de loop sobre uniforms, mande as primitivas como `uniform vec4 uSpikes[14]` (direção xyz + comprimento w).
- **Rodar só dentro de um volume envolvente**: intersecte o raio com a esfera envolvente (raio = maior espinho + k) e marche só entre t0 e t1. Dá para ir além e desenhar uma `Mesh(SphereGeometry)` com `ShaderMaterial` no lugar do quad de tela cheia: assim só os pixels cobertos pagam o raymarch, e a profundidade ainda pode ser escrita via `gl_FragDepth` para compor com o resto da cena.
- **Aparência de cromo no SDF**: `col = env(reflect(rd, n)) * mix(F0, 1.0, pow(1.0 - max(dot(n,-rd),0.0), 5.0))` com F0 ≈ 0.9 a 1.0 (metal: o Fresnel quase não escurece o centro), mais um realce especular estreito (`pow(max(dot(r,L),0),200)`) com cor rosa-violeta. Duas opções para `env()`:
  - (a) analítico: gradiente de céu azul→lilás em `r.y` + 2 ou 3 faixas bem brilhantes (`smoothstep` estreito em `r.y` ou em `atan(r.z,r.x)`) + horizonte escuro. É barato e controla exatamente a paleta;
  - (b) textura: a HDR equirretangular amostrada por direção (`uv = vec2(atan(r.z,r.x)/(2π)+.5, asin(r.y)/π+.5)`) ou a textura PMREM, como faz o three-raymarcher.
  Para cromo espelhado (roughness≈0) o mip 0 basta, sem PMREM. Um único quique de reflexo interno (re-marchar a partir de `p + n*0.01` na direção `r`, uns 32 passos) é o que dá o look de "cromo refletindo cromo" dos renders Y2K. Ele dobra o custo, então deixe só no desktop.
- **Partes de vidro**: no mesmo shader, use o fator de mistura do `smin` vec2 para marcar as fitas como "vidro" e aplique `refract(rd, n, 1.0/1.45)` amostrando o mesmo env com deslocamento de canal RGB (dispersão falsa) mais Fresnel forte nas bordas. Fica muito mais barato que transmissão real.
- **Performance (estimativa, sem benchmark encontrado)**: com cerca de 15 primitivas, ~80 passos e normal com 4 avaliações, o custo por pixel fica em ~1.300 avaliações de primitivas no pior caso. Com o bounding volume ocupando ~30% da tela a 1080p, em GPU integrada moderna isso deve ficar no orçamento de 60 fps. É preciso medir. Controles que ajudam: `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`, render target a 0.5 a 0.75 no celular, e menos passos com `EPS` relativo (`EPS * t`).

### Gaps
- Não achei benchmark publicado de SDF raymarched em three.js a 1080p nem no celular. Os números acima são estimativas.
- Não encontrei um Shadertoy específico de "liquid chrome star" para citar. A busca só trouxe agregadores e componentes não verificados. Os shaders do iq (round cone tdXGWr, capped torus tl23RK) servem de base.
- Não confirmei o link exato do artigo de Maxime Heckel "Painting with Math" (fica em blog.maximeheckel.com, citado pelo Codrops).

---

## 2. Abordagens baseadas em malha (MarchingCubes, tubos afinando + metaballs, deslocamento no vertex, CSM)

### Takeaway
O addon `MarchingCubes` gera uma malha única e contínua a partir de "balls" (metaballs) e aceita qualquer material three, inclusive `MeshPhysicalMaterial` com envMap PMREM. Isso resolve o "peças separadas", mas metaball não faz ponta afiada: os espinhos saem como gotas arredondadas, a não ser com resolução alta e muitas bolas de força decrescente ao longo de cada espinho, o que custa CPU todo frame. Tubos afinando + núcleo deslocado continuam sendo malhas separadas (mesma emenda dura de hoje), a menos que tudo vire uma única geometria com deslocamento contínuo.

### Cited Findings
- Caminho verificado: `https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/objects/MarchingCubes.js` (HTTP 200). Assinatura: `constructor( resolution, material, enableUvs = false, enableColors = false, maxPolyCount = 10000 )`. Métodos: `addBall(x,y,z,strength,subtract,colors)`, `addPlaneX/Y/Z`, `setCell`, `getCell`, `blur(intensity)`, `reset()`, `update()`, `init(resolution)`. Propriedade `isolation`. — [jsDelivr three@0.187.0 MarchingCubes.js](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/objects/MarchingCubes.js)
- O exemplo oficial usa `new MarchingCubes( resolution=28, material, true, true, 100000 )`, `isolation` padrão 80 (GUI de 10 a 300) e resolução ajustável de 14 a 100. O material "shiny" do exemplo é `MeshStandardMaterial({ color: 0x9c0000, envMap: reflectionCube, roughness: 0.1, metalness: 1.0 })`. — [three.js r187 examples/webgl_marchingcubes.html](https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/webgl_marchingcubes.html) (ao vivo: https://threejs.org/examples/#webgl_marchingcubes)
- `three-custom-shader-material` (CSM) 6.4.0 é a última versão no npm e tem entrada **vanilla** em `three-custom-shader-material@6.4.0/vanilla/three-custom-shader-material.es.js`, que só importa `"three"` (roda por importmap). O peer dependency é `three >= 0.159`. Ele permite injetar deslocamento por ruído no vertex shader mantendo o PBR do `MeshPhysicalMaterial`. — [jsDelivr package.json](https://cdn.jsdelivr.net/npm/three-custom-shader-material@6.4.0/package.json); [jsDelivr data API](https://data.jsdelivr.com/v1/packages/npm/three-custom-shader-material)

### Inferences
- MarchingCubes com resolução 48 a 64 e cerca de 30 a 60 bolas é viável no desktop, mas `update()` roda em JS na CPU a cada frame (custo de ordem resolução³). Se usar, atualize a 30 Hz ou só quando animar, e use `maxPolyCount` alto.
- Para espinhos com ponta, MarchingCubes perde para o SDF: a isosuperfície de metaballs é intrinsecamente arredondada.
- Deslocamento por vertex shader numa única `IcosahedronGeometry(1, 64+)`: usar `r = 1 + Σ_i spike(dot(n, dir_i))` com `spike = pow(max(dot,0), 40..200)*len_i` dá UM objeto contínuo com espinhos que afinam e se fundem na base. As normais têm de ser recalculadas no shader (diferenças finitas nos vizinhos tangentes) e com CSM (`csm_Position`, `csm_Normal`) o material físico continua funcionando. A ponta fica limitada pela densidade da malha, e fitas soltas não saem desse jeito. É o fallback mais barato que mantém a forma "derretida" e serve para o celular.
- `TubeGeometry` com raio afinando (via `BufferGeometryUtils` ou geometria custom) é ótimo para as fitas, mas fica com junção dura onde encosta no núcleo. Para esconder isso, enterre as pontas da fita dentro do núcleo ou use bloom/escuro na região.

### Gaps
- Não medi o custo de `MarchingCubes.update()` em resolução 64 no laptop do usuário.

---

## 3. GLB modelado no Blender (GLTFLoader + DRACO/meshopt)

### Takeaway
A forma pode ser modelada no Blender (metaballs, remesh/voxel + suavização, ou geometry nodes com curvas afinando e depois remesh) e exportada como um único GLB. É a rota com melhor qualidade visual de forma por custo de runtime: uma malha estática com MeshPhysicalMaterial. Animar fica limitado a rotação, morph targets ou deslocamento leve em shader. O GLTFLoader do three suporta as extensões de material físico.

### Cited Findings
- Caminhos verificados (HTTP 200): `examples/jsm/loaders/GLTFLoader.js`, `examples/jsm/loaders/DRACOLoader.js`, `examples/jsm/libs/meshopt_decoder.module.js`, `examples/jsm/libs/draco/draco_decoder.wasm` em `https://cdn.jsdelivr.net/npm/three@0.187.0/`. — [jsDelivr three@0.187.0](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/loaders/GLTFLoader.js)
- O repositório r187 tem exemplos `webgl_loader_gltf_iridescence`, `webgl_loader_gltf_transmission` e `webgl_loader_gltf_dispersion`, o que mostra que o GLTFLoader importa iridescência, transmissão e dispersão vindas do glTF. — [three.js r187 examples/files.json](https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/files.json)

### Inferences
- No Blender: Principled BSDF com Metallic=1 e Roughness 0 a 0.05 exporta como `pbrMetallicRoughness` (metallicFactor=1, roughnessFactor≈0). Mesmo assim, é mais seguro sobrescrever o material no three depois de carregar (`mesh.material = chromeMat`), porque o look depende do envMap de runtime, não do Blender.
- Morph targets: modele 2 ou 3 poses (espinhos curtos/longos, fitas giradas) com a mesma topologia e anime `morphTargetInfluences` com seno. Isso dá o "respirar" líquido sem custo de GPU relevante.
- Use `DRACOLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/libs/draco/')` ou meshopt (`MeshoptDecoder` do `libs/meshopt_decoder.module.js`) para GLBs de 2 a 10 MB.

### Gaps
- Não verifiquei, neste trabalho, a documentação do exportador glTF do Blender sobre o mapeamento exato de Transmission/Iridescence/IOR. O suporte do lado do three está confirmado pelos exemplos.

---

## 4. Ambiente e reflexos (HDRLoader/PMREM, RoomEnvironment, env custom com faixas, iridescência, dispersão, transmissão)

### Takeaway
Cromo é 100% reflexo: sem um ambiente de alto contraste (fundo escuro + softboxes/faixas muito brilhantes) ele vira cinza liso. Em three 0.187, **`RGBELoader` foi descontinuado em favor de `HDRLoader`** (r180). As HDRIs de estúdio pequeno da Poly Haven (1k, cerca de 1.6 MB) são o ponto de partida. Para a paleta azul/lilás/rosa, um env custom (cena com faixas emissivas coloridas passada por `PMREMGenerator.fromScene`) dá mais controle. MeshPhysicalMaterial tem `iridescence`, `dispersion` (só com transmissão) e `transmission`.

### Cited Findings
- `examples/jsm/loaders/RGBELoader.js` em 0.187 é só um wrapper: `class RGBELoader extends HDRLoader` com `console.warn('RGBELoader has been deprecated. Please use HDRLoader instead.')` e o comentário `// @deprecated, r180`. Use `examples/jsm/loaders/HDRLoader.js` (HTTP 200). — [jsDelivr three@0.187.0 RGBELoader.js](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/loaders/RGBELoader.js)
- `RoomEnvironment` (`examples/jsm/environments/RoomEnvironment.js`) e `DebugEnvironment` existem em 0.187 (HTTP 200). — [jsDelivr three@0.187.0 environments](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/environments/RoomEnvironment.js)
- API do PMREMGenerator em 0.187: `fromScene(scene, sigma = 0, near = 0.1, far = 100, options = {})`, `fromEquirectangular(tex, rt)`, `fromCubemap(cube, rt)`, `compileEquirectangularShader()`. — [jsDelivr three@0.187.0 src/extras/PMREMGenerator.js](https://cdn.jsdelivr.net/npm/three@0.187.0/src/extras/PMREMGenerator.js)
- HDRIs da Poly Haven baixáveis direto por `https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/<nome>_1k.hdr` (com `access-control-allow-origin: *`, então dá para carregar do site). Confirmei HTTP 200 para studio_small_09, studio_small_08, studio_small_03, brown_photostudio_02, photo_studio_loft_hall, empty_warehouse_01 e christmas_photo_studio_04. O studio_small_09_1k.hdr tem 1.615.248 bytes. — [Poly Haven CDN (verificado por curl)](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr)
- Propriedades do `MeshPhysicalMaterial` em 0.187: `iridescence`, `iridescenceIOR` (padrão 1.3), `iridescenceThicknessRange` ([100, 400] nm), `dispersion` ("chromatic aberration transmitting through a relatively clear volume… only with transmissive objects", faixa típica [0,1]), `transmission`, `thickness`, `attenuationColor/Distance`, `ior` (1.5), `clearcoat`, `anisotropy`, `sheen`, `specularIntensity/Color`. Há também uma propriedade nova, `retroreflectivity`. — [jsDelivr three@0.187.0 src/materials/MeshPhysicalMaterial.js](https://cdn.jsdelivr.net/npm/three@0.187.0/src/materials/MeshPhysicalMaterial.js)
- Exemplos oficiais de transmissão: `webgl_materials_physical_transmission` e `webgl_materials_physical_transmission_alpha`. — [three.js r187 files.json](https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/files.json)
- O three-raymarcher usa uma HDR via RGBELoader → PMREMGenerator → `envMap` CubeUV também no shader SDF, ou seja, o mesmo env serve para malha e para SDF. — [GitHub danielesteban/three-raymarcher](https://github.com/danielesteban/three-raymarcher)

### Inferences
- **Material cromo base (malha)**: `new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.02–0.06, envMapIntensity: 1.2–2.0, clearcoat: 1, clearcoatRoughness: 0.0, iridescence: 0.3–0.6, iridescenceIOR: 1.3, iridescenceThicknessRange: [200, 600] })`. A iridescência dá o brilho rosa-violeta nas bordas sem pintar o objeto. Tonemapping `ACESFilmicToneMapping` ou `AgXToneMapping` com exposure ≈ 1.
- **Env custom para a paleta Y2K** (é a mais importante; a versão atual "gradient sphere + strips" está no caminho certo, mas precisa de mais contraste): uma esfera grande `BackSide` com gradiente escuro (azul-marinho quase preto embaixo → lilás em cima) mais 4 a 6 **planos/retângulos emissivos com cor > 1 (HDR, ex. `color.setScalar(8)`)**: 2 brancos-azulados longos (softbox), 1 rosa, 1 violeta, 1 ciano estreito. Gere com `pmrem.fromScene(envScene, 0.02)` e reaplique com `scene.environment = rt.texture`. O valor > 1 é o que faz os highlights estourarem e o bloom pegar só neles. Faixas finas e longas viram as "linhas de luz" características do cromo Y2K.
- HDRI vs env custom: a studio_small_09 dá realismo, mas puxa para tons neutros. Dá para misturar renderizando a HDR como fundo da envScene e somando as faixas coloridas por cima antes do `fromScene`.
- **Vidro em vanilla** (equivalente ao MeshTransmissionMaterial do drei): `MeshPhysicalMaterial({ transmission: 1, thickness: 0.5–1.5, roughness: 0.05, ior: 1.45, dispersion: 0.3–1.0, iridescence: 0.5, attenuationColor: lilás })`. A transmissão do three renderiza a cena opaca num render target extra, o que tem custo; no celular, desligue ou troque por `opacity` + Fresnel. Não encontrei port vanilla mantido do MeshTransmissionMaterial do pmndrs.

### Gaps
- Não há fonte verificada nesta pesquisa comparando HDRIs da Poly Haven especificamente para cromo. A sugestão de "studio small" é inferência baseada no tipo de iluminação (softboxes em fundo escuro).
- Não confirmei se existe um port vanilla do `MeshTransmissionMaterial` (drei).

---

## 5. Pós-processamento (bloom nítido, aberração cromática, grão)

### Takeaway
Todos os passes necessários existem em 0.187 (caminhos verificados). Para manter o cromo nítido, o bloom deve pegar só os highlights HDR (threshold perto de 1 e emissivos/faixas > 1) e ter raio pequeno. O exemplo oficial usa threshold 0, que borra tudo e não serve para cromo.

### Cited Findings
- Caminhos (HTTP 200 em three@0.187.0/examples/jsm/): `postprocessing/EffectComposer.js`, `RenderPass.js`, `UnrealBloomPass.js`, `OutputPass.js`, `ShaderPass.js`, `FilmPass.js`, `AfterimagePass.js`, `SMAAPass.js`, `shaders/RGBShiftShader.js`, `shaders/FilmShader.js`. **`postprocessing/RGBShiftShader.js` dá 404**: o RGBShift fica em `shaders/` e é usado via `new ShaderPass(RGBShiftShader)`. — [jsDelivr three@0.187.0](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/shaders/RGBShiftShader.js)
- Assinaturas: `UnrealBloomPass( resolution, strength = 1, radius, threshold )` e `FilmPass( intensity = 0.5, grayscale = false )`. — [jsDelivr UnrealBloomPass.js](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/postprocessing/UnrealBloomPass.js); [FilmPass.js](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/postprocessing/FilmPass.js)
- O exemplo oficial de bloom usa `threshold: 0, strength: 1, radius: 0.5, exposure: 1` com `ACESFilmicToneMapping`. Há também o `webgl_postprocessing_unreal_bloom_selective`. — [three.js r187 webgl_postprocessing_unreal_bloom.html](https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/webgl_postprocessing_unreal_bloom.html)

### Inferences
- Para cromo nítido: `new UnrealBloomPass(new THREE.Vector2(w/2, h/2), 0.35–0.6, 0.2–0.35, 0.85–1.0)`, com o bloom em meia resolução. Encadear `RenderPass → UnrealBloomPass → ShaderPass(RGBShiftShader, amount ≈ 0.0008–0.0015) → FilmPass(0.15–0.25) → OutputPass` (o OutputPass aplica tonemapping e conversão sRGB; nesse caso, deixe o tonemapping no renderer e não no material).
- No SDF de tela cheia, bloom, aberração e grão podem ir dentro do próprio shader (aberração = amostrar o env com 3 offsets de direção, grão = hash por pixel), sem passes extras. Isso economiza fill-rate no celular.

### Gaps
- Nenhuma fonte com valores "ideais" de bloom para cromo. Os valores acima são inferência.

---

## 6. Recomendação: "uma estrela de cromo derretido com tentáculos + fitas" a ~60 fps no laptop, com fallback para celular

### Takeaway
**Principal: SDF raymarched em GLSL** (`ShaderMaterial` numa esfera/caixa envolvente ou num quad de tela cheia), com `sdRoundCone` para espinhos/tentáculos, esfera para o núcleo e `sdCappedTorus`/toro achatado para as fitas, tudo unido com smin polinomial normalizado. Normal pelo tetraedro, env analítico (gradiente azul→lilás + faixas brilhantes + realce rosa-violeta) ou amostragem de uma HDR equirretangular, Fresnel com F0≈0.95, 1 quique de reflexo no desktop e refração fake com dispersão nas partes de vidro. É a única opção que dá, ao mesmo tempo, pontas afiadas, junções derretidas e animação livre a custo previsível. **Fallback (celular / pouca GPU / `prefers-reduced-motion`)**: o mesmo shader com resolução 0.5, metade dos passos e sem quique; ou, se a GPU for fraca demais, uma malha única (icosaedro com espinhos por deslocamento no vertex, via CSM, ou um GLB modelado) com MeshPhysicalMaterial + env PMREM das mesmas faixas.

### Cited Findings
- smin normalizado, `k` = espessura da junção: — [iq smin](https://iquilezles.org/articles/smin/)
- round cone / capped cone / torus exatos: — [iq distfunctions](https://iquilezles.org/articles/distfunctions/)
- normais em 4 avaliações e o truque anti-inline para WebGL: — [iq normalsSDF](https://iquilezles.org/articles/normalsSDF/)
- quad de tela cheia + RawShaderMaterial + cor por vetor refletido: — [Codrops 2025](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/)
- downsampling 0.5 como padrão em lib three de raymarch, com envMap PMREM: — [three-raymarcher](https://github.com/danielesteban/three-raymarcher)
- MarchingCubes (malha contínua, mas arredondada): — [webgl_marchingcubes r187](https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/webgl_marchingcubes.html)

### Inferences
- **Esqueleto de implementação (sem bundler)**:
  ```html
  <script type="importmap">{ "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/"
  }}</script>
  ```
  ```js
  import * as THREE from 'three';
  import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const lowPower = matchMedia('(pointer: coarse)').matches || navigator.hardwareConcurrency <= 4;
  renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1 : 1.5));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0}, uRes:{value:new THREE.Vector2()}, uCamPos:{value:new THREE.Vector3()},
                uInvProjView:{value:new THREE.Matrix4()}, uSpikes:{value:Array.from({length:12},()=>new THREE.Vector4())},
                uSteps:{value: lowPower?48:96}, uBounce:{value: lowPower?0:1}, uZero:{value:0}, uEnv:{value:null} },
    vertexShader, fragmentShader });
  // raio no fragment: ndc -> uInvProjView -> world; rd = normalize(world - uCamPos)
  // map(p): d = sdSphere(p,.45); for i<12: d = smin(d, sdRoundCone(p, vec3(0), uSpikes[i].xyz*uSpikes[i].w, .17, .01), .1); fitas: d = smin(d, sdCappedTorus(rotate(p),...), .06)
  ```
  Animação: o JS atualiza `uSpikes` (comprimento pulsando, direção girando devagar) e `uTime`. Com `reduce.matches`, desenhe um frame estático (ou rotação muito lenta, por exemplo 1 frame/s) e ouça `reduce.addEventListener('change', ...)`. Pause com `document.hidden` / IntersectionObserver quando o canvas sair da tela.
- **Escala adaptativa**: meça o tempo médio dos frames. Se passar de 20 ms por 1 a 2 s, renderize o SDF num `WebGLRenderTarget` a 0.75 → 0.5 da resolução e faça upscale num quad. Também dá para reduzir `uSteps`.
- **Por que não ficar com a malha atual**: mesmo com env perfeito, peças separadas mostram junções duras. Se o SDF parecer arriscado, o meio-termo mais barato é um **GLB modelado no Blender** (remesh voxel de metaballs + curvas afinando, suavizado) com morph targets e o mesmo env de faixas. Visualmente chega perto, mas a animação fica limitada às poses.
- Reaproveite o env: o mesmo gradiente + faixas (as cores do site) pode virar a função `env()` analítica do SDF e também a envScene do PMREM do fallback em malha, para manter o look consistente entre os modos.

### Gaps
- Sem medição real de fps no hardware do usuário. Recomenda-se um protótipo com contador de frame time antes de decidir os passos e a escala.
- Não verifiquei suporte/necessidade de WebGPU/TSL. A recomendação assume WebGLRenderer + GLSL, o caminho mais simples sem bundler.
