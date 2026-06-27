"use client";

import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useApp } from "@/lib/context";
import type { PlayerProfile } from "@/lib/calculations";

interface PlayerChartsProps {
  profile: PlayerProfile;
}

const CHART_COLORS = {
  points: "#ffd700",
  rank: "#3b82f6",
  wins: "#22c55e",
  early: "#00b4ff",
  payment: "#8b5cf6",
};

const tooltipStyle = {
  background: "rgba(10,18,36,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#f0f4ff",
  fontSize: "12px",
};

export function PlayerCharts({ profile }: PlayerChartsProps) {
  const { language } = useApp();

  const roundData = profile.roundHistory.map((r) => ({
    round: `R${r.round}`,
    pts: r.points,
    wins: r.wins,
    rank: r.rank,
    bonus: (r.earlyArrival ? 1 : 0) + (r.sameDayPayment ? 1 : 0),
  }));

  const pieData = [
    { name: language === "ar" ? "فوز" : "Win Pts", value: profile.totalWins * 3, color: CHART_COLORS.wins },
    { name: language === "ar" ? "حضور مبكر" : "Early", value: profile.totalEarlyArrivals, color: CHART_COLORS.early },
    { name: language === "ar" ? "دفع" : "Payment", value: profile.totalSameDayPayments, color: CHART_COLORS.payment },
  ];

  const axisStyle = { fill: "var(--text-muted, #4d6280)", fontSize: 10 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Points per round - Area */}
      <div className="glass-card p-4">
        <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {language === "ar" ? "النقاط لكل جولة" : "Points per Round"}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={roundData}>
            <defs>
              <linearGradient id="ptsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="round" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={22} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
            <Area type="monotone" dataKey="pts" stroke={CHART_COLORS.points} fill="url(#ptsGrad)" strokeWidth={2} dot={{ fill: CHART_COLORS.points, r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rank history - Line (inverted: lower = better) */}
      <div className="glass-card p-4">
        <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {language === "ar" ? "تاريخ الترتيب" : "Rank History"}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={roundData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="round" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={22} reversed domain={[1, 8]} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`#${v}`, language === "ar" ? "الترتيب" : "Rank"]} />
            <Line type="monotone" dataKey="rank" stroke={CHART_COLORS.rank} strokeWidth={2} dot={{ fill: CHART_COLORS.rank, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Wins per round - Bar */}
      <div className="glass-card p-4">
        <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {language === "ar" ? "الفوز لكل جولة" : "Wins per Round"}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={roundData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="round" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={22} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="wins" fill={CHART_COLORS.wins} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Points breakdown - Pie */}
      <div className="glass-card p-4 flex flex-col">
        <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {language === "ar" ? "توزيع النقاط" : "Points Breakdown"}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, color: "var(--text-muted)" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
