import { existsSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, extname, join, relative } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const root = dirname(dirname(fileURLToPath(import.meta.url)));
export const TARGET_WIDTH = 2040;
export const TARGET_HEIGHT = 600;
export const TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT;
export const TARGET_GROUPS = new Set(["backgrounds", "illustrations", "endings"]);

const localRequire = createRequire(import.meta.url);

export const FOCAL_POINTS = {
  "illustrations.yulFatherAccident": {
    position: "center",
    note: "어린 안율, 우산, 횡단보도, 신호등이 모두 남도록 중앙 기준",
  },
  "illustrations.yulFatherAccidentComfort": {
    position: "center",
    note: "현재 안율과 어린 안율, 떨어진 우산이 함께 보이도록 중앙 기준",
  },
  "illustrations.yulColumbariumVisit": {
    position: "center",
    note: "안율, 꽃다발, 봉안함 벽면이 같이 보이도록 중앙 기준",
  },
  "illustrations.emptyDohyeHospital": {
    position: "center",
    note: "빈 침대, 빈 의자, 창문, 종이별이 함께 보이도록 중앙 기준",
  },
  "illustrations.yulHoldingPaperStar": {
    position: "center",
    note: "안율의 얼굴과 손의 종이별, 빈 병실 분위기를 함께 보이도록 중앙 기준",
  },
};

export function loadSharp() {
  try {
    return localRequire("sharp");
  } catch {
    const bundledSharpPackage = join(
      homedir(),
      ".cache",
      "codex-runtimes",
      "codex-primary-runtime",
      "dependencies",
      "node",
      "node_modules",
      "sharp",
      "package.json",
    );
    if (!existsSync(bundledSharpPackage)) {
      throw new Error("sharp 패키지를 찾을 수 없습니다. 이미지 정규화/검사에는 sharp가 필요합니다.");
    }
    return createRequire(bundledSharpPackage)("sharp");
  }
}

export function findPythonExecutable() {
  const candidates = [
    process.env.PYTHON,
    join(homedir(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "python", "python.exe"),
    "python",
    "py",
    "python3",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ["-c", "import PIL"], { stdio: "ignore" });
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error("Pillow를 사용할 수 있는 Python 실행 파일을 찾을 수 없습니다.");
}

export function runPillowWorker(command, args = []) {
  const python = findPythonExecutable();
  const workerPath = join(root, "scripts", "pillow-image-worker.py");
  const output = execFileSync(python, [workerPath, command, ...args], { encoding: "utf8" });
  return JSON.parse(output);
}

function walkFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    return stats.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function keyFromFile(group, filePath) {
  const basename = filePath.split(/[\\/]/).pop() ?? "";
  const withoutExtension = basename.slice(0, -extname(basename).length);
  return withoutExtension.startsWith(`${group}.`) ? withoutExtension : `${group}.${withoutExtension}`;
}

function parseManifestAssetPaths() {
  const manifestPath = join(root, "src", "data", "assetManifest.ts");
  const source = existsSync(manifestPath) ? localRequire("node:fs").readFileSync(manifestPath, "utf8") : "";
  const paths = [];
  const stack = [];

  source.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    const open = trimmed.match(/^([A-Za-z0-9_]+):\s*\{$/);
    const leaf = trimmed.match(/^([A-Za-z0-9_]+):\s*assetPath\("([^"]+)"\),?$/);

    if (open) {
      stack.push(open[1]);
      return;
    }
    if (leaf) {
      const group = stack[0];
      if (TARGET_GROUPS.has(group)) {
        paths.push({
          key: [...stack, leaf[1]].join("."),
          group,
          filePath: join(root, "public", "assets", leaf[2]),
          source: "manifest",
        });
      }
      return;
    }
    if (trimmed.startsWith("}")) {
      stack.pop();
    }
  });

  return paths;
}

export function listStoryImages() {
  const byPath = new Map();
  parseManifestAssetPaths().forEach((asset) => {
    if (existsSync(asset.filePath)) {
      byPath.set(asset.filePath, asset);
    }
  });

  TARGET_GROUPS.forEach((group) => {
    const directory = join(root, "public", "assets", group);
    walkFiles(directory)
      .filter((filePath) => /\.(png|jpe?g|webp)$/i.test(filePath))
      .forEach((filePath) => {
        if (!byPath.has(filePath)) {
          byPath.set(filePath, {
            key: keyFromFile(group, filePath),
            group,
            filePath,
            source: "file",
          });
        }
      });
  });

  return Array.from(byPath.values()).sort((a, b) => a.key.localeCompare(b.key));
}

export function relativePath(filePath) {
  return relative(root, filePath).replace(/\\/g, "/");
}

export function formatRatio(width, height) {
  return Number((width / height).toFixed(4));
}

export function getFocal(assetKey) {
  return FOCAL_POINTS[assetKey] ?? { position: "center", note: "중앙 기준" };
}
