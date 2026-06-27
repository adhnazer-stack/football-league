"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { PlayerStatsCard } from "./PlayerStatsCard";
import { RoundPointsCard } from "./RoundPointsCard";
import { FullStatsModal } from "./FullStatsModal";
import { FullRoundModal } from "./FullRoundModal";
import { PlayerProfileModal } from "./PlayerProfileModal";
import { LeagueHeader } from "./LeagueHeader";
import { MVPCard } from "./MVPCard";

export function HomePage() {
  const { language } = useApp();

  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [profilePlayerId, setProfilePlayerId] = useState<string | null>(null);

  const handlePlayerClick = (rmPlayerId: string) => {
    setProfilePlayerId(rmPlayerId);
    setStatsModalOpen(false);
  };

  return (
    <>
      {/* Direction B: scroll-reveal on sections below fold */}
      <section className="flex-1 px-4 md:px-6 lg:px-8 pt-5 pb-28 md:pb-10">
        {/* League header — above fold, no scroll-reveal */}
        <LeagueHeader />

        {/* MVP card — scroll-reveal */}
        <div className="scroll-reveal">
          <MVPCard onPlayerClick={(id) => setProfilePlayerId(id)} />
        </div>

        {/* Stats grid — scroll-reveal with up variant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="min-h-[500px] scroll-reveal-up">
            <PlayerStatsCard
              onExpand={() => setStatsModalOpen(true)}
              onPlayerClick={handlePlayerClick}
            />
          </div>
          <div className="min-h-[500px] scroll-reveal-up" style={{ animationDelay:"80ms" }}>
            <RoundPointsCard onExpand={() => setRoundModalOpen(true)} />
          </div>
        </div>
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
