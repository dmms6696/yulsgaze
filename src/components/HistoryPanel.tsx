import type { ChoiceHistoryItem } from "../types/game";

interface HistoryPanelProps {
  history: ChoiceHistoryItem[];
  full?: boolean;
  limit?: number;
  maxItems?: number;
}

export function HistoryPanel({ history, full = false, limit = 5, maxItems }: HistoryPanelProps) {
  const source = full ? [...history] : [...history].slice(-limit);
  const visible = (maxItems ? source.slice(-maxItems) : source).reverse();

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
