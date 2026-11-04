# Técnicas 3D de "cromo líquido" / Y2K chrome (hypertrance, neo-Y2K): como artistas constroem a forma, o material, a luz e o render

> Pesquisa feita em 3 nov 2026 com ~17 chamadas de busca/fetch. A cobertura web para este nicho é FRACA: a maior parte dos "tutoriais" que aparecem em busca são agregadores de baixa qualidade (new.ccum.net etc.) que só listam títulos. Muitos valores de parâmetros abaixo vêm de conhecimento prático geral de 3D e estão marcados **[não verificado]**. Tudo que tem link foi conferido na fonte (ou no snippet de busca, quando dito).

## 1. Modelagem: quais técnicas geram blobs de cromo lisos com espinhos/tentáculos afinando em ponta, e qual é a mais usada nesse estilo?

### Takeaway
Não há UMA técnica canônica documentada; o estilo vem de três famílias: (a) **curvas → tubo com raio afinando** (Geometry Nodes Curve to Mesh / bevel de curva + taper), que é o método citado explicitamente para "liquid chrome" em Blender (Joey Carlino); (b) **volumes/SDF com união suave** (Cinema 4D Volume Builder + Volume Mesher, Houdini VDB, metaballs do Blender) para as junções "derretidas"; (c) **voxel remesh + smooth** para fundir peças soltas num único corpo liso. Para o look de estrela com tentáculos (Ipsiom/hypertrance 003), o mais plausível é (a)+(b): tentáculos como tubos de curva com raio→0 na ponta, unidos ao núcleo por união suave/remesh.

### Cited Findings
- Joey Carlino (canal de tutoriais de Geometry Nodes) publicou um vídeo sobre "liquid chrome": "With geometry nodes we can smooth any curve until it looks like liquid, making it super easy to make any word look awesome just by writing it"; a técnica "works just like the smooth modifier except you can use it within geometry nodes". O post não lista os nós. — [BlenderNation, 16/09/2022](https://www.blendernation.com/2022/09/16/smoothing-with-geometry-nodes/)
- Agregador lista o vídeo "Blender needs to add this smooth geometry node" (liquid chrome com geometry nodes suavizando curvas). — [Class Central](https://classcentral.com/course/youtube-blender-needs-to-add-this-smooth-geometry-node-209589)
- O nó **Curve to Mesh** aceita uma curva de perfil para dar forma ao tubo; perfil cíclico pode ter as pontas preenchidas (Fill Caps). — [Blender Manual 3.2, Curve to Mesh](https://docs.blender.org/manual/ar/3.2/modeling/geometry_nodes/curve/curve_to_mesh.html)
- Add-on pago "Liquid Curves Generator" (Gumroad, ivndrr, US$4+) gera tipografia "liquid chrome"; requer Blender 3.1+ (dado do snippet de busca; a página não carregou detalhes). — [Gumroad](https://ivndrr.gumroad.com/l/liquid-curves-gen)
- **Voxel remesher** do Blender: coloca a malha num grid 3D virtual e gera nova malha nos pontos mais próximos da superfície; voxel pequeno = denso e detalhado, grande = leve e grosseiro; topologia resultante não é boa para deformação. — [Blender Manual, Retopology](https://docs.blender.org/manual/ja/dev/modeling/meshes/retopology.html)
- Problema prático do remesh com "caudas espinhosas": para não perder as pontas, aumentar muito a resolução do voxel; ou suavizar antes (a região suavizada fica maior e recebe mais polígonos). — [Nomad Sculpt forum](https://forum.nomadsculpt.com/t/remeshing-spiky-tails-without-loosing-sharpness-and-destroying-mesh/10272)
- **Cinema 4D Volume Builder + Volume Mesher**: Volume Builder como filho do Volume Mesher, primitivas/splines/polígonos como filhos do Builder; Voxel Size é o parâmetro-chave (menor = mais resolução, mais lento); permite misturar e subtrair formas. — [Maxon Help: Volume Builder](https://help.maxon.net/c4d/2027/en-us/Content/html/OVOLUMEBUILDER.html); [Volume Mesher](https://help.maxon.net/c4d/2027/en-us/Content/html/OVOLUMETOMESH.html); [NOVEDGE tip](https://novedge.com/blogs/design-news/cinema-4d-tip-creating-fluid-effects-with-volume-builder-and-volume-mesher)
- **Houdini**: fluxo de forma abstrata de Stormz = primitiva simples → distorção → converter para VDB → distorcer de novo. — [Lester Banks](https://lesterbanks.com/?p=65410) (snippet); tutorial oficial "Quicktip: creating abstract shapes" — [SideFX](https://www.sidefx.com/tutorials/quicktip-creating-abstract-shapes/); Entagma "No VEX Houdini: abstract sails" — [Entagma](https://entagma.com/no-vex-houdini-my-firstish-setup-abstract-sails/)
- **Metaballs** no Blender são usados como prototipagem rápida (add-on Chakana Pro, que adiciona Smart Remesh e Voxel Remesh por cima de metaballs; Blender 4.2 LTS e 5.x). — [Superhive: Chakana Pro](https://superhivemarket.com/products/chakana); [BlenderNation](https://www.blendernation.com/2023/01/18/new-chakana-prometaballs-hardsurface-modelling-system/)
- A artista Intranetgirl (chrome text animado, letras "infláveis") trabalha tudo em Blender; o artigo não nomeia o método de modelagem. — [Collater.al](https://www.collater.al/en/intranet-girl-y2k-3d-modeling-art/)

### Inferences
- Receita de geometria tradutível em código (com base no acima + prática geral) **[não verificado como "receita oficial" do estilo]**:
  1. Núcleo: esfera/icoesfera (ou metaball) ligeiramente deformada por ruído de baixa frequência.
  2. Tentáculos/espinhos: N curvas saindo do núcleo (direções numa distribuição Fibonacci/aleatória), cada uma um spline suave (3–5 pontos de controle, levemente curvada/torcida). Raio ao longo da curva: `r(t) = r0 · (1 − t)^p`, p≈1.5–3 → ponta afinada até ~0. Em GN: Curve Line/Bezier → Resample Curve → Set Curve Radius (Spline Parameter → Float Curve) → Curve to Mesh (perfil Curve Circle, Fill Caps).
  3. Junção "derretida": unir núcleo + tubos por união suave (SDF smooth-min, `k` ≈ 0.1–0.3 do raio do núcleo) ou, no Blender, Mesh to Volume → Volume to Mesh (equivalente ao Volume Builder do C4D), ou Remesh (Voxel) + Smooth/Corrective Smooth + Subdivision Surface. Espinhos curtos e afiados exigem voxel pequeno (perde a ponta caso contrário — ver forum Nomad).
  4. Em código para web (three.js), isto mapeia direto: `TubeGeometry` com raio variável por segmento (ou geometria custom), ou raymarching de SDF com `smin` (núcleo esfera + cápsulas cônicas `sdRoundCone`) — este último dá as junções derretidas "de graça".
- Para o estilo "acid/chrome type" especificamente, curvas suavizadas (a) parecem dominar em Blender; volumes (b) dominam em C4D (Volume Builder é a ferramenta "padrão" de blobs nesse software). ZBrush DynaMesh, Plasticity, Womp e MagicaCSG não apareceram em nenhuma fonte ligada a este estilo.

### Gaps
- Nenhuma fonte (tutorial, Behance, 80.lv) com breakdown da arte do Ipsiom ou do "exoplanet '02". Não encontrei quem fez a arte (ver seção 6).
- Não encontrei .blend/HDA públicos que gerem exatamente "estrela com tentáculos" — ver seção 5.

## 2. Formas de fita/laço (ribbons) e junções que "derretem"

### Takeaway
Fitas são curvas com perfil achatado (retângulo arredondado ou elipse) com *tilt*/twist ao longo do comprimento; junções derretidas vêm de união suave por volume (VDB/Volume Builder/Mesh to Volume) ou voxel remesh + smooth.

### Cited Findings
- Curve to Mesh com curva de perfil custom define a seção transversal do tubo (perfil achatado = fita). — [Blender Manual](https://docs.blender.org/manual/ar/3.2/modeling/geometry_nodes/curve/curve_to_mesh.html)
- Volume Builder permite "blend and subtract shapes" (união suave via modo de mistura e filtro Smooth). — [NOVEDGE](https://novedge.com/blogs/design-news/cinema-4d-tip-mastering-complex-shape-creation-with-cinema-4ds-volume-builder)
- Um pacote comercial de Y2K chrome no Blender (Undergrafik) traz "chrome text and chain" animado com tutorial em vídeo — indica que fitas/correntes de cromo são parte padrão do kit Y2K. — [Gumroad Undergrafik](https://undergrafik.gumroad.com/l/blendermockup01)

### Inferences
- **[não verificado]** Receita: Bezier/NURBS em laço (curva cíclica, figura-8 ou espiral) → Set Curve Tilt com tilt = `t · 2π · voltas` → Curve to Mesh com perfil Quadrilateral/elipse achatada (proporção ~6:1) → Subdivision Surface nível 2 → Shade Smooth. Em three.js: `TubeGeometry` não faz twist com perfil plano; precisa de geometria custom (frames de Frenet/parallel transport + rotação por t) ou ExtrudeGeometry ao longo de path.
- "Lâminas de cristal" do exoplanet '02: provavelmente fitas finas com perfil em losango (bordas afiadas) e material de vidro, espalhadas radialmente — **[inferência visual, sem fonte]**.

### Gaps
- Nenhum tutorial específico de "ribbon chrome Y2K" encontrado com parâmetros.

## 3. Material / shading

### Takeaway
Cromo = Principled BSDF com Metallic 1, Roughness quase 0, base color quase branca; a cor azul/lilás vem quase toda do AMBIENTE refletido (HDRI/céu colorido + softboxes coloridas), não do material. Iridescência: Thin Film no Principled (Blender 4.2+, Cycles, inicialmente só dielétricos) ou rampas de Fresnel/Layer Weight. Vidro com dispersão: nativo no Principled do Cycles somente nas builds recentes (5.3 segundo 80.lv) — antes, add-ons ou truque de 3 BSDFs RGB.

### Cited Findings
- Ponto de partida para metal: Metallic 1.000, Roughness ≤ 0.25. — [Packt, Photorealistic Materials in Blender Cycles 4ª ed.](https://packtpub.com/en-ca/product/photorealistic-materials-and-textures-in-blender-cycles-fourth-edition-15-9781805129639/chapter/chapter-11-lighting-a-scene-in-cycles/section/generating-studio-lighting)
- EEVEE (legacy) mostra estrias/esticamento das fontes de luz em superfícies metálicas de rugosidade baixa sob HDRI de estúdio. — [Blender issue #67202](https://projects.blender.org/blender/blender/issues/67202)
- Blender 4.2: Principled BSDF ganhou "physically accurate thin film interference" para reflexão e transmissão especular; inicialmente só para materiais dielétricos; suporte a metálicos "planned"; não suportado no EEVEE. — [Blender 4.2 Cycles release notes](https://developer.blender.org/docs/release_notes/4.2/cycles/)
- Dispersão nativa no Principled BSDF do Cycles: 80.lv relata merge nas builds do Blender 5.3 (implementação RGB, não espectral; escrito com 5.3 em alfa). — [80.lv](https://80.lv/articles/principled-bsdf-in-blender-s-cycles-now-supports-dispersion). **Conflito/incerteza:** tenho lembrança de que Glass/Principled já tinham um input "Dispersion" desde a 4.x, mas as release notes da 4.2 que consultei não o mencionam — tratar a versão exata como não verificada.
- Add-on NiceGlass adiciona dispersão contínua a vidro e exige mais samples. — [Superhive NiceGlass](https://superhivemarket.com/products/niceglass)
- Thread do r/blenderhelp (fev/2025) pedindo um shader de cromo "retro anime" diz não achar tutorial — confirma que o look estilizado é pouco documentado. — [r/blenderhelp (mirror)](https://lr.eu.psf.lt/r/blenderhelp/comments/1ilhf1u/how_can_i_create_a_retro_anime_style_chrome)

### Inferences
- Valores sugeridos **[não verificado; prática comum]**:
  - Cromo: Base Color ~ #E8ECF5 (branco levemente frio), Metallic 1.0, Roughness 0.02–0.08, Specular/IOR padrão, Coat 0 (cromo já é espelho; coat só para "laca" colorida).
  - Cromo tingido (lilás/azul): tingir pouco a base color (ex. #C9C3FF) OU, melhor, manter base neutra e colocar cor no ambiente; tingir base deixa reflexos "sujos".
  - Iridescência "pink-violet glints" em metal: como Thin Film não age em metálicos na 4.2, artistas usam (i) Layer Weight/Fresnel → Color Ramp (azul→rosa→lilás) multiplicando base color, ou (ii) camada dielétrica fina (Coat ou Mix Shader com Principled dielétrico + Thin Film Thickness ~250–600 nm, Thin Film IOR ~1.3–1.5).
  - Vidro: Transmission 1, Roughness 0–0.05, IOR 1.45–1.5, cor levemente azulada; dispersão 0.02–0.1 onde houver.
- Para web (three.js `MeshPhysicalMaterial`): `metalness:1, roughness:0.03–0.08, envMap` colorido; `iridescence:0.5–1, iridescenceIOR:1.3, iridescenceThicknessRange:[100,600]`; vidro com `transmission:1, thickness, ior:1.5, dispersion` (three r163+ tem `dispersion` — **[não verificado aqui]**).

### Gaps
- Nenhuma fonte com os valores exatos usados em capas hypertrance.

## 4. Iluminação / ambiente e render

### Takeaway
Cromo espelhado não tem "cor própria": ele só mostra o que reflete, então precisa de um ambiente de alto contraste (faixas claras de softbox contra escuro, ou céu azul saturado com horizonte/chão contrastante). O look Y2K usa HDRI de estúdio (faixas brancas) ou ambientes customizados com planos emissivos coloridos (azul/lilás/rosa); render em Cycles (Blender), Octane/Redshift (C4D/Houdini). Pós: bloom/glow, aberração cromática, grão.

### Cited Findings
- Tutorial de chrome/metal em estúdio com HDRI, incluindo correção de problemas de reflexo, Cycles e Eevee (Klean Design). — [BlenderNation 2020](https://www.blendernation.com/2020/04/09/chrome-metal-material-blender-2-8-blender-2-83-cycles-and-eevee/)
- Estúdio para letras metálicas montado com painéis de luz ("glow panels") + light dome/HDRI. — [Strata University](https://strata.com/university/page/81) (snippet)
- Contraluz/rim forte define a silhueta fluida e revela a curvatura em blobs. — [NOVEDGE](https://novedge.com/blogs/design-news/cinema-4d-tip-creating-fluid-effects-with-volume-builder-and-volume-mesher)
- Packs comerciais de HDRI específicos para metal/cromo: DOSCH "Chrome & Studio Effects V2" (200 HDRIs de estúdio), Greyscalegorilla "Pro Studios Metal Vol. 2" (65 HDRIs para metal). — [DOSCH](https://doschdesign.com/products/hdri/chrome-studio-effects-v2.html); [Greyscalegorilla](https://greyscalegorilla.com/product/hdri-collection-pro-studios-metal-volume-2)
- Poly Haven lançou um "Studio HDRI Vault" (jan/2026) com HDRIs fotografados em estúdio real (com Alexander Scholten). — [Patreon Poly Haven](https://www.patreon.com/posts/about-studio-133105064)
- Add-ons Blender para softboxes/estúdio: Poly Studio Pro (gera HDRI e softboxes). — [Superhive](https://superhivemarket.com/products/poly-studio-pro---hdri-maker--lighting-builder)
- Houdini + Redshift é combinação comum para visuais abstratos (cursos CGcircuit/SideFX). — [SideFX: Abstract Visuals – Houdini and Redshift](https://www.sidefx.com/tutorials/abstract-visuals-houdini-and-redshift/)
- Chrometype (curador "Modern Revolt") julga trabalhos por "composition, contrast, render quality"; descreve o estilo por "metallic, reflective shapes and fluorescent, vibrant colors". — [Type-01](https://type-01.com/the-mind-behind-chrometype-curating-innovative-3d-type-creations-with-a-chrome-aesthetic/)

### Inferences
- **[não verificado]** Nomes de HDRIs da Poly Haven frequentemente usados para cromo: `studio_small_03`, `studio_small_09`, `photo_studio_01`, `brown_photostudio_02` (estúdio); para céu azul: qualquer céu limpo de meio-dia. Conferir em polyhaven.com — não validei os nomes nesta pesquisa.
- Receita de ambiente para o look Ipsiom (céu azul saturado): gradiente vertical azul profundo (#0A2BFF) → azul claro/ciano (#7FD3FF) no horizonte + 2–4 faixas emissivas brancas/lilás (área lights em tiras, ratio ~1:8) + um ponto rosa-violeta (#FF6AD5) para os glints. Em código web: gerar o envMap com `PMREMGenerator` a partir de uma cena simples (esfera com gradiente + quads emissivos) ou `RoomEnvironment` modificado — é o equivalente direto de "softboxes coloridas".
- Pós típico (consistente com o look, sem fonte específica): bloom/glare (Blender Compositor "Glare – Fog Glow/Bloom"), aberração cromática leve (Lens Distortion → Dispersion 0.01–0.03), grão/ruído. Em web: `UnrealBloomPass`, shader de RGB shift, film grain.
- Cycles > Eevee para cromo pela fidelidade de reflexões múltiplas (cromo refletindo cromo) e pelo bug de estrias no Eevee legacy acima. Eevee Next (4.2+) tem raytracing de tela — melhor, mas ainda não reflete fora da tela **[não verificado]**.

### Gaps
- Nenhuma fonte primária sobre o setup de luz das capas-alvo.

## 5. Métodos procedurais / programáticos

### Takeaway
Existem geradores prontos (Liquid Curves Generator; Chakana Pro para metaballs; tutoriais de GN do Joey Carlino), mas nenhum script bpy/HDA público encontrado que gere especificamente "estrela de cromo com tentáculos". O pipeline curvas→tubo afinado→união suave é fácil de escrever em bpy/GN ou diretamente em three.js/GLSL (SDF).

### Cited Findings
- Liquid Curves Generator (Gumroad, US$4+, Blender 3.1+). — [Gumroad](https://ivndrr.gumroad.com/l/liquid-curves-gen)
- Chakana Pro: sistema de modelagem baseado em metaballs com Smart/Voxel Remesh. — [Superhive](https://superhivemarket.com/products/chakana)
- Geometry Nodes suaviza curvas para o look liquid chrome (Joey Carlino). — [BlenderNation](https://www.blendernation.com/2022/09/16/smoothing-with-geometry-nodes/)
- Houdini: primitiva → distorção → VDB → distorção (Stormz). — [Lester Banks](https://lesterbanks.com/?p=65410)
- Pacotes de modelos prontos (20 formas Y2K chrome, OBJ) existem como ponto de partida. — [MonsterOne](https://monsterone.com/social-media/3d-object-pack-abstract-y2k-shapes-o516750/)
- Existe um componente web "LiquidChrome" (21st.dev; shader de fundo, não forma 3D). — [21st.dev](https://21st.dev/@patrickthomasdunn1988/components/liquid-chrome.md)

### Inferences
- Para o site, o caminho mais fiel e barato: **raymarching SDF em fragment shader** (esfera + cones arredondados com `smin`, fitas como SDF de toro/curva achatada torcida) com reflexão por envMap gradiente procedural → resolve espinhos afinados, junções derretidas e reflexo de cromo sem malha. Alternativa: malha gerada em JS (tubos com raio afinando + metaballs de three.js `MarchingCubes`) + `MeshPhysicalMaterial`.

### Gaps
- Nenhum .blend ou HDA gratuito verificado para o look exato.

## 6. Tutoriais, artistas e autoria das artes-alvo

### Takeaway
A cena "chrome/acid graphics" gira em torno da página @chrometype (Modern Revolt) e estúdios como Sucuk & Bratwurst, Obby & Jappari, Golgotha; artistas como Guccimaze, Kushlet, Victor Scorrano, Intranetgirl. Não foi possível identificar o autor da arte do "Ipsiom presents hypertrance mix 003" nem do "exoplanet '02".

### Cited Findings
- Chrometype: criado por Joey/"Modern Revolt", >120k seguidores; estilo também chamado "acidgraphics"; nomes citados: Sucuk & Bratwurst, Obby & Jappari, Golgotha ("holy trinity"); Guccimaze, Kushlet, Victor Scorrano; menores: Shinen, Outside.inc, Apricour. Ferramenta citada: só Photoshop (com um preset de chrome que circulou). — [Type-01](https://type-01.com/the-mind-behind-chrometype-curating-innovative-3d-type-creations-with-a-chrome-aesthetic/)
- Intranetgirl: chrome text animado, tudo em Blender. — [Collater.al](https://www.collater.al/en/intranet-girl-y2k-3d-modeling-art/)
- KarolisDesign (Dribbble): pôsteres acid graphics/chrome type. — [Dribbble](https://dribbble.com/KarolisDesign/shots)
- Acid graphics descrito como categoria de design em rede, não um único movimento de estúdio. — [daisyUI trends](https://trends.daisyui.com/trend/acid-graphics/)
- hypertrance (Bandcamp) se descreve como "the ultimate in y2k music and art"; a faixa "Apollo" (AUSA) é do "hypertrance 1" (17/03/2023), sem crédito de arte. — [Bandcamp](https://hypertrance.bandcamp.com/track/apollo)
- hypertrance.eu: sample pack "developed by nuphory"; site "written with ♡ by patchstep & djkáťo"; nenhum artista 3D creditado; Ipsiom não mencionado. — [hypertrance.eu](https://hypertrance.eu/)
- Ipsiom (Windsor, Ontario): produtor de bass/"future drum and bass" na Circus Records; snippet de busca mencionava "Y2K nostalgia" e "3D art creations", mas a página da Circus que consultei não fala de arte 3D. — [Circus Records](https://circus-records.co.uk/artists/-ipsiom)
- Títulos de vídeo encontrados apenas via agregador (conteúdo não verificado): "Iridescent Y2K Chrome Text Logo Blender Tutorial", "Molten Chrome Custom Typeface in Blender Tutorial (Remastered)", "Colorful Chrome Logo Effect in Blender 3D", "Blender 5.0 Tutorial: How to Make a 3D Y2K Chrome CD Animation!". — [agregador](https://new.ccum.net/iridescent-y2k-chrome-text-logo-blender-tutorial.html); [molten chrome](https://new.ccum.net/molten-chrome-custom-typeface-in-blender-tutorial-remastered.html)

### Inferences
- É possível (não confirmado) que o próprio Ipsiom faça suas artes 3D, dado o snippet sobre "3D art creations"; verificar descrição do vídeo no YouTube.

### Gaps
- Autor das artes do Ipsiom mix 003 e do "exoplanet '02" (nuphory, HYPERTRANCE RE:vision): não encontrado. Sugestão: ler descrição do vídeo no YouTube / Bandcamp de nuphory.
- Sem acesso a breakdowns no Behance/ArtStation/80.lv específicos de "liquid chrome" — buscas não retornaram páginas dessas plataformas.
