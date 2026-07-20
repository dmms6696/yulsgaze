interface StatBarProps {
  label: string;
  value: number;
  description?: string;
}

export function StatBar({ label, value, description }: StatBarProps) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="bar-track" aria-label={`${label} ${value}`}>
        <div className="bar-fill" style={{ width: `${value}%` }} />
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
