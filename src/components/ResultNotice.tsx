import type { ChoiceResolution } from "../types/game";

interface ResultNoticeProps {
  resolution: ChoiceResolution;
  onContinue: () => void;
}

export function ResultNotice({ resolution, onContinue }: ResultNoticeProps) {
  return (
    <div className="result-notice">
      <p className="result-label">선택 결과</p>
      <h2>{resolution.choice.text}</h2>
      <p>{resolution.resultText}</p>
      {resolution.changes.length ? (
        <div className="change-list" aria-label="변화 수치">
          {resolution.changes.map((change, index) => (
            <span className={`change-chip ${change.direction}`} key={`${change.label}-${index}`}>
              {change.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="muted">눈에 보이는 수치 변화는 없지만, 선택은 기록되었습니다.</p>
      )}
      <button className="primary-button" type="button" onClick={onContinue}>
        계속하기
      </button>
    </div>
  );
}
