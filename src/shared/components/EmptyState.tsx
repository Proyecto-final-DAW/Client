import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { PixelCorners } from './PixelCorners';

type Props = {
  title: string;
  description?: string;
  cta?: {
    label: string;
    to: string;
  };
};

export const EmptyState = (props: Props): React.JSX.Element => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-md border-2 border-zinc-700 bg-[#0d0d14] px-8 py-6 text-center"
      >
        <PixelCorners className="border-zinc-700" />
        <p className="mb-3 font-['Press_Start_2P'] text-[10px] tracking-widest text-zinc-400 [text-shadow:2px_2px_0_#000]">
          ─ {props.title.toUpperCase()} ─
        </p>
        {props.description && (
          <p className="font-['VT323'] text-lg leading-tight text-zinc-300">
            {props.description}
          </p>
        )}
        {props.cta && (
          <Link
            to={props.cta.to}
            className="mt-4 inline-block border-b-4 border-green-700 bg-green-500 px-4 py-2.5 font-['Press_Start_2P'] text-[9px] text-[#0a0a0f] shadow-[0_0_14px_rgba(34,197,94,0.35)] transition-all duration-150 hover:border-green-600 hover:bg-green-400 active:mt-[1.0625rem] active:border-b-0"
          >
            ▶ {props.cta.label.toUpperCase()}
          </Link>
        )}
      </motion.div>
    </div>
  );
};
