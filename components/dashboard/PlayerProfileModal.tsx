"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, Trophy, Zap, CreditCard, Camera } from "lucide-react";
import { useRef } from "react";
import { useRM } from "@/lib/round-management-context";
import { useApp } from "@/lib/context";
import type { Language } from "@/lib/i18n";

interface Props {
  playerId: string | null;
  onClose: () => void;
  language: Language;
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 320;
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function PlayerProfileModal({ playerId, onClose, language }: Props) {
  const rm        = useRM();
  const { isAdmin } = useApp();
  const isAr      = language === "ar";
  const fileRef   = useRef<HTMLInputElement>(null);

  const player = playerId ? rm.players.find((p) => p.id === playerId) : null;
  const stats  = playerId ? rm.stats.find((s) => s.playerId === playerId) : null;
  const photo  = playerId ? rm.photos[playerId] : null;

  // Per-round performance
  const rounds    = [...rm.rounds].sort((a, b) => a.roundNumber - b.roundNumber);
  const roundPerf = rounds.map((round) => {
    const won   = round.winners.includes(playerId ?? "");
    const early = round.earlyArrivals.includes(playerId ?? "");
    const paid  = round.payments.includes(playerId ?? "");
    const pts   = (won ? 3 : 0) + (early ? 2 : 0) + (paid ? 1 : 0);
    return { roundNumber: round.roundNumber, pts, won, early, paid, date: round.date };
  });

  const roundsWithActivity = roundPerf.filter((r) => r.pts > 0);
  const bestRoundPts       = roundPerf.length ? Math.max(...roundPerf.map((r) => r.pts)) : 0;
  const recentForm         = [...roundPerf].reverse().slice(0, 5);

  const rank     = stats?.rank ?? 0;
  const movement = stats?.movement ?? 0;

  const rankColors: Record<number, string> = { 1: "#ffd700", 2: "#c0c0c0", 3: "#cd7f32" };
  const rankColor = rankColors[rank] ?? "var(--text-muted)";
  const rankEmoji = rank === 1 ? "👑" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !playerId) return;
    try {
      const dataURL = await resizeImage(file);
      rm.savePhoto(playerId, dataURL);
    } catch {}
    e.target.value = "";
  };

  return (
    <AnimatePresence>
      {playerId && player && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[300]"
            style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed z-[301] inset-x-3 top-4 bottom-4 mx-auto max-w-lg flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-subtle)",
              boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${player.color}18`,
            }}
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* ── Hero header ── */}
            <div className="relative flex-shrink-0 px-5 pt-5 pb-4"
              style={{
                background: `linear-gradient(135deg, ${player.color}22 0%, ${player.color}08 100%)`,
                borderBottom: "1px solid var(--border-subtle)",
              }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${player.color}18 0%, transparent 70%)` }} />

              <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center z-10"
                style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-muted)" }}>
                <X size={15} />
              </button>

              <div className="relative flex items-center gap-4">
                {/* Avatar / Photo */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className="w-18 h-18 rounded-2xl overflow-hidden flex items-center justify-center"
                    style={{
                      width: 72, height: 72,
                      background: photo ? "transparent" : `linear-gradient(135deg,${player.color},${player.color}bb)`,
                      boxShadow: `0 0 30px ${player.color}55`,
                      border: `2px solid ${player.color}88`,
                    }}
                    animate={{ boxShadow: [`0 0 20px ${player.color}40`, `0 0 45px ${player.color}70`, `0 0 20px ${player.color}40`] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    {photo ? (
                      <img src={photo} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-white">{player.name[0]}</span>
                    )}
                  </motion.div>
                  {/* Admin photo button overlay */}
                  {isAdmin && (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                        border: "2px solid var(--card-bg)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                      title={isAr ? "تغيير الصورة" : "Change photo"}>
                      <Camera size={13} style={{ color: "#fff" }} />
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {rankEmoji && <span className="text-xl">{rankEmoji}</span>}
                    <p className="font-black text-xl leading-tight truncate" style={{ color: "var(--text-primary)", direction: "rtl" }}>
                      {player.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: `${rankColor}18`, color: rankColor, border: `1px solid ${rankColor}30` }}>
                      {isAr ? "المركز" : "Rank"} #{rank}
                    </span>
                    {movement > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#22c55e" }}>
                        <TrendingUp size={11} /> +{movement}
                      </span>
                    )}
                    {movement < 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#ef4444" }}>
                        <TrendingDown size={11} /> {movement}
                      </span>
                    )}
                    {movement === 0 && rank > 0 && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Minus size={11} /> {isAr ? "ثابت" : "Stable"}
                      </span>
                    )}
                  </div>
                  {/* Admin change photo text button */}
                  {isAdmin && (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="mt-2 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(59,130,246,0.12)",
                        color: "#60a5fa",
                        border: "1px solid rgba(59,130,246,0.25)",
                      }}>
                      <Camera size={10} /> {isAr ? "📷 تغيير صورة اللاعب" : "📷 Change Player Photo"}
                    </button>
                  )}
                </div>

                {/* Total points */}
                <div className="text-right flex-shrink-0">
                  <p className="font-black leading-none" style={{ fontSize: 38, color: "#ffd700" }}>
                    {stats?.totalPoints ?? 0}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,215,0,0.6)" }}>
                    {isAr ? "نقطة" : "PTS"}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {[
                { icon: <Trophy size={13} />,     label: isAr ? "فوز"   : "Wins",   value: stats?.wins ?? 0,          color: "#22c55e" },
                { icon: <Zap size={13} />,         label: isAr ? "مبكر"  : "Early",  value: stats?.earlyArrivals ?? 0, color: "#00b4ff" },
                { icon: <CreditCard size={13} />,  label: isAr ? "دفع"   : "Paid",   value: stats?.payments ?? 0,      color: "#8b5cf6" },
                { icon: <span className="text-sm">⚽</span>, label: isAr ? "جولة" : "Rounds", value: stats?.roundsPlayed ?? 0, color: "#f97316" },
              ].map((s, i) => (
                <div key={s.label} className="flex flex-col items-center py-3 gap-0.5"
                  style={{ borderRight: i < 3 ? "1px solid var(--border-subtle)" : "none" }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-lg font-black" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* ── Rank history row ── */}
            <div className="grid grid-cols-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {[
                { label: isAr ? "أفضل مركز"  : "Best Rank",  value: `#${stats?.highestRank ?? rank}`, color: "#22c55e" },
                { label: isAr ? "أسوأ مركز"  : "Worst Rank", value: `#${stats?.lowestRank ?? rank}`,  color: "#ef4444" },
                { label: isAr ? "أفضل جولة"  : "Best Round", value: `+${bestRoundPts}`,              color: "#ffd700" },
              ].map((s, i) => (
                <div key={s.label} className="flex flex-col items-center py-2.5 gap-0.5"
                  style={{ borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
                  <span className="text-base font-black" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* ── Recent form ── */}
            {recentForm.length > 0 && (
              <div className="px-5 pt-3.5 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-muted)" }}>
                  {isAr ? "الشكل الأخير" : "Recent Form"}
                </p>
                <div className="flex items-center gap-2">
                  {recentForm.map((r) => (
                    <div key={r.roundNumber} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{
                          background: r.pts >= 5 ? "rgba(34,197,94,0.2)" : r.pts >= 3 ? "rgba(0,180,255,0.15)" : r.pts > 0 ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
                          color:      r.pts >= 5 ? "#22c55e"              : r.pts >= 3 ? "#00b4ff"               : r.pts > 0 ? "#8b5cf6"               : "var(--text-muted)",
                          border: `1px solid ${r.pts >= 5 ? "rgba(34,197,94,0.3)" : r.pts >= 3 ? "rgba(0,180,255,0.25)" : r.pts > 0 ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        {r.pts > 0 ? `+${r.pts}` : "—"}
                      </div>
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>R{r.roundNumber}</span>
                    </div>
                  ))}
                  <div className="ml-auto text-right">
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {isAr ? "إجمالي الجولات" : "Total Rounds"}: <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>{rounds.length}</span>
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {isAr ? "شارك في" : "Played"}: <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>{roundsWithActivity.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Round-by-round history ── */}
            <div className="flex-1 overflow-y-auto">
              {roundPerf.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <span className="text-3xl">📋</span>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {isAr ? "لا توجد جولات بعد" : "No rounds yet"}
                  </p>
                </div>
              ) : (
                <div className="px-5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                    {isAr ? "أداء كل جولة" : "Round-by-Round Performance"}
                  </p>
                  <div className="space-y-1.5">
                    {[...roundPerf].reverse().map((r, idx) => (
                      <motion.div
                        key={r.roundNumber}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{
                          background: r.pts > 0 ? "rgba(255,255,255,0.03)" : "transparent",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                          {r.roundNumber}
                        </div>
                        <span className="text-[10px] hidden sm:block" style={{ color: "var(--text-muted)", minWidth: 72 }}>{r.date}</span>
                        <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                          {r.won && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black"
                              style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>
                              🏆 +3
                            </span>
                          )}
                          {r.early && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black"
                              style={{ background: "rgba(0,180,255,0.15)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.25)" }}>
                              ⚡ +2
                            </span>
                          )}
                          {r.paid && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black"
                              style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.25)" }}>
                              💰 +1
                            </span>
                          )}
                          {r.pts === 0 && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>—</span>}
                        </div>
                        <span className="text-sm font-black flex-shrink-0 w-8 text-right"
                          style={{ color: r.pts > 0 ? "#ffd700" : "var(--text-muted)" }}>
                          {r.pts > 0 ? `+${r.pts}` : "0"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
