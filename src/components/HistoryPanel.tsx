import type { ChoiceHistoryItem } from "../types/game";

interface HistoryPanelProps {
  history: ChoiceHistoryItem[];
  full?: boolean;
}

export function HistoryPanel({ history, full = false }: HistoryPanelProps) {
  const visible = full ? [...history].reverse() : [...history].slice(-5).reverse();

  if (!visible.length) {
    return <p className="empty-mini">아직 선택 기록이 없습니다.</p>;
  }

  return (
    <ol className="history-list">
      {visible.map((item) => (
        <li key={item.id}>
          <span>{item.eventTitle}</span>
          <p>{item.historyText}</p>
        </li>
      ))}
    </ol>
  );
}
