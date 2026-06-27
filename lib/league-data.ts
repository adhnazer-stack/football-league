/* ─────────────────────────────────────────────────────────────
   League Data Model + Mock Data
   This is the single source of truth for the league.
   All calculations are derived from these raw round entries.
───────────────────────────────────────────────────────────── */

export interface LeaguePlayer {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  initials: string;
}

export interface RoundEntry {
  playerId: string;
  wins: number;          // games won this round
  earlyArrival: boolean; // arrived early
  sameDayPayment: boolean; // paid same day
}

export interface LeagueRound {
  number: number;
  date: string;
  label?: string;
  entries: RoundEntry[];
}

export const SCORING = {
  WIN: 3,
  EARLY_ARRIVAL: 1,
  SAME_DAY_PAYMENT: 1,
} as const;

/* ── Players ── */
export const leaguePlayers: LeaguePlayer[] = [
  { id: "p1",  name: "Suhaib",       nameAr: "صهيب",       color: "#3b82f6", initials: "ص"  },
  { id: "p2",  name: "Jad",          nameAr: "جاد",         color: "#f59e0b", initials: "ج"  },
  { id: "p3",  name: "Ziyad",        nameAr: "زياد",        color: "#22c55e", initials: "ز"  },
  { id: "p4",  name: "Abu Yaqoub",   nameAr: "أبو يعقوب",  color: "#ef4444", initials: "أي" },
  { id: "p5",  name: "Fayez",        nameAr: "فايز",        color: "#8b5cf6", initials: "ف"  },
  { id: "p6",  name: "Azz",          nameAr: "عز",          color: "#06b6d4", initials: "ع"  },
  { id: "p7",  name: "Baarouf",      nameAr: "باعروف",      color: "#f97316", initials: "بع" },
  { id: "p8",  name: "Mishal",       nameAr: "مشعل",        color: "#ec4899", initials: "م"  },
  { id: "p9",  name: "Azzouze",      nameAr: "عزوز",        color: "#14b8a6", initials: "عز" },
  { id: "p10", name: "Azzouze Diur", nameAr: "عزوز ديور",  color: "#a855f7", initials: "عد" },
  { id: "p11", name: "Ahmad",        nameAr: "أحمد",        color: "#84cc16", initials: "أح" },
  { id: "p12", name: "Firas",        nameAr: "فراس",        color: "#0ea5e9", initials: "فر" },
  { id: "p13", name: "Yazan",        nameAr: "يزن",         color: "#f43f5e", initials: "ي"  },
  { id: "p14", name: "Diur",         nameAr: "ديور",        color: "#d97706", initials: "د"  },
  { id: "p15", name: "Taha",         nameAr: "طه",          color: "#7c3aed", initials: "ط"  },
  { id: "p16", name: "Filali",       nameAr: "فيلالي",      color: "#16a34a", initials: "في" },
  { id: "p17", name: "Basem",        nameAr: "باسم",        color: "#0891b2", initials: "ب"  },
  { id: "p18", name: "Ammar Safar",  nameAr: "عمار سفر",   color: "#9333ea", initials: "عس" },
  { id: "p19", name: "Khoja",        nameAr: "خوجه",        color: "#b45309", initials: "خ"  },
  { id: "p20", name: "Abuzadeh",     nameAr: "أبوزاده",     color: "#dc2626", initials: "أز" },
  { id: "p21", name: "Manja",        nameAr: "منجا",        color: "#15803d", initials: "من" },
  { id: "p22", name: "Abdul Majeed", nameAr: "عبدالمجيد",  color: "#1d4ed8", initials: "عم" },
];

/* ── Rounds  (6 complete + 1 upcoming) ── */
export const leagueRounds: LeagueRound[] = [
  {
    number: 1, date: "2025-09-05", label: "Opening Night",
    entries: [
      { playerId: "p1", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11
      { playerId: "p2", wins: 2, earlyArrival: true,  sameDayPayment: true  }, //  8
      { playerId: "p3", wins: 1, earlyArrival: true,  sameDayPayment: false }, //  4
      { playerId: "p4", wins: 2, earlyArrival: false, sameDayPayment: true  }, //  7
      { playerId: "p5", wins: 1, earlyArrival: true,  sameDayPayment: true  }, //  5
      { playerId: "p6", wins: 2, earlyArrival: false, sameDayPayment: false }, //  6
      { playerId: "p7", wins: 0, earlyArrival: true,  sameDayPayment: true  }, //  2
      { playerId: "p8", wins: 1, earlyArrival: false, sameDayPayment: true  }, //  4
    ],
  },
  {
    number: 2, date: "2025-09-12",
    entries: [
      { playerId: "p1", wins: 1, earlyArrival: true,  sameDayPayment: true  }, //  5 → total 16
      { playerId: "p2", wins: 3, earlyArrival: false, sameDayPayment: true  }, // 10 → total 18
      { playerId: "p3", wins: 2, earlyArrival: true,  sameDayPayment: false }, //  7 → total 11
      { playerId: "p4", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 18
      { playerId: "p5", wins: 2, earlyArrival: true,  sameDayPayment: true  }, //  8 → total 13
      { playerId: "p6", wins: 1, earlyArrival: false, sameDayPayment: true  }, //  4 → total 10
      { playerId: "p7", wins: 2, earlyArrival: true,  sameDayPayment: false }, //  7 → total  9
      { playerId: "p8", wins: 0, earlyArrival: true,  sameDayPayment: true  }, //  2 → total  6
    ],
  },
  {
    number: 3, date: "2025-09-19",
    entries: [
      { playerId: "p1", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 27
      { playerId: "p2", wins: 1, earlyArrival: false, sameDayPayment: false }, //  3 → total 21
      { playerId: "p3", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 22
      { playerId: "p4", wins: 0, earlyArrival: true,  sameDayPayment: false }, //  1 → total 19
      { playerId: "p5", wins: 2, earlyArrival: false, sameDayPayment: true  }, //  7 → total 20
      { playerId: "p6", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 21
      { playerId: "p7", wins: 1, earlyArrival: true,  sameDayPayment: true  }, //  5 → total 14
      { playerId: "p8", wins: 2, earlyArrival: false, sameDayPayment: false }, //  6 → total 12
    ],
  },
  {
    number: 4, date: "2025-09-26",
    entries: [
      { playerId: "p1", wins: 2, earlyArrival: false, sameDayPayment: true  }, //  7 → total 34
      { playerId: "p2", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 32
      { playerId: "p3", wins: 1, earlyArrival: true,  sameDayPayment: true  }, //  5 → total 27
      { playerId: "p4", wins: 2, earlyArrival: false, sameDayPayment: true  }, //  7 → total 26
      { playerId: "p5", wins: 3, earlyArrival: true,  sameDayPayment: false }, // 10 → total 30
      { playerId: "p6", wins: 0, earlyArrival: true,  sameDayPayment: true  }, //  2 → total 23
      { playerId: "p7", wins: 2, earlyArrival: false, sameDayPayment: true  }, //  7 → total 21
      { playerId: "p8", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 23
    ],
  },
  {
    number: 5, date: "2025-10-03",
    entries: [
      { playerId: "p1", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 45
      { playerId: "p2", wins: 2, earlyArrival: true,  sameDayPayment: false }, //  7 → total 39
      { playerId: "p3", wins: 2, earlyArrival: false, sameDayPayment: true  }, //  7 → total 34
      { playerId: "p4", wins: 1, earlyArrival: true,  sameDayPayment: true  }, //  5 → total 31
      { playerId: "p5", wins: 2, earlyArrival: true,  sameDayPayment: true  }, //  8 → total 38
      { playerId: "p6", wins: 3, earlyArrival: false, sameDayPayment: true  }, // 10 → total 33
      { playerId: "p7", wins: 1, earlyArrival: true,  sameDayPayment: false }, //  4 → total 25
      { playerId: "p8", wins: 0, earlyArrival: true,  sameDayPayment: true  }, //  2 → total 25
    ],
  },
  {
    number: 6, date: "2025-10-10", label: "Mid-Season",
    entries: [
      { playerId: "p1", wins: 2, earlyArrival: true,  sameDayPayment: true  }, //  8 → total 53
      { playerId: "p2", wins: 1, earlyArrival: false, sameDayPayment: true  }, //  4 → total 43
      { playerId: "p3", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 45
      { playerId: "p4", wins: 2, earlyArrival: true,  sameDayPayment: false }, //  7 → total 38
      { playerId: "p5", wins: 1, earlyArrival: true,  sameDayPayment: true  }, //  5 → total 43
      { playerId: "p6", wins: 2, earlyArrival: false, sameDayPayment: true  }, //  7 → total 40
      { playerId: "p7", wins: 3, earlyArrival: true,  sameDayPayment: true  }, // 11 → total 36
      { playerId: "p8", wins: 1, earlyArrival: true,  sameDayPayment: false }, //  4 → total 29
    ],
  },
];

export const CURRENT_ROUND = 6;
export const TOTAL_ROUNDS = 18;
