import type React from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { RegisterWeightInput } from '../../core/domain/models/Progress';
import { useProgressForm } from '../hooks/useProgressForm';

type RegisterWeightFormProps = {
  submitting: boolean;
  submitError: string | null;
  onSubmit: (input: RegisterWeightInput) => Promise<boolean>;
  onSuccess: () => void;
};

const inputClass =
  "w-full bg-[#12121a] border-2 border-[#1e1e2e] px-3 py-2.5 font-['Press_Start_2P'] text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] focus:border-green-500/70 focus:outline-none transition-colors [color-scheme:dark]";

export const RegisterWeightForm = ({
  submitting,
  submitError,
  onSubmit,
  onSuccess,
}: RegisterWeightFormProps): React.JSX.Element => {
  const {
    weight,
    date,
    error,
    minDate,
    maxDate,
    setWeight,
    setDate,
    handleSubmit,
  } = useProgressForm({ onSubmit, onSuccess });

  return (
    <form
      onSubmit={handleSubmit}
      className="relative grid gap-3 border-2 border-dashed border-green-500/40 bg-[#0a0a0f] p-4 sm:grid-cols-[1fr_1fr_auto]"
    >
      <PixelCorners size="sm" className="border-green-500/40" />

      <input
        type="number"
        step="0.1"
        min="1"
        max="300"
        placeholder="PESO KG"
        value={weight}
        onChange={(event) => setWeight(event.target.value)}
        className={inputClass}
      />

      <input
        type="date"
        min={minDate}
        max={maxDate}
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className={inputClass}
      />

      <button
        type="submit"
        disabled={submitting}
        className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        {submitting ? 'GUARDANDO…' : '▶ GUARDAR'}
      </button>

      {(error || submitError) && (
        <p className="font-['Press_Start_2P'] text-base text-red-300 sm:col-span-3">
          ✕ {error ?? submitError}
        </p>
      )}
    </form>
  );
};
