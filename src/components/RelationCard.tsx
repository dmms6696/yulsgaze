import type { RelationStats } from "../types/game";

interface RelationCardProps {
  name: string;
  role: string;
  relation: RelationStats;
}

function RelationMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="relation-meter" aria-label={`${label} ${value}`}>
      <span>{label}</span>
      <div className="relation-meter-track">
        <div className="relation-meter-fill" style={{ width: `${value}%` }} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

export function RelationCard({ name, role, relation }: RelationCardProps) {
  return (
    <article className="relation-card">
      <div className="relation-card-head">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
      <div className="relation-meter-grid">
        <RelationMeter label="친밀" value={relation.closeness} />
        <RelationMeter label="신뢰" value={relation.trust} />
        <RelationMeter label="경계" value={relation.guard} />
      </div>
    </article>
  );
}
