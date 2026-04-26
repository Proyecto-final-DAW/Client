import type React from 'react';
import { useEffect, useState } from 'react';

import { ExerciseProgressChart } from './components/ExerciseProgressChart';
import { ExerciseSelector } from './components/ExerciseSelector';
import { WeightProgressContent } from './components/WeightProgressContent';
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

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <header>
          <p className="text-sm text-blue-400">Progreso</p>
          <h1 className="text-3xl font-bold text-white">Seguimiento de peso</h1>
          <p className="text-sm text-gray-400">
            Visualiza cómo evoluciona tu peso a lo largo del tiempo.
          </p>
        </header>

        <WeightProgressContent />

        <section>
          <h2 className="mb-6 text-2xl font-bold text-white">
            Progresión por ejercicio
          </h2>

          {loadingExercises ? (
            <p className="text-gray-400">Cargando ejercicios...</p>
          ) : exercisesError ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {exercisesError}
            </p>
          ) : exercises.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <p className="text-gray-400">
                Aún no has registrado sesiones. Cuando entrenes podrás ver tu
                progresión aquí.
              </p>
            </div>
          ) : (
            <>
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
                <p className="text-gray-400">Cargando progresión...</p>
              ) : (
                <ExerciseProgressChart points={points} />
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
};
