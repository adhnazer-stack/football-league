"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";

export function MVPCard({ onPlayerClick }: { onPlayerClick?: (id: string) => void } = {}) {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const lastRound = rm.rounds.length > 0
    ? [...rm.rounds].sort((a, b) => b.roundNumber - a.roundNumber)[0]
    : null;

  if (!lastRound) return (
    <div style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div className="px-5 md:px-8 py-8 flex items-center gap-4">
        <Trophy size={32} style={{ color: "var(--gold)", opacity: 0.3 }} />
        <div>
          <p className="font-black text-base" style={{ color: "var(--text-muted)" }}>
            {isAr ? "MVP الجولة" : "ROUND MVP"}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)", opacity: 0.55 }}>
            {isAr ? "سيظهر هنا بعد أول جولة" : "Appears after the first round ends"}
          </p>
        </div>
      </div>
    </div>
  );

  /* Build per-player scores for this round */
  const scores: Record<string, { pts: number; wins: number; early: boolean; payment: boolean }> = {};
  lastRound.winners.forEach(id => {
    if (!scores[id]) scores[id] = { pts: 0, wins: 0, early: false, payment: false };
    scores[id].pts += 3; scores[id].wins++;
  });
  lastRound.earlyArrivals.forEach(id => {
    if (!scores[id]) scores[id] = { pts: 0, wins: 0, early: false, payment: false };
    scores[id].pts += 2; scores[id].early = true;
  });
  lastRound.payments.forEach(id => {
    if (!scores[id]) scores[id] = { pts: 0, wins: 0, early: false, payment: false };
    scores[id].pts += 1; scores[id].payment = true;
  });

  const entries = Object.entries(scores).sort((a, b) => b[1].pts - a[1].pts);
  if (entries.length === 0) return null;

  const [mvpId, mvpData] = entries[0];
  const mvpPlayer = rm.players.find(p => p.id === mvpId);
  if (!mvpPlayer) return null;

  const photo = rm.photos[mvpId];
  const displayName = language === "ar" ? mvpPlayer.name : (mvpPlayer.nameEn ?? mvpPlayer.name);

  return (
    <motion.div
      className="relative overflow-hidden vt-mvp"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--gold-border)",
        borderBottom: "1px solid var(--border)",
        cursor: onPlayerClick ? "pointer" : "default",
        minHeight: 148,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.1 }}
      whileTap={{ scale: 0.995, transition: { duration: 0.1 } }}
      onClick={() => onPlayerClick?.(mvpPlayer.id)}
    >
      {/* Gold left accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: 3, height: "100%",
        background: "linear-gradient(180deg,var(--gold) 0%,var(--gold-bright) 50%,var(--gold) 100%)",
      }} />

      {/* "MVP" ghost watermark */}
      <div style={{
        position: "absolute",
        right: photo ? 140 : -8,
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "clamp(5rem, 16vw, 9.5rem)",
        fontWeight: 900,
        color: "rgba(201,168,76,0.035)",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}>
        MVP
      </div>

      <div className={`relative flex items-stretch ${isAr ? "flex-row-reverse" : ""}`}
        style={{ minHeight: 148 }}>

        {/* Photo panel */}
        {photo && (
          <div className="relative flex-shrink-0" style={{ width: 130 }}>
            <img src={photo} alt={displayName}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover",
              }} />
            {/* Fade to bg */}
            <div style={{
              position: "absolute", inset: 0,
              background: isAr
                ? "linear-gradient(270deg,transparent 30%,var(--bg-surface) 100%)"
                : "linear-gradient(90deg,transparent 30%,var(--bg-surface) 100%)",
            }} />
          </div>
        )}

        {/* No-photo avatar */}
        {!photo && (
          <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 100 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg,${mvpPlayer.color},${mvpPlayer.color}66)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, color: "#fff",
            }}>
              {mvpPlayer.name[0]}
            </div>
          </div>
        )}

        {/* Star badge */}
        <div style={{
          position: "absolute", top: 10,
          left: isAr ? undefined : 10,
          right: isAr ? 10 : undefined,
          width: 24, height: 24, borderRadius: "50%",
          background: "var(--gold)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(201,168,76,0.5)",
          zIndex: 2,
        }}>
          <Star size={11} fill="white" color="white" />
        </div>

        {/* Info section */}
        <div className={`flex-1 min-w-0 flex flex-col justify-center px-6 py-5 ${isAr ? "items-end" : ""}`}>
          <div className="section-label mb-2">
            ⚽ {isAr ? `أفضل لاعب · جولة ${lastRound.roundNumber}` : `MVP · ROUND ${lastRound.roundNumber}`}
          </div>
          <div className="font-black leading-tight truncate"
            style={{
              fontSize: "clamp(1.5rem, 4.5vw, 2.6rem)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              direction: isAr ? "rtl" : "ltr",
            }}>
            {displayName}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {mvpData.wins > 0 && (
              <span className="football-chip football-chip-green">
                🏆 {isAr ? `×${mvpData.wins}` : `${mvpData.wins}W`}
              </span>
            )}
            {mvpData.early && (
              <span className="football-chip football-chip-blue">
                ⚡ {isAr ? "مبكر" : "Early +2"}
              </span>
            )}
            {mvpData.payment && (
              <span className="football-chip football-chip-violet">
                💰 {isAr ? "دفع +1" : "Paid +1"}
              </span>
            )}
          </div>
        </div>

        {/* Points display */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center px-5 py-5"
          style={{ borderLeft: isAr ? undefined : "1px solid var(--border)", borderRight: isAr ? "1px solid var(--border)" : undefined }}>
          <motion.div
            className="font-black leading-none"
            style={{ fontSize: "clamp(3.2rem, 8vw, 5rem)", color: "var(--gold)", letterSpacing: "-0.03em" }}
            key={mvpData.pts}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.25 }}
          >
            {mvpData.pts}
          </motion.div>
          <div className="section-label mt-1">
            {isAr ? "نقطة" : "PTS"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
