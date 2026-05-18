import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

import { useMonthTrainingDays } from '../hooks/useMonthTrainingDays';
import { useTrainingCalendar } from '../hooks/useTrainingCalendar';

type TrainingCalendarProps = {
  /**
   * Training days for the CURRENT ISO week, pre-loaded by the parent
   * via `/users/cards`. Used as an instant overlay on the current
   * month so the user doesn't see a flash of grey while
   * `useMonthTrainingDays` is fetching the full month. The two sets
   * are merged before painting.
   */
  trainingDays: string[];
  /**
   * Date the account was created. The "anterior" arrow is gated so
   * the user can't scroll into months before they had the account —
   * nothing to display, just empty grids. Inclusive at the
   * creation month so the user still sees the month they onboarded
   * in. Optional because the auth context may not have hydrated
   * yet on first render.
   */
  accountCreatedAt?: Date | null;
};

const cellBackground = (trained: boolean, future: boolean): string => {
  if (trained) {
    // Orange to match the streak fire icon — the calendar reads as
    // the streak's day-by-day breakdown, so painting the trained
    // days in the same palette as the flame creates a single visual
    // unit ("this is where the racha lives").
    return 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.55)]';
  }
  if (future) {
    return 'bg-zinc-800/60';
  }
  return 'bg-zinc-700';
};

export const TrainingCalendar = (
  props: TrainingCalendarProps
): React.JSX.Element => {
  const now = new Date();
  const [viewYear, setViewYear] = useState<number>(now.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(now.getMonth());

  const { days: monthDays } = useMonthTrainingDays(viewYear, viewMonth);

  // Merge: current-week days (from cards) take effect immediately
  // even before the month fetch resolves. Once the fetch lands, the
  // month query is authoritative — same dates collapse in the Set.
  const isCurrentMonth =
    now.getFullYear() === viewYear && now.getMonth() === viewMonth;
  const merged = isCurrentMonth
    ? Array.from(new Set([...props.trainingDays, ...monthDays]))
    : monthDays;

  const { grid, weekdayLabels, monthName, year } = useTrainingCalendar(
    merged,
    viewYear,
    viewMonth
  );

  // Lower bound: the user can't navigate to months before their
  // account creation — there are no sessions to show, just empty grids.
  // Inclusive at the creation month so the very first onboarding month
  // is still visible (the user might've trained on day 1).
  //
  // Fallbacks: when the user object doesn't carry `created_at` (legacy
  // accounts, mock responses, races on initial load), we conservatively
  // clamp to TODAY's month so the prev button stays disabled — the
  // previous "no restriction when missing" branch let the user wander
  // years back into empty grids (the ENERO 2025 case the user reported).
  // Same conservative fallback when the parsed Date is invalid.
  const validAccountCreatedAt =
    props.accountCreatedAt && !Number.isNaN(props.accountCreatedAt.getTime())
      ? props.accountCreatedAt
      : now;
  const minYear = validAccountCreatedAt.getFullYear();
  const minMonth = validAccountCreatedAt.getMonth();
  // Strictly-after comparison: prev is only enabled when the current
  // view is past the creation month. At or before → disabled (covers
  // both "you're standing on the creation month" and "you somehow
  // ended up further back" defensively).
  const canGoPrev =
    viewYear > minYear || (viewYear === minYear && viewMonth > minMonth);

  const goPrev = (): void => {
    if (!canGoPrev) return;
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };
  const goNext = (): void => {
    // Prevent navigating beyond the current month — there can be no
    // training data in the future and an empty future grid looks like
    // a bug. Caller can tap prev to scroll back instead.
    if (isCurrentMonth) return;
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };
  const canGoNext = !isCurrentMonth;

  return (
    <div className="mt-5 flex flex-col items-center">
      {/* Header row: prev arrow + month label (with year if not current) +
          next arrow. Stays compact so it fits the card's narrow column.
          The year only shows for past months so the current month header
          stays uncluttered ("MAYO" instead of "MAYO 2026"). */}
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Mes anterior"
          disabled={!canGoPrev}
          className={`flex h-5 w-5 items-center justify-center transition-colors ${
            canGoPrev
              ? 'text-green-500/70 hover:text-green-400'
              : 'text-zinc-700 cursor-not-allowed'
          }`}
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        </button>
        {/* Always show the year — mixing "MAYO" for the current month
            with "ABRIL 2026" for past months was inconsistent and
            forced the user to mentally translate between formats while
            navigating. Either both carry the year or neither; carrying
            it everywhere is the safer choice (zero ambiguity at
            year-boundaries like dec → ene). */}
        <p className="min-w-[6.5rem] text-center font-pixel text-[9px] tracking-widest text-green-500 uppercase">
          {monthName} {year}
        </p>
        <button
          type="button"
          onClick={goNext}
          aria-label="Mes siguiente"
          disabled={!canGoNext}
          className={`flex h-5 w-5 items-center justify-center transition-colors ${
            canGoNext
              ? 'text-green-500/70 hover:text-green-400'
              : 'text-zinc-700 cursor-not-allowed'
          }`}
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex gap-2 sm:gap-2.5">
          {weekdayLabels.map((label) => (
            <span
              key={label}
              className="flex h-4 w-4 sm:h-[18px] sm:w-[18px] lg:h-5 lg:w-5 items-center justify-center font-pixel text-[8px] leading-none text-zinc-500"
            >
              {label}
            </span>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="flex gap-2 sm:gap-2.5">
            {week.map((cell, di) => {
              if (cell.day === null) {
                return (
                  <div
                    key={di}
                    className="h-4 w-4 sm:h-[18px] sm:w-[18px] lg:h-5 lg:w-5"
                  />
                );
              }
              const title = `Dia ${cell.day}${cell.trained ? ' — Entrenado' : ''}`;
              return (
                <div
                  key={di}
                  title={title}
                  className={`h-4 w-4 sm:h-[18px] sm:w-[18px] lg:h-5 lg:w-5 rounded-sm ${cellBackground(cell.trained, cell.future)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
