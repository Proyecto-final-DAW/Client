import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { StatPilar } from '../../core/domain/models/StatPilar';
import { StatBar } from './StatBar';
import { StatsPanelSkeleton } from './StatsPanelSkeleton';

interface StatsPanelProps {
  stats: StatPilar[] | null;
  loading?: boolean;
  error?: string | null;
}

export const StatsPanel = (
  props: StatsPanelProps
): React.JSX.Element | null => {
  if (props.loading) return <StatsPanelSkeleton />;

  if (props.error) {
    return (
      <div className="relative border-2 border-red-500/40 bg-card p-4">
        <PixelCorners size="sm" className="border-red-500/40" />
        <p className="font-pixel text-base text-red-300">{props.error}</p>
      </div>
    );
  }

  if (!props.stats || props.stats.length === 0) return null;

  return (
    <section className="relative border-2 border-green-500/50 bg-card p-5 shadow-[0_0_18px_rgba(34,197,94,0.18)]">
      <PixelCorners size="md" className="border-green-500/50" />
      <p className="mb-4 font-pixel text-[10px] tracking-widest text-green-500">
        ◆ STATS DEL PERSONAJE
      </p>
      <div className="flex flex-col gap-4">
        {props.stats.map((pilar) => (
          <StatBar key={pilar.name} pilar={pilar} />
        ))}
      </div>
    </section>
  );
};
