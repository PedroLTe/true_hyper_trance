/* TR-01 :: visualizer espelhado em cima do player
   O áudio do YouTube/Bandcamp roda num iframe de outro domínio, e o navegador não deixa o site lê-lo.
   Então o visualizer "ouve" a saída de som do sistema:
     - Linux (PipeWire/PulseAudio): o "Monitor of …" da saída aparece como um microfone no pedido de
       permissão do Firefox/Chrome. Escolhendo ele, a análise é do som real que está tocando.
     - Chrome: dá para capturar o áudio da própria aba (getDisplayMedia).
   Sem conexão, as barras são simuladas (marcado como SIM no HUD).
   Desenho: linhas finas espelhadas em cima e embaixo da linha central, frequência da esquerda (graves)
   para a direita (agudos), em escala logarítmica. */
(() => {
  const canvas = document.getElementById("viz");
  if (!canvas) return;
  const g = canvas.getContext("2d");
  const player = document.querySelector(".player");
  const ui = {
    mode: document.getElementById("viz-mode"),
    connect: document.getElementById("viz-connect"),
    tab: document.getElementById("viz-tab"),
    device: document.getElementById("viz-device")
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const isFirefox = /firefox/i.test(navigator.userAgent);
  const BPM = 140;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* sem storage */ } }
  };

  let W = 0, H = 0, bars = [], raf = 0, visible = true, energy = 0.3, last = performance.now(), t = 0;
  let audio = null, analyser = null, freq = null, stream = null, source = null;

  /* ---------- áudio ---------- */
  function setMode(text, live) {
    ui.mode.textContent = text;
    ui.mode.classList.toggle("is-live", !!live);
    ui.connect.textContent = live ? "desconectar" : "🎧 ouvir o som do sistema";
  }

  function stop() {
    stream?.getTracks().forEach((tr) => tr.stop());
    source?.disconnect();
    stream = source = analyser = null;
    setMode("SIM // sinal simulado", false);
  }

  async function attach(s) {
    stream = s;
    audio = audio || new AudioContext();
    await audio.resume();
    source = audio.createMediaStreamSource(stream);
    analyser = audio.createAnalyser();
    analyser.fftSize = 1024;              // janela de ~21 ms @ 48 kHz (graves com ~47 Hz por faixa)
    analyser.smoothingTimeConstant = 0.25; // quase sem média entre quadros: a descida das barras é feita no draw()
    analyser.minDecibels = -88;
    analyser.maxDecibels = -18;
    freq = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser); // não liga no destino: só analisa, sem eco
    stream.getAudioTracks()[0].addEventListener("ended", stop);
    start();
  }

  async function listDevices(currentLabel) {
    const inputs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput");
    ui.device.innerHTML = inputs.map((d, i) =>
      `<option value="${d.deviceId}" ${d.label === currentLabel ? "selected" : ""}>${(d.label || "entrada " + (i + 1)).replace(/</g, "&lt;")}</option>`).join("");
    ui.device.hidden = inputs.length < 2;
    return inputs;
  }

  async function connectInput(deviceId, autoMonitor = true) {
    stop();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, noiseSuppression: false, autoGainControl: false, latency: 0,
          ...(deviceId ? { deviceId: { exact: deviceId } } : {})
        }
      });
      const label = s.getAudioTracks()[0]?.label || "";
      const inputs = await listDevices(label);
      // escolheu o microfone? troca sozinho para o monitor da saída, se existir
      if (autoMonitor && !/monitor/i.test(label)) {
        const mon = inputs.find((d) => /monitor/i.test(d.label));
        if (mon) { s.getTracks().forEach((tr) => tr.stop()); return connectInput(mon.deviceId, false); }
      }
      await attach(s);
      store.set("tr01-viz-device", s.getAudioTracks()[0]?.getSettings().deviceId || deviceId || "");
      const lat = s.getAudioTracks()[0]?.getSettings().latency;
      const latTxt = typeof lat === "number" && lat > 0 ? ` // captura ${Math.round(lat * 1000)} ms` : "";
      setMode(/monitor/i.test(label) ? `LIVE // ${label}${latTxt}` : `MIC // ${label} (escolha um "Monitor of…" para ouvir o PC)`, true);
    } catch (err) {
      store.set("tr01-viz-device", null);
      setMode(err.name === "NotAllowedError" ? "SIM // permissão negada" : `SIM // ${err.name || "erro"}`, false);
    }
  }

  async function connectTab() {
    stop();
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      s.getVideoTracks().forEach((tr) => tr.stop());
      if (!s.getAudioTracks().length) { setMode("SIM // marque “compartilhar áudio da aba”", false); return; }
      await attach(s);
      setMode("LIVE // áudio da aba", true);
    } catch (err) {
      setMode("SIM // captura cancelada", false);
    }
  }

  ui.connect.addEventListener("click", () => (analyser ? (stop(), store.set("tr01-viz-device", null)) : connectInput(store.get("tr01-viz-device") || undefined)));
  ui.device.addEventListener("change", () => connectInput(ui.device.value, false));
  if (isFirefox || !navigator.mediaDevices?.getDisplayMedia) ui.tab.hidden = true;
  else ui.tab.addEventListener("click", connectTab);
  if (!navigator.mediaDevices?.getUserMedia) { ui.connect.disabled = true; setMode("SIM // navegador sem captura de áudio", false); }

  // já conectou antes? reconecta no próximo clique de play (o navegador exige um gesto)
  document.addEventListener("click", (e) => {
    if (analyser || !store.get("tr01-viz-device")) return;
    if (e.target.closest("#btn-play, #playlist, .frame, #vs-play, #vs-tracks, #np-play")) connectInput(store.get("tr01-viz-device"), false);
  }, true);

  /* ---------- desenho ---------- */
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(32, Math.floor(W / 4));
    while (bars.length < n) bars.push({ v: 0, seed: Math.random() * 100 });
    bars.length = n;
  }

  const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22C8FF";

  // amplitude de cada barra a partir do espectro real (faixas logarítmicas de 35 Hz a 15 kHz)
  function liveLevels(n) {
    analyser.getByteFrequencyData(freq);
    const binHz = audio.sampleRate / analyser.fftSize;
    const lo = 35, hi = 15000, out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const f0 = lo * Math.pow(hi / lo, i / n), f1 = lo * Math.pow(hi / lo, (i + 1) / n);
      const b0 = Math.max(1, Math.floor(f0 / binHz)), b1 = Math.max(b0 + 1, Math.ceil(f1 / binHz));
      let sum = 0, peak = 0, cnt = 0;
      for (let b = b0; b < b1 && b < freq.length; b++) { sum += freq[b]; peak = Math.max(peak, freq[b]); cnt++; }
      // mistura pico e média: tons estreitos não somem nas faixas largas dos agudos
      const v = (peak * 0.65 + (sum / Math.max(1, cnt)) * 0.35) / 255;
      out[i] = Math.pow(v, 1.5) * (0.85 + 0.45 * (i / n)); // agudos têm menos energia: compensa um pouco
    }
    return out;
  }

  function simLevels(n, dt) {
    const playing = player?.classList.contains("is-playing");
    energy += ((playing ? 1 : 0.35) - energy) * Math.min(1, dt * 3);
    const beat = (t * BPM / 60) % 1;
    const kick = playing ? Math.exp(-beat * 6) : 0;
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = i / n, b = bars[i];
      const shape = 0.55 + 0.45 * Math.sin(x * Math.PI * 0.9 + 0.3);
      const noise = 0.5 + 0.5 * Math.sin(t * (2.1 + (b.seed % 3)) + b.seed) * Math.sin(t * 1.3 + i * 0.37);
      out[i] = Math.min(1, shape * (0.35 + noise * 0.65) * energy * 0.9 + kick * (1 - x * 0.7) * 0.35 + 0.03);
    }
    return out;
  }

  function draw(dt) {
    t += dt;
    const n = bars.length;
    const raw = analyser ? liveLevels(n) : simLevels(n, dt);

    g.clearRect(0, 0, W, H);
    const mid = H / 2, max = mid - 3;
    const step = W / n, lw = Math.max(1.2, step * 0.5);
    const acc = accent();

    // degradê vertical igual nas duas metades: pontas lilás, perto da linha branco
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(124, 134, 240, .35)");
    grad.addColorStop(0.22, "#C9D2FF");
    grad.addColorStop(0.42, acc);
    grad.addColorStop(0.5, "#ffffff");
    grad.addColorStop(0.58, acc);
    grad.addColorStop(0.78, "#C9D2FF");
    grad.addColorStop(1, "rgba(124, 134, 240, .35)");
    g.strokeStyle = grad;
    g.lineWidth = lw;
    g.lineCap = "round";
    g.globalCompositeOperation = "lighter";
    g.beginPath();
    for (let i = 0; i < n; i++) {
      // suaviza com os vizinhos: a silhueta vira uma onda contínua, como na referência
      const v = (raw[Math.max(0, i - 1)] + raw[i] * 2 + raw[Math.min(n - 1, i + 1)]) / 4;
      const b = bars[i];
      const rise = analyser ? 1 : Math.min(1, dt * 22), fall = Math.min(1, dt * (analyser ? 14 : 7));
      b.v += (v - b.v) * (v > b.v ? rise : fall); // ao vivo: sobe na hora, desce rápido
      const h = Math.max(0.5, b.v * max);
      const x = i * step + step / 2;
      g.moveTo(x, mid - h);
      g.lineTo(x, mid + h);
    }
    g.stroke();
    g.globalCompositeOperation = "source-over";

    // linha central
    g.fillStyle = "rgba(255, 255, 255, .55)";
    g.fillRect(0, mid - 0.5, W, 1);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    draw(dt);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    cancelAnimationFrame(raf);
    if (reduce.matches && !analyser) { draw(0.016); return; }
    if (!visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : cancelAnimationFrame(raf); }).observe(canvas);
  document.addEventListener("visibilitychange", start);
  reduce.addEventListener("change", start);
  addEventListener("resize", () => { resize(); if (reduce.matches) draw(0.016); });
  resize();
  setMode("SIM // sinal simulado", false);
  start();
})();
