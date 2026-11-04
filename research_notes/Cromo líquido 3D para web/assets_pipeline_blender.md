# Asset pipeline for liquid-chrome 3D on a static site (models, HDRIs, headless Blender to GLB)

Research date: 2026-11-03/04. Method: Blender 5.2 API and manual pages fetched directly, Sketchfab public search API (`api.sketchfab.com/v3/search`), Poly Haven public API (`api.polyhaven.com/files/<id>`), snapcraft/flathub APIs, download.blender.org listings, jsDelivr HEAD checks for three@0.187.0, and the @gltf-transform/cli@4.5.1 source. Nothing was installed or downloaded apart from small HTML/JSON/JS text pages into the scratchpad.

## 1. Free CC0 / CC-BY models of abstract chrome / Y2K shapes

### Takeaway
Sketchfab is the only source here with real hits. The closest matches to the "Ipsiom hypertrance 003" chrome star are a small cluster of CC-BY "cyber-sigilism" / chrome star models (plank199, NDY-Game-Dev, outcastt, popcherry1975). All are CC Attribution, so the site needs a credit line. Downloading them needs a Sketchfab login, so the user has to download them by hand; the agent cannot create accounts. Poly Haven has no abstract models. For this style, generating the shapes procedurally (section 3) is probably the more dependable route.

### Cited Findings
- Sketchfab public search API (`https://api.sketchfab.com/v3/search?type=models&q=<terms>&downloadable=true`) returned these downloadable candidates (license label and face count are from the API; I did not check them visually) — [Sketchfab API search](https://api.sketchfab.com/v3/search?type=models&q=cybersigilism&downloadable=true):
  - **Chromed Stars**, by plank199. CC Attribution, 7,424 faces. Best low-poly star candidate. — [model](https://sketchfab.com/3d-models/1a4d432f58974095a9a6cc1f9ebd15e3)
  - **Chroma Star**, by NDY-Game-Dev. CC Attribution, 2,560 faces. — [model](https://sketchfab.com/3d-models/ae9c8902c84f456fb631c4157d5ce678)
  - **Cyber-Sigilism Chromed Crown**, by plank199. CC Attribution, 44,840 faces. Spiky tribal chrome. — [model](https://sketchfab.com/3d-models/616ec725bda34767b2bbf3c523df3a7f)
  - **Chrome Sigil Halo**, by plank199. CC Attribution, 226,352 faces. Needs decimation. — [model](https://sketchfab.com/3d-models/f6e02a58bd03438681d1b534862683d4)
  - **Cyber-Sigil Design**, by popcherry1975. CC Attribution, 148,223 faces. — [model](https://sketchfab.com/3d-models/133e85afb6ad4b8eb3456dcffcd0d37f)
  - **Cyber-Sigil Fan Skeleton**, by popcherry1975. CC Attribution, 288,834 faces. — [model](https://sketchfab.com/3d-models/8df65813db9d49ab8ba0155de4fe33e6)
  - **cybersigilism pattern**, by indiegnar. CC Attribution, 1,077,248 faces. Too heavy as-is. — [model](https://sketchfab.com/3d-models/3ae5576cd4324248aab0439f0a5d130b)
  - **Y2k Frame V1**, by outcastt. CC Attribution, 923,470 faces. — [model](https://sketchfab.com/3d-models/8b0358744da344c096a3552fe74b15b1)
  - **Chrome Ornament V1**, by outcastt. CC Attribution, 1,228,063 faces. — [model](https://sketchfab.com/3d-models/5d3f28f51f8f4c16aaed4b627f690548)
  - **Silver Star**, by roberto.chiaveri. CC Attribution, 28 faces. A plain primitive star. — [model](https://sketchfab.com/3d-models/6bea8ee3f0174135a0e26858656c6ac9)
  - Avoid: "[ ancient Angzaar cyber sigil ]" by timenotspace is CC BY-NC-SA (non-commercial and share-alike) — [model](https://sketchfab.com/3d-models/0992b28e13bf4f239967a5d7188dfcc8). Also avoid the many "Chrome Hearts" results: they are brand/logo derivatives, a trademark risk even under CC-BY.
- The searches `chrome tentacle`, `metaball chrome`, `liquid metal abstract` and `tribal chrome` returned **no** downloadable results through the API — [Sketchfab API](https://api.sketchfab.com/v3/search?type=models&q=chrome+tentacle&downloadable=true).
- Search terms that worked: `cybersigilism`, `cyber sigilism`, `y2k chrome`, `chrome star`, `chrome abstract`. Sketchfab's UI has a "Downloadable" filter and a license filter, and the API takes `downloadable=true` (used above). — [Sketchfab API](https://api.sketchfab.com/v3/search?type=models&q=y2k+chrome&downloadable=true)
- The Poly Haven models API returned an empty list for the category `abstract`. Poly Haven has no abstract chrome models, only HDRIs and textures that are useful here — [Poly Haven API](https://api.polyhaven.com/assets?t=models&c=abstract)
- A general web search for "liquid chrome y2k abstract" found only paid or stock packs (Adobe Stock, Gumroad "300 Abstract Chrome Shapes Pack" as PNGs, Monsterone). None are CC-licensed 3D — [Gumroad](https://designfamilymarket.gumroad.com/l/300-Abstract-Chrome-Shapes-Pack), [Monsterone](https://monsterone.com/social-media/3d-object-pack-abstract-y2k-shapes-o516750/)

### Inferences
- CC-BY attribution: include author name, model title, link to the model page and "CC BY 4.0" (with a link to the license) in a visible credits section or footer. Sketchfab's CC Attribution is CC BY 4.0 (standard; I did not re-check on each page).
- Sketchfab downloads usually come as glTF/GLB (auto-converted) plus the original format. Heavy models (>100k faces) should go through `gltf-transform simplify`/`optimize` or Blender Decimate before shipping.
- The procedural route avoids attribution and licensing entirely and gives exact control over the "star with tapering tentacles" silhouette.

### Gaps
- I did not search Poly Pizza (poly.pizza responded HTTP 200 but I did not parse it), Fab.com free, BlendSwap or OpenGameArt, so I have no candidates from them. Poly Pizza is mostly low-poly CC0/CC-BY game props and is unlikely to have chrome-blob art (unverified).
- I did not open individual Sketchfab pages to confirm download formats, preview appearance or the exact CC version.

## 2. HDRIs for chrome reflections (Poly Haven), sizes, and CDN loading

### Takeaway
Poly Haven HDRIs are CC0: no attribution, commercial use allowed. A 1k `.hdr` is about 1.1–1.7 MB and a 2k is about 4.3–6.6 MB. Use 1k for the reflection environment, since PMREM blurs it anyway. `dl.polyhaven.org` sends `Access-Control-Allow-Origin: *`, so three.js can load straight from the CDN. Copying the 1k file into the project is still safer: it works offline and doesn't depend on hotlinking.

### Cited Findings
- Poly Haven license: all assets are CC0. "You do not need to give credit or attribution", and commercial use and redistribution are allowed — [Poly Haven license](https://polyhaven.com/license)
- File sizes and direct URLs (from `api.polyhaven.com/files/<id>`) — [Poly Haven API](https://api.polyhaven.com/files/studio_small_09):

  | HDRI | 1k .hdr | 2k .hdr | Use |
  |---|---|---|---|
  | `kloofendal_48d_partly_cloudy_puresky` | 1,401 KB | 5,323 KB | blue sky with clouds, no ground: Y2K sky chrome |
  | `kloppenheim_06_puresky` | 1,145 KB | 4,330 KB | pure sky |
  | `qwantani_puresky` | 1,115 KB | 4,476 KB | pure sky |
  | `blue_photo_studio` | 1,618 KB | 6,320 KB | blue-tinted studio: blue/lilac chrome |
  | `studio_small_09` | 1,577 KB | 6,164 KB | classic softbox studio, crisp chrome highlights |
  | `studio_small_08` | 1,473 KB | 5,791 KB | studio |
  | `photo_studio_loft_hall` | 1,601 KB | 6,281 KB | large studio |
  | `skylit_garage` | 1,658 KB | 6,583 KB | strong window strips, good for chrome |

  URL pattern: `https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/<id>_1k.hdr` — [example](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr)
- A HEAD request with `Origin: http://localhost:8000` returned `HTTP/2 200`, `content-type: image/vnd.radiance` and `access-control-allow-origin: *`. Cross-origin loading from a localhost page works — [dl.polyhaven.org](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr)
- In three@0.187.0, `RGBELoader` is marked `@deprecated, r180` and logs "RGBELoader has been deprecated. Please use HDRLoader instead." Use `three/addons/loaders/HDRLoader.js` — [jsDelivr RGBELoader.js](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/loaders/RGBELoader.js)
- `RoomEnvironment.js` is also in 0.187.0, which gives a zero-download procedural studio environment — [jsDelivr](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/environments/RoomEnvironment.js)

### Inferences
- For the blue/lilac Ipsiom look: use a puresky HDRI (kloofendal or kloppenheim_06) as `scene.environment`. Give the material a slight lilac tint (metal `color` around #d8d0ff) and/or `iridescence`, and paint the visible background as a CSS/shader gradient rather than showing the HDRI itself.
- Use `HDRLoader` and then `PMREMGenerator.fromEquirectangular(tex)`. 1k is enough because chrome on a small abstract form doesn't show HDRI pixel detail after PMREM. 2k (~5–6 MB) is only worth it if the HDRI is shown as the background.
- Hotlinking: CORS allows it, but Poly Haven is a donation-funded CDN, and I found no explicit statement that hotlinking is welcome or forbidden (unverified). Recommendation: put the 1k file in `assets/hdri/` (CC0 allows redistribution).

### Gaps
- I did not verify the visual colour cast of each HDRI ("blue_photo_studio" is judged by name only).
- I did not research `.exr` vs `.hdr` or KTX2/UltraHDR (`.jpg` gainmap) alternatives, which could be smaller.

## 3. Installing Blender on Linux and running it headless

### Takeaway
The current LTS is **Blender 5.2 LTS (5.2.3, 22 Oct 2026)**; 4.5 LTS is still maintained. The Pop!_OS/Ubuntu apt package is an old **4.0.2**. Prefer the official tarball (≈385 MB `.tar.xz`, extract to `~/opt`, no root) or the snap `5.2lts` track (406 MB). Run headless with `blender -b --factory-startup -P script.py -- args`.

### Cited Findings
- LTS page: Blender 5.2 LTS, last updated to 5.2.3 on 22 Oct 2026. Blender 4.5 LTS, updated to 4.5.15 on 22 Oct 2026. LTS means about 2 years of fixes — [blender.org/download/lts](https://www.blender.org/download/lts/)
- Official tarball: `blender-5.2.3-linux-x64.tar.xz`, 385,331,224 bytes (~368 MiB), dated 22-Oct-2026 — [download.blender.org/release/Blender5.2](https://download.blender.org/release/Blender5.2/)
- Snap (amd64): `stable` 5.2.2 (405 MB), `5.2lts/stable` 5.2.3 (406 MB), `4.5lts/stable` 4.5.15 (401 MB), `beta` 5.3.0, `edge` 5.4.0 — [snapcraft API](https://api.snapcraft.io/v2/snaps/info/blender)
- Flathub `org.blender.Blender` latest release: 5.2 — [Flathub API](https://flathub.org/api/v2/appstream/org.blender.Blender)
- `apt-cache policy blender` on this machine: not installed, candidate `4.0.2+dfsg-1ubuntu8` (local check).
- The API docs at `docs.blender.org/api/current` are "Blender 5.2 Python API Documentation" — [Blender API](https://docs.blender.org/api/current/index.html)

### Recipe (standard Blender CLI. Flags are from my knowledge of Blender's CLI, not re-fetched)
```bash
mkdir -p ~/opt && cd ~/opt
curl -LO https://download.blender.org/release/Blender5.2/blender-5.2.3-linux-x64.tar.xz   # ~385 MB
tar xf blender-5.2.3-linux-x64.tar.xz
~/opt/blender-5.2.3-linux-x64/blender -b --factory-startup --python-exit-code 1 \
    -P tools/make_chrome_star.py -- --out assets/models/star.glb --seed 3
```
- `-b` = background (no UI), `-P` = run a Python file, args after `--` are for the script (`sys.argv[sys.argv.index('--')+1:]`), `--factory-startup` ignores user prefs, and `--python-exit-code 1` makes a script exception return a non-zero exit code.
- The tarball needs X11/GL libraries only for the UI. Background mode with no rendering works headless (normal practice; I did not re-verify on Pop!_OS).

### Gaps
- I didn't get disk size after extraction (likely ~1–1.2 GB, unverified).
- I didn't confirm which Blender version first added `export_meshopt_compression_enable`. It is in the 5.2 API but probably not in apt's 4.0.2, so avoid apt.

## 4. bpy recipe: procedural "chrome star" with tapering tentacles, then GLB

### Takeaway
The most robust headless approach uses only data-API calls (no `bpy.ops` context issues except export):
(a) Build each tentacle as a 3D curve (POLY/NURBS spline) with a per-point `radius` that tapers to ~0, plus `bevel_depth` for thickness.
(b) Add a core (metaball ball or UV sphere).
(c) Convert everything to mesh with `bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph))` and join into one object.
(d) Fuse with a **Voxel Remesh** modifier, add **Smooth/Corrective Smooth** and **Subdivision**, then **Decimate** to the target budget.
(e) Shade smooth and export GLB with `export_apply=True`.
An alternative for the blobby look is a metaball chain per tentacle, with ball radii decreasing along the path. Metaballs fuse naturally and taper by radius.

### Cited Findings (API names verified on the Blender 5.2 API page)
- `bpy.ops.export_scene.gltf` parameters (Blender 5.2) — [Blender 5.2 API: export_scene](https://docs.blender.org/api/current/bpy.ops.export_scene.html):
  - `export_format` (GLB / GLTF_SEPARATE …), `export_apply` ("Apply modifiers (excluding Armatures) … prevents exporting shape keys"), `export_normals`, `export_tangents`, `export_materials` ∈ {'EXPORT','PLACEHOLDER','VIEWPORT','NONE'}, `export_yup` (default True), `use_selection`, `use_visible`, `export_extras`, `export_image_format` ∈ {'AUTO','JPEG','WEBP','NONE'}, `export_shared_accessors`, `export_vertex_color` ∈ {'MATERIAL','ACTIVE','NAME','NONE'}, `export_attributes`, `export_animations` (default True), `export_copyright`.
  - Draco: `export_draco_mesh_compression_enable` (default False), `export_draco_mesh_compression_level` (default 6; "0 = most speed, 6 = most compression, higher values currently not supported"), `export_draco_position_quantization` (default 14), `export_draco_normal_quantization` (10), `export_draco_texcoord_quantization` (12), `export_draco_color_quantization` (10), `export_draco_generic_quantization` (12).
  - Meshopt (new): `export_meshopt_compression_enable`, `export_meshopt_extension` ∈ {'EXT_meshopt_compression','KHR_meshopt_compression'} (default `EXT_meshopt_compression`). There are also `export_gltfpack_*` options (e.g. `export_gltfpack_kn`, "Keep Named Nodes").
- Manual: "Apply Modifiers: Export objects using the evaluated mesh, meaning the resulting mesh after all Modifiers have been calculated." — [Blender 5.2 manual glTF](https://docs.blender.org/manual/en/5.2/addons/import_export/scene_gltf2.html)
- Manual URL note: `/manual/en/latest/addons/import_export/scene_gltf2.html` returned 404 on the fetch date, but `/manual/en/5.2/...` works — [Blender 5.2 manual](https://docs.blender.org/manual/en/5.2/addons/import_export/scene_gltf2.html)

### Script (written from my knowledge of the bpy API for 4.2–5.x; **not executed**. Export parameter names verified above, other API names unverified against 5.2)
```python
# tools/make_chrome_star.py  — run: blender -b --factory-startup -P make_chrome_star.py -- --out star.glb --seed 3
import bpy, bmesh, sys, math, random, argparse
from mathutils import Vector, noise

argv = sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
ap = argparse.ArgumentParser(); ap.add_argument('--out', default='star.glb')
ap.add_argument('--seed', type=int, default=1); ap.add_argument('--arms', type=int, default=9)
ap.add_argument('--faces', type=int, default=40000)
a = ap.parse_args(argv); random.seed(a.seed)

bpy.ops.wm.read_factory_settings(use_empty=True)        # empty scene
scn = bpy.context.scene; col = scn.collection

def tentacle(direction, length, base_r, curl):
    cu = bpy.data.curves.new('arm', 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = base_r; cu.bevel_resolution = 6; cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); n = 14; sp.points.add(n-1)
    sp.use_endpoint_u = True; sp.order_u = 4
    d = direction.normalized(); side = d.orthogonal().normalized()
    for i, p in enumerate(sp.points):
        t = i/(n-1)
        bend = side * math.sin(t*math.pi*curl) * length*0.25*t        # S-curve / swirl
        pos = d*length*t + bend + noise.noise_vector(d*3+Vector((t,0,0)))*0.05*t
        p.co = (*pos, 1.0)
        p.radius = (1.0 - t)**1.6 + 0.02                  # taper to a needle tip
    ob = bpy.data.objects.new('arm', cu); col.objects.link(ob); return ob

# core blob: metaball (fuses smoothly) — could also be a UV sphere
mb = bpy.data.metaballs.new('core'); mb.resolution = 0.05; mb.render_resolution = 0.05
el = mb.elements.new(type='BALL'); el.co = (0,0,0); el.radius = 0.55
core = bpy.data.objects.new('core', mb); col.objects.link(core)

parts = [core]
for k in range(a.arms):                                       # star spikes, Fibonacci-ish spread
    z = 1 - 2*(k+0.5)/a.arms; r = math.sqrt(1-z*z); phi = k*2.39996
    dirv = Vector((r*math.cos(phi), z*0.6, r*math.sin(phi)))
    parts.append(tentacle(dirv, random.uniform(1.4, 2.4), 0.16, random.uniform(0.5, 1.5)))

# evaluate + convert every part to a real mesh, then join into one object via bmesh
dg = bpy.context.evaluated_depsgraph_get()
bm = bmesh.new()
for ob in parts:
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    me.transform(ob.matrix_world); bm.from_mesh(me); bpy.data.meshes.remove(me)
for ob in parts: bpy.data.objects.remove(ob)
mesh = bpy.data.meshes.new('ChromeStar'); bm.to_mesh(mesh); bm.free()
star = bpy.data.objects.new('ChromeStar', mesh); col.objects.link(star)

# fuse + smooth + budget
rm = star.modifiers.new('Remesh', 'REMESH'); rm.mode = 'VOXEL'; rm.voxel_size = 0.025; rm.adaptivity = 0.0
sm = star.modifiers.new('Smooth', 'CORRECTIVE_SMOOTH'); sm.iterations = 10; sm.smooth_type = 'SIMPLE'  # or 'SMOOTH' modifier
dec = star.modifiers.new('Decimate', 'DECIMATE'); dec.decimate_type = 'COLLAPSE'
# set ratio from evaluated face count
ev = star.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
dec.ratio = min(1.0, a.faces / max(1, len(ev.polygons))); star.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh_clear()
for p in mesh.polygons: p.use_smooth = True   # remesh output: also set rm.use_smooth_shade = True

# chrome material -> glTF metallicRoughness
mat = bpy.data.materials.new('Chrome')
mat.use_nodes = True   # deprecated/no-op in 5.x (materials always use nodes) — unverified, harmless if it only warns
bsdf = mat.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Base Color'].default_value = (0.86, 0.84, 1.0, 1)  # faint lilac
bsdf.inputs['Metallic'].default_value = 1.0
bsdf.inputs['Roughness'].default_value = 0.05
# optional thin-film → KHR_materials_iridescence (see section 5 caveat)
# bsdf.inputs['Thin Film Thickness'].default_value = 400.0; bsdf.inputs['Thin Film IOR'].default_value = 1.3
star.data.materials.append(mat)

bpy.ops.export_scene.gltf(
    filepath=a.out, export_format='GLB', export_apply=True,
    export_normals=True, export_tangents=False, export_materials='EXPORT',
    export_yup=True, export_animations=False,
    export_draco_mesh_compression_enable=False,   # compress later with gltf-transform (or set True)
    export_meshopt_compression_enable=False,
)
print('wrote', a.out)
```
Notes on alternatives:
- **Metaball tentacles**: for each arm, add ~12 `BALL` elements along a curved path with `radius` falling from ~0.25 to ~0.03, and keep `mb.threshold` at its default (0.6). Taper comes from decreasing radii, and a single metaball datablock fuses everything into one "liquid" surface. Then `new_from_object` gives a mesh. Watch out: metaball meshing at a fine `resolution` gets slow, so do a coarse metaball pass followed by Remesh + Subdivision.
- **Skin modifier**: build a vertex/edge skeleton (bmesh), add `SKIN` and set each skin vertex radius (`mesh.skin_vertices[0].data[i].radius = (r, r)`), then `SUBSURF` levels 2. This is good for branching spikes. (Attribute path from memory, unverified.)
- **Geometry Nodes** (Curve to Mesh with `Set Curve Radius` driven by Spline Parameter → Float Curve) is the cleanest taper but more verbose to build from Python, because nodes must be created and linked one by one. The curve `radius` + `bevel_depth` approach above does the same thing with no node graph.
- **Looping ribbons**: use the same curve code with a closed spline (`sp.use_cyclic_u = True`), a flat `bevel` (`cu.extrude` for ribbon width with `bevel_depth = 0`), and per-point `tilt` for twist.

### Inferences
- Budget: 20–50k triangles per hero object is fine for one chrome star in a hero section. After meshopt/Draco that is roughly 150–500 KB (rule of thumb, unverified).
- Voxel size controls fusion and detail. Tips thinner than ~2× `voxel_size` will vanish, so clamp the taper minimum radius (the `+0.02` above) or apply Remesh before the taper is fully thin.

### Gaps
- I did not execute the script. Names used without fetched confirmation include `Mesh.transform`, `bmesh.from_mesh`, `CORRECTIVE_SMOOTH.smooth_type`, `Thin Film` sockets and `Material.use_nodes` behaviour in 5.x. A test run is needed after installing Blender.

## 5. glTF material export: Principled BSDF to PBR plus extensions

### Takeaway
Blender 5.2's exporter maps Principled BSDF Base Color/Metallic/Roughness to core glTF metallicRoughness. It exports transmission, volume, IOR, specular, clearcoat, sheen, anisotropy, emissive_strength and **dispersion** (dispersion only together with volume). The manual has an "Iridescence" section describing how to export via Thin Film sockets, **but iridescence is absent from the manual's own Export extension list**, so treat iridescence export as uncertain. The simplest way is to set `iridescence` in three.js after loading. three.js 0.187 GLTFLoader reads all of these extensions.

### Cited Findings
- Export extension list in the Blender 5.2 manual: KHR_draco_mesh_compression, KHR_lights_punctual, KHR_materials_clearcoat, KHR_materials_transmission, KHR_materials_unlit, KHR_materials_emissive_strength, KHR_materials_volume, KHR_materials_sheen, KHR_materials_specular, KHR_materials_anisotropy, KHR_materials_dispersion, KHR_materials_ior, KHR_materials_variants, KHR_texture_transform, EXT_mesh_gpu_instancing, EXT_meshopt_compression, KHR_meshopt_compression. **KHR_materials_iridescence is not listed** — [Blender 5.2 manual](https://docs.blender.org/manual/en/5.2/addons/import_export/scene_gltf2.html)
- On the same page, the "Iridescence" section says iridescence "can be exported using the KHR_materials_iridescence extension": Thin Film IOR comes from the Principled BSDF, factor/thickness from the Thin Film thickness, and maximum thickness from the custom "glTF Material Output" group node. This **conflicts** with the extension list above — [Blender 5.2 manual](https://docs.blender.org/manual/en/5.2/addons/import_export/scene_gltf2.html)
- Transmission: "When the Transmission input on the Principled BSDF node has a nonzero default value or Image Texture node connected, the KHR_materials_transmission glTF extension will be included" — [Blender 5.2 manual](https://docs.blender.org/manual/en/5.2/addons/import_export/scene_gltf2.html)
- Volume: export uses a Volume Absorption node on the Output's Volume socket and requires some transmission. Thickness goes through the "glTF Material Output" group node — [Blender 5.2 manual](https://docs.blender.org/manual/en/5.2/addons/import_export/scene_gltf2.html)
- Dispersion: "can be exported only if the material also uses the KHR_materials_volume extension", through the dispersion socket of the glTF Material Output group node — [Blender 5.2 manual](https://docs.blender.org/manual/en/5.2/addons/import_export/scene_gltf2.html)
- three@0.187.0 GLTFLoader source references: KHR_materials_iridescence, KHR_materials_dispersion, KHR_materials_transmission, KHR_materials_volume, KHR_materials_ior, KHR_materials_clearcoat, KHR_materials_sheen, KHR_materials_specular, KHR_materials_anisotropy, KHR_materials_emissive_strength, KHR_draco_mesh_compression, EXT_meshopt_compression, **KHR_meshopt_compression**, KHR_mesh_quantization, KHR_texture_basisu, EXT_texture_webp/avif and more — [jsDelivr GLTFLoader.js](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/loaders/GLTFLoader.js)
- The three.js GLTFExporter also lists dispersion and iridescence — [three.js GLTFExporter docs](https://threejs.org/docs/pages/GLTFExporter.html)

### Inferences
- For liquid chrome, the core metallicRoughness material (metallic 1, roughness 0.02–0.1) is all that has to survive export. The "look" (env map, iridescence, clearcoat, colour tint) is easier to tune live in three.js by replacing `MeshStandardMaterial` with `MeshPhysicalMaterial` on load (`traverse` → `o.material = chromeMat`). That also sidesteps the iridescence export uncertainty.
- Glass bits: export with Transmission Weight 1 + IOR 1.5 (plus optional volume/dispersion), or just make them in three.js with `MeshPhysicalMaterial({transmission:1, thickness, ior, dispersion})`.

### Gaps
- I did not test whether Blender 5.2 actually writes KHR_materials_iridescence. One export plus `gltf-transform inspect` would settle it.

## 6. Compression, size targets, and three.js loaders (0.187.0 on jsDelivr)

### Takeaway
Use meshopt via `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt` (meshopt is the CLI default). It decodes fast with a small decoder and three.js ships `meshopt_decoder.module.js`. Draco gives smaller geometry but needs the wasm decoder path. Both decoders are on jsDelivr for three@0.187.0.

### Cited Findings
- `@gltf-transform/cli` latest is **4.5.1** — [npm registry](https://registry.npmjs.org/@gltf-transform/cli/latest)
- `optimize` options in the 4.5.1 source: `--compress <method>` (default "meshopt"), `--meshopt-level <level>` (default "high"), `--simplify <bool>` (default true), `--simplify-ratio`, `--simplify-error`, `--simplify-lock-border`, `--texture-compress <format>` (default "auto"), `--texture-size` (default 2048), `--weld`, `--join`, `--join-meshes`, `--flatten`, `--instance`, `--palette`, `--prune`, `--sparse`, `--resample`. Separate commands exist too: `inspect`, `draco`, `meshopt`, `weld`, `simplify` — [jsDelivr @gltf-transform/cli@4.5.1 dist/cli.mjs](https://cdn.jsdelivr.net/npm/@gltf-transform/cli@4.5.1/dist/cli.mjs)
- Install: `npm install --global @gltf-transform/cli`. It uses Sharp for images — [gltf-transform CLI docs](https://gltf-transform.dev/cli)
- Files on jsDelivr for three@0.187.0, all HTTP 200 — [jsDelivr three@0.187.0](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/libs/draco/gltf/draco_decoder.wasm):
  - `examples/jsm/libs/draco/gltf/draco_decoder.js`, `draco_wasm_wrapper.js`, `draco_decoder.wasm`. Decoder path: `https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/libs/draco/gltf/`
  - `examples/jsm/libs/meshopt_decoder.module.js`
  - `examples/jsm/loaders/GLTFLoader.js`, `HDRLoader.js`, `environments/RoomEnvironment.js`
- GLTFLoader throws "setMeshoptDecoder must be called before loading compressed files" if a meshopt file loads without a decoder — [GLTFLoader.js](https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/loaders/GLTFLoader.js)

### Recipe
```bash
npx -y @gltf-transform/cli@4.5.1 inspect star.glb
npx -y @gltf-transform/cli@4.5.1 optimize star.glb assets/models/star.glb \
    --compress meshopt --simplify-ratio 0.5 --simplify-error 0.001 --texture-compress webp
# or Draco:  npx -y @gltf-transform/cli@4.5.1 optimize star.glb out.glb --compress draco
```
```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/libs/draco/gltf/');
const gltf = new GLTFLoader().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder);
const pmrem = new THREE.PMREMGenerator(renderer);
new HDRLoader().load('assets/hdri/kloofendal_48d_partly_cloudy_puresky_1k.hdr', t => {
  scene.environment = pmrem.fromEquirectangular(t).texture; t.dispose();
});
gltf.load('assets/models/star.glb', g => scene.add(g.scene));
```
(The importmap must map `three/addons/` to `https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/`. I did not check `DRACOLoader.js` with a HEAD request, but it lives alongside the other loaders.)

### Inferences
- Size targets (rule of thumb, unverified): ≤ 300–500 KB per GLB hero model after compression, ≤ 1.5 MB HDRI (1k). Total 3D payload ideally < 2 MB.
- Meshopt vs Draco: meshopt is simpler to deploy (one small JS module, no wasm path), decodes faster, and also compresses animation. Draco usually gives smaller static geometry. For a python http.server static site, either works. Meshopt is the default recommendation.
- If you compress in Blender (`export_meshopt_compression_enable=True`, extension EXT or KHR), GLTFLoader 0.187 supports both extensions, but gltf-transform gives more control (simplify, weld).

### Gaps
- I did not measure actual compression ratios on a real chrome-star mesh.
- I did not confirm whether `python -m http.server` serves `.wasm` with `application/wasm`. Recent Python versions map it (unverified); Draco needs this only if the decoder is self-hosted.
