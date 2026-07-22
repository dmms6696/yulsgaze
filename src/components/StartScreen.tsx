import { useState } from "react";
import { GAME_META } from "../data/gameMeta";
import { START_SCREEN_VISUAL } from "../data/scenePresets";
import { VisualAssetSlot } from "./VisualAssetSlot";

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
          <VisualAssetSlot
            assetKey={START_SCREEN_VISUAL.heroAsset}
            fallbackAssetKey={START_SCREEN_VISUAL.backgroundAsset}
            title={GAME_META.title}
            kicker="시작 화면 이미지 슬롯"
            alt={START_SCREEN_VISUAL.alt}
            className="start-hero-image"
            overlay={START_SCREEN_VISUAL.overlay}
            focalPoint={START_SCREEN_VISUAL.focalPoint}
          />
          <div className="start-text-block">
            <p className="eyebrow">2026학년도 동명중학교 여름방학 새빛 독서캠프 선택형 스토리</p>
            <h1>{GAME_META.title}</h1>
            <p className="subtitle">{GAME_META.subtitle}</p>
            <p className="core-message">{GAME_META.coreMessage}</p>
            <p className="creator-credit">{GAME_META.creatorCredit}</p>
          </div>
          <div className="start-support-grid">
            <p className="intro">{GAME_META.intro}</p>
            <p className="content-notice">{GAME_META.contentNotice}</p>
          </div>
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
            placeholder="학생 이름을 입력하세요."
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
