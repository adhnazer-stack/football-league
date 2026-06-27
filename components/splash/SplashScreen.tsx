"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── WC26-inspired 48-cell grid (6 rows × 8 cols = 48 nations) ── */
const GRID_ROWS = 6;
const GRID_COLS = 8;
const cx = (GRID_COLS - 1) / 2;
const cy = (GRID_ROWS - 1) / 2;
const GRID = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => {
  const row = Math.floor(i / GRID_COLS);
  const col = i % GRID_COLS;
  const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
  return { row, col, delay: dist * 0.065 };
});

/* ── Spotlight beams ── */
const BEAMS = [
  { side: "left",  x: "5%",   skew: "-20deg", w: 160, h: "72vh", delay: 0 },
  { side: "left",  x: "20%",  skew: "-8deg",  w: 110, h: "58vh", delay: 0.22 },
  { side: "left",  x: "46%",  skew: "-2deg",  w: 90,  h: "62vh", delay: 0.14 },
  { side: "right", x: "5%",   skew: "20deg",  w: 160, h: "72vh", delay: 0.1 },
  { side: "right", x: "20%",  skew: "8deg",   w: 110, h: "58vh", delay: 0.32 },
  { side: "right", x: "46%",  skew: "2deg",   w: 90,  h: "62vh", delay: 0.18 },
];

/* ── SVG: realistic football ── */
function Football() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="fbg" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#d4d4d4"/>
        </radialGradient>
        <radialGradient id="fgl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <filter id="fsh"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.7)"/></filter>
      </defs>
      <circle cx="50" cy="50" r="54" fill="url(#fgl)"/>
      <circle cx="50" cy="50" r="46" fill="url(#fbg)" filter="url(#fsh)"/>
      <polygon points="50,8 63,18 59,34 41,34 37,18" fill="#12122a"/>
      <polygon points="85,33 91,48 81,59 67,54 65,38" fill="#12122a"/>
      <polygon points="77,74 66,84 51,80 50,64 63,57" fill="#12122a"/>
      <polygon points="23,74 34,84 49,80 50,64 37,57" fill="#12122a"/>
      <polygon points="15,33 9,48 19,59 33,54 35,38" fill="#12122a"/>
      <line x1="50" y1="8"  x2="50" y2="34" stroke="#bbb" strokeWidth="0.6"/>
      <line x1="50" y1="64" x2="50" y2="92" stroke="#bbb" strokeWidth="0.6"/>
      <line x1="63" y1="18" x2="85" y2="33" stroke="#bbb" strokeWidth="0.6"/>
      <line x1="15" y1="33" x2="37" y2="18" stroke="#bbb" strokeWidth="0.6"/>
      <line x1="67" y1="54" x2="77" y2="74" stroke="#bbb" strokeWidth="0.6"/>
      <line x1="23" y1="74" x2="33" y2="54" stroke="#bbb" strokeWidth="0.6"/>
      <ellipse cx="36" cy="32" rx="7" ry="5" fill="rgba(255,255,255,0.35)"/>
    </svg>
  );
}

/* ── SVG: trophy ── */
function Trophy() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C96A"/>
          <stop offset="45%" stopColor="#C9A84C"/>
          <stop offset="100%" stopColor="#E8C96A"/>
        </linearGradient>
        <filter id="tglow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M24 12 h32 v20 a16 16 0 0 1-32 0 Z" fill="url(#tg)" filter="url(#tglow)"/>
      <path d="M24 16 Q10 16 10 28 Q10 36 20 36" stroke="url(#tg)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M56 16 Q70 16 70 28 Q70 36 60 36" stroke="url(#tg)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <rect x="36" y="48" width="8" height="14" fill="url(#tg)" rx="1"/>
      <rect x="26" y="62" width="28" height="5" fill="url(#tg)" rx="2"/>
      <rect x="22" y="67" width="36" height="4" fill="url(#tg)" rx="2"/>
      <path d="M30 18 Q32 24 30 30" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M38 10 L42 14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

interface Props { onComplete: () => void }

export function SplashScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef   = useRef<number | null>(null);
  const [visible, setVisible] = useState(true);

  /* Timeline flags */
  const [gridOn,    setGridOn]    = useState(false);
  const [lightsOn,  setLightsOn]  = useState(false);
  const [pitchOn,   setPitchOn]   = useState(false);
  const [ballOn,    setBallOn]    = useState(false);
  const [trophyOn,  setTrophyOn]  = useState(false);
  const [flashOn,   setFlashOn]   = useState(false);
  const [titleOn,   setTitleOn]   = useState(false);
  const [subOn,     setSubOn]     = useState(false);
  const [lineOn,    setLineOn]    = useState(false);
  const [loadOn,    setLoadOn]    = useState(false);
  const [progOn,    setProgOn]    = useState(false);

  /* ── Gold particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type Pt = {
      x: number; y: number; vx: number; vy: number;
      r: number; op: number; maxOp: number; age: number; maxAge: number;
      col: string;
    };
    const GOLDS = [
      "rgba(201,168,76,1)", "rgba(232,201,106,1)", "rgba(201,168,76,0.7)",
      "rgba(255,230,130,0.9)", "rgba(180,140,50,0.8)", "rgba(255,255,220,0.6)",
    ];
    const make = (): Pt => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.2 + Math.random() * canvas.height * 0.8,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.3 + Math.random() * 1.1),
      r: 0.4 + Math.random() * 2.2,
      maxOp: 0.25 + Math.random() * 0.6,
      op: 0, age: 0, maxAge: 80 + Math.random() * 150,
      col: GOLDS[Math.floor(Math.random() * GOLDS.length)],
    });
    const pool: Pt[] = Array.from({ length: 260 }, () => {
      const p = make(); p.age = Math.random() * p.maxAge; return p;
    });
    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        p.age++; p.x += p.vx; p.y += p.vy;
        const r = p.age / p.maxAge;
        p.op = r < 0.18 ? (r / 0.18) * p.maxOp : r > 0.72 ? ((1 - r) / 0.28) * p.maxOp : p.maxOp;
        if (p.age >= p.maxAge || p.y < -20) { pool[i] = make(); continue; }
        ctx.globalAlpha = Math.max(0, p.op);
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafId); };
  }, []);

  /* ── Cinematic timeline ── */
  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    const at = (fn: () => void, ms: number) => ts.push(setTimeout(fn, ms));

    at(() => setGridOn(true),           80);
    at(() => setLightsOn(true),         480);
    at(() => setPitchOn(true),          900);
    at(() => setBallOn(true),           1700);
    at(() => { setTrophyOn(true); setFlashOn(true); }, 2500);
    at(() => setTitleOn(true),          3100);
    at(() => setSubOn(true),            3450);
    at(() => setLineOn(true),           3600);
    at(() => setLoadOn(true),           3750);
    at(() => setProgOn(true),           3850);
    at(() => { setVisible(false); setTimeout(onComplete, 700); }, 5000);

    return () => ts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden"
          style={{ background: "linear-gradient(180deg,#000408 0%,#030a18 40%,#040e20 65%,#040b08 100%)" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 1, 1] }}
        >
          {/* ── Gold particle canvas ── */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

          {/* ── WC26-inspired 48-cell modular grid ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, 18px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, 18px)`,
              }}
            >
              {GRID.map((cell, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 18, height: 18,
                    borderRadius: 4,
                    background: "rgba(201,168,76,0.18)",
                    border: "1px solid rgba(201,168,76,0.22)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={gridOn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{
                    delay: cell.delay,
                    type: "spring", stiffness: 500, damping: 28,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Floodlight dots ── */}
          <AnimatePresence>
            {lightsOn && (
              <motion.div
                className="absolute top-2 left-0 right-0 flex justify-around px-8 pointer-events-none"
                style={{ zIndex: 6 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{
                    width: 6, height: 14, borderRadius: 3,
                    background: "#fffdf0",
                    boxShadow: "0 0 16px 7px rgba(255,253,200,0.9), 0 0 48px 18px rgba(201,168,76,0.3)",
                    animation: `stadiumLight ${1.2 + i * 0.2}s ease-in-out ${i * 0.07}s infinite`,
                  }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Spotlight beams ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
            {BEAMS.map((b, i) => (
              <motion.div
                key={i}
                className="absolute top-0"
                style={{
                  [b.side]: b.x,
                  width: b.w, height: b.h,
                  background: i % 2 === 0
                    ? "linear-gradient(180deg,rgba(201,168,76,0.09) 0%,rgba(201,168,76,0.03) 45%,transparent 100%)"
                    : "linear-gradient(180deg,rgba(255,255,240,0.04) 0%,rgba(255,255,240,0.01) 45%,transparent 100%)",
                  transform: `skewX(${b.skew})`,
                  transformOrigin: "top center",
                  filter: "blur(4px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: lightsOn ? 1 : 0 }}
                transition={{ duration: 1.2, delay: b.delay }}
              />
            ))}
          </div>

          {/* ── Football pitch rising ── */}
          <AnimatePresence>
            {pitchOn && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 overflow-hidden"
                style={{ zIndex: 5 }}
                initial={{ height: 0 }}
                animate={{ height: "42vh" }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Pitch surface */}
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(to bottom,#0a5a0c 0%,#084808 40%,#052e05 100%)",
                }}>
                  {/* Grass stripes */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: "repeating-linear-gradient(90deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 48px,transparent 48px,transparent 96px)",
                  }}/>
                  {/* Pitch lines */}
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(255,255,255,0.45)" }} />
                  <div className="absolute top-0 bottom-0" style={{ left: "50%", width: 1, background: "rgba(255,255,255,0.22)" }} />
                  <div className="absolute" style={{
                    top: -65, left: "50%", width: 180, height: 180, marginLeft: -90,
                    border: "1px solid rgba(255,255,255,0.35)", borderRadius: "50%",
                  }} />
                  <div className="absolute" style={{
                    top: 34, left: "50%", width: 6, height: 6, marginLeft: -3, marginTop: -3,
                    background: "rgba(255,255,255,0.7)", borderRadius: "50%",
                  }} />
                  <div className="absolute bottom-0" style={{
                    left: "27%", right: "27%", height: "34%",
                    border: "1px solid rgba(255,255,255,0.28)", borderBottom: "none",
                  }} />
                </div>
                {/* Top edge fog */}
                <div className="absolute top-0 left-0 right-0" style={{
                  height: 60,
                  background: "linear-gradient(to bottom,rgba(4,11,24,0.95),transparent)",
                  zIndex: 1,
                }} />
                {/* Crowd silhouettes */}
                <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: 38, zIndex: 2 }}>
                  {Array.from({ length: 110 }, (_, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      left: `${(i / 110) * 100 + (i % 3) * 0.15}%`,
                      bottom: 0,
                      width: 8 + (i % 6),
                      height: 14 + Math.sin(i * 0.8) * 6,
                      borderRadius: "50% 50% 0 0",
                      background: `rgba(${80 + (i % 60)},${65 + (i % 40)},${55 + (i % 30)},0.5)`,
                    }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Football rolling in ── */}
          <AnimatePresence>
            {ballOn && (
              <motion.div
                className="absolute"
                style={{
                  bottom: "calc(42vh - 36px)",
                  left: "50%", marginLeft: -40,
                  zIndex: 20,
                }}
                initial={{ x: "-85vw", rotate: -520 }}
                animate={{ x: 0, rotate: 0 }}
                transition={{
                  x: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
                  rotate: { duration: 0.85, ease: "linear" },
                }}
              >
                <motion.div
                  className="w-[80px] h-[80px]"
                  animate={{ y: [0, -10, 0, -5, 0] }}
                  transition={{ delay: 0.9, duration: 0.55, ease: "easeOut" }}
                >
                  <Football />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Trophy ── */}
          <AnimatePresence>
            {trophyOn && (
              <motion.div
                className="absolute"
                style={{
                  bottom: "calc(42vh + 48px)",
                  left: "50%", marginLeft: -56,
                  zIndex: 21,
                }}
                initial={{ y: 120, opacity: 0, scale: 0.3 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.06 }}
              >
                <div style={{ animation: "trophyPulse 2.2s ease-in-out infinite", position: "relative" }}>
                  {/* Trophy glow halo */}
                  <div className="absolute pointer-events-none" style={{
                    inset: -28, borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(201,168,76,0.3) 0%,transparent 70%)",
                  }} />
                  <div className="w-[112px] h-[112px]"><Trophy /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Gold flash ── */}
          <AnimatePresence>
            {flashOn && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 40, background: "rgba(201,168,76,0.16)" }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.85 }}
              />
            )}
          </AnimatePresence>

          {/* ── Championship text (clip-path reveal) ── */}
          <div className="absolute pointer-events-none"
            style={{ top: "9%", left: 0, right: 0, zIndex: 35 }}>

            {/* Kicker eyebrow */}
            <div style={{ overflow: "hidden", textAlign: "center", marginBottom: 12 }}>
              <motion.p
                className="text-[10px] font-black tracking-[0.55em] uppercase"
                style={{ color: "rgba(201,168,76,0.55)" }}
                initial={{ y: "100%", opacity: 0 }}
                animate={titleOn ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
              >
                ⚽&nbsp; Official League &nbsp;⚽
              </motion.p>
            </div>

            {/* LEAGUE — main word */}
            <div style={{ overflow: "hidden", textAlign: "center", marginBottom: 4 }}>
              <motion.h1
                className="font-black uppercase leading-none"
                style={{
                  fontSize: "clamp(36px, 9vw, 88px)",
                  letterSpacing: "-0.01em",
                  color: "#C9A84C",
                  textShadow: "0 0 80px rgba(201,168,76,0.5), 0 0 160px rgba(201,168,76,0.2)",
                }}
                initial={{ y: "110%" }}
                animate={titleOn ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 0.75, ease: [0.2, 0, 0, 1], delay: 0.05 }}
              >
                LEAGUE
              </motion.h1>
            </div>

            {/* CHAMPIONSHIP — second word */}
            <div style={{ overflow: "hidden", textAlign: "center", marginBottom: 16 }}>
              <motion.h2
                className="font-black uppercase leading-none"
                style={{
                  fontSize: "clamp(18px, 4.5vw, 44px)",
                  letterSpacing: "0.28em",
                  color: "rgba(232,201,106,0.75)",
                }}
                initial={{ y: "110%" }}
                animate={subOn ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
              >
                CHAMPIONSHIP
              </motion.h2>
            </div>

            {/* Gold horizontal rule */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.div
                style={{ height: 1, background: "rgba(201,168,76,0.55)" }}
                initial={{ width: 0 }}
                animate={lineOn ? { width: "min(300px, 65vw)" } : { width: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            </div>

            {/* Season label */}
            <div style={{ overflow: "hidden", textAlign: "center", marginTop: 14 }}>
              <motion.p
                className="text-[11px] tracking-[0.5em] uppercase"
                style={{ color: "rgba(200,210,240,0.5)" }}
                initial={{ y: "100%", opacity: 0 }}
                animate={lineOn ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
              >
                Season 2025 / 26
              </motion.p>
            </div>

            {/* Loading indicator */}
            <AnimatePresence>
              {loadOn && (
                <motion.div
                  className="flex flex-col items-center gap-3 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[9px] tracking-[0.45em] uppercase" style={{ color: "rgba(201,168,76,0.4)" }}>
                    Loading Season
                  </p>
                  <div className="rounded-full overflow-hidden" style={{
                    width: "min(260px, 65vw)", height: 2,
                    background: "rgba(201,168,76,0.1)",
                  }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#C9A84C" }}
                      initial={{ width: "0%" }}
                      animate={progOn ? { width: "100%" } : { width: "0%" }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Bottom vignette ── */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
            height: "10%",
            background: "linear-gradient(180deg,transparent,rgba(2,6,12,0.6) 100%)",
            zIndex: 4,
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
