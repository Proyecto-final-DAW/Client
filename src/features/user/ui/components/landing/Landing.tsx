import type { ComponentType, SVGProps } from 'react';
import { Link } from 'react-router-dom';

import { Carousel } from './Carousel';
import { Hero } from './Hero';
import {
  ChartUpIcon,
  PlayIcon,
  ScrollIcon,
  UserPlusIcon,
} from './PixelIcons';

type PixelIconCmp = ComponentType<
  SVGProps<SVGSVGElement> & { color: string; accent?: string }
>;

type Step = {
  step: string;
  title: string;
  desc: string;
  Icon: PixelIconCmp;
  accent?: string;
};

const STEPS: Step[] = [
  {
    step: '01',
    title: 'CREAR PERFIL',
    desc: 'Nivel, objetivos y equipamiento.',
    Icon: UserPlusIcon,
    accent: '#86efac',
  },
  {
    step: '02',
    title: 'RECIBIR PLAN',
    desc: 'Rutina semanal al instante.',
    Icon: ScrollIcon,
    accent: '#065f46',
  },
  {
    step: '03',
    title: 'SUBIR DE NIVEL',
    desc: 'Entrena y evoluciona tus stats.',
    Icon: ChartUpIcon,
  },
];

export const Landing = (): React.JSX.Element => {
  return (
    <div className="relative bg-[#0a0a0f] min-h-screen text-[#e4e4e7] scroll-smooth">
      {/* Full-page background image — absolute so it scrolls with the page */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/1.png')",
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'repeat-y',
          imageRendering: 'pixelated',
        }}
      />
      {/* Soft unified tint so content stays readable */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,9,0.25) 0%, rgba(5,5,9,0.45) 100%)',
        }}
      />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/85 backdrop-blur-md border-b-2 border-[#1e1e2e]">
        <div className="mx-auto px-6 sm:px-10 lg:px-16 h-24 flex items-center justify-between">
          <Link to="/">
            <img
              src="/images/Logo.png"
              alt="GymQuest"
              className="h-28 w-auto -my-6 drop-shadow-lg object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#a1a1aa] hover:text-green-400 border-2 border-[#1e1e2e] hover:border-green-500/50 px-3 sm:px-4 py-2 sm:py-2.5 transition-colors"
            >
              CONTINUAR
            </Link>
            <Link
              to="/login?mode=register"
              className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-3 sm:px-5 py-2 sm:py-2.5 border-b-[3px] border-green-700 hover:border-green-600 active:border-b-0 active:mt-[3px] transition-all duration-150"
            >
              ▶ INICIAR
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
      <Hero />

      <Carousel />

      <section className="py-16 sm:py-24 bg-[#0a0a0f]/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg text-center mb-12 sm:mb-16 text-[#e4e4e7]">
            <span className="text-green-500">QUEST</span> LOG
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {STEPS.map((s, i) => {
              const Icon = s.Icon;
              return (
                <div key={s.step} className="relative flex">
                  <div className="group flex h-full w-full flex-col items-center border-2 border-[#1e1e2e] bg-[#12121a] p-6 sm:p-7 text-center relative hover:border-green-500/40 transition-colors">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500/40" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500/40" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500/40" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500/40" />

                    {i < STEPS.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-[18px] text-green-500/70 font-['Press_Start_2P'] text-base">
                        ▸
                      </div>
                    )}

                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-sm border-2 border-green-500/30 bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                      <Icon color="#4ade80" accent={s.accent} className="h-9 w-9" />
                    </div>
                    <div className="font-['Press_Start_2P'] text-green-500 text-[10px] sm:text-xs mb-3 tracking-widest">
                      {s.step}
                    </div>
                    <div className="font-['Press_Start_2P'] text-[9px] sm:text-[11px] text-[#e4e4e7] mb-3 leading-relaxed">
                      {s.title}
                    </div>
                    <p className="text-xs sm:text-sm text-[#71717a] font-mono leading-relaxed mt-auto">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#0a0a0f]/40 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="border-2 border-[#1e1e2e] bg-[#12121a] p-8 sm:p-12 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500/40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/40" />

            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-sm border-2 border-green-500/40 bg-green-500/10">
              <PlayIcon color="#4ade80" className="h-10 w-10" />
            </div>
            <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-[#e4e4e7] mb-2 leading-relaxed">
              ¿LISTO PARA
            </h2>
            <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-green-500 mb-6 leading-relaxed">
              TU QUEST?
            </h2>
            <p className="text-[#71717a] text-sm sm:text-base font-mono mb-8">
              Únete gratis y empieza tu aventura hoy.
            </p>
            <Link
              to="/login?mode=register"
              className="inline-block font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 sm:px-10 py-3.5 sm:py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150"
            >
              ▶ EMPEZAR AVENTURA
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-[#1e1e2e] py-6 sm:py-8 bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span className="font-['Press_Start_2P'] text-[7px] sm:text-[8px] text-[#71717a]">
            © 2026 GYMQUEST
          </span>
          <span className="font-['Press_Start_2P'] text-[7px] sm:text-[8px] text-[#71717a]">
            LVL UP YOUR FITNESS
          </span>
        </div>
      </footer>
      </div>
    </div>
  );
};
