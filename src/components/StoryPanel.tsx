import { useEffect, useState } from "react";
import { ACT_QUESTIONS, ACT_TITLES } from "../data/gameMeta";
import { resolveAssetPath } from "../data/assetManifest";
import { getEventProgress } from "../engine/gameEngine";
import type { ChoiceResolution, GameEvent, GameState } from "../types/game";
import type { ChoiceView } from "../engine/gameEngine";
import { ChoiceButton } from "./ChoiceButton";
import { ResultNotice } from "./ResultNotice";

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
  const assetPath = resolveAssetPath(event.backgroundAsset);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [event.backgroundAsset]);

  return (
    <section className="story-panel fade-in">
      <div className="scene-visual">
        {assetPath && !imageFailed ? (
          <img src={assetPath} alt={`${event.title} 장면`} onError={() => setImageFailed(true)} />
        ) : (
          <div className="asset-placeholder">
            <p className="placeholder-kicker">이미지 슬롯</p>
            <h2>{event.title}</h2>
            <p>{event.backgroundAsset}</p>
            <span>추후 장면 이미지 삽입 예정</span>
          </div>
        )}
      </div>

      <div className="story-card">
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
