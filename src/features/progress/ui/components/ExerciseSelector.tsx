import { PixelSelect } from '@shared/components/PixelSelect';

import type { PerformedExercise } from '../../core/domain/models/PerformedExercise';

type Props = {
  exercises: PerformedExercise[];
  selectedId: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
};

/**
 * RPG-styled exercise selector. Uses the shared `PixelSelect` so the
 * dropdown popup matches the rest of the app — the previous native
 * `<select>` was rendering the option list with the browser default
 * white-bg/blue-highlight that broke the dark pixel theme on demo.
 */
export const ExerciseSelector = (props: Props): React.JSX.Element => {
  const options = props.exercises.map((exercise) => ({
    value: exercise.id,
    label: exercise.name,
  }));

  return (
    <div>
      <p className="mb-2 font-pixel text-[9px] tracking-widest text-green-500">
        ◆ EJERCICIO
      </p>
      <PixelSelect
        value={props.selectedId ?? ''}
        options={options}
        placeholder="Selecciona un ejercicio"
        onChange={props.onChange}
        ariaLabel="Seleccionar ejercicio para ver progresion"
      />
    </div>
  );
};
