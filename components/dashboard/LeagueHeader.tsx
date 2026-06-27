"use client";

import { motion, type Variants } from "framer-motion";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
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
  const totalPlayers = rm.players.length;
  const currentRound = rm.currentRoundNumber;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl mb-6"
      style={{
        background: "linear-gradient(148deg,rgba(3,6,18,0.98) 0%,rgba(6,12,30,0.97) 50%,rgba(3,8,22,0.98) 100%)",
        border: "1px solid rgba(255,215,0,0.2)",
        boxShadow: "0 8px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.025) inset, 0 1px 0 rgba(255,215,0,0.12) inset",
      }}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* ── Atmospheric background layers ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Center radial gold glow */}
        <motion.div
          style={{
            position:"absolute",top:"-40%",left:"50%",transform:"translateX(-50%)",
            width:"80%",height:"220%",
            background:"radial-gradient(ellipse,rgba(255,215,0,0.055) 0%,transparent 62%)",
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Left green pitch fade */}
        <div style={{
          position:"absolute",top:0,left:0,bottom:0,width:"28%",
          background:"linear-gradient(90deg,rgba(0,255,135,0.025),transparent)",
        }}/>
        {/* Right blue electric fade */}
        <div style={{
          position:"absolute",top:0,right:0,bottom:0,width:"28%",
          background:"linear-gradient(270deg,rgba(0,180,255,0.028),transparent)",
        }}/>
        {/* Top shimmer line */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:"1px",
          background:"linear-gradient(90deg,transparent 0%,rgba(255,215,0,0.65) 28%,rgba(255,255,255,0.45) 50%,rgba(255,215,0,0.65) 72%,transparent 100%)",
        }}/>
        {/* Subtle diagonal grid */}
        <div style={{
          position:"absolute",inset:0,opacity:0.25,
          backgroundImage:"repeating-linear-gradient(55deg,transparent,transparent 88px,rgba(255,255,255,0.01) 88px,rgba(255,255,255,0.01) 89px)",
        }}/>
      </div>

      {/* ── Top broadcast bar ── */}
      <div className="relative flex items-center justify-between px-5 pt-4 pb-3"
        style={{borderBottom:"1px solid rgba(255,215,0,0.09)"}}>

        {/* Logo + LIVE badge */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0"
            style={{
              background:"linear-gradient(135deg,#b8790a,#ffd700,#c9963c)",
              boxShadow:"0 0 18px rgba(255,215,0,0.35), 0 2px 8px rgba(0,0,0,0.4)",
            }}
            animate={{
              boxShadow:[
                "0 0 14px rgba(255,215,0,0.3)",
                "0 0 32px rgba(255,215,0,0.6)",
                "0 0 14px rgba(255,215,0,0.3)",
              ],
            }}
            transition={{duration:2.8,repeat:Infinity}}
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
              <motion.div
                className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                style={{background:"rgba(239,68,68,0.14)",border:"1px solid rgba(239,68,68,0.32)"}}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <div className="live-dot w-1.5 h-1.5 rounded-full"/>
                <span className="text-[9px] font-black tracking-widest" style={{color:"#ef4444"}}>LIVE</span>
              </motion.div>
            </div>
            <p className="text-[10px] tracking-widest" style={{color:"rgba(255,215,0,0.4)"}}>
              {isAr ? "الموسم 2025/26" : "SEASON 2025 / 26"}
            </p>
          </div>
        </div>

        {/* Round counter */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{color:"rgba(255,255,255,0.3)"}}>
              {isAr ? "جولة" : "ROUND"}
            </span>
            <motion.span
              className="font-black text-xl leading-none"
              style={{color:"#ffd700",textShadow:"0 0 22px rgba(255,215,0,0.55)"}}
              key={currentRound}
              initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}}
              transition={{type:"spring",stiffness:420,damping:22}}
            >
              {currentRound}
            </motion.span>
          </div>
          <p className="text-[9px]" style={{color:"rgba(255,255,255,0.18)"}}>
            {isAr ? "الجولة الحالية" : "Current Round"}
          </p>
        </div>
      </div>

      {/* ── Championship title ── */}
      <div className="relative px-5 py-4 flex flex-col items-center text-center">
        <motion.div
          className="flex items-center gap-3 mb-2"
          animate={{y:[0,-4,0]}}
          transition={{duration:3.5,repeat:Infinity}}
        >
          <motion.span
            className="text-3xl md:text-4xl"
            style={{filter:"drop-shadow(0 0 14px rgba(255,215,0,0.55))"}}
            animate={{rotate:[0,-5,5,0]}}
            transition={{duration:4,repeat:Infinity}}
          >
            🏆
          </motion.span>
          <h1
            className="font-black uppercase leading-none"
            style={{
              fontSize:"clamp(18px,4vw,36px)",
              letterSpacing:"0.12em",
              background:"linear-gradient(135deg,#ffd700 0%,#fff5b0 28%,#c9963c 55%,#ffe680 78%,#ffd700 100%)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              animation:"goldShimmer 5s linear infinite",
              textShadow:"none",
            }}
          >
            {isAr ? "بطولة الدوري" : "LEAGUE CHAMPIONSHIP"}
          </h1>
          <motion.span
            className="text-3xl md:text-4xl"
            style={{filter:"drop-shadow(0 0 14px rgba(255,215,0,0.55))"}}
            animate={{rotate:[0,5,-5,0]}}
            transition={{duration:4,repeat:Infinity,delay:0.4}}
          >
            🏆
          </motion.span>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{opacity:0,scaleX:0}} animate={{opacity:1,scaleX:1}}
          transition={{delay:0.45,duration:0.65}}
        >
          <motion.div
            style={{height:1,background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.5))",width:70}}
            animate={{opacity:[0.5,1,0.5]}}
            transition={{duration:2.5,repeat:Infinity}}
          />
          <span className="text-[9px] font-bold tracking-[0.55em] uppercase" style={{color:"rgba(255,215,0,0.45)"}}>⚽</span>
          <motion.div
            style={{height:1,background:"linear-gradient(270deg,transparent,rgba(255,215,0,0.5))",width:70}}
            animate={{opacity:[0.5,1,0.5]}}
            transition={{duration:2.5,repeat:Infinity,delay:0.5}}
          />
        </motion.div>

        {/* ── 3-stat broadcast panels ── */}
        <motion.div
          className="grid grid-cols-3 gap-3 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Current Round */}
          <motion.div
            className="relative overflow-hidden flex flex-col items-center py-3.5 px-2 rounded-xl"
            style={{
              background:"linear-gradient(145deg,rgba(255,215,0,0.07),rgba(255,215,0,0.03))",
              border:"1px solid rgba(255,215,0,0.16)",
            }}
            variants={panelVariants}
            whileHover={{background:"rgba(255,215,0,0.1)",scale:1.03}}
          >
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.6),transparent)"}}/>
            <span className="text-xl mb-1">🏟️</span>
            <motion.span
              className="font-black text-2xl leading-none"
              style={{color:"#ffd700",textShadow:"0 0 18px rgba(255,215,0,0.5)"}}
              key={currentRound}
              initial={{scale:0.65}} animate={{scale:1}}
              transition={{type:"spring",stiffness:380,damping:18}}
            >
              {currentRound}
            </motion.span>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5" style={{color:"rgba(255,215,0,0.5)"}}>
              {isAr ? "الجولة" : "Round"}
            </span>
          </motion.div>

          {/* Leader */}
          <motion.div
            className="relative overflow-hidden flex flex-col items-center py-3.5 px-2 rounded-xl"
            style={{
              background:"linear-gradient(145deg,rgba(34,197,94,0.07),rgba(34,197,94,0.03))",
              border:"1px solid rgba(34,197,94,0.16)",
            }}
            variants={panelVariants}
            whileHover={{background:"rgba(34,197,94,0.1)",scale:1.03}}
          >
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(34,197,94,0.6),transparent)"}}/>
            <span className="text-xl mb-1">👑</span>
            <p className="font-black text-sm leading-tight text-center truncate w-full" style={{color:"#22c55e",direction:"rtl"}}>
              {leaderName.split(" ")[0]}
            </p>
            {leader && (
              <span className="text-[9px] font-bold" style={{color:"rgba(34,197,94,0.7)"}}>
                {leader.totalPoints} {isAr ? "نقطة" : "pts"}
              </span>
            )}
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5" style={{color:"rgba(34,197,94,0.5)"}}>
              {isAr ? "المتصدر" : "Leader"}
            </span>
          </motion.div>

          {/* Players count */}
          <motion.div
            className="relative overflow-hidden flex flex-col items-center py-3.5 px-2 rounded-xl"
            style={{
              background:"linear-gradient(145deg,rgba(0,180,255,0.07),rgba(0,180,255,0.03))",
              border:"1px solid rgba(0,180,255,0.16)",
            }}
            variants={panelVariants}
            whileHover={{background:"rgba(0,180,255,0.1)",scale:1.03}}
          >
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,180,255,0.6),transparent)"}}/>
            <span className="text-xl mb-1">👥</span>
            <motion.span
              className="font-black text-2xl leading-none"
              style={{color:"#00b4ff",textShadow:"0 0 16px rgba(0,180,255,0.45)"}}
              key={totalPlayers}
              initial={{scale:0.65}} animate={{scale:1}}
              transition={{type:"spring",stiffness:380,damping:18}}
            >
              {totalPlayers}
            </motion.span>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5" style={{color:"rgba(0,180,255,0.5)"}}>
              {isAr ? "لاعب" : "Players"}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
