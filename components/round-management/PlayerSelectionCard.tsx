"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Check, ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react";
import type { RMPlayer } from "@/lib/round-management-data";

interface PlayerSelectionCardProps {
  title: string;
  titleAr: string;
  icon: string;
  color: string;
  confirmLabel: string;
  confirmLabelAr: string;
  pointsLabel: string;
  players: RMPlayer[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onConfirm: () => void;
  confirmed: boolean;
  disabled: boolean;
  language: string;
}

const playerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.22 } },
};
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export function PlayerSelectionCard({
  title, titleAr, icon, color, confirmLabel, confirmLabelAr,
  pointsLabel, players, selectedIds, onToggle, onSelectAll, onClearAll,
  onConfirm, confirmed, disabled, language,
}: PlayerSelectionCardProps) {
  const [expanded, setExpanded] = useState(true);
  const isAr = language === "ar";

  const displayTitle   = isAr ? titleAr : title;
  const displayConfirm = isAr ? confirmLabelAr : confirmLabel;
  const allSelected    = players.length > 0 && players.every((p) => selectedIds.includes(p.id));

  const toggleExpanded = () => setExpanded((e) => !e);
  const handleConfirm  = () => { onConfirm(); setExpanded(false); };

  return (
    <motion.div
      className="glass-card flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled ? { y: -2 } : {}}
      style={{
        borderColor: confirmed ? `${color}55` : undefined,
        boxShadow:   confirmed ? `0 0 24px ${color}28` : undefined,
      }}
    >
      {/* Card Header */}
      <button
        className="flex items-center justify-between px-5 py-4 w-full text-left"
        style={{ borderBottom: expanded ? "1px solid rgba(255,255,255,0.07)" : "none" }}
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${color}22`, border: `1px solid ${color}44` }}
            whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.35 }}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{displayTitle}</h3>
            <p className="text-[10px] mt-0.5" style={{ color }}>{pointsLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {confirmed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: `${color}22`, color }}
            >
              <Check size={10} />
              {selectedIds.length} {isAr ? "مختارون" : "selected"}
            </motion.div>
          )}
          <div style={{ color: "var(--text-muted)" }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-3 pb-4">
              {/* Selection count + Select All row */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                  {selectedIds.length > 0
                    ? `${selectedIds.length} ${isAr ? "لاعبين مختارون" : "players selected"}`
                    : isAr ? "اختر اللاعبين" : "Select players"}
                </p>

                {/* Select All / Clear All toggle */}
                <motion.button
                  onClick={() => allSelected ? onClearAll() : onSelectAll()}
                  disabled={disabled}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  style={{
                    background: allSelected ? `${color}22` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${allSelected ? color + "55" : "rgba(255,255,255,0.1)"}`,
                    color: allSelected ? color : "var(--text-muted)",
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                  whileHover={!disabled ? { scale: 1.05 } : {}}
                  whileTap={!disabled ? { scale: 0.95 } : {}}
                >
                  <motion.span
                    key={String(allSelected)}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {allSelected
                      ? <Square size={10} />
                      : <CheckSquare size={10} />
                    }
                  </motion.span>
                  {allSelected
                    ? (isAr ? "إلغاء الكل" : "Clear All")
                    : (isAr ? "تحديد الكل" : "Select All")}
                </motion.button>
              </div>

              {/* Player grid — 2 per row */}
              <motion.div
                className="grid gap-2 mb-4"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                variants={gridVariants}
                initial="hidden"
                animate="show"
              >
                {players.map((player) => {
                  const isSelected = selectedIds.includes(player.id);
                  return (
                    <motion.button
                      key={player.id}
                      variants={playerVariants}
                      onClick={() => !disabled && onToggle(player.id)}
                      disabled={disabled}
                      className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-right"
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${color}33, ${color}22)`
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isSelected ? color + "66" : "rgba(255,255,255,0.08)"}`,
                        color:  isSelected ? color : "var(--text-secondary)",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                        boxShadow: isSelected ? `0 0 12px ${color}22` : "none",
                      }}
                      whileHover={!disabled ? { scale: 1.03, y: -1 } : {}}
                      whileTap={!disabled ? { scale: 0.96 } : {}}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg,${player.color},${player.color}aa)`
                            : "rgba(255,255,255,0.15)",
                        }}
                      >
                        {player.name[0]}
                      </div>
                      <span className="truncate text-xs" style={{ direction: "rtl" }}>
                        {player.name}
                      </span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            className="absolute top-1 right-1"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check size={10} style={{ color }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Confirm button */}
              <motion.button
                onClick={handleConfirm}
                disabled={disabled || selectedIds.length === 0}
                className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background:
                    disabled || selectedIds.length === 0
                      ? "rgba(255,255,255,0.05)"
                      : `linear-gradient(135deg,${color},${color}cc)`,
                  color:
                    disabled || selectedIds.length === 0
                      ? "var(--text-muted)"
                      : "#fff",
                  cursor: disabled || selectedIds.length === 0 ? "not-allowed" : "pointer",
                  boxShadow: selectedIds.length > 0 && !disabled ? `0 4px 20px ${color}44` : "none",
                }}
                whileHover={!disabled && selectedIds.length > 0 ? { scale: 1.02, y: -1 } : {}}
                whileTap={!disabled && selectedIds.length > 0 ? { scale: 0.97 } : {}}
              >
                <Check size={15} />
                {displayConfirm}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
