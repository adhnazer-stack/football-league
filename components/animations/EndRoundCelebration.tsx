"use client";

import { useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { useRM } from "@/lib/round-management-context";
import type { Language } from "@/lib/i18n";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  borderRadius: string;
}

const COLORS = ["#ffd700", "#22c55e", "#3b82f6", "#f97316", "#ec4899", "#8b5cf6", "#00b4ff"];

function makeParticles(n = 80): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 1.2,
    duration: 1.8 + Math.random() * 1.4,
    size: 6 + Math.random() * 10,
    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
  }));
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
  language: Language;
  roundNumber: number;
}

export function EndRoundCelebration({ visible, onDismiss, language, roundNumber }: Props) {
  const isAr = language === "ar";
  const particles = useMemo(() => (visible ? makeParticles() : []), [visible]);
  const rm = useRM();

  const dismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, 6000);
    return () => clearTimeout(t);
  }, [visible, dismiss]);

  const topPlayers = rm.stats.slice(0, 5);
  const champion = rm.stats[0];
  const championPlayer = champion ? rm.players.find((p) => p.id === champion.playerId) : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[600] flex items-center justify-center pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={dismiss}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          />

          {/* Confetti */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: "-20px",
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: p.borderRadius,
                animationName: "confettiFall",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationFillMode: "forwards",
                animationTimingFunction: "ease-in",
              }}
            />
          ))}

          {/* Main card */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-4 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #060c1a 0%, #050810 100%)",
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 80px rgba(255,215,0,0.2), 0 32px 80px rgba(0,0,0,0.6)",
            }}
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 z-20 nav-icon-btn"
            >
              <X size={16} />
            </button>

            {/* Trophy header */}
            <div
              className="text-center pt-8 pb-6 px-6"
              style={{
                background: "linear-gradient(180deg, rgba(255,215,0,0.08) 0%, transparent 100%)",
                borderBottom: "1px solid rgba(255,215,0,0.15)",
              }}
            >
              <motion.div
                className="text-6xl mb-4 inline-block"
                animate={{
                  rotate: [0, -8, 8, -5, 5, 0],
                  scale: [1, 1.15, 1.15, 1.1, 1.1, 1],
                }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                🏆
              </motion.div>

              <motion.h2
                className="text-2xl font-black mb-1"
                style={{ color: "#ffd700" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {isAr ? "انتهت الجولة بنجاح!" : "Round Finished!"}
              </motion.h2>

              <motion.p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {isAr ? `الجولة ${roundNumber - 1}` : `Round ${roundNumber - 1}`}
              </motion.p>
            </div>

            {/* Champion highlight */}
            {championPlayer && champion && (
              <motion.div
                className="mx-5 mt-5 p-4 rounded-2xl flex items-center gap-4"
                style={{
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  boxShadow: "0 0 24px rgba(255,215,0,0.12)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="text-3xl"
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  👑
                </motion.div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold mb-0.5" style={{ color: "#ffd700" }}>
                    {isAr ? "المتصدر" : "Current Leader"}
                  </p>
                  <p
                    className="font-black text-lg"
                    style={{ color: "var(--text-primary)", direction: "rtl" }}
                  >
                    {championPlayer.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color: "#ffd700" }}>
                    {champion.totalPoints}
                  </p>
                  <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                    {isAr ? "نقطة" : "pts"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Top 5 standings */}
            <div className="px-5 py-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                {isAr ? "الترتيب المحدّث" : "Updated Standings"}
              </p>
              {topPlayers.map((s, idx) => {
                const pl = rm.players.find((p) => p.id === s.playerId);
                if (!pl) return null;
                const isLeader = s.rank === 1;
                return (
                  <motion.div
                    key={s.playerId}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{
                      background: isLeader
                        ? "rgba(255,215,0,0.08)"
                        : "rgba(255,255,255,0.03)",
                      border: isLeader ? "1px solid rgba(255,215,0,0.2)" : "1px solid transparent",
                    }}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.08 }}
                  >
                    <span
                      className="text-sm font-black w-6 text-center"
                      style={{ color: isLeader ? "#ffd700" : "var(--text-muted)" }}
                    >
                      {s.rank === 1 ? "👑" : `${s.rank}`}
                    </span>
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                      style={{ background: pl.color }}
                    >
                      {pl.name[0]}
                    </div>
                    <span
                      className="flex-1 text-sm font-semibold"
                      style={{ color: "var(--text-primary)", direction: "rtl" }}
                    >
                      {pl.name}
                    </span>
                    {/* Movement */}
                    {s.movement > 0 ? (
                      <TrendingUp size={12} style={{ color: "#22c55e" }} />
                    ) : s.movement < 0 ? (
                      <TrendingDown size={12} style={{ color: "#ef4444" }} />
                    ) : (
                      <Minus size={12} style={{ color: "var(--text-muted)" }} />
                    )}
                    <span className="text-sm font-black w-8 text-right" style={{ color: isLeader ? "#ffd700" : "var(--text-primary)" }}>
                      {s.totalPoints}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Dismiss hint */}
            <div className="px-5 pb-5 pt-1 text-center">
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {isAr ? "انقر للإغلاق" : "Click anywhere to dismiss"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
