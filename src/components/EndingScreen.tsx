import { getEndingById } from "../engine/endingEngine";
import type { GameState } from "../types/game";
import { HistoryPanel } from "./HistoryPanel";
import { StatBar } from "./StatBar";
import { STAT_DEFINITIONS } from "../data/stats";
import { CHARACTERS } from "../data/characters";
import { VisualAssetSlot } from "./VisualAssetSlot";

interface EndingScreenProps {
  state: GameState;
  onRestart: () => void;
}

export function EndingScreen({ state, onRestart }: EndingScreenProps) {
  const ending = getEndingById(state.endingId);
  const majorRelations = CHARACTERS.map((character) => ({
    character,
    relation: state.relations[character.id],
  }))
    .sort((a, b) => b.relation.trust + b.relation.closeness - (a.relation.trust + a.relation.closeness))
    .slice(0, 4);

  return (
    <main className="ending-screen">
      <section className="ending-card">
        <VisualAssetSlot
          assetKey={ending.imageAsset}
          fallbackAssetKey="backgrounds.starNightSchoolyard"
          title={ending.title}
          kicker="엔딩 이미지 슬롯"
          alt={`${ending.title} 결말 이미지`}
          className="ending-image"
          overlay="dim"
          focalPoint={{ x: 50, y: 40 }}
        />
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
          <h2>주요 관계</h2>
          <div className="ending-relations">
            {majorRelations.map(({ character, relation }) => (
              <article key={character.id} className="ending-relation-card">
                <h3>{character.name}</h3>
                <p>
                  친밀 {relation.closeness} · 신뢰 {relation.trust} · 경계 {relation.guard}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="panel-section">
          <h2>선택 기록</h2>
          <HistoryPanel history={state.history} full />
        </section>
      </aside>
    </main>
  );
}
