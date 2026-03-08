import type { ComponentType, SVGProps } from 'react';

export interface StatPilar {
  name: string;
  value: number;
  max: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  colorVar: string;
}
