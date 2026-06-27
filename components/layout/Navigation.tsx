"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  // Nav items — Round Management only for admin
  const navItems: { page: Page; icon: React.ReactNode; label: string }[] = [
    { page: "home",             icon: <LayoutDashboard size={18} />, label: isAr ? "لوحة الدوري" : "League Dashboard" },
    ...(isAdmin
      ? [{ page: "round-management" as Page, icon: <ClipboardList size={18} />, label: isAr ? "إدارة الجولة" : "Round Management" }]
      : []),
  ];

  const isActive = (page: Page) => currentPage === page;

  const handleEndRound = () => {
    rm.endCurrentRound();
    endRound();
  };

  return (
    <>
      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* ── Desktop nav ──────────────────────────────────────── */}
      <motion.nav
        className="hidden md:flex items-center justify-between px-6 py-3.5 relative z-50"
        style={{
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--nav-border)",
          backdropFilter: "blur(20px)",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        {/* Left: Logo + toggles */}
        <div className={cn("flex items-center gap-3", isAr && "flex-row-reverse")}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg,#c9963c,#ffd700)" }}>⚽</div>
            <span className="font-black text-sm tracking-widest uppercase hidden lg:block"
              style={{ background: "linear-gradient(135deg,#ffd700,#c9963c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              League
            </span>
          </div>
          <NavBtn onClick={toggleTheme} title={theme === "dark" ? "Light" : "Dark"}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            <span className="text-xs hidden lg:block">{theme === "dark" ? tx("lightMode") : tx("darkMode")}</span>
          </NavBtn>
          <NavBtn onClick={toggleLanguage} title={language === "en" ? "العربية" : "English"}>
            <Globe size={15} />
            <span className="text-xs hidden lg:block">{language === "en" ? "العربية" : "English"}</span>
          </NavBtn>
        </div>

        {/* Center: Nav pills */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200",
                isActive(item.page) ? "text-white" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {isActive(item.page) && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,215,0,0.2)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Admin + Round control */}
        <div className="flex items-center gap-2">
          {/* Admin round control — only when admin */}
          {isAdmin && (
            <>
              {roundStatus === "active" ? (
                <motion.button
                  onClick={handleEndRound}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", boxShadow: "0 0 20px rgba(220,38,38,0.4)" }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                >
                  <Square size={13} fill="white" />
                  {tx("endRound")}
                </motion.button>
              ) : (
                <motion.button
                  onClick={startRound}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#ffffff,#f0f0f0)", color: "#0a0f1e", boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                >
                  <Play size={13} fill="#0a0f1e" />
                  {tx("startRound")} {rm.currentRoundNumber}
                </motion.button>
              )}
            </>
          )}

          {/* Admin login button */}
          <motion.button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold"
            style={{
              background: isAdmin ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isAdmin ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: isAdmin ? "#22c55e" : "var(--text-muted)",
            }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          >
            {isAdmin ? <ShieldCheck size={15} /> : <Lock size={15} />}
            <span className="hidden lg:block text-xs">{isAdmin ? "Admin" : "Admin Login"}</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Mobile top bar ──────────────────────────────────── */}
      <motion.div
        className="md:hidden flex items-center justify-between px-4 py-3 relative z-50"
        style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)", backdropFilter: "blur(20px)" }}
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#c9963c,#ffd700)" }}>⚽</div>
          <span className="font-black text-xs tracking-wider uppercase" style={{ color: "#ffd700" }}>League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleTheme} className="nav-icon-btn">{theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}</button>
          <button onClick={toggleLanguage} className="nav-icon-btn"><Globe size={14} /></button>
          {isAdmin && roundStatus === "active" && (
            <button onClick={handleEndRound}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}>
              {tx("endRound")}
            </button>
          )}
          {isAdmin && roundStatus !== "active" && (
            <button onClick={startRound}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: "#ffffff", color: "#0a0f1e" }}>
              {tx("startRound")} {rm.currentRoundNumber}
            </button>
          )}
          <button
            onClick={() => setLoginOpen(true)}
            className="nav-icon-btn"
            style={{ color: isAdmin ? "#22c55e" : "var(--text-muted)", borderColor: isAdmin ? "rgba(34,197,94,0.3)" : undefined }}
          >
            {isAdmin ? <ShieldCheck size={14} /> : <Lock size={14} />}
          </button>
        </div>
      </motion.div>

      {/* ── Mobile bottom nav ────────────────────────────────── */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-4"
        style={{ background: "var(--nav-bg)", borderTop: "1px solid var(--nav-border)", backdropFilter: "blur(20px)" }}
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
      >
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className="flex flex-col items-center gap-1 px-6 py-1 rounded-xl"
          >
            <motion.span
              style={{ color: isActive(item.page) ? "#ffd700" : "var(--text-muted)" }}
              animate={{ scale: isActive(item.page) ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >{item.icon}</motion.span>
            <span className="text-[10px] font-semibold" style={{ color: isActive(item.page) ? "#ffd700" : "var(--text-muted)" }}>
              {item.label}
            </span>
            {isActive(item.page) && (
              <motion.div layoutId="mob-ind" className="w-6 h-0.5 rounded-full" style={{ background: "#ffd700" }} />
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
}

function NavBtn({ onClick, children, title }: { onClick?: () => void; children: React.ReactNode; title?: string }) {
  return (
    <motion.button onClick={onClick} title={title}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors duration-200"
      style={{ color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
    >{children}</motion.button>
  );
}
