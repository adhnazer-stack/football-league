"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Flame, Lock, Clock } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { useRM } from "@/lib/round-management-context";

const TOTAL_ROUNDS = 18;

export function RoundPointsCard({ onExpand }: { onExpand?: () => void }) {
  const { language, roundStatus } = useApp();
  const rm = useRM();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const currentRound = rm.currentRoundNumber;
  const isActive = roundStatus === "active";
  const isEnded  = roundStatus === "ended";
  const progress = Math.min((currentRound / TOTAL_ROUNDS) * 100, 100);

  const rows = rm.players
    .map(player => {
      const isWinner       = rm.selections.winners.includes(player.id);
      const earlyArrival   = rm.selections.earlyArrivals.includes(player.id);
      const sameDayPayment = rm.selections.payments.includes(player.id);
      const pts = (isWinner ? 3 : 0) + (earlyArrival ? 2 : 0) + (sameDayPayment ? 1 : 0);
      return { player, pts, isWinner, earlyArrival, sameDayPayment };
    })
    .sort((a, b) => b.pts - a.pts);

  return (
    <div className="elite-card flex flex-col overflow-hidden" style={{ height: "100%" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h2 className="font-black text-xs tracking-[0.22em] uppercase"
            style={{ color: "var(--green-bright)" }}>
            {tx("roundPoints")}
          </h2>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {tx("round")} {currentRound} {isRtl ? `من ${TOTAL_ROUNDS}` : `of ${TOTAL_ROUNDS}`}
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
          onClick={onExpand}
        >
          {tx("viewAll")}
          {isRtl ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
        </button>
      </div>

      {/* ── Status banner ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={roundStatus}
          className="flex items-center gap-3 px-5 py-3"
          style={{
            background: isActive ? "var(--green-subtle)" : isEnded ? "var(--red-subtle)" : "var(--bg-elevated)",
            borderBottom: `1px solid ${isActive ? "var(--green-border)" : isEnded ? "var(--red-border)" : "var(--border)"}`,
          }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
        >
          {isActive ? (
            <>
              <motion.div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: "var(--green-bright)" }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <span className="font-black text-xs" style={{ color: "var(--green-bright)" }}>
                {tx("roundActive")} — {tx("round")} {currentRound}
              </span>
              <Flame size={13} style={{ color: "var(--green-bright)", marginLeft: "auto" }} />
            </>
          ) : isEnded ? (
            <>
              <Lock size={13} style={{ color: "var(--red-bright)" }} />
              <span className="font-black text-xs" style={{ color: "var(--red-bright)" }}>
                {tx("roundLocked")} — {tx("round")} {currentRound}
              </span>
            </>
          ) : (
            <>
              <Clock size={13} style={{ color: "var(--text-muted)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {tx("round")} {currentRound} — {tx("completed")}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Progress bar ── */}
      <div style={{ height: 3, background: "var(--border-strong)" }}>
        <motion.div
          style={{ height: "100%", background: "var(--green-bright)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </div>

      {/* ── Score panels grid ── */}
      <div className="flex-1 overflow-auto hide-scrollbar p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(rm.selections)}
            className="grid gap-2.5"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {rows.map((row, idx) => {
              const photo = rm.photos[row.player.id];
              const name  = language === "ar"
                ? row.player.name
                : (row.player.nameEn ?? row.player.name);
              const isLeading = row.pts > 0 && idx === 0;

              return (
                <motion.div
                  key={row.player.id}
                  className={`score-panel ${isLeading ? "score-panel-gold" : ""}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.88, y: 8 },
                    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 360, damping: 26 } },
                  }}
                >
                  {/* Avatar */}
                  {photo ? (
                    <img src={photo} alt={name}
                      style={{
                        width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
                        border: `2px solid ${row.pts > 0 ? "var(--gold-border)" : "var(--border)"}`,
                      }} />
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `linear-gradient(135deg,${row.player.color},${row.player.color}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 900, color: "#fff",
                      border: `2px solid ${row.pts > 0 ? "var(--gold-border)" : "var(--border)"}`,
                    }}>
                      {row.player.name[0]}
                    </div>
                  )}

                  {/* Name */}
                  <span className="text-center font-bold truncate w-full"
                    style={{ fontSize: 11, color: "var(--text-secondary)", direction: isRtl ? "rtl" : "ltr" }}>
                    {name.split(" ")[0]}
                  </span>

                  {/* Points */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={row.pts}
                      className="font-black leading-none"
                      style={{
                        fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                        color: row.pts > 0 ? "var(--gold)" : "var(--border-strong)",
                        letterSpacing: "-0.03em",
                      }}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 440, damping: 22 }}
                    >
                      {row.pts}
                    </motion.div>
                  </AnimatePresence>

                  {/* Achievement badges */}
                  <div className="flex items-center gap-1 justify-center flex-wrap">
                    {row.isWinner       && <span style={{ fontSize: 13 }}>🏆</span>}
                    {row.earlyArrival   && <span style={{ fontSize: 13 }}>⚡</span>}
                    {row.sameDayPayment && <span style={{ fontSize: 13 }}>💰</span>}
                    {!row.pts && <span style={{ fontSize: 9, color: "var(--text-muted)" }}>—</span>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 px-5 py-2.5"
        style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          🏆=3pts · ⚡=+2pts · 💰=+1pt
        </span>
      </div>
    </div>
  );
}
