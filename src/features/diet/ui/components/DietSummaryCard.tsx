import type React from 'react';
import { Link } from 'react-router-dom';

import type { Diet } from '../../core/domain/models/Diet';

type MacroItem = {
  label: string;
  grams: number;
  percentage: number;
};

type DietSummaryCardProps = {
  diet: Diet | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void | Promise<void>;
};

export const DietSummaryCard = ({
  diet,
  loading,
  refreshing,
  error,
  onRefresh,
}: DietSummaryCardProps): React.JSX.Element => {
  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
        <p className="text-sm text-gray-400">Cargando datos de dieta...</p>
      </section>
    );
  }

  if (error) {
    // The server returns "Diet not available. Complete onboarding first."
    // when any macro input (weight/height/birth_date/sex/activity_level/goals)
    // is missing — even after onboarding flagged the user as completed. Send
    // them to /profile, where they can fill the missing field directly.
    const looksLikeOnboardingError = /onboarding/i.test(error);
    return (
      <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <p className="text-sm text-red-400">{error}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Reintentar
          </button>
          {looksLikeOnboardingError && (
            <Link
              to="/profile"
              className="rounded-xl border border-red-500/60 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/20"
            >
              Ir al perfil
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (!diet) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
        <p className="text-sm text-gray-400">
          No hay datos de dieta disponibles. Completa el onboarding primero.
        </p>
      </section>
    );
  }

  const proteinCalories = diet.proteinGrams * 4;
  const fatCalories = diet.fatGrams * 9;
  const carbCalories = diet.carbGrams * 4;
  const totalCalories = proteinCalories + fatCalories + carbCalories;

  const proteinPercentage =
    totalCalories <= 0
      ? 0
      : Math.round((proteinCalories / totalCalories) * 100);
  const fatPercentage =
    totalCalories <= 0 ? 0 : Math.round((fatCalories / totalCalories) * 100);
  const carbPercentage =
    totalCalories <= 0 ? 0 : 100 - proteinPercentage - fatPercentage;

  const macros: MacroItem[] = [
    {
      label: 'Proteína',
      grams: diet.proteinGrams,
      percentage: proteinPercentage,
    },
    { label: 'Grasa', grams: diet.fatGrams, percentage: fatPercentage },
    { label: 'Carbos', grams: diet.carbGrams, percentage: carbPercentage },
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
          onClick={() => void onRefresh()}
          disabled={refreshing}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {refreshing ? 'Recalculando…' : 'Recalcular'}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
        <p className="text-sm text-gray-400">Calorías diarias</p>
        <p className="mt-2 text-4xl font-bold text-white">
          {diet.dailyCalories.toLocaleString('es-ES')}
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
