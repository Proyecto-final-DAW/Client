import { useEffect, useState } from 'react';

import type { WorkoutSet } from '../../core/domain/models/WorkoutSet';

const WEIGHT_STEP = 2.5;
const REPS_STEP = 1;
const MAX_WEIGHT = 999;
const MAX_REPS = 999;

type Props = {
  exerciseId: string;
  previousSet: WorkoutSet | null;
  onComplete: (set: WorkoutSet) => void;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const SetLogger = (props: Props): React.JSX.Element => {
  const { exerciseId, previousSet, onComplete } = props;

  const [weight, setWeight] = useState<number>(previousSet?.weight ?? 0);
  const [reps, setReps] = useState<number>(previousSet?.reps ?? 8);

  // Reiniciar inputs al cambiar de ejercicio o cuando se recibe un set previo nuevo
  useEffect(() => {
    setWeight(previousSet?.weight ?? 0);
    setReps(previousSet?.reps ?? 8);
  }, [exerciseId, previousSet?.weight, previousSet?.reps]);

  const adjustWeight = (delta: number) => {
    setWeight((current) => clamp(current + delta, 0, MAX_WEIGHT));
  };

  const adjustReps = (delta: number) => {
    setReps((current) => clamp(current + delta, 0, MAX_REPS));
  };

  const canComplete = reps > 0;

  const handleSubmit = () => {
    if (!canComplete) return;
    onComplete({ reps, weight });
  };

  return (
    <div className="flex flex-col gap-6 border-2 border-[#1e1e2e] bg-[#0d0d14] p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-3">
          <label
            htmlFor="set-weight"
            className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#a1a1aa]"
          >
            PESO (KG)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustWeight(-WEIGHT_STEP)}
              aria-label="Reducir peso"
              className="font-['Press_Start_2P'] text-sm w-12 h-14 border-2 border-[#1e1e2e] bg-[#18181b] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 transition-colors"
            >
              −
            </button>
            <input
              id="set-weight"
              type="number"
              inputMode="decimal"
              step={WEIGHT_STEP}
              min={0}
              max={MAX_WEIGHT}
              value={weight}
              onChange={(event) =>
                setWeight(clamp(Number(event.target.value), 0, MAX_WEIGHT))
              }
              className="font-['Press_Start_2P'] text-lg w-24 h-14 text-center bg-[#18181b] border-2 border-[#1e1e2e] text-green-400 outline-none focus:border-green-500/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => adjustWeight(WEIGHT_STEP)}
              aria-label="Aumentar peso"
              className="font-['Press_Start_2P'] text-sm w-12 h-14 border-2 border-[#1e1e2e] bg-[#18181b] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <label
            htmlFor="set-reps"
            className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#a1a1aa]"
          >
            REPS
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustReps(-REPS_STEP)}
              aria-label="Reducir reps"
              className="font-['Press_Start_2P'] text-sm w-12 h-14 border-2 border-[#1e1e2e] bg-[#18181b] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 transition-colors"
            >
              −
            </button>
            <input
              id="set-reps"
              type="number"
              inputMode="numeric"
              step={REPS_STEP}
              min={0}
              max={MAX_REPS}
              value={reps}
              onChange={(event) =>
                setReps(clamp(Number(event.target.value), 0, MAX_REPS))
              }
              className="font-['Press_Start_2P'] text-lg w-24 h-14 text-center bg-[#18181b] border-2 border-[#1e1e2e] text-green-400 outline-none focus:border-green-500/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => adjustReps(REPS_STEP)}
              aria-label="Aumentar reps"
              className="font-['Press_Start_2P'] text-sm w-12 h-14 border-2 border-[#1e1e2e] bg-[#18181b] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canComplete}
        className="font-['Press_Start_2P'] text-[11px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] py-5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        ▶ SET COMPLETADO
      </button>
    </div>
  );
};
