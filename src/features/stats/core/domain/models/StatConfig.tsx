import {
  BoltIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import type { ComponentType, SVGProps } from 'react';

type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

const SwordIcon: IconCmp = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2 L14 5 L10 5 Z" />
    <rect x="10" y="5" width="4" height="9" />
    <rect x="6" y="14" width="12" height="2" />
    <rect x="11" y="16" width="2" height="4" />
    <rect x="10" y="20" width="4" height="2" />
  </svg>
);

type StatConfigEntry = {
  /** Display name in Spanish (shown in the UI). */
  name: string;
  /** Filled, pixel-flavored icon — same set used in the landing's HeroStatsPanel. */
  icon: IconCmp;
  /**
   * Accent color applied only to the icon (identity per stat).
   * Bars are unified to green for visual calm — see StatBar.
   */
  accentColor: string;
};

export const STAT_CONFIG: Record<string, StatConfigEntry> = {
  strength: {
    name: 'Fuerza',
    icon: SwordIcon,
    accentColor: '#f97316',
  },
  resistance: {
    name: 'Resistencia',
    icon: ShieldCheckIcon,
    accentColor: '#22c55e',
  },
  stamina: {
    name: 'Estamina',
    icon: StarIcon,
    accentColor: '#ec4899',
  },
  agility: {
    name: 'Agilidad',
    icon: BoltIcon,
    accentColor: '#3b82f6',
  },
  tenacity: {
    name: 'Tenacidad',
    icon: SparklesIcon,
    accentColor: '#a855f7',
  },
  vigor: {
    name: 'Vigor',
    icon: HeartIcon,
    accentColor: '#eab308',
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
