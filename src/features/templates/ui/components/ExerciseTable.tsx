import type { TemplateExercise } from '../../core/domain/models/TemplateExercise';

type Props = {
  exercises: TemplateExercise[];
};

const formatRest = (seconds: number): string => {
  if (seconds === 0) return '—';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder === 0 ? `${minutes}min` : `${minutes}m ${remainder}s`;
};

export const ExerciseTable = (props: Props): React.JSX.Element => {
  return (
    <>
      {/* Mobile: stacked cards. The 4-column table never fit a phone —
          "SETS × REPS" + "DESCANSO" pushed the last column off-screen
          behind a hairline scrollbar, so the rest time looked deleted.
          A per-exercise card lays the same fields out vertically with
          zero horizontal overflow. */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {props.exercises.map((exercise, index) => (
          <li
            key={`${exercise.name}-${index}`}
            className="border-2 border-border bg-card p-3"
          >
            <div className="flex items-baseline gap-2">
              <span className="shrink-0 font-pixel text-[10px] text-green-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="font-pixel text-[10px] leading-relaxed text-ink">
                {exercise.name}
              </p>
            </div>
            <dl className="mt-2.5 grid grid-cols-2 border-t-2 border-border-muted pt-2.5">
              <div className="text-center">
                <dt className="font-pixel text-[7px] tracking-widest text-ink-faint">
                  SETS × REPS
                </dt>
                <dd className="mt-1 font-pixel text-[10px] text-green-400">
                  {exercise.sets} × {exercise.reps}
                </dd>
              </div>
              <div className="border-l-2 border-border-muted text-center">
                <dt className="font-pixel text-[7px] tracking-widest text-ink-faint">
                  DESCANSO
                </dt>
                <dd className="mt-1 font-pixel text-[10px] text-ink-muted">
                  {formatRest(exercise.restSeconds)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* sm+ : the real table. At ≥640px every column fits without
          clipping, and GRUPO comes back into view. */}
      <div className="hidden border-2 border-border bg-card sm:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-border bg-[#18181b]">
              <th className="font-pixel text-[8px] tracking-widest text-ink-muted px-3 py-3 w-10">
                #
              </th>
              <th className="font-pixel text-[8px] tracking-widest text-ink-muted px-3 py-3">
                EJERCICIO
              </th>
              <th className="font-pixel text-[8px] tracking-widest text-ink-muted px-3 py-3">
                GRUPO
              </th>
              <th className="font-pixel text-[8px] tracking-widest text-ink-muted px-3 py-3 text-center">
                SETS × REPS
              </th>
              <th className="font-pixel text-[8px] tracking-widest text-ink-muted px-3 py-3 text-center">
                DESCANSO
              </th>
            </tr>
          </thead>
          <tbody>
            {props.exercises.map((exercise, index) => (
              <tr
                key={`${exercise.name}-${index}`}
                className="border-b border-border last:border-b-0"
              >
                <td className="font-pixel text-[10px] text-ink-faint px-3 py-2.5">
                  {index + 1}
                </td>
                <td className="font-pixel text-[10px] leading-relaxed text-ink px-3 py-2.5">
                  {exercise.name}
                </td>
                <td className="font-pixel text-[9px] text-ink-muted px-3 py-2.5">
                  {exercise.muscleGroup}
                </td>
                <td className="font-pixel text-[10px] text-green-400 px-3 py-2.5 text-center whitespace-nowrap">
                  {exercise.sets} × {exercise.reps}
                </td>
                <td className="font-pixel text-[9px] text-ink-muted px-3 py-2.5 text-center whitespace-nowrap">
                  {formatRest(exercise.restSeconds)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
