import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { PixelCorners } from '@shared/components/PixelCorners';
import { STAT_CONFIG, STAT_ORDER } from '../../../stats/core/domain/models/StatConfig';
import type { UserStats } from '../../../stats/core/domain/models/UserStats';
import type { DietLogGains } from '../../core/domain/models/DietLogGains';

interface DietLogStatsModalProps {
  open: boolean;
  gains: DietLogGains;
  /** Current stats snapshot used to render the 5 non-vigor pillars
   *  flat. The diet log only moves vigor server-side, so the other
   *  pillars sit at their current XP for both `before` and `after`. */
  currentStats: UserStats | null;
  onClose: () => void;
}

const xpThresholdForLevel = (level: number): number => 100 + level * 15;

interface StatRowEntry {
  delta: number;
  beforeXp: number;
  beforeLevel: number;
  afterXp: number;
  afterLevel: number;
}

interface StatRowProps {
  statKey: (typeof STAT_ORDER)[number];
  entry: StatRowEntry;
  delay: number;
  reducedMotion: boolean;
}

/**
 * Single animated row, mirroring PostSessionStatsModal's StatRow so
 * the diet popup feels like the session reward (same easing, same
 * level-up flash). Duplicated rather than imported to keep the two
 * modals decoupled — the session modal evolves with workout XP rules,
 * this one with diet rules, and they shouldn't drag each other.
 */
const StatRow = (props: StatRowProps): React.JSX.Element => {
  const { statKey, entry, delay, reducedMotion } = props;
  const config = STAT_CONFIG[statKey];
  const Icon = config.icon;
  const accent = config.accentColor;

  const leveledUp = entry.afterLevel > entry.beforeLevel;
  const beforePct =
    (entry.beforeXp / xpThresholdForLevel(entry.beforeLevel)) * 100;
  const afterPct = (entry.afterXp / xpThresholdForLevel(entry.afterLevel)) * 100;

  const [flashLevelUp, setFlashLevelUp] = useState(false);
  useEffect(() => {
    if (!leveledUp || reducedMotion) return;
    const flashAt = (delay + 0.55) * 1000;
    const timer = setTimeout(() => setFlashLevelUp(true), flashAt);
    return () => clearTimeout(timer);
  }, [leveledUp, reducedMotion, delay]);

  const animation = reducedMotion
    ? { width: `${afterPct}%` }
    : leveledUp
      ? { width: [`${beforePct}%`, '100%', '0%', `${afterPct}%`] }
      : { width: [`${beforePct}%`, `${afterPct}%`] };

  const animationTimes = reducedMotion
    ? undefined
    : leveledUp
      ? [0, 0.55, 0.55, 1]
      : [0, 1];

  const showDelta = entry.delta > 0;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="truncate font-pixel text-[11px] tracking-widest uppercase text-ink">
            {config.name}
          </span>
          <div className="flex shrink-0 items-baseline gap-2">
            {showDelta && (
              <span
                className="font-pixel-mono text-base text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.6)]"
                aria-label={`+${entry.delta} XP`}
              >
                +{entry.delta}
              </span>
            )}
            {flashLevelUp && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1, 1] }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="font-pixel text-[9px] tracking-widest text-yellow-300 [text-shadow:0_0_10px_rgba(253,224,71,0.8)]"
              >
                LVL UP
              </motion.span>
            )}
            <span
              className="shrink-0 font-pixel text-[11px] font-bold"
              style={{ color: accent }}
            >
              {entry.afterLevel}
            </span>
          </div>
        </div>

        <div
          className="h-3 w-full overflow-hidden rounded-sm border bg-page"
          style={{
            borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
          }}
        >
          <motion.div
            initial={{ width: `${beforePct}%` }}
            animate={animation}
            transition={{
              duration: reducedMotion ? 0 : 1.2,
              delay: reducedMotion ? 0 : delay,
              ease: 'easeOut',
              times: animationTimes,
            }}
            className="h-full rounded-sm"
            style={{
              background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 70%, #22c55e))`,
              boxShadow: `0 0 8px color-mix(in srgb, ${accent} 65%, transparent)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Same six-pillar layout as the post-session modal so the diet
 * reward feels visually consistent — only vigor actually moves, the
 * other five sit at their current XP. Keeps the screen balanced
 * (one stat alone looked thin) and reinforces the "stats sheet"
 * mental model the player already has from the session modal.
 */
export const DietLogStatsModal = (
  props: DietLogStatsModalProps
): React.JSX.Element | null => {
  const reducedMotion = useReducedMotion() ?? false;

  if (!props.open) return null;

  const { gains, currentStats, onClose } = props;

  // Build a per-pillar map. The 5 non-vigor entries sit at current
  // XP/level (no delta); vigor pulls before/after from the server gain.
  const entriesByKey = STAT_ORDER.reduce<
    Record<(typeof STAT_ORDER)[number], StatRowEntry>
  >(
    (acc, key) => {
      const pilar = currentStats?.pillar.find(
        (p) => p.name === STAT_CONFIG[key].name
      );
      const xp = pilar?.value ?? 0;
      const level = pilar?.level ?? 1;
      acc[key] = {
        delta: 0,
        beforeXp: xp,
        beforeLevel: level,
        afterXp: xp,
        afterLevel: level,
      };
      return acc;
    },
    {} as Record<(typeof STAT_ORDER)[number], StatRowEntry>
  );

  entriesByKey.vigor = {
    delta: gains.delta,
    beforeXp: gains.beforeXp,
    beforeLevel: gains.beforeLevel,
    afterXp: gains.afterXp,
    afterLevel: gains.afterLevel,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diet-log-stats-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto"
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative my-4 sm:my-8 w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.85),0_0_60px_rgba(34,197,94,0.4)] [scrollbar-width:thin] [scrollbar-color:rgba(34,197,94,0.45)_rgba(15,15,20,0.4)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-thumb]:bg-green-500/45"
      >
        <PixelCorners size="md" className="border-green-500/60" />

        <header className="text-center">
          <p className="font-pixel text-[9px] tracking-widest text-green-500/80">
            ◆ DIETA COMPLETADA
          </p>
          <motion.h2
            id="diet-log-stats-title"
            initial={
              reducedMotion ? false : { scale: 0.6, opacity: 0, filter: 'blur(8px)' }
            }
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1.4, 0.36, 1] }}
            className="mt-3 font-pixel text-3xl sm:text-4xl text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.7),2px_2px_0_#000]"
          >
            +{gains.delta} XP
          </motion.h2>
          {gains.streak > 0 && (
            <p className="mt-2 font-pixel-mono text-base text-ink-muted">
              Racha de dieta: {gains.streak}{' '}
              {gains.streak === 1 ? 'dia' : 'dias'}
            </p>
          )}
        </header>

        <ul className="mt-6 flex flex-col gap-4">
          {STAT_ORDER.map((key, i) => (
            <li key={key}>
              <StatRow
                statKey={key}
                entry={entriesByKey[key]}
                delay={0.25 + i * 0.12}
                reducedMotion={reducedMotion}
              />
            </li>
          ))}
        </ul>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.4)]"
          >
            ▶ CONTINUAR
          </button>
        </div>
      </motion.div>
    </div>
  );
};
