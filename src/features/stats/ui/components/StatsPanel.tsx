import type { StatPilar } from '../../core/domain/models/StatPilar';
import { StatBar } from './StatBar';

interface StatsPanelProps {
  stats: StatPilar[] | null;
  loading?: boolean;
  error?: string | null;
}

export const StatsPanel = ({
  stats,
  loading = false,
  error = null,
}: StatsPanelProps) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-[5px] w-full animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-card p-5">
        <p className="text-sm text-destructive-foreground">{error}</p>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
        Stats del Personaje
      </h3>
      <div className="flex flex-col gap-4">
        {stats.map((pilar) => (
          <StatBar key={pilar.name} pilar={pilar} />
        ))}
      </div>
    </div>
  );
};
