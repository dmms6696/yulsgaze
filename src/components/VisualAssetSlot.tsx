import { useEffect, useMemo, useState } from "react";
import { resolveAssetPath } from "../data/assetManifest";
import { isKnownMissingAsset, isPreloadedAsset, markAssetMissing, preloadAssetPaths } from "../engine/assetLoading";
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
  const [loaded, setLoaded] = useState(() => isPreloadedAsset(initialPath));
  const objectPosition = useMemo(
    () => `${clampPercent(focalPoint.x)}% ${clampPercent(focalPoint.y)}%`,
    [focalPoint.x, focalPoint.y],
  );

  useEffect(() => {
    preloadAssetPaths([primaryPath, fallbackPath]);
    const nextPath = primaryPath && !isKnownMissingAsset(primaryPath) ? primaryPath : fallbackPath;
    setActivePath(nextPath);
    setLoaded(isPreloadedAsset(nextPath));
  }, [primaryPath, fallbackPath]);

  return (
    <div className={`visual-asset-slot overlay-${overlay} ${className}`} aria-label={alt}>
      <div className="asset-placeholder">
        <p className="placeholder-kicker">{kicker}</p>
        <h2>{title}</h2>
        <span>장면 이미지 준비 중</span>
      </div>
      {activePath ? (
        <img
          className={`visual-image ${loaded ? "loaded" : "pending"}`}
          src={activePath}
          alt={alt}
          decoding="async"
          fetchPriority="high"
          loading="eager"
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
