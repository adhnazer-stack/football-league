"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";

const rowIn: Variants = {
  hidden: { opacity: 0, x: 12 },
  show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 360, damping: 28 } },
};
const listIn: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
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
  const GRID = "28px 1fr 44px 36px 36px 34px";

  return (
    <motion.div
      className="elite-card elite-card-blue flex flex-col overflow-hidden cursor-pointer"
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 380, damping: 24 } }}
      whileTap={{ scale: 0.985, transition: { type: "spring", stiffness: 500, damping: 24 } }}
      onClick={onExpand}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--blue-subtle)",
            border: "1px solid var(--blue-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>
            📊
          </div>
          <div>
            <h2 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
              {tx("playerStatistics")}
            </h2>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {rm.rounds.length} {isRtl ? "جولة" : "rounds"} · {tx("season")}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg"
          style={{
            color: "var(--text-muted)",
            background: "var(--blue-subtle)",
            border: "1px solid var(--blue-border)",
          }}
          whileHover={{ color: "var(--blue-bright)" }}
          whileTap={{ scale: 0.95 }}
          onClick={e => { e.stopPropagation(); onExpand?.(); }}
        >
          {tx("viewAll")}
          <ArrowRight size={11} className={isRtl ? "rotate-180" : ""} />
        </motion.button>
      </div>

      {/* Column headers */}
      <div className="grid px-4 py-2 text-[9px] font-black tracking-[0.28em] uppercase"
        style={{
          gridTemplateColumns: GRID,
          color: "var(--text-muted)",
          borderBottom: "1px solid var(--border-subtle)",
        }}>
        <span className="text-center">#</span>
        <span className={isRtl ? "text-right" : ""}>{tx("player")}</span>
        <span className="text-right" style={{ color: "rgba(201,168,76,0.7)" }}>PTS</span>
        <span className="text-right" style={{ color: "var(--green-bright)", opacity: 0.7 }}>W</span>
        <span className="text-right" style={{ color: "var(--blue-bright)", opacity: 0.7 }}>⚡</span>
        <span className="text-right" style={{ color: "var(--violet-bright)", opacity: 0.7 }}>💰</span>
      </div>

      {/* Player rows */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        <motion.div variants={listIn} initial="hidden" animate="show">
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
                  borderBottom: "1px solid var(--border-subtle)",
                  cursor: onPlayerClick ? "pointer" : "default",
                  position: "relative",
                }}
                variants={rowIn}
                whileHover={{ background: idx < 3 ? undefined : "var(--bg-hover)" }}
                whileTap={{ scale: 0.985 }}
                onClick={e => { e.stopPropagation(); onPlayerClick?.(stat.playerId); }}
              >
                <div className="flex justify-center">
                  <MedalBadge rank={stat.rank} size="sm" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  {photo ? (
                    <img src={photo} alt={name}
                      className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                      style={{ border: `1px solid ${player.color}44` }} />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black text-white"
                      style={{ background: `linear-gradient(135deg,${player.color},${player.color}99)` }}>
                      {player.name[0]}
                    </div>
                  )}
                  <span className="font-semibold truncate"
                    style={{ color: "var(--text-primary)", direction: isRtl ? "rtl" : "ltr" }}>
                    {name}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`pts-${stat.totalPoints}`}
                    className="text-right font-black"
                    style={{ color: "var(--gold)" }}
                    initial={{ scale: 1.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 440, damping: 22 }}
                  >{stat.totalPoints}</motion.span>
                </AnimatePresence>
                <span className="text-right font-bold" style={{ color: "var(--green-bright)" }}>{stat.wins}</span>
                <span className="text-right" style={{ color: "var(--blue-bright)" }}>{stat.earlyArrivals}</span>
                <span className="text-right" style={{ color: "var(--violet-bright)" }}>{stat.payments}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-2.5 flex-wrap"
        style={{ borderTop: "1px solid var(--border-subtle)", fontSize: 10, color: "var(--text-muted)" }}>
        <span><span style={{ color: "var(--gold)" }}>W</span>=3pts</span>
        <span><span style={{ color: "var(--blue-bright)" }}>⚡</span>=+2pts</span>
        <span><span style={{ color: "var(--violet-bright)" }}>💰</span>=+1pt</span>
      </div>
    </motion.div>
  );
}
