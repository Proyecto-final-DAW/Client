import type { StatPilar } from '../../core/domain/models/StatPilar';
import { StatBar } from './StatBar';
import { StatsPanelSkeleton } from './StatsPanelSkeleton';

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
  if (loading) return <StatsPanelSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-card p-5">
        <p className="text-sm text-destructive-foreground">{error}</p>
      </div>
    );
  }

  if (!stats || stats.length === 0) return null;

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
