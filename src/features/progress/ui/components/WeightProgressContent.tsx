import type React from 'react';
import { useMemo, useState } from 'react';

import { EmptyState } from '../../../../shared/components/EmptyState';
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
        <p className="text-sm text-gray-400">Cargando progreso de peso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Peso actual
          </p>
          {latest ? (
            <p className="mt-1 text-2xl font-bold text-white">
              {latest.weight.toFixed(1)}{' '}
              <span className="text-base font-normal text-gray-400">
                kg · {DATE_FORMAT.format(latest.date)}
              </span>
            </p>
          ) : (
            <p className="mt-1 text-base text-gray-400">Sin registros aún</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Registrar peso
        </button>
      </div>

      {showForm && (
        <RegisterWeightForm
          submitting={submitting}
          submitError={submitError}
          onSubmit={addEntry}
          onSuccess={() => setShowForm(false)}
        />
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
        <div className="space-y-6">
          <WeightProgressChart entries={entries} />
          <WeightHistoryTable entries={entries} />
        </div>
      )}
    </section>
  );
};
