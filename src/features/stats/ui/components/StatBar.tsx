import { motion } from 'framer-motion';

import type { StatPilar } from '../../core/domain/models/StatPilar';
import { statIconFor } from '../StatConfig';

interface StatBarProps {
  pilar: StatPilar;
}

const MAX_STAT_LEVEL = 99;

export const StatBar = (props: StatBarProps): React.JSX.Element => {
  // Bar fills with within-level XP (`value / max`). The level number
  // on the right of the row carries the 1-99 progress story; the
  // numeric "X / Y XP" caption that used to live below the bar was
  // redundant given the bar already encodes the same fraction visually.
  // Special case: once a pillar reaches the cap (level 99), force the
  // bar to render full — the server freezes XP just below the next
  // threshold (so the bar reads ~99% normally), but after the in-app
  // reset that left raw xp at 0 the bar looked empty next to the "99"
  // label, which the user flagged as visually inconsistent. A maxed
  // pillar should always look complete, not "almost there".
  const isMaxed = props.pilar.level >= MAX_STAT_LEVEL;
  const percentage = isMaxed
    ? 100
    : Math.min(100, Math.max(0, (props.pilar.value / props.pilar.max) * 100));
  const accent = props.pilar.accentColor;
  // Icon binding lives in `stats/ui/StatConfig.tsx`; the domain
  // pillar carries only the stable key. statIconFor returns
  // undefined for unknown keys (defensive), in which case we render
  // an empty 9×9 box rather than crashing.
  const Icon = statIconFor(props.pilar.key);

  return (
    // Tooltip via title= + aria-label so the description reaches both
    // hovering users and screen readers without wiring a popover.
    <div
      className="flex items-center gap-3"
      title={props.pilar.description}
      aria-label={`${props.pilar.name}: ${props.pilar.description}`}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        {Icon && <Icon className="h-5 w-5" style={{ color: accent }} />}
      </div>

      <div className="min-w-0 flex-1">
        {/* Label + numeric level on one row. Dropped the "LVL" word that
            used to live next to the number — it doubled the row's text
            length without adding info, and it caused the label to wrap
            at narrow widths. */}
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="truncate font-pixel text-[11px] tracking-widest uppercase text-ink">
            {props.pilar.name}
          </span>
          <span
            className="shrink-0 font-pixel text-[11px] font-bold"
            style={{ color: accent }}
          >
            {Math.floor(props.pilar.level)}
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
