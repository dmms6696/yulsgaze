import { getActTransitionVisual } from "../engine/visualEngine";
import type { ActNumber } from "../types/game";
import { VisualAssetSlot } from "./VisualAssetSlot";

interface ActTransitionScreenProps {
  act: ActNumber;
  onContinue: () => void;
}

export function ActTransitionScreen({ act, onContinue }: ActTransitionScreenProps) {
  const visual = getActTransitionVisual(act);

  return (
    <main className="act-transition-screen fade-in">
      <section className="act-transition-panel">
        <VisualAssetSlot
          assetKey={visual.imageAsset}
          fallbackAssetKey={visual.backgroundAsset}
          title={visual.title}
          kicker="막 전환 이미지 슬롯"
          alt={`${visual.title} 전환 이미지`}
          className="act-transition-image"
          overlay={visual.overlay}
          focalPoint={visual.focalPoint}
        />
        <div className="act-transition-copy">
          <p className="eyebrow">Act {act}</p>
          <h1>{visual.title}</h1>
          <p>{visual.question}</p>
          <button className="primary-button" type="button" onClick={onContinue}>
            장면 계속 보기
          </button>
        </div>
      </section>
    </main>
  );
}
