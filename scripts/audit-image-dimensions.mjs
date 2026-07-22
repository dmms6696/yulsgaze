import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TARGET_HEIGHT,
  TARGET_WIDTH,
  formatRatio,
  listStoryImages,
  loadSharp,
  relativePath,
  root,
  runPillowWorker,
} from "./story-image-utils.mjs";

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

for (const image of images) {
  const { width, height } = await readMetadata(image.filePath);
  const valid = width === TARGET_WIDTH && height === TARGET_HEIGHT;
  results.push({
    key: image.key,
    path: relativePath(image.filePath),
    width,
    height,
    ratio: formatRatio(width, height),
    expected: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
    valid,
  });
}

const invalid = results.filter((result) => !result.valid);
const report = [
  "# Image Dimension Audit",
  "",
  `- Checked images: ${results.length}`,
  `- Valid images: ${results.length - invalid.length}`,
  `- Invalid images: ${invalid.length}`,
  `- Expected size: ${TARGET_WIDTH}x${TARGET_HEIGHT}`,
  "",
  "## Invalid Images",
  "",
  invalid.length
    ? invalid
        .map(
          (result) =>
            `- \`${result.key}\` - ${result.width}x${result.height} - expected ${result.expected} - \`${result.path}\``,
        )
        .join("\n")
    : "- None.",
  "",
  "## Checked Images",
  "",
  ...results.map(
    (result) =>
      `- \`${result.key}\` - ${result.width}x${result.height} (${result.ratio}) - ${result.valid ? "ok" : "invalid"} - \`${result.path}\``,
  ),
  "",
].join("\n");

writeFileSync(join(root, "IMAGE_DIMENSION_AUDIT.md"), report, "utf8");
console.log(
  JSON.stringify(
    {
      checked: results.length,
      valid: results.length - invalid.length,
      invalid: invalid.length,
      expected: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
      invalidImages: invalid,
    },
    null,
    2,
  ),
);

if (invalid.length) {
  process.exit(1);
}
