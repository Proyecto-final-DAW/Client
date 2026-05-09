import {
  BoltIcon,
  CalendarDaysIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

import { PixelCorners } from '@shared/components/PixelCorners';

interface AccountSummaryProps {
  createdAt: string;
  totalSessions: number;
  bestStreak: number;
}

interface SummaryItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  value: string;
  unit?: string;
  /** Per-item accent color so the three cards don't blend together. */
  accent: string;
}

/**
 * Days the account has been alive — anchors the user inside their own
 * journey. "12 dias en la aventura" reads better than the literal
 * registration date for a recent user, where the date is just "today"
 * and the card feels empty. Returns at least 1 so day-zero shows
 * "1 dia" rather than "0".
 */
const daysSinceRegistration = (dateStr: string): number => {
  const created = new Date(dateStr);
  if (Number.isNaN(created.getTime())) return 0;
  const ms = Date.now() - created.getTime();
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)));
};

export const AccountSummary = (
  props: AccountSummaryProps
): React.JSX.Element => {
  const days = daysSinceRegistration(props.createdAt);

  const items: SummaryItem[] = [
    {
      label: 'EN LA AVENTURA',
      icon: CalendarDaysIcon,
      value: String(days),
      unit: days === 1 ? 'DIA' : 'DIAS',
      accent: '#3b82f6',
    },
    {
      label: 'COMBATES',
      icon: BoltIcon,
      value: String(props.totalSessions),
      unit: 'TOTAL',
      accent: '#22c55e',
    },
    {
      label: 'MEJOR RACHA',
      icon: TrophyIcon,
      value: String(props.bestStreak),
      // No unit — the new routine-target streak measures "weeks where
      // you hit your target", which doesn't fit a clean noun. The
      // count alone reads cleanly under the MEJOR RACHA label.
      unit: undefined,
      accent: '#eab308',
    },
  ];

  return (
    <section className="relative border-2 border-green-500/40 bg-card p-5">
      <PixelCorners size="md" className="border-green-500/40" />
      <p className="mb-4 font-pixel text-[10px] tracking-widest text-green-500">
        ◆ RESUMEN
      </p>
      {/* Tighter padding + smaller value font on the smallest viewport
          so 3-digit numbers ("365 DIAS") don't clip the cell border at
          ~95px column widths. Restores breathing room from sm onwards. */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="relative flex flex-col items-center justify-center border-2 border-border bg-page p-2.5 sm:p-4 text-center"
              style={{
                boxShadow: `inset 0 0 24px color-mix(in srgb, ${item.accent} 8%, transparent)`,
              }}
            >
              <Icon
                className="mb-1.5 sm:mb-2 h-4 w-4 sm:h-5 sm:w-5"
                style={{ color: item.accent }}
                aria-hidden="true"
              />
              <p
                className="font-pixel text-lg sm:text-2xl leading-none"
                style={{
                  color: item.accent,
                  textShadow: `0 0 14px color-mix(in srgb, ${item.accent} 60%, transparent), 2px 2px 0 #000`,
                }}
              >
                {item.value}
              </p>
              {item.unit && (
                <p className="mt-1.5 sm:mt-2 font-pixel text-[7px] tracking-widest text-ink-faint">
                  {item.unit}
                </p>
              )}
              <p className="mt-1.5 sm:mt-2 font-pixel text-[8px] tracking-widest text-ink-muted">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
