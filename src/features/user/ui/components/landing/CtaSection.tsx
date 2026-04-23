import { PlayIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

import { PixelCorners } from './PixelCorners';

export const CtaSection = (): React.JSX.Element => {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="border-2 border-[#1e1e2e] bg-[#12121a]/85 backdrop-blur-md p-8 sm:p-12 relative">
          <PixelCorners size="md" className="border-green-500/40" />

          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-sm border-2 border-green-500/40 bg-green-500/10">
            <PlayIcon className="h-9 w-9 text-green-400" />
          </div>
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-[#e4e4e7] mb-2 leading-relaxed [text-shadow:2px_2px_0_#000,0_0_10px_rgba(0,0,0,0.8)]">
            ¿LISTO PARA
          </h2>
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-green-500 mb-6 leading-relaxed [text-shadow:2px_2px_0_#000,0_0_12px_rgba(34,197,94,0.5)]">
            TU QUEST?
          </h2>
          <p className="font-['Press_Start_2P'] text-[9px] sm:text-[11px] text-[#71717a] leading-loose tracking-wide mb-8">
            Únete gratis y empieza a entrenar hoy.
          </p>
          <Link
            to="/register"
            className="inline-block font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 sm:px-10 py-3.5 sm:py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_16px_rgba(34,197,94,0.35)]"
          >
            ▶ EMPEZAR AVENTURA
          </Link>
        </div>
      </div>
    </section>
  );
};
