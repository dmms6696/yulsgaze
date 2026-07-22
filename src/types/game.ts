export type ActNumber = 1 | 2 | 3 | 4;

export type StatKey = "sight" | "courage" | "care" | "sincerity";

export type RelationCharacterId =
  | "yul"
  | "dohye"
  | "jinuk"
  | "minwoo"
  | "donghwi"
  | "jimin"
  | "classmates";

export type NpcId = "yulMother" | "jinukFather";

export type VisualCharacterId = RelationCharacterId | NpcId;

export type CharacterId = RelationCharacterId;

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
  | "asked_dohye_gently"
  | "quiet_support"
  | "admitted_interest"
  | "admitted_lie"
  | "asked_polaris_meaning"
  | "accepted_polaris"
  | "dismissed_polaris"
  | "helped_cat_safely"
  | "supported_writing"
  | "promised_second_reader"
  | "stayed_with_dark_question"
  | "avoided_dark_question"
  | "noticed_yul_eye_avoidance"
  | "walked_without_pressure"
  | "forced_yul_eye_contact"
  | "noticed_yul_false_similarity"
  | "accepted_yul_difference"
  | "encouraged_yul_mask"
  | "noticed_dohye_sleeves"
  | "defended_dohye_clothes"
  | "mocked_dohye_sleeves"
  | "kept_jinuk_secret"
  | "protected_jinuk_secret"
  | "tempted_to_spread_secret"
  | "spread_jinuk_secret"
  | "understood_jimin"
  | "quiet_support_jimin"
  | "mocked_jimin"
  | "called_teacher"
  | "tried_group_stop"
  | "watched_fight"
  | "reported_notes"
  | "offered_to_listen"
  | "defended_yul"
  | "suspected_yul"
  | "helped_minwoo_confess"
  | "understood_minwoo_jealousy"
  | "used_minwoo_secret"
  | "helped_hospital"
  | "pressured_parent_contact"
  | "avoided_hospital"
  | "waited_for_jinuk"
  | "asked_father_gently"
  | "confronted_father"
  | "heard_jinuk_dream"
  | "encouraged_jinuk"
  | "heard_jinuk_mixed_feelings"
  | "encouraged_jinuk_father_talk"
  | "dismissed_jinuk_past"
  | "stopped_donghwi_gossip"
  | "silently_watched_gossip"
  | "encouraged_donghwi_gossip"
  | "followed_class_mood"
  | "noticed_yul_discomfort"
  | "pointed_out_class"
  | "chose_continuing_understanding"
  | "accepted_partial_understanding"
  | "gave_up_understanding"
  | "helped_reconcile"
  | "centered_yul_excuse"
  | "centered_apology"
  | "sought_adult_help"
  | "misjudged_dohye"
  | "helped_cat_funeral"
  | "stayed_with_pain"
  | "stepped_back_from_pain"
  | "sought_adult_help_for_abuse"
  | "promised_secrecy_only"
  | "rejected_disclosure"
  | "told_yul_not_his_fault"
  | "connected_yul_trauma"
  | "explained_bystanders_first"
  | "helped_yul_accept"
  | "told_yul_forget"
  | "shared_helplessness"
  | "understood_yul_fear"
  | "judged_yul_coward"
  | "asked_future_choice"
  | "respected_counseling_experience"
  | "judged_counseling_exit"
  | "sought_better_help"
  | "waited_at_columbarium"
  | "helped_yul_face_grief"
  | "rushed_yul_grief"
  | "waited_at_hospital"
  | "read_story_to_dohye"
  | "left_hospital"
  | "reported_dohye_missing"
  | "shared_dohye_star"
  | "ignored_empty_hospital"
  | "promised_shared_search"
  | "doubted_meaning"
  | "understood_persistence"
  | "searched_for_dohye"
  | "organized_search"
  | "doubted_search"
  | "saw_yul_change"
  | "missed_yul_change"
  | "named_yul_change";

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
  characterId: VisualCharacterId;
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
  characterId: VisualCharacterId;
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

export interface SceneVisualOverride {
  mode?: SceneVisualMode;
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
  relationMin?: Partial<Record<RelationCharacterId, Partial<RelationStats>>>;
  relationMax?: Partial<Record<RelationCharacterId, Partial<RelationStats>>>;
  requiredFlags?: FlagId[];
  forbiddenFlags?: FlagId[];
  anyFlags?: FlagId[];
  minFlagMatches?: {
    flags: FlagId[];
    count: number;
  };
  maxFlagMatches?: {
    flags: FlagId[];
    count: number;
  };
  allOf?: GameCondition[];
  anyOf?: GameCondition[];
  not?: GameCondition;
  logic?: "AND" | "OR";
}

export interface GameEffects {
  stats?: Partial<PlayerStats>;
  relations?: Partial<Record<RelationCharacterId, Partial<RelationStats>>>;
  addFlags?: FlagId[];
  removeFlags?: FlagId[];
}

export interface GameChoice {
  id: string;
  text: string;
  resultText: string;
  effects?: GameEffects;
  resultVisual?: SceneVisualOverride;
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
