import type { RMPlayerStats, RMRound } from "./round-management-data";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  rarity: AchievementRarity;
  color: string;
}

const RARITY_COLORS: Record<AchievementRarity, string> = {
  common:    "#6b7280",
  rare:      "#3b82f6",
  epic:      "#8b5cf6",
  legendary: "#ffd700",
};

const ALL_ACHIEVEMENTS: Achievement[] = [
  // ── Wins ──────────────────────────────────────────────
  { id: "first_win",  icon: "🏆", title: "First Win",    titleAr: "أول انتصار",     description: "Win your first match",  descriptionAr: "فز بمباراتك الأولى",      rarity: "common",    color: "#22c55e" },
  { id: "wins_5",     icon: "⭐", title: "5 Wins",       titleAr: "5 انتصارات",      description: "Win 5 matches",          descriptionAr: "فز بـ 5 مباريات",         rarity: "common",    color: "#22c55e" },
  { id: "wins_10",    icon: "🔥", title: "10 Wins",      titleAr: "10 انتصارات",     description: "Win 10 matches",         descriptionAr: "فز بـ 10 مباريات",        rarity: "rare",      color: "#16a34a" },
  { id: "wins_20",    icon: "💪", title: "20 Wins",      titleAr: "20 انتصاراً",     description: "Win 20 matches",         descriptionAr: "فز بـ 20 مباراة",         rarity: "epic",      color: "#15803d" },
  { id: "wins_50",    icon: "🦁", title: "Legend",       titleAr: "الأسطورة",        description: "Win 50 matches",         descriptionAr: "فز بـ 50 مباراة",         rarity: "legendary", color: "#ffd700" },

  // ── Early arrivals ─────────────────────────────────────
  { id: "early_1",   icon: "⚡", title: "Early Bird",   titleAr: "الطائر المبكر",   description: "First early arrival",    descriptionAr: "أول حضور مبكر",           rarity: "common",    color: "#00b4ff" },
  { id: "early_10",  icon: "🌅", title: "Dawn Raider",  titleAr: "غازي الفجر",      description: "10 early arrivals",      descriptionAr: "10 حضور مبكر",            rarity: "rare",      color: "#0ea5e9" },
  { id: "early_20",  icon: "⚡", title: "Always Early", titleAr: "دائماً مبكر",     description: "20 early arrivals",      descriptionAr: "20 حضور مبكر",            rarity: "epic",      color: "#06b6d4" },

  // ── Payments ───────────────────────────────────────────
  { id: "pay_5",     icon: "💰", title: "On Time",      titleAr: "الدافع في الوقت", description: "5 same-day payments",    descriptionAr: "5 دفعات في نفس اليوم",   rarity: "common",    color: "#8b5cf6" },
  { id: "pay_20",    icon: "💎", title: "Reliable",     titleAr: "الموثوق",          description: "20 same-day payments",   descriptionAr: "20 دفعة في نفس اليوم",   rarity: "epic",      color: "#a855f7" },

  // ── Total points ───────────────────────────────────────
  { id: "pts_50",    icon: "✨", title: "Rising Star",  titleAr: "النجم الصاعد",    description: "Earn 50 total points",   descriptionAr: "اكسب 50 نقطة إجمالية",   rarity: "rare",      color: "#fbbf24" },
  { id: "pts_100",   icon: "🌟", title: "Century",      titleAr: "المئة",            description: "Earn 100 total points",  descriptionAr: "اكسب 100 نقطة",          rarity: "epic",      color: "#f59e0b" },
  { id: "pts_150",   icon: "🔱", title: "God Tier",     titleAr: "المستوى الإلهي",  description: "Earn 150 total points",  descriptionAr: "اكسب 150 نقطة",          rarity: "legendary", color: "#ffd700" },

  // ── Rank ───────────────────────────────────────────────
  { id: "top_3",     icon: "🥉", title: "Podium",       titleAr: "المنصة",           description: "Reach top 3",            descriptionAr: "الوصول لأفضل 3",          rarity: "rare",      color: "#cd7f32" },
  { id: "champion",  icon: "👑", title: "Champion",     titleAr: "البطل",            description: "Reach 1st place",        descriptionAr: "الوصول للمرتبة الأولى",   rarity: "legendary", color: "#ffd700" },

  // ── Perfect round (win + early + payment) ─────────────
  { id: "perfect",   icon: "💫", title: "Perfect Round",titleAr: "جولة مثالية",     description: "Win, arrive early & pay in one round", descriptionAr: "فز وتبكر وتدفع في جولة واحدة", rarity: "epic", color: "#ec4899" },

  // ── Consistency ────────────────────────────────────────
  { id: "streak_3",  icon: "🔥", title: "Hot Streak",   titleAr: "سلسلة ساخنة",    description: "3 wins in a row",        descriptionAr: "3 انتصارات متتالية",       rarity: "rare",      color: "#f97316" },
  { id: "streak_5",  icon: "🚀", title: "On Fire",      titleAr: "في حالة حريق",   description: "5 wins in a row",        descriptionAr: "5 انتصارات متتالية",       rarity: "legendary", color: "#ef4444" },
];

export { RARITY_COLORS };

function calcWinStreak(playerId: string, rounds: RMRound[]): number {
  let streak = 0;
  let max = 0;
  for (const r of [...rounds].sort((a, b) => a.roundNumber - b.roundNumber)) {
    if (r.winners.includes(playerId)) {
      streak++;
      max = Math.max(max, streak);
    } else {
      streak = 0;
    }
  }
  return max;
}

function hasPerfectRound(playerId: string, rounds: RMRound[]): boolean {
  return rounds.some(
    (r) => r.winners.includes(playerId) && r.earlyArrivals.includes(playerId) && r.payments.includes(playerId)
  );
}

export function getPlayerAchievements(stats: RMPlayerStats, rounds: RMRound[]): Achievement[] {
  const unlocked = new Set<string>();

  if (stats.wins >= 1)  unlocked.add("first_win");
  if (stats.wins >= 5)  unlocked.add("wins_5");
  if (stats.wins >= 10) unlocked.add("wins_10");
  if (stats.wins >= 20) unlocked.add("wins_20");
  if (stats.wins >= 50) unlocked.add("wins_50");

  if (stats.earlyArrivals >= 1)  unlocked.add("early_1");
  if (stats.earlyArrivals >= 10) unlocked.add("early_10");
  if (stats.earlyArrivals >= 20) unlocked.add("early_20");

  if (stats.payments >= 5)  unlocked.add("pay_5");
  if (stats.payments >= 20) unlocked.add("pay_20");

  if (stats.totalPoints >= 50)  unlocked.add("pts_50");
  if (stats.totalPoints >= 100) unlocked.add("pts_100");
  if (stats.totalPoints >= 150) unlocked.add("pts_150");

  if (stats.rank <= 3) unlocked.add("top_3");
  if (stats.rank === 1) unlocked.add("champion");

  const streak = calcWinStreak(stats.playerId, rounds);
  if (streak >= 3) unlocked.add("streak_3");
  if (streak >= 5) unlocked.add("streak_5");

  if (hasPerfectRound(stats.playerId, rounds)) unlocked.add("perfect");

  return ALL_ACHIEVEMENTS.filter((a) => unlocked.has(a.id));
}

export function getAllAchievements(): Achievement[] {
  return ALL_ACHIEVEMENTS;
}

export type { Achievement as AchievementType };
