import { PixelCorners } from '@shared/components/PixelCorners';
import { Link } from 'react-router-dom';

import type { StatPilar } from '../../../stats/core/domain/models/StatPilar';
import { StatBar } from '../../../stats/ui/components/StatBar';

interface DashboardStatsCardProps {
  stats: StatPilar[] | null;
  loading: boolean;
  error: string | null;
}

const StatsRowsSkeleton = (): React.JSX.Element => (
  <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse bg-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-full animate-pulse bg-muted" />
          <div className="h-3 w-full animate-pulse bg-muted" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Stats card. `h-full` so the card matches the (taller) StreakCard's
 * height when sitting beside it; `flex-1` + `auto-rows-fr` on the
 * stats grid make the 3 rows distribute equally inside that height,
 * so the bars spread vertically to fill the card instead of leaving
 * a void underneath them. The "VER DETALLE" link is pinned to the
 * bottom with `mt-auto` so the section closes against the footer
 * baseline of the streak calendar next to it.
 */
export const DashboardStatsCard = ({
  stats,
  loading,
  error,
}: DashboardStatsCardProps): React.JSX.Element => (
  <article className="relative flex h-full flex-col border-2 border-green-500/50 bg-card p-5 sm:p-6 shadow-[0_0_24px_rgba(34,197,94,0.2)]">
    <PixelCorners size="md" className="border-green-500/50" />
    <p className="mb-4 text-center font-pixel text-[10px] tracking-widest text-green-500">
      ◆ PROGRESO DEL HEROE
    </p>
    {loading && <StatsRowsSkeleton />}
    {!loading && error && (
      <p className="font-pixel-mono text-base text-red-300">{error}</p>
    )}
    {!loading && !error && stats && stats.length > 0 && (
      <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {stats.map((pilar) => (
          <StatBar key={pilar.name} pilar={pilar} />
        ))}
      </div>
    )}
    <div className="mt-auto pt-3 border-t border-border/60 text-right">
      <Link
        to="/profile"
        className="font-pixel text-[9px] tracking-widest text-ink-muted hover:text-green-400 transition-colors"
      >
        ▶ VER DETALLE
      </Link>
    </div>
  </article>
);
