import type { ComponentType, SVGProps } from 'react';

import {
  AppleIcon,
  BookIcon,
  ChartUpIcon,
  GemIcon,
  ScrollIcon,
  TimerIcon,
} from './PixelIcons';

type PixelIconCmp = ComponentType<
  SVGProps<SVGSVGElement> & { color: string; accent?: string }
>;

type Feature = {
  Icon: PixelIconCmp;
  color: string;
  accent?: string;
  title: string;
  subtitle: string;
  description: string;
};

const GREEN = '#22c55e';

const FEATURES: Feature[] = [
  {
    Icon: ScrollIcon,
    color: GREEN,
    accent: '#065f46',
    title: 'PLAN',
    subtitle: 'Personalizado',
    description: 'IA genera tu rutina según nivel, objetivos y equipamiento.',
  },
  {
    Icon: TimerIcon,
    color: GREEN,
    accent: '#065f46',
    title: 'TRACK',
    subtitle: 'En vivo',
    description: 'Registra sets, reps y peso. Tu RM se calcula solo.',
  },
  {
    Icon: ChartUpIcon,
    color: GREEN,
    title: 'STATS',
    subtitle: 'Progreso',
    description: 'Gráficos de fuerza, peso corporal y volumen semanal.',
  },
  {
    Icon: AppleIcon,
    color: GREEN,
    accent: '#14532d',
    title: 'FOOD',
    subtitle: 'Nutrición',
    description: 'Macros calculados según tu objetivo y actividad.',
  },
  {
    Icon: GemIcon,
    color: GREEN,
    accent: '#14532d',
    title: 'RPG',
    subtitle: 'Sistema',
    description: 'Stats de FUE, RES, VEL y FLX que suben con tu esfuerzo.',
  },
  {
    Icon: BookIcon,
    color: GREEN,
    accent: '#14532d',
    title: 'FORM',
    subtitle: 'Técnica',
    description: 'GIFs y guías paso a paso para cada ejercicio.',
  },
];

export const Carousel = (): React.JSX.Element => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-[#0a0a0f]/40 backdrop-blur-sm scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-[#e4e4e7] leading-relaxed">
            ELIGE TU <span className="text-green-500">HABILIDAD</span>
          </h2>
          <p className="mt-4 text-[#71717a] text-sm sm:text-base font-mono max-w-md mx-auto">
            Herramientas para principiantes y avanzados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {FEATURES.map((f) => {
            const Icon = f.Icon;
            return (
              <div
                key={f.title}
                className="group bg-[#12121a] border-2 border-[#1e1e2e] hover:border-green-500/50 p-5 sm:p-6 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />

                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-sm border-2 border-[#1e1e2e] bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <Icon color={f.color} accent={f.accent} className="h-8 w-8" />
                </div>
                <div className="font-['Press_Start_2P'] text-[10px] sm:text-xs text-green-500 mb-1">
                  {f.title}
                </div>
                <div className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#e4e4e7] mb-3 group-hover:text-green-400 transition-colors">
                  {f.subtitle}
                </div>
                <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed font-mono">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
