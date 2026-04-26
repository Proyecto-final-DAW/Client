import { useMemo } from 'react';

import { toISODate } from '../../../../shared/utils/date';

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

export const useTrainingCalendar = (trainingDays: string[]) => {
  return useMemo(() => {
    const today = new Date();
    const trainingSet = new Set(trainingDays);

    const grid = buildMonthGrid(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      trainingSet
    );

    return { grid, weekdayLabels: WEEKDAY_LABELS };
  }, [trainingDays]);
};
