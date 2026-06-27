"use client";

import { motion, type Variants } from "framer-motion";
import { Users, ArrowRight, Zap, Trophy } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";

const rowVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
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
  const getPlayer = (id: string) => rm.players.find((p) => p.id === id);
  const displayName = (id: string) => {
    const p = getPlayer(id);
    if (!p) return "—";
    return language === "ar" ? p.name : (p.nameEn ?? p.name);
  };

  const byPoints = stats[0] ?? null;
  const byWins   = stats.length ? [...stats].sort((a, b) => b.wins - a.wins)[0] : null;
  const byEarly  = stats.length ? [...stats].sort((a, b) => b.earlyArrivals - a.earlyArrivals)[0] : null;

  /* grid: # | Player | PTS | WON | EARLY | PAY */
  const GRID = "24px 1fr 42px 36px 42px 36px";

  return (
    <motion.div
      className="glass-card flex flex-col overflow-hidden cursor-pointer"
      whileHover={{ y: -6, boxShadow: "0 24px 64px rgba(255,215,0,0.1), 0 0 0 1px rgba(255,215,0,0.22)" }}
      transition={{ duration: 0.3 }}
      onClick={onExpand}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,rgba(0,180,255,0.18),rgba(0,100,200,0.08))", border: "1px solid rgba(0,180,255,0.25)" }}
            animate={{ boxShadow: ["0 0 8px rgba(0,180,255,0.2)","0 0 22px rgba(0,180,255,0.45)","0 0 8px rgba(0,180,255,0.2)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Users size={17} style={{ color: "#00b4ff" }} />
          </motion.div>
          <div>
            <h2 className="font-bold text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
              {tx("playerStatistics")}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tx("round")} {rm.rounds.length} · {tx("season")}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          whileHover={{ color: "#00b4ff", background: "rgba(0,180,255,0.06)" }}
          onClick={(e) => { e.stopPropagation(); onExpand?.(); }}
        >
          {tx("viewAll")}
          <ArrowRight size={12} className={isRtl ? "rotate-180" : ""} />
        </motion.button>
      </div>

      {/* Category highlights */}
      <div className="grid grid-cols-3 gap-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        {[
          { label: tx("mostPoints"),       value: byPoints?.totalPoints ?? 0, playerId: byPoints?.playerId ?? "", icon: <Trophy size={14} />, color: "#ffd700" },
          { label: tx("mostWins"),          value: byWins?.wins ?? 0,          playerId: byWins?.playerId   ?? "", icon: <Zap size={14} />,    color: "#22c55e" },
          { label: tx("mostEarlyArrivals"), value: byEarly?.earlyArrivals ?? 0,playerId: byEarly?.playerId  ?? "", icon: <span className="text-sm">⚡</span>, color: "#00b4ff" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center py-4 gap-1"
            style={{ borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <span style={{ color: stat.color }}>{stat.icon}</span>
            <motion.span
              className="text-2xl font-black"
              style={{ color: stat.color }}
              key={stat.value}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {stat.value}
            </motion.span>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{stat.label}</span>
            <span className="text-[10px] text-center truncate max-w-[90px]" style={{ color: "var(--text-secondary)", direction: isRtl ? "rtl" : "ltr" }}>
              {displayName(stat.playerId)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Column headers */}
      <div
        className="grid px-4 py-2 text-[10px] font-bold tracking-widest uppercase"
        style={{ gridTemplateColumns: GRID, color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <span className="text-center">#</span>
        <span className={isRtl ? "text-right" : ""}>{tx("player")}</span>
        <span className="text-right" style={{ color: "#ffd700aa" }}>PTS</span>
        <span className="text-right" style={{ color: "#22c55eaa" }}>{tx("wins")}</span>
        <span className="text-right" style={{ color: "#00b4ffaa" }}>{tx("earlyArrivals")}</span>
        <span className="text-right" style={{ color: "#8b5cf6aa" }}>{tx("sameDayPayments")}</span>
      </div>

      {/* Player rows */}
      <div className="flex-1 overflow-auto">
        <motion.div variants={listVariants} initial="hidden" animate="show">
          {stats.map((stat, idx) => {
            const player = getPlayer(stat.playerId);
            if (!player) return null;
            const photo = rm.photos[stat.playerId];
            const rankClass = idx === 0 ? "row-rank-1" : idx === 1 ? "row-rank-2" : idx === 2 ? "row-rank-3" : "";
            const name = language === "ar" ? player.name : (player.nameEn ?? player.name);
            return (
              <motion.div
                key={stat.playerId}
                className={`grid px-4 py-2.5 items-center text-xs ${rankClass}`}
                style={{
                  gridTemplateColumns: GRID,
                  borderBottom: "1px solid rgba(255,255,255,0.025)",
                  cursor: onPlayerClick ? "pointer" : "default",
                }}
                variants={rowVariants}
                whileHover={{ background: idx < 3 ? undefined : "rgba(255,255,255,0.04)" }}
                onClick={(e) => { e.stopPropagation(); onPlayerClick?.(stat.playerId); }}
              >
                <div className="flex justify-center">
                  <MedalBadge rank={stat.rank} size="sm" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  {photo ? (
                    <img src={photo} alt={name}
                      className="w-7 h-7 rounded-full flex-shrink-0 object-cover"
                      style={{ border: `1px solid ${player.color}55` }} />
                  ) : (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                      style={{ background: `linear-gradient(135deg,${player.color},${player.color}88)` }}>
                      {player.name[0]}
                    </div>
                  )}
                  <span className="font-semibold truncate" style={{ color: "var(--text-primary)", direction: isRtl ? "rtl" : "ltr" }}>
                    {name}
                  </span>
                </div>
                <motion.span
                  className="text-right font-black"
                  style={{ color: "#ffd700" }}
                  key={`pts-${stat.totalPoints}`}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.totalPoints}
                </motion.span>
                <span className="text-right font-medium" style={{ color: "#22c55e" }}>{stat.wins}</span>
                <span className="text-right" style={{ color: "#00b4ff" }}>{stat.earlyArrivals}</span>
                <span className="text-right" style={{ color: "#8b5cf6" }}>{stat.payments}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
