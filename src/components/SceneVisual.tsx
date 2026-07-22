import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  getBackgroundAssetCandidates,
  getCharacterAssetCandidates,
  resolveAssetPath,
  resolvePropAsset,
} from "../data/assetManifest";
import { isKnownMissingAsset, isPreloadedAsset, markAssetMissing, preloadAssetPaths } from "../engine/assetLoading";
import {
  collectSceneVisualPaths,
  getAutoCharacterPosition,
  getCharacterLabel,
  getChoiceResultVisual,
  isDedicatedIllustrationVisual,
  shouldDimCharacter,
} from "../engine/visualEngine";
import type { CharacterPosition, GameEvent, SceneCharacter, SceneProp, SceneVisual as SceneVisualData, SceneVisualOverride } from "../types/game";

interface SceneVisualProps {
  event: GameEvent;
  visualOverride?: SceneVisualOverride;
}

interface ManagedImageProps {
  src?: string;
  sources?: Array<string | undefined>;
  alt: string;
  className: string;
  style?: CSSProperties;
  onMissing?: () => void;
  children?: ReactNode;
}

const POSITION_X: Record<CharacterPosition, number> = {
  "far-left": 13,
  left: 27,
  "center-left": 38,
  center: 50,
  "center-right": 62,
  right: 73,
  "far-right": 87,
};

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function ManagedImage({ src, sources, alt, className, style, onMissing, children }: ManagedImageProps) {
  const sourceList = (sources ?? [src]).filter((source): source is string => Boolean(source));
  const sourceKey = sourceList.join("|");
  const firstAvailableSource = sourceList.find((source) => !isKnownMissingAsset(source));
  const [activeSource, setActiveSource] = useState(firstAvailableSource);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">(
    firstAvailableSource ? (isPreloadedAsset(firstAvailableSource) ? "loaded" : "loading") : "failed",
  );

  useEffect(() => {
    const nextSource = sourceList.find((source) => !isKnownMissingAsset(source));
    setActiveSource(nextSource);
    setStatus(nextSource ? (isPreloadedAsset(nextSource) ? "loaded" : "loading") : "failed");
  }, [sourceKey]);

  if (!activeSource || status === "failed") {
    return children ? <>{children}</> : null;
  }

  return (
    <>
      {status === "loading" ? children : null}
      <img
        className={`${className} visual-image ${status === "loaded" ? "loaded" : "pending"}`}
        src={activeSource}
        alt={alt}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        style={style}
        onLoad={() => setStatus("loaded")}
        onError={() => {
          markAssetMissing(activeSource);
          const nextSource = sourceList.find((source) => source !== activeSource && !isKnownMissingAsset(source));
          if (nextSource) {
            setActiveSource(nextSource);
            setStatus("loading");
          } else {
            setStatus("failed");
            onMissing?.();
          }
        }}
      />
    </>
  );
}

function getLayerStyle(
  position: CharacterPosition,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  flipX = false,
  opacity = 1,
  layer = 10,
): CSSProperties {
  return {
    "--scene-x": `${POSITION_X[position]}%`,
    "--scene-offset-x": `${offsetX}px`,
    "--scene-offset-y": `${offsetY}px`,
    "--scene-scale": scale,
    "--scene-flip": flipX ? -1 : 1,
    opacity,
    zIndex: layer,
  } as CSSProperties;
}

function ScenePlaceholder({
  title,
  kind = "이미지 슬롯",
}: {
  title: string;
  assetKey?: string;
  kind?: string;
}) {
  return (
    <div className="asset-placeholder">
      <p className="placeholder-kicker">{kind}</p>
      <h2>{title}</h2>
      <span>장면 이미지 준비 중</span>
    </div>
  );
}

function CharacterFallback({ character, event }: { character: SceneCharacter; event: GameEvent }) {
  const label = getCharacterLabel(character);
  const expression = character.expression ?? "neutral";

  return (
    <div className="character-fallback-card" role="img" aria-label={`${label}, ${expression} 표정 대체 카드`}>
      <span>{label}</span>
      <small>{expression}</small>
      <em>{event.title}</em>
    </div>
  );
}

function renderCharacterLayer(
  character: SceneCharacter,
  event: GameEvent,
  visual: SceneVisualData,
  index: number,
  total: number,
) {
  const position = character.position ?? getAutoCharacterPosition(index, total);
  const assetCandidates = getCharacterAssetCandidates(character.characterId, character.expression);
  const label = getCharacterLabel(character);
  const dimmed = shouldDimCharacter(character, event, visual);
  const style = getLayerStyle(
    position,
    character.scale ?? 1,
    character.offsetX ?? 0,
    character.offsetY ?? 0,
    character.flipX ?? false,
    character.opacity ?? 1,
    character.layer ?? 20 + index,
  );

  return (
    <div
      className={`scene-layer scene-character-layer ${dimmed ? "is-dimmed" : "is-focused"}`}
      style={style}
      key={`${character.characterId}-${character.expression ?? "neutral"}-${index}`}
    >
      <ManagedImage
        sources={assetCandidates}
        alt={`${label} ${character.expression ?? "neutral"} 표정`}
        className="scene-character-image"
      >
        <CharacterFallback character={character} event={event} />
      </ManagedImage>
    </div>
  );
}

function renderPropLayer(prop: SceneProp, index: number, total: number) {
  const path = resolvePropAsset(prop.assetKey);
  const position = prop.position ?? getAutoCharacterPosition(index, Math.max(total, 1));
  const style = getLayerStyle(
    position,
    prop.scale ?? 0.55,
    prop.offsetX ?? 0,
    prop.offsetY ?? 0,
    prop.flipX ?? false,
    prop.opacity ?? 1,
    prop.layer ?? 12 + index,
  );

  if (!path || isKnownMissingAsset(path)) {
    return null;
  }

  return (
    <div className="scene-layer scene-prop-layer" style={style} key={`${prop.assetKey}-${index}`}>
      <ManagedImage
        src={path}
        alt={prop.alt ?? prop.label ?? prop.assetKey}
        className="scene-prop-image"
        onMissing={() => markAssetMissing(path)}
      />
    </div>
  );
}

export function SceneVisual({ event, visualOverride }: SceneVisualProps) {
  const visual = useMemo(() => getChoiceResultVisual(event, visualOverride), [event, visualOverride]);
  const backgroundCandidates = getBackgroundAssetCandidates(visual.backgroundAsset, event.act);
  const illustrationPath = visual.illustrationAsset ? resolveAssetPath(visual.illustrationAsset) : undefined;
  const characters = visual.characters ?? [];
  const props = visual.props ?? [];
  const objectPosition = `${clampPercent(visual.focalPoint?.x ?? 50)}% ${clampPercent(visual.focalPoint?.y ?? 46)}%`;
  const dedicatedIllustration = isDedicatedIllustrationVisual(visual);
  const preloadPaths = collectSceneVisualPaths(visual, event.act);
  const preloadKey = preloadPaths.join("|");

  useEffect(() => {
    preloadAssetPaths(preloadPaths, { priority: "high" });
  }, [preloadKey]);

  const shouldRenderBackground = !dedicatedIllustration;
  const shouldRenderLayeredScene = visual.mode === "characters";

  return (
    <div
      className={`scene-visual scene-mode-${visual.mode} overlay-${visual.overlay ?? "none"}`}
      aria-label={visual.alt ?? `${event.title} 장면 이미지 영역`}
    >
      {shouldRenderBackground ? (
        <ManagedImage
          sources={backgroundCandidates}
          alt={`${event.title} 배경`}
          className="scene-background-image"
          style={{ objectPosition }}
        >
          <ScenePlaceholder title={event.title} assetKey={visual.backgroundAsset} kind="배경 이미지 슬롯" />
        </ManagedImage>
      ) : null}

      {shouldRenderLayeredScene ? (
        <>
          <div className="scene-prop-stage">{props.map((prop, index) => renderPropLayer(prop, index, props.length))}</div>
          <div className="scene-character-stage">
            {characters.map((character, index) => renderCharacterLayer(character, event, visual, index, characters.length))}
          </div>
        </>
      ) : null}

      {dedicatedIllustration ? (
        <ManagedImage
          sources={[illustrationPath, ...backgroundCandidates]}
          alt={visual.alt ?? `${event.title} 핵심 일러스트`}
          className="scene-illustration-image"
          style={{ objectPosition }}
        >
          <ScenePlaceholder title={event.title} assetKey={visual.illustrationAsset} kind="전용 일러스트 이미지 슬롯" />
        </ManagedImage>
      ) : null}

      <div className="scene-visual-caption" aria-hidden="true">
        <span>{event.location ?? "장소 미정"}</span>
        <span>{event.time ?? "시간 미정"}</span>
      </div>
    </div>
  );
}
