"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { TopPlayerCards } from "@/components/player/TopPlayerCards";
import { LeagueTable } from "@/components/standings/LeagueTable";

export function PlayersPage() {
  const { language } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

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
          <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#00b4ff,#0066cc)" }} />
          <h1 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-primary)" }}>
            {tx("playerStatistics")}
          </h1>
        </div>
      </div>

      {/* Top player category cards */}
      <div className="mb-6">
        <TopPlayerCards />
      </div>

      {/* Full league table (also shows here for quick access) */}
      <LeagueTable />
    </motion.section>
  );
}
