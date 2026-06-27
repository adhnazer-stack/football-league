"use client";

import { useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  shape: "square" | "circle" | "star";
}

interface ConfettiEffectProps {
  active: boolean;
  onDone: () => void;
  language?: string;
}

const COLORS = ["#ffd700", "#22c55e", "#3b82f6", "#f97316", "#ec4899", "#8b5cf6", "#00b4ff", "#ef4444"];

function generateParticles(count = 70): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.8,
    duration: 1.2 + Math.random() * 1.5,
    size: 7 + Math.random() * 10,
    rotation: Math.random() * 720 - 360,
    shape: (["square", "circle", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function ConfettiEffect({ active, onDone, language = "ar" }: ConfettiEffectProps) {
  const particles = useMemo(() => (active ? generateParticles(70) : []), [active]);
  const isAr = language === "ar";

  const handleDone = useCallback(() => {
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(handleDone, 3200);
    return () => clearTimeout(timer);
  }, [active, handleDone]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[500] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />

          {/* Success card */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-5 px-10 py-8 rounded-3xl"
            style={{
              background: "rgba(10,18,36,0.95)",
              border: "1px solid rgba(34,197,94,0.3)",
              boxShadow: "0 0 60px rgba(34,197,94,0.2)",
            }}
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* Pulsing football icon */}
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              ⚽
            </motion.div>

            {/* Check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
            >
              <CheckCircle2 size={52} style={{ color: "#22c55e" }} strokeWidth={2} />
            </motion.div>

            {/* Text */}
            <div className="text-center">
              <motion.p
                className="text-2xl font-black mb-1"
                style={{ color: "#22c55e" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isAr ? "تم حفظ الجولة! 🎉" : "Round Saved! 🎉"}
              </motion.p>
              <motion.p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {isAr ? "تم تحديث الترتيب والإحصاءات" : "Standings and stats updated"}
              </motion.p>
            </div>
          </motion.div>

          {/* Confetti particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: "-20px",
                width: p.size,
                height: p.size,
                background: p.shape === "circle" ? p.color : undefined,
                borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : undefined,
                border: p.shape !== "circle" ? `2px solid ${p.color}` : undefined,
                animationName: "confettiFall",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationFillMode: "forwards",
                animationTimingFunction: "ease-in",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
