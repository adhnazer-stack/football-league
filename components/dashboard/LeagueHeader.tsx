"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";

export function LeagueHeader() {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const leader       = rm.stats[0];
  const leaderPlayer = leader ? rm.players.find(p => p.id === leader.playerId) : null;
  const totalPlayers = rm.players.length;
  const currentRound = rm.currentRoundNumber;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl mb-6"
      style={{
        background: "linear-gradient(140deg,rgba(4,8,20,0.97) 0%,rgba(8,16,38,0.97) 50%,rgba(4,10,24,0.97) 100%)",
        border: "1px solid rgba(255,215,0,0.22)",
        boxShadow: "0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,215,0,0.1) inset",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      {/* ── Atmospheric background layers ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position:"absolute",top:"-30%",left:"50%",transform:"translateX(-50%)",
          width:"70%",height:"200%",
          background:"radial-gradient(ellipse,rgba(255,215,0,0.05) 0%,transparent 65%)",
        }}/>
        <div style={{
          position:"absolute",top:0,left:0,bottom:0,width:"30%",
          background:"linear-gradient(90deg,rgba(255,215,0,0.03),transparent)",
        }}/>
        <div style={{
          position:"absolute",top:0,right:0,bottom:0,width:"30%",
          background:"linear-gradient(270deg,rgba(0,180,255,0.03),transparent)",
        }}/>
        {/* Top shimmer line */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:"1px",
          background:"linear-gradient(90deg,transparent 0%,rgba(255,215,0,0.55) 30%,rgba(255,255,255,0.3) 50%,rgba(255,215,0,0.55) 70%,transparent 100%)",
        }}/>
        {/* Diagonal grid hint */}
        <div style={{
          position:"absolute",inset:0,opacity:0.35,
          backgroundImage:"repeating-linear-gradient(60deg,transparent,transparent 80px,rgba(255,255,255,0.012) 80px,rgba(255,255,255,0.012) 81px)",
        }}/>
      </div>

      {/* ── Top broadcast bar ── */}
      <div className="relative flex items-center justify-between px-5 pt-4 pb-3"
        style={{borderBottom:"1px solid rgba(255,215,0,0.10)"}}>

        {/* Logo + LIVE badge */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0"
            style={{background:"linear-gradient(135deg,#c9963c,#ffd700)",boxShadow:"0 0 20px rgba(255,215,0,0.3)"}}
            animate={{boxShadow:["0 0 15px rgba(255,215,0,0.25)","0 0 35px rgba(255,215,0,0.55)","0 0 15px rgba(255,215,0,0.25)"]}}
            transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
          >
            ⚽
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-widest uppercase text-sm" style={{
                background:"linear-gradient(135deg,#ffd700,#ffe680 50%,#c9963c)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              }}>
                {isAr ? "الدوري" : "LEAGUE"}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)"}}>
                <div className="live-dot w-1.5 h-1.5 rounded-full"/>
                <span className="text-[9px] font-black tracking-widest" style={{color:"#ef4444"}}>LIVE</span>
              </div>
            </div>
            <p className="text-[10px] tracking-widest" style={{color:"rgba(255,215,0,0.45)"}}>
              {isAr ? "الموسم 2025/26" : "SEASON 2025 / 26"}
            </p>
          </div>
        </div>

        {/* Round counter */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{color:"rgba(255,255,255,0.35)"}}>
              {isAr ? "جولة" : "ROUND"}
            </span>
            <motion.span
              className="font-black text-lg leading-none"
              style={{color:"#ffd700",textShadow:"0 0 20px rgba(255,215,0,0.5)"}}
              key={currentRound}
              initial={{scale:0.7,opacity:0}} animate={{scale:1,opacity:1}}
              transition={{type:"spring",stiffness:400,damping:20}}
            >
              {currentRound}
            </motion.span>
          </div>
          <p className="text-[9px]" style={{color:"rgba(255,255,255,0.22)"}}>
            {isAr ? "الجولة الحالية" : "Current Round"}
          </p>
        </div>
      </div>

      {/* ── Championship title ── */}
      <div className="relative px-5 py-4 flex flex-col items-center text-center">
        <motion.div
          className="flex items-center gap-3 mb-2"
          animate={{y:[0,-3,0]}}
          transition={{duration:3.5,repeat:Infinity,ease:"easeInOut"}}
        >
          <span className="text-3xl md:text-4xl" style={{filter:"drop-shadow(0 0 12px rgba(255,215,0,0.5))"}}>🏆</span>
          <h1
            className="font-black uppercase leading-none"
            style={{
              fontSize:"clamp(17px,4vw,34px)",
              letterSpacing:"0.14em",
              background:"linear-gradient(135deg,#ffd700 0%,#ffe680 30%,#c9963c 55%,#ffe680 75%,#ffd700 100%)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              animation:"goldShimmer 5s linear infinite",
            }}
          >
            {isAr ? "بطولة الدوري" : "LEAGUE CHAMPIONSHIP"}
          </h1>
          <span className="text-3xl md:text-4xl" style={{filter:"drop-shadow(0 0 12px rgba(255,215,0,0.5))"}}>🏆</span>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{opacity:0,scaleX:0}} animate={{opacity:1,scaleX:1}}
          transition={{delay:0.4,duration:0.6}}
        >
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.4))",width:60}}/>
          <span className="text-[9px] font-semibold tracking-[0.5em] uppercase" style={{color:"rgba(255,215,0,0.4)"}}>⚽</span>
          <div style={{height:1,background:"linear-gradient(270deg,transparent,rgba(255,215,0,0.4))",width:60}}/>
        </motion.div>

        {/* ── 3-stat broadcast panels ── */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {/* Current Round */}
          <motion.div
            className="relative overflow-hidden flex flex-col items-center py-3 px-2 rounded-xl"
            style={{background:"rgba(255,215,0,0.05)",border:"1px solid rgba(255,215,0,0.14)"}}
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
            whileHover={{background:"rgba(255,215,0,0.09)",scale:1.02}}
          >
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.5),transparent)"}}/>
            <span className="text-xl mb-1">🏟️</span>
            <motion.span
              className="font-black text-2xl leading-none"
              style={{color:"#ffd700",textShadow:"0 0 16px rgba(255,215,0,0.4)"}}
              key={currentRound}
              initial={{scale:0.7}} animate={{scale:1}}
              transition={{type:"spring",stiffness:350,damping:18}}
            >
              {currentRound}
            </motion.span>
            <span className="text-[9px] font-semibold uppercase tracking-wider mt-1.5" style={{color:"rgba(255,215,0,0.5)"}}>
              {isAr ? "الجولة" : "Round"}
            </span>
          </motion.div>

          {/* Leader */}
          <motion.div
            className="relative overflow-hidden flex flex-col items-center py-3 px-2 rounded-xl"
            style={{background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.14)"}}
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.18}}
            whileHover={{background:"rgba(34,197,94,0.09)",scale:1.02}}
          >
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(34,197,94,0.5),transparent)"}}/>
            <span className="text-xl mb-1">👑</span>
            <p className="font-black text-sm leading-tight text-center truncate w-full" style={{color:"#22c55e",direction:"rtl"}}>
              {leaderPlayer ? leaderPlayer.name.split(" ")[0] : "—"}
            </p>
            {leader && (
              <span className="text-[9px] font-bold" style={{color:"rgba(34,197,94,0.7)"}}>
                {leader.totalPoints} {isAr ? "نقطة" : "pts"}
              </span>
            )}
            <span className="text-[9px] font-semibold uppercase tracking-wider mt-1.5" style={{color:"rgba(34,197,94,0.5)"}}>
              {isAr ? "المتصدر" : "Leader"}
            </span>
          </motion.div>

          {/* Players */}
          <motion.div
            className="relative overflow-hidden flex flex-col items-center py-3 px-2 rounded-xl"
            style={{background:"rgba(0,180,255,0.05)",border:"1px solid rgba(0,180,255,0.14)"}}
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.26}}
            whileHover={{background:"rgba(0,180,255,0.09)",scale:1.02}}
          >
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,180,255,0.5),transparent)"}}/>
            <span className="text-xl mb-1">👥</span>
            <span className="font-black text-2xl leading-none" style={{color:"#00b4ff"}}>
              {totalPlayers}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider mt-1.5" style={{color:"rgba(0,180,255,0.5)"}}>
              {isAr ? "لاعب" : "Players"}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
