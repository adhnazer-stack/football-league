"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { Navigation } from "@/components/layout/Navigation";
import { StadiumBackground } from "@/components/layout/StadiumBackground";
import { HomePage } from "@/components/dashboard/HomePage";
import { RoundManagementPage } from "@/components/round-management/RoundManagementPage";
import { EndRoundCelebration } from "@/components/animations/EndRoundCelebration";
import { RoundManagementProvider } from "@/lib/round-management-context";
import { useApp } from "@/lib/context";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
};

const P = ({ children, k }: { children: React.ReactNode; k: string }) => (
  <motion.div key={k} className="flex-1 flex flex-col" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }}>
    {children}
  </motion.div>
);

function AppShell() {
  const { currentPage, language, currentRound, endRoundCelebrationVisible, dismissEndRoundCelebration } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <StadiumBackground />
      <Navigation />

      <AnimatePresence mode="wait">
        {currentPage === "home"             && <P k="home"><HomePage /></P>}
        {currentPage === "round-management" && <P k="round-management"><RoundManagementPage /></P>}
      </AnimatePresence>

      <EndRoundCelebration
        visible={endRoundCelebrationVisible}
        onDismiss={dismissEndRoundCelebration}
        language={language}
        roundNumber={currentRound}
      />
    </div>
  );
}

export default function Page() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <AnimatePresence>
        {splashDone && (
          <motion.div
            key="app"
            className="flex flex-col min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <RoundManagementProvider>
              <AppShell />
            </RoundManagementProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
