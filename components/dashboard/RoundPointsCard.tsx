"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Calendar, Lock, Clock, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";

const TOTAL_ROUNDS = 18;

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export function RoundPointsCard({ onExpand }: { onExpand?: () => void }) {
  const { language, roundStatus } = useApp();
  const rm = useRM();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const currentRound = rm.currentRoundNumber;

  /* Calculate each player's points in the CURRENT round from live selections */
  const rows = rm.players
    .map((player) => {
      const isWinner       = rm.selections.winners.includes(player.id);
      const earlyArrival   = rm.selections.earlyArrivals.includes(player.id);
      const sameDayPayment = rm.selections.payments.includes(player.id);
      const roundPoints    = (isWinner ? 3 : 0) + (earlyArrival ? 2 : 0) + (sameDayPayment ? 1 : 0);
      return { player, roundPoints, isWinner, earlyArrival, sameDayPayment };
    })
    .sort((a, b) => b.roundPoints - a.roundPoints);

  const hasAnyPoints = rows.some((r) => r.roundPoints > 0);

  return (
    <motion.div
      className="glass-card flex flex-col overflow-hidden cursor-pointer"
      whileHover={{ y: -6, boxShadow: "0 24px 64px rgba(0,255,100,0.08), 0 0 0 1px rgba(255,215,0,0.22)" }}
      transition={{ duration: 0.3 }}
      onClick={onExpand}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.18),rgba(0,150,50,0.08))", border: "1px solid rgba(34,197,94,0.25)" }}
            animate={{ boxShadow: ["0 0 8px rgba(34,197,94,0.2)","0 0 22px rgba(34,197,94,0.45)","0 0 8px rgba(34,197,94,0.2)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Calendar size={17} style={{ color: "#22c55e" }} />
          </motion.div>
          <div>
            <h2 className="font-bold text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
              {tx("roundPoints")}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tx("round")} {currentRound} {tx("of")} {TOTAL_ROUNDS}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          whileHover={{ color: "#22c55e", background: "rgba(34,197,94,0.06)" }}
          onClick={(e) => { e.stopPropagation(); onExpand?.(); }}
        >
          {tx("viewAll")}
          <ArrowRight size={12} className={isRtl ? "rotate-180" : ""} />
        </motion.button>
      </div>

      {/* Round status banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={roundStatus}
          className="mx-4 mt-4 mb-2 px-4 py-3 rounded-xl flex items-center gap-3"
          style={{
            background:
              roundStatus === "active"
                ? "linear-gradient(135deg,rgba(34,197,94,0.12),rgba(0,150,50,0.06))"
                : roundStatus === "ended"
                ? "linear-gradient(135deg,rgba(220,38,38,0.1),rgba(180,30,30,0.05))"
                : "rgba(255,255,255,0.04)",
            border: `1px solid ${
              roundStatus === "active"
                ? "rgba(34,197,94,0.25)"
                : roundStatus === "ended"
                ? "rgba(220,38,38,0.2)"
                : "rgba(255,255,255,0.07)"
            }`,
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
        >
          {roundStatus === "active" ? (
            <>
              <motion.div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#22c55e" }}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>
                {tx("roundActive")} — {tx("round")} {currentRound}
              </span>
            </>
          ) : roundStatus === "ended" ? (
            <>
              <Lock size={13} style={{ color: "#ef4444" }} />
              <span className="text-xs font-semibold" style={{ color: "#ef4444" }}>
                {tx("roundLocked")} — {tx("round")} {currentRound} {tx("roundEnded")}
              </span>
            </>
          ) : (
            <>
              <Clock size={13} style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {tx("round")} {currentRound} — {tx("completed")}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="px-4 py-2">
        <div className="flex justify-between text-[10px] mb-1.5" style={{ color: "var(--text-muted)" }}>
          <span>{tx("round")} {currentRound}</span>
          <span>{currentRound}/{TOTAL_ROUNDS}</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#22c55e,#00b4ff)" }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((currentRound / TOTAL_ROUNDS) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Round results — live from current selections */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 pb-2 pt-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {tx("round")} {currentRound}
            </p>
            {hasAnyPoints && (
              <motion.span
                className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {isRtl ? "مباشر" : "LIVE"}
              </motion.span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(rm.selections)}
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {rows.slice(0, 5).map((row, idx) => {
                const photo = rm.photos[row.player.id];
                const name  = language === "ar" ? row.player.name : (row.player.nameEn ?? row.player.name);
                return (
                  <motion.div
                    key={row.player.id}
                    variants={rowVariants}
                    className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg mb-1"
                    style={{
                      background: row.roundPoints > 0
                        ? "linear-gradient(90deg,rgba(34,197,94,0.07),rgba(0,180,255,0.04))"
                        : "rgba(255,255,255,0.02)",
                      border: row.roundPoints > 0
                        ? "1px solid rgba(34,197,94,0.12)"
                        : "1px solid transparent",
                    }}
                  >
                    <MedalBadge rank={idx + 1} size="sm" />
                    {photo ? (
                      <img src={photo} alt={name}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        style={{ border: `1px solid ${row.player.color}55` }} />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black text-white"
                        style={{ background: `linear-gradient(135deg,${row.player.color},${row.player.color}99)` }}
                      >
                        {row.player.name[0]}
                      </div>
                    )}
                    <span className="flex-1 text-xs font-medium truncate"
                      style={{ color: "var(--text-primary)", direction: isRtl ? "rtl" : "ltr" }}>
                      {name}
                    </span>
                    <motion.span
                      className="text-xs font-black min-w-[18px] text-right"
                      style={{ color: row.roundPoints > 0 ? "#ffd700" : "var(--text-muted)" }}
                      key={row.roundPoints}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {row.roundPoints}
                    </motion.span>
                    <div className="flex gap-0.5">
                      {row.earlyArrival   && <span className="text-[11px]">⚡</span>}
                      {row.sameDayPayment && <span className="text-[11px]">💰</span>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scoring footer */}
      <div className="flex items-center gap-3 px-4 py-3 text-[10px] flex-wrap"
        style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
        <span><span style={{ color: "#22c55e" }}>W</span>=3pts</span>
        <span><span style={{ color: "#00b4ff" }}>⚡</span>=+2pts</span>
        <span><span style={{ color: "#8b5cf6" }}>💰</span>=+1pt</span>
      </div>
    </motion.div>
  );
}
