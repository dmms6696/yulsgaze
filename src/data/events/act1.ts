import type { GameEvent } from "../../types/game";

export const act1Events: GameEvent[] = [
  {
    id: "EVENT_01",
    act: 1,
    type: "observation",
    title: "1반의 소문",
    location: "1반 교실",
    time: "첫 등교일 오전",
    backgroundAsset: "backgrounds.classroomFirstDay",
    characterAssets: [
      { characterId: "classmates", assetKey: "characters.classmates.whisper", label: "수군거리는 반 친구들" },
    ],
    narration: [
      "새 학급의 공기는 아직 낯설다. 책상 사이로 이름표와 시선이 오가고, 누군가는 벌써 누군가에 대해 알고 있다는 듯 말한다.",
      "한 학생이 이도해를 가리켜 이상한 애라고 설명한다. 말은 가볍지만, 그 말이 교실의 분위기를 조금씩 기울게 한다.",
    ],
    speaker: "반 친구",
    dialogue: "너도 곧 알게 될 거야. 쟤는 좀 달라.",
    choices: [
      {
        id: "believe-rumor",
        text: "“진짜 이상한 애인가 보네.”",
        resultText: "교실의 분위기에 맞장구를 치자 주변 친구들은 조금 편하게 웃는다. 하지만 당신은 아직 직접 본 것이 없다.",
        effects: {
          stats: { sight: -2 },
          relations: {
            classmates: { closeness: 3 },
            dohye: { guard: 5 },
          },
          addFlags: ["believed_rumor"],
        },
        nextEventId: "EVENT_02",
        addHistoryText: "이도해에 대한 소문을 쉽게 믿었다.",
      },
      {
        id: "reserve-judgment",
        text: "“직접 보기 전까지는 모르지.”",
        resultText: "말이 잠깐 멈춘다. 분위기를 깨뜨린 것은 아니지만, 당신은 아직 보지 못한 사람을 단정하지 않기로 한다.",
        effects: {
          stats: { sight: 5, care: 3 },
          addFlags: ["reserved_judgment"],
        },
        nextEventId: "EVENT_02",
        addHistoryText: "이도해에 대한 판단을 미뤘다.",
      },
      {
        id: "stay-silent",
        text: "아무 말도 하지 않는다.",
        resultText: "당신은 대화에 끼지 않는다. 편하긴 했지만, 침묵이 언제나 중립인 것은 아니라는 생각이 잠깐 스친다.",
        effects: {
          stats: { courage: -1 },
          addFlags: ["silent_observer"],
        },
        nextEventId: "EVENT_02",
        addHistoryText: "소문 앞에서 아무 말도 하지 않았다.",
      },
    ],
  },
  {
    id: "EVENT_02",
    act: 1,
    type: "observation",
    title: "안율의 발끝",
    location: "교실 뒷문 근처",
    time: "쉬는 시간",
    backgroundAsset: "backgrounds.cloudyClassroom",
    characterAssets: [
      { characterId: "yul", assetKey: "characters.yul.anxious", label: "시선을 피하는 안율" },
    ],
    narration: [
      "안율은 대화를 하면서도 사람의 눈보다 발끝을 더 자주 본다. 말투는 평범하지만 시선은 늘 한 박자씩 뒤로 물러난다.",
      "그 모습은 무례해 보일 수도, 불안해 보일 수도 있다. 당신이 무엇을 먼저 보느냐에 따라 안율은 다른 사람처럼 느껴진다.",
    ],
    speaker: "안율",
    dialogue: "아, 괜찮아. 그냥... 이쪽이 편해서.",
    choices: [
      {
        id: "misread-yul",
        text: "무례한 행동이라고 생각한다.",
        resultText: "당신은 안율의 태도를 거리 두기로 읽는다. 안율은 당신의 짧은 표정을 보고 더 조심스러워진다.",
        effects: {
          stats: { sight: -2 },
          relations: { yul: { guard: 5 } },
          addFlags: ["misread_yul"],
        },
        nextEventId: "EVENT_03",
        addHistoryText: "안율이 눈을 피하는 모습을 무례하게 받아들였다.",
      },
      {
        id: "notice-gaze",
        text: "눈을 마주치기 어려운 이유가 있을 수 있다고 생각한다.",
        resultText: "당신은 안율의 시선이 피하는 것인지, 버티는 것인지 잠시 생각한다. 안율의 어깨가 아주 조금 내려간다.",
        effects: {
          stats: { sight: 5, care: 3 },
          relations: { yul: { guard: -2 } },
          addFlags: ["noticed_yul_gaze"],
        },
        nextEventId: "EVENT_03",
        addHistoryText: "안율이 시선을 피하는 이유가 있을 수 있다고 생각했다.",
      },
      {
        id: "ask-directly",
        text: "“왜 눈을 안 봐?”라고 직접 묻는다.",
        resultText: "질문은 솔직했지만 너무 빠르다. 안율은 짧게 웃고 대답을 피한다.",
        effects: {
          stats: { courage: 3 },
          relations: { yul: { guard: 7, trust: -2 } },
        },
        nextEventId: "EVENT_03",
        addHistoryText: "안율에게 시선을 피하는 이유를 바로 물었다.",
      },
    ],
  },
];
