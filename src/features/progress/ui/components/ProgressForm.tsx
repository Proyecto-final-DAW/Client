import type React from 'react';
import { useState } from 'react';

import type { Progress } from '../../core/domain/models/Progress';

type ProgressFormProps = {
  onAddEntry: (entry: Progress) => void;
  onCancel: () => void;
};

export const ProgressForm = ({
  onAddEntry,
  onCancel,
}: ProgressFormProps): React.JSX.Element => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const minDate = '2000-01-01';
  const maxDate = today.toISOString().split('T')[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericWeight = Number(weight);
    const selectedDate = new Date(date);

    if (!weight || !date) {
      setError('El peso y la fecha son obligatorios');
      return;
    }

    if (
      Number.isNaN(numericWeight) ||
      numericWeight <= 0 ||
      numericWeight > 300
    ) {
      setError('Introduce un peso realista entre 1 y 300 kg');
      return;
    }

    if (Number.isNaN(selectedDate.getTime())) {
      setError('Introduce una fecha válida');
      return;
    }

    if (date < minDate || date > maxDate) {
      setError('La fecha debe estar entre el año 2000 y hoy');
      return;
    }

    onAddEntry({
      weight,
      date: selectedDate,
    });

    setWeight('');
    setDate('');
    setError(null);
    onCancel();
  };

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
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Guardar
      </button>

      {error && <p className="text-sm text-red-400 sm:col-span-3">{error}</p>}
    </form>
  );
};
