import type React from 'react';

import type { RegisterWeightInput } from '../../core/domain/models/Progress';
import { useProgressForm } from '../hooks/useProgressForm';

type RegisterWeightFormProps = {
  submitting: boolean;
  submitError: string | null;
  onSubmit: (input: RegisterWeightInput) => Promise<boolean>;
  onSuccess: () => void;
};

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
      className="mb-5 grid gap-3 rounded-2xl border border-gray-800 bg-gray-950 p-4 sm:grid-cols-[1fr_1fr_auto]"
    >
      <input
        type="number"
        step="0.1"
        min="1"
        max="300"
        placeholder="Peso kg"
        value={weight}
        onChange={(event) => setWeight(event.target.value)}
        className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        min={minDate}
        max={maxDate}
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Guardando...' : 'Guardar'}
      </button>

      {(error || submitError) && (
        <p className="text-sm text-red-400 sm:col-span-3">
          {error ?? submitError}
        </p>
      )}
    </form>
  );
};
