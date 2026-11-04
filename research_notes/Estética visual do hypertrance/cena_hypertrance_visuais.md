# Visual identity of the hypertrance scene (nuphory / hypertrance label / hypertrance.eu)

Research date: 2026-11-03. Method: I opened the Bandcamp pages in the built-in browser and read their DOM, custom-theme CSS and release text. I downloaded every cover at 700px and looked at each one. Colors were measured with ImageMagick (`-colors 6` histogram on a 100px downsample), so the hex values are measured approximations, not guesses. Font look-alikes are my visual identification unless the text says "loaded by site" (those were read from `document.fonts`).

Image URL pattern: `https://f4.bcbits.com/img/a{ID}_{size}.jpg`. Size `_10` = 1200px, `_5`/`_16` = 700px, `_2` = 350px, `_0` = original.

## 1. What do the core release covers look like?

### Takeaway
The house style has two registers, both built on monochrome blue.
- **Night register** (hypertrance 1/2, THEME, samplepack, NVISION, FINAL GATE): a near-black navy field (#121725–#16202A) with a central white-hot fractal or light-streak burst, ramping through #1F2F55, #3E609A and #6398C6 to an icy #ACCFE6 and pure white. It is overlaid with tiny letter-spaced HUD text, thin line-art numerals and bracket marks.
- **Day register** (HYPERTRANCE single, ditherdream1, Ipsiom mix thumbnails): white or sky backgrounds with periwinkle-blue chrome shards, clouds and grid/dot UI blocks.

The direct reference is a literal pastiche of 2001–2003 trance CD and compilation design: covers carry fake "2002" or "2001" dates, "VOL. 1 :: COMP. ALBUM" labels and PS1/PAL catalogue codes.

### Cited Findings
**hypertrance 1** (album 4200783088, Bandcamp release date 17 Mar 2023, 20 tracks): `https://f4.bcbits.com/img/a1926030386_10.jpg` — [Bandcamp](https://hypertrance.bandcamp.com/album/hypertrance-1)
- Composition: an abstract, blurred, liquid light-sculpture (smeared glass or chrome forms, like a long-exposure shot through water) with a horizontal lens-flare light band across the vertical center.
- Giant ghosted, semi-transparent rounded-digital numerals ("03:03 ... 01:35", like LCD timecodes) sit inside that band in outline glow.
- Small HUD text below, in two justified columns. Left: `[ HYPERTRANCE VOL. 1` / `** COMP. ALBUM` / `[ BY VARIOUS ARTISTS`. Right: `OVERHILL.STANDARDS` / `QUD.0` / `2002 ]`.
- The type is a small square or rounded techno face, all caps, close to Eurostile Extended, Microgramma or "Xolonium". The brackets `[ ... ]` frame the text block.
- Palette (measured): #121C23 (38%), #16374B, #1E4C6C, #296A94, #4B9DC2, highlight #B8DAE6, white core. It is cyan-leaning teal-blue.

**hypertrance 2** (album 747432886, 21 tracks): `https://f4.bcbits.com/img/a0810603410_10.jpg` — [Bandcamp](https://hypertrance.bandcamp.com/album/hypertrance-2)
- Composition: a vertical fountain or explosion of white-blue light filaments (Apophysis/fractal-flame-like, or a Photoshop "light streak" burst) rising from the bottom center into a dark navy sky. Faint ghosted handwritten or calligraphic script floats mid-frame.
- A huge outline "02" is drawn as thin 1px white line-art with chamfered (45° cut) corners, like sci-fi UI panel outlines.
- Across it runs the widely letter-spaced title `[ H Y P E R T R A N C E 2`, flanked by two thick glowing white horizontal bars on the left and right edges.
- Small HUD text block: `] BROUGHT TO YOU / BY VARIOUS ARTISTS / VOL.A` plus tiny `J.25802`-style codes at the left. Faint chamfered circuit/panel line-work covers the whole background.
- Palette: #121725 (41%), #1F2F55, #2E4477, #3E609A, #6398C6, #ACCFE6. This is the most "royal/denim blue" of the set.

**HYPERTRANCE THEME** (nuphory track, label page): `https://f4.bcbits.com/img/a0444681167_10.jpg`. The measured color histogram is byte-identical to hypertrance 2, and the thumbnail is visually the same artwork. It reuses the hypertrance 2 cover. — [Bandcamp](https://hypertrance.bandcamp.com/track/hypertrance-theme)

**Label banner / page background**
- The label page background `https://f4.bcbits.com/img/0031771228_0.jpg` (2800×2800) is the same hypertrance 2 art (same histogram).
- The header banner `https://f4.bcbits.com/img/0031771248_0.jpg` (2800×600) is a wide crop of that art. It shows chamfered "0 2" line-art, `[ H Y P E R T R A N C E 2` in a spaced pixel-ish techno face, and white light bars at both edges.
- Label Bandcamp theme colors (custom CSS): page body #111111, text #F6F7FA, link and accent #7CB4DA, buttons #7CB4DA with #111111 text. Source: [Bandcamp label page CSS](https://hypertrance.bandcamp.com/music)

**Label logo** `https://f4.bcbits.com/img/0031771232_0.png` (512×512, gray+alpha). This is a dot-matrix lowercase "h". The left stem is a column of small dots. The arch and right leg are built from dots that grow progressively larger (a halftone gradient from small to large), set in black on transparent. — [Bandcamp](https://hypertrance.bandcamp.com/music)

**hypertrance samplepack / free demo** (released 11 Aug 2023): `https://f4.bcbits.com/img/a0080777009_10.jpg`. The nuphory-page version has a different ID: `a3052999998`. — [Bandcamp](https://hypertrance.bandcamp.com/album/hypertrance-samplepack-free-demo)
- Composition: an off-center radial explosion of thin white-cyan light shards and scratches (fractal flame or "light streak brush" look) on deep teal-black, with fine scratched texture.
- Wordmark at the lower right: `HYPERTRANCE` / `SAMPLEPACK` in a wide, extended, thin-stroke futuristic display face with open letterforms (close to Michroma, Nasalization or Ethnocentric Light).
- Tagline at the left in small spaced lowercase: `DIVE IN. TAKE FLIGHT.`
- Palette: #0F1F28 (40%), #173B4A, #225164, #3C758C, #609CB1, #B3DBE5. This one is teal, not royal blue.
- Product copy: the pack offers "Virtual Self - styled leads" and "Alphazone / Y2K influenced hardtrance loops". Its tags include `neoy2k`, `hardwave` and `virtual self`. — [Bandcamp](https://hypertrance.bandcamp.com/album/hypertrance-samplepack-free-demo)

**HYPERTRANCE RE:vision** (nuphory, released 15 Apr 2022): `https://f4.bcbits.com/img/a0371667811_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/album/hypertrance-re-vision)
- **This is the "exoplanet '02" chrome/crystal-shard cover** described in the brief. The wordmark on it reads `exoplanet`.
- Composition: a 3D-rendered explosion of glassy, chrome and crystal shards and blades bursting from a swirling chrome core at upper-left center. It has strong specular highlights and looks like C4D or Blender with a glass/chrome material (unverified).
- A perspective floor grid recedes toward the lower right, with a halftone dot texture over the dark areas.
- HUD cluster at the lower left:
  - an `exoplanet` wordmark in a boxed, spaced lowercase sans (white box on the "exo" part)
  - `>>` chevrons
  - the nuphory emoticon mark `—^—™`
  - a large `'02` in a light sans
  - stepped and angled line diagrams like signal or step charts
  - many micro-lines of unreadable 3–4px text (spec-sheet style) and thin horizontal rules
- Palette: lilac/periwinkle. #2A2C43 (dark), #595FA2, #5F68C0, #7B84CC, #9CA2DC, #CACCE8.
- Note: `/track/exoplanet` on hypertrance.bandcamp.com returned 404. The compilation track is "nuphory & luna lenta - EXOPLANET HYPERTRANCE" on hypertrance 2 and carries that album's cover. The brief's "exoplanet" image is a0371667811. — [Bandcamp hypertrance 2 tracklist](https://hypertrance.bandcamp.com/album/hypertrance-2)

**HYPERTRANCE (single)** (nuphory, released 16 Apr 2021): `https://f4.bcbits.com/img/a0631135966_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/track/hypertrance)
- This is the day register: a white background with ultramarine and periwinkle torn and crumpled 3D shard forms and cloud photo fragments, collaged with black rectangular UI blocks.
- The blocks have dot-grid fill and tick marks along their tops, like a barcode or ruler. Thin vertical white bars and `+` crosshair registration marks are scattered around.
- Wordmark: lowercase `hypertrance` in a rounded, geometric, slightly extended techno sans with an outline glow (close to Nasalization, "Mesmerize" or "Good Times"), placed lower left on a black block.
- Palette: #F0F2F9 (white, 43%), #252C48 (navy-black), #495FA7, #6F8CD3, #A2AFD7.
- This cover is used in the WKNC article to represent the genre. — [WKNC](https://wknc.org/2023/09/01/a-brief-guide-to-the-y2k-trance-revival/)

**NVISION EP** (released 13 May 2022): `https://f4.bcbits.com/img/a3283163966_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/album/nvision-ep)
- Composition: a cyan light explosion with motion-blurred rays bursting from the center-left, thin crosshair and tick HUD lines at the top left, and speed lines at the bottom.
- Wordmark: `nuision.` (the "v" drawn as a "u"-like form, with a period) in a heavy, extended, rounded techno face (Neuropol, Eurostile Extended Black or "Bank Gothic" rounded). Subtitle: `THREE CLASSIC HYPERTRANCE TRACKS` in small caps.
- Bottom center: the `—^—` emoticon with the micro-text `NUPHORY / DARKMODE`.
- Palette: #16202A, #204C69, #2A6C97, #4DB2DB, #BCF1F4. Electric cyan.

**ditherdream1** (released 25 Nov 2022): `https://f4.bcbits.com/img/a3779121244_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/album/ditherdream1)
- The image is a framed photo with a wide white passe-partout border, like a CD booklet or poster. It shows a saturated sky-blue sky, cumulus clouds and a mirror-calm sea reflecting the clouds, with a tiny boat.
- A white feather or ribbon of fine filament strands and one thin white arc line sweep across the sky.
- Micro-HUD captions at the top: `■ I WANT YOU TO COME WITH ME` (left), `DITHERDREAM1` (center, spaced outline caps), `■ WE CAN BE UP HERE TOGETHER` (right). A white square at the lower left holds the `—^—` mark.
- Palette: #F4FBFD, #A3DBEF, #61CAEE, #15A1E3, #0A6FB6. This is the Frutiger Aero-ish sky register.

**gravity breaker** (nuphory × Quatiica, released 23 Oct 2026): `https://f4.bcbits.com/img/a3760845930_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/track/gravity-breaker)
- A glossy 3D-rendered racing-helmet or pod form in metallic racing green and white with orange accents. A white wireframe mesh is overlaid on its surface, and it carries a lens flare and studio-cyclorama gray background.
- Livery: a `nuphory` logotype, a `Q Racing` logo with a swoosh Q, and `™`. Bottom band: concentric-circle "G" emblem, thin racing stripes, a `motorsports` logo and `—^— GRAVITY BREAKER` in bold extended italic caps.
- The motif reads as anti-gravity racing livery (WipEout-adjacent; my inference). The about text says "in collaboration with quatiica motorsports".
- Palette: #E6E9EC, #A3B1BC, #0F2326, #285459, #63979B, orange accent. This breaks from the blue rule.
- Quatiica's own cover "First Sync" (`https://f4.bcbits.com/img/a3943034250_2.jpg`) is a minimalist pale-gray concentric-arc "G/Q" racing emblem on white. — [Bandcamp search](https://hqlorenzi.bandcamp.com/track/first-sync)

**FINAL GATE / ETHEREAL REALITY** (released 11 Jun 2021): `https://f4.bcbits.com/img/a1943225314_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/track/final-gate-ethereal-reality)
- A blue-cyan fractal-flame burst (Apophysis-looking filament wings) on navy.
- `FINAL GATE` appears in a condensed, high-contrast white serif at the lower left (Final Fantasy, Trajan or "Optimus Princeps" feel), with a thin rule and spaced caps `E T H E R E A L — R E A L I T Y` / `P R O J E C T — 2 0 0 1`.
- Giant outline `FINAL GATE` runs vertically down the right edge as a ghosted serif, and outlined giant letters fill the background.
- A faint monospaced block of poem text (English lines in a typewriter face) sits in the lower left.
- Palette: #222330, #202F5E, #1C55A4, #304A73, #2CB1ED, #B8D9E1.

**digital dreams 1 R300** (released 5 Mar 2021, by VOLANT, nuphory's former alias): `https://f4.bcbits.com/img/a3669851578_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/album/digital-dreams-1-r300)
- A PlayStation-1-era game case parody on worn violet cardboard with a scuffed paper texture.
- Elements: a cream VOLANT "V" chevron logo box with `PAL`, a pill-shaped `dd1-R300` badge, a chunky pixel-stencil wordmark `digitaldreams` with a big outlined `1`, a lowercase list (`basssounds / biossamples / drumsounds / melodyloops / drumloops / oneshots / psxfoley / physical`), an `R300` pill, and the fake codes `PSX 95001`, `3-912-592-01` and `722729682823`.
- Palette: #543673, #5F3D84, #6A4A88, cream #D4C4A4.
- About text: "this is my art in the form of a retro console themed soundset."

**digital dreams 2 R300** (released 2 Apr 2021, VOLANT): `https://f4.bcbits.com/img/a1736330578_10.jpg` — [Bandcamp](https://nuphory.bandcamp.com/album/digital-dreams-2-r300)
- Floating white glowing 3D cubes on a dark teal-black gradient.
- A boxed-label frame grid: `PAL` / `• DD2-R300 •` / `VOLANT` along the top, `ONLINE` / `VERSION 1.2` along the bottom.
- The VOLANT "V" logo sits in a square box on the right, with `SOUNDSET` and `DD2-R300` under it. A column of pill buttons reads `CONTENTS • AMBIANCE • MELODIES • BASSES • DRUMS • LOOPS • FOLEY • BIOS •`.
- `digitaldreams2` is set in a thin lowercase rounded sans in cyan glow. A barcode sticker sits at the lower right, and the fake serial is `7235672832 • SCPH-9000X • 4-215-732-02`.
- Palette: #19211D, #33545A, #40758B, #6495AA, #A5C5CE, #E0F0F3.

**Other nuphory/VOLANT covers seen** (350px URLs) — [nuphory Bandcamp](https://nuphory.bandcamp.com/music)
- **opsm1//ephemeraldream** `a3400179792`: soft cyan, white and pink blurred light bloom, with "ephemeral dream" in small lowercase.
- **depthcore** (with polyscream) `a3075682262`: a 3D chrome shard creature in electric blue on navy, with a vertical "DEPTHCORE" label and a HUD.
- **star anthem 2005** (with Stessie) `a2652779607`: white and lilac, an anime girl, purple katakana-style header bar and chrome shard props.
- **TECHNOID99** `a1315124551`: mint-green and black chrome shards, "ULTIMA99 / TECHNOID" in extended caps, a checker grid.
- **pearlbluesoul** `a0240945234`: an orange typographic poster with a repeated italic bold wordmark, "pbs!" and "4:27".
- **ringtone** `a1381854209`: a white frame with a snowy trees and sky photo.

### Inferences
- The core signature is not "Y2K pink/chrome". It is a **monochrome blue gradient ladder**: #0B0D15 → #121725 → #1F2F55 → #3E609A → #6398C6 → #ACCFE6 → #FFFFFF. Teal (#0F1F28→#B3DBE5) and lilac (#2A2C43→#CACCE8) appear as variants.
- Hierarchy rule: one huge, light, near-abstract image and one hero burst. Text is tiny, spaced, and pushed to edges and corners. Wordmarks are thin or extended, never heavy, except NVISION.
- Several covers are deliberate pastiches of real 2000–2003 trance CD packaging (fake "2002", "2001", "VOL. 1 COMP. ALBUM") or PS1 packaging (PAL, SCPH, catalogue codes).

### Gaps
- No high-resolution exact OCR of the micro-text on RE:vision or hypertrance 2. Some strings at 3–4px are illegible even at 700px.
- I could not confirm whether the hypertrance 1/2 art is original or appropriated from actual 2000s artwork. "OVERHILL.STANDARDS" and "QUD.0" look like they may be copied from a real 2002 CD; unverified.

## 2. Who makes the art?

### Takeaway
None of the Bandcamp release pages I read (hypertrance 1, hypertrance 2, samplepack, THEME, and all 15 nuphory releases) credit a cover artist. The credits fields show only release dates. The consistent `—^—` mark and the VOLANT-era self-made packs ("this is my art...") strongly suggest nuphory designs most of the art himself, but this is unverified.

### Cited Findings
- The credits fields on hypertrance 1, hypertrance 2, the samplepack and THEME contain only "released [date]", with no artwork credit. — [Bandcamp](https://hypertrance.bandcamp.com/album/hypertrance-1)
- digital dreams 1: "this is my art in the form of a retro console themed soundset ... pure fanart made from scratch." The dd2 wording is similar ("my fanart"). — [Bandcamp](https://nuphory.bandcamp.com/album/digital-dreams-1-r300)
- nuphory = VOLANT: the release texts link twitter.com/VOLANTmusic and instagram.com/volantmusicc, and the dd1/dd2 covers carry the VOLANT logo. — [Bandcamp](https://nuphory.bandcamp.com/track/ringtone)
- star anthem 2005: "music + art by @stessiemusic @volantmusic". This is the only explicit art credit found. — [Bandcamp](https://nuphory.bandcamp.com/track/star-anthem-2005)
- depthcore credits the music to "@polyscream @nuphory" (no art credit). — [Bandcamp](https://nuphory.bandcamp.com/track/depthcore)
- gravity breaker is a "collaboration with quatiica motorsports". Quatiica appears to be a visual/brand collaborator: the cover carries Q Racing and "motorsports" livery, and Quatiica's own "First Sync" cover uses the same concentric emblem. YouTube video: https://www.youtube.com/watch?v=wn5nmakKwVI — [Bandcamp](https://nuphory.bandcamp.com/track/gravity-breaker)
- hypertrance.eu web credit: "written with ♡ by patchstep & djkáťo" (site code, not art). Source repo: GitHub nuphory/hypertrance. — [hypertrance.eu](https://hypertrance.eu)
- A search for the cover designer turned up nothing. — [web search, Monstercat profile](https://monstercat.com/artist/nuphory)

### Inferences
- The nuphory emoticon `—^—` (two dashes around a caret, often followed by ™) works as a recurring signature or logo across NVISION, RE:vision, ditherdream1 and gravity breaker. Treat it as the artist's mark.
- Toolchain (unverified, from visual evidence): fractal flames (Apophysis/Chaotica style) for the burst covers (ht2, FINAL GATE, samplepack); 3D glass/chrome renders (C4D/Blender style) for RE:vision, depthcore and the site hero; Photoshop light-streak and halftone overlays plus vector HUD line-art.

### Gaps
- No Behance, ArtStation, Cara or Instagram portfolio was found for any hypertrance cover designer. No process interview was found.

## 3. hypertrance.eu, channels and mix thumbnails

### Takeaway
hypertrance.eu is a dark-navy product landing page for the samplepack.
- Fonts loaded by the site: Michroma (body and most text), Suissnord (wide display caps), plus Comsat Navy, Yeysk, Montserrat and Inter.
- Accents: a pale ice-blue panel color #CAE1EE, a royal-blue top bar #223EB4 and a red "NEW/UPDATED" tag #B91C1C.
- Hero: a rendered chrome/glass shard burst.
- YouTube mix thumbnails reuse the cover language: navy or periwinkle shard bursts and sky/cloud chrome.

### Cited Findings (hypertrance.eu, read in the browser 2026-11-03) — [hypertrance.eu](https://hypertrance.eu)
- Title "HYPERTRANCE SAMPLEPACK". Price and update: "updated november 2024", 45.00 EUR before VAT. Stats: 99 presets, 791 samples, 1187 MB, 69 MIDIs.
- Navigation: Sample Pack, Home, Store (Shopify at store.hypertrance.eu), Catalog, Wiki. Images are hosted on Shopify's CDN.
- Fonts (document.fonts / computed styles): **Michroma** (242 elements, the main face), **Suissnord** (17, the section headers), Comsat Navy 200/400, Yeysk, Montserrat and Inter are also loaded.
- Computed colors:
  - text and dark bg: rgb(18,19,26) = **#12131A**
  - panel and light text: rgb(202,225,238) = **#CAE1EE** (64 elements)
  - card bg: rgb(39,42,60) = **#272A3C**
  - deep navy: rgb(6,19,39) = **#061327**
  - top Discord bar: rgb(34,62,180) = **#223EB4**
  - red badge: rgb(185,28,28) = **#B91C1C**
  - also white and #D4D4D8
- Layout:
  - **Top bar:** a full-width royal-blue strip reading "❯ click here to join our discord."
  - **Hero:** a full-bleed render of black and ice-blue chrome blades radiating from a central vanishing point (`https://hypertrance.eu/_app/immutable/assets/first_frame.d5a321e5.webp`, 2543×772; it appears to be the first frame of a video). A **skewed parallelogram ice-blue card (#CAE1EE)** carries "HYPERTRANCE / SAMPLEPACK" in wide techno caps, a red slanted badge "UPDATED NOVEMBER 2024", a slanted outlined "buy now" button joined to a dark navy price block ("before VAT 45.00EUR"), and a "learn more" link.
  - **Section headers:** centered "> TESTIMONIALS", "> DEMOS", "> BUILDUPS" in Suissnord-style ultra-wide caps, each prefixed with a ">" prompt.
  - **Testimonial cards:** horizontally scrolling, ice-blue, with circular avatars.
  - **Demo list:** ice-blue rows with a play icon and a black waveform.
  - **Feature blocks:** an alternating two-column layout of dark FL Studio/Vital screenshots and ice-blue header tabs, with red "NEW" tags.
  - A floating speaker/mute button at the bottom left.
- Feature image URLs:
  - `https://cdn.shopify.com/s/files/1/0755/3538/4876/files/HTS_Feature_Drums.png`
  - `https://cdn.shopify.com/s/files/1/0755/3538/4876/files/HTS_Feature_Atmos.webp`
  - `https://cdn.shopify.com/s/files/1/0755/3538/4876/files/HTS_Feature_Synths.png` (plus Buildups, Kicks, Loops, Bass, FX and Updates on the same pattern)

**nuphory Bandcamp theme** (custom CSS): white background #FFFFFF, text #424242, accent **#1EC1DC** (bright cyan), secondary #EFF0F2 and #848484. Bio: "join here :: discord.gg/hypertrance". Page background image `https://f4.bcbits.com/img/0031611001_0.jpg`, header `https://f4.bcbits.com/img/0031610891_0.png` (not inspected visually). — [Bandcamp](https://nuphory.bandcamp.com/music)

**YouTube mixes** (search results, read in the browser) — [YouTube search](https://www.youtube.com/results?search_query=hypertrance+one+hour+y2k+trance)
- "hypertrance 2 :: one hour of y2k trance" (channel: hypertrance), `https://i.ytimg.com/vi/3sCu-zjVa5c/hqdefault.jpg`. It uses the hypertrance 2 cover (chamfered "02", spaced title). Palette: #0B0D15, #22335B, #3F609A, #6497C6, #ACD0E6.
- "hypertrance mix [01] :: alphazone, nuphory // 1hr hardtrance mix - best of // initiate ::" (channel: hypertrance), `https://i.ytimg.com/vi/RVnbWEw2qU4/hqdefault.jpg`.
  - A periwinkle/indigo crystal-shard starburst with a white core on near-black #060817.
  - Lower-left wordmark `hypertrance.mix::01` with a "mixed by nuphory" subline in a small rounded techno face.
  - Palette: #1D235C, #4247A9, #7B82D5, #ADB0E6.
- "hypertrance 1 :: one hour of neoy2k music" (channel: nuphory), `https://i.ytimg.com/vi/nONsDtHZk5Y/hqdefault.jpg`.
  - A full **fake media-player/OS HUD frame**: chamfered outer bezel, top-left terminal text log (e.g. "/initiate ... /loading hypertrance..."), left column of small thumbnail tiles, right column of large stacked bracket glyphs and a VOLANT-style "V" chevron, and a bottom scrub bar labeled "HYPERTRANCE YOUTUBE".
  - In the center, an indigo chrome shard burst. Palette: #050716, #171B55, #3E45A7, #A7ABDC.
- **Ipsiom** "Hypertrance Mix [1 Hour Of Hypertrance]" series (mixes 1–8; e.g. `https://i.ytimg.com/vi/JXhQm2lrj-U/hqdefault.jpg`, `https://i.ytimg.com/vi/8sGVedIqYN8/hqdefault.jpg`).
  - The day register: cyan/white chrome-and-glass flower or shard sculptures over a bright sky with cumulus clouds.
  - Text overlay "IPSIOM PRESENTS / HYPERTRANCE 001 MIX" in an italic bold sans with a white-to-sky gradient. Later mixes use a smaller italic extended "IPSIOM PRESENTS ... HYPERTRANCE MIX 006" in the bottom corners.
  - Palette: #DFF5F9, #A3E2F4, #55BCE9.
- Image-Line FLEX "Hypertrance" pack thumbnail `https://i.ytimg.com/vi/H7ASSdD2gIs/maxresdefault.jpg`: blue fractal light streaks on navy, with "FLEX / HYPERTRANCE / BY NUPHORY" in a bold white sans (Image-Line house type, not scene type). — [Image-Line](https://www.image-line.com/news/hypertrance)
- Other community thumbnails seen in the same search:
  - ef1500 "[4 HOUR MIX] HYPERTRANCE | NEOTRANCE | HARDTRANCE": a dense hexD-ish collage of a red-haired anime girl, a Japanese hiragana column, gray mechanical debris and Wikipedia-style "The Internet" text.
  - Nyctereute "Neo-Y2K Hypertrance Playlist": a night dashcam photo of a white Honda S2000. This links the scene to Initial-D / car-culture imagery.

### Inferences
- For a fan site, the official web language is: Michroma body text, Suissnord or wide-extended display caps, an ice-blue #CAE1EE card on #12131A, slanted parallelogram panels, ">" prefixed headers, and a royal-blue utility bar.

### Gaps
- I did not inspect the hypertrance SoundCloud or Discord banners, or the nuphory YouTube channel banner. The YouTube channel pages were not opened.
- The `/home`, `/catalog` and `/wiki` sub-pages of hypertrance.eu were not visually inspected.
- The "ipsiom presents hypertrance 002/003" thumbnails were not individually seen. Only Ipsiom mixes "1" and "6" were viewed.

## 4. Related artists' visuals and recurring motifs

### Takeaway
The roster's personal covers split into three camps:
- **Clean blue/sky chrome**, matching the hypertrance core: crayvxn, Ipsiom, Aekae (Afterimage) and Luna Lenta (Wave).
- **Anime-girl J-core/doujin covers**, more colorful: yuuni, AUSA, Egofear, telemist, Type R (BREAK2000).
- **Experimental white/minimal**: Type R (Crestfall Eterna), Quatiica.

Recurring motifs: chrome or crystal shard bursts, fractal light explosions, sky and cumulus clouds, floor grids, chamfered sci-fi line frames, micro spec-text, fake catalogue or console codes, `[ ]` brackets, `::` and `//` separators, `>>`/`❯` chevrons and the `—^—` emoticon.

### Cited Findings (covers seen via the Bandcamp search API, 350px; URLs = `https://f4.bcbits.com/img/a{ID}_2.jpg`)
- **Luna Lenta** "Wave" `3331762794`: a pure soft gradient from violet #5A3FD0-ish to blue (no text). VOLANT & Luna Lenta "Unending Light" `1222298148`: a jewel-case CD photo on black with a red/green Japanese-style title. — [Bandcamp](https://lunalenta.bandcamp.com/track/wave)
- **Type R** (tags: J-Core, neotrance) — [Bandcamp](https://type-r.bandcamp.com)
  - "Crestfall Eterna" `4169703619`: a white-silver chrome tornado or ribbon with red streaks on white.
  - "BREAK2000" `0998433384`: a full **PlayStation 1 jewel-case parody** (black vertical "PlayStation" spine, anime girl, orange/yellow, "TYPE R BREAK2000" in italic tech type).
- **crayvxn/vjorka** (tags: trance, hypertrance, depthcore, neotrance) — [Bandcamp](https://crayvxn.bandcamp.com)
  - "yumemaboroshi." `0604457525`: sky-blue clouds with chrome shards and spaced lowercase "y u m e m a b o r o s h i".
  - "copium." `4146435515`: cyan sky with dark chrome blade shards and small "crayvxn — copium. EP" text.
  - Closest to the hypertrance look.
- **Aekae** (tags: trance, breaks, hardwave, neotrance) — [Bandcamp](https://aekae.bandcamp.com)
  - "Afterimage LP" `3637926726`: a misty gray-white photo with a translucent overlay rectangle and tiny "Aekae" / "Afterimage LP" captions.
  - "Apex" `0612603322`: a navy-on-cream risograph/halftone collage poster.
- **AUSA** "Hazard" `3949445194`: an anime girl with an ESRB "M" rating box parody and "techno!!". "Quest" `0499708449`: orange and red with a triangle. — [Bandcamp](https://ausaofficial.bandcamp.com)
- **Egofear** "Colors" `1904820352`: an anime girl with an orange "COLORS" header and an HUD sidebar of small icons and katakana. — [Bandcamp](https://egofear.bandcamp.com)
- **telemist** "fstfrwrd" `0829021875`: an anime girl in a dim room, with "TELEMIST" and "FSTFRWRD" in spaced caps. "omniscience ep" `1194612888`: an RGB-split glitch orb. — [Bandcamp](https://telemist.bandcamp.com)
- **yuuni** "Calamity Drive // Third Sky" `2251144528` and "Ruby Paradigm" `4221406620`: purple-haired anime girls with lilac splashes, and red. — [Bandcamp](https://yuuni.bandcamp.com)
- **Ipsiom** (tags: neo y2k, hypertrance, rally house) — [Bandcamp](https://ipsiom.bandcamp.com)
  - "Motion" `2554772334`: black-and-white chrome ribbons with an "Ipsiom" logo.
  - "Reunion" `2985937569`: a cyan fractal-light burst on black.
- **Wyste**: no personal Bandcamp page was found. The "EverAfter" track lives on hypertrance 2. — [Bandcamp](https://hypertrance.bandcamp.com/track/everafter)
- Tags used by the label and roster: `hypertrance`, `neoy2k`, `neo y2k`, `neotrance`, `hardwave`, `virtual self`, `depthcore`, `J-Core`, `rally house`. — [Bandcamp](https://hypertrance.bandcamp.com/album/hypertrance-samplepack-free-demo)

### Inferences
- **Japanese text** is NOT a core hypertrance-label motif. The official covers use English and Latin script only. Japanese appears in the adjacent J-core and anime artists' covers and in hexD-style community mixes.
- **Catalogue codes** appear as `dd1-R300`, `DD2-R300`, `SCPH-9000X`, `PSX 95001`, `VOL. 1`, `'02`, `mix::01`, "TR-01"-style. I did not see the literal "TR-01" string.
- **Contrast with hexD:** hypertrance is clean, high-resolution, blue and luminous, with thin type and lots of negative space. hexD is bitcrushed, red/black, graffiti-like and katakana-heavy (per WKNC, hexD "album art is usually bitcrushed").

### Gaps
- Covers were viewed at 350px only for the related artists, so no detailed text reading was possible.

## 5. Stated design philosophy and adjacent terms

### Takeaway
I found no explicit written design manifesto. The label's stated identity is only the tagline "the ultimate in y2k music and art" and the slogan "DIVE IN. TAKE FLIGHT." Press and fans describe the look as Y2K, retrofuturistic, Frutiger Aero-like and "neo-y2k".

### Cited Findings
- Label bio: "hypertrance — the ultimate in y2k music and art / visit us at hypertrance.eu". — [Bandcamp](https://hypertrance.bandcamp.com/music)
- Slogan "DIVE IN. TAKE FLIGHT." appears on both the samplepack cover and the site. — [hypertrance.eu](https://hypertrance.eu)
- WKNC (Sep 2023) ties the revival to Gen Z nostalgia for "clunky technology", "geometric fonts" and transparent consoles. It calls Virtual Self's EON BREAK aesthetic "a throwback to many RPGs of the late 90s and early 2000s". It says hexD art "is usually bitcrushed" and that hypertrance is an "emerging microgenre", with nuphory's direction more Virtual Self-like. — [WKNC](https://wknc.org/2023/09/01/a-brief-guide-to-the-y2k-trance-revival/)
- AllAboutEDM (6 Mar 2024, on nuphory & Luna Lenta "Leave The World Behind", Monstercat) calls hypertrance a "new emerging microgenre". It likens the sound to the Frutiger Aero aesthetic in musical form, cites retrofuturistic aesthetics, and says the track brings "the eccentricity of the Y2K era to full glory". — [AllAboutEDM](https://allaboutedm.com/?p=99699)
- The Monstercat artist profile says nuphory spearheads the hypertrance genre. — [Monstercat](https://monstercat.com/artist/nuphory)
- Image-Line FLEX "Hypertrance" (21 May 2025, $14.95, 100 presets): "a tribute to trance's golden era", "inspired by analog gear". Its influences are Darude, Tiësto, Ilan Bluestone and Maddix. The page has no visual-design discussion. — [Image-Line](https://www.image-line.com/news/hypertrance)
- An osu! forum post asks for something between "neo-y2k hypertrance" and "frutiger aero". It shows the pairing of terms, but the term is obscure even there. — [osu! forum](https://osu.ppy.sh/community/forums/posts/9878647)
- Adjacent community labels seen: "NEOTRANCE", "HARDTRANCE", "S○○TRANCE" (ef1500 mix title) and "Neo-Y2K Hypertrance" (Nyctereute playlist). — [YouTube search](https://www.youtube.com/results?search_query=hypertrance+one+hour+y2k+trance)

### Inferences
- The best-fitting adjacent design terms are **Y2K futurism / neo-y2k** (chrome, HUD, techno type), the **Frutiger Aero** sky register (ditherdream1, Ipsiom), and the "**late-90s/2000s RPG and trance CD packaging**" pastiche (Virtual Self lineage).
- "Cybercore", "trancecore" and "glitter trance" did not appear in any source I read, so treat those as unsupported for this scene.

### Gaps
- No interview with nuphory about visual design was found. No Reddit thread specifically about the hypertrance look was found; the search returned only general Y2K threads.
