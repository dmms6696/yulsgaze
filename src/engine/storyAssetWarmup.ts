import { ENDINGS } from "../data/endings";
import { GAME_EVENTS } from "../data/events";
import { resolveAssetPath } from "../data/assetManifest";
import type { ActNumber } from "../types/game";
import { collectActTransitionAssetPaths, collectEventAssetPaths } from "./visualEngine";

const ACTS: ActNumber[] = [1, 2, 3, 4];

function addPaths(target: Set<string>, paths: Array<string | undefined>) {
  paths.forEach((path) => {
    if (path) {
      target.add(path);
    }
  });
}

export function collectActTransitionWarmupPaths() {
  const paths = new Set<string>();
  ACTS.forEach((act) => addPaths(paths, collectActTransitionAssetPaths(act)));
  return Array.from(paths);
}

export function collectStoryWarmupAssetPaths() {
  const paths = new Set<string>();

  addPaths(paths, collectActTransitionWarmupPaths());
  GAME_EVENTS.forEach((event) => {
    addPaths(paths, collectEventAssetPaths(event));
    event.choices.forEach((choice) => {
      addPaths(paths, collectEventAssetPaths(event, choice.resultVisual));
    });
  });
  ENDINGS.forEach((ending) => addPaths(paths, [resolveAssetPath(ending.imageAsset)]));

  return Array.from(paths);
}
