/* ─────────────────────────────────────────────────────────────
   Round Management — Data Model & Static Data
   This is SEPARATE from the Phase 1 league-data (mock football).
   This system is driven by localStorage for real persistence.
───────────────────────────────────────────────────────────── */

export interface RMPlayer {
  id: string;
  name: string;   // Arabic name
  color: string;
}

export interface RMRound {
  roundNumber: number;
  date: string;           // YYYY-MM-DD
  winners: string[];      // player IDs
  earlyArrivals: string[];
  payments: string[];
  locked: boolean;
  savedAt: string;        // ISO timestamp
}

export interface RMPlayerStats {
  playerId: string;
  totalPoints: number;
  wins: number;
  earlyArrivals: number;
  payments: number;
  rank: number;
  prevRank: number;
  movement: number;    // positive = moved up
  highestRank: number; // best rank ever (lowest number = better)
  lowestRank: number;  // worst rank ever (highest number = worse)
  roundsPlayed: number;
}

export const RM_SCORING = {
  WIN: 3,
  EARLY_ARRIVAL: 2,
  PAYMENT: 1,
} as const;

/* ── Initial player list (22 Arabic players) ── */
export const INITIAL_RM_PLAYERS: RMPlayer[] = [
  { id: "rmp01", name: "صهيب",         color: "#3b82f6" },
  { id: "rmp02", name: "جاد",           color: "#22c55e" },
  { id: "rmp03", name: "زياد",          color: "#f59e0b" },
  { id: "rmp04", name: "أبو يعقوب",    color: "#ef4444" },
  { id: "rmp05", name: "فايز",          color: "#8b5cf6" },
  { id: "rmp06", name: "عز",            color: "#06b6d4" },
  { id: "rmp07", name: "باعروف",        color: "#f97316" },
  { id: "rmp08", name: "مشعل",          color: "#ec4899" },
  { id: "rmp09", name: "عزوز",          color: "#14b8a6" },
  { id: "rmp10", name: "عزوز ديور",     color: "#a855f7" },
  { id: "rmp11", name: "أحمد",          color: "#84cc16" },
  { id: "rmp12", name: "فراس",          color: "#0ea5e9" },
  { id: "rmp13", name: "يزن",           color: "#f43f5e" },
  { id: "rmp14", name: "ديور",          color: "#d97706" },
  { id: "rmp15", name: "طه",            color: "#7c3aed" },
  { id: "rmp16", name: "فيلالي",        color: "#16a34a" },
  { id: "rmp17", name: "باسم",          color: "#0891b2" },
  { id: "rmp18", name: "عمار سفر",      color: "#9333ea" },
  { id: "rmp19", name: "خوجه",          color: "#b45309" },
  { id: "rmp20", name: "أبوزاده",       color: "#dc2626" },
  { id: "rmp21", name: "منجا",          color: "#15803d" },
  { id: "rmp22", name: "عبدالمجيد",    color: "#1d4ed8" },
];

/* ── Initial round history — empty (fresh season) ── */
export const INITIAL_RM_ROUNDS: RMRound[] = [];

const RANDOM_COLORS = [
  "#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#f97316","#ec4899","#14b8a6","#a855f7",
  "#84cc16","#0ea5e9","#f43f5e","#7c3aed","#16a34a",
];

export function randomPlayerColor() {
  return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
}

/* ── Pure calculation function (no side effects) ── */
export function calculateRMStats(rounds: RMRound[], players: RMPlayer[]): RMPlayerStats[] {
  if (players.length === 0) return [];
  const N = players.length;

  const acc: Record<string, RMPlayerStats> = {};
  players.forEach((p) => {
    acc[p.id] = {
      playerId: p.id, totalPoints: 0, wins: 0, earlyArrivals: 0, payments: 0,
      rank: 0, prevRank: 0, movement: 0,
      highestRank: N, lowestRank: 1, roundsPlayed: 0,
    };
  });

  // Aggregate all rounds
  rounds.forEach((round) => {
    round.winners.forEach((id) => {
      if (acc[id]) { acc[id].totalPoints += RM_SCORING.WIN; acc[id].wins++; }
    });
    round.earlyArrivals.forEach((id) => {
      if (acc[id]) { acc[id].totalPoints += RM_SCORING.EARLY_ARRIVAL; acc[id].earlyArrivals++; }
    });
    round.payments.forEach((id) => {
      if (acc[id]) { acc[id].totalPoints += RM_SCORING.PAYMENT; acc[id].payments++; }
    });
    new Set([...round.winners, ...round.earlyArrivals, ...round.payments]).forEach((id) => {
      if (acc[id]) acc[id].roundsPlayed++;
    });
  });

  // Current ranking
  const sorted = Object.values(acc).sort((a, b) => b.totalPoints - a.totalPoints || b.wins - a.wins);
  sorted.forEach((s, i) => { s.rank = i + 1; });

  // Previous round ranking (for movement arrow)
  if (rounds.length >= 2) {
    const prevAcc: Record<string, { pts: number; wins: number }> = {};
    players.forEach((p) => { prevAcc[p.id] = { pts: 0, wins: 0 }; });
    rounds.slice(0, -1).forEach((round) => {
      round.winners.forEach((id) => { if (prevAcc[id]) { prevAcc[id].pts += RM_SCORING.WIN; prevAcc[id].wins++; } });
      round.earlyArrivals.forEach((id) => { if (prevAcc[id]) prevAcc[id].pts += RM_SCORING.EARLY_ARRIVAL; });
      round.payments.forEach((id) => { if (prevAcc[id]) prevAcc[id].pts += RM_SCORING.PAYMENT; });
    });
    Object.entries(prevAcc)
      .sort(([, a], [, b]) => b.pts - a.pts || b.wins - a.wins)
      .forEach(([id], i) => {
        const cur = acc[id];
        if (cur) { cur.prevRank = i + 1; cur.movement = (i + 1) - cur.rank; }
      });
  }

  // Per-round rank history → highestRank / lowestRank
  const sortedRoundsList = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber);
  const tmpPts: Record<string, number> = {};
  const tmpWins: Record<string, number> = {};
  players.forEach((p) => { tmpPts[p.id] = 0; tmpWins[p.id] = 0; });
  const inited: Record<string, boolean> = {};

  sortedRoundsList.forEach((round) => {
    round.winners.forEach((id) => { if (tmpPts[id] !== undefined) { tmpPts[id] += RM_SCORING.WIN; tmpWins[id]++; } });
    round.earlyArrivals.forEach((id) => { if (tmpPts[id] !== undefined) tmpPts[id] += RM_SCORING.EARLY_ARRIVAL; });
    round.payments.forEach((id) => { if (tmpPts[id] !== undefined) tmpPts[id] += RM_SCORING.PAYMENT; });

    const ranked = players
      .map((p) => ({ id: p.id, pts: tmpPts[p.id], w: tmpWins[p.id] }))
      .sort((a, b) => b.pts - a.pts || b.w - a.w);

    ranked.forEach(({ id }, idx) => {
      const r = idx + 1;
      if (!acc[id]) return;
      if (!inited[id]) {
        acc[id].highestRank = r;
        acc[id].lowestRank = r;
        inited[id] = true;
      } else {
        if (r < acc[id].highestRank) acc[id].highestRank = r;
        if (r > acc[id].lowestRank)  acc[id].lowestRank  = r;
      }
    });
  });

  // Players with no history: set to current rank
  sorted.forEach((s) => {
    if (!inited[s.playerId]) { s.highestRank = s.rank; s.lowestRank = s.rank; }
  });

  return sorted;
}
