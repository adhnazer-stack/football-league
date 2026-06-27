/* Stadium neon particles — OffscreenCanvas, dedicated Web Worker */
let ctx = null, pool = [], rafId = null, dim = 1;

const COLS = [
  "#00FF87","rgba(0,255,135,0.7)","rgba(0,255,135,0.4)",
  "#FFD700","rgba(255,215,0,0.8)","rgba(255,215,0,0.4)",
  "#00D4FF","rgba(0,212,255,0.5)",
  "rgba(255,255,255,0.6)","rgba(255,255,255,0.3)",
];

function make() {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  return {
    x: Math.random() * w,
    y: h * 0.15 + Math.random() * h * 0.85,
    vx: (Math.random() - 0.5) * 0.38,
    vy: -(0.12 + Math.random() * 0.58),
    r: 0.25 + Math.random() * 2.5,
    mo: 0.15 + Math.random() * 0.55,
    o: 0, age: 0,
    max: 70 + Math.random() * 180,
    c: COLS[Math.floor(Math.random() * COLS.length)],
  };
}

function draw() {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i];
    p.age++; p.x += p.vx; p.y += p.vy;
    const r = p.age / p.max;
    p.o = r < 0.15 ? (r / 0.15) * p.mo : r > 0.78 ? ((1 - r) / 0.22) * p.mo : p.mo;
    if (p.age >= p.max || p.y < -10) { pool[i] = make(); continue; }
    ctx.globalAlpha = Math.max(0, p.o * dim);
    ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  rafId = requestAnimationFrame(draw);
}

self.onmessage = ({ data }) => {
  switch (data.type) {
    case 'init': {
      const { canvas, width, height } = data;
      canvas.width = width; canvas.height = height;
      ctx = canvas.getContext('2d');
      dim = data.dim ?? 1;
      pool = Array.from({ length: 200 }, () => {
        const p = make(); p.age = Math.random() * p.max; return p;
      });
      draw();
      break;
    }
    case 'resize':
      if (ctx) { ctx.canvas.width = data.width; ctx.canvas.height = data.height; }
      break;
    case 'theme':
      dim = data.dim;
      break;
    case 'stop':
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      break;
  }
};
