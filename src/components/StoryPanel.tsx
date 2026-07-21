import { useEffect, useRef } from "react";
import { ACT_QUESTIONS, ACT_TITLES } from "../data/gameMeta";
import { getEventProgress } from "../engine/gameEngine";
import type { ChoiceResolution, GameEvent, GameState } from "../types/game";
import type { ChoiceView } from "../engine/gameEngine";
import { ChoiceButton } from "./ChoiceButton";
import { ResultNotice } from "./ResultNotice";
import { SceneVisual } from "./SceneVisual";

interface StoryPanelProps {
  state: GameState;
  event: GameEvent;
  warning?: string;
  choiceViews: ChoiceView[];
  pendingResolution: ChoiceResolution | null;
  onChoice: (choiceId: string) => void;
  onContinue: () => void;
}

export function StoryPanel({ event, warning, choiceViews, pendingResolution, onChoice, onContinue }: StoryPanelProps) {
  const storyCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storyCard = storyCardRef.current;
    if (!storyCard) {
      return;
    }
    storyCard.scrollTo({ top: 0, behavior: "auto" });
  }, [event.id]);

  useEffect(() => {
    const storyCard = storyCardRef.current;
    if (!storyCard || !pendingResolution) {
      return;
    }
    requestAnimationFrame(() => {
      storyCard.scrollTo({ top: storyCard.scrollHeight, behavior: "auto" });
    });
  }, [pendingResolution]);

  return (
    <section className="story-panel fade-in">
      <SceneVisual event={event} />

      <div className="story-card" ref={storyCardRef}>
        {warning ? <p className="warning-banner">{warning}</p> : null}
        <div className="event-meta">
          <span>{ACT_TITLES[event.act]}</span>
          <span>{getEventProgress(event.id)}%</span>
        </div>
        <p className="act-question">{ACT_QUESTIONS[event.act]}</p>
        <h1>{event.title}</h1>
        <p className="place-time">
          {event.location ?? "장소 미정"} · {event.time ?? "시간 미정"}
        </p>

        <div className="narration">
          {event.narration?.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {event.speaker || event.dialogue ? (
          <div className="dialogue-box">
            {event.speaker ? <span>{event.speaker}</span> : null}
            <p>{event.dialogue}</p>
          </div>
        ) : null}

        {event.characterAssets?.length ? (
          <div className="character-strip">
            {event.characterAssets.map((asset) => (
              <span key={`${asset.characterId}-${asset.assetKey}`}>{asset.label ?? asset.characterId}</span>
            ))}
          </div>
        ) : null}

        {pendingResolution ? (
          <ResultNotice resolution={pendingResolution} onContinue={onContinue} />
        ) : (
          <div className="choices">
            {choiceViews.map((view) => (
              <ChoiceButton key={view.choice.id} view={view} onChoice={onChoice} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
