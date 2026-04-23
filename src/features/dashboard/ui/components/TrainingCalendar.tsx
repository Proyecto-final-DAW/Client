type Props = {
  trainingDays: string[];
};

type Cell = {
  day: number | null;
  trained: boolean;
  future: boolean;
};

const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMondayIndex = (date: Date): number => (date.getDay() + 6) % 7;

const buildMonthGrid = (
  year: number,
  month: number,
  today: number,
  trained: Set<string>
): Cell[][] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = getMondayIndex(new Date(year, month, 1));
  const weeks = Math.ceil((firstDayIndex + daysInMonth) / 7);

  const cells: Cell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      const dayNumber = idx - firstDayIndex + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        col.push({ day: null, trained: false, future: false });
      } else {
        const iso = toISODate(new Date(year, month, dayNumber));
        col.push({
          day: dayNumber,
          trained: trained.has(iso),
          future: dayNumber > today,
        });
      }
    }
    cells.push(col);
  }
  return cells;
};

const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const TrainingCalendar = (props: Props): React.JSX.Element => {
  const today = new Date();
  const trainingSet = new Set(props.trainingDays);
  const grid = buildMonthGrid(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    trainingSet
  );

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Este mes
      </p>
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-1">
          {WEEKDAY_LABELS.map((label) => (
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
              const bg = cell.trained
                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                : cell.future
                  ? 'bg-zinc-800/60'
                  : 'bg-zinc-700';
              const title = `Día ${cell.day}${cell.trained ? ' — Entrenado' : ''}`;
              return (
                <div
                  key={di}
                  title={title}
                  className={`h-3 w-3 rounded-sm ${bg}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
