import { ACT_QUESTIONS, ACT_TITLES } from "./gameMeta";
import type { ActNumber, SceneOverlay, SceneVisual } from "../types/game";

type ScenePreset = Partial<SceneVisual> & Pick<SceneVisual, "backgroundAsset">;

export interface StartScreenVisual {
  heroAsset: string;
  backgroundAsset: string;
  overlay: SceneOverlay;
  focalPoint: {
    x: number;
    y: number;
  };
  alt: string;
}

export interface ActTransitionVisual {
  enabled: boolean;
  firstEventId: string;
  title: string;
  question: string;
  imageAsset: string;
  backgroundAsset: string;
  overlay: SceneOverlay;
  focalPoint: {
    x: number;
    y: number;
  };
}

export const START_SCREEN_VISUAL: StartScreenVisual = {
  heroAsset: "title.main",
  backgroundAsset: "backgrounds.starNight",
  overlay: "dim",
  focalPoint: { x: 50, y: 42 },
  alt: "별빛이 비치는 교실 창가 이미지",
};

export const SCENE_PRESETS: Record<string, ScenePreset> = {
  classroomRumor: {
    mode: "characters",
    backgroundAsset: "backgrounds.cloudyClassroom",
    overlay: "none",
    focalPoint: { x: 50, y: 48 },
  },
  cloudyClassroom: {
    mode: "characters",
    backgroundAsset: "backgrounds.cloudyClassroom",
    overlay: "mist",
    focalPoint: { x: 48, y: 46 },
  },
  rainyRoad: {
    mode: "characters",
    backgroundAsset: "backgrounds.catAlleyNight",
    props: [{ assetKey: "props.umbrella", position: "right", scale: 0.7, offsetY: 14, layer: 8 }],
    overlay: "rain",
    focalPoint: { x: 52, y: 42 },
  },
  rooftopSky: {
    mode: "characters",
    backgroundAsset: "backgrounds.rooftopSky",
    overlay: "sunset",
    focalPoint: { x: 50, y: 34 },
  },
  schoolHallway: {
    mode: "characters",
    backgroundAsset: "backgrounds.schoolHallwayConflict",
    overlay: "none",
    focalPoint: { x: 50, y: 48 },
  },
  cornerStore: {
    mode: "characters",
    backgroundAsset: "backgrounds.cornerStoreNight",
    props: [{ assetKey: "props.tunaCan", position: "center-right", scale: 0.42, offsetY: 18, layer: 9 }],
    overlay: "night",
    focalPoint: { x: 46, y: 48 },
  },
  nurseRoom: {
    mode: "characters",
    backgroundAsset: "backgrounds.nurseRoom",
    props: [{ assetKey: "props.cast", position: "right", scale: 0.48, offsetY: 16, layer: 9 }],
    overlay: "mist",
    focalPoint: { x: 50, y: 48 },
  },
  catFarewell: {
    mode: "illustration",
    backgroundAsset: "backgrounds.catFarewell",
    illustrationAsset: "illustrations.catFarewell",
    props: [{ assetKey: "props.cat", position: "center", scale: 0.44, offsetY: 18, layer: 7 }],
    overlay: "sunset",
    focalPoint: { x: 50, y: 42 },
  },
  columbarium: {
    mode: "illustration",
    backgroundAsset: "backgrounds.columbarium",
    illustrationAsset: "illustrations.columbariumTalk",
    overlay: "dim",
    focalPoint: { x: 48, y: 48 },
  },
  missingPosterStreet: {
    mode: "characters",
    backgroundAsset: "backgrounds.missingPosterStreet",
    props: [{ assetKey: "props.missingPoster", position: "right", scale: 0.72, offsetY: 6, layer: 6 }],
    overlay: "mist",
    focalPoint: { x: 54, y: 45 },
  },
  starNight: {
    mode: "characters",
    backgroundAsset: "backgrounds.starNightSchoolyard",
    props: [{ assetKey: "props.polaris", position: "center-right", scale: 0.54, offsetY: 110, layer: 5 }],
    overlay: "night",
    focalPoint: { x: 50, y: 30 },
  },
  polarisEnding: {
    mode: "illustration",
    backgroundAsset: "backgrounds.polarisEnding",
    illustrationAsset: "illustrations.polarisPromise",
    overlay: "night",
    focalPoint: { x: 50, y: 34 },
  },
};

export const BACKGROUND_TO_SCENE_PRESET: Record<string, string> = {
  "backgrounds.classroomFirstDay": "classroomRumor",
  "backgrounds.cloudyClassroom": "cloudyClassroom",
  "backgrounds.rainyRoad": "rainyRoad",
  "backgrounds.schoolyardTree": "classroomRumor",
  "backgrounds.schoolyardFootball": "classroomRumor",
  "backgrounds.catAlleyNight": "rainyRoad",
  "backgrounds.rooftopStairs": "schoolHallway",
  "backgrounds.rooftopSky": "rooftopSky",
  "backgrounds.rooftopSunset": "rooftopSky",
  "backgrounds.schoolHallway": "schoolHallway",
  "backgrounds.schoolHallwayConflict": "schoolHallway",
  "backgrounds.cornerStore": "cornerStore",
  "backgrounds.cornerStoreNight": "cornerStore",
  "backgrounds.nurseRoom": "nurseRoom",
  "backgrounds.hospitalExit": "nurseRoom",
  "backgrounds.afterSchoolRoad": "rooftopSky",
  "backgrounds.classroomFight": "cloudyClassroom",
  "backgrounds.crowdedClassroom": "cloudyClassroom",
  "backgrounds.classroomAfterExam": "cloudyClassroom",
  "backgrounds.quietRooftopNight": "rooftopSky",
  "backgrounds.darkRoomWindow": "classroomRumor",
  "backgrounds.counselingRoom": "cloudyClassroom",
  "backgrounds.trashHouse": "classroomRumor",
  "backgrounds.catFarewell": "catFarewell",
  "backgrounds.columbarium": "columbarium",
  "backgrounds.missingPosterStreet": "missingPosterStreet",
  "backgrounds.starNight": "starNight",
  "backgrounds.starNightSchoolyard": "starNight",
  "backgrounds.polarisEnding": "polarisEnding",
};

export const ACT_TRANSITION_VISUALS: Record<ActNumber, ActTransitionVisual> = {
  1: {
    enabled: true,
    firstEventId: "EVENT_01",
    title: ACT_TITLES[1],
    question: ACT_QUESTIONS[1],
    imageAsset: "actTransitions.act1",
    backgroundAsset: "backgrounds.act1Default",
    overlay: "dim",
    focalPoint: { x: 50, y: 42 },
  },
  2: {
    enabled: true,
    firstEventId: "EVENT_08",
    title: ACT_TITLES[2],
    question: ACT_QUESTIONS[2],
    imageAsset: "actTransitions.act2",
    backgroundAsset: "backgrounds.act2Default",
    overlay: "rain",
    focalPoint: { x: 48, y: 44 },
  },
  3: {
    enabled: true,
    firstEventId: "EVENT_18",
    title: ACT_TITLES[3],
    question: ACT_QUESTIONS[3],
    imageAsset: "actTransitions.act3",
    backgroundAsset: "backgrounds.act3Default",
    overlay: "mist",
    focalPoint: { x: 52, y: 44 },
  },
  4: {
    enabled: true,
    firstEventId: "EVENT_24",
    title: ACT_TITLES[4],
    question: ACT_QUESTIONS[4],
    imageAsset: "actTransitions.act4",
    backgroundAsset: "backgrounds.act4Default",
    overlay: "night",
    focalPoint: { x: 50, y: 34 },
  },
};
