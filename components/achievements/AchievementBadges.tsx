"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { type Achievement, RARITY_COLORS } from "@/lib/achievements";

interface AchievementBadgesProps {
  unlocked: Achievement[];
  showLocked?: boolean;
  allAchievements?: Achievement[];
  language?: string;
  compact?: boolean;
}

export function AchievementBadges({
  unlocked,
  showLocked = false,
  allAchievements = [],
  language = "ar",
  compact = false,
}: AchievementBadgesProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const isAr = language === "ar";

  const unlockedIds = new Set(unlocked.map((a) => a.id));
  const locked = showLocked ? allAchievements.filter((a) => !unlockedIds.has(a.id)) : [];

  if (unlocked.length === 0 && !showLocked) {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <span className="text-3xl">🔒</span>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {isAr ? "لم يتم إلغاء قفل أي إنجاز بعد" : "No achievements unlocked yet"}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "gap-3"}`}>
      {/* Unlocked achievements */}
      {unlocked.map((ach) => (
        <div
          key={ach.id}
          className="relative"
          onMouseEnter={() => setHovered(ach.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div
            className="flex items-center gap-1.5 rounded-xl cursor-pointer"
            style={{
              padding: compact ? "4px 8px" : "6px 10px",
              background: `${ach.color}15`,
              border: `1px solid ${ach.color}40`,
              boxShadow: `0 0 8px ${ach.color}20`,
            }}
            whileHover={{ scale: 1.08, boxShadow: `0 0 16px ${ach.color}40` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span style={{ fontSize: compact ? 14 : 18 }}>{ach.icon}</span>
            {!compact && (
              <div>
                <p
                  className="text-[10px] font-black leading-tight"
                  style={{ color: ach.color }}
                >
                  {isAr ? ach.titleAr : ach.title}
                </p>
                <p
                  className="text-[8px] capitalize"
                  style={{ color: RARITY_COLORS[ach.rarity] }}
                >
                  {ach.rarity}
                </p>
              </div>
            )}
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {hovered === ach.id && (
              <motion.div
                className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none"
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <div
                  className="rounded-xl px-3 py-2 text-center whitespace-nowrap"
                  style={{
                    background: "rgba(5,8,16,0.95)",
                    border: `1px solid ${ach.color}40`,
                    boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
                  }}
                >
                  <p className="text-xs font-black" style={{ color: ach.color }}>
                    {ach.icon} {isAr ? ach.titleAr : ach.title}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {isAr ? ach.descriptionAr : ach.description}
                  </p>
                  <div
                    className="mt-1 text-[8px] px-1.5 py-0.5 rounded-full inline-block capitalize font-bold"
                    style={{ background: `${RARITY_COLORS[ach.rarity]}20`, color: RARITY_COLORS[ach.rarity] }}
                  >
                    {ach.rarity}
                  </div>
                </div>
                {/* Arrow */}
                <div
                  className="w-2 h-2 mx-auto rotate-45 -mt-1"
                  style={{ background: "rgba(5,8,16,0.95)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Locked achievements (dimmed) */}
      {locked.map((ach) => (
        <motion.div
          key={`locked-${ach.id}`}
          className="flex items-center gap-1.5 rounded-xl opacity-30"
          style={{
            padding: compact ? "4px 8px" : "6px 10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Lock size={compact ? 10 : 14} style={{ color: "var(--text-muted)" }} />
          {!compact && (
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {isAr ? ach.titleAr : ach.title}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
