import { writeFileSync } from "node:fs";
import {
  TARGET_HEIGHT,
  TARGET_WIDTH,
  formatRatio,
  getFocal,
  listStoryImages,
  loadSharp,
  relativePath,
  root,
  runPillowWorker,
} from "./story-image-utils.mjs";
import { join } from "node:path";

let sharp = null;
try {
  sharp = loadSharp();
} catch (error) {
  console.warn(`sharp unavailable, falling back to Pillow: ${String(error.message).split("\n")[0]}`);
}

const images = listStoryImages();
const results = [];

async function readMetadata(filePath) {
  if (sharp) {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width ?? 0, height: metadata.height ?? 0 };
  }

  return runPillowWorker("metadata", [filePath]);
}

async function normalizeImage(image, focal) {
  if (sharp) {
    const pipeline = sharp(image.filePath).resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "cover",
      position: focal.position,
      withoutEnlargement: false,
      fastShrinkOnLoad: true,
    });
    const extension = image.filePath.toLowerCase().split(".").pop();
    const output =
      extension === "png"
        ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
        : extension === "webp"
          ? await pipeline.webp({ quality: 92 }).toBuffer()
          : await pipeline.jpeg({ quality: 92, mozjpeg: true }).toBuffer();

    writeFileSync(image.filePath, output);
    return readMetadata(image.filePath);
  }

  return runPillowWorker("normalize", [image.filePath, String(TARGET_WIDTH), String(TARGET_HEIGHT), focal.position]);
}

for (const image of images) {
  const before = await readMetadata(image.filePath);
  const focal = getFocal(image.key);
  const exact = before.width === TARGET_WIDTH && before.height === TARGET_HEIGHT;

  if (exact) {
    results.push({
      key: image.key,
      path: relativePath(image.filePath),
      action: "skipped",
      before,
      after: before,
      ratioBefore: formatRatio(before.width, before.height),
      ratioAfter: formatRatio(before.width, before.height),
      focal: focal.note,
    });
    continue;
  }

  const after = await normalizeImage(image, focal);

  results.push({
    key: image.key,
    path: relativePath(image.filePath),
    action: "normalized",
    before,
    after,
    ratioBefore: formatRatio(before.width, before.height),
    ratioAfter: formatRatio(after.width, after.height),
    focal: focal.note,
  });
}

const normalized = results.filter((result) => result.action === "normalized");
const skipped = results.filter((result) => result.action === "skipped");
const report = [
  "# Image Normalize Report",
  "",
  `- Target size: ${TARGET_WIDTH}x${TARGET_HEIGHT}`,
  `- Checked images: ${results.length}`,
  `- Normalized images: ${normalized.length}`,
  `- Skipped images: ${skipped.length}`,
  "",
  "## Results",
  "",
  ...results.map(
    (result) =>
      `- \`${result.key}\` - ${result.action} - ${result.before.width}x${result.before.height} (${result.ratioBefore}) -> ${result.after.width}x${result.after.height} (${result.ratioAfter}) - ${result.focal} - \`${result.path}\``,
  ),
  "",
].join("\n");

writeFileSync(join(root, "IMAGE_NORMALIZE_REPORT.md"), report, "utf8");
console.log(
  JSON.stringify(
    {
      checked: results.length,
      normalized: normalized.length,
      skipped: skipped.length,
      target: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
    },
    null,
    2,
  ),
);
