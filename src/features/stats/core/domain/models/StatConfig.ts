import {
  ArrowPathRoundedSquareIcon,
  BoltIcon,
  FireIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

type StatConfigEntry = {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  colorVar: string;
};

export const STAT_CONFIG: Record<string, StatConfigEntry> = {
  strength: {
    name: 'Strength',
    icon: BoltIcon,
    colorVar: '--stat-strength',
  },
  resistance: {
    name: 'Resistance',
    icon: ShieldCheckIcon,
    colorVar: '--stat-resistance',
  },
  stamina: {
    name: 'Stamina',
    icon: HeartIcon,
    colorVar: '--stat-stamina',
  },
  agility: {
    name: 'Agility',
    icon: ArrowPathRoundedSquareIcon,
    colorVar: '--stat-agility',
  },
  tenacity: {
    name: 'Tenacity',
    icon: FireIcon,
    colorVar: '--stat-tenacity',
  },
  vigor: {
    name: 'Vigor',
    icon: SparklesIcon,
    colorVar: '--stat-vigor',
  },
};

export const STAT_ORDER = [
  'strength',
  'resistance',
  'stamina',
  'agility',
  'tenacity',
  'vigor',
] as const;
