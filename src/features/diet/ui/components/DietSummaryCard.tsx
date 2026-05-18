import { PixelCorners } from '@shared/components/PixelCorners';
import type React from 'react';
import { Link } from 'react-router-dom';

import type { Diet } from '../../core/domain/models/Diet';
import { buildMacroExamples } from '../macroExamples';
import { MacrosDonut } from './MacrosDonut';

type MacroItem = {
  label: 'PROTEINA' | 'GRASA' | 'CARBOS';
  grams: number;
  percentage: number;
  color: string;
  /** One-sentence "what is this macro for" surfaced as a hover/screen-reader
   * tooltip — beginners see chips of grams without context otherwise. */
  hint: string;
};

type DietSummaryCardProps = {
  diet: Diet | null;
  loading: boolean;
  error: string | null;
  /** Used only by the error retry button — happy path no longer
   *  exposes a recalc control because diet.service auto-syncs on each GET. */
  onRefresh: () => void | Promise<void>;
  /**
   * Optional slot rendered inside the card, below the macro detail
   * row. Used by /diet to inject the "✓ COMPLETAR DIETA" button so the
   * action lives within the same visual frame as the macros.
   */
  footer?: React.ReactNode;
};

/**
 * Macro card with grams, percentage, and three real-world food examples
 * so the user has alternative ways to hit the daily target. The
 * percentage bar that previously sat between the grams and the example
 * is gone — the donut above already communicates the share, the bar
 * was redundant. Examples list takes that vertical space instead.
 */
const MacroCard = ({ macro }: { macro: MacroItem }): React.JSX.Element => {
  // Examples are derived from the live grams figure so the food
  // anchors track the macro target — bumping protein from 150g to
  // 216g now bumps the suggested pechugas/huevos counts proportionally
  // instead of leaving a static "≈ 4 pechugas" caption stale.
  const examples = buildMacroExamples(macro.grams, macro.label);
  return (
    <article
      className="relative border-2 border-border bg-page p-4"
      style={{ borderTopColor: macro.color, borderTopWidth: '4px' }}
      title={macro.hint}
      aria-label={`${macro.label}: ${macro.hint}`}
    >
      <header className="flex items-baseline justify-between gap-2">
        <p
          className="font-pixel text-[9px] tracking-widest"
          style={{ color: macro.color }}
        >
          {macro.label}
        </p>
        <p
          className="font-pixel text-[9px] tracking-widest"
          style={{ color: macro.color }}
        >
          {macro.percentage}%
        </p>
      </header>

      <p className="mt-2 font-pixel text-base text-ink">
        {macro.grams}
        <span className="ml-1 font-pixel text-xs text-ink-faint">g</span>
      </p>

      {/* Hanging indent (`pl-3 -indent-3`) keeps the leading "≈" flush
          left and indents wrapped continuation lines, so a 3-line
          "≈ 4 rebanadas pan integral + 2 platanos + 2 tazas avena"
          reads as one item instead of three orphaned lines. */}
      <ul className="mt-3 flex flex-col gap-2 border-t-2 border-border-muted pt-2.5">
        {examples.map((example) => (
          <li
            key={example}
            className="font-pixel-mono text-base leading-snug text-ink-muted pl-3 -indent-3 break-words"
          >
            {example}
          </li>
        ))}
      </ul>
    </article>
  );
};

export const DietSummaryCard = ({
  diet,
  loading,
  error,
  onRefresh,
  footer,
}: DietSummaryCardProps): React.JSX.Element => {
  if (loading) {
    return (
      <section className="relative border-2 border-border bg-card p-5">
        <PixelCorners size="md" className="border-green-500/30" />
        <p className="font-pixel text-[10px] tracking-widest text-ink-muted">
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
        <section className="relative border-2 border-green-500/40 bg-card p-5">
          <PixelCorners size="md" className="border-green-500/40" />
          <p className="font-pixel text-[10px] tracking-widest text-green-500 mb-3">
            DIETA
          </p>
          <h3 className="font-pixel text-base text-green-400 mb-2 [text-shadow:0_0_12px_rgba(34,197,94,0.4)]">
            CALCULA TUS MACROS
          </h3>
          <p className="font-pixel-mono text-base text-ink-muted mb-5 leading-tight">
            Aun no hemos calculado tu nutricion. Completa tu perfil y apareceran
            aqui tus calorias diarias y macros recomendadas.
          </p>
          <Link
            to="/profile"
            className="inline-block font-pixel text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)]"
          >
            ▶ COMPLETAR PERFIL
          </Link>
        </section>
      );
    }

    return (
      <section className="relative border-2 border-red-500/40 bg-card p-5">
        <PixelCorners size="md" className="border-red-500/40" />
        <p className="font-pixel text-[10px] tracking-widest text-red-400 mb-3">
          ✕ ERROR
        </p>
        <p className="font-pixel-mono text-base text-red-300 mb-4 leading-tight">
          {error}
        </p>
        <button
          type="button"
          onClick={() => void onRefresh()}
          className="font-pixel text-[9px] tracking-widest bg-red-500 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-red-700 hover:bg-red-400 hover:border-red-600 active:border-b-0 active:mt-1 transition-all"
        >
          ▶ REINTENTAR
        </button>
      </section>
    );
  }

  if (!diet) {
    return (
      <section className="relative border-2 border-border bg-card p-5">
        <PixelCorners size="md" className="border-green-500/30" />
        <p className="font-pixel-mono text-base leading-snug text-ink-muted">
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
  // Clamp to ≥0 — when protein and fat are independently rounded up
  // they can sum to >100, which leaves carbs as -1% on extreme low-carb
  // diets (lose-fat goal at very low TDEE). The donut renders fine but
  // the legend chip would show "-1% CARBOS", which reads as a bug to
  // the user. Floor at 0; one percentage-point of rounding error in
  // the donut is invisible, a negative legend value isn't.
  const carbPercentage =
    totalCalories <= 0
      ? 0
      : Math.max(0, 100 - proteinPercentage - fatPercentage);

  const macros: MacroItem[] = [
    {
      label: 'PROTEINA',
      grams: diet.proteinGrams,
      percentage: proteinPercentage,
      color: '#ef4444',
      hint: 'Construye y repara musculo. Carne, pescado, huevos, lacteos, legumbres.',
    },
    {
      label: 'GRASA',
      grams: diet.fatGrams,
      percentage: fatPercentage,
      color: '#eab308',
      hint: 'Energia sostenida y hormonas. Aceite de oliva, frutos secos, aguacate, pescado azul.',
    },
    {
      label: 'CARBOS',
      grams: diet.carbGrams,
      percentage: carbPercentage,
      color: '#22c55e',
      hint: 'Combustible para entrenar. Arroz, pasta, pan, fruta, avena.',
    },
  ];

  return (
    <section className="relative border-2 border-green-500/50 bg-card p-4 sm:p-5 shadow-[0_0_18px_rgba(34,197,94,0.15)]">
      <PixelCorners size="md" className="border-green-500/50" />

      {/* Refresh control intentionally removed: the server recalculates
          macros on every GET via diet.service.getCurrentMacros, so a
          user-facing refetch button was a no-op for the normal flow.
          The page already re-fetches on mount and on auth user change.
          The "DIETA" eyebrow was dropped here too — the page header
          right above the card already says we're in /diet, so a second
          DIETA tag inside felt like a copy-paste. */}
      <header className="mb-4">
        <h2 className="font-pixel text-xs sm:text-sm text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.45)]">
          OBJETIVO DIARIO
        </h2>
      </header>

      {/* Donut + legend block. Side-by-side from tablet (md) onwards
          so the 768-1024px range stops stacking these two heavy
          elements vertically (which left the donut floating alone on
          a wide row, then the legend below alone on another wide row,
          with empty rails on both sides). Centred on phone, fixed
          legend width on md+ so rows don't stretch into long empty
          bars with text at the edges. */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-8">
        <MacrosDonut
          slices={macros.map((m) => ({
            label: m.label,
            percentage: m.percentage,
            color: m.color,
          }))}
          centerValue={diet.dailyCalories.toLocaleString('es-ES')}
          centerLabel="KCAL / DIA"
        />

        <ul className="flex w-full max-w-xs flex-col gap-2.5 lg:max-w-sm">
          {macros.map((macro) => (
            <li
              key={macro.label}
              className="flex items-center gap-3 border-2 border-border bg-page px-3 py-2.5"
              style={{ borderLeftColor: macro.color, borderLeftWidth: '4px' }}
            >
              <div
                className="h-3 w-3 shrink-0"
                style={{
                  backgroundColor: macro.color,
                  boxShadow: `0 0 6px ${macro.color}80`,
                }}
              />
              <span
                className="font-pixel text-[10px] tracking-widest"
                style={{ color: macro.color }}
              >
                {macro.label}
              </span>
              <span className="ml-auto font-pixel text-[10px] tracking-widest text-ink-faint">
                {macro.grams}g · {macro.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detail per-macro cards under the donut. Same data as the legend
          but with a percentage bar and a food example so the user can
          map the gram figure to something tangible. */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {macros.map((macro) => (
          <MacroCard key={macro.label} macro={macro} />
        ))}
      </div>

      {/* Optional action slot — used by /diet to render the daily
          log button inside the card frame instead of orphaned
          underneath. Border-top separates it from the macro detail
          row without making it look like a fourth grid cell. */}
      {footer && (
        <div className="mt-5 pt-5 border-t-2 border-border-muted flex justify-center">
          {footer}
        </div>
      )}
    </section>
  );
};
