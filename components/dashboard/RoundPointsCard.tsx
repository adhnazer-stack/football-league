"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Lock, Clock, Flame } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";

const TOTAL_ROUNDS = 18;

const rowIn: Variants = {
  hidden: { opacity: 0, x: -10, scale: 0.97 },
  show:   { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 360, damping: 26 } },
};
const listIn: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

export function RoundPointsCard({ onExpand }: { onExpand?: () => void }) {
  const { language, roundStatus } = useApp();
  const rm = useRM();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const currentRound = rm.currentRoundNumber;

  const rows = rm.players
    .map(player => {
      const isWinner       = rm.selections.winners.includes(player.id);
      const earlyArrival   = rm.selections.earlyArrivals.includes(player.id);
      const sameDayPayment = rm.selections.payments.includes(player.id);
      const pts = (isWinner ? 3 : 0) + (earlyArrival ? 2 : 0) + (sameDayPayment ? 1 : 0);
      return { player, pts, isWinner, earlyArrival, sameDayPayment };
    })
    .sort((a, b) => b.pts - a.pts);

  const isActive = roundStatus === "active";
  const isEnded  = roundStatus === "ended";
  const progress = Math.min((currentRound / TOTAL_ROUNDS) * 100, 100);

  return (
    <motion.div
      className="elite-card elite-card-green flex flex-col overflow-hidden cursor-pointer"
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 380, damping: 22 } }}
      whileTap={{ scale: 0.985, transition: { type: "spring", stiffness: 500, damping: 24 } }}
      onClick={onExpand}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--green-subtle)",
            border: "1px solid var(--green-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>
            ⚽
          </div>
          <div>
            <h2 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
              {tx("roundPoints")}
            </h2>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {tx("round")} {currentRound} {tx("of")} {TOTAL_ROUNDS}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg"
          style={{
            color: "var(--text-muted)",
            background: "var(--green-subtle)",
            border: "1px solid var(--green-border)",
          }}
          whileHover={{ color: "var(--green-bright)" }}
          whileTap={{ scale: 0.95 }}
          onClick={e => { e.stopPropagation(); onExpand?.(); }}
        >
          {tx("viewAll")}
          <ArrowRight size={11} className={isRtl ? "rotate-180" : ""} />
        </motion.button>
      </div>

      {/* Round status pill */}
      <AnimatePresence mode="wait">
        <motion.div
          key={roundStatus}
          className="mx-4 mt-3 mb-2 px-4 py-2.5 rounded-xl flex items-center gap-2.5"
          style={{
            background: isActive
              ? "var(--green-subtle)"
              : isEnded
              ? "var(--red-subtle)"
              : "var(--bg-elevated)",
            border: `1px solid ${isActive ? "var(--green-border)" : isEnded ? "var(--red-border)" : "var(--border)"}`,
          }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          {isActive ? (
            <>
              <div className="w-2 h-2 rounded-full live-dot flex-shrink-0" />
              <span className="text-xs font-black" style={{ color: "var(--green-bright)" }}>
                {tx("roundActive")} — {tx("round")} {currentRound}
              </span>
              <Flame size={12} style={{ color: "var(--green-bright)", marginLeft: "auto" }} />
            </>
          ) : isEnded ? (
            <>
              <Lock size={12} style={{ color: "var(--red-bright)" }} />
              <span className="text-xs font-black" style={{ color: "var(--red-bright)" }}>
                {tx("roundLocked")} — {tx("round")} {currentRound}
              </span>
            </>
          ) : (
            <>
              <Clock size={12} style={{ color: "var(--text-muted)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {tx("round")} {currentRound} — {tx("completed")}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="flex justify-between mb-1.5"
          style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.2em" }}>
          <span>{tx("round")} {currentRound}</span>
          <span>{currentRound}/{TOTAL_ROUNDS}</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 3, background: "var(--border-strong)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "var(--green-bright)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.3 }}
          />
        </div>
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        <div className="px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(rm.selections)}
              variants={listIn} initial="hidden" animate="show">
              {rows.slice(0, 6).map((row, idx) => {
                const photo = rm.photos[row.player.id];
                const name = language === "ar"
                  ? row.player.name
                  : (row.player.nameEn ?? row.player.name);
                return (
                  <motion.div
                    key={row.player.id}
                    variants={rowIn}
                    className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl mb-1.5"
                    style={{
                      background: row.pts > 0 ? "var(--green-subtle)" : "var(--bg-elevated)",
                      border: `1px solid ${row.pts > 0 ? "var(--green-border)" : "transparent"}`,
                    }}
                  >
                    <MedalBadge rank={idx + 1} size="sm" />
                    {photo ? (
                      <img src={photo} alt={name}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        style={{ border: `1px solid ${row.player.color}44` }} />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[7px] font-black text-white"
                        style={{ background: `linear-gradient(135deg,${row.player.color},${row.player.color}99)` }}>
                        {row.player.name[0]}
                      </div>
                    )}
                    <span className="flex-1 text-xs font-medium truncate"
                      style={{ color: "var(--text-primary)", direction: isRtl ? "rtl" : "ltr" }}>
                      {name}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={row.pts}
                        className="font-black text-sm min-w-[18px] text-right"
                        style={{ color: row.pts > 0 ? "var(--gold)" : "var(--text-muted)" }}
                        initial={{ scale: 1.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 460, damping: 22 }}
                      >{row.pts}</motion.span>
                    </AnimatePresence>
                    <div className="flex gap-0.5 w-8 justify-end">
                      {row.earlyArrival   && <span style={{ fontSize: 11 }}>⚡</span>}
                      {row.sameDayPayment && <span style={{ fontSize: 11 }}>💰</span>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer legend */}
      <div className="flex items-center gap-4 px-5 py-2.5 flex-wrap"
        style={{ borderTop: "1px solid var(--border-subtle)", fontSize: 10, color: "var(--text-muted)" }}>
        <span><span style={{ color: "var(--green-bright)" }}>W</span>=3pts</span>
        <span><span style={{ color: "var(--blue-bright)" }}>⚡</span>=+2pts</span>
        <span><span style={{ color: "var(--violet-bright)" }}>💰</span>=+1pt</span>
      </div>
    </motion.div>
  );
}
