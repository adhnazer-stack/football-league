"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, Trophy, Zap, CreditCard, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRM } from "@/lib/round-management-context";
import { MedalBadge } from "@/components/standings/MedalBadge";
import { t, type Language } from "@/lib/i18n";

interface FullStatsModalProps {
  open: boolean;
  onClose: () => void;
  language: Language;
  onPlayerClick?: (id: string) => void;
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.22 } },
};
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

export function FullStatsModal({ open, onClose, language, onPlayerClick }: FullStatsModalProps) {
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";
  const rm    = useRM();

  /* Round navigation — null = cumulative (all rounds) */
  const savedRounds = [...rm.rounds].sort((a, b) => a.roundNumber - b.roundNumber);
  const [viewIdx, setViewIdx] = useState<number | null>(null); // null = all
  const viewRound = viewIdx !== null ? savedRounds[viewIdx] : null;

  const canPrev = savedRounds.length > 0 && (viewIdx === null || viewIdx > 0);
  const canNext = viewIdx !== null && viewIdx < savedRounds.length - 1;

  const goPrev = () => {
    if (viewIdx === null) setViewIdx(savedRounds.length - 1); // all → last round
    else if (viewIdx > 0) setViewIdx(viewIdx - 1);
  };
  const goNext = () => {
    if (viewIdx !== null && viewIdx < savedRounds.length - 1) setViewIdx(viewIdx + 1);
    else if (viewIdx === savedRounds.length - 1) setViewIdx(null); // last → all
  };

  /* ── Per-round rows ── */
  const roundRows = viewRound
    ? rm.players
        .map((player) => {
          const isWinner       = viewRound.winners.includes(player.id);
          const earlyArrival   = viewRound.earlyArrivals.includes(player.id);
          const sameDayPayment = viewRound.payments.includes(player.id);
          const pts            = (isWinner ? 3 : 0) + (earlyArrival ? 2 : 0) + (sameDayPayment ? 1 : 0);
          return { player, pts, isWinner, earlyArrival, sameDayPayment };
        })
        .sort((a, b) => b.pts - a.pts)
    : null;

  /* ── Cumulative rows ── */
  const cumulativeStats = rm.stats;
  const getPlayer = (id: string) => rm.players.find((p) => p.id === id);

  /* Top-3 bar */
  const topBar = viewRound
    ? [
        { label: isRtl ? "الفائزون" : "Winners",        value: viewRound.winners.length,       icon: <Trophy size={13} />, color: "#22c55e" },
        { label: isRtl ? "الحضور المبكر" : "Early",     value: viewRound.earlyArrivals.length,  icon: <Zap size={13} />,    color: "#00b4ff" },
        { label: isRtl ? "الدفعات" : "Payments",         value: viewRound.payments.length,       icon: <CreditCard size={13} />, color: "#8b5cf6" },
      ]
    : [
        { label: tx("mostPoints"),       value: cumulativeStats[0]?.totalPoints ?? 0,       icon: <Trophy size={13} />,    color: "#ffd700",
          sub: cumulativeStats[0] ? (language === "ar" ? getPlayer(cumulativeStats[0].playerId)?.name : getPlayer(cumulativeStats[0].playerId)?.nameEn ?? getPlayer(cumulativeStats[0].playerId)?.name) ?? "—" : "—" },
        { label: tx("mostWins"),          value: [...cumulativeStats].sort((a,b)=>b.wins-a.wins)[0]?.wins ?? 0, icon: <Zap size={13} />, color: "#22c55e",
          sub: (() => { const p = [...cumulativeStats].sort((a,b)=>b.wins-a.wins)[0]; return p ? (language==="ar" ? getPlayer(p.playerId)?.name : getPlayer(p.playerId)?.nameEn ?? getPlayer(p.playerId)?.name) ?? "—" : "—"; })() },
        { label: tx("mostEarlyArrivals"), value: [...cumulativeStats].sort((a,b)=>b.earlyArrivals-a.earlyArrivals)[0]?.earlyArrivals ?? 0, icon: <span className="text-xs">⚡</span>, color: "#00b4ff",
          sub: (() => { const p = [...cumulativeStats].sort((a,b)=>b.earlyArrivals-a.earlyArrivals)[0]; return p ? (language==="ar" ? getPlayer(p.playerId)?.name : getPlayer(p.playerId)?.nameEn ?? getPlayer(p.playerId)?.name) ?? "—" : "—"; })() },
      ];

  const GRID_ROUND = "28px 1fr 48px 36px 36px";
  const GRID_ALL   = "28px 1fr 52px 40px 40px 40px 36px";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 top-8 bottom-8 z-50 flex flex-col rounded-2xl overflow-hidden md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.1)",
            }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
              dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,rgba(0,180,255,0.18),rgba(0,100,200,0.08))", border: "1px solid rgba(0,180,255,0.25)" }}
                  animate={{ boxShadow: ["0 0 8px rgba(0,180,255,0.2)","0 0 22px rgba(0,180,255,0.45)","0 0 8px rgba(0,180,255,0.2)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Trophy size={17} style={{ color: "#00b4ff" }} />
                </motion.div>
                <div>
                  <h2 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    {tx("playerStatistics")}
                  </h2>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {viewRound
                      ? `${isRtl ? "جولة" : "Round"} ${viewRound.roundNumber} · ${viewRound.date}`
                      : `${tx("round")} ${rm.rounds.length} · ${cumulativeStats.length} ${isRtl ? "لاعب" : "players"}`}
                  </p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}>
                <X size={16} />
              </button>
            </div>

            {/* ── Round navigation bar ── */}
            <div
              className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.015)" }}
            >
              {/* Prev arrow */}
              <motion.button
                onClick={goPrev}
                disabled={!canPrev}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: canPrev ? "rgba(255,255,255,0.07)" : "transparent",
                  color: canPrev ? "var(--text-secondary)" : "rgba(255,255,255,0.15)",
                  border: `1px solid ${canPrev ? "rgba(255,255,255,0.1)" : "transparent"}`,
                  cursor: canPrev ? "pointer" : "default",
                }}
                whileHover={canPrev ? { scale: 1.08, background: "rgba(255,255,255,0.12)" } : {}}
                whileTap={canPrev ? { scale: 0.92 } : {}}
              >
                {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </motion.button>

              {/* Round label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewRound?.roundNumber ?? "all"}
                  className="flex flex-col items-center gap-0.5"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                >
                  {viewRound ? (
                    <>
                      <span className="text-xs font-black" style={{ color: "var(--text-primary)" }}>
                        {isRtl ? "جولة" : "Round"} {viewRound.roundNumber}
                      </span>
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                        {viewRound.roundNumber} / {savedRounds.length}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-black" style={{ color: "#ffd700" }}>
                        {isRtl ? "كل الجولات" : "All Rounds"}
                      </span>
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                        {savedRounds.length} {isRtl ? "جولات" : "rounds"}
                      </span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next arrow */}
              <motion.button
                onClick={goNext}
                disabled={viewIdx === null && savedRounds.length === 0}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: (viewIdx !== null) ? "rgba(255,255,255,0.07)" : "transparent",
                  color: (viewIdx !== null) ? "var(--text-secondary)" : "rgba(255,255,255,0.15)",
                  border: `1px solid ${(viewIdx !== null) ? "rgba(255,255,255,0.1)" : "transparent"}`,
                  cursor: (viewIdx !== null) ? "pointer" : "default",
                }}
                whileHover={(viewIdx !== null) ? { scale: 1.08, background: "rgba(255,255,255,0.12)" } : {}}
                whileTap={(viewIdx !== null) ? { scale: 0.92 } : {}}
              >
                {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </motion.button>
            </div>

            {/* ── Top bar (changes per view) ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewRound?.roundNumber ?? "all"}
                className="grid grid-cols-3 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
              >
                {topBar.map((s, i) => (
                  <div key={i} className="flex flex-col items-center py-3 gap-0.5"
                    style={{ borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <motion.span
                      className="text-xl font-black"
                      style={{ color: s.color }}
                      key={s.value}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {s.value}
                    </motion.span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                    {"sub" in s && s.sub && (
                      <span className="text-[9px]" style={{ color: "var(--text-secondary)", direction: "rtl" }}>{s.sub}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* ── Column headers ── */}
            <div
              className="grid px-4 py-2 text-[10px] font-bold tracking-widest uppercase flex-shrink-0"
              style={{
                gridTemplateColumns: viewRound ? GRID_ROUND : GRID_ALL,
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--border-subtle)",
              }}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <span className="text-center">#</span>
              <span>{tx("player")}</span>
              <span className="text-right" style={{ color: "#ffd700aa" }}>PTS</span>
              {viewRound ? (
                <>
                  <span className="text-right" style={{ color: "#22c55eaa" }}>🏆</span>
                  <span className="text-right" style={{ color: "#00b4ffaa" }}>⚡</span>
                </>
              ) : (
                <>
                  <span className="text-right" style={{ color: "#22c55eaa" }}>{tx("wins")}</span>
                  <span className="text-right" style={{ color: "#00b4ffaa" }}>{isRtl ? "مبكر" : "Early"}</span>
                  <span className="text-right" style={{ color: "#8b5cf6aa" }}>{isRtl ? "دفع" : "Pay"}</span>
                  <span className="text-right">{isRtl ? "حركة" : "±"}</span>
                </>
              )}
            </div>

            {/* ── Scrollable rows ── */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewRound?.roundNumber ?? "all"}
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  {/* Per-round view */}
                  {roundRows && roundRows.map((row, idx) => {
                    const photo = rm.photos[row.player.id];
                    const name  = language === "ar" ? row.player.name : (row.player.nameEn ?? row.player.name);
                    return (
                      <motion.div
                        key={row.player.id}
                        className={`grid px-4 py-3 items-center text-xs ${idx===0?"row-rank-1":idx===1?"row-rank-2":idx===2?"row-rank-3":""}`}
                        style={{
                          gridTemplateColumns: GRID_ROUND,
                          borderBottom: "1px solid rgba(255,255,255,0.025)",
                          cursor: onPlayerClick ? "pointer" : "default",
                          background: row.pts > 0 ? "linear-gradient(90deg,rgba(34,197,94,0.04),transparent)" : undefined,
                        }}
                        dir={isRtl ? "rtl" : "ltr"}
                        variants={rowVariants}
                        whileHover={{ background: idx < 3 ? undefined : "rgba(255,255,255,0.04)" }}
                        onClick={() => onPlayerClick?.(row.player.id)}
                      >
                        <div className="flex justify-center"><MedalBadge rank={idx + 1} size="sm" /></div>
                        <div className="flex items-center gap-2 min-w-0">
                          {photo ? (
                            <img src={photo} alt={name}
                              className="w-7 h-7 rounded-full flex-shrink-0 object-cover"
                              style={{ border: `1px solid ${row.player.color}55` }} />
                          ) : (
                            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                              style={{ background: `linear-gradient(135deg,${row.player.color},${row.player.color}88)` }}>
                              {row.player.name[0]}
                            </div>
                          )}
                          <span className="font-semibold truncate" style={{ color: "var(--text-primary)", direction: "rtl" }}>{name}</span>
                        </div>
                        <motion.span
                          className="text-right font-black"
                          style={{ color: row.pts > 0 ? "#ffd700" : "var(--text-muted)" }}
                          key={row.pts}
                          initial={{ scale: 1.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {row.pts}
                        </motion.span>
                        <span className="text-right text-sm">{row.isWinner ? "✓" : ""}</span>
                        <span className="text-right text-sm">{row.earlyArrival ? "✓" : ""}</span>
                      </motion.div>
                    );
                  })}

                  {/* Cumulative view */}
                  {!roundRows && cumulativeStats.map((stat, idx) => {
                    const player   = getPlayer(stat.playerId);
                    if (!player) return null;
                    const photo    = rm.photos[stat.playerId];
                    const name     = language === "ar" ? player.name : (player.nameEn ?? player.name);
                    const movement = stat.movement ?? 0;
                    const MovIcon  = movement > 0
                      ? <TrendingUp size={11} style={{ color: "#22c55e" }} />
                      : movement < 0
                        ? <TrendingDown size={11} style={{ color: "#ef4444" }} />
                        : <Minus size={11} style={{ color: "var(--text-muted)" }} />;
                    return (
                      <motion.div
                        key={stat.playerId}
                        className={`grid px-4 py-3 items-center text-xs ${idx===0?"row-rank-1":idx===1?"row-rank-2":idx===2?"row-rank-3":""}`}
                        style={{
                          gridTemplateColumns: GRID_ALL,
                          borderBottom: "1px solid rgba(255,255,255,0.025)",
                          cursor: onPlayerClick ? "pointer" : "default",
                        }}
                        dir={isRtl ? "rtl" : "ltr"}
                        variants={rowVariants}
                        whileHover={{ background: idx < 3 ? undefined : "rgba(255,255,255,0.04)" }}
                        onClick={() => onPlayerClick?.(stat.playerId)}
                      >
                        <div className="flex justify-center"><MedalBadge rank={stat.rank} size="sm" /></div>
                        <div className="flex items-center gap-2 min-w-0">
                          {photo ? (
                            <img src={photo} alt={name}
                              className="w-7 h-7 rounded-full flex-shrink-0 object-cover"
                              style={{ border: `1px solid ${player.color}55` }} />
                          ) : (
                            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                              style={{ background: `linear-gradient(135deg,${player.color},${player.color}88)` }}>
                              {player.name[0]}
                            </div>
                          )}
                          <span className="font-semibold truncate" style={{ color: "var(--text-primary)", direction: "rtl" }}>{name}</span>
                        </div>
                        <span className="text-right font-black" style={{ color: "#ffd700" }}>{stat.totalPoints}</span>
                        <span className="text-right font-medium" style={{ color: "#22c55e" }}>{stat.wins}</span>
                        <span className="text-right" style={{ color: "#00b4ff" }}>{stat.earlyArrivals}</span>
                        <span className="text-right" style={{ color: "#8b5cf6" }}>{stat.payments}</span>
                        <div className="flex justify-end items-center">{MovIcon}</div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-3 flex items-center gap-4 flex-shrink-0 flex-wrap"
              style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {[
                { icon: <Trophy size={11} />,    color: "#22c55e", label: isRtl ? "فوز +3"  : "Win +3"   },
                { icon: <Zap size={11} />,        color: "#00b4ff", label: isRtl ? "مبكر +2" : "Early +2" },
                { icon: <CreditCard size={11} />, color: "#8b5cf6", label: isRtl ? "دفع +1"  : "Pay +1"   },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                </div>
              ))}

              {/* Round dots indicator */}
              {savedRounds.length > 0 && (
                <div className="flex items-center gap-1 ms-auto">
                  {savedRounds.map((r, i) => (
                    <motion.button
                      key={r.roundNumber}
                      onClick={() => setViewIdx(i)}
                      className="rounded-full"
                      style={{
                        width: viewIdx === i ? 16 : 6,
                        height: 6,
                        background: viewIdx === i ? "#ffd700" : "rgba(255,255,255,0.2)",
                      }}
                      animate={{ width: viewIdx === i ? 16 : 6 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                  <motion.button
                    onClick={() => setViewIdx(null)}
                    className="rounded-full"
                    style={{
                      width: viewIdx === null ? 16 : 6,
                      height: 6,
                      background: viewIdx === null ? "#00b4ff" : "rgba(255,255,255,0.2)",
                    }}
                    animate={{ width: viewIdx === null ? 16 : 6 }}
                    transition={{ duration: 0.2 }}
                    title={isRtl ? "كل الجولات" : "All rounds"}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
