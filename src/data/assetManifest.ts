import type { ActNumber, CharacterId } from "../types/game";

type AssetTree = {
  readonly [key: string]: string | AssetTree;
};

const assetPath = (path: string) => `./assets/${path}`;

export const ASSETS = {
  title: {
    main: assetPath("title/yul-gaze-main.png"),
    classroomWindow: assetPath("title/classroom-window.webp"),
  },
  actTransitions: {
    act1: assetPath("act-transitions/act-1-rumor.webp"),
    act2: assetPath("act-transitions/act-2-hidden-reasons.webp"),
    act3: assetPath("act-transitions/act-3-conflict.webp"),
    act4: assetPath("act-transitions/act-4-polaris.webp"),
  },
  backgrounds: {
    commonDefault: assetPath("backgrounds/common-default.webp"),
    sceneDefault: assetPath("backgrounds/scene-default.webp"),
    act1Default: assetPath("backgrounds/act-1-default.webp"),
    act2Default: assetPath("backgrounds/act-2-default.webp"),
    act3Default: assetPath("backgrounds/act-3-default.webp"),
    act4Default: assetPath("backgrounds/act-4-default.webp"),
    classroomFirstDay: assetPath("backgrounds/classroom-first-day.webp"),
    cloudyClassroom: assetPath("backgrounds/cloudy-classroom.webp"),
    rainyRoad: assetPath("backgrounds/rainy-road.webp"),
    schoolHallway: assetPath("backgrounds/school-hallway.webp"),
    rooftopSky: assetPath("backgrounds/rooftop-sky.webp"),
    playground: assetPath("backgrounds/playground.webp"),
    nightAlley: assetPath("backgrounds/night-alley.webp"),
    cornerStore: assetPath("backgrounds/corner-store.webp"),
    nurseRoom: assetPath("backgrounds/nurse-room.webp"),
    hospital: assetPath("backgrounds/hospital.webp"),
    hospitalStreet: assetPath("backgrounds/hospital-street.webp"),
    wayHome: assetPath("backgrounds/way-home.webp"),
    quietCatPlace: assetPath("backgrounds/quiet-cat-place.webp"),
    catFarewell: assetPath("backgrounds/cat-farewell.webp"),
    columbarium: assetPath("backgrounds/columbarium.webp"),
    dohyeHouseStreet: assetPath("backgrounds/dohye-house-street.webp"),
    neglectedHouse: assetPath("backgrounds/neglected-house.webp"),
    missingPosterStreet: assetPath("backgrounds/missing-poster-street.webp"),
    starNight: assetPath("backgrounds/star-night.png"),
    polarisEnding: assetPath("backgrounds/polaris-ending.webp"),
  },
  illustrations: {
    rumorCircle: assetPath("illustrations/rumor-circle.webp"),
    yulLookingDown: assetPath("illustrations/yul-looking-down.webp"),
    rainyUmbrella: assetPath("illustrations/rainy-umbrella.webp"),
    rooftopSilence: assetPath("illustrations/rooftop-silence.webp"),
    secretNotebook: assetPath("illustrations/secret-notebook.webp"),
    hallwayFight: assetPath("illustrations/hallway-fight.webp"),
    catFarewell: assetPath("illustrations/cat-farewell.webp"),
    columbariumTalk: assetPath("illustrations/columbarium-talk.webp"),
    missingPosters: assetPath("illustrations/missing-posters.webp"),
    polarisPromise: assetPath("illustrations/polaris-promise.webp"),
  },
  characters: {
    yul: {
      neutral: assetPath("characters/yul-neutral.webp"),
      anxious: assetPath("characters/yul-anxious.webp"),
      angry: assetPath("characters/yul-angry.webp"),
      softened: assetPath("characters/yul-softened.webp"),
      growth: assetPath("characters/yul-growth.webp"),
      silhouette: assetPath("characters/yul-silhouette.webp"),
    },
    dohye: {
      neutral: assetPath("characters/dohye-neutral.webp"),
      smile: assetPath("characters/dohye-smile.webp"),
      rooftop: assetPath("characters/dohye-rooftop.webp"),
      sad: assetPath("characters/dohye-sad.webp"),
      silhouette: assetPath("characters/dohye-silhouette.webp"),
    },
    jinuk: {
      neutral: assetPath("characters/jinuk-neutral.webp"),
      friendly: assetPath("characters/jinuk-friendly.webp"),
      angry: assetPath("characters/jinuk-angry.webp"),
      injured: assetPath("characters/jinuk-injured.webp"),
      honest: assetPath("characters/jinuk-honest.webp"),
      silhouette: assetPath("characters/jinuk-silhouette.webp"),
    },
    minwoo: {
      neutral: assetPath("characters/minwoo-neutral.webp"),
      proud: assetPath("characters/minwoo-proud.webp"),
      brittle: assetPath("characters/minwoo-brittle.webp"),
      silhouette: assetPath("characters/minwoo-silhouette.webp"),
    },
    donghwi: {
      neutral: assetPath("characters/donghwi-neutral.webp"),
      casual: assetPath("characters/donghwi-casual.webp"),
      loud: assetPath("characters/donghwi-loud.webp"),
      silhouette: assetPath("characters/donghwi-silhouette.webp"),
    },
    jimin: {
      neutral: assetPath("characters/jimin-neutral.webp"),
      guarded: assetPath("characters/jimin-guarded.webp"),
      honest: assetPath("characters/jimin-honest.webp"),
      reconciled: assetPath("characters/jimin-reconciled.webp"),
      silhouette: assetPath("characters/jimin-silhouette.webp"),
    },
    classmates: {
      neutral: assetPath("characters/classmates-neutral.webp"),
      group: assetPath("characters/classmates-group.webp"),
      whisper: assetPath("characters/classmates-whisper.webp"),
      silhouette: assetPath("characters/classmates-silhouette.webp"),
    },
  },
  props: {
    soccerBall: assetPath("props/soccer-ball.webp"),
    tunaCan: assetPath("props/tuna-can.webp"),
    cat: assetPath("props/cat.webp"),
    note: assetPath("props/note.webp"),
    luxuryBag: assetPath("props/luxury-bag.webp"),
    cast: assetPath("props/cast.webp"),
    storyNotebook: assetPath("props/story-notebook.webp"),
    missingPoster: assetPath("props/missing-poster.webp"),
    polaris: assetPath("props/polaris.webp"),
    umbrella: assetPath("props/umbrella.webp"),
  },
  endings: {
    polarisTogether: assetPath("endings/polaris-together.webp"),
    slowResee: assetPath("endings/slow-resee.webp"),
    safeObserver: assetPath("endings/safe-observer.webp"),
    hastyGaze: assetPath("endings/hasty-gaze.webp"),
    lateHeart: assetPath("endings/late-heart.webp"),
    defaultGaze: assetPath("endings/default-gaze.webp"),
  },
  ui: {
    scenePlaceholder: assetPath("ui/scene-placeholder.webp"),
    characterSilhouette: assetPath("ui/character-silhouette.webp"),
    imageMissing: assetPath("ui/image-missing.webp"),
  },
} as const satisfies AssetTree;

export type ManifestGroup = keyof typeof ASSETS;

export const ACT_DEFAULT_BACKGROUND_ASSETS: Record<ActNumber, string> = {
  1: "backgrounds.act1Default",
  2: "backgrounds.act2Default",
  3: "backgrounds.act3Default",
  4: "backgrounds.act4Default",
};

function normalizeLegacyAssetKey(assetKey: string) {
  return assetKey.startsWith("objects.") ? assetKey.replace(/^objects\./, "props.") : assetKey;
}

function lookupAsset(assetKey: string): string | undefined {
  const parts = normalizeLegacyAssetKey(assetKey).split(".");
  let cursor: string | AssetTree = ASSETS;

  for (const part of parts) {
    if (typeof cursor === "string") {
      return undefined;
    }
    if (!(part in cursor)) {
      return undefined;
    }
    cursor = cursor[part];
  }

  return typeof cursor === "string" ? cursor : undefined;
}

export function resolveAssetPath(assetKey?: string): string | undefined {
  if (!assetKey) {
    return undefined;
  }
  return lookupAsset(assetKey);
}

export function assetKeyExists(assetKey?: string): boolean {
  return Boolean(resolveAssetPath(assetKey));
}

export function resolveBackgroundAsset(assetKey?: string, act?: ActNumber): string | undefined {
  return getBackgroundAssetCandidates(assetKey, act)[0];
}

export function resolveCharacterAsset(characterId: CharacterId, expression = "neutral"): string | undefined {
  return getCharacterAssetCandidates(characterId, expression)[0];
}

export function resolvePropAsset(assetKey?: string): string | undefined {
  return resolveAssetPath(assetKey);
}

function uniqueResolvedAssetPaths(assetKeys: Array<string | undefined>) {
  return Array.from(new Set(assetKeys.map((key) => resolveAssetPath(key)).filter(Boolean))) as string[];
}

export function getBackgroundAssetCandidates(assetKey?: string, act?: ActNumber): string[] {
  return uniqueResolvedAssetPaths([
    assetKey,
    "backgrounds.sceneDefault",
    act ? ACT_DEFAULT_BACKGROUND_ASSETS[act] : undefined,
    "backgrounds.commonDefault",
    "ui.scenePlaceholder",
  ]);
}

export function getCharacterAssetCandidates(characterId: CharacterId, expression = "neutral"): string[] {
  return uniqueResolvedAssetPaths([
    `characters.${characterId}.${expression}`,
    `characters.${characterId}.neutral`,
    `characters.${characterId}.silhouette`,
    "ui.characterSilhouette",
  ]);
}

export function getAssetGroup(assetKey: string): ManifestGroup | "unknown" {
  const group = normalizeLegacyAssetKey(assetKey).split(".")[0];
  return group in ASSETS ? (group as ManifestGroup) : "unknown";
}

export function listManifestAssetKeys(): string[] {
  const keys: string[] = [];

  function walk(node: AssetTree, prefix: string) {
    Object.entries(node).forEach(([key, value]) => {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") {
        keys.push(nextKey);
      } else {
        walk(value, nextKey);
      }
    });
  }

  walk(ASSETS, "");
  return keys;
}
