import { ENDINGS } from "../data/endings";
import type { Ending, GameState } from "../types/game";
import { matchesCondition } from "./conditionEngine";

export function determineEnding(state: GameState): Ending {
  const sorted = [...ENDINGS].sort((a, b) => b.priority - a.priority);
  return sorted.find((ending) => matchesCondition(state, ending.condition)) ?? ENDINGS[ENDINGS.length - 1];
}

export function getEndingById(endingId?: string): Ending {
  return ENDINGS.find((ending) => ending.id === endingId) ?? ENDINGS[ENDINGS.length - 1];
}
