import type React from 'react';
import { useState } from 'react';

type Goal = 'lose' | 'maintain' | 'gain';

type Props = {
  onSubmit: (data: { weight: number; goal: Goal }) => void;
  onCancel: () => void;
};

export const DietRecalculateForm = ({
  onSubmit,
  onCancel,
}: Props): React.JSX.Element => {
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedWeight = Number(weight);

    if (!weight) {
      setError('El peso es obligatorio');
      return;
    }

    if (Number.isNaN(parsedWeight)) {
      setError('Introduce un número válido');
      return;
    }

    if (parsedWeight < 30 || parsedWeight > 300) {
      setError('Introduce un peso realista (30 - 300 kg)');
      return;
    }

    onSubmit({
      weight: parsedWeight,
      goal,
    });

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
        placeholder="Peso (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={goal}
        onChange={(e) => setGoal(e.target.value as Goal)}
        className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="lose">Perder grasa</option>
        <option value="maintain">Mantener</option>
        <option value="gain">Ganar músculo</option>
      </select>

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
