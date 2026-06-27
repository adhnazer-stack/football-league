"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";

export function StadiumBackground() {
  const { theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Clean up any previous animation first
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }

    const dim = theme === "light" ? 0.18 : 1;

    /* ── Direction B: OffscreenCanvas → Web Worker ── */
    if (
      typeof OffscreenCanvas !== "undefined" &&
      typeof Worker !== "undefined" &&
      (canvas as HTMLCanvasElement & { transferControlToOffscreen?: () => OffscreenCanvas }).transferControlToOffscreen
    ) {
      try {
        const offscreen = (canvas as HTMLCanvasElement & { transferControlToOffscreen: () => OffscreenCanvas }).transferControlToOffscreen();
        const worker = new Worker("/workers/particles.worker.js");
        worker.postMessage(
          { type: "init", canvas: offscreen, width: window.innerWidth, height: window.innerHeight, dim },
          [offscreen],
        );
        const onResize = () =>
          worker.postMessage({ type: "resize", width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", onResize);
        cleanupRef.current = () => {
          window.removeEventListener("resize", onResize);
          worker.postMessage({ type: "stop" });
          worker.terminate();
        };
        return;
      } catch {
        /* fallthrough to main-thread canvas */
      }
    }

    /* ── Fallback: main-thread canvas ── */
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x:number; y:number; vx:number; vy:number; r:number; o:number; mo:number; age:number; max:number; c:string };
    const COLS = [
      "#00FF87","rgba(0,255,135,0.7)","rgba(0,255,135,0.4)",
      "#FFD700","rgba(255,215,0,0.8)","rgba(255,215,0,0.4)",
      "#00D4FF","rgba(0,212,255,0.5)",
      "rgba(255,255,255,0.6)","rgba(255,255,255,0.3)",
    ];
    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.15 + Math.random() * canvas.height * 0.85,
      vx: (Math.random()-0.5)*0.38, vy: -(0.12+Math.random()*0.58),
      r: 0.25+Math.random()*2.5, mo: 0.15+Math.random()*0.55,
      o: 0, age: 0, max: 70+Math.random()*180,
      c: COLS[Math.floor(Math.random()*COLS.length)],
    });
    const pool: P[] = Array.from({length:200}, ()=>{ const p=make(); p.age=Math.random()*p.max; return p; });
    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=0;i<pool.length;i++) {
        const p=pool[i];
        p.age++; p.x+=p.vx; p.y+=p.vy;
        const r=p.age/p.max;
        p.o = r<0.15?(r/0.15)*p.mo:r>0.78?((1-r)/0.22)*p.mo:p.mo;
        if(p.age>=p.max||p.y<-10){pool[i]=make();continue;}
        ctx.globalAlpha=Math.max(0,p.o*dim);
        ctx.fillStyle=p.c;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;
      rafId=requestAnimationFrame(draw);
    };
    draw();
    cleanupRef.current = () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [theme]);

  useEffect(() => {
    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Deep black base */}
      <div className="absolute inset-0" style={{background:"var(--stadium-gradient)"}}/>

      {/* Horizontal pitch stripes */}
      <div className="absolute inset-0" style={{
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 64px,rgba(0,255,135,0.012) 64px,rgba(0,255,135,0.012) 65px)",
        opacity: theme === "light" ? 0.3 : 1,
      }}/>

      {/* Football pitch lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        style={{ opacity: theme === "light" ? 0.04 : 0.028 }}>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00FF87" strokeWidth="1"/>
        <ellipse cx="50%" cy="50%" rx="9%" ry="13%" stroke="#00FF87" strokeWidth="0.8" fill="none"/>
        <circle cx="50%" cy="50%" r="3" fill="#00FF87" opacity="0.5"/>
        <rect x="0" y="30%" width="12%" height="40%" stroke="#00FF87" strokeWidth="0.7" fill="none"/>
        <rect x="88%" y="30%" width="12%" height="40%" stroke="#00FF87" strokeWidth="0.7" fill="none"/>
        <rect x="0" y="39%" width="4.5%" height="22%" stroke="#00FF87" strokeWidth="0.5" fill="none"/>
        <rect x="95.5%" y="39%" width="4.5%" height="22%" stroke="#00FF87" strokeWidth="0.5" fill="none"/>
        <rect x="2%" y="7%" width="96%" height="86%" stroke="#00FF87" strokeWidth="0.5" fill="none"/>
      </svg>

      {/* Stadium spotlights */}
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left:"3%",width:160,height:"68vh",
          background:"linear-gradient(176deg,rgba(255,215,0,0.065) 0%,rgba(255,215,0,0.02) 42%,transparent 100%)",
          transformOrigin:"top center",filter:"blur(8px)",transform:"skewX(-22deg)" }}
        animate={{opacity:[0.35,1,0.5,0.85,0.35],skewX:["-22deg","-18deg","-25deg","-19deg","-22deg"]}}
        transition={{duration:6.5,repeat:Infinity}}/>
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left:"26%",width:110,height:"52vh",
          background:"linear-gradient(176deg,rgba(255,255,255,0.02) 0%,rgba(255,255,255,0.006) 42%,transparent 100%)",
          transformOrigin:"top center",filter:"blur(12px)",transform:"skewX(-6deg)" }}
        animate={{opacity:[0.2,0.65,0.3,0.75,0.2]}}
        transition={{duration:10,repeat:Infinity,delay:2.8}}/>
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ right:"26%",width:110,height:"52vh",
          background:"linear-gradient(176deg,rgba(255,255,255,0.02) 0%,rgba(255,255,255,0.006) 42%,transparent 100%)",
          transformOrigin:"top center",filter:"blur(12px)",transform:"skewX(6deg)" }}
        animate={{opacity:[0.5,0.2,0.75,0.3,0.5]}}
        transition={{duration:12,repeat:Infinity,delay:5}}/>
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ right:"3%",width:160,height:"68vh",
          background:"linear-gradient(176deg,rgba(0,212,255,0.05) 0%,rgba(0,212,255,0.015) 42%,transparent 100%)",
          transformOrigin:"top center",filter:"blur(8px)",transform:"skewX(22deg)" }}
        animate={{opacity:[0.25,0.8,0.4,1,0.25],skewX:["22deg","18deg","26deg","20deg","22deg"]}}
        transition={{duration:8.5,repeat:Infinity,delay:1.2}}/>

      {/* Ambient glows */}
      <div className="absolute pointer-events-none" style={{
        top:"2%",left:"10%",width:500,height:400,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(255,215,0,0.04) 0%,transparent 70%)"}}/>
      <div className="absolute pointer-events-none" style={{
        top:"5%",right:"8%",width:380,height:380,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,212,255,0.045) 0%,transparent 70%)"}}/>

      {/* Floating fog */}
      <motion.div className="absolute pointer-events-none"
        style={{ top:"20%",left:"25%",width:"50%",height:"48%",
          background:"radial-gradient(ellipse,rgba(0,60,200,0.025) 0%,transparent 70%)",filter:"blur(50px)" }}
        animate={{x:[0,40,-28,16,0],y:[0,-20,12,-8,0],opacity:[0.25,0.7,0.4,0.85,0.25]}}
        transition={{duration:20,repeat:Infinity}}/>

      {/* Green pitch atmosphere */}
      <motion.div className="absolute pointer-events-none"
        style={{ bottom:0,left:0,right:0,height:"45%",
          background:"linear-gradient(to top,rgba(0,255,135,0.018) 0%,transparent 100%)" }}
        animate={{opacity:[0.4,1,0.4]}}
        transition={{duration:6,repeat:Infinity}}/>

      {/* Stadium silhouette */}
      <svg className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
        viewBox="0 0 1440 180" preserveAspectRatio="none"
        style={{height:180,opacity:theme==="light"?0.06:0.055}}>
        <path d="M0,180 L0,90 Q60,60 120,70 Q200,80 280,50 Q360,25 440,40 L440,180 Z" fill="#00FF87" opacity="0.6"/>
        <path d="M1440,180 L1440,90 Q1380,60 1320,70 Q1240,80 1160,50 Q1080,25 1000,40 L1000,180 Z" fill="#00FF87" opacity="0.6"/>
        <ellipse cx="720" cy="30" rx="240" ry="28" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5"/>
        <line x1="480" y1="60" x2="480" y2="180" stroke="#00FF87" strokeWidth="0.5" opacity="0.3"/>
        <line x1="960" y1="60" x2="960" y2="180" stroke="#00FF87" strokeWidth="0.5" opacity="0.3"/>
      </svg>

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{boxShadow:"inset 0 0 200px rgba(0,0,0,0.75)"}}/>

      {/* Canvas — takes OffscreenCanvas worker OR fallback main-thread */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{width:"100%",height:"100%"}}/>

      {/* Bottom pitch strip */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height:"3px",
        background:"linear-gradient(90deg,transparent,rgba(0,255,135,0.5),rgba(0,255,135,0.8),rgba(0,255,135,0.5),transparent)"}}/>
    </div>
  );
}
