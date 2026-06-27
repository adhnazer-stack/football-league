"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getLeaderboards } from "@/lib/calculations";
import { MedalBadge } from "@/components/standings/MedalBadge";

export function LeaderboardsPage() {
  const { language, navigate } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

  const boards = getLeaderboards();
  const [activeBoard, setActiveBoard] = useState(boards[0]?.key ?? "");

  const current = boards.find((b) => b.key === activeBoard);

  const categoryColors: Record<string, string> = {
    totalPoints:     "#ffd700",
    totalWins:       "#22c55e",
    earlyArrivals:   "#00b4ff",
    sameDayPayments: "#8b5cf6",
    winStreak:       "#f97316",
    consistency:     "#ec4899",
    perfectRounds:   "#14b8a6",
    bonusPoints:     "#a78bfa",
    avgPointsPerRound: "#fb923c",
  };

  return (
    <motion.section
      className="flex-1 px-4 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#ffd700,#c9963c)" }} />
          <h1 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-primary)" }}>
            {tx("leaderboards")}
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Category selector */}
        <div className="lg:w-52 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {boards.map((board) => {
            const color = categoryColors[board.key] ?? "#ffd700";
            const isActive = board.key === activeBoard;
            return (
              <button
                key={board.key}
                onClick={() => setActiveBoard(board.key)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-all text-xs font-semibold flex-shrink-0"
                style={{
                  background: isActive ? `${color}22` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? color + "55" : "rgba(255,255,255,0.07)"}`,
                  color: isActive ? color : "var(--text-secondary)",
                }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                {tx(board.labelKey as Parameters<typeof t>[1])}
              </button>
            );
          })}
        </div>

        {/* Leaderboard table */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.key}
                className="glass-card p-5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: categoryColors[current.key] ?? "#ffd700" }}
                  />
                  <h2 className="text-base font-black" style={{ color: "var(--text-primary)" }}>
                    {tx(current.labelKey as Parameters<typeof t>[1])}
                  </h2>
                </div>

                <div className="space-y-1.5">
                  {current.entries.map((entry, i) => {
                    const color = categoryColors[current.key] ?? "#ffd700";
                    const isTop3 = entry.rank <= 3;
                    return (
                      <motion.div
                        key={entry.player.id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                        style={{
                          background: isTop3 ? `${color}0d` : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isTop3 ? color + "22" : "rgba(255,255,255,0.04)"}`,
                        }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        onClick={() => navigate("player-profile", { playerId: entry.player.id })}
                      >
                        {/* Rank */}
                        <div className="w-8 text-center flex-shrink-0">
                          <MedalBadge rank={entry.rank} size="sm" />
                        </div>

                        {/* Avatar */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg,${entry.player.color}cc,${entry.player.color}55)` }}
                        >
                          {entry.player.initials}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold truncate block" style={{ color: "var(--text-primary)" }}>
                            {language === "ar" ? entry.player.nameAr : entry.player.name}
                          </span>
                        </div>

                        {/* Value */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-base font-black" style={{ color }}>
                            {entry.value}
                          </span>
                          <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>
                            {current.unit}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
