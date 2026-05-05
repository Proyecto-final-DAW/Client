import { motion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { StatPilar } from '../../core/domain/models/StatPilar';

interface StatsPanelCompactProps {
  stats: StatPilar[] | null;
  loading?: boolean;
  error?: string | null;
}

const StatTile = ({ pilar }: { pilar: StatPilar }): React.JSX.Element => {
  const percentage = Math.min(100, (pilar.value / pilar.max) * 100);
  const accent = pilar.accentColor;
  const Icon = pilar.icon;

  return (
    <div className="flex items-center gap-2.5 border border-border bg-page p-2.5">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-1">
          <span className="truncate font-pixel text-[8px] tracking-widest uppercase text-ink">
            {pilar.name}
          </span>
          <span
            className="shrink-0 font-pixel text-[8px]"
            style={{ color: accent }}
          >
            {Math.floor(pilar.level)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-sm bg-page border border-border-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-sm"
            style={{
              background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 70%, #22c55e))`,
              boxShadow: `0 0 6px color-mix(in srgb, ${accent} 60%, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const StatsPanelCompact = (
  props: StatsPanelCompactProps
): React.JSX.Element | null => {
  if (props.loading) {
    return (
      <section className="relative border-2 border-green-500/30 bg-card p-4">
        <PixelCorners size="sm" className="border-green-500/30" />
        <p className="font-pixel text-[9px] tracking-widest text-green-500/60">
          CARGANDO STATS…
        </p>
      </section>
    );
  }

  if (props.error) {
    return (
      <section className="relative border-2 border-red-500/40 bg-card p-4">
        <PixelCorners size="sm" className="border-red-500/40" />
        <p className="font-pixel text-base text-red-300">{props.error}</p>
      </section>
    );
  }

  if (!props.stats || props.stats.length === 0) return null;

  return (
    <section className="relative border-2 border-green-500/50 bg-card p-4 shadow-[0_0_18px_rgba(34,197,94,0.15)]">
      <PixelCorners size="md" className="border-green-500/50" />
      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-pixel text-[9px] tracking-widest text-green-500">
          ◆ STATS
        </p>
        <a
          href="/profile"
          className="font-pixel text-[8px] tracking-widest text-ink-faint hover:text-green-400 transition-colors"
        >
          VER TODO ▸
        </a>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {props.stats.map((pilar) => (
          <StatTile key={pilar.name} pilar={pilar} />
        ))}
      </div>
    </section>
  );
};
