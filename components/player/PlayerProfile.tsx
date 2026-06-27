"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getPlayerProfile } from "@/lib/calculations";
import { MedalBadge } from "@/components/standings/MedalBadge";
import { PlayerCharts } from "./PlayerCharts";

interface PlayerProfileProps {
  playerId: string;
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const { language, navigate } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

  const profile = getPlayerProfile(playerId);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--text-muted)" }}>Player not found.</p>
      </div>
    );
  }

  const { player, currentRank, totalPoints, totalWins, totalEarlyArrivals, totalSameDayPayments, currentStreak, bestRound, roundHistory } = profile;

  const statCards = [
    { label: tx("totalPoints"),    value: totalPoints,          color: "#ffd700", icon: "⭐" },
    { label: tx("totalWins"),      value: totalWins,            color: "#22c55e", icon: "🏆" },
    { label: tx("earlyArrivals"),  value: totalEarlyArrivals,   color: "#00b4ff", icon: "⚡" },
    { label: tx("sameDayPayments"),value: totalSameDayPayments, color: "#8b5cf6", icon: "💰" },
    { label: tx("currentStreak"),  value: `${currentStreak}×`,  color: "#f97316", icon: "🔥" },
    { label: tx("bestRound"),      value: `R${bestRound}`,      color: "#ec4899", icon: "🎯" },
  ];

  return (
    <motion.div
      className="flex-1 px-4 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("players")}
        className="flex items-center gap-2 mb-5 text-sm font-semibold transition-opacity hover:opacity-70"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={16} />
        {tx("backToPlayers")}
      </button>

      {/* Hero card */}
      <div className="glass-card p-6 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg,${player.color},${player.color}88)`, boxShadow: `0 8px 24px ${player.color}44` }}
        >
          {player.initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black mb-0.5" style={{ color: "var(--text-primary)" }}>
            {language === "ar" ? player.nameAr : player.name}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <MedalBadge rank={currentRank} size="md" />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {currentRank <= 3 ? "" : `#${currentRank} · `}{totalPoints} {tx("totalPoints")}
            </span>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-black" style={{ color: "#ffd700" }}>{totalPoints}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>{tx("totalPoints")}</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card p-3 flex flex-col items-center gap-1 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-lg">{s.icon}</span>
            <span className="text-lg font-black" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[9px] uppercase tracking-wider leading-tight" style={{ color: "var(--text-muted)" }}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-4">
        <PlayerCharts profile={profile} />
      </div>

      {/* Round by round breakdown */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-black mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {tx("roundBreakdown")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[380px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {[tx("round"), tx("points"), tx("wins"), tx("earlyArrivals"), tx("sameDayPayments"), tx("rank")].map((h) => (
                  <th key={h} className="px-3 py-2 text-right font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roundHistory.map((r, i) => (
                <motion.tr
                  key={r.round}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="px-3 py-2 text-right font-semibold" style={{ color: "var(--text-secondary)" }}>R{r.round}</td>
                  <td className="px-3 py-2 text-right font-black" style={{ color: "#ffd700" }}>{r.points}</td>
                  <td className="px-3 py-2 text-right" style={{ color: "#22c55e" }}>{r.wins}</td>
                  <td className="px-3 py-2 text-right" style={{ color: r.earlyArrival ? "#00b4ff" : "var(--text-muted)" }}>
                    {r.earlyArrival ? "✓" : "—"}
                  </td>
                  <td className="px-3 py-2 text-right" style={{ color: r.sameDayPayment ? "#8b5cf6" : "var(--text-muted)" }}>
                    {r.sameDayPayment ? "✓" : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <MedalBadge rank={r.rank} size="sm" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
