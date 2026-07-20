import type { GameEvent } from "../../types/game";

export const act2Events: GameEvent[] = [
  {
    id: "EVENT_03",
    act: 2,
    type: "observation",
    title: "비 오는 날의 이도해",
    location: "비 오는 등굣길",
    time: "흐린 아침",
    backgroundAsset: "backgrounds.rainyRoad",
    characterAssets: [
      { characterId: "dohye", assetKey: "characters.dohye.sad", label: "비 속의 이도해" },
    ],
    narration: [
      "비가 가늘게 내린다. 이도해는 젖은 길가에 서 있고, 품에는 더 이상 움직이지 않는 작은 생명이 있다.",
      "그 얼굴에는 웃음과 슬픔이 섞인 듯한 표정이 지나간다. 교실에서 들었던 말들이 다시 떠오른다.",
    ],
    choices: [
      {
        id: "avoid-and-talk",
        text: "피한 뒤 친구들에게 말한다.",
        resultText: "당신은 불편함을 견디지 못하고 자리를 피한다. 그 이야기는 교실에서 또 다른 소문이 된다.",
        effects: {
          stats: { sight: -3 },
          relations: { dohye: { guard: 10 } },
          addFlags: ["spread_dohye_rumor"],
        },
        nextEventId: "EVENT_04",
        addHistoryText: "비 오는 날의 이도해를 보고 소문에 보탰다.",
      },
      {
        id: "ask-gently",
        text: "“무슨 일이야?”라고 조심스럽게 묻는다.",
        resultText: "이도해는 바로 대답하지 않는다. 그래도 당신의 목소리가 재촉이 아니라는 것은 알아차린 듯하다.",
        effects: {
          stats: { courage: 5, care: 5 },
          relations: { dohye: { trust: 5, guard: -2 } },
          addFlags: ["asked_dohye_gently"],
        },
        nextEventId: "EVENT_04",
        addHistoryText: "이도해에게 조심스럽게 무슨 일인지 물었다.",
      },
      {
        id: "tilt-umbrella",
        text: "아무 말 없이 우산을 기울여 준다.",
        resultText: "말 대신 우산 끝이 조금 움직인다. 이도해는 고개를 돌리지 않지만 빗소리 사이에서 숨을 고른다.",
        effects: {
          stats: { care: 7 },
          relations: { dohye: { guard: -5, closeness: 2 } },
          addFlags: ["quiet_support"],
        },
        nextEventId: "EVENT_04",
        addHistoryText: "이도해에게 말없이 우산을 기울여 주었다.",
      },
    ],
  },
  {
    id: "EVENT_04",
    act: 2,
    type: "dialogue",
    title: "옥상의 하늘",
    location: "학교 옥상",
    time: "점심시간",
    backgroundAsset: "backgrounds.rooftopSky",
    characterAssets: [
      { characterId: "dohye", assetKey: "characters.dohye.rooftop", label: "하늘을 보는 이도해" },
      { characterId: "yul", assetKey: "characters.yul.neutral", label: "잠시 멈춘 안율" },
    ],
    narration: [
      "옥상 문은 생각보다 쉽게 열린다. 바람은 교실보다 차갑고, 하늘은 계속 다른 모양으로 움직인다.",
      "이도해는 하늘을 오래 바라본다. 안율도 그 옆에서 조용히 서 있다.",
    ],
    speaker: "이도해",
    dialogue: "하늘은 계속 달라져. 그래서 좋아.",
    choices: [
      {
        id: "dismiss-sky",
        text: "별 의미 없는 말로 생각한다.",
        resultText: "당신은 그 말을 풍경 감상 정도로 넘긴다. 이도해의 시선이 다시 먼 곳으로 돌아간다.",
        effects: {
          stats: { sight: -1 },
          relations: { dohye: { guard: 3 } },
        },
        nextEventId: "EVENT_04B_DOHYE_NOTE",
        addHistoryText: "이도해의 하늘 이야기를 깊게 듣지 않았다.",
      },
      {
        id: "ask-change",
        text: "“변하고 싶다는 게 무슨 뜻이야?”라고 묻는다.",
        resultText: "질문은 조심스럽다. 이도해는 하늘에서 눈을 떼지 않은 채, 변하고 싶은 마음이 있다는 것만 아주 짧게 말한다.",
        effects: {
          stats: { sight: 4, courage: 3, sincerity: 2 },
          relations: { dohye: { trust: 5, guard: -3 }, yul: { trust: 2 } },
          addFlags: ["heard_dohye_change"],
        },
        nextEventId: "EVENT_04B_DOHYE_NOTE",
        addHistoryText: "이도해에게 변하고 싶다는 말의 뜻을 물었다.",
      },
      {
        id: "share-silence",
        text: "말없이 함께 하늘을 바라본다.",
        resultText: "대답을 요구하지 않는 침묵이 옥상에 놓인다. 이도해도, 안율도 그 침묵을 밀어내지 않는다.",
        effects: {
          stats: { care: 5, sight: 2 },
          relations: { dohye: { closeness: 3, guard: -4 }, yul: { guard: -2 } },
          addFlags: ["shared_rooftop_silence"],
        },
        nextEventId: "EVENT_04B_DOHYE_NOTE",
        addHistoryText: "옥상에서 이도해와 말없는 시간을 함께했다.",
      },
    ],
  },
  {
    id: "EVENT_04B_DOHYE_NOTE",
    act: 2,
    type: "conditional",
    title: "소설 노트의 첫 장",
    location: "옥상 계단",
    time: "점심시간 끝무렵",
    backgroundAsset: "backgrounds.schoolHallway",
    characterAssets: [
      { characterId: "yul", assetKey: "characters.yul.neutral", label: "노트를 든 안율" },
    ],
    required: {
      anyFlags: ["asked_dohye_gently", "quiet_support", "heard_dohye_change", "shared_rooftop_silence"],
    },
    fallbackEventId: "EVENT_05",
    narration: [
      "계단을 내려가던 안율이 노트를 한 번 접었다 편다. 이도해가 안율에게 무엇인가 써 보라고 한 모양이다.",
      "당신은 누군가의 시선이 다른 누군가에게 작은 방향을 만들 수도 있다는 것을 느낀다.",
    ],
    choices: [
      {
        id: "notice-notebook",
        text: "노트가 안율에게 어떤 의미가 될지 조용히 지켜본다.",
        resultText: "안율은 노트를 가방 깊숙이 넣는다. 아직 아무것도 시작되지 않았지만, 시작될 수 있는 자리가 생겼다.",
        effects: {
          stats: { sight: 3, care: 2 },
          relations: { yul: { trust: 2 }, dohye: { trust: 2 } },
        },
        nextEventId: "EVENT_05",
        addHistoryText: "안율의 소설 노트가 시작되는 순간을 지켜보았다.",
      },
    ],
  },
  {
    id: "EVENT_05",
    act: 2,
    type: "observation",
    title: "구멍가게의 서진욱",
    location: "밤의 구멍가게",
    time: "저녁",
    backgroundAsset: "backgrounds.cornerStore",
    characterAssets: [
      { characterId: "jinuk", assetKey: "characters.jinuk.friendly", label: "구멍가게의 서진욱" },
    ],
    narration: [
      "밤길에 작은 구멍가게 불빛이 켜져 있다. 그 안에서 서진욱이 물건을 정리하고 있다.",
      "학교에서 보던 밝고 완벽한 모습과는 조금 다르다. 그 차이를 어떻게 다룰지는 당신에게 달려 있다.",
    ],
    choices: [
      {
        id: "spread-secret",
        text: "다른 친구들에게 말한다.",
        resultText: "비밀처럼 보이는 것을 알게 되자 입이 먼저 움직인다. 이야기는 당신의 손을 떠나 빠르게 다른 의미가 된다.",
        effects: {
          stats: { sincerity: -2, care: -2 },
          relations: { jinuk: { guard: 8, trust: -4 }, classmates: { closeness: 3 } },
          addFlags: ["tempted_to_spread_secret"],
        },
        nextEventId: "EVENT_06",
        addHistoryText: "서진욱의 사정을 다른 친구들에게 말하고 싶어졌다.",
      },
      {
        id: "keep-secret",
        text: "모르는 척하고 비밀을 지킨다.",
        resultText: "당신은 아는 척하지 않는다. 서진욱은 잠깐 당황했지만, 당신이 아무 말도 하지 않자 표정을 고친다.",
        effects: {
          stats: { care: 4, sincerity: 2 },
          relations: { jinuk: { trust: 5, guard: -3 } },
          addFlags: ["kept_jinuk_secret", "protected_jinuk_secret"],
        },
        nextEventId: "EVENT_06",
        addHistoryText: "서진욱의 비밀을 지켰다.",
      },
      {
        id: "ask-situation",
        text: "조심스럽게 상황을 묻는다.",
        resultText: "서진욱은 웃어넘기려 하지만, 당신의 질문이 놀림이 아니라는 것을 확인하고 말을 아낀다.",
        effects: {
          stats: { courage: 3, care: 3 },
          relations: { jinuk: { trust: 3, guard: -1 } },
          addFlags: ["kept_jinuk_secret"],
        },
        nextEventId: "EVENT_06",
        addHistoryText: "서진욱에게 조심스럽게 상황을 물었다.",
      },
    ],
  },
];
