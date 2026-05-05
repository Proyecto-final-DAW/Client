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
    // Tooltip via title= + aria-label so the description reaches both
    // hovering users and screen readers without wiring a popover.
    <div
      className="flex items-center gap-3"
      title={props.pilar.description}
      aria-label={`${props.pilar.name}: ${props.pilar.description}`}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border-2"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>

      <div className="min-w-0 flex-1">
        {/* Label + numeric level on one row. Dropped the "LVL" word that
            used to live next to the number — it doubled the row's text
            length without adding info, and it caused the label to wrap
            at narrow widths. */}
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="truncate font-pixel text-[10px] tracking-widest uppercase text-ink">
            {props.pilar.name}
          </span>
          <span
            className="shrink-0 font-pixel text-[10px] font-bold"
            style={{ color: accent }}
          >
            {Math.floor(props.pilar.level)}
          </span>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-sm border bg-page"
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
