import { readFileSync } from "node:fs";

const files = [
  "src/data/events/act1.ts",
  "src/data/events/act2.ts",
  "src/data/events/act3.ts",
  "src/data/events/act4.ts",
];

const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
const eventIds = Array.from(source.matchAll(/id:\s*(?:"(EVENT_\d+)"|ENDING_CHECK_EVENT_ID)/g), (match) => {
  return match[1] ?? "ENDING_CHECK";
});
const eventIdSet = new Set(eventIds);
const duplicateEvents = eventIds.filter((id, index) => eventIds.indexOf(id) !== index);
const nextEventIds = Array.from(source.matchAll(/nextEventId:\s*(?:"(EVENT_\d+)"|ENDING_CHECK_EVENT_ID)/g), (match) => {
  return match[1] ?? "ENDING_CHECK";
});
const fallbackEventIds = Array.from(source.matchAll(/fallbackEventId:\s*"([^"]+)"/g), (match) => match[1]);
const missingTargets = [...nextEventIds, ...fallbackEventIds].filter((id) => !eventIdSet.has(id));
const choiceIds = Array.from(source.matchAll(/id:\s*"(event\d+-[^"]+)"/g), (match) => match[1]);
const duplicateChoices = choiceIds.filter((id, index) => choiceIds.indexOf(id) !== index);
const report = {
  events: eventIds.length,
  uniqueEvents: eventIdSet.size,
  duplicateEvents,
  choices: choiceIds.length,
  duplicateChoices,
  missingTargets,
};

console.log(JSON.stringify(report, null, 2));

if (eventIds.length !== 28 || duplicateEvents.length || duplicateChoices.length || missingTargets.length) {
  process.exit(1);
}
