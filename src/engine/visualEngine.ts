import { ACT_DEFAULT_BACKGROUND_ASSETS } from "../data/assetManifest";
import { BACKGROUND_TO_SCENE_PRESET, ACT_TRANSITION_VISUALS, SCENE_PRESETS } from "../data/scenePresets";
import { CHARACTERS, getCharacterName } from "../data/characters";
import type {
  ActNumber,
  CharacterId,
  CharacterPosition,
  GameEvent,
  SceneCharacter,
  SceneVisual,
} from "../types/game";

const AUTO_POSITIONS: Record<number, CharacterPosition[]> = {
  1: ["center"],
  2: ["left", "right"],
  3: ["left", "center", "right"],
  4: ["far-left", "center-left", "center-right", "far-right"],
};

const SPEAKER_ALIASES: Record<string, CharacterId> = {
  안율: "yul",
  율: "yul",
  이도해: "dohye",
  도해: "dohye",
  김진욱: "jinuk",
  진욱: "jinuk",
  김민우: "minwoo",
  민우: "minwoo",
  김동휘: "donghwi",
  동휘: "donghwi",
  김지민: "jimin",
  지민: "jimin",
  "반 친구": "classmates",
  "반 친구들": "classmates",
  친구들: "classmates",
};

export function getAutoCharacterPosition(index: number, count: number): CharacterPosition {
  const positionSet = AUTO_POSITIONS[Math.min(Math.max(count, 1), 4)] ?? AUTO_POSITIONS[4];
  return positionSet[Math.min(index, positionSet.length - 1)] ?? "center";
}

export function getActFallbackBackgroundKey(act: ActNumber): string {
  return ACT_DEFAULT_BACKGROUND_ASSETS[act] ?? "backgrounds.commonDefault";
}

export function getSpeakerCharacterId(speaker?: string): CharacterId | undefined {
  if (!speaker) {
    return undefined;
  }

  const exactMatch = SPEAKER_ALIASES[speaker];
  if (exactMatch) {
    return exactMatch;
  }

  const aliasMatch = Object.entries(SPEAKER_ALIASES).find(([name]) => speaker.includes(name));
  if (aliasMatch) {
    return aliasMatch[1];
  }

  return CHARACTERS.find((character) => speaker.includes(character.name))?.id;
}

export function getCharacterExpressionFromAsset(assetKey: string | undefined, characterId: CharacterId) {
  if (!assetKey) {
    return "neutral";
  }

  const parts = assetKey.split(".");
  if (parts[0] !== "characters" || parts[1] !== characterId) {
    return "neutral";
  }

  return parts[2] ?? "neutral";
}

function legacyCharactersToSceneCharacters(event: GameEvent): SceneCharacter[] {
  return (
    event.characterAssets?.map((asset) => ({
      characterId: asset.characterId,
      expression: asset.expression ?? getCharacterExpressionFromAsset(asset.assetKey, asset.characterId),
      position: asset.position,
      scale: asset.scale,
      offsetX: asset.offsetX,
      offsetY: asset.offsetY,
      flipX: asset.flipX,
      focus: asset.focus,
      opacity: asset.opacity,
      layer: asset.layer,
      label: asset.label,
    })) ?? []
  );
}

function getPresetForEvent(event: GameEvent): Partial<SceneVisual> {
  const presetKey = event.visual?.scenePreset ?? event.scenePreset ?? BACKGROUND_TO_SCENE_PRESET[event.backgroundAsset ?? ""];
  return presetKey ? (SCENE_PRESETS[presetKey] ?? {}) : {};
}

export function getEventVisual(event: GameEvent): SceneVisual {
  const preset = getPresetForEvent(event);
  const explicit = event.visual;
  const legacyCharacters = legacyCharactersToSceneCharacters(event);
  const characters = explicit?.characters ?? preset.characters ?? legacyCharacters;
  const backgroundAsset =
    explicit?.backgroundAsset ?? preset.backgroundAsset ?? event.backgroundAsset ?? getActFallbackBackgroundKey(event.act);
  const illustrationAsset = explicit?.illustrationAsset ?? preset.illustrationAsset;
  const mode = explicit?.mode ?? preset.mode ?? (illustrationAsset ? "illustration" : characters.length ? "characters" : "background");

  return {
    mode,
    backgroundAsset,
    illustrationAsset,
    characters,
    props: explicit?.props ?? preset.props,
    overlay: explicit?.overlay ?? preset.overlay ?? "none",
    transition: explicit?.transition ?? preset.transition ?? "fade",
    focalPoint: explicit?.focalPoint ?? preset.focalPoint ?? { x: 50, y: 46 },
    alt: explicit?.alt ?? preset.alt ?? `${event.title} 장면`,
    scenePreset: explicit?.scenePreset ?? event.scenePreset,
    speakerFocus: explicit?.speakerFocus ?? preset.speakerFocus ?? true,
  };
}

export function getFocusedCharacterId(event: GameEvent, visual: SceneVisual): CharacterId | undefined {
  if (visual.speakerFocus === false) {
    return undefined;
  }
  return getSpeakerCharacterId(event.speaker);
}

export function shouldDimCharacter(character: SceneCharacter, event: GameEvent, visual: SceneVisual) {
  const explicitFocus = visual.characters?.some((sceneCharacter) => sceneCharacter.focus !== undefined);
  if (explicitFocus) {
    return character.focus !== true;
  }

  const focusedSpeaker = getFocusedCharacterId(event, visual);
  return Boolean(focusedSpeaker && character.characterId !== focusedSpeaker);
}

export function getCharacterLabel(character: SceneCharacter) {
  return character.label ?? getCharacterName(character.characterId);
}

export function getActTransitionVisual(act: ActNumber) {
  return ACT_TRANSITION_VISUALS[act];
}

export function shouldShowActTransition(event: GameEvent, dismissedActs: Partial<Record<ActNumber, boolean>>) {
  const transition = getActTransitionVisual(event.act);
  return transition.enabled && transition.firstEventId === event.id && !dismissedActs[event.act];
}

export function collectEventAssetKeys(event: GameEvent): string[] {
  const visual = getEventVisual(event);
  const keys = new Set<string>();

  if (visual.backgroundAsset) {
    keys.add(visual.backgroundAsset);
  }
  if (visual.illustrationAsset) {
    keys.add(visual.illustrationAsset);
  }

  visual.characters?.forEach((character) => {
    keys.add(`characters.${character.characterId}.${character.expression ?? "neutral"}`);
  });
  event.characterAssets?.forEach((character) => keys.add(character.assetKey));
  visual.props?.forEach((prop) => keys.add(prop.assetKey));

  return Array.from(keys);
}
