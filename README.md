# 율의 시선: 북극성이 되기까지

React·TypeScript·Vite 기반 선택형 스토리 웹게임입니다.

플레이어는 《율의 시선》 세계에 들어온 제3의 학생이며, 원작 인물을 대신해 사건을 해결하지 않습니다. 소문, 시선, 방관, 상처, 변화 앞에서 무엇을 보고 어떻게 말하고 행동할지 선택합니다.

## 구현 기능

- 이름 입력 후 게임 시작
- 저장 데이터가 있을 때만 이어하기 표시
- localStorage 자동 저장과 이어하기
- 저장 데이터 초기화 확인 모달
- 데스크톱 좌우 분할 UI
- 모바일 상태 패널 접기/펼치기
- 장면 이미지 슬롯과 이미지 누락 대체 화면
- 4막 구조와 필수 핵심 사건 15개
- 조건부 숨은 장면 1개
- 선택지 조건 판정
- 이벤트 조건과 fallback 이벤트 처리
- 스탯, 관계, 플래그 변화 적용
- 선택 직후 결과와 변화 수치 표시
- 계속하기 버튼 이후 다음 장면 이동
- 최근 선택 기록 5개와 전체 기록 보기
- 최소 5개 요구사항을 넘는 엔딩 6개
- 데이터와 엔진, UI 분리

## 실행 방법

```bash
pnpm install
pnpm run dev
```

브라우저에서 Vite가 안내하는 로컬 주소로 접속합니다.

## 빌드 방법

```bash
pnpm run build
```

빌드 결과는 `dist/`에 생성됩니다.

## 배포 방법

### GitHub Pages

1. 이 프로젝트를 GitHub 저장소에 올립니다.
2. `pnpm install`과 `pnpm run build`가 실행되는 GitHub Actions workflow를 구성합니다.
3. `dist/` 폴더를 Pages 배포 대상으로 지정합니다.
4. `vite.config.ts`의 `base`는 현재 `./`로 되어 있어 정적 배포에 사용할 수 있습니다.

### Netlify

1. Netlify에서 저장소를 연결합니다.
2. Build command: `pnpm run build`
3. Publish directory: `dist`
4. 환경 변수나 서버 설정은 필요하지 않습니다.

## 프로젝트 구조

```text
src/
  components/        화면 컴포넌트
  data/              게임 콘텐츠 데이터
  data/events/       4막별 이벤트 데이터
  engine/            조건, 효과, 엔딩, 저장 엔진
  types/             공통 타입
  utils/             값 보정과 텍스트 도구
public/assets/       추후 이미지가 들어갈 위치
```

## 게임 데이터 수정 위치

- 게임 제목과 막 정보: `src/data/gameMeta.ts`
- 플레이어 스탯 정의: `src/data/stats.ts`
- 인물과 초기 관계값: `src/data/characters.ts`
- 플래그 한국어 표시명: `src/data/flags.ts`
- 이미지 경로: `src/data/assetManifest.ts`
- 사건 데이터: `src/data/events/act1.ts` ~ `act4.ts`
- 엔딩 데이터: `src/data/endings.ts`

React 컴포넌트는 데이터 구조만 읽습니다. 학생 설계안을 추가할 때는 보통 `src/data/events/`나 `src/data/endings.ts`만 수정하면 됩니다.

## 이벤트 추가 방법

이벤트는 `GameEvent` 형식의 객체입니다.

```ts
{
  id: "EVENT_16_STUDENT_SCENE",
  act: 2,
  type: "hidden",
  title: "조별 활동에서 같은 조가 된 날",
  location: "교실",
  time: "국어 시간",
  backgroundAsset: "backgrounds.cloudyClassroom",
  narration: ["플레이어와 안율이 같은 조가 된다."],
  choices: [
    {
      id: "quiet-role",
      text: "네가 편한 방식으로 역할을 정해도 된다고 말한다.",
      resultText: "안율의 경계가 조금 낮아진다.",
      effects: {
        stats: { care: 3 },
        relations: { yul: { guard: -3, trust: 2 } },
        addFlags: ["quiet_support"]
      },
      nextEventId: "EVENT_05"
    }
  ]
}
```

추가한 이벤트를 해당 막 파일의 배열에 넣고, 앞 사건의 `nextEventId`를 새 이벤트 ID로 바꿉니다. 새 이벤트의 마지막 선택지는 원래 다음 사건으로 연결합니다.

## 학생 설계안을 기존 사건 사이에 삽입하는 방법

예를 들어 `EVENT_04`와 `EVENT_05` 사이에 학생이 제안한 숨은 에피소드를 넣으려면:

1. `src/data/events/act2.ts`에 새 이벤트를 추가합니다.
2. 새 이벤트 ID를 `EVENT_04_STUDENT_GROUP_ACTIVITY`처럼 고유하게 정합니다.
3. `EVENT_04` 선택지들의 `nextEventId`를 새 이벤트 ID로 바꿉니다.
4. 새 이벤트 선택지들의 `nextEventId`를 `EVENT_05`로 둡니다.
5. 특정 조건에서만 열리게 하려면 새 이벤트에 `required`와 `fallbackEventId: "EVENT_05"`를 넣습니다.

## 선택지 추가 방법

기존 이벤트의 `choices` 배열에 `GameChoice` 객체를 추가합니다.

- `id`: 선택지 고유 ID
- `text`: 버튼에 보이는 문장
- `resultText`: 선택 직후 표시되는 결과
- `effects`: 스탯, 관계, 플래그 변화
- `required`: 선택 가능 조건
- `disabledReason`: 조건 미충족 시 안내 문구
- `nextEventId`: 다음 이벤트 ID
- `addHistoryText`: 상태 패널 기록에 남길 문장

## 스탯 변화 설정 방법

```ts
effects: {
  stats: {
    sight: 5,
    care: -2
  }
}
```

스탯은 자동으로 0~100 범위로 제한됩니다.

## 관계 변화 설정 방법

```ts
effects: {
  relations: {
    yul: { trust: 3, guard: -2 },
    dohye: { closeness: 2 }
  }
}
```

관계값도 자동으로 0~100 범위로 제한됩니다.

## 플래그 추가 방법

플래그는 학생 화면에서는 “기억된 선택”으로 표시됩니다. 코드에서는 조건 판정을 위해 짧은 영문 ID를 씁니다.

```ts
effects: {
  addFlags: ["reserved_judgment"],
  removeFlags: ["believed_rumor"]
}
```

새 플래그를 만들면 `src/types/game.ts`의 `FlagId`와 `src/data/flags.ts`의 `FLAG_LABELS`에 추가합니다.

## 조건부 선택지 작성 방법

```ts
{
  id: "protect-secret-again",
  text: "이미 지켜 본 비밀이 있으니, 이번에도 소문을 막는다.",
  required: {
    requiredFlags: ["kept_jinuk_secret"],
    statsMin: { courage: 15 }
  },
  disabledReason: "서진욱의 비밀을 지킨 적이 있고 관계 용기가 15 이상일 때 선택할 수 있습니다."
}
```

## 조건부 이벤트 작성 방법

```ts
{
  id: "EVENT_STUDENT_HIDDEN",
  type: "conditional",
  required: {
    anyFlags: ["quiet_support", "asked_dohye_gently"]
  },
  fallbackEventId: "EVENT_05"
}
```

조건을 만족하지 못하면 `fallbackEventId`로 이동합니다.

## 엔딩 추가 방법

`src/data/endings.ts`에 `Ending` 객체를 추가합니다.

- `priority`가 높을수록 먼저 판정됩니다.
- 조건이 겹치면 우선순위가 높은 엔딩이 선택됩니다.
- 조건을 넣지 않은 기본 엔딩은 가장 낮은 우선순위로 둡니다.

## 이미지 연결 방법

이미지는 모두 `public/assets/` 아래에 둡니다. 이벤트 데이터에서는 실제 경로를 직접 쓰지 않고 `assetManifest.ts`의 key를 참조합니다.

예:

```ts
backgroundAsset: "backgrounds.rooftopSky"
```

이미지가 없으면 장면 이름, 이미지 슬롯 ID, “추후 장면 이미지 삽입 예정” 문구가 있는 대체 화면이 표시됩니다.

## 인물 초상화 연결 방법

```ts
characterAssets: [
  { characterId: "yul", assetKey: "characters.yul.softened", label: "조용해진 안율" }
]
```

현재 UI는 초상화 슬롯 이름을 표시합니다. 실제 초상화 이미지를 더 크게 쓰고 싶다면 `StoryPanel.tsx`에서 `characterAssets` 렌더링만 확장하면 됩니다. 게임 엔진은 수정할 필요가 없습니다.

## 현재 이미지 상태

실제 이미지는 포함하지 않았습니다. 모든 장면은 `assetManifest.ts`에 경로만 준비되어 있으며, 파일이 없을 때 대체 화면으로 처리됩니다. 필요한 이미지 목록은 `IMAGE_REQUIREMENTS.md`에 정리되어 있습니다.
