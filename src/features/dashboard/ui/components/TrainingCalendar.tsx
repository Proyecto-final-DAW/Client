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
      <p className="mb-3 font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500 uppercase">
        {monthName}
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1.5">
          {weekdayLabels.map((label) => (
            <span
              key={label}
              className="flex h-5 w-5 items-center justify-center font-['Press_Start_2P'] text-[8px] leading-none text-zinc-500"
            >
              {label}
            </span>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="flex gap-1.5">
            {week.map((cell, di) => {
              if (cell.day === null) {
                return <div key={di} className="h-5 w-5" />;
              }
              const title = `Dia ${cell.day}${cell.trained ? ' — Entrenado' : ''}`;
              return (
                <div
                  key={di}
                  title={title}
                  className={`h-5 w-5 rounded-sm ${cellBackground(cell.trained, cell.future)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
