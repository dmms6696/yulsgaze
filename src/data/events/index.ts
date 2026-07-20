import type { GameEvent } from "../../types/game";
import { act1Events } from "./act1";
import { act2Events } from "./act2";
import { act3Events } from "./act3";
import { act4Events } from "./act4";

export const GAME_EVENTS: GameEvent[] = [
  ...act1Events,
  ...act2Events,
  ...act3Events,
  ...act4Events,
];

export const EVENT_MAP = new Map(GAME_EVENTS.map((event) => [event.id, event]));
