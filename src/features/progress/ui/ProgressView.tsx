import type React from 'react';
import { useEffect, useState } from 'react';

import { AsyncState } from '../../../shared/components/AsyncState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingPixel } from '../../../shared/components/LoadingPixel';
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
    <section className="mx-auto max-w-5xl text-[#e4e4e7]">
      <header className="mb-6">
        <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
          ▶ PROGRESO
        </p>
        <h1 className="mt-2 font-['Press_Start_2P'] text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
          SEGUIMIENTO
        </h1>
        <p className="mt-2 font-['Press_Start_2P'] text-base sm:text-lg text-[#a1a1aa]">
          Visualiza como evolucionan tu peso y tus maximos por ejercicio.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <WeightProgressContent />

        <section className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5">
          <p className="mb-4 font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
            ◆ PROGRESION POR EJERCICIO
          </p>

          <AsyncState
            loading={loadingExercises}
            error={exercisesError}
            data={exercises}
            empty={(e) => e.length === 0}
            loadingLabel="CARGANDO EJERCICIOS"
            emptyTitle="Sin sesiones"
            emptyDescription="Aun no has registrado sesiones. Cuando entrenes podras ver tu progresion aqui."
          >
            {(exercises) => (
              <>
                <div className="mb-5">
                  <ExerciseSelector
                    exercises={exercises}
                    selectedId={selectedId}
                    onChange={setSelectedId}
                  />
                </div>

                {loadingProgress ? (
                  <LoadingPixel label="CARGANDO PROGRESION" />
                ) : progressError ? (
                  <ErrorState message={progressError} />
                ) : (
                  <ExerciseProgressChart points={points} />
                )}
              </>
            )}
          </AsyncState>
        </section>
      </div>
    </section>
  );
};
