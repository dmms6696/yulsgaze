import { EVENT_MAP, GAME_EVENTS } from "../data/events";
import { ENDING_CHECK_EVENT_ID, TOTAL_STORY_EVENTS } from "../data/gameMeta";
import type { ChoiceResolution, GameChoice, GameEvent, GameState } from "../types/game";
import { applyEffects } from "./effectEngine";
import { determineEnding } from "./endingEngine";
import { matchesCondition } from "./conditionEngine";

export interface ChoiceView {
  choice: GameChoice;
  enabled: boolean;
  disabledReason?: string;
}

export interface CurrentEventResult {
  event: GameEvent;
  warning?: string;
}

export function getEventById(eventId: string) {
  return EVENT_MAP.get(eventId);
}

export function getEventProgress(eventId: string) {
  const playableEvents = GAME_EVENTS.filter((event) => event.type !== "endingCheck");
  const index = playableEvents.findIndex((event) => event.id === eventId);
  if (index < 0) {
    return 0;
  }
  const totalEvents = Math.max(TOTAL_STORY_EVENTS, playableEvents.length);
  return Math.min(100, Math.round(((index + 1) / totalEvents) * 100));
}

export function getCurrentEvent(state: GameState): CurrentEventResult {
  const visited = new Set<string>();
  let event = EVENT_MAP.get(state.currentEventId);

  if (!event) {
    console.error("존재하지 않는 이벤트 ID입니다.", state.currentEventId);
    return {
      event: GAME_EVENTS[0],
      warning: "다음 장면을 불러오지 못했습니다. 기본 장면으로 이동합니다.",
    };
  }

  while (event.required && !matchesCondition(state, event.required) && event.fallbackEventId) {
    if (visited.has(event.id)) {
      console.error("조건부 이벤트 fallback 순환이 감지되었습니다.", event.id);
      return {
        event: GAME_EVENTS[0],
        warning: "조건부 장면을 불러오지 못했습니다. 기본 장면으로 이동합니다.",
      };
    }
    visited.add(event.id);
    const fallback = EVENT_MAP.get(event.fallbackEventId);
    if (!fallback) {
      console.error("fallback 이벤트 ID가 존재하지 않습니다.", event.fallbackEventId);
      return {
        event: GAME_EVENTS[0],
        warning: "다음 장면을 불러오지 못했습니다. 기본 장면으로 이동합니다.",
      };
    }
    event = fallback;
  }

  return { event };
}

export function getChoiceViews(state: GameState, event: GameEvent): ChoiceView[] {
  return event.choices.map((choice) => {
    const enabled = matchesCondition(state, choice.required);
    return {
      choice,
      enabled,
      disabledReason: enabled ? undefined : choice.disabledReason || "아직 이 선택을 고를 조건을 만족하지 못했습니다.",
    };
  });
}

export function choose(state: GameState, event: GameEvent, choiceId: string): { state: GameState; resolution: ChoiceResolution } {
  const choiceView = getChoiceViews(state, event).find((view) => view.choice.id === choiceId);
  if (!choiceView) {
    throw new Error("선택지를 찾을 수 없습니다.");
  }
  if (!choiceView.enabled) {
    throw new Error(choiceView.disabledReason || "아직 선택할 수 없습니다.");
  }

  const { state: effectedState, changes } = applyEffects(state, choiceView.choice.effects);
  const nextEventId = choiceView.choice.nextEventId ?? getNextEventId(event.id);
  const nextEvent = nextEventId ? EVENT_MAP.get(nextEventId) : undefined;
  const nextState: GameState = {
    ...effectedState,
    currentEventId: nextEventId ?? event.id,
    currentAct: nextEvent?.act ?? event.act,
    completedEventIds: Array.from(new Set([...effectedState.completedEventIds, event.id])),
    history: [
      ...effectedState.history,
      {
        id: `${Date.now()}-${choiceView.choice.id}`,
        eventId: event.id,
        eventTitle: event.title,
        choiceText: choiceView.choice.text,
        resultText: choiceView.choice.resultText,
        historyText: choiceView.choice.addHistoryText || choiceView.choice.resultText,
        act: event.act,
        createdAt: new Date().toISOString(),
      },
    ].slice(-200),
    updatedAt: new Date().toISOString(),
  };

  return {
    state: nextState,
    resolution: {
      choice: choiceView.choice,
      event,
      resultText: choiceView.choice.resultText,
      changes,
      nextEventId,
    },
  };
}

export function finalizeIfEndingCheck(state: GameState): GameState {
  const event = EVENT_MAP.get(state.currentEventId);
  if (event?.type !== "endingCheck") {
    return state;
  }

  const ending = determineEnding(state);
  return {
    ...state,
    endingId: ending.id,
    currentEventId: ENDING_CHECK_EVENT_ID,
    currentAct: 4,
    updatedAt: new Date().toISOString(),
  };
}

function getNextEventId(eventId: string) {
  const index = GAME_EVENTS.findIndex((event) => event.id === eventId);
  if (index < 0) {
    return undefined;
  }
  return GAME_EVENTS[index + 1]?.id;
}
