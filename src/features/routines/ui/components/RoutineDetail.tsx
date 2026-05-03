import { useNavigate } from 'react-router-dom';

import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import { ExerciseSearch } from '../../../exercises/ui/components/ExerciseSearch';
import type { Routine } from '../../core/domain/models/Routine';
import { ExerciseRow } from './ExerciseRow';

type RoutineDetailProps = {
  routine: Routine | null;
  onAddExercise: (exercise: Exercise) => void | Promise<void>;
  onRemoveExercise: (exerciseId: string) => void | Promise<void>;
};

export const RoutineDetail = ({
  routine,
  onAddExercise,
  onRemoveExercise,
}: RoutineDetailProps) => {
  const navigate = useNavigate();
  const routineId = routine?.id;
  const hasExercises = (routine?.exercises.length ?? 0) > 0;

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-blue-400">
              Rutina seleccionada
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {routine?.name ?? 'Sin rutina seleccionada'}
            </h2>
          </div>
          {routine && hasExercises && (
            <button
              type="button"
              onClick={() => navigate(`/workout/${routine.id}`)}
              className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] whitespace-nowrap"
            >
              ▶ EMPEZAR RUTINA
            </button>
          )}
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
              void onAddExercise(exercise);
            }}
          />
        </div>
      </section>
    </main>
  );
};
