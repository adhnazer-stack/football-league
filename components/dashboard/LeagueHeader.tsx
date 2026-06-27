"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Flame } from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import { NumberTicker } from "@/components/magicui/number-ticker";

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
  const totalPlayers = rm.players.length;
  const progress     = Math.min((currentRound / TOTAL_ROUNDS) * 100, 100);
  const isActive     = roundStatus === "active";

  return (
    <motion.div
      className="elite-card elite-card-gold mb-5 vt-hdr"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {/* Title row */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "var(--gold-subtle)",
            border: "1px solid var(--gold-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>
            ⚽
          </div>
          <div>
            <h1 className="font-black text-base leading-tight"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              {isAr ? "بطولة الدوري" : "League Championship"}
            </h1>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {isAr ? "الموسم 2025/26" : "Season 2025/26"}
            </p>
          </div>
        </div>

        {/* Round badge */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{ background: "var(--red-subtle)", border: "1px solid var(--red-border)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full live-dot" />
                <span className="text-[10px] font-black" style={{ color: "var(--red-bright)", letterSpacing: "0.1em" }}>
                  LIVE
                </span>
                <Flame size={10} style={{ color: "var(--red-bright)" }} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="font-black text-2xl leading-none" style={{ color: "var(--gold)" }}>
                {currentRound}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>/ {TOTAL_ROUNDS}</span>
            </div>
            <p className="text-[9px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
              {isAr ? "جولة" : "Round"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3"
        style={{ borderBottom: "1px solid var(--border)" }}>
        {/* Leader */}
        <div className="px-5 py-3"
          style={{ borderRight: "1px solid var(--border)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy size={11} style={{ color: "var(--gold)" }} />
            <p className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}>
              {isAr ? "المتصدر" : "Leader"}
            </p>
          </div>
          <p className="font-black text-sm truncate leading-tight"
            style={{ color: "var(--text-primary)", direction: isAr ? "rtl" : "ltr" }}>
            {leaderName.split(" ")[0]}
          </p>
          {leader && (
            <p className="text-xs font-bold mt-0.5" style={{ color: "var(--gold)" }}>
              <NumberTicker value={leader.totalPoints} className="font-black" />
              <span className="font-medium text-[10px] ml-0.5"
                style={{ color: "var(--text-muted)" }}>
                {isAr ? " نقطة" : " pts"}
              </span>
            </p>
          )}
        </div>

        {/* Season progress */}
        <div className="px-5 py-3" style={{ borderRight: "1px solid var(--border)" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2"
            style={{ color: "var(--text-muted)" }}>
            {isAr ? "التقدم" : "Progress"}
          </p>
          <div className="h-1.5 rounded-full overflow-hidden mb-1.5"
            style={{ background: "var(--border-strong)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: "var(--gold)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
            />
          </div>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {currentRound}/{TOTAL_ROUNDS} {isAr ? "جولة" : "rounds"}
          </p>
        </div>

        {/* Players */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={11} style={{ color: "var(--blue-bright)" }} />
            <p className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}>
              {isAr ? "لاعبون" : "Players"}
            </p>
          </div>
          <p className="font-black text-2xl leading-none"
            style={{ color: "var(--text-primary)" }}>
            <NumberTicker value={totalPlayers} />
          </p>
        </div>
      </div>

      {/* Active round banner */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="flex items-center justify-between px-5 py-2.5"
            style={{ background: "var(--red-subtle)" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full live-dot" />
              <span className="text-[11px] font-black"
                style={{ color: "var(--red-bright)", letterSpacing: "0.08em" }}>
                {isAr ? "الجولة نشطة الآن" : "ROUND IN PROGRESS"}
              </span>
            </div>
            <span className="text-[10px]" style={{ color: "var(--red-bright)", opacity: 0.7 }}>
              {isAr ? `جولة ${currentRound}` : `Round ${currentRound}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
