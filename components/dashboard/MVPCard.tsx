"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Coins } from "lucide-react";
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
      className="relative rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center mb-5 card-top-gold"
      style={{ background:"rgba(3,6,18,0.97)", minHeight:160 }}
      initial={{ opacity:0, scale:0.94 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ type:"spring", stiffness:340, damping:26 }}
    >
      <motion.span className="text-5xl"
        animate={{ y:[0,-8,0] }} transition={{ duration:2.5, repeat:Infinity }}>🏆</motion.span>
      <div>
        <p className="font-black text-sm mb-1" style={{ color:"rgba(255,215,0,0.5)" }}>
          {isAr ? "MVP الجولة" : "ROUND MVP"}
        </p>
        <p className="text-xs" style={{ color:"var(--text-muted)" }}>
          {isAr ? "سيظهر هنا بعد أول جولة" : "Appears after the first round ends"}
        </p>
      </div>
    </motion.div>
  );

  const scores: Record<string, { pts:number; wins:number; early:boolean; payment:boolean }> = {};
  lastRound.winners.forEach(id => {
    if (!scores[id]) scores[id] = { pts:0, wins:0, early:false, payment:false };
    scores[id].pts += 3; scores[id].wins++;
  });
  lastRound.earlyArrivals.forEach(id => {
    if (!scores[id]) scores[id] = { pts:0, wins:0, early:false, payment:false };
    scores[id].pts += 2; scores[id].early = true;
  });
  lastRound.payments.forEach(id => {
    if (!scores[id]) scores[id] = { pts:0, wins:0, early:false, payment:false };
    scores[id].pts += 1; scores[id].payment = true;
  });

  const entries = Object.entries(scores).sort((a, b) => b[1].pts - a[1].pts);
  if (entries.length === 0) return null;

  const [mvpId, mvpData] = entries[0];
  const mvpPlayer = rm.players.find(p => p.id === mvpId);
  if (!mvpPlayer) return null;

  const photo = rm.photos[mvpId];
  const pc = mvpPlayer.color || "#ffd700";
  const displayName = language === "ar" ? mvpPlayer.name : (mvpPlayer.nameEn ?? mvpPlayer.name);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl mb-5 card-top-gold vt-mvp press-spring"
      style={{ background:"rgba(3,6,18,0.97)", cursor: onPlayerClick ? "pointer" : "default" }}
      initial={{ opacity:0, y:18, scale:0.95 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ type:"spring", stiffness:360, damping:26, delay:0.14 }}
      whileHover={{ y:-4, transition:{ type:"spring", stiffness:400, damping:22 } }}
      whileTap={{ scale:0.97, transition:{ type:"spring", stiffness:500, damping:22 } }}
      onClick={() => onPlayerClick?.(mvpPlayer.id)}
    >
      {/* Gold top shimmer */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.9),rgba(255,255,255,0.6),rgba(255,215,0,0.9),transparent)" }}/>

      {/* Player color ambient glow */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background:`radial-gradient(ellipse 65% 90% at 0% 50%,${pc}14 0%,transparent 60%)` }}
        animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:3.5, repeat:Infinity }}
      />

      {/* Corner gold decoration */}
      <div className="absolute top-0 right-0 pointer-events-none"
        style={{ width:120, height:120,
          background:"radial-gradient(circle at 100% 0%,rgba(255,215,0,0.08) 0%,transparent 70%)" }}/>

      <div className="relative flex items-stretch gap-0">
        {/* LEFT: Photo or Trophy */}
        <div className="flex-shrink-0 relative">
          {photo ? (
            <motion.div
              className="w-[88px] h-full min-h-[120px] overflow-hidden"
              style={{ borderRight:`1px solid rgba(255,215,0,0.15)` }}
              animate={{ filter:[`brightness(0.9)`,`brightness(1.05)`,`brightness(0.9)`] }}
              transition={{ duration:3, repeat:Infinity }}
            >
              <img src={photo} alt={mvpPlayer.name} className="w-full h-full object-cover"/>
              <div className="absolute inset-0" style={{
                background:"linear-gradient(90deg,transparent 60%,rgba(3,6,18,0.7) 100%)",
              }}/>
            </motion.div>
          ) : (
            <motion.div
              className="w-[88px] h-full min-h-[120px] flex items-center justify-center"
              style={{ borderRight:`1px solid rgba(255,215,0,0.12)`,
                background:`linear-gradient(145deg,${pc}18,${pc}06)` }}
            >
              <motion.div
                animate={{ filter:[`drop-shadow(0 0 10px ${pc}66)`,`drop-shadow(0 0 24px ${pc}aa)`,`drop-shadow(0 0 10px ${pc}66)`] }}
                transition={{ duration:2.5, repeat:Infinity }}
              >
                <Trophy size={36} style={{ color:"#ffd700" }}/>
              </motion.div>
            </motion.div>
          )}

          {/* Star badge */}
          <motion.div
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
            style={{ background:"linear-gradient(135deg,#ffd700,#c9963c)", boxShadow:"0 0 16px rgba(255,215,0,0.6)" }}
            animate={{ scale:[1,1.22,1] }} transition={{ duration:1.8, repeat:Infinity }}
          >⭐</motion.div>
        </div>

        {/* CENTER: Info */}
        <div className="flex-1 min-w-0 px-4 py-4 flex flex-col justify-center gap-2">
          <div>
            <p style={{ color:"rgba(255,215,0,0.55)", fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", marginBottom:4 }}>
              ⚽ {isAr ? "أفضل لاعب" : "MVP"} · {isAr ? "جولة" : "Round"} {lastRound.roundNumber}
            </p>
            <p className="font-black leading-tight truncate"
              style={{ color:"#fff", fontSize:20, direction:"rtl",
                textShadow:`0 0 24px ${pc}55, 0 0 50px ${pc}22` }}>
              {displayName}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mvpData.wins > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black"
                style={{ background:"rgba(0,255,135,0.1)", color:"#00FF87", border:"1px solid rgba(0,255,135,0.25)" }}>
                🏆 {isAr ? `×${mvpData.wins}` : `${mvpData.wins}W`}
              </span>
            )}
            {mvpData.early && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black"
                style={{ background:"rgba(0,212,255,0.1)", color:"#00D4FF", border:"1px solid rgba(0,212,255,0.25)" }}>
                <Zap size={8}/> {isAr ? "مبكر" : "Early"}
              </span>
            )}
            {mvpData.payment && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black"
                style={{ background:"rgba(176,107,255,0.1)", color:"#B06BFF", border:"1px solid rgba(176,107,255,0.25)" }}>
                <Coins size={8}/> {isAr ? "دفع" : "Paid"}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Points — Direction C: SplitFlap digit-roll */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center px-5 py-4"
          style={{ borderLeft:"1px solid rgba(255,215,0,0.1)" }}>
          <SplitFlap
            value={mvpData.pts}
            className="font-black leading-none"
            style={{
              fontSize:52,
              color:"#ffd700",
              textShadow:"0 0 30px rgba(255,215,0,0.7), 0 0 60px rgba(255,215,0,0.3)",
            }}
          />
          <p style={{ color:"rgba(255,215,0,0.45)", fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase" }}>
            {isAr ? "نقطة" : "PTS"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
