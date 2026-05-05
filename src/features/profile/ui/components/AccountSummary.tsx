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
  /** Big arcade-style number/value rendered in the headline slot. */
  value: string;
  /** Small unit label below the value (e.g. "DIAS"). Optional for date items. */
  unit?: string;
  /** Per-item accent color so the four cards don't blend together. */
  accent: string;
}

function formatDate(dateStr: string): {
  day: string;
  monthYear: string;
} {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { day: '—', monthYear: '' };
  return {
    day: String(date.getDate()).padStart(2, '0'),
    monthYear: date
      .toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
      .toUpperCase()
      .replace('.', ''),
  };
}

export const AccountSummary = (
  props: AccountSummaryProps
): React.JSX.Element => {
  const registered = formatDate(props.createdAt);

  const items: SummaryItem[] = [
    {
      label: 'REGISTRO',
      icon: CalendarDaysIcon,
      value: registered.day,
      unit: registered.monthYear,
      accent: '#3b82f6',
    },
    {
      label: 'SESIONES',
      icon: StarIcon,
      value: String(props.totalSessions),
      unit: 'TOTAL',
      accent: '#22c55e',
    },
    {
      label: 'RACHA',
      icon: FireIcon,
      value: String(props.streak),
      unit: 'DIAS',
      accent: '#f97316',
    },
    {
      label: 'RECORD',
      icon: TrophyIcon,
      value: String(props.bestStreak),
      unit: 'DIAS',
      accent: '#eab308',
    },
  ];

  return (
    <section className="relative border-2 border-green-500/40 bg-card p-5">
      <PixelCorners size="md" className="border-green-500/40" />
      <p className="mb-4 font-pixel text-[10px] tracking-widest text-green-500">
        ◆ RESUMEN
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="relative flex flex-col items-center justify-center border-2 border-border bg-page p-4 text-center"
              style={{
                boxShadow: `inset 0 0 24px color-mix(in srgb, ${item.accent} 8%, transparent)`,
              }}
            >
              <Icon
                className="mb-2 h-5 w-5"
                style={{ color: item.accent }}
                aria-hidden="true"
              />
              <p
                className="font-pixel text-2xl leading-none [text-shadow:2px_2px_0_#000]"
                style={{
                  color: item.accent,
                  textShadow: `0 0 14px color-mix(in srgb, ${item.accent} 60%, transparent), 2px 2px 0 #000`,
                }}
              >
                {item.value}
              </p>
              {item.unit && (
                <p className="mt-2 font-pixel text-[7px] tracking-widest text-ink-faint">
                  {item.unit}
                </p>
              )}
              <p className="mt-2 font-pixel text-[8px] tracking-widest text-ink-muted">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
