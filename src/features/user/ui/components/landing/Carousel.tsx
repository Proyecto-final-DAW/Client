import {
  AcademicCapIcon,
  BeakerIcon,
  ChartBarIcon,
  ClockIcon,
  MapIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid';
import type { ComponentType, SVGProps } from 'react';

type HeroIconCmp = ComponentType<SVGProps<SVGSVGElement>>;

type Feature = {
  Icon: HeroIconCmp;
  title: string;
  subtitle: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    Icon: MapIcon,
    title: 'PLAN',
    subtitle: 'Personalizado',
    description: 'IA genera tu rutina según nivel, objetivos y equipamiento.',
  },
  {
    Icon: ClockIcon,
    title: 'TRACK',
    subtitle: 'En vivo',
    description: 'Registra sets, reps y peso. Tu RM se calcula solo.',
  },
  {
    Icon: ChartBarIcon,
    title: 'STATS',
    subtitle: 'Progreso',
    description: 'Gráficos de fuerza, peso corporal y volumen semanal.',
  },
  {
    Icon: BeakerIcon,
    title: 'FOOD',
    subtitle: 'Nutrición',
    description: 'Macros calculados según tu objetivo y actividad.',
  },
  {
    Icon: TrophyIcon,
    title: 'RPG',
    subtitle: 'Sistema',
    description: 'Stats de FUE, RES, VEL y FLX que suben con tu esfuerzo.',
  },
  {
    Icon: AcademicCapIcon,
    title: 'FORM',
    subtitle: 'Técnica',
    description: 'GIFs y guías paso a paso para cada ejercicio.',
  },
];

export const Carousel = (): React.JSX.Element => {
  return (
    <section id="features" className="py-16 sm:py-24 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-[#e4e4e7] leading-relaxed [text-shadow:2px_2px_0_#000,0_0_10px_rgba(0,0,0,0.8)]">
            ELIGE TU{' '}
            <span className="text-green-500 [text-shadow:2px_2px_0_#000,0_0_12px_rgba(34,197,94,0.5)]">
              HABILIDAD
            </span>
          </h2>
          <p className="mt-4 text-[#71717a] text-[9px] sm:text-[11px] font-['Press_Start_2P'] tracking-wide leading-loose max-w-md mx-auto">
            Herramientas para principiantes y avanzados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {FEATURES.map((f) => {
            const Icon = f.Icon;
            return (
              <div
                key={f.title}
                className="group bg-[#12121a]/85 backdrop-blur-md border-2 border-[#1e1e2e] hover:border-green-500/50 p-5 sm:p-6 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />

                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-sm border-2 border-[#1e1e2e] bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <Icon className="h-7 w-7 text-green-400" />
                </div>
                <div className="font-['Press_Start_2P'] text-[10px] sm:text-xs text-green-500 mb-1">
                  {f.title}
                </div>
                <div className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#e4e4e7] mb-3 group-hover:text-green-400 transition-colors">
                  {f.subtitle}
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#71717a] leading-loose font-['Press_Start_2P'] tracking-wide">
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
