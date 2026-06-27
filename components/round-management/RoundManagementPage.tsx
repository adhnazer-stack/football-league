"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Edit2, Lock } from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import { PlayerSelectionCard } from "./PlayerSelectionCard";
import { SettingsPanel } from "./SettingsPanel";
import { EditRoundPanel } from "./EditRoundPanel";
import { ConfettiEffect } from "./ConfettiEffect";

export function RoundManagementPage() {
  const { language, isAdmin } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  /* Panel visibility */
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  /* Per-card confirmation state */
  const [winnersConfirmed, setWinnersConfirmed] = useState(false);
  const [earlyConfirmed, setEarlyConfirmed] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Admin guard — show lock screen for non-admin visitors
  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-20">
        <motion.div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,rgba(255,215,0,0.15),rgba(201,150,60,0.08))", border: "1px solid rgba(255,215,0,0.25)" }}
          animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 20px rgba(255,215,0,0.1)", "0 0 40px rgba(255,215,0,0.3)", "0 0 20px rgba(255,215,0,0.1)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          initial={{ opacity: 0, scale: 0.8 }}
        >
          <Lock size={32} style={{ color: "#ffd700" }} />
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            {isAr ? "وضع الزائر" : "Visitor Mode"}
          </h2>
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            {isAr ? "يمكنك عرض جميع الإحصاءات والترتيب" : "You can view all stats and rankings"}
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isAr ? "سجّل دخولك كمسؤول للوصول إلى إدارة الجولات" : "Login as Admin to manage rounds"}
          </p>
        </div>
      </div>
    );
  }

  const allConfirmed = winnersConfirmed && earlyConfirmed && paymentConfirmed;
  const isEditing = rm.editingRound !== null;

  const handleSaveRound = () => {
    rm.saveRound();
    setWinnersConfirmed(false);
    setEarlyConfirmed(false);
    setPaymentConfirmed(false);
    setShowConfetti(true);
  };

  const handleLoadRound = (roundNumber: number) => {
    rm.loadRoundForEditing(roundNumber);
    // Pre-confirm all cards when loading a saved round (since it already has data)
    setWinnersConfirmed(false);
    setEarlyConfirmed(false);
    setPaymentConfirmed(false);
    setEditOpen(false);
  };

  const handleCancelEdit = () => {
    rm.cancelEditing();
    setWinnersConfirmed(false);
    setEarlyConfirmed(false);
    setPaymentConfirmed(false);
  };

  return (
    <div className="flex-1 flex flex-col relative" style={{ direction: "rtl" }}>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-30"
        style={{
          background: "rgba(5,8,16,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Left: Edit Round button */}
        <motion.button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
          style={{
            background: isEditing ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${isEditing ? "rgba(251,146,60,0.35)" : "rgba(255,255,255,0.1)"}`,
            color: isEditing ? "#fb923c" : "var(--text-secondary)",
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Edit2 size={14} />
          {isAr ? "تعديل جولة" : "Edit Round"}
        </motion.button>

        {/* Center: Title + Round badge */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="font-black text-base tracking-wide"
            style={{
              background: "linear-gradient(135deg,#ffd700,#c9963c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ⚽ {isAr ? "إدارة الجولة" : "Round Management"}
          </h1>
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-0.5 rounded-full text-[10px] font-black"
              style={{
                background: isEditing ? "rgba(251,146,60,0.2)" : "rgba(59,130,246,0.2)",
                color: isEditing ? "#fb923c" : "#60a5fa",
                border: `1px solid ${isEditing ? "rgba(251,146,60,0.35)" : "rgba(59,130,246,0.3)"}`,
              }}
            >
              {isEditing
                ? `${isAr ? "تعديل جولة" : "Editing Round"} ${rm.editingRound}`
                : `${isAr ? "جولة" : "Round"} ${rm.currentRoundNumber}`}
            </div>
          </div>
        </div>

        {/* Right: Settings button */}
        <motion.button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text-secondary)",
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Settings size={14} />
          {isAr ? "الإعدادات" : "Settings"}
        </motion.button>
      </div>

      {/* ── Editing banner ────────────────────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-5 py-2.5"
              style={{ background: "rgba(251,146,60,0.1)", borderBottom: "1px solid rgba(251,146,60,0.2)" }}
            >
              <p className="text-xs font-bold" style={{ color: "#fb923c" }}>
                {isAr
                  ? `أنت تعدل الجولة ${rm.editingRound} — سيتم إعادة حساب جميع الإحصاءات عند الحفظ`
                  : `Editing Round ${rm.editingRound} — all stats will recalculate on save`}
              </p>
              <button
                onClick={handleCancelEdit}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-muted)" }}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scoring legend ────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 px-5 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {[
          { icon: "🏆", label: isAr ? "فوز +3" : "Win +3", color: "#22c55e" },
          { icon: "⚡", label: isAr ? "مبكر +2" : "Early +2", color: "#00b4ff" },
          { icon: "💰", label: isAr ? "دفع +1" : "Pay +1", color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.icon} className="flex items-center gap-1.5">
            <span className="text-sm">{s.icon}</span>
            <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Selection cards ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-40 space-y-4">
        {/* Winning Team card */}
        <PlayerSelectionCard
          title="Winning Team"
          titleAr="الفريق الفائز"
          icon="🏆"
          color="#22c55e"
          confirmLabel="Confirm Winners"
          confirmLabelAr="تأكيد الفائزين"
          pointsLabel={isAr ? "+3 نقاط لكل فائز" : "+3 pts per winner"}
          players={rm.players}
          selectedIds={rm.selections.winners}
          onToggle={rm.toggleWinner}
          onSelectAll={rm.selectAllWinners}
          onClearAll={rm.clearAllWinners}
          onConfirm={() => setWinnersConfirmed(true)}
          confirmed={winnersConfirmed}
          disabled={false}
          language={language}
        />

        {/* Early Arrival card */}
        <PlayerSelectionCard
          title="Early Arrival"
          titleAr="الحضور المبكر"
          icon="⚡"
          color="#00b4ff"
          confirmLabel="Confirm Early Arrivals"
          confirmLabelAr="تأكيد الحضور المبكر"
          pointsLabel={isAr ? "+2 نقطة لكل حضور مبكر" : "+2 pts per early arrival"}
          players={rm.players}
          selectedIds={rm.selections.earlyArrivals}
          onToggle={rm.toggleEarlyArrival}
          onSelectAll={rm.selectAllEarlyArrivals}
          onClearAll={rm.clearAllEarlyArrivals}
          onConfirm={() => setEarlyConfirmed(true)}
          confirmed={earlyConfirmed}
          disabled={false}
          language={language}
        />

        {/* Same Day Payment card */}
        <PlayerSelectionCard
          title="Same Day Payment"
          titleAr="الدفع في نفس اليوم"
          icon="💰"
          color="#8b5cf6"
          confirmLabel="Confirm Payments"
          confirmLabelAr="تأكيد الدفعات"
          pointsLabel={isAr ? "+1 نقطة لكل دفع" : "+1 pt per payment"}
          players={rm.players}
          selectedIds={rm.selections.payments}
          onToggle={rm.togglePayment}
          onSelectAll={rm.selectAllPayments}
          onClearAll={rm.clearAllPayments}
          onConfirm={() => setPaymentConfirmed(true)}
          confirmed={paymentConfirmed}
          disabled={false}
          language={language}
        />

        {/* Stats summary (when at least one card confirmed) */}
        <AnimatePresence>
          {(winnersConfirmed || earlyConfirmed || paymentConfirmed) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="glass-card p-4"
            >
              <p className="text-xs font-bold mb-3" style={{ color: "var(--text-muted)" }}>
                {isAr ? "معاينة النقاط" : "Points Preview"}
              </p>
              <div className="space-y-2">
                {rm.players
                  .map((p) => {
                    const pts =
                      (rm.selections.winners.includes(p.id) ? 3 : 0) +
                      (rm.selections.earlyArrivals.includes(p.id) ? 2 : 0) +
                      (rm.selections.payments.includes(p.id) ? 1 : 0);
                    return { ...p, pts };
                  })
                  .filter((p) => p.pts > 0)
                  .sort((a, b) => b.pts - a.pts)
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: p.color }}>
                          {p.name[0]}
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-secondary)", direction: "rtl" }}>{p.name}</span>
                      </div>
                      <span className="text-xs font-black" style={{ color: "#ffd700" }}>+{p.pts}</span>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Save Round button (floating, appears when all 3 confirmed) ─ */}
      <AnimatePresence>
        {allConfirmed && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed bottom-20 md:bottom-6 left-0 right-0 flex justify-center z-40 px-5"
          >
            <motion.button
              onClick={handleSaveRound}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-black text-white w-full max-w-sm justify-center"
              style={{
                background: "linear-gradient(135deg,#16a34a,#22c55e)",
                boxShadow: "0 0 40px rgba(34,197,94,0.45), 0 8px 32px rgba(0,0,0,0.4)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(34,197,94,0.6), 0 8px 40px rgba(0,0,0,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 8, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.5 }}
                className="text-2xl"
              >
                ⚽
              </motion.span>
              {isEditing
                ? (isAr ? "تحديث الجولة" : "Update Round")
                : (isAr ? "حفظ الجولة" : "Save Round")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Panels ────────────────────────────────────────────── */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        players={rm.players}
        language={language}
        onRenamePlayer={rm.renamePlayer}
        onAddPlayer={rm.addPlayer}
        onDeletePlayer={rm.deletePlayer}
        onResetLeague={rm.resetLeague}
        onExport={rm.exportData}
        onImport={rm.importData}
      />

      <EditRoundPanel
        open={editOpen}
        onClose={() => setEditOpen(false)}
        rounds={rm.rounds}
        players={rm.players}
        language={language}
        currentlyEditing={rm.editingRound}
        onSelectRound={handleLoadRound}
        onCancelEdit={handleCancelEdit}
      />

      {/* ── Confetti celebration ──────────────────────────────── */}
      <ConfettiEffect
        active={showConfetti}
        onDone={() => setShowConfetti(false)}
        language={language}
      />
    </div>
  );
}
