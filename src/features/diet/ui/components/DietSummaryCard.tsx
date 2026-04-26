import type React from 'react';
import { useState } from 'react';

import type { Diet } from '../../core/domain/models/Diet';
import { useDiet } from '../hooks/useDiet';
import { DietRecalculateForm } from './DietRecalculateForm';

type MacroItem = {
  label: string;
  grams: string;
  percentage: number;
};

type RecalculateData = {
  weight: number;
  goal: 'lose' | 'maintain' | 'gain';
};

export const DietSummaryCard = (): React.JSX.Element => {
  const { diet, loading, error, refetch } = useDiet();

  const [showForm, setShowForm] = useState(false);
  const [localDiet, setLocalDiet] = useState<Diet | null>(null);

  const currentDiet = localDiet ?? diet;

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
        <p className="text-sm text-gray-400">Cargando datos de dieta...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (!currentDiet) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
        <p className="text-sm text-gray-400">
          No hay datos de dieta disponibles.
        </p>
      </section>
    );
  }

  const handleRecalculate = ({ weight, goal }: RecalculateData) => {
    const calories =
      goal === 'lose'
        ? weight * 24
        : goal === 'gain'
          ? weight * 35
          : weight * 30;

    const protein = weight * 2;
    const fat = weight * 0.8;
    const carbs = (calories - protein * 4 - fat * 9) / 4;

    setLocalDiet({
      dailyCalories: Math.round(calories).toString(),
      proteinGrams: Math.round(protein).toString(),
      fatGrams: Math.round(fat).toString(),
      carbGrams: Math.max(0, Math.round(carbs)).toString(),
    });

    setShowForm(false);
  };

  const calories = Number(currentDiet.dailyCalories);

  const proteinCalories = Number(currentDiet.proteinGrams) * 4;
  const fatCalories = Number(currentDiet.fatGrams) * 9;
  const carbCalories = Number(currentDiet.carbGrams) * 4;

  const totalCalories = proteinCalories + fatCalories + carbCalories;

  const getPercentage = (macroCalories: number): number => {
    if (totalCalories <= 0) return 0;
    return Math.round((macroCalories / totalCalories) * 100);
  };

  const macros: MacroItem[] = [
    {
      label: 'Proteína',
      grams: currentDiet.proteinGrams,
      percentage: getPercentage(proteinCalories),
    },
    {
      label: 'Grasa',
      grams: currentDiet.fatGrams,
      percentage: getPercentage(fatCalories),
    },
    {
      label: 'Carbos',
      grams: currentDiet.carbGrams,
      percentage: getPercentage(carbCalories),
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-400">Dieta</p>
          <h2 className="mt-1 text-xl font-bold text-white">Objetivo diario</h2>
          <p className="mt-1 text-sm text-gray-400">
            Calorías y macros calculados automáticamente según tu peso y
            objetivo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Recalcular
        </button>
      </div>

      {showForm && (
        <DietRecalculateForm
          onSubmit={handleRecalculate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
        <p className="text-sm text-gray-400">Calorías diarias</p>
        <p className="mt-2 text-4xl font-bold text-white">
          {calories.toLocaleString('es-ES')}
          <span className="ml-2 text-base font-medium text-gray-400">kcal</span>
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {macros.map((macro) => (
          <article
            key={macro.label}
            className="rounded-2xl border border-gray-800 bg-gray-950 p-4"
          >
            <p className="text-sm font-medium text-gray-300">{macro.label}</p>

            <p className="mt-2 text-2xl font-bold text-white">
              {macro.grams}
              <span className="ml-1 text-sm font-medium text-gray-400">g</span>
            </p>

            <p className="mt-1 text-sm text-blue-400">
              {macro.percentage}% del total
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
