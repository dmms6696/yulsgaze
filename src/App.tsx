import { useEffect, useMemo, useRef, useState } from "react";
import { ActTransitionScreen } from "./components/ActTransitionScreen";
import { ConfirmModal } from "./components/ConfirmModal";
import { EndingScreen } from "./components/EndingScreen";
import { GameLayout } from "./components/GameLayout";
import { HelpModal } from "./components/HelpModal";
import { OrientationGate } from "./components/OrientationGate";
import { StartScreen } from "./components/StartScreen";
import { EVENT_MAP } from "./data/events";
import { preloadAssetPaths, warmupAssetPaths } from "./engine/assetLoading";
import { getCurrentEvent, choose, finalizeIfEndingCheck, getChoiceViews } from "./engine/gameEngine";
import { clearSave, createInitialState, hasSavedGame, loadGame, saveGame } from "./engine/saveEngine";
import { collectActTransitionWarmupPaths, collectStoryWarmupAssetPaths } from "./engine/storyAssetWarmup";
import { collectActTransitionAssetPaths, collectEventAssetPaths, shouldShowActTransition } from "./engine/visualEngine";
import type { ActNumber, ChoiceResolution, GameEvent, GameState } from "./types/game";

export default function App() {
  const [isPortrait, setIsPortrait] = useState(() => window.matchMedia("(orientation: portrait)").matches);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [savedExists, setSavedExists] = useState(false);
  const [message, setMessage] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [pendingResolution, setPendingResolution] = useState<ChoiceResolution | null>(null);
  const [pendingEvent, setPendingEvent] = useState<GameEvent | null>(null);
  const [dismissedActIntros, setDismissedActIntros] = useState<Partial<Record<ActNumber, boolean>>>({});
  const [choiceProcessing, setChoiceProcessing] = useState(false);
  const choiceLockedRef = useRef(false);

  useEffect(() => {
    setSavedExists(hasSavedGame());
  }, []);

  useEffect(() => {
    if (isPortrait) {
      return undefined;
    }

    preloadAssetPaths(collectActTransitionWarmupPaths(), { priority: "high" });
    return warmupAssetPaths(collectStoryWarmupAssetPaths(), {
      concurrency: 2,
      delayMs: 900,
      priority: "low",
    });
  }, [isPortrait]);

  useEffect(() => {
    const orientation = window.matchMedia("(orientation: portrait)");
    const updateOrientation = () => setIsPortrait(orientation.matches);

    updateOrientation();
    if (typeof orientation.addEventListener === "function") {
      orientation.addEventListener("change", updateOrientation);
    } else {
      orientation.addListener(updateOrientation);
    }
    window.addEventListener("resize", updateOrientation);

    return () => {
      if (typeof orientation.removeEventListener === "function") {
        orientation.removeEventListener("change", updateOrientation);
      } else {
        orientation.removeListener(updateOrientation);
      }
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  useEffect(() => {
    if (!gameState || gameState.endingId || pendingResolution) {
      return;
    }
    const finalized = finalizeIfEndingCheck(gameState);
    if (finalized.endingId && finalized.endingId !== gameState.endingId) {
      setGameState(finalized);
      saveGame(finalized);
    }
  }, [gameState, pendingResolution]);

  const current = useMemo(() => {
    if (!gameState) {
      return null;
    }
    return getCurrentEvent(gameState);
  }, [gameState]);

  useEffect(() => {
    if (!gameState || !current || pendingResolution) {
      return;
    }

    const paths = new Set(collectEventAssetPaths(current.event));
    if (shouldShowActTransition(current.event, dismissedActIntros)) {
      collectActTransitionAssetPaths(current.event.act).forEach((path) => paths.add(path));
    }
    getChoiceViews(gameState, current.event).forEach(({ choice }) => {
      collectEventAssetPaths(current.event, choice.resultVisual).forEach((path) => paths.add(path));
      const nextEvent = choice.nextEventId ? EVENT_MAP.get(choice.nextEventId) : undefined;
      if (nextEvent) {
        collectEventAssetPaths(nextEvent).forEach((path) => paths.add(path));
        if (shouldShowActTransition(nextEvent, dismissedActIntros)) {
          collectActTransitionAssetPaths(nextEvent.act).forEach((path) => paths.add(path));
        }
      }
    });
    preloadAssetPaths(Array.from(paths), { priority: "high" });
  }, [current, dismissedActIntros, gameState, pendingResolution]);

  function startGame(playerName: string) {
    if (!playerName.trim()) {
      setMessage("플레이어 이름을 입력해 주세요.");
      return;
    }
    const initial = createInitialState(playerName);
    saveGame(initial);
    setGameState(initial);
    setSavedExists(true);
    setMessage("");
    setPendingEvent(null);
    setPendingResolution(null);
    setChoiceProcessing(false);
    choiceLockedRef.current = false;
    setDismissedActIntros({});
  }

  function continueGame() {
    const loaded = loadGame();
    if (!loaded) {
      setSavedExists(false);
      setMessage("저장된 게임을 불러오지 못했습니다. 새로 시작해 주세요.");
      return;
    }
    setGameState(loaded);
    setMessage("");
    setPendingEvent(null);
    setPendingResolution(null);
    setChoiceProcessing(false);
    choiceLockedRef.current = false;
    setDismissedActIntros({});
  }

  function requestReset() {
    setConfirmResetOpen(true);
  }

  function resetGame() {
    clearSave();
    setGameState(null);
    setSavedExists(false);
    setMessage("");
    setPendingEvent(null);
    setPendingResolution(null);
    setChoiceProcessing(false);
    choiceLockedRef.current = false;
    setConfirmResetOpen(false);
    setDismissedActIntros({});
  }

  function handleChoice(choiceId: string) {
    if (!gameState || !current || pendingResolution || choiceLockedRef.current) {
      return;
    }
    choiceLockedRef.current = true;
    setChoiceProcessing(true);
    try {
      const resolution = choose(gameState, current.event, choiceId);
      setGameState(resolution.state);
      setPendingEvent(current.event);
      setPendingResolution(resolution.resolution);
      saveGame(resolution.state);
    } catch (error) {
      choiceLockedRef.current = false;
      setChoiceProcessing(false);
      console.error(error);
      setMessage(error instanceof Error ? error.message : "선택을 처리하지 못했습니다.");
    }
  }

  function continueAfterResult() {
    if (!gameState) {
      return;
    }
    const finalized = finalizeIfEndingCheck(gameState);
    setGameState(finalized);
    saveGame(finalized);
    setPendingEvent(null);
    setPendingResolution(null);
    setChoiceProcessing(false);
    choiceLockedRef.current = false;
  }

  if (isPortrait) {
    return <OrientationGate />;
  }

  if (!gameState) {
    return (
      <>
        <StartScreen
          message={message}
          hasSave={savedExists}
          onStart={startGame}
          onContinue={continueGame}
          onHelp={() => setHelpOpen(true)}
          onReset={requestReset}
        />
        {helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} /> : null}
        {confirmResetOpen ? (
          <ConfirmModal
            title="저장 데이터를 초기화할까요?"
            body="저장된 진행 상황이 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
            confirmLabel="초기화"
            onConfirm={resetGame}
            onCancel={() => setConfirmResetOpen(false)}
          />
        ) : null}
      </>
    );
  }

  if (gameState.endingId) {
    return (
      <>
        <EndingScreen state={gameState} onRestart={requestReset} />
        {confirmResetOpen ? (
          <ConfirmModal
            title="처음부터 다시 시작할까요?"
            body="현재 저장된 진행 상황이 삭제되고 시작 화면으로 돌아갑니다."
            confirmLabel="처음부터"
            onConfirm={resetGame}
            onCancel={() => setConfirmResetOpen(false)}
          />
        ) : null}
      </>
    );
  }

  const displayEvent = pendingEvent ?? current?.event;
  const choiceViews = displayEvent && !pendingResolution ? getChoiceViews(gameState, displayEvent) : [];

  if (!displayEvent || !current) {
    return (
      <StartScreen
        message="다음 장면을 불러오지 못했습니다. 저장 데이터를 초기화하고 다시 시작해 주세요."
        hasSave={savedExists}
        onStart={startGame}
        onContinue={continueGame}
        onHelp={() => setHelpOpen(true)}
        onReset={requestReset}
      />
    );
  }

  if (!pendingResolution && shouldShowActTransition(displayEvent, dismissedActIntros)) {
    return (
      <ActTransitionScreen
        act={displayEvent.act}
        onContinue={() => setDismissedActIntros((dismissed) => ({ ...dismissed, [displayEvent.act]: true }))}
      />
    );
  }

  return (
    <>
      <GameLayout
        state={gameState}
        event={displayEvent}
        warning={message || current.warning}
        choiceViews={choiceViews}
        pendingResolution={pendingResolution}
        choiceDisabled={choiceProcessing}
        historyOpen={historyOpen}
        onChoice={handleChoice}
        onContinue={continueAfterResult}
        onHelp={() => setHelpOpen(true)}
        onRestart={requestReset}
        onToggleHistory={() => setHistoryOpen((open) => !open)}
      />
      {helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} /> : null}
      {confirmResetOpen ? (
        <ConfirmModal
          title="처음부터 다시 시작할까요?"
          body="현재 저장된 진행 상황이 삭제되고 시작 화면으로 돌아갑니다."
          confirmLabel="처음부터"
          onConfirm={resetGame}
          onCancel={() => setConfirmResetOpen(false)}
        />
      ) : null}
    </>
  );
}
