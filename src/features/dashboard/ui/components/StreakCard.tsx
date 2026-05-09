import { FireIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

import { PixelCorners } from '@shared/components/PixelCorners';
import { TrainingCalendar } from './TrainingCalendar';

type StreakCardProps = {
  streak: number;
  trainingDays: string[];
  /** Sessions completed in the current ISO week. */
  sessionsThisWeek: number;
  /** User's weekly training target. */
  weeklyTarget: number;
};

export const StreakCard = (props: StreakCardProps): React.JSX.Element => {
  const targetMet = props.sessionsThisWeek >= props.weeklyTarget;
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full flex-col border-2 border-green-500/60 bg-card p-4 sm:p-5 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="mb-2 text-center font-pixel text-[10px] tracking-widest text-green-500">
        RACHA
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        {/* Fire + streak count. Streak is the WEEKLY count — number of
            consecutive ISO weeks where the user hit their target. */}
        <div className="flex items-center justify-center gap-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-orange-500/40 bg-orange-500/10">
            <FireIcon className="h-4 w-4 text-orange-400" />
          </div>
          <p className="font-pixel text-xl leading-none text-ink [text-shadow:2px_2px_0_#000,0_0_12px_rgba(249,115,22,0.45)]">
            {props.streak}
          </p>
        </div>

        {/* Progress to this week's target. Whole point of the routine-
            target streak: communicate exactly what's needed to keep
            the streak alive this week. */}
        <p
          className={`font-pixel-mono text-base leading-none tracking-wide ${
            targetMet ? 'text-green-400' : 'text-ink-muted'
          }`}
        >
          {targetMet ? '✓ ' : ''}
          {props.sessionsThisWeek} / {props.weeklyTarget} esta semana
        </p>
      </div>

      <TrainingCalendar trainingDays={props.trainingDays} />
    </motion.article>
  );
};
