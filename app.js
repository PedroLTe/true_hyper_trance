/* TR-01 :: hypertrance — tocador, origem (Virtual Self) e fileiras */
(() => {
  const albums = window.HT_ALBUMS;
  const shelves = window.HT_SHELVES;
  const byId = Object.fromEntries(albums.map((a, i) => [a.id, { ...a, index: i }]));
  const dayIds = new Set(shelves.filter((s) => s.bg === "day").flatMap((s) => s.ids)); // fundo claro
  const $ = (s) => document.querySelector(s);

  const cover = (a, size = 2) => a.cover || `https://f4.bcbits.com/img/a${a.art}_${size}.jpg`;
  const bcEmbed = (a) => {
    const track = a.bcType === "track";
    return `https://bandcamp.com/EmbeddedPlayer/${track ? "track" : "album"}=${a.bandcampId}/size=large/bgcol=0b1422/linkcol=7cb4da/` +
      `tracklist=${!track}/artwork=small/transparent=true/`;
  };
  const ytList = (a) => (!a.youtube ? [] : Array.isArray(a.youtube) ? a.youtube : [a.youtube]);
  const allTracks = (a) => [...(a.tracks || []), ...(a.bonus || [])];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (t) => {
    t = Math.max(0, Math.floor(t || 0));
    const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
    const mm = String(m).padStart(2, "0"), ss = String(s).padStart(2, "0");
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  /* ================= tocador ================= */
  const el = {
    player: $(".player"), media: $(".screen-media"), idle: $("#screen-idle"), bc: $("#bc"),
    title: $("#lcd-title"), time: $("#lcd-time"), src: $("#lcd-src"), log: $("#log"),
    seek: $("#seek"), fill: $("#seek-fill"),
    play: $("#btn-play"), prev: $("#btn-prev"), next: $("#btn-next"), srcBtn: $("#btn-src"), info: $("#btn-info"),
    volume: $("#volume"), playlist: $("#playlist"), ticker: $("#ticker"),
    lensCover: $("#lens-cover"), chip: $("#np-chip"), npImg: $("#np-img"), npTitle: $("#np-title"), npPlay: $("#np-play"), npBar: $("#np-bar")
  };

  let current = -1;      // índice em albums
  let everPlayed = false;
  let mode = null;       // "yt" | "bc"
  let queue = [];        // IDs do YouTube do lançamento atual
  let qi = 0;            // posição na fila
  let trackNames = [];   // nomes das faixas da fila (quando conhecidos)
  let yt = null, ytReady = false, pending = null;

  const log = (msg) => { el.log.textContent = msg; };

  /* O Firefox (e às vezes o Safari) bloqueia o autoplay com som dentro do iframe do YouTube quando
     o play vem de um botão desta página: o vídeo fica parado sem erro. Se não começar a tocar em
     ~2,5s, pedimos um clique direto na tela do vídeo; depois disso o iframe fica liberado. */
  let watchdog = 0;
  function needGesture(on) {
    el.media.classList.toggle("needs-gesture", on);
    if (on) {
      el.time.textContent = "clique na tela ▶";
      log("/autoplay bloqueado :: clique no vídeo");
    }
  }
  function expectPlay() {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (mode !== "yt" || !ytReady) return;
      const st = yt.getPlayerState();
      if (st !== YT.PlayerState.PLAYING && st !== YT.PlayerState.BUFFERING) needGesture(true);
    }, 2500);
  }

  function setPlaying(on) {
    el.player.classList.toggle("is-playing", on);
    el.npPlay.textContent = on ? "❚❚" : "▶";
    el.chip.classList.toggle("is-playing", on);
    if (on && !everPlayed) { everPlayed = true; syncChip(); }
  }

  // anel de progresso em volta da lente (pathLength = 100)
  function setProgress(pct) {
    el.fill.style.strokeDashoffset = 100 - pct;
    el.npBar.style.width = pct + "%";
    el.seek.setAttribute("aria-valuenow", Math.round(pct));
  }

  function setLcd(text) {
    el.title.textContent = text;
    el.title.style.animation = "none"; void el.title.offsetWidth; el.title.style.animation = "";
  }

  function lcdText() {
    const a = albums[current];
    const name = trackNames[qi];
    return name
      ? `${a.artist} — ${name}  ·  ${a.title} ${qi + 1}/${queue.length}  ·  ${a.year}`
      : `${a.artist} — ${a.title}  ·  ${a.year}  ·  ${a.genres.join(" / ")}`;
  }

  function markCurrent() {
    const id = albums[current]?.id;
    document.querySelectorAll(".card").forEach((c) => c.classList.toggle("is-current", c.dataset.id === id));
    el.playlist.querySelectorAll("li").forEach((li, i) => li.classList.toggle("is-current", i === current));
    const vsPlaying = id === "virtual-self";
    document.querySelectorAll("#vs-tracks li").forEach((li) => {
      li.classList.toggle("is-current", vsPlaying && li.dataset.yt === queue[qi]);
    });
  }

  function showYT() {
    mode = "yt";
    el.bc.hidden = true; el.bc.removeAttribute("src");
    el.media.classList.remove("bc-mode");
    el.play.disabled = el.npPlay.disabled = false;
    el.src.textContent = "YOUTUBE";
    el.srcBtn.textContent = "BC";
  }

  /* Modo Bandcamp: o embed é um iframe de outro domínio e NÃO aceita controle externo.
     Play/pausa, anterior/próximo dentro do álbum, a barra de progresso e o volume do TR·AMP
     não alcançam esse player; quem ouve usa os controles do próprio embed e o volume da aba/sistema.
     Por isso o botão de play fica desativado e o LCD mostra "use o player". */
  function showBC(a, reason) {
    mode = "bc";
    clearTimeout(watchdog);
    needGesture(false);
    if (yt && ytReady) yt.stopVideo();
    setPlaying(false);
    el.bc.src = bcEmbed(a);
    el.bc.hidden = false;
    el.media.classList.add("bc-mode");
    el.play.disabled = el.npPlay.disabled = true;
    setProgress(0);
    el.time.textContent = reason || "use o player ↑";
    el.src.textContent = "BANDCAMP";
    el.srcBtn.textContent = "YT";
    el.srcBtn.disabled = !ytList(a).length;
    log(`/stream bandcamp :: ${a.code}`);
  }

  function playQueued(autoplay) {
    const id = queue[qi];
    if (autoplay) { yt.loadVideoById(id); expectPlay(); }
    else yt.cueVideoById(id);
  }

  /* track: índice em allTracks(a) (faixas do EP + bônus) */
  function load(index, { autoplay = true, source, track } = {}) {
    current = (index + albums.length) % albums.length;
    const a = albums[current];
    const list = ytList(a);
    const tracks = allTracks(a);
    const mainCount = (a.tracks || []).length;

    if (track != null && track >= mainCount && tracks[track]) {
      queue = [tracks[track][1]]; trackNames = [tracks[track][0]]; qi = 0;   // faixa bônus: toca sozinha
    } else {
      queue = list; trackNames = (a.tracks || []).map((t) => t[0]); qi = track || 0;
    }

    el.idle.hidden = true;
    el.lensCover.src = cover(a, 16);
    el.npImg.src = cover(a, 3);
    el.npTitle.textContent = `${a.artist} — ${a.title}`;
    syncChip();
    setLcd(lcdText());
    el.ticker.textContent = `❯ now playing ❯ ${a.artist} — ${a.title} ❯ ${a.label} ❯ ${a.year} ❯ ${a.code} ❯ apoie o artista ❯`;
    el.srcBtn.disabled = !(list.length && a.bandcampId);
    markCurrent();
    if (autoplay) {
      window.TRBG?.dive();
      window.TRBG?.setTheme?.(dayIds.has(a.id) ? "day" : "night");
    }
    log(`/load ${a.code} :: ${a.id}`);

    const want = source || (queue.length ? "yt" : "bc");
    if (want === "bc" || !queue.length) {
      if (a.bandcampId) return showBC(a);
      queue = list; // sem Bandcamp: fica no YouTube
    }

    showYT();
    el.time.textContent = "carregando...";
    if (!ytReady) { pending = { autoplay }; return; }
    playQueued(autoplay);
  }

  /* auto: no fim do vídeo pula os lançamentos que só existem no Bandcamp,
     para a reprodução contínua não parar num embed que não aceita controle externo */
  function advance(auto = false) {
    if (qi < queue.length - 1) {
      qi++;
      setLcd(lcdText());
      markCurrent();
      return playQueued(true);
    }
    let next = current + 1;
    if (auto) {
      for (let k = 1; k <= albums.length; k++) {
        const i = (current + k) % albums.length;
        if (ytList(albums[i]).length) { next = i; break; }
      }
    }
    load(next);
  }

  function togglePlay() {
    if (current < 0) return load(0);
    if (mode !== "yt" || !ytReady) return;
    const st = yt.getPlayerState();
    if (st === YT.PlayerState.PLAYING) return yt.pauseVideo();
    yt.playVideo();
    expectPlay();
  }

  // YouTube IFrame API
  window.onYouTubeIframeAPIReady = () => {
    yt = new YT.Player("yt", {
      width: "100%", height: "100%",
      playerVars: { controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, disablekb: 1, origin: location.origin },
      events: {
        onReady: () => {
          ytReady = true;
          yt.setVolume(+el.volume.value);
          if (pending && mode === "yt") playQueued(pending.autoplay);
          pending = null;
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) {
            clearTimeout(watchdog);
            needGesture(false);
            setPlaying(true);
            log("/stream youtube :: ok");
            document.title = `▶ ${albums[current].title} :: TR-01`;
          } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.CUED) {
            setPlaying(false);
            document.title = "TR-01 :: hypertrance";
          } else if (e.data === YT.PlayerState.ENDED) {
            setPlaying(false);
            advance(true);
          }
        },
        // vídeo removido ou sem permissão de embed: cai para o Bandcamp (ou pula a faixa)
        onError: () => {
          if (mode !== "yt") return;
          const a = albums[current];
          log("/error youtube :: fallback");
          if (a.bandcampId) showBC(a, "YT indisponível → BC");
          else advance(true);
        }
      }
    });
  };
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  setInterval(() => {
    if (mode !== "yt" || !ytReady || current < 0) return;
    const t = yt.getCurrentTime() || 0, d = yt.getDuration() || 0;
    if (!d) return;
    el.time.textContent = `${fmt(t)} / ${fmt(d)}`;
    const pct = (t / d) * 100;
    setProgress(pct);
  }, 250);

  function seekTo(frac) {
    if (mode !== "yt" || !ytReady) return;
    const d = yt.getDuration();
    if (d) yt.seekTo(Math.min(Math.max(frac, 0), 1) * d, true);
  }
  // o anel começa no topo e corre no sentido horário: o ângulo do clique vira a posição
  el.seek.addEventListener("click", (e) => {
    const r = el.seek.getBoundingClientRect();
    const ang = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    seekTo((((ang * 180) / Math.PI + 90 + 360) % 360) / 360);
  });
  el.seek.addEventListener("keydown", (e) => {
    if (mode !== "yt" || !ytReady) return;
    const step = e.key === "ArrowRight" ? 10 : e.key === "ArrowLeft" ? -10 : 0;
    if (!step) return;
    e.preventDefault();
    yt.seekTo(yt.getCurrentTime() + step, true);
  });

  el.play.addEventListener("click", togglePlay);
  el.prev.addEventListener("click", () => {
    if (current >= 0 && mode === "yt" && qi > 0) { qi--; setLcd(lcdText()); markCurrent(); return playQueued(true); }
    load(current < 0 ? 0 : current - 1);
  });
  el.next.addEventListener("click", () => (current < 0 ? load(0) : advance()));
  el.srcBtn.addEventListener("click", () => {
    if (current < 0) return;
    load(current, { source: mode === "yt" ? "bc" : "yt" });
  });
  el.info.addEventListener("click", () => openModal(albums[current < 0 ? 0 : current]));
  el.volume.addEventListener("input", () => { if (ytReady) yt.setVolume(+el.volume.value); });

  el.npPlay.addEventListener("click", togglePlay);
  let stageVisible = true;
  // o chip só aparece depois que algo tocou de verdade (não na abertura)
  const syncChip = () => { el.chip.hidden = stageVisible || !everPlayed; };
  new IntersectionObserver(([entry]) => { stageVisible = entry.isIntersecting; syncChip(); }, { threshold: 0.15 })
    .observe($("#stage"));

  /* ================= playlist ================= */
  el.playlist.innerHTML = albums.map((a, i) => `
    <li><button type="button" data-i="${i}">
      <span class="pl-n">${esc(a.code)}</span>
      <span class="pl-thumb"><img src="${cover(a, 3)}" alt="" loading="lazy" width="38" height="38"></span>
      <span class="pl-t">${esc(a.title)} <small>${esc(a.artist)}</small></span>
      <span class="pl-eq" aria-hidden="true"><i></i><i></i><i></i></span>
    </button></li>`).join("");
  $("#pl-count").textContent = `${albums.length} lançamentos`;
  el.playlist.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (b) load(+b.dataset.i);
  });

  /* ================= origem: Virtual Self ================= */
  const vs = byId["virtual-self"];
  const mainCount = vs.tracks.length;
  $("#vs-tracks").innerHTML = allTracks(vs).map(([name, id], i) => `
    <li data-yt="${id}"><button type="button" data-track="${i}">
      <span class="n">${String(i + 1).padStart(2, "0")}</span>
      <span>${esc(name)}</span>
      <span class="tag">${i < mainCount ? "EP" : "SINGLE"}</span>
    </button></li>`).join("");
  $("#vs-tracks").addEventListener("click", (e) => {
    const b = e.target.closest("[data-track]");
    if (b) load(vs.index, { track: +b.dataset.track });
  });
  $("#vs-play").addEventListener("click", () => load(vs.index));
  $("#vs-info").addEventListener("click", () => openModal(vs));

  // os dois matizes: technic-Angel (ciano) / Pathselector (ouro)
  const root = document.documentElement;
  function setChar(c, flash) {
    root.dataset.char = c;
    document.querySelectorAll("[data-set-char]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.setChar === c));
    window.TRBG?.setColor(c === "path" ? "#E6C17A" : "#22C8FF");
    try { localStorage.setItem("tr01-char", c); } catch (e) { /* sem storage */ }
    if (flash) {
      const o = $(".origin");
      o.classList.remove("glitch"); void o.offsetWidth; o.classList.add("glitch");
    }
  }
  document.querySelector(".char-switch").addEventListener("click", (e) => {
    const b = e.target.closest("[data-set-char]");
    if (b) setChar(b.dataset.setChar, true);
  });
  $("#crystal").addEventListener("click", () => setChar(root.dataset.char === "path" ? "angel" : "path", true));
  try { const saved = localStorage.getItem("tr01-char"); if (saved) setChar(saved); } catch (e) { /* sem storage */ }

  /* ================= fileiras ================= */
  const frame = (a, size, extra = "") => `
    <span class="crosshair tl"></span><span class="crosshair br"></span>
    ${extra}
    <span class="cover-tag">${esc(a.code)}</span>
    <span class="cover-box">
      <img src="${cover(a, size)}" alt="Capa de ${esc(a.title)}" loading="lazy">
      <span class="play-hint"><span>▶</span></span>
    </span>
    <span class="frame-foot"><span>${a.year} // ${a.free ? "FREE" : "PAL"}</span><span class="barcode"></span><span class="led"></span></span>`;

  $("#shelves").innerHTML = shelves.map((s, si) => `
    <section class="shelf">
      <div class="shelf-head">
        <h2 class="section-title">&gt; ${esc(s.title)}</h2>
        <span class="shelf-code">${esc(s.code)}</span>
        <span class="shelf-note">${esc(s.note)}</span>
      </div>
      <div class="track-wrap">
        <button class="arrow prev" data-dir="-1" aria-label="Voltar" hidden>◀</button>
        <div class="track" id="track-${si}">
          ${s.ids.map((id, i) => {
            const a = byId[id];
            return `
            <article class="card" data-id="${a.id}">
              <button class="frame" type="button" data-play="${a.index}" aria-label="Tocar ${esc(a.title)}">
                ${frame(a, 2, s.ranked ? `<span class="rank">#${i + 1}</span>` : "")}
              </button>
              <div class="card-meta">
                <button class="card-title" type="button" data-info="${a.id}">${esc(a.title)}</button>
                <div class="card-artist">${esc(a.artist)}</div>
                <div class="card-genre">${esc(a.genres[0])} · ${a.year}${a.free ? ' · <span class="free-tag">FREE</span>' : ""}</div>
              </div>
            </article>`;
          }).join("")}
        </div>
        <button class="arrow next" data-dir="1" aria-label="Avançar">▶</button>
      </div>
    </section>`).join("");

  document.querySelectorAll(".track-wrap").forEach((wrap) => {
    const track = wrap.querySelector(".track");
    const prev = wrap.querySelector(".prev"), next = wrap.querySelector(".next");
    const update = () => {
      prev.hidden = track.scrollLeft < 4;
      next.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    wrap.addEventListener("click", (e) => {
      const arrow = e.target.closest(".arrow");
      if (arrow) track.scrollBy({ left: +arrow.dataset.dir * track.clientWidth * 0.8, behavior: "smooth" });
    });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  $("#shelves").addEventListener("click", (e) => {
    const p = e.target.closest("[data-play]");
    if (p) return load(+p.dataset.play);
    const info = e.target.closest("[data-info]");
    if (info) openModal(byId[info.dataset.info]);
  });

  /* ================= ficha do lançamento ================= */
  const modal = $("#modal"), body = $("#modal-body");
  let lastFocus = null;

  function openModal(a) {
    const i = albums.findIndex((x) => x.id === a.id);
    const r = a.rym || {};
    const rating = r.rating
      ? `<b>${r.rating.toFixed(2)}</b> / 5.0${r.count ? ` · ${esc(r.count)} notas` : ""} <small>(aprox.)</small>${r.note ? `<div class="sub">${esc(r.note)}</div>` : ""}`
      : `<span style="color:var(--muted)">sem dados</span>`;
    const yts = ytList(a);
    const links = [
      a.bandcamp && ["Bandcamp", a.bandcamp],
      a.soundcloud && ["SoundCloud", a.soundcloud],
      yts.length && ["YouTube", `https://www.youtube.com/watch?v=${yts[0]}`],
      ...(a.links || [])
    ].filter(Boolean);
    const tracks = allTracks(a);
    const embed = a.bandcampId
      ? `<h3>&gt;&gt; TRACKLIST // BANDCAMP</h3>
         <iframe class="${a.bcType === "track" ? "is-track" : ""}" src="${bcEmbed(a)}" title="Bandcamp: ${esc(a.title)}" loading="lazy"></iframe>`
      : tracks.length
        ? `<h3>&gt;&gt; TRACKLIST</h3><ol class="m-tracks">${tracks.map(([name], ti) => `
            <li><button type="button" data-modal-track="${ti}" data-album="${i}"><span class="n">${String(ti + 1).padStart(2, "0")}</span>${esc(name)}${ti >= (a.tracks || []).length ? " <small>(single)</small>" : ""}</button></li>`).join("")}</ol>`
        : "";

    body.innerHTML = `
      <div class="m-left">
        <div class="frame">${frame(a, 16)}</div>
        <div class="m-links">
          <button class="primary" type="button" data-modal-play="${i}">▶ tocar no TR·AMP</button>
          ${links.map(([label, href]) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`).join("")}
        </div>
      </div>
      <div class="m-right">
        <h2 class="m-title" id="m-title">${esc(a.title)}</h2>
        <div class="m-code">[ ${esc(a.code)} :: ${esc(a.label.toUpperCase())} ]</div>
        <div class="m-rule"></div>
        <dl class="info">
          <dt>Artista</dt><dd class="artist">${esc(a.artist)}</dd>
          <dt>Lançamento</dt><dd>${esc(a.released)}</dd>
          <dt>Selo</dt><dd>${esc(a.label)}</dd>
          <dt>RYM Rating</dt><dd class="rating">${rating}</dd>
          <dt>Gêneros</dt><dd class="genres"><b>${esc(a.genres.join(", "))}</b>${a.subgenres?.length ? `<div class="sub">${esc(a.subgenres.join(", "))}</div>` : ""}</dd>
          <dt>Preço</dt><dd>${esc(a.price)}</dd>
        </dl>
        ${a.note ? `<div class="m-note">${esc(a.note)}</div>` : ""}
        <div class="m-embed">${embed}</div>
      </div>`;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".win-x").focus();
  }
  function closeModal() {
    modal.hidden = true;
    body.innerHTML = ""; // para o embed do Bandcamp junto
    document.body.style.overflow = "";
    lastFocus?.focus();
  }
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) return closeModal();
    const p = e.target.closest("[data-modal-play]");
    if (p) { closeModal(); return load(+p.dataset.modalPlay); }
    const t = e.target.closest("[data-modal-track]");
    if (t) { closeModal(); load(+t.dataset.album, { track: +t.dataset.modalTrack }); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // começa com o EP do Virtual Self carregado (sem tocar)
  load(vs.index, { autoplay: false });
})();
