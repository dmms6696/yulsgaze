import type { RelationStats } from "../types/game";
import { StatBar } from "./StatBar";

interface RelationCardProps {
  name: string;
  role: string;
  relation: RelationStats;
}

export function RelationCard({ name, role, relation }: RelationCardProps) {
  return (
    <article className="relation-card">
      <div>
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
      <StatBar label="친밀도" value={relation.closeness} />
      <StatBar label="신뢰도" value={relation.trust} />
      <StatBar label="경계도" value={relation.guard} />
    </article>
  );
}
