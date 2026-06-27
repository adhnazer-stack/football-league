"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { leagueRounds } from "@/lib/league-data";

interface RoundNavigationProps {
  selectedRound: number;
  onChange: (round: number) => void;
  maxRound?: number;
}

export function RoundNavigation({ selectedRound, onChange, maxRound }: RoundNavigationProps) {
  const { language } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const min = leagueRounds[0]?.number ?? 1;
  const max = maxRound ?? leagueRounds[leagueRounds.length - 1]?.number ?? 1;

  const canPrev = selectedRound > min;
  const canNext = selectedRound < max;

  const Prev = isRtl ? ChevronRight : ChevronLeft;
  const Next = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => canPrev && onChange(selectedRound - 1)}
        disabled={!canPrev}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: canPrev ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
          color: canPrev ? "var(--text-secondary)" : "var(--text-muted)",
          border: "1px solid rgba(255,255,255,0.07)",
          cursor: canPrev ? "pointer" : "not-allowed",
        }}
      >
        <Prev size={13} />
        <span className="hidden sm:inline">{tx("prevRound")}</span>
      </button>

      <motion.div
        key={selectedRound}
        className="px-4 py-1.5 rounded-lg text-sm font-black"
        style={{
          background: "linear-gradient(135deg,rgba(0,100,220,0.25),rgba(0,60,160,0.15))",
          border: "1px solid rgba(0,120,255,0.25)",
          color: "var(--text-primary)",
          minWidth: "100px",
          textAlign: "center",
        }}
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {tx("roundN")} {selectedRound}
      </motion.div>

      <button
        onClick={() => canNext && onChange(selectedRound + 1)}
        disabled={!canNext}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: canNext ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
          color: canNext ? "var(--text-secondary)" : "var(--text-muted)",
          border: "1px solid rgba(255,255,255,0.07)",
          cursor: canNext ? "pointer" : "not-allowed",
        }}
      >
        <span className="hidden sm:inline">{tx("nextRound")}</span>
        <Next size={13} />
      </button>
    </div>
  );
}
