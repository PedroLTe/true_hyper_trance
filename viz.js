/* TR-01 :: visualizer espelhado em cima do player
   O áudio do YouTube/Bandcamp roda num iframe de outro domínio e o site não consegue lê-lo,
   então o espectro é simulado: ruído suave por barra + "kick" a 140 BPM quando o player está tocando,
   e uma respiração lenta quando está parado.
   Desenho: linhas finas espelhadas em cima e embaixo da linha central. */
(() => {
  const canvas = document.getElementById("viz");
  if (!canvas) return;
  const g = canvas.getContext("2d");
  const player = document.querySelector(".player");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const BPM = 140;

  let W = 0, H = 0, bars = [], raf = 0, visible = true, energy = 0.3, last = performance.now(), t = 0;

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

  function levels(n, dt) {
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
    const raw = levels(n, dt);

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
      // suaviza com os vizinhos: a silhueta vira uma onda contínua
      const v = (raw[Math.max(0, i - 1)] + raw[i] * 2 + raw[Math.min(n - 1, i + 1)]) / 4;
      const b = bars[i];
      b.v += (v - b.v) * Math.min(1, dt * (v > b.v ? 22 : 7)); // sobe rápido, desce devagar
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
    if (reduce.matches) { draw(0.016); return; }
    if (!visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : cancelAnimationFrame(raf); }).observe(canvas);
  document.addEventListener("visibilitychange", start);
  reduce.addEventListener("change", start);
  addEventListener("resize", () => { resize(); if (reduce.matches) draw(0.016); });
  resize();
  start();
})();
