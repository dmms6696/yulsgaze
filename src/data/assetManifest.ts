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
    act1: assetPath("actTransitions/actTransitions.act1.png"),
    act2: assetPath("actTransitions/actTransitions.act2.png"),
    act3: assetPath("actTransitions/actTransitions.act3.png"),
    act4: assetPath("actTransitions/actTransitions.act4.png"),
  },
  backgrounds: {
    commonDefault: assetPath("backgrounds/backgrounds.cloudyClassroom.png"),
    sceneDefault: assetPath("backgrounds/backgrounds.classroomMorningTalk.png"),
    act1Default: assetPath("backgrounds/backgrounds.schoolyardTree.png"),
    act2Default: assetPath("backgrounds/backgrounds.emptyClassroomEvening.png"),
    act3Default: assetPath("backgrounds/backgrounds.rainyCrosswalkMemory.png"),
    act4Default: assetPath("backgrounds/backgrounds.starNightSchoolyard.png"),
    schoolyardTree: assetPath("backgrounds/backgrounds.schoolyardTree.png"),
    rooftopSky: assetPath("backgrounds/backgrounds.rooftopSky.png"),
    rooftopSunset: assetPath("backgrounds/backgrounds.rooftopSunset.png"),
    schoolyardFootball: assetPath("backgrounds/backgrounds.schoolyardFootball.png"),
    catAlleyNight: assetPath("backgrounds/backgrounds.catAlleyNight.png"),
    rooftopStairs: assetPath("backgrounds/backgrounds.rooftopStairs.png"),
    cornerStoreNight: assetPath("backgrounds/backgrounds.cornerStoreNight.png"),
    cloudyClassroom: assetPath("backgrounds/backgrounds.cloudyClassroom.png"),
    classroomFight: assetPath("backgrounds/backgrounds.classroomFight.png"),
    schoolHallwayConflict: assetPath("backgrounds/backgrounds.schoolHallwayConflict.png"),
    nurseRoom: assetPath("backgrounds/backgrounds.nurseRoom.png"),
    hospitalExit: assetPath("backgrounds/backgrounds.hospitalExit.png"),
    afterSchoolRoad: assetPath("backgrounds/backgrounds.afterSchoolRoad.png"),
    crowdedClassroom: assetPath("backgrounds/backgrounds.crowdedClassroom.png"),
    classroomAfterExam: assetPath("backgrounds/backgrounds.classroomAfterExam.png"),
    quietRooftopNight: assetPath("backgrounds/backgrounds.quietRooftopNight.png"),
    darkRoomWindow: assetPath("backgrounds/backgrounds.darkRoomWindow.png"),
    counselingRoom: assetPath("backgrounds/backgrounds.counselingRoom.png"),
    trashHouse: assetPath("backgrounds/backgrounds.trashHouse.png"),
    missingPosterStreet: assetPath("backgrounds/backgrounds.missingPosterStreet.png"),
    starNightSchoolyard: assetPath("backgrounds/backgrounds.starNightSchoolyard.png"),
    morningSchoolRoad: assetPath("backgrounds/backgrounds.morningSchoolRoad.png"),
    classroomMorningTalk: assetPath("backgrounds/backgrounds.classroomMorningTalk.png"),
    hotSummerHallway: assetPath("backgrounds/backgrounds.hotSummerHallway.png"),
    emptyClassroomEvening: assetPath("backgrounds/backgrounds.emptyClassroomEvening.png"),
    schoolyardSunsetEmpty: assetPath("backgrounds/backgrounds.schoolyardSunsetEmpty.png"),
    rainyCrosswalkMemory: assetPath("backgrounds/backgrounds.rainyCrosswalkMemory.png"),
    emptyHospitalRoom: assetPath("backgrounds/backgrounds.emptyHospitalRoom.png"),
    hospitalHallway: assetPath("backgrounds/backgrounds.hospitalHallway.png"),
    classroomFirstDay: assetPath("backgrounds/backgrounds.classroomMorningTalk.png"),
    rainyRoad: assetPath("backgrounds/backgrounds.catAlleyNight.png"),
    schoolHallway: assetPath("backgrounds/backgrounds.schoolHallwayConflict.png"),
    playground: assetPath("backgrounds/backgrounds.schoolyardFootball.png"),
    nightAlley: assetPath("backgrounds/backgrounds.catAlleyNight.png"),
    cornerStore: assetPath("backgrounds/backgrounds.cornerStoreNight.png"),
    hospital: assetPath("backgrounds/backgrounds.hospitalHallway.png"),
    hospitalStreet: assetPath("backgrounds/backgrounds.hospitalExit.png"),
    wayHome: assetPath("backgrounds/backgrounds.afterSchoolRoad.png"),
    quietCatPlace: assetPath("backgrounds/backgrounds.schoolyardTree.png"),
    catFarewell: assetPath("backgrounds/backgrounds.schoolyardTree.png"),
    dohyeHouseStreet: assetPath("backgrounds/backgrounds.missingPosterStreet.png"),
    neglectedHouse: assetPath("backgrounds/backgrounds.trashHouse.png"),
    starNight: assetPath("backgrounds/star-night.png"),
    polarisEnding: assetPath("backgrounds/backgrounds.starNightSchoolyard.png"),
    columbarium: assetPath("backgrounds/backgrounds.columbarium.png"),
  },
  illustrations: {
    dohyeDeadCat: assetPath("illustrations/illustrations.dohyeDeadCat.png"),
    catFarewell: assetPath("illustrations/illustrations.catFarewell.png"),
    yulChainRope: assetPath("illustrations/illustrations.yulChainRope.png"),
    robberyMemory: assetPath("illustrations/illustrations.robberyMemory.png"),
    dohyeHospital: assetPath("illustrations/illustrations.dohyeHospital.png"),
    trashHouseVisit: assetPath("illustrations/illustrations.trashHouseVisit.png"),
    missingPosterWalk: assetPath("illustrations/illustrations.missingPosterWalk.png"),
    yulPolarisGrowth: assetPath("illustrations/illustrations.yulPolarisGrowth.png"),
    yulFatherAccident: assetPath("illustrations/illustrations.yulFatherAccident.png"),
    yulFatherAccidentComfort: assetPath("illustrations/illustrations.yulFatherAccidentComfort.png"),
    yulColumbariumVisit: assetPath("illustrations/illustrations.yulColumbariumVisit.png"),
    emptyDohyeHospital: assetPath("illustrations/illustrations.emptyDohyeHospital.png"),
    yulHoldingPaperStar: assetPath("illustrations/illustrations.yulHoldingPaperStar.png"),
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
      neutral: assetPath("characters/characters.yul.neutral.png"),
      anxious: assetPath("characters/characters.yul.anxious.png"),
      angry: assetPath("characters/characters.yul.angry.png"),
      softened: assetPath("characters/characters.yul.softened.png"),
      growth: assetPath("characters/characters.yul.growth.png"),
      silhouette: assetPath("characters/characters.yul.silhouette.png"),
    },
    dohye: {
      neutral: assetPath("characters/characters.dohye.neutral.png"),
      anxious: assetPath("characters/characters.dohye.anxious.png"),
      angry: assetPath("characters/characters.dohye.angry.png"),
      softened: assetPath("characters/characters.dohye.softened.png"),
      growth: assetPath("characters/characters.dohye.growth.png"),
      silhouette: assetPath("characters/characters.dohye.silhouette.png"),
    },
    jinuk: {
      neutral: assetPath("characters/characters.jinuk.neutral.png"),
      anxious: assetPath("characters/characters.jinuk.anxious.png"),
      angry: assetPath("characters/characters.jinuk.angry.png"),
      softened: assetPath("characters/characters.jinuk.softened.png"),
      growth: assetPath("characters/characters.jinuk.growth.png"),
      silhouette: assetPath("characters/characters.jinuk.silhouette.png"),
    },
    minwoo: {
      neutral: assetPath("characters/characters.minwoo.neutral.png"),
      anxious: assetPath("characters/characters.minwoo.anxious.png"),
      angry: assetPath("characters/characters.minwoo.angry.png"),
      softened: assetPath("characters/characters.minwoo.softened.png"),
      growth: assetPath("characters/characters.minwoo.growth.png"),
      silhouette: assetPath("characters/characters.minwoo.silhouette.png"),
    },
    donghwi: {
      neutral: assetPath("characters/characters.donghwi.neutral.png"),
      anxious: assetPath("characters/characters.donghwi.anxious.png"),
      angry: assetPath("characters/characters.donghwi.angry.png"),
      softened: assetPath("characters/characters.donghwi.softened.png"),
      growth: assetPath("characters/characters.donghwi.growth.png"),
      silhouette: assetPath("characters/characters.donghwi.silhouette.png"),
    },
    jimin: {
      neutral: assetPath("characters/characters.jimin.neutral.png"),
      anxious: assetPath("characters/characters.jimin.anxious.png"),
      angry: assetPath("characters/characters.jimin.angry.png"),
      softened: assetPath("characters/characters.jimin.softened.png"),
      growth: assetPath("characters/characters.jimin.growth.png"),
      silhouette: assetPath("characters/characters.jimin.silhouette.png"),
    },
    classmates: {
      neutral: assetPath("characters/characters.classmates.neutral.png"),
      anxious: assetPath("characters/characters.classmates.anxious.png"),
      angry: assetPath("characters/characters.classmates.angry.png"),
      softened: assetPath("characters/characters.classmates.softened.png"),
      growth: assetPath("characters/characters.classmates.growth.png"),
      silhouette: assetPath("characters/characters.classmates.silhouette.png"),
    },
    yulMother: {
      neutral: assetPath("characters/characters.yulMother.neutral.png"),
      anxious: assetPath("characters/characters.yulMother.anxious.png"),
      angry: assetPath("characters/characters.yulMother.angry.png"),
      softened: assetPath("characters/characters.yulMother.softened.png"),
      growth: assetPath("characters/characters.yulMother.growth.png"),
      silhouette: assetPath("characters/characters.yulMother.silhouette.png"),
    },
    jinukFather: {
      neutral: assetPath("characters/characters.jinukFather.neutral.png"),
      anxious: assetPath("characters/characters.jinukFather.anxious.png"),
      angry: assetPath("characters/characters.jinukFather.angry.png"),
      softened: assetPath("characters/characters.jinukFather.softened.png"),
      growth: assetPath("characters/characters.jinukFather.growth.png"),
      silhouette: assetPath("characters/characters.jinukFather.silhouette.png"),
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
    polarisTogether: assetPath("endings/endings.polarisTogether.png"),
    slowResee: assetPath("endings/endings.slowResee.png"),
    safeObserver: assetPath("endings/endings.safeObserver.png"),
    hastyGaze: assetPath("endings/endings.hastyGaze.png"),
    lateHeart: assetPath("endings/endings.lateHeart.png"),
    defaultGaze: assetPath("endings/endings.defaultGaze.png"),
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
