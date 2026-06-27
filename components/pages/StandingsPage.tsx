"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { LeagueTable } from "@/components/standings/LeagueTable";
import { getCumulativeStandings } from "@/lib/calculations";
import { leagueRounds } from "@/lib/league-data";

export function StandingsPage() {
  const { language } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

  const maxRound = leagueRounds[leagueRounds.length - 1]?.number ?? 1;
  const standings = getCumulativeStandings(maxRound);
  const leader = standings[0];

  return (
    <motion.section
      className="flex-1 px-4 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#3b82f6,#1e40af)" }} />
          <h1 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-primary)" }}>
            {tx("currentLeagueStandings")}
          </h1>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: language === "ar" ? "اللاعبون" : "Players",      value: standings.length,   color: "#3b82f6" },
          { label: language === "ar" ? "الجولات" : "Rounds Played",  value: leagueRounds.length, color: "#22c55e" },
          { label: language === "ar" ? "المتصدر" : "Leader",         value: leader ? (language === "ar" ? leader.player.nameAr : leader.player.name).split(" ")[0] : "—", color: "#ffd700" },
          { label: language === "ar" ? "أعلى نقاط" : "Top Points",   value: leader?.totalPoints ?? 0, color: "#c9963c" },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="glass-card px-5 py-4 flex flex-col gap-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="text-2xl font-black" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      <LeagueTable />
    </motion.section>
  );
}
