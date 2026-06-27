"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";

const panelIn: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.94 },
  show:   { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.45 } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

export function LeagueHeader() {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const leader       = rm.stats[0];
  const leaderPlayer = leader ? rm.players.find(p => p.id === leader.playerId) : null;
  const leaderName   = leaderPlayer
    ? (language === "ar" ? leaderPlayer.name : (leaderPlayer.nameEn ?? leaderPlayer.name))
    : "—";
  const currentRound = rm.currentRoundNumber;
  const totalPlayers = rm.players.length;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl mb-5 card-top-gold"
      style={{ background: "rgba(3,6,18,0.97)" }}
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
    >
      {/* Top shimmer line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.8),rgba(255,255,255,0.5),rgba(255,215,0,0.8),transparent)",
      }}/>

      {/* Atmospheric glow */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 80% 60% at 50% -20%,rgba(255,215,0,0.06) 0%,transparent 65%)" }}
        animate={{ opacity:[0.5,1,0.5] }}
        transition={{ duration:4, repeat:Infinity }}
      />

      {/* Scan line animation */}
      <motion.div className="absolute left-0 right-0 pointer-events-none"
        style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.12),transparent)" }}
        animate={{ top:["0%","100%"] }}
        transition={{ duration:6, repeat:Infinity, ease:"linear", repeatDelay:4 }}
      />

      {/* Top row: LIVE label + Season */}
      <div className="relative flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5">
          {/* Animated orb */}
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background:"linear-gradient(135deg,#0d1f0b,#1a3d14)", border:"1px solid rgba(0,255,135,0.25)" }}
            animate={{ boxShadow:["0 0 12px rgba(0,255,135,0.2)","0 0 30px rgba(0,255,135,0.5)","0 0 12px rgba(0,255,135,0.2)"] }}
            transition={{ duration:2.8, repeat:Infinity }}
          >⚽</motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-[0.3em] uppercase" style={{
                background:"linear-gradient(135deg,#ffd700,#ffe680)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              }}>
                {isAr ? "الدوري" : "LEAGUE"}
              </span>
              <motion.div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{ background:"rgba(255,49,84,0.12)", border:"1px solid rgba(255,49,84,0.28)" }}
                animate={{ opacity:[1,0.6,1] }}
                transition={{ duration:1.5, repeat:Infinity }}
              >
                <div className="live-dot w-1.5 h-1.5 rounded-full"/>
                <span className="text-[8px] font-black tracking-[0.3em]" style={{ color:"#FF3154" }}>LIVE</span>
              </motion.div>
            </div>
            <p style={{ color:"rgba(255,215,0,0.38)", fontSize:9, letterSpacing:"0.35em" }}>
              {isAr ? "الموسم 2025/26" : "SEASON 2025 / 26"}
            </p>
          </div>
        </div>
        {/* Round badge */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            <span style={{ color:"rgba(255,255,255,0.25)", fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase" }}>
              {isAr ? "جولة" : "RND"}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentRound}
                className="font-black leading-none"
                style={{ color:"#ffd700", textShadow:"0 0 20px rgba(255,215,0,0.6)", fontSize:22 }}
                initial={{ scale:0.5, opacity:0 }}
                animate={{ scale:1, opacity:1 }}
                exit={{ scale:1.3, opacity:0 }}
                transition={{ type:"spring", stiffness:420, damping:22 }}
              >{currentRound}</motion.span>
            </AnimatePresence>
          </div>
          <span style={{ color:"rgba(255,255,255,0.15)", fontSize:8, letterSpacing:"0.25em" }}>
            {isAr ? "الحالية" : "CURRENT"}
          </span>
        </div>
      </div>

      {/* Main title */}
      <div className="relative flex flex-col items-center text-center px-5 py-5">
        <motion.div
          className="flex items-center gap-3 mb-3"
          animate={{ y:[0,-4,0] }}
          transition={{ duration:3.8, repeat:Infinity }}
        >
          <motion.span className="text-3xl"
            style={{ filter:"drop-shadow(0 0 16px rgba(255,215,0,0.6))" }}
            animate={{ rotate:[-6,0,6,0,-6] }}
            transition={{ duration:5, repeat:Infinity }}
          >🏆</motion.span>

          <h1 className="font-black uppercase leading-none tracking-tight" style={{
            fontSize:"clamp(20px,5vw,40px)",
            letterSpacing:"0.1em",
            background:"linear-gradient(135deg,#ffd700 0%,#fff8b0 30%,#c9963c 55%,#ffe680 78%,#ffd700 100%)",
            backgroundSize:"200% auto",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
            animation:"goldShimmer 5s linear infinite",
          }}>
            {isAr ? "بطولة الدوري" : "LEAGUE CHAMPIONSHIP"}
          </h1>

          <motion.span className="text-3xl"
            style={{ filter:"drop-shadow(0 0 16px rgba(255,215,0,0.6))" }}
            animate={{ rotate:[6,0,-6,0,6] }}
            transition={{ duration:5, repeat:Infinity, delay:0.4 }}
          >🏆</motion.span>
        </motion.div>

        {/* Neon divider */}
        <motion.div className="flex items-center gap-3 mb-5"
          initial={{ scaleX:0, opacity:0 }} animate={{ scaleX:1, opacity:1 }}
          transition={{ delay:0.5, duration:0.7 }}
        >
          <div style={{ height:1, width:80, background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.5))" }}/>
          <motion.span
            style={{ color:"rgba(0,255,135,0.7)", fontSize:14 }}
            animate={{ opacity:[0.4,1,0.4] }}
            transition={{ duration:2, repeat:Infinity }}
          >⚽</motion.span>
          <div style={{ height:1, width:80, background:"linear-gradient(270deg,transparent,rgba(255,215,0,0.5))" }}/>
        </motion.div>

        {/* 3 stat panels */}
        <motion.div className="grid grid-cols-3 gap-3 w-full"
          variants={stagger} initial="hidden" animate="show">

          {/* Round */}
          <motion.div className="relative overflow-hidden flex flex-col items-center py-4 px-2 rounded-xl"
            style={{ background:"rgba(255,215,0,0.04)", border:"1px solid rgba(255,215,0,0.12)" }}
            variants={panelIn}
            whileHover={{ background:"rgba(255,215,0,0.08)", scale:1.04 }}
          >
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.7),transparent)" }}/>
            <span className="text-2xl mb-1">🏟️</span>
            <AnimatePresence mode="wait">
              <motion.span key={currentRound}
                className="font-black leading-none" style={{ fontSize:30, color:"#ffd700", textShadow:"0 0 20px rgba(255,215,0,0.55)" }}
                initial={{ scale:0.5 }} animate={{ scale:1 }}
                transition={{ type:"spring", stiffness:380, damping:18 }}
              >{currentRound}</motion.span>
            </AnimatePresence>
            <span style={{ color:"rgba(255,215,0,0.5)", fontSize:8, letterSpacing:"0.4em", textTransform:"uppercase", marginTop:6 }}>
              {isAr ? "الجولة" : "ROUND"}
            </span>
          </motion.div>

          {/* Leader */}
          <motion.div className="relative overflow-hidden flex flex-col items-center py-4 px-2 rounded-xl"
            style={{ background:"rgba(0,255,135,0.04)", border:"1px solid rgba(0,255,135,0.12)" }}
            variants={panelIn}
            whileHover={{ background:"rgba(0,255,135,0.08)", scale:1.04 }}
          >
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,255,135,0.7),transparent)" }}/>
            <span className="text-2xl mb-1">👑</span>
            <p className="font-black text-sm leading-tight text-center truncate w-full"
              style={{ color:"#00FF87", textShadow:"0 0 14px rgba(0,255,135,0.5)", direction:"rtl" }}>
              {leaderName.split(" ")[0]}
            </p>
            {leader && (
              <span style={{ color:"rgba(0,255,135,0.65)", fontSize:10, fontWeight:700 }}>
                {leader.totalPoints} {isAr ? "نقطة" : "pts"}
              </span>
            )}
            <span style={{ color:"rgba(0,255,135,0.45)", fontSize:8, letterSpacing:"0.4em", textTransform:"uppercase", marginTop:4 }}>
              {isAr ? "المتصدر" : "LEADER"}
            </span>
          </motion.div>

          {/* Players */}
          <motion.div className="relative overflow-hidden flex flex-col items-center py-4 px-2 rounded-xl"
            style={{ background:"rgba(0,212,255,0.04)", border:"1px solid rgba(0,212,255,0.12)" }}
            variants={panelIn}
            whileHover={{ background:"rgba(0,212,255,0.08)", scale:1.04 }}
          >
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.7),transparent)" }}/>
            <span className="text-2xl mb-1">👥</span>
            <motion.span
              className="font-black leading-none" style={{ fontSize:30, color:"#00D4FF", textShadow:"0 0 16px rgba(0,212,255,0.5)" }}
              key={totalPlayers}
              initial={{ scale:0.5 }} animate={{ scale:1 }}
              transition={{ type:"spring", stiffness:380, damping:18 }}
            >{totalPlayers}</motion.span>
            <span style={{ color:"rgba(0,212,255,0.45)", fontSize:8, letterSpacing:"0.4em", textTransform:"uppercase", marginTop:6 }}>
              {isAr ? "لاعب" : "PLAYERS"}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom green pitch strip */}
      <div style={{ height:2, background:"linear-gradient(90deg,transparent,rgba(0,255,135,0.4),rgba(0,255,135,0.6),rgba(0,255,135,0.4),transparent)" }}/>
    </motion.div>
  );
}
