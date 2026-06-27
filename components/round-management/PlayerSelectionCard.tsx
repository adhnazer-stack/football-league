"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
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
  onConfirm: () => void;
  confirmed: boolean;
  disabled: boolean;
  language: string;
}

export function PlayerSelectionCard({
  title, titleAr, icon, color, confirmLabel, confirmLabelAr,
  pointsLabel, players, selectedIds, onToggle, onConfirm,
  confirmed, disabled, language,
}: PlayerSelectionCardProps) {
  const [expanded, setExpanded] = useState(true);
  const isAr = language === "ar";

  const displayTitle = isAr ? titleAr : title;
  const displayConfirm = isAr ? confirmLabelAr : confirmLabel;

  const toggleExpanded = () => setExpanded((e) => !e);
  const handleConfirm = () => {
    onConfirm();
    setExpanded(false);
  };

  return (
    <motion.div
      className="glass-card flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled ? { y: -2 } : {}}
      style={{
        borderColor: confirmed ? `${color}55` : undefined,
        boxShadow: confirmed ? `0 0 20px ${color}22` : undefined,
      }}
    >
      {/* Card Header */}
      <button
        className="flex items-center justify-between px-5 py-4 w-full text-left"
        style={{ borderBottom: expanded ? "1px solid rgba(255,255,255,0.07)" : "none" }}
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${color}22`, border: `1px solid ${color}44` }}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
              {displayTitle}
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color }}>
              {pointsLabel}
            </p>
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
              {/* Selection count */}
              <p className="text-[10px] mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                {selectedIds.length > 0
                  ? `${selectedIds.length} ${isAr ? "لاعبين مختارون" : "players selected"}`
                  : isAr ? "اختر اللاعبين" : "Select players"}
              </p>

              {/* Player grid — 2 per row */}
              <div
                className="grid gap-2 mb-4"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                {players.map((player) => {
                  const isSelected = selectedIds.includes(player.id);
                  return (
                    <motion.button
                      key={player.id}
                      onClick={() => !disabled && onToggle(player.id)}
                      disabled={disabled}
                      className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-right"
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${color}33, ${color}22)`
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isSelected ? color + "66" : "rgba(255,255,255,0.08)"}`,
                        color: isSelected ? color : "var(--text-secondary)",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                      }}
                      whileHover={!disabled ? { scale: 1.02 } : {}}
                      whileTap={!disabled ? { scale: 0.97 } : {}}
                    >
                      {/* Player avatar */}
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
                      {isSelected && (
                        <motion.div
                          className="absolute top-1 right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check size={10} style={{ color }} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

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
                }}
                whileHover={!disabled && selectedIds.length > 0 ? { scale: 1.02 } : {}}
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
