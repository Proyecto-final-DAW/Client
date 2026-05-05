import { motion } from 'framer-motion';

import { PixelCorners } from './PixelCorners';

type Props = {
  message: string;
  onRetry?: () => void;
};

export const ErrorState = (props: Props): React.JSX.Element => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-md border-2 border-red-500/50 bg-card px-8 py-6"
      >
        <PixelCorners className="border-red-500/50" />
        <p className="mb-3 font-pixel text-[10px] tracking-widest text-red-400 [text-shadow:2px_2px_0_#000,0_0_12px_rgba(239,68,68,0.45)]">
          ✕ ERROR
        </p>
        <p className="font-pixel-mono text-xl leading-snug text-zinc-200">
          {props.message}
        </p>
        {props.onRetry && (
          <button
            type="button"
            onClick={props.onRetry}
            className="mt-4 border-b-4 border-green-700 bg-green-500 px-4 py-2.5 font-pixel text-[9px] text-[#0a0a0f] shadow-[0_0_14px_rgba(34,197,94,0.35)] transition-all duration-150 hover:border-green-600 hover:bg-green-400 active:mt-[1.0625rem] active:border-b-0"
          >
            ▶ REINTENTAR
          </button>
        )}
      </motion.div>
    </div>
  );
};
