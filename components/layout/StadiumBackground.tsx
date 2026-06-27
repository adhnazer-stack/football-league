"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";

/* ── Worker path ── */
const WORKER_PATH = "/workers/particles.worker.js";

export function StadiumBackground() {
  const { theme } = useApp();
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const cleanupRef  = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }

    const dim = theme === "light" ? 0.12 : 1;

    /* try OffscreenCanvas worker */
    if (
      typeof OffscreenCanvas !== "undefined" &&
      typeof Worker !== "undefined" &&
      (canvas as HTMLCanvasElement & { transferControlToOffscreen?: () => OffscreenCanvas }).transferControlToOffscreen
    ) {
      try {
        const offscreen = (canvas as HTMLCanvasElement & { transferControlToOffscreen: () => OffscreenCanvas }).transferControlToOffscreen();
        const worker = new Worker(WORKER_PATH);
        worker.postMessage({ type: "init", canvas: offscreen, width: window.innerWidth, height: window.innerHeight, dim }, [offscreen]);
        const onResize = () => worker.postMessage({ type: "resize", width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", onResize);
        cleanupRef.current = () => {
          window.removeEventListener("resize", onResize);
          worker.postMessage({ type: "stop" });
          worker.terminate();
        };
        return;
      } catch { /* fallthrough */ }
    }

    /* main-thread fallback — gold / warm palette */
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x:number; y:number; vx:number; vy:number; r:number; op:number; mop:number; age:number; max:number; col:string };
    const COLS = [
      "rgba(201,168,76,1)", "rgba(232,201,106,0.8)", "rgba(201,168,76,0.5)",
      "rgba(255,230,130,0.7)", "rgba(160,120,40,0.6)",
      "rgba(255,255,255,0.5)", "rgba(255,255,255,0.25)",
    ];
    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.15 + Math.random() * canvas.height * 0.85,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.1 + Math.random() * 0.55),
      r: 0.25 + Math.random() * 2.2,
      mop: 0.1 + Math.random() * 0.45,
      op: 0, age: 0, max: 80 + Math.random() * 180,
      col: COLS[Math.floor(Math.random() * COLS.length)],
    });
    const pool: P[] = Array.from({ length: 180 }, () => {
      const p = make(); p.age = Math.random() * p.max; return p;
    });
    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        p.age++; p.x += p.vx; p.y += p.vy;
        const r = p.age / p.max;
        p.op = r < 0.15 ? (r / 0.15) * p.mop : r > 0.78 ? ((1 - r) / 0.22) * p.mop : p.mop;
        if (p.age >= p.max || p.y < -10) { pool[i] = make(); continue; }
        ctx.globalAlpha = Math.max(0, p.op * dim);
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };
    draw();
    cleanupRef.current = () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [theme]);

  useEffect(() => { return () => { if (cleanupRef.current) cleanupRef.current(); }; }, []);

  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Base gradient — deep navy */}
      <div className="absolute inset-0" style={{ background: "var(--bg-gradient)" }} />

      {/* ── Football pitch grid lines (barely visible) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        style={{ opacity: isLight ? 0.04 : 0.035 }}
      >
        {/* Outer boundary */}
        <rect x="3%" y="8%" width="94%" height="84%" stroke="rgba(201,168,76,0.6)" strokeWidth="0.8" fill="none" />
        {/* Center line */}
        <line x1="50%" y1="8%" x2="50%" y2="92%" stroke="rgba(201,168,76,0.5)" strokeWidth="0.7" />
        {/* Center circle */}
        <ellipse cx="50%" cy="50%" rx="9%" ry="13%" stroke="rgba(201,168,76,0.55)" strokeWidth="0.7" fill="none" />
        <circle cx="50%" cy="50%" r="3" fill="rgba(201,168,76,0.4)" />
        {/* Left penalty box */}
        <rect x="3%" y="30%" width="13%" height="40%" stroke="rgba(201,168,76,0.4)" strokeWidth="0.6" fill="none" />
        <rect x="3%" y="39%" width="5%" height="22%" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" fill="none" />
        {/* Right penalty box */}
        <rect x="84%" y="30%" width="13%" height="40%" stroke="rgba(201,168,76,0.4)" strokeWidth="0.6" fill="none" />
        <rect x="92%" y="39%" width="5%" height="22%" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" fill="none" />
        {/* Corner arcs */}
        <path d="M3%,8% Q3%,10% 5%,10%" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" fill="none" />
        <path d="M97%,8% Q97%,10% 95%,10%" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" fill="none" />
        <path d="M3%,92% Q3%,90% 5%,90%" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" fill="none" />
        <path d="M97%,92% Q97%,90% 95%,90%" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" fill="none" />
      </svg>

      {/* ── Spotlight beams from top (gold) ── */}
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          left: "4%", width: 150, height: "65vh",
          background: "linear-gradient(175deg,rgba(201,168,76,0.07) 0%,rgba(201,168,76,0.02) 44%,transparent 100%)",
          transformOrigin: "top center", filter: "blur(10px)", transform: "skewX(-20deg)",
        }}
        animate={{ opacity: [0.4, 1, 0.5, 0.9, 0.4], skewX: ["-20deg", "-16deg", "-23deg", "-18deg", "-20deg"] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          right: "4%", width: 150, height: "65vh",
          background: "linear-gradient(175deg,rgba(201,168,76,0.06) 0%,rgba(201,168,76,0.018) 44%,transparent 100%)",
          transformOrigin: "top center", filter: "blur(10px)", transform: "skewX(20deg)",
        }}
        animate={{ opacity: [0.3, 0.9, 0.45, 1, 0.3], skewX: ["20deg", "16deg", "24deg", "19deg", "20deg"] }}
        transition={{ duration: 9, repeat: Infinity, delay: 1.5 }}
      />
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          left: "30%", width: 100, height: "55vh",
          background: "linear-gradient(178deg,rgba(255,240,180,0.025) 0%,transparent 60%)",
          transformOrigin: "top center", filter: "blur(14px)", transform: "skewX(-4deg)",
        }}
        animate={{ opacity: [0.2, 0.7, 0.3, 0.8, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, delay: 3 }}
      />
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          right: "30%", width: 100, height: "55vh",
          background: "linear-gradient(178deg,rgba(255,240,180,0.025) 0%,transparent 60%)",
          transformOrigin: "top center", filter: "blur(14px)", transform: "skewX(4deg)",
        }}
        animate={{ opacity: [0.5, 0.2, 0.8, 0.3, 0.5] }}
        transition={{ duration: 13, repeat: Infinity, delay: 5.5 }}
      />

      {/* ── Ambient top glow (championship gold) ── */}
      <div className="absolute pointer-events-none" style={{
        top: "-5%", left: "15%", width: "70%", height: 300,
        background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(201,168,76,0.055) 0%,transparent 70%)",
      }} />

      {/* ── Subtle green pitch atmosphere (bottom) ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to top,rgba(10,70,15,0.022) 0%,transparent 100%)",
        }}
        animate={{ opacity: [0.3, 0.9, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* ── Stadium silhouette (architectural) ── */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ height: 160, opacity: isLight ? 0.05 : 0.05 }}
      >
        {/* Left stand */}
        <path d="M0,160 L0,80 Q50,55 110,62 Q180,70 250,45 Q320,22 390,38 L390,160 Z" fill="rgba(201,168,76,0.25)" />
        {/* Right stand */}
        <path d="M1440,160 L1440,80 Q1390,55 1330,62 Q1260,70 1190,45 Q1120,22 1050,38 L1050,160 Z" fill="rgba(201,168,76,0.25)" />
        {/* Arch above center */}
        <ellipse cx="720" cy="22" rx="220" ry="22" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1" />
        {/* Vertical supports */}
        <line x1="500" y1="55" x2="500" y2="160" stroke="rgba(201,168,76,0.15)" strokeWidth="0.7" />
        <line x1="940" y1="55" x2="940" y2="160" stroke="rgba(201,168,76,0.15)" strokeWidth="0.7" />
      </svg>

      {/* ── Bottom pitch accent line ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: 2,
        background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.4),rgba(201,168,76,0.6),rgba(201,168,76,0.4),transparent)",
      }} />

      {/* ── Edge vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow: "inset 0 0 220px rgba(0,0,0,0.7)",
      }} />

      {/* ── Gold particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
