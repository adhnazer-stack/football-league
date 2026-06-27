"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "@/lib/context";
import { t } from "@/lib/i18n";
import { getCumulativeStandings, getRoundStandings } from "@/lib/calculations";
import { leagueRounds } from "@/lib/league-data";
import { MedalBadge } from "@/components/standings/MedalBadge";

export function TimelinePage() {
  const { language, navigate } = useApp();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);

  const [expanded, setExpanded] = useState<number | null>(leagueRounds[leagueRounds.length - 1]?.number ?? null);

  const toggle = (round: number) => setExpanded((prev) => (prev === round ? null : round));

  return (
    <motion.section
      className="flex-1 px-4 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8 max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#00b4ff,#0066cc)" }} />
          <h1 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-primary)" }}>
            {tx("timelineTitle")}
          </h1>
        </div>
        <p className="text-xs ml-4" style={{ color: "var(--text-muted)" }}>
          {leagueRounds.length} {language === "ar" ? "جولات مكتملة" : "rounds completed"}
        </p>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Spine */}
        <div
          className="absolute left-[19px] top-0 bottom-0 w-0.5"
          style={{ background: "linear-gradient(180deg,rgba(0,180,255,0.4),rgba(0,100,220,0.1))" }}
        />

        <div className="space-y-3">
          {[...leagueRounds].reverse().map((round, i) => {
            const isOpen = expanded === round.number;
            const roundRows = getRoundStandings(round.number);
            const cumRows = getCumulativeStandings(round.number);
            const mvp = roundRows[0];
            const leader = cumRows[0];

            return (
              <motion.div
                key={round.number}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {/* Timeline node + header */}
                <div className="flex items-start gap-4">
                  {/* Node */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 relative z-10"
                    style={{
                      background: isOpen
                        ? "linear-gradient(135deg,#0078ff,#0044cc)"
                        : "rgba(10,18,36,0.9)",
                      border: `2px solid ${isOpen ? "#0078ff" : "rgba(255,255,255,0.12)"}`,
                      color: isOpen ? "#fff" : "var(--text-secondary)",
                      boxShadow: isOpen ? "0 0 16px rgba(0,120,255,0.4)" : "none",
                    }}
                  >
                    {round.number}
                  </div>

                  {/* Card */}
                  <div className="flex-1">
                    <button
                      className="w-full glass-card px-4 py-3 flex items-center gap-3 text-left"
                      style={{ borderRadius: "14px", cursor: "pointer" }}
                      onClick={() => toggle(round.number)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
                            {tx("roundN")} {round.number}
                            {round.label && (
                              <span className="ml-2 text-[10px] font-normal px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,120,255,0.2)", color: "#00b4ff" }}>
                                {round.label}
                              </span>
                            )}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{round.date}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {mvp && (
                            <span className="text-[10px]" style={{ color: "#ffd700" }}>
                              🏆 {language === "ar" ? mvp.player.nameAr : mvp.player.name} ({mvp.roundPoints} pts)
                            </span>
                          )}
                          {leader && (
                            <span className="text-[10px]" style={{ color: "#22c55e" }}>
                              📊 {language === "ar" ? leader.player.nameAr : leader.player.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 glass-card p-4" style={{ borderRadius: "14px" }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Round standings */}
                              <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "var(--text-muted)" }}>
                                  {tx("roundPoints")}
                                </p>
                                <div className="space-y-1.5">
                                  {roundRows.slice(0, 5).map((row) => (
                                    <div
                                      key={row.player.id}
                                      className="flex items-center gap-2 cursor-pointer"
                                      onClick={() => navigate("player-profile", { playerId: row.player.id })}
                                    >
                                      <MedalBadge rank={row.rank} size="sm" />
                                      <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                                        style={{ background: row.player.color }}
                                      >
                                        {row.player.initials[0]}
                                      </div>
                                      <span className="flex-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                                        {language === "ar" ? row.player.nameAr : row.player.name}
                                      </span>
                                      <span className="text-xs font-black" style={{ color: "#ffd700" }}>{row.roundPoints}</span>
                                      {row.earlyArrival && <span title="Early arrival" className="text-[10px]">⚡</span>}
                                      {row.sameDayPayment && <span title="Same day payment" className="text-[10px]">💰</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Cumulative after this round */}
                              <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "var(--text-muted)" }}>
                                  {language === "ar" ? "الترتيب بعد الجولة" : "Table After Round"}
                                </p>
                                <div className="space-y-1.5">
                                  {cumRows.slice(0, 5).map((row) => (
                                    <div
                                      key={row.player.id}
                                      className="flex items-center gap-2 cursor-pointer"
                                      onClick={() => navigate("player-profile", { playerId: row.player.id })}
                                    >
                                      <MedalBadge rank={row.rank} size="sm" />
                                      <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                                        style={{ background: row.player.color }}
                                      >
                                        {row.player.initials[0]}
                                      </div>
                                      <span className="flex-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                                        {language === "ar" ? row.player.nameAr : row.player.name}
                                      </span>
                                      <span className="text-xs font-black" style={{ color: "#ffd700" }}>{row.totalPoints}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
