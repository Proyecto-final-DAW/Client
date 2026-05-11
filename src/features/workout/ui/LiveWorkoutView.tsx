import {
  ArrowLeftIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { LoadingPixel } from '../../../shared/components/LoadingPixel';
import { PixelCorners } from '../../../shared/components/PixelCorners';
import { useBodyScrollLock } from '../../../shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '../../../shared/hooks/useEscapeClose';
import { hasTrainedToday } from '../../../shared/utils/date';
import type { Exercise } from '../../exercises/core/domain/models/Exercise';
import type { WorkoutSet } from '../core/domain/models/WorkoutSet';
import { formatRoutineName } from '../../routines/ui/formatRoutineName';
import { useSessionHistory } from '../../sessionHistory/ui/hooks/useSessionHistory';
import { CompletedSetsList } from './components/CompletedSetsList';
import { ExerciseHeader } from './components/ExerciseHeader';
import { PostSessionMilestonesModal } from './components/PostSessionMilestonesModal';
import { PostSessionStatsModal } from './components/PostSessionStatsModal';
import { RestTimer } from './components/RestTimer';
import { SetLogger } from './components/SetLogger';
import type { SetLoggerMode } from './components/SetLogger';
import { WorkoutBackground } from './components/WorkoutBackground';
import { WorkoutSummary } from './components/WorkoutSummary';
import { useFinishWorkout } from './hooks/useFinishWorkout';
import { useWorkoutRoutine } from './hooks/useWorkoutRoutine';
import { REST_PRESETS_SECONDS, useWorkoutState } from './hooks/useWorkoutState';

// Both categories pre-emptively swap reps for a duration input — a
// 30s plank counts as work, not "30 reps", and a moderate-pace walk is
// time-based too. Cardio entries logged via the post-workout cardio
// form take a separate path; this only matters when the cardio /
// stretch lives inside the routine itself.
const DURATION_CATEGORIES = new Set(['stretching', 'cardio']);

const normalizeEquipment = (raw: string): string =>
  raw.toLowerCase().replace(/\s+/g, '');

/**
 * Picks the logger layout from the catalog metadata that the routine
 * endpoint hydrated for us. Stretch / mobility / cardio moves don't
 * have a meaningful weight or rep count, so they swap to a duration
 * field; bodyweight moves keep reps but drop weight; everything else
 * is the classic weight + reps pair.
 *
 * Falls back to 'weighted' when the catalog had no match — keeps the
 * pre-category behaviour for any legacy routine_exercises rows whose
 * `exercise_api_id` no longer resolves in the bundled dataset.
 */
const resolveSetLoggerMode = (exercise: Exercise): SetLoggerMode => {
  if (DURATION_CATEGORIES.has(exercise.category.toLowerCase())) {
    return 'duration';
  }
  const equipment = normalizeEquipment(exercise.equipment);
  if (equipment === 'bodyweight' || equipment === 'bodyonly') {
    return 'bodyweight';
  }
  return 'weighted';
};

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

// SIGUIENTE / TERMINAR press confirm — fires only when the user is
// short of the prescribed sets. Over-set warnings now live on the
// SET COMPLETADO path instead (see `pendingExtraSet`), so the user
// catches the extra at the moment they're about to log it rather
// than three sets later when they move on.
type AdvanceWarning = { remaining: number; final: boolean } | null;

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
  useBodyScrollLock(open);
  useEscapeClose(open, onCancel);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-exit-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
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
    </div>,
    document.body
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
  const { sessions } = useSessionHistory();
  const workout = useWorkoutState(routine);
  // Direct-URL guard. The dashboard CTA and /routines button already
  // disable themselves when trainedToday is true, but a bookmark or a
  // browser-back can land the user here past those gates. Block at
  // entry instead of letting them log every set just to fail at save.
  const trainedToday = sessions ? hasTrainedToday(sessions) : false;
  const {
    finish,
    saving,
    error: saveError,
    unlockedMilestones,
    gains,
  } = useFinishWorkout();

  const [exitIntent, setExitIntent] = useState<ExitIntent>(null);
  const [advanceWarning, setAdvanceWarning] = useState<AdvanceWarning>(null);
  // Pending set whose submission was paused to ask the user about
  // exceeding the prescribed set count. Holds the raw WorkoutSet so
  // confirming just replays it through workout.completeSet.
  const [pendingExtraSet, setPendingExtraSet] = useState<WorkoutSet | null>(
    null
  );
  // Exercise ids the user has already opted-in to extra sets for. The
  // warning fires only the first time per exercise; once they say yes,
  // further extras log silently. Per-exercise so changing exercise
  // resets the prompt.
  const [extraSetsAcknowledged, setExtraSetsAcknowledged] = useState<
    Set<string>
  >(new Set());
  // Stats popup is the post-save celebration. Auto-opens on successful
  // save, dismissed via CONTINUAR — once closed we don't reopen so the
  // user can scroll the underlying summary and milestones in peace.
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  // Second-stage modal for any logros unlocked by this save. Stages
  // sequentially after the stats modal so the user can't tap past
  // either one — the previous design only surfaced new milestones in
  // a quiet block under the stats grid that users frequently missed.
  const [showMilestonesModal, setShowMilestonesModal] =
    useState<boolean>(false);
  // Local pre-save validation error — used to flag a cardio entry the
  // user enabled but never filled out (no minutes). Without this the
  // payload silently dropped the cardio entry (`durationMinutes > 0`
  // guard) and the session saved without the cardio XP — the user
  // expected an explicit error, not a silent loss.
  const [validationError, setValidationError] = useState<string | null>(null);

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
            message={routineError ?? 'No hemos podido cargar la sesion.'}
            onBack={() => navigate('/routines')}
          />
        </div>
      </div>
    );
  }

  // One-session-per-day guard, matching the server. We block only when
  // the user hasn't started typing yet (no sets logged, no resumed
  // state from localStorage) so a mid-session continuation isn't
  // kicked out — but a fresh entry with the day already logged gets
  // the friendly screen instead of logging every set just to fail at
  // save with the 409.
  const freshEntry = !workout.resumed && workout.totalSets === 0;
  if (trainedToday && freshEntry) {
    return (
      <div className="relative min-h-screen text-ink">
        <WorkoutBackground />
        <div className="relative z-10 p-6">
          <ErrorScreen
            message="Ya entrenaste hoy. Solo cuenta una sesion por dia."
            onBack={() => navigate('/dashboard')}
          />
        </div>
      </div>
    );
  }

  if (workout.status === 'finished' || workout.status === 'finishing') {
    const handleSave = async () => {
      // Cardio enabled but no minutes typed → block with an inline
      // error instead of saving a session that silently drops the
      // cardio entry (the build-payload step skips entries with
      // `durationMinutes <= 0`).
      if (
        workout.cardio !== null &&
        (!workout.cardio.durationMinutes || workout.cardio.durationMinutes <= 0)
      ) {
        setValidationError(
          'Indica los minutos de cardio o desactiva la actividad.'
        );
        return;
      }
      setValidationError(null);

      const ok = await finish(routine.id, workout.buildPayloadExercises());
      if (ok) {
        workout.markFinished();
        setShowStatsModal(true);
      }
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
            // Validation error takes precedence — it's actionable
            // ("fill the field") whereas saveError is a network /
            // server failure surfaced after the click. They're never
            // both relevant at the same time anyway: a validation
            // failure short-circuits before the request fires.
            error={validationError ?? saveError}
            unlockedMilestones={unlockedMilestones}
            cardio={workout.cardio}
            onCardioChange={(next) => {
              setValidationError(null);
              workout.setCardio(next);
            }}
            onSave={handleSave}
            onFinish={() => navigate('/dashboard')}
          />
        </div>

        {gains !== null && (
          <PostSessionStatsModal
            open={showStatsModal}
            gains={gains}
            onClose={() => {
              setShowStatsModal(false);
              // Hand off to the milestones modal in the same gesture
              // so the celebration feels continuous instead of two
              // disjoint popups. Only opens when there's something
              // to show — empty milestones means the user wasn't
              // entitled to a logros unlock this session.
              if (unlockedMilestones.length > 0) {
                setShowMilestonesModal(true);
              }
            }}
          />
        )}

        <PostSessionMilestonesModal
          open={showMilestonesModal}
          milestones={unlockedMilestones}
          onClose={() => setShowMilestonesModal(false)}
        />
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

  const mode = resolveSetLoggerMode(workout.currentExercise);
  const isCardio = workout.currentExercise.category.toLowerCase() === 'cardio';
  // Cardio sessions log as ONE duration entry — overriding the routine's
  // prescribed sets (often inherited as 3 from the template builder)
  // matches the user's mental model "treadmill no tiene sets".
  const targetSets = isCardio
    ? 1
    : (workout.currentExercise.targetSets ?? null);
  const completedSets = workout.currentExerciseSets.length;

  // SIGUIENTE / TERMINAR gate — only flags short-of-prescribed now.
  // Over-prescribed is handled at SET COMPLETADO time via
  // handleSetComplete so the user catches it before the extra set is
  // recorded, not three sets later when they move on.
  const requestAdvance = (final: boolean) => {
    if (targetSets !== null && completedSets < targetSets) {
      setAdvanceWarning({
        remaining: targetSets - completedSets,
        final,
      });
      return;
    }
    if (final) {
      workout.beginFinishing();
    } else {
      workout.nextExercise();
    }
  };

  const confirmAdvance = () => {
    const final = advanceWarning?.final ?? false;
    setAdvanceWarning(null);
    if (final) {
      workout.beginFinishing();
    } else {
      workout.nextExercise();
    }
  };

  // Intercepts SET COMPLETADO to ask the user before logging an extra
  // set. Fires once per exercise: after they confirm, subsequent
  // extras log silently (they've explicitly chosen to keep going).
  const exerciseId = workout.currentExercise.id;
  const handleSetComplete = (set: WorkoutSet) => {
    const overPrescribed =
      targetSets !== null &&
      targetSets > 0 &&
      completedSets >= targetSets &&
      !extraSetsAcknowledged.has(exerciseId);
    if (overPrescribed) {
      setPendingExtraSet(set);
      return;
    }
    workout.completeSet(set);
  };

  const confirmExtraSet = () => {
    if (pendingExtraSet) {
      workout.completeSet(pendingExtraSet);
      setExtraSetsAcknowledged((prev) => {
        const next = new Set(prev);
        next.add(exerciseId);
        return next;
      });
      setPendingExtraSet(null);
    }
  };

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
      <div className="sticky top-16 lg:top-24 z-20 border-b border-border bg-page/85 backdrop-blur-md px-4 py-3 lg:py-4">
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
            totalSets={targetSets ?? undefined}
            isCardio={isCardio}
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
              mode={mode}
              // Route through `handleSetComplete` so the "set extra"
              // warning fires before the over-prescribed set is logged.
              // Wiring this straight to `workout.completeSet` (the bug
              // we just fixed) made the user see `SET 6 / 4` with no
              // prompt — the gate existed in handleSetComplete but
              // nobody called it.
              onComplete={handleSetComplete}
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
                onClick={() => requestAdvance(true)}
                disabled={!canFinish}
                className="font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
              >
                ▶ TERMINAR SESION
              </button>
            ) : (
              <button
                type="button"
                onClick={() => requestAdvance(false)}
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

      <ConfirmDialog
        open={advanceWarning !== null}
        title={
          advanceWarning
            ? advanceWarning.remaining === 1
              ? 'Te falta un set'
              : `Te faltan ${advanceWarning.remaining} sets`
            : ''
        }
        description={
          advanceWarning
            ? advanceWarning.final
              ? 'Aun no has completado todos los sets de este ejercicio. Terminar la sesion igualmente?'
              : 'Aun no has completado todos los sets de este ejercicio. Pasar al siguiente?'
            : undefined
        }
        confirmLabel={advanceWarning?.final ? 'TERMINAR' : 'CONTINUAR'}
        cancelLabel="VOLVER"
        variant="neutral"
        onConfirm={confirmAdvance}
        onCancel={() => setAdvanceWarning(null)}
      />

      {/* Set-extra confirmation. Fires once per exercise the first
          time the user tries to log past the prescribed count, so they
          can intentionally opt in to extras instead of silently
          drifting past the routine target (the "SET 6 / 4" bug). */}
      <ConfirmDialog
        open={pendingExtraSet !== null}
        title="Ya has hecho todos los sets"
        description="Has completado los sets configurados para este ejercicio. Quieres registrar uno extra?"
        confirmLabel="REGISTRAR SET"
        cancelLabel="VOLVER"
        variant="neutral"
        onConfirm={confirmExtraSet}
        onCancel={() => setPendingExtraSet(null)}
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
