"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

interface SpotBeam {
  left?: string;
  right?: string;
  skewX: string;
  delay: number;
}

const SPOT_BEAMS: SpotBeam[] = [
  { left:"8%",  skewX:"-18deg", delay:0    },
  { left:"22%", skewX:"-8deg",  delay:0.25 },
  { right:"8%", skewX:"18deg",  delay:0.12 },
  { right:"22%",skewX:"8deg",   delay:0.38 },
  { left:"48%", skewX:"0deg",   delay:0.18 },
];

function Football() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="fbg" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#d4d4d4"/>
        </radialGradient>
        <filter id="fsh"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="rgba(0,0,50,0.6)"/></filter>
        <radialGradient id="fgl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
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

function TrophySVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe066"/>
          <stop offset="50%" stopColor="#c9963c"/>
          <stop offset="100%" stopColor="#ffd700"/>
        </linearGradient>
        <filter id="tglow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
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
    </svg>
  );
}

export function SplashScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(true);

  const [lightsOn,    setLightsOn]    = useState(false);
  const [pitchUp,     setPitchUp]     = useState(false);
  const [ballRolling, setBallRolling] = useState(false);
  const [trophyOn,    setTrophyOn]    = useState(false);
  const [flashOn,     setFlashOn]     = useState(false);
  const [textPhase,   setTextPhase]   = useState<0 | 1 | 2>(0);
  const [showProg,    setShowProg]    = useState(false);

  /* ─── Canvas: fog + sparks ─────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x:number; y:number; vx:number; vy:number; size:number; maxOp:number; opacity:number; age:number; maxAge:number; type:"fog"|"spark"; color:string };

    const fogC = ["rgba(180,200,255,1)","rgba(200,215,255,1)","rgba(160,185,240,1)"];
    const spkC = ["#ffd700","#f0c040","#ffcc44","#00b4ff","#ffffff","#ffaa00"];

    const make = (): P => {
      const w = canvas.width, h = canvas.height;
      if (Math.random() > 0.42) return {
        x: Math.random()*w, y: h*0.15+Math.random()*h*0.85,
        vx:(Math.random()-0.5)*0.35, vy:-Math.random()*0.12,
        size:55+Math.random()*110, maxOp:0.03+Math.random()*0.07,
        opacity:0, age:0, maxAge:350+Math.random()*300,
        type:"fog", color:fogC[Math.floor(Math.random()*fogC.length)],
      };
      return {
        x: Math.random()*w, y:h*0.45+Math.random()*h*0.45,
        vx:(Math.random()-0.5)*0.7, vy:-(0.35+Math.random()*1.1),
        size:0.6+Math.random()*2.2, maxOp:0.55+Math.random()*0.45,
        opacity:0, age:0, maxAge:55+Math.random()*85,
        type:"spark", color:spkC[Math.floor(Math.random()*spkC.length)],
      };
    };

    const pool: P[] = Array.from({length:230}, ()=>{ const p=make(); p.age=Math.random()*p.maxAge; return p; });

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=0;i<pool.length;i++) {
        const p = pool[i];
        p.age++; p.x+=p.vx; p.y+=p.vy;
        const r = p.age/p.maxAge;
        p.opacity = r<0.2?(r/0.2)*p.maxOp : r>0.72?((1-r)/0.28)*p.maxOp : p.maxOp;
        if (p.age>=p.maxAge||p.y<-160) { pool[i]=make(); continue; }
        ctx.globalAlpha = Math.max(0,p.opacity);
        if (p.type==="fog") {
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
          g.addColorStop(0,p.color); g.addColorStop(0.45,p.color.replace(",1)",",0.35)")); g.addColorStop(1,p.color.replace(",1)",",0)"));
          ctx.fillStyle=g;
        } else ctx.fillStyle=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1;
      rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ window.removeEventListener("resize",resize); if(rafRef.current)cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ─── Cinematic timing ─────────────────────────────────────── */
  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    const add = (fn:()=>void, ms:number) => ts.push(setTimeout(fn, ms));

    add(()=>setLightsOn(true),    180);
    add(()=>setPitchUp(true),     750);
    add(()=>setBallRolling(true), 1550);
    add(()=>{ setTrophyOn(true); setFlashOn(true); }, 2500);
    add(()=>setTextPhase(1),      3200);
    add(()=>setTextPhase(2),      4350);
    add(()=>setShowProg(true),    4450);
    add(()=>{ setVisible(false); setTimeout(onComplete, 680); }, 5250);

    return ()=>ts.forEach(clearTimeout);
  }, [onComplete]);


  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden"
          style={{ background:"linear-gradient(180deg,#000408 0%,#030a18 35%,#040e20 60%,#040c06 100%)" }}
          exit={{ opacity:0, scale:1.04 }}
          transition={{ duration:0.68, ease:"easeInOut" }}
        >
          {/* Particle canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{zIndex:1}}/>

          {/* Floodlight dots at very top */}
          <AnimatePresence>
            {lightsOn && (
              <motion.div
                className="absolute top-1.5 left-0 right-0 flex justify-around px-6 pointer-events-none"
                style={{zIndex:6}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6}}
              >
                {[0,1,2,3,4,5].map(i=>(
                  <div key={i} style={{
                    width:7, height:16, borderRadius:3,
                    background:"#fff",
                    boxShadow:"0 0 18px 8px rgba(255,255,220,0.85), 0 0 50px 20px rgba(255,255,200,0.25)",
                    animation:`stadiumLight ${1.4+i*0.18}s ease-in-out ${i*0.08}s infinite`,
                  }}/>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spotlight beams */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:2}}>
            {SPOT_BEAMS.map((b,i)=>(
              <motion.div
                key={i}
                className="absolute top-0"
                style={{
                  left:b.left, right:b.right,
                  width:180, height:"75vh",
                  background:"linear-gradient(180deg,rgba(130,170,255,0.10) 0%,rgba(100,140,255,0.04) 40%,transparent 100%)",
                  transform:`skewX(${b.skewX})`,
                  transformOrigin:"top center",
                  filter:"blur(3px)",
                }}
                initial={{opacity:0}}
                animate={{opacity:lightsOn?1:0}}
                transition={{duration:1.1, delay:b.delay}}
              />
            ))}
          </div>

          {/* Football Pitch — slides up */}
          <AnimatePresence>
            {pitchUp && (
              <motion.div
                className="absolute bottom-0 left-0 right-0"
                style={{zIndex:5, overflow:"hidden"}}
                initial={{height:0}}
                animate={{height:"40vh"}}
                transition={{duration:0.75, ease:[0.4,0,0.2,1]}}
              >
                <div style={{
                  position:"absolute", inset:0,
                  background:"linear-gradient(to bottom,#0e6010 0%,#0b4d0b 35%,#063306 100%)",
                }}>
                  {/* Grass stripe pattern */}
                  <div style={{
                    position:"absolute", inset:0,
                    backgroundImage:"repeating-linear-gradient(90deg,rgba(0,0,0,0.07) 0px,rgba(0,0,0,0.07) 44px,transparent 44px,transparent 88px)",
                  }}/>
                  {/* Horizontal field line at top */}
                  <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"rgba(255,255,255,0.45)"}}/>
                  {/* Center vertical line */}
                  <div style={{position:"absolute",top:0,bottom:0,left:"50%",width:1,background:"rgba(255,255,255,0.22)"}}/>
                  {/* Center circle */}
                  <div style={{
                    position:"absolute", top:-55, left:"50%",
                    width:170, height:170, marginLeft:-85,
                    border:"1px solid rgba(255,255,255,0.35)",
                    borderRadius:"50%",
                  }}/>
                  {/* Center spot */}
                  <div style={{position:"absolute",top:30,left:"50%",width:5,height:5,marginLeft:-2.5,marginTop:-2.5,background:"rgba(255,255,255,0.7)",borderRadius:"50%"}}/>
                  {/* Penalty box outline */}
                  <div style={{
                    position:"absolute",bottom:0,left:"26%",right:"26%",
                    height:"32%",
                    border:"1px solid rgba(255,255,255,0.28)",
                    borderBottom:"none",
                  }}/>
                </div>
                {/* Top fog edge */}
                <div style={{
                  position:"absolute",top:0,left:0,right:0,height:55,
                  background:"linear-gradient(to bottom,rgba(4,11,24,0.97),transparent)",
                  zIndex:1,
                }}/>
                {/* Subtle crowd silhouette */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:36,overflow:"hidden",zIndex:2}}>
                  {Array.from({length:100},(_,i)=>(
                    <div key={i} style={{
                      position:"absolute",
                      left:`${(i/100)*100+(i%3)*0.2}%`,
                      bottom:0,
                      width:9+(i%5),
                      height:15+Math.sin(i*0.7)*7,
                      borderRadius:"50% 50% 0 0",
                      background:`rgba(${100+(i%50)},${85+(i%35)},${70+(i%25)},0.45)`,
                    }}/>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Football rolling in */}
          <AnimatePresence>
            {ballRolling && (
              <motion.div
                style={{
                  position:"absolute",
                  bottom:"calc(40vh - 34px)",
                  left:"50%",
                  marginLeft:-40,
                  zIndex:20,
                }}
                initial={{x:"-80vw", rotate:-480}}
                animate={{x:0, rotate:0}}
                transition={{
                  x:      { duration:0.9, ease:[0.25,0.46,0.45,0.94] },
                  rotate: { duration:0.9, ease:"linear" },
                }}
              >
                <motion.div
                  className="w-[80px] h-[80px]"
                  animate={{y:[0,-8,0,- 4,0]}}
                  transition={{delay:0.95, duration:0.5, ease:"easeOut"}}
                >
                  <Football/>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trophy rising from pitch */}
          <AnimatePresence>
            {trophyOn && (
              <motion.div
                style={{
                  position:"absolute",
                  bottom:"calc(40vh + 44px)",
                  left:"50%",
                  marginLeft:-52,
                  zIndex:21,
                }}
                initial={{y:110, opacity:0, scale:0.4}}
                animate={{y:0, opacity:1, scale:1}}
                transition={{type:"spring", stiffness:115, damping:11, delay:0.08}}
              >
                <div className="relative" style={{animation:"trophyPulse 2.4s ease-in-out infinite"}}>
                  {/* Trophy halo */}
                  <div style={{
                    position:"absolute", inset:"-24px",
                    borderRadius:"50%",
                    background:"radial-gradient(circle,rgba(255,215,0,0.28) 0%,transparent 70%)",
                    pointerEvents:"none",
                  }}/>
                  <div className="w-[104px] h-[104px]"><TrophySVG/></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gold flash when trophy appears */}
          <AnimatePresence>
            {flashOn && (
              <motion.div
                style={{position:"absolute",inset:0,zIndex:40,background:"rgba(255,215,0,0.13)",pointerEvents:"none"}}
                initial={{opacity:1}}
                animate={{opacity:0}}
                exit={{opacity:0}}
                transition={{duration:0.7}}
              />
            )}
          </AnimatePresence>

          {/* ── Championship text — upper portion ────────────────── */}
          <div style={{position:"absolute",top:"10%",left:0,right:0,zIndex:35}}>
            <AnimatePresence mode="wait">

              {textPhase===1 && (
                <motion.div
                  key="champ"
                  className="text-center px-4"
                  initial={{opacity:0,y:24}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-20}}
                  transition={{duration:0.6}}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.45em] mb-3"
                    style={{color:"rgba(255,215,0,0.55)"}}>
                    ⚽ OFFICIAL LEAGUE ⚽
                  </div>
                  <h1
                    className="font-black uppercase leading-none"
                    style={{
                      fontSize:"clamp(28px,7.5vw,72px)",
                      letterSpacing:"0.14em",
                      color:"#C9A84C",
                      textShadow:"0 0 60px rgba(201,168,76,0.45), 0 0 120px rgba(201,168,76,0.2)",
                    }}>
                    LEAGUE<br/>CHAMPIONSHIP
                  </h1>
                  <p className="mt-3 text-sm tracking-[0.42em] uppercase"
                    style={{color:"rgba(200,210,255,0.55)"}}>
                    Season 2025 / 26
                  </p>
                  {/* Decorative line */}
                  <motion.div
                    className="mx-auto mt-3 rounded-full"
                    style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)"}}
                    initial={{width:0}} animate={{width:"60%"}} transition={{delay:0.4,duration:0.6}}
                  />
                </motion.div>
              )}

              {textPhase===2 && (
                <motion.div
                  key="loading"
                  className="flex flex-col items-center gap-5 px-4"
                  initial={{opacity:0,y:18}}
                  animate={{opacity:1,y:0}}
                  transition={{duration:0.45}}
                >
                  <p className="text-lg tracking-[0.32em] uppercase"
                    style={{color:"rgba(180,200,255,0.75)"}}>
                    Loading Season...
                  </p>
                  <div className="rounded-full overflow-hidden"
                    style={{width:"min(280px,70vw)",height:3,background:"rgba(255,255,255,0.08)"}}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{background:"#C9A84C"}}
                      initial={{width:"0%"}}
                      animate={showProg?{width:"100%"}:{width:"0%"}}
                      transition={{duration:0.82,ease:"easeOut"}}
                    />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Stadium floor supplement (original hint for older browsers) */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{height:"8%",background:"linear-gradient(180deg,transparent,rgba(4,24,8,0.5) 100%)",zIndex:4}}/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
