import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

import { useStats } from '../../../stats/ui/hooks/useStats';
import { useDietStreak } from '../hooks/useDietStreak';
import { DietLogStatsModal } from './DietLogStatsModal';

/**
 * Just the daily-log button. Lives inside the DietSummaryCard footer
 * (rendered as `footer` slot). The streak chip was removed — the diet
 * streak surfaces elsewhere (achievements / vigor stat) and the chip
 * was visually competing with the action without adding info.
 */
export const DietStreakCard = (): React.JSX.Element => {
  const { state, loading, logging, error, logToday, lastGains, clearLastGains } =
    useDietStreak();
  // Snapshot for the post-log modal: the 5 non-vigor pillars are
  // rendered flat from this read, so it's fine if it predates the
  // server-side vigor bump (the modal pulls vigor from `lastGains`).
  const { stats } = useStats();

  const loggedToday = state?.loggedToday ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-3"
    >
      <button
        type="button"
        onClick={() => {
          if (loggedToday || logging) return;
          void logToday();
        }}
        disabled={loggedToday || logging || loading}
        className={`font-pixel text-[10px] sm:text-xs tracking-widest px-6 sm:px-8 py-3 sm:py-4 border-b-4 transition-all duration-150 ${
          loggedToday
            ? 'bg-green-500/15 border-green-500/30 text-green-400/70 cursor-default'
            : 'bg-green-500 hover:bg-green-400 text-[#0a0a0f] border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 shadow-[0_0_18px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0'
        }`}
      >
        {loggedToday ? (
          <span className="inline-flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4" />
            DIETA COMPLETADA
          </span>
        ) : logging ? (
          'REGISTRANDO...'
        ) : (
          '✓ COMPLETAR DIETA'
        )}
      </button>

      {error && (
        <p role="alert" className="font-pixel-mono text-base text-red-400">
          ✕ {error}
        </p>
      )}

      {lastGains && (
        <DietLogStatsModal
          open
          gains={lastGains}
          currentStats={stats}
          onClose={clearLastGains}
        />
      )}
    </motion.div>
  );
};
