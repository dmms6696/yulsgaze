import type { ActNumber } from "../types/game";

export const GAME_VERSION = 4;
export const FIRST_EVENT_ID = "EVENT_01";
export const ENDING_CHECK_EVENT_ID = "ENDING_CHECK";
export const TOTAL_STORY_EVENTS = 37;
export const TOTAL_EVENTS_WITH_ENDING_CHECK = 38;

export const GAME_META = {
  title: "율의 시선: 북극성이 되기까지",
  subtitle: "《율의 시선》 기반 선택형 스토리 웹게임",
  coreMessage:
    "이 게임은 안율을 바꾸는 게임이 아니라, 플레이어가 안율과 이도해를 바라보는 자신의 시선을 바꾸는 게임이다.",
  creatorCredit:
    "게임 제작자: 문주환 김은혁 김지호 박수연 소현준 이소유 정우인 황지후 송기훈 이승원 류효민 박세아 박하은 유수린",
  intro:
    "당신은 《율의 시선》 속 교실에 들어온 제3의 학생입니다. 무엇을 보고, 어떻게 생각하고, 어떤 말을 선택하느냐에 따라 이야기가 달라집니다.",
  contentNotice:
    "이 게임에는 상실, 따돌림, 가정 내 어려움, 실종과 관련된 내용이 포함되어 있습니다.",
};

export const ACT_TITLES: Record<ActNumber, string> = {
  1: "1막: 첫 관계와 작은 신뢰",
  2: "2막: 소문과 충돌 사이",
  3: "3막: 상처를 마주하는 시간",
  4: "4막: 찾는 마음과 북극성",
};

export const ACT_QUESTIONS: Record<ActNumber, string> = {
  1: "나는 남들이 말하는 대로 사람을 볼 것인가?",
  2: "이상해 보이는 행동 뒤에는 무엇이 있을 수 있을까?",
  3: "나는 방관자가 될 것인가, 소문에 휩쓸릴 것인가, 조심스럽게 행동할 것인가?",
  4: "의미는 누가 만드는가? 나는 어떤 시선으로 살아갈 것인가?",
};
