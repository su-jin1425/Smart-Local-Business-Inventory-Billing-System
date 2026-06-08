type StatusBadgeProps = {
  label: string;
  tone?: "ok" | "warn";
};

export function StatusBadge({ label, tone = "ok" }: StatusBadgeProps) {
  return <span className={`badge ${tone}`}>{label}</span>;
}

