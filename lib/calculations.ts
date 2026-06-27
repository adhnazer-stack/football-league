import {
  leaguePlayers,
  leagueRounds,
  SCORING,
  type LeaguePlayer,
  type LeagueRound,
} from "./league-data";

/* ── Types ── */
export interface StandingRow {
  rank: number;
  prevRank: number;
  movement: number; // positive = moved up, negative = moved down
  player: LeaguePlayer;
  totalPoints: number;
  wins: number;
  earlyArrivals: number;
  sameDayPayments: number;
}

export interface RoundStandingRow {
  rank: number;
  player: LeaguePlayer;
  roundPoints: number;
  wins: number;
  earlyArrival: boolean;
  sameDayPayment: boolean;
}

export interface PlayerProfile {
  player: LeaguePlayer;
  currentRank: number;
  totalPoints: number;
  totalWins: number;
  totalEarlyArrivals: number;
  totalSameDayPayments: number;
  roundHistory: Array<{
    round: number;
    points: number;
    wins: number;
    earlyArrival: boolean;
    sameDayPayment: boolean;
    rank: number;
  }>;
  bestRound: number;
  worstRound: number;
  currentStreak: number;      // consecutive rounds with a win
  rankingHistory: number[];   // rank per round (index 0 = round 1)
}

export interface LeaderboardEntry {
  rank: number;
  player: LeaguePlayer;
  value: number;
}

export interface Leaderboard {
  key: string;
  labelKey: string;
  unit: string;
  entries: LeaderboardEntry[];
}

/* ── Core helpers ── */
function entryPoints(entry: { wins: number; earlyArrival: boolean; sameDayPayment: boolean }) {
  return (
    entry.wins * SCORING.WIN +
    (entry.earlyArrival ? SCORING.EARLY_ARRIVAL : 0) +
    (entry.sameDayPayment ? SCORING.SAME_DAY_PAYMENT : 0)
  );
}

/* ── getCumulativeStandings — standings after round N ── */
export function getCumulativeStandings(
  upToRound: number,
  rounds: LeagueRound[] = leagueRounds
): StandingRow[] {
  const roundsToUse = rounds.filter((r) => r.number <= upToRound);

  const totals: Record<string, { points: number; wins: number; earlyArrivals: number; sameDayPayments: number }> = {};
  leaguePlayers.forEach((p) => {
    totals[p.id] = { points: 0, wins: 0, earlyArrivals: 0, sameDayPayments: 0 };
  });

  roundsToUse.forEach((round) => {
    round.entries.forEach((e) => {
      if (!totals[e.playerId]) return;
      totals[e.playerId].points += entryPoints(e);
      totals[e.playerId].wins += e.wins;
      if (e.earlyArrival) totals[e.playerId].earlyArrivals++;
      if (e.sameDayPayment) totals[e.playerId].sameDayPayments++;
    });
  });

  const sorted = leaguePlayers
    .map((p) => ({ player: p, ...totals[p.id] }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  // Previous round standings for movement calculation
  const prevSorted =
    upToRound > 1
      ? getCumulativeStandings(upToRound - 1, rounds).map((r) => r.player.id)
      : sorted.map((r) => r.player.id);

  return sorted.map((row, i) => {
    const prevRank = prevSorted.indexOf(row.player.id) + 1;
    return {
      rank: i + 1,
      prevRank,
      movement: prevRank - (i + 1), // positive = moved up in table
      player: row.player,
      totalPoints: row.points,
      wins: row.wins,
      earlyArrivals: row.earlyArrivals,
      sameDayPayments: row.sameDayPayments,
    };
  });
}

/* ── getRoundStandings — per-round points only ── */
export function getRoundStandings(
  roundNumber: number,
  rounds: LeagueRound[] = leagueRounds
): RoundStandingRow[] {
  const round = rounds.find((r) => r.number === roundNumber);
  if (!round) return [];

  const withPoints = round.entries.map((e) => {
    const player = leaguePlayers.find((p) => p.id === e.playerId)!;
    return {
      player,
      roundPoints: entryPoints(e),
      wins: e.wins,
      earlyArrival: e.earlyArrival,
      sameDayPayment: e.sameDayPayment,
    };
  });

  withPoints.sort((a, b) => b.roundPoints - a.roundPoints || b.wins - a.wins);

  return withPoints.map((row, i) => ({ rank: i + 1, ...row }));
}

/* ── getPlayerProfile ── */
export function getPlayerProfile(
  playerId: string,
  rounds: LeagueRound[] = leagueRounds
): PlayerProfile | null {
  const player = leaguePlayers.find((p) => p.id === playerId);
  if (!player) return null;

  const allStandings = rounds.map((r) => getCumulativeStandings(r.number, rounds));

  let totalPoints = 0;
  let totalWins = 0;
  let totalEarlyArrivals = 0;
  let totalSameDayPayments = 0;
  let currentStreak = 0;
  let streakBroken = false;

  const roundHistory = rounds
    .map((round, idx) => {
      const entry = round.entries.find((e) => e.playerId === playerId);
      if (!entry) return null;
      const pts = entryPoints(entry);
      totalPoints += pts;
      totalWins += entry.wins;
      if (entry.earlyArrival) totalEarlyArrivals++;
      if (entry.sameDayPayment) totalSameDayPayments++;
      const rank = allStandings[idx].find((r) => r.player.id === playerId)?.rank ?? 8;
      return { round: round.number, points: pts, wins: entry.wins, earlyArrival: entry.earlyArrival, sameDayPayment: entry.sameDayPayment, rank };
    })
    .filter(Boolean) as PlayerProfile["roundHistory"];

  // Current streak = consecutive wins from the latest round backward
  for (let i = roundHistory.length - 1; i >= 0; i--) {
    if (!streakBroken && roundHistory[i].wins > 0) currentStreak++;
    else streakBroken = true;
  }

  const rankingHistory = allStandings.map(
    (s) => s.find((r) => r.player.id === playerId)?.rank ?? 8
  );

  const roundPoints = roundHistory.map((r) => r.points);
  const bestRound = roundHistory[roundPoints.indexOf(Math.max(...roundPoints))]?.round ?? 1;
  const worstRound = roundHistory[roundPoints.indexOf(Math.min(...roundPoints))]?.round ?? 1;

  const finalStandings = allStandings[allStandings.length - 1];
  const currentRank = finalStandings.find((r) => r.player.id === playerId)?.rank ?? 8;

  return {
    player,
    currentRank,
    totalPoints,
    totalWins,
    totalEarlyArrivals,
    totalSameDayPayments,
    roundHistory,
    bestRound,
    worstRound,
    currentStreak,
    rankingHistory,
  };
}

/* ── getLeaderboards — 9 categories ── */
export function getLeaderboards(rounds: LeagueRound[] = leagueRounds): Leaderboard[] {
  const standings = getCumulativeStandings(Math.max(...rounds.map((r) => r.number)), rounds);

  const make = (key: string, labelKey: string, unit: string, getValue: (row: StandingRow) => number): Leaderboard => ({
    key,
    labelKey,
    unit,
    entries: [...standings]
      .sort((a, b) => getValue(b) - getValue(a))
      .map((row, i) => ({ rank: i + 1, player: row.player, value: getValue(row) })),
  });

  // Win streaks per player
  const streakMap: Record<string, number> = {};
  leaguePlayers.forEach((p) => {
    const profile = getPlayerProfile(p.id, rounds);
    streakMap[p.id] = profile?.currentStreak ?? 0;
  });

  // Consistency = rounds with at least 1 win
  const consistencyMap: Record<string, number> = {};
  leaguePlayers.forEach((p) => {
    consistencyMap[p.id] = rounds.filter((r) => r.entries.find((e) => e.playerId === p.id && e.wins > 0)).length;
  });

  // Perfect rounds = wins + earlyArrival + sameDayPayment all true
  const perfectMap: Record<string, number> = {};
  leaguePlayers.forEach((p) => {
    perfectMap[p.id] = rounds.filter((r) => {
      const e = r.entries.find((en) => en.playerId === p.id);
      return e && e.wins > 0 && e.earlyArrival && e.sameDayPayment;
    }).length;
  });

  return [
    make("totalPoints",      "lbTotalPoints",     "pts", (r) => r.totalPoints),
    make("totalWins",        "lbTotalWins",        "W",   (r) => r.wins),
    make("earlyArrivals",    "lbEarlyArrivals",    "EA",  (r) => r.earlyArrivals),
    make("sameDayPayments",  "lbSameDayPayments",  "SDP", (r) => r.sameDayPayments),
    {
      key: "winStreak", labelKey: "lbWinStreak", unit: "rounds",
      entries: leaguePlayers
        .map((p) => ({ player: p, value: streakMap[p.id] }))
        .sort((a, b) => b.value - a.value)
        .map((e, i) => ({ rank: i + 1, ...e })),
    },
    {
      key: "consistency", labelKey: "lbConsistency", unit: "rds",
      entries: leaguePlayers
        .map((p) => ({ player: p, value: consistencyMap[p.id] }))
        .sort((a, b) => b.value - a.value)
        .map((e, i) => ({ rank: i + 1, ...e })),
    },
    {
      key: "perfectRounds", labelKey: "lbPerfectRounds", unit: "rds",
      entries: leaguePlayers
        .map((p) => ({ player: p, value: perfectMap[p.id] }))
        .sort((a, b) => b.value - a.value)
        .map((e, i) => ({ rank: i + 1, ...e })),
    },
    make("bonusPoints", "lbBonusPoints", "pts", (r) => r.earlyArrivals + r.sameDayPayments),
    make("avgPointsPerRound", "lbAvgPoints", "avg", (r) =>
      rounds.length > 0 ? Math.round((r.totalPoints / rounds.length) * 10) / 10 : 0
    ),
  ];
}
