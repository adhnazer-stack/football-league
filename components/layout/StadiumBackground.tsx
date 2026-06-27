"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";

export function StadiumBackground() {
  const { theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x:number; y:number; vx:number; vy:number; size:number; opacity:number; maxOpacity:number; age:number; maxAge:number; color:string };

    const sparkColors = [
      "#ffd700","#c9963c","#00b4ff","rgba(255,255,255,0.7)",
      "#00ff87","rgba(0,255,135,0.6)","rgba(255,200,80,0.8)",
      "rgba(0,180,255,0.5)","rgba(255,215,0,0.9)",
    ];

    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.18 + Math.random() * canvas.height * 0.82,
      vx: (Math.random()-0.5)*0.45,
      vy: -(0.14+Math.random()*0.62),
      size: 0.3+Math.random()*2.4,
      maxOpacity: 0.18+Math.random()*0.52,
      opacity: 0,
      age: 0,
      maxAge: 80+Math.random()*170,
      color: sparkColors[Math.floor(Math.random()*sparkColors.length)],
    });

    const pool: P[] = Array.from({length:170}, ()=>{ const p=make(); p.age=Math.random()*p.maxAge; return p; });

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const dimFactor = theme==="light" ? 0.2 : 1;
      for (let i=0;i<pool.length;i++) {
        const p=pool[i];
        p.age++; p.x+=p.vx; p.y+=p.vy;
        const r=p.age/p.maxAge;
        p.opacity = r<0.18?(r/0.18)*p.maxOpacity : r>0.72?((1-r)/0.28)*p.maxOpacity : p.maxOpacity;
        if (p.age>=p.maxAge||p.y<-20) { pool[i]=make(); continue; }
        ctx.globalAlpha=Math.max(0,p.opacity*dimFactor);
        ctx.fillStyle=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1;
      rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ window.removeEventListener("resize",resize); if(rafRef.current)cancelAnimationFrame(rafRef.current); };
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Base gradient */}
      <div className="absolute inset-0" style={{background:"var(--stadium-gradient)"}}/>

      {/* Football pitch field markings (very faint) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        style={{ opacity: theme === "light" ? 0.06 : 0.04 }}
      >
        {/* Horizontal center line */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1"/>
        {/* Center circle */}
        <ellipse cx="50%" cy="50%" rx="10%" ry="14%" stroke="white" strokeWidth="1" fill="none"/>
        {/* Center spot */}
        <circle cx="50%" cy="50%" r="4" fill="white" opacity="0.4"/>
        {/* Left penalty area */}
        <rect x="0" y="31%" width="13%" height="38%" stroke="white" strokeWidth="0.8" fill="none"/>
        {/* Right penalty area */}
        <rect x="87%" y="31%" width="13%" height="38%" stroke="white" strokeWidth="0.8" fill="none"/>
        {/* Left goal area */}
        <rect x="0" y="40%" width="5%" height="20%" stroke="white" strokeWidth="0.6" fill="none"/>
        {/* Right goal area */}
        <rect x="95%" y="40%" width="5%" height="20%" stroke="white" strokeWidth="0.6" fill="none"/>
        {/* Outer boundary */}
        <rect x="2%" y="8%" width="96%" height="84%" stroke="white" strokeWidth="0.6" fill="none"/>
      </svg>

      {/* Pitch grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,0.008) 80px,rgba(255,255,255,0.008) 81px),repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,0.008) 80px,rgba(255,255,255,0.008) 81px)",
      }}/>

      {/* Stadium floodlight beam — far left */}
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          left:"4%", width:160, height:"65vh",
          background:"linear-gradient(178deg,rgba(255,215,0,0.055) 0%,rgba(255,215,0,0.018) 45%,transparent 100%)",
          transformOrigin:"top center", filter:"blur(7px)",
          transform:"skewX(-22deg)",
        }}
        animate={{opacity:[0.4,1,0.55,0.9,0.4], skewX:["-22deg","-18deg","-24deg","-19deg","-22deg"]}}
        transition={{duration:7, repeat:Infinity}}
      />

      {/* Stadium floodlight beam — center left */}
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          left:"28%", width:130, height:"55vh",
          background:"linear-gradient(178deg,rgba(255,255,255,0.022) 0%,rgba(255,255,255,0.007) 45%,transparent 100%)",
          transformOrigin:"top center", filter:"blur(10px)",
          transform:"skewX(-8deg)",
        }}
        animate={{opacity:[0.25,0.7,0.35,0.8,0.25]}}
        transition={{duration:11, repeat:Infinity, delay:3}}
      />

      {/* Stadium floodlight beam — center right */}
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          right:"28%", width:130, height:"55vh",
          background:"linear-gradient(178deg,rgba(255,255,255,0.022) 0%,rgba(255,255,255,0.007) 45%,transparent 100%)",
          transformOrigin:"top center", filter:"blur(10px)",
          transform:"skewX(8deg)",
        }}
        animate={{opacity:[0.5,0.25,0.8,0.35,0.5]}}
        transition={{duration:13, repeat:Infinity, delay:5.5}}
      />

      {/* Stadium floodlight beam — far right */}
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          right:"4%", width:160, height:"65vh",
          background:"linear-gradient(178deg,rgba(0,180,255,0.045) 0%,rgba(0,180,255,0.014) 45%,transparent 100%)",
          transformOrigin:"top center", filter:"blur(7px)",
          transform:"skewX(22deg)",
        }}
        animate={{opacity:[0.3,0.85,0.48,1,0.3], skewX:["22deg","18deg","25deg","20deg","22deg"]}}
        transition={{duration:9, repeat:Infinity, delay:1.5}}
      />

      {/* Floating fog blob — center */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top:"22%", left:"28%", width:"44%", height:"42%",
          background:"radial-gradient(ellipse,rgba(60,100,255,0.03) 0%,transparent 70%)",
          filter:"blur(40px)",
        }}
        animate={{x:[0,35,-25,12,0], y:[0,-18,10,-7,0], opacity:[0.3,0.75,0.45,0.9,0.3]}}
        transition={{duration:18, repeat:Infinity}}
      />

      {/* Green pitch glow at bottom */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom:"5%", left:"15%", width:"70%", height:"35%",
          background:"radial-gradient(ellipse,rgba(0,255,135,0.03) 0%,transparent 70%)",
          filter:"blur(35px)",
        }}
        animate={{opacity:[0.25,0.6,0.25]}}
        transition={{duration:5, repeat:Infinity}}
      />

      {/* Gold ambient glow — top left */}
      <div className="absolute pointer-events-none" style={{
        top:"4%", left:"6%", width:420, height:420, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(255,215,0,0.048) 0%,transparent 70%)",
      }}/>

      {/* Blue ambient glow — top right */}
      <div className="absolute pointer-events-none" style={{
        top:"8%", right:"5%", width:340, height:340, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,180,255,0.05) 0%,transparent 70%)",
      }}/>

      {/* Top spotlight vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 60% 42% at 50% -5%,rgba(0,100,255,0.07) 0%,transparent 100%)",
      }}/>

      {/* Strong edge vignette for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow:"inset 0 0 160px rgba(0,0,0,0.6)",
      }}/>

      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"/>

      {/* Bottom pitch strip glow */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height:"10px",
        background:"linear-gradient(90deg,transparent,rgba(0,255,135,0.18),rgba(0,220,90,0.10),rgba(0,255,135,0.18),transparent)",
      }}/>
    </div>
  );
}
