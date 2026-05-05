import {
  ArrowLeftIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { LoadingPixel } from '../../../shared/components/LoadingPixel';
import { PixelCorners } from '../../../shared/components/PixelCorners';
import { formatRoutineName } from '../../routines/ui/formatRoutineName';
import { CompletedSetsList } from './components/CompletedSetsList';
import { ExerciseHeader } from './components/ExerciseHeader';
import { RestTimer } from './components/RestTimer';
import { SetLogger } from './components/SetLogger';
import { WorkoutBackground } from './components/WorkoutBackground';
import { WorkoutSummary } from './components/WorkoutSummary';
import { useFinishWorkout } from './hooks/useFinishWorkout';
import { useWorkoutRoutine } from './hooks/useWorkoutRoutine';
import { REST_PRESETS_SECONDS, useWorkoutState } from './hooks/useWorkoutState';

const ErrorScreen = (props: {
  message: string;
  onBack: () => void;
}): React.JSX.Element => (
  <section className="text-ink">
    <div className="mx-auto max-w-2xl text-center py-16">
      <p className="font-pixel text-[10px] tracking-widest text-red-400">
        ✕ {props.message}
      </p>
      <button
        type="button"
        onClick={props.onBack}
        className="mt-6 font-pixel text-[9px] tracking-widest border-2 border-border bg-card text-ink-muted px-4 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors"
      >
        VOLVER A SESIONES
      </button>
    </div>
  </section>
);

/**
 * Top header — mirrors the global DashboardLayout header (h-24, logo on the
 * left, sticky, same bg / border) so navigating into a workout doesn't feel
 * like landing in a different app. The workout-specific controls (cancel,
 * exit) live to the right.
 */
const WorkoutHeader = ({
  onCancelClick,
  onExitClick,
}: {
  onCancelClick: () => void;
  onExitClick: () => void;
}): React.JSX.Element => (
  <header className="sticky top-0 z-30 h-16 lg:h-24 flex items-center justify-between gap-2 border-b-2 border-border bg-page/95 backdrop-blur-md px-3 sm:px-6 lg:px-8">
    <Link to="/dashboard" className="flex items-center gap-3">
      <img
        src="/images/Logo.webp"
        alt="GymQuest"
        className="h-16 w-auto -my-2 lg:h-28 lg:-my-6 drop-shadow-lg object-contain"
      />
    </Link>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={onExitClick}
        aria-label="Volver al inicio"
        className="inline-flex items-center gap-2 font-pixel text-[9px] tracking-widest border-2 border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400 px-3 py-2 transition-colors"
      >
        <HomeIcon className="h-3 w-3" />
        <span className="hidden sm:inline">INICIO</span>
      </button>
      <button
        type="button"
        onClick={onCancelClick}
        aria-label="Cancelar entreno"
        className="inline-flex items-center gap-2 font-pixel text-[9px] tracking-widest border-2 border-red-500/40 bg-card text-red-400 hover:bg-red-500/10 px-3 py-2 transition-colors"
      >
        <XMarkIcon className="h-3 w-3" />
        <span className="hidden sm:inline">CANCELAR</span>
      </button>
    </div>
  </header>
);

type ExitIntent = 'cancel' | 'home' | null;

const HomeExitDialog = ({
  open,
  onKeep,
  onDiscard,
  onCancel,
}: {
  open: boolean;
  onKeep: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}): React.JSX.Element | null => {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-exit-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="relative w-full max-w-md border-2 border-green-500/60 bg-card p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35)]">
        <PixelCorners size="md" className="border-green-500/60" />

        <h3
          id="home-exit-title"
          className="font-pixel text-[11px] tracking-widest text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.55)]"
        >
          ◆ SALIR AL INICIO
        </h3>
        <p className="mt-3 font-pixel text-base leading-tight text-ink-muted">
          ¿Quieres mantener el progreso de esta sesion para retomarla luego o
          descartarlo?
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="font-pixel text-[9px] tracking-widest border-2 border-border-muted bg-card text-ink-muted px-4 py-3 hover:border-[#3f3f46] transition-colors"
          >
            VOLVER
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="font-pixel text-[9px] tracking-widest border-2 border-red-500/40 bg-card text-red-400 px-4 py-3 hover:bg-red-500/10 transition-colors"
          >
            DESCARTAR
          </button>
          <button
            type="button"
            onClick={onKeep}
            className="font-pixel text-[9px] tracking-widest bg-green-500 text-[#0a0a0f] px-4 py-3 border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)]"
          >
            ▶ MANTENER
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const [exitIntent, setExitIntent] = useState<ExitIntent>(null);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-ink">
        <WorkoutBackground />
        <div className="relative z-10">
          <LoadingPixel label="CARGANDO SESION" />
        </div>
      </div>
    );
  }

  if (routineError || !routine) {
    return (
      <div className="relative min-h-screen text-ink">
        <WorkoutBackground />
        <div className="relative z-10 p-6">
          <ErrorScreen
            message={routineError ?? 'No se pudo cargar la sesion'}
            onBack={() => navigate('/routines')}
          />
        </div>
      </div>
    );
  }

  if (workout.status === 'finished' || workout.status === 'finishing') {
    const handleSave = async () => {
      const ok = await finish(routine.id, workout.buildPayloadExercises());
      if (ok) workout.markFinished();
    };

    return (
      <div className="relative min-h-screen text-ink">
        <WorkoutBackground />
        <div className="relative z-10 p-6">
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
        </div>
      </div>
    );
  }

  if (!workout.currentExercise) {
    return (
      <div className="relative min-h-screen text-ink">
        <WorkoutBackground />
        <div className="relative z-10 p-6">
          <ErrorScreen
            message="Esta sesion no tiene ejercicios"
            onBack={() => navigate('/routines')}
          />
        </div>
      </div>
    );
  }

  // INICIO opens a small dialog asking whether to keep or discard the
  // in-progress session. CANCELAR is the explicit discard intent — only that
  // path goes straight to cancelWorkout (which clears storage).
  const handleKeepAndExit = () => {
    setExitIntent(null);
    navigate('/dashboard');
  };

  const handleDiscardAndExit = () => {
    workout.cancelWorkout();
    setExitIntent(null);
    navigate('/dashboard');
  };

  const confirmCancel = () => {
    workout.cancelWorkout();
    navigate('/routines');
    setExitIntent(null);
  };

  const previousSet =
    workout.currentExerciseSets[workout.currentExerciseSets.length - 1] ?? null;

  const canFinish = workout.totalSets > 0;
  const isLast = workout.isLastExercise;

  const totalExercises = routine.exercises.length;
  const progressPercent =
    totalExercises === 0
      ? 0
      : Math.round((workout.currentExerciseIndex / totalExercises) * 100);

  return (
    <div className="relative min-h-screen text-ink">
      <WorkoutBackground />

      <WorkoutHeader
        onCancelClick={() => setExitIntent('cancel')}
        onExitClick={() => setExitIntent('home')}
      />

      {/* Sub-header with the per-exercise progress strip. Lives just below the
          main nav header so the user always sees how far they are. The
          background is intentionally transparent so the bg artwork can sit
          right under the main header without an opaque strip in between. */}
      <div className="sticky top-16 lg:top-24 z-20 px-4 py-3 lg:py-4">
        <div className="mx-auto max-w-xl">
          <div className="flex items-baseline justify-between mb-2 gap-3">
            <span className="font-pixel text-[10px] sm:text-[11px] tracking-widest text-ink">
              EJERCICIO {workout.currentExerciseIndex + 1} / {totalExercises}
            </span>
            <span className="font-pixel text-[11px] sm:text-xs tracking-widest text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.5)]">
              {progressPercent}%
            </span>
          </div>
          <div
            className="h-4 border border-green-500/30 bg-page overflow-hidden rounded-sm"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso del entrenamiento"
          >
            <div
              className="h-full bg-green-500 transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.6)] rounded-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <main className="relative z-10 px-4 py-4 sm:py-6">
        <div className="mx-auto max-w-xl flex flex-col gap-6">
          {/* Day label — short body part name. Template prefix and
              methodology suffix are stripped so the label stays scannable. */}
          <p className="text-center font-pixel text-[10px] sm:text-xs tracking-widest text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.5)] break-words">
            {formatRoutineName(routine).toUpperCase()}
          </p>

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

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={workout.previousExercise}
              disabled={workout.isFirstExercise}
              className="inline-flex items-center justify-center gap-2 font-pixel text-[9px] tracking-widest border-2 border-border-muted bg-card/90 text-ink-muted px-4 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors disabled:text-ink-disabled disabled:cursor-not-allowed disabled:hover:border-border-muted disabled:hover:text-ink-disabled"
            >
              <ArrowLeftIcon className="h-3 w-3" />
              ANTERIOR
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={workout.beginFinishing}
                disabled={!canFinish}
                className="font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
              >
                ▶ TERMINAR SESION
              </button>
            ) : (
              <button
                type="button"
                onClick={workout.nextExercise}
                className="font-pixel text-[9px] tracking-widest border-2 border-green-500/40 bg-card text-green-400 px-4 py-3 hover:border-green-500 hover:bg-green-500/10 transition-colors"
              >
                SIGUIENTE ▶
              </button>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={exitIntent === 'cancel'}
        title="Cancelar sesion"
        description="Se descartara el progreso de esta sesion. Esta accion no se puede deshacer."
        confirmLabel="CANCELAR SESION"
        cancelLabel="VOLVER"
        variant="danger"
        onConfirm={confirmCancel}
        onCancel={() => setExitIntent(null)}
      />

      <HomeExitDialog
        open={exitIntent === 'home'}
        onKeep={handleKeepAndExit}
        onDiscard={handleDiscardAndExit}
        onCancel={() => setExitIntent(null)}
      />
    </div>
  );
};
