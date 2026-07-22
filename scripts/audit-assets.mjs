import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(root, "src", "data", "assetManifest.ts");
const sourceRoot = join(root, "src");
const outputPath = join(root, "ASSET_AUDIT.md");
const assetKeyPattern =
  /["'`]((?:title|actTransitions|backgrounds|illustrations|characters|props|objects|endings|ui)(?:\.[A-Za-z0-9_]+)+)["'`]/g;

function extractAssetObject(source) {
  const start = source.indexOf("export const ASSETS");
  const objectStart = source.indexOf("{", start);
  let depth = 0;

  for (let index = objectStart; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    }
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(objectStart + 1, index);
      }
    }
  }

  throw new Error("ASSETS 객체를 찾지 못했습니다.");
}

function extractManifestAssets() {
  const source = readFileSync(manifestPath, "utf8");
  const objectSource = extractAssetObject(source);
  const stack = [];
  const assets = new Map();

  objectSource.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    const open = trimmed.match(/^([A-Za-z0-9_]+):\s*\{$/);
    const leaf = trimmed.match(/^([A-Za-z0-9_]+):\s*assetPath\("([^"]+)"\),?$/);
    const pendingLeaf = trimmed.match(/^([A-Za-z0-9_]+):\s*pendingAsset\("([^"]+)"\),?$/);
    const emptyLeaf = trimmed.match(/^([A-Za-z0-9_]+):\s*missingAsset\(\),?$/);

    if (open) {
      stack.push(open[1]);
      return;
    }

    if (leaf) {
      const key = [...stack, leaf[1]].join(".");
      assets.set(key, {
        key,
        webPath: `./assets/${leaf[2]}`,
        filePath: join(root, "public", "assets", leaf[2]),
        pending: false,
      });
      return;
    }

    if (pendingLeaf) {
      const key = [...stack, pendingLeaf[1]].join(".");
      assets.set(key, {
        key,
        webPath: `./assets/${pendingLeaf[2]}`,
        filePath: join(root, "public", "assets", pendingLeaf[2]),
        pending: true,
      });
      return;
    }

    if (emptyLeaf) {
      const key = [...stack, emptyLeaf[1]].join(".");
      assets.set(key, {
        key,
        webPath: "",
        filePath: "",
        pending: false,
        placeholder: true,
      });
      return;
    }

    if (trimmed.startsWith("}")) {
      stack.pop();
    }
  });

  return assets;
}

function walkFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return walkFiles(fullPath);
    }

    return /\.(ts|tsx|md)$/.test(entry) ? [fullPath] : [];
  });
}

function normalizeAssetKey(key) {
  return key.startsWith("objects.") ? key.replace(/^objects\./, "props.") : key;
}

function collectUsages() {
  const usages = [];

  walkFiles(sourceRoot).forEach((filePath) => {
    if (filePath === manifestPath) {
      return;
    }

    let currentEventId = "";
    readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .forEach((line, lineIndex) => {
        const eventId = line.match(/id:\s*"(EVENT_[^"]+|ENDING_CHECK)"/);
        if (eventId) {
          currentEventId = eventId[1];
        }

        const matches = Array.from(line.matchAll(assetKeyPattern));
        matches.forEach((match) => {
          const key = match[1];
          usages.push({
            key: normalizeAssetKey(key),
            originalKey: key,
            file: relative(root, filePath).replace(/\\/g, "/"),
            line: lineIndex + 1,
            eventId: currentEventId,
          });
        });
      });
  });

  return usages;
}

function formatTable(rows, emptyText) {
  if (!rows.length) {
    return emptyText;
  }
  return rows.join("\n");
}

const manifestAssets = extractManifestAssets();
const usages = collectUsages();
const usedKeys = Array.from(new Set(usages.map((usage) => usage.key))).sort();
const missingManifest = usedKeys.filter((key) => !manifestAssets.has(key));
const usedMissingFiles = usedKeys
  .filter((key) => manifestAssets.has(key))
  .filter((key) => {
    const asset = manifestAssets.get(key);
    return !asset.pending && !asset.placeholder;
  })
  .filter((key) => !existsSync(manifestAssets.get(key).filePath));
const usedPendingAssets = usedKeys.filter((key) => manifestAssets.get(key)?.pending);
const unusedManifestKeys = Array.from(manifestAssets.keys()).filter((key) => !usedKeys.includes(key)).sort();

const eventUsage = new Map();
usages.forEach((usage) => {
  const groupKey = usage.eventId || usage.file;
  const values = eventUsage.get(groupKey) ?? new Set();
  values.add(usage.key);
  eventUsage.set(groupKey, values);
});

const report = [
  "# Asset Audit",
  "",
  `- Manifest keys: ${manifestAssets.size}`,
  `- Used keys in source: ${usedKeys.length}`,
  `- Missing manifest entries: ${missingManifest.length}`,
  `- Used keys with missing files: ${usedMissingFiles.length}`,
  `- Used keys waiting for future files: ${usedPendingAssets.length}`,
  "",
  "## Used Asset Keys",
  "",
  formatTable(
    usedKeys.map((key) => {
      const usage = usages.find((item) => item.key === key);
      const manifest = manifestAssets.has(key) ? "ok" : "missing manifest";
      return `- \`${key}\` - ${manifest} - ${usage.file}:${usage.line}${usage.eventId ? ` - ${usage.eventId}` : ""}`;
    }),
    "- No used asset keys found.",
  ),
  "",
  "## Missing Manifest Entries",
  "",
  formatTable(missingManifest.map((key) => `- \`${key}\``), "- None."),
  "",
  "## Used Keys With Missing Files",
  "",
  formatTable(
    usedMissingFiles.map((key) => {
      const asset = manifestAssets.get(key);
      return `- \`${key}\` -> \`${relative(root, asset.filePath).replace(/\\/g, "/")}\``;
    }),
    "- None.",
  ),
  "",
  "## Used Keys Waiting For Future Files",
  "",
  formatTable(
    usedPendingAssets.map((key) => {
      const asset = manifestAssets.get(key);
      const expectedPath = asset?.filePath ? relative(root, asset.filePath).replace(/\\/g, "/") : "";
      return expectedPath ? `- \`${key}\` -> \`${expectedPath}\`` : `- \`${key}\``;
    }),
    "- None.",
  ),
  "",
  "## Event Usage",
  "",
  formatTable(
    Array.from(eventUsage.entries()).map(([eventId, keys]) => `- ${eventId}: ${Array.from(keys).sort().join(", ")}`),
    "- No event asset usage found.",
  ),
  "",
  "## Manifest Keys Not Used Directly Yet",
  "",
  formatTable(unusedManifestKeys.map((key) => `- \`${key}\``), "- None."),
  "",
].join("\n");

writeFileSync(outputPath, report, "utf8");
console.log(report);
