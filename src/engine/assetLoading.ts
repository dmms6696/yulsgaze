const failedAssetPaths = new Set<string>();
const preloadedAssetPaths = new Set<string>();
const preloadPromises = new Map<string, Promise<boolean>>();

export type AssetPreloadPriority = "high" | "low" | "auto";

interface PreloadOptions {
  priority?: AssetPreloadPriority;
}

interface WarmupOptions extends PreloadOptions {
  delayMs?: number;
  concurrency?: number;
}

function uniquePaths(paths: Array<string | undefined>) {
  return Array.from(new Set(paths.filter((path): path is string => Boolean(path))));
}

function setFetchPriority(image: HTMLImageElement, priority: AssetPreloadPriority) {
  if ("fetchPriority" in image) {
    (image as HTMLImageElement & { fetchPriority: AssetPreloadPriority }).fetchPriority = priority;
  }
}

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

export function preloadImage(src?: string, priority: AssetPreloadPriority = "high"): Promise<boolean> {
  if (!src || failedAssetPaths.has(src)) {
    return Promise.resolve(false);
  }
  if (preloadedAssetPaths.has(src)) {
    return Promise.resolve(true);
  }

  const existingPromise = preloadPromises.get(src);
  if (existingPromise) {
    return existingPromise;
  }

  const preloadPromise = new Promise<boolean>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    setFetchPriority(image, priority);

    const finishLoaded = () => {
      preloadedAssetPaths.add(src);
      preloadPromises.delete(src);
      resolve(true);
    };

    image.onload = () => {
      if (typeof image.decode === "function") {
        void image.decode().catch(() => undefined).then(finishLoaded);
        return;
      }
      finishLoaded();
    };
    image.onerror = () => {
      failedAssetPaths.add(src);
      preloadPromises.delete(src);
      resolve(false);
    };
    image.src = src;
  });

  preloadPromises.set(src, preloadPromise);
  return preloadPromise;
}

export function preloadAssetPaths(paths: Array<string | undefined>, options: PreloadOptions = {}) {
  uniquePaths(paths).forEach((path) => {
    void preloadImage(path, options.priority ?? "high");
  });
}

export function warmupAssetPaths(paths: Array<string | undefined>, options: WarmupOptions = {}) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const queue = uniquePaths(paths).filter((path) => !preloadedAssetPaths.has(path) && !failedAssetPaths.has(path));
  const priority = options.priority ?? "low";
  const concurrency = Math.max(1, options.concurrency ?? 2);
  let cursor = 0;
  let activeCount = 0;
  let cancelled = false;

  const pump = () => {
    if (cancelled) {
      return;
    }

    while (activeCount < concurrency && cursor < queue.length) {
      const path = queue[cursor];
      cursor += 1;
      activeCount += 1;
      void preloadImage(path, priority).finally(() => {
        activeCount -= 1;
        pump();
      });
    }
  };

  const timerId = window.setTimeout(pump, options.delayMs ?? 600);

  return () => {
    cancelled = true;
    window.clearTimeout(timerId);
  };
}
