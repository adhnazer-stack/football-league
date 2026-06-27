"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getCumulativeStandings, type StandingRow } from "@/lib/calculations";
import { leagueRounds } from "@/lib/league-data";
import { MedalBadge } from "./MedalBadge";
import { MovementBadge } from "./MovementBadge";
import { RoundNavigation } from "./RoundNavigation";

type SortKey = "rank" | "totalPoints" | "wins" | "earlyArrivals" | "sameDayPayments";

export function LeagueTable() {
  const { language, navigate } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

  const maxRound = leagueRounds[leagueRounds.length - 1]?.number ?? 1;
  const [viewRound, setViewRound] = useState(maxRound);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => getCumulativeStandings(viewRound), [viewRound]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = q
      ? rows.filter((r) =>
          r.player.name.toLowerCase().includes(q) ||
          r.player.nameAr.includes(q)
        )
      : rows;

    if (sortKey !== "rank") {
      list = [...list].sort((a, b) => {
        const av = a[sortKey as keyof StandingRow] as number;
        const bv = b[sortKey as keyof StandingRow] as number;
        return sortAsc ? av - bv : bv - av;
      });
    } else if (!sortAsc) {
      list = [...list].reverse();
    }

    return list;
  }, [rows, search, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(key === "rank"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />
    ) : null;

  const colHdr = (label: string, col: SortKey, align = "text-right") => (
    <th
      className={`px-2 py-2 ${align} text-[10px] uppercase tracking-wider font-bold cursor-pointer select-none`}
      style={{ color: sortKey === col ? "#ffd700" : "var(--text-muted)" }}
      onClick={() => handleSort(col)}
    >
      <span className="inline-flex items-center gap-0.5 justify-end">
        {label} <SortIcon col={col} />
      </span>
    </th>
  );

  const zoneColor = (rank: number) => {
    if (rank === 1) return "rgba(255,215,0,0.06)";
    if (rank <= 3) return "rgba(0,100,220,0.05)";
    return "transparent";
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#3b82f6,#1e40af)" }} />
          <h2 className="text-base font-black" style={{ color: "var(--text-primary)" }}>
            {tx("currentLeagueStandings")}
          </h2>
        </div>
        <RoundNavigation selectedRound={viewRound} onChange={setViewRound} maxRound={maxRound} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tx("search")}
          className="w-full pl-8 pr-4 py-2 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm border-collapse min-w-[520px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {colHdr(tx("rank"), "rank", "text-center")}
              <th className="px-2 py-2 text-left text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>
                {tx("player")}
              </th>
              {colHdr(tx("totalPoints"), "totalPoints")}
              <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>
                {tx("movement")}
              </th>
              {colHdr(tx("wins"), "wins")}
              {colHdr(tx("earlyArrivals"), "earlyArrivals")}
              {colHdr(tx("sameDayPayments"), "sameDayPayments")}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.map((row, idx) => (
                <motion.tr
                  key={row.player.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  className="group cursor-pointer"
                  style={{
                    background: zoneColor(row.rank),
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                  onClick={() => navigate("player-profile", { playerId: row.player.id })}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  {/* Rank */}
                  <td className="px-2 py-2.5 text-center w-10">
                    <MedalBadge rank={row.rank} size="sm" />
                  </td>

                  {/* Player */}
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${row.player.color}cc,${row.player.color}66)` }}
                      >
                        {row.player.initials}
                      </div>
                      <span className="font-semibold text-xs" style={{ color: "var(--text-primary)" }}>
                        {language === "ar" ? row.player.nameAr : row.player.name}
                      </span>
                    </div>
                  </td>

                  {/* Total Points */}
                  <td className="px-2 py-2.5 text-right">
                    <span className="font-black text-sm" style={{ color: "#ffd700" }}>
                      {row.totalPoints}
                    </span>
                  </td>

                  {/* Movement */}
                  <td className="px-2 py-2.5">
                    <div className="flex justify-center">
                      <MovementBadge movement={row.movement} />
                    </div>
                  </td>

                  {/* Wins */}
                  <td className="px-2 py-2.5 text-right">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {row.wins}
                    </span>
                  </td>

                  {/* Early Arrivals */}
                  <td className="px-2 py-2.5 text-right">
                    <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>
                      {row.earlyArrivals}
                    </span>
                  </td>

                  {/* Same Day Payment */}
                  <td className="px-2 py-2.5 text-right">
                    <span className="text-xs font-semibold" style={{ color: "#00b4ff" }}>
                      {row.sameDayPayments}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
            No players found.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {[
          { color: "rgba(255,215,0,0.25)", label: language === "ar" ? "الصدارة" : "Leader" },
          { color: "rgba(0,100,220,0.25)", label: language === "ar" ? "المنصة" : "Podium" },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
            <div className="w-3 h-3 rounded-sm" style={{ background: z.color }} />
            {z.label}
          </div>
        ))}
      </div>
    </div>
  );
}
