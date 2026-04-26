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
  const { grid, weekdayLabels } = useTrainingCalendar(props.trainingDays);

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Este mes
      </p>
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-1">
          {weekdayLabels.map((label) => (
            <span
              key={label}
              className="flex h-3 w-3 items-center justify-center text-[9px] leading-none text-zinc-500"
            >
              {label}
            </span>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="flex gap-1">
            {week.map((cell, di) => {
              if (cell.day === null) {
                return <div key={di} className="h-3 w-3" />;
              }
              const title = `Día ${cell.day}${cell.trained ? ' — Entrenado' : ''}`;
              return (
                <div
                  key={di}
                  title={title}
                  className={`h-3 w-3 rounded-sm ${cellBackground(cell.trained, cell.future)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
