import type React from 'react';
import { useMemo, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { PixelCorners } from '../../../../shared/components/PixelCorners';
import { useProgress } from '../hooks/useProgress';
import { RegisterWeightForm } from './RegisterWeightForm';
import { WeightHistoryTable } from './WeightHistoryTable';
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

  // The current weight is the most recent entry. Surfacing it next to the
  // "Registrar peso" button lets the user decide whether they need to add
  // a new measurement at all.
  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  // When the user has no logged entries yet, surface the onboarding weight
  // as the "starting point" so the panel never feels empty for someone who
  // just finished onboarding.
  const onboardingWeight =
    typeof user?.weight === 'number' && Number.isFinite(user.weight)
      ? user.weight
      : null;

  if (loading) {
    return (
      <section className="relative border-2 border-[#1e1e2e] bg-[#0d0d14] p-5">
        <PixelCorners size="sm" className="border-green-500/30" />
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-[#a1a1aa]">
          CARGANDO PROGRESO…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative border-2 border-red-500/40 bg-[#0d0d14] p-5">
        <PixelCorners size="sm" className="border-red-500/40" />
        <p className="font-['VT323'] text-xl leading-snug text-red-300">
          {error}
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 font-['Press_Start_2P'] text-[9px] tracking-widest bg-red-500 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-red-700 hover:bg-red-400 active:border-b-0 active:mt-[1.0625rem] transition-all"
        >
          ▶ REINTENTAR
        </button>
      </section>
    );
  }

  return (
    <section className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5">
      <PixelCorners size="md" className="border-green-500/40" />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
            ◆ {latest ? 'PESO ACTUAL' : 'PESO INICIAL'}
          </p>
          {latest ? (
            <p className="mt-2 font-['Press_Start_2P'] text-lg text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]">
              {latest.weight.toFixed(1)}
              <span className="ml-2 font-['Press_Start_2P'] text-base text-[#a1a1aa]">
                kg · {DATE_FORMAT.format(latest.date)}
              </span>
            </p>
          ) : onboardingWeight !== null ? (
            <p className="mt-2 font-['Press_Start_2P'] text-lg text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]">
              {onboardingWeight.toFixed(1)}
              <span className="ml-2 font-['Press_Start_2P'] text-base text-[#a1a1aa]">
                kg · onboarding
              </span>
            </p>
          ) : (
            <p className="mt-2 font-['Press_Start_2P'] text-base text-[#a1a1aa]">
              Sin registros aun
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] self-start"
        >
          {showForm ? '✕ CANCELAR' : '▶ REGISTRAR PESO'}
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

      {entries.length === 0 ? (
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
          <WeightProgressChart entries={entries} />
          <WeightHistoryTable entries={entries} />
        </div>
      )}
    </section>
  );
};
