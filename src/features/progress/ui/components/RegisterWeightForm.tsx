import { PixelCorners } from '@shared/components/PixelCorners';
import { PixelDatePicker } from '@shared/components/PixelDatePicker';
import type React from 'react';

import type { RegisterWeightInput } from '../../core/domain/models/Progress';
import { useProgressForm } from '../hooks/useProgressForm';

type RegisterWeightFormProps = {
  submitting: boolean;
  submitError: string | null;
  onSubmit: (input: RegisterWeightInput) => Promise<boolean>;
  onSuccess: () => void;
};

// font-pixel-mono text-base on the typed value: Press Start 2P at
// 10px is illegible while typing weights, and any input below 16px
// triggers iOS Safari auto-zoom on focus.
const inputClass =
  'w-full bg-subtle border-2 border-border px-3 py-3 font-pixel-mono text-base text-ink placeholder:text-ink-disabled focus:border-green-500/70 focus:outline-none transition-colors [color-scheme:dark]';

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
      className="relative grid gap-3 border-2 border-dashed border-green-500/40 bg-page p-4 sm:grid-cols-[1fr_1fr_auto]"
    >
      <PixelCorners size="sm" className="border-green-500/40" />

      {/* `step="1"` so the up/down spinner buttons change by 1 kg per
          click — `step="0.1"` (the previous default) made every tap
          shift the value by 100 g, which is too granular for body
          weight tracking and forced the user through 10 clicks to
          move a single kilo. Keyboard input still accepts decimals
          (e.g. 75.5) for anyone who needs fine-grained resolution. */}
      <input
        type="number"
        inputMode="decimal"
        step="1"
        min="1"
        max="300"
        placeholder="PESO KG"
        value={weight}
        onChange={(event) => setWeight(event.target.value)}
        className={inputClass}
      />

      {/* PixelDatePicker matches the rest of the app's date inputs
          (onboarding birth date, modals) — the native `type="date"`
          here was a jarring browser-default calendar that broke the
          retro theme. Same `value` / `onChange(string)` contract, so
          the form hook didn't have to change. */}
      <PixelDatePicker
        id="register-weight-date"
        value={date}
        onChange={(value) => setDate(value)}
        min={minDate}
        max={maxDate}
        error={Boolean(error)}
      />

      <button
        type="submit"
        disabled={submitting}
        className="font-pixel text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        {submitting ? 'GUARDANDO…' : '▶ GUARDAR'}
      </button>

      {(error || submitError) && (
        <p className="font-pixel-mono text-base text-red-400 mt-2 tracking-wide leading-snug sm:col-span-3">
          ✕ {error ?? submitError}
        </p>
      )}
    </form>
  );
};
