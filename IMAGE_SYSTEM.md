# 이미지 시스템 안내

이 게임은 장면 데이터에 `visual` 정보를 더하면 배경, 인물, 소품, 핵심 일러스트를 따로 배치할 수 있다. 기존 이벤트의 `backgroundAsset`, `characterAssets`도 계속 사용할 수 있어서 예전 저장 데이터와 선택 흐름은 바뀌지 않는다.

## 자산 폴더

이미지는 `public/assets` 아래에 넣는다. 배포 빌드를 하면 GitHub Pages용 `docs/assets`로 복사된다.

- `title`: 시작 화면 대표 이미지
- `act-transitions`: 1막-4막 전환 이미지
- `backgrounds`: 교실, 골목, 밤하늘 같은 배경
- `illustrations`: 중요한 장면 한 컷 일러스트
- `characters`: 인물 스프라이트
- `props`: 우산, 전단지, 공 같은 소품
- `endings`: 엔딩별 이미지
- `ui`: 공통 대체 이미지

권장 크기는 배경/일러스트/엔딩 `1920x1080` 또는 `1600x900`, 시작 화면 `1600x1000`, 캐릭터 스프라이트는 투명 배경의 세로형 `1000x1600`, 소품은 투명 배경 `800x800` 안팎이다. 파일 형식은 `.webp`를 권장한다.

## 장면 모드

- `background`: 배경만 보여 주는 일반 장면
- `characters`: 배경 위에 인물과 소품을 올리는 비주얼노벨 장면
- `illustration`: 중요한 순간의 한 컷 그림을 우선 보여 주는 장면

`illustrationAsset` 파일이 없거나 불러오지 못하면 자동으로 배경+인물 장면으로 돌아간다. 화면에는 깨진 이미지 아이콘 대신 이미지 슬롯이 보인다.

## 이벤트 작성 예시

```ts
visual: {
  mode: "characters",
  backgroundAsset: "backgrounds.rainyRoad",
  overlay: "rain",
  focalPoint: { x: 52, y: 42 },
  characters: [
    { characterId: "dohye", expression: "sad", position: "left", focus: true },
    { characterId: "yul", expression: "anxious", position: "right", flipX: true },
  ],
  props: [
    { assetKey: "props.umbrella", position: "center", scale: 0.55, offsetY: 24 },
  ],
}
```

`position`을 쓰지 않으면 자동 배치된다. 1명은 가운데, 2명은 왼쪽/오른쪽, 3명은 왼쪽/가운데/오른쪽, 4명은 먼 왼쪽/왼쪽 가운데/오른쪽 가운데/먼 오른쪽으로 배치된다.

## 캐릭터 조절값

- `expression`: 표정 파일 이름이다. 예: `characters.yul.anxious`
- `position`: `far-left`, `left`, `center-left`, `center`, `center-right`, `right`, `far-right`
- `scale`: 크기 조절. `1`이 기본, `0.85`는 작게, `1.15`는 크게
- `offsetX`, `offsetY`: 위치를 px 단위로 미세 조정
- `flipX`: 좌우 반전
- `focus`: 말하는 인물이나 중요한 인물을 강조
- `layer`: 앞뒤 순서. 숫자가 클수록 앞에 보임

대사에 `speaker: "안율"`처럼 들어 있으면 같은 `characterId`의 캐릭터가 자동으로 강조된다. 이 기능을 끄려면 `speakerFocus: false`를 쓴다.

## 대체 규칙

- 배경: 요청한 배경 -> 장면 기본 -> 막 기본 -> 공통 기본 -> 슬롯
- 캐릭터 표정: 요청한 표정 -> neutral -> silhouette -> 이름 카드
- 소품: 없으면 조용히 생략
- 일러스트: 없으면 배경+인물 장면으로 대체

## 시작·막 전환·엔딩 이미지

시작 화면 이미지는 `src/data/scenePresets.ts`의 `START_SCREEN_VISUAL`에서 바꾼다. 1막-4막 전환 이미지는 같은 파일의 `ACT_TRANSITION_VISUALS`에서 켜고 끌 수 있다. 엔딩 이미지는 `src/data/endings.ts`의 `imageAsset`으로 연결한다.

## 자산 점검

아래 명령을 실행하면 사용 중인 자산 키, 매니페스트 누락, 실제 파일 누락, 이벤트별 사용 내역이 `ASSET_AUDIT.md`에 기록된다.

```bash
npm run audit-assets
```

지금 이미지 파일을 아직 넣지 않았다면 `Used Keys With Missing Files`에 많이 표시되는 것이 정상이다. 해당 경로에 파일을 넣고 다시 빌드하면 슬롯이 실제 이미지로 바뀐다.
