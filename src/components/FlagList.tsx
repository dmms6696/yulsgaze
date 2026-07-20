import { CORE_FLAG_IDS, getFlagLabel } from "../data/flags";
import type { FlagId } from "../types/game";

interface FlagListProps {
  flags: FlagId[];
}

export function FlagList({ flags }: FlagListProps) {
  const core = CORE_FLAG_IDS.filter((flag) => flags.includes(flag));
  const recent = flags.filter((flag) => !core.includes(flag)).slice(-3);
  const visible = [...core.slice(-6), ...recent].slice(-8);

  if (!visible.length) {
    return <p className="empty-mini">아직 특별히 기억된 선택이 없습니다.</p>;
  }

  return (
    <div className="flag-list">
      {visible.map((flag) => (
        <span key={flag}>{getFlagLabel(flag)}</span>
      ))}
    </div>
  );
}
