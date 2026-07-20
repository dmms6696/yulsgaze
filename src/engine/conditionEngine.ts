import type { CharacterId, GameCondition, GameState, RelationStats, StatKey } from "../types/game";

function hasFlag(state: GameState, flag: string) {
  return state.flags.includes(flag as never);
}

function checkStatsMin(state: GameState, stats?: Partial<Record<StatKey, number>>) {
  if (!stats) {
    return true;
  }
  return Object.entries(stats).every(([key, value]) => state.stats[key as StatKey] >= Number(value));
}

function checkStatsMax(state: GameState, stats?: Partial<Record<StatKey, number>>) {
  if (!stats) {
    return true;
  }
  return Object.entries(stats).every(([key, value]) => state.stats[key as StatKey] <= Number(value));
}

function checkRelationMin(
  state: GameState,
  relations?: Partial<Record<CharacterId, Partial<RelationStats>>>,
) {
  if (!relations) {
    return true;
  }
  return Object.entries(relations).every(([characterId, relation]) => {
    const current = state.relations[characterId as CharacterId];
    if (!current) {
      return false;
    }
    return Object.entries(relation ?? {}).every(
      ([key, value]) => current[key as keyof RelationStats] >= Number(value),
    );
  });
}

function checkRelationMax(
  state: GameState,
  relations?: Partial<Record<CharacterId, Partial<RelationStats>>>,
) {
  if (!relations) {
    return true;
  }
  return Object.entries(relations).every(([characterId, relation]) => {
    const current = state.relations[characterId as CharacterId];
    if (!current) {
      return false;
    }
    return Object.entries(relation ?? {}).every(
      ([key, value]) => current[key as keyof RelationStats] <= Number(value),
    );
  });
}

export function matchesCondition(state: GameState, condition?: GameCondition) {
  if (!condition) {
    return true;
  }

  const checks: boolean[] = [
    checkStatsMin(state, condition.statsMin),
    checkStatsMax(state, condition.statsMax),
    checkRelationMin(state, condition.relationMin),
    checkRelationMax(state, condition.relationMax),
  ];

  if (condition.requiredFlags) {
    checks.push(condition.requiredFlags.every((flag) => hasFlag(state, flag)));
  }
  if (condition.forbiddenFlags) {
    checks.push(condition.forbiddenFlags.every((flag) => !hasFlag(state, flag)));
  }
  if (condition.anyFlags) {
    checks.push(condition.anyFlags.some((flag) => hasFlag(state, flag)));
  }
  if (condition.minFlagMatches) {
    const matchCount = condition.minFlagMatches.flags.filter((flag) => hasFlag(state, flag)).length;
    checks.push(matchCount >= condition.minFlagMatches.count);
  }

  return condition.logic === "OR" ? checks.some(Boolean) : checks.every(Boolean);
}
