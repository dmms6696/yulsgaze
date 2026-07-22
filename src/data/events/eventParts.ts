import type { CharacterPosition, SceneCharacter, SceneProp, VisualCharacterId } from "../../types/game";

export function character(
  characterId: VisualCharacterId,
  expression = "neutral",
  position?: CharacterPosition,
  label?: string,
): SceneCharacter {
  return { characterId, expression, position, label };
}

export function prop(assetKey: string, label: string, position?: CharacterPosition): SceneProp {
  return { assetKey, label, alt: label, position };
}
