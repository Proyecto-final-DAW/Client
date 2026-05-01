import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { PixelCorners } from './PixelCorners';

type Cta =
  | { label: string; to: string }
  | { label: string; onClick: () => void };

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  cta?: Cta;
};

const CTA_CLASS =
  "mt-4 inline-block border-b-4 border-green-700 bg-green-500 px-4 py-2.5 font-['Press_Start_2P'] text-[9px] text-[#0a0a0f] shadow-[0_0_14px_rgba(34,197,94,0.35)] transition-all duration-150 hover:border-green-600 hover:bg-green-400 active:mt-[1.0625rem] active:border-b-0";

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
        {props.icon && (
          <div
            className="mb-3 text-3xl [image-rendering:pixelated]"
            aria-hidden="true"
          >
            {props.icon}
          </div>
        )}
        <p className="mb-3 font-['Press_Start_2P'] text-[10px] tracking-widest text-zinc-400 [text-shadow:2px_2px_0_#000]">
          ─ {props.title.toUpperCase()} ─
        </p>
        {props.description && (
          <p className="font-['VT323'] text-lg leading-tight text-zinc-300">
            {props.description}
          </p>
        )}
        {props.cta &&
          ('to' in props.cta ? (
            <Link to={props.cta.to} className={CTA_CLASS}>
              <span aria-hidden="true">▶ </span>
              {props.cta.label.toUpperCase()}
            </Link>
          ) : (
            <button
              type="button"
              onClick={props.cta.onClick}
              className={CTA_CLASS}
            >
              <span aria-hidden="true">▶ </span>
              {props.cta.label.toUpperCase()}
            </button>
          ))}
      </motion.div>
    </div>
  );
};
