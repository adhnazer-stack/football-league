"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Lock, Clock, Radio } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";

const TOTAL_ROUNDS = 18;

const rowIn: Variants = {
  hidden: { opacity:0, x:-14, scale:0.97 },
  show:   { opacity:1, x:0,   scale:1, transition:{ type:"spring", stiffness:360, damping:26 } },
};
const listIn: Variants = {
  hidden: {},
  show:   { transition:{ staggerChildren:0.052 } },
};

export function RoundPointsCard({ onExpand }: { onExpand?: () => void }) {
  const { language, roundStatus } = useApp();
  const rm = useRM();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const currentRound = rm.currentRoundNumber;

  const rows = rm.players
    .map(player => {
      const isWinner       = rm.selections.winners.includes(player.id);
      const earlyArrival   = rm.selections.earlyArrivals.includes(player.id);
      const sameDayPayment = rm.selections.payments.includes(player.id);
      const pts = (isWinner?3:0) + (earlyArrival?2:0) + (sameDayPayment?1:0);
      return { player, pts, isWinner, earlyArrival, sameDayPayment };
    })
    .sort((a,b) => b.pts - a.pts);

  const hasAnyPoints = rows.some(r => r.pts > 0);
  const isActive     = roundStatus === "active";
  const isEnded      = roundStatus === "ended";
  const progress     = Math.min((currentRound / TOTAL_ROUNDS) * 100, 100);

  return (
    <motion.div
      className="glass-card card-top-green flex flex-col overflow-hidden cursor-pointer"
      whileHover={{ y:-5, transition:{ type:"spring", stiffness:380, damping:22 } }}
      whileTap={{ scale:0.985, transition:{ type:"spring", stiffness:500, damping:24 } }}
      onClick={onExpand}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(0,255,135,0.08)", border:"1px solid rgba(0,255,135,0.2)" }}
            animate={{ boxShadow:["0 0 10px rgba(0,255,135,0.2)","0 0 26px rgba(0,255,135,0.5)","0 0 10px rgba(0,255,135,0.2)"] }}
            transition={{ duration:2.8, repeat:Infinity }}
          >
            <span style={{ fontSize:16 }}>⚽</span>
          </motion.div>
          <div>
            <h2 className="font-black text-sm tracking-wide" style={{ color:"var(--text-primary)" }}>
              {tx("roundPoints")}
            </h2>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              {tx("round")} {currentRound} {tx("of")} {TOTAL_ROUNDS}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ color:"var(--text-muted)", background:"rgba(0,255,135,0.05)", border:"1px solid rgba(0,255,135,0.12)" }}
          whileHover={{ color:"#00FF87", background:"rgba(0,255,135,0.1)", borderColor:"rgba(0,255,135,0.3)" }}
          whileTap={{ scale:0.95 }}
          onClick={e => { e.stopPropagation(); onExpand?.(); }}
        >
          {tx("viewAll")}
          <ArrowRight size={12} className={isRtl?"rotate-180":""}/>
        </motion.button>
      </div>

      {/* Round status banner */}
      <AnimatePresence mode="wait">
        <motion.div key={roundStatus}
          className="mx-4 mt-4 mb-2 px-4 py-3 rounded-xl flex items-center gap-3"
          style={{
            background: isActive
              ? "linear-gradient(135deg,rgba(0,255,135,0.08),rgba(0,200,80,0.04))"
              : isEnded
              ? "linear-gradient(135deg,rgba(255,49,84,0.08),rgba(200,20,50,0.04))"
              : "rgba(255,255,255,0.03)",
            border:`1px solid ${isActive?"rgba(0,255,135,0.22)":isEnded?"rgba(255,49,84,0.2)":"rgba(255,255,255,0.07)"}`,
          }}
          initial={{ opacity:0, scale:0.96, y:-6 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:0.96, y:6 }}
          transition={{ type:"spring", stiffness:380, damping:26 }}
        >
          {isActive ? (
            <>
              <motion.div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background:"#00FF87" }}
                animate={{ opacity:[1,0.3,1], scale:[1,1.4,1] }}
                transition={{ duration:1.2, repeat:Infinity }}/>
              <div className="flex-1">
                <p className="text-xs font-black" style={{ color:"#00FF87" }}>
                  {tx("roundActive")}
                </p>
                <p style={{ fontSize:9, color:"rgba(0,255,135,0.5)", letterSpacing:"0.2em" }}>
                  {tx("round")} {currentRound}
                </p>
              </div>
              {hasAnyPoints && (
                <motion.span
                  className="text-[9px] px-2 py-0.5 rounded font-black"
                  style={{ background:"rgba(0,255,135,0.12)", color:"#00FF87", border:"1px solid rgba(0,255,135,0.25)" }}
                  animate={{ opacity:[1,0.6,1] }} transition={{ duration:1.5, repeat:Infinity }}
                >
                  <Radio size={8} className="inline mr-1"/>LIVE
                </motion.span>
              )}
            </>
          ) : isEnded ? (
            <>
              <Lock size={13} style={{ color:"#FF3154" }}/>
              <span className="text-xs font-black" style={{ color:"#FF3154" }}>
                {tx("roundLocked")} — {tx("round")} {currentRound}
              </span>
            </>
          ) : (
            <>
              <Clock size={13} style={{ color:"var(--text-muted)" }}/>
              <span className="text-xs font-medium" style={{ color:"var(--text-muted)" }}>
                {tx("round")} {currentRound} — {tx("completed")}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar — spring overshoot on fill */}
      <div className="px-4 pb-2">
        <div className="flex justify-between mb-1.5" style={{ fontSize:9, color:"var(--text-muted)", letterSpacing:"0.2em" }}>
          <span>{tx("round")} {currentRound}</span>
          <span>{currentRound}/{TOTAL_ROUNDS}</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height:3, background:"rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background:"linear-gradient(90deg,#00FF87,#00D4FF)" }}
            initial={{ width:0 }}
            animate={{ width:`${progress}%` }}
            transition={{ type:"spring", stiffness:120, damping:18, delay:0.3 }}/>
        </div>
      </div>

      {/* Section label */}
      <div className="flex items-center justify-between px-4 pb-1 pt-1">
        <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.35em", textTransform:"uppercase", color:"var(--text-muted)" }}>
          {tx("round")} {currentRound}
        </p>
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div key={JSON.stringify(rm.selections)}
              variants={listIn} initial="hidden" animate="show">
              {rows.slice(0,6).map((row, idx) => {
                const photo = rm.photos[row.player.id];
                const name = language==="ar" ? row.player.name : (row.player.nameEn ?? row.player.name);
                return (
                  <motion.div key={row.player.id}
                    variants={rowIn}
                    className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl mb-1.5"
                    style={{
                      background: row.pts > 0
                        ? "linear-gradient(90deg,rgba(0,255,135,0.06),rgba(0,200,255,0.03))"
                        : "rgba(255,255,255,0.02)",
                      border:`1px solid ${row.pts>0?"rgba(0,255,135,0.1)":"transparent"}`,
                    }}
                  >
                    <MedalBadge rank={idx+1} size="sm"/>
                    {photo ? (
                      <img src={photo} alt={name}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        style={{ border:`1px solid ${row.player.color}55` }}/>
                    ) : (
                      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[7px] font-black text-white"
                        style={{ background:`linear-gradient(135deg,${row.player.color},${row.player.color}99)` }}>
                        {row.player.name[0]}
                      </div>
                    )}
                    <span className="flex-1 text-xs font-medium truncate"
                      style={{ color:"var(--text-primary)", direction:isRtl?"rtl":"ltr" }}>
                      {name}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span key={row.pts}
                        className="font-black text-sm min-w-[18px] text-right"
                        style={{ color:row.pts>0?"#ffd700":"var(--text-muted)",
                          textShadow:row.pts>0?"0 0 12px rgba(255,215,0,0.5)":"none" }}
                        initial={{ scale:1.8, opacity:0 }}
                        animate={{ scale:1, opacity:1 }}
                        transition={{ type:"spring", stiffness:460, damping:22 }}
                      >{row.pts}</motion.span>
                    </AnimatePresence>
                    <div className="flex gap-0.5 w-8 justify-end">
                      {row.earlyArrival   && <span style={{ fontSize:11 }}>⚡</span>}
                      {row.sameDayPayment && <span style={{ fontSize:11 }}>💰</span>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer legend */}
      <div className="flex items-center gap-4 px-5 py-3 flex-wrap"
        style={{ borderTop:"1px solid rgba(255,255,255,0.04)", fontSize:10, color:"var(--text-muted)" }}>
        <span><span style={{ color:"#00FF87" }}>W</span>=3pts</span>
        <span><span style={{ color:"#00D4FF" }}>⚡</span>=+2pts</span>
        <span><span style={{ color:"#B06BFF" }}>💰</span>=+1pt</span>
      </div>
    </motion.div>
  );
}
