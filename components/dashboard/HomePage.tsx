"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import { PlayerStatsCard } from "./PlayerStatsCard";
import { RoundPointsCard } from "./RoundPointsCard";
import { FullStatsModal } from "./FullStatsModal";
import { FullRoundModal } from "./FullRoundModal";
import { PlayerProfileModal } from "./PlayerProfileModal";
import { LeagueHeader } from "./LeagueHeader";
import { MVPCard } from "./MVPCard";

function MatchTicker() {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const items = rm.stats
    .map((stat, idx) => {
      const player = rm.players.find(p => p.id === stat.playerId);
      if (!player) return null;
      const name = language === "ar" ? player.name : (player.nameEn ?? player.name);
      return `${idx + 1}. ${name.split(" ")[0]}  ${stat.totalPoints}pts`;
    })
    .filter(Boolean) as string[];

  if (items.length === 0) return null;

  const tickerContent = items.join("    ·    ");

  return (
    <div style={{
      background: "rgba(201,168,76,0.05)",
      borderBottom: "1px solid var(--gold-border)",
      overflow: "hidden",
      height: 34,
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    }}>
      {/* Label */}
      <div style={{
        flexShrink: 0,
        padding: "0 14px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: "rgba(201,168,76,0.12)",
        borderRight: "1px solid var(--gold-border)",
      }}>
        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.4em", color: "var(--gold)", whiteSpace: "nowrap" }}>
          {isAr ? "الترتيب" : "TABLE"}
        </span>
      </div>

      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div className="ticker-track"
          style={{ display: "inline-flex", gap: "80px", paddingInline: "40px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
            {tickerContent}
          </span>
          <span aria-hidden style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
            {tickerContent}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { language } = useApp();

  const [statsModalOpen,  setStatsModalOpen]  = useState(false);
  const [roundModalOpen,  setRoundModalOpen]  = useState(false);
  const [profilePlayerId, setProfilePlayerId] = useState<string | null>(null);

  const handlePlayerClick = (id: string) => {
    setProfilePlayerId(id);
    setStatsModalOpen(false);
  };

  return (
    <>
      {/* Live standings ticker */}
      <MatchTicker />

      {/* Championship hero — full bleed */}
      <LeagueHeader />

      {/* MVP spotlight — full bleed */}
      <MVPCard onPlayerClick={(id) => setProfilePlayerId(id)} />

      {/* Section divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Stats grid */}
      <section className="px-4 md:px-6 lg:px-8 pt-5 pb-28 md:pb-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.div
            className="min-h-[520px]"
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
            }}
          >
            <PlayerStatsCard
              onExpand={() => setStatsModalOpen(true)}
              onPlayerClick={handlePlayerClick}
            />
          </motion.div>

          <motion.div
            className="min-h-[520px]"
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26, delay: 0.06 } },
            }}
          >
            <RoundPointsCard onExpand={() => setRoundModalOpen(true)} />
          </motion.div>
        </motion.div>
      </section>

      <FullStatsModal
        open={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        language={language}
        onPlayerClick={handlePlayerClick}
      />

      <FullRoundModal
        open={roundModalOpen}
        onClose={() => setRoundModalOpen(false)}
        language={language}
      />

      <PlayerProfileModal
        playerId={profilePlayerId}
        onClose={() => setProfilePlayerId(null)}
        language={language}
      />
    </>
  );
}
