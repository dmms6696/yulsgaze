import type { ActNumber, VisualCharacterId } from "../types/game";

type AssetLeaf = string | undefined;
type AssetTree = {
  readonly [key: string]: AssetLeaf | AssetTree;
};

const assetPath = (path: string) => `./assets/${path}`;
const missingAsset = (): undefined => undefined;

export const ASSETS = {
  title: {
    main: assetPath("title/yul-gaze-start-classroom.png"),
    classroomWindow: missingAsset(),
  },
  actTransitions: {
    act1: missingAsset(),
    act2: missingAsset(),
    act3: missingAsset(),
    act4: missingAsset(),
  },
  backgrounds: {
    commonDefault: missingAsset(),
    sceneDefault: missingAsset(),
    act1Default: missingAsset(),
    act2Default: missingAsset(),
    act3Default: missingAsset(),
    act4Default: missingAsset(),
    schoolyardTree: missingAsset(),
    rooftopSky: missingAsset(),
    rooftopSunset: missingAsset(),
    schoolyardFootball: missingAsset(),
    catAlleyNight: missingAsset(),
    rooftopStairs: missingAsset(),
    cornerStoreNight: missingAsset(),
    cloudyClassroom: missingAsset(),
    classroomFight: missingAsset(),
    schoolHallwayConflict: missingAsset(),
    nurseRoom: missingAsset(),
    hospitalExit: missingAsset(),
    afterSchoolRoad: missingAsset(),
    crowdedClassroom: missingAsset(),
    classroomAfterExam: missingAsset(),
    quietRooftopNight: missingAsset(),
    darkRoomWindow: missingAsset(),
    counselingRoom: missingAsset(),
    trashHouse: missingAsset(),
    missingPosterStreet: missingAsset(),
    starNightSchoolyard: assetPath("backgrounds/star-night.png"),
    classroomFirstDay: missingAsset(),
    rainyRoad: missingAsset(),
    schoolHallway: missingAsset(),
    playground: missingAsset(),
    nightAlley: missingAsset(),
    cornerStore: missingAsset(),
    hospital: missingAsset(),
    hospitalStreet: missingAsset(),
    wayHome: missingAsset(),
    quietCatPlace: missingAsset(),
    catFarewell: missingAsset(),
    columbarium: missingAsset(),
    dohyeHouseStreet: missingAsset(),
    neglectedHouse: missingAsset(),
    starNight: assetPath("backgrounds/star-night.png"),
    polarisEnding: missingAsset(),
  },
  illustrations: {
    dohyeDeadCat: missingAsset(),
    catFarewell: missingAsset(),
    yulChainRope: missingAsset(),
    robberyMemory: missingAsset(),
    dohyeHospital: missingAsset(),
    trashHouseVisit: missingAsset(),
    missingPosterWalk: missingAsset(),
    yulPolarisGrowth: missingAsset(),
    rumorCircle: missingAsset(),
    yulLookingDown: missingAsset(),
    rainyUmbrella: missingAsset(),
    rooftopSilence: missingAsset(),
    secretNotebook: missingAsset(),
    hallwayFight: missingAsset(),
    columbariumTalk: missingAsset(),
    missingPosters: missingAsset(),
    polarisPromise: missingAsset(),
  },
  characters: {
    yul: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    dohye: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    jinuk: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    minwoo: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    donghwi: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    jimin: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    classmates: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    yulMother: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
    jinukFather: {
      neutral: missingAsset(),
      anxious: missingAsset(),
      angry: missingAsset(),
      softened: missingAsset(),
      growth: missingAsset(),
      silhouette: missingAsset(),
    },
  },
  props: {
    soccerBall: missingAsset(),
    tunaCan: missingAsset(),
    cat: missingAsset(),
    note: missingAsset(),
    luxuryBag: missingAsset(),
    cast: missingAsset(),
    storyNotebook: missingAsset(),
    missingPoster: missingAsset(),
    polaris: missingAsset(),
    umbrella: missingAsset(),
    waterBottle: missingAsset(),
    pencil: missingAsset(),
    tissue: missingAsset(),
    bag: missingAsset(),
    teacherDoor: missingAsset(),
    phone: missingAsset(),
    icePack: missingAsset(),
    crutch: missingAsset(),
    snack: missingAsset(),
    flowers: missingAsset(),
    sleeve: missingAsset(),
    ropeShadow: missingAsset(),
    chair: missingAsset(),
    hospitalBed: missingAsset(),
    windowLight: missingAsset(),
    flyer: missingAsset(),
  },
  endings: {
    polarisTogether: missingAsset(),
    slowResee: missingAsset(),
    safeObserver: missingAsset(),
    hastyGaze: missingAsset(),
    lateHeart: missingAsset(),
    defaultGaze: missingAsset(),
  },
  ui: {
    scenePlaceholder: missingAsset(),
    characterSilhouette: missingAsset(),
    imageMissing: missingAsset(),
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
  let cursor: AssetLeaf | AssetTree = ASSETS;

  for (const part of parts) {
    if (!cursor || typeof cursor === "string") {
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
  if (!assetKey) {
    return false;
  }
  const parts = normalizeLegacyAssetKey(assetKey).split(".");
  let cursor: AssetLeaf | AssetTree = ASSETS;

  for (const part of parts) {
    if (!cursor || typeof cursor === "string" || !(part in cursor)) {
      return false;
    }
    cursor = cursor[part];
  }

  return cursor === undefined || typeof cursor === "string";
}

export function resolveBackgroundAsset(assetKey?: string, act?: ActNumber): string | undefined {
  return getBackgroundAssetCandidates(assetKey, act)[0];
}

export function resolveCharacterAsset(characterId: VisualCharacterId, expression = "neutral"): string | undefined {
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

export function getCharacterAssetCandidates(characterId: VisualCharacterId, expression = "neutral"): string[] {
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
      if (typeof value === "string" || value === undefined) {
        keys.push(nextKey);
      } else {
        walk(value, nextKey);
      }
    });
  }

  walk(ASSETS, "");
  return keys;
}
