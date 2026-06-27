"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Zap, CreditCard, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";
import { t, type Language } from "@/lib/i18n";

interface FullStatsModalProps {
  open: boolean;
  onClose: () => void;
  language: Language;
  onPlayerClick?: (id: string) => void;
}

export function FullStatsModal({ open, onClose, language, onPlayerClick }: FullStatsModalProps) {
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";
  const rm = useRM();

  const stats     = rm.stats;
  const getPlayer = (id: string) => rm.players.find((p) => p.id === id);

  const byPoints = stats[0] ?? null;
  const byWins   = stats.length ? [...stats].sort((a, b) => b.wins - a.wins)[0] : null;
  const byEarly  = stats.length ? [...stats].sort((a, b) => b.earlyArrivals - a.earlyArrivals)[0] : null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 top-8 bottom-8 z-50 flex flex-col rounded-2xl overflow-hidden md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.1)",
            }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
              dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,rgba(0,180,255,0.18),rgba(0,100,200,0.08))", border: "1px solid rgba(0,180,255,0.25)" }}>
                  <Trophy size={17} style={{ color: "#00b4ff" }} />
                </div>
                <div>
                  <h2 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    {tx("playerStatistics")}
                  </h2>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {tx("round")} {rm.rounds.length} · {stats.length} {isRtl ? "لاعب" : "players"}
                  </p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Top 3 highlight bar */}
            <div className="grid grid-cols-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {[
                { label: tx("mostPoints"),       value: byPoints?.totalPoints ?? 0, name: byPoints ? (getPlayer(byPoints.playerId)?.name ?? "—").split(" ")[0] : "—", icon: <Trophy size={13} />, color: "#ffd700" },
                { label: tx("mostWins"),          value: byWins?.wins ?? 0,          name: byWins   ? (getPlayer(byWins.playerId)?.name   ?? "—").split(" ")[0] : "—", icon: <Zap size={13} />,    color: "#22c55e" },
                { label: tx("mostEarlyArrivals"), value: byEarly?.earlyArrivals ?? 0,name: byEarly  ? (getPlayer(byEarly.playerId)?.name  ?? "—").split(" ")[0] : "—", icon: <span className="text-xs">⚡</span>, color: "#00b4ff" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center py-3 gap-0.5"
                  style={{ borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-xl font-black" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                  <span className="text-[9px]" style={{ color: "var(--text-secondary)", direction: "rtl" }}>{s.name}</span>
                </div>
              ))}
            </div>

            {/* Column headers */}
            <div className="grid px-4 py-2 text-[10px] font-semibold tracking-wider uppercase flex-shrink-0"
              style={{ gridTemplateColumns: "32px 1fr 52px 40px 40px 40px 36px", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}
              dir={isRtl ? "rtl" : "ltr"}>
              <span className="text-center">#</span>
              <span>{tx("player")}</span>
              <span className="text-right">{tx("points")}</span>
              <span className="text-right">{tx("wins")}</span>
              <span className="text-right">{isRtl ? "مبكر" : "Early"}</span>
              <span className="text-right">{isRtl ? "دفع" : "Pay"}</span>
              <span className="text-right">{isRtl ? "حركة" : "±"}</span>
            </div>

            {/* Scrollable rows */}
            <div className="flex-1 overflow-y-auto">
              {stats.map((stat, idx) => {
                const player = getPlayer(stat.playerId);
                if (!player) return null;
                const photo    = rm.photos[stat.playerId];
                const movement = stat.movement ?? 0;
                const MovIcon  = movement > 0
                  ? <TrendingUp size={11} style={{ color: "#22c55e" }} />
                  : movement < 0
                    ? <TrendingDown size={11} style={{ color: "#ef4444" }} />
                    : <Minus size={11} style={{ color: "var(--text-muted)" }} />;

                return (
                  <motion.div
                    key={stat.playerId}
                    className={`grid px-4 py-3 items-center text-xs ${idx===0?"row-rank-1":idx===1?"row-rank-2":idx===2?"row-rank-3":""}`}
                    style={{
                      gridTemplateColumns: "32px 1fr 52px 40px 40px 40px 36px",
                      borderBottom: "1px solid rgba(255,255,255,0.025)",
                      cursor: onPlayerClick ? "pointer" : "default",
                    }}
                    dir={isRtl ? "rtl" : "ltr"}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.025 }}
                    whileHover={{ background: idx < 3 ? undefined : "rgba(255,255,255,0.04)" }}
                    onClick={() => onPlayerClick?.(stat.playerId)}
                  >
                    <div className="flex justify-center"><MedalBadge rank={stat.rank} size="sm" /></div>
                    <div className="flex items-center gap-2 min-w-0">
                      {photo ? (
                        <img src={photo} alt={player.name}
                          className="w-7 h-7 rounded-full flex-shrink-0 object-cover"
                          style={{ border: `1px solid ${player.color}55` }} />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                          style={{ background: `linear-gradient(135deg,${player.color},${player.color}88)` }}>
                          {player.name[0]}
                        </div>
                      )}
                      <span className="font-semibold truncate" style={{ color: "var(--text-primary)", direction: "rtl" }}>
                        {player.name}
                      </span>
                    </div>
                    <span className="text-right font-black" style={{ color: "#ffd700" }}>{stat.totalPoints}</span>
                    <span className="text-right font-medium" style={{ color: "#22c55e" }}>{stat.wins}</span>
                    <span className="text-right" style={{ color: "#00b4ff" }}>{stat.earlyArrivals}</span>
                    <span className="text-right" style={{ color: "#8b5cf6" }}>{stat.payments}</span>
                    <div className="flex justify-end items-center">{MovIcon}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer scoring guide */}
            <div className="px-5 py-3 flex items-center gap-4 flex-shrink-0 flex-wrap"
              style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {[
                { icon: <Trophy size={11} />,     color: "#22c55e", label: isRtl ? "فوز +3"  : "Win +3"   },
                { icon: <Zap size={11} />,         color: "#00b4ff", label: isRtl ? "مبكر +2" : "Early +2" },
                { icon: <CreditCard size={11} />,  color: "#8b5cf6", label: isRtl ? "دفع +1"  : "Pay +1"   },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
