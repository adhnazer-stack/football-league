"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { roundsData, currentRoundNumber, totalRounds } from "@/lib/data";
import { CheckCircle2, Clock, Play, Lock } from "lucide-react";

export function RoundsPage() {
  const { language, roundStatus, startRound, endRound, navigate } = useApp();
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
          <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#22c55e,#15803d)" }} />
          <h1 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-primary)" }}>
            {tx("rounds")} — {tx("season")}
          </h1>
        </div>
      </div>

      {/* Quick link to league round points */}
      <motion.button
        className="glass-card w-full px-5 py-3 flex items-center justify-between mb-4"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ y: -2 }}
        onClick={() => navigate("round-points")}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🏅</span>
          <div className="text-left">
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{tx("roundPoints")}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{language === "ar" ? "نقاط اللاعبين لكل جولة" : "League player points per round"}</p>
          </div>
        </div>
        <span style={{ color: "#ffd700" }}>→</span>
      </motion.button>

      {/* Season progress */}
      <motion.div
        className="glass-card p-5 mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: "var(--text-muted)" }}>
              Season Progress
            </p>
            <p className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
              {tx("round")} {currentRoundNumber}
              <span className="text-sm font-normal ml-2" style={{ color: "var(--text-muted)" }}>/ {totalRounds}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="text-3xl font-black"
              style={{ color: "#ffd700" }}
            >
              {Math.round((currentRoundNumber / totalRounds) * 100)}%
            </span>
            {/* Round action button */}
            {roundStatus === "idle" && (
              <motion.button
                onClick={startRound}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
                style={{ background: "#ffffff", color: "#0a0f1e" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play size={13} fill="#0a0f1e" />
                {tx("startRound")} {currentRoundNumber}
              </motion.button>
            )}
            {roundStatus === "active" && (
              <motion.button
                onClick={endRound}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Lock size={13} />
                {tx("endRound")} {currentRoundNumber}
              </motion.button>
            )}
            {roundStatus === "ended" && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold" style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <Lock size={13} />
                {tx("roundLocked")}
              </div>
            )}
          </div>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 6, background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#22c55e,#00b4ff,#ffd700)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentRoundNumber / totalRounds) * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
          <span>{tx("round")} 1</span>
          <span>{tx("round")} {totalRounds}</span>
        </div>
      </motion.div>

      {/* Rounds list */}
      <div className="grid gap-4">
        {roundsData.map((round, ri) => (
          <motion.div
            key={round.number}
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ri * 0.1 }}
          >
            {/* Round header */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{
                background:
                  round.status === "active" ? "rgba(34,197,94,0.07)"
                  : round.status === "completed" ? "rgba(255,255,255,0.03)"
                  : "transparent",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{
                    background: round.status === "active" ? "rgba(34,197,94,0.2)" : round.status === "completed" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                    color: round.status === "active" ? "#22c55e" : "var(--text-muted)",
                    border: `1px solid ${round.status === "active" ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  {round.number}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {tx("round")} {round.number}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {round.matches.length} matches
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {round.status === "active" && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#22c55e" }}>
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#22c55e" }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {tx("roundActive")}
                  </span>
                )}
                {round.status === "completed" && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <CheckCircle2 size={12} />
                    {tx("completed")}
                  </span>
                )}
                {round.status === "upcoming" && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={12} />
                    {tx("upcoming")}
                  </span>
                )}
              </div>
            </div>

            {/* Matches */}
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {round.matches.map((match) => {
                const home = language === "ar" ? match.homeTeamAr : match.homeTeam;
                const away = language === "ar" ? match.awayTeamAr : match.awayTeam;
                const isCompleted = match.status === "completed";
                const homeWin = isCompleted && match.homeScore! > match.awayScore!;
                const awayWin = isCompleted && match.awayScore! > match.homeScore!;

                return (
                  <div
                    key={match.id}
                    className="flex items-center px-5 py-3 gap-3"
                  >
                    {/* Home */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span
                        className="text-sm font-semibold text-right"
                        style={{ color: homeWin ? "var(--text-primary)" : isCompleted ? "var(--text-secondary)" : "var(--text-primary)" }}
                      >
                        {home.split(" ")[0]}
                      </span>
                      <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ background: match.homeColor }} />
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 w-20 flex items-center justify-center">
                      {isCompleted ? (
                        <div
                          className="px-3 py-1 rounded-lg text-sm font-black tracking-wider text-center"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-primary)", minWidth: 64 }}
                        >
                          {match.homeScore} – {match.awayScore}
                        </div>
                      ) : (
                        <span className="text-xs tracking-[0.2em] font-bold" style={{ color: "var(--text-muted)" }}>
                          VS
                        </span>
                      )}
                    </div>

                    {/* Away */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ background: match.awayColor }} />
                      <span
                        className="text-sm font-semibold"
                        style={{ color: awayWin ? "var(--text-primary)" : isCompleted ? "var(--text-secondary)" : "var(--text-primary)" }}
                      >
                        {away.split(" ")[0]}
                      </span>
                    </div>

                    {/* Result indicator */}
                    {isCompleted && (
                      <CheckCircle2 size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                    )}
                    {!isCompleted && (
                      <Clock size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
