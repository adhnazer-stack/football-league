"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";

export function MVPCard({ onPlayerClick }: { onPlayerClick?: (id: string) => void } = {}) {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  // Get last completed round
  const lastRound = rm.rounds.length > 0
    ? [...rm.rounds].sort((a, b) => b.roundNumber - a.roundNumber)[0]
    : null;

  if (!lastRound) return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center mb-5"
      style={{
        background: "linear-gradient(135deg,rgba(255,215,0,0.06),rgba(201,150,60,0.04))",
        border: "1px solid rgba(255,215,0,0.15)",
        minHeight: 160,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <span className="text-4xl">🏆</span>
      <p className="text-sm font-bold" style={{ color: "rgba(255,215,0,0.5)" }}>
        {isAr ? "لا توجد جولات مكتملة بعد" : "No completed rounds yet"}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {isAr ? "سيظهر MVP الجولة هنا بعد انتهاء أول جولة" : "MVP will appear here after the first round ends"}
      </p>
    </motion.div>
  );

  // Calculate scores for the last round
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

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl mb-5"
      style={{
        background: "linear-gradient(135deg,rgba(201,150,60,0.18) 0%,rgba(255,215,0,0.12) 40%,rgba(180,120,30,0.15) 100%)",
        border: "1px solid rgba(255,215,0,0.35)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.55 }}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,215,0,0.1) 0%, transparent 70%)" }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Top shimmer line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.6), transparent)",
      }} />

      <div
        className="relative px-5 py-5 flex items-center gap-5"
        style={{ cursor: onPlayerClick ? "pointer" : "default" }}
        onClick={() => mvpPlayer && onPlayerClick?.(mvpPlayer.id)}
      >
        {/* Trophy icon left */}
        <motion.div
          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,rgba(255,215,0,0.25),rgba(201,150,60,0.15))",
            border: "1px solid rgba(255,215,0,0.4)",
            boxShadow: "0 0 30px rgba(255,215,0,0.2)",
          }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,215,0,0.2)",
              "0 0 50px rgba(255,215,0,0.45)",
              "0 0 20px rgba(255,215,0,0.2)",
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Trophy size={28} style={{ color: "#ffd700" }} />
        </motion.div>

        {/* Center info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "rgba(255,215,0,0.7)" }}>
            {isAr ? "🏆 أفضل لاعب في الجولة" : "🏆 MVP OF THE ROUND"} — {isAr ? "جولة" : "Round"} {lastRound.roundNumber}
          </p>
          <p
            className="font-black text-xl leading-tight mb-2 truncate"
            style={{
              color: "#ffd700",
              direction: "rtl",
              textShadow: "0 0 20px rgba(255,215,0,0.4)",
            }}
          >
            {mvpPlayer.name}
          </p>
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {mvpData.wins > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                🏆 {isAr ? `فوز ×${mvpData.wins}` : `${mvpData.wins} Win${mvpData.wins > 1 ? "s" : ""}`}
              </span>
            )}
            {mvpData.early && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: "rgba(0,180,255,0.2)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.3)" }}>
                ⚡ {isAr ? "حضور مبكر" : "Early"}
              </span>
            )}
            {mvpData.payment && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: "rgba(139,92,246,0.2)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)" }}>
                💰 {isAr ? "دفع" : "Paid"}
              </span>
            )}
          </div>
        </div>

        {/* Points right */}
        <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
          <motion.p
            className="font-black leading-none"
            style={{ fontSize: 40, color: "#ffd700", textShadow: "0 0 30px rgba(255,215,0,0.6)" }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {mvpData.pts}
          </motion.p>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,215,0,0.6)" }}>
            {isAr ? "نقطة" : "PTS"}
          </p>
          {/* Avatar / Photo */}
          {rm.photos[mvpId] ? (
            <img
              src={rm.photos[mvpId]}
              alt={mvpPlayer.name}
              className="w-8 h-8 rounded-full object-cover mt-2"
              style={{ border: "2px solid rgba(255,215,0,0.5)" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white mt-2"
              style={{ background: `linear-gradient(135deg,${mvpPlayer.color},${mvpPlayer.color}99)`, border: "2px solid rgba(255,215,0,0.5)" }}
            >
              {mvpPlayer.name[0]}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
