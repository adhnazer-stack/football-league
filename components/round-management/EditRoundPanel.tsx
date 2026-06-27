"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Users, Clock, CreditCard } from "lucide-react";
import type { RMRound } from "@/lib/round-management-data";
import type { RMPlayer } from "@/lib/round-management-data";

interface EditRoundPanelProps {
  open: boolean;
  onClose: () => void;
  rounds: RMRound[];
  players: RMPlayer[];
  language: string;
  currentlyEditing: number | null;
  onSelectRound: (roundNumber: number) => void;
  onCancelEdit: () => void;
}

export function EditRoundPanel({
  open, onClose, rounds, players, language,
  currentlyEditing, onSelectRound, onCancelEdit,
}: EditRoundPanelProps) {
  const isAr = language === "ar";

  const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name ?? id;

  const sortedRounds = [...rounds].sort((a, b) => b.roundNumber - a.roundNumber);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[400]"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 left-0 h-full z-[401] flex flex-col"
            style={{
              width: "min(420px, 100vw)",
              background: "linear-gradient(180deg,#060c1a 0%,#050810 100%)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "20px 0 60px rgba(0,0,0,0.6)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="font-black text-base" style={{ color: "var(--text-primary)" }}>
                ✏️ {isAr ? "تعديل جولة" : "Edit Round"}
              </h2>
              <button onClick={onClose} className="nav-icon-btn">
                <X size={16} />
              </button>
            </div>

            {/* Active edit banner */}
            {currentlyEditing !== null && (
              <div
                className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center justify-between"
                style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)" }}
              >
                <div className="flex items-center gap-2">
                  <Edit2 size={14} style={{ color: "#fb923c" }} />
                  <span className="text-xs font-bold" style={{ color: "#fb923c" }}>
                    {isAr ? `جاري تعديل الجولة ${currentlyEditing}` : `Editing Round ${currentlyEditing}`}
                  </span>
                </div>
                <button
                  onClick={onCancelEdit}
                  className="text-xs font-semibold px-2 py-1 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-secondary)" }}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            )}

            {/* Rounds list */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {sortedRounds.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <span className="text-4xl">📋</span>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {isAr ? "لا توجد جولات محفوظة بعد" : "No rounds saved yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedRounds.map((round) => {
                    const isEditing = currentlyEditing === round.roundNumber;
                    return (
                      <motion.div
                        key={round.roundNumber}
                        className="glass-card overflow-hidden"
                        style={{
                          borderColor: isEditing ? "rgba(251,146,60,0.4)" : undefined,
                          boxShadow: isEditing ? "0 0 16px rgba(251,146,60,0.15)" : undefined,
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        {/* Round header */}
                        <div
                          className="px-4 py-3 flex items-center justify-between"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                              style={{
                                background: isEditing ? "rgba(251,146,60,0.2)" : "rgba(255,255,255,0.07)",
                                color: isEditing ? "#fb923c" : "var(--text-secondary)",
                              }}
                            >
                              {round.roundNumber}
                            </div>
                            <div>
                              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                                {isAr ? "جولة" : "Round"} {round.roundNumber}
                              </p>
                              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                {round.date}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => onSelectRound(round.roundNumber)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            style={{
                              background: isEditing ? "rgba(251,146,60,0.2)" : "rgba(59,130,246,0.15)",
                              color: isEditing ? "#fb923c" : "#3b82f6",
                              border: `1px solid ${isEditing ? "rgba(251,146,60,0.3)" : "rgba(59,130,246,0.25)"}`,
                            }}
                          >
                            {isEditing ? <Edit2 size={12} /> : <Edit2 size={12} />}
                            {isEditing ? (isAr ? "يتم التعديل" : "Editing") : (isAr ? "تعديل" : "Edit")}
                          </button>
                        </div>

                        {/* Stats row */}
                        <div className="px-4 py-2.5 grid grid-cols-3 gap-2">
                          <div className="flex items-center gap-1.5">
                            <Users size={11} style={{ color: "#22c55e" }} />
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {round.winners.length} {isAr ? "فائز" : "W"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={11} style={{ color: "#00b4ff" }} />
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {round.earlyArrivals.length} {isAr ? "مبكر" : "EA"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CreditCard size={11} style={{ color: "#8b5cf6" }} />
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {round.payments.length} {isAr ? "دفع" : "Pay"}
                            </span>
                          </div>
                        </div>

                        {/* Winner names */}
                        {round.winners.length > 0 && (
                          <div className="px-4 pb-2.5">
                            <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                              {isAr ? "الفائزون" : "Winners"}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {round.winners.map((pid) => (
                                <span
                                  key={pid}
                                  className="text-[10px] px-2 py-0.5 rounded-full"
                                  style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", direction: "rtl" }}
                                >
                                  {getPlayerName(pid)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                {isAr
                  ? "تعديل أي جولة يُحدّث جميع الإحصاءات تلقائياً"
                  : "Editing any round recalculates all stats automatically"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
