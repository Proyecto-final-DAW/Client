import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { statConfigFor } from '@features/stats/ui/StatConfig';
import type {
  SessionGainEntry,
  SessionGains,
  SessionStatKey,
} from '../../core/domain/models/SessionGains';

interface PostSessionStatsModalProps {
  open: boolean;
  gains: SessionGains;
  onClose: () => void;
}

/**
 * Mirrors server's `xpThresholdForLevel`. Kept literal here (not imported
 * from anywhere) because there's no shared package between client/server,
 * and duplicating two constants is far cheaper than building one.
 */
const xpThresholdForLevel = (level: number): number => 100 + level * 15;

const STAT_ORDER: SessionStatKey[] = [
  'strength',
  'endurance',
  'stamina',
  'agility',
  'tenacity',
  'vigor',
];

interface StatRowProps {
  statKey: SessionStatKey;
  entry: SessionGainEntry;
  /** Animation start delay so the rows cascade in. */
  delay: number;
  reducedMotion: boolean;
}

/**
 * Single animated row inside the modal. The bar starts at the *previous*
 * fill (`beforeXp / threshold(beforeLevel)`), animates over 1.2s up to
 * the new fill (`afterXp / threshold(afterLevel)`), and — if a level-up
 * occurred — sweeps to 100%, jump-cuts to 0%, then continues. The
 * "LVL UP!" badge fades in at the level-up beat.
 *
 * Per-session caps mean a single stat can level up at most once per
 * session in normal play, so this models 0- or 1-level-up paths only.
 */
const StatRow = (props: StatRowProps): React.JSX.Element => {
  const { statKey, entry, delay, reducedMotion } = props;
  const config = statConfigFor(statKey);
  if (!config) return <></>;
  const Icon = config.icon;
  const accent = config.accentColor;

  const leveledUp = entry.afterLevel > entry.beforeLevel;
  const beforePct =
    (entry.beforeXp / xpThresholdForLevel(entry.beforeLevel)) * 100;
  const afterPct = (entry.afterXp / xpThresholdForLevel(entry.afterLevel)) * 100;

  // Drive the level-up flash off the same delay the bar uses, so the
  // badge appears exactly when the bar wraps.
  const [flashLevelUp, setFlashLevelUp] = useState(false);
  useEffect(() => {
    if (!leveledUp || reducedMotion) return;
    const flashAt = (delay + 0.55) * 1000;
    const timer = setTimeout(() => setFlashLevelUp(true), flashAt);
    return () => clearTimeout(timer);
  }, [leveledUp, reducedMotion, delay]);

  // Reduced-motion path: skip the cascade entirely, just snap to the
  // final fill. The +XP and LVL UP badges still render because they're
  // information, not animation.
  const animation = reducedMotion
    ? { width: `${afterPct}%` }
    : leveledUp
      ? {
          width: [`${beforePct}%`, '100%', '0%', `${afterPct}%`],
        }
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
 * Post-session stats popup. Lifts the moment-of-reward out of the silent
 * "Saved" toast and into something the player feels: total XP big, the
 * 6 pillars filling up in a cascade, level-up flashes when applicable.
 *
 * Renders nothing when `gains` is null or when the modal is closed —
 * lets the parent always hand the response without conditional JSX.
 */
export const PostSessionStatsModal = (
  props: PostSessionStatsModalProps
): React.JSX.Element | null => {
  const reducedMotion = useReducedMotion() ?? false;
  useBodyScrollLock(props.open);
  useEscapeClose(props.open, props.onClose);

  if (!props.open) return null;

  const { gains, onClose } = props;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-session-stats-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto"
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        // `max-h-[calc(100vh-2rem)]` + internal `overflow-y-auto`:
        // 6 stat rows + header + button overflow a 600px-tall phone.
        // Outer overlay scrolling worked but felt off; pinning the
        // modal height and scrolling the body keeps the header /
        // CTA visible with the rows scrolling between them.
        className="relative my-4 sm:my-8 w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.85),0_0_60px_rgba(34,197,94,0.4)] [scrollbar-width:thin] [scrollbar-color:rgba(34,197,94,0.45)_rgba(15,15,20,0.4)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-thumb]:bg-green-500/45"
      >
        <PixelCorners size="md" className="border-green-500/60" />

        <header className="text-center">
          <p className="font-pixel text-[9px] tracking-widest text-green-500/80">
            ◆ EXPERIENCIA GANADA
          </p>
          <motion.h2
            id="post-session-stats-title"
            initial={
              reducedMotion ? false : { scale: 0.6, opacity: 0, filter: 'blur(8px)' }
            }
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1.4, 0.36, 1] }}
            className="mt-3 font-pixel text-3xl sm:text-4xl text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.7),2px_2px_0_#000]"
          >
            +{gains.totalXp} XP
          </motion.h2>
          {gains.isToday && gains.streak > 0 && (
            <p className="mt-2 font-pixel-mono text-base text-ink-muted">
              Racha actual: {gains.streak} {gains.streak === 1 ? 'semana' : 'semanas'}
              {gains.streak >= 1 && (
                <span className="ml-2 text-yellow-300">
                  ✦ bonus tenacidad
                </span>
              )}
            </p>
          )}
        </header>

        <ul className="mt-6 flex flex-col gap-4">
          {STAT_ORDER.map((key, i) => (
            <li key={key}>
              <StatRow
                statKey={key}
                entry={gains.perStat[key]}
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
