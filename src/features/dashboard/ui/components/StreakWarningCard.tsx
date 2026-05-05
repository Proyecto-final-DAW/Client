import { FireIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { StreakStatus } from '../../../streak/core/domain/models/StreakStatus';

type Props = {
  status: StreakStatus;
};

export const StreakWarningCard = (props: Props): React.JSX.Element | null => {
  const navigate = useNavigate();
  const { currentStreak, hoursRemaining, isAtRisk } = props.status;

  if (!isAtRisk) return null;

  return (
    <motion.article
      role="alert"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative border-2 border-red-500/60 bg-card p-5 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(239,68,68,0.35)]"
    >
      <PixelCorners size="md" className="border-red-500/60" />

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-2 border-red-500/40 bg-red-500/10">
          <FireIcon className="h-8 w-8 text-red-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-pixel text-[10px] tracking-widest text-red-400">
            ⚠ RACHA EN PELIGRO
          </p>
          <p className="mt-2 font-pixel text-lg leading-tight text-ink">
            Entrena en las proximas {hoursRemaining}h o pierdes tu racha de{' '}
            {currentStreak} dias.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/routines')}
        className="mt-4 w-full font-pixel text-xs tracking-widest bg-red-500 hover:bg-red-400 text-[#0a0a0f] px-6 py-4 border-b-4 border-red-700 hover:border-red-600 active:border-b-0 active:mt-[1.0625rem] transition-all duration-150 shadow-[0_0_18px_rgba(239,68,68,0.45)]"
      >
        ▶ ENTRENAR AHORA
      </button>
    </motion.article>
  );
};
