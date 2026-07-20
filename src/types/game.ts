export type ActNumber = 1 | 2 | 3 | 4;

export type StatKey = "sight" | "courage" | "care" | "sincerity";

export type CharacterId =
  | "yul"
  | "dohye"
  | "jinuk"
  | "minwoo"
  | "donghwi"
  | "jimin"
  | "classmates";

export type SceneVisualMode = "background" | "characters" | "illustration";

export type CharacterPosition =
  | "far-left"
  | "left"
  | "center-left"
  | "center"
  | "center-right"
  | "right"
  | "far-right";

export type SceneOverlay = "none" | "dim" | "rain" | "mist" | "sunset" | "night";

export type SceneTransition = "fade" | "crossfade" | "none";

export type FlagId =
  | "believed_rumor"
  | "reserved_judgment"
  | "silent_observer"
  | "misread_yul"
  | "noticed_yul_gaze"
  | "spread_dohye_rumor"
  | "asked_dohye_gently"
  | "quiet_support"
  | "heard_dohye_change"
  | "shared_rooftop_silence"
  | "kept_jinuk_secret"
  | "tempted_to_spread_secret"
  | "enjoyed_gossip"
  | "stopped_gossip"
  | "avoided_gossip"
  | "called_teacher"
  | "watched_fight"
  | "tried_group_stop"
  | "understood_jimin"
  | "dug_into_secret"
  | "protected_jinuk_secret"
  | "suspected_yul"
  | "helped_hospital"
  | "avoided_hospital"
  | "followed_class_mood"
  | "noticed_yul_discomfort"
  | "stayed_with_pain"
  | "stepped_back_from_pain"
  | "helped_yul_accept"
  | "waited_for_yul"
  | "doubted_meaning"
  | "searched_for_dohye"
  | "understood_meaning"
  | "saw_yul_change"
  | "named_yul_change"
  | "missed_yul_change";

export type EventType =
  | "narration"
  | "observation"
  | "dialogue"
  | "hidden"
  | "conditional"
  | "endingCheck";

export interface PlayerStats {
  sight: number;
  courage: number;
  care: number;
  sincerity: number;
}

export interface RelationStats {
  closeness: number;
  trust: number;
  guard: number;
}

export type RelationMap = Record<CharacterId, RelationStats>;

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  role: string;
  description: string;
}

export interface StatDefinition {
  key: StatKey;
  label: string;
  description: string;
}

export interface CharacterAssetState {
  characterId: CharacterId;
  assetKey: string;
  label?: string;
  expression?: string;
  position?: CharacterPosition;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  flipX?: boolean;
  focus?: boolean;
  opacity?: number;
  layer?: number;
}

export interface SceneCharacter {
  characterId: CharacterId;
  expression?: string;
  position?: CharacterPosition;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  flipX?: boolean;
  focus?: boolean;
  opacity?: number;
  layer?: number;
  label?: string;
}

export interface SceneProp {
  assetKey: string;
  label?: string;
  alt?: string;
  position?: CharacterPosition;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  flipX?: boolean;
  opacity?: number;
  layer?: number;
}

export interface SceneVisual {
  mode: SceneVisualMode;
  backgroundAsset?: string;
  illustrationAsset?: string;
  characters?: SceneCharacter[];
  props?: SceneProp[];
  overlay?: SceneOverlay;
  transition?: SceneTransition;
  focalPoint?: {
    x: number;
    y: number;
  };
  alt?: string;
  scenePreset?: string;
  speakerFocus?: boolean;
}

export interface GameCondition {
  statsMin?: Partial<PlayerStats>;
  statsMax?: Partial<PlayerStats>;
  relationMin?: Partial<Record<CharacterId, Partial<RelationStats>>>;
  relationMax?: Partial<Record<CharacterId, Partial<RelationStats>>>;
  requiredFlags?: FlagId[];
  forbiddenFlags?: FlagId[];
  anyFlags?: FlagId[];
  minFlagMatches?: {
    flags: FlagId[];
    count: number;
  };
  logic?: "AND" | "OR";
}

export interface GameEffects {
  stats?: Partial<PlayerStats>;
  relations?: Partial<Record<CharacterId, Partial<RelationStats>>>;
  addFlags?: FlagId[];
  removeFlags?: FlagId[];
}

export interface GameChoice {
  id: string;
  text: string;
  resultText: string;
  effects?: GameEffects;
  required?: GameCondition;
  disabledReason?: string;
  nextEventId?: string;
  addHistoryText?: string;
}

export interface GameEvent {
  id: string;
  act: ActNumber;
  type: EventType;
  title: string;
  location?: string;
  time?: string;
  backgroundAsset?: string;
  characterAssets?: CharacterAssetState[];
  visual?: SceneVisual;
  scenePreset?: string;
  narration?: string[];
  speaker?: string;
  dialogue?: string;
  required?: GameCondition;
  fallbackEventId?: string;
  choices: GameChoice[];
}

export interface Ending {
  id: string;
  title: string;
  subtitle: string;
  priority: number;
  condition?: GameCondition;
  imageAsset?: string;
  summary: string[];
  closingLine: string;
}

export interface ChoiceHistoryItem {
  id: string;
  eventId: string;
  eventTitle: string;
  choiceText: string;
  resultText: string;
  historyText: string;
  act: ActNumber;
  createdAt: string;
}

export interface ChangeEntry {
  target: "stat" | "relation" | "flag";
  label: string;
  delta?: number;
  direction: "up" | "down" | "added" | "removed" | "same";
}

export interface ChoiceResolution {
  choice: GameChoice;
  event: GameEvent;
  resultText: string;
  changes: ChangeEntry[];
  nextEventId?: string;
}

export interface GameState {
  version: number;
  playerName: string;
  currentEventId: string;
  currentAct: ActNumber;
  stats: PlayerStats;
  relations: RelationMap;
  flags: FlagId[];
  history: ChoiceHistoryItem[];
  completedEventIds: string[];
  endingId?: string;
  updatedAt: string;
}
