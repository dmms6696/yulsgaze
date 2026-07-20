import { getEndingById } from "../engine/endingEngine";
import type { GameState } from "../types/game";
import { HistoryPanel } from "./HistoryPanel";
import { StatBar } from "./StatBar";
import { STAT_DEFINITIONS } from "../data/stats";

interface EndingScreenProps {
  state: GameState;
  onRestart: () => void;
}

export function EndingScreen({ state, onRestart }: EndingScreenProps) {
  const ending = getEndingById(state.endingId);

  return (
    <main className="ending-screen">
      <section className="ending-card">
        <p className="eyebrow">{ending.subtitle}</p>
        <h1>{ending.title}</h1>
        {ending.summary.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <blockquote>{ending.closingLine}</blockquote>
        <button className="primary-button" type="button" onClick={onRestart}>
          처음부터 다시 시작
        </button>
      </section>
      <aside className="ending-side">
        <section className="panel-section">
          <h2>마지막 스탯</h2>
          {STAT_DEFINITIONS.map((stat) => (
            <StatBar key={stat.key} label={stat.label} value={state.stats[stat.key]} />
          ))}
        </section>
        <section className="panel-section">
          <h2>선택 기록</h2>
          <HistoryPanel history={state.history} full />
        </section>
      </aside>
    </main>
  );
}
