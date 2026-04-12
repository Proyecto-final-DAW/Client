import {
  BoltIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import type { ComponentType, SVGProps } from 'react';

type HeroIconCmp = ComponentType<SVGProps<SVGSVGElement>>;

const SwordIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2 L14 5 L10 5 Z" />
    <rect x="10" y="5" width="4" height="9" />
    <rect x="6" y="14" width="12" height="2" />
    <rect x="11" y="16" width="2" height="4" />
    <rect x="10" y="20" width="4" height="2" />
  </svg>
);

type Stat = {
  name: string;
  value: number;
  color: string;
  Icon: HeroIconCmp;
};

const STATS: Stat[] = [
  { name: 'Fuerza', value: 88, color: '#f97316', Icon: SwordIcon },
  { name: 'Resistencia', value: 78, color: '#22c55e', Icon: ShieldCheckIcon },
  { name: 'Estamina', value: 82, color: '#ec4899', Icon: StarIcon },
  { name: 'Agilidad', value: 70, color: '#3b82f6', Icon: BoltIcon },
  { name: 'Tenacidad', value: 60, color: '#a855f7', Icon: SparklesIcon },
  { name: 'Vigor', value: 74, color: '#eab308', Icon: HeartIcon },
];

function StatRow({ stat }: { stat: Stat }) {
  const Icon = stat.Icon;
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-2 border-[#1e1e2e]"
        style={{ backgroundColor: `${stat.color}1f` }}
      >
        <Icon className="h-6 w-6" style={{ color: stat.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#e4e4e7]">
            {stat.name}
          </span>
          <span
            className="font-['Press_Start_2P'] text-[9px] sm:text-[10px]"
            style={{ color: stat.color }}
          >
            {stat.value}
            <span className="text-[#52525b]">/100</span>
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-sm bg-[#1e1e2e]">
          <div
            className="h-full transition-[width] duration-700 ease-out"
            style={{
              width: `${stat.value}%`,
              backgroundColor: stat.color,
              boxShadow: `0 0 8px ${stat.color}66`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const STARS = [
  { top: '6%', left: '12%', delay: '0s' },
  { top: '14%', left: '82%', delay: '0.4s' },
  { top: '22%', left: '38%', delay: '1.1s' },
  { top: '30%', left: '62%', delay: '0.7s' },
  { top: '42%', left: '18%', delay: '1.6s' },
  { top: '48%', left: '88%', delay: '0.2s' },
  { top: '56%', left: '30%', delay: '1.3s' },
  { top: '62%', left: '72%', delay: '0.5s' },
  { top: '70%', left: '10%', delay: '1.8s' },
  { top: '76%', left: '48%', delay: '0.9s' },
  { top: '82%', left: '84%', delay: '1.4s' },
  { top: '88%', left: '22%', delay: '0.3s' },
  { top: '36%', left: '8%', delay: '2.0s' },
  { top: '20%', left: '96%', delay: '0.6s' },
  { top: '68%', left: '94%', delay: '1.7s' },
];

export const Hero = (): React.JSX.Element => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Twinkling pixel stars — subtle, don't create visual boundaries */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] bg-white animate-twinkle pointer-events-none"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-36 sm:pt-44 md:pt-48 pb-10 text-center flex flex-col items-center">
        <h1 className="relative font-['Press_Start_2P'] text-2xl sm:text-4xl md:text-6xl text-white leading-relaxed sm:leading-relaxed md:leading-[1.25] [text-shadow:5px_5px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,0_0_30px_rgba(0,0,0,1),0_0_60px_rgba(0,0,0,0.9)]">
          ENTRENA COMO
          <span className="block text-green-400 mt-2 sm:mt-4 [text-shadow:5px_5px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,0_0_40px_rgba(34,197,94,1),0_0_70px_rgba(34,197,94,0.6)]">
            UN HEROE
          </span>
        </h1>

        <p className="relative mt-6 sm:mt-8 text-[9px] sm:text-[11px] text-[#e4e4e7] max-w-xl mx-auto leading-loose font-['Press_Start_2P'] tracking-wide [text-shadow:0_0_4px_#000,2px_2px_0_rgba(0,0,0,1),0_0_20px_rgba(0,0,0,0.9)]">
          Rutinas a tu medida, progreso real y hábitos que te llevan al
          siguiente LVL cada semana.
        </p>

        <div className="w-full max-w-md mx-auto mt-8 sm:mt-10 border-2 border-green-500/60 bg-[#0d0d14] p-4 sm:p-5 relative shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.45),0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500/60" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500/60" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />

          <div className="text-[9px] sm:text-[10px] font-['Press_Start_2P'] text-green-500 mb-4 text-left tracking-wider">
            ─ STATS ─
          </div>
          <div className="space-y-3">
            {STATS.map((stat) => (
              <StatRow key={stat.name} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
