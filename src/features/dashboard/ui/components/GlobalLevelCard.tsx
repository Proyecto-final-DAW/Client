import { ChartBarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';

type Props = {
  globalLevel: number;
};

export const GlobalLevelCard = (props: Props): React.JSX.Element => {
  const percentage = Math.min(100, Math.max(0, props.globalLevel));

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full flex-col border-2 border-green-500/60 bg-[#0d0d14] p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="mb-5 text-center font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
        NIVEL GLOBAL
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-2 border-green-500/40 bg-green-500/10">
            <ChartBarIcon className="h-8 w-8 text-green-400" />
          </div>
          <p className="font-['Press_Start_2P'] text-4xl leading-none text-[#e4e4e7] [text-shadow:2px_2px_0_#000,0_0_14px_rgba(34,197,94,0.5)]">
            {Math.floor(props.globalLevel)}
          </p>
        </div>
        <p className="text-center font-['VT323'] text-base tracking-wide text-[#a1a1aa]">
          Media de tus stats
        </p>
      </div>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-sm bg-[#1e1e2e]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
        />
      </div>
    </motion.article>
  );
};
