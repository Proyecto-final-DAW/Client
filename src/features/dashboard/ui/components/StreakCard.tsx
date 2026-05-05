import { FireIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import { TrainingCalendar } from './TrainingCalendar';

type StreakCardProps = {
  streak: number;
  trainingDays: string[];
};

export const StreakCard = (props: StreakCardProps): React.JSX.Element => {
  const hasStreak = props.streak > 0;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full flex-col border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="mb-5 text-center font-pixel text-[10px] tracking-widest text-green-500">
        RACHA
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-2 border-orange-500/40 bg-orange-500/10">
            <FireIcon className="h-8 w-8 text-orange-400" />
          </div>
          <p className="font-pixel text-4xl leading-none text-ink [text-shadow:2px_2px_0_#000,0_0_14px_rgba(249,115,22,0.45)]">
            {props.streak}
          </p>
        </div>
        <p className="text-center font-pixel-mono text-base tracking-wide text-ink-muted">
          {hasStreak
            ? `¡${props.streak} dias seguidos!`
            : 'Empieza hoy tu racha'}
        </p>
      </div>

      <TrainingCalendar trainingDays={props.trainingDays} />
    </motion.article>
  );
};
