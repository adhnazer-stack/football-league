"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Zap, CreditCard, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useState } from "react";
import { useRM } from "@/lib/round-management-context";
import type { Language } from "@/lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
  language: Language;
}

export function FullRoundModal({ open, onClose, language }: Props) {
  const rm = useRM();
  const isAr = language === "ar";
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const sortedRounds = [...rm.rounds].sort((a, b) => b.roundNumber - a.roundNumber);
  const getPlayer = (id: string) => rm.players.find(p => p.id === id);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed z-[201] inset-x-3 top-4 bottom-4 mx-auto max-w-lg flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.08)",
            }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)" }}>
                  <Calendar size={17} style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <h2 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    {isAr ? "كل الجولات" : "All Rounds"}
                  </h2>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {sortedRounds.length} {isAr ? "جولة محفوظة" : "rounds saved"}
                  </p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                <X size={15} />
              </button>
            </div>

            {/* Scoring guide */}
            <div className="flex items-center justify-center gap-5 px-5 py-2.5 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}>
              {[
                { icon: "🏆", label: isAr ? "فوز +3" : "Win +3", color: "#22c55e" },
                { icon: "⚡", label: isAr ? "مبكر +2" : "Early +2", color: "#00b4ff" },
                { icon: "💰", label: isAr ? "دفع +1" : "Pay +1", color: "#8b5cf6" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1">
                  <span className="text-xs">{s.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Rounds list */}
            <div className="flex-1 overflow-y-auto">
              {sortedRounds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <span className="text-4xl">📋</span>
                  <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
                    {isAr ? "لا توجد جولات محفوظة بعد" : "No rounds saved yet"}
                  </p>
                </div>
              ) : (
                <div className="px-4 py-3 space-y-2">
                  {sortedRounds.map((round, idx) => {
                    const isExpanded = expandedRound === round.roundNumber;

                    // MVP of this round
                    const scores: Record<string, number> = {};
                    round.winners.forEach(id => { scores[id] = (scores[id] ?? 0) + 3; });
                    round.earlyArrivals.forEach(id => { scores[id] = (scores[id] ?? 0) + 2; });
                    round.payments.forEach(id => { scores[id] = (scores[id] ?? 0) + 1; });
                    const mvpId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
                    const mvp = mvpId ? getPlayer(mvpId) : null;

                    const totalPts = Object.values(scores).reduce((a, b) => a + b, 0);

                    return (
                      <motion.div
                        key={round.roundNumber}
                        className="rounded-xl overflow-hidden"
                        style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        {/* Round row header */}
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 text-left"
                          onClick={() => setExpandedRound(isExpanded ? null : round.roundNumber)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                              style={{
                                background: "linear-gradient(135deg,rgba(255,215,0,0.15),rgba(201,150,60,0.08))",
                                border: "1px solid rgba(255,215,0,0.25)",
                                color: "#ffd700",
                              }}>
                              {round.roundNumber}
                            </div>
                            <div>
                              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                                {isAr ? "جولة" : "Round"} {round.roundNumber}
                              </p>
                              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{round.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Quick stats */}
                            <div className="hidden sm:flex items-center gap-2">
                              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#22c55e" }}>
                                <Trophy size={10} /> {round.winners.length}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#00b4ff" }}>
                                <Zap size={10} /> {round.earlyArrivals.length}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#8b5cf6" }}>
                                <CreditCard size={10} /> {round.payments.length}
                              </span>
                            </div>
                            {/* MVP badge */}
                            {mvp && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1"
                                style={{ background: "rgba(255,215,0,0.1)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.2)" }}>
                                ⭐ <span style={{ direction: "rtl" }}>{mvp.name.split(" ")[0]}</span>
                              </span>
                            )}
                            <span style={{ color: "var(--text-muted)" }}>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </span>
                          </div>
                        </button>

                        {/* Expanded detail */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                            >
                              <div className="px-4 py-3 space-y-3">
                                {/* 3 category rows */}
                                {[
                                  { icon: "🏆", label: isAr ? "الفائزون (+3)" : "Winners (+3)",           ids: round.winners,       color: "#22c55e", bg: "rgba(34,197,94,0.1)"  },
                                  { icon: "⚡", label: isAr ? "الحضور المبكر (+2)" : "Early Arrival (+2)", ids: round.earlyArrivals, color: "#00b4ff", bg: "rgba(0,180,255,0.1)"  },
                                  { icon: "💰", label: isAr ? "الدفع في اليوم (+1)" : "Same Day Pay (+1)", ids: round.payments,       color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
                                ].map(cat => (
                                  cat.ids.length > 0 && (
                                    <div key={cat.label}>
                                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: cat.color }}>
                                        {cat.icon} {cat.label}
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {cat.ids.map(id => {
                                          const pl = getPlayer(id);
                                          return pl ? (
                                            <span key={id} className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                                              style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}25`, direction: "rtl" }}>
                                              <span className="w-3 h-3 rounded-full inline-block" style={{ background: pl.color }} />
                                              {pl.name}
                                            </span>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )
                                ))}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-1">
                                  {mvp && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                                      style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.15)" }}>
                                      <span className="text-xs">⭐</span>
                                      <span className="text-[10px] font-black" style={{ color: "#ffd700", direction: "rtl" }}>
                                        {mvp.name} (+{scores[mvpId!]})
                                      </span>
                                    </div>
                                  )}
                                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                    {isAr ? "مجموع النقاط" : "Total pts"}: <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>{totalPts}</span>
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

