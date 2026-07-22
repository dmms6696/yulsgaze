import { existsSync, readFileSync, statSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const eventFiles = [
  "src/data/events/act1.ts",
  "src/data/events/act2.ts",
  "src/data/events/act3.ts",
  "src/data/events/act4.ts",
];
const manifestPath = join(root, "src", "data", "assetManifest.ts");
const flagsPath = join(root, "src", "data", "flags.ts");

const EXPECTED_STORY_EVENTS = 37;
const EXPECTED_TOTAL_EVENTS = 38;
const EXPECTED_CHOICES = 111;
const FIRST_EVENT_ID = "EVENT_01";
const ENDING_CHECK_ID = "ENDING_CHECK";
const VALID_ACTS = new Set(["1", "2", "3", "4"]);
const VALID_CHARACTERS = new Set([
  "yul",
  "dohye",
  "jinuk",
  "minwoo",
  "donghwi",
  "jimin",
  "classmates",
  "yulMother",
  "jinukFather",
]);
const VALID_EXPRESSIONS = new Set(["neutral", "anxious", "angry", "softened", "growth", "silhouette"]);
const VALID_STATS = new Set(["sight", "courage", "care", "sincerity"]);
const VALID_RELATIONS = new Set(["yul", "dohye", "jinuk", "minwoo", "donghwi", "jimin", "classmates"]);
const VALID_RELATION_STATS = new Set(["closeness", "trust", "guard"]);

function readProjectFile(path) {
  return readFileSync(join(root, path), "utf8");
}

function stripStrings(source) {
  return source.replace(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g, "\"\"");
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function extractEvents() {
  return eventFiles.flatMap((path) => {
    const source = readProjectFile(path);
    const events = [];
    const eventIdPattern = /id:\s*(?:"(EVENT_\d+)"|ENDING_CHECK_EVENT_ID)/g;

    for (const match of source.matchAll(eventIdPattern)) {
      const id = match[1] ?? ENDING_CHECK_ID;
      const start = source.lastIndexOf("{", match.index);
      const end = findMatchingBrace(source, start);
      if (start < 0 || end < 0) {
        events.push({ id, path, startLine: 0, block: "" });
        continue;
      }
      const startLine = source.slice(0, start).split(/\r?\n/).length;
      events.push({
        id,
        path,
        startLine,
        block: source.slice(start, end + 1),
      });
    }

    return events;
  });
}

function extractObjectAfter(label, source, offset = 0) {
  const labelIndex = source.indexOf(label, offset);
  if (labelIndex < 0) {
    return null;
  }
  const start = source.indexOf("{", labelIndex);
  const end = findMatchingBrace(source, start);
  if (start < 0 || end < 0) {
    return null;
  }
  return { text: source.slice(start + 1, end), start, end };
}

function getFirstLevelEntries(objectText) {
  const entries = [];
  let depth = 0;
  let quote = "";
  let escaped = false;
  let keyStart = 0;
  let currentKey = null;
  let valueStart = 0;

  for (let index = 0; index <= objectText.length; index += 1) {
    const char = objectText[index] ?? ",";
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{" || char === "[" || char === "(") {
      depth += 1;
      continue;
    }
    if (char === "}" || char === "]" || char === ")") {
      depth -= 1;
      continue;
    }
    if (depth === 0 && currentKey === null && char === ":") {
      const rawKey = objectText.slice(keyStart, index).trim().replace(/^["']|["']$/g, "");
      currentKey = rawKey;
      valueStart = index + 1;
      continue;
    }
    if (depth === 0 && char === "," && currentKey !== null) {
      entries.push({ key: currentKey, value: objectText.slice(valueStart, index).trim() });
      currentKey = null;
      keyStart = index + 1;
    }
  }

  return entries.filter((entry) => entry.key);
}

function findDuplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  });
  return [...duplicates].sort();
}

function extractManifestAssetKeys() {
  const source = readFileSync(manifestPath, "utf8");
  const start = source.indexOf("export const ASSETS");
  const objectStart = source.indexOf("{", start);
  const objectEnd = findMatchingBrace(source, objectStart);
  const stack = [];
  const keys = new Set();
  const keyTypes = new Map();

  source
    .slice(objectStart + 1, objectEnd)
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      const open = trimmed.match(/^([A-Za-z0-9_]+):\s*\{$/);
      const assetLeaf = trimmed.match(/^([A-Za-z0-9_]+):\s*assetPath\("([^"]+)"\),?$/);
      const missingLeaf = trimmed.match(/^([A-Za-z0-9_]+):\s*missingAsset\(\),?$/);
      const pendingLeaf = trimmed.match(/^([A-Za-z0-9_]+):\s*pendingAsset\("([^"]+)"\),?$/);

      if (open) {
        stack.push(open[1]);
        return;
      }
      if (assetLeaf || missingLeaf || pendingLeaf) {
        const key = [...stack, (assetLeaf || missingLeaf || pendingLeaf)[1]].join(".");
        keys.add(key);
        keyTypes.set(key, assetLeaf ? "assetPath" : pendingLeaf ? "pendingAsset" : "missingAsset");
        return;
      }
      if (trimmed.startsWith("}")) {
        stack.pop();
      }
    });

  return { keys, keyTypes };
}

function extractFlagLabels() {
  const source = readFileSync(flagsPath, "utf8");
  const start = source.indexOf("export const FLAG_LABELS");
  const objectStart = source.indexOf("{", start);
  const objectEnd = findMatchingBrace(source, objectStart);
  return new Set(
    Array.from(source.slice(objectStart + 1, objectEnd).matchAll(/^\s*([A-Za-z0-9_]+):/gm), (match) => match[1]),
  );
}

function collectFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    return stats.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

function collectAssetUsages(events) {
  const usages = [];
  const extraFiles = ["src/components/EndingScreen.tsx", "src/data/scenePresets.ts", "src/engine/visualEngine.ts"];
  const usagePattern =
    /["'`]((?:title|actTransitions|backgrounds|illustrations|characters|props|objects|endings|ui)(?:\.[A-Za-z0-9_]+)+)["'`]/g;

  events.forEach((event) => {
    for (const match of event.block.matchAll(usagePattern)) {
      usages.push({ key: match[1].replace(/^objects\./, "props."), context: event.id, path: event.path });
    }
  });

  extraFiles.forEach((path) => {
    const source = readProjectFile(path);
    for (const match of source.matchAll(usagePattern)) {
      usages.push({ key: match[1].replace(/^objects\./, "props."), context: path, path });
    }
  });

  return usages;
}

const events = extractEvents();
const eventIds = events.map((event) => event.id);
const storyEventIds = eventIds.filter((id) => id.startsWith("EVENT_"));
const eventIdSet = new Set(eventIds);
const manifest = extractManifestAssetKeys();
const flagLabels = extractFlagLabels();

const choiceIds = [];
const outgoing = new Map();
const validationErrors = [];
const validationWarnings = [];

events.forEach((event) => {
  const eventRef = `${event.path}:${event.startLine} ${event.id}`;
  const type = event.block.match(/type:\s*"([^"]+)"/)?.[1] ?? "";
  const act = event.block.match(/act:\s*(\d)/)?.[1] ?? "";
  const eventChoiceIds = Array.from(event.block.matchAll(/id:\s*"(event\d+-[^"]+)"/g), (match) => match[1]);
  const nextIds = Array.from(event.block.matchAll(/nextEventId:\s*(?:"(EVENT_\d+)"|ENDING_CHECK_EVENT_ID)/g), (match) => {
    return match[1] ?? ENDING_CHECK_ID;
  });
  const fallbackIds = Array.from(event.block.matchAll(/fallbackEventId:\s*"([^"]+)"/g), (match) => match[1]);
  const targets = [...nextIds, ...fallbackIds];
  const requiredCount = (event.block.match(/required:\s*\{/g) ?? []).length;

  choiceIds.push(...eventChoiceIds);
  outgoing.set(event.id, targets);

  if (!VALID_ACTS.has(act)) {
    validationErrors.push(`${eventRef}: invalid act '${act || "(missing)"}'`);
  }
  if (event.id === ENDING_CHECK_ID) {
    if (type !== "endingCheck") {
      validationErrors.push(`${eventRef}: ENDING_CHECK must use type endingCheck`);
    }
    if (eventChoiceIds.length !== 0) {
      validationErrors.push(`${eventRef}: ENDING_CHECK must not have choices`);
    }
  } else {
    if (type === "endingCheck") {
      validationErrors.push(`${eventRef}: only ENDING_CHECK can use type endingCheck`);
    }
    if (eventChoiceIds.length !== 3) {
      validationErrors.push(`${eventRef}: expected 3 choices, found ${eventChoiceIds.length}`);
    }
    if (!targets.length) {
      validationErrors.push(`${eventRef}: non-ending event has no next or fallback target`);
    }
  }
  if (findDuplicateValues(eventChoiceIds).length) {
    validationErrors.push(`${eventRef}: duplicate choice IDs inside event`);
  }
  if (requiredCount && !fallbackIds.length && event.id !== ENDING_CHECK_ID) {
    validationErrors.push(`${eventRef}: conditional event has required condition but no fallbackEventId`);
  }

  for (const match of event.block.matchAll(/character\("([^"]+)",\s*"([^"]+)"/g)) {
    const [, characterId, expression] = match;
    if (!VALID_CHARACTERS.has(characterId)) {
      validationErrors.push(`${eventRef}: invalid character id '${characterId}'`);
    }
    if (!VALID_EXPRESSIONS.has(expression)) {
      validationErrors.push(`${eventRef}: invalid character expression '${expression}'`);
    }
  }

  let offset = 0;
  while (true) {
    const statsObject = extractObjectAfter("stats:", event.block, offset);
    if (!statsObject) {
      break;
    }
    getFirstLevelEntries(statsObject.text).forEach((entry) => {
      if (!VALID_STATS.has(entry.key)) {
        validationErrors.push(`${eventRef}: invalid stat key '${entry.key}'`);
      }
    });
    offset = statsObject.end + 1;
  }

  offset = 0;
  while (true) {
    const relationsObject = extractObjectAfter("relations:", event.block, offset);
    if (!relationsObject) {
      break;
    }
    getFirstLevelEntries(relationsObject.text).forEach((relationEntry) => {
      if (!VALID_RELATIONS.has(relationEntry.key)) {
        validationErrors.push(`${eventRef}: invalid relation character '${relationEntry.key}'`);
        return;
      }
      const relationStart = relationEntry.value.indexOf("{");
      if (relationStart < 0) {
        return;
      }
      const relationEnd = findMatchingBrace(relationEntry.value, relationStart);
      getFirstLevelEntries(relationEntry.value.slice(relationStart + 1, relationEnd)).forEach((statEntry) => {
        if (!VALID_RELATION_STATS.has(statEntry.key)) {
          validationErrors.push(`${eventRef}: invalid relation stat '${relationEntry.key}.${statEntry.key}'`);
        }
      });
    });
    offset = relationsObject.end + 1;
  }

  for (const flagMatch of event.block.matchAll(/(?:addFlags|removeFlags):\s*\[([^\]]*)\]/g)) {
    for (const flag of Array.from(flagMatch[1].matchAll(/"([^"]+)"/g), (match) => match[1])) {
      if (!flagLabels.has(flag)) {
        validationErrors.push(`${eventRef}: missing flag label '${flag}'`);
      }
    }
  }
});

const missingTargets = Array.from(
  new Set(
    [...outgoing.values()]
      .flat()
      .filter((target) => !eventIdSet.has(target)),
  ),
).sort();
missingTargets.forEach((target) => validationErrors.push(`missing event target '${target}'`));

const duplicateEvents = findDuplicateValues(eventIds);
const duplicateChoices = findDuplicateValues(choiceIds);
duplicateEvents.forEach((id) => validationErrors.push(`duplicate event id '${id}'`));
duplicateChoices.forEach((id) => validationErrors.push(`duplicate choice id '${id}'`));

const expectedStoryIds = Array.from({ length: EXPECTED_STORY_EVENTS }, (_, index) => `EVENT_${String(index + 1).padStart(2, "0")}`);
const missingExpectedStoryIds = expectedStoryIds.filter((id) => !eventIdSet.has(id));
const unexpectedStoryIds = storyEventIds.filter((id) => !expectedStoryIds.includes(id));
missingExpectedStoryIds.forEach((id) => validationErrors.push(`missing expected story event '${id}'`));
unexpectedStoryIds.forEach((id) => validationErrors.push(`unexpected story event '${id}'`));

const reachable = new Set();
const stack = [FIRST_EVENT_ID];
while (stack.length) {
  const current = stack.pop();
  if (!current || reachable.has(current)) {
    continue;
  }
  reachable.add(current);
  (outgoing.get(current) ?? []).forEach((target) => {
    if (!reachable.has(target)) {
      stack.push(target);
    }
  });
}

const unreachableEvents = eventIds.filter((id) => !reachable.has(id)).sort();
unreachableEvents.forEach((id) => validationErrors.push(`unreachable event '${id}'`));

const canReachEndingMemo = new Map();
function canReachEnding(id, visiting = new Set()) {
  if (id === ENDING_CHECK_ID) {
    return true;
  }
  if (canReachEndingMemo.has(id)) {
    return canReachEndingMemo.get(id);
  }
  if (visiting.has(id)) {
    return false;
  }
  visiting.add(id);
  const targets = outgoing.get(id) ?? [];
  const result = targets.length > 0 && targets.every((target) => canReachEnding(target, visiting));
  visiting.delete(id);
  canReachEndingMemo.set(id, result);
  return result;
}

const pathsNotEnding = eventIds
  .filter((id) => reachable.has(id) && id !== ENDING_CHECK_ID && !canReachEnding(id))
  .sort();
pathsNotEnding.forEach((id) => validationErrors.push(`event path cannot reach ENDING_CHECK from '${id}'`));

const assetUsages = collectAssetUsages(events);
const missingAssetKeys = Array.from(new Set(assetUsages.map((usage) => usage.key).filter((key) => !manifest.keys.has(key)))).sort();
missingAssetKeys.forEach((key) => validationErrors.push(`missing asset manifest key '${key}'`));

const report = {
  storyEvents: storyEventIds.length,
  totalEvents: eventIds.length,
  uniqueEvents: eventIdSet.size,
  choices: choiceIds.length,
  duplicateEvents,
  duplicateChoices,
  missingTargets,
  unreachableEvents,
  pathsNotEnding,
  missingAssetKeys,
  warnings: validationWarnings,
  expected: {
    storyEvents: EXPECTED_STORY_EVENTS,
    totalEvents: EXPECTED_TOTAL_EVENTS,
    choices: EXPECTED_CHOICES,
  },
};

console.log(JSON.stringify(report, null, 2));

if (storyEventIds.length !== EXPECTED_STORY_EVENTS) {
  validationErrors.push(`expected ${EXPECTED_STORY_EVENTS} story events, found ${storyEventIds.length}`);
}
if (eventIds.length !== EXPECTED_TOTAL_EVENTS) {
  validationErrors.push(`expected ${EXPECTED_TOTAL_EVENTS} total events, found ${eventIds.length}`);
}
if (choiceIds.length !== EXPECTED_CHOICES) {
  validationErrors.push(`expected ${EXPECTED_CHOICES} choices, found ${choiceIds.length}`);
}

if (validationErrors.length) {
  console.error("\nStory validation failed:");
  validationErrors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

