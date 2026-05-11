import { useAuth } from '@context/hooks/useAuth';
import { EmptyState } from '@shared/components/EmptyState';
import { PixelCorners } from '@shared/components/PixelCorners';
import type React from 'react';
import { useMemo, useState } from 'react';

import { useProgress } from '../hooks/useProgress';
import { RegisterWeightForm } from './RegisterWeightForm';
import { WeightProgressChart } from './WeightProgressChart';

const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const WeightProgressContent = (): React.JSX.Element => {
  const { user } = useAuth();
  const {
    weightHistory,
    loading,
    error,
    submitting,
    submitError,
    refetch,
    addEntry,
  } = useProgress();

  const [showForm, setShowForm] = useState(false);

  const entries = useMemo(
    () =>
      [...(weightHistory ?? [])].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      ),
    [weightHistory]
  );

  const isoDay = (d: Date): string => d.toISOString().slice(0, 10);

  // The current weight is the most recent entry. Surfacing it next to the
  // "Registrar peso" button lets the user decide whether they need to add
  // a new measurement at all.
  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  // When the user has no logged entries yet, surface the onboarding weight
  // as the "starting point" so the panel never feels empty for someone who
  // just finished onboarding.
  //
  // The server stores `weight` as a Postgres DECIMAL, which `pg` returns
  // as a string ("69.0") to avoid float precision loss. The previous
  // `typeof === 'number'` guard rejected that string and silently dropped
  // the onboarding weight from the panel — accept either number or
  // numeric string and coerce.
  const onboardingWeight = ((): number | null => {
    const raw = user?.weight as number | string | null | undefined;
    if (raw === null || raw === undefined || raw === '') return null;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : null;
  })();
  // Account creation date is the "starting point" when no weight has been
  // logged yet — pairs with the onboarding weight to give the user a real
  // anchor instead of the literal word "onboarding".
  const onboardingDate = (() => {
    if (!user?.created_at) return null;
    const parsed = new Date(user.created_at);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  })();

  // Chart-only entries: prepend the onboarding weight as the very first
  // point so the user immediately sees their evolution from day zero,
  // even with a single registered weight afterwards. The synthetic point
  // is suppressed if a real entry already exists on the same day —
  // plotting two markers stacked at the same x looks broken.
  const chartEntries = useMemo(() => {
    if (onboardingWeight === null || onboardingDate === null) return entries;
    const sameDay = entries.some(
      (e) => isoDay(e.date) === isoDay(onboardingDate)
    );
    if (sameDay) return entries;
    return [
      { date: onboardingDate, weight: onboardingWeight },
      ...entries,
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [entries, onboardingWeight, onboardingDate]);

  if (loading) {
    return (
      <section className="relative border-2 border-border bg-card p-5">
        <PixelCorners size="sm" className="border-green-500/30" />
        <p className="font-pixel text-[10px] tracking-widest text-ink-muted">
          CARGANDO PROGRESO…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative border-2 border-red-500/40 bg-card p-5">
        <PixelCorners size="sm" className="border-red-500/40" />
        <p className="font-pixel-mono text-xl leading-snug text-red-300">
          {error}
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 font-pixel text-[9px] tracking-widest bg-red-500 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-red-700 hover:bg-red-400 active:border-b-0 active:mt-[1.0625rem] transition-all"
        >
          ▶ REINTENTAR
        </button>
      </section>
    );
  }

  return (
    <section className="relative border-2 border-green-500/40 bg-card p-5">
      <PixelCorners size="md" className="border-green-500/40" />

      {/* Header: stat row + action button. Stacks at narrow widths so
          the kg/date line stays on a single line — the side-by-side
          layout in /progress put both columns under ~360px each, where
          the previous sm:flex-row crammed weight + date + button into
          one row and forced the date to wrap mid-string. */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="font-pixel text-[9px] tracking-widest text-green-500">
            ◆ {latest ? 'PESO ACTUAL' : 'PESO INICIAL'}
          </p>
          {latest ? (
            <p className="mt-2 font-pixel text-base sm:text-lg text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {latest.weight.toFixed(1)} kg
              <span className="ml-2 font-pixel-mono text-base text-ink-muted">
                · {DATE_FORMAT.format(latest.date)}
              </span>
            </p>
          ) : onboardingWeight !== null ? (
            <p className="mt-2 font-pixel text-base sm:text-lg text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {onboardingWeight.toFixed(1)} kg
              {onboardingDate ? (
                <span className="ml-2 font-pixel-mono text-base text-ink-muted">
                  · {DATE_FORMAT.format(onboardingDate)}
                </span>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 font-pixel text-base text-ink-muted">
              Sin registros aun
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="self-start font-pixel text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-3 py-2 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_12px_rgba(34,197,94,0.3)] whitespace-nowrap"
        >
          {showForm ? '✕ CANCELAR' : '▶ REGISTRAR'}
        </button>
      </div>

      {showForm && (
        <div className="mb-5">
          <RegisterWeightForm
            submitting={submitting}
            submitError={submitError}
            onSubmit={addEntry}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {chartEntries.length === 0 ? (
        <EmptyState
          icon="⚖"
          title="Sin registros de peso"
          description="Empieza a registrar tu peso para ver tu progreso."
          cta={{
            label: 'Registra tu peso',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <div className="space-y-5">
          <WeightProgressChart entries={chartEntries} />
          {entries.length === 0 && (
            // Only the onboarding weight exists — chart shows it as a
            // single anchor point. Nudge the user to log their current
            // weight so the line actually progresses; the table that
            // used to live here was removed because the date list was
            // redundant with the chart's x-axis and the "PESO ACTUAL"
            // header.
            <p className="text-center font-pixel-mono text-base leading-snug text-ink-muted">
              Solo tienes tu punto de partida. Registra tu peso actual para ver
              la evolucion.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
