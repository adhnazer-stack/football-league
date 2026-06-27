"use client";

import { useState, useCallback } from "react";
import {
  INITIAL_RM_PLAYERS, INITIAL_RM_ROUNDS, calculateRMStats, randomPlayerColor,
  type RMPlayer, type RMRound, type RMPlayerStats,
} from "./round-management-data";

const LS = {
  players:    "rms_players",
  rounds:     "rms_rounds",
  roundNum:   "rms_current_round",
  selections: "rms_current_selections",
  seedVersion:"rms_seed_version",
  photos:     "rms_player_photos",
} as const;

const SEED_VERSION = "v3"; // bump this whenever INITIAL_RM_ROUNDS changes

function ensureSeedApplied() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(LS.seedVersion);
  if (stored !== SEED_VERSION) {
    // Wipe rounds + round number so seed defaults kick in
    localStorage.removeItem(LS.rounds);
    localStorage.removeItem(LS.roundNum);
    localStorage.removeItem(LS.selections);
    localStorage.setItem(LS.seedVersion, SEED_VERSION);
  }
}

export interface CurrentSelections {
  winners: string[];
  earlyArrivals: string[];
  payments: string[];
}

const EMPTY_SEL: CurrentSelections = { winners: [], earlyArrivals: [], payments: [] };

/* ── localStorage helpers ── */
function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ── Hook ── */
export function useRoundManagement() {
  const [players, _setPlayers] = useState<RMPlayer[]>(() => { ensureSeedApplied(); return load(LS.players, INITIAL_RM_PLAYERS); });
  const [rounds,  _setRounds]  = useState<RMRound[]>(() => load(LS.rounds, INITIAL_RM_ROUNDS));
  const [currentRoundNumber, _setRoundNum] = useState<number>(() => load(LS.roundNum, 1));
  const [selections, _setSelections] = useState<CurrentSelections>(() => load(LS.selections, EMPTY_SEL));
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [photos, _setPhotos] = useState<Record<string, string>>(() => load(LS.photos, {}));

  /* Derived stats (always recalculated from raw data) */
  const stats: RMPlayerStats[] = calculateRMStats(rounds, players);

  /* Persisted setters */
  const setPlayers = useCallback((updater: RMPlayer[] | ((p: RMPlayer[]) => RMPlayer[])) => {
    _setPlayers((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(LS.players, next);
      return next;
    });
  }, []);

  const setRounds = useCallback((updater: RMRound[] | ((r: RMRound[]) => RMRound[])) => {
    _setRounds((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(LS.rounds, next);
      return next;
    });
  }, []);

  const setRoundNum = useCallback((n: number) => {
    _setRoundNum(n);
    save(LS.roundNum, n);
  }, []);

  const setSelections = useCallback((updater: CurrentSelections | ((s: CurrentSelections) => CurrentSelections)) => {
    _setSelections((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(LS.selections, next);
      return next;
    });
  }, []);

  /* ── Selection toggles ── */
  const toggleWinner = useCallback((id: string) => {
    setSelections((prev) => ({
      ...prev,
      winners: prev.winners.includes(id) ? prev.winners.filter((x) => x !== id) : [...prev.winners, id],
    }));
  }, [setSelections]);

  const toggleEarlyArrival = useCallback((id: string) => {
    setSelections((prev) => ({
      ...prev,
      earlyArrivals: prev.earlyArrivals.includes(id) ? prev.earlyArrivals.filter((x) => x !== id) : [...prev.earlyArrivals, id],
    }));
  }, [setSelections]);

  const togglePayment = useCallback((id: string) => {
    setSelections((prev) => ({
      ...prev,
      payments: prev.payments.includes(id) ? prev.payments.filter((x) => x !== id) : [...prev.payments, id],
    }));
  }, [setSelections]);

  /* ── Save current round (unlocked — survives refresh, stays open for editing) ── */
  const saveRound = useCallback(() => {
    const roundData: RMRound = {
      roundNumber: currentRoundNumber,
      date: new Date().toISOString().split("T")[0],
      winners: selections.winners,
      earlyArrivals: selections.earlyArrivals,
      payments: selections.payments,
      locked: false,
      savedAt: new Date().toISOString(),
    };
    setRounds((prev) => {
      const idx = prev.findIndex((r) => r.roundNumber === currentRoundNumber);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = roundData;
        return updated;
      }
      return [...prev, roundData].sort((a, b) => a.roundNumber - b.roundNumber);
    });
    // Do NOT advance round number or clear selections — round stays open
  }, [currentRoundNumber, selections, setRounds]);

  /* ── End current round: lock + save + advance to next round ── */
  const endCurrentRound = useCallback(() => {
    const roundData: RMRound = {
      roundNumber: currentRoundNumber,
      date: new Date().toISOString().split("T")[0],
      winners: selections.winners,
      earlyArrivals: selections.earlyArrivals,
      payments: selections.payments,
      locked: true,
      savedAt: new Date().toISOString(),
    };
    setRounds((prev) => {
      const idx = prev.findIndex((r) => r.roundNumber === currentRoundNumber);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = roundData;
        return updated;
      }
      return [...prev, roundData].sort((a, b) => a.roundNumber - b.roundNumber);
    });
    setRoundNum(currentRoundNumber + 1);
    setSelections(EMPTY_SEL);
    setEditingRound(null);
  }, [currentRoundNumber, selections, setRounds, setRoundNum, setSelections]);

  /* ── Load a round for editing ── */
  const loadRoundForEditing = useCallback((roundNumber: number) => {
    const round = rounds.find((r) => r.roundNumber === roundNumber);
    if (!round) return;

    // Unlock for editing
    setRounds((prev) => prev.map((r) => r.roundNumber === roundNumber ? { ...r, locked: false } : r));

    setSelections({
      winners: round.winners,
      earlyArrivals: round.earlyArrivals,
      payments: round.payments,
    });
    _setRoundNum(roundNumber);
    save(LS.roundNum, roundNumber);
    setEditingRound(roundNumber);
  }, [rounds, setRounds, setSelections]);

  /* Cancel editing — re-lock the edited round and restore to latest round number */
  const cancelEditing = useCallback(() => {
    if (editingRound !== null) {
      setRounds((prev) => prev.map((r) =>
        r.roundNumber === editingRound ? { ...r, locked: true } : r
      ));
    }
    const maxSaved = rounds.length > 0 ? Math.max(...rounds.map((r) => r.roundNumber)) : 0;
    const next = maxSaved + 1;
    _setRoundNum(next);
    save(LS.roundNum, next);
    setSelections(EMPTY_SEL);
    setEditingRound(null);
  }, [editingRound, rounds, setRounds, setSelections]);

  /* ── Player management ── */
  const addPlayer = useCallback((name: string) => {
    const player: RMPlayer = { id: `rmp_${Date.now()}`, name: name.trim(), color: randomPlayerColor() };
    setPlayers((prev) => [...prev, player]);
  }, [setPlayers]);

  const renamePlayer = useCallback((id: string, newName: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name: newName } : p)));
  }, [setPlayers]);

  const changePlayerColor = useCallback((id: string, color: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, color } : p)));
  }, [setPlayers]);

  const deletePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setRounds((prev) =>
      prev.map((r) => ({
        ...r,
        winners: r.winners.filter((pid) => pid !== id),
        earlyArrivals: r.earlyArrivals.filter((pid) => pid !== id),
        payments: r.payments.filter((pid) => pid !== id),
      }))
    );
    setSelections((prev) => ({
      winners: prev.winners.filter((pid) => pid !== id),
      earlyArrivals: prev.earlyArrivals.filter((pid) => pid !== id),
      payments: prev.payments.filter((pid) => pid !== id),
    }));
  }, [setPlayers, setRounds, setSelections]);

  /* ── Photo management ── */
  const savePhoto = useCallback((playerId: string, dataURL: string) => {
    _setPhotos((prev) => {
      const next = { ...prev, [playerId]: dataURL };
      save(LS.photos, next);
      return next;
    });
  }, []);

  const deletePhoto = useCallback((playerId: string) => {
    _setPhotos((prev) => {
      const next = { ...prev };
      delete next[playerId];
      save(LS.photos, next);
      return next;
    });
  }, []);

  /* ── League reset — keep player names, wipe all rounds, start at Round 1 ── */
  const resetLeague = useCallback(() => {
    save(LS.players, INITIAL_RM_PLAYERS);
    save(LS.rounds, []);
    save(LS.roundNum, 1);
    save(LS.selections, EMPTY_SEL);
    _setPlayers(INITIAL_RM_PLAYERS);
    _setRounds([]);
    _setRoundNum(1);
    _setSelections(EMPTY_SEL);
    setEditingRound(null);
  }, []);

  /* ── Data export / import ── */
  const exportData = useCallback(() => {
    const data = { players, rounds, currentRoundNumber, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `league-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [players, rounds, currentRoundNumber]);

  const importData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json) as { players?: RMPlayer[]; rounds?: RMRound[]; currentRoundNumber?: number };
      if (Array.isArray(data.players)) {
        save(LS.players, data.players);
        _setPlayers(data.players);
      }
      if (Array.isArray(data.rounds)) {
        save(LS.rounds, data.rounds);
        _setRounds(data.rounds);
      }
      if (typeof data.currentRoundNumber === "number") {
        save(LS.roundNum, data.currentRoundNumber);
        _setRoundNum(data.currentRoundNumber);
      }
      save(LS.selections, EMPTY_SEL);
      _setSelections(EMPTY_SEL);
      setEditingRound(null);
    } catch (e) {
      console.error("Import failed:", e);
    }
  }, []);

  return {
    players,
    rounds,
    currentRoundNumber,
    selections,
    stats,
    editingRound,
    setEditingRound,
    toggleWinner,
    toggleEarlyArrival,
    togglePayment,
    saveRound,
    endCurrentRound,
    loadRoundForEditing,
    cancelEditing,
    addPlayer,
    renamePlayer,
    changePlayerColor,
    deletePlayer,
    resetLeague,
    exportData,
    importData,
    photos,
    savePhoto,
    deletePhoto,
  };
}
