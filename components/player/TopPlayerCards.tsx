"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getCumulativeStandings } from "@/lib/calculations";
import { leagueRounds } from "@/lib/league-data";

export function TopPlayerCards() {
  const { language, navigate } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

  const maxRound = leagueRounds[leagueRounds.length - 1]?.number ?? 1;
  const standings = getCumulativeStandings(maxRound);

  const byPoints = [...standings].sort((a, b) => b.totalPoints - a.totalPoints)[0];
  const byWins = [...standings].sort((a, b) => b.wins - a.wins)[0];
  const byEarly = [...standings].sort((a, b) => b.earlyArrivals - a.earlyArrivals)[0];
  const byPayment = [...standings].sort((a, b) => b.sameDayPayments - a.sameDayPayments)[0];

  const cards = [
    { label: tx("mostPoints"),        player: byPoints, stat: `${byPoints?.totalPoints} pts`, color: "#ffd700", icon: "⭐" },
    { label: tx("mostWins"),          player: byWins,   stat: `${byWins?.wins} wins`,         color: "#22c55e", icon: "🏆" },
    { label: tx("mostEarlyArrivals"), player: byEarly,  stat: `${byEarly?.earlyArrivals}×`,   color: "#00b4ff", icon: "⚡" },
    { label: tx("mostPayments"),      player: byPayment,stat: `${byPayment?.sameDayPayments}×`,color: "#8b5cf6", icon: "💰" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        if (!card.player) return null;
        return (
          <motion.div
            key={card.label}
            className="glass-card p-4 flex flex-col gap-2 cursor-pointer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3, boxShadow: `0 12px 32px ${card.color}22` }}
            onClick={() => navigate("player-profile", { playerId: card.player.player.id })}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">{card.icon}</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                style={{ background: `linear-gradient(135deg,${card.player.player.color}cc,${card.player.player.color}55)` }}
              >
                {card.player.player.initials}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold mb-0.5" style={{ color: card.color }}>
                {card.label}
              </p>
              <p className="text-xs font-black leading-tight" style={{ color: "var(--text-primary)" }}>
                {language === "ar" ? card.player.player.nameAr : card.player.player.name}
              </p>
              <p className="text-[11px] font-semibold mt-0.5" style={{ color: card.color }}>
                {card.stat}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
