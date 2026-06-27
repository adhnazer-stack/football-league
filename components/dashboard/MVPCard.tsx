"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Coins, Star } from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import { SplitFlap } from "@/components/ui/SplitFlap";

export function MVPCard({ onPlayerClick }: { onPlayerClick?: (id: string) => void } = {}) {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const lastRound = rm.rounds.length > 0
    ? [...rm.rounds].sort((a, b) => b.roundNumber - a.roundNumber)[0]
    : null;

  if (!lastRound) return (
    <motion.div
      className="elite-card elite-card-gold mb-5 px-6 py-8 flex flex-col items-center justify-center gap-3 text-center"
      style={{ minHeight: 140 }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
    >
      <Trophy size={28} style={{ color: "var(--gold)" }} />
      <div>
        <p className="font-black text-sm mb-1" style={{ color: "var(--gold)" }}>
          {isAr ? "MVP الجولة" : "ROUND MVP"}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {isAr ? "سيظهر هنا بعد أول جولة" : "Appears after the first round ends"}
        </p>
      </div>
    </motion.div>
  );

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
  const pc = mvpPlayer.color || "var(--gold)";
  const displayName = language === "ar" ? mvpPlayer.name : (mvpPlayer.nameEn ?? mvpPlayer.name);

  return (
    <motion.div
      className="elite-card elite-card-gold mb-5 overflow-hidden vt-mvp"
      style={{ cursor: onPlayerClick ? "pointer" : "default" }}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 26, delay: 0.1 }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 22 } }}
      whileTap={{ scale: 0.985, transition: { type: "spring", stiffness: 500, damping: 24 } }}
      onClick={() => onPlayerClick?.(mvpPlayer.id)}
    >
      <div className="flex items-stretch gap-0">
        {/* LEFT: Photo or avatar */}
        <div className="flex-shrink-0 relative" style={{ width: 88, minHeight: 120 }}>
          {photo ? (
            <div className="w-full h-full absolute inset-0 overflow-hidden"
              style={{ borderRight: "1px solid var(--gold-border)" }}>
              <img src={photo} alt={mvpPlayer.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(90deg,transparent 55%,var(--card-bg) 100%)" }} />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{
                borderRight: "1px solid var(--gold-border)",
                background: `linear-gradient(145deg,${pc}18,${pc}06)`,
              }}>
              <Trophy size={32} style={{ color: "var(--gold)" }} />
            </div>
          )}

          {/* Star badge */}
          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--gold)", boxShadow: "0 2px 8px rgba(201,168,76,0.4)" }}>
            <Star size={11} fill="white" style={{ color: "white" }} />
          </div>
        </div>

        {/* CENTER: Info */}
        <div className="flex-1 min-w-0 px-4 py-4 flex flex-col justify-center gap-2.5">
          <div>
            <p className="text-[9px] font-black tracking-[0.35em] uppercase mb-1"
              style={{ color: "var(--gold-dim)", opacity: 0.7 }}>
              ⚽ {isAr ? "أفضل لاعب" : "MVP"} · {isAr ? "جولة" : "Round"} {lastRound.roundNumber}
            </p>
            <p className="font-black leading-tight truncate text-xl"
              style={{ color: "var(--text-primary)", direction: isAr ? "rtl" : "ltr" }}>
              {displayName}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {mvpData.wins > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black"
                style={{
                  background: "var(--green-subtle)",
                  color: "var(--green-bright)",
                  border: "1px solid var(--green-border)",
                }}>
                🏆 {isAr ? `×${mvpData.wins}` : `${mvpData.wins}W`}
              </span>
            )}
            {mvpData.early && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black"
                style={{
                  background: "var(--blue-subtle)",
                  color: "var(--blue-bright)",
                  border: "1px solid var(--blue-border)",
                }}>
                <Zap size={8} /> {isAr ? "مبكر" : "Early"}
              </span>
            )}
            {mvpData.payment && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black"
                style={{
                  background: "var(--violet-subtle)",
                  color: "var(--violet-bright)",
                  border: "1px solid var(--violet-border)",
                }}>
                <Coins size={8} /> {isAr ? "دفع" : "Paid"}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Points */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center px-5 py-4"
          style={{ borderLeft: "1px solid var(--gold-border)" }}>
          <SplitFlap
            value={mvpData.pts}
            className="font-black leading-none"
            style={{ fontSize: 48, color: "var(--gold)" }}
          />
          <p className="text-[9px] font-black tracking-[0.4em] uppercase mt-1"
            style={{ color: "var(--text-muted)" }}>
            {isAr ? "نقطة" : "PTS"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
