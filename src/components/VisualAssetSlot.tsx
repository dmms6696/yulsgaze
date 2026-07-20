import { useEffect, useMemo, useState } from "react";
import { resolveAssetPath } from "../data/assetManifest";
import { isKnownMissingAsset, markAssetMissing } from "../engine/assetLoading";
import type { SceneOverlay } from "../types/game";

interface VisualAssetSlotProps {
  assetKey?: string;
  fallbackAssetKey?: string;
  title: string;
  kicker: string;
  alt: string;
  className?: string;
  overlay?: SceneOverlay;
  focalPoint?: {
    x: number;
    y: number;
  };
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function VisualAssetSlot({
  assetKey,
  fallbackAssetKey,
  title,
  kicker,
  alt,
  className = "",
  overlay = "none",
  focalPoint = { x: 50, y: 46 },
}: VisualAssetSlotProps) {
  const primaryPath = resolveAssetPath(assetKey);
  const fallbackPath = resolveAssetPath(fallbackAssetKey);
  const initialPath = primaryPath && !isKnownMissingAsset(primaryPath) ? primaryPath : fallbackPath;
  const [activePath, setActivePath] = useState(initialPath);
  const [loaded, setLoaded] = useState(false);
  const objectPosition = useMemo(
    () => `${clampPercent(focalPoint.x)}% ${clampPercent(focalPoint.y)}%`,
    [focalPoint.x, focalPoint.y],
  );

  useEffect(() => {
    setActivePath(primaryPath && !isKnownMissingAsset(primaryPath) ? primaryPath : fallbackPath);
    setLoaded(false);
  }, [primaryPath, fallbackPath]);

  return (
    <div className={`visual-asset-slot overlay-${overlay} ${className}`} aria-label={alt}>
      <div className="asset-placeholder">
        <p className="placeholder-kicker">{kicker}</p>
        <h2>{title}</h2>
        {assetKey ? <p>{assetKey}</p> : null}
        <span>이미지를 넣으면 이 영역에 자동 표시됩니다</span>
      </div>
      {activePath ? (
        <img
          className={`visual-image ${loaded ? "loaded" : "pending"}`}
          src={activePath}
          alt={alt}
          style={{ objectPosition }}
          onLoad={() => setLoaded(true)}
          onError={() => {
            markAssetMissing(activePath);
            if (activePath === primaryPath && fallbackPath && fallbackPath !== primaryPath && !isKnownMissingAsset(fallbackPath)) {
              setActivePath(fallbackPath);
              setLoaded(false);
            } else {
              setActivePath(undefined);
            }
          }}
        />
      ) : null}
    </div>
  );
}
