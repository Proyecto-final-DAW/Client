import {
  AcademicCapIcon,
  BeakerIcon,
  ChartBarIcon,
  ClockIcon,
  MapIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid';
import type { ComponentType, SVGProps } from 'react';

import { FeatureCard } from './FeatureCard';

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
    description: 'IA genera tu rutina segun nivel, objetivos y equipamiento.',
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
    description: 'Graficos de fuerza, peso corporal y volumen semanal.',
  },
  {
    Icon: BeakerIcon,
    title: 'FOOD',
    subtitle: 'Nutricion',
    description: 'Macros calculados segun tu objetivo y actividad.',
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
    subtitle: 'Tecnica',
    description: 'GIFs y guias paso a paso para cada ejercicio.',
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
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};
