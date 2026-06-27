"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MovementBadgeProps {
  movement: number; // positive = moved up, negative = moved down, 0 = same
}

export function MovementBadge({ movement }: MovementBadgeProps) {
  if (movement === 0) {
    return (
      <span className="flex items-center justify-center">
        <Minus size={12} style={{ color: "var(--text-muted)" }} />
      </span>
    );
  }

  const isUp = movement > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={movement}
        className="flex items-center justify-center gap-0.5"
        initial={{ opacity: 0, y: isUp ? 4 : -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isUp ? (
          <TrendingUp size={13} style={{ color: "#22c55e" }} />
        ) : (
          <TrendingDown size={13} style={{ color: "#ef4444" }} />
        )}
        <span
          className="text-[10px] font-bold tabular-nums"
          style={{ color: isUp ? "#22c55e" : "#ef4444" }}
        >
          {Math.abs(movement)}
        </span>
      </motion.span>
    </AnimatePresence>
  );
}
