import { useState } from "react";
import { CHARACTERS } from "../data/characters";
import { ACT_TITLES } from "../data/gameMeta";
import { STAT_DEFINITIONS } from "../data/stats";
import { getEventProgress } from "../engine/gameEngine";
import type { GameState } from "../types/game";
import { FlagList } from "./FlagList";
import { HistoryPanel } from "./HistoryPanel";
import { RelationCard } from "./RelationCard";
import { StatBar } from "./StatBar";

interface StatPanelProps {
  state: GameState;
  historyOpen: boolean;
  onHelp: () => void;
  onRestart: () => void;
  onToggleHistory: () => void;
}

export function StatPanel({ state, historyOpen, onHelp, onRestart, onToggleHistory }: StatPanelProps) {
  const [open, setOpen] = useState(true);
  const progress = getEventProgress(state.currentEventId);

  return (
    <aside className={`stat-panel ${open ? "open" : "closed"}`}>
      <button className="panel-toggle" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "상태 패널 접기" : "상태 패널 펼치기"}
      </button>
      <div className="panel-content">
        <section className="panel-section player-card">
          <span className="eyebrow">플레이어</span>
          <h2>{state.playerName}</h2>
          <p>{ACT_TITLES[state.currentAct]}</p>
          <div className="bar-track progress">
            <div className="bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <strong>{progress}% 진행</strong>
        </section>

        <section className="panel-section">
          <h2>플레이어 스탯</h2>
          {STAT_DEFINITIONS.map((stat) => (
            <StatBar key={stat.key} label={stat.label} value={state.stats[stat.key]} description={stat.description} />
          ))}
        </section>

        <section className="panel-section">
          <h2>주요 인물 관계</h2>
          <div className="relations-grid">
            {CHARACTERS.map((character) => (
              <RelationCard
                key={character.id}
                name={character.name}
                role={character.role}
                relation={state.relations[character.id]}
              />
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h2>기억된 선택</h2>
          <FlagList flags={state.flags} />
        </section>

        <section className="panel-section">
          <div className="section-row">
            <h2>최근 선택 기록</h2>
            <button className="text-button" type="button" onClick={onToggleHistory}>
              {historyOpen ? "접기" : "전체 보기"}
            </button>
          </div>
          <HistoryPanel history={state.history} full={historyOpen} />
        </section>

        <div className="panel-actions">
          <button className="secondary-button" type="button" onClick={onHelp}>
            도움말
          </button>
          <button className="danger-button" type="button" onClick={onRestart}>
            처음부터 다시 시작
          </button>
        </div>
      </div>
    </aside>
  );
}
