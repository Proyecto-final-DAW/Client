import { motion, useReducedMotion } from 'framer-motion';

import { PixelCorners } from '@shared/components/PixelCorners';
import type { CardioActivity } from '../../core/domain/models/CardioActivity';
import type { UnlockedMilestonePreview } from '../../core/domain/models/WorkoutSummaryData';
import { CardioActivityForm } from './CardioActivityForm';

type Props = {
  totalVolume: number;
  totalSets: number;
  exercisesCount: number;
  saved: boolean;
  saving: boolean;
  error: string | null;
  unlockedMilestones: UnlockedMilestonePreview[];
  /** Optional cardio entry the user logs at the end of the session. */
  cardio: CardioActivity | null;
  onCardioChange: (value: CardioActivity | null) => void;
  onSave: () => void;
  onFinish: () => void;
};

const StatCell = (props: {
  label: string;
  value: string;
}): React.JSX.Element => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center justify-center gap-1.5 border-2 border-border bg-[#08080d]/95 backdrop-blur-md px-2 py-4 sm:px-4 sm:py-5 shadow-[0_4px_18px_rgba(0,0,0,0.55)] text-center"
  >
    <span className="font-pixel text-[8px] tracking-widest text-ink-muted">
      {props.label}
    </span>
    <span className="font-pixel text-xs sm:text-base text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)] leading-tight break-all">
      {props.value}
    </span>
  </motion.div>
);

// Eight star particles fired from the heading on mount. Pure decoration —
// the celebration moment that turns the otherwise utilitarian summary into
// something the player remembers. Hidden under prefers-reduced-motion.
const SPARKLE_COUNT = 8;

const Sparkle = ({
  index,
  total,
}: {
  index: number;
  total: number;
}): React.JSX.Element => {
  const angle = (index / total) * Math.PI * 2;
  const distance = 90;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  return (
    <motion.span
      aria-hidden="true"
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
      animate={{ x, y, opacity: [0, 1, 0], scale: [0.5, 1.2, 0] }}
      transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
      className="pointer-events-none absolute left-1/2 top-1/2 font-pixel text-base text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.8)]"
    >
      ✦
    </motion.span>
  );
};

export const WorkoutSummary = (props: Props): React.JSX.Element => {
  const {
    totalVolume,
    totalSets,
    exercisesCount,
    saved,
    saving,
    error,
    unlockedMilestones,
    cardio,
    onCardioChange,
    onSave,
    onFinish,
  } = props;

  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="text-ink">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative border-2 border-green-500/40 bg-[#08080d]/95 backdrop-blur-md p-5 text-center overflow-visible shadow-[0_4px_22px_rgba(0,0,0,0.55)]"
        >
          <PixelCorners size="md" className="border-green-500/60" />
          <p className="font-pixel text-[9px] tracking-widest text-ink-muted">
            ENTRENO COMPLETADO
          </p>

          {/* Heading + sparkle burst stack so the particles emit from the
              heading's center. `relative` on the wrapper anchors the
              `absolute`-positioned sparkles. */}
          <div className="relative mt-2 inline-block">
            <motion.h1
              initial={
                prefersReducedMotion
                  ? false
                  : { scale: 0.7, opacity: 0, filter: 'blur(8px)' }
              }
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.55,
                delay: 0.1,
                ease: [0.22, 1.4, 0.36, 1],
              }}
              className="font-pixel text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.7)]"
            >
              ¡BUEN TRABAJO!
            </motion.h1>
            {!prefersReducedMotion &&
              Array.from({ length: SPARKLE_COUNT }, (_, i) => (
                <Sparkle key={i} index={i} total={SPARKLE_COUNT} />
              ))}
          </div>
        </motion.header>

        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.4 },
            },
          }}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          <StatCell label="VOLUMEN" value={`${totalVolume} KG`} />
          <StatCell label="SETS" value={String(totalSets)} />
          <StatCell label="EJERCICIOS" value={String(exercisesCount)} />
        </motion.div>

        {saved && unlockedMilestones.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            <h2 className="font-pixel text-[10px] tracking-widest text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.6)]">
              ★ LOGROS DESBLOQUEADOS
            </h2>
            <ul className="flex flex-col gap-2">
              {unlockedMilestones.map((milestone, idx) => (
                <motion.li
                  key={milestone.id}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, x: -16 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.9 + idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative border-2 border-green-500/50 bg-[#08080d]/95 backdrop-blur-md p-3 shadow-[0_0_14px_rgba(34,197,94,0.25),0_4px_18px_rgba(0,0,0,0.55)]"
                >
                  <p className="font-pixel text-[10px] text-green-400">
                    {milestone.name}
                  </p>
                  <p className="font-pixel-mono text-lg text-ink-muted mt-1 leading-snug">
                    {milestone.description}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Cardio log — only relevant before saving. After save, the
            entry is already in the payload so showing the form again
            would be confusing. */}
        {!saved && (
          <CardioActivityForm value={cardio} onChange={onCardioChange} />
        )}

        {error && (
          <p
            role="alert"
            className="font-pixel-mono text-lg text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3 leading-snug"
          >
            ✕ {error}
          </p>
        )}

        <div className="flex justify-center">
          {saved ? (
            <button
              type="button"
              onClick={onFinish}
              className="font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)]"
            >
              ▶ VOLVER AL DASHBOARD
            </button>
          ) : (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
            >
              {saving ? 'GUARDANDO...' : '▶ GUARDAR SESION'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
