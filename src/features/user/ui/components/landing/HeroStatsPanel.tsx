import {
  BoltIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';

import { PixelCorners } from '../../../../../shared/components/PixelCorners';

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

const StatRow = ({ stat }: { stat: Stat }) => {
  const Icon = stat.Icon;
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-2 border-border"
        style={{ backgroundColor: `${stat.color}1f` }}
      >
        <Icon className="h-6 w-6" style={{ color: stat.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-pixel text-[9px] sm:text-[10px] text-ink">
            {stat.name}
          </span>
          <span
            className="font-pixel text-[9px] sm:text-[10px]"
            style={{ color: stat.color }}
          >
            {stat.value}
            <span className="text-ink-disabled">/100</span>
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-sm bg-[#1e1e2e]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stat.value}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
            style={{
              backgroundColor: stat.color,
              boxShadow: `0 0 8px ${stat.color}66`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const HeroStatsPanel = (): React.JSX.Element => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 sm:mt-10 border-2 border-green-500/60 bg-card p-4 sm:p-5 relative shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.45),0_20px_50px_rgba(0,0,0,0.8)]">
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="text-[9px] sm:text-[10px] font-pixel text-green-500 mb-4 text-left tracking-wider">
        STATS
      </div>
      <div className="space-y-3">
        {STATS.map((stat) => (
          <StatRow key={stat.name} stat={stat} />
        ))}
      </div>
    </div>
  );
};
