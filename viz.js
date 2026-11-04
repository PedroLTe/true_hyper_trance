/* TR-01 :: visualizer de ondas espelhado (substitui o "swoosh" do cabeçalho)
   O iframe do YouTube não deixa ler o áudio, então o espectro é simulado:
   ruído suave por barra + "kick" a 140 BPM quando o player está tocando, e uma respiração lenta parado.
   Barras de cima em gelo → lilás, reflexo de baixo em ciano → cobalto, linha central branca. */
(() => {
  const canvas = document.getElementById("viz");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const player = document.querySelector(".player");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const BPM = 140;

  let W = 0, H = 0, dpr = 1, bars = [], raf = 0, visible = true, energy = 0.15, last = performance.now(), t = 0;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(24, Math.floor(W / 7));
    while (bars.length < n) bars.push({ v: Math.random() * 0.3, target: 0, seed: Math.random() * 100 });
    bars.length = n;
  }

  const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22C8FF";

  function draw(dt) {
    t += dt;
    const playing = player?.classList.contains("is-playing");
    energy += ((playing ? 1 : 0.38) - energy) * Math.min(1, dt * 3);
    const beat = (t * BPM / 60) % 1;
    const kick = playing ? Math.exp(-beat * 6) : 0;

    ctx.clearRect(0, 0, W, H);
    const mid = H * 0.54;           // linha central um pouco abaixo do meio: reflexo um pouco menor
    const up = mid - 6, down = H - mid - 4;
    const n = bars.length, gap = 2, bw = Math.max(2, W / n - gap);
    const acc = accent();

    const gTop = ctx.createLinearGradient(0, mid - up, 0, mid);
    gTop.addColorStop(0, "#ffffff");
    gTop.addColorStop(0.35, "#C9D2FF");
    gTop.addColorStop(1, "#7C86F0");
    const gBot = ctx.createLinearGradient(0, mid, 0, mid + down);
    gBot.addColorStop(0, "#ffffff");
    gBot.addColorStop(0.1, acc);
    gBot.addColorStop(0.6, "rgba(124, 134, 240, .85)");
    gBot.addColorStop(1, "rgba(124, 134, 240, .2)");

    for (let i = 0; i < n; i++) {
      const b = bars[i];
      const x = i / n;
      // envelope de espectro: graves mais altos à esquerda, agudos picotados à direita
      const shape = 0.55 + 0.45 * Math.sin(x * Math.PI * 0.9 + 0.3);
      const noise = 0.5 + 0.5 * Math.sin(t * (2.1 + (b.seed % 3)) + b.seed) * Math.sin(t * 1.3 + i * 0.7);
      b.target = Math.min(1, shape * (0.4 + noise * 0.75) * energy * 1.25 + kick * (1 - x * 0.6) * 0.4 + 0.05);
      b.v += (b.target - b.v) * Math.min(1, dt * (b.target > b.v ? 18 : 6)); // sobe rápido, desce devagar
      const px = i * (bw + gap) + gap / 2;
      const hUp = b.v * up, hDn = Math.min(down, b.v * down * 1.05);
      ctx.fillStyle = gTop;
      ctx.fillRect(px, mid - hUp, bw, hUp);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = gBot;
      ctx.fillRect(px, mid + 2, bw, hDn);
      ctx.globalAlpha = 1;
    }

    // linha central com brilho
    ctx.save();
    ctx.shadowColor = acc;
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, mid - 1, W, 2);
    ctx.restore();
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
