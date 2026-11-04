/*
  TR-01 :: hypertrance — catálogo
  --------------------------------
  Cada lançamento toca pelo YouTube (controlado pelo player) e/ou pelo embed do Bandcamp.
  Capas vêm do CDN do Bandcamp:
    https://f4.bcbits.com/img/a<art>_<tamanho>.jpg   (3 = 100px, 2 = 350px, 16 = 700px, 10 = original)
  ou de um arquivo local em `cover` (usado no Virtual Self, que não está no Bandcamp).

  Campos:
    bcType     "album" | "track"   (o embed do Bandcamp muda conforme o tipo)
    youtube    um ID, ou uma lista de IDs tocados em sequência
    tracks     opcional: [título, youtubeId] — vira tracklist clicável na ficha
    rym        notas aproximadas (o RYM bloqueia acesso automatizado)
    code       código de catálogo do próprio site (decorativo)
  Dados do Bandcamp e do YouTube conferidos em 03/11/2026.
*/
window.HT_ALBUMS = [
  /* ===== origem ===== */
  {
    id: "virtual-self",
    title: "Virtual Self",
    artist: "Virtual Self",
    year: 2017, released: "29 nov 2017",
    label: "Virtual Self",
    genres: ["Trance", "Hard Trance", "Hardstyle"],
    subgenres: ["Eurobeat", "Y2K Trance", "Happy Hardcore"],
    rym: { rating: null, count: null, rank: null },
    cover: "assets/vs/ep_front.jpg",
    bandcampId: null,
    bandcamp: null,
    soundcloud: null,
    links: [
      ["Spotify", "https://open.spotify.com/search/virtual%20self"],
      ["YouTube (Porter Robinson)", "https://www.youtube.com/watch?v=HPc8QMycGno"]
    ],
    youtube: ["b06pKMxF6h8", "HPc8QMycGno", "c2t0UljO_AY", "zdLhJ9lB5x0", "e7QeR0VxnlA"],
    tracks: [
      ["Particle Arts", "b06pKMxF6h8"],
      ["Ghost Voices", "HPc8QMycGno"],
      ["a.i.ngel (Become God)", "c2t0UljO_AY"],
      ["Key", "zdLhJ9lB5x0"],
      ["EON BREAK", "e7QeR0VxnlA"]
    ],
    bonus: [["Angel Voices", "hfPnq3i4Udw"]],
    price: "streaming",
    note: "Projeto de Porter Robinson. Ghost Voices foi indicada ao Grammy de Melhor Gravação Dance. A WKNC (2023) aponta o Virtual Self como inspiração direta do HYPERTRANCE do nuphory.",
    code: "TR-00"
  },

  /* ===== selo hypertrance ===== */
  {
    id: "hypertrance-1",
    title: "hypertrance 1",
    artist: "Various Artists",
    year: 2023, released: "17 mar 2023",
    label: "hypertrance",
    genres: ["Uplifting Trance", "Trance"],
    subgenres: ["Hypertrance", "Neo-Y2K", "Hard Trance"],
    rym: { rating: 3.61, count: null, rank: null, note: "RYM lista como Hypertrance Vol. 1 (22/12/2021): conferir" },
    art: "1926030386",
    bandcampId: 4200783088, bcType: "album",
    bandcamp: "https://hypertrance.bandcamp.com/album/hypertrance-1",
    youtube: "nONsDtHZk5Y",
    price: "name your price (€0+)",
    free: true,
    note: "20 faixas: Luna Lenta, Aekae, Type R, AUSA, SAM WAITIN, nuphory (NVISION mix cut, HYPERTRANCE telemist remix)… O vídeo é o mix contínuo “one hour of neoy2k music”.",
    code: "TR-01"
  },
  {
    id: "hypertrance-2",
    title: "hypertrance 2",
    artist: "Various Artists",
    year: 2023, released: "17 mar 2023",
    label: "hypertrance",
    genres: ["Uplifting Trance", "Trance"],
    subgenres: ["Hypertrance", "Neo-Y2K", "Hard Trance"],
    rym: { rating: 3.75, count: "~80", rank: null },
    art: "0810603410",
    bandcampId: 747432886, bcType: "album",
    bandcamp: "https://hypertrance.bandcamp.com/album/hypertrance-2",
    youtube: "3sCu-zjVa5c",
    price: "name your price (€0+)",
    free: true,
    note: "21 faixas: nuphory, Wyste, Aekae, yuuni, Type R, crayvxn, Luna Lenta, AUSA… Vídeo: “one hour of y2k trance” (1h34).",
    code: "TR-02"
  },
  {
    id: "hypertrance-theme",
    title: "HYPERTRANCE THEME",
    artist: "nuphory",
    year: 2023, released: "17 mar 2023",
    label: "hypertrance",
    genres: ["Uplifting Trance", "Trance"],
    subgenres: ["Hypertrance"],
    rym: { rating: null, count: null, rank: null },
    art: "0444681167",
    bandcampId: 3934471359, bcType: "track",
    bandcamp: "https://hypertrance.bandcamp.com/track/hypertrance-theme",
    youtube: "htI236H7cc4",
    price: "download grátis",
    free: true,
    note: "Também saiu como “GET READY (HYPERTRANCE THEME)”, a faixa de abertura do NVISION EP.",
    code: "TR-03"
  },
  {
    id: "samplepack",
    title: "hypertrance samplepack / free demo",
    artist: "nuphory & luna lenta",
    year: 2023, released: "11 ago 2023",
    label: "hypertrance",
    genres: ["Sample Pack"],
    subgenres: ["Hypertrance"],
    rym: { rating: null, count: null, rank: null },
    art: "0080777009",
    bandcampId: 2862766369, bcType: "album",
    bandcamp: "https://hypertrance.bandcamp.com/album/hypertrance-samplepack-free-demo",
    youtube: null,
    price: "demo grátis · pack completo em hypertrance.eu",
    free: true,
    note: "“DIVE IN. TAKE FLIGHT.” Demo do samplepack desenvolvido pelo nuphory, descrito como no estilo Virtual Self.",
    code: "TR-04"
  },

  /* ===== nuphory ===== */
  {
    id: "hypertrance-single",
    title: "HYPERTRANCE",
    artist: "nuphory",
    year: 2021, released: "16 abr 2021",
    label: "independente",
    genres: ["Uplifting Trance", "Trance"],
    subgenres: ["Hypertrance", "Neo-Y2K"],
    rym: { rating: 3.76, count: "56", rank: null },
    art: "0631135966",
    bandcampId: 3638648918, bcType: "track",
    bandcamp: "https://nuphory.bandcamp.com/track/hypertrance",
    youtube: "_J3zqwFBzTU",
    price: "name your price (€0+)",
    free: true,
    note: "A faixa que deu nome à cena. Piano melódico Y2K, inspiração direta no Virtual Self (WKNC, 2023).",
    code: "TR-05"
  },
  {
    id: "final-gate",
    title: "FINAL GATE / ETHEREAL REALITY",
    artist: "nuphory",
    year: 2021, released: "11 jun 2021",
    label: "independente",
    genres: ["Uplifting Trance", "Progressive Trance"],
    subgenres: ["Hypertrance"],
    rym: { rating: null, count: null, rank: null },
    art: "1943225314",
    bandcampId: 1067129340, bcType: "track",
    bandcamp: "https://nuphory.bandcamp.com/track/final-gate-ethereal-reality",
    youtube: "s4NBCW-1PW4",
    price: "name your price (€0+)",
    free: true,
    note: "Vídeo: “HYPERTRANCE 「FINAL GATE」 ETHEREAL REALITY REANIMATION PROJECT 2001”.",
    code: "TR-06"
  },
  {
    id: "re-vision",
    title: "HYPERTRANCE RE:vision",
    artist: "nuphory",
    year: 2022, released: "15 abr 2022",
    label: "independente",
    genres: ["Uplifting Trance", "Trance"],
    subgenres: ["Hypertrance", "Neo-Y2K"],
    rym: { rating: 3.7, count: null, rank: null },
    art: "0371667811",
    bandcampId: 3027757231, bcType: "album",
    bandcamp: "https://nuphory.bandcamp.com/album/hypertrance-re-vision",
    youtube: "trp7H_RpqZc",
    price: "download grátis",
    free: true,
    note: "HYPERTRANCE / ETERNAL SPRING · EXOPLANET (ft. luna lenta) · TELEMIST REMIX. A capa é a “exoplanet '02”.",
    code: "TR-07"
  },
  {
    id: "nvision",
    title: "NVISION EP",
    artist: "nuphory",
    year: 2022, released: "13 mai 2022",
    label: "independente",
    genres: ["Uplifting Trance", "Trance"],
    subgenres: ["Hypertrance"],
    rym: { rating: null, count: null, rank: null },
    art: "3283163966",
    bandcampId: 679465676, bcType: "album",
    bandcamp: "https://nuphory.bandcamp.com/album/nvision-ep",
    youtube: "r_P52cz95aM",
    price: "download grátis",
    free: true,
    note: "GET READY (HYPERTRANCE THEME) · TIMESCAPE · NVISION (EXTENDED MIX).",
    code: "TR-08"
  },
  {
    id: "ditherdream1",
    title: "ditherdream1",
    artist: "nuphory",
    year: 2022, released: "25 nov 2022",
    label: "independente",
    genres: ["Trance", "Breakbeat"],
    subgenres: ["Hypertrance", "Y2K"],
    rym: { rating: null, count: null, rank: null },
    art: "3779121244",
    bandcampId: 3332776732, bcType: "album",
    bandcamp: "https://nuphory.bandcamp.com/album/ditherdream1",
    youtube: "J7asR_vom6o",
    price: "a partir de €5",
    note: "Com Pizza Hotline e SAM WAITIN. “this got leaked but we decided to just put it out.”",
    code: "TR-09"
  },
  {
    id: "gravity-breaker",
    title: "gravity breaker",
    artist: "nuphory, Quatiica",
    year: 2026, released: "23 out 2026",
    label: "independente",
    genres: ["Trance", "Hard Trance"],
    subgenres: ["Hypertrance"],
    rym: { rating: null, count: null, rank: null },
    art: "3760845930",
    bandcampId: 1210540138, bcType: "track",
    bandcamp: "https://nuphory.bandcamp.com/track/gravity-breaker",
    youtube: "wn5nmakKwVI",
    price: "name your price (€0+)",
    free: true,
    note: "Colaboração com a “quatiica motorsports”. Lançamento mais recente do nuphory.",
    code: "TR-10"
  },
  {
    id: "digital-dreams-1",
    title: "digital dreams 1 R300",
    artist: "VOLANT (nuphory)",
    year: 2021, released: "5 mar 2021",
    label: "independente",
    genres: ["Sample Pack"],
    subgenres: ["Retro Console Soundset"],
    rym: { rating: null, count: null, rank: null },
    art: "3669851578",
    bandcampId: 2685814820, bcType: "album",
    bandcamp: "https://nuphory.bandcamp.com/album/digital-dreams-1-r300",
    youtube: null,
    price: "€13",
    note: "Soundset com tema de console retrô, lançado quando o nuphory ainda assinava como VOLANT. Demo no SoundCloud.",
    code: "TR-11"
  },
  {
    id: "digital-dreams-2",
    title: "digital dreams 2 R300",
    artist: "VOLANT (nuphory)",
    year: 2021, released: "2 abr 2021",
    label: "independente",
    genres: ["Sample Pack"],
    subgenres: ["Retro Console Soundset"],
    rym: { rating: null, count: null, rank: null },
    art: "1736330578",
    bandcampId: 307167499, bcType: "album",
    bandcamp: "https://nuphory.bandcamp.com/album/digital-dreams-2-r300",
    youtube: null,
    price: "€13",
    note: "Segunda parte do soundset de console retrô (como VOLANT).",
    code: "TR-12"
  }
];

/* Fileiras do site. "ranked" mostra #1, #2… */
window.HT_SHELVES = [
  {
    title: "hypertrance :: selo", code: "SEL-01", note: "the ultimate in y2k music and art",
    ids: ["hypertrance-2", "hypertrance-1", "hypertrance-theme", "samplepack"]
  },
  {
    title: "nuphory :: discografia", code: "NPH-02", note: "do HYPERTRANCE (2021) ao gravity breaker (2026)",
    ids: ["hypertrance-single", "final-gate", "re-vision", "nvision", "ditherdream1", "gravity-breaker", "digital-dreams-1", "digital-dreams-2"]
  }
];
