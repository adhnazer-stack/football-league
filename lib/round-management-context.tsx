"use client";

import { createContext, useContext } from "react";
import { useRoundManagement } from "./round-management-store";

/* The context value is exactly what useRoundManagement() returns */
type RMContextValue = ReturnType<typeof useRoundManagement>;

const RMContext = createContext<RMContextValue | null>(null);

export function RoundManagementProvider({ children }: { children: React.ReactNode }) {
  const rm = useRoundManagement();
  return <RMContext.Provider value={rm}>{children}</RMContext.Provider>;
}

/* Drop-in replacement for useRoundManagement() — reads from shared context */
export function useRM(): RMContextValue {
  const ctx = useContext(RMContext);
  if (!ctx) throw new Error("useRM must be used inside <RoundManagementProvider>");
  return ctx;
}
