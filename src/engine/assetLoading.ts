const failedAssetPaths = new Set<string>();
const preloadedAssetPaths = new Set<string>();

export function markAssetMissing(src?: string) {
  if (src) {
    failedAssetPaths.add(src);
  }
}

export function isKnownMissingAsset(src?: string) {
  return src ? failedAssetPaths.has(src) : true;
}

export function isPreloadedAsset(src?: string) {
  return src ? preloadedAssetPaths.has(src) : false;
}

export function preloadImage(src?: string): Promise<boolean> {
  if (!src || failedAssetPaths.has(src)) {
    return Promise.resolve(false);
  }
  if (preloadedAssetPaths.has(src)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    if ("fetchPriority" in image) {
      (image as HTMLImageElement & { fetchPriority: "high" }).fetchPriority = "high";
    }
    image.onload = () => {
      preloadedAssetPaths.add(src);
      resolve(true);
    };
    image.onerror = () => {
      failedAssetPaths.add(src);
      resolve(false);
    };
    image.src = src;
  });
}

export function preloadAssetPaths(paths: Array<string | undefined>) {
  paths.filter(Boolean).forEach((path) => {
    void preloadImage(path);
  });
}
