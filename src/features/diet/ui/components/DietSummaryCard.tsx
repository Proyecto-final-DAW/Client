import type React from 'react';
import { Link } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Diet } from '../../core/domain/models/Diet';

type MacroItem = {
  label: string;
  grams: number;
  percentage: number;
  color: string;
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
      <section className="relative border-2 border-[#1e1e2e] bg-[#0d0d14] p-5">
        <PixelCorners size="md" className="border-green-500/30" />
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-[#a1a1aa]">
          CARGANDO DIETA…
        </p>
      </section>
    );
  }

  if (error) {
    // The server returns "Diet not available. Complete onboarding first."
    // when any macro input (weight/height/birth_date/sex/activity_level/goals)
    // is missing — even after onboarding flagged the user as completed. Send
    // them to /profile, where they can fill the missing field directly.
    const looksLikeOnboardingError = /onboarding/i.test(error);

    if (looksLikeOnboardingError) {
      return (
        <section className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5">
          <PixelCorners size="md" className="border-green-500/40" />
          <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500 mb-3">
            ◆ DIETA
          </p>
          <h3 className="font-['Press_Start_2P'] text-base text-green-400 mb-2 [text-shadow:0_0_12px_rgba(34,197,94,0.4)]">
            CALCULA TUS MACROS
          </h3>
          <p className="font-['VT323'] text-lg text-[#a1a1aa] mb-5 leading-tight">
            Aún no hemos calculado tu nutrición. Completa tu perfil y aparecerán
            aquí tus calorías diarias y macros recomendadas.
          </p>
          <Link
            to="/profile"
            className="inline-block font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)]"
          >
            ▶ COMPLETAR PERFIL
          </Link>
        </section>
      );
    }

    return (
      <section className="relative border-2 border-red-500/40 bg-[#0d0d14] p-5">
        <PixelCorners size="md" className="border-red-500/40" />
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-red-400 mb-3">
          ✕ ERROR
        </p>
        <p className="font-['VT323'] text-lg text-red-300 mb-4 leading-tight">
          {error}
        </p>
        <button
          type="button"
          onClick={() => void onRefresh()}
          className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-red-500 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-red-700 hover:bg-red-400 hover:border-red-600 active:border-b-0 active:mt-1 transition-all"
        >
          ▶ REINTENTAR
        </button>
      </section>
    );
  }

  if (!diet) {
    return (
      <section className="relative border-2 border-[#1e1e2e] bg-[#0d0d14] p-5">
        <PixelCorners size="md" className="border-green-500/30" />
        <p className="font-['VT323'] text-xl leading-snug text-[#a1a1aa]">
          No hay datos de dieta disponibles.
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
      label: 'PROTEINA',
      grams: diet.proteinGrams,
      percentage: proteinPercentage,
      color: '#ef4444',
    },
    {
      label: 'GRASA',
      grams: diet.fatGrams,
      percentage: fatPercentage,
      color: '#eab308',
    },
    {
      label: 'CARBOS',
      grams: diet.carbGrams,
      percentage: carbPercentage,
      color: '#22c55e',
    },
  ];

  return (
    <section className="relative border-2 border-green-500/50 bg-[#0d0d14] p-5 shadow-[0_0_18px_rgba(34,197,94,0.15)]">
      <PixelCorners size="md" className="border-green-500/50" />

      <header className="mb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
              ◆ DIETA
            </p>
            <h2 className="mt-2 font-['Press_Start_2P'] text-base text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]">
              OBJETIVO DIARIO
            </h2>
          </div>

          <button
            type="button"
            onClick={() => void onRefresh()}
            disabled={refreshing}
            className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:mt-0 whitespace-nowrap self-start"
          >
            {refreshing ? 'RECALCULANDO…' : '↻ RECALCULAR'}
          </button>
        </div>

        {/* description spans the full card width — pinned inside the title
            column it would compete with the recalcular button and wrap into
            an awkward 2-line block ("...peso y / objetivo."). */}
        <p className="mt-3 font-['VT323'] text-xl leading-snug text-[#a1a1aa]">
          Calculado automaticamente desde tu peso y objetivo.
        </p>
      </header>

      <div className="border-2 border-[#1e1e2e] bg-[#0a0a0f] p-5 text-center">
        <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#71717a]">
          CALORIAS DIARIAS
        </p>
        <p className="mt-2 font-['Press_Start_2P'] text-2xl text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.6)]">
          {diet.dailyCalories.toLocaleString('es-ES')}
          <span className="ml-2 font-['Press_Start_2P'] text-base text-[#a1a1aa]">
            kcal
          </span>
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {macros.map((macro) => (
          <article
            key={macro.label}
            className="border-2 border-[#1e1e2e] bg-[#0a0a0f] p-4 text-center"
            style={{ borderTopColor: macro.color, borderTopWidth: '4px' }}
          >
            <p
              className="font-['Press_Start_2P'] text-[10px] tracking-widest"
              style={{ color: macro.color }}
            >
              {macro.label}
            </p>
            <p className="mt-2 font-['Press_Start_2P'] text-base text-[#e4e4e7]">
              {macro.grams}
              <span className="ml-1 font-['Press_Start_2P'] text-sm text-[#71717a]">
                g
              </span>
            </p>
            <p className="mt-1 font-['Press_Start_2P'] text-[10px] tracking-widest text-[#71717a]">
              {macro.percentage}% DEL TOTAL
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
