import { motion } from 'framer-motion';

import type { StatPilar } from '../../core/domain/models/StatPilar';

interface StatBarProps {
  pilar: StatPilar;
}

export const StatBar = (props: StatBarProps): React.JSX.Element => {
  const percentage = Math.min(100, (props.pilar.value / props.pilar.max) * 100);
  const accent = props.pilar.accentColor;
  const Icon = props.pilar.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-2"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="font-pixel text-[10px] tracking-widest uppercase text-ink">
            {props.pilar.name}
          </span>
          <span className="font-pixel text-[10px] text-ink-muted">
            LVL{' '}
            <span className="font-bold text-green-400">
              {Math.floor(props.pilar.level)}
            </span>
          </span>
        </div>

        <div
          className="h-3 w-full overflow-hidden rounded-sm border bg-page"
          style={{
            borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-sm"
            style={{
              background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 70%, #22c55e))`,
              boxShadow: `0 0 8px color-mix(in srgb, ${accent} 65%, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
