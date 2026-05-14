import { useEffect, useState } from 'react';

import type { WorkoutSet } from '../../core/domain/models/WorkoutSet';

const WEIGHT_STEP = 2.5;
const REPS_STEP = 1;
const DURATION_STEP_SECONDS = 5;
const MAX_WEIGHT = 999;
const MAX_REPS = 999;
const MAX_DURATION_SECONDS = 3600;
const DEFAULT_DURATION_SECONDS = 30;

/**
 * Input layout the logger should render. Derived from the catalog's
 * `category` + `equipment` upstream so a stretch shows a duration
 * input, a push-up shows only reps, and a barbell row shows the full
 * weight + reps pair. `mode` carries that decision instead of the
 * caller passing two separate booleans.
 */
export type SetLoggerMode = 'weighted' | 'bodyweight' | 'duration';

type Props = {
  exerciseId: string;
  previousSet: WorkoutSet | null;
  mode: SetLoggerMode;
  onComplete: (set: WorkoutSet) => void;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const SetLogger = (props: Props): React.JSX.Element => {
  const { exerciseId, previousSet, mode, onComplete } = props;

  const [weight, setWeight] = useState<number>(previousSet?.weight ?? 0);
  const [reps, setReps] = useState<number>(previousSet?.reps ?? 8);
  const [durationSeconds, setDurationSeconds] = useState<number>(
    previousSet?.durationSeconds ?? DEFAULT_DURATION_SECONDS
  );
  // Bodyweight exercises can be loaded (weighted pull-ups, dipped
  // belt, etc.). The user opts in via the `+ AÑADIR LASTRE` toggle
  // below the main steppers; switches to true automatically when the
  // previous set already carried weight so the user doesn't have to
  // re-enable it on every set of the same exercise.
  const [loaded, setLoaded] = useState<boolean>(
    mode === 'bodyweight' && (previousSet?.weight ?? 0) > 0
  );

  // Reset inputs whenever the active exercise (or its prior set) changes.
  // Tracking each field individually so a custom previousSet is honored
  // exactly, instead of the React object-identity reset trap.
  useEffect(() => {
    setWeight(previousSet?.weight ?? 0);
    setReps(previousSet?.reps ?? 8);
    setDurationSeconds(
      previousSet?.durationSeconds ?? DEFAULT_DURATION_SECONDS
    );
    setLoaded(mode === 'bodyweight' && (previousSet?.weight ?? 0) > 0);
  }, [
    exerciseId,
    mode,
    previousSet?.weight,
    previousSet?.reps,
    previousSet?.durationSeconds,
  ]);

  const adjustWeight = (delta: number) =>
    setWeight((current) => clamp(current + delta, 0, MAX_WEIGHT));

  const adjustReps = (delta: number) =>
    setReps((current) => clamp(current + delta, 0, MAX_REPS));

  const adjustDuration = (delta: number) =>
    setDurationSeconds((current) =>
      clamp(current + delta, 0, MAX_DURATION_SECONDS)
    );

  const canComplete = mode === 'duration' ? durationSeconds > 0 : reps > 0;

  const handleSubmit = () => {
    if (!canComplete) return;
    if (mode === 'duration') {
      // Stretch sets log reps=0 because the duration is the unit of
      // work; the server's set validator allows reps=0 when a
      // duration is present.
      onComplete({ reps: 0, weight: 0, durationSeconds });
      return;
    }
    // Weighted: always the stepper value. Bodyweight: 0 unless the
    // user opted into lastre via the toggle, in which case we ship
    // the kg they entered.
    const submittedWeight = mode === 'weighted' ? weight : loaded ? weight : 0;
    onComplete({
      reps,
      weight: submittedWeight,
      durationSeconds: null,
    });
  };

  const renderStepper = (
    label: string,
    inputId: string,
    value: number,
    setValue: (next: number) => void,
    adjust: (delta: number) => void,
    step: number,
    max: number,
    inputMode: 'decimal' | 'numeric'
  ): React.JSX.Element => (
    <div className="flex flex-col items-center gap-3">
      <label
        htmlFor={inputId}
        className="font-pixel text-[9px] tracking-widest text-ink-muted"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => adjust(-step)}
          aria-label={`Reducir ${label.toLowerCase()}`}
          className="font-pixel text-sm w-12 h-14 border-2 border-border bg-[#18181b] text-ink-muted hover:border-green-500/40 hover:text-green-400 transition-colors"
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          inputMode={inputMode}
          step={step}
          min={0}
          max={max}
          value={value}
          onChange={(event) => {
            // Empty input must NOT immediately become 0 — that
            // collapses "user is mid-typing" with "user wants zero",
            // and a fast-tapping user could submit a 0kg/0rep set
            // because the field just snapped to 0 between keystrokes.
            // Treat empty as "leave at 0 in state but don't clamp"
            // so the user can keep typing; the SET COMPLETADO button
            // is already gated on reps>0 / duration>0.
            const raw = event.target.value;
            if (raw === '') {
              setValue(0);
              return;
            }
            const parsed = Number(raw);
            if (!Number.isFinite(parsed)) return;
            // For reps, snap any decimal input to an integer — server
            // rejects `1.5` reps with a cryptic Zod message; rounding
            // here surfaces the nearest valid value before the request.
            const snapped =
              inputMode === 'numeric' ? Math.round(parsed) : parsed;
            setValue(clamp(snapped, 0, max));
          }}
          className="font-pixel text-lg w-24 h-14 text-center bg-[#18181b] border-2 border-border text-green-400 outline-none focus:border-green-500/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => adjust(step)}
          aria-label={`Aumentar ${label.toLowerCase()}`}
          className="font-pixel text-sm w-12 h-14 border-2 border-border bg-[#18181b] text-ink-muted hover:border-green-500/40 hover:text-green-400 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );

  // Stack the two steppers vertically on phone (375px) — the
  // previous `grid-cols-2 gap-4` packed two ~200px-wide steppers
  // into a 327px content area (after card `p-6`), forcing them to
  // overlap or compress. From sm (640px+) there's room for the
  // side-by-side layout that lets the user see PESO + REPS at
  // once.
  // Bodyweight + loaded shares the weighted layout so the lastre
  // stepper sits beside REPS instead of orphaned below.
  const showsTwoSteppers =
    mode === 'weighted' || (mode === 'bodyweight' && loaded);
  const layoutClass = showsTwoSteppers
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
    : 'flex justify-center';

  return (
    <div className="flex flex-col gap-5 border-2 border-border bg-card p-4 sm:p-6">
      <div className={layoutClass}>
        {mode === 'weighted' &&
          renderStepper(
            'PESO (KG)',
            'set-weight',
            weight,
            setWeight,
            adjustWeight,
            WEIGHT_STEP,
            MAX_WEIGHT,
            'decimal'
          )}

        {mode === 'bodyweight' &&
          loaded &&
          renderStepper(
            'LASTRE (KG)',
            'set-lastre',
            weight,
            setWeight,
            adjustWeight,
            WEIGHT_STEP,
            MAX_WEIGHT,
            'decimal'
          )}

        {mode === 'duration'
          ? renderStepper(
              'DURACION (S)',
              'set-duration',
              durationSeconds,
              setDurationSeconds,
              adjustDuration,
              DURATION_STEP_SECONDS,
              MAX_DURATION_SECONDS,
              'numeric'
            )
          : renderStepper(
              'REPS',
              'set-reps',
              reps,
              setReps,
              adjustReps,
              REPS_STEP,
              MAX_REPS,
              'numeric'
            )}
      </div>

      {/* Lastre toggle — only for bodyweight exercises. Adding load
          to a pull-up / dip is the most common reason users have to
          stop a routine and reach for a different catalog entry, so
          offering an inline opt-in keeps them in the same flow. */}
      {mode === 'bodyweight' && (
        <button
          type="button"
          onClick={() => {
            setLoaded((v) => !v);
            // Drop the kg back to 0 when the user disables lastre so
            // re-enabling it doesn't replay an old value.
            if (loaded) setWeight(0);
          }}
          aria-pressed={loaded}
          className={`mx-auto font-pixel text-[9px] tracking-widest border-2 px-4 py-2.5 transition-colors ${
            loaded
              ? 'border-green-500/60 bg-green-500/10 text-green-400'
              : 'border-border-muted bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
          }`}
        >
          {loaded ? '− QUITAR LASTRE' : '+ AÑADIR LASTRE'}
        </button>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canComplete}
        className="font-pixel text-[11px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] py-5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        ▶ SET COMPLETADO
      </button>
    </div>
  );
};
