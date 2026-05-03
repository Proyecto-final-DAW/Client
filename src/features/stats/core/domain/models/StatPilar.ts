import type { ComponentType, SVGProps } from 'react';

export interface StatPilar {
  name: string;
  /** Current XP within the level (0 → max). */
  value: number;
  /** XP needed to reach the next level. */
  max: number;
  /** Lifetime level (1 → 99). */
  level: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  colorVar: string;
}
