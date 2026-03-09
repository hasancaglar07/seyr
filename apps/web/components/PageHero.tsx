import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HeroStat = {
  label: string;
  value: string;
  note?: string | null;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  actions?: unknown;
  stats?: HeroStat[];
  aside?: unknown;
  contrast?: boolean;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  asideClassName?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  stats,
  aside,
  contrast = false,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
  asideClassName,
}: PageHeroProps) {
  const actionsContent = actions;
  const asideContent = aside;

  return (
    <section className={cn("page-hero", asideContent ? "page-hero-split" : "", contrast ? "page-hero-contrast" : "", className)}>
      <div className={cn("space-y-7", contentClassName)}>
        {eyebrow ? (
          <Badge
            tone={contrast ? "muted" : "default"}
            className={contrast ? "border-white/14 bg-white/10 text-white" : ""}
          >
            {eyebrow}
          </Badge>
        ) : null}

        <div className="space-y-5">
          <h1 className={cn("page-hero-title", contrast ? "text-white" : "", titleClassName)}>{title}</h1>
          {description ? (
            <p className={cn("page-hero-description", contrast ? "text-white/78" : "", descriptionClassName)}>
              {description}
            </p>
          ) : null}
        </div>

        {actionsContent != null ? <div className="page-hero-actions">{actionsContent as any}</div> : null}

        {stats?.length ? (
          <div className="page-hero-stats">
            {stats.map((stat) => (
              <article key={`${stat.label}-${stat.value}`} className={cn("page-hero-stat", contrast ? "page-hero-stat-contrast" : "")}>
                <p className={cn("page-hero-stat-label", contrast ? "text-white/68" : "")}>{stat.label}</p>
                <p className={cn("page-hero-stat-value", contrast ? "text-white" : "")}>{stat.value}</p>
                {stat.note ? <p className={cn("page-hero-stat-note", contrast ? "text-white/60" : "")}>{stat.note}</p> : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>

      {asideContent != null ? <div className={cn("page-hero-aside", asideClassName)}>{asideContent as any}</div> : null}
    </section>
  );
}
