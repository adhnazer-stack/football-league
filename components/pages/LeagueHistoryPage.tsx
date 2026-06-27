"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trophy, Clock, CreditCard, Calendar } from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import type { RMPlayer } from "@/lib/round-management-data";
import type { RMRound } from "@/lib/round-management-data";

function RoundCard({
  round,
  players,
  language,
  index,
}: {
  round: RMRound;
  players: RMPlayer[];
  language: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isAr = language === "ar";

  const getPlayer = (id: string) => players.find((p) => p.id === id);

  // Round MVP = player with most points earned in this round
  const scores: Record<string, number> = {};
  round.winners.forEach((id) => { scores[id] = (scores[id] ?? 0) + 3; });
  round.earlyArrivals.forEach((id) => { scores[id] = (scores[id] ?? 0) + 2; });
  round.payments.forEach((id) => { scores[id] = (scores[id] ?? 0) + 1; });
  const mvpId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mvp = mvpId ? getPlayer(mvpId) : null;

  const totalPointsEarned = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div
          className="absolute left-[23px] -top-6 w-0.5 h-6"
          style={{ background: "linear-gradient(180deg, rgba(255,215,0,0.3), rgba(255,215,0,0.1))" }}
        />
      )}

      <div className="flex gap-4">
        {/* Round number node */}
        <div className="flex-shrink-0 relative">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
            style={{
              background: round.locked
                ? "linear-gradient(135deg,rgba(255,215,0,0.2),rgba(201,150,60,0.15))"
                : "rgba(255,255,255,0.06)",
              border: round.locked ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
              color: round.locked ? "#ffd700" : "var(--text-muted)",
            }}
            whileHover={{ scale: 1.1 }}
          >
            {round.roundNumber}
          </motion.div>
        </div>

        {/* Card */}
        <div className="flex-1">
          <motion.div
            className="glass-card overflow-hidden mb-6"
            whileHover={{ y: -2 }}
          >
            {/* Card header */}
            <button
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              style={{ borderBottom: expanded ? "1px solid rgba(255,255,255,0.07)" : "none" }}
              onClick={() => setExpanded((e) => !e)}
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    {isAr ? "جولة" : "Round"} {round.roundNumber}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar size={10} style={{ color: "var(--text-muted)" }} />
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{round.date}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Quick stats */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Trophy size={11} style={{ color: "#22c55e" }} />
                    <span className="text-[10px] font-bold" style={{ color: "#22c55e" }}>{round.winners.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} style={{ color: "#00b4ff" }} />
                    <span className="text-[10px] font-bold" style={{ color: "#00b4ff" }}>{round.earlyArrivals.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard size={11} style={{ color: "#8b5cf6" }} />
                    <span className="text-[10px] font-bold" style={{ color: "#8b5cf6" }}>{round.payments.length}</span>
                  </div>
                </div>

                {/* MVP */}
                {mvp && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(255,215,0,0.1)" }}>
                    <span className="text-[10px]">⭐</span>
                    <span className="text-[10px] font-bold" style={{ color: "#ffd700", direction: "rtl" }}>
                      {mvp.name}
                    </span>
                  </div>
                )}

                <div style={{ color: "var(--text-muted)" }}>
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </button>

            {/* Expanded content */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 space-y-4">
                    {/* Summary row */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: "🏆", label: isAr ? "الفائزون" : "Winners", ids: round.winners, color: "#22c55e" },
                        { icon: "⚡", label: isAr ? "الحضور المبكر" : "Early Arrivals", ids: round.earlyArrivals, color: "#00b4ff" },
                        { icon: "💰", label: isAr ? "الدفع" : "Payments", ids: round.payments, color: "#8b5cf6" },
                      ].map((cat) => (
                        <div
                          key={cat.label}
                          className="rounded-xl p-2.5 text-center"
                          style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}25` }}
                        >
                          <p className="text-base mb-1">{cat.icon}</p>
                          <p className="text-xs font-black" style={{ color: cat.color }}>{cat.ids.length}</p>
                          <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{cat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Winners list */}
                    {round.winners.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#22c55e" }}>
                          {isAr ? "الفائزون" : "Winners"} (+3 pts)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {round.winners.map((id) => {
                            const pl = getPlayer(id);
                            return pl ? (
                              <span
                                key={id}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                                style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", direction: "rtl" }}
                              >
                                <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ background: pl.color }} />
                                {pl.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Early arrivals */}
                    {round.earlyArrivals.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#00b4ff" }}>
                          {isAr ? "الحضور المبكر" : "Early Arrivals"} (+2 pts)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {round.earlyArrivals.map((id) => {
                            const pl = getPlayer(id);
                            return pl ? (
                              <span
                                key={id}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                                style={{ background: "rgba(0,180,255,0.12)", color: "#00b4ff", direction: "rtl" }}
                              >
                                <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ background: pl.color }} />
                                {pl.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Payments */}
                    {round.payments.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#8b5cf6" }}>
                          {isAr ? "الدفع في نفس اليوم" : "Same-Day Payments"} (+1 pt)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {round.payments.map((id) => {
                            const pl = getPlayer(id);
                            return pl ? (
                              <span
                                key={id}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                                style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6", direction: "rtl" }}
                              >
                                <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ background: pl.color }} />
                                {pl.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* MVP */}
                    {mvp && (
                      <div
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)" }}
                      >
                        <span className="text-lg">⭐</span>
                        <div>
                          <p className="text-[9px] font-bold" style={{ color: "#ffd700" }}>
                            {isAr ? "أفضل لاعب في الجولة" : "Round MVP"}
                          </p>
                          <p className="text-sm font-black" style={{ color: "var(--text-primary)", direction: "rtl" }}>
                            {mvp.name}
                          </p>
                        </div>
                        <span className="ml-auto text-sm font-black" style={{ color: "#ffd700" }}>
                          +{scores[mvpId!]}
                        </span>
                      </div>
                    )}

                    {/* Total points footer */}
                    <div className="text-right">
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {isAr ? "مجموع النقاط الموزعة" : "Total points distributed"}:
                        <span className="font-black ml-1" style={{ color: "var(--text-secondary)" }}>{totalPointsEarned}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function LeagueHistoryPage() {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const sortedRounds = [...rm.rounds].sort((a, b) => a.roundNumber - b.roundNumber);

  return (
    <div className="flex-1 flex flex-col overflow-auto pb-24 md:pb-0">
      {/* Header */}
      <motion.div
        className="text-center py-8 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-5xl mb-3">📜</div>
        <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>
          {isAr ? "تاريخ الدوري" : "League History"}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {isAr
            ? `${sortedRounds.length} جولة محفوظة`
            : `${sortedRounds.length} round${sortedRounds.length !== 1 ? "s" : ""} saved`}
        </p>
      </motion.div>

      {sortedRounds.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <span className="text-5xl">📋</span>
          <p className="text-base font-bold" style={{ color: "var(--text-muted)" }}>
            {isAr ? "لا توجد جولات محفوظة بعد" : "No rounds saved yet"}
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isAr ? "اذهب لإدارة الجولة وابدأ تسجيل النتائج" : "Go to Round Management to start recording results"}
          </p>
        </div>
      ) : (
        <div className="px-5 py-2 max-w-2xl mx-auto w-full">
          {sortedRounds.map((round, idx) => (
            <RoundCard
              key={round.roundNumber}
              round={round}
              players={rm.players}
              language={language}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
