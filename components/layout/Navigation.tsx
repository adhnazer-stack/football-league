"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ClipboardList,
  Sun, Moon, Globe, Lock, Play, Square, ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import { t } from "@/lib/i18n";
import type { Page } from "@/lib/context";
import { cn } from "@/lib/utils";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";

export function Navigation() {
  const {
    theme, toggleTheme, language, toggleLanguage,
    roundStatus, startRound, endRound,
    currentPage, navigate, isAdmin,
  } = useApp();
  const rm = useRM();
  const tx = (k: Parameters<typeof t>[1]) => t(language, k);
  const isAr = language === "ar";
  const [loginOpen, setLoginOpen] = useState(false);

  const navItems: { page: Page; icon: React.ReactNode; label: string }[] = [
    { page: "home",           icon: <LayoutDashboard size={15} />, label: isAr ? "لوحة الدوري" : "Dashboard" },
    ...(isAdmin
      ? [{ page: "round-management" as Page, icon: <ClipboardList size={15} />, label: isAr ? "إدارة الجولة" : "Manage" }]
      : []),
  ];

  const isActive = (page: Page) => currentPage === page;
  const handleEndRound = () => { rm.endCurrentRound(); endRound(); };

  return (
    <>
      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* ── Desktop nav ── */}
      <motion.nav
        className="hidden md:flex items-center justify-between px-6 py-2.5 relative z-50 vt-nav"
        style={{
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--nav-border)",
          backdropFilter: "blur(16px)",
        }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.06 }}
      >
        {/* Left: League mark + controls */}
        <div className={cn("flex items-center gap-3", isAr && "flex-row-reverse")}>
          <LeagueMark />
          <div className={cn("leading-none", isAr && "text-right")}>
            <span className="font-black text-xs tracking-[0.22em] uppercase block"
              style={{ color: "var(--gold)" }}>LEAGUE</span>
            <span className="text-[9px] tracking-widest block"
              style={{ color: "var(--text-muted)" }}>2025/26</span>
          </div>

          <div className="w-px h-5 mx-1" style={{ background: "var(--border-strong)" }} />

          <button onClick={toggleTheme} className="nav-icon-btn">
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={toggleLanguage} className="nav-icon-btn">
            <Globe size={13} />
          </button>
        </div>

        {/* Center: Page nav */}
        <div className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors duration-150",
                isActive(item.page) ? "text-white" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {isActive(item.page) && (
                <motion.div
                  layoutId="nav-pill-desk"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--gold-subtle)", border: "1px solid var(--gold-border)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span className="relative z-10"
                style={{ color: isActive(item.page) ? "var(--gold)" : undefined }}>
                {item.icon}
              </span>
              <span className="relative z-10"
                style={{ color: isActive(item.page) ? "var(--text-primary)" : undefined }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Admin controls */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isAdmin && (
              <motion.div
                key={roundStatus}
                initial={{ opacity: 0, scale: 0.9, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 8 }}
                transition={{ duration: 0.18 }}
              >
                {roundStatus === "active" ? (
                  <motion.button
                    onClick={handleEndRound}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black text-white"
                    style={{ background: "var(--red)", boxShadow: "0 4px 14px rgba(220,38,38,0.3)" }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  >
                    <Square size={10} fill="white" />
                    {tx("endRound")}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={startRound}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black text-white"
                    style={{ background: "var(--green)", boxShadow: "0 4px 14px rgba(22,163,74,0.3)" }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  >
                    <Play size={10} fill="white" />
                    {tx("startRound")} {rm.currentRoundNumber}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold"
            style={{
              background: isAdmin ? "var(--green-subtle)" : "var(--bg-elevated)",
              border: `1px solid ${isAdmin ? "var(--green-border)" : "var(--border)"}`,
              color: isAdmin ? "var(--green-bright)" : "var(--text-muted)",
            }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          >
            {isAdmin ? <ShieldCheck size={13} /> : <Lock size={13} />}
            <span className="hidden lg:block">{isAdmin ? "Admin" : "Login"}</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Mobile top bar ── */}
      <motion.div
        className="md:hidden flex items-center justify-between px-4 py-2.5 relative z-50"
        style={{
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--nav-border)",
          backdropFilter: "blur(16px)",
        }}
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <LeagueMark size="sm" />
          <span className="font-black text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--gold)" }}>LEAGUE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleTheme} className="nav-icon-btn">
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={toggleLanguage} className="nav-icon-btn">
            <Globe size={13} />
          </button>
          {isAdmin && roundStatus === "active" && (
            <button onClick={handleEndRound}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-black text-white"
              style={{ background: "var(--red)" }}>
              {tx("endRound")}
            </button>
          )}
          {isAdmin && roundStatus !== "active" && (
            <button onClick={startRound}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-black text-white"
              style={{ background: "var(--green)" }}>
              {tx("startRound")} {rm.currentRoundNumber}
            </button>
          )}
          <button
            onClick={() => setLoginOpen(true)}
            className="nav-icon-btn"
            style={{
              color: isAdmin ? "var(--green-bright)" : undefined,
              borderColor: isAdmin ? "var(--green-border)" : undefined,
            }}
          >
            {isAdmin ? <ShieldCheck size={13} /> : <Lock size={13} />}
          </button>
        </div>
      </motion.div>

      {/* ── Mobile bottom nav ── */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-4"
        style={{
          background: "var(--nav-bg)",
          borderTop: "1px solid var(--nav-border)",
          backdropFilter: "blur(16px)",
        }}
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.12 }}
      >
        {navItems.map((item) => (
          <button key={item.page} onClick={() => navigate(item.page)}
            className="flex flex-col items-center gap-1 px-6 py-1">
            <motion.span
              style={{ color: isActive(item.page) ? "var(--gold)" : "var(--text-muted)" }}
              animate={{ scale: isActive(item.page) ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >{item.icon}</motion.span>
            <span className="text-[10px] font-bold tracking-wide"
              style={{ color: isActive(item.page) ? "var(--gold)" : "var(--text-muted)" }}>
              {item.label}
            </span>
            {isActive(item.page) && (
              <motion.div
                layoutId="mob-ind"
                className="w-4 h-0.5 rounded-full"
                style={{ background: "var(--gold)" }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
}

function LeagueMark({ size = "md" }: { size?: "sm" | "md" }) {
  const s = size === "sm" ? 28 : 36;
  const r = size === "sm" ? 8 : 10;
  return (
    <div style={{
      width: s, height: s, borderRadius: r,
      background: "linear-gradient(145deg,#0b5a0d,#073507)",
      border: "1px solid var(--gold-border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.12)",
      flexShrink: 0, position: "relative", overflow: "hidden",
    }}>
      <svg viewBox="0 0 36 36" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}>
        <line x1="18" y1="3" x2="18" y2="33" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" />
        <ellipse cx="18" cy="18" rx="6" ry="9" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" fill="none" />
        <rect x="3" y="11" width="7" height="14" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
        <rect x="26" y="11" width="7" height="14" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
      </svg>
      <span style={{ fontSize: size === "sm" ? 13 : 17, position: "relative", zIndex: 1 }}>⚽</span>
    </div>
  );
}
