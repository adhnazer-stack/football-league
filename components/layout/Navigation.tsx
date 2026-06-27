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
    { page: "home",           icon: <LayoutDashboard size={16} />, label: isAr ? "لوحة الدوري" : "Dashboard" },
    ...(isAdmin
      ? [{ page: "round-management" as Page, icon: <ClipboardList size={16} />, label: isAr ? "إدارة الجولة" : "Manage" }]
      : []),
  ];

  const isActive = (page: Page) => currentPage === page;

  const handleEndRound = () => { rm.endCurrentRound(); endRound(); };

  return (
    <>
      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* ── Desktop nav ── */}
      <motion.nav
        className="hidden md:flex items-center justify-between px-6 py-3 relative z-50 vt-nav"
        style={{
          background: "rgba(0,1,6,0.96)",
          borderBottom: "1px solid rgba(255,215,0,0.1)",
          backdropFilter: "blur(24px)",
        }}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        {/* Left: Logo + controls */}
        <div className={cn("flex items-center gap-2", isAr && "flex-row-reverse")}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 mr-2">
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#0a1a08,#0f2a12)", border: "1px solid rgba(0,255,135,0.35)" }}
              animate={{ boxShadow: ["0 0 10px rgba(0,255,135,0.2)","0 0 24px rgba(0,255,135,0.45)","0 0 10px rgba(0,255,135,0.2)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              ⚽
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xs tracking-[0.25em] uppercase" style={{
                background:"linear-gradient(135deg,#ffd700,#ffe680)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              }}>LEAGUE</span>
              <span className="text-[8px] tracking-widest" style={{ color: "rgba(255,215,0,0.35)" }}>2025/26</span>
            </div>
          </div>

          {/* Theme + Lang */}
          <ControlBtn onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}
            <span className="text-[11px] hidden lg:block">{theme === "dark" ? tx("lightMode") : tx("darkMode")}</span>
          </ControlBtn>
          <ControlBtn onClick={toggleLanguage}>
            <Globe size={14}/>
            <span className="text-[11px] hidden lg:block">{language === "en" ? "عربي" : "EN"}</span>
          </ControlBtn>
        </div>

        {/* Center: Page nav */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors duration-200",
                isActive(item.page)
                  ? "text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {isActive(item.page) && (
                <motion.div
                  layoutId="nav-pill-desk"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)" }}
                  transition={{ type:"spring", stiffness:400, damping:28 }}
                />
              )}
              <span className="relative z-10" style={{ color: isActive(item.page) ? "#ffd700" : undefined }}>{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Admin controls */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isAdmin && (
              <motion.div
                key={roundStatus}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {roundStatus === "active" ? (
                  <motion.button
                    onClick={handleEndRound}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white"
                    style={{ background: "linear-gradient(135deg,#cc1a1a,#ef4444)", boxShadow: "0 0 18px rgba(239,68,68,0.35)" }}
                    whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(239,68,68,0.55)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Square size={12} fill="white"/>
                    {tx("endRound")}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={startRound}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black"
                    style={{ background: "linear-gradient(135deg,#00ff87,#00c86a)", color: "#000", boxShadow: "0 0 18px rgba(0,255,135,0.3)" }}
                    whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,255,135,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play size={12} fill="#000"/>
                    {tx("startRound")} {rm.currentRoundNumber}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            style={{
              background: isAdmin ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isAdmin ? "rgba(0,255,135,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: isAdmin ? "#00FF87" : "var(--text-muted)",
            }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          >
            {isAdmin ? <ShieldCheck size={14}/> : <Lock size={14}/>}
            <span className="hidden lg:block">{isAdmin ? "Admin" : "Login"}</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Mobile top bar ── */}
      <motion.div
        className="md:hidden flex items-center justify-between px-4 py-3 relative z-50"
        style={{ background:"rgba(0,1,6,0.97)", borderBottom:"1px solid rgba(255,215,0,0.09)", backdropFilter:"blur(24px)" }}
        initial={{ y:-60, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.45 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
            style={{ background:"linear-gradient(135deg,#0a1a08,#0f2a12)", border:"1px solid rgba(0,255,135,0.3)" }}
            animate={{ boxShadow:["0 0 8px rgba(0,255,135,0.15)","0 0 18px rgba(0,255,135,0.35)","0 0 8px rgba(0,255,135,0.15)"] }}
            transition={{ duration:2.5, repeat:Infinity }}
          >⚽</motion.div>
          <span className="font-black text-xs tracking-wider uppercase" style={{ color:"#ffd700" }}>LEAGUE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleTheme} className="nav-icon-btn">{theme==="dark"?<Sun size={13}/>:<Moon size={13}/>}</button>
          <button onClick={toggleLanguage} className="nav-icon-btn"><Globe size={13}/></button>
          {isAdmin && roundStatus==="active" && (
            <button onClick={handleEndRound}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-black text-white"
              style={{ background:"linear-gradient(135deg,#cc1a1a,#ef4444)" }}>
              {tx("endRound")}
            </button>
          )}
          {isAdmin && roundStatus!=="active" && (
            <button onClick={startRound}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-black"
              style={{ background:"linear-gradient(135deg,#00ff87,#00c86a)", color:"#000" }}>
              {tx("startRound")} {rm.currentRoundNumber}
            </button>
          )}
          <button
            onClick={() => setLoginOpen(true)}
            className="nav-icon-btn"
            style={{ color:isAdmin?"#00FF87":"var(--text-muted)", borderColor:isAdmin?"rgba(0,255,135,0.3)":undefined }}
          >
            {isAdmin?<ShieldCheck size={13}/>:<Lock size={13}/>}
          </button>
        </div>
      </motion.div>

      {/* ── Mobile bottom nav ── */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-4"
        style={{ background:"rgba(0,1,6,0.97)", borderTop:"1px solid rgba(255,215,0,0.09)", backdropFilter:"blur(24px)" }}
        initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.45, delay:0.15 }}
      >
        {navItems.map((item) => (
          <button key={item.page} onClick={() => navigate(item.page)}
            className="flex flex-col items-center gap-1 px-6 py-1">
            <motion.span
              style={{ color: isActive(item.page) ? "#ffd700" : "var(--text-muted)" }}
              animate={{ scale: isActive(item.page) ? 1.18 : 1 }}
              transition={{ type:"spring", stiffness:420, damping:20 }}
            >{item.icon}</motion.span>
            <span className="text-[10px] font-bold tracking-wide"
              style={{ color: isActive(item.page) ? "#ffd700" : "var(--text-muted)" }}>
              {item.label}
            </span>
            {isActive(item.page) && (
              <motion.div layoutId="mob-ind" className="w-5 h-0.5 rounded-full"
                style={{ background:"linear-gradient(90deg,#ffd700,#00FF87)" }} />
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
}

function ControlBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <motion.button onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
      style={{ color:"var(--text-muted)", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}
      whileHover={{ scale:1.04, color:"#ffd700", background:"rgba(255,215,0,0.06)", borderColor:"rgba(255,215,0,0.2)" }}
      whileTap={{ scale:0.97 }}
    >{children}</motion.button>
  );
}
