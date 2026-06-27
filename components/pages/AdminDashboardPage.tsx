"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Award, Calendar, TrendingUp,
  Download, Upload, RefreshCw, BarChart2, AlertTriangle,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useRM } from "@/lib/round-management-context";
import { CountUp } from "@/components/ui/CountUp";

export function AdminDashboardPage() {
  const { language } = useApp();
  const rm = useRM();
  const isAr = language === "ar";
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetAsk, setResetAsk] = useState(false);

  const totalRounds = rm.rounds.length;
  const totalPlayers = rm.players.length;
  const totalPointsDistributed = rm.stats.reduce((a, s) => a + s.totalPoints, 0);
  const totalWins = rm.rounds.reduce((a, r) => a + r.winners.length, 0);
  const avgPts = totalRounds > 0 ? totalPointsDistributed / totalRounds : 0;

  const leader = rm.stats[0];
  const leaderPlayer = leader ? rm.players.find((p) => p.id === leader.playerId) : null;

  const mostActiveIdx = rm.stats.reduce(
    (best, s, i) =>
      (s.wins + s.earlyArrivals + s.payments) > (rm.stats[best].wins + rm.stats[best].earlyArrivals + rm.stats[best].payments)
        ? i : best,
    0
  );
  const mostActive = rm.stats[mostActiveIdx];
  const mostActivePlayer = mostActive ? rm.players.find((p) => p.id === mostActive.playerId) : null;

  const statCards = [
    { icon: <Users size={20} />,     label: isAr ? "اللاعبون"           : "Players",        value: totalPlayers,           color: "#3b82f6", decimals: 0 },
    { icon: <Calendar size={20} />,  label: isAr ? "الجولات"            : "Rounds",         value: totalRounds,            color: "#22c55e", decimals: 0 },
    { icon: <Award size={20} />,     label: isAr ? "مجموع الفوز"        : "Total Wins",     value: totalWins,              color: "#ffd700", decimals: 0 },
    { icon: <BarChart2 size={20} />, label: isAr ? "مجموع النقاط"       : "Total Points",   value: totalPointsDistributed, color: "#8b5cf6", decimals: 0 },
    { icon: <TrendingUp size={20} />,label: isAr ? "متوسط نقاط/جولة"   : "Avg Pts/Round",  value: avgPts,                 color: "#f97316", decimals: 1 },
  ];

  const handleImportClick = () => { fileRef.current?.click(); };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") rm.importData(ev.target.result);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto pb-24 md:pb-0">
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      {/* Header */}
      <motion.div
        className="text-center py-8 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-5xl mb-3">⚙️</div>
        <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>
          {isAr ? "لوحة الإدارة" : "Admin Dashboard"}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {isAr ? "نظرة عامة وإدارة البيانات" : "Overview and data management"}
        </p>
      </motion.div>

      <div className="px-5 space-y-6 max-w-2xl mx-auto w-full">
        {/* Stat cards */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            {isAr ? "إحصاءات الدوري" : "League Statistics"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {statCards.map((card, idx) => (
              <motion.div
                key={card.label}
                className="glass-card p-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -3 }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${card.color}20`, color: card.color }}
                >
                  {card.icon}
                </div>
                <p className="text-2xl font-black mb-0.5" style={{ color: "var(--text-primary)" }}>
                  <CountUp to={card.value} duration={1000} decimals={card.decimals} />
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{card.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            {isAr ? "أبرز اللاعبين" : "Player Highlights"}
          </p>
          <div className="glass-card overflow-hidden">
            {[
              { icon: "👑", label: isAr ? "متصدر الدوري" : "League Leader",  player: leaderPlayer,     value: leader?.totalPoints ?? 0,                                                unit: isAr ? "نقطة"  : "pts",     color: "#ffd700" },
              { icon: "⚡", label: isAr ? "الأكثر نشاطاً" : "Most Active",  player: mostActivePlayer, value: mostActive ? mostActive.wins + mostActive.earlyArrivals + mostActive.payments : 0, unit: isAr ? "مشاركة": "actions", color: "#00b4ff" },
            ].map((row, idx) => (
              <div
                key={row.label}
                className="flex items-center gap-4 px-5 py-4"
                style={{ borderBottom: idx === 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
              >
                <span className="text-2xl">{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{row.label}</p>
                  {row.player ? (
                    <p className="font-black text-base truncate" style={{ color: "var(--text-primary)", direction: "rtl" }}>
                      {row.player.name}
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>—</p>
                  )}
                </div>
                {row.player && (
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-xl" style={{ color: row.color }}>{row.value}</p>
                    <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{row.unit}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Data management */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            {isAr ? "إدارة البيانات" : "Data Management"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={rm.exportData}
              className="glass-card p-4 flex flex-col items-center gap-3 text-center w-full"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#22c55e20", color: "#22c55e" }}>
                <Download size={18} />
              </div>
              <p className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>{isAr ? "تصدير / نسخ احتياطي" : "Export / Backup"}</p>
            </motion.button>
            <motion.button
              onClick={handleImportClick}
              className="glass-card p-4 flex flex-col items-center gap-3 text-center w-full"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#3b82f620", color: "#3b82f6" }}>
                <Upload size={18} />
              </div>
              <p className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>{isAr ? "استيراد / استعادة" : "Import / Restore"}</p>
            </motion.button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="pb-8">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#ef4444" }}>
            {isAr ? "منطقة الخطر" : "Danger Zone"}
          </p>
          <div className="glass-card p-5" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}
              >
                <RefreshCw size={18} />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                  {isAr ? "إعادة ضبط الدوري" : "Reset League"}
                </p>
                <p className="text-[10px] mb-3" style={{ color: "var(--text-muted)" }}>
                  {isAr
                    ? "سيتم حذف جميع الجولات والنقاط نهائياً. هذا الإجراء لا يمكن التراجع عنه."
                    : "Permanently delete all rounds and points. This cannot be undone."}
                </p>
                <AnimatePresence mode="wait">
                  {resetAsk ? (
                    <motion.div
                      key="confirm"
                      className="flex gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <motion.button
                        onClick={() => { rm.resetLeague(); setResetAsk(false); }}
                        className="flex-1 py-2 rounded-xl text-sm font-black text-white"
                        style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isAr ? "تأكيد الحذف" : "Confirm Reset"}
                      </motion.button>
                      <motion.button
                        onClick={() => setResetAsk(false)}
                        className="flex-1 py-2 rounded-xl text-sm font-bold"
                        style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isAr ? "إلغاء" : "Cancel"}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="reset"
                      onClick={() => setResetAsk(true)}
                      className="w-full py-2 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AlertTriangle size={14} />
                      {isAr ? "إعادة الضبط" : "Reset Everything"}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
