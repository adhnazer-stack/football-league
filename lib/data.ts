export interface Team {
  id: number;
  rank: number;
  name: string;
  nameAr: string;
  shortName: string;
  color: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ("W" | "D" | "L")[];
}

export interface Player {
  id: number;
  name: string;
  nameAr: string;
  team: string;
  teamAr: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  goals: number;
  assists: number;
  rating: number;
  color: string;
}

export interface Match {
  id: number;
  homeTeam: string;
  homeTeamAr: string;
  awayTeam: string;
  awayTeamAr: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "completed" | "upcoming" | "live";
  homeColor: string;
  awayColor: string;
}

export interface Round {
  number: number;
  status: "completed" | "active" | "upcoming";
  matches: Match[];
}

export const teams: Team[] = [
  {
    id: 1, rank: 1, name: "Al-Hilal FC", nameAr: "الهلال", shortName: "HIL",
    color: "#1e40af", played: 14, won: 11, drawn: 2, lost: 1,
    goalsFor: 38, goalsAgainst: 12, points: 35, form: ["W", "W", "W", "D", "W"],
  },
  {
    id: 2, rank: 2, name: "Al-Nassr FC", nameAr: "النصر", shortName: "NAI",
    color: "#d97706", played: 14, won: 10, drawn: 2, lost: 2,
    goalsFor: 35, goalsAgainst: 15, points: 32, form: ["W", "L", "W", "W", "W"],
  },
  {
    id: 3, rank: 3, name: "Al-Ahli FC", nameAr: "الأهلي", shortName: "AHL",
    color: "#15803d", played: 14, won: 9, drawn: 3, lost: 2,
    goalsFor: 28, goalsAgainst: 14, points: 30, form: ["W", "W", "D", "W", "D"],
  },
  {
    id: 4, rank: 4, name: "Al-Ittihad FC", nameAr: "الاتحاد", shortName: "ITT",
    color: "#854d0e", played: 14, won: 8, drawn: 3, lost: 3,
    goalsFor: 25, goalsAgainst: 16, points: 27, form: ["D", "W", "W", "L", "W"],
  },
  {
    id: 5, rank: 5, name: "Al-Shabab FC", nameAr: "الشباب", shortName: "SHA",
    color: "#dc2626", played: 14, won: 7, drawn: 2, lost: 5,
    goalsFor: 22, goalsAgainst: 20, points: 23, form: ["L", "W", "W", "D", "L"],
  },
  {
    id: 6, rank: 6, name: "Al-Qadsiah FC", nameAr: "القادسية", shortName: "QAD",
    color: "#7c3aed", played: 14, won: 6, drawn: 3, lost: 5,
    goalsFor: 20, goalsAgainst: 22, points: 21, form: ["W", "L", "D", "W", "L"],
  },
  {
    id: 7, rank: 7, name: "Al-Fateh FC", nameAr: "الفتح", shortName: "FAT",
    color: "#0e7490", played: 14, won: 5, drawn: 4, lost: 5,
    goalsFor: 18, goalsAgainst: 22, points: 19, form: ["D", "D", "W", "L", "W"],
  },
  {
    id: 8, rank: 8, name: "Al-Raed FC", nameAr: "الرائد", shortName: "RAE",
    color: "#be185d", played: 14, won: 4, drawn: 4, lost: 6,
    goalsFor: 16, goalsAgainst: 24, points: 16, form: ["L", "D", "W", "L", "D"],
  },
  {
    id: 9, rank: 9, name: "Al-Taawoun FC", nameAr: "التعاون", shortName: "TAA",
    color: "#0369a1", played: 14, won: 3, drawn: 3, lost: 8,
    goalsFor: 14, goalsAgainst: 28, points: 12, form: ["L", "L", "W", "L", "D"],
  },
  {
    id: 10, rank: 10, name: "Al-Wehda FC", nameAr: "الوحدة", shortName: "WEH",
    color: "#374151", played: 14, won: 2, drawn: 2, lost: 10,
    goalsFor: 10, goalsAgainst: 34, points: 8, form: ["L", "L", "L", "D", "L"],
  },
];

export const players: Player[] = [
  {
    id: 1, name: "Cristiano Ronaldo", nameAr: "كريستيانو رونالدو",
    team: "Al-Nassr FC", teamAr: "النصر", position: "FWD",
    goals: 18, assists: 5, rating: 9.1, color: "#d97706",
  },
  {
    id: 2, name: "Neymar Jr", nameAr: "نيمار جونيور",
    team: "Al-Hilal FC", teamAr: "الهلال", position: "FWD",
    goals: 14, assists: 9, rating: 8.8, color: "#1e40af",
  },
  {
    id: 3, name: "Karim Benzema", nameAr: "كريم بنزيمة",
    team: "Al-Ittihad FC", teamAr: "الاتحاد", position: "FWD",
    goals: 13, assists: 7, rating: 8.7, color: "#854d0e",
  },
  {
    id: 4, name: "Riyad Mahrez", nameAr: "رياض محرز",
    team: "Al-Ahli FC", teamAr: "الأهلي", position: "MID",
    goals: 10, assists: 12, rating: 8.6, color: "#15803d",
  },
  {
    id: 5, name: "Roberto Firmino", nameAr: "روبرتو فيرمينو",
    team: "Al-Ahli FC", teamAr: "الأهلي", position: "FWD",
    goals: 11, assists: 6, rating: 8.4, color: "#15803d",
  },
  {
    id: 6, name: "Sadio Mané", nameAr: "ساديو ماني",
    team: "Al-Nassr FC", teamAr: "النصر", position: "FWD",
    goals: 9, assists: 8, rating: 8.3, color: "#d97706",
  },
  {
    id: 7, name: "Aleksandar Mitrović", nameAr: "ميتروفيتش",
    team: "Al-Hilal FC", teamAr: "الهلال", position: "FWD",
    goals: 12, assists: 3, rating: 8.2, color: "#1e40af",
  },
  {
    id: 8, name: "N'Golo Kanté", nameAr: "كانتي",
    team: "Al-Ittihad FC", teamAr: "الاتحاد", position: "MID",
    goals: 4, assists: 11, rating: 8.5, color: "#854d0e",
  },
];

export const roundsData: Round[] = [
  {
    number: 15,
    status: "active",
    matches: [
      {
        id: 1, homeTeam: "Al-Hilal FC", homeTeamAr: "الهلال",
        awayTeam: "Al-Nassr FC", awayTeamAr: "النصر",
        homeScore: null, awayScore: null, status: "upcoming",
        homeColor: "#1e40af", awayColor: "#d97706",
      },
      {
        id: 2, homeTeam: "Al-Ahli FC", homeTeamAr: "الأهلي",
        awayTeam: "Al-Ittihad FC", awayTeamAr: "الاتحاد",
        homeScore: null, awayScore: null, status: "upcoming",
        homeColor: "#15803d", awayColor: "#854d0e",
      },
      {
        id: 3, homeTeam: "Al-Shabab FC", homeTeamAr: "الشباب",
        awayTeam: "Al-Fateh FC", awayTeamAr: "الفتح",
        homeScore: null, awayScore: null, status: "upcoming",
        homeColor: "#dc2626", awayColor: "#0e7490",
      },
      {
        id: 4, homeTeam: "Al-Qadsiah FC", homeTeamAr: "القادسية",
        awayTeam: "Al-Raed FC", awayTeamAr: "الرائد",
        homeScore: null, awayScore: null, status: "upcoming",
        homeColor: "#7c3aed", awayColor: "#be185d",
      },
      {
        id: 5, homeTeam: "Al-Taawoun FC", homeTeamAr: "التعاون",
        awayTeam: "Al-Wehda FC", awayTeamAr: "الوحدة",
        homeScore: null, awayScore: null, status: "upcoming",
        homeColor: "#0369a1", awayColor: "#374151",
      },
    ],
  },
  {
    number: 14,
    status: "completed",
    matches: [
      {
        id: 6, homeTeam: "Al-Nassr FC", homeTeamAr: "النصر",
        awayTeam: "Al-Ahli FC", awayTeamAr: "الأهلي",
        homeScore: 3, awayScore: 1, status: "completed",
        homeColor: "#d97706", awayColor: "#15803d",
      },
      {
        id: 7, homeTeam: "Al-Hilal FC", homeTeamAr: "الهلال",
        awayTeam: "Al-Shabab FC", awayTeamAr: "الشباب",
        homeScore: 2, awayScore: 0, status: "completed",
        homeColor: "#1e40af", awayColor: "#dc2626",
      },
      {
        id: 8, homeTeam: "Al-Ittihad FC", homeTeamAr: "الاتحاد",
        awayTeam: "Al-Qadsiah FC", awayTeamAr: "القادسية",
        homeScore: 1, awayScore: 1, status: "completed",
        homeColor: "#854d0e", awayColor: "#7c3aed",
      },
      {
        id: 9, homeTeam: "Al-Fateh FC", homeTeamAr: "الفتح",
        awayTeam: "Al-Raed FC", awayTeamAr: "الرائد",
        homeScore: 2, awayScore: 2, status: "completed",
        homeColor: "#0e7490", awayColor: "#be185d",
      },
      {
        id: 10, homeTeam: "Al-Wehda FC", homeTeamAr: "الوحدة",
        awayTeam: "Al-Taawoun FC", awayTeamAr: "التعاون",
        homeScore: 0, awayScore: 1, status: "completed",
        homeColor: "#374151", awayColor: "#0369a1",
      },
    ],
  },
];

export const currentRoundNumber = 15;
export const totalRounds = 18;
