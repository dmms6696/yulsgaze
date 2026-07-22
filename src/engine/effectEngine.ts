import { CHARACTERS, getCharacterName } from "../data/characters";
import { FLAG_LABELS } from "../data/flags";
import { STAT_DEFINITIONS } from "../data/stats";
import type { ChangeEntry, GameEffects, GameState, RelationCharacterId, RelationStats, StatKey } from "../types/game";
import { clamp, unique } from "../utils/value";
import { formatDelta } from "../utils/text";

const STAT_LABELS = Object.fromEntries(STAT_DEFINITIONS.map((stat) => [stat.key, stat.label])) as Record<StatKey, string>;
const RELATION_LABELS: Record<keyof RelationStats, string> = {
  closeness: "친밀도",
  trust: "신뢰도",
  guard: "경계도",
};

const CHARACTER_IDS = new Set(CHARACTERS.map((character) => character.id));

export function applyEffects(state: GameState, effects?: GameEffects) {
  const nextState: GameState = {
    ...state,
    stats: { ...state.stats },
    relations: Object.fromEntries(
      Object.entries(state.relations).map(([id, relation]) => [id, { ...relation }]),
    ) as GameState["relations"],
    flags: [...state.flags],
  };
  const changes: ChangeEntry[] = [];

  if (effects?.stats) {
    Object.entries(effects.stats).forEach(([key, delta]) => {
      const statKey = key as StatKey;
      if (!(statKey in nextState.stats) || typeof delta !== "number") {
        console.warn("알 수 없는 스탯 변화가 무시되었습니다.", key, delta);
        return;
      }
      const before = nextState.stats[statKey];
      const after = clamp(before + delta);
      nextState.stats[statKey] = after;
      if (after !== before) {
        changes.push({
          target: "stat",
          label: `${STAT_LABELS[statKey]} ${formatDelta(after - before)}`,
          delta: after - before,
          direction: after > before ? "up" : "down",
        });
      }
    });
  }

  if (effects?.relations) {
    Object.entries(effects.relations).forEach(([characterId, relationChanges]) => {
      if (!CHARACTER_IDS.has(characterId as RelationCharacterId)) {
        console.warn("알 수 없는 관계 대상이 무시되었습니다.", characterId);
        return;
      }
      const relation = nextState.relations[characterId as RelationCharacterId];
      Object.entries(relationChanges ?? {}).forEach(([key, delta]) => {
        const relationKey = key as keyof RelationStats;
        if (!(relationKey in relation) || typeof delta !== "number") {
          console.warn("알 수 없는 관계 변화가 무시되었습니다.", characterId, key, delta);
          return;
        }
        const before = relation[relationKey];
        const after = clamp(before + delta);
        relation[relationKey] = after;
        if (after !== before) {
          const deltaLabel = formatDelta(after - before);
          const guardMeaning = relationKey === "guard" && after < before ? " · 마음의 경계가 낮아짐" : "";
          changes.push({
            target: "relation",
            label: `${getCharacterName(characterId)} ${RELATION_LABELS[relationKey]} ${deltaLabel}${guardMeaning}`,
            delta: after - before,
            direction: after > before ? "up" : "down",
          });
        }
      });
    });
  }

  if (effects?.addFlags) {
    effects.addFlags.forEach((flag) => {
      if (!nextState.flags.includes(flag)) {
        nextState.flags.push(flag);
        changes.push({
          target: "flag",
          label: `${FLAG_LABELS[flag] ?? flag} 기억`,
          direction: "added",
        });
      }
    });
  }

  if (effects?.removeFlags) {
    const before = nextState.flags;
    nextState.flags = before.filter((flag) => !effects.removeFlags?.includes(flag));
    effects.removeFlags.forEach((flag) => {
      if (before.includes(flag)) {
        changes.push({
          target: "flag",
          label: `${FLAG_LABELS[flag] ?? flag} 해제`,
          direction: "removed",
        });
      }
    });
  }

  nextState.flags = unique(nextState.flags);
  return { state: nextState, changes };
}
