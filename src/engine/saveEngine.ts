import { FIRST_EVENT_ID, GAME_VERSION } from "../data/gameMeta";
import { INITIAL_RELATIONS } from "../data/characters";
import { INITIAL_PLAYER_STATS } from "../data/stats";
import type { FlagId, GameState } from "../types/game";
import { clamp, safeNumber } from "../utils/value";

const STORAGE_KEY = "yul-story-game-save";

export function createInitialState(playerName: string): GameState {
  return {
    version: GAME_VERSION,
    playerName: playerName.trim(),
    currentEventId: FIRST_EVENT_ID,
    currentAct: 1,
    stats: { ...INITIAL_PLAYER_STATS },
    relations: structuredClone(INITIAL_RELATIONS),
    flags: [],
    history: [],
    completedEventIds: [],
    updatedAt: new Date().toISOString(),
  };
}

export function saveGame(state: GameState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
  } catch (error) {
    console.error("저장에 실패했습니다.", error);
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return repairState(JSON.parse(raw));
  } catch (error) {
    console.error("저장 데이터를 불러오지 못했습니다.", error);
    return null;
  }
}

export function hasSavedGame() {
  return Boolean(loadGame());
}

export function clearSave() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function repairState(value: unknown): GameState | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const raw = value as Partial<GameState>;
  if (raw.version !== GAME_VERSION || typeof raw.playerName !== "string" || !raw.playerName.trim()) {
    return null;
  }

  const base = createInitialState(raw.playerName);
  return {
    ...base,
    currentEventId: typeof raw.currentEventId === "string" ? raw.currentEventId : base.currentEventId,
    currentAct: raw.currentAct === 1 || raw.currentAct === 2 || raw.currentAct === 3 || raw.currentAct === 4 ? raw.currentAct : 1,
    stats: {
      sight: clamp(safeNumber(raw.stats?.sight, base.stats.sight)),
      courage: clamp(safeNumber(raw.stats?.courage, base.stats.courage)),
      care: clamp(safeNumber(raw.stats?.care, base.stats.care)),
      sincerity: clamp(safeNumber(raw.stats?.sincerity, base.stats.sincerity)),
    },
    relations: {
      yul: repairRelation(raw.relations?.yul, base.relations.yul),
      dohye: repairRelation(raw.relations?.dohye, base.relations.dohye),
      jinuk: repairRelation(raw.relations?.jinuk, base.relations.jinuk),
      minwoo: repairRelation(raw.relations?.minwoo, base.relations.minwoo),
      donghwi: repairRelation(raw.relations?.donghwi, base.relations.donghwi),
      jimin: repairRelation(raw.relations?.jimin, base.relations.jimin),
      classmates: repairRelation(raw.relations?.classmates, base.relations.classmates),
    },
    flags: Array.isArray(raw.flags) ? Array.from(new Set(raw.flags.filter((flag): flag is FlagId => typeof flag === "string"))) : [],
    history: Array.isArray(raw.history) ? raw.history.filter(Boolean).slice(-200) : [],
    completedEventIds: Array.isArray(raw.completedEventIds)
      ? Array.from(new Set(raw.completedEventIds.filter((id): id is string => typeof id === "string")))
      : [],
    endingId: typeof raw.endingId === "string" ? raw.endingId : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
  };
}

function repairRelation(current: unknown, fallback: GameState["relations"]["yul"]) {
  const raw = current && typeof current === "object" ? (current as Partial<typeof fallback>) : {};
  return {
    closeness: clamp(safeNumber(raw.closeness, fallback.closeness)),
    trust: clamp(safeNumber(raw.trust, fallback.trust)),
    guard: clamp(safeNumber(raw.guard, fallback.guard)),
  };
}
