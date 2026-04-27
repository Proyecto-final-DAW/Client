import { useNavigate, useParams } from 'react-router-dom';

import { LoadingPixel } from '../../../shared/components/LoadingPixel';
import { CompletedSetsList } from './components/CompletedSetsList';
import { ExerciseHeader } from './components/ExerciseHeader';
import { RestTimer } from './components/RestTimer';
import { SetLogger } from './components/SetLogger';
import { WorkoutProgressBar } from './components/WorkoutProgressBar';
import { WorkoutSummary } from './components/WorkoutSummary';
import { useFinishWorkout } from './hooks/useFinishWorkout';
import { useWorkoutRoutine } from './hooks/useWorkoutRoutine';
import { REST_PRESETS_SECONDS, useWorkoutState } from './hooks/useWorkoutState';

const ErrorScreen = (props: {
  message: string;
  onBack: () => void;
}): React.JSX.Element => (
  <section className="text-[#e4e4e7]">
    <div className="mx-auto max-w-2xl text-center py-16">
      <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-red-400">
        ✕ {props.message}
      </p>
      <button
        type="button"
        onClick={props.onBack}
        className="mt-6 font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] px-4 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors"
      >
        VOLVER A RUTINAS
      </button>
    </div>
  </section>
);

export const LiveWorkoutView = (): React.JSX.Element => {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();

  const {
    routine,
    loading,
    error: routineError,
  } = useWorkoutRoutine(routineId);
  const workout = useWorkoutState(routine);
  const {
    finish,
    saving,
    error: saveError,
    unlockedMilestones,
  } = useFinishWorkout();

  if (loading) {
    return <LoadingPixel label="CARGANDO RUTINA" />;
  }

  if (routineError || !routine) {
    return (
      <ErrorScreen
        message={routineError ?? 'No se pudo cargar la rutina'}
        onBack={() => navigate('/routines')}
      />
    );
  }

  if (workout.status === 'finished' || workout.status === 'finishing') {
    const handleSave = async () => {
      const ok = await finish(routine.id, workout.buildPayloadExercises());
      if (ok) workout.markFinished();
    };

    return (
      <WorkoutSummary
        totalVolume={workout.totalVolume}
        totalSets={workout.totalSets}
        exercisesCount={workout.exercisesWithSetsCount}
        saved={workout.status === 'finished'}
        saving={saving}
        error={saveError}
        unlockedMilestones={unlockedMilestones}
        onSave={handleSave}
        onFinish={() => navigate('/dashboard')}
      />
    );
  }

  if (!workout.currentExercise) {
    return (
      <ErrorScreen
        message="Esta rutina no tiene ejercicios"
        onBack={() => navigate('/routines')}
      />
    );
  }

  const handleCancel = () => {
    const shouldCancel = window.confirm(
      '¿Cancelar el entrenamiento? Se perderá el progreso de esta sesión.'
    );
    if (shouldCancel) {
      workout.cancelWorkout();
      navigate('/routines');
    }
  };

  const previousSet =
    workout.currentExerciseSets[workout.currentExerciseSets.length - 1] ?? null;

  const canFinish = workout.totalSets > 0;
  const isLast = workout.isLastExercise;

  return (
    <section className="text-[#e4e4e7]">
      <div className="mx-auto max-w-2xl flex flex-col gap-5">
        <WorkoutProgressBar
          currentExerciseIndex={workout.currentExerciseIndex}
          totalExercises={routine.exercises.length}
          onCancel={handleCancel}
        />

        <ExerciseHeader
          exercise={workout.currentExercise}
          setNumber={workout.currentExerciseSets.length + 1}
        />

        {workout.isResting ? (
          <RestTimer
            remainingSeconds={workout.restRemainingSeconds}
            totalSeconds={workout.restDurationSeconds}
            presets={REST_PRESETS_SECONDS}
            selectedPreset={workout.restDurationSeconds}
            onSelectPreset={workout.setRestPreset}
            onSkip={workout.skipRest}
          />
        ) : (
          <SetLogger
            exerciseId={workout.currentExercise.id}
            previousSet={previousSet}
            onComplete={workout.completeSet}
          />
        )}

        <CompletedSetsList
          sets={workout.currentExerciseSets}
          onUndoLast={
            workout.currentExerciseSets.length > 0
              ? workout.removeLastSet
              : undefined
          }
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            type="button"
            onClick={workout.previousExercise}
            disabled={workout.isFirstExercise}
            className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] px-4 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ◀ ANTERIOR
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={workout.beginFinishing}
              disabled={!canFinish}
              className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
            >
              ▶ TERMINAR ENTRENO
            </button>
          ) : (
            <button
              type="button"
              onClick={workout.nextExercise}
              className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-green-500/40 bg-[#0d0d14] text-green-400 px-4 py-3 hover:border-green-500 hover:bg-green-500/10 transition-colors"
            >
              SIGUIENTE ▶
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
