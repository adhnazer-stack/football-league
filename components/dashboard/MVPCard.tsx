"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
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
    <motion.div
      className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center mb-5"
      style={{
        background: "linear-gradient(135deg,rgba(255,215,0,0.04),rgba(201,150,60,0.02))",
        border: "1px solid rgba(255,215,0,0.12)",
        minHeight: 160,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <span className="text-4xl">🏆</span>
      <p className="text-sm font-bold" style={{ color: "rgba(255,215,0,0.4)" }}>
        {isAr ? "لا توجد جولات مكتملة بعد" : "No completed rounds yet"}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {isAr ? "سيظهر MVP الجولة هنا بعد انتهاء أول جولة" : "MVP will appear after the first round"}
      </p>
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
  const playerColor = mvpPlayer.color || "#ffd700";
  const displayName = language === "ar" ? mvpPlayer.name : (mvpPlayer.nameEn ?? mvpPlayer.name);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl mb-5"
      style={{
        background: "linear-gradient(145deg,rgba(6,10,24,0.98) 0%,rgba(10,16,36,0.96) 100%)",
        border: "1px solid rgba(255,215,0,0.28)",
        boxShadow: "0 0 0 1px rgba(255,215,0,0.06) inset, 0 8px 48px rgba(0,0,0,0.6)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.55 }}
    >
      {/* Player color ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 80% at 0% 50%, ${playerColor}18 0%, transparent 65%)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />
      {/* Gold top edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.75),rgba(255,255,255,0.4),rgba(255,215,0,0.75),transparent)",
      }} />

      <div
        className="relative px-4 py-4 flex items-center gap-4"
        style={{ cursor: onPlayerClick ? "pointer" : "default" }}
        onClick={() => mvpPlayer && onPlayerClick?.(mvpPlayer.id)}
      >
        {/* LEFT: Large player photo or trophy fallback */}
        <motion.div
          className="flex-shrink-0 relative"
          animate={{
            filter: [
              `drop-shadow(0 0 10px ${playerColor}44)`,
              `drop-shadow(0 0 26px ${playerColor}88)`,
              `drop-shadow(0 0 10px ${playerColor}44)`,
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          {photo ? (
            <div
              className="w-[72px] h-[72px] rounded-2xl overflow-hidden"
              style={{
                border: "2px solid rgba(255,215,0,0.55)",
                boxShadow: `0 0 28px rgba(255,215,0,0.22), 0 0 0 1px ${playerColor}33`,
              }}
            >
              <img src={photo} alt={mvpPlayer.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <motion.div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg,rgba(255,215,0,0.22),rgba(201,150,60,0.12))`,
                border: "2px solid rgba(255,215,0,0.45)",
                boxShadow: "0 0 30px rgba(255,215,0,0.2)",
              }}
              animate={{
                boxShadow: [
                  "0 0 18px rgba(255,215,0,0.18)",
                  "0 0 44px rgba(255,215,0,0.42)",
                  "0 0 18px rgba(255,215,0,0.18)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Trophy size={30} style={{ color: "#ffd700" }} />
            </motion.div>
          )}
          {/* Star crown badge */}
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
            style={{
              background: "linear-gradient(135deg,#ffd700,#c9963c)",
              boxShadow: "0 0 14px rgba(255,215,0,0.55)",
            }}
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            ⭐
          </motion.div>
        </motion.div>

        {/* CENTER: Player info */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(255,215,0,0.6)" }}>
            {isAr ? "⚽ أفضل لاعب في الجولة" : "⚽ MVP OF THE ROUND"} {lastRound.roundNumber}
          </p>
          <p
            className="font-black text-xl leading-tight truncate mb-2"
            style={{
              color: "#ffffff",
              textShadow: `0 0 22px ${playerColor}55, 0 0 48px ${playerColor}22`,
              direction: "rtl",
            }}
          >
            {displayName}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mvpData.wins > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black"
                style={{ background: "rgba(34,197,94,0.14)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.28)" }}>
                🏆 {isAr ? `فوز ×${mvpData.wins}` : `${mvpData.wins}W`}
              </span>
            )}
            {mvpData.early && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black"
                style={{ background: "rgba(0,180,255,0.14)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.28)" }}>
                ⚡ {isAr ? "مبكر" : "Early"}
              </span>
            )}
            {mvpData.payment && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black"
                style={{ background: "rgba(139,92,246,0.14)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.28)" }}>
                💰 {isAr ? "دفع" : "Paid"}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Points */}
        <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
          <motion.p
            className="font-black leading-none"
            style={{ fontSize: 46, color: "#ffd700", textShadow: "0 0 30px rgba(255,215,0,0.65), 0 0 60px rgba(255,215,0,0.3)" }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {mvpData.pts}
          </motion.p>
          <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: "rgba(255,215,0,0.55)" }}>
            {isAr ? "نقطة" : "PTS"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
