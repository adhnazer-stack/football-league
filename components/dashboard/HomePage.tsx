"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { PlayerStatsCard } from "./PlayerStatsCard";
import { RoundPointsCard } from "./RoundPointsCard";
import { FullStatsModal } from "./FullStatsModal";
import { FullRoundModal } from "./FullRoundModal";
import { PlayerProfileModal } from "./PlayerProfileModal";
import { LeagueHeader } from "./LeagueHeader";
import { MVPCard } from "./MVPCard";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HomePage() {
  const { language } = useApp();

  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [profilePlayerId, setProfilePlayerId] = useState<string | null>(null);

  // Both PlayerStatsCard and FullStatsModal now use RM data directly, so IDs are rmp01, rmp02…
  const handlePlayerClick = (rmPlayerId: string) => {
    setProfilePlayerId(rmPlayerId);
    setStatsModalOpen(false);
  };

  return (
    <>
      <motion.section
        className="flex-1 px-4 md:px-6 lg:px-8 pt-5 pb-28 md:pb-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Premium League Header */}
        <motion.div variants={cardVariants}>
          <LeagueHeader />
        </motion.div>

        {/* MVP Card */}
        <motion.div variants={cardVariants}>
          <MVPCard onPlayerClick={(id) => setProfilePlayerId(id)} />
        </motion.div>

        {/* 2 cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div variants={cardVariants} className="min-h-[500px]">
            <PlayerStatsCard
              onExpand={() => setStatsModalOpen(true)}
              onPlayerClick={handlePlayerClick}
            />
          </motion.div>
          <motion.div variants={cardVariants} className="min-h-[500px]">
            <RoundPointsCard onExpand={() => setRoundModalOpen(true)} />
          </motion.div>
        </div>
      </motion.section>

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
