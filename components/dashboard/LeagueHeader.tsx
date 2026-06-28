"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";

const TOTAL_ROUNDS = 18;

export function LeagueHeader() {
  const { language, roundStatus } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const leader       = rm.stats[0];
  const leaderPlayer = leader ? rm.players.find(p => p.id === leader.playerId) : null;
  const leaderName   = leaderPlayer
    ? (language === "ar" ? leaderPlayer.name : (leaderPlayer.nameEn ?? leaderPlayer.name))
    : "—";
  const currentRound = rm.currentRoundNumber;
  const progress     = Math.min((currentRound / TOTAL_ROUNDS) * 100, 100);
  const isActive     = roundStatus === "active";

  return (
    <div className="relative w-full overflow-hidden vt-hdr" style={{ background: "var(--bg-surface)" }}>

      {/* Gold top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg,transparent,var(--gold) 25%,var(--gold-bright) 50%,var(--gold) 75%,transparent)",
      }} />

      {/* Background texture — subtle diagonal */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.025,
        backgroundImage: "repeating-linear-gradient(-45deg,var(--gold) 0,var(--gold) 1px,transparent 0,transparent 50%)",
        backgroundSize: "24px 24px",
        pointerEvents: "none",
      }} />

      <div className="px-5 md:px-8 pt-8 pb-6 relative">

        {/* Season & status row */}
        <div className="flex items-center gap-3 mb-6">
          <span className="section-label">
            {isAr ? "الموسم 2025/26" : "SEASON 2025/26"}
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--red-bright)" }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-[9px] font-black tracking-widest"
                  style={{ color: "var(--red-bright)" }}>
                  LIVE
                </span>
                <Flame size={10} style={{ color: "var(--red-bright)" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main hero row */}
        <div className={`flex items-end gap-6 md:gap-10 ${isAr ? "flex-row-reverse" : ""}`}>

          {/* LEFT: Enormous round number */}
          <div className="flex-shrink-0">
            <div className="section-label mb-2">
              {isAr ? "جولة" : "ROUND"}
            </div>
            <motion.div
              className="rank-numeral"
              style={{
                fontSize: "clamp(5rem, 16vw, 9rem)",
                color: "var(--gold)",
                letterSpacing: "-0.03em",
              }}
              key={currentRound}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
            >
              {String(currentRound).padStart(2, "0")}
            </motion.div>
            <div className="text-xs font-bold mt-1" style={{ color: "var(--text-muted)" }}>
              {isAr ? `من ${TOTAL_ROUNDS}` : `of ${TOTAL_ROUNDS}`}
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{
            width: 1, height: 80, flexShrink: 0,
            background: "linear-gradient(to bottom,transparent,var(--border-strong),transparent)",
          }} />

          {/* RIGHT: Leader info */}
          <div className={`flex-1 min-w-0 ${isAr ? "text-right" : ""}`}>
            <div className="section-label mb-2">
              {isAr ? "يتصدر" : "CURRENTLY LEADING"}
            </div>
            <motion.div
              className="font-black leading-none truncate"
              style={{
                fontSize: "clamp(1.8rem, 5.5vw, 3.8rem)",
                color: "var(--text-primary)",
                direction: isAr ? "rtl" : "ltr",
                letterSpacing: "-0.02em",
              }}
              key={leaderName}
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.18 }}
            >
              {leaderName}
            </motion.div>

            {leader && (
              <motion.div
                className="flex items-baseline gap-2 mt-3"
                style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
              >
                <span className="font-black"
                  style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "var(--gold)" }}>
                  {leader.totalPoints}
                </span>
                <span className="font-bold text-sm" style={{ color: "var(--text-muted)" }}>
                  {isAr ? "نقطة" : "PTS"}
                </span>
                <span style={{
                  width: 1, height: 14, background: "var(--border-strong)", display: "inline-block", margin: "0 4px",
                }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {leader.wins} {isAr ? "فوز" : "wins"}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Season progress bar */}
      <div style={{ height: 3, background: "var(--border-strong)", position: "relative" }}>
        <motion.div
          style={{ height: "100%", background: "var(--gold)", position: "absolute", left: 0, top: 0 }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        />
      </div>

      {/* Live round banner */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="flex items-center justify-between px-5 md:px-8 py-2.5"
            style={{
              background: "rgba(220,38,38,0.06)",
              borderTop: "1px solid var(--red-border)",
            }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs font-black tracking-wider" style={{ color: "var(--red-bright)" }}>
              {isAr ? "⚡ الجولة جارية الآن" : "⚡ ROUND IN PROGRESS"}
            </span>
            <span className="text-xs font-medium" style={{ color: "var(--red-bright)", opacity: 0.7 }}>
              {isAr ? `جولة ${currentRound}` : `Round ${currentRound}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
