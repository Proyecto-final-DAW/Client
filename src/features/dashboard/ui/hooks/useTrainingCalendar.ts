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
  todayDayOfMonth: number,
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
          future: dayNumber > todayDayOfMonth,
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

export const useTrainingCalendar = (trainingDays: string[]) => {
  // Tick once a minute so `today` becomes the new local-day after a
  // midnight rollover. Without this, leaving the dashboard open across
  // 00:00 keeps highlighting yesterday's cell as today (and any
  // workout logged in the new day wouldn't be visible as today's
  // cell because the memo's cache key didn't change).
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    const today = new Date();
    const trainingSet = new Set(trainingDays);

    const grid = buildMonthGrid(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      trainingSet
    );

    return {
      grid,
      weekdayLabels: WEEKDAY_LABELS,
      monthName: MONTH_NAMES_ES[today.getMonth()],
      year: today.getFullYear(),
    };
    // `tick` is a deliberate dep — bumping it once a minute is exactly
    // how we invalidate the memo across midnight without polling
    // `Date.now()` inside the calc.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingDays, tick]);
};
