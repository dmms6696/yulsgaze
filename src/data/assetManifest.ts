export const ASSETS = {
  backgrounds: {
    classroomFirstDay: "/assets/backgrounds/classroom-first-day.webp",
    cloudyClassroom: "/assets/backgrounds/cloudy-classroom.webp",
    rainyRoad: "/assets/backgrounds/rainy-road.webp",
    schoolHallway: "/assets/backgrounds/school-hallway.webp",
    rooftopSky: "/assets/backgrounds/rooftop-sky.webp",
    playground: "/assets/backgrounds/playground.webp",
    nightAlley: "/assets/backgrounds/night-alley.webp",
    cornerStore: "/assets/backgrounds/corner-store.webp",
    nurseRoom: "/assets/backgrounds/nurse-room.webp",
    hospital: "/assets/backgrounds/hospital.webp",
    hospitalStreet: "/assets/backgrounds/hospital-street.webp",
    wayHome: "/assets/backgrounds/way-home.webp",
    quietCatPlace: "/assets/backgrounds/quiet-cat-place.webp",
    catFarewell: "/assets/backgrounds/cat-farewell.webp",
    columbarium: "/assets/backgrounds/columbarium.webp",
    dohyeHouseStreet: "/assets/backgrounds/dohye-house-street.webp",
    neglectedHouse: "/assets/backgrounds/neglected-house.webp",
    missingPosterStreet: "/assets/backgrounds/missing-poster-street.webp",
    starNight: "/assets/backgrounds/star-night.webp",
    polarisEnding: "/assets/backgrounds/polaris-ending.webp",
  },
  characters: {
    yul: {
      neutral: "/assets/characters/yul-neutral.webp",
      anxious: "/assets/characters/yul-anxious.webp",
      angry: "/assets/characters/yul-angry.webp",
      softened: "/assets/characters/yul-softened.webp",
      growth: "/assets/characters/yul-growth.webp",
    },
    dohye: {
      neutral: "/assets/characters/dohye-neutral.webp",
      smile: "/assets/characters/dohye-smile.webp",
      rooftop: "/assets/characters/dohye-rooftop.webp",
      sad: "/assets/characters/dohye-sad.webp",
    },
    jinuk: {
      friendly: "/assets/characters/jinuk-friendly.webp",
      angry: "/assets/characters/jinuk-angry.webp",
      injured: "/assets/characters/jinuk-injured.webp",
      honest: "/assets/characters/jinuk-honest.webp",
    },
    minwoo: {
      proud: "/assets/characters/minwoo-proud.webp",
      brittle: "/assets/characters/minwoo-brittle.webp",
    },
    donghwi: {
      casual: "/assets/characters/donghwi-casual.webp",
      loud: "/assets/characters/donghwi-loud.webp",
    },
    jimin: {
      guarded: "/assets/characters/jimin-guarded.webp",
      honest: "/assets/characters/jimin-honest.webp",
      reconciled: "/assets/characters/jimin-reconciled.webp",
    },
    classmates: {
      group: "/assets/characters/classmates-group.webp",
      whisper: "/assets/characters/classmates-whisper.webp",
    },
  },
  objects: {
    soccerBall: "/assets/objects/soccer-ball.webp",
    tunaCan: "/assets/objects/tuna-can.webp",
    cat: "/assets/objects/cat.webp",
    note: "/assets/objects/note.webp",
    luxuryBag: "/assets/objects/luxury-bag.webp",
    cast: "/assets/objects/cast.webp",
    storyNotebook: "/assets/objects/story-notebook.webp",
    missingPoster: "/assets/objects/missing-poster.webp",
    polaris: "/assets/objects/polaris.webp",
    umbrella: "/assets/objects/umbrella.webp",
  },
};

type ManifestGroup = keyof typeof ASSETS;

export function resolveAssetPath(assetKey: string): string | undefined {
  const parts = assetKey.split(".");
  let cursor: unknown = ASSETS;

  for (const part of parts) {
    if (cursor && typeof cursor === "object" && part in cursor) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof cursor === "string" ? cursor : undefined;
}

export function getAssetGroup(assetKey: string): ManifestGroup | "unknown" {
  const group = assetKey.split(".")[0];
  return group in ASSETS ? (group as ManifestGroup) : "unknown";
}
