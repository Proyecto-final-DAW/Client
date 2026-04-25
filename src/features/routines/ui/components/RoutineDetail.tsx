import { ExerciseSearch } from '../../../exercises/ui/components/ExerciseSearch';
import type { Routine } from '../../core/domain/models/Routine';
import { ExerciseRow } from './ExerciseRow';

type RoutineDetailProps = {
  routine: Routine | null;
  onAddExercise: (exerciseId: string) => void | Promise<void>;
  onRemoveExercise: (exerciseId: string) => void | Promise<void>;
};

export const RoutineDetail = ({
  routine,
  onAddExercise,
  onRemoveExercise,
}: RoutineDetailProps) => {
  const routineId = routine?.id;
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-blue-400">
            Rutina seleccionada
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {routine?.name ?? 'Sin rutina seleccionada'}
          </h2>
        </div>

        <div className="space-y-3">
          {routine?.exercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              onRemove={onRemoveExercise}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-blue-400">
              Buscar ejercicios
            </p>
            <h2 className="mt-1 text-lg font-semibold">Añadir ejercicio</h2>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-700 bg-gray-950 px-4 py-3">
          <ExerciseSearch
            onSelectExercise={(exercise) => {
              if (!routineId) return;
              void onAddExercise(exercise.id);
            }}
          />
        </div>
      </section>
    </main>
  );
};
