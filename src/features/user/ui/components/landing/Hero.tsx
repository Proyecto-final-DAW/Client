import type { ComponentType, SVGProps } from 'react';
import { Link } from 'react-router-dom';

import {
  PixelBoltIcon,
  PixelFlameIcon,
  PixelHeartIcon,
  PixelStarIcon,
  ShieldIcon,
  SwordIcon,
} from './PixelIcons';

type PixelIconCmp = ComponentType<
  SVGProps<SVGSVGElement> & { color: string; accent?: string }
>;

type Stat = {
  name: string;
  value: number;
  color: string;
  accent?: string;
  Icon: PixelIconCmp;
};

const STATS: Stat[] = [
  { name: 'Fuerza', value: 88, color: '#ef4444', accent: '#b45309', Icon: SwordIcon },
  { name: 'Resistencia', value: 78, color: '#22c55e', accent: '#065f46', Icon: ShieldIcon },
  { name: 'Estamina', value: 82, color: '#10b981', accent: '#064e3b', Icon: PixelHeartIcon },
  { name: 'Agilidad', value: 70, color: '#3b82f6', Icon: PixelBoltIcon },
  { name: 'Tenacidad', value: 60, color: '#a855f7', accent: '#c084fc', Icon: PixelFlameIcon },
  { name: 'Vigor', value: 74, color: '#eab308', Icon: PixelStarIcon },
];

function StatRow({ stat }: { stat: Stat }) {
  const Icon = stat.Icon;
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-2 border-[#1e1e2e]"
        style={{ backgroundColor: `${stat.color}1f` }}
      >
        <Icon color={stat.color} accent={stat.accent} className="h-7 w-7" />
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

type FloatingDeco = {
  Icon: PixelIconCmp;
  className: string;
  color: string;
  accent?: string;
  size: string;
  anim: string;
  delay: string;
};

const FLOATING: FloatingDeco[] = [
  {
    Icon: ShieldIcon,
    className: 'top-[16%] left-[6%]',
    color: '#22c55e',
    accent: '#065f46',
    size: 'h-14 w-14 sm:h-20 sm:w-20',
    anim: 'animate-pixel-float',
    delay: '0s',
  },
  {
    Icon: SwordIcon,
    className: 'top-[22%] right-[7%]',
    color: '#ef4444',
    accent: '#7c2d12',
    size: 'h-14 w-14 sm:h-20 sm:w-20',
    anim: 'animate-pixel-float-alt',
    delay: '0.8s',
  },
  {
    Icon: PixelFlameIcon,
    className: 'bottom-[20%] left-[8%]',
    color: '#a855f7',
    accent: '#f0abfc',
    size: 'h-12 w-12 sm:h-16 sm:w-16',
    anim: 'animate-pixel-float-alt',
    delay: '1.4s',
  },
  {
    Icon: PixelStarIcon,
    className: 'top-[10%] right-[28%]',
    color: '#eab308',
    size: 'h-7 w-7 sm:h-10 sm:w-10',
    anim: 'animate-pixel-pulse',
    delay: '0.3s',
  },
  {
    Icon: PixelStarIcon,
    className: 'bottom-[28%] right-[12%]',
    color: '#3b82f6',
    size: 'h-6 w-6 sm:h-9 sm:w-9',
    anim: 'animate-pixel-pulse',
    delay: '1.1s',
  },
  {
    Icon: PixelHeartIcon,
    className: 'bottom-[14%] right-[6%]',
    color: '#10b981',
    accent: '#ecfeff',
    size: 'h-12 w-12 sm:h-16 sm:w-16',
    anim: 'animate-pixel-float',
    delay: '1.8s',
  },
];

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
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Floating pixel decorations */}
      {FLOATING.map((f, i) => {
        const Icon = f.Icon;
        return (
          <div
            key={i}
            className={`pointer-events-none absolute hidden sm:block drop-shadow-[0_0_14px_currentColor] ${f.className} ${f.anim}`}
            style={{ animationDelay: f.delay, color: f.color }}
          >
            <Icon
              color={f.color}
              accent={f.accent}
              className={`${f.size} opacity-60`}
            />
          </div>
        );
      })}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 text-center flex flex-col items-center">
        <div
          className="inline-flex items-center gap-2 border-2 border-green-500/50 px-4 py-2 mb-6 sm:mb-8 backdrop-blur-sm"
          style={{ background: 'rgba(34,197,94,0.12)' }}
        >
          <span className="h-2 w-2 bg-green-400 animate-pixel-pulse" />
          <span className="text-green-300 text-[8px] sm:text-[10px] font-['Press_Start_2P'] tracking-wider">
            NUEVA AVENTURA · LVL 1
          </span>
        </div>

        <h1 className="relative font-['Press_Start_2P'] text-2xl sm:text-4xl md:text-6xl text-white leading-relaxed sm:leading-relaxed md:leading-[1.25] [text-shadow:4px_4px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_18px_rgba(0,0,0,1)]">
          ENTRENA COMO
          <span className="block text-green-400 mt-2 sm:mt-4 [text-shadow:4px_4px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_32px_rgba(34,197,94,0.9)]">
            UN HEROE
          </span>
        </h1>

        <p className="relative mt-6 sm:mt-8 text-sm sm:text-base text-[#e4e4e7] max-w-xl mx-auto leading-relaxed font-mono [text-shadow:0_0_2px_#000,2px_2px_0_rgba(0,0,0,0.9)]">
          El reino necesita un héroe. Forja tu cuerpo, domina tus stats y
          escribe tu leyenda en cada entrenamiento.
        </p>

        <div className="w-full max-w-md mx-auto mt-8 sm:mt-10 border-2 border-[#1e1e2e] bg-[#0d0d14]/90 backdrop-blur-sm p-4 sm:p-5 relative shadow-[0_0_40px_rgba(34,197,94,0.15)]">
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
          <Link
            to="/login?mode=register"
            className="w-full sm:w-auto font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 sm:px-8 py-3.5 sm:py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150"
          >
            ▶ NUEVA PARTIDA
          </Link>
          <a
            href="#features"
            onClick={scrollToFeatures}
            className="w-full sm:w-auto text-center font-['Press_Start_2P'] text-[10px] sm:text-xs border-2 border-[#1e1e2e] hover:border-green-500/40 text-[#71717a] hover:text-green-400 px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300"
          >
            VER MÁS ↓
          </a>
        </div>
      </div>

    </section>
  );
};
