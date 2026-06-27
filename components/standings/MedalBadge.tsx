"use client";

import { motion } from "framer-motion";

interface MedalBadgeProps {
  rank: number;
  size?: "sm" | "md";
}

const MEDALS: Record<number, { emoji: string; glow: string; label: string }> = {
  1: { emoji: "🥇", glow: "0 0 14px rgba(255,215,0,0.7)", label: "Gold" },
  2: { emoji: "🥈", glow: "0 0 14px rgba(192,192,192,0.6)", label: "Silver" },
  3: { emoji: "🥉", glow: "0 0 14px rgba(205,127,50,0.6)", label: "Bronze" },
};

export function MedalBadge({ rank, size = "md" }: MedalBadgeProps) {
  const medal = MEDALS[rank];
  const textSize = size === "sm" ? "text-sm" : "text-base";

  if (medal) {
    return (
      <motion.span
        className={`${textSize} select-none inline-block`}
        style={{ filter: `drop-shadow(${medal.glow})` }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          filter: [
            `drop-shadow(${medal.glow})`,
            `drop-shadow(${medal.glow.replace("0.7","1.0").replace("0.6","0.9")}) drop-shadow(0 0 4px rgba(255,255,200,0.3))`,
            `drop-shadow(${medal.glow})`,
          ],
        }}
        transition={{
          scale:   { type: "spring", stiffness: 300 },
          opacity: { duration: 0.3 },
          filter:  { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: rank * 0.3 },
        }}
        title={medal.label}
      >
        {medal.emoji}
      </motion.span>
    );
  }

  return (
    <span
      className={`${size === "sm" ? "text-xs" : "text-sm"} font-bold tabular-nums`}
      style={{ color: "var(--text-muted)" }}
    >
      {rank}
    </span>
  );
}
