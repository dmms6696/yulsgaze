import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ENDING_CHECK_EVENT_ID = "ENDING_CHECK";
const RANDOM_RUNS = 5000;

const INITIAL_STATS = {
  sight: 12,
  courage: 12,
  care: 13,
  sincerity: 12,
};
const INITIAL_RELATIONS = {
  yul: { closeness: 18, trust: 18, guard: 50 },
  dohye: { closeness: 14, trust: 14, guard: 64 },
  jinuk: { closeness: 50, trust: 28, guard: 24 },
  minwoo: { closeness: 15, trust: 12, guard: 35 },
  donghwi: { closeness: 35, trust: 25, guard: 15 },
  jimin: { closeness: 40, trust: 38, guard: 40 },
  classmates: { closeness: 30, trust: 26, guard: 20 },
};

const EXPECTED_ENDINGS = [
  "ENDING_POLARIS_TOGETHER",
  "ENDING_SLOW_RESEE",
  "ENDING_SAFE_OBSERVER",
  "ENDING_HASTY_GAZE",
  "ENDING_LATE_HEART",
  "ENDING_DEFAULT",
];

function character(characterId, expression = "neutral", position, label) {
  return { characterId, expression, position, label };
}

function prop(assetKey, label, position) {
  return { assetKey, label, alt: label, position };
}

function evaluateTsData(filePath, exportName) {
  let source = readFileSync(join(root, filePath), "utf8");
  source = source
    .replace(/^import[^\n]*\n/gm, "")
    .replace(/export const (\w+):\s*GameEvent\[\]\s*=/g, "const $1 =")
    .replace(/export const (\w+):\s*Ending\[\]\s*=/g, "const $1 =")
    .replace(/const (\w+):\s*FlagId\[\]\s*=/g, "const $1 =");

  return Function(
    "character",
    "prop",
    "ENDING_CHECK_EVENT_ID",
    `${source}\nreturn ${exportName};`,
  )(character, prop, ENDING_CHECK_EVENT_ID);
}

const GAME_EVENTS = [
  ...evaluateTsData("src/data/events/act1.ts", "act1Events"),
  ...evaluateTsData("src/data/events/act2.ts", "act2Events"),
  ...evaluateTsData("src/data/events/act3.ts", "act3Events"),
  ...evaluateTsData("src/data/events/act4.ts", "act4Events"),
];
const EVENT_MAP = new Map(GAME_EVENTS.map((event) => [event.id, event]));
const ENDINGS = evaluateTsData("src/data/endings.ts", "ENDINGS");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

function rebalanceDelta(delta, target) {
  if (!delta) {
    return 0;
  }
  const magnitude = Math.abs(delta);
  const multiplier = target === "stat" ? 1.5 : 1.35;
  const boostedMagnitude = Math.ceil(magnitude * multiplier);
  const cap = target === "stat" ? 6 : 18;
  return Math.sign(delta) * Math.min(boostedMagnitude, cap);
}

function createInitialState() {
  return {
    currentEventId: "EVENT_01",
    currentAct: 1,
    stats: clone(INITIAL_STATS),
    relations: clone(INITIAL_RELATIONS),
    flags: [],
    completedEventIds: [],
    history: [],
  };
}

function hasFlag(state, flag) {
  return state.flags.includes(flag);
}

function checkStatsMin(state, stats) {
  return !stats || Object.entries(stats).every(([key, value]) => state.stats[key] >= Number(value));
}

function checkStatsMax(state, stats) {
  return !stats || Object.entries(stats).every(([key, value]) => state.stats[key] <= Number(value));
}

function checkRelationMin(state, relations) {
  return (
    !relations ||
    Object.entries(relations).every(([characterId, relation]) => {
      const current = state.relations[characterId];
      return current && Object.entries(relation ?? {}).every(([key, value]) => current[key] >= Number(value));
    })
  );
}

function checkRelationMax(state, relations) {
  return (
    !relations ||
    Object.entries(relations).every(([characterId, relation]) => {
      const current = state.relations[characterId];
      return current && Object.entries(relation ?? {}).every(([key, value]) => current[key] <= Number(value));
    })
  );
}

function matchesCondition(state, condition) {
  if (!condition) {
    return true;
  }
  const checks = [];
  if (condition.statsMin) checks.push(checkStatsMin(state, condition.statsMin));
  if (condition.statsMax) checks.push(checkStatsMax(state, condition.statsMax));
  if (condition.relationMin) checks.push(checkRelationMin(state, condition.relationMin));
  if (condition.relationMax) checks.push(checkRelationMax(state, condition.relationMax));
  if (condition.requiredFlags) checks.push(condition.requiredFlags.every((flag) => hasFlag(state, flag)));
  if (condition.forbiddenFlags) checks.push(condition.forbiddenFlags.every((flag) => !hasFlag(state, flag)));
  if (condition.anyFlags) checks.push(condition.anyFlags.some((flag) => hasFlag(state, flag)));
  if (condition.minFlagMatches) {
    checks.push(condition.minFlagMatches.flags.filter((flag) => hasFlag(state, flag)).length >= condition.minFlagMatches.count);
  }
  if (condition.maxFlagMatches) {
    checks.push(condition.maxFlagMatches.flags.filter((flag) => hasFlag(state, flag)).length <= condition.maxFlagMatches.count);
  }
  if (condition.allOf) checks.push(condition.allOf.every((child) => matchesCondition(state, child)));
  if (condition.anyOf) checks.push(condition.anyOf.some((child) => matchesCondition(state, child)));
  if (condition.not) checks.push(!matchesCondition(state, condition.not));
  return checks.length ? (condition.logic === "OR" ? checks.some(Boolean) : checks.every(Boolean)) : true;
}

function getCurrentEvent(state) {
  const visited = new Set();
  let event = EVENT_MAP.get(state.currentEventId);
  while (event?.required && !matchesCondition(state, event.required) && event.fallbackEventId) {
    if (visited.has(event.id)) {
      throw new Error(`fallback loop at ${event.id}`);
    }
    visited.add(event.id);
    event = EVENT_MAP.get(event.fallbackEventId);
  }
  if (!event) {
    throw new Error(`missing current event ${state.currentEventId}`);
  }
  return event;
}

function applyEffects(state, effects = {}) {
  const next = {
    ...state,
    stats: { ...state.stats },
    relations: Object.fromEntries(Object.entries(state.relations).map(([id, relation]) => [id, { ...relation }])),
    flags: [...state.flags],
  };
  if (effects.stats) {
    Object.entries(effects.stats).forEach(([key, delta]) => {
      next.stats[key] = clamp(next.stats[key] + rebalanceDelta(delta, "stat"));
    });
  }
  if (effects.relations) {
    Object.entries(effects.relations).forEach(([characterId, relationChanges]) => {
      const relation = next.relations[characterId];
      if (!relation) {
        return;
      }
      Object.entries(relationChanges ?? {}).forEach(([key, delta]) => {
        relation[key] = clamp(relation[key] + rebalanceDelta(delta, "relation"));
      });
    });
  }
  (effects.addFlags ?? []).forEach((flag) => {
    if (!next.flags.includes(flag)) {
      next.flags.push(flag);
    }
  });
  if (effects.removeFlags) {
    next.flags = next.flags.filter((flag) => !effects.removeFlags.includes(flag));
  }
  return next;
}

function choose(state, event, choice) {
  const next = applyEffects(state, choice.effects);
  const nextEventId = choice.nextEventId ?? GAME_EVENTS[GAME_EVENTS.findIndex((item) => item.id === event.id) + 1]?.id;
  return {
    ...next,
    currentEventId: nextEventId ?? event.id,
    currentAct: EVENT_MAP.get(nextEventId)?.act ?? event.act,
    completedEventIds: Array.from(new Set([...next.completedEventIds, event.id])),
    history: [...next.history, { eventId: event.id, choiceId: choice.id }],
  };
}

function determineEnding(state) {
  return [...ENDINGS].sort((a, b) => b.priority - a.priority).find((ending) => matchesCondition(state, ending.condition)) ?? ENDINGS.at(-1);
}

const representativeRoutes = {
  polarisTogether: {
    expected: "ENDING_POLARIS_TOGETHER",
    choices: {
      EVENT_01: "event01-sit-with-dohye",
      EVENT_02: "event02-admit-lie",
      EVENT_03: "event03-accept-polaris",
      EVENT_28: "event28-ask-eye-contact",
      EVENT_29: "event29-accept-difference",
      EVENT_30: "event30-respect-long-sleeves",
      EVENT_04: "event04-walk-to-school",
      EVENT_05: "event05-buy-cat-food",
      EVENT_06: "event06-second-reader",
      EVENT_07: "event07-affirm-dohye-answer",
      EVENT_08: "event08-keep-jinuk-secret",
      EVENT_09: "event09-quiet-support-jimin",
      EVENT_10: "event10-group-stop",
      EVENT_11: "event11-offer-listen",
      EVENT_12: "event12-defend-yul",
      EVENT_31: "event31-help-minwoo-confess",
      EVENT_13: "event13-help-hospital",
      EVENT_14: "event14-wait-for-jinuk",
      EVENT_15: "event15-encourage-jinuk",
      EVENT_32: "event32-hear-mixed-feelings",
      EVENT_33: "event33-stop-donghwi-gossip",
      EVENT_16: "event16-notice-yul-discomfort",
      EVENT_34: "event34-continue-understanding",
      EVENT_17: "event17-center-apology",
      EVENT_18: "event18-ask-before-judging",
      EVENT_19: "event19-stay-with-pain",
      EVENT_20: "event20-seek-help-for-dohye",
      EVENT_35: "event35-not-yul-fault",
      EVENT_21: "event21-help-yul-accept",
      EVENT_22: "event22-understand-yul-fear",
      EVENT_23: "event23-seek-better-help",
      EVENT_36: "event36-face-grief",
      EVENT_24: "event24-read-story",
      EVENT_37: "event37-share-paper-star",
      EVENT_25: "event25-promise-shared-search",
      EVENT_26: "event26-organize-search",
      EVENT_27: "event27-name-yul-change",
    },
  },
  slowResee: {
    expected: "ENDING_SLOW_RESEE",
    choices: {
      EVENT_01: "event01-leave-water",
      EVENT_02: "event02-admit-lie",
      EVENT_03: "event03-accept-polaris",
      EVENT_28: "event28-ask-eye-contact",
      EVENT_29: "event29-accept-difference",
      EVENT_30: "event30-defend-dohye-clothes",
      EVENT_04: "event04-walk-to-school",
      EVENT_05: "event05-ask-about-cat",
      EVENT_06: "event06-second-reader",
      EVENT_07: "event07-stay-with-question",
      EVENT_08: "event08-normal-greeting",
      EVENT_09: "event09-listen-to-jimin",
      EVENT_10: "event10-call-teacher",
      EVENT_11: "event11-stay-unsure",
      EVENT_12: "event12-call-teacher-hallway",
      EVENT_31: "event31-understand-minwoo-jealousy",
      EVENT_13: "event13-pressure-parent-contact",
      EVENT_14: "event14-ask-father-gently",
      EVENT_15: "event15-agree-stable-job",
      EVENT_32: "event32-encourage-father-talk",
      EVENT_33: "event33-silently-watch-gossip",
      EVENT_16: "event16-notice-yul-discomfort",
      EVENT_34: "event34-partial-understanding",
      EVENT_17: "event17-center-yul-excuse",
      EVENT_18: "event18-seek-adult-help",
      EVENT_19: "event19-help-cat-funeral",
      EVENT_35: "event35-connect-yul-trauma",
      EVENT_21: "event21-help-yul-accept",
      EVENT_22: "event22-understand-yul-fear",
      EVENT_23: "event23-seek-better-help",
      EVENT_36: "event36-wait-at-columbarium",
      EVENT_24: "event24-wait-at-hospital",
      EVENT_37: "event37-report-dohye-missing",
      EVENT_25: "event25-understand-persistence",
      EVENT_26: "event26-doubt-search",
      EVENT_27: "event27-see-yul-change",
    },
  },
  safeObserver: {
    expected: "ENDING_SAFE_OBSERVER",
    choices: {
      EVENT_01: "event01-leave-water",
      EVENT_02: "event02-admit-interest",
      EVENT_03: "event03-ask-polaris-meaning",
      EVENT_28: "event28-walk-same-direction",
      EVENT_29: "event29-notice-false-similarity",
      EVENT_30: "event30-respect-long-sleeves",
      EVENT_04: "event04-walk-to-school",
      EVENT_05: "event05-ask-about-cat",
      EVENT_06: "event06-support-writing",
      EVENT_07: "event07-avoid-dark-question",
      EVENT_08: "event08-normal-greeting",
      EVENT_09: "event09-listen-to-jimin",
      EVENT_10: "event10-watch-fight",
      EVENT_11: "event11-stay-unsure",
      EVENT_12: "event12-call-teacher-hallway",
      EVENT_31: "event31-understand-minwoo-jealousy",
      EVENT_13: "event13-avoid-hospital",
      EVENT_14: "event14-wait-for-jinuk",
      EVENT_15: "event15-agree-stable-job",
      EVENT_32: "event32-encourage-father-talk",
      EVENT_33: "event33-silently-watch-gossip",
      EVENT_16: "event16-follow-class-mood",
      EVENT_34: "event34-partial-understanding",
      EVENT_17: "event17-center-yul-excuse",
      EVENT_18: "event18-seek-adult-help",
      EVENT_19: "event19-step-back",
      EVENT_35: "event35-connect-yul-trauma",
      EVENT_21: "event21-share-helplessness",
      EVENT_22: "event22-ask-future-choice",
      EVENT_23: "event23-respect-counseling",
      EVENT_36: "event36-wait-at-columbarium",
      EVENT_24: "event24-leave-hospital",
      EVENT_37: "event37-report-dohye-missing",
      EVENT_25: "event25-understand-persistence",
      EVENT_26: "event26-doubt-search",
      EVENT_27: "event27-see-yul-change",
    },
  },
  hastyGaze: {
    expected: "ENDING_HASTY_GAZE",
    choices: {
      EVENT_01: "event01-ask-too-fast",
      EVENT_02: "event02-deny-lie",
      EVENT_03: "event03-dismiss-polaris",
      EVENT_28: "event28-force-eye-contact",
      EVENT_29: "event29-encourage-mask",
      EVENT_30: "event30-mock-long-sleeves",
      EVENT_04: "event04-push-best-friend",
      EVENT_05: "event05-waste-tuna",
      EVENT_06: "event06-dismiss-novel",
      EVENT_07: "event07-avoid-dark-question",
      EVENT_08: "event08-spread-jinuk-secret",
      EVENT_09: "event09-mock-jimin",
      EVENT_10: "event10-watch-fight",
      EVENT_11: "event11-stay-unsure",
      EVENT_12: "event12-suspect-yul",
      EVENT_31: "event31-use-minwoo-secret",
      EVENT_13: "event13-avoid-hospital",
      EVENT_14: "event14-confront-father",
      EVENT_15: "event15-agree-stable-job",
      EVENT_32: "event32-dismiss-jinuk-past",
      EVENT_33: "event33-encourage-gossip",
      EVENT_16: "event16-point-out-class",
      EVENT_34: "event34-give-up-understanding",
      EVENT_17: "event17-center-yul-excuse",
      EVENT_18: "event18-misjudge-dohye",
      EVENT_19: "event19-step-back",
      EVENT_35: "event35-explain-bystanders",
      EVENT_21: "event21-tell-yul-forget",
      EVENT_22: "event22-judge-yul-coward",
      EVENT_23: "event23-judge-counseling-exit",
      EVENT_36: "event36-rush-grief",
      EVENT_24: "event24-leave-hospital",
      EVENT_37: "event37-ignore-empty-room",
      EVENT_25: "event25-doubt-meaning",
      EVENT_26: "event26-doubt-search",
      EVENT_27: "event27-miss-yul-change",
    },
  },
  lateHeart: {
    expected: "ENDING_LATE_HEART",
    choices: {
      EVENT_01: "event01-sit-with-dohye",
      EVENT_02: "event02-admit-interest",
      EVENT_03: "event03-dismiss-polaris",
      EVENT_28: "event28-walk-same-direction",
      EVENT_29: "event29-notice-false-similarity",
      EVENT_30: "event30-defend-dohye-clothes",
      EVENT_04: "event04-walk-to-school",
      EVENT_05: "event05-buy-cat-food",
      EVENT_06: "event06-support-writing",
      EVENT_07: "event07-affirm-dohye-answer",
      EVENT_08: "event08-normal-greeting",
      EVENT_09: "event09-quiet-support-jimin",
      EVENT_10: "event10-call-teacher",
      EVENT_11: "event11-offer-listen",
      EVENT_12: "event12-call-teacher-hallway",
      EVENT_31: "event31-understand-minwoo-jealousy",
      EVENT_13: "event13-help-hospital",
      EVENT_14: "event14-wait-for-jinuk",
      EVENT_15: "event15-agree-stable-job",
      EVENT_32: "event32-encourage-father-talk",
      EVENT_33: "event33-silently-watch-gossip",
      EVENT_16: "event16-follow-class-mood",
      EVENT_34: "event34-partial-understanding",
      EVENT_17: "event17-help-reconcile",
      EVENT_18: "event18-ask-before-judging",
      EVENT_19: "event19-stay-with-pain",
      EVENT_20: "event20-promise-secrecy-only",
      EVENT_35: "event35-explain-bystanders",
      EVENT_21: "event21-share-helplessness",
      EVENT_22: "event22-ask-future-choice",
      EVENT_23: "event23-respect-counseling",
      EVENT_36: "event36-rush-grief",
      EVENT_24: "event24-read-story",
      EVENT_37: "event37-share-paper-star",
      EVENT_25: "event25-promise-shared-search",
      EVENT_26: "event26-search-quietly",
      EVENT_27: "event27-see-yul-change",
    },
  },
  defaultGaze: {
    expected: "ENDING_DEFAULT",
    choices: {
      EVENT_01: "event01-leave-water",
      EVENT_02: "event02-admit-interest",
      EVENT_03: "event03-ask-polaris-meaning",
      EVENT_28: "event28-walk-same-direction",
      EVENT_29: "event29-notice-false-similarity",
      EVENT_30: "event30-defend-dohye-clothes",
      EVENT_04: "event04-walk-to-school",
      EVENT_05: "event05-ask-about-cat",
      EVENT_06: "event06-support-writing",
      EVENT_07: "event07-stay-with-question",
      EVENT_08: "event08-normal-greeting",
      EVENT_09: "event09-listen-to-jimin",
      EVENT_10: "event10-call-teacher",
      EVENT_11: "event11-stay-unsure",
      EVENT_12: "event12-call-teacher-hallway",
      EVENT_31: "event31-understand-minwoo-jealousy",
      EVENT_13: "event13-pressure-parent-contact",
      EVENT_14: "event14-wait-for-jinuk",
      EVENT_15: "event15-agree-stable-job",
      EVENT_32: "event32-encourage-father-talk",
      EVENT_33: "event33-silently-watch-gossip",
      EVENT_16: "event16-follow-class-mood",
      EVENT_34: "event34-partial-understanding",
      EVENT_17: "event17-center-yul-excuse",
      EVENT_18: "event18-seek-adult-help",
      EVENT_19: "event19-help-cat-funeral",
      EVENT_35: "event35-connect-yul-trauma",
      EVENT_21: "event21-share-helplessness",
      EVENT_22: "event22-ask-future-choice",
      EVENT_23: "event23-respect-counseling",
      EVENT_36: "event36-wait-at-columbarium",
      EVENT_24: "event24-wait-at-hospital",
      EVENT_37: "event37-report-dohye-missing",
      EVENT_25: "event25-understand-persistence",
      EVENT_26: "event26-doubt-search",
      EVENT_27: "event27-miss-yul-change",
    },
  },
};

function runRoute(routeChoices, selector = null) {
  let state = createInitialState();
  const path = [];
  for (let step = 0; step < 80; step += 1) {
    const event = getCurrentEvent(state);
    if (event.type === "endingCheck") {
      return { ending: determineEnding(state), state, path };
    }
    const enabledChoices = event.choices.filter((choice) => matchesCondition(state, choice.required));
    const preferredId = routeChoices?.[event.id];
    const choice =
      enabledChoices.find((candidate) => candidate.id === preferredId) ??
      selector?.(event, enabledChoices, state) ??
      enabledChoices[0];
    if (!choice) {
      throw new Error(`no enabled choice at ${event.id}`);
    }
    path.push(`${event.id}:${choice.id}`);
    state = choose(state, event, choice);
  }
  throw new Error("route exceeded 80 steps");
}

function createRng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

const representativeResults = Object.entries(representativeRoutes).map(([name, route]) => {
  const result = runRoute(route.choices);
  return {
    name,
    expected: route.expected,
    actual: result.ending.id,
    steps: result.path.length,
    stats: result.state.stats,
    relations: result.state.relations,
    flags: result.state.flags,
    path: result.path,
  };
});

const rng = createRng(20260722);
const randomCounts = Object.fromEntries(EXPECTED_ENDINGS.map((endingId) => [endingId, 0]));
for (let index = 0; index < RANDOM_RUNS; index += 1) {
  const result = runRoute(null, (_event, choices) => choices[Math.floor(rng() * choices.length)]);
  randomCounts[result.ending.id] = (randomCounts[result.ending.id] ?? 0) + 1;
}

const coverage = Object.fromEntries(EXPECTED_ENDINGS.map((endingId) => [endingId, representativeResults.some((result) => result.actual === endingId)]));
const errors = representativeResults
  .filter((result) => result.actual !== result.expected)
  .map((result) => `${result.name}: expected ${result.expected}, got ${result.actual}`);
EXPECTED_ENDINGS.filter((endingId) => !coverage[endingId]).forEach((endingId) => {
  errors.push(`no representative route reached ${endingId}`);
});

const report = [
  "# Ending Audit",
  "",
  `- Representative routes: ${representativeResults.length}`,
  `- Random routes: ${RANDOM_RUNS}`,
  `- Covered endings: ${Object.values(coverage).filter(Boolean).length}/${EXPECTED_ENDINGS.length}`,
  "",
  "## Representative Routes",
  "",
  ...representativeResults.map(
    (result) =>
      `- ${result.name}: ${result.actual} (${result.actual === result.expected ? "ok" : `expected ${result.expected}`}) - ${result.steps} choices`,
  ),
  "",
  "## Random Distribution",
  "",
  ...Object.entries(randomCounts).map(([endingId, count]) => `- ${endingId}: ${count}`),
  "",
  "## Route Details",
  "",
  ...representativeResults.flatMap((result) => [
    `### ${result.name}`,
    "",
    `- Ending: ${result.actual}`,
    `- Stats: ${JSON.stringify(result.stats)}`,
    `- Flags: ${result.flags.join(", ") || "none"}`,
    `- Path: ${result.path.join(" -> ")}`,
    "",
  ]),
].join("\n");

writeFileSync(join(root, "ENDING_AUDIT.md"), report, "utf8");
console.log(
  JSON.stringify(
    {
      representativeRoutes: representativeResults.map(({ name, expected, actual, steps }) => ({
        name,
        expected,
        actual,
        steps,
      })),
      randomRuns: RANDOM_RUNS,
      randomCounts,
      coverage,
      errors,
    },
    null,
    2,
  ),
);

if (errors.length) {
  process.exit(1);
}
