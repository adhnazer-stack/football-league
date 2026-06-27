"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Language } from "./i18n";

export type Theme = "dark" | "light";
export type RoundStatus = "idle" | "active" | "ended";
export type Page =
  | "home" | "standings" | "players" | "rounds" | "round-points"
  | "leaderboards" | "timeline" | "player-profile" | "round-management"
  | "hall-of-fame" | "league-history" | "admin";

const ADMIN_PW = "05560252003";

interface AppContextType {
  theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void;
  language: Language; setLanguage: (l: Language) => void; toggleLanguage: () => void;
  roundStatus: RoundStatus; currentRound: number;
  startRound: () => void; endRound: () => void;
  endRoundCelebrationVisible: boolean; dismissEndRoundCelebration: () => void;
  currentPage: Page;
  navigate: (page: Page, params?: { playerId?: string; roundNumber?: number }) => void;
  selectedPlayerId: string | null; selectedRoundNumber: number | null;
  isAdmin: boolean;
  adminLogin: (pw: string) => boolean;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("en");
  const [roundStatus, setRoundStatus] = useState<RoundStatus>("idle");
  const [currentRound] = useState(1);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number | null>(null);
  const [endRoundCelebrationVisible, setEndRoundCelebrationVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleTheme = useCallback(() => setTheme(p => p === "dark" ? "light" : "dark"), []);
  const toggleLanguage = useCallback(() => setLanguage(p => p === "en" ? "ar" : "en"), []);
  const startRound = useCallback(() => setRoundStatus("active"), []);
  const endRound = useCallback(() => {
    setRoundStatus("idle");
    setEndRoundCelebrationVisible(true);
  }, []);
  const dismissEndRoundCelebration = useCallback(() => setEndRoundCelebrationVisible(false), []);
  const navigate = useCallback((page: Page, params?: { playerId?: string; roundNumber?: number }) => {
    if (params?.playerId !== undefined) setSelectedPlayerId(params.playerId);
    if (params?.roundNumber !== undefined) setSelectedRoundNumber(params.roundNumber);
    setCurrentPage(page);
  }, []);
  const adminLogin = useCallback((pw: string): boolean => {
    if (pw === ADMIN_PW) { setIsAdmin(true); return true; }
    return false;
  }, []);
  const adminLogout = useCallback(() => {
    setIsAdmin(false);
    setCurrentPage("home");
  }, []);

  return (
    <AppContext.Provider value={{
      theme, setTheme, toggleTheme,
      language, setLanguage, toggleLanguage,
      roundStatus, currentRound, startRound, endRound,
      endRoundCelebrationVisible, dismissEndRoundCelebration,
      currentPage, navigate, selectedPlayerId, selectedRoundNumber,
      isAdmin, adminLogin, adminLogout,
    }}>
      <div data-theme={theme} dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen transition-colors duration-300">
        {children}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
