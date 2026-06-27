"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Lock, Clock, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getRoundStandings } from "@/lib/calculations";
import { leagueRounds, CURRENT_ROUND, TOTAL_ROUNDS } from "@/lib/league-data";
import { MedalBadge } from "@/components/standings/MedalBadge";

export function RoundPointsCard({ onExpand }: { onExpand?: () => void }) {
  const { language, roundStatus } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const maxRound = leagueRounds[leagueRounds.length - 1]?.number ?? CURRENT_ROUND;
  const rows = getRoundStandings(maxRound);

  return (
    <motion.div
      className="glass-card flex flex-col overflow-hidden cursor-pointer"
      whileHover={{ y: -6, boxShadow: "0 24px 64px rgba(0,255,100,0.08), 0 0 0 1px rgba(255,215,0,0.22)" }}
      transition={{ duration: 0.3 }}
      onClick={onExpand}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.18),rgba(0,150,50,0.08))", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <Calendar size={17} style={{ color: "#22c55e" }} />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
              {tx("roundPoints")}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tx("round")} {maxRound} {tx("of")} {TOTAL_ROUNDS}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          whileHover={{ color: "#22c55e" }}
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
                className="w-2 h-2 rounded-full"
                style={{ background: "#22c55e" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>
                {tx("roundActive")} — {tx("round")} {maxRound}
              </span>
            </>
          ) : roundStatus === "ended" ? (
            <>
              <Lock size={13} style={{ color: "#ef4444" }} />
              <span className="text-xs font-semibold" style={{ color: "#ef4444" }}>
                {tx("roundLocked")} — {tx("round")} {maxRound} {tx("roundEnded")}
              </span>
            </>
          ) : (
            <>
              <Clock size={13} style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {tx("round")} {maxRound} — {tx("completed")}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="px-4 py-2">
        <div className="flex justify-between text-[10px] mb-1.5" style={{ color: "var(--text-muted)" }}>
          <span>{tx("round")} {maxRound}</span>
          <span>{maxRound}/{TOTAL_ROUNDS}</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#22c55e,#00b4ff)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(maxRound / TOTAL_ROUNDS) * 100}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Round results */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 pb-2 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            {tx("round")} {maxRound} — {tx("completed")}
          </p>
          {rows.slice(0, 5).map((row) => (
            <div
              key={row.player.id}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg mb-1"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <MedalBadge rank={row.rank} size="sm" />
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
                style={{ background: row.player.color }}
              >
                {row.player.initials[0]}
              </div>
              <span className="flex-1 text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {language === "ar" ? row.player.nameAr : row.player.name.split(" ")[0]}
              </span>
              <span className="text-xs font-black" style={{ color: "#ffd700" }}>{row.roundPoints}</span>
              {row.earlyArrival && <span className="text-[11px]" title="Early arrival">⚡</span>}
              {row.sameDayPayment && <span className="text-[11px]" title="Same day payment">💰</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Scoring footer */}
      <div
        className="flex items-center gap-3 px-4 py-3 text-[10px] flex-wrap"
        style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
      >
        <span><span style={{ color: "#22c55e" }}>W</span>=3pts</span>
        <span><span style={{ color: "#00b4ff" }}>⚡</span>=+1pt</span>
        <span><span style={{ color: "#8b5cf6" }}>💰</span>=+1pt</span>
      </div>
    </motion.div>
  );
}
