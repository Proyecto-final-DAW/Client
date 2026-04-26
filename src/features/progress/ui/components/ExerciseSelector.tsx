import type { PerformedExercise } from '../../core/domain/models/PerformedExercise';

type Props = {
  exercises: PerformedExercise[];
  selectedId: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export const ExerciseSelector = (props: Props): React.JSX.Element => {
  return (
    <div>
      <label
        htmlFor="exercise-selector"
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        Ejercicio
      </label>
      <select
        id="exercise-selector"
        value={props.selectedId ?? ''}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 outline-none transition-colors focus:border-emerald-500 disabled:opacity-50"
      >
        <option value="" disabled>
          Selecciona un ejercicio
        </option>
        {props.exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </select>
    </div>
  );
};
