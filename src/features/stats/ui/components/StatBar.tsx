import { motion } from 'framer-motion';

import type { StatPilar } from '../../core/domain/models/StatPilar';
import { statIconFor } from '../StatConfig';

interface StatBarProps {
  pilar: StatPilar;
  /**
   * When true, renders a small "X / Y XP" line below the bar so the
   * user can see exactly how much XP is left to the next level.
   * Defaults to true because that's the dashboard treatment; the
   * profile's StatsPanel sets it false to keep the panel compact —
   * users on /perfil are looking at the radar/banner for a "where
   * am I" snapshot, not at level-up math.
   */
  showXp?: boolean;
}

export const StatBar = (props: StatBarProps): React.JSX.Element => {
  // Bar fills with within-level XP (`value / max`). The earlier
  // version mapped fill to `(level + withinLevel) / 99` (journey to
  // cap), which made the bar feel disconnected from the "X / Y XP"
  // label below it — at level 39 with 50 / 685 XP the user saw a
  // ~40%-filled bar even though they were 7% into the next level.
  // Tying the bar to the same number the label shows makes the
  // level-up moment land: bar fills, hits 100%, jumps to 0%, level
  // bumps. The level number on the right of the row carries the
  // "where am I in the 1-99 journey" story.
  const percentage = Math.min(
    100,
    Math.max(0, (props.pilar.value / props.pilar.max) * 100)
  );
  const accent = props.pilar.accentColor;
  // Icon binding lives in `stats/ui/StatConfig.tsx`; the domain
  // pillar carries only the stable key. statIconFor returns
  // undefined for unknown keys (defensive), in which case we render
  // an empty 9×9 box rather than crashing.
  const Icon = statIconFor(props.pilar.key);
  const showXp = props.showXp ?? true;

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

        {/* Within-level XP readout. Same denominator as the bar fill
            above: bar at 50% means 50% of the way to the next level. */}
        {showXp && (
          <p className="mt-1 text-right font-pixel-mono text-base text-ink-faint tabular-nums">
            {Math.floor(props.pilar.value)} / {props.pilar.max}{' '}
            <span className="text-ink-muted">XP</span>
          </p>
        )}
      </div>
    </div>
  );
};
