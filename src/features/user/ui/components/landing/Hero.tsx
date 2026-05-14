import { Link } from 'react-router-dom';

import { HeroStatsPanel } from './HeroStatsPanel';
import { StarField } from './StarField';

/**
 * Landing hero — split 50/50 on desktop, stacked on mobile.
 *
 * Left column: headline + subhead + primary CTA. The CTA used to live only
 * in the page footer (CtaSection), which meant a visitor who never
 * scrolled never saw a way to register — a conversion killer. Now the
 * primary action is above the fold, with a secondary "Iniciar sesion"
 * link for returning users.
 *
 * Right column: theatrical character mockup so the user immediately
 * grasps what the product is about ("you'll have a class, a level, and
 * stats"). Hidden on mobile where vertical real estate is too tight to
 * justify it.
 */
export const Hero = (): React.JSX.Element => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <StarField />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left — headline + CTA */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-500 mb-4 [text-shadow:0_0_8px_rgba(34,197,94,0.5)]">
              ◆ GYMQUEST · RPG FITNESS
            </p>

            <h1 className="font-pixel text-xl sm:text-3xl md:text-5xl text-white leading-tight md:leading-[1.15] [text-shadow:3px_3px_0_#000,0_0_22px_rgba(0,0,0,0.85)]">
              ENTRENA COMO
              <span className="block text-green-400 mt-2 sm:mt-3 [text-shadow:3px_3px_0_#000,0_0_28px_rgba(34,197,94,0.55)]">
                UN HEROE
              </span>
            </h1>

            <p className="mt-6 font-pixel-mono text-base sm:text-lg leading-snug text-ink-muted max-w-md">
              Rutinas a tu medida, progreso real y habitos que te llevan al
              siguiente LVL cada semana.
            </p>

            <div className="mt-8 flex flex-col items-center lg:items-start gap-3">
              <Link
                to="/register"
                className="inline-block font-pixel text-xs sm:text-sm tracking-widest whitespace-nowrap bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_22px_rgba(34,197,94,0.5)]"
              >
                ▶ EMPEZAR AVENTURA
              </Link>
              <Link
                to="/login"
                className="font-pixel-mono text-base text-ink-muted hover:text-green-400 transition-colors"
              >
                ¿Ya tienes cuenta?{' '}
                <span className="font-pixel text-[10px] tracking-widest text-green-400">
                  INICIA SESION ▸
                </span>
              </Link>
            </div>
          </div>

          {/* Right — character mockup. Hidden on mobile where the hero
              column is already tall and the panel would push everything
              else off the fold. */}
          <div className="hidden lg:block">
            <HeroStatsPanel />
          </div>
        </div>

        {/* Mobile-only mockup, smaller and below the CTA so the hero
            doesn't compete with itself for vertical space. */}
        <div className="lg:hidden mt-10">
          <HeroStatsPanel />
        </div>
      </div>
    </section>
  );
};
