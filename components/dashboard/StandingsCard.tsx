"use client";

import { motion, type Variants } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getCumulativeStandings } from "@/lib/calculations";
import { leagueRounds, CURRENT_ROUND } from "@/lib/league-data";
import { MedalBadge } from "@/components/standings/MedalBadge";
import { MovementBadge } from "@/components/standings/MovementBadge";
import { NumberTicker } from "@/components/magicui/number-ticker";

const rowIn: Variants = {
  hidden: { opacity: 0, x: -10, scale: 0.97 },
  show:   { opacity: 1, x: 0,   scale: 1, transition: { type: "spring", stiffness: 340, damping: 26 } },
};
const listIn: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};

export function StandingsCard({ onExpand }: { onExpand?: () => void }) {
  const { language } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isRtl = language === "ar";

  const maxRound = leagueRounds[leagueRounds.length - 1]?.number ?? CURRENT_ROUND;
  const rows = getCumulativeStandings(maxRound);

  return (
    <motion.div
      className="glass-card flex flex-col overflow-hidden cursor-pointer"
      whileHover={{ y:-5, transition:{ type:"spring", stiffness:380, damping:22 } }}
      whileTap={{ scale:0.985, transition:{ type:"spring", stiffness:500, damping:24 } }}
      onClick={onExpand}
      layout
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--gold-subtle)", border: "1px solid var(--gold-border)" }}
          >
            <Trophy size={17} style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
              {tx("currentLeagueStandings")}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tx("round")} {maxRound} · {tx("season")}
            </p>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          whileHover={{ color: "var(--gold)" }}
          whileTap={{ scale:0.95 }}
          onClick={(e) => { e.stopPropagation(); onExpand?.(); }}
        >
          {tx("viewAll")}
          <ArrowRight size={12} className={isRtl ? "rotate-180" : ""} />
        </motion.button>
      </div>

      {/* Column headers */}
      <div
        className="grid px-4 py-2 text-[10px] font-semibold tracking-wider uppercase"
        style={{
          gridTemplateColumns: "32px 1fr 44px 32px 32px 36px",
          color: "var(--text-muted)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <span className="text-center">{tx("rank")}</span>
        <span>{tx("player")}</span>
        <span className="text-right">{tx("totalPoints")}</span>
        <span className="text-center">{tx("movement")}</span>
        <span className="text-right">{tx("wins")}</span>
        <span className="text-right">{tx("earlyArrivals")}</span>
      </div>

      {/* Rows — Direction B: @property champion beam applied via CSS on .row-rank-1 */}
      <div className="flex-1 overflow-auto">
        <motion.div variants={listIn} initial="hidden" animate="show">
          {rows.map((row, idx) => {
            const zoneColor =
              row.rank === 1 ? "var(--gold-subtle)"
              : row.rank <= 3 ? "var(--blue-subtle)"
              : "transparent";

            return (
              <motion.div
                key={row.player.id}
                className={`grid px-4 py-2.5 text-xs items-center ${
                  row.rank === 1 ? "row-rank-1" : row.rank === 2 ? "row-rank-2" : row.rank === 3 ? "row-rank-3" : ""
                }`}
                style={{
                  gridTemplateColumns: "32px 1fr 44px 32px 32px 36px",
                  background: zoneColor,
                  borderBottom: "1px solid var(--border-subtle)",
                  position: "relative",
                }}
                variants={rowIn}
                whileHover={{ background: row.rank <= 3 ? undefined : "var(--bg-hover)" }}
              >
                <div className="flex justify-center" style={{ position:"relative", zIndex:2 }}>
                  <MedalBadge rank={row.rank} size="sm" />
                </div>
                <div className="flex items-center gap-2 min-w-0" style={{ position:"relative", zIndex:2 }}>
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black text-white"
                    style={{ background: `linear-gradient(135deg,${row.player.color},${row.player.color}88)` }}
                  >
                    {row.player.initials[0]}
                  </div>
                  <span className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {language === "ar" ? row.player.nameAr : row.player.name.split(" ")[0]}
                  </span>
                </div>
                {/* Direction A: NumberTicker on champion's points */}
                <span className="text-right font-black" style={{ color: "var(--gold)", position:"relative", zIndex:2 }}>
                  {row.rank === 1 ? (
                    <NumberTicker value={row.totalPoints} />
                  ) : (
                    row.totalPoints
                  )}
                </span>
                <div className="flex justify-center" style={{ position:"relative", zIndex:2 }}>
                  <MovementBadge movement={row.movement} />
                </div>
                <span className="text-right font-medium" style={{ color: "var(--green-bright)", position:"relative", zIndex:2 }}>
                  {row.wins}
                </span>
                <span className="text-right" style={{ color: "var(--blue-bright)", position:"relative", zIndex:2 }}>
                  {row.earlyArrivals}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 px-4 py-3 text-[10px]"
        style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--gold-border)" }} />
          {language === "ar" ? "الصدارة" : "Leader"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--blue-border)" }} />
          {language === "ar" ? "المنصة" : "Podium"}
        </span>
        <span className="ms-auto" style={{ color: "var(--text-muted)" }}>
          WIN=3 · EA=1 · SDP=1
        </span>
      </div>
    </motion.div>
  );
}
