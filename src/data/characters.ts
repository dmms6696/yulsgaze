import type { CharacterDefinition, RelationMap } from "../types/game";

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: "yul",
    name: "안율",
    role: "성장의 중심축",
    description: "타인의 시선을 두려워하지만, 자신의 시선을 바꾸는 길로 천천히 나아간다.",
  },
  {
    id: "dohye",
    name: "이도해",
    role: "다른 세계와 다른 시선",
    description: "이상하다는 말 뒤에 감춰진 상처와 변화의 욕망을 품고 있다.",
  },
  {
    id: "jinuk",
    name: "서진욱",
    role: "완벽해 보이는 겉모습과 결핍",
    description: "친화적이고 유능해 보이지만, 자기만의 사정을 숨기고 있다.",
  },
  {
    id: "minwoo",
    name: "김민우",
    role: "질투와 소문",
    description: "자존심과 열등감 사이에서 타인의 비밀을 이용하려 한다.",
  },
  {
    id: "donghwi",
    name: "김동휘",
    role: "무신경한 말과 분위기",
    description: "명확한 악의가 없어도 떠벌리는 말로 누군가를 다치게 할 수 있다.",
  },
  {
    id: "jimin",
    name: "김지민",
    role: "타인의 시선 속 자기 가치",
    description: "상처를 겪고도 자기 감정을 마주하며 다시 일어서려 한다.",
  },
  {
    id: "classmates",
    name: "반 친구들",
    role: "교실의 분위기",
    description: "소문과 서열, 방관의 공기를 만들어 내는 집단이다.",
  },
];

export const INITIAL_RELATIONS: RelationMap = {
  yul: { closeness: 18, trust: 18, guard: 50 },
  dohye: { closeness: 14, trust: 14, guard: 64 },
  jinuk: { closeness: 50, trust: 28, guard: 24 },
  minwoo: { closeness: 15, trust: 12, guard: 35 },
  donghwi: { closeness: 35, trust: 25, guard: 15 },
  jimin: { closeness: 40, trust: 38, guard: 40 },
  classmates: { closeness: 30, trust: 26, guard: 20 },
};

export const VISUAL_CHARACTER_NAMES: Record<string, string> = {
  yulMother: "안율의 엄마",
  jinukFather: "서진욱의 아버지",
};

export function getCharacterName(characterId: string) {
  return CHARACTERS.find((character) => character.id === characterId)?.name ?? VISUAL_CHARACTER_NAMES[characterId] ?? characterId;
}
