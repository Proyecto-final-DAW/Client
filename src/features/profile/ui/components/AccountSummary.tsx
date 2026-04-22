import {
  CalendarDaysIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

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
  if (isNaN(date.getTime())) return '-';
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
      label: 'Fecha de registro',
      icon: CalendarDaysIcon,
      value: formatDate(props.createdAt),
    },
    {
      label: 'Sesiones totales',
      icon: StarIcon,
      value: String(props.totalSessions),
    },
    { label: 'Racha actual', icon: FireIcon, value: `${props.streak} dias` },
    {
      label: 'Racha maxima',
      icon: TrophyIcon,
      value: `${props.bestStreak} dias`,
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-400">
        Resumen de cuenta
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl bg-zinc-800/50 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Icon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">{item.label}</p>
                <p className="text-sm font-semibold text-zinc-100">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
