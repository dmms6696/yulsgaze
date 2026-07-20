import { useState } from "react";
import { GAME_META } from "../data/gameMeta";

interface StartScreenProps {
  message?: string;
  hasSave: boolean;
  onStart: (playerName: string) => void;
  onContinue: () => void;
  onHelp: () => void;
  onReset: () => void;
}

export function StartScreen({ message, hasSave, onStart, onContinue, onHelp, onReset }: StartScreenProps) {
  const [playerName, setPlayerName] = useState("");

  return (
    <main className="start-screen">
      <section className="start-hero">
        <div className="start-copy">
          <p className="eyebrow">중학교 독서캠프 선택형 스토리</p>
          <h1>{GAME_META.title}</h1>
          <p className="subtitle">{GAME_META.subtitle}</p>
          <p className="core-message">{GAME_META.coreMessage}</p>
          <p className="intro">{GAME_META.intro}</p>
          <p className="content-notice">{GAME_META.contentNotice}</p>
        </div>
        <form
          className="start-card"
          onSubmit={(event) => {
            event.preventDefault();
            onStart(playerName);
          }}
        >
          <label htmlFor="player-name">플레이어 이름</label>
          <input
            id="player-name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="이야기 속 제3의 학생 이름을 입력하세요."
            autoComplete="name"
          />
          {message ? <p className="form-message">{message}</p> : null}
          <button className="primary-button" type="submit">
            게임 시작
          </button>
          {hasSave ? (
            <button className="secondary-button" type="button" onClick={onContinue}>
              이어하기
            </button>
          ) : null}
          <button className="ghost-button" type="button" onClick={onHelp}>
            게임 설명
          </button>
          <button className="danger-button" type="button" onClick={onReset}>
            저장 데이터 초기화
          </button>
        </form>
      </section>
    </main>
  );
}
