import { useEffect, useState } from 'react';

import { ExerciseProgressChart } from './components/ExerciseProgressChart';
import { ExerciseSelector } from './components/ExerciseSelector';
import { useExerciseProgress } from './hooks/useExerciseProgress';
import { usePerformedExercises } from './hooks/usePerformedExercises';

export const ProgressView = (): React.JSX.Element => {
  const {
    exercises,
    loading: loadingExercises,
    error: exercisesError,
  } = usePerformedExercises();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    points,
    loading: loadingProgress,
    error: progressError,
  } = useExerciseProgress(selectedId);

  useEffect(() => {
    if (!selectedId && exercises.length > 0) {
      setSelectedId(exercises[0].id);
    }
  }, [exercises, selectedId]);

  if (loadingExercises) {
    return <p className="text-zinc-400">Cargando ejercicios...</p>;
  }

  if (exercisesError) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        {exercisesError}
      </p>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-zinc-400">
          Aún no has registrado sesiones. Cuando entrenes podrás ver tu
          progresión aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold text-zinc-100">
        Progresión por ejercicio
      </h2>

      <div className="mb-6">
        <ExerciseSelector
          exercises={exercises}
          selectedId={selectedId}
          onChange={setSelectedId}
        />
      </div>

      {progressError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {progressError}
        </p>
      ) : loadingProgress ? (
        <p className="text-zinc-400">Cargando progresión...</p>
      ) : (
        <ExerciseProgressChart points={points} />
      )}
    </div>
  );
};
