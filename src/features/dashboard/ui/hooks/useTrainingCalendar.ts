import { toISODate } from '@shared/utils/date';
import { useEffect, useMemo, useState } from 'react';

export interface CalendarCell {
  day: number | null;
  trained: boolean;
  future: boolean;
}

export const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

const getMondayIndex = (date: Date): number => (date.getDay() + 6) % 7;

const buildMonthGrid = (
  year: number,
  month: number,
  todayDayOfMonth: number | null,
  trained: Set<string>
): CalendarCell[][] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = getMondayIndex(new Date(year, month, 1));
  const weeks = Math.ceil((firstDayIndex + daysInMonth) / 7);

  const grid: CalendarCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const row: CalendarCell[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      const dayNumber = idx - firstDayIndex + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        row.push({ day: null, trained: false, future: false });
      } else {
        const iso = toISODate(new Date(year, month, dayNumber));
        row.push({
          day: dayNumber,
          trained: trained.has(iso),
          // `future` is only meaningful in the current month — past
          // months can't have future cells, future months are all
          // future. The viewing-vs-current check happens in the caller
          // by passing `todayDayOfMonth=null` when not viewing today's
          // month; that collapses the "future" branch to false.
          future: todayDayOfMonth !== null && dayNumber > todayDayOfMonth,
        });
      }
    }
    grid.push(row);
  }
  return grid;
};

const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

/**
 * Builds the calendar grid for the month identified by `(year,
 * monthIndex)`. When that month happens to contain the current local
 * day, cells beyond today are marked `future` so the renderer can dim
 * them. Past or future *whole months* don't get any "future" cell at
 * all — every day either was trained or was missed.
 *
 * Re-runs once a minute so the live "today" cell rolls over across
 * midnight without leaving yesterday painted as today.
 */
export const useTrainingCalendar = (
  trainingDays: string[],
  year: number,
  monthIndex: number
) => {
  // Tick once a minute so the "today" cell rolls over correctly across
  // a midnight, but only when the tab is actually visible. A hidden
  // tab can't see the calendar anyway, and React still re-runs the
  // memo + downstream effects on each tick — wasted work that adds up
  // overnight on long-lived tabs.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const start = (): void => {
      if (interval !== null) return;
      interval = setInterval(() => setTick((t) => t + 1), 60_000);
    };
    const stop = (): void => {
      if (interval === null) return;
      clearInterval(interval);
      interval = null;
    };
    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        // Force one immediate tick so the "today" cell is correct when
        // the user comes back from a tab that was hidden across midnight.
        setTick((t) => t + 1);
        start();
      } else {
        stop();
      }
    };
    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return useMemo(() => {
    const today = new Date();
    const viewingCurrentMonth =
      today.getFullYear() === year && today.getMonth() === monthIndex;
    const todayDayOfMonth = viewingCurrentMonth ? today.getDate() : null;

    const trainingSet = new Set(trainingDays);
    const grid = buildMonthGrid(year, monthIndex, todayDayOfMonth, trainingSet);

    return {
      grid,
      weekdayLabels: WEEKDAY_LABELS,
      monthName: MONTH_NAMES_ES[monthIndex],
      year,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingDays, year, monthIndex, tick]);
};
