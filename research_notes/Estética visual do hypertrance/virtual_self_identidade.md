# Virtual Self (Porter Robinson, 2017–2019): complete visual identity dossier

Method note: the most reliable data below comes straight from archived files of the official sites. I pulled the HTML, CSS, JS, SVG and images from the Wayback Machine (via the CDX API plus `id_` raw snapshots) and looked at the images directly. Hex values marked "(eyeballed)" are my visual approximations from those images. Hex values marked "(code)" are literal values found in the site's source. Archive URL pattern: `https://web.archive.org/web/<timestamp>/<url>` (add `id_` after the timestamp to get the raw file).

## 1. virtualself.co and virtualself.life: structure and look of the sites

### Takeaway
There were TWO sites, and they are often confused. **virtualself.co** was a full-screen black WebGL (three.js) experience built by the studio **Active Theory** on its "Hydra" framework. It had an orb/crystal, floating italic phrases, a glitchy cursor-mask, two characters and a per-character hue. **virtualself.life** was the "early-internet message board": a stock phpBB3 forum with the dark "DarkFX" skin, where every post comes from the user "self". The ".co" site had a hidden "hunt" mode (a chain of `?hunt=` codes ending in `unlocked.html`), plus base64-hidden PDF links. That was the ARG.

### Cited Findings
**virtualself.co (main site): technical facts and layout**
- Archived captures exist from 2017-11-18 (launch) to 2020. The main HTML snapshot is https://web.archive.org/web/20171118002543/https://www.virtualself.co/ . The `<title>` is literally `V I R T U A L S E L F` (letter-spaced). The share meta description uses Unicode mathematical-italic characters: "𝑇𝘩𝑒 𝑖𝑛𝑓𝑖𝑛𝑖𝑡𝑒 𝑠𝑘𝑦 𝑤𝑖𝑙𝑙 𝘩𝑒𝑎𝑙 𝑢𝑠." and "𝑇𝘩𝑒 𝑏𝑜𝑢𝑛𝑑𝑙𝑒𝑠𝑠 𝘩𝑒𝑎𝑣𝑒𝑛 𝑤𝑖𝑙𝑙 𝑓𝑖𝑙𝑙 𝑜𝑢𝑟 𝑓𝑎𝑑𝑖𝑛𝑔 𝑙𝑖𝑔𝘩𝑡." — [archived HTML](https://web.archive.org/web/20171118002543/https://www.virtualself.co/)
- The CSS is minimal: `body {background:#000; color:#fff}`, a fullscreen `#Stage`, `overflow:hidden`, and user-select disabled. The stylesheet opens with a giant **ASCII-art image** comment (an ASCII-rendered figure) with the line "T h e   i n f i n i t e   s k y   w i l l   h e a l   u s ." spaced out in the middle. Everything visual is rendered in WebGL. — [style.css](https://web.archive.org/web/20171118002544/https://www.virtualself.co/assets/css/style.css)
- The libraries are three.js and howler.js. The JS framework is "Hydra" (Nuke, NukePass, CursorMask, PageTitleGlitch, HuntVFX classes), and the code contains the string `activetheory.net`. In other words, the site was built by **Active Theory** (Venice, CA). This is inferred from the code itself; I found no press credit. — [app.js 2018](https://web.archive.org/web/20180126215338/https://www.virtualself.co/assets/js/app.js?1516327974067), [app.js 2019](https://web.archive.org/web/20190216014414/https://virtualself.co/assets/js/app.js?1533578757799)
- Site assets (all can be viewed via the Wayback Machine), from the CDX listing:
  - landing orb geometry: `assets/geometry/landing/orb.json`
  - crystal/orb textures: [orb/gem.jpg](https://web.archive.org/web/20180126215409/https://www.virtualself.co/assets/images/orb/gem.jpg), `orb/studio.jpg`, `orb/world-normals.jpg`, `orb/play.png`
  - full PBR character maps (ambient/depth/diffuse/mask/normals/reflection) for "a" = technic-Angel and "b" = Pathselector, e.g. [character/a/diffuse.jpg](https://web.archive.org/web/20180304031654/https://virtualself.co/assets/images/character/a/diffuse.jpg) and [character/b/diffuse.jpg](https://web.archive.org/web/20180304031657/https://virtualself.co/assets/images/character/b/diffuse.jpg)
  - intro slides `assets/images/intro/1.jpg`–`12.jpg` and [intro/logo.jpg](https://web.archive.org/web/20180304031652/https://virtualself.co/assets/images/intro/logo.jpg)
  - background textures: [tech.jpg](https://web.archive.org/web/20180304031725/https://www.virtualself.co/assets/images/tech.jpg) (glowing cyan circuit pattern), [code-columns.jpg](https://web.archive.org/web/20180304031734/https://www.virtualself.co/assets/images/code-columns.jpg) (two columns of cryptic phrases), `dust.jpg`, `dot.png`
  - 16 glitch textures `assets/images/textures/0–15.jpg` (2019)
  - [unlocked.jpg](https://web.archive.org/web/20190216014543/https://virtualself.co/assets/images/unlocked.jpg)
  - EP sleeve [ep/front.jpg](https://web.archive.org/web/20180304031700/https://virtualself.co/assets/images/ep/front.jpg) and [ep/back.jpg](https://web.archive.org/web/20180126215417/https://www.virtualself.co/assets/images/ep/back.jpg)
  - tour wordmark PNGs (white on transparent): `tour/utopia-system.png`, `tour/neofantasy.png`, `tour/conciousness.png` [sic], `tour/self.png`, `tour/virtual.png`
  - logo [logo.svg](https://web.archive.org/web/20180722234915/https://virtualself.co/assets/images/logo.svg)
  - share image [meta/cover.jpg](https://web.archive.org/web/20171130061640/https://virtualself.co/assets/meta/cover.jpg)
  - Source: [Wayback CDX query](https://web.archive.org/cdx/search/cdx?url=virtualself.co*&from=2017&to=2020&filter=statuscode:200&collapse=urlkey)
- The site's config defines the two characters with their own hue: `{type:"a", artist:"TECHNIC_ANGEL", hue:.56, tracks:[ANGEL VOICES, EON BREAK, Particle Arts, Key]}` and `{type:"b", artist:"PATHSELECTOR", hue:.11, tracks:[Ghost Voices, A.I.ngel]}`. Hue 0.56 ≈ 202° (sky/ice blue-cyan). Hue 0.11 ≈ 40° (amber/gold). The post-processing pass also uses `uShiftHue: .65` (≈234°, blue-violet). — [app.js 2019](https://web.archive.org/web/20190216014414/https://virtualself.co/assets/js/app.js?1533578757799)
- The listed YouTube embeds per track are:
  - ANGEL VOICES: https://www.youtube.com/watch?v=hfPnq3i4Udw
  - EON BREAK: https://www.youtube.com/watch?v=e7QeR0VxnlA
  - Particle Arts: https://www.youtube.com/watch?v=b06pKMxF6h8
  - Ghost Voices: https://www.youtube.com/watch?v=HPc8QMycGno
  - a locked Pathselector slot: https://www.youtube.com/watch?v=t4GtVp395W8
  - Source: same file
- **ARG / "hunt" mechanic.** Clicking floating text triggers sounds and a hue change (`HuntVFX.changeHue()`). After 3–6 clicks the site navigates to `?hunt=<ID>` (18 IDs, each mapped to a slug such as `eternal`, `digital-awakening`, `self-light-is-virtual`, `this-wishful-ghost-becomes-self-technic`, `infinite-sky-infinite-sky`, `5739343422888838384324`) or to `unlocked.html`. Console messages print styled text (`background:#fff; border:3px solid #000; font-size:20px`). The `ID_TEXT` strings mix Fraktur Unicode ("𝔚ℜℑ𝔗𝔈 𝔄𝔑𝔊𝔈𝔏 𝔈𝔙𝔈ℜ𝔜𝔚ℌ𝔈ℜ𝔈"), superscript letters, bold-italic Unicode ("𝑻𝒉𝒆𝒓𝒆 𝒊𝒔 𝒐𝒏𝒍𝒚 𝒂𝒏 𝒆𝒄𝒉𝒐 𝒐𝒇 𝒘𝒉𝒂𝒕 𝒊𝒔 𝑪𝑯𝑨𝑵𝑵𝑬𝑳…"), "፨" separators and zalgo combining marks. — [app.js 2019](https://web.archive.org/web/20190216014414/https://virtualself.co/assets/js/app.js?1533578757799)
- Two base64 strings in the JS decode to `virtualself.co/p46WIBX7.pdf` and `virtualself.co/rF72lbBE.pdf` (hidden PDFs; the Wayback Machine has no capture of them, so their content is unverified). The site also routed `/virtualselfep` (EP page) and `/UtopiaTour` (tour page). Tour dates came from `https://storage.googleapis.com/virtual-self/publish/data.json`. That bucket is still being captured in 2025–2026 and also held `angelvoicesdemo1hardkicks.mp3`. — same file; [CDX for bucket](https://web.archive.org/cdx/search/cdx?url=storage.googleapis.com/virtual-self/*)
- The site's floating phrase list (also rendered as the image `code-columns.jpg`) includes "Am I eternal?", "Am I still human?", "Do you sense the void angel?", "Heaven's wires will transmit this light.", "The technic-Angel's cry is beginning.", "The A.I.ngel's gate is sacred.", "Has the sense of digital-VIRUS become heaven?" and "Tears will create the voice of euphoria." In the image they are set in a **letter-spaced italic serif** (Times-like), white on black, in two columns. — [code-columns.jpg](https://web.archive.org/web/20180304031734/https://www.virtualself.co/assets/images/code-columns.jpg)
- Fans found hidden text and images in the source plus a link to a 6-second 360° video of grey flashes. Clicking "Am I eternal?" redirected to the second site, a minimalist forum. — [Dancing Astronaut, Nov 2017](https://dancingastronaut.com/2017/11/virtual-self-fans-uncover-hidden-text-images-360-degree-video-virtual-self-website-source-code/)

**virtualself.life (the "message board")**
- It is a phpBB3 forum with the style "**DarkFX**" (based on prosilver; modified by Abhishek Srivastava), titled "Virtual Self • Index page". Nav: Home / FAQ / SEARCH / REGISTER / LOGIN. The forums, with their descriptions:
  - "Surface Reality": "What is revealed - a holy reality?"
  - "Utopia": "The infinite key is the sacred dust of your endless utopia."
  - "Becoming echo": "What happens as the echo floats through you?"
  - "First particle": "Awaken the particle myth."
  - Every "Last post by self". Fake visitor counts are generated by JS (`Math.random()*1000000` "currently viewing"; footer: "4,xxx,xxx users browsing this forum. The infinite sky will heal us.").
  - Source: [archived index, 2017-11-18](https://web.archive.org/web/20171118103635/http://virtualself.life/)
- DarkFX colours.css top values (code): #222222, #8c8b8b, #353535, #808081, #a2a2a2, #1a1a1a, #151515, link blue #105289 / #1664c2, crimson accents #d11a4e / #be1e4a / #bc2a4d / #aa2346. This is the stock theme palette, not custom. — [colours.css](https://web.archive.org/web/20171119231843/http://virtualself.life/styles/darkfx/theme/colours.css)
- Captures of RSS feeds per topic continue through 2022, so the forum stayed online for years. virtualself.life was also used to announce the UTOPiA SySTEM tour (2018). — [CDX virtualself.life](https://web.archive.org/cdx/search/cdx?url=virtualself.life*); [Porter Robinson fandom wiki (search snippet)](https://porter-robinson.fandom.com/wiki/Virtual_Self)
- Robinson's own description: a locked web forum where chatbots hold "ethereal" conversations, meant to feel vast and "user-hostile". He called it atmosphere rather than an ARG. — [Dazed 2018](https://www.dazeddigital.com/music/article/39536/1/porter-robinson-virtual-world-y2k-faves-interview)
- The Fader: a "cryptic website designed to look like an early internet message board"; "every teaser, bit of album art, and website had to be as specific and complete as possible." — [The Fader, 2018-02-28](https://www.thefader.com/2018/02/28/porter-robinson-virtual-self-interview)
- A related sister site, **angelangelangelangelangel.com**, was captured 2018–2019. Its body text is "A N G E L A N G E L …" and it is built on the same Hydra loader. The virtualself.co config references `ANGEL_PREVIEW={id:"angelangelangel"}`, which suggests it was the Angel Voices teaser. Tildes users called it a Virtual Self tie-in with a seizure warning. — [archive 2018-07-19](https://web.archive.org/web/20180719002715/https://angelangelangelangelangel.com/); [Tildes](https://tildes.net/~arts/1qaf/porter_robinsons_angelangelangelangelangel_com_seizure_warning)

### Inferences
- Design takeaway: virtualself.co is "black void + one glowing 3D object + translucent floating italic phrases + glitch/hue-shift on interaction + Unicode-styled text". virtualself.life is "deliberately generic dark phpBB with poetic forum names and fake stats". A tribute site can combine both: a WebGL hero, plus an "old forum" sub-area.
- The "hidden chatbot" in the brief probably refers to the forum's auto-generated posts by "self". I found no evidence of a separate interactive chatbot.

### Gaps
- No archived capture of the hidden PDFs or `unlocked.html` content. I did not render the WebGL site in a browser, so the exact on-screen layout (where buttons sit, cursor style) is inferred from code and assets. The cursor was a WebGL "CursorMask" that revealed textures, not a custom CSS cursor.
- No official credit for Active Theory was found in press; the attribution rests on the source code.
- I found no archived Japanese text on virtualself.co; the cryptic text is English plus Unicode-styled glyphs.

## 2. Covers, logos/sigils, typography and character art

### Takeaway
The EP cover is a glowing blue-violet crystal inside a cyan HUD/magic-circle diagram over a dark navy photo-texture. A vertical outlined lowercase "virtual self" wordmark runs up the left edge, with layers of monospace and italic-serif cryptic text. There are at least three logo forms:
1. the outlined, slanted, blocky lowercase wordmark (logo.svg; custom vector, not a font);
2. the condensed, flared-stroke all-caps "VIRTUALSELF" over a hairline rule with wide-sans micro-subtitles (intro/share image; reads as JRPG / Final Fantasy-style);
3. a small "VRTUL"-style monogram tag in the cover's corner.

Characters: technic-Angel is a dark-cloaked, black-bobbed, freckled girl on a floating charcoal rock disc. Pathselector is a silver-haired figure in an oversized white hoodie with a gold ornate mask, kneeling on a floating white-marble disc. The designers are uncredited in all sources found.

### Cited Findings
- EP cover (front), viewed directly in [ep/front.jpg](https://web.archive.org/web/20180304031700/https://virtualself.co/assets/images/ep/front.jpg):
  - central lavender-white-hot crystal with violet-blue glow
  - thin cyan-white HUD rings, arcs and circles with small glyph nodes
  - dark navy-black background with a blurred circular lens/eye texture
  - the outlined lowercase "virtual self" wordmark set vertically on the left, with tiny white sans subtitles ("The technic-Angel's cry is beginning. What is imagined?")
  - semi-transparent monospace (typewriter/Courier-style) text blocks and a large faint *italic serif* line "the infinite sky…"
  - a small white boxed tag at the bottom right
  - The Wikipedia image description matches: "glowing blue crystal surrounded by geometric lines and circles… title runs vertically on the left in a stylized font." — [Wikipedia: Virtual Self (EP)](https://en.wikipedia.org/wiki/Virtual_Self_(EP))
- EP back, viewed in [ep/back.jpg](https://web.archive.org/web/20180126215417/https://www.virtualself.co/assets/images/ep/back.jpg):
  - steel-blue/white **diagonal hazard-stripe** bands
  - a big blocky "sequence" heading in the same custom face as the wordmark
  - a tracklist panel styled as stacked UI tabs with white numeral boxes 01–05 ("Particle Arts / Ghost Voices / a.i.ngel (Become God) / Key / EON BREAK") in a plain grotesque sans, each with tiny sub-captions
  - layered monospace poetic text on the left
- Share/landing image, viewed in [meta/cover.jpg](https://web.archive.org/web/20171130061640/https://virtualself.co/assets/meta/cover.jpg):
  - a clear quartz crystal (photographic, double-terminated) at the center of a **magic circle**: concentric rings, two overlapping triangles (hexagram), small circles, and rings of tiny pseudo-script glyphs
  - the glowing chrome "VIRTUALSELF" caps wordmark across it, with a glitched horizontal bar underneath
  - a starfield on black
- The intro logo, viewed in [intro/logo.jpg](https://web.archive.org/web/20180304031652/https://virtualself.co/assets/images/intro/logo.jpg):
  - "VIRTUALSELF" in tall condensed caps with sharp tapered/flared strokes (the V and A have hairline diagonals)
  - a white bloom/glow with vertical light streaks
  - a long horizontal rule below
  - mirrored micro-subtitles in a **wide extended sans**: "The technic-Angel's cry is beginning. What is imagined? . . ."
- logo.svg (Adobe Illustrator 22 export, viewBox 1366×116): 13 polygon/path shapes with `fill:none; stroke:#FFFFFF; stroke-width:3.5`. It is a **custom-drawn, right-slanted, geometric outline lettering**, with no font file involved. — [logo.svg](https://web.archive.org/web/20180722234915/https://virtualself.co/assets/images/logo.svg)
- Typography observations from secondary sources: Billboard describes an "angular font". EDM Identity says the logo typography "appears to take inspiration from JRPGs, like Final Fantasy." No confirmed font ID was found; font sites list fonts only for Porter's older lettering (Phoenixians and Mostra Nuova for Worlds/Spitfire), not for Virtual Self. — [search summary incl. EDM Identity](https://edmidentity.com/2017/10/26/porter-robinson-virtual-self-eon-break/); [fontmeme Porter Robinson font](https://fontmeme.com/porter-robinson-font/)
- Robinson cites "digital grunge maximalist abstract art" and a distinctive era typography, with Ray Gun magazine (early-90s, David Carson era) as an influence. He calls the aesthetic "Ethereal cyber maximalism" and borrows the Y2K trope of "little floating sentences that are partially blurry and transparent." — [The Fader](https://www.thefader.com/2018/02/28/porter-robinson-virtual-self-interview)
- Cover process: Robinson first gathered many images that evoked a "feeling of Virtual Self" as the basis for the cover. — [Wikipedia](https://en.wikipedia.org/wiki/Virtual_Self_(EP))
- Characters (official site renders):
  - technic-Angel ("a"): fair-skinned, black blunt-bang bob, freckles, black voluminous cloak/robe, sitting on a floating dark volcanic-rock disc with a matching rock circle (halo) behind, on pure black. — [character/a/diffuse.jpg](https://web.archive.org/web/20180304031654/https://virtualself.co/assets/images/character/a/diffuse.jpg)
  - Pathselector ("b"): silver/white hair, ornate gold (tarnished, filigree) half-mask, oversized white hoodie/dress, kneeling on a floating white Carrara-marble disc with a marble circular backdrop, on black. — [character/b/diffuse.jpg](https://web.archive.org/web/20180304031657/https://virtualself.co/assets/images/character/b/diffuse.jpg)
  - Wikipedia matches this: "Pathselector: a white-dressed, gold-masked figure" (Ghost Voices, a.i.ngel; mid-tempo neotrance). "technic-Angel: fair-skinned, dark-cloaked 'harbinger'" (Particle Arts, Key, EON BREAK; faster hardcore at ~170 BPM). Each character had its own Twitter account (@technic_Angel, @pathselector). — [Wikipedia](https://en.wikipedia.org/wiki/Virtual_Self_(EP)); [Porter tweet](https://x.com/porterrobinson/status/966385512138371072)
  - Sources conflict on which character is "faster/darker": some press reverse it. Wikipedia and the site's track mapping are authoritative. — [web search summary](https://en.wikipedia.org/wiki/Ghost_Voices)
- A "Ghost Voices" single visual is described by Billboard's Kat Bein as a "cool-toned, purple visual". The image often used as the "Ghost Voices" cover actually belongs to a remix EP. — [Wikipedia: Ghost Voices](https://en.wikipedia.org/wiki/Ghost_Voices)
- An ArtStation piece titled "Technic-Angel" exists at https://www.artstation.com/artwork/606BV . It returned 403, so the artist and any connection to the official renders are UNVERIFIED (it may be fan art).

### Inferences
- The identity is deliberately plural rather than one strict logo: a different lettering per surface, unified by white-on-black, glow/bloom, hairline rules, micro-text and the crystal/magic-circle sigil. For a fan site, the strongest "sigils" are (a) the crystal inside a hexagram ring of glyphs, (b) the outlined slanted lowercase wordmark, and (c) the gold mask and black cloak as character icons.
- Font substitutes (my suggestions, not identifications): micro-subtitles → a wide extended sans (Eurostile/Microgramma Extended-like); floating phrases → letter-spaced Times/Georgia Italic; text blocks → Courier/monospace; tracklist → Arial/Helvetica-like grotesque.

### Gaps
- No credited cover designer, 3D character artist or logo designer was found. Discogs/Bandcamp credits were not reachable in this session. The 2020 artbook *Virtual Self: UTOPIA Archive* reportedly contains early logo concepts and may name the collaborators.
- I did not obtain the single covers for "Particle Arts", "EON BREAK", "Key" or "Angel Voices" as files. They need to be checked on Spotify/Bandcamp or Discogs.

## 3. Color palette and mood (verified against actual images)

### Takeaway
Verified: the base is **pure black / deep navy**, carrying **white and silver**, **ice-blue to cyan** glows and **blue-violet/lavender** crystal light. Pathselector adds **gold/amber** and **marble white-grey**. Red is NOT a core accent: red/crimson appears only in the stock phpBB theme of the forum. "White/silver/ice-blue/cyan with red accents" should therefore be revised to "black + white/silver + ice-blue/cyan + violet glow, with gold as the Pathselector accent."

### Cited Findings
- Code-level values:
  - #000 background and #fff text on virtualself.co — [style.css](https://web.archive.org/web/20171118002544/https://www.virtualself.co/assets/css/style.css)
  - JS colours: `rgba(245,230,255,0.4)` (pale lavender-white haze), #3b314a (dusky violet-grey), #181818 — [app.js](https://web.archive.org/web/20190216014414/https://virtualself.co/assets/js/app.js?1533578757799)
  - character hues: technic-Angel 0.56 (≈202°, blue/cyan) and Pathselector 0.11 (≈40°, gold); post-processing hue shift 0.65 (≈234°, blue-violet) — same file
- Eyeballed swatches from official images (approximate):
  - cover background navy-black ~#08101c to #0f1a2a
  - crystal core ~#e8e6ff
  - crystal glow ~#6b6cff / #8a8cff (violet-blue)
  - HUD lines ~#bfe8ff (ice cyan-white)
  - tech.jpg circuit glow ~#22c8ff with core ~#a8f0ff (electric cyan)
  - back-cover stripes ~#4f6f96 and ~#c9d6e4 (steel blue / pale steel)
  - Pathselector marble ~#e4e4e2 with veins ~#6e6e6e, gold mask ~#8c6a2e
  - technic-Angel rock ~#2b2b2b on #000
  - unlocked.jpg: almost-black ~#141418 with faint indigo ~#1c1f3a glitch
  - Sources: [front.jpg](https://web.archive.org/web/20180304031700/https://virtualself.co/assets/images/ep/front.jpg), [tech.jpg](https://web.archive.org/web/20180304031725/https://www.virtualself.co/assets/images/tech.jpg), [back.jpg](https://web.archive.org/web/20180126215417/https://www.virtualself.co/assets/images/ep/back.jpg), [character b](https://web.archive.org/web/20180304031657/https://virtualself.co/assets/images/character/b/diffuse.jpg), [unlocked.jpg](https://web.archive.org/web/20190216014543/https://virtualself.co/assets/images/unlocked.jpg)
- Robinson on the Matrix-era palette: a "greenish-blue, high-contrast hue". — [The Fader](https://www.thefader.com/2018/02/28/porter-robinson-virtual-self-interview)
- Robinson was "obsessed with the colour scheme" of the Lain fansite fauux.neocities.org. — [Dazed](https://www.dazeddigital.com/music/article/39536/1/porter-robinson-virtual-world-y2k-faves-interview)
- Forum (stock DarkFX): #151515/#1a1a1a/#222222 panels, #8c8b8b/#a2a2a2 text, #105289 links, #d11a4e crimson. — [colours.css](https://web.archive.org/web/20171119231843/http://virtualself.life/styles/darkfx/theme/colours.css)

### Inferences
- A suggested design-token set, derived from the above: `--void:#000000; --navy:#0b1422; --ink:#181818; --silver:#c9d6e4; --white:#ffffff; --ice:#bfe8ff; --cyan:#22c8ff; --violet:#6b6cff; --haze:rgba(245,230,255,.4); --dusk:#3b314a; --gold:#8c6a2e` (Pathselector accent). Mood: cold, sacred, "ethereal cyber maximalism", with a glow on near-black.

### Gaps
- No pixel-sampling tool was available (PIL is missing), so the swatches are visual estimates.

## 4. Live show (2017–2019)

### Takeaway
Production was by **Ben Coker** (LD and creative director). The set was a **ground-based modular rig** with no front light, **translucent Plexiglas/acrylic stage decks** with fixtures firing up through them, custom clear-acrylic-top carts, an upstage 30×16 ft LED wall and Pyrotecnico lasers. The show had two phases, one per character. Photos and reports emphasize blue beams. I could not verify the "hooded/visor costume".

### Cited Findings
- Coker served as LD/creative director, with Zenith Lighting (lighting and video), All Access Staging, tour/production manager Ryan Resch and lighting operator Robert Fuller. The stage used a translucent modular Plexiglas deck with beams rising through it, a fully ground-based floor kit with no front-light package, and a 30×16 ft video wall of Oracle 9.7 mm tiles upstage. It ran on a grandMA2 console (mixing manual and timecoded cues) with Pyrotecnico lasers. — PLSN coverage, per search summaries: [PLSN March 2018](https://timeless.mydigitalpublication.com/article/Wide+Focus/3031949/480757/article.html), [plsn.com](https://plsn.com/?p=285350). (I could not open the full text; details come from search snippets.)
- All Access Staging built custom clear acrylic-top carts with pre-loaded fixtures for the Virtual Self Tour; production and lighting design by Ben Coker. — [Live Design Online](https://www.livedesignonline.com/business-people-news/55-yuma-tent-v-squared-ultra-luminosity-virtual-self-tour-more) (snippet; the page returned 403)
- The first show was Dec 8, 2017 in Brooklyn; a photo caption notes blue beams of light radiating from the stage. 2018 included Ultra (Miami). The North American UTOPiA SySTEM tour ran Aug 31 to Oct 4, 2018. — [Wikipedia](https://en.wikipedia.org/wiki/Virtual_Self_(EP))
- Tour dates and support acts (Raito, G Jones, Mat Zo, Eprom) come from the site's data feed. The ticket domain was `virtualself.live`. — [data.json (archived)](https://web.archive.org/web/20240717110827/https://storage.googleapis.com/virtual-self/publish/data.json?1531442720548)
- The tour graphic wordmarks were "UTOPIA SYSTEM", "NEOFANTASY", "CONCIOUSNESS" [sic], "VIRTUAL" and "SELF" as white PNGs. — [CDX listing](https://web.archive.org/cdx/search/cdx?url=virtualself.co*&from=2017&to=2020&filter=statuscode:200&collapse=urlkey)
- The UTOPiA live system had two phases (Pathselector and technic-Angel). Reviewers described a warehouse vibe that felt like going back to the early 2000s. — [Festival Squad](http://festivalsquad.com/2018/10/virtual-selfs-utopia-live-system-a-digital-dream/)
- In the 2019 shows, a "Virtual Self voice" introduced "Angel Voices" (her remix of Ghost Voices). There was a Second Sky 2019 Virtual Self set. — [How Lucky Media, Shrine 2019](https://howluckymedia.com/2019/02/19/virtual-self-the-shrine/); [How Lucky Media, Second Sky](https://howluckymedia.com/2019/06/24/second-sky-virtual-self/)

### Inferences
- Look: light from BELOW through translucent floors, beams rather than wash, an LED wall carrying the WebGL/crystal/HUD content, and lasers. This fits the white/cyan/blue palette.

### Gaps
- Costume (hood/visor), VJ/content studio for the LED wall, laser colours and Coachella-specific production: no source found. Recommended next step: YouTube full sets (e.g. Ultra 2018, Coachella 2018 livestreams) and photographer galleries.

## 5. Music videos and visualizers

### Takeaway
The videos were self-directed by Porter Robinson ("Ghost Voices" is credited to him on IMVDb). They draw directly on Beatmania IIDX 6th/7th Style intros (scrolling text, "cyber" style, floating blue particles), Matrix-era green-blue high contrast, and abandoned-computer warehouses.

### Cited Findings
- Release dates:
  - "EON BREAK": Oct 2017 video with cryptic messages
  - "Particle Arts": Jan 11, 2018
  - "Ghost Voices": Feb 28, 2018
  - "Key": Apr 18, 2018
  - Source: [Wikipedia](https://en.wikipedia.org/wiki/Virtual_Self_(EP))
- The EON BREAK video directly referenced Beatmania intros: scrolling text, "cyber" style, floating blue particles. — [Dazed](https://www.dazeddigital.com/music/article/39536/1/porter-robinson-virtual-world-y2k-faves-interview). Beatmania IIDX 6th Style (2001) and 7th Style (2002) intros were specifically referenced. — [Wikipedia](https://en.wikipedia.org/wiki/Virtual_Self_(EP))
- Ghost Voices: directed by Porter Robinson (IMVDb). Pathselector and technic-Angel wander an old warehouse full of abandoned computers. — [IMVDb](https://imvdb.com/video/virtual-self/ghost-voices); [Dancing Astronaut](https://dancingastronaut.com/2018/02/virtual-self-unveils-glitchy-music-video-ghost-voices/); [EARMILK](https://earmilk.com/2018/02/28/porter-robinson-shares-virtual-selfs-ghost-voices-video)
- Matrix-influenced look, "greenish-blue, high-contrast hue"; t.A.T.u. videos mentioned as an example. — [The Fader](https://www.thefader.com/2018/02/28/porter-robinson-virtual-self-interview)
- Official YouTube links (from the site config): EON BREAK https://www.youtube.com/watch?v=e7QeR0VxnlA ; Particle Arts https://www.youtube.com/watch?v=b06pKMxF6h8 ; Ghost Voices https://www.youtube.com/watch?v=HPc8QMycGno ; Angel Voices https://www.youtube.com/watch?v=hfPnq3i4Udw — [app.js](https://web.archive.org/web/20190216014414/https://virtualself.co/assets/js/app.js?1533578757799)
- Key video. — [DJ Mag](https://djmag.com/content/virtual-self-releases-new-music-video-key-watch)

### Gaps
- I did not watch the videos frame by frame here, so specific devices (PS1/PS2 renders, wireframes) remain UNVERIFIED. Crew credits beyond Porter are unknown.

## 6. Stated references and how they show up

### Takeaway
The named references are: Serial Experiments Lain, the Lain fansites fauux.neocities.org and lain.angelic-trust.net, Depthcore (2001–2003), JODI, Beatmania IIDX intros, early DDR, The Matrix, Final Fantasy, Phantasy Star Online, DeviantArt and forum signatures, Ray Gun magazine, arcade box text, and the Japanese brand Chloma. Text was generated via Google Translate round-trips and Markov chains. Kaskade and Dancemania/avex are not named as visual references in the sources found.

### Cited Findings
- In Dazed, Robinson names:
  - Serial Experiments Lain
  - fauux.neocities.org (colour scheme)
  - Depthcore (depthcore.com; "hyper-period-specific" 2001–03 maximalist Photoshop abstract art)
  - JODI (wwwwwwwww.jodi.org; the website as artwork)
  - Lain Angelic Trust (lain.angelic-trust.net; colour scheme + maximalism + glitchy text)
  - Beatmania intros 1999–2009 (the shift from hip-hop to cyber around 2000)
  - early DDR (graffiti text, metallic fonts, as the contrasting pre-cyber style)
  - Source: [Dazed 2018](https://www.dazeddigital.com/music/article/39536/1/porter-robinson-virtual-world-y2k-faves-interview)
- Other influences: early-2000s DeviantArt, forum signatures, rhythm-game backgrounds, The Matrix, Final Fantasy, Phantasy Star Online, tiny blurred floating sentences, and arcade game box text. Robinson built his mood board using the Wayback Machine. — [Wikipedia](https://en.wikipedia.org/wiki/Virtual_Self_(EP))
- Text generation: Google Translate round-trips and Markov chains, curated afterwards. Ray Gun magazine is also an influence. — [The Fader](https://www.thefader.com/2018/02/28/porter-robinson-virtual-self-interview)
- Chloma "was a huge influence on Virtual Self when he was first developing the project in late 2016." — [EDMTunes 2020](https://www.edmtunes.com/2020/01/virtualself-partners-with-chloma-for-exclusive-charity-merchandise-drop/); [We Rave You](https://weraveyou.com/2020/01/porter-robinson-releases-virtual-self-clothing-line-in-collaboration-with-chloma/)

### Inferences
- How each shows up:
  - Lain/fansites → dark backgrounds, glitch text, sacred/tech vocabulary ("A.I.ngel", "digital-VIRUS become heaven")
  - Depthcore → glowing layered abstract HUD and circuit textures (tech.jpg)
  - JODI → the user-hostile, cryptic site
  - Beatmania → scrolling text and blue particles in videos
  - Final Fantasy → crystal and caps wordmark
  - forum signatures → the phpBB board

### Gaps
- No source ties Dancemania/avex or Kaskade to the visuals; they are musical references at most.

## 7. Merch, artbook and post-2019 activity

### Takeaway
In January 2020 a Chloma collaboration ("Human-ERROR: Lament") and the artbook *Virtual Self: UTOPIA Archive* (~88 pp, ~$49.99, early logo concepts and unused art) were released. I found no evidence of a Virtual Self revival, reissue or anniversary event through Nov 2026. The 9th anniversary of the EP falls on 2026-11-29.

### Cited Findings
- Chloma "Human-ERROR: Lament" included a high-neck zip tee and a skirt; items sold out quickly. The artbook *Virtual Self: UTOPIA Archive* documents unused art and early logo concepts. — [DMNW](https://www.dancemusicnw.com/virtual-self-artbook-fashion-collab/); [EDMTunes](https://www.edmtunes.com/2020/01/virtualself-partners-with-chloma-for-exclusive-charity-merchandise-drop/); [DJ Mag Asia (via Wikipedia)](https://www.djmagasia.com/?p=5941)
- The Google Cloud bucket `virtual-self/publish/data.json` was still being crawled in 2025–2026 (snapshots 2025-07, 2025-10, 2026-01), but captures return the same 2018 data, which shows no new activity. — [CDX](https://web.archive.org/cdx/search/cdx?url=storage.googleapis.com/virtual-self/*)
- The search found no 2024–2026 Virtual Self return; Porter toured as himself (SMILE! :D world tour 2024–25). — [search summary](https://wiki.riteme.site/wiki/Porter_Robinson)

### Gaps
- Original 2018 tour merch designs were not documented. Whether the artbook is still in print is unverified. Any 2026 news should be re-checked on Porter's socials.
