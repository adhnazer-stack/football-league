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

    const sparkColors = ["#ffd700","#c9963c","#00b4ff","rgba(255,255,255,0.8)","rgba(255,200,100,0.9)"];

    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.25 + Math.random() * canvas.height * 0.75,
      vx: (Math.random()-0.5)*0.5,
      vy: -(0.18+Math.random()*0.65),
      size: 0.4+Math.random()*1.8,
      maxOpacity: 0.25+Math.random()*0.45,
      opacity: 0,
      age: 0,
      maxAge: 90+Math.random()*130,
      color: sparkColors[Math.floor(Math.random()*sparkColors.length)],
    });

    const pool: P[] = Array.from({length:100}, ()=>{ const p=make(); p.age=Math.random()*p.maxAge; return p; });

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const dimFactor = theme==="light" ? 0.28 : 1;
      for (let i=0;i<pool.length;i++) {
        const p=pool[i];
        p.age++; p.x+=p.vx; p.y+=p.vy;
        const r=p.age/p.maxAge;
        p.opacity = r<0.2?(r/0.2)*p.maxOpacity : r>0.7?((1-r)/0.3)*p.maxOpacity : p.maxOpacity;
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

      {/* Pitch grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,0.012) 80px,rgba(255,255,255,0.012) 81px),repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,0.012) 80px,rgba(255,255,255,0.012) 81px)",
      }}/>

      {/* Animated spotlight beam — left */}
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          left:"8%", width:200, height:"60vh",
          background:"linear-gradient(180deg,rgba(255,215,0,0.045) 0%,rgba(255,215,0,0.015) 40%,transparent 100%)",
          transformOrigin:"top left", filter:"blur(6px)",
          transform:"skewX(-12deg)",
        }}
        animate={{opacity:[0.5,1,0.6,1,0.5],skewX:["-12deg","-10deg","-13deg","-11deg","-12deg"]}}
        transition={{duration:8, repeat:Infinity, ease:"easeInOut"}}
      />

      {/* Animated spotlight beam — right */}
      <motion.div
        className="absolute top-0 pointer-events-none"
        style={{
          right:"8%", width:200, height:"60vh",
          background:"linear-gradient(180deg,rgba(0,180,255,0.035) 0%,rgba(0,180,255,0.012) 40%,transparent 100%)",
          transformOrigin:"top right", filter:"blur(6px)",
          transform:"skewX(12deg)",
        }}
        animate={{opacity:[0.4,0.9,0.5,1,0.4],skewX:["12deg","10deg","14deg","11deg","12deg"]}}
        transition={{duration:10, repeat:Infinity, ease:"easeInOut", delay:2}}
      />

      {/* Floating fog blob — center */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top:"20%", left:"35%", width:"30%", height:"35%",
          background:"radial-gradient(ellipse,rgba(100,140,255,0.025) 0%,transparent 70%)",
          filter:"blur(30px)",
        }}
        animate={{x:[0,30,-20,10,0], y:[0,-15,10,-5,0], opacity:[0.4,0.8,0.5,0.9,0.4]}}
        transition={{duration:15, repeat:Infinity, ease:"easeInOut"}}
      />

      {/* Ambient gold glow — top left */}
      <div className="absolute pointer-events-none" style={{
        top:"8%", left:"12%", width:350, height:350, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(255,215,0,0.04) 0%,transparent 70%)",
      }}/>

      {/* Ambient blue glow — top right */}
      <div className="absolute pointer-events-none" style={{
        top:"12%", right:"10%", width:280, height:280, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,180,255,0.045) 0%,transparent 70%)",
      }}/>

      {/* Top vignette spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 55% 40% at 50% -5%,rgba(0,120,255,0.07) 0%,transparent 100%)",
      }}/>

      {/* Bottom vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 80% 50% at 50% 100%,rgba(0,60,120,0.10) 0%,transparent 100%)",
      }}/>

      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"/>

      {/* Bottom pitch strip */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height:"8px",
        background:"linear-gradient(90deg,transparent,rgba(0,200,60,0.12),transparent)",
      }}/>
    </div>
  );
}
