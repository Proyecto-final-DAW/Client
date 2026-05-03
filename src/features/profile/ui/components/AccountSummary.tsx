import {
  CalendarDaysIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';

interface AccountSummaryProps {
  createdAt: string;
  totalSessions: number;
  bestStreak: number;
  streak: number;
}

interface SummaryItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  value: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const AccountSummary = (
  props: AccountSummaryProps
): React.JSX.Element => {
  const items: SummaryItem[] = [
    {
      label: 'REGISTRO',
      icon: CalendarDaysIcon,
      value: formatDate(props.createdAt),
    },
    {
      label: 'SESIONES',
      icon: StarIcon,
      value: String(props.totalSessions),
    },
    {
      label: 'RACHA ACTUAL',
      icon: FireIcon,
      value: `${props.streak} dias`,
    },
    {
      label: 'MEJOR RACHA',
      icon: TrophyIcon,
      value: `${props.bestStreak} dias`,
    },
  ];

  return (
    <section className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5">
      <PixelCorners size="md" className="border-green-500/40" />
      <p className="mb-4 font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
        ◆ RESUMEN
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 border-2 border-[#1e1e2e] bg-[#0a0a0f] p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-green-500/30 bg-green-500/10">
                <Icon className="h-5 w-5 text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#71717a]">
                  {item.label}
                </p>
                <p className="mt-1 font-['Press_Start_2P'] text-base text-[#e4e4e7] truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
