import type { Ending, FlagId } from "../types/game";

const BRIDGE_FLAGS: FlagId[] = [
  "accepted_polaris",
  "asked_polaris_meaning",
  "noticed_yul_eye_avoidance",
  "accepted_yul_difference",
  "noticed_dohye_sleeves",
  "supported_writing",
  "promised_second_reader",
  "kept_jinuk_secret",
  "protected_jinuk_secret",
  "understood_jimin",
  "helped_minwoo_confess",
  "offered_to_listen",
  "defended_yul",
  "helped_hospital",
  "waited_for_jinuk",
  "heard_jinuk_dream",
  "heard_jinuk_mixed_feelings",
  "encouraged_jinuk",
  "stopped_donghwi_gossip",
  "noticed_yul_discomfort",
  "helped_reconcile",
  "centered_apology",
  "stayed_with_pain",
  "chose_continuing_understanding",
  "sought_adult_help_for_abuse",
  "told_yul_not_his_fault",
  "helped_yul_accept",
  "understood_yul_fear",
  "connected_yul_trauma",
  "waited_at_columbarium",
  "helped_yul_face_grief",
  "sought_better_help",
  "read_story_to_dohye",
  "reported_dohye_missing",
  "shared_dohye_star",
  "promised_shared_search",
  "understood_persistence",
  "searched_for_dohye",
  "organized_search",
  "saw_yul_change",
  "named_yul_change",
];

const YUL_RESEE_FLAGS: FlagId[] = [
  "noticed_yul_eye_avoidance",
  "accepted_yul_difference",
  "noticed_yul_discomfort",
  "chose_continuing_understanding",
  "told_yul_not_his_fault",
  "connected_yul_trauma",
  "helped_yul_accept",
  "understood_yul_fear",
  "waited_at_columbarium",
  "helped_yul_face_grief",
  "shared_dohye_star",
  "saw_yul_change",
  "named_yul_change",
];

const HASTY_FLAGS: FlagId[] = [
  "misjudged_dohye",
  "suspected_yul",
  "forced_yul_eye_contact",
  "encouraged_yul_mask",
  "mocked_dohye_sleeves",
  "spread_jinuk_secret",
  "used_minwoo_secret",
  "mocked_jimin",
  "encouraged_donghwi_gossip",
  "gave_up_understanding",
  "explained_bystanders_first",
  "judged_yul_coward",
  "rushed_yul_grief",
  "ignored_empty_hospital",
  "missed_yul_change",
];

const WITHDRAWAL_FLAGS: FlagId[] = [
  "watched_fight",
  "avoided_hospital",
  "left_hospital",
  "stepped_back_from_pain",
  "silently_watched_gossip",
  "avoided_dark_question",
  "doubted_meaning",
  "doubted_search",
  "ignored_empty_hospital",
];

export const ENDINGS: Ending[] = [
  {
    id: "ENDING_POLARIS_TOGETHER",
    title: "북극성을 함께 바라보다",
    subtitle: "좋은 엔딩",
    priority: 100,
    imageAsset: "endings.polarisTogether",
    condition: {
      statsMin: { sight: 42, care: 42 },
      relationMin: {
        yul: { trust: 50 },
        dohye: { trust: 36 },
      },
      minFlagMatches: {
        flags: BRIDGE_FLAGS,
        count: 9,
      },
      maxFlagMatches: {
        flags: HASTY_FLAGS,
        count: 1,
      },
      allOf: [
        {
          maxFlagMatches: {
            flags: WITHDRAWAL_FLAGS,
            count: 1,
          },
        },
      ],
    },
    summary: [
      "당신은 누군가를 쉽게 단정하지 않는 법을 배웠다.",
      "안율의 변화는 빠른 해결이 아니라 오래 바라본 시간 위에서 가능해졌다.",
      "이도해를 찾는 길에서 당신 역시 누군가의 북극성을 함께 바라볼 수 있는 사람이 되었다.",
    ],
    closingLine: "어둠은 사라지지 않았지만, 바라볼 방향은 남았다.",
  },
  {
    id: "ENDING_SLOW_RESEE",
    title: "천천히 다시 보기",
    subtitle: "중간 이상 엔딩",
    priority: 78,
    imageAsset: "endings.slowResee",
    condition: {
      statsMin: { sight: 26, care: 22 },
      relationMin: {
        yul: { trust: 28 },
      },
      minFlagMatches: {
        flags: YUL_RESEE_FLAGS,
        count: 3,
      },
      maxFlagMatches: {
        flags: HASTY_FLAGS,
        count: 3,
      },
      allOf: [
        {
          maxFlagMatches: {
            flags: WITHDRAWAL_FLAGS,
            count: 2,
          },
        },
      ],
    },
    summary: [
      "당신은 안율을 처음 본 모습으로만 기억하지 않게 되었다.",
      "아직 모든 것을 이해한 것은 아니지만, 다시 바라보려는 태도는 이미 시작되었다.",
      "관계는 가까워지는 일만이 아니라 성급히 결론 내리지 않는 일에서 자라기도 한다.",
    ],
    closingLine: "당신의 시선은 조금 느려졌고, 그래서 조금 더 깊어졌다.",
  },
  {
    id: "ENDING_SAFE_OBSERVER",
    title: "안전한 방관자",
    subtitle: "방관 엔딩",
    priority: 65,
    imageAsset: "endings.safeObserver",
    condition: {
      statsMax: { courage: 36 },
      minFlagMatches: {
        flags: WITHDRAWAL_FLAGS,
        count: 2,
      },
      maxFlagMatches: {
        flags: HASTY_FLAGS,
        count: 4,
      },
    },
    summary: [
      "당신은 큰 문제를 만들지 않았다. 하지만 중요한 순간마다 조금씩 뒤로 물러났다.",
      "아무것도 하지 않는 선택도 교실의 분위기 속에서는 하나의 방향이 되었다.",
      "안전했던 자리는 끝내 마음 한쪽에 질문을 남긴다.",
    ],
    closingLine: "당신은 다치지 않았지만, 아무것도 남기지 않은 것도 아니었다.",
  },
  {
    id: "ENDING_HASTY_GAZE",
    title: "성급한 시선",
    subtitle: "나쁜 엔딩",
    priority: 70,
    imageAsset: "endings.hastyGaze",
    condition: {
      anyOf: [
        {
          statsMax: { sight: 18 },
          minFlagMatches: {
            flags: HASTY_FLAGS,
            count: 5,
          },
        },
        {
          minFlagMatches: {
            flags: HASTY_FLAGS,
            count: 7,
          },
        },
      ],
    },
    summary: [
      "당신은 소문과 첫인상을 사실처럼 받아들였다.",
      "안율과 이도해의 행동 뒤에 있던 이유는 끝내 당신에게 충분히 열리지 않았다.",
      "빠른 판단은 편했지만, 편한 시선은 누군가를 더 멀리 밀어냈다.",
    ],
    closingLine: "가장 먼저 본 것이 언제나 가장 진실한 것은 아니었다.",
  },
  {
    id: "ENDING_LATE_HEART",
    title: "늦었지만 남은 마음",
    subtitle: "이도해 중심 여운 엔딩",
    priority: 82,
    imageAsset: "endings.lateHeart",
    condition: {
      requiredFlags: ["searched_for_dohye"],
      anyOf: [
        { statsMin: { sight: 24, care: 24 } },
        { relationMin: { dohye: { trust: 22 } } },
      ],
      maxFlagMatches: {
        flags: HASTY_FLAGS,
        count: 3,
      },
    },
    summary: [
      "당신은 이도해를 찾는 길에 함께 섰다.",
      "하지만 그 행동의 의미를 끝까지 붙잡기에는 아직 망설임이 남아 있었다.",
      "늦었더라도 남은 마음은 누군가를 다시 바라보게 하는 작은 시작이 된다.",
    ],
    closingLine: "찾지 못한 대답이 있어도, 찾으려 했던 마음은 사라지지 않는다.",
  },
  {
    id: "ENDING_DEFAULT",
    title: "아직 이름 붙이지 못한 시선",
    subtitle: "기본 엔딩",
    priority: 0,
    imageAsset: "endings.defaultGaze",
    summary: [
      "당신의 선택들은 한 방향으로 완전히 모이지 않았다.",
      "때로는 다가갔고, 때로는 물러났으며, 때로는 늦게 알아차렸다.",
      "이야기는 끝났지만 시선은 아직 배우는 중이다.",
    ],
    closingLine: "다음에 같은 장면을 본다면, 당신은 조금 다르게 바라볼지도 모른다.",
  },
];
