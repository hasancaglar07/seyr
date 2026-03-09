type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  align?: "left" | "center";
  action?: React.ReactNode;
};

type StatusBadgeProps = {
  live?: boolean;
  label?: string;
  subtle?: boolean;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionTitleProps) {
  return (
    <div className={`section-title section-title-${align}`}>
      <div>
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

export function StatusBadge({ live = false, label, subtle = false }: StatusBadgeProps) {
  const resolvedLabel = label ?? (live ? "Canlida" : "Arsiv");

  return (
    <span
      className={[
        "status-badge",
        live ? "status-badge-live" : "status-badge-muted",
        subtle ? "status-badge-subtle" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="status-dot" aria-hidden="true" />
      {resolvedLabel}
    </span>
  );
}
