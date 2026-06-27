"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import { CountUp } from "@/components/ui/CountUp";

export function HallOfFamePage() {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";

  const topPlayers = rm.stats.slice(0, 3);
  const champion = topPlayers[0];
  const runnerUp = topPlayers[1];
  const thirdPlace = topPlayers[2];

  const getPlayer = (id: string) => rm.players.find((p) => p.id === id);

  const podiumConfig = [
    { stat: runnerUp,    place: 2, icon: "🥈", height: 120, label: isAr ? "المركز الثاني" : "Runner-Up",   color: "#9ca3af", delay: 0.5, glowColor: "#9ca3af" },
    { stat: champion,    place: 1, icon: "👑", height: 160, label: isAr ? "البطل"        : "Champion",    color: "#ffd700", delay: 0.3, glowColor: "#ffd700" },
    { stat: thirdPlace,  place: 3, icon: "🥉", height: 90,  label: isAr ? "المركز الثالث": "3rd Place",   color: "#cd7f32", delay: 0.7, glowColor: "#cd7f32" },
  ];

  const hasData = rm.rounds.length > 0 && rm.stats.some((s) => s.totalPoints > 0);

  return (
    <div className="flex-1 flex flex-col overflow-auto pb-24 md:pb-0">
      {/* Header */}
      <motion.div
        className="text-center py-10 px-6 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,215,0,0.08) 0%, transparent 70%)" }}
        />
        <motion.div
          className="text-7xl mb-4 inline-block"
          animate={{ rotate: [0, -5, 5, -3, 3, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🏆
        </motion.div>
        <h1 className="text-3xl font-black mb-2" style={{
          background: "linear-gradient(135deg,#ffd700,#c9963c,#ffe680)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {isAr ? "قاعة المشاهير" : "Hall of Fame"}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {isAr ? "أبطال الدوري وأعلى المراتب" : "League champions and top performers"}
        </p>
      </motion.div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <span className="text-5xl">🏟️</span>
          <p className="text-base font-bold" style={{ color: "var(--text-muted)" }}>
            {isAr ? "لا توجد بيانات بعد — ابدأ الجولة الأولى!" : "No data yet — play your first round!"}
          </p>
        </div>
      ) : (
        <>
          {/* Podium */}
          <div className="flex items-end justify-center gap-4 px-8 pb-4 pt-4">
            {podiumConfig.map(({ stat, place, icon, height, label, color, delay, glowColor }) => {
              if (!stat) return null;
              const player = getPlayer(stat.playerId);
              if (!player) return null;
              return (
                <motion.div
                  key={place}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.6, type: "spring", stiffness: 200 }}
                >
                  {/* Player avatar */}
                  <div className="relative mb-2">
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white border-2"
                      style={{
                        background: `linear-gradient(135deg,${player.color},${player.color}aa)`,
                        borderColor: color,
                        boxShadow: `0 0 ${place === 1 ? "30px" : "12px"} ${glowColor}55`,
                      }}
                      animate={place === 1 ? { boxShadow: [`0 0 20px ${glowColor}40`, `0 0 40px ${glowColor}70`, `0 0 20px ${glowColor}40`] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {player.name[0]}
                    </motion.div>
                    <div className="absolute -top-2 -right-2 text-xl">{icon}</div>
                  </div>

                  {/* Name */}
                  <p
                    className="text-xs font-black text-center max-w-[70px] truncate"
                    style={{ color: place === 1 ? "#ffd700" : "var(--text-primary)", direction: "rtl" }}
                  >
                    {player.name}
                  </p>
                  <p className="text-[9px] text-center" style={{ color: "var(--text-muted)" }}>{label}</p>

                  {/* Pedestal */}
                  <motion.div
                    className="w-24 rounded-t-xl flex flex-col items-center justify-start pt-3"
                    style={{
                      height,
                      background: `linear-gradient(180deg, ${color}22 0%, ${color}0a 100%)`,
                      border: `1px solid ${color}40`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height }}
                    transition={{ delay: delay + 0.2, duration: 0.6 }}
                  >
                    <p className="font-black text-xl" style={{ color }}>
                      <CountUp to={stat.totalPoints} duration={1200} />
                    </p>
                    <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                      {isAr ? "نقطة" : "pts"}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats grid for top 3 */}
          <div className="px-5 mt-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {isAr ? "إحصاءات تفصيلية" : "Detailed Stats"}
            </p>
            {topPlayers.map((s, idx) => {
              const player = getPlayer(s.playerId);
              if (!player) return null;
              const rankColors = ["#ffd700", "#9ca3af", "#cd7f32"];
              const rankIcons = ["👑", "🥈", "🥉"];
              return (
                <motion.div
                  key={s.playerId}
                  className="glass-card p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  style={{
                    borderColor: idx === 0 ? "rgba(255,215,0,0.3)" : undefined,
                    boxShadow: idx === 0 ? "0 0 24px rgba(255,215,0,0.12)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-2xl">{rankIcons[idx]}</span>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm"
                      style={{ background: player.color }}
                    >
                      {player.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm" style={{ color: "var(--text-primary)", direction: "rtl" }}>
                        {player.name}
                      </p>
                      <p className="text-[10px]" style={{ color: rankColors[idx] }}>
                        {isAr
                          ? ["البطل", "المركز الثاني", "المركز الثالث"][idx]
                          : ["Champion", "Runner-Up", "3rd Place"][idx]}
                      </p>
                    </div>
                    <p className="text-2xl font-black" style={{ color: rankColors[idx] }}>
                      <CountUp to={s.totalPoints} duration={1000} />
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: isAr ? "فوز" : "Wins", value: s.wins, icon: "🏆" },
                      { label: isAr ? "مبكر" : "Early", value: s.earlyArrivals, icon: "⚡" },
                      { label: isAr ? "دفع" : "Pay", value: s.payments, icon: "💰" },
                    ].map((st) => (
                      <div
                        key={st.label}
                        className="text-center py-2 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <p className="text-sm">{st.icon}</p>
                        <p className="text-sm font-black" style={{ color: "var(--text-primary)" }}>{st.value}</p>
                        <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{st.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rest of standings */}
          {rm.stats.length > 3 && (
            <div className="px-5 mt-5 mb-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                {isAr ? "الترتيب الكامل" : "Full Standings"}
              </p>
              <div className="glass-card overflow-hidden">
                {rm.stats.slice(3).map((s, idx) => {
                  const player = getPlayer(s.playerId);
                  if (!player) return null;
                  return (
                    <motion.div
                      key={s.playerId}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom: idx < rm.stats.length - 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.04 }}
                    >
                      <span className="text-sm font-bold w-6 text-center" style={{ color: "var(--text-muted)" }}>
                        {s.rank}
                      </span>
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                        style={{ background: player.color }}
                      >
                        {player.name[0]}
                      </div>
                      <span className="flex-1 text-sm" style={{ color: "var(--text-primary)", direction: "rtl" }}>
                        {player.name}
                      </span>
                      <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
                        {s.totalPoints}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
