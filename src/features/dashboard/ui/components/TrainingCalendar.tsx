import { useTrainingCalendar } from '../hooks/useTrainingCalendar';

type TrainingCalendarProps = {
  trainingDays: string[];
};

const cellBackground = (trained: boolean, future: boolean): string => {
  if (trained) {
    return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]';
  }
  if (future) {
    return 'bg-zinc-800/60';
  }
  return 'bg-zinc-700';
};

export const TrainingCalendar = (
  props: TrainingCalendarProps
): React.JSX.Element => {
  const { grid, weekdayLabels, monthName } = useTrainingCalendar(
    props.trainingDays
  );

  return (
    <div className="mt-5 flex flex-col items-center">
      <p className="mb-3 font-pixel text-[9px] tracking-widest text-green-500 uppercase">
        {monthName}
      </p>
      {/* Different gap sizes per axis: horizontal `gap-2` widens the
          calendar so it spans more of the card, vertical `gap-1.5`
          gives the week rows breathing room (was `gap-0.5`, which
          glued the weeks together visually). Cells scale from
          16→18→20px with the breakpoint so the calendar fills the
          card on tablets/desktops instead of sitting as a tiny
          island in the centre of a wide column. */}
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
