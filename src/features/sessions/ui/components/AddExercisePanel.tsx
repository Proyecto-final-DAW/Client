import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import { ExerciseSearch } from '../../../exercises/ui/components/ExerciseSearch';

type AddExercisePanelProps = {
  onSelectExercise: (exercise: Exercise) => void;
};

export const AddExercisePanel = ({
  onSelectExercise,
}: AddExercisePanelProps) => {
  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-medium text-blue-400">Añadir ejercicio</p>
        <h2 className="mt-1 text-lg font-semibold">Buscar en el catálogo</h2>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950 px-4 py-3">
        <ExerciseSearch onSelectExercise={onSelectExercise} />
      </div>
    </section>
  );
};
