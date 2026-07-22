import type { ChoiceResolution, GameEvent, GameState } from "../types/game";
import type { ChoiceView } from "../engine/gameEngine";
import { StatPanel } from "./StatPanel";
import { StoryPanel } from "./StoryPanel";

interface GameLayoutProps {
  state: GameState;
  event: GameEvent;
  warning?: string;
  choiceViews: ChoiceView[];
  pendingResolution: ChoiceResolution | null;
  choiceDisabled: boolean;
  historyOpen: boolean;
  onChoice: (choiceId: string) => void;
  onContinue: () => void;
  onHelp: () => void;
  onRestart: () => void;
  onToggleHistory: () => void;
}

export function GameLayout({
  state,
  event,
  warning,
  choiceViews,
  pendingResolution,
  choiceDisabled,
  historyOpen,
  onChoice,
  onContinue,
  onHelp,
  onRestart,
  onToggleHistory,
}: GameLayoutProps) {
  return (
    <main className="game-shell">
      <StoryPanel
        state={state}
        event={event}
        warning={warning}
        choiceViews={choiceViews}
        pendingResolution={pendingResolution}
        choiceDisabled={choiceDisabled}
        onChoice={onChoice}
        onContinue={onContinue}
      />
      <StatPanel
        state={state}
        historyOpen={historyOpen}
        onHelp={onHelp}
        onRestart={onRestart}
        onToggleHistory={onToggleHistory}
      />
    </main>
  );
}
