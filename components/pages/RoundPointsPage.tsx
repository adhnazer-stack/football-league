"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getRoundStandings } from "@/lib/calculations";
import { leagueRounds } from "@/lib/league-data";
import { MedalBadge } from "@/components/standings/MedalBadge";
import { RoundNavigation } from "@/components/standings/RoundNavigation";

export function RoundPointsPage() {
  const { language, navigate } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

  const maxRound = leagueRounds[leagueRounds.length - 1]?.number ?? 1;
  const [viewRound, setViewRound] = useState(maxRound);

  const rows = getRoundStandings(viewRound);
  const roundInfo = leagueRounds.find((r) => r.number === viewRound);

  return (
    <motion.section
      className="flex-1 px-4 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#f97316,#ea580c)" }} />
          <div>
            <h1 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-primary)" }}>
              {tx("roundPoints")}
            </h1>
            {roundInfo?.date && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{roundInfo.date}</p>
            )}
          </div>
        </div>
        <RoundNavigation selectedRound={viewRound} onChange={setViewRound} maxRound={maxRound} />
      </div>

      {/* Round label badge */}
      {roundInfo?.label && (
        <div className="mb-4">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "rgba(255,215,0,0.15)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.3)" }}
          >
            ✦ {roundInfo.label}
          </span>
        </div>
      )}

      {/* Per-round standings */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewRound}
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)", width: "48px" }}>#</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>{tx("player")}</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>{tx("points")}</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>{tx("wins")}</th>
                <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>{tx("earlyArrivals")}</th>
                <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>{tx("sameDayPayments")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.player.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="cursor-pointer"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: row.rank === 1 ? "rgba(255,215,0,0.05)" : "transparent",
                  }}
                  onClick={() => navigate("player-profile", { playerId: row.player.id })}
                >
                  <td className="px-4 py-3 text-center">
                    <MedalBadge rank={row.rank} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                        style={{ background: `linear-gradient(135deg,${row.player.color}cc,${row.player.color}66)` }}
                      >
                        {row.player.initials}
                      </div>
                      <span className="font-semibold text-xs" style={{ color: "var(--text-primary)" }}>
                        {language === "ar" ? row.player.nameAr : row.player.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-black" style={{ color: "#ffd700" }}>{row.roundPoints}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>{row.wins}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.earlyArrival
                      ? <span title="Early arrival" style={{ color: "#00b4ff" }}>⚡</span>
                      : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.sameDayPayment
                      ? <span title="Same day payment" style={{ color: "#8b5cf6" }}>💰</span>
                      : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>

      {/* Scoring guide */}
      <div className="mt-4 glass-card px-4 py-3 flex flex-wrap gap-4">
        {[
          { label: language === "ar" ? "فوز" : "Win", value: "3 pts", color: "#22c55e" },
          { label: language === "ar" ? "حضور مبكر" : "Early Arrival", value: "+1 pt", color: "#00b4ff" },
          { label: language === "ar" ? "دفع في اليوم" : "Same Day Pay", value: "+1 pt", color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span style={{ color: "var(--text-muted)" }}>{s.label}</span>
            <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
