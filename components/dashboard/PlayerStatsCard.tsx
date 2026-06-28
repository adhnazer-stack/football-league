"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";

const RANK_COLORS = [
  "var(--gold)",           // 1st
  "#94A3B8",               // 2nd
  "#b46e32",               // 3rd
];

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 28, delay: i * 0.045 },
  }),
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
  const maxPts = stats[0]?.totalPoints ?? 1;

  return (
    <div className="elite-card flex flex-col overflow-hidden" style={{ height: "100%" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h2 className="font-black text-xs tracking-[0.22em] uppercase"
            style={{ color: "var(--gold)" }}>
            {tx("playerStatistics")}
          </h2>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {rm.rounds.length} {isRtl ? "جولة" : "rounds"} · {tx("season")}
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
          onClick={onExpand}
        >
          {tx("viewAll")}
          {isRtl ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
        </button>
      </div>

      {/* ── Table head ── */}
      <div className="grid text-[8px] font-black tracking-[0.3em] uppercase px-5 py-2"
        style={{
          gridTemplateColumns: "52px 1fr 56px 28px 28px 28px",
          color: "var(--text-muted)",
          borderBottom: "1px solid var(--border-subtle)",
          direction: isRtl ? "rtl" : "ltr",
        }}>
        <span>#</span>
        <span>{tx("player")}</span>
        <span className="text-right" style={{ color: "rgba(201,168,76,0.65)" }}>PTS</span>
        <span className="text-center" style={{ color: "rgba(34,197,94,0.65)" }}>W</span>
        <span className="text-center" style={{ color: "rgba(96,165,250,0.65)" }}>⚡</span>
        <span className="text-center" style={{ color: "rgba(167,139,250,0.65)" }}>💰</span>
      </div>

      {/* ── Rows ── */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        <AnimatePresence>
          {stats.map((stat, idx) => {
            const player = getPlayer(stat.playerId);
            if (!player) return null;
            const photo = rm.photos[stat.playerId];
            const name  = language === "ar" ? player.name : (player.nameEn ?? player.name);
            const pct   = maxPts > 0 ? (stat.totalPoints / maxPts) * 100 : 0;
            const rc    = RANK_COLORS[idx] ?? "var(--text-muted)";
            const isTop = idx < 3;

            return (
              <motion.div
                key={stat.playerId}
                custom={idx}
                variants={rowVariants}
                initial="hidden"
                animate="show"
                className="standings-row"
                style={{
                  gridTemplateColumns: "52px 1fr 56px 28px 28px 28px",
                  direction: isRtl ? "rtl" : "ltr",
                  background: idx === 0 ? "rgba(201,168,76,0.05)" : undefined,
                  cursor: onPlayerClick ? "pointer" : "default",
                  display: "grid",
                }}
                onClick={() => onPlayerClick?.(stat.playerId)}
              >
                {/* Rank */}
                <span className="rank-numeral"
                  style={{
                    fontSize: isTop ? "1.8rem" : "1.2rem",
                    color: rc,
                    opacity: isTop ? 1 : 0.4,
                  }}>
                  {stat.rank}
                </span>

                {/* Player */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {photo ? (
                    <img src={photo} alt={name}
                      style={{
                        width: 36, height: 36, borderRadius: "50%",
                        objectFit: "cover", flexShrink: 0,
                        border: `1.5px solid ${player.color}44`,
                      }} />
                  ) : (
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `linear-gradient(135deg,${player.color},${player.color}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0,
                    }}>
                      {player.name[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-[12px] truncate"
                      style={{ color: "var(--text-primary)", direction: isRtl ? "rtl" : "ltr" }}>
                      {name}
                    </div>
                    {/* Points bar */}
                    <div style={{
                      height: 2, width: "100%", maxWidth: 80,
                      background: "var(--border-strong)", borderRadius: 4, marginTop: 4, overflow: "hidden",
                    }}>
                      <motion.div
                        style={{ height: "100%", background: rc, borderRadius: 4 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 + idx * 0.04 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Points */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`pts-${stat.totalPoints}`}
                    className="text-right font-black"
                    style={{ fontSize: "1.1rem", color: "var(--gold)", letterSpacing: "-0.02em" }}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    {stat.totalPoints}
                  </motion.span>
                </AnimatePresence>

                {/* W */}
                <span className="text-center text-xs font-bold" style={{ color: "var(--green-bright)" }}>
                  {stat.wins}
                </span>

                {/* Early */}
                <span className="text-center text-xs" style={{ color: "var(--blue-bright)" }}>
                  {stat.earlyArrivals}
                </span>

                {/* Payment */}
                <span className="text-center text-xs" style={{ color: "var(--violet-bright)" }}>
                  {stat.payments}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 px-5 py-2.5"
        style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          <span style={{ color: "var(--gold)" }}>PTS</span> · W=3 ⚡=+2 💰=+1
        </span>
      </div>
    </div>
  );
}
