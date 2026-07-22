import type { PlayerStats, StatDefinition } from "../types/game";

export const INITIAL_PLAYER_STATS: PlayerStats = {
  sight: 12,
  courage: 12,
  care: 13,
  sincerity: 12,
};

export const STAT_DEFINITIONS: StatDefinition[] = [
  {
    key: "sight",
    label: "시선 이해력",
    description: "표정, 분위기, 숨은 감정을 읽는 힘",
  },
  {
    key: "courage",
    label: "관계 용기",
    description: "먼저 말을 걸고 다가가는 힘",
  },
  {
    key: "care",
    label: "배려 감각",
    description: "상대의 속도와 감정을 존중하는 힘",
  },
  {
    key: "sincerity",
    label: "표현 진심도",
    description: "자신의 마음을 솔직하게 드러내는 힘",
  },
];
