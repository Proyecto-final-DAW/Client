import type React from 'react';
import { useMemo, useState } from 'react';

import { EmptyState } from '../../../../shared/components/EmptyState';
import { useProgress } from '../hooks/useProgress';
import { RegisterWeightForm } from './RegisterWeightForm';
import { WeightHistoryTable } from './WeightHistoryTable';
import { WeightProgressChart } from './WeightProgressChart';

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
      <div className="mb-5 flex items-center justify-end">
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
