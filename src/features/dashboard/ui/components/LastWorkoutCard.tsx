import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';

type Props = {
  lastWorkoutDaysAgo: number;
};

export const LastWorkoutCard = (props: Props): React.JSX.Element => {
  const isToday = props.lastWorkoutDaysAgo === 0;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative border-2 border-green-500/60 bg-[#0d0d14] p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_40px_rgba(34,197,94,0.28),0_16px_40px_rgba(0,0,0,0.7)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="mb-4 font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
        ─ ÚLTIMO COMBATE ─
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-2 border-blue-500/40 bg-blue-500/10">
          <CalendarDaysIcon className="h-8 w-8 text-blue-300" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-['Press_Start_2P'] text-3xl leading-none text-[#e4e4e7] [text-shadow:2px_2px_0_#000,0_0_14px_rgba(59,130,246,0.45)]">
            {props.lastWorkoutDaysAgo}
          </p>
          <p className="mt-2 font-['VT323'] text-base tracking-wide text-[#a1a1aa]">
            {isToday
              ? '¡Entrenado hoy!'
              : `Hace ${props.lastWorkoutDaysAgo} días`}
          </p>
        </div>
      </div>
    </motion.article>
  );
};
