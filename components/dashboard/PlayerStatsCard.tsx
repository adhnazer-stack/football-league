"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Trophy, Zap } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";
import { NumberTicker } from "@/components/magicui/number-ticker";

const rowIn: Variants = {
  hidden: { opacity: 0, x: 16 },
  show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 360, damping: 28 } },
};
const listIn: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.048 } },
};

export function PlayerStatsCard({
  onExpand,
  onPlayerClick,
}: {
  onExpand?: () => void;
  onPlayerClick?: (id: string) => void;
}) {
  const { language } = useApp();
  const rm = useRM();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const stats = rm.stats;
  const getPlayer = (id: string) => rm.players.find(p => p.id === id);
  const displayName = (id: string) => {
    const p = getPlayer(id);
    if (!p) return "—";
    return language === "ar" ? p.name : (p.nameEn ?? p.name);
  };

  const byPoints = stats[0] ?? null;
  const byWins   = stats.length ? [...stats].sort((a,b) => b.wins - a.wins)[0] : null;
  const byEarly  = stats.length ? [...stats].sort((a,b) => b.earlyArrivals - a.earlyArrivals)[0] : null;

  const GRID = "22px 1fr 44px 36px 40px 34px";

  return (
    <motion.div
      className="glass-card card-top-blue flex flex-col overflow-hidden cursor-pointer"
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
            style={{ background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)" }}
            animate={{ boxShadow:["0 0 10px rgba(0,212,255,0.2)","0 0 26px rgba(0,212,255,0.5)","0 0 10px rgba(0,212,255,0.2)"] }}
            transition={{ duration:2.8, repeat:Infinity }}
          >
            <span style={{ fontSize:16 }}>📊</span>
          </motion.div>
          <div>
            <h2 className="font-black text-sm tracking-wide" style={{ color:"var(--text-primary)" }}>
              {tx("playerStatistics")}
            </h2>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              {rm.rounds.length} {isRtl ? "جولات" : "rounds"} · {tx("season")}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ color:"var(--text-muted)", background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.12)" }}
          whileHover={{ color:"#00D4FF", background:"rgba(0,212,255,0.1)", borderColor:"rgba(0,212,255,0.3)" }}
          whileTap={{ scale:0.95 }}
          onClick={e => { e.stopPropagation(); onExpand?.(); }}
        >
          {tx("viewAll")}
          <ArrowRight size={12} className={isRtl ? "rotate-180" : ""}/>
        </motion.button>
      </div>

      {/* Top 3 highlight panels — Direction A: NumberTicker */}
      <div className="grid grid-cols-3 gap-0" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        {[
          { label:tx("mostPoints"),       val:byPoints?.totalPoints??0, id:byPoints?.playerId??"",  color:"#ffd700", icon:<Trophy size={13}/>, delay:0 },
          { label:tx("mostWins"),          val:byWins?.wins??0,          id:byWins?.playerId??"",    color:"#00FF87", icon:<span style={{fontSize:13}}>🏆</span>, delay:0.08 },
          { label:tx("mostEarlyArrivals"), val:byEarly?.earlyArrivals??0,id:byEarly?.playerId??"",  color:"#00D4FF", icon:<Zap size={13}/>, delay:0.16 },
        ].map((s, i) => (
          <motion.div key={i}
            className="flex flex-col items-center py-4 gap-0.5"
            style={{ borderRight: i<2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            initial={{ opacity:0, y:14, scale:0.92 }}
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ type:"spring", stiffness:380, damping:26, delay:s.delay }}
          >
            <span style={{ color:s.color }}>{s.icon}</span>
            <span className="font-black" style={{ fontSize:28, color:s.color, textShadow:`0 0 20px ${s.color}66` }}>
              <NumberTicker value={s.val} delay={s.delay} />
            </span>
            <span style={{ color:"var(--text-muted)", fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", marginTop:2 }}>
              {s.label}
            </span>
            <span className="text-[9px] text-center truncate max-w-[85px] font-medium"
              style={{ color:s.color, opacity:0.7, direction:isRtl?"rtl":"ltr" }}>
              {displayName(s.id)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Column headers */}
      <div className="grid px-4 py-2 text-[9px] font-black tracking-[0.3em] uppercase"
        style={{ gridTemplateColumns:GRID, color:"var(--text-muted)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-center">#</span>
        <span className={isRtl ? "text-right" : ""}>{tx("player")}</span>
        <span className="text-right" style={{ color:"rgba(255,215,0,0.7)" }}>PTS</span>
        <span className="text-right" style={{ color:"rgba(0,255,135,0.7)" }}>{tx("wins")}</span>
        <span className="text-right" style={{ color:"rgba(0,212,255,0.7)" }}>⚡</span>
        <span className="text-right" style={{ color:"rgba(176,107,255,0.7)" }}>💰</span>
      </div>

      {/* Player rows */}
      <div className="flex-1 overflow-auto">
        <motion.div variants={listIn} initial="hidden" animate="show">
          {stats.map((stat, idx) => {
            const player = getPlayer(stat.playerId);
            if (!player) return null;
            const photo = rm.photos[stat.playerId];
            const rankClass = idx===0 ? "row-rank-1" : idx===1 ? "row-rank-2" : idx===2 ? "row-rank-3" : "";
            const name = language==="ar" ? player.name : (player.nameEn ?? player.name);
            return (
              <motion.div key={stat.playerId}
                className={`grid px-4 py-2.5 items-center text-xs ${rankClass}`}
                style={{ gridTemplateColumns:GRID, borderBottom:"1px solid rgba(255,255,255,0.025)", cursor:onPlayerClick?"pointer":"default", position:"relative" }}
                variants={rowIn}
                whileHover={{ background:idx<3?undefined:"rgba(0,212,255,0.03)" }}
                whileTap={{ scale:0.985 }}
                onClick={e => { e.stopPropagation(); onPlayerClick?.(stat.playerId); }}
              >
                <div className="flex justify-center">
                  <MedalBadge rank={stat.rank} size="sm"/>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  {photo ? (
                    <img src={photo} alt={name}
                      className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                      style={{ border:`1px solid ${player.color}55` }}/>
                  ) : (
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black text-white"
                      style={{ background:`linear-gradient(135deg,${player.color},${player.color}88)` }}>
                      {player.name[0]}
                    </div>
                  )}
                  <span className="font-semibold truncate"
                    style={{ color:"var(--text-primary)", direction:isRtl?"rtl":"ltr" }}>
                    {name}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span key={`pts-${stat.totalPoints}`}
                    className="text-right font-black"
                    style={{ color:"#ffd700", textShadow:"0 0 10px rgba(255,215,0,0.4)" }}
                    initial={{ scale:1.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
                    transition={{ type:"spring", stiffness:440, damping:22 }}
                  >{stat.totalPoints}</motion.span>
                </AnimatePresence>
                <span className="text-right font-bold" style={{ color:"#00FF87" }}>{stat.wins}</span>
                <span className="text-right" style={{ color:"#00D4FF" }}>{stat.earlyArrivals}</span>
                <span className="text-right" style={{ color:"#B06BFF" }}>{stat.payments}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
