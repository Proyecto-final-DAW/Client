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

/** Apex level — matches `MAX_STAT_LEVEL` in progression.service.ts.
 *  Hardcoded here too so the bar can render the journey-to-cap fill
 *  without an extra round-trip; if the cap ever changes both places
 *  need updating, same trade-off as `xpThresholdForLevel`. */
const MAX_LEVEL = 99;

export const StatBar = (props: StatBarProps): React.JSX.Element => {
  // Fill represents the journey from 1 to MAX_LEVEL, blending the
  // current level + the within-level XP progress so the bar inches
  // forward smoothly between level-ups instead of jumping in chunky
  // 1% steps. Previously the bar showed `xp / threshold-for-this-
  // level`, which read as "almost there!" at level 5 even though the
  // user still had 94 levels to go — the wrong story for an RPG with
  // a hard 99 cap.
  const withinLevel = Math.max(
    0,
    Math.min(1, props.pilar.value / props.pilar.max)
  );
  const totalProgress = (props.pilar.level + withinLevel) / MAX_LEVEL;
  const percentage = Math.min(100, Math.max(0, totalProgress * 100));
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

        {/* Within-level XP readout. Pair note: the bar fill above
            represents the macro journey (level / 99), while this
            label represents the micro progress to the next level.
            Different abstractions on purpose — the bar tells "how
            close to cap", the label tells "how close to ding". */}
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
